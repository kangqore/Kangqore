import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, Zap, Shield, Network, BrainCircuit, Activity } from 'lucide-react';
import SEO from '../components/SEO';

const CAPABILITIES = [
  { name: 'Boards', legacy: true, kangqore: true },
  { name: 'Projects', legacy: true, kangqore: true },
  { name: 'Tasks', legacy: true, kangqore: true },
  { name: 'Dashboards', legacy: true, kangqore: true },
  { name: 'Automations', legacy: true, kangqore: true },
  { name: 'Marketplace', legacy: true, kangqore: true },
  { name: 'Enterprise ontology', legacy: false, kangqore: true },
  { name: 'Semantic relationships', legacy: 'Limited', kangqore: true },
  { name: 'AI runtime', legacy: 'Limited', kangqore: true },
  { name: 'Governed AI execution', legacy: 'Limited', kangqore: true },
  { name: 'Decision intelligence', legacy: false, kangqore: true },
  { name: 'Outcome intelligence', legacy: false, kangqore: true },
  { name: 'Enterprise action fabric', legacy: false, kangqore: true },
  { name: 'Autonomous workflows', legacy: 'Limited', kangqore: true },
  { name: 'Policy-controlled execution', legacy: 'Limited', kangqore: true },
];

export default function EnterpriseSupersetPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 font-sans text-white">
      <SEO 
        title="The Intelligence-First Enterprise Superset | Kangqore"
        description="Beyond the Work OS. Discover how Kangqore upgrades legacy flat workspaces into a governed, AI-native enterprise ontology."
      />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <section className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/20 blur-[120px] pointer-events-none rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-bold mb-6"
          >
            <BrainCircuit className="w-4 h-4" /> The Next Evolution of Work
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            Beyond the Work OS.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              The Intelligence-First Superset.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Kangqore provides everything you expect from a modern Work OS—projects, tasks, automations, and dashboards—but fundamentally connects those capabilities into a deep, AI-governed semantic system.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/kangqore-view/admin/ontology/migration" className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors">
              Upgrade Your Workspace <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        {/* The Deeper System Visual */}
        <section className="mb-32">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Network} 
              title="Semantic Relationships" 
              desc="Flat boards are replaced by an intelligent graph where every entity is inherently connected and relationship-aware."
            />
            <FeatureCard 
              icon={Shield} 
              title="Governed AI Execution" 
              desc="Automations are upgraded to autonomous pipelines, restricted by AEGIS policies to prevent unauthorized data actions."
            />
            <FeatureCard 
              icon={Activity} 
              title="Outcome Intelligence" 
              desc="Move past vanity metrics. The system tracks decisions against actual business outcomes in real-time."
            />
          </div>
        </section>

        {/* The Matrix */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">The Competitive Matrix</h2>
            <p className="text-gray-400">Why leading enterprises are abandoning flat spreadsheets and legacy Work OS tools for Kangqore View.</p>
          </div>

          <div className="bg-[#0f0f11] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 py-6 px-8 text-sm font-bold uppercase tracking-wider text-gray-400">
              <div className="col-span-6">Capability</div>
              <div className="col-span-3 text-center">Legacy Work OS</div>
              <div className="col-span-3 text-center text-emerald-400">Kangqore View</div>
            </div>
            
            <div className="divide-y divide-white/5">
              {CAPABILITIES.map((cap, i) => (
                <div key={i} className="grid grid-cols-12 py-5 px-8 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-6 font-medium text-lg">{cap.name}</div>
                  <div className="col-span-3 flex justify-center items-center text-sm font-medium">
                    {cap.legacy === true ? <CheckCircle2 className="w-6 h-6 text-gray-500" /> : 
                     cap.legacy === 'Limited' ? <span className="text-amber-500/70 border border-amber-500/20 bg-amber-500/10 px-3 py-1 rounded-full text-xs">Limited</span> : 
                     <XCircle className="w-6 h-6 text-red-500/50" />}
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-[#0f0f11] border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="w-10 h-10 text-emerald-400 mb-6" />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
