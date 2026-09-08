import React from 'react';
import {
  Boxes,
  FileCode,
  ShieldCheck,
  Zap,
  Terminal,
  Key,
  Lock,
  Workflow,
  CheckCircle2,
  Server,
  Activity,
  Cpu,
  TrendingUp,
  BarChart3,
  Users,
  Building2,
  Globe,
  Database,
  Layers,
  GitMerge,
  Truck,
  Warehouse,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  HeartPulse,
  Scale,
  DollarSign,
  Briefcase,
  GitBranch,
  Shield,
  FileText,
  Compass,
  Radio,
  Bot,
  Network,
} from 'lucide-react';

/* ═════════════════════════════════════════════════════════════════════════════
   1. API & MICROSERVICES ENGINEERING VISUALS (6 Cards)
   ═════════════════════════════════════════════════════════════════════════════ */

export function MonolithMigrationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[320px] h-[190px] flex items-center justify-between">
        {/* Left: Monolithic Core */}
        <div className="relative w-[100px] h-[145px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-2.5 flex flex-col justify-between shadow-2xl backdrop-blur-md rotate-[-4deg]">
          <div className="flex items-center justify-between">
            <Server className="w-4 h-4 text-white/60" />
            <span className="text-[11px] font-mono tracking-widest text-red-400/90 uppercase font-bold">LEGACY</span>
          </div>
          <div className="space-y-1.5 py-1">
            <div className="h-1.5 w-full bg-white/10 rounded" />
            <div className="h-1.5 w-3/4 bg-white/10 rounded" />
            <div className="h-1.5 w-5/6 bg-white/10 rounded" />
          </div>
          <div className="rounded-lg bg-black/40 border border-white/5 p-1 text-center">
            <span className="text-[11px] font-bold text-white/70 block tracking-tight">Monolith</span>
            <span className="text-[11px] text-white/60 font-mono">Coupled</span>
          </div>
        </div>

        {/* Center: Migration seam */}
        <div className="flex flex-col items-center justify-center gap-1.5 z-10 px-1">
          <div className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold tracking-wider text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            SEAM
          </div>
          <svg width="50" height="24" viewBox="0 0 50 24" fill="none" className="overflow-visible">
            <path d="M 4 12 H 44" stroke="url(#blue-flow)" strokeWidth="2" strokeDasharray="4 3" />
            <polygon points="46,12 40,8 40,16" fill="#38bdf8" />
            <defs>
              <linearGradient id="blue-flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right: Decoupled Independent Microservices */}
        <div className="relative w-[135px] h-[165px] flex flex-col justify-between py-1">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900/60 border border-blue-500/30 shadow-lg">
            <div className="w-5 h-5 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <Boxes className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-tight truncate">Order Service</span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 leading-tight">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                Decoupled
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900/60 border border-indigo-500/30 shadow-lg">
            <div className="w-5 h-5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Zap className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-tight truncate">Billing Mesh</span>
              <span className="text-[11px] text-emerald-400 font-mono leading-tight">CI/CD Flow</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900/60 border border-cyan-500/30 shadow-lg">
            <div className="w-5 h-5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Cpu className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-tight truncate">Inventory API</span>
              <span className="text-[11px] text-blue-300 font-mono leading-tight">Isolated DB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApiGovernanceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px]">
        <div className="absolute inset-x-1 top-0 bottom-4 rounded-2xl bg-gradient-to-b from-[#16161e] to-[#0c0c12] border border-white/15 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-mono font-bold text-white tracking-tight">openapi-spec.yaml</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
              LINT PASSED
            </span>
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-white/70 space-y-0.5">
            <div className="flex gap-2">
              <span className="text-indigo-400">paths:</span>
              <span className="text-emerald-400">/api/v2/contracts</span>
            </div>
            <div className="flex gap-2 pl-3">
              <span className="text-amber-300 font-bold">post:</span>
              <span className="text-white/60">Automated Contract</span>
            </div>
            <div className="flex gap-2 pl-5">
              <span className="text-blue-300">security:</span>
              <span className="text-cyan-300">[OAuth2, mTLS]</span>
            </div>
          </div>
          <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/60">Zero Central Queue</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-300 font-bold">Template Gate</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 border border-white/20 shadow-lg rotate-[-2deg]">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold text-white tracking-wider font-mono uppercase">Standardized</span>
        </div>
      </div>
    </div>
  );
}

