"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { log } from "three/src/nodes/TSL.js";

const MOCK_USER = {
  _id: "69d9ae99809ad9c6825c1c33",
  email: "a.d.i.t.y.a.654a@gmail.com",
  userName: "luffy",
  avatarUrl: "https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg",
  avatarColor: "#8b5cf6",
  bio: "My BIO",
  emoji: "😎",
  tagline: "MyTagLine",
  status: { label: "Available", color: "#22c55e" },
};

const STATUSES = [
  { label: "Available", color: "#22c55e" },
  { label: "Busy", color: "#ef4444" },
  { label: "In the zone", color: "#f59e0b" },
  { label: "Away", color: "#6b7280" },
];

const AVATAR_COLORS = [
  "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
  "#10b981", "#f97316", "#ec4899", "#3b82f6",
];

const EMOJIS = ["🔥", "⚡", "💀", "🚀", "👑", "🎯", "💎", "🌙", "⚔️", "🦅", "😎", "🐉"];

function Avatar({ user, size = "lg", preview }) {
  const sz = size === "lg" ? "w-28 h-28 text-5xl" : "w-10 h-10 text-lg";
  const src = preview || user?.avatarUrl;
  if (src) return <img src={src} alt="avatar" className={`${sz} rounded-full object-cover`} />;
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold`}
      style={{ background: (user?.avatarColor || "#8b5cf6") + "33", border: `2px solid ${user?.avatarColor || "#8b5cf6"}66` }}>
      {user?.emoji || "👤"}
    </div>
  );
}

export default function Profile() {
  const avatarChanged = useRef(false)
  const router = useRouter()
  let avatarUrl = ""
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    // Replace with: axios.get('/api/auth/me').then(res => { setUser(res.data); setForm(res.data); });
    axios.get('/api/auth/me')
      .then((res) => {
        // console.log(res);
        // console.log(res.data.avatarUrl);
        // console.log(res.data);
        setUser(res.data)
        setForm(res.data)
        console.log(res.data);

      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const compressImage = (file) => {
    if (!file) {
      return -1
    }
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        canvas.getContext('2d').drawImage(img, 0, 0, 400, 400);
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7);
      };
    });
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      let finalAvatarURL = form.avatarUrl
      if (avatarFile) {
        // Upload to Cloudinary via API route
        const formData = new FormData();
        // ✅ Fix — compress first then send
        const compressed = await compressImage(avatarFile);
        formData.append('image', compressed, 'avatar.jpg');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        // console.log(data);
        // console.log(data.url);

        finalAvatarURL = data.url;
        setForm(prev => ({ ...prev, finalAvatarURL })); // save cloud URL
        // console.log(form);
      }



      let dataToSend = JSON.stringify({
        ...form,
        avatarUrl: finalAvatarURL  // ← add it here explicitly
      })
      // console.log(form);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/users/profile',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dataToSend
      };

      axios.request(config)
        .then((response) => {
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });



    } finally {
      setSaving(false);
    }
    location.reload()
  };

  if (!user) return (
    <div className="w-screen h-screen bg-[#060608] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = (user.userName || "?")[0].toUpperCase();

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.3); border-radius: 99px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.6); }
        .custom-scroll { scrollbar-width: thin; scrollbar-color: rgba(245,158,11,0.3) transparent; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[#060608] text-white">

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
          <div className="z-30 flex items-center justify-between px-6 py-3.5 bg-[#060608]/95 backdrop-blur-md border-b border-white/[0.05] gap-10">

            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-400/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit profile
            </button>
            <button onClick={async () => {

              await fetch("/api/auth/logOut", {
                method: "POST",
                credentials: "include"
              });

              router.push("/logIn");
            }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-400/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Door */}
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                {/* Arrow */}
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>              Log Out
            </button>
          </div>

        </nav>

        {/* ── Profile body ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16 fade-up">

          {/* Cover */}
          <div className="h-36 sm:h-44 rounded-2xl overflow-hidden relative mb-0"
            style={{ background: `linear-gradient(135deg, ${user.avatarColor}28 0%, ${user.avatarColor}08 60%, transparent 100%)` }}>
            <div className="absolute inset-0"
              style={{ backgroundImage: `radial-gradient(ellipse at 15% 50%, ${user.avatarColor}20 0%, transparent 55%), radial-gradient(ellipse at 85% 30%, ${user.avatarColor}14 0%, transparent 55%)` }} />
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: `repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)` }} />
          </div>

          {/* Avatar + stats row */}
          <div className="flex items-end justify-between -mt-14 sm:-mt-16 px-2 mb-5">
            <div className="relative group">
              <div className="ring-4 ring-[#060608] rounded-full shadow-2xl">
                <Avatar user={user} size="lg" />
              </div>
              {/* Status dot */}
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-[#060608]"
                style={{ background: user.status?.color || "#22c55e", boxShadow: `0 0 10px ${user.status?.color}aa` }} />
            </div>

            {/* Stats */}
            <div className="flex gap-6 pb-3">
              {[{ label: "Messages", val: "1.2k" }, { label: "Friends", val: "48" }, { label: "Days", val: "12" }].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-white font-bold text-lg leading-none">{s.val}</p>
                  <p className="text-white/25 text-[10px] mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Name block */}
          <div className="px-1 mb-4">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-white font-black text-4xl sm:text-5xl uppercase tracking-tight leading-none">
                {user.displayName}
              </h1>
              <span className="text-3xl">{user.emoji}</span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: (user.status?.color || "#22c55e") + "22", color: user.status?.color || "#22c55e", border: `1px solid ${user.status?.color}44` }}>
                {user.status?.label}
              </span>
            </div>
            <p className="text-white/30 text-sm font-medium">@{user.userName}</p>
          </div>

          {/* Tagline */}
          {user.tagline && (
            <p className="px-1 text-amber-400/75 text-sm italic mb-3 font-medium">"{user.tagline}"</p>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="px-1 text-white/50 text-sm leading-relaxed mb-5 max-w-md">{user.bio}</p>
          )}

          {/* Pills */}
          <div className="flex flex-wrap gap-2 px-1 mb-8">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-white/35 text-[11px]">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: user.avatarColor, boxShadow: `0 0 6px ${user.avatarColor}` }} />
              <span className="text-white/35 text-[11px]">Theme</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Activity grid */}
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-semibold mb-3 px-1">Activity</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { icon: "💬", label: "Chats" },
              { icon: "🔥", label: "Streak" },
              { icon: "⚡", label: "Fast" },
              { icon: "👑", label: "Top" },
              { icon: "💎", label: "Rare" },
              { icon: "🚀", label: "Active" },
            ].map((item, i) => (
              <div key={i}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-default"
                style={{ background: `${user.avatarColor}0${["a", "8", "7", "6", "5", "4"][i]}` }}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white/30 text-[9px] uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Edit Modal ── */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => { setEditing(false); setAvatarPreview(null); }} />

            <div className="relative z-10 w-full sm:max-w-[440px] bg-[#0e0e10] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[92vh] shadow-2xl">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] flex-shrink-0">
                <div>
                  <h2 className="text-white font-bold text-lg">Edit Profile</h2>
                  <p className="text-white/30 text-xs mt-0.5">Changes save to your account</p>
                </div>
                <button onClick={() => { setEditing(false); setAvatarPreview(null); }}
                  className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto custom-scroll flex-1 px-6 py-5">
                <div className="flex flex-col gap-5">

                  {/* Avatar upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="ring-2 ring-white/10 rounded-full">
                        <Avatar user={form} size="lg" preview={avatarPreview} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => fileRef.current.click()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold hover:bg-amber-400/20 transition-all cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload photo
                        </button>
                        {avatarPreview && (
                          <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                            className="text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer text-left">
                            Remove
                          </button>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">@</span>
                      <input type="text"
                        value={form.userName || ""}
                        onChange={e => setForm({ ...form, userName: e.target.value })}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-colors" />
                    </div>
                  </div>

                  {/* Display name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Display Name</label>
                    <input type="text"
                      value={form.displayName || ""}
                      onChange={e => setForm({ ...form, displayName: e.target.value })}
                      className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-colors" />
                  </div>

                  {/* Tagline */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Tagline</label>
                    <input type="text"
                      value={form.tagline || ""}
                      onChange={e => setForm({ ...form, tagline: e.target.value })}
                      placeholder="e.g. Here to conquer 👑"
                      className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-colors" />
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Bio</label>
                    <textarea
                      value={form.bio || ""}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      placeholder="Tell the world..."
                      className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-colors resize-none custom-scroll" />
                  </div>

                  {/* Emoji */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Signature Emoji</label>
                    <div className="flex gap-2 flex-wrap">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-all
                            ${form.emoji === e ? "bg-amber-400/20 border border-amber-400/50 scale-110" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar color */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Theme Color</label>
                    <div className="flex gap-2.5 flex-wrap">
                      {AVATAR_COLORS.map(c => (
                        <button key={c} onClick={() => setForm({ ...form, avatarColor: c })}
                          className="w-8 h-8 rounded-full cursor-pointer transition-all"
                          style={{
                            background: c,
                            outline: form.avatarColor === c ? `2.5px solid ${c}` : "none",
                            outlineOffset: "3px",
                            opacity: form.avatarColor === c ? 1 : 0.4,
                            transform: form.avatarColor === c ? "scale(1.15)" : "scale(1)",
                          }} />
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUSES.map(s => (
                        <button key={s.label} onClick={() => setForm({ ...form, status: s })}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border cursor-pointer transition-all text-left
                            ${form.status?.label === s.label ? "border-amber-400/40 bg-amber-400/5" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: s.color, boxShadow: form.status?.label === s.label ? `0 0 6px ${s.color}` : "none" }} />
                          <span className="text-white/70 text-xs font-medium">{s.label}</span>
                          {form.status?.label === s.label && <span className="ml-auto text-amber-400 text-[10px]">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 pb-6 pt-4 border-t border-white/[0.06] flex-shrink-0">
                <button onClick={handleSave} disabled={saving}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-bold text-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20">
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Saving...</>
                  ) : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}