"use client";
 
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Key,
  CreditCard,
  User,
  BookOpen,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Building,
  Sparkles,
  MessageSquareCode,
  Terminal as TerminalIcon,
  Lock,
  Upload
} from "lucide-react";
import { toast } from "sonner";

// Tab types
type TabId = "profile" | "api" | "docs" | "plans" | "password";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  visible: boolean;
}

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("api");
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [sdkTab, setSdkTab] = useState<"js" | "python" | "go" | "curl">("js");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
    toast.success("Profile photo removed!");
  };

  // Profile State
  const [profile, setProfile] = useState({
    name: "Marcus Thompson",
    email: "marcus.thompson@route-x.io",
    company: "RouteX Solutions Ltd.",
    role: "Platform Administrator",
    joined: "March 14, 2026",
    avatarUrl: ""
  });

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: "key_1",
      name: "Production API Key",
      key: "rg_live_9f8c6e2d1a3b4c5e6f7a8b9c0d1e2f3a",
      created: "2026-03-15",
      lastUsed: "2 minutes ago",
      visible: false
    },
    {
      id: "key_2",
      name: "Testing / Staging Key",
      key: "rg_test_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      created: "2026-04-10",
      lastUsed: "Yesterday",
      visible: false
    }
  ]);

  const [newKeyName, setNewKeyName] = useState("");

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(
      apiKeys.map((k) => (k.id === id ? { ...k, visible: !k.visible } : k))
    );
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the key");
      return;
    }

    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newKeyVal = `rg_live_${randomHex}`;

    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: newKeyVal,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      visible: false
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    toast.success("New API key generated successfully!");
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    setShowRevokeModal(null);
    toast.success("API key revoked and deleted!");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getSdkSnippet = () => {
    const activeKeyStr = apiKeys[0]?.key || "your_api_key";

    if (sdkTab === "js") {
      return `// JavaScript (using native Fetch API)
const response = await fetch("https://api.revgapi.com/v1/reviews/agent-review", {
  method: "POST",
  headers: {
    "X-API-Key": "${activeKeyStr}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    review: "Excelente sonido pero no incluye baterías para el control remoto."
  })
});

const analysis = await response.json();
console.log(analysis.sentiment);        // "neutral"
console.log(analysis.feedback_language); // "Spanish"`;
    } else if (sdkTab === "python") {
      return `# Python (using native requests library)
import requests

response = requests.post(
    "https://api.revgapi.com/v1/reviews/agent-review",
    headers={
        "X-API-Key": "${activeKeyStr}",
        "Content-Type": "application/json"
    },
    json={
        "review": "Excelente sonido pero no incluye baterías para el control remoto."
    }
)

analysis = response.json()
print(analysis["sentiment"])        # "neutral"
print(analysis["feedback_language"]) # "Spanish"`;
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
    payload := map[string]string{
        "review": "Excelente sonido pero no incluye baterías para el control remoto.",
    }
    body, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://api.revgapi.com/v1/reviews/agent-review", bytes.NewBuffer(body))
    req.Header.Set("X-API-Key", "${activeKeyStr}")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["sentiment"]) // "neutral"
}`;
    } else {
      return `curl -X POST "https://api.revgapi.com/v1/reviews/agent-review" \\
  -H "X-API-Key: ${activeKeyStr}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "review": "Excelente sonido pero no incluye baterías para el control remoto."
  }'`;
    }
  };

  return (
    <div className="bg-[#faf9f5] text-zinc-900 min-h-screen font-sans antialiased selection:bg-teal-100 selection:text-teal-900 flex flex-col justify-between relative overflow-hidden">
      {/* Background gradients and blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-teal-200/15 to-emerald-250/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-amber-100/20 to-teal-100/10 blur-[100px] pointer-events-none -z-10" />

      {/* Unified Dashboard Header Bar */}
      <header className="border-b border-zinc-200/50 bg-[#faf9f5]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-5 h-5 rounded bg-teal-700 flex items-center justify-center shadow-sm">
              <MessageSquareCode className="w-3.5 h-3.5 text-[#faf9f5]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 font-heading">
              RevGAPI Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-[10.5px] font-bold text-teal-700 uppercase tracking-wider font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200/55">
              Pro Tier
            </span>
            <div className="h-6 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-7 h-7 rounded-full object-cover shadow-sm border border-zinc-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px] shadow-sm uppercase select-none">
                  {profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
              )}
              <span className="text-xs font-semibold text-zinc-700 hidden sm:inline">
                {profile.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col md:flex-row gap-6 relative z-10">

        {/* Left Side: Sidebar Navigation Options */}
        <aside className="w-full md:w-60 shrink-0 flex flex-col gap-2">

          <div className="px-3.5 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">
            API Console
          </div>

          <button
            onClick={() => setActiveTab("api")}
            className={`w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border ${activeTab === "api"
              ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-teal-800"
              }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </button>

          <button
            onClick={() => setActiveTab("docs")}
            className={`w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border ${activeTab === "docs"
              ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-teal-800"
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>API Documentation</span>
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className={`w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border ${activeTab === "plans"
              ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-teal-800"
              }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Plans</span>
          </button>

          <div className="px-3.5 py-1 mt-4 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">
            Account Settings
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border ${activeTab === "profile"
              ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-teal-800"
              }`}
          >
            <User className="w-4 h-4" />
            <span>User Profile Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border ${activeTab === "password"
              ? "bg-teal-700 border-teal-700 text-[#faf9f5]"
              : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-teal-800"
              }`}
          >
            <Lock className="w-4 h-4" />
            <span>Update Password</span>
          </button>

          <div className="h-px bg-zinc-200 my-3" />

          <Link
            href="/"
            className="w-full h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 shadow-sm border bg-white border-zinc-200 text-zinc-650 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </aside>

        {/* Right Side: Active Workspace Console Display */}
        <section className="flex-grow bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[460px]">

          {/* TAB 1: User Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">
                  UserProfile Settings
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Manage your personal details, corporate attributes, and password settings.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl animate-fade-in">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover shadow-sm border border-zinc-300 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm uppercase select-none flex-shrink-0">
                    {profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                )}
                
                <div className="space-y-2 flex-grow">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800">Profile Photo</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                      PNG, JPG, or WEBP formats accepted. Size limit is 2MB.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="h-8 px-3.5 bg-white border border-zinc-200 text-zinc-650 hover:text-teal-700 hover:border-teal-350 text-[11px] font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                    </button>
                    {profile.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="h-8 px-3.5 bg-rose-50 border border-rose-200 text-rose-650 hover:bg-rose-100 hover:text-rose-700 text-[11px] font-bold rounded-lg shadow-sm transition-all"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-zinc-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">Company / Team</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 bg-teal-50/45 border border-teal-200/50 rounded-xl flex gap-3 items-start mt-6">
                <Building className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-teal-900">Corporate Member Information</p>
                  <p className="text-[10.5px] text-teal-850 leading-relaxed font-medium">
                    Your account belongs to the **RouteX Solutions Ltd.** organization profile. Joined on {profile.joined}.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => toast.success("Profile details saved successfully!")}
                  className="h-8 px-4 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow-sm transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Update Password Form */}
          {activeTab === "password" && (
            <div className="space-y-6 animate-fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">
                  Update Password
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Enter your current password and set a new secure password.
                </p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-2 border-t border-zinc-100 max-w-sm">
                <div className="space-y-1">
                  <label htmlFor="current_password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new_password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                    New Password
                  </label>
                  <input
                    id="new_password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirm_password" className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-semibold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-8.5 px-4.5 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow-sm transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: API Keys */}
          {activeTab === "api" && (
            <div className="space-y-6 animate-fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">
                  API Keys
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Generate, copy, and manage your access tokens to communicate with the RevGAPI engines. Keep your keys secret.
                </p>
              </div>

              {/* API Keys List */}
              <div className="space-y-4 pt-2 border-t border-zinc-100">
                {apiKeys.map((k) => (
                  <div
                    key={k.id}
                    className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <p className="text-xs font-bold text-zinc-800">{k.name}</p>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[8.5px] font-bold ${k.id.includes("test")
                          ? "bg-amber-50 border border-amber-200 text-amber-700"
                          : "bg-teal-50 border border-teal-200 text-teal-700"
                          }`}>
                          {k.id.includes("test") ? "TEST KEY" : "LIVE KEY"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 pt-1">
                        <input
                          type={k.visible ? "text" : "password"}
                          value={k.key}
                          readOnly
                          className="bg-transparent focus:outline-none select-all min-w-0 flex-grow font-semibold text-zinc-660"
                        />
                        <button
                          onClick={() => toggleKeyVisibility(k.id)}
                          className="hover:text-teal-700 p-0.5 transition-colors"
                        >
                          {k.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <p className="text-[10px] text-zinc-455">
                        Created: {k.created} · Last active: <span className="font-semibold">{k.lastUsed}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyText(k.key, k.name)}
                        className="h-7 px-2.5 bg-white border border-zinc-200 text-zinc-650 hover:text-teal-700 text-[11px] font-semibold rounded shadow-sm transition-all flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => setShowRevokeModal(k.id)}
                        className="h-7 px-2.5 bg-rose-50 border border-rose-200 text-rose-650 hover:bg-rose-100 hover:text-rose-700 text-[11px] font-semibold rounded shadow-sm transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Revoke</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate Key Form */}
              <div className="pt-4 border-t border-zinc-150">
                <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="E.g., Staging Webhooks Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-grow px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-teal-700 font-medium"
                  />
                  <button
                    type="submit"
                    className="h-8.5 px-4 bg-teal-700 hover:bg-teal-800 text-[#faf9f5] text-xs font-bold rounded shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Generate API Key</span>
                  </button>
                </form>
              </div>

              {/* Revoke Key Modal Confirmation */}
              {showRevokeModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 max-w-sm w-full shadow-lg space-y-4">
                    <h4 className="font-bold text-sm text-zinc-900 font-heading">Revoke API Key?</h4>
                    <p className="text-xs text-zinc-555 leading-relaxed">
                      Are you absolutely sure you want to revoke this API key? Applications using this key will immediately receive **401 Unauthorized** errors. This action is irreversible.
                    </p>
                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        onClick={() => setShowRevokeModal(null)}
                        className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-650 hover:bg-zinc-200 text-xs font-bold rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRevokeKey(showRevokeModal)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-sm"
                      >
                        Yes, Revoke Key
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: API Reference / Docs */}
          {activeTab === "docs" && (
            <div className="space-y-6 animate-fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">
                  API Documentation
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Integrate RevGAPI into your application flow using standard HTTP POST requests.
                </p>
              </div>

              {/* Endpoint Detail Card */}
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider">
                  <span>API Endpoint</span>
                  <span className="text-teal-700">HTTPS POST</span>
                </div>

                <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-zinc-200 text-[11px] font-mono shadow-sm bg-white">
                  <span className="bg-teal-700 text-white px-3 py-2 font-bold flex items-center justify-center">
                    POST
                  </span>
                  <span className="px-3 py-2 text-zinc-700 overflow-x-auto whitespace-nowrap flex-grow font-semibold flex items-center">
                    https://api.revgapi.com/v1/reviews/agent-review
                  </span>
                  <button
                    onClick={() => handleCopyText("https://api.revgapi.com/v1/reviews/agent-review", "API Endpoint")}
                    className="bg-zinc-50 border-t sm:border-t-0 sm:border-l border-zinc-200 text-zinc-600 hover:text-teal-700 px-3 py-2 flex items-center justify-center transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Headers */}
                <div className="p-4 border border-zinc-200 rounded-xl bg-white space-y-3 shadow-sm">
                  <h4 className="text-xs font-extrabold text-zinc-800 font-mono uppercase tracking-wider border-b border-zinc-100 pb-1.5">
                    HTTP Headers
                  </h4>
                  <table className="w-full text-[10.5px] border-collapse">
                    <tbody>
                      <tr className="border-b border-zinc-100 last:border-0">
                        <td className="py-2 pr-4 font-mono font-bold text-teal-700">X-API-Key</td>
                        <td className="py-2 text-zinc-500 font-medium">Your secret API key (generated under API Keys).</td>
                      </tr>
                      <tr className="border-b border-zinc-100 last:border-0">
                        <td className="py-2 pr-4 font-mono font-bold text-teal-700">Content-Type</td>
                        <td className="py-2 text-zinc-650 font-mono">application/json</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Request Payload */}
                <div className="p-4 border border-zinc-200 rounded-xl bg-white space-y-3 shadow-sm">
                  <h4 className="text-xs font-extrabold text-zinc-800 font-mono uppercase tracking-wider border-b border-zinc-100 pb-1.5">
                    JSON Body Parameters
                  </h4>
                  <table className="w-full text-[10.5px] border-collapse">
                    <tbody>
                      <tr className="border-b border-zinc-100 last:border-0">
                        <td className="py-2 pr-4 font-mono font-bold text-teal-700">review</td>
                        <td className="py-2 text-zinc-500 font-medium">
                          <span className="font-bold text-rose-500 font-mono text-[9px] border bg-rose-50 px-1 py-0.2 rounded mr-1">Required</span>
                          String content of the customer review to analyze.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Integration Switcher Console */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white">
                <div className="h-10 bg-zinc-50 px-4 border-b border-zinc-200 flex items-center justify-between text-zinc-500 font-mono text-[10px]">
                  <div className="flex gap-4 font-semibold">
                    {(["js", "python", "go", "curl"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSdkTab(tab)}
                        className={`transition-colors py-2.5 border-b ${sdkTab === tab
                          ? "text-teal-700 font-bold border-teal-750"
                          : "text-zinc-500 border-transparent hover:text-zinc-800"
                          }`}
                      >
                        {tab === "js"
                          ? "JavaScript"
                          : tab === "python"
                            ? "Python"
                            : tab === "go"
                              ? "GoLang"
                              : "cURL"}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyText(getSdkSnippet(), "Code Snippet")}
                    className="hover:text-teal-750 flex items-center gap-1.5 transition-colors text-zinc-500 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>

                <pre className="p-4 text-[10.5px] font-mono text-zinc-700 leading-relaxed bg-[#faf9f5]/40 select-all overflow-x-auto max-h-[200px]">
                  {getSdkSnippet()}
                </pre>
              </div>

              {/* Response Schema Info */}
              <div className="p-4 border border-zinc-200 rounded-xl bg-white space-y-3.5 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800">Response Object Fields</h4>
                  <p className="text-[10px] text-zinc-400">The returned JSON includes the following analyzed keys:</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10.5px] font-mono">
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">feedback_language</span>: Language detected automatically.
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">translation</span>: Text translated to English (or null if already English).
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">sentiment</span>: sentiment score ("positive", "negative", "neutral").
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">summary</span>: A short one-line summary of key feedback.
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">pros / cons</span>: Extracted arrays of positive and negative points.
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-150 rounded">
                    <span className="text-teal-750 font-bold">replay</span>: An AI drafted responder reply translated into the customer's native language.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Subscription Tiers & Plans */}
          {activeTab === "plans" && (
            <div className="space-y-6 animate-fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight font-heading">
                  Plans & billing
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Select the credit limits and response times that align with your API requirements.
                </p>
              </div>

              {/* Plan cards list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-zinc-100">

                {/* Free tier */}
                <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-zinc-400 font-mono uppercase">Sandbox</span>
                    <h4 className="font-extrabold text-lg text-zinc-800 font-heading">Free Tier</h4>
                    <p className="text-3xl font-extrabold font-heading text-zinc-900">$0</p>
                    <p className="text-[10.5px] text-zinc-455">Best for personal projects & local testing.</p>
                  </div>
                  <ul className="text-[11px] text-zinc-600 space-y-2 border-t border-zinc-100 pt-3">
                    <li className="flex items-center gap-1.5">✓ 1,000 requests / month</li>
                    <li className="flex items-center gap-1.5">✓ Basic English sentiment</li>
                    <li className="flex items-center gap-1.5">✓ Native translation</li>
                    <li className="flex items-center gap-1.5">✕ SLA Latency guarantee</li>
                  </ul>
                  <button
                    disabled
                    className="w-full h-8 border border-zinc-200 text-zinc-400 text-xs font-bold rounded-lg cursor-not-allowed"
                  >
                    Included in tier
                  </button>
                </div>

                {/* Pro Tier (Active) */}
                <div className="border-2 border-teal-650 rounded-2xl p-5 bg-white relative space-y-4 flex flex-col justify-between shadow-md">
                  <span className="absolute top-0 right-5 -translate-y-1/2 bg-teal-700 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 rounded shadow">
                    Active Plan
                  </span>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-teal-700 font-mono uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Recommended
                    </span>
                    <h4 className="font-extrabold text-lg text-zinc-800 font-heading">Pro Tier</h4>
                    <p className="text-3xl font-extrabold font-heading text-zinc-900">$49<span className="text-xs font-semibold text-zinc-500 font-sans">/mo</span></p>
                    <p className="text-[10.5px] text-zinc-450">Perfect for SaaS projects & active production.</p>
                  </div>
                  <ul className="text-[11px] text-zinc-600 space-y-2 border-t border-zinc-100 pt-3">
                    <li className="flex items-center gap-1.5 font-semibold text-teal-750">✓ 100,000 requests / month</li>
                    <li className="flex items-center gap-1.5">✓ Multilingual structures (50+)</li>
                    <li className="flex items-center gap-1.5">✓ Webhook telemetry alerts</li>
                    <li className="flex items-center gap-1.5">✓ SLA Response Guarantee</li>
                  </ul>
                  <button
                    disabled
                    className="w-full h-8 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold rounded-lg cursor-default"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Scale Tier */}
                <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-zinc-400 font-mono uppercase">Scale Enterprise</span>
                    <h4 className="font-extrabold text-lg text-zinc-800 font-heading">Scale Business</h4>
                    <p className="text-3xl font-extrabold font-heading text-zinc-900">$199<span className="text-xs font-semibold text-zinc-500 font-sans">/mo</span></p>
                    <p className="text-[10.5px] text-zinc-450">Designed for large databases & marketplaces.</p>
                  </div>
                  <ul className="text-[11px] text-zinc-600 space-y-2 border-t border-zinc-100 pt-3">
                    <li className="flex items-center gap-1.5">✓ 1,000,000 requests / month</li>
                    <li className="flex items-center gap-1.5">✓ Custom models integrations</li>
                    <li className="flex items-center gap-1.5">✓ Dedicated analytics cluster</li>
                    <li className="flex items-center gap-1.5">✓ 24/7 Priority Engineer SLA</li>
                  </ul>
                  <button
                    onClick={() => toast.success("Upgrade request sent! Our billing representative will contact you in 2 hours.")}
                    className="w-full h-8 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                  >
                    Upgrade Plan
                  </button>
                </div>

              </div>
            </div>
          )}

        </section>
      </main>

      {/* Minimalist Dashboard Footer */}
      <footer className="border-t border-zinc-200/60 bg-white py-6 text-xs text-zinc-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-teal-700 flex items-center justify-center">
              <MessageSquareCode className="w-2.5 h-2.5 text-[#faf9f5]" />
            </div>
            <span className="font-bold text-zinc-900 font-mono text-xs">RevGAPI Suite</span>
          </div>
          <p>© {new Date().getFullYear()} RevGAPI. All rights reserved by Routex.</p>
        </div>
      </footer>
    </div>
  );
}
