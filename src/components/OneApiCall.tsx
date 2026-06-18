"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";

import { ONE_CALL_FIELDS } from "@/mocks/oneApiCall";

export function OneApiCall() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [activeField, setActiveField] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setVisibleCount(0);
    setActiveField(null);
    let count = 0;
    intervalRef.current = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      setActiveField(count - 1);
      if (count >= ONE_CALL_FIELDS.length) {
        clearInterval(intervalRef.current!);
        isPlayingRef.current = false;
        setIsPlaying(false);
        setTimeout(() => setActiveField(null), 1200);
      }
    }, 320);
  }, []);

  // Auto-trigger on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startAnimation]);

  const handleReplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisibleCount(0);
    setActiveField(null);
    isPlayingRef.current = false;
    setIsPlaying(false);
    setTimeout(() => startAnimation(), 80);
  };

  const RAW_REVIEW = `"Ich fand das Produkt so-lala,\n aber der Service war gut."`;

  const STATS = [
    { label: "Avg. response time", value: "~180ms" },
    { label: "Fields per call", value: "10+" },
    { label: "Languages supported", value: "50+" },
    { label: "API uptime", value: "99.9%" },
  ];

  return (
    <section
      id="one-api-call"
      ref={sectionRef}
      className="border-t border-zinc-200/60 bg-gradient-to-b from-white to-zinc-50/60 py-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">
            One API Call
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight font-heading leading-tight">
            This messy review text becomes{" "}
            <span className="text-teal-700">10 structured fields</span> in milliseconds
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Send a raw review — get back language detection, translation, sentiment, pros, cons, action items, confidence score, repeat-customer flag, and a suggested reply.{" "}
            <strong className="text-zinc-700">One call. Zero manual parsing.</strong>
          </p>
        </div>

        {/* Main split layout — both sides same height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
          {/* Left — terminal + stats 2×2 below */}
          <div className="flex flex-col gap-4">
            {/* Dark terminal */}
            <div className="rounded-xl border border-zinc-200 bg-[#0f1117] overflow-hidden shadow-xl font-mono text-xs">
              {/* Terminal chrome */}
              <div className="h-9 bg-[#1a1d27] border-b border-zinc-700/60 flex items-center px-4 gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-3 text-zinc-500 text-[10px]">POST /api/analyze → 200 OK</span>
                <button
                  onClick={handleReplay}
                  className="ml-auto flex items-center gap-1 text-zinc-500 hover:text-teal-400 transition-colors text-[10px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replay
                </button>
              </div>

              {/* Input review */}
              <div className="px-5 pt-5 pb-3">
                <p className="text-zinc-550 text-[10px] mb-1">// INPUT: raw review text</p>
                <pre className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-[11px]">
                  {`{\n  "review": ${RAW_REVIEW}\n}`}
                </pre>
              </div>

              {/* Divider arrow */}
              <div className="px-5 py-2 flex items-center gap-2 text-zinc-600 text-[10px]">
                <div className="flex-1 border-t border-dashed border-zinc-700" />
                <span className="text-teal-500">▶ RevGAPI processes</span>
                <div className="flex-1 border-t border-dashed border-zinc-700" />
              </div>

              {/* Animated JSON output */}
              <div className="px-5 pb-5 space-y-0.5">
                <p className="text-zinc-550 text-[10px] mb-2">// OUTPUT: structured analysis</p>
                <span className="text-zinc-400">{"{"}</span>
                <div className="ml-4 space-y-0.5">
                  {ONE_CALL_FIELDS.map((f, i) => (
                    <div
                      key={f.key}
                      className={`transition-all duration-500 ${
                        i < visibleCount
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2"
                      } ${activeField === i ? "bg-teal-500/10 -mx-2 px-2 rounded" : ""}`}
                    >
                      <span className="text-zinc-400">&quot;</span>
                      <span className="text-sky-300">{f.key}</span>
                      <span className="text-zinc-400">&quot;: </span>
                      <span className={f.color}>{f.value}</span>
                      {i < ONE_CALL_FIELDS.length - 1 && <span className="text-zinc-500">,</span>}
                    </div>
                  ))}
                </div>
                <span className="text-zinc-400">{"}"}</span>
              </div>
            </div>

            {/* 2×2 Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-4 shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <p className="text-2xl font-bold text-teal-700 font-mono">{s.value}</p>
                  <p className="text-[11px] text-zinc-555 mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — field explanation cards */}
          <div className="space-y-2">
            {ONE_CALL_FIELDS.map((f, i) => (
              <div
                key={f.key}
                className={`transition-all duration-500 rounded-lg border px-4 py-3 ${
                  i < visibleCount
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
                } ${
                  activeField === i
                    ? "border-teal-400 bg-teal-50 shadow-md shadow-teal-100"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                      activeField === i ? "bg-teal-500" : "bg-zinc-300"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold font-heading ${activeField === i ? "text-teal-700" : "text-zinc-800"}`}>
                      {f.label}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                  <code
                    className={`ml-auto text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0 ${
                      activeField === i ? "bg-teal-100 text-teal-700" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {f.key}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
