"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// ─── Safe status helper ───────────────────────────────────────────────────────
// Some users in your DB may not have a status object yet — this prevents crashes
function getStatus(user) {
  return {
    label: user?.status?.label || "Offline",
    color: user?.status?.color || "#475569",
  };
}


function getInitials(displayName, userName) {
  const name = displayName || userName || "?";
  return name.slice(0, 2).toUpperCase();
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 48 }) {
  const [imgError, setImgError] = useState(false);
  const showImg = user.avatarUrl && !imgError;
  const color = user.avatarColor || "#8b5cf6";

  return (
    <div
      className="relative flex-shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: "14px",
        background: showImg ? "transparent" : `${color}22`,
        border: `1.5px solid ${color}55`,
      }}
    >
      {showImg ? (
        <img
          src={user.avatarUrl}
          alt={user.displayName || user.userName}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          style={{ borderRadius: "12px" }}
        />
      ) : (
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: size * 0.38,
            color: color,
            letterSpacing: "0.05em",
          }}
        >
          {getInitials(user.displayName, user.userName)}
        </span>
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: "14px", boxShadow: `inset 0 0 12px ${color}22` }}
      />
    </div>
  );
}

// ─── Status Dot ───────────────────────────────────────────────────────────────
function StatusDot({ color, label }) {
  const safeColor = color || "#475569";
  const safeLabel = label || "Offline";
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{ width: 7, height: 7, background: safeColor, boxShadow: `0 0 5px ${safeColor}` }}
      />
      <span style={{ color: "#6b7280", fontSize: "10px", letterSpacing: "0.1em", fontFamily: "monospace" }}>
        {safeLabel.toUpperCase()}
      </span>
    </span>
  );
}

