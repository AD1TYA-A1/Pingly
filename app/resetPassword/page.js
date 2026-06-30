"use client";
import { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [sent, setSent] = useState(false);
    const [otp, setOtp] = useState("")
    const [sendingOtp, setSendingOtp] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userEmailDomain, setUserEmailDomain] = useState("")
    const [verifyingOTPViaAPI, setVerifyingOTPViaAPI] = useState(false)
    const [otpVerification, setOtpVerification] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [handlingResetPassword, setHandlingResetPassword] = useState(false)
    


    const handleSendOtp = () => {
        setSendingOtp(true)
        if (!username.trim()) {
            return toast.error('Enter a valid UserName ❌', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            })
        };
        let data = JSON.stringify({
            "userName": username
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/auth/findUserName',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(async (response) => {
                // console.log(response);

                if (response.data.success) {
                    // console.log("Email", response.data.email.slice(0, 4));
                    // console.log("Domain", response.data.email.split("@"));
                    setUserEmailDomain(response.data.email.split("@")[1])
                    setUserEmail(response.data.email)
                    await fetch("/api/sendResetOTP", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: response.data.email }),
                    }).then(response => {
                        return response.json(); // Converts raw stream to a JSON object
                    }).then((data) => {
                        // console.log(data);

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
                            setSent(true)
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


                }
                else {
                    setSendingOtp(false)
                    return toast.error('UserName not Found', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",

                    });

                }

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleVerifyOtp = async () => {

        console.log("Handling Your OTP");
        if (!otp) {
            return toast.error('Enter OTP ❌', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            })
        }
        setVerifyingOTPViaAPI(true)
        let otpPayload = {
            email: userEmail,
            otp: otp
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
                setOtpVerification(true)
            }
            else {
                setVerifyingOTPViaAPI(false)
                return toast.error('Verification Failed', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",

                })


            }
        }).catch((error) => {
            // ❌ Network error
            toast.error("Network error. Try again 😵", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
            });
            console.log(error.message);

        })
    }

    const handleResetPassword = () => {
        if (newPassword.trim().length() == 0 || confirmPassword.trim().length() == 0) {
            return toast.error('Password Fields seems empty ❌', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

        }
        if (newPassword === confirmPassword) {
            setHandlingResetPassword(true)
            let data = JSON.stringify({
                "email": userEmail,
                "newPassword": confirmPassword
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: '/api/auth/changePassWord',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then(async (response) => {
                    // console.log(response);
                    setTimeout(() => {
                        router.push("/logIn")
                    }, 1000);
                    if (response.data.success == true) {
                        return toast.info('Password Change Success, Redirecting...!!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            return toast.error('PassWords Do not Match ❌', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

        }

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

            <div
                className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1a1400 0%, #000000 60%)" }}
            >
                {/* Ambient glow */}
                <div className="absolute w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">

                    {/* Top label — inside flow, not near browser bar */}
                    <p className="text-yellow-400/60 text-[10px] font-semibold uppercase tracking-[0.25em] text-center">
                        Admin-Chats · Account Recovery
                    </p>

                    {/* Card */}
                    <div className="w-full bg-[#0f0f0f] border border-white/[0.07] rounded-2xl px-7 py-9 flex flex-col items-center gap-6 shadow-[0_0_80px_rgba(0,0,0,0.9)]">

                        {/* Icon */}
                        <div className="bg-yellow-400 rounded-xl p-3 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>

                        {!sent ? (
                            <>
                                {/* Heading */}
                                <div className="text-center space-y-1.5">
                                    <div className="text-white font-black text-2xl tracking-tight leading-tight">
                                        Forgot<br />
                                        <span className="text-yellow-400">Password?</span>
                                    </div>
                                    <p className="text-white/30 text-xs font-light leading-relaxed max-w-[220px] mx-auto">
                                        Enter your username and we'll sort you out.
                                    </p>
                                </div>

                                {/* Input */}
                                <div className="w-full flex flex-col gap-1.5">
                                    <label className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        Username
                                    </label>
                                    <input
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendOtp()
                                            }
                                        }}
                                        type="text"
                                        value={username}
                                        autoFocus

                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="cooluser123"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-all duration-200"
                                    />
                                </div>

                                {/* Button */}
                                <button
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp == true}
                                    className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] transition-all duration-150 text-black font-black text-sm rounded-lg py-3 tracking-wide shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:bg-yellow-700 disabled:cursor-not-allowed"
                                >
                                    Send OTP
                                </button>

                                {/* Divider */}
                                <div className="w-full flex items-center gap-3">
                                    <div className="flex-1 h-px bg-white/[0.07]" />
                                    <span className="text-white/20 text-[10px]">or</span>
                                    <div className="flex-1 h-px bg-white/[0.07]" />
                                </div>

                                {/* Back link */}
                                <p className="text-white/25 text-xs">
                                    Remembered it?{" "}
                                    <Link href="/logIn" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
                                        Back to Login →
                                    </Link>
                                </p>
                            </>
                        ) : (
                            /* Success state */
                            !otpVerification ? (
                                <>
                                    <div className="text-center flex flex-col items-center gap-4 py-2">
                                        <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/25 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <div className="space-y-1 flex flex-col gap-6">
                                            <div className="text-white font-black text-2xl tracking-tight">Link Sent!</div>
                                            <p className="text-white/30 text-xs max-w-[200px] mx-auto leading-relaxed">
                                                Check your email {userEmail.slice(0, 4)}...@{userEmailDomain} for{" "}
                                                <span className="text-yellow-400 font-semibold">@{username}</span> and
                                                enter the OTP below.
                                            </p>
                                        </div>
                                        <div className="w-full space-y-2 mt-7 flex flex-col gap-4">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                autoFocus
                                                onKeyUp={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleVerifyOtp()
                                                    }
                                                }}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                placeholder="Enter OTP"
                                                className="w-full bg-white/5 border border-white/10 text-white text-center text-lg font-black tracking-[0.5em] rounded-lg px-4 py-2.5 placeholder:text-white/20 placeholder:tracking-normal focus:outline-none focus:border-yellow-400/50 transition"
                                            />
                                            <button
                                                onClick={handleVerifyOtp}
                                                disabled={verifyingOTPViaAPI == true}
                                                className="w-full text-black bg-yellow-400 hover:bg-yellow-300 transition font-black text-xs px-7 py-2.5 rounded-lg disabled:bg-yellow-700 disabled:cursor-not-allowed"
                                            >
                                                Verify OTP →
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center flex flex-col items-center gap-4 py-2">
                                    <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/25 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="text-white font-black text-2xl tracking-tight">New Password</div>
                                        <p className="text-white/30 text-xs max-w-[200px] mx-auto leading-relaxed">
                                            OTP verified. Set a new password for{" "}
                                            <span className="text-yellow-400 font-semibold">@{username}</span>.
                                        </p>
                                    </div>

                                    <div className="w-full mt-5 flex flex-col gap-3">
                                        <input
                                            autoFocus
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New password"
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg px-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition"
                                        />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm password"
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg px-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition"
                                        />
                                        <button

                                            onClick={handleResetPassword}
                                            className="w-full text-black bg-yellow-400 hover:bg-yellow-300 transition font-black text-xs px-7 py-2.5 rounded-lg mt-1 disabled:bg-yellow-600 disabled:cursor-not-allowed"
                                            disabled={handlingResetPassword}
                                        >
                                            Reset Password →
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>

    );
}
