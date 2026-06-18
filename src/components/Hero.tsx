"use client";

export function Hero() {
  return (
    <section id="product" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 text-center space-y-3 mt-15">
      <h1 className="text-5xl sm:text-4.5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15] max-w-xl mx-auto font-heading">
        Review intelligence, <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
          synthesized in seconds
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed max-w-lg mx-auto font-medium">
        Submit raw customer feedback and receive a structured JSON response containing sentiment, multilingual translation, actionable insights, and a context-aware drafted reply.
      </p>

      <div className="flex justify-center pt-1">
        <a
          href="#sandbox"
          className="h-9 px-4.5 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded flex items-center justify-center shadow transition-all"
        >
          Launch Sandbox
        </a>
      </div>

      {/* Compact stats row as a glassmorphic container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-white/40 border border-zinc-200/50 backdrop-blur-sm rounded-xl max-w-md mx-auto mt-2 shadow-sm">
        <div className="space-y-0.5">
          <p className="text-[9px] text-zinc-400 font-bold font-mono uppercase">LATENCY</p>
          <p className="text-xs font-bold text-teal-700 font-mono">~180ms Avg</p>
        </div>
        <div className="space-y-0.5 border-l border-zinc-200 pl-4">
          <p className="text-[9px] text-zinc-400 font-bold font-mono uppercase">UPTIME</p>
          <p className="text-xs font-bold text-teal-700 font-mono">99.9%</p>
        </div>
        <div className="space-y-0.5 border-l border-zinc-200 pl-4">
          <p className="text-[9px] text-zinc-400 font-bold font-mono uppercase">RESPONSE</p>
          <p className="text-xs font-bold text-teal-700 font-mono">10 Fields</p>
        </div>
        <div className="space-y-0.5 border-l border-zinc-200 pl-4">
          <p className="text-[9px] text-zinc-400 font-bold font-mono uppercase">LANGUAGES</p>
          <p className="text-xs font-bold text-teal-700 font-mono">50+</p>
        </div>
      </div>
    </section>
  );
}
