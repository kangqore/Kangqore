import { useState, useMemo } from 'react'
import { Search, BookOpen, Clock, ChevronLeft, Shield, CreditCard, Monitor, FileCheck, Rocket, ChevronRight } from 'lucide-react'

// ─── types ────────────────────────────────────────────────────────────────────

type Category = 'All' | 'Getting Started' | 'Billing' | 'Platform' | 'Security' | 'Compliance'

interface Article {
  id: string
  category: Exclude<Category, 'All'>
  title: string
  excerpt: string
  readMin: number
  date: string
  body: string[]
}

// ─── mock data ────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  // Getting Started
  {
    id: 'gs-1', category: 'Getting Started',
    title: 'Navigating the Client Portal',
    excerpt: 'A quick walkthrough of every section in your portal and how to get the most out of each module.',
    readMin: 3, date: '2026-05-10',
    body: [
      'Your Kangqore Client Portal is organised into six core areas: Overview, Work, Finance, Support, Services, and Insights.',
      'The Dashboard gives you a live snapshot of your engagement health — project progress, open invoices, and WAANDA signals are all visible at a glance.',
      'Work contains your Projects, Tasks, and Meetings. Projects shows each active engagement with its current status and milestone progress. Tasks lists all action items assigned to your team. Meetings shows your upcoming and past sessions with Kangqore.',
      'Finance holds your Invoices and Documents. Invoices shows all raised bills, their payment status, and allows you to download PDFs. Documents gives you access to all shared files — SOWs, reports, audit evidence — organised by folder.',
      'Support is where you can raise a ticket, submit a Change Request, or leave feedback. The Knowledge Base (you are reading it now) is also here.',
      'Services shows your contracted services and lets you request add-ons.',
      'Insights contains your WAANDA intelligence feed and your Executive Report — a monthly synthesis of your entire engagement prepared by WAANDA.',
    ],
  },
  {
    id: 'gs-2', category: 'Getting Started',
    title: 'Understanding your project dashboard',
    excerpt: 'Learn how to read the health indicators, milestone progress bars, and RAG status on your project cards.',
    readMin: 5, date: '2026-05-12',
    body: [
      'Each project card on your Dashboard shows a RAG (Red / Amber / Green) health indicator. Green means delivery is on track. Amber means there is a risk requiring attention. Red means a milestone or commitment has been missed.',
      'The progress bar below the project title shows how far through the overall scope the engagement is, measured by completed milestones against total milestones.',
      'Budget burn is shown as a percentage of the contracted value consumed. If burn is significantly ahead of scope completion, this is flagged by WAANDA as a financial risk signal.',
      'To see the full detail for any project — individual milestones, team assignments, change history — click the project card to open the Projects page.',
    ],
  },
  {
    id: 'gs-3', category: 'Getting Started',
    title: 'Setting up two-factor authentication',
    excerpt: 'Secure your portal account with 2FA using an authenticator app or SMS.',
    readMin: 2, date: '2026-05-15',
    body: [
      'Two-factor authentication (2FA) adds an extra layer of security to your Kangqore account. Even if your password is compromised, an attacker cannot log in without the second factor.',
      'To enable 2FA, go to Settings → Security. Click "Enable Two-Factor Authentication." You will be shown a QR code — scan it with an authenticator app such as Google Authenticator, Authy, or 1Password.',
      'Enter the 6-digit code shown in your authenticator app to confirm setup. From this point, every login will require both your password and the authenticator code.',
      'If you lose access to your authenticator, contact your account manager immediately. Recovery codes are available at the time of 2FA setup — store them in a secure password manager.',
    ],
  },
  // Billing
  {
    id: 'bl-1', category: 'Billing',
    title: 'How to read your invoice',
    excerpt: 'A line-by-line breakdown of every field on a Kangqore invoice and what each item represents.',
    readMin: 4, date: '2026-04-20',
    body: [
      'Every Kangqore invoice contains the following sections: Invoice Header, Line Items, Tax Summary, and Payment Instructions.',
      'Invoice Header includes: Invoice Number (format INV-YYYY-NNN), Issue Date, Due Date, and your Account Reference (the unique ID for your company in our system).',
      'Line Items describe the specific services billed. Each line includes a description (e.g., "Strategic Advisory — May 2026"), the quantity (days or units), the unit rate, and the line total.',
      'The Tax Summary shows GST or VAT applied where applicable, based on your jurisdiction. If you have a valid GST registration number on file, it will appear here.',
      'Payment Instructions include our bank details or the payment link for online transfer. Payment must be received by the Due Date to avoid a late payment notice.',
      'If any line item appears incorrect, raise a Billing Query ticket via the Support page within 5 business days of invoice issue.',
    ],
  },
  {
    id: 'bl-2', category: 'Billing',
    title: 'Milestone-based billing explained',
    excerpt: 'Understand how Kangqore invoices against delivery milestones rather than time-and-materials.',
    readMin: 5, date: '2026-04-22',
    body: [
      'Kangqore operates primarily on milestone-based billing. This means invoices are triggered by the completion of a defined deliverable, not by the passage of time.',
      'Your Statement of Work (SOW) defines each milestone: its name, the deliverable it represents, the amount billable upon completion, and the expected completion date.',
      'When Kangqore completes a milestone, it is marked as complete in your portal. An invoice is then raised and appears in your Invoices page within 24 hours.',
      'You have 5 business days to raise a dispute on any milestone completion. Disputes submitted via the Change Requests page are reviewed by your account manager within 2 business days.',
      'Retainer arrangements (where applicable) are billed monthly in advance on the 1st of each month, regardless of milestone progress.',
    ],
  },
  {
    id: 'bl-3', category: 'Billing',
    title: 'Requesting a billing correction',
    excerpt: 'Step-by-step process for raising a billing query and what to expect from the resolution process.',
    readMin: 2, date: '2026-05-01',
    body: [
      'If you believe an invoice contains an error, navigate to Support and click "Raise ticket." Set the Category to "Billing Query."',
      'In the description, include: the Invoice Number, the specific line item in question, and the nature of the discrepancy (e.g., wrong rate, wrong quantity, duplicate charge).',
      'Your account manager will review the query within 2 business days. If a correction is warranted, a Credit Note will be issued against the original invoice and a revised invoice will be raised.',
      'Payment of undisputed line items should not be withheld during the query process. Only the disputed amount may be withheld pending resolution.',
    ],
  },
  // Platform
  {
    id: 'pl-1', category: 'Platform',
    title: 'Raising a support ticket — best practices',
    excerpt: 'How to write a ticket that gets resolved faster. The information Kangqore needs to triage your issue immediately.',
    readMin: 3, date: '2026-05-20',
    body: [
      'A well-written ticket reduces resolution time significantly. Include these elements in every ticket: a clear one-line subject, the category (Bug / Feature Request / Correction / Billing / General), your priority assessment, and a detailed description.',
      'For technical issues, include: what you were trying to do, what you expected to happen, what actually happened, and the approximate time the issue occurred.',
      'Attach screenshots or recordings where possible. For bugs, include your browser and operating system version.',
      'Priority levels: Low (cosmetic issues, non-blocking), Medium (impacting workflow but workaround exists), High (blocking work), Critical (data loss, security concern, system down).',
      'You will receive an acknowledgement within 1 business hour for High/Critical tickets and within 4 business hours for Low/Medium tickets.',
    ],
  },
  {
    id: 'pl-2', category: 'Platform',
    title: 'How to submit a Change Request',
    excerpt: 'When to raise a CR, what information is required, and how the approval process works.',
    readMin: 4, date: '2026-05-18',
    body: [
      'A Change Request (CR) is the formal mechanism for requesting scope changes, timeline adjustments, new features, or additions to your contracted services.',
      'Navigate to Support → Changes and click "New change request." Provide a title, describe the change in detail, specify the priority, and attach any supporting documents.',
      'Kangqore will assess the CR within 3 business days and respond with: an impact assessment (scope, timeline, cost implications), a recommended approach, and a proposed timeline.',
      'You can accept, reject, or negotiate the CR directly in the portal. An accepted CR creates a formal amendment to your SOW.',
      'Emergency changes (those that must begin within 24 hours) should also be raised via CR but flagged as Critical priority and followed up with a direct call to your account manager.',
    ],
  },
  {
    id: 'pl-3', category: 'Platform',
    title: 'Downloading and sharing documents',
    excerpt: 'How to access, download, and share documents from your portal — including access controls.',
    readMin: 2, date: '2026-06-01',
    body: [
      'All documents shared with your account are available in the Documents section. They are organised into folders: Contracts, Invoices, Reports, Audit Evidence, and Shared Files.',
      'Click any document to preview it in-browser, or click the Download icon to save it locally. PDFs open in a full-screen viewer with zoom and page navigation.',
      'To share a document with a colleague, download it and share via your own secure channels. Do not share your portal login credentials.',
      'If you need a document that is not visible in your portal, raise a Support ticket with category "General" and request it by name.',
    ],
  },
  // Security
  {
    id: 'sc-1', category: 'Security',
    title: 'How Kangqore protects your data',
    excerpt: 'An overview of the technical and organisational controls Kangqore uses to keep your data safe.',
    readMin: 5, date: '2026-03-15',
    body: [
      'All data in the Kangqore platform is encrypted at rest (AES-256) and in transit (TLS 1.3). Encryption keys are managed using a Hardware Security Module (HSM) with quarterly rotation.',
      'Access to your data is restricted by role-based access control (RBAC). Only Kangqore staff with an explicit business need for your account can access your data, and all access is logged in our immutable audit trail.',
      'Kangqore operates an internal vulnerability management programme. All externally-facing services are scanned weekly and penetration-tested annually by an independent third party.',
      'We have achieved SOC 2 Type I certification and are currently in the observation period for SOC 2 Type II. Our ISO 27001 audit is scheduled for Q4 2026.',
      'In the event of a security incident affecting your data, Kangqore will notify you within 72 hours of detection, in line with GDPR Article 33 requirements.',
    ],
  },
  {
    id: 'sc-2', category: 'Security',
    title: 'Data residency and GDPR',
    excerpt: 'Where your data is stored, which regions it may transit, and your rights under GDPR and PDPB.',
    readMin: 4, date: '2026-03-20',
    body: [
      'By default, Kangqore stores all client data in the EU-West (Ireland) region. Clients with specific data residency requirements (e.g., India PDPB, UK GDPR) can request dedicated regional storage.',
      'Your data does not leave the contracted storage region except for: encrypted backups to a second region for disaster recovery, and AI inference calls to KIMMP which are processed in-region and not stored by third-party AI providers.',
      'Kangqore acts as a Data Processor under GDPR Article 28. Our Data Processing Agreement (DPA) is available in your Documents folder under Contracts.',
      'You have the right to access, correct, and delete your personal data. Requests should be submitted to privacy@kangqore.com and will be fulfilled within 30 days.',
    ],
  },
  {
    id: 'sc-3', category: 'Security',
    title: 'Password and account security',
    excerpt: 'Best practices for keeping your Kangqore account secure, including password hygiene and session management.',
    readMin: 3, date: '2026-04-10',
    body: [
      'Use a unique, strong password for your Kangqore account — at least 12 characters, mixing uppercase, lowercase, numbers, and symbols. A password manager is strongly recommended.',
      'Never share your portal credentials with colleagues. Each team member should have their own account. Request additional portal seats via your account manager.',
      'Your session automatically expires after 8 hours of inactivity. If you are using a shared or public device, sign out manually after each session.',
      'Kangqore will never ask for your password via email or phone. If you receive a suspicious request purportedly from Kangqore, report it immediately to security@kangqore.com.',
    ],
  },
  // Compliance
  {
    id: 'co-1', category: 'Compliance',
    title: 'SOC 2 Type I — what it means for your data',
    excerpt: 'What the SOC 2 Type I report covers, how it was audited, and what assurance it provides to your procurement team.',
    readMin: 5, date: '2026-03-05',
    body: [
      'SOC 2 (Service Organisation Control 2) is an audit framework developed by the AICPA. It assesses a service organisation\'s controls across five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
      'Kangqore achieved SOC 2 Type I certification in March 2026. Type I means an independent auditor assessed that our controls were suitably designed as of a specific point in time.',
      'Our SOC 2 report covers: access controls, encryption, vulnerability management, incident response, change management, and vendor risk management.',
      'Enterprise procurement teams can request a copy of our SOC 2 report under NDA. Contact your account manager to obtain the report.',
      'We are currently in the SOC 2 Type II observation period (12 months of operating effectiveness evidence). Type II report is expected in Q4 2026.',
    ],
  },
  {
    id: 'co-2', category: 'Compliance',
    title: 'Requesting audit evidence',
    excerpt: 'How to request penetration test reports, access logs, and other audit evidence from Kangqore for your own compliance needs.',
    readMin: 3, date: '2026-04-05',
    body: [
      'Clients undergoing their own compliance audits (ISO 27001, SOC 2, HIPAA) may need evidence from Kangqore as a third-party service provider.',
      'Standard evidence packages available on request include: SOC 2 Type I report (NDA required), penetration test executive summary (redacted), data processing agreement, sub-processor list, and business continuity plan summary.',
      'To request evidence, raise a Support ticket with category "General" and subject "Audit evidence request — [your audit type]." Include your required-by date.',
      'Requests are fulfilled within 5 business days. Expedited requests (required within 48 hours) should also include a phone call to your account manager.',
    ],
  },
  {
    id: 'co-3', category: 'Compliance',
    title: 'HIPAA compliance for healthcare clients',
    excerpt: 'What Kangqore currently provides for healthcare clients and the roadmap to full HIPAA BAA capability.',
    readMin: 4, date: '2026-05-30',
    body: [
      'For healthcare clients handling Protected Health Information (PHI), Kangqore offers a HIPAA-aligned engagement model. This includes a Business Associate Agreement (BAA), restricted data handling procedures, and encrypted-at-rest PHI storage.',
      'Current HIPAA capability: BAA available on request, PHI segregation in dedicated storage, access logging with tamper-evident records, workforce security training for all staff with PHI access.',
      'Planned HIPAA enhancements (H2 2026): automated PHI tagging in KIMMP memory, automated BAA renewal tracking, HIPAA-specific incident response runbook.',
      'If your engagement involves PHI, notify your account manager immediately. Additional controls will be activated and the BAA will be countersigned before any PHI is processed.',
    ],
  },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

