"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Play, Copy } from "lucide-react";
import { generateMockAnalysis } from "@/mocks/reviews";
import { PRESETS, MOCK_USE_CASE_DATA } from "@/mocks/sandbox";

export interface AgentOutput {
  feedback_language: string;
  translation: string | null;
  sentiment: "positive" | "negative" | "neutral";
  summary: string;
  pros: string[];
  cons: string[];
  action_items: string[];
  suggestions: string[];
  customer_repeats: boolean;
  confidence_score: number;
  replay: string;
}

export function Sandbox() {
  const [reviewInput, setReviewInput] = useState(PRESETS[0].review);
  const [apiKey, setApiKey] = useState("demo");
  const [isSending, setIsSending] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgentOutput | null>(null);

  const [responseTab, setResponseTab] = useState<"pretty" | "ui" | "raw">("pretty");
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);

  const [requestHistory, setRequestHistory] = useState<string[]>([]);
  const [isCached, setIsCached] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(100);

  const [activeTab, setActiveTab] = useState<"sandbox" | "product" | "slack" | "crm">("sandbox");

  const handleSendRequest = async () => {
    if (!reviewInput.trim()) return;

    setIsSending(true);
    setResponseStatus(null);
    setIsCached(false);

    const startTime = performance.now();

    // Simulate network request latency client-side
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const data = generateMockAnalysis(reviewInput);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setLatency(duration);
      setResponseStatus(200);
      setAnalysisResult(data);

      const normalized = reviewInput.trim().toLowerCase();
      if (requestHistory.includes(normalized)) {
        setIsCached(true);
      } else {
        setRequestHistory((prev) => [...prev, normalized]);
        setCreditsRemaining((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to generate client analysis", error);
      setResponseStatus(500);
      setAnalysisResult(null);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    handleSendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPreset = (text: string) => {
    setReviewInput(text);
  };

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderJSONResponse = (data: AgentOutput | null) => {
    if (!data) return <span className="text-zinc-550">// Waiting for response...</span>;
    return (
      <pre className="font-mono text-[10px] sm:text-[10.5px] leading-relaxed text-zinc-300 select-all">
        {`{\n`}
        <span className="text-teal-450">{`  "feedback_language"`}</span>: <span className="text-emerald-300">"{data.feedback_language}"</span>,{"\n"}
        <span className="text-teal-455">{`  "translation"`}</span>: {data.translation ? <span className="text-emerald-300">"{data.translation}"</span> : <span className="text-amber-400">null</span>},{"\n"}
        <span className="text-teal-450">{`  "sentiment"`}</span>: <span className="text-emerald-300">"{data.sentiment}"</span>,{"\n"}
        <span className="text-teal-450">{`  "summary"`}</span>: <span className="text-emerald-300">"{data.summary}"</span>,{"\n"}
        <span className="text-teal-450">{`  "pros"`}</span>: {JSON.stringify(data.pros, null, 2).replace(/\n/g, "\n  ")},{"\n"}
        <span className="text-teal-450">{`  "cons"`}</span>: {JSON.stringify(data.cons, null, 2).replace(/\n/g, "\n  ")},{"\n"}
        <span className="text-teal-450">{`  "action_items"`}</span>: {JSON.stringify(data.action_items, null, 2).replace(/\n/g, "\n  ")},{"\n"}
        <span className="text-teal-450">{`  "suggestions"`}</span>: {JSON.stringify(data.suggestions, null, 2).replace(/\n/g, "\n  ")},{"\n"}
        <span className="text-teal-450">{`  "customer_repeats"`}</span>: <span className="text-purple-300">{`${data.customer_repeats}`}</span>,{"\n"}
        <span className="text-teal-455">{`  "confidence_score"`}</span>: <span className="text-amber-300">{data.confidence_score}</span>,{"\n"}
        <span className="text-teal-450">{`  "replay"`}</span>: <span className="text-emerald-300">"{data.replay}"</span>{"\n"}
        {`}`}
      </pre>
    );
  };

  return (
    <section id="sandbox" className="max-w-4xl mx-auto px-4 sm:px-6 pb-14 scroll-mt-16">
      <div className="border border-zinc-200/80 bg-white rounded-xl overflow-hidden shadow-md flex flex-col">
        {/* Header tabs navigation */}
        <div className="h-11 bg-zinc-50 border-b border-zinc-200 px-4 flex items-center justify-between text-[11px] font-semibold text-zinc-505 font-mono">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`px-3 py-1.5 rounded transition-all ${activeTab === "sandbox" ? "bg-teal-700 text-[#faf9f5]" : "hover:text-zinc-850 hover:bg-zinc-200/60"}`}
            >
              Playground Sandbox
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`px-3 py-1.5 rounded transition-all ${activeTab === "product" ? "bg-teal-700 text-[#faf9f5]" : "hover:text-zinc-855 hover:bg-zinc-200/60"}`}
            >
              Product Page Widget
            </button>
            <button
              onClick={() => setActiveTab("slack")}
              className={`px-3 py-1.5 rounded transition-all ${activeTab === "slack" ? "bg-teal-700 text-[#faf9f5]" : "hover:text-zinc-855 hover:bg-zinc-200/60"}`}
            >
              Slack Alert Webhook
            </button>
            <button
              onClick={() => setActiveTab("crm")}
              className={`px-3 py-1.5 rounded transition-all ${activeTab === "crm" ? "bg-teal-700 text-[#faf9f5]" : "hover:text-zinc-855 hover:bg-zinc-200/60"}`}
            >
              CRM Ticket Router
            </button>
          </div>
        </div>

        {/* Active Tab View */}
        {activeTab === "sandbox" && (
          <div>
            {/* Presets row */}
            <div className="px-5 py-2.5 border-b border-zinc-150/70 bg-[#faf9f5]/30 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono mr-1.5">Presets:</span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(p.review)}
                  className="px-2 py-0.5 bg-white border border-zinc-200 hover:border-teal-700 text-zinc-650 hover:text-teal-850 text-[10px] font-medium rounded shadow-sm transition-all"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Side-by-Side Sandbox Request & Response Console */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-zinc-50/20">
              {/* Left Panel: Request config */}
              <div className="md:col-span-5 p-4 bg-white border border-zinc-200/80 rounded-lg shadow-sm flex flex-col justify-between space-y-3 h-[285px]">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-zinc-450 text-[9px] font-bold uppercase font-mono tracking-wider">
                    <span>Request Details</span>
                    <span className="text-teal-700">Client Simulation</span>
                  </div>

                  {/* Lock URL */}
                  <div className="flex rounded-md overflow-hidden border border-zinc-200 text-[11px] font-mono">
                    <span className="bg-zinc-100 text-zinc-600 px-2 py-1 font-bold border-r border-zinc-200">POST</span>
                    <span className="bg-white text-zinc-400 px-2 py-1 flex-1 overflow-x-auto whitespace-nowrap">
                      /api/reviews
                    </span>
                  </div>

                  {/* Headers key */}
                  <div className="space-y-0.5">
                    <label className="text-[8.5px] font-bold text-zinc-400 font-mono block">HEADERS</label>
                    <div className="flex gap-1.5 text-[11px] font-mono">
                      <input
                        type="text"
                        value="X-API-Key"
                        disabled
                        className="w-1/3 bg-zinc-100 border border-zinc-200 px-2 py-1 rounded text-zinc-500"
                      />
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-1 bg-white border border-zinc-200 px-2 py-1 rounded text-zinc-700 focus:outline-none focus:border-teal-700"
                        placeholder="demo-key"
                      />
                    </div>
                  </div>

                  {/* Textarea review */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[8.5px] font-bold text-zinc-400 font-mono">JSON BODY (review)</label>
                      <span className="text-[8px] text-zinc-450 font-mono">key: review</span>
                    </div>
                    <textarea
                      value={reviewInput}
                      onChange={(e) => setReviewInput(e.target.value)}
                      className="w-full h-16 p-2 bg-white border border-zinc-200 rounded text-[11px] focus:outline-none focus:border-teal-700 text-zinc-700 font-mono resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendRequest}
                  disabled={isSending || !reviewInput.trim()}
                  className="w-full h-8 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-[11px] font-bold rounded shadow transition-all flex items-center justify-center gap-1.5 font-sans"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Send API Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Panel: Response output */}
              <div className="md:col-span-7 bg-[#0c0c0e] border border-zinc-900 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between h-[285px]">
                {/* switcher tabs + Copy */}
                <div className="h-9 bg-zinc-950 px-4 border-b border-zinc-900/60 flex items-center justify-between text-zinc-550 font-mono text-[9.5px]">
                  <div className="flex gap-4.5">
                    <button
                      onClick={() => setResponseTab("pretty")}
                      className={`transition-colors ${responseTab === "pretty" ? "text-white font-bold" : "text-zinc-505 hover:text-zinc-350"}`}
                    >
                      Pretty JSON
                    </button>
                    <button
                      onClick={() => setResponseTab("ui")}
                      className={`transition-colors ${responseTab === "ui" ? "text-white font-bold" : "text-zinc-505 hover:text-zinc-350"}`}
                    >
                      UI Preview
                    </button>
                    <button
                      onClick={() => setResponseTab("raw")}
                      className={`transition-colors ${responseTab === "raw" ? "text-white font-bold" : "text-zinc-505 hover:text-white"}`}
                    >
                      Raw Output
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(JSON.stringify(analysisResult, null, 2), setCopiedResponse)}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedResponse ? <span>Copied</span> : <span>Copy Response</span>}
                  </button>
                </div>

                {/* Status header strip */}
                <div className="px-4 py-1.5 bg-zinc-950/40 border-b border-zinc-900/60 flex items-center justify-between text-zinc-550 text-[9.5px] font-mono">
                  <div className="flex gap-4">
                    <span>
                      STATUS:{" "}
                      {responseStatus === 200 ? (
                        <span className="text-emerald-400 font-bold">200 OK</span>
                      ) : responseStatus ? (
                        <span className="text-red-400 font-bold">{responseStatus} Error</span>
                      ) : (
                        <span>WAITING</span>
                      )}
                    </span>
                    {latency !== null && (
                      <span>
                        LATENCY: <span className="text-zinc-300">{latency}ms</span>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isCached && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold">
                        Cache Hit
                      </span>
                    )}
                    <span>
                      LIMIT: <span className="text-zinc-300 font-bold">{creditsRemaining}/100</span>
                    </span>
                  </div>
                </div>

                {/* Response content view */}
                <div className="p-4 overflow-y-auto flex-1 bg-[#050507] scrollbar-thin select-all">
                  {isSending ? (
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs py-4">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Simulating Gemini parser response...</span>
                    </div>
                  ) : responseTab === "pretty" ? (
                    renderJSONResponse(analysisResult)
                  ) : responseTab === "ui" && analysisResult ? (
                    <div className="text-zinc-350 text-[10.5px] space-y-3 animate-fade-in duration-300">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${analysisResult.sentiment === "positive"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : analysisResult.sentiment === "negative"
                            ? "bg-red-500/15 text-red-400 border border-red-500/20"
                            : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"}`}>
                          {analysisResult.sentiment}
                        </span>
                        <span className="text-zinc-500 font-mono text-[8.5px]">
                          DETECTED LANG: {analysisResult.feedback_language.toUpperCase()}
                        </span>
                      </div>

                      {analysisResult.translation && (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300 text-[9.5px] italic">
                          "{analysisResult.translation}"
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <span className="text-zinc-500 font-mono text-[8px] uppercase block">Summary</span>
                        <p className="text-zinc-200 font-semibold leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1">
                          <span className="text-emerald-400 font-mono text-[8px] uppercase block">Pros</span>
                          <div className="space-y-0.5 text-zinc-300">
                            {analysisResult.pros.map((p, i) => (
                              <div key={i} className="flex gap-1 items-center truncate">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span className="truncate">{p}</span>
                              </div>
                            ))}
                            {analysisResult.pros.length === 0 && <span className="text-zinc-500 italic">None</span>}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-red-455 font-mono text-[8px] uppercase block">Cons</span>
                          <div className="space-y-0.5 text-zinc-300 font-medium">
                            {analysisResult.cons.map((c, i) => (
                              <div key={i} className="flex gap-1 items-center truncate">
                                <span className="text-red-500 font-bold">•</span>
                                <span className="truncate">{c}</span>
                              </div>
                            ))}
                            {analysisResult.cons.length === 0 && <span className="text-zinc-500 italic">None</span>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-zinc-900/40">
                        <div className="flex justify-between items-center">
                          <span className="text-teal-400 font-mono text-[8px] uppercase block font-bold">Suggested Response Draft</span>
                          <button
                            onClick={() => handleCopy(analysisResult.replay, setCopiedReply)}
                            className="text-zinc-500 hover:text-white flex items-center gap-1 font-mono text-[8px] transition-colors"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            {copiedReply ? "Copied" : "Copy Reply"}
                          </button>
                        </div>
                        <div className="p-2 bg-teal-950/30 border border-teal-900/40 rounded text-teal-200 text-[9.5px] leading-relaxed font-sans select-all">
                          {analysisResult.replay}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-900 text-[8.5px] font-mono text-zinc-550 flex justify-between">
                        <span>Confidence: {analysisResult.confidence_score * 100}%</span>
                        <span className={analysisResult.customer_repeats ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
                          {analysisResult.customer_repeats ? "Likely Repeat Customer" : "One-Time Purchase"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <pre className="font-mono text-[10px] text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
                      {analysisResult ? JSON.stringify(analysisResult) : "// Waiting for API request trigger."}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "product" && (
          <div className="p-4 bg-white flex flex-col justify-between text-xs text-zinc-850 h-[285px] border-t border-zinc-200 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-zinc-100 pb-2">
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide font-mono">Product Detail Widget Integration</span>
                  <h4 className="font-bold text-zinc-900 text-sm mt-0.5">Aura Soundbar Pro</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 font-bold font-mono text-[10.5px]">
                  ★★★★★ 4.8
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-zinc-450 uppercase tracking-wider block font-mono">Structured Review Summary</span>
                <p className="text-zinc-700 italic leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-150 text-[11px]">
                  "{MOCK_USE_CASE_DATA.product.summary}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-0.5">
                <div className="space-y-1">
                  <span className="text-[8.5px] font-bold text-emerald-700 uppercase tracking-wider block font-mono">Pros Checklist</span>
                  <div className="space-y-1 text-zinc-650 font-semibold text-[11px]">
                    {MOCK_USE_CASE_DATA.product.pros.map((p, i) => (
                      <div key={i} className="flex gap-1 items-center font-medium">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] font-bold text-red-700 uppercase tracking-wider block font-mono">Cons Checklist</span>
                  <div className="space-y-1 text-zinc-650 font-semibold text-[11px]">
                    {MOCK_USE_CASE_DATA.product.cons.map((c, i) => (
                      <div key={i} className="flex gap-1 items-center font-medium">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-zinc-100">
                <span className="text-[8.5px] font-bold text-teal-700 uppercase tracking-wider block font-mono">Suggested Reply</span>
                <div className="bg-teal-50/50 border border-teal-200/60 p-2 rounded text-[10.5px] text-teal-900 leading-relaxed font-sans">
                  "{MOCK_USE_CASE_DATA.product.replay}"
                </div>
              </div>
            </div>

            <div className="text-[9px] text-zinc-400 font-mono border-t border-zinc-100 pt-2 flex justify-between">
              <span>Input Language Detected: {MOCK_USE_CASE_DATA.product.language}</span>
              <span>Rendered directly on client pages</span>
            </div>
          </div>
        )}

        {activeTab === "slack" && (
          <div className="p-4 bg-[#1a1d21] h-[285px] flex flex-col justify-between font-sans text-xs text-zinc-350 border-t border-zinc-800 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-zinc-455 text-[9.5px] font-mono">
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  #alerts-reviews
                </span>
                <span>Slack Webhook Integration</span>
              </div>

              <div className="flex gap-2.5 items-start leading-normal pt-0.5">
                <div className="w-7 h-7 rounded bg-teal-850 text-[#faf9f5] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  RG
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-zinc-100 text-[11px]">RevGAPI Bot</span>
                    <span className="text-zinc-555 text-[8px] font-mono">APP 12:04 PM</span>
                  </div>

                  <div className="bg-[#222529] p-2.5 rounded border border-zinc-800 space-y-1 text-[10px]">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                      <span className="px-1.5 py-0.2 rounded text-[7.5px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        {MOCK_USE_CASE_DATA.slack.sentiment.toUpperCase()} FEEDBACK
                      </span>
                      <span className="text-zinc-555 text-[8px] font-mono">Confidence: {MOCK_USE_CASE_DATA.slack.confidence * 100}%</span>
                    </div>

                    <p className="text-zinc-200 italic leading-snug">"{MOCK_USE_CASE_DATA.slack.review}"</p>

                    {MOCK_USE_CASE_DATA.slack.cons.length > 0 && (
                      <div className="text-red-400 font-semibold text-[9px] pt-0.5">
                        Issues: {MOCK_USE_CASE_DATA.slack.cons.join(", ")}
                      </div>
                    )}

                    <div className="mt-1.5 pt-1.5 border-t border-zinc-800/60">
                      <span className="text-teal-400 font-mono text-[8px] uppercase block font-bold">Suggested Reply</span>
                      <p className="text-zinc-300 text-[9.5px] leading-relaxed mt-0.5 font-sans">
                        "{MOCK_USE_CASE_DATA.slack.replay}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-zinc-555 text-[8px] font-mono text-right border-t border-zinc-800 pt-2">
              Action: Dispatch webhook payloads instantly.
            </div>
          </div>
        )}

        {activeTab === "crm" && (
          <div className="p-4 bg-white h-[285px] flex flex-col justify-between text-xs text-zinc-855 border-t border-zinc-200 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-1.5">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide font-mono">Helpdesk Ticket Router</span>
                <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-650 text-[9px] font-mono font-bold">
                  TICKET #48102
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Inbound Support Ticket</span>
                <p className="text-zinc-700 italic text-[11px] leading-relaxed">
                  "{MOCK_USE_CASE_DATA.crm.review}"
                </p>
              </div>

              <div className="p-2 bg-zinc-50 rounded border border-zinc-200/50 space-y-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Sentiment:</span>
                  <span className="font-extrabold text-red-700">NEGATIVE</span>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-150 pt-1">
                  <span className="text-zinc-500">Auto-Routing:</span>
                  <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[8.5px] border bg-red-50 text-red-700 border-red-200">
                    🔴 URGENT HELP MANAGER QUEUE
                  </span>
                </div>

                <div className="border-t border-zinc-150 pt-1.5 space-y-0.5">
                  <span className="text-zinc-400 text-[8.5px] font-mono block">Draft Response</span>
                  <p className="text-zinc-700 text-[10px] leading-relaxed italic bg-white p-1.5 rounded border border-zinc-100">
                    "{MOCK_USE_CASE_DATA.crm.replay}"
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-zinc-500 font-semibold border-t border-zinc-100 pt-2">
              ✓ Upgraded automatically by RevGAPI sentiment parser triggers.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
