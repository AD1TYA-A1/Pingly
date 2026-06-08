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

// Left sidebar skeleton
function SidebarSkeleton() {
    return (
        <div
            style={{
                width: 280,
                minHeight: "100vh",
                background: "#0d0d0d",
                borderRight: "1px solid #1f1f1f",
                display: "flex",
                flexDirection: "column",
                padding: "16px 0",
                flexShrink: 0,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px 16px",
                    borderBottom: "1px solid #1a1a1a",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <SkeletonBlock width={36} height={36} extraClass="sk-circle" />
                    <SkeletonBlock width={90} height={14} />
                </div>
                <SkeletonBlock width={36} height={36} extraClass="sk-circle" />
            </div>

            {/* Search */}
            <div style={{ padding: "16px 16px 8px" }}>
                <SkeletonBlock width="100%" height={38} extraClass="sk-pill" />
            </div>

            {/* Section label */}
            <div style={{ padding: "12px 16px 8px" }}>
                <SkeletonBlock width={100} height={10} />
            </div>

            {/* Conversation items */}
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 16px",
                        margin: "2px 8px",
                        borderRadius: 10,
                        background: i === 1 ? "#1a1700" : "transparent",
                    }}
                >
                    <SkeletonBlock width={42} height={42} extraClass="sk-circle" />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <SkeletonBlock width="70%" height={12} />
                        <SkeletonBlock width="50%" height={10} />
                    </div>
                </div>
            ))}

            {/* Bottom bar */}
            <div
                style={{
                    marginTop: "auto",
                    padding: "16px",
                    borderTop: "1px solid #1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <SkeletonBlock width={70} height={38} extraClass="sk-pill" />
                <SkeletonBlock width={100} height={38} extraClass="sk-pill" />
            </div>
        </div>
    );
}
// Main export
export default function UsersLoadingSkeleton() {
    return (
        <>
            <style>{shimmer}</style>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100vh",
                    background: "#0d0d0d",
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                }}
            >
                <SidebarSkeleton />
            </div>
        </>
    );
}