export function ESBMigrationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative w-[305px] h-[180px] flex items-center justify-between">
        <div className="w-[110px] rounded-2xl bg-[#111116] border border-white/10 p-2.5 shadow-xl rotate-[-3deg]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-white/60 uppercase font-bold">Legacy ESB</span>
            <span className="w-2 h-2 rounded-full bg-amber-500/60" />
          </div>
          <div className="p-1.5 rounded-lg bg-black/50 border border-white/5 space-y-0.5 mb-1.5">
            <span className="text-[11px] text-white/50 block line-through">MuleSoft Hub</span>
            <span className="text-[11px] text-white/50 block line-through">Legacy Broker</span>
          </div>
          <span className="text-[11px] font-mono text-rose-400/90 font-bold block text-center leading-tight">
            RETIRED
          </span>
        </div>
        <div className="flex-1 px-2.5 flex flex-col items-center">
          <span className="text-[11px] font-mono text-cyan-400 font-bold mb-1 tracking-wider">EVENT STREAM</span>
          <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <div className="flex gap-1 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>
        <div className="w-[130px] rounded-2xl bg-gradient-to-b from-cyan-950/70 to-slate-900/90 border border-cyan-500/40 p-2.5 shadow-2xl rotate-[2deg]">
          <div className="flex items-center justify-between mb-1">
            <Workflow className="w-4 h-4 text-cyan-300" />
            <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase bg-cyan-500/20 px-1.5 py-0.5 rounded">
              MODERN
            </span>
          </div>
          <span className="text-[11px] font-bold text-white block">Event Mesh</span>
          <span className="text-[11px] text-white/60 block mt-0.5 leading-tight">Kafka Stream</span>
          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex justify-between text-[11px] font-mono text-emerald-400">
            <span>Latency</span>
            <span className="font-bold">0.8ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApiGatewayVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative w-[305px] h-[175px] flex items-center justify-center">
        <div className="relative z-10 w-[130px] h-[125px] rounded-3xl bg-gradient-to-b from-[#1a1f2c] to-[#0d1017] border-2 border-emerald-400/40 p-3 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-1">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-extrabold text-white tracking-tight">API Gateway</span>
          <span className="text-[11px] font-mono text-emerald-400">Topology Fit</span>
        </div>
        <div className="absolute top-1 left-2 px-2.5 py-1 rounded-xl bg-[#12131a] border border-white/10 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Kong / Envoy</span>
        </div>
        <div className="absolute bottom-1 left-2 px-2.5 py-1 rounded-xl bg-[#12131a] border border-white/10 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>AWS / Apigee</span>
        </div>
        <div className="absolute top-1 right-2 px-2.5 py-1 rounded-xl bg-[#12131a] border border-white/10 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>Azure APIM</span>
        </div>
        <div className="absolute bottom-1 right-2 px-2 py-0.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-mono text-emerald-300 font-bold shadow-lg">
          99.999% SLA
        </div>
      </div>
    </div>
  );
}

export function ApiSecurityVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px]">
        <div className="absolute inset-x-1 top-0 bottom-3 rounded-2xl bg-gradient-to-b from-[#181224] to-[#0d0914] border border-violet-500/30 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-violet-400" />
              <span className="text-[11px] font-mono font-bold text-white">OAuth2 / mTLS</span>
            </div>
            <span className="text-[11px] font-mono text-violet-300 bg-violet-500/20 px-1.5 py-0.5 rounded font-bold">
              ZERO TRUST
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="p-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/60">Rate Limit</span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">10k req/min</span>
            </div>
            <div className="p-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/60">Scope</span>
              <span className="text-[11px] font-mono font-bold text-cyan-300">urn:kq:write</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
            <span>DDoS Shield</span>
            <span className="text-violet-300 font-bold">Contract Ready</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -left-1 px-3 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/20 shadow-lg flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-mono font-bold text-white">Zero Exploits</span>
        </div>
      </div>
    </div>
  );
}

export function DeveloperPortalVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px]">
        <div className="w-full h-full rounded-2xl bg-[#0e1117] border border-white/15 p-2.5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-white/60">api.kangqore.io</span>
            <Terminal className="w-3.5 h-3.5 text-white/60" />
          </div>
          <div className="font-mono text-[11px] space-y-1 py-1">
            <div className="text-white/80">
              <span className="text-emerald-400">$</span> curl -X GET /v1/catalog
            </div>
            <div className="p-1 rounded-lg bg-black/60 border border-white/5 text-cyan-300 text-[11px] flex items-center justify-between">
              <span>{`{ status: 200, apis: 142 }`}</span>
              <span className="text-emerald-400 font-bold">2.4ms</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-mono text-white/70">kq_live_98...</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-blue-300">
              INSTANT KEY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   2. SALESFORCE PLATFORM VISUALS (8 Cards)
   ═════════════════════════════════════════════════════════════════════════════ */

