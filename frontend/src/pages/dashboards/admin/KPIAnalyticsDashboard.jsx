import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Target, Users, Shield, AlertTriangle, CheckCircle,
  Brain, Zap, Clock, PieChart as PieChartIcon, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';

// ============================================================================
// MOCK DATA
// ============================================================================
const revenueData = [
  { month: 'Jan', revenue: 4200000, margin: 48 },
  { month: 'Feb', revenue: 4800000, margin: 51 },
  { month: 'Mar', revenue: 5500000, margin: 54 },
  { month: 'Apr', revenue: 5100000, margin: 50 },
  { month: 'May', revenue: 6200000, margin: 56 },
  { month: 'Jun', revenue: 7800000, margin: 62 },
];

const aiPerformanceData = [
  { name: 'Jan', cost: 0.12, revenue: 0.85 },
  { name: 'Feb', cost: 0.11, revenue: 0.88 },
  { name: 'Mar', cost: 0.09, revenue: 0.92 },
  { name: 'Apr', cost: 0.08, revenue: 0.95 },
  { name: 'May', cost: 0.06, revenue: 1.10 },
  { name: 'Jun', cost: 0.04, revenue: 1.25 },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 75, color: '#10B981' },
  { name: 'Medium Risk', value: 20, color: '#F59E0B' },
  { name: 'High Risk', value: 5, color: '#EF4444' },
];

const MetricCard = ({ title, value, subtext, trend, icon: Icon, trendUp }) => (
  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-xl ${trendUp ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-brand-blue'}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        trend === 'stable' ? 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400' :
        trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {subtext}
      </span>
    </div>
  </div>
);

const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 18 }, { value: 24 }, { value: 22 }, { value: 30 }
];

