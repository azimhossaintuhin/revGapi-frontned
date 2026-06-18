"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquareCode, CheckCircle2, ArrowRight, KeyRound } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on step 2 transition
  useEffect(() => {
    if (step === 2) {
      otpInputRefs[0].current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    toast.success("Verification code sent to your email!");
    setStep(2);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value !== "" && isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value !== "" && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    toast.success("Code verified successfully!");
    setStep(3);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    toast.success("Password reset successfully!");
    setStep(4);
  };

  return (
    <div className="bg-[#faf9f5] text-zinc-900 min-h-screen font-sans antialiased selection:bg-teal-100 selection:text-teal-900 relative overflow-hidden flex flex-col justify-between">
      {/* Background gradients and blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-teal-200/20 to-emerald-250/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-amber-100/35 to-teal-100/10 blur-[100px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            
            {/* Brand Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-teal-700 flex items-center justify-center shadow-sm">
                <MessageSquareCode className="w-4 h-4 text-[#faf9f5]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 font-heading">
                RevGAPI Developer Suite
              </span>
            </div>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-zinc-900 font-heading tracking-tight mb-1">
                    Forgot password?
                  </h2>
                  <p className="text-xs text-zinc-500 mb-6 font-medium">
                    No worries! Enter your email address below, and we'll send you a 4-digit code to reset your password.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-700 text-zinc-700 transition-colors font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Code"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Input 4-Digit OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-zinc-900 font-heading tracking-tight mb-1">
                    Enter reset code
                  </h2>
                  <p className="text-xs text-zinc-500 mb-6 font-medium">
                    Please enter the 4-digit code sent to <span className="font-semibold text-zinc-700">{email}</span>.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-between gap-3 max-w-[240px] mx-auto py-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 bg-zinc-50 border border-zinc-200 text-center text-xl font-bold text-zinc-800 rounded focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-all shadow-sm font-sans"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? "Verifying..." : "Verify Code"}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(["", "", "", ""]);
                        otpInputRefs[0].current?.focus();
                        toast.success("Reset code resent!");
                      }}
                      className="text-xs text-teal-700 font-bold hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Reset Password */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-zinc-900 font-heading tracking-tight mb-1">
                    Set new password
                  </h2>
                  <p className="text-xs text-zinc-500 mb-6 font-medium">
                    Choose a secure, strong password for your account.
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="new_password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                      New Password
                    </label>
                    <input
                      id="new_password"
                      name="new_password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-700 text-zinc-700 transition-colors font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirm_password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                      Confirm Password
                    </label>
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-700 text-zinc-700 transition-colors font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-9 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: Success Message */}
            {step === 4 && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-955 p-5 rounded-xl space-y-4 animate-fade-in my-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Password Reset!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                      Your password has been reset successfully. You can now use your new password to sign in.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-end">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow transition-all flex items-center gap-1"
                  >
                    Go to Login
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Footer Back Link (Only for steps 1-3) */}
            {step < 4 && (
              <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
                <p className="text-xs text-zinc-505 font-medium">
                  Back to{" "}
                  <Link href="/login" className="text-teal-700 font-bold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