export function SalesCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0b101d] border border-blue-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Sales Pipeline Velocity</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-blue-300">
            STAGES LOCKED
          </span>
        </div>
        <div className="space-y-2 py-1">
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-white/70">1. Discovery & Needs</span>
              <span className="text-blue-300 font-bold">$2.4M · 90%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full w-[90%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-white/70">2. Technical Validation</span>
              <span className="text-indigo-300 font-bold">$1.8M · 72%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-full w-[72%]" />
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
          <span className="text-white/60">Strict Close Criteria</span>
          <span className="text-emerald-400 font-bold">+34% Win Rate</span>
        </div>
      </div>
    </div>
  );
}

export function ServiceCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09131a] border border-cyan-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Omnichannel Agent Mesh</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
            SLA &lt; 12m
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/80 font-mono">Case #KQ-8912</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">VIP Priority</span>
          </div>
          <span className="text-[11px] text-white/60 block truncate">Customer 360 History Attached · Zero Re-query</span>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Smart Skill Triage</span>
          <span className="text-cyan-300 font-bold">Auto-Routed</span>
        </div>
      </div>
    </div>
  );
}

export function MarketingCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#171109] border border-amber-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Automated Journey Flow</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[11px] font-mono font-bold text-amber-300">
            TRIGGERED
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 py-1">
          <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-amber-300 font-bold block">Event</span>
            <span className="text-[11px] text-white/60 font-mono">Cart Lag</span>
          </div>
          <span className="text-amber-400 font-mono text-[11px]">→</span>
          <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-cyan-300 font-bold block">Audience</span>
            <span className="text-[11px] text-white/60 font-mono">Tier-1 VIP</span>
          </div>
          <span className="text-amber-400 font-mono text-[11px]">→</span>
          <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-emerald-300 font-bold block">Delivery</span>
            <span className="text-[11px] text-white/60 font-mono">WhatsApp</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
          <span className="text-white/60">Conversion Velocity</span>
          <span className="text-emerald-400 font-bold">48.2% Active Engagement</span>
        </div>
      </div>
    </div>
  );
}

export function ExperienceCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0f0e1c] border border-indigo-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Partner & Client Portal</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-mono font-bold text-indigo-300">
            SECURE SSO
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Role Partitioning</span>
            <span className="text-[11px] text-indigo-300 font-bold font-mono">Distributor Hub</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Asset Access</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Real-Time Sync</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Enterprise Directory</span>
          <span className="text-indigo-300 font-bold">RBAC Enforced</span>
        </div>
      </div>
    </div>
  );
}

export function CommerceCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0a1711] border border-emerald-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Headless Storefront Engine</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-mono font-bold text-emerald-300">
            0.3s CHECKOUT
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/60">Catalog Inventory</span>
            <span className="text-emerald-400 font-bold">140k SKUs Synced</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/60">Multi-Currency</span>
            <span className="text-cyan-300 font-bold">28 Currencies</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Global Edge Cache</span>
          <span className="text-emerald-400 font-bold">100% Cart Uptime</span>
        </div>
      </div>
    </div>
  );
}

export function DataCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#140b20] border border-violet-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Customer 360 Graph</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/30 text-[11px] font-mono font-bold text-violet-300">
            REAL-TIME
          </span>
        </div>
        <div className="flex items-center justify-around py-1">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono text-cyan-300 font-bold">POS</span>
            <span className="text-[11px] text-white/60">In-Store</span>
          </div>
          <span className="text-violet-400 text-sm font-bold">+</span>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono text-blue-300 font-bold">Web & App</span>
            <span className="text-[11px] text-white/60">Signals</span>
          </div>
          <span className="text-violet-400 text-sm font-bold">→</span>
          <div className="px-2.5 py-1 rounded-xl bg-violet-600/30 border border-violet-400/40 text-center">
            <span className="text-[11px] font-mono text-white font-bold block">Golden ID</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">kq_unified_360</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Entity Resolution</span>
          <span className="text-violet-300 font-bold">Zero Data Drift</span>
        </div>
      </div>
    </div>
  );
}

