import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Brain, Clock, CheckCircle2, ChevronRight, XOctagon } from 'lucide-react';
import { useAdaptiveContext } from '../../context/AdaptiveContextManager';
import { Button } from '../ui/button';

export const WarRoom = () => {
  const { warRoomContext, resetToStandard } = useAdaptiveContext();

  if (!warRoomContext) return null;

  const { context, origin, timestamp } = warRoomContext;
  
  // Format the context based on our demo structure
  const anomalyTitle = context?.anomalyType?.replace(/_/g, ' ') || 'CRITICAL ANOMALY DETECTED';
  const clientName = context?.client || 'Unknown Client';
  const impact = context?.predictiveImpact || 'Severe system degradation imminent.';
  const recommendation = context?.recommendedAction || 'Await manual override.';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      <div className="relative w-full max-w-6xl mx-auto overflow-hidden border border-red-500/30 rounded-3xl bg-neutral-950/80 shadow-[0_0_100px_rgba(220,38,38,0.15)] flex flex-col md:flex-row">
        
        {/* Left Column: Context & Alert */}
        <div className="w-full md:w-1/3 p-8 border-r border-red-500/10 bg-red-950/10 flex flex-col justify-between">
          <div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-semibold text-red-400 border rounded-full bg-red-500/10 border-red-500/20"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              {origin} DETECTED
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-4xl font-bold tracking-tight text-white"
            >
              {anomalyTitle}
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-red-200/70"
            >
              Client: <span className="font-semibold text-white">{clientName}</span>
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 mt-8 border-t border-red-500/10"
          >
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <Clock className="w-4 h-4" />
              T-Zero: {new Date(timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Intelligence & Action */}
        <div className="w-full p-8 md:w-2/3 lg:p-12">
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Predictive Impact */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 border bg-neutral-900/50 border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <Brain className="w-6 h-6" />
                <h3 className="font-semibold tracking-wide uppercase">Krisnam Forecast</h3>
              </div>
              <p className="text-xl font-medium leading-relaxed text-neutral-200">
                {impact}
              </p>
            </motion.div>

            {/* Recommended Action */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-6 border bg-blue-950/20 border-blue-500/20 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert className="w-24 h-24 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-blue-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="font-semibold tracking-wide uppercase">HANUMANAS Governed Action</h3>
                </div>
                <p className="text-xl font-medium leading-relaxed text-neutral-200">
                  {recommendation}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-end gap-4 mt-12"
          >
            <Button 
              variant="ghost" 
              onClick={resetToStandard}
              className="text-neutral-400 hover:text-white"
            >
              <XOctagon className="w-4 h-4 mr-2" />
              Dismiss War Room
            </Button>
            <Button 
              className="text-white bg-blue-600 hover:bg-blue-500"
              onClick={() => {
                // In a real scenario, this dispatches the mission to the Action Engine
                resetToStandard();
              }}
            >
              Execute Recommendation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default WarRoom;
