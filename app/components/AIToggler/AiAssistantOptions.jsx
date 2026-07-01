// components/AiAssistantOptions.jsx
import { useRouter } from "next/navigation";
export default function AiAssistantOptions({ onClose }) {
    const router = useRouter()
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-xl bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#888] hover:border-amber-600 hover:text-amber-400 transition-colors"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 pr-8">
                    <span className="relative flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                            fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                            <path d="M2 14h2M22 14h-2M9 13v2M15 13v2" />
                        </svg>
                        <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-green-500 rounded-full border border-[#111]" />
                    </span>
                    <span className="text-white text-xs font-medium tracking-widest uppercase text-center">
                        AI Assistant Options
                    </span>
                    <span className="bg-green-500/10 border border-green-500/30 rounded-full text-[10px] px-2 py-0.5 text-green-400 tracking-wide">
                        24/7
                    </span>
                </div>

                {/* Mode Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                    {/* Professional Mode */}
                    <div
                        onClick={() => {
                            router.push("/chatAssist/professional")
                        }}
                        className="group bg-[#0f0f0f] border border-amber-600 rounded-xl p-4 sm:p-5 flex flex-col gap-3 cursor-pointer hover:bg-[#1c1107] transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
                                Professional Mode
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="14" x="2" y="7" rx="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>

                        <div className="flex flex-row sm:flex-col flex-wrap gap-x-3 gap-y-1">
                            <span className="text-[#888] text-xs">Formal</span>
                            <span className="text-[#888] text-xs">Goal-Oriented</span>
                            <span className="text-[#888] text-xs">Structured</span>
                        </div>

                        <div className="px-2 py-1 bg-[#1c1107] border border-amber-900 rounded-md w-fit">
                            <span className="text-amber-600 text-[11px]">APEX — Advanced Reporting Bot</span>
                        </div>

                        <button
                            className="cursor-pointer mt-1 w-full py-2.5 bg-amber-500 hover:bg-amber-400 rounded-lg text-[#0a0a0a] text-xs font-semibold tracking-widest uppercase transition-colors"
                        >
                            Launch Professional
                        </button>
                    </div>

                    {/* Casual Mode */}
                    <div
                        onClick={() => {
                            router.push("/chatAssist/casual")
                        }}
                        className="group relative bg-[#0a0a0f] border border-[#1e2a3a] hover:border-sky-500/60 rounded-xl p-4 sm:p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(56,189,248,0.08)] overflow-hidden"
                    >
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all duration-500" />

                        <div className="flex items-center justify-between">
                            <span className="text-sky-400 text-xs font-semibold tracking-widest uppercase">
                                Casual Mode
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="rgb(56 189 248 / 0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 13s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                            </svg>
                        </div>

                        <div className="flex flex-row sm:flex-col flex-wrap gap-x-3 gap-y-1.5">
                            <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-sky-500/60 inline-block" />
                                Conversational
                            </span>
                            <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-sky-500/60 inline-block" />
                                Open-ended
                            </span>
                            <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-sky-500/60 inline-block" />
                                Exploratory
                            </span>
                        </div>

                        <div className="px-2.5 py-1 bg-sky-950/40 border border-sky-800/30 rounded-md w-fit">
                            <span className="text-sky-400/80 text-[11px] tracking-wide">Chit-Chat — Friendly Bot</span>
                        </div>

                        <button
                            className="cursor-pointer mt-1 w-full py-2.5 bg-sky-950/30 border border-sky-700/40 hover:bg-sky-500/10 hover:border-sky-500/70 rounded-lg text-sky-300 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                        >
                            Launch Casual
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#222]" />
                    <span className="text-[#555] text-[10px] sm:text-[11px] tracking-widest uppercase whitespace-nowrap">
                        Your personalized AI bots
                    </span>
                    <div className="flex-1 h-px bg-[#222]" />
                </div>

            </div>
        </div>
    );
}