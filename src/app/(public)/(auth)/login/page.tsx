"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareCode } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
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
              Log in to your account
            </h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium">
              Enter your credentials to access your API keys and analytics dashboard.
            </p>

            <form className="space-y-4">
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
                  className="w-full px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-700 text-zinc-700 transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-700 text-zinc-700 transition-colors font-medium"
                />
                <div className="flex justify-end pt-0.5">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] text-teal-700 font-bold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-9 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow transition-all flex items-center justify-center gap-1.5"
              >
                Login
              </button>
            </form>

            <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
              <p className="text-xs text-zinc-500 font-medium">
                Don't have an account yet?{" "}
                <Link href="/register" className="text-teal-700 font-bold hover:underline">
                  Sign up
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
