// ChatSkeleton.jsx
// Drop-in skeleton loader matching your dark/gold chat app aesthetic

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .sk {
    background: linear-gradient(
      90deg,
      #1a1a1a 25%,
      #2a2a2a 50%,
      #1a1a1a 75%
    );
    background-size: 600px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 6px;
  }
  .sk-pill {
    border-radius: 999px;
  }
  .sk-circle {
    border-radius: 50%;
  }
`;

function SkeletonBlock({ width = "100%", height = 14, extraClass = "", style = {} }) {
  return (
    <div
      className={`sk ${extraClass}`}
      style={{ width, height, flexShrink: 0, ...style }}
    />
  );
}



// Chat header skeleton
function ChatHeaderSkeleton() {
  return (
    <div
      style={{
        height: 64,
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#0d0d0d",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SkeletonBlock width={38} height={38} extraClass="sk-circle" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonBlock width={110} height={13} />
          <SkeletonBlock width={60} height={10} />
        </div>
      </div>
      <SkeletonBlock width={32} height={32} extraClass="sk-circle" />
    </div>
  );
}

// Message bubble skeletons
function MessagesSkeleton() {
  const messages = [
    { side: "left", w1: "55%", w2: "40%" },
    { side: "left", w1: "70%" },
    { side: "right", w1: "45%" },
    { side: "left", w1: "60%", w2: "30%" },
    { side: "right", w1: "50%", w2: "65%" },
    { side: "left", w1: "35%" },
    { side: "right", w1: "70%" },
  ];

  return (
    <div
      style={{
        flex: 1,
        overflowY: "hidden",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Load more hint */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <SkeletonBlock width={160} height={28} extraClass="sk-pill" />
      </div>

      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.side === "right" ? "flex-end" : "flex-start",
            gap: 6,
          }}
        >
          {msg.side === "left" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SkeletonBlock width={22} height={22} extraClass="sk-circle" />
            </div>
          )}
          {[msg.w1, msg.w2].filter(Boolean).map((w, j) => (
            <SkeletonBlock
              key={j}
              width={w}
              height={36}
              style={{
                borderRadius: 10,
                maxWidth: 360,
                background: msg.side === "right"
                  ? "linear-gradient(90deg, #2a2100 25%, #3a2e00 50%, #2a2100 75%)"
                  : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Input bar skeleton
// function InputSkeleton() {
//   return (
//     <div
//       style={{
//         padding: "12px 16px",
//         borderTop: "1px solid #1a1a1a",
//         background: "#0d0d0d",
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//       }}
//     >
//       <SkeletonBlock width="100%" height={44} extraClass="sk-pill" />
//       <SkeletonBlock width={44} height={44} extraClass="sk-circle" />
//     </div>
//   );
// }

// Main export
export default function ChatLoadingSkeleton() {
  return (
    <>
      {/* <style>{shimmer}</style>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          background: "#0d0d0d",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      > */}
      {/* <SidebarSkeleton /> */}

      <ChatHeaderSkeleton />
      <MessagesSkeleton />
      {/* <InputSkeleton /> */}
    </>
  );
}