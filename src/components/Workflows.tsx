"use client";

import React, { useState } from "react";
import { Inbox, Cpu, Sparkles } from "lucide-react";

import { WORKFLOW_PRESETS } from "@/mocks/workflows";

export function Workflows() {
  const [activeWorkflow, setActiveWorkflow] = useState<string>("appstore");
  const currentPreset = WORKFLOW_PRESETS.find((p) => p.id === activeWorkflow) || WORKFLOW_PRESETS[0];

  return (
    <section id="workflows" className="max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-zinc-200/60 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">Telemetry Workflows</h2>
        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-heading">Automate downstream actions based on review data</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Select a trigger source to watch RevGAPI dynamically extract sentiment, translate multilingual strings, and dispatch event webhooks.
        </p>
      </div>

      {/* Workflow Triggers */}
      <div className="flex justify-center gap-2.5">
        {WORKFLOW_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setActiveWorkflow(preset.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
              activeWorkflow === preset.id
                ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
                : "bg-white border-zinc-200 text-zinc-650 hover:border-teal-700 hover:text-teal-800"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Visual Pipeline Canvas */}
      <div className="space-y-6 animate-fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 bg-zinc-50/40 border border-zinc-200/60 rounded-2xl relative shadow-sm overflow-hidden">
          {/* SVG Connecting Wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 800 300" fill="none">
            {/* Left wire: Source to Engine */}
            <path
              d="M 235,150 L 345,150"
              stroke="#0d9488"
              strokeWidth="2"
              strokeDasharray="6, 4"
              className="animate-flow-line"
              style={{ transition: "stroke 0.5s" }}
            />

            {/* Right wires: Engine to targets */}
            {currentPreset.nodes.targets.map((t, idx) => {
              const yTargets = [65, 120, 178, 235];
              const y = yTargets[idx];
              const d = `M 455,150 C 505,150 535,${y} 575,${y}`;
              return (
                <path
                  key={idx}
                  d={d}
                  stroke={t.active ? "#0d9488" : "#e4e4e7"}
                  strokeWidth={t.active ? "2" : "1.5"}
                  strokeOpacity={t.active ? "1" : "0.2"}
                  strokeDasharray={t.active ? "6, 4" : undefined}
                  className={t.active ? "animate-flow-line" : undefined}
                  style={{ transition: "stroke 0.5s, stroke-width 0.5s, stroke-opacity 0.5s" }}
                />
              );
            })}
          </svg>

          {/* Column 1: Source Trigger */}
          <div className="space-y-3 relative z-10">
            <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono block">Source Event</span>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center">
                  <Inbox className="w-3 h-3 text-teal-700" />
                </div>
                <span className="font-bold text-xs text-zinc-800">{currentPreset.source}</span>
              </div>
              <div className="p-2.5 bg-zinc-50/60 rounded border border-zinc-150 text-[10px] text-zinc-500 font-mono leading-relaxed max-h-24 overflow-y-auto">
                "{currentPreset.reviewText}"
              </div>
            </div>
          </div>

          {/* Column 2: Core processing Node */}
          <div className="flex flex-col items-center justify-center space-y-3 py-4 md:py-0 relative z-10">
            <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono block text-center">Structured Extraction</span>
            <div className="w-20 h-20 rounded-2xl bg-teal-700 text-[#faf9f5] flex flex-col items-center justify-center shadow-lg relative animate-pulse">
              <Cpu className="w-8 h-8" />
              <span className="text-[9px] font-bold font-mono mt-1">RevGAPI</span>
              <span className="absolute inset-0 rounded-2xl border border-teal-500/40 animate-ping opacity-60"></span>
            </div>
            <span className="text-[9.5px] font-bold text-teal-700 font-mono">
              {currentPreset.lang} Detected
            </span>
          </div>

          {/* Column 3: Action Targets Stack */}
          <div className="space-y-3 relative z-10">
            <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono block">Actions Dispatched</span>
            <div className="space-y-2">
              {currentPreset.nodes.targets.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all duration-500 bg-white ${
                    t.active
                      ? "border-teal-300 text-teal-900 shadow-sm"
                      : "border-zinc-200 text-zinc-400 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.active ? "bg-teal-600 animate-pulse" : "bg-zinc-300"}`}></span>
                    <span className="text-xs font-semibold font-mono">{t.name}</span>
                  </div>
                  {t.active && (
                    <span className="text-[8px] bg-teal-700 text-[#faf9f5] px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Explanation Summary */}
        <div className="p-4 bg-teal-50/30 border border-teal-200/30 rounded-xl flex gap-3 items-start">
          <Sparkles className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-850 uppercase font-mono tracking-wider">Workflow Detail</span>
            <p className="text-xs text-zinc-650 leading-relaxed font-medium">
              {currentPreset.explanation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
