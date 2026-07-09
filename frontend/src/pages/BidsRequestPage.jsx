import React, { useState } from 'react';

const BIDS_INDUSTRIES = [
  'Manufacturing', 'Education', 'Healthcare', 'Financial Services',
  'Retail & Commerce', 'SaaS & Technology', 'Government', 'Startup',
  'Enterprise', 'Non-Profit',
];

const PRIMARY_CHALLENGES = [
  { value: 'operational_efficiency',   label: 'Operational Inefficiency — productivity is being lost in core operations' },
  { value: 'data_blindness',           label: 'Data Blindness — no real insight into business performance' },
  { value: 'digital_transformation',   label: 'Digital Transformation — need to modernise but don\'t know where to start' },
  { value: 'team_alignment',           label: 'Team Alignment — strategy and execution are disconnected' },
  { value: 'customer_experience',      label: 'Customer Experience — delivery quality needs improvement' },
  { value: 'ai_readiness',             label: 'AI Readiness — want to adopt AI but lack a clear path' },
  { value: 'governance_compliance',    label: 'Governance & Risk — compliance and oversight are concerns' },
  { value: 'growth_infrastructure',    label: 'Growth Infrastructure — scaling but systems aren\'t keeping up' },
];

const EMPLOYEE_RANGES = ['< 50', '50 – 200', '200 – 1,000', '1,000+'];

const URGENCY_OPTIONS = [
  { value: 'exploring',          label: 'Exploring — no immediate timeline' },
  { value: 'active_evaluation',  label: 'Active Evaluation — comparing options now' },
  { value: 'urgent',             label: 'Urgent — decision within 30 days' },
];

const HOW_DID_YOU_HEAR = [
  'LinkedIn', 'Google Search', 'Referral / Word of Mouth', 'Event / Conference',
  'News / Media', 'Analyst Report', 'Partner', 'Other',
];

const INPUT_STYLE = {
  background: '#f8faff',
  border: '1px solid #dde3f0',
  color: '#1a1a2e',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};
const LABEL_STYLE = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' };

function SuccessView({ firstName, email }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)' }}>
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: '#2564ea18', border: '2px solid #2564ea30' }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#2564ea" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Request Received</h1>
        <p className="text-gray-600 mb-2">
          Thank you, <strong>{firstName}</strong>. Your BIDS™ Diagnostic Assessment request has been submitted.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Our team will review your request and activate your private diagnostic portal within{' '}
          <strong>24 hours</strong>. You'll receive an email at <strong>{email}</strong> with your access link.
        </p>
        <a href="/"
          className="inline-block mt-8 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: '#2564ea' }}>
          Back to Kangqore
        </a>
      </div>
    </div>
  );
}

