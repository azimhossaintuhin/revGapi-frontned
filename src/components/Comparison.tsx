"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

import { COMPARISON_ROWS } from "@/mocks/comparison";

export function Comparison() {
  return (
    <section id="comparison" className="border-t border-zinc-200/60 bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">
            Why RevGAPI
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight font-heading">
            Stop building what already exists
          </h2>
          <p className="text-sm text-zinc-555 leading-relaxed">
            Every hour your team spends on NLP pipelines, translation glue code, and regex parsers is an hour not spent on your actual product.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          {/* Column headers */}
          <div className="grid grid-cols-3 border-b border-zinc-200">
            <div className="px-6 py-4 bg-zinc-50 border-r border-zinc-200">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Feature</p>
            </div>
            <div className="px-6 py-4 bg-rose-50/60 border-r border-zinc-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Manual Pipeline</p>
            </div>
            <div className="px-6 py-4 bg-teal-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
              <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">RevGAPI</p>
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-zinc-100 last:border-b-0 ${
                i % 2 === 0 ? "bg-white" : "bg-zinc-50/40"
              } hover:bg-teal-50/20 transition-colors duration-150`}
            >
              {/* Feature name */}
              <div className="px-6 py-4 border-r border-zinc-100 flex items-center">
                <p className="text-xs font-semibold text-zinc-700 font-heading">{row.feature}</p>
              </div>

              {/* Manual side */}
              <div className="px-6 py-4 border-r border-zinc-100 flex items-start gap-2.5">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center">
                  <span className="text-rose-500 text-[9px] font-bold leading-none">✕</span>
                </span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{row.manual.text}</p>
              </div>

              {/* RevGAPI side */}
              <div className="px-6 py-4 flex items-start gap-2.5">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 text-[9px] font-bold leading-none">✓</span>
                </span>
                <p className="text-[11px] text-teal-800 font-semibold leading-relaxed">{row.revgapi.text}</p>
              </div>
            </div>
          ))}

          {/* Summary footer row */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-zinc-55 via-rose-50/30 to-teal-50 border-t border-zinc-200">
            <div className="px-6 py-5 border-r border-zinc-200 flex items-center">
              <p className="text-xs font-bold text-zinc-700 font-heading">Bottom line</p>
            </div>
            <div className="px-6 py-5 border-r border-zinc-200 flex items-center">
              <p className="text-[11px] text-rose-600 font-semibold">Weeks of dev time + ongoing cost</p>
            </div>
            <div className="px-6 py-5 flex items-center">
              <p className="text-[11px] text-teal-700 font-bold">One API key. Ship in a day. →</p>
            </div>
          </div>
        </div>

        {/* Badge strip */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "No NLP expertise needed",
            "No infra to manage",
            "No prompt engineering",
            "No SDK required",
          ].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            >
              <CheckCircle2 className="w-3 h-3" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
