"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? <UserAvatar /> : <BotAvatar />}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${isUser
            ? "bg-amber-400 text-zinc-900 font-medium rounded-2xl rounded-br-[4px]"
            : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-2xl rounded-bl-[4px]"
            }`}
        >
          {msg.text}
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] text-zinc-600 px-0.5 ${isUser ? "flex-row-reverse" : ""}`}>
          <span>{msg.time}</span>
          {isUser && <StatusIcon status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

export default function AIAssistProfessional() {


  // Replace this with your actual DB fetch for the avatar URL
  const [userName, setuserName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const router = useRouter()
  const [startChat, setStartChat] = useState(true)
  const [messages, setMessages] = useState([])



  useEffect(() => {
    axios.get("/api/auth/me")
      .then((res) => {
        setuserName(res.data.userName)
        setAvatarUrl(res.data.avatarUrl)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])




  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }



  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 h-[60px] bg-zinc-950 border-b border-zinc-800">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-amber-500 rounded-[9px] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-zinc-50 tracking-tight">
            Admin<span className="text-amber-500">Chats</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            Professional
          </span>

          {/* Profile pill */}
          <div onClick={() => {
            router.push("/profile")
          }} className=" flex items-center gap-2 pl-[5px] pr-3 py-[5px] rounded-full border border-zinc-800 bg-zinc-900 cursor-pointer group hover:border-amber-500/60 hover:bg-amber-500/5 transition-all duration-200">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-zinc-700 group-hover:border-amber-500/60 transition-all duration-200"
              />
            ) : (
              /* Fallback initials circle if no avatar */
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-bold text-black border border-amber-400">
                {userName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[13px] font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">
              {userName}
            </span>
          </div>
        </div>
      </nav>

      {/* ── MAIN EMPTY STATE ── */}
      {!startChat ? (
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-10">

          {/* Icon + heading */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-[18px] bg-amber-500/8 border border-amber-500/18 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div className="text-[22px] md:text-6xl  font-semibold text-zinc-50 tracking-tight text-center">
              How can I help you today?
            </div>
            <p className="text-sm text-zinc-500 text-center max-w-[300px] leading-relaxed">
              Send a message to get started with your professional AI assistant.
            </p>
          </div>

          {/* Suggestion chips
          <div className="flex flex-wrap gap-2 justify-center max-w-[480px] mb-9">
            {["Draft a report", "Summarize this document", "Write an email", "Analyze data", "Brainstorm ideas", "Debug my code"].map((chip) => (
              <button
                key={chip}
                className="text-[12.5px] text-zinc-400 border border-zinc-800 rounded-full px-3.5 py-1.5 bg-zinc-900 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-150 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div> */}

          {/* Input bar */}
          <div className="w-full max-w-[560px]">
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-[18px] py-3 focus-within:border-amber-500/50 transition-colors duration-200">
              <input
                type="text"
                placeholder="Send a message to get started..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-600"
              />
              <button
                onClick={() => { setStartChat(true) }}
                 className=" cursor-pointer flex-shrink-0 w-9 h-9 rounded-[10px] bg-amber-500 hover:bg-amber-400 active:scale-95 flex items-center justify-center transition-all duration-150">

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[11.5px] text-zinc-700 mt-2.5">
              Professional Mode · Formal · Goal-Oriented · Structured
            </p>
          </div>
        </main>
      ) : (
        <div className="flex flex-col h-[90vh] bg-black text-white font-sans">

          {/* ── Header ── */}
          <header className="flex items-center justify-between px-5 py-3.5 bg-[#111111] border-b border-zinc-900 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-amber-400 flex items-center justify-center text-black">
                {/* <RobotIcon size={20} /> */}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100 leading-tight">VAI · Professional</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Always online</p>
              </div>
            </div>

            <span className="text-[10px] font-medium tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md px-2.5 py-1">
              Professional
            </span>
          </header>

          {/* ── Messages ── */}
          <main className="  px-3 py-2 flex-1 flex-col gap-3.5 scrollbar-thin scrollbar-thumb-zinc-800">

            {/* Date separator */}
            <div className="flex items-center gap-3 ">
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-[11px] text-zinc-600 ">Today</span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>

            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}


            {/* <div ref={bottomRef} /> */}
          </main>

          {/* ── Input Bar ── */}
          <footer className="px-4 py-3 bg-[#111111] border-t border-zinc-900 flex-shrink-0 ">
            <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 focus-within:border-amber-400/40 transition-colors duration-200 ">
              <textarea
                // ref={textareaRef}
                rows={1}
                // value={inputVal}
                // onChange={(e) => { setInputVal(e.target.value); autoResize(); }}
                // onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="flex-1  bg-transparent border-none outline-none  text-[13.5px]  text-zinc-200 placeholder-zinc-600 leading-relaxed max-h-28 w-auto "
              />
            </div>
            <p className="text-center text-[10.5px] text-zinc-700 mt-2">
              Professional Mode · Formal · Goal-Oriented · Structured
            </p>
          </footer>

        </div>
      )}

    </div>
  );
}