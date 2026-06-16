"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";



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
    const pathName = usePathname()
    const router = useRouter()
    let avatarUrl = ""
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileRef = useRef(null);
    console.log(pathName.split("profile/")[1]);



    useEffect(() => {
        let data = JSON.stringify({
            "id": pathName.split("profile/")[1]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/getUserProfile',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                setUser(response.data.user)
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };
    const compressImage = (file) => {
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
            avatarUrl = data.url;
            setForm(prev => ({ ...prev, avatarUrl })); // save cloud URL

            // console.log(form);

            let dataToSend = JSON.stringify({
                ...form,
                avatarUrl: avatarUrl  // ← add it here explicitly
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
                    // console.log(error);
                });



        } finally {
            router.refresh()
            setSaving(false);
        }
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
                            <div className="text-white font-black text-4xl sm:text-5xl uppercase tracking-tight leading-none">
                                {user.displayName}
                            </div>
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


            </div>
        </>
    );
}