export function RevenueCloudVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#161208] border border-amber-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Dynamic CPQ Pricing Matrix</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[11px] font-mono font-bold text-amber-300">
            AUTOMATED
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Contract Tier</span>
            <span className="text-[11px] text-amber-300 font-bold font-mono">Volume Ramp (3-Yr)</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Discount Rule</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Auto-Approved (18%)</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Billing Accuracy</span>
          <span className="text-emerald-400 font-bold">Zero Revenue Leakage</span>
        </div>
      </div>
    </div>
  );
}

export function MuleSoftVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09141d] border border-sky-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <GitMerge className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">API Mesh & Core Connector</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 text-[11px] font-mono font-bold text-sky-300">
            SUB-SECOND
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 py-1">
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-sky-300 font-bold block">System API</span>
            <span className="text-[11px] text-white/60 font-mono">SAP Core</span>
          </div>
          <span className="text-sky-400 font-mono text-[11px]">→</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-blue-300 font-bold block">Process API</span>
            <span className="text-[11px] text-white/60 font-mono">Aggregator</span>
          </div>
          <span className="text-sky-400 font-mono text-[11px]">→</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-emerald-300 font-bold block">Exp API</span>
            <span className="text-[11px] text-white/60 font-mono">Salesforce</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Bi-Directional Sync</span>
          <span className="text-emerald-400 font-bold">Event-Driven Mesh</span>
        </div>
      </div>
    </div>
  );
}

export function AgentforceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091522] border border-cyan-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Agentforce Guardrails &amp; Esc</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
            GOVERNED AGENT
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Data Cloud Grounding</span>
            <span className="text-[11px] text-cyan-300 font-bold font-mono">Zero Hallucination</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Autonomous Resolution</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">92% First-Contact</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Escalation Handover</span>
          <span className="text-cyan-400 font-bold">Deterministic Path</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   3. GLOBAL CAPABILITY CENTERS (GCC) VISUALS (10 Cards)
   ═════════════════════════════════════════════════════════════════════════════ */

export function TalentAcquisitionVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09111e] border border-blue-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">AI Talent Sourcing Pipeline</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-blue-300">
            -42% TIME
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Senior Engineer Pool</span>
            <span className="text-[11px] text-blue-300 font-bold font-mono">1,420 Vetted</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Offer Acceptance Ratio</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">89.4% (Tier-1)</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Role Definition Settled</span>
          <span className="text-blue-300 font-bold">Zero Mis-Hires</span>
        </div>
      </div>
    </div>
  );
}

export function CorporateFunctionsVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-slate-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0f1118] border border-slate-400/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-slate-300" />
            <span className="text-[11px] font-bold text-white tracking-tight">Corporate Entity Control</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-500/20 border border-slate-400/30 text-[11px] font-mono font-bold text-slate-300">
            DAY-3 CLOSE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 py-1">
          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[11px] text-slate-300 font-bold block">Tax & Treasury</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">100% Compliant</span>
          </div>
          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[11px] text-slate-300 font-bold block">Statutory Books</span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">Audit Certified</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Shared Services Model</span>
          <span className="text-slate-300 font-bold">Zero Headcount Bloat</span>
        </div>
      </div>
    </div>
  );
}

export function HRWellbeingVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-rose-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#190d14] border border-rose-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Workforce Sentiment Index</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-400/30 text-[11px] font-mono font-bold text-rose-300">
            eNPS +74
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Early Attrition Risk</span>
            <span className="text-emerald-400 font-bold">&lt; 3.2% (Industry: 18%)</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Payroll & Benefits Run</span>
            <span className="text-cyan-300 font-bold">100% On-Time Precision</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Continuous Pulse Tracking</span>
          <span className="text-rose-300 font-bold">Culture As An OS</span>
        </div>
      </div>
    </div>
  );
}

export function MarketingBrandVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#170a1a] border border-fuchsia-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Employer Brand Equity</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-[11px] font-mono font-bold text-fuchsia-300">
            #1 REPUTATION
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Inbound Applicant Share</span>
            <span className="text-[11px] text-fuchsia-300 font-bold font-mono">+85% Organic</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Tech Community Reach</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">24k Engaged Devs</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Zero Cold-Recruiting Lag</span>
          <span className="text-fuchsia-300 font-bold">Brand Drives Hiring</span>
        </div>
      </div>
    </div>
  );
}