const TinyLineChart = ({ data, color }) => (
  <div className="h-8 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const KPIAnalyticsDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout
      role="admin"
      title="KPI Analytics"
      subtitle="Strategic oversight of financial health, growth, and AI governance."
    >
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. EXECUTIVE SUMMARY (Top Strip) */}
      <section className="bg-white dark:bg-black dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x divide-gray-100">
          
          <div className="px-4 first:pl-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Revenue Growth (QoQ)</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">32%</span>
              <span className="text-xs font-medium text-gray-500 mb-1">Target: 20%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Exceeding Plan</div>
              <TinyLineChart data={sparklineData} color="#10B981" />
            </div>
          </div>

          <div className="px-4">
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gross Margin</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">62%</span>
              <span className="text-xs font-medium text-gray-500 mb-1">Target: 50%+</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Healthy</div>
              <TinyLineChart data={sparklineData} color="#10B981" />
            </div>
          </div>

          <div className="px-4">
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pipeline Value</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₹14.5 Cr</span>
              <span className="text-xs font-medium text-gray-500 mb-1">3.5x Monthly</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Strong Coverage</div>
              <TinyLineChart data={sparklineData} color="#10B981" />
            </div>
          </div>

          <div className="px-4">
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cash Runway</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">14 Mo</span>
              <span className="text-xs font-medium text-gray-500 mb-1">Target: 12+</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">Monitor</div>
              <TinyLineChart data={sparklineData} color="#EAB308" />
            </div>
          </div>

          <div className="px-4">
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Exp. Velocity</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">8/mo</span>
              <span className="text-xs font-medium text-gray-500 mb-1">Target: 5+</span>
            </div>
             <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-brand-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">High Innovation</div>
              <TinyLineChart data={sparklineData} color="#2563EB" />
            </div>
          </div>

        </div>
      </section>

      {/* 2. FINANCIAL HEALTH */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Financial Health</h3>
              <p className="text-sm text-gray-500">Revenue Analysis & Margin Trends</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-brand-blue"></span>
               <span className="text-xs text-gray-500">Revenue</span>
               <span className="w-3 h-3 rounded-full bg-green-500 ml-4"></span>
               <span className="text-xs text-gray-500">Margin %</span>
            </div>
          </div>
          
          <div className="mb-4 text-center">
             <span className="text-xs font-serif italic text-gray-400 tracking-wider">Operating Leverage Improving</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

           <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 p-3 rounded-xl">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Interpretation:</span>
            Growth remains strong with improving margin discipline and controlled burn.
          </div>
        </div>

        <div className="space-y-4">
          <MetricCard 
            title="EBITDA" 
            value="₹1.2 Cr" 
            subtext="+12% vs Last Qtr" 
            trendUp={true}
            icon={Activity} 
          />
          <MetricCard 
            title="Operating Cash Flow" 
            value="₹45 L" 
            subtext="Positive" 
            trendUp={true}
            icon={DollarSign} 
          />
          <MetricCard 
            title="Burn Multiple" 
            value="0.8" 
            subtext="Efficient (<1.0)" 
            trendUp={true} // Efficient is good
            icon={Zap} 
          />
        </div>
      </section>

      {/* 3. GROWTH ENGINE */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Growth Engine (GTM Efficiency)</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">LTV:CAC Ratio</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">4.2x</h3>
            <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5">
              <div className="bg-brand-gradient w-4/5 h-1.5 rounded-full"></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Target: 3.0x (Healthy)</p>
          </div>

           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Deal Size</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">₹42 L</h3>
            <p className="text-xs text-green-600 font-medium">+15% YoY Growth</p>
          </div>

           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pipeline Velocity</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">45 Days</h3>
            <p className="text-xs text-blue-600 font-medium">-5 Days (Faster)</p>
          </div>

           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI Search Visibility</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">68%</h3>
             <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5">
              <div className="bg-purple-500 w-[68%] h-1.5 rounded-full"></div>
            </div>
          </div>

          {/* NEW: Revenue per Employee */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100">
             <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rev / Employee</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">₹2.4 Cr</h3>
            <p className="text-[10px] text-gray-400 mt-2">Operational Intelligence</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20/50 rounded-xl border border-blue-100 text-sm text-blue-900 italic">
          <span className="font-semibold not-italic">Board Insight:</span> Acquisition efficiency stable; increasing deal size driving margin expansion.
        </div>
      </section>

      {/* 4. AI PERFORMANCE LAYER */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-brand-blue" />
              AI Performance Layer
            </h2>
            <p className="text-slate-400 text-sm mt-1">2026 Competitive Advantage Metrics</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 px-3 py-1 rounded-full text-xs font-medium border border-white/10">
            Internal Leverage: High
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 relative z-10">
          {/* Chart: Unit Economics */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Unit Economics (Cost vs Revenue per Inference)</h3>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiPerformanceData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={false} name="Rev/Inf" />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} dot={false} name="Cost/Inf" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4 text-xs">
              <span className="flex items-center gap-2 text-sky-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-sky-400"></div> Revenue per Inference (Rising)
              </span>
               <span className="flex items-center gap-2 text-red-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-red-400"></div> Cost per Inference (Falling)
              </span>
            </div>
            
            {/* NEW: AI Contribution Metric */}
            <div className="mt-8 p-4 bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/10 rounded-xl flex items-center justify-between backdrop-blur-sm">
               <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">AI Revenue Contribution</p>
                  <p className="text-sm text-slate-500">Directly attributable leverage</p>
               </div>
               <div className="text-3xl font-bold text-brand-blue text-shadow-glow">68%</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
               <p className="text-xs text-slate-400 mb-1">AI Feature Utilization</p>
               <h4 className="text-3xl font-bold text-white mb-2">84%</h4>
               <p className="text-[10px] text-slate-500">Active engagement</p>
            </div>
             <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
               <p className="text-xs text-slate-400 mb-1">Proprietary Data Ratio</p>
               <h4 className="text-3xl font-bold text-white mb-2">92%</h4>
               <p className="text-[10px] text-green-400">High Defensibility</p>
            </div>
             <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
               <p className="text-xs text-slate-400 mb-1">Automation Rate</p>
               <h4 className="text-3xl font-bold text-white mb-2">65%</h4>
               <p className="text-[10px] text-slate-500">Workflows fully autonomous</p>
            </div>
             <div className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
               <p className="text-xs text-slate-400 mb-1">Model Iteration</p>
               <h4 className="text-3xl font-bold text-white mb-2">4 Days</h4>
               <p className="text-[10px] text-blue-400">Concept to Prod velocity</p>
            </div>
          </div>
        </div>

         <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-slate-300">
          “AI unit economics sustainable; internal AI leverage reducing operational cost.”
        </div>
      </section>

      {/* 5. PRODUCT & RETENTION */}
      <section className="bg-white dark:bg-black dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Product & Retention</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
             <CircularMetric value={118} label="NRR" suffix="%" color="#10B981" />
          </div>
          
           <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
             <div className="h-20 flex items-center justify-center">
               <span className="text-3xl font-bold text-red-500">1.2%</span>
             </div>
             <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Churn Rate</p>
          </div>

           <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
             <div className="h-20 flex items-center justify-center">
               <span className="text-3xl font-bold text-gray-900 dark:text-white">12.5k</span>
             </div>
             <p className="text-xs font-semibold text-gray-500 uppercase mt-2">MAU</p>
          </div>

           <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
             <div className="h-20 flex items-center justify-center">
               <span className="text-3xl font-bold text-blue-600">98%</span>
             </div>
             <p className="text-xs font-semibold text-gray-500 uppercase mt-2">Retention Rate</p>
          </div>

           <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex flex-col justify-center text-left">
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Board Interpretation</p>
             <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">“Retention improving; expansion revenue driving NRR above 110%.”</p>
          </div>

        </div>
      </section>

      {/* 6. RISK & GOVERNANCE */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Risk Assessment */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" /> 
                Risk & Governance
              </h3>
              <p className="text-sm text-gray-500">Enterprise-Grade Assurance</p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Stable Status
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-xl border-gray-100">
              <PieChart width={100} height={100} className="mx-auto">
                <Pie data={riskDistributionData} innerRadius={35} outerRadius={45} paddingAngle={2} dataKey="value">
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">94/100</h4>
              <p className="text-xs text-gray-500">AI Compliance Score</p>
            </div>

             <div className="flex flex-col justify-center gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Data Exposure Risk</span>
                  <span className="font-bold text-green-600">Low</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-2">
                  <div className="bg-green-500 w-[15%] h-2 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Auditability</span>
                  <span className="font-bold text-brand-blue">100%</span>
                </div>
                 <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-2">
                  <div className="bg-brand-blue w-full h-2 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl flex flex-col justify-center items-center text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">Responsible AI</p>
              <p className="text-xs text-gray-500 mt-1">Status: <span className="text-green-600 font-bold">Aligned ISO 42001</span></p>
            </div>
          </div>
        </div>
        
        {/* NEW: STRATEGIC MOAT INDICATORS - Moved here in layout or inserted as strip */}
        <div className="lg:col-span-1 flex flex-col gap-4">
           {/* Moat Strip */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 pb-2">Strategic Moat Indicators</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500">Switching Cost Index</span>
                     <span className="text-sm font-bold text-brand-blue">High (8.5/10)</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500">Customer Concentration</span>
                     <span className="text-sm font-bold text-green-600">Low (Top 10 = 12%)</span>
                  </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500">Expansion Revenue</span>
                     <span className="text-sm font-bold text-gray-900 dark:text-white">35%</span>
                  </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500">Partner Ecosystem</span>
                     <span className="text-sm font-bold text-gray-900 dark:text-white">Deep (40+ Integ)</span>
                  </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500">Brand Authority</span>
                     <span className="text-sm font-bold text-purple-600">Start Rating 4.9</span>
                  </div>
              </div>
           </div>
        </div>

      </section>
      
      {/* Board Statement */}
      <section className="bg-gradient-to-br from-brand-blue to-blue-800 text-white p-10 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        
        <h3 className="text-lg font-bold mb-6 opacity-80 uppercase tracking-widest text-xs">Board Strategic View</h3>
        
        <blockquote className="text-2xl md:text-3xl font-serif font-medium leading-relaxed italic mb-8 max-w-4xl mx-auto">
          “AI unit economics compounding; governance framework mature. Company positioned for institutional capital.”
        </blockquote>
        
        <div className="flex items-center justify-center gap-3 text-sm opacity-70">
           <CheckCircle className="w-5 h-5" />
           <span className="font-semibold tracking-wider uppercase">Signed: QX 2026 Audit Committee</span>
        </div>
      </section>

    </div>
    </DashboardLayout>
  );
};

// Helper for circular progress
const CircularMetric = ({ value, label, suffix, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
          <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="8" fill="transparent" strokeDasharray={226} strokeDashoffset={226 - (226 * value) / 100} strokeLinecap="round" />
        </svg>
        <span className="absolute text-lg font-bold text-gray-900 dark:text-white">{value}{suffix}</span>
      </div>
       <p className="text-xs font-semibold text-gray-500 uppercase mt-2">{label}</p>
    </div>
  );
};

export default KPIAnalyticsDashboard;
