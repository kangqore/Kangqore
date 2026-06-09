import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const InvestorPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - in real app, fetch from /api/investor/portfolio
  const mockPortfolio = [
    {
      id: '1',
      company: 'Kangqore AI',
      investment: 500000,
      equity: '5%',
      valuation: '10M',
      growth: '+12%',
      status: 'Active',
      performanceData: [
        { month: 'Jan', value: 100 },
        { month: 'Feb', value: 120 },
        { month: 'Mar', value: 135 },
        { month: 'Apr', value: 150 },
        { month: 'May', value: 180 },
        { month: 'Jun', value: 200 }
      ]
    },
    {
      id: '2',
      company: 'GreenTech Solutions',
      investment: 250000,
      equity: '2.5%',
      valuation: '5M',
      growth: '+8%',
      status: 'Active',
      performanceData: [
        { month: 'Jan', value: 80 },
        { month: 'Feb', value: 85 },
        { month: 'Mar', value: 90 },
        { month: 'Apr', value: 95 },
        { month: 'May', value: 100 },
        { month: 'Jun', value: 110 }
      ]
    }
  ];

  /*
  // Future Backend Integration
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/investor/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };
  */

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPortfolio(mockPortfolio);
      setLoading(false);
    }, 1000);
  }, []);

  const totalInvestment = portfolio.reduce((sum, item) => sum + item.investment, 0);

  return (
    <DashboardLayout role="investor" title="My Portfolio" subtitle="Overview of your investments and performance">
      <div className="space-y-6">

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${(totalInvestment / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Portfolio Companies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolio.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Growth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">+10%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {portfolio.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.company}</h3>
                  <p className="text-sm text-gray-500">Equity: {item.equity}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {item.status}
                </span>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div>
                     <p className="text-xs text-gray-500 uppercase font-semibold">Investment</p>
                     <p className="text-lg font-bold text-gray-900 dark:text-white">${item.investment.toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 uppercase font-semibold">Valuation</p>
                     <p className="text-lg font-bold text-gray-900 dark:text-white">{item.valuation}</p>
                   </div>
                </div>

                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.performanceData}>
                      <defs>
                        <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#0066FF" fill={`url(#gradient-${item.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-[#050505] text-center">
                <button className="text-brand-blue font-semibold text-sm hover:underline flex items-center justify-center gap-1">
                  View Full Report <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default InvestorPortfolio;
