import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowDown, BrainCircuit, Activity, FileText, Target, Crosshair, CheckCircle2, XCircle } from 'lucide-react';

interface TraceData {
  trace: {
    visitor: { id: string; persona: string };
    events: string[];
    decisionState: string;
    objective: string;
    recommendation: string;
    confidence: number;
  };
  alternatives: any[];
}

export function ReasoningExplorer({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<TraceData | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const fetchTrace = async () => {
      try {
        const res = await axios.post('http://localhost:5050/api/hcip/explain', { sessionId });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrace();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--os-text-3)] bg-white/[0.01] rounded-2xl border border-[var(--os-border)] py-12">
        Select a session to view Reasoning Trace
      </div>
    );
  }

  if (!data) return <div className="text-[var(--os-text-3)] p-4 font-semibold">Tracing graph...</div>;

  const { trace, alternatives } = data;

  const Step = ({ icon: Icon, title, value, detail, highlight = false }: any) => (
    <div className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${highlight ? 'border-cyan-500/30 bg-cyan-500/[0.04]' : 'border-[var(--os-border)] bg-white/[0.02]'}`}>
      <div className={`p-2 rounded-2xl ${highlight ? 'bg-cyan-500/20 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' : 'bg-white/[0.05] text-[var(--os-text-2)]'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-[var(--os-text-3)] uppercase tracking-wider font-bold">{title}</div>
        <div className={`text-lg font-bold ${highlight ? 'text-[var(--os-text-1)]' : 'text-[var(--os-text-1)]'}`}>{value}</div>
        {detail && <div className="text-sm text-[var(--os-text-2)] mt-1 font-medium">{detail}</div>}
      </div>
    </div>
  );

  return (
    <Card className="os-card text-[var(--os-text-1)] border border-[var(--os-border)] h-full overflow-y-auto">
      <CardHeader className="border-b border-[var(--os-border)] sticky top-0 bg-[var(--os-card)] backdrop-blur z-10">
        <CardTitle className="text-lg font-bold text-[var(--os-text-1)] flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#2564ea]" />
          Reasoning Explorer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-2">
          {/* 1. Observation */}
          <Step 
            icon={Activity} 
            title="Observation Layer" 
            value={`${trace.events.length} Semantic Events`} 
            detail={trace.events.join(' → ')}
          />
          
          <div className="flex justify-center py-1">
            <ArrowDown className="w-4 h-4 text-[var(--os-text-3)]" />
          </div>
 
          {/* 2. Knowledge Inference */}
          <Step 
            icon={FileText} 
            title="Semantic Inference (Knowledge Layer)" 
            value={trace.decisionState} 
            detail={`Persona: ${trace.visitor.persona}`}
          />
 
          <div className="flex justify-center py-1">
            <ArrowDown className="w-4 h-4 text-[var(--os-text-3)]" />
          </div>
 
          {/* 3. Objective Engine */}
          <Step 
            icon={Target} 
            title="Active Objective" 
            value={trace.objective || 'Identify Intent'} 
          />
 
          <div className="flex justify-center py-1">
            <ArrowDown className="w-4 h-4 text-[var(--os-text-3)]" />
          </div>
 
          {/* 4. Recommendation */}
          <Step 
            icon={Crosshair} 
            title="Final Recommendation" 
            value={trace.recommendation} 
            detail={`Overall Confidence: ${trace.confidence}%`}
            highlight={true}
          />
 
          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[var(--os-border)]">
              <h4 className="text-sm font-bold text-[var(--os-text-2)] mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Rejected Paths
              </h4>
              <div className="space-y-3">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="p-3 bg-red-500/[0.03] border border-red-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[var(--os-text-1)] font-semibold text-sm">{alt.action}</span>
                      <span className="text-red-500 text-xs font-mono font-bold">{alt.confidence}% Conf</span>
                    </div>
                    <div className="text-xs text-[var(--os-text-2)]">
                      Reason: <span className="text-red-400 font-medium">{alt.rejectedReason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
 
        </div>
      </CardContent>
    </Card>
  );
}