export function TechInfrastructureVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09151e] border border-cyan-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Zero-Trust Landing Zone</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
            SOC2 TYPE II
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Hardware Provisioning</span>
            <span className="text-emerald-400 font-bold">Day 0 Delivery</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Dedicated Hybrid Bridge</span>
            <span className="text-cyan-300 font-bold">10 Gbps SD-WAN</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Air-Gapped IP Isolation</span>
          <span className="text-emerald-400 font-bold">100% Encrypted</span>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeOperationsVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#17120a] border border-amber-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">SOP Knowledge Architecture</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[11px] font-mono font-bold text-amber-300">
            RUNBOOKS
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Process Mining Coverage</span>
            <span className="text-[11px] text-amber-300 font-bold font-mono">99.4% Validated</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Handover Protocol (BOTT)</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Zero Disruption</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Enterprise IP Custody</span>
          <span className="text-amber-300 font-bold">Documented Ledger</span>
        </div>
      </div>
    </div>
  );
}

export function StrategyAdvisoryVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091712] border border-emerald-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">GCC Capability Maturity Curve</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-mono font-bold text-emerald-300">
            4.2x ROI
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 py-1">
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-white/70 block">Year 1</span>
            <span className="text-[11px] text-blue-300 font-mono font-bold">Cost Center</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">→</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-white/70 block">Year 2</span>
            <span className="text-[11px] text-indigo-300 font-mono font-bold">Talent Hub</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">→</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-white/70 block">Year 3</span>
            <span className="text-[11px] text-emerald-300 font-mono font-bold">Innovation Engine</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Global Delivery Arbitrage</span>
          <span className="text-emerald-400 font-bold">Value Multiplier</span>
        </div>
      </div>
    </div>
  );
}

export function FacilitiesRealEstateVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091616] border border-teal-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Smart Campus Footprint</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/30 text-[11px] font-mono font-bold text-teal-300">
            88% UTILIZATION
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Desk Occupancy Model</span>
            <span className="text-teal-300 font-bold">Agile Dynamic Seating</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Access & Security Gates</span>
            <span className="text-emerald-400 font-bold">Biometric Telemetry</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Lease Flexibility</span>
          <span className="text-teal-300 font-bold">Zero Stranded Capex</span>
        </div>
      </div>
    </div>
  );
}

export function RiskComplianceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-red-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#1a0c0e] border border-red-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Cross-Border Data Shield</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-400/30 text-[11px] font-mono font-bold text-red-300">
            GDPR / DPDP
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Data Sovereignty Ledger</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">100% Partitioned</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Continuous Audit Trail</span>
            <span className="text-[11px] text-cyan-300 font-bold font-mono">Automated Evidence</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Regulatory Compliance</span>
          <span className="text-emerald-400 font-bold">Zero Breach History</span>
        </div>
      </div>
    </div>
  );
}

export function PartnerManagementVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0f111c] border border-indigo-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Vendor SLA Scorecard</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-mono font-bold text-indigo-300">
            99.9% TARGET
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Contract Performance Index</span>
            <span className="text-emerald-400 font-bold">Score: 98.6 / 100</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Penalty Enforcement Gate</span>
            <span className="text-indigo-300 font-bold">Automated Rebate</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Managed Services Governance</span>
          <span className="text-emerald-400 font-bold">Zero Margin Leak</span>
        </div>
      </div>
    </div>
  );
}

export function LeadershipVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#140c22] border border-violet-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Executive Authority &amp; Mandate</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/30 text-[11px] font-mono font-bold text-violet-300">
            EMPOWERED
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Decision Authority Mandate</span>
            <span className="text-violet-300 font-bold">Direct P&amp;L Ownership</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Strategic Maturity Velocity</span>
            <span className="text-emerald-400 font-bold">Center of Excellence</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Global Leadership Alignment</span>
          <span className="text-violet-300 font-bold">High Authority</span>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#1b0918] border border-fuchsia-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-fuchsia-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Hybrid Workplace Telemetry</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-[11px] font-mono font-bold text-fuchsia-300">
            COLLABORATIVE
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Dynamic Seat Utilization</span>
            <span className="text-[11px] text-fuchsia-300 font-bold font-mono">78% Peak Efficiency</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Commute Incentive Index</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">91% In-Person NPS</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Smart Campus Infrastructure</span>
          <span className="text-fuchsia-300 font-bold">Hybrid Optimized</span>
        </div>
      </div>
    </div>
  );
}