export default function BidsRequestPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', industry: '', employees: '', country: '',
    primaryChallenge: '', urgency: '', howDidYouHear: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact/bids-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed. Please try again.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessView firstName={form.firstName} email={form.email} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 60%)' }}>
      {/* Minimal nav */}
      <div className="px-6 py-5 flex items-center border-b border-gray-100" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
        <a href="/" className="flex items-center gap-2">
          <img src="/favicon.jpg" alt="Kangqore" className="w-8 h-8 rounded-lg" />
          <span className="font-black text-gray-900 text-lg tracking-tight">Kangqore</span>
        </a>
        <span className="ml-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#2564ea18', color: '#2564ea' }}>
          BIDS™ Diagnostic Assessment
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-5 gap-10 items-start">
        {/* Left pitch — 2 columns */}
        <div className="md:col-span-2 pt-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
            Discover exactly where your business is losing performance
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            The BIDS™ (Business Diagnostic Intelligence System) delivers a deep 16-pillar diagnostic of your
            organisation — pinpointing operational gaps, prioritising transformation, and generating a WAANDA™-powered
            roadmap used by enterprise leaders to make confident decisions.
          </p>

          <div className="space-y-5">
            {[
              { icon: '🎯', title: '16-Pillar Deep Diagnostic', desc: 'Complete analysis across strategy, operations, AI, governance, and more.' },
              { icon: '🤖', title: 'WAANDA™ AI Roadmap', desc: 'Personalised transformation roadmap powered by our enterprise AI.' },
              { icon: '📊', title: 'OIS Score', desc: 'Your Operational Intelligence Score — a single number to track ROI over time.' },
              { icon: '🔒', title: 'Private & Confidential', desc: 'Your data lives inside your own secure diagnostic portal. Never shared.' },
            ].map(b => (
              <div key={b.title} className="flex gap-3">
                <span className="text-xl mt-0.5">{b.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-xl border border-blue-100" style={{ background: '#f0f4ff' }}>
            <p className="text-xs font-bold text-gray-700 mb-1">What clients say</p>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              "The BIDS™ diagnostic gave us a clarity we hadn't had in years. The WAANDA roadmap told us exactly
              what to fix first and why."
            </p>
            <p className="text-xs text-gray-400 mt-2">— Enterprise Client, Manufacturing</p>
          </div>
        </div>

        {/* Right form — 3 columns */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-black text-gray-900 mb-1">Start Your Diagnostic Assessment</h2>
          <p className="text-xs text-gray-400 mb-6">2 minutes. Portal activated within 24 hours.</p>

          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm font-medium" style={{ background: '#fee2e2', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={LABEL_STYLE}>First Name *</label>
                <input value={form.firstName} onChange={set('firstName')} required placeholder="Rahul" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Last Name *</label>
                <input value={form.lastName} onChange={set('lastName')} required placeholder="Sharma" style={INPUT_STYLE} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={LABEL_STYLE}>Business Email *</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="rahul@company.com" style={INPUT_STYLE} />
            </div>

            {/* Phone + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={LABEL_STYLE}>Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98..." style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Country *</label>
                <input value={form.country} onChange={set('country')} required placeholder="India" style={INPUT_STYLE} />
              </div>
            </div>

            {/* Company */}
            <div>
              <label style={LABEL_STYLE}>Company / Organisation *</label>
              <input value={form.company} onChange={set('company')} required placeholder="Your organisation name" style={INPUT_STYLE} />
            </div>

            {/* Industry + Team Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={LABEL_STYLE}>Industry *</label>
                <select value={form.industry} onChange={set('industry')} required style={INPUT_STYLE}>
                  <option value="">Select industry</option>
                  {BIDS_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL_STYLE}>Team Size *</label>
                <select value={form.employees} onChange={set('employees')} required style={INPUT_STYLE}>
                  <option value="">Select range</option>
                  {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r} people</option>)}
                </select>
              </div>
            </div>

            {/* Primary challenge */}
            <div>
              <label style={LABEL_STYLE}>Primary Challenge *</label>
              <select value={form.primaryChallenge} onChange={set('primaryChallenge')} required style={INPUT_STYLE}>
                <option value="">What's your biggest pain point?</option>
                {PRIMARY_CHALLENGES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label style={LABEL_STYLE}>Timeline / Urgency *</label>
              <select value={form.urgency} onChange={set('urgency')} required style={INPUT_STYLE}>
                <option value="">How soon are you looking to move?</option>
                {URGENCY_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>

            {/* How did you hear */}
            <div>
              <label style={LABEL_STYLE}>How did you hear about us?</label>
              <select value={form.howDidYouHear} onChange={set('howDidYouHear')} style={INPUT_STYLE}>
                <option value="">Select...</option>
                {HOW_DID_YOU_HEAR.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="bids-consent"
                checked={form.consent}
                onChange={set('consent')}
                required
                style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#2564ea', flexShrink: 0 }}
              />
              <label htmlFor="bids-consent" className="text-xs text-gray-500 leading-relaxed" style={{ cursor: 'pointer' }}>
                I agree that Kangqore may contact me about this diagnostic request. Data is handled per our{' '}
                <a href="/privacy" style={{ color: '#2564ea', textDecoration: 'underline' }}>Privacy Policy</a>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !form.consent}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: submitting || !form.consent ? '#cbd5e1' : 'linear-gradient(90deg, #2564ea, #4ab6d4)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.02em',
                border: 'none',
                cursor: submitting || !form.consent ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {submitting ? (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Submitting...
                </>
              ) : 'Start Your Diagnostic Assessment →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
