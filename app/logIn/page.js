"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";


export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  // const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ userName: "", password: "" });
  const canvasRef = useRef(null);
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  //Contains BG effect 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      o: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.15 + 0.02,
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

  const logIn = (e) => {
    e.target.disabled = true

    setLoggingIn(true)
    // console.log(form.userName);
    // console.log(form.password);

    let data = JSON.stringify({
      "userName": form.userName.trim(),
      "password": form.password.trim()
    });

    // console.log(data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/auth/logIn',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.success) {
          toast.success('Access Granted ✔️', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: Bounce,
          });
          router.push("/chat")
        } else {
          toast.error('Invalid Credentials ❌', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: Bounce,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoggingIn(false)
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      // transition={Bounce}
      />
      <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[380px] mx-4">

          {/* Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Log iN</h1>
            <p className="text-white/40 text-sm mt-1">Join Admin-Chats today</p>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6">
            <div className="flex flex-col gap-4">

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Username</label>
                <input
                  name="userName"
                  type="text"
                  placeholder="cooluser123"
                  value={form.userName}
                  onChange={handleChange}
                  className="bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all duration-200"
                />
              </div>





              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 pr-12 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

            </div>
            {/* Submit */}
            <button className="w-full mt-6 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-semibold py-2.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-amber-400/20" onClick={
              logIn
            }>
              {loggingIn ? "Loading..." : "LogIn"}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            <p className="text-center text-xs text-white/30 flex justify-center items-center gap-2">
              New to the Arsenal? {" "}
              <span
                onClick={() => router.push("/signUp")}
                className="text-amber-400 cursor-pointer hover:text-amber-300 transition-colors font-medium"
              >
                Sign Up →
              </span>
            </p>
          </div>
        </div>
      </div>
    </>

  );
}