"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  {
    icon: "💬",
    title: "Conversational flow",
    desc: "Natural back-and-forth chat that feels human",
    status: "Building",
    color: "green",
  },
  {
    icon: "🔓",
    title: "Open-ended topics",
    desc: "Ask anything — no structured formats required",
    status: "Building",
    color: "green",
  },
  {
    icon: "🧭",
    title: "Exploratory mode",
    desc: "Wander ideas freely with no agenda",
    status: "Soon",
    color: "blue",
  },
];

export default function CasualModeComingSoon() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(45), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8 font-sans">
      {/* Custom keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        .shimmer-bar {
          background: linear-gradient(90deg, #1d4ed8, #06b6d4, #1d4ed8);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
        .pulse-dot {
          animation: pulseDot 1.4s ease-in-out infinite;
        }
        .progress-fill {
          background: linear-gradient(90deg, #1d4ed8, #06b6d4);
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Card */}
      <div className="relative w-full/50 max-w-[540px] bg-[#111111] border border-[#1e3a5f] rounded-2xl px-8 py-10 text-center overflow-hidden">

        {/* Shimmer top border */}
        <div className="shimmer-bar absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" />

        {/* Bot Icon */}
        <div className="w-[72px] h-[72px] bg-[#0d1f38] border-[1.5px] border-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="8" width="18" height="12" rx="3" />
            <circle cx="9" cy="14" r="1.5" />
            <circle cx="15" cy="14" r="1.5" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            <line x1="12" y1="3" x2="12" y2="4.5" />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#0d1f38] border border-blue-700 text-blue-400 text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1 rounded-full mb-5">
          <span className="pulse-dot w-1.5 h-1.5 bg-blue-400 rounded-full" />
          In development
        </div>

        {/* Heading */}
        <h2 className="text-slate-100 text-[22px] font-semibold mb-2">
          Casual Mode is being built
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Chit-Chat — the friendly bot — is getting some love. It&apos;ll be
          ready soon, packed with a conversational, open-ended, exploratory
          experience.
        </p>

        {/* Progress Bar */}
        <div className="bg-[#1a1a1a] rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className="progress-fill h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600 mb-8">
          <span>Build progress</span>
          <span>~{progress}% done</span>
        </div>

        {/* Feature List */}
        <div className="flex flex-col gap-2.5 mb-8 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-2.5 bg-[#0f172a] border border-[#1e3a5f] rounded-xl px-3.5 py-2.5"
            >
              <span className="text-lg w-7 text-center shrink-0">{f.icon}</span>

              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <strong className="text-slate-300 font-medium text-[13px]">
                  {f.title}
                </strong>
                <span className="text-slate-400 text-xs leading-snug">
                  {f.desc}
                </span>
              </div>

              {f.color === "green" ? (
                <span className="ml-auto shrink-0 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#1e3a1e] text-green-400 border border-green-900 whitespace-nowrap">
                  {f.status}
                </span>
              ) : (
                <span className="ml-auto shrink-0 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#1e1e3a] text-indigo-400 border border-indigo-900 whitespace-nowrap">
                  {f.status}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/chatAssist/professional")}
          className="w-full py-3 bg-transparent border-[1.5px] border-blue-700 text-blue-400 rounded-xl text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 hover:bg-[#0d1f38] hover:text-blue-300 hover:border-blue-500"
        >
          Use Professional Mode instead →
        </button>

        {/* Footer */}
        <p className="mt-5 text-xs text-slate-700">
          Your personalized AI bots — AdminChats
        </p>
      </div>
    </div>
  );
}