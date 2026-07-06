import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Share2, AlertTriangle, ShieldCheck, Box } from 'lucide-react';
import axios from 'axios';

export function GraphHealth() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/hcip/graph/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="text-gray-400">Loading Semantic Graph Stats...</div>;

  return (
    <Card className="bg-black/40 border-gray-800 text-white shadow-xl shadow-cyan-900/10">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-500" />
          Semantic Graph Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Nodes</span>
            <span className="text-2xl font-bold text-gray-100">{stats.nodes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Edges</span>
            <span className="text-2xl font-bold text-gray-100">{stats.edges}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Knowledge Packs</span>
            <span className="text-2xl font-bold text-cyan-400">{stats.packs}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Orphans</span>
            <span className={`text-2xl font-bold ${stats.orphans > 0 ? 'text-orange-400' : 'text-green-400'}`}>
              {stats.orphans}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-3 h-3 text-green-500" /> Cycles
            </span>
            <span className="text-gray-300">{stats.cycles} (Valid)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-gray-400">
              <AlertTriangle className={`w-3 h-3 ${stats.warnings > 0 ? 'text-yellow-500' : 'text-gray-600'}`} /> Warnings
            </span>
            <span className="text-gray-300">{stats.warnings}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-gray-400">
              <Box className="w-3 h-3 text-blue-500" /> Compiled
            </span>
            <span className="text-gray-300">Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
