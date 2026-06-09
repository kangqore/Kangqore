import React, { useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';

const LEAD_ENDPOINT = `${import.meta.env.VITE_BACKEND_URL || ''}/api/ai/concierge/lead`;

const LeadCaptureInline = ({ conversationId, defaultIntent, onSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [intent, setIntent] = useState(defaultIntent || '');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Thanks — a Kangqore consultant will be in touch within one business day.
          </p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            You can keep asking questions in the meantime.
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim() || undefined,
          intent: intent.trim() || undefined,
          conversationId,
        }),
      });
      if (!res.ok) throw new Error(`Could not submit (${res.status})`);
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-4 space-y-3"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Talk to a Kangqore consultant
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          We'll reach out within one business day. No obligation.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan/50"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan/50"
        />
      </div>
      <input
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        placeholder="Company (optional)"
        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan/50"
      />
      <textarea
        rows={2}
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="Briefly, what would you like to discuss? (optional)"
        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan/50 resize-none"
      />
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting || !name.trim() || !email.trim()}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Request a consultation
          </>
        )}
      </button>
    </form>
  );
};

export default LeadCaptureInline;
