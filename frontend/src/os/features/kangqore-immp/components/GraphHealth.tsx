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
    <Card className="os-card text-[var(--os-text-1)] shadow-sm border border-[var(--os-border)]">
      <CardHeader className="pb-2 border-b border-[var(--os-border)]">
        <CardTitle className="text-sm font-semibold text-[var(--os-text-1)] flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-500" />
          Semantic Graph Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--os-text-3)] uppercase tracking-wider font-bold">Nodes</span>
            <span className="text-2xl font-black text-[var(--os-text-1)]">{stats.nodes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--os-text-3)] uppercase tracking-wider font-bold">Edges</span>
            <span className="text-2xl font-black text-[var(--os-text-1)]">{stats.edges}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--os-text-3)] uppercase tracking-wider font-bold">Knowledge Packs</span>
            <span className="text-2xl font-black text-cyan-500">{stats.packs}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--os-text-3)] uppercase tracking-wider font-bold">Orphans</span>
            <span className={`text-2xl font-black ${stats.orphans > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {stats.orphans}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[var(--os-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-[var(--os-text-2)]">
              <ShieldCheck className="w-3 h-3 text-green-500" /> Cycles
            </span>
            <span className="text-[var(--os-text-1)]">{stats.cycles} (Valid)</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-[var(--os-text-2)]">
              <AlertTriangle className={`w-3 h-3 ${stats.warnings > 0 ? 'text-yellow-500' : 'text-[var(--os-text-3)]'}`} /> Warnings
            </span>
            <span className="text-[var(--os-text-1)]">{stats.warnings}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2 text-[var(--os-text-2)]">
              <Box className="w-3 h-3 text-blue-500" /> Compiled
            </span>
            <span className="text-[var(--os-text-1)] font-bold">Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
