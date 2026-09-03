import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, Lock, Fingerprint, Database, Key, ScrollText, GitMerge, FileCheck2, Settings2 } from 'lucide-react'
import { cn } from '@design-system/cn'
import { ExecutionLedger } from '../../../features/hanumanas/components/ExecutionLedger'

export function ClientTrustCenter() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--os-text-1)] tracking-tight">Trust Center</h1>
        <p className="mt-2 text-base text-[var(--os-text-2)] max-w-2xl">
          Kangqore View operates with a cryptographically verifiable security posture. 
          Our strategic differentiator is <strong>Governance by Execution</strong> — we don't just show dashboards; we log every single action our AI takes on your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CERTIFICATIONS ROADMAP */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#2564ea]" />
            <h2 className="text-lg font-bold text-[var(--os-text-1)] tracking-wide">Security & Certifications</h2>
          </div>
          <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <CertItem label="SOC 2 Type II" status="ACHIEVED" date="Q2 2026" />
              <CertItem label="ISO 27001" status="ACHIEVED" date="Q1 2026" />
              <CertItem label="ISO 27017 (Cloud)" status="IN_PROGRESS" date="Target: Q4 2026" />
              <CertItem label="ISO 27018 (Privacy)" status="IN_PROGRESS" date="Target: Q4 2026" />
              <CertItem label="GDPR & DPDP" status="COMPLIANT" date="Continuous" />
              <CertItem label="HIPAA" status="PLANNED" date="Evaluating" />
            </div>
          </div>
        </section>

        {/* ENTERPRISE CONTROLS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-[#2564ea]" />
            <h2 className="text-lg font-bold text-[var(--os-text-1)] tracking-wide">Enterprise Controls</h2>
          </div>
          <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <ControlItem icon={Fingerprint} label="SSO & SCIM" active />
              <ControlItem icon={Lock} label="RBAC & ABAC" active />
              <ControlItem icon={Key} label="BYOK & KMS" active />
              <ControlItem icon={ScrollText} label="Audit Exports" active />
              <ControlItem icon={Database} label="Data Residency" active />
              <ControlItem icon={FileCheck2} label="Tenant Isolation" active />
              <ControlItem icon={GitMerge} label="Private Connect" active />
              <ControlItem icon={Lock} label="DLP Engine" active />
            </div>
          </div>
        </section>
      </div>

      {/* GOVERNANCE BY EXECUTION */}
      <section className="space-y-6 pt-8 border-t border-[var(--os-border)]">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--os-text-1)] tracking-tight">AI Execution Ledger</h2>
          <p className="mt-2 text-sm text-[var(--os-text-2)] max-w-3xl">
            Total transparency into autonomous actions affecting your projects. We track who acted, what was changed, the authority used, and the exact policy boundaries enforced.
          </p>
        </div>
        
        <ExecutionLedger />
      </section>

    </div>
  )
}

function CertItem({ label, status, date }: { label: string, status: 'ACHIEVED' | 'IN_PROGRESS' | 'COMPLIANT' | 'PLANNED', date: string }) {
  const isGood = status === 'ACHIEVED' || status === 'COMPLIANT'
  const isProgress = status === 'IN_PROGRESS'
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--os-surface-hover)] border border-[var(--os-border)]">
      <div className="flex items-center gap-3">
        {isGood ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        ) : isProgress ? (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[var(--os-border)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--os-text-3)]" />
          </div>
        )}
        <span className="text-sm font-semibold text-[var(--os-text-1)]">{label}</span>
      </div>
      <div className="text-right">
        <div className={cn(
          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
          isGood ? "text-emerald-500 bg-emerald-500/10" :
          isProgress ? "text-blue-500 bg-blue-500/10" :
          "text-[var(--os-text-3)] bg-[var(--os-surface)]"
        )}>
          {status}
        </div>
        <div className="text-[10px] text-[var(--os-text-3)] mt-1">{date}</div>
      </div>
    </div>
  )
}

function ControlItem({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) {
  return (
    <div className="flex items-center gap-2.5 p-2">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
        active ? "bg-gradient-to-br from-[#2564ea] to-blue-600 text-white" : "bg-[var(--os-border)] text-[var(--os-text-3)]"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-[var(--os-text-2)]">{label}</span>
    </div>
  )
}
