"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HealthCheck {
  timestamp: number;
  status: "UP" | "DOWN";
  responseTime: number;
  error?: string;
}

interface Incident {
  id: string;
  start: number;
  end?: number;
  duration?: number;
}

interface Stats {
  invoices: number;
  payments: { total: number; pro: number; business: number };
  revenue: number;
}

export default function MonitoringPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [currentStatus, setCurrentStatus] = useState<"UP" | "DOWN" | "UNKNOWN">("UNKNOWN");
  const [recentChecks, setRecentChecks] = useState<HealthCheck[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<Stats>({ invoices: 0, payments: { total: 0, pro: 0, business: 0 }, revenue: 0 });
  const [uptime, setUptime] = useState({ h24: 0, d7: 0, d30: 0 });
  const [avgResponse, setAvgResponse] = useState({ h24: 0, d7: 0, d30: 0 });

  useEffect(() => {
    const storedPassword = localStorage.getItem("admin_password");
    if (storedPassword) setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_password", password);
        setAuthed(true);
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("Login failed");
    }
  };

  useEffect(() => {
    if (!authed) return;
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  async function fetchData() {
    setLoading(true);
    try {
      // Pass admin password from localStorage as auth header
      const storedPassword = localStorage.getItem("admin_password");
      const headers: Record<string, string> = {};
      if (storedPassword) headers["x-admin-password"] = storedPassword;

      const res = await fetch("/api/admin/monitoring-data", { headers });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_password");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setCurrentStatus(data.currentStatus || "UNKNOWN");
      setRecentChecks(data.recentChecks || []);
      setIncidents(data.incidents || []);
      setStats(data.stats || { invoices: 0, payments: { total: 0, pro: 0, business: 0 }, revenue: 0 });
      setUptime(data.uptime || { h24: 0, d7: 0, d30: 0 });
      setAvgResponse(data.avgResponse || { h24: 0, d7: 0, d30: 0 });
    } catch (err) {
      console.error("Failed to fetch monitoring data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#171717] border border-[#262626]">
              <span className="text-lg font-bold text-white">I</span>
            </div>
            <h1 className="text-xl font-semibold text-white">Admin Access</h1>
            <p className="mt-1 text-sm text-[#8a8a8a]">Invoice In 60 — Monitoring</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 bg-[#171717] border border-[#262626] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#3d3d3d] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-white transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-[#e5e5e5] transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717] border border-[#262626] text-sm font-bold">
                I
              </div>
              <span className="font-semibold">Invoice In 60</span>
            </Link>
            <span className="text-[#555]">/</span>
            <span className="text-[#8a8a8a]">Monitoring</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="text-sm text-[#8a8a8a] hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => { localStorage.removeItem("admin_token"); localStorage.removeItem("admin_password"); setPassword(""); setShowPassword(false); setAuthed(false); }}
              className="text-sm text-[#8a8a8a] hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
        {/* Status Banner */}
        <div className={`rounded-2xl border p-6 ${
          currentStatus === "UP"
            ? "border-emerald-500/20 bg-emerald-500/5"
            : currentStatus === "DOWN"
            ? "border-red-500/20 bg-red-500/5"
            : "border-[#262626] bg-[#171717]"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`h-3 w-3 rounded-full ${
              currentStatus === "UP" ? "bg-emerald-400" : currentStatus === "DOWN" ? "bg-red-400 animate-pulse" : "bg-yellow-400"
            }`} />
            <div>
              <h2 className="text-lg font-semibold">
                {currentStatus === "UP" ? "All Systems Operational" : currentStatus === "DOWN" ? "System Down" : "Status Unknown"}
              </h2>
              <p className="text-sm text-[#8a8a8a]">
                {currentStatus === "UP" ? "All checks passed in the last 5 minutes" : currentStatus === "DOWN" ? "Health checks failing" : "Checking status..."}
              </p>
            </div>
          </div>
        </div>

        {/* Uptime & Response Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "24h Uptime", value: `${uptime.h24}%`, color: uptime.h24 >= 99 ? "text-emerald-400" : uptime.h24 >= 95 ? "text-yellow-400" : "text-red-400" },
            { label: "7d Uptime", value: `${uptime.d7}%`, color: uptime.d7 >= 99 ? "text-emerald-400" : uptime.d7 >= 95 ? "text-yellow-400" : "text-red-400" },
            { label: "30d Uptime", value: `${uptime.d30}%`, color: uptime.d30 >= 99 ? "text-emerald-400" : uptime.d30 >= 95 ? "text-yellow-400" : "text-red-400" },
            { label: "24h Avg Response", value: `${avgResponse.h24}ms`, color: avgResponse.h24 < 1000 ? "text-emerald-400" : avgResponse.h24 < 3000 ? "text-yellow-400" : "text-red-400" },
            { label: "7d Avg Response", value: `${avgResponse.d7}ms`, color: avgResponse.d7 < 1000 ? "text-emerald-400" : avgResponse.d7 < 3000 ? "text-yellow-400" : "text-red-400" },
            { label: "30d Avg Response", value: `${avgResponse.d30}ms`, color: avgResponse.d30 < 1000 ? "text-emerald-400" : avgResponse.d30 < 3000 ? "text-yellow-400" : "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#262626] bg-[#171717] p-4">
              <p className="text-xs text-[#8a8a8a] mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Response Time Chart */}
        <div className="rounded-2xl border border-[#262626] bg-[#171717] p-6">
          <h3 className="text-sm font-semibold text-[#8a8a8a] mb-4">Response Time — Last 50 Checks</h3>
          <ResponseTimeChart checks={recentChecks.slice(-50)} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Invoices", value: stats.invoices.toLocaleString(), icon: "📄" },
            { label: "Total Payments", value: stats.payments.total.toString(), icon: "💳" },
            { label: "Pro Payments", value: stats.payments.pro.toString(), icon: "✨" },
            { label: "Est. Revenue", value: `$${stats.revenue}`, icon: "💰" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#262626] bg-[#171717] p-4">
              <p className="text-xs text-[#8a8a8a] mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Checks */}
          <div className="rounded-2xl border border-[#262626] bg-[#171717] p-6">
            <h3 className="text-sm font-semibold text-[#8a8a8a] mb-4">Recent Health Checks</h3>
            <div className="space-y-2">
              {recentChecks.slice(-20).reverse().map((check, i) => (
                <div key={check.timestamp + i} className="flex items-center justify-between py-2 border-b border-[#262626] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${check.status === "UP" ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className="text-xs text-[#8a8a8a]">{new Date(check.timestamp).toLocaleTimeString()}</span>
                    <span className={`text-xs font-mono ${check.status === "UP" ? "text-emerald-400" : "text-red-400"}`}>
                      {check.status}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${
                    check.responseTime < 1000 ? "text-[#8a8a8a]" : check.responseTime < 3000 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {check.responseTime}ms
                  </span>
                </div>
              ))}
              {recentChecks.length === 0 && <p className="text-sm text-[#555] text-center py-4">No checks yet</p>}
            </div>
          </div>

          {/* Incidents */}
          <div className="rounded-2xl border border-[#262626] bg-[#171717] p-6">
            <h3 className="text-sm font-semibold text-[#8a8a8a] mb-4">Incidents</h3>
            <div className="space-y-3">
              {incidents.length === 0 && <p className="text-sm text-[#555] text-center py-4">No incidents recorded</p>}
              {incidents.map((inc) => (
                <div key={inc.id} className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${inc.end ? "bg-yellow-400" : "bg-red-400 animate-pulse"}`} />
                      <span className="text-xs text-[#8a8a8a]">
                        {inc.end ? "Resolved" : "Ongoing"}
                      </span>
                    </div>
                    {inc.duration && (
                      <span className="text-xs text-[#8a8a8a]">Downtime: {formatDuration(inc.duration)}</span>
                    )}
                  </div>
                  <p className="text-sm text-[#cacaca]">
                    {new Date(inc.start).toLocaleString()}
                    {inc.end && ` → ${new Date(inc.end).toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponseTimeChart({ checks }: { checks: HealthCheck[] }) {
  if (checks.length === 0) {
    return <div className="h-32 flex items-center justify-center text-[#555] text-sm">No data</div>;
  }

  const maxRT = Math.max(...checks.map((c) => c.responseTime), 1);
  const maxHeight = 100;
  const barWidth = Math.max(2, Math.min(12, Math.floor((600 - checks.length * 2) / checks.length)));

  return (
    <svg viewBox={`0 0 ${checks.length * (barWidth + 2)} ${maxHeight + 20}`} className="w-full" style={{ minHeight: 120 }}>
      {/* Threshold line at 3000ms */}
      {maxRT > 0 && (
        <line
          x1="0"
          y1={maxHeight - (3000 / maxRT) * maxHeight}
          x2={checks.length * (barWidth + 2)}
          y2={maxHeight - (3000 / maxRT) * maxHeight}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />
      )}
      {checks.map((check, i) => {
        const barHeight = (check.responseTime / maxRT) * maxHeight;
        const x = i * (barWidth + 2);
        const y = maxHeight - barHeight;
        const color = check.status === "DOWN" ? "#ef4444" : check.responseTime > 3000 ? "#f59e0b" : check.responseTime > 1000 ? "#22c55e" : "#4ade80";

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            opacity="0.8"
            rx="1"
          />
        );
      })}
    </svg>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}