export function AITransformationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091717] border border-teal-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Agentic Enterprise Automation</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/30 text-[11px] font-mono font-bold text-teal-300">
            GOVERNED AI
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Workflow Cycle Compression</span>
            <span className="text-[11px] text-teal-300 font-bold font-mono">-68% Processing Time</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Operating Model Sync</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Policy-Bound Execution</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Cross-Functional Intelligence</span>
          <span className="text-teal-300 font-bold">HR &bull; Finance &bull; Delivery</span>
        </div>
      </div>
    </div>
  );
}

export function GCCAdvisoryVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09131e] border border-sky-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">GCC Feasibility &amp; Strategy</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 text-[11px] font-mono font-bold text-sky-300">
            OBJECTIVE
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Maturity Labor Cost Model</span>
            <span className="text-sky-300 font-bold">4-Year Realized Delta</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Location Talent Depth</span>
            <span className="text-emerald-400 font-bold">Index: 94 / 100</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Vendor-Neutral Advisory</span>
          <span className="text-sky-300 font-bold">Unbiased Truth</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   4. SUPPLY CHAIN PLANNING PLATFORMS VISUALS (8 Cards)
   ═════════════════════════════════════════════════════════════════════════════ */

export function BlueYonderVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09121d] border border-blue-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Warehouse className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Distribution & Fulfillment Grid</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-blue-300">
            CONSTRAINTS
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Settled Process Rule</span>
            <span className="text-[11px] text-blue-300 font-bold font-mono">Retail Multi-Node</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Safety Stock Buffer</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Optimized (99.1%)</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Deterministic Allocation</span>
          <span className="text-blue-300 font-bold">Process Settled</span>
        </div>
      </div>
    </div>
  );
}

export function O9SolutionsVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0f0e1d] border border-indigo-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Enterprise Knowledge Graph (EKG)</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-mono font-bold text-indigo-300">
            IBP MESH
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 py-1">
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-indigo-300 font-bold block">Commercial</span>
            <span className="text-[11px] text-white/60 font-mono">Forecast</span>
          </div>
          <span className="text-indigo-400 font-mono text-[11px]">↔</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-cyan-300 font-bold block">Supply Mesh</span>
            <span className="text-[11px] text-white/60 font-mono">BOM Graph</span>
          </div>
          <span className="text-indigo-400 font-mono text-[11px]">↔</span>
          <div className="p-1.5 rounded-xl bg-black/50 border border-white/10 text-center flex-1">
            <span className="text-[11px] text-emerald-300 font-bold block">Finance</span>
            <span className="text-[11px] text-white/60 font-mono">P&amp;L Delta</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Unified Cross-Silo Model</span>
          <span className="text-indigo-300 font-bold">Multi-Dimensional</span>
        </div>
      </div>
    </div>
  );
}

export function KinaxisVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09151d] border border-cyan-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Concurrent "What-If" Simulation</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-mono font-bold text-cyan-300">
            RAPID RESPONSE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 py-1">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/60 block font-mono">Plan A (Base)</span>
            <span className="text-[11px] text-cyan-300 font-bold block mt-0.5">$42.8M Revenue</span>
            <span className="text-[11px] text-emerald-400 font-mono">94% Fill</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-400/30">
            <span className="text-[11px] text-blue-300 block font-mono">Plan B (Disruption)</span>
            <span className="text-[11px] text-white font-bold block mt-0.5">$46.1M Rerouted</span>
            <span className="text-[11px] text-emerald-400 font-mono">98% Fill</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Real-Time Rerouting</span>
          <span className="text-cyan-300 font-bold">Zero Latency Sync</span>
        </div>
      </div>
    </div>
  );
}

export function SAPIBPVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0a1711] border border-emerald-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">S/4HANA Core Supply Optimizer</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-mono font-bold text-emerald-300">
            HANA SYNC
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">ERP Native Telemetry</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Direct S/4 Connect</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Multi-Echelon Balancing</span>
            <span className="text-[11px] text-blue-300 font-bold font-mono">Optimized MRP</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Default Architecture</span>
          <span className="text-emerald-400 font-bold">Formally Verified</span>
        </div>
      </div>
    </div>
  );
}

export function ManhattanAssociatesVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#171109] border border-amber-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Active Warehouse Robotics Mesh</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[11px] font-mono font-bold text-amber-300">
            99.98% PICK
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Autonomous Guided Vehicles (AGV)</span>
            <span className="text-amber-400 font-bold">Live Dispatched</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Dynamic Slotting AI</span>
            <span className="text-emerald-400 font-bold">+28% Floor Throughput</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Real-Time Yard Visibility</span>
          <span className="text-amber-400 font-bold">Zero Idle Dock</span>
        </div>
      </div>
    </div>
  );
}

