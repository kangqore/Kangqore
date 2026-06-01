import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Plus, Trash2, RefreshCw, Check, AlertCircle, Clock, Copy, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

function StatusBadge({ status }) {
  const map = {
    VERIFIED: 'bg-green-100 text-green-700',
    PENDING:  'bg-yellow-100 text-yellow-700',
    ERROR:    'bg-red-100 text-red-600',
  };
  const icons = { VERIFIED: Check, PENDING: Clock, ERROR: AlertCircle };
  const Icon = icons[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${map[status] || map.PENDING}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
}

function InstructionsPanel({ domain, onClose }) {
  const { toast } = useToast();
  const bookingHost = process.env.REACT_APP_BOOKING_HOST || 'book.kangqore.com';
  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">DNS Setup for {domain.domain}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          <p className="text-sm text-gray-500">Add these two DNS records at your domain registrar, then click Verify.</p>

          {/* CNAME */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 1 — CNAME record</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2 text-sm font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Name</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white">{domain.domain}</span>
                  <button onClick={() => copy(domain.domain)} className="text-brand-blue hover:opacity-70"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900 dark:text-white">CNAME</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Value</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white">{bookingHost}</span>
                  <button onClick={() => copy(bookingHost)} className="text-brand-blue hover:opacity-70"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* TXT */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 2 — TXT verification record</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2 text-sm font-mono">
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-500 shrink-0">Name</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-900 dark:text-white truncate">_kangqore-verify.{domain.domain}</span>
                  <button onClick={() => copy(`_kangqore-verify.${domain.domain}`)} className="text-brand-blue hover:opacity-70 shrink-0"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 shrink-0">Type</span>
                <span className="text-gray-900 dark:text-white">TXT</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-500 shrink-0">Value</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-900 dark:text-white truncate text-xs">kangqore-verify={domain.verifyToken}</span>
                  <button onClick={() => copy(`kangqore-verify=${domain.verifyToken}`)} className="text-brand-blue hover:opacity-70 shrink-0"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300">
            DNS propagation typically takes 5–30 minutes, but can take up to 24 hours.
          </div>
        </div>

        <div className="px-8 pb-8">
          <button onClick={onClose}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomDomains() {
  const { toast } = useToast();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [verifying, setVerifying] = useState(null);
  const [instructions, setInstructions] = useState(null);

  const token = () => localStorage.getItem('token');

  useEffect(() => { fetchDomains(); }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/custom-domains`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      setDomains(res.data.domains || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load domains.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/custom-domains`,
        { domain: newDomain.trim().toLowerCase() },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setNewDomain('');
      setInstructions(res.data.domain);
      fetchDomains();
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to add domain.', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleVerify = async (domain) => {
    setVerifying(domain.id);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/custom-domains/${domain.id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      if (res.data.verified) {
        toast({ title: 'Verified!', description: `${domain.domain} is now active.` });
      } else {
        toast({ title: 'Not verified yet', description: res.data.message, variant: 'destructive' });
      }
      fetchDomains();
    } catch {
      toast({ title: 'Verification failed', variant: 'destructive' });
    } finally {
      setVerifying(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this custom domain?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/scheduling/custom-domains/${id}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      toast({ title: 'Domain removed' });
      fetchDomains();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-10">

        <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Custom Domains</h1>
          </div>
          <p className="text-gray-500">
            Host your booking pages at your own domain (e.g. <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">book.acme.com</code>).
          </p>
        </div>

        {/* Add domain */}
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            placeholder="book.yourdomain.com"
            className="flex-1 px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <button type="submit" disabled={adding || !newDomain.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Domain
          </button>
        </form>

        {/* Domain list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem]">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-500">No custom domains yet</p>
            <p className="text-sm text-gray-400 mt-1">Add a domain above to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map(d => (
              <div key={d.id}
                className={`border rounded-2xl p-5 flex items-center gap-4 transition-all ${
                  d.status === 'VERIFIED'
                    ? 'border-green-200 dark:border-green-900/40 bg-green-50/30 dark:bg-green-900/5'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{d.domain}</p>
                    <StatusBadge status={d.status} />
                  </div>
                  {d.status === 'VERIFIED' && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Verified {new Date(d.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                  {d.status !== 'VERIFIED' && (
                    <button
                      onClick={() => setInstructions(d)}
                      className="text-xs text-brand-blue font-bold mt-1 hover:underline"
                    >
                      View DNS instructions →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {d.status !== 'VERIFIED' && (
                    <button
                      onClick={() => handleVerify(d)}
                      disabled={verifying === d.id}
                      className="px-4 py-2 text-sm font-bold border border-brand-blue text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {verifying === d.id
                        ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Checking...</>
                        : <><Check className="w-3.5 h-3.5" />Verify</>
                      }
                    </button>
                  )}
                  <button onClick={() => handleDelete(d.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SSL note */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">SSL / HTTPS</p>
          SSL certificates are automatically provisioned by the Kangqore platform reverse proxy once your domain is verified.
          You do not need to configure SSL separately.
        </div>

      </div>

      {instructions && (
        <InstructionsPanel domain={instructions} onClose={() => setInstructions(null)} />
      )}
    </DashboardLayout>
  );
}
