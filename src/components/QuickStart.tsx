"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";

export function QuickStart() {
  const [sdkTab, setSdkTab] = useState<"js" | "python" | "go" | "curl">("js");
  const [copiedSdk, setCopiedSdk] = useState(false);

  const getSdkSnippet = () => {
    if (sdkTab === "js") {
      return `// JavaScript (using native Fetch API)
const response = await fetch("https://api.revgapi.com/v1/reviews/agent-review", {
  method: "POST",
  headers: {
    "X-API-Key": "your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    review: "Terrible! L'appareil chauffe trop..."
  })
});

const analysis = await response.json();
console.log(analysis.sentiment); // "negative"
console.log(analysis.replay);    // "Bonjour, nous sommes désolés..."`;
    } else if (sdkTab === "python") {
      return `# Python (using native requests library)
import requests

response = requests.post(
    "https://api.revgapi.com/v1/reviews/agent-review",
    headers={
        "X-API-Key": "your_api_key",
        "Content-Type": "application/json"
    },
    json={
        "review": "Terrible! L'appareil chauffe trop..."
    }
)

analysis = response.json()
print(analysis["sentiment"])  # "negative"
print(analysis["replay"])     # "Bonjour, nous sommes désolés..."`;
    } else if (sdkTab === "go") {
      return `// GoLang (using standard net/http)
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    payload := map[string]string{"review": "Terrible! L'appareil chauffe trop..."}
    body, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://api.revgapi.com/v1/reviews/agent-review", bytes.NewBuffer(body))
    req.Header.Set("X-API-Key", "your_api_key")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["sentiment"]) // "negative"
}`;
    } else {
      return `curl -X POST "https://api.revgapi.com/v1/reviews/agent-review" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "review": "Terrible! L'\''appareil chauffe trop..."
  }'`;
    }
  };

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sdk" className="max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-zinc-200/60 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">Quick Integration</h2>
        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight font-heading">Integrate in seconds with standard HTTP requests</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Submit raw reviews directly to our API endpoint using your API key. No custom SDK libraries required — integrate using native fetch or requests constructs in any language.
        </p>
      </div>

      {/* Quickstart Tab Panel Console */}
      <div className="border border-zinc-200/80 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Tab buttons */}
        <div className="h-10 bg-zinc-50 px-4 border-b border-zinc-200 flex items-center justify-between text-zinc-500 font-mono text-[10px]">
          <div className="flex gap-4 font-semibold">
            {(["js", "python", "go", "curl"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSdkTab(tab)}
                className={`transition-colors ${
                  sdkTab === tab
                    ? "text-teal-700 font-bold border-b border-teal-700 py-2.5"
                    : "text-zinc-500 hover:text-zinc-855"
                }`}
              >
                {tab === "js"
                  ? "JavaScript (Fetch)"
                  : tab === "python"
                    ? "Python (Requests)"
                    : tab === "go"
                      ? "GoLang (net/http)"
                      : "cURL"}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopy(getSdkSnippet(), setCopiedSdk)}
            className="hover:text-teal-700 flex items-center gap-1.5 transition-colors text-zinc-500 font-semibold"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedSdk ? <span>Copied!</span> : <span>Copy Snippet</span>}
          </button>
        </div>

        {/* Code panel body */}
        <pre className="p-5 text-[11px] font-mono text-zinc-700 leading-relaxed bg-[#faf9f5]/40 select-all max-h-[200px]">
          {getSdkSnippet()}
        </pre>
      </div>
    </section>
  );
}