export function BlueRidgeVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#09151e] border border-sky-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Wholesaler Replenishment Engine</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 text-[11px] font-mono font-bold text-sky-300">
            +2.4 TURNS
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Stockout Prevention Rate</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">99.4% Service Level</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Excess Working Capital</span>
            <span className="text-[11px] text-sky-300 font-bold font-mono">-19% Carrying Cost</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Short-Lifecycle Inventory</span>
          <span className="text-sky-300 font-bold">Predictive Sync</span>
        </div>
      </div>
    </div>
  );
}

export function LogilityVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091717] border border-teal-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-teal-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Digital Supply Chain Twin</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/30 text-[11px] font-mono font-bold text-teal-300">
            RESILIENCE 94
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Supplier Lead-Time Variance</span>
            <span className="text-teal-300 font-bold">&plusmn;1.2 Days (Predictable)</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Sourcing Risk Alert</span>
            <span className="text-emerald-400 font-bold">Buffer Active</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Multi-Tier Sourcing Mesh</span>
          <span className="text-teal-300 font-bold">Early Warning Radar</span>
        </div>
      </div>
    </div>
  );
}

export function AnaplanSupplyChainVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#140b20] border border-violet-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Multidimensional Hyperblock</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/30 text-[11px] font-mono font-bold text-violet-300">
            CONNECTED
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Operational S&amp;OP Plan</span>
            <span className="text-[11px] text-violet-300 font-bold font-mono">Live Balanced</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">P&amp;L Financial Reconciliation</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Real-Time Margin</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Enterprise Hyperblock</span>
          <span className="text-violet-300 font-bold">Calculated Instantly</span>
        </div>
      </div>
    </div>
  );
}

export function OracleSCMVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#1a0e0a] border border-orange-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Oracle SCM &amp; Financial Ledger</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-400/30 text-[11px] font-mono font-bold text-orange-300">
            UNIFIED ERP
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Demand-to-Settlement Pipeline</span>
            <span className="text-[11px] text-orange-300 font-bold font-mono">Single Ledger Sync</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Vendor Accountability</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">Single Stack SLA</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>End-to-End Orchestration</span>
          <span className="text-orange-400 font-bold">Zero Reconcile Gaps</span>
        </div>
      </div>
    </div>
  );
}

export function DynamicsSCMVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#0a121e] border border-blue-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Dynamics 365 Supply Chain MRP</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-blue-300">
            DATAVERSE
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Power Platform Automation</span>
            <span className="text-[11px] text-blue-300 font-bold font-mono">M365 Native Mesh</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Multi-Echelon Capacity Gate</span>
            <span className="text-[11px] text-cyan-300 font-bold font-mono">Mid-Market Fit</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Constraint Planning Ceiling</span>
          <span className="text-blue-300 font-bold">Mapped &amp; Governed</span>
        </div>
      </div>
    </div>
  );
}

export function ExecutionSuitesVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#171109] border border-amber-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">WMS &bull; TMS Execution Suites</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[11px] font-mono font-bold text-amber-300">
            HIGH THROUGHPUT
          </span>
        </div>
        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Manhattan &bull; Blue Yonder &bull; K&ouml;rber</span>
            <span className="text-amber-400 font-bold">Robotics Mesh</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-white/70">Yard &amp; Labor Model Throughput</span>
            <span className="text-emerald-400 font-bold">99.98% On-Time Dock</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Execution Physical Axis</span>
          <span className="text-amber-400 font-bold">Zero Dock Stalls</span>
        </div>
      </div>
    </div>
  );
}

export function ExistingLicenseVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="relative w-[300px] h-[180px] rounded-2xl bg-[#091710] border border-emerald-500/30 p-3 shadow-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-white tracking-tight">Unlock Existing ERP Planning</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-mono font-bold text-emerald-300">
            $0 NEW LICENSE
          </span>
        </div>
        <div className="space-y-1.5 py-1">
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Dormant Capability Activation</span>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">100% Unlocked</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[11px] text-white/70 font-mono">Underlying Data Cleanse</span>
            <span className="text-[11px] text-cyan-300 font-bold font-mono">Truth Invariants</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
          <span>Zero Reseller Margin</span>
          <span className="text-emerald-400 font-bold">Unbiased Truth</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   5. GENERIC FALLBACK VISUAL
   ═════════════════════════════════════════════════════════════════════════════ */

