"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function Message({ msg }) {
  const isUser = msg.role === "user";
  const time = yourTimeStap(msg.time)
  // console.log(time);


  return (
    <div className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? "👤" : "🤖"}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${isUser
            ? "bg-amber-400 text-zinc-900 font-medium rounded-2xl rounded-br-[4px]"
            : "bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-2xl rounded-bl-[4px]"
            }`}
        >
          {msg.content}
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] text-zinc-600 px-0.5 ${isUser ? "flex-row-reverse" : ""}`}>
          <span>{time.hour}:{time.minutes} {time.meridiem}</span>
          {/* {isUser && <StatusIcon status={msg.status} />} */}
        </div>
      </div>
    </div>
  );
}

function yourTimeStap(timeStamp) {
  // console.log(timeStamp);
  // 2026-06-14T07:35:32.060Z

  let date = timeStamp.split("T")[0]  // 2026-06-04
  let time = timeStamp.split("T")[1].slice(0, 5) // 07:33

  let hour = parseInt(time.split(":")[0])
  // console.log(hour);
  let minutes = parseInt(time.split(":")[1])
  hour = hour + 5;
  minutes = minutes + 30
  if (minutes > 60) {
    minutes = minutes - 60
    hour = hour + 1
  }

  if (minutes < 10) {
    minutes = minutes.toString()
    minutes = "0" + minutes
  }

  // console.log(hour, ":", minutes);
  if (hour < 12) {
    // console.log(hour);
    // console.log(hour);

    if (hour < 10) {

      hour = hour.toString()
      hour = "0" + hour
      console.log("HOUR!=10 || HOUT!=11");
      console.log(hour);

    }
    const timePayload = {
      hour,
      minutes,
      meridiem: "AM"
    }
    return timePayload
  } else if (hour > 12) {
    hour = hour - 12
    // console.log(hour);

    if (hour < 10) {

      hour = hour.toString()
      hour = "0" + hour
      // console.log("HOUR!=10 || HOUT!=11");
      // console.log(hour);

    }
    const timePayload = {
      hour,
      minutes,
      meridiem: "PM"
    }
    return timePayload
  } else {
    const timePayload = {
      hour,
      minutes,
      meridiem: "PM"
    }
    return timePayload

  }

}

export default function AIAssistProfessional() {



  // Replace this with your actual DB fetch for the avatar URL
  const [userName, setuserName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const router = useRouter()
  const [startChat, setStartChat] = useState(true)
  const [messageForApex, setMessagesForApex] = useState([])
  const [messages, setMessages] = useState([])

  const [inputVal, setInputVal] = useState('');
  const textareaRef = useRef(null);
  const bottomRef = useRef()
  const [lastRecentChatID, setLastRecentChatID] = useState("")



  // Handles auto-resizing logic
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 1. Reset height to 'auto' so it can shrink if text is deleted
      textarea.style.height = 'auto';
      // 2. Set height to scrollHeight to expand it, capped by Tailwind's max-h-28
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    autoResize();
  };

  async function saveToDB(role, message) {
    const axios = require('axios');
    let data = JSON.stringify({
      "role": role,
      "message": message
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/ApexAI/initiateMessage',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log((response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  }


  const handleSend = async () => {
    if (!inputVal.trim()) return;
    const msgPayload = {
      content: inputVal.trim(),
      role: "user", // or BOT
      time: new Date().toISOString(),
      // userID,
    }
    // console.log(msgPayload);


    const { time, ...msgPayloadToApex } = msgPayload //Removing time Because groq only takes content and role



    await saveToDB("user", inputVal.trim())



    // const msgPayloadForDB = {
    //   content: inputVal.trim(),
    //   role: "user", // or BOT
    //   time: Date.now(),
    //   // userID,
    // }
    console.log("Message sent:", inputVal); // Replace with your submit logic
    // Clear input and reset height
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await getResponceFromAPEX(inputVal.trim(), messageForApex)
    setMessages(prev => [...prev, msgPayload]);  // user message
    setMessagesForApex([...messageForApex, msgPayloadToApex])

    // console.log(responce);

    // autoScrollMainRef.current
    // bottomRef.current.scrollHeight = 0
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });    // console.log(bottomRef.current.scrollHeight);

  };

  async function getResponceFromAPEX(userMessage, oldChats) {
    let data = JSON.stringify({
      "userMessage": userMessage,
      "oldChats": oldChats
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/ApexAI/aiResponse',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // console.log((response.data));
        saveToDB("bot", response.data.result)
        const msgPayload = {
          content: response.data.result,
          role: "assistant",
          time: new Date().toISOString()
        }
        setMessages(prev => [...prev, msgPayload]);  // user message
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      })
      .catch((error) => {
        console.log(error);
      });

  }

  // APIcalls()


  // Allow sending with 'Enter' (but allow new lines with 'Shift + Enter')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSend();
    }
  };

  // Add this useEffect in your AIAssistProfessional component
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // fires every time messages state updates

  useEffect(() => {
    axios.get("/api/auth/me")
      .then((res) => {
        setuserName(res.data.userName)
        setAvatarUrl(res.data.avatarUrl)
        // setuserID(res.data._id)
        // console.log(res.data);
        let data = JSON.stringify({
          "lastId": lastRecentChatID,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: '/api/ApexAI/fetchMessage',
          headers: {
            'Content-Type': 'application/json',
          },
          data
        };

        axios.request(config)
          .then((response) => {
            console.log((response.data));
            setLastRecentChatID(response.data.last_id)
            setMessages(response.data.chats.reverse())
            let chats = response.data.chats.map((chat) => ({
              content: chat.content,
              role: chat.role
            }))
            console.log(chats);

            setMessagesForApex([...messageForApex,chats])


          })
          .catch((error) => {
            console.log(error);
          });

      })
      .catch((error) => {
        console.error(error);
      });


  }, [])







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
                <p className="text-sm font-medium text-zinc-100 leading-tight">APEX · Professional</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Always online</p>
              </div>
            </div>

            <span className="text-[10px] font-medium tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md px-2.5 py-1">
              Professional
            </span>
          </header>

          {/* ── Messages ── */}
          <main
            // ref={bottomRef}
            className="
            [&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-zinc-800
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700
  [scrollbar-width:thin]
  [scrollbar-color:#27272a_transparent]
            px-3 pb-10 flex-1 flex-col  scrollbar-thin scrollbar-thumb-zinc-800 overflow-y-auto">

            {/* Date separator */}
            <div className={` flex items-center gap-3 ${messages.length == 0 ? "mt-5 text-[18px]" : "text-[11px] mt-3 mb-2 "} `}>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className=" text-zinc-600 ">Chats Dissapear After 24Hrs</span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>

            {messages.map((msg) => (
              <Message key={msg.time} msg={msg} />
            ))}


            <div ref={bottomRef} className="h-10 w-full flex-shrink-0" />
          </main>


          {/* ── Input Bar ── */}
          <footer className="px-4 py-3 bg-[#111111] border-t border-zinc-900 flex-shrink-0">
            {/* Input Container */}
            <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 focus-within:border-amber-400/40 transition-colors duration-200">

              <textarea
                autoFocus
                ref={textareaRef}
                rows={1}
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                style={{ resize: 'none' }} // Prevents the user from manually dragging the corner
                className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-zinc-200 placeholder-zinc-600 leading-relaxed max-h-28 overflow-y-auto"
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputVal.trim()}
                aria-label="Send message"
                className="mb-0.5 p-1.5 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-300 disabled:opacity-30 disabled:bg-zinc-700 disabled:text-zinc-500 transition-all shrink-0"
              >
                {/* Paper airplane SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
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