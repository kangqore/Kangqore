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
} from 'lucide-react';

/**
 * 1. Monolith-to-Microservices Migration
 * A heavy monolith block breaking down along clean domain seams into
 * modular, decoupled microservices with circuit paths and decoupled badges.
 */
export function MonolithMigrationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Background ambient glow */}
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative w-[320px] h-[190px] flex items-center justify-between">
        {/* Left: Monolithic Core */}
        <div className="relative w-[100px] h-[145px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-2.5 flex flex-col justify-between shadow-2xl backdrop-blur-md rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500">
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

        {/* Center: Migration flow & seam transition */}
        <div className="flex flex-col items-center justify-center gap-1.5 z-10 px-1">
          <div className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold tracking-wider text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            SEAM
          </div>
          <svg width="50" height="24" viewBox="0 0 50 24" fill="none" className="overflow-visible">
            <path
              d="M 4 12 H 44"
              stroke="url(#blue-grad-flow)"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
            <polygon points="46,12 40,8 40,16" fill="#38bdf8" />
            <defs>
              <linearGradient id="blue-grad-flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right: Decoupled Independent Microservices */}
        <div className="relative w-[135px] h-[165px] flex flex-col justify-between py-1">
          {/* Service 1 */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900/60 border border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.2)] transform translate-x-1 hover:translate-x-2 transition-transform duration-300">
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

          {/* Service 2 */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900/60 border border-indigo-500/30 shadow-[0_4px_20px_rgba(99,102,241,0.2)] transform -translate-x-1 hover:translate-x-0 transition-transform duration-300">
            <div className="w-5 h-5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Zap className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block leading-tight truncate">Billing Mesh</span>
              <span className="text-[11px] text-emerald-400 font-mono leading-tight">CI/CD Flow</span>
            </div>
          </div>

          {/* Service 3 */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900/60 border border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.2)] transform translate-x-2 hover:translate-x-3 transition-transform duration-300">
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

/**
 * 2. API Governance and Standards
 * Automated contract schema blueprint (OpenAPI 3.1), contract linting, and automated checks.
 */
export function ApiGovernanceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative w-[300px] h-[180px]">
        {/* Floating OpenAPI Spec Card */}
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

          {/* Simulated Code Lines */}
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

          {/* Validation Badges Bottom */}
          <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/60">Zero Central Queue</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-300 font-bold">Template Gate</span>
            </div>
          </div>
        </div>

        {/* Floating Shield Seal */}
        <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 border border-white/20 shadow-[0_8px_20px_rgba(79,70,229,0.4)] rotate-[-2deg]">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold text-white tracking-wider font-mono uppercase">Standardized</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. ESB and Middleware Migration
 * Retiring legacy enterprise service buses into high-velocity event streaming pipelines.
 */
export function ESBMigrationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative w-[305px] h-[180px] flex items-center justify-between">
        {/* Left: Decommissioned ESB Bus */}
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

        {/* High Speed Stream Bridge */}
        <div className="flex-1 px-2.5 flex flex-col items-center">
          <span className="text-[11px] font-mono text-cyan-400 font-bold mb-1 tracking-wider">EVENT STREAM</span>
          <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <div className="flex gap-1 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>

        {/* Right: Modern Cloud Integration Gateway */}
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

/**
 * 4. API Gateway Selection
 * Smart multi-cloud gateway traffic router with low latency dispatch.
 */
export function ApiGatewayVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="relative w-[305px] h-[175px] flex items-center justify-center">
        {/* Central Gateway Hub */}
        <div className="relative z-10 w-[130px] h-[125px] rounded-3xl bg-gradient-to-b from-[#1a1f2c] to-[#0d1017] border-2 border-emerald-400/40 p-3 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-1">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-extrabold text-white tracking-tight">API Gateway</span>
          <span className="text-[11px] font-mono text-emerald-400">Topology Fit</span>
        </div>

        {/* Orbiting Supported Engines */}
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

/**
 * 5. API Security and Rate Limiting
 * Zero-trust token authentication shield and tenant-aware rate limiter gauge.
 */
export function ApiSecurityVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative w-[300px] h-[180px]">
        {/* Token Vault Card */}
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

        {/* Security Badge Pill */}
        <div className="absolute -bottom-1 -left-1 px-3 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/20 shadow-lg flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-mono font-bold text-white">Zero Exploits</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 6. Developer Portal and Catalog
 * Interactive API sandbox console, mock playground, instant key generation.
 */
export function DeveloperPortalVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div className="absolute w-44 h-44 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative w-[300px] h-[180px]">
        {/* Developer Sandbox Window */}
        <div className="w-full h-full rounded-2xl bg-[#0e1117] border border-white/15 p-2.5 shadow-2xl flex flex-col justify-between">
          {/* Mac-like Window Chrome */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] font-mono text-white/60">api.kangqore.io</span>
            <Terminal className="w-3.5 h-3.5 text-white/60" />
          </div>

          {/* Terminal Command Output */}
          <div className="font-mono text-[11px] space-y-1 py-1">
            <div className="text-white/80">
              <span className="text-emerald-400">$</span> curl -X GET /v1/catalog
            </div>
            <div className="p-1 rounded-lg bg-black/60 border border-white/5 text-cyan-300 text-[11px] flex items-center justify-between">
              <span>{`{ status: 200, apis: 142 }`}</span>
              <span className="text-emerald-400 font-bold">2.4ms</span>
            </div>
          </div>

          {/* Instant API Key Generator Bar */}
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

/**
 * Fallback visual generator for other services that use SolutionsCarousel
 */
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

/**
 * Mapper by card title or index
 */
export function getSolutionVisual(title = '', index = 0) {
  const lower = title.toLowerCase();
  if (lower.includes('monolith')) return <MonolithMigrationVisual />;
  if (lower.includes('governance') || lower.includes('standards')) return <ApiGovernanceVisual />;
  if (lower.includes('esb') || lower.includes('middleware')) return <ESBMigrationVisual />;
  if (lower.includes('gateway')) return <ApiGatewayVisual />;
  if (lower.includes('security') || lower.includes('rate')) return <ApiSecurityVisual />;
  if (lower.includes('portal') || lower.includes('catalog')) return <DeveloperPortalVisual />;

  return <GenericSolutionVisual index={index} />;
}
