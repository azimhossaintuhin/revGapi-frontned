"use client";

import Link from "next/link";
import { MessageSquareCode } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-zinc-200/50 bg-[#faf9f5]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-5 h-5 rounded bg-teal-700 flex items-center justify-center shadow-sm">
            <MessageSquareCode className="w-3.5 h-3.5 text-[#faf9f5]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900 font-heading">
            RevGAPI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[11px] font-bold text-zinc-700 hover:text-teal-700 px-2.5 py-1 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="h-8 px-3.5 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-[11px] font-bold rounded shadow-sm transition-all flex items-center justify-center"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
