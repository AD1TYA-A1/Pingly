"use client";
import React, { useState } from "react";
import "./components/Particles.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = () => {
    setLoading(true);
    setTimeout(() => router.push("/logIn"), 1000);
  };

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-4">

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(250,204,21,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,204,21,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250,204,21,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Version badge */}
      <span className="mb-7 text-[11px] tracking-widest text-amber-400 border border-amber-400/25 px-4 py-1 rounded-full font-mono">
        v1.0 · REAL-TIME MESSAGING
      </span>

      {/* Title */}
      <h1
        className="text-white font-bold text-center leading-none"
        style={{ fontSize: "clamp(52px, 10vw, 88px)", letterSpacing: "-0.03em" }}
      >
        Admin<span className="text-amber-400">-</span>Chats
      </h1>

      {/* Subtitle with blinking cursor */}
      <p className="mt-4 mb-9 font-mono text-[13px] text-white/35 tracking-widest flex items-center gap-1">
        conqueror of the chats
        <span className="inline-block w-2 h-[14px] bg-amber-400 ml-1 animate-pulse" />
      </p>

      {/* CTA or loader */}
      {!loading ? (
        <button
          onClick={handleEnroll}
          className="flex items-center gap-2 bg-amber-400 hover:bg-yellow-300 text-black font-bold text-[15px] px-8 py-[14px] rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(250,204,21,0.28)] active:translate-y-0"
        >
          Enroll
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div className="three-body">
          <div className="three-body__dot" />
          <div className="three-body__dot" />
          <div className="three-body__dot" />
        </div>
      )}

      {/* Stats row */}
      <div className="flex gap-7 mt-11 pt-6 border-t border-white/[0.06]">
        {[
          { num: "∞", label: "MESSAGES" },
          { num: "0ms", label: "LATENCY" },
          { num: "100%", label: "DARK MODE" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.label}>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-[20px]">{s.num}</div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest mt-0.5">
                {s.label}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className="w-px bg-white/[0.08] self-stretch" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Page;