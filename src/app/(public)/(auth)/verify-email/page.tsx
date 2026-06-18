"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquareCode, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value !== "" && isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      // Focus previous field on backspace
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    setIsSubmitting(true);
    // Simulate brief latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    setIsVerified(true);
    toast.success("Email verified successfully!");
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
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-teal-700 flex items-center justify-center shadow-sm">
                <MessageSquareCode className="w-4 h-4 text-[#faf9f5]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 font-heading">
                RevGAPI Developer Suite
              </span>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 font-heading tracking-tight mb-1">
              Verify your email
            </h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium">
              We have sent a 4-digit verification code to your email. Enter it below to activate your account.
            </p>

            {isVerified ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-5 rounded-xl space-y-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Email Verified!</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                      Your email address has been verified successfully. You can now log in to access your developer portal.
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
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-between gap-3 max-w-[240px] mx-auto py-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
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
                      inputRefs[0].current?.focus();
                      toast.success("Verification code resent!");
                    }}
                    className="text-xs text-teal-700 font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
              <p className="text-xs text-zinc-500 font-medium">
                Back to{" "}
                <Link href="/login" className="text-teal-700 font-bold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