export function GenericSolutionVisual({ index = 0 }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="w-52 h-36 rounded-2xl bg-[#0e1117] border border-white/10 p-3 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Activity className="w-4 h-4 text-white/60" />
          <span className="text-[11px] font-mono text-white/60 font-bold uppercase">Enterprise Tier</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 bg-white/10 rounded" />
          <div className="h-2 w-1/2 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-emerald-400">
          <span>Governed</span>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   MAPPER: SELECT BESPOKE VISUAL ACCORDING TO CARD TITLE
   ═════════════════════════════════════════════════════════════════════════════ */

export function getSolutionVisual(title = '', index = 0) {
  const lower = title.toLowerCase();

  // 1. API & Microservices Engineering (Foundry)
  if (lower.includes('monolith')) return <MonolithMigrationVisual />;
  if (lower.includes('governance') || lower.includes('standards')) return <ApiGovernanceVisual />;
  if (lower.includes('esb') || lower.includes('middleware')) return <ESBMigrationVisual />;
  if (lower.includes('gateway')) return <ApiGatewayVisual />;
  if (lower.includes('security') || lower.includes('rate')) return <ApiSecurityVisual />;
  if (lower.includes('portal') || lower.includes('catalog')) return <DeveloperPortalVisual />;

  // 2. Salesforce Platform (Platforms)
  if (lower.includes('sales cloud')) return <SalesCloudVisual />;
  if (lower.includes('service cloud')) return <ServiceCloudVisual />;
  if (lower.includes('experience cloud')) return <ExperienceCloudVisual />;
  if (lower.includes('commerce cloud')) return <CommerceCloudVisual />;
  if (lower.includes('marketing cloud')) return <MarketingCloudVisual />;
  if (lower.includes('data cloud')) return <DataCloudVisual />;
  if (lower.includes('agentforce')) return <AgentforceVisual />;
  if (lower.includes('revenue') || lower.includes('cpq')) return <RevenueCloudVisual />;
  if (lower.includes('mulesoft')) return <MuleSoftVisual />;

  // 3. Global Capability Centers (Growth)
  if (lower.includes('talent')) return <TalentAcquisitionVisual />;
  if (lower.includes('corporate')) return <CorporateFunctionsVisual />;
  if (lower.includes('hr') || lower.includes('wellbeing')) return <HRWellbeingVisual />;
  if (lower.includes('brand') || lower.includes('marketing and employer') || lower.includes('employer')) return <MarketingBrandVisual />;
  if (lower.includes('infrastructure')) return <TechInfrastructureVisual />;
  if (lower.includes('operations')) return <KnowledgeOperationsVisual />;
  if (lower.includes('leadership')) return <LeadershipVisual />;
  if (lower.includes('workspace')) return <WorkspaceVisual />;
  if (lower.includes('ai and transformation') || lower.includes('transformation')) return <AITransformationVisual />;
  if (lower.includes('gcc advisory') || lower.includes('advisory')) return <GCCAdvisoryVisual />;
  if (lower.includes('facilities') || lower.includes('real estate')) return <FacilitiesRealEstateVisual />;
  if (lower.includes('risk') || lower.includes('compliance')) return <RiskComplianceVisual />;
  if (lower.includes('partner')) return <PartnerManagementVisual />;
  if (lower.includes('strategy')) return <StrategyAdvisoryVisual />;

  // 4. Supply Chain Planning (Cognition)
  if (lower.includes('blue yonder')) return <BlueYonderVisual />;
  if (lower.includes('o9')) return <O9SolutionsVisual />;
  if (lower.includes('kinaxis')) return <KinaxisVisual />;
  if (lower.includes('sap ibp') || lower.includes('ibp')) return <SAPIBPVisual />;
  if (lower.includes('oracle')) return <OracleSCMVisual />;
  if (lower.includes('dynamics') || lower.includes('microsoft')) return <DynamicsSCMVisual />;
  if (lower.includes('execution') || lower.includes('suites')) return <ExecutionSuitesVisual />;
  if (lower.includes('license') || lower.includes('already license')) return <ExistingLicenseVisual />;
  if (lower.includes('manhattan')) return <ManhattanAssociatesVisual />;
  if (lower.includes('blue ridge')) return <BlueRidgeVisual />;
  if (lower.includes('logility')) return <LogilityVisual />;
  if (lower.includes('anaplan')) return <AnaplanSupplyChainVisual />;

  // Fallback
  return <GenericSolutionVisual index={index} />;
}
