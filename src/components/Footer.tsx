"use client";

import { MessageSquareCode } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white py-8 text-xs text-zinc-505 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-700 flex items-center justify-center">
            <MessageSquareCode className="w-2.5 h-2.5 text-[#faf9f5]" />
          </div>
          <span className="font-bold text-zinc-900 font-mono text-xs">RevGAPI</span>
        </div>
        <p>© {new Date().getFullYear()} RevGAPI. All rights reserved by Routex.</p>
        <div className="flex gap-4 font-bold text-zinc-600">
          <a href="#" className="hover:text-teal-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-700 transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-700 transition-colors">Docs</a>
        </div>
      </div>
    </footer>
  );
}
