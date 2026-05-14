"use client"
import axios from 'axios'
import React from 'react'
import { error } from 'three'
import { useState, useEffect, useRef } from 'react'

const page = () => {
  const [user, setUser] = useState({})
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then((res) => {
        // console.log(res);
        // console.log(res.data.avatarUrl);
        console.log(res.data);
        setUser(res.data)
      })
      .catch((err) => {
        console.error(err);
      })
  }, [])

  const MOCK_USERS = [
    { id: "usr_001", name: "Person 1", emoji: "🔥", color: "#f59e0b", status: "Available", statusColor: "#22c55e", lastMsg: "Hey, what's up?", time: "2m" },
    { id: "usr_002", name: "Person 2", emoji: "⚡", color: "#3b82f6", status: "Busy", statusColor: "#ef4444", lastMsg: "Did you see that?", time: "15m" },
    { id: "usr_003", name: "Person 3", emoji: "👑", color: "#8b5cf6", status: "In the zone", statusColor: "#f59e0b", lastMsg: "Let's go 🚀", time: "1h" },
    { id: "usr_004", name: "Person 4", emoji: "💎", color: "#06b6d4", status: "Away", statusColor: "#6b7280", lastMsg: "brb", time: "3h" },
  ];

  // Animated SVG canvas for empty state
  function EmptyStateCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let animId;
      let t = 0;

      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      const nodes = Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.008;

        // Move nodes
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
          if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        });

        // Draw connections
        nodes.forEach((a, i) => {
          nodes.slice(i + 1).forEach((b) => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(245,158,11,${0.12 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          });
        });

        // Draw nodes
        nodes.forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,158,11,0.5)`;
          ctx.fill();
        });

        // Floating chat bubbles
        const bubbles = [
          { x: 0.3, y: 0.25, delay: 0 },
          { x: 0.65, y: 0.45, delay: 1.5 },
          { x: 0.2, y: 0.65, delay: 3 },
          { x: 0.7, y: 0.7, delay: 2 },
        ];

        bubbles.forEach((b) => {
          const bx = b.x * canvas.width;
          const by = b.y * canvas.height + Math.sin(t + b.delay) * 8;
          const alpha = 0.06 + Math.sin(t * 0.7 + b.delay) * 0.03;
          const w = 60, h = 30, r = 10;

          ctx.beginPath();
          ctx.moveTo(bx + r, by);
          ctx.lineTo(bx + w - r, by);
          ctx.quadraticCurveTo(bx + w, by, bx + w, by + r);
          ctx.lineTo(bx + w, by + h - r);
          ctx.quadraticCurveTo(bx + w, by + h, bx + w - r, by + h);
          ctx.lineTo(bx + 14, by + h);
          ctx.lineTo(bx + 8, by + h + 8);
          ctx.lineTo(bx + r + 4, by + h);
          ctx.lineTo(bx + r, by + h);
          ctx.quadraticCurveTo(bx, by + h, bx, by + h - r);
          ctx.lineTo(bx, by + r);
          ctx.quadraticCurveTo(bx, by, bx + r, by);
          ctx.closePath();
          ctx.fillStyle = `rgba(245,158,11,${alpha})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(245,158,11,${alpha * 3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

        animId = requestAnimationFrame(draw);
      };
      draw();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resize);
      };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
  }

  return (
    <>
      <div className="flex w-screen h-screen bg-[#080808] overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className={`
        flex flex-col
        w-[280px] min-w-[280px] h-full
        bg-[#0d0d0d] border-r border-white/[0.06]
        transition-transform duration-300 z-20
        fixed md:relative
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

          {/* Navbar / Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">Admin-Chats</span>
            </div>
            {/* You / profile pill */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-8.5 py-1 cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-[9px]">
              <img src={user.avatarUrl} alt="profile" className=' w-full h-full rounded-4xl' />
              </div>
              <span className="text-white/50 text-[11px] font-medium">{user.userName}</span>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white/70 text-xs placeholder-white/20 outline-none flex-1"
              />
            </div>
          </div>

          {/* Users label */}
          <div className="px-5 pb-2">
            <span className="text-white/25 text-[10px] uppercase tracking-widest font-medium">Conversations</span>
          </div>

          {/* User list */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-1">
            {MOCK_USERS.map((user, i) => (
              <button
                key={user.id}
                onClick={() => { setSelectedUser(user); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer group
                ${selectedUser?.id === user.id
                    ? "bg-amber-400/10 border border-amber-400/20"
                    : "hover:bg-white/[0.04] border border-transparent"
                  }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: user.color + "22", border: `1.5px solid ${user.color}44` }}
                  >
                    {user.emoji}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d0d]"
                    style={{ background: user.statusColor }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${selectedUser?.id === user.id ? "text-amber-400" : "text-white/80"}`}>
                      {user.name}
                    </p>
                    <span className="text-white/25 text-[10px] flex-shrink-0 ml-1">{user.time}</span>
                  </div>
                  <p className="text-white/30 text-xs truncate mt-0.5">{user.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom settings */}
          <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center text-sm">🔥</div>
              <span className="text-white/40 text-xs">My Profile</span>
            </div>
            <button className="text-white/20 hover:text-white/50 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── MAIN AREA ── */}
        <main className="flex-1 flex flex-col h-full relative overflow-hidden">

          {/* Mobile top bar */}
          <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <button onClick={() => setSidebarOpen(true)} className="text-white/40 hover:text-white/70 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-white/60 text-sm">
              {selectedUser ? selectedUser.name : "Admin-Chats"}
            </span>
          </div>

          {/* Empty state */}
          {!selectedUser && (
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
              <EmptyStateCanvas />

              {/* Center content */}
              <div className="relative z-10 flex flex-col items-center text-center px-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 className="text-white/80 text-xl font-semibold tracking-tight mb-2">No chat selected</h2>
                <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                  Pick someone from the left to start a conversation. The arena awaits.
                </p>

                {/* Decorative pills */}
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                  {["End-to-end", "Real-time", "Secure"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/30 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected user chat area */}
          {selectedUser && (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-[#0a0a0a]">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                    style={{ background: selectedUser.color + "22", border: `1.5px solid ${selectedUser.color}44` }}
                  >
                    {selectedUser.emoji}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a]" style={{ background: selectedUser.statusColor }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{selectedUser.name}</p>
                  <p className="text-white/30 text-xs">{selectedUser.status}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-3">
                <div className="flex justify-center">
                  <span className="text-white/20 text-[10px] bg-white/[0.04] px-3 py-1 rounded-full">Today</span>
                </div>
                {/* Sample message from them */}
                <div className="flex items-end gap-2 max-w-[70%]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: selectedUser.color + "22" }}>
                    {selectedUser.emoji}
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <p className="text-white/80 text-sm">{selectedUser.lastMsg}</p>
                    <p className="text-white/20 text-[10px] mt-1">{selectedUser.time} ago</p>
                  </div>
                </div>
                {/* Sample message from you */}
                <div className="flex items-end gap-2 max-w-[70%] self-end flex-row-reverse">
                  <div className="bg-amber-400/20 border border-amber-400/30 rounded-2xl rounded-br-sm px-4 py-2.5">
                    <p className="text-amber-100 text-sm">Hey! 👋</p>
                    <p className="text-amber-400/40 text-[10px] mt-1">Just now</p>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-4 py-4 border-t border-white/[0.06] bg-[#0a0a0a]">
                <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3">
                  <input
                    type="text"
                    placeholder={`Message ${selectedUser.name}...`}
                    className="flex-1 bg-transparent text-white/80 text-sm placeholder-white/20 outline-none"
                  />
                  <button className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-300 flex items-center justify-center transition-colors cursor-pointer active:scale-95 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default page
