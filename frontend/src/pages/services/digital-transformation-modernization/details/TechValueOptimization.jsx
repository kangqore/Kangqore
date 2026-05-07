import React from 'react';
import { 
  ArrowRight, 
  DollarSign, 
  TrendingDown, 
  Activity, 
  Target, 
  ShieldCheck, 
  BarChart3, 
  ArrowLeft,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TechValueOptimization = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      {/* Navigation Breadcrumb */}
      <div className="bg-slate-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/services/digital-transformation-modernization/technology-transformation" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Technology Transformation
          </Link>
        </div>
      </div>

      {/* Hero Panel (Dark Background) */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between text-white mb-4">
                      <span className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Capital Efficiency</span>
                      <span className="text-2xl font-bold">+35%</span>
                    </div>
                    <div className="h-2 w-full bg-white dark:bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-brand-gradient"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {[
                        { label: 'Run', val: '-25%', color: 'text-blue-400' },
                        { label: 'Cloud', val: '-40%', color: 'text-emerald-400' },
                        { label: 'Value', val: '2.5X', color: 'text-purple-400' }
                      ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-4 rounded-xl border border-white/5">
                          <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-tighter">{s.label}</div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
                Pillar 02 :: Value Optimization
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-[0.9] font-display">
                Turn Spend Into <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic">Competitive Advantage.</span>
              </h1>
              <p className="text-xl text-blue-100/80 mb-10 leading-relaxed font-light">
                Technology investment should accelerate growth — not accumulate silent debt. Kangqore transforms opaque IT costs into measurable business value.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl">
                  Analyze My Spend
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Enterprise Reality Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-display">
                The Silent Erosion: <br />
                <span className="text-brand-blue">Unchecked Technical Debt.</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-400 mb-8 leading-relaxed font-light">
                As organizations rapidly adopt AI and cloud, technical debt is growing at an unprecedented rate. 41% of executives identify AI as the leading contributor to technical debt.
              </p>
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl">
                <div className="flex items-start gap-4">
                  <PieChart className="w-12 h-12 text-brand-blue flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Cost Distortion Factors</h4>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {['Redundant tools', 'Overprovisioned cloud', 'Shadow IT expansion', 'Run-cost inflation'].map((t, i) => (
                        <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Portfolio Rationalization', desc: 'Identify and eliminate redundant systems and low-return contracts.', icon: Target },
                { title: 'Cloud FinOps', desc: 'Real-time visibility and optimization of cloud infrastructure spend.', icon: Activity },
                { title: 'Debt Reduction', desc: 'Systematic mapping and retirement of high-friction technical debt.', icon: ShieldCheck },
                { title: 'Value Governance', desc: 'Linking every technology dollar to a measurable enterprise outcome.', icon: BarChart3 }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <item.icon className="w-8 h-8 text-brand-blue mb-4" />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Business Impact Delivered</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">Optimization is about more than just cutting costs — it's about shifting capital toward innovation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Improved Financial Governance', desc: 'Clear visibility into IT spend and value contribution across the enterprise.', icon: CheckCircle2 },
              { title: 'Reduced IT Run Costs', desc: 'Efficiency gains through automation and vendor rationalization.', icon: CheckCircle2 },
              { title: 'Increased Reinvestment Capacity', desc: 'Freed capital redirected into AI and competitive differentiation.', icon: CheckCircle2 }
            ].map((card, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-10 rounded-[2rem] border border-slate-200">
                <card.icon className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-light">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient rounded-3xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-6 font-display tracking-tight">Stop Silent Debt from Eroding Your Growth.</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
              Transform your technology spend into a strategic engine for innovation. 
            </p>
            <Link to="/contact" className="px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl flex items-center gap-2 justify-center mx-auto w-fit">
              Request Value Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechValueOptimization;
