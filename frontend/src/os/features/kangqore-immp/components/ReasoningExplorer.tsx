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
      <div className="flex items-center justify-center h-full text-gray-500 bg-black/20 rounded-xl border border-gray-800">
        Select a session to view Reasoning Trace
      </div>
    );
  }

  if (!data) return <div className="text-gray-400 p-4">Tracing graph...</div>;

  const { trace, alternatives } = data;

  const Step = ({ icon: Icon, title, value, detail, highlight = false }: any) => (
    <div className={`relative flex items-start gap-4 p-4 rounded-xl border ${highlight ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-gray-800 bg-black/40'}`}>
      <div className={`p-2 rounded-lg ${highlight ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{title}</div>
        <div className={`text-lg font-medium ${highlight ? 'text-white' : 'text-gray-200'}`}>{value}</div>
        {detail && <div className="text-sm text-gray-400 mt-1">{detail}</div>}
      </div>
    </div>
  );

  return (
    <Card className="bg-[#0a0a0a] border-gray-800 h-full overflow-y-auto">
      <CardHeader className="border-b border-gray-800 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-500" />
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
            <ArrowDown className="w-4 h-4 text-gray-700" />
          </div>

          {/* 2. Knowledge Inference */}
          <Step 
            icon={FileText} 
            title="Semantic Inference (Knowledge Layer)" 
            value={trace.decisionState} 
            detail={`Persona: ${trace.visitor.persona}`}
          />

          <div className="flex justify-center py-1">
            <ArrowDown className="w-4 h-4 text-gray-700" />
          </div>

          {/* 3. Objective Engine */}
          <Step 
            icon={Target} 
            title="Active Objective" 
            value={trace.objective || 'Identify Intent'} 
          />

          <div className="flex justify-center py-1">
            <ArrowDown className="w-4 h-4 text-gray-700" />
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
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected Paths
              </h4>
              <div className="space-y-3">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="p-3 bg-red-950/10 border border-red-900/30 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 font-medium">{alt.action}</span>
                      <span className="text-red-400 text-xs font-mono">{alt.confidence}% Conf</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Reason: <span className="text-red-300/70">{alt.rejectedReason}</span>
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
