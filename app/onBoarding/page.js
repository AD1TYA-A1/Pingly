"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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

const EMOJIS = ["🔥", "⚡", "💀", "🚀", "👑", "🎯", "💎", "🌙", "⚔️", "🦅"];


export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    status: STATUSES[0],
    avatarColor: AVATAR_COLORS[0],
    emoji: "🔥",
    tagline: "",
  });
  const [avatar, setAvatar] = useState("")
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [isloading, setIsloading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      o: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.12 + 0.02,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setAvatar(file)
    const url = URL.createObjectURL(file);
    setPreview(url);


  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const totalSteps = 3;

  async function submit() {
    setIsloading(true)
    try {
      // console.log(form);
      // console.log(preview);

      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append('image', avatar);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      setForm(prev => ({ ...prev, avatarUrl: data.url })); // save cloud URL

      console.log(form);

    } catch (error) {
      console.error('Upload failed:', err);
    }
    finally {
      setIsloading(false);  // stop loading whether success or fail
    }


  }

  return (
    <>
      <div>

        <div>


          <div className=" bg-black min-h-screen flex items-center justify-center overflow-x-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            <div className="absolute w-80 h-80 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />

            <div className=" mt-10 relative z-10 w-full max-w-[420px] mx-4">

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-15 h-10 rounded-xl bg-amber-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="text-white font-bold text-4xl mb-2 tracking-tight   ">Set up your profile</div>
                <p className="text-white/40 text-sm mt-1">Let the arena know who you are</p>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-amber-400" : "bg-white/10"}`} />
                ))}
              </div>

              {/* Card */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6">

                {/* STEP 1 — Avatar */}
                {step === 1 && (
                  <div className="flex flex-col gap-5">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Step 1 — Your look</p>

                    {/* Drop zone */}
                    <div
                      onClick={() => fileRef.current.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      className={`relative flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
              ${dragging ? "border-amber-400/80 bg-amber-400/5" : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"}`}
                    >
                      {preview ? (
                        <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-amber-400/50" />
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2" style={{ background: form.avatarColor + "33" }}>
                            {form.emoji}
                          </div>
                          <p className="text-white/30 text-xs">Drop image or click to upload</p>
                        </>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                    </div>

                    {/* Avatar color */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Avatar color</label>
                      <div className="flex gap-2 flex-wrap">
                        {AVATAR_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setForm({ ...form, avatarColor: c })}
                            className="w-7 h-7 rounded-full transition-all duration-150 cursor-pointer"
                            style={{
                              background: c,
                              outline: form.avatarColor === c ? `2px solid ${c}` : "none",
                              outlineOffset: "2px",
                              opacity: form.avatarColor === c ? 1 : 0.5,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Emoji */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Signature emoji</label>
                      <div className="flex gap-2 flex-wrap">
                        {EMOJIS.map((e) => (
                          <button
                            key={e}
                            onClick={() => setForm({ ...form, emoji: e })}
                            className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-all duration-150
                    ${form.emoji === e ? "bg-amber-400/20 border border-amber-400/50" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 — Identity */}
                {step === 2 && (
                  <div className="flex flex-col gap-5">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Step 2 — Your identity</p>

                    {/* Display name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Display name</label>
                      <input
                        type="text"
                        placeholder="How you appear in chat"
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        className="bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-all duration-200"
                      />
                    </div>

                    {/* Tagline */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Tagline</label>
                      <input
                        type="text"
                        placeholder="e.g. Here to conquer 👑"
                        value={form.tagline}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        className="bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-all duration-200"
                      />
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Bio</label>
                      <textarea
                        placeholder="Say something about yourself..."
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={3}
                        className="bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3 — Status + Preview */}
                {step === 3 && (
                  <div className="flex flex-col gap-5">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Step 3 — Your status</p>

                    {/* Status picker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Current status</label>
                      <div className="flex flex-col gap-2">
                        {STATUSES.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => setForm({ ...form, status: s })}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 text-left
                    ${form.status.label === s.label ? "border-amber-400/40 bg-amber-400/5" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                          >
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                            <span className="text-white/80 text-sm font-medium">{s.label}</span>
                            {form.status.label === s.label && <span className="ml-auto text-amber-400 text-xs">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview card */}
                    <div className="flex flex-col gap-2">
                      <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Preview</label>
                      <div className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-2xl p-4">
                        <div className="relative flex-shrink-0">
                          {preview ? (
                            <img src={preview} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: form.avatarColor + "33", border: `1.5px solid ${form.avatarColor}55` }}>
                              {form.emoji}
                            </div>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black" style={{ background: form.status.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-white text-sm font-semibold truncate">{form.displayName || "Your name"}</p>
                            <span className="text-base leading-none">{form.emoji}</span>
                          </div>
                          <p className="text-white/40 text-xs truncate">{form.tagline || "Your tagline"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {isloading ? (
                    <button
                      onClick={() => {
                        if (step < totalSteps) setStep(step + 1); else {
                          // router.push("/chat"); 
                          submit()
                          // console.log(form);

                        }
                      }}
                      disabled
                      className=" flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-amber-400/20"
                    >
                      {step === totalSteps ? "Loading..." : "Continue"}
                    </button>
                  ) : (
                    <button
                      onClick={
                        () => {
                          if (step < totalSteps) setStep(step + 1); else {
                            // router.push("/chat"); 
                            submit()
                            // console.log(form);

                          }
                        }}
                      className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-amber-400/20"
                    >
                      {step === totalSteps ? "Enter the chat →" : "Continue"}
                    </button>)}

                </div>
              </div>

              <p className="text-center text-white/20 text-xs mt-10 mb-20">You can change all of this later in your profile</p>
            </div>
          </div>
        </div>
      </div >

    </>

  );
}