const CARD = 'rgba(15,23,42,0.5)'
const EDGE = 'rgba(30,41,59,0.6)'

const CATEGORY_META: Record<Exclude<Category, 'All'>, { icon: React.ElementType; color: string }> = {
  'Getting Started': { icon: Rocket,    color: '#2564ea' },
  'Billing':         { icon: CreditCard, color: '#fdab3d' },
  'Platform':        { icon: Monitor,    color: '#7f53f9' },
  'Security':        { icon: Shield,     color: '#e2445c' },
  'Compliance':      { icon: FileCheck,  color: '#00c875' },
}

const CATEGORIES: Category[] = ['All', 'Getting Started', 'Billing', 'Platform', 'Security', 'Compliance']

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── article viewer ───────────────────────────────────────────────────────────

function ArticleViewer({ article, onBack }: { article: Article; onBack: () => void }) {
  const meta = CATEGORY_META[article.category]
  const Icon = meta.icon
  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Knowledge Base
      </button>

      {/* Article header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: CARD, border: `1px solid ${EDGE}` }}>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}
          >
            <Icon className="w-3 h-3" />
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {article.readMin} min read
          </span>
          <span className="text-xs text-slate-600">{fmtDate(article.date)}</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight leading-tight" style={{ color: 'var(--os-text-1)' }}>{article.title}</h1>
        <p className="text-sm text-slate-400 mt-2">{article.excerpt}</p>
      </div>

      {/* Body */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: CARD, border: `1px solid ${EDGE}` }}>
        {article.body.map((para, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed">{para}</p>
        ))}
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientKnowledge() {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState<Category>('All')
  const [open,     setOpen]     = useState<Article | null>(null)

  const filtered = useMemo(() => ARTICLES.filter(a => {
    const matchCat = category === 'All' || a.category === category
    const q = query.toLowerCase()
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    return matchCat && matchQ
  }), [query, category])

  if (open) return <ArticleViewer article={open} onBack={() => setOpen(null)} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Knowledge Base</h2>
        <p className="text-sm text-slate-500 mt-0.5">{ARTICLES.length} articles across {CATEGORIES.length - 1} categories</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all"
          style={{ background: CARD, border: `1px solid ${EDGE}` }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(37,100,234,0.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = EDGE)}
        />
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const active = category === cat
          const meta = cat !== 'All' ? CATEGORY_META[cat] : null
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:  active ? (meta ? `${meta.color}18` : 'rgba(37,100,234,0.12)') : CARD,
                border:      `1px solid ${active ? (meta ? `${meta.color}40` : 'rgba(37,100,234,0.4)') : EDGE}`,
                color:       active ? (meta ? meta.color : '#60a5fa') : 'var(--os-text-2)',
              }}
            >
              {meta && <meta.icon className="w-3 h-3" />}
              {cat}
            </button>
          )
        })}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
          No articles match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(a => {
            const meta = CATEGORY_META[a.category]
            const Icon = meta.icon
            return (
              <button
                key={a.id}
                onClick={() => setOpen(a)}
                className="text-left rounded-2xl p-5 transition-all duration-200 group"
                style={{ background: CARD, border: `1px solid ${EDGE}` }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,100,234,0.3)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(37,100,234,0.04)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = EDGE
                  ;(e.currentTarget as HTMLElement).style.background = CARD
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}25` }}
                  >
                    <Icon className="w-3 h-3" />
                    {a.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: 'var(--os-text-1)' }}>{a.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{a.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readMin} min read</span>
                  <span>{fmtDate(a.date)}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
