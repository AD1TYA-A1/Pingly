"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ userName: "", email: "", password: "", otp: "" });
  const canvasRef = useRef(null);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });



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




  const submit = async () => {

    const { otp, ...rest } = form;  // Removes OTP 
    const newBody = JSON.stringify(rest); // everything except otp
    // console.log(newBody);
    if (!form.userName && !form.email && !form.password) {
      return toast("Don’t leave blanks 👀", {
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

    if (!form.userName) {
      return toast("No username? Come on 😏", {
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

    if (!form.email) {
      return toast("No email ? We can’t reach you 😅", {
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
    if (!form.email.includes("@")) {
      return toast("Invalid Email KID 😕", {
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

    if (!form.password) {
      return toast("No password? Risky move 😬", {
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
    if (!form.otp) {
      return toast("Enter the OTP first 😬", {
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
    let otpPayload = {
      email: form.email,
      otp: form.otp
    }
    console.log(otpPayload);

    // Checking OTP FIRST 
    await fetch("/api/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpPayload),
    }).then(async (response) => {
      const result = await response.json();
      console.log(result);
      if (result.verification === "success") {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: newBody,
        }).then(async (response) => {
          const result = await response.json();

          if (result.success) {
            // ✅ Success
            toast.success(result.message || "Account created successfully! 🎉", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            });
            // redirect after toast
            setTimeout(() => router.push("/onBoarding"), 1000);

          } else {
            // ❌ Server returned error
            toast.error(result.message || "Something went wrong 😬", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: "dark",
            });
          }
        })
          .catch((error) => {
            // ❌ Network error
            toast.error("Network error. Try again 😵", {
              position: "top-right",
              autoClose: 5000,
              theme: "dark",
            });
            console.error(error);
          });

      } else {
        return toast.error("Invalid OTP 😵", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });

      }
    }).catch((error) => {
      // ❌ Network error
      toast.error("Network error. Try again 😵", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
      console.error(error);
    });




    


  };


  const sendOtp = async () => {
    // A slightly more 'judgmental' but effective check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.includes("@")) {
      return toast("That's not an email, and you know it. 🤨", {
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

    await fetch("/api/sendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, userName: form.userName }),
    }).then(response => {
      return response.json(); // Converts raw stream to a JSON object
    }).then((data) => {
      if (data.success) {
        toast(`${data.message}`, {
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
        setOtpSent(true);
      }
      else {
        toast(`${data.message}`, {
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
        // setOtpSent(true);

      }
    }) // This is the actual API response;
      .catch(error => console.error(error));
  };


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
      <div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-x-hidden">      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[380px] mx-4">

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-white/40 text-sm mt-1">Join Admin-Chats today</p>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-7">
            <div className="flex flex-col gap-5">

              {/* Username */}
              <div className="flex flex-col gap-2">
                <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Username</label>
                <input
                  name="userName"
                  type="text"
                  placeholder="cooluser123"
                  value={form.userName}
                  onChange={handleChange}
                  className="bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all duration-200"
                />
              </div>

              {/* Email + Send OTP */}
              <div className="flex flex-col gap-2">
                <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Email address</label>
                <div className="flex gap-2">
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="flex-1 bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button
                    onClick={sendOtp}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${otpSent
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-amber-400 hover:bg-amber-300 text-black active:scale-95"
                      }`}
                    disabled={otpSent}
                  >
                    {otpSent ? "Sent ✓" : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP Input — shows after Send OTP clicked */}
              {otpSent && (
                <div className="flex flex-col gap-2">
                  <label className="text-white/50 text-xs font-medium tracking-widest uppercase">
                    Enter OTP
                    <span className="ml-2 text-amber-400/60 normal-case tracking-normal font-normal">
                      (check your email)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={form.otp}
                      onChange={handleChange}
                      className="flex-1 bg-white/[0.06] border border-amber-400/30 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-white/[0.08] transition-all duration-200 tracking-[0.3em] text-center font-mono"
                    />
                    <button
                      onClick={() => setOtpSent(false)}
                      className="px-3 py-3 rounded-xl text-xs text-white/30 hover:text-amber-400 transition-colors cursor-pointer border border-white/10 hover:border-amber-400/30"
                      title="Resend OTP"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-white/50 text-xs font-medium tracking-widest uppercase">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.08] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer p-0.5"
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
            <button className="
            w-full mt-7 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-semibold py-3 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-amber-400/20 " onClick={submit}>
              Create account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Login redirect */}
            <p className="text-center text-xs text-white/30">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/logIn")}
                className="text-amber-400 cursor-pointer hover:text-amber-300 transition-colors font-medium"
              >
                Log in →
              </span>
            </p>
          </div>
        </div>
      </div>
    </>

  );
}