// ─── User Card ────────────────────────────────────────────────────────────────
function UserCard({ user, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const color = user.avatarColor || "#8b5cf6";
  const status = getStatus(user);

  return (
    <div
      className="relative cursor-pointer"
      style={{
        animationDelay: `${index * 45}ms`,
        animation: "fadeUp 0.4s ease forwards",
        opacity: 0,
      }}
      onClick={() => onClick(user)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          borderRadius: "16px",
          background: hovered
            ? `linear-gradient(145deg, #0d0d0d, ${color}12)`
            : "linear-gradient(145deg, #0d0d0d, #111)",
          border: `1px solid ${hovered ? color + "55" : "#1c1c1c"}`,
          boxShadow: hovered ? `0 8px 32px ${color}1a, 0 0 0 1px ${color}22` : "none",
          transform: hovered ? "translateY(-3px)" : "none",
          padding: "16px",
        }}
      >
        {/* Diagonal ink stroke bg */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: hovered ? 0.06 : 0.025 }}
          preserveAspectRatio="none"
          viewBox="0 0 200 200"
        >
          <line x1="180" y1="0" x2="20" y2="200" stroke={color} strokeWidth="40" />
        </svg>

        {/* Top row */}
        <div className="flex items-start justify-between mb-3 relative z-10">
          <Avatar user={user} size={48} />
          <div className="flex flex-col items-end gap-1">
            <StatusDot color={status.color} label={status.label} />
            {user.emoji && (
              <span style={{ fontSize: "18px", lineHeight: 1 }}>{user.emoji}</span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="relative z-10 mb-1">
          <div
            className="font-black leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "19px",
              letterSpacing: "0.06em",
              color: hovered ? color : "#e2e8f0",
              transition: "color 0.25s",
              textShadow: hovered ? `0 0 12px ${color}88` : "none",
            }}
          >
            {user.displayName || user.userName}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#374151",
              letterSpacing: "0.08em",
              marginTop: "1px",
            }}
          >
            @{user.userName}
          </div>
        </div>

        {/* Tagline */}
        {user.tagline && (
          <div
            className="relative z-10 mb-3"
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#4b5563",
              letterSpacing: "0.05em",
              lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {user.tagline}
          </div>
        )}

        {/* CTA strip */}
        <div
          className="relative z-10 flex items-center justify-between pt-3"
          style={{
            borderTop: `1px solid ${hovered ? color + "22" : "#1a1a1a"}`,
            transition: "border-color 0.3s",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              color: hovered ? color : "#374151",
              letterSpacing: "0.1em",
              transition: "color 0.25s",
            }}
          >
            {hovered ? "Click to message →" : "···"}
          </span>
          <div
            className="flex items-center justify-center transition-all duration-300"
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: hovered ? `${color}22` : "#111",
              border: `1px solid ${hovered ? color + "66" : "#1c1c1c"}`,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke={hovered ? color : "#374151"}
                strokeWidth="2"
                fill="none"
                style={{ transition: "stroke 0.25s" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ user, onClose, onChat }) {
  const color = user.avatarColor || "#8b5cf6";
  const status = getStatus(user);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden"
        style={{
          borderRadius: "20px",
          background: "linear-gradient(145deg, #0a0a0a, #0f0f0f)",
          border: `1px solid ${color}44`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${color}22`,
          animation: "modalIn 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top color bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 40%, ${color} 60%, transparent 100%)`,
          }}
        />

        {/* Diagonal bg accent */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-5"
          preserveAspectRatio="none"
          viewBox="0 0 400 500"
        >
          <line x1="350" y1="0" x2="50" y2="500" stroke={color} strokeWidth="80" />
        </svg>

        <div className="relative p-7">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{
              background: "#1a1a1a",
              color: "#6b7280",
              fontSize: "14px",
              border: "1px solid #222",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <Avatar user={user} size={72} />
            <div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "28px",
                  letterSpacing: "0.06em",
                  color: color,
                  textShadow: `0 0 16px ${color}66`,
                  lineHeight: 1.1,
                }}
              >
                {user.displayName || user.userName}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#4b5563", marginTop: 2 }}>
                @{user.userName}
              </div>
              <div className="mt-2">
                <StatusDot color={status.color} label={status.label} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mb-4"
            style={{ height: 1, background: `linear-gradient(90deg, ${color}33, transparent)` }}
          />

          {/* Tagline */}
          {(user.tagline || user.emoji) && (
            <div className="mb-3 flex items-start gap-2">
              {user.emoji && <span style={{ fontSize: "16px", flexShrink: 0 }}>{user.emoji}</span>}
              {user.tagline && (
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                    lineHeight: 1.6,
                  }}
                >
                  {user.tagline}
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div
              className="mb-5 p-3 rounded-xl"
              style={{ background: "#111", border: "1px solid #1c1c1c" }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#374151",
                  letterSpacing: "0.15em",
                  marginBottom: 4,
                }}
              >
                BIO
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "#9ca3af",
                  lineHeight: 1.6,
                }}
              >
                {user.bio}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onChat(user)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all duration-200 hover:brightness-110"
              style={{
                background: color,
                color: "#000",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "15px",
                letterSpacing: "0.15em",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 20px ${color}44`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="#000"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
              MESSAGE
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl transition-colors"
              style={{
                background: "transparent",
                color: "#4b5563",
                fontFamily: "monospace",
                fontSize: "10px",
                border: "1px solid #1c1c1c",
                cursor: "pointer",
                letterSpacing: "0.15em",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ink BG ───────────────────────────────────────────────────────────────────
function InkBG() {
  const chars = ["話", "友", "声", "絆", "心", "夢"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {chars.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${5 + i * 16}%`,
            top: `${5 + (i % 3) * 30}%`,
            fontSize: `${80 + i * 20}px`,
            color: "rgba(255,255,255,0.016)",
            fontFamily: "serif",
            transform: `rotate(${-15 + i * 8}deg)`,
            animation: `drift ${7 + i * 1.5}s ease-in-out ${i * 0.5}s infinite alternate`,
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ index }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        background: "#0d0d0d",
        border: "1px solid #1c1c1c",
        padding: "16px",
        height: 180,
        animation: `pulse 1.8s ease-in-out ${index * 0.1}s infinite alternate`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "#1a1a1a" }} />
        <div style={{ width: 60, height: 10, borderRadius: 4, background: "#1a1a1a", marginTop: 4 }} />
      </div>
      <div style={{ width: "70%", height: 14, borderRadius: 4, background: "#1a1a1a", marginBottom: 6 }} />
      <div style={{ width: "50%", height: 10, borderRadius: 4, background: "#1a1a1a", marginBottom: 12 }} />
      <div style={{ width: "85%", height: 8, borderRadius: 4, background: "#161616" }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const router = useRouter()
  const [myUsers, setMyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .request({
        method: "get",
        maxBodyLength: Infinity,
        url: "api/users/getAllUsersForExplore",
        headers: {},
      })
      .then((response) => {
        setMyUsers(response.data.users || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filtered = myUsers.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      (u.displayName || "").toLowerCase().includes(q) ||
      (u.userName || "").toLowerCase().includes(q) ||
      (u.bio || "").toLowerCase().includes(q) ||
      (u.tagline || "").toLowerCase().includes(q);
    return matchSearch;
  });

  const onlineCount = myUsers.filter((u) => getStatus(u).label === "Available").length;

  const handleChat = (user) => {
    // TODO: replace with your router — e.g. router.push(`/chat/${user._id}`)
    router.push(`/chat/${user._id}`)
    // console.log("Open chat with:", user._id);

  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes drift {
          from { transform: translateY(0)    rotate(-10deg); }
          to   { transform: translateY(-18px) rotate(8deg);  }
        }
        @keyframes pulse {
          from { opacity: 0.3; }
          to   { opacity: 0.55; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }
        .explore-search { outline: none; background: transparent; width: 100%; border: none; }
        .explore-search::placeholder { color: #2d2d2d; }
      `}</style>

      <div
        className="min-h-screen"
        style={{ background: "#060606", fontFamily: "'JetBrains Mono', monospace" }}
      >

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#060608]/95 backdrop-blur-md border-b border-white/[0.05]">
          <div onClick={() => {
            router.push("/logIn")
          }} className=" cursor-pointer flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Admin-Chats</span>
          </div>
        </nav>
        <InkBG />

        {/* Scanlines */}
        <div
          className="fixed inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)",
          }}
        />

        {/* Corner brackets */}
        <svg className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-20 opacity-30" viewBox="0 0 128 128">
          <polyline points="0,32 0,0 32,0" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-20 opacity-30" viewBox="0 0 128 128">
          <polyline points="128,32 128,0 96,0" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="fixed bottom-0 left-0 w-32 h-32 pointer-events-none z-20 opacity-20" viewBox="0 0 128 128">
          <polyline points="0,96 0,128 32,128" stroke="#f59e0b" strokeWidth="1" fill="none" />
        </svg>
        <svg className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-20 opacity-20" viewBox="0 0 128 128">
          <polyline points="128,96 128,128 96,128" stroke="#f59e0b" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative z-20 max-w-6xl mx-auto px-5 pt-10 pb-16">

          {/* ── Header ── */}
          <div className="mb-9">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px" style={{ background: "#f59e0b" }} />
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: "9px",
                  letterSpacing: "0.4em",
                  fontFamily: "monospace",
                }}
              >
                PEOPLE DIRECTORY
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "linear-gradient(90deg, #f59e0b44, transparent)" }}
              />
              <span
                style={{
                  color: "#2d2d2d",
                  fontSize: "9px",
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                }}
              >
                {onlineCount} ONLINE
              </span>
            </div>

            <h1
              className="leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(44px, 7vw, 76px)",
                color: "#f0f0f0",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              EXPLORE
              <span style={{ color: "#f59e0b", marginLeft: "0.15em" }}>PEOPLE</span>
            </h1>
            <p
              style={{
                color: "#3a3a3a",
                fontSize: "11px",
                letterSpacing: "0.18em",
                marginTop: "6px",
              }}
            >
              {loading ? "LOADING..." : `${myUsers.length} USERS REGISTERED`}
            </p>
          </div>

          {/* ── Search + Filter ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <div
              className="relative flex items-center flex-1 px-4 gap-3"
              style={{
                borderRadius: "10px",
                border: "1px solid #1c1c1c",
                background: "#0a0a0a",
                height: 44,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" stroke="#2d2d2d" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="#2d2d2d" strokeWidth="2" />
              </svg>
              <input
                className="explore-search"
                style={{ color: "#d1d5db", fontSize: "12px", letterSpacing: "0.08em" }}
                placeholder="Search by name, username, bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    color: "#374151",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>


          </div>

          {/* ── Results count ── */}
          <div
            className="flex items-center gap-2 mb-5"
            style={{ color: "#2d2d2d", fontSize: "10px", letterSpacing: "0.2em" }}
          >
            <span style={{ color: "#f59e0b" }}>{loading ? "—" : filtered.length}</span>
            <span>USERS FOUND</span>
            <div className="flex-1 h-px ml-1" style={{ background: "#111" }} />
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}
            >
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}
            >
              {filtered.map((user, i) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onClick={setSelectedUser}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28">
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "38px",
                  color: "#1a1a1a",
                  letterSpacing: "0.2em",
                }}
              >
                NO USERS FOUND
              </div>
              <div
                style={{
                  color: "#252525",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  marginTop: 6,
                }}
              >
                TRY A DIFFERENT SEARCH
              </div>
            </div>
          )}
        </div>

        {/* ── Profile Modal ── */}
        {selectedUser && (
          <ProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onChat={handleChat}
          />
        )}
      </div>
    </>
  );
}