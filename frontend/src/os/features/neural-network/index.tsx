import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  MarkerType,
  useOnSelectionChange,
  ReactFlowProvider,
  BackgroundVariant,
  Handle,
  Position,
  useReactFlow,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Brain, ShieldCheckered, Graph, Users, Globe, 
  Database, Code, TerminalWindow, Network, Robot,
  MagnifyingGlass, ChartBar, Handshake, Target,
  Lightning, Crosshair, Warning, Pulse, ChartLineUp,
  Skull, CaretLeft, SpeakerHigh, SpeakerSlash,
  Thermometer, Command, Microphone, CodeBlock,
  Megaphone, Briefcase, GitBranch, Layout, VideoCamera,
  HardDrives, LockKey, Strategy, ChatCircleText, TreeStructure
} from '@phosphor-icons/react';
import { api } from '@lib/api';
import dagre from '@dagrejs/dagre';
import { getSocket, connectSocket } from '@lib/socket';

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 320;
  const nodeHeight = 150;
  dagreGraph.setGraph({ rankdir: direction, ranksep: 200, nodesep: 100 });
  nodes.forEach((node) => { dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }); });
  edges.forEach((edge) => { dagreGraph.setEdge(edge.source, edge.target); });
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
  });
  return { nodes, edges };
};

// --- CUSTOM AUDIO SYNTHESIZER ---
const useSciFiAudio = () => {
  const ctxRef = useRef(null);
  const ambientOscRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const playBlip = useCallback(() => {
    if (!ctxRef.current) return;
    const osc = ctxRef.current.createOscillator();
    const gain = ctxRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctxRef.current.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctxRef.current.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctxRef.current.destination);
    osc.start();
    osc.stop(ctxRef.current.currentTime + 0.1);
  }, []);

  const playErrorBlip = useCallback(() => {
    if (!ctxRef.current) return;
    const osc = ctxRef.current.createOscillator();
    const gain = ctxRef.current.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctxRef.current.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctxRef.current.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctxRef.current.destination);
    osc.start();
    osc.stop(ctxRef.current.currentTime + 0.2);
  }, []);

  const toggleAmbient = useCallback((play) => {
    if (!ctxRef.current) return;
    if (play && !ambientOscRef.current) {
      const osc = ctxRef.current.createOscillator();
      const gain = ctxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctxRef.current.currentTime);
      gain.gain.setValueAtTime(0.05, ctxRef.current.currentTime);
      osc.connect(gain);
      gain.connect(ctxRef.current.destination);
      osc.start();
      ambientOscRef.current = { osc, gain };
    } else if (!play && ambientOscRef.current) {
      ambientOscRef.current.osc.stop();
      ambientOscRef.current.osc.disconnect();
      ambientOscRef.current = null;
    }
  }, []);

  const toggleAlarm = useCallback((play) => {
    if (!ctxRef.current) return;
    if (play && !alarmIntervalRef.current) {
      alarmIntervalRef.current = setInterval(() => playErrorBlip(), 800);
    } else if (!play && alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, [playErrorBlip]);

  return { initAudio, playBlip, playErrorBlip, toggleAmbient, toggleAlarm, isReady: !!ctxRef.current };
};

// --- CONTEXT FOR STATE ---
const NetworkContext = React.createContext({
  chaosState: 'NORMAL',
  showMetrics: false,
  isThermalMode: false,
  isMatrixMode: false,
  targetLockedNodeId: null
});

// --- CUSTOM EDGE (DATA PACKETS) ---
const DataPacketEdge = (props: any) => { const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerStart, markerEnd, animated, label, data } = props;
  const index = data?.edgeNumber || 0;
  // Deterministic scatter to prevent overlapping highways
  const scatterX = (index % 5) * 12 - 24;
  const scatterY = (index % 7) * 12 - 36;
  
  const [edgePath, labelX, labelY] = getBezierPath({ 
    sourceX: sourceX + scatterX, 
    sourceY: sourceY + scatterY, 
    sourcePosition, 
    targetX: targetX - scatterX, 
    targetY: targetY - scatterY, 
    targetPosition,
    curvature: 0.25 + (index % 3) * 0.1 // Varying curvature for spacious arcs
  });
  const { chaosState, isMatrixMode, isThermalMode } = React.useContext(NetworkContext);
  
  const isHighTraffic = chaosState === 'HIGH_TRAFFIC';
  const duration = isHighTraffic ? '0.5s' : '1.5s';
  const packetColor = isMatrixMode ? '#22c55e' : (isThermalMode ? (isHighTraffic ? '#ffffff' : '#f97316') : (style?.stroke || '#38bdf8'));

  const edgeLabel = data?.edgeNumber ? (label ? `#${data.edgeNumber} ${label}` : `#${data.edgeNumber}`) : label;

  return (
    <>
      <BaseEdge path={edgePath} markerStart={markerStart} markerEnd={markerEnd} style={style} />
      {animated && !isThermalMode && (
        <circle r="3" fill={packetColor} style={{ filter: `drop-shadow(0 0 5px ${packetColor})` }}>
          <animateMotion dur={duration} repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {animated && !isThermalMode && isHighTraffic && (
         <circle r="2" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 5px #fff)' }}>
          <animateMotion dur={duration} begin="0.25s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {edgeLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              zIndex: 1000,
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest ${isMatrixMode ? 'bg-green-900/50 text-green-400 border border-green-500/50' : 'bg-[#020617]/80 text-cyan-400 border border-cyan-500/50'} backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.8)] whitespace-nowrap`}
          >
            {edgeLabel}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// --- CUSTOM NODE COMPONENTS ---
const KangqoreNode = ({ id, data, selected }) => {
  const Icon = data.icon || Globe;
  let color = data.color || '#06b6d4';
  const { chaosState, showMetrics, isThermalMode, isMatrixMode, targetLockedNodeId } = React.useContext(NetworkContext);
  
  const isDb = id === 'core-db';
  if (chaosState === 'DB_OUTAGE' && isDb) color = '#ef4444';
  
  const isHighTraffic = chaosState === 'HIGH_TRAFFIC';
  let simCpu = Math.floor(Math.random() * 20) + 10;
  if (isHighTraffic) simCpu = Math.floor(Math.random() * 20) + 75;
  if (chaosState === 'DB_OUTAGE' && isDb) simCpu = 0;

  const isTargeted = targetLockedNodeId === id;

  if (isMatrixMode) {
    return (
      <div className={`relative px-5 py-3 bg-black border ${selected ? 'border-green-400 bg-green-900/20' : 'border-green-600/50'} text-green-500 font-mono transition-all`}
           style={{ minWidth: '200px', boxShadow: selected ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none' }}>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
        <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
        <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
        <div className="flex flex-col gap-1">
          <span className="text-[12px] uppercase font-bold tracking-[0.2em]">{data.label.replace(' ', '_')}</span>
          <span className="text-[10px] opacity-70">0x{Math.random().toString(16).substr(2, 8).toUpperCase()}</span>
        </div>
      </div>
    );
  }

  if (isThermalMode) {
    const heatColor = isDb && chaosState === 'DB_OUTAGE' ? 'rgba(0,0,255,0.8)' : isHighTraffic ? 'rgba(255,255,255,1)' : 'rgba(255,100,0,0.8)';
    const outerHeat = isHighTraffic ? 'rgba(255,50,0,0.6)' : 'rgba(20,20,150,0.5)';
    return (
      <div className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-1000"
           style={{ background: `radial-gradient(circle at center, ${heatColor} 0%, ${outerHeat} 50%, transparent 100%)`, filter: 'blur(5px)' }}>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
        <Icon className="w-10 h-10 text-black opacity-50 absolute mix-blend-overlay" weight="fill" />
      </div>
    );
  }

  return (
    <div 
      className={`relative px-6 py-5 bg-[#020617]/60 backdrop-blur-2xl transition-all duration-500 cyber-panel
      ${selected || isTargeted ? 'scale-110 z-50' : 'scale-100 z-10 hover:bg-[#020617]/80 hover:scale-105'}`}
      style={{
        boxShadow: selected || isTargeted ? `0 0 80px ${color}40, inset 0 0 30px ${color}20` : (chaosState === 'DB_OUTAGE' && isDb ? '0 0 40px rgba(239, 68, 68, 0.5)' : `inset 0 0 20px rgba(255,255,255,0.02), 0 10px 30px rgba(0,0,0,0.8)`),
        minWidth: '260px',
        border: `1px solid ${selected || isTargeted ? `${color}80` : 'rgba(255,255,255,0.1)'}`,
      }}
      onDoubleClick={() => data.onDoubleClick && data.onDoubleClick(id)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
      
      {/* TARGETING BRACKETS */}
      {(selected || isTargeted) && (
        <div className="absolute inset-[-10px] pointer-events-none z-50">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-[2px] border-l-[2px]" style={{ borderColor: color }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-[2px] border-r-[2px]" style={{ borderColor: color }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[2px] border-l-[2px]" style={{ borderColor: color }} />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[2px] border-r-[2px]" style={{ borderColor: color }} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed rounded-full opacity-20 animate-[reticleSpin_10s_linear_infinite]" style={{ borderColor: color }} />
          
          <div className="absolute top-full mt-4 text-center w-full">
             <span className="font-mono text-[9px] font-bold px-3 py-1 uppercase tracking-[0.3em] bg-black/80 border rounded-full backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(0,0,0,1)]" style={{ color: color, borderColor: `${color}50` }}>
               TARGET_LOCKED
             </span>
          </div>
        </div>
      )}

      {/* GLOWING CORE STATUS */}
      <div className="absolute top-4 right-5 flex flex-col items-end gap-1">
        <div className="flex items-center justify-center w-3 h-3 relative">
          {chaosState === 'DB_OUTAGE' && isDb ? (
            <Skull className="w-4 h-4 text-red-500 animate-pulse absolute z-10 drop-shadow-[0_0_5px_rgba(239,68,68,1)]" weight="fill" />
          ) : (
            <>
              <div className={`absolute w-full h-full rounded-full ${isHighTraffic ? 'animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]' : 'animate-ping'}`} style={{ backgroundColor: color, opacity: selected ? 1 : 0.5 }} />
              <div className="w-1.5 h-1.5 rounded-full z-10" style={{ backgroundColor: color, filter: `drop-shadow(0 0 3px ${color})` }} />
            </>
          )}
        </div>
        <span className="text-[6px] font-mono tracking-widest text-slate-500 uppercase">{chaosState === 'DB_OUTAGE' && isDb ? 'OFFLINE' : 'ONLINE'}</span>
      </div>

      <div className="flex items-center gap-5 mt-1">
        {/* Agent Progress Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          {data.taskProgress !== undefined && data.taskProgress > 0 ? (
            // SVG Progress Ring — shown when WORKING
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              {/* Track */}
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              {/* Progress */}
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - (data.taskProgress ?? 0) / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.25s ease', filter: `drop-shadow(0 0 4px ${color})` }}
              />
            </svg>
          ) : (
            <div className={`absolute inset-0 rounded-lg border border-solid ${isHighTraffic ? 'animate-[spin_2s_linear_infinite]' : ''} opacity-30`} style={{ borderColor: color, transform: 'rotate(45deg)' }} />
          )}
          <Icon className={`w-6 h-6 relative z-10 ${chaosState === 'DB_OUTAGE' && isDb ? 'text-red-500 animate-bounce' : data.isWorking ? 'animate-pulse' : ''}`} style={{ color: chaosState === 'DB_OUTAGE' && isDb ? undefined : color }} weight={selected || data.isWorking ? "fill" : "duotone"} />
          <div className="absolute inset-0 rounded-full blur-xl" style={{ backgroundColor: color, opacity: selected ? 0.3 : 0.15 }} />
          {/* Completed tasks badge */}
          {(data.completedTasks ?? 0) > 0 && !data.isWorking && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-black z-20" style={{ backgroundColor: color }}>
              {data.completedTasks}
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center overflow-hidden">
          <h3 className="text-[14px] font-black tracking-[0.1em] text-white uppercase leading-none drop-shadow-md">{data.label}</h3>
          {data.sub && <p className="text-[8px] mt-1.5 font-mono tracking-[0.2em] uppercase opacity-80" style={{ color }}>{chaosState === 'DB_OUTAGE' && isDb ? 'ERR_SYS_FAIL' : data.sub}</p>}
          {/* Live task ticker */}
          {data.isWorking && data.desc && (
            <div className="mt-2 relative overflow-hidden" style={{ maxWidth: '170px' }}>
              <p className="text-[9px] font-mono text-emerald-400 truncate animate-pulse" title={data.desc}>{data.desc}</p>
              <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#020617] to-transparent" />
            </div>
          )}
        </div>
      </div>
      
      {showMetrics && (
        <div className="absolute -top-12 left-6 bg-[#030712]/95 border border-slate-700 p-2 rounded-md flex gap-4 shadow-lg z-50 pointer-events-none backdrop-blur-md">
           <div className="flex flex-col items-center">
             <span className="text-[7px] font-mono text-slate-500 tracking-widest">CPU</span>
             <span className={`text-[10px] font-mono font-bold ${simCpu > 80 ? 'text-red-400' : 'text-cyan-400'}`}>{simCpu}%</span>
           </div>
           <div className="flex flex-col items-center border-l border-slate-800 pl-4">
             <span className="text-[7px] font-mono text-slate-500 tracking-widest">MEM</span>
             <span className="text-[10px] font-mono font-bold text-emerald-400">{(Math.random() * 2 + 1).toFixed(1)}G</span>
           </div>
           <div className="flex flex-col items-center border-l border-slate-800 pl-4">
             <span className="text-[7px] font-mono text-slate-500 tracking-widest">NET</span>
             <span className="text-[10px] font-mono font-bold text-purple-400">{isHighTraffic ? (Math.random() * 50 + 100).toFixed(0) : (Math.random() * 10 + 5).toFixed(0)}k/s</span>
           </div>
        </div>
      )}

      {selected && data.desc && (
        <div className="absolute top-[115%] left-0 w-80 p-5 bg-[#020617]/95 border backdrop-blur-2xl z-50 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
             style={{ borderColor: `${color}40`, clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 animate-[spin_3s_linear_infinite]" style={{ color }} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color }}>Focus Lock</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{chaosState === 'DB_OUTAGE' && isDb ? 'ERR: CONNECTION_REFUSED' : 'SYS.OP.NORMAL'}</span>
          </div>
          <p className="text-[12px] font-mono text-slate-300 leading-relaxed tracking-wide uppercase">{data.desc}</p>
          <div className="mt-4 flex gap-1.5">
             {[...Array(16)].map((_, i) => (
                <div key={i} className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full animate-pulse" style={{ backgroundColor: color, width: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }} />
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LayerGroupNode = ({ data }) => {
  const bgColor = data.color || '#06b6d4';
  const borderColor = data.borderColor || '#0ea5e9';
  const { chaosState, isThermalMode, isMatrixMode } = React.useContext(NetworkContext);
  const isHighTraffic = chaosState === 'HIGH_TRAFFIC';
  
  if (isThermalMode || isMatrixMode) return null; 

  return (
    <div className="w-full h-full pointer-events-none p-5 relative group" style={{ zIndex: -1 }}>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] opacity-60" style={{ borderColor }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] opacity-60" style={{ borderColor }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] opacity-60" style={{ borderColor }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] opacity-60" style={{ borderColor }} />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] rounded-xl" 
           style={{ backgroundColor: `${bgColor}08`, border: `1px solid ${borderColor}20`, boxShadow: `inset 0 0 100px ${bgColor}10` }} />
      
      <div className={`absolute inset-0 opacity-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:100%_4px] rounded-xl mix-blend-overlay ${isHighTraffic ? 'animate-[slide_3s_linear_infinite]' : 'animate-[slide_8s_linear_infinite]'}`} />

      <div className="absolute -top-4 left-10 pointer-events-auto inline-flex items-center gap-3 px-5 py-2 bg-[#030712] border-t-[1.5px] border-r-[1.5px] border-l-[1.5px] shadow-[0_-5px_15px_rgba(0,0,0,0.5)]" 
           style={{ borderColor: `${borderColor}50` }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: borderColor }} />
        <span className="font-mono font-bold uppercase tracking-[0.25em] text-[10px]" style={{ color: borderColor }}>
          {data.label}
        </span>
        <span className="font-mono text-[9px] text-slate-500 tracking-widest uppercase ml-3">// SECURE</span>
      </div>
    </div>
  );
};

const AegisShieldNode = () => {
  const { chaosState, isThermalMode, isMatrixMode } = React.useContext(NetworkContext);
  const isHighTraffic = chaosState === 'HIGH_TRAFFIC';
  
  if (isThermalMode || isMatrixMode) return null; 

  return (
    <div className="w-full h-full pointer-events-none rounded-[100px] flex items-center justify-center relative overflow-hidden" 
         style={{ zIndex: -2, border: `2px solid ${isHighTraffic ? 'rgba(239, 68, 68, 0.4)' : 'rgba(14, 165, 233, 0.2)'}`, boxShadow: isHighTraffic ? 'inset 0 0 150px rgba(239, 68, 68, 0.1), 0 0 100px rgba(239, 68, 68, 0.1)' : 'inset 0 0 150px rgba(14, 165, 233, 0.05)' }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92304845413264\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 103.92304845413264L60 86.60254037844386L60 51.96152422706632L30 34.64101615137754L0 51.96152422706632L0 86.60254037844386Z\' fill=\'none\' stroke=\'%230ea5e9\' stroke-width=\'2\'/%3E%3Cpath d=\'M30 0L60 17.32050807568877L60 51.96152422706632L30 34.64101615137754L0 51.96152422706632L0 17.32050807568877Z\' fill=\'none\' stroke=\'%230ea5e9\' stroke-width=\'2\'/%3E%3C/svg%3E")', backgroundSize: '40px 69.282px' }} />
      {isHighTraffic && <div className="absolute inset-0 bg-red-500/10 animate-pulse mix-blend-overlay" />}
      
      {/* Holographic Security Drones */}
      <div className={`absolute inset-0 ${isHighTraffic ? 'animate-[spin_3s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-5 h-5 border-l-[3px] border-b-[3px] border-cyan-400 rotate-45 opacity-60 shadow-[0_0_15px_#22d3ee]" style={{ borderColor: isHighTraffic ? '#ef4444' : '#22d3ee' }} />
         <div className="absolute bottom-12 left-1/4 w-5 h-5 border-l-[3px] border-b-[3px] border-cyan-400 rotate-[165deg] opacity-60 shadow-[0_0_15px_#22d3ee]" style={{ borderColor: isHighTraffic ? '#ef4444' : '#22d3ee' }} />
         <div className="absolute bottom-12 right-1/4 w-5 h-5 border-l-[3px] border-b-[3px] border-cyan-400 rotate-[285deg] opacity-60 shadow-[0_0_15px_#22d3ee]" style={{ borderColor: isHighTraffic ? '#ef4444' : '#22d3ee' }} />
      </div>

      <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-4 bg-[#030712] px-8 py-2.5 border-[1.5px] border-slate-700 rounded-full flex items-center gap-3 z-10 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <ShieldCheckered className={`w-5 h-5 ${isHighTraffic ? 'text-red-500 animate-bounce' : 'text-cyan-400'}`} weight="fill" />
        <span className={`font-mono text-[10px] tracking-[0.3em] font-bold ${isHighTraffic ? 'text-red-500' : 'text-cyan-400'}`}>AEGIS SHIELD {isHighTraffic ? 'DEFLECTING' : 'ACTIVE'}</span>
      </div>
    </div>
  );
};

// --- INITIAL DATA ---
const initialNodesMacro = [
  // --- LAYER GROUPS ---
  { id: 'g-presentation', type: 'layerGroup', position: { x: 420, y: -250 }, width: 1700, height: 420, data: { label: 'Presentation Layer (Frontend)', color: '#3b82f6', borderColor: '#60a5fa' } },
  { id: 'g-eqore-suite', type: 'layerGroup', position: { x: 1850, y: -250 }, width: 1400, height: 420, data: { label: 'Kangqore AI Product Suite', color: '#facc15', borderColor: '#fde047' } },
  { id: 'g-product', type: 'layerGroup', position: { x: 420, y: 250 }, width: 800, height: 350, data: { label: 'Product Engine (Node.js/Prisma)', color: '#10b981', borderColor: '#34d399' } },
  { id: 'g-intelligence', type: 'layerGroup', position: { x: 420, y: 700 }, width: 1200, height: 500, data: { label: 'Intelligence Engine (Python/AI)', color: '#8b5cf6', borderColor: '#a78bfa' } },
  { id: 's-aegis', type: 'shield', position: { x: 400, y: 220 }, width: 1240, height: 1000, data: {} },
  
  // --- PRESENTATION LAYER ---
  { id: 'kv-os', type: 'kangqore', parentId: 'g-presentation', position: { x: 500, y: 20 }, width: 320, height: 100, data: { label: 'Kangqore View (OS)', sub: 'React Shell Router', icon: Globe, color: '#f59e0b', desc: 'The dynamic shell routing users to specific portals.' } },

  // --- 9 FRONTEND PORTALS ---
  { id: 'p-admin', type: 'kangqore', parentId: 'g-presentation', position: { x: 40, y: 150 }, width: 280, height: 100, data: { label: 'Admin Portal', sub: 'OS Control', icon: ShieldCheckered, color: '#60a5fa' } },
  { id: 'p-team', type: 'kangqore', parentId: 'g-presentation', position: { x: 360, y: 150 }, width: 280, height: 100, data: { label: 'Team Portal', sub: 'Internal Staff', icon: Users, color: '#60a5fa' } },
  { id: 'p-client', type: 'kangqore', parentId: 'g-presentation', position: { x: 680, y: 150 }, width: 280, height: 100, data: { label: 'Client Portal', sub: 'External', icon: Target, color: '#60a5fa' } },
  { id: 'p-partner', type: 'kangqore', parentId: 'g-presentation', position: { x: 1000, y: 150 }, width: 280, height: 100, data: { label: 'Partner Portal', sub: 'B2B', icon: Handshake, color: '#60a5fa' } },
  { id: 'p-investor', type: 'kangqore', parentId: 'g-presentation', position: { x: 1320, y: 150 }, width: 280, height: 100, data: { label: 'Investor Portal', sub: 'Finance', icon: ChartLineUp, color: '#60a5fa' } },
  { id: 'p-executive', type: 'kangqore', parentId: 'g-presentation', position: { x: 40, y: 280 }, width: 280, height: 100, data: { label: 'Executive Portal', sub: 'C-Level', icon: Strategy, color: '#60a5fa' } },
  { id: 'p-analyst', type: 'kangqore', parentId: 'g-presentation', position: { x: 360, y: 280 }, width: 280, height: 100, data: { label: 'Analyst Portal', sub: 'Data Intelligence', icon: ChartBar, color: '#60a5fa' } },
  { id: 'p-journalist', type: 'kangqore', parentId: 'g-presentation', position: { x: 680, y: 280 }, width: 280, height: 100, data: { label: 'Journalist Portal', sub: 'Media/Press', icon: Megaphone, color: '#60a5fa' } },
  { id: 'p-careers', type: 'kangqore', parentId: 'g-presentation', position: { x: 1000, y: 280 }, width: 280, height: 100, data: { label: 'Careers Portal', sub: 'Job Seekers', icon: Briefcase, color: '#60a5fa' } },
  
  // Public Site Cluster
  { id: 'p-public', type: 'kangqore', parentId: 'g-presentation', position: { x: 40, y: 20 }, width: 280, height: 100, data: { label: 'Public Website', sub: 'kangqore.com', icon: Globe, color: '#3b82f6' } },

  // --- EQORE AI PRODUCT SUITE ---
  { id: 'p-eqore', type: 'kangqore', parentId: 'g-eqore-suite', position: { x: 40, y: 150 }, width: 300, height: 100, data: { label: 'eQORE', sub: 'AI Console', icon: TerminalWindow, color: '#facc15', desc: 'Central AI Operating Environment' } },
  { id: 'p-vis', type: 'kangqore', parentId: 'g-eqore-suite', position: { x: 380, y: 150 }, width: 300, height: 100, data: { label: 'Kangqore VIS', sub: 'Visual Intelligence', icon: Crosshair, color: '#facc15' } },
  { id: 'p-alis', type: 'kangqore', parentId: 'g-eqore-suite', position: { x: 720, y: 150 }, width: 300, height: 100, data: { label: 'Kangqore ALIS', sub: 'Artificial Logic System', icon: Brain, color: '#facc15' } },
  { id: 'p-lead-int', type: 'kangqore', parentId: 'g-eqore-suite', position: { x: 1060, y: 150 }, width: 280, height: 100, data: { label: 'eQORE Lead Int.', sub: 'Data Engine', icon: Graph, color: '#facc15' } },
  { id: 'p-feedback', type: 'kangqore', parentId: 'g-eqore-suite', position: { x: 40, y: 300 }, width: 300, height: 100, data: { label: 'eROOT', sub: 'Smart Context Prompt', icon: ChatCircleText, color: '#facc15' } },

  // --- PRODUCT ENGINE (CORE BACKEND) ---
  { id: 'f-router', type: 'kangqore', parentId: 'g-product', position: { x: 260, y: 40 }, width: 280, height: 100, data: { label: 'Feature Router', sub: 'API Gateway', icon: HardDrives, color: '#10b981' } },
  { id: 'sys-auth', type: 'kangqore', parentId: 'g-product', position: { x: -20, y: 180 }, width: 240, height: 80, data: { label: 'Auth System', sub: 'JWT / OAuth', icon: LockKey, color: '#34d399' } },
  { id: 'core-api', type: 'kangqore', parentId: 'g-product', position: { x: 260, y: 200 }, width: 280, height: 100, data: { label: 'Node.js Core', sub: 'Express API', icon: TerminalWindow, color: '#10b981' } },
  { id: 'core-db', type: 'kangqore', parentId: 'g-product', position: { x: 580, y: 200 }, width: 280, height: 100, data: { label: 'PostgreSQL DB', sub: 'via Prisma', icon: Database, color: '#f59e0b' } },
  { id: 'sys-vector', type: 'kangqore', parentId: 'g-product', position: { x: 580, y: 40 }, width: 240, height: 80, data: { label: 'Vector DB', sub: 'Pinecone / Qdrant', icon: Database, color: '#f43f5e' } },

  // --- INTELLIGENCE LAYER & AGENTS ---
  { id: 'ai-python', type: 'kangqore', parentId: 'g-intelligence', position: { x: 260, y: 50 }, width: 280, height: 100, data: { label: 'Python AI Layer', sub: 'FastAPI / ML', icon: Code, color: '#d946ef' } },
  { id: 'ai-models', type: 'kangqore', parentId: 'g-intelligence', position: { x: 580, y: 50 }, width: 280, height: 100, data: { label: 'LLMs / Models', sub: 'Generative AI', icon: Brain, color: '#d946ef' } },
  
  // KIMMP Agent Orchestration
  { id: 'ai-kimmp', type: 'kangqore', parentId: 'g-intelligence', position: { x: 20, y: 200 }, width: 300, height: 100, data: { label: 'KIMMP', sub: 'Agent Orchestration', icon: Robot, color: '#6366f1', desc: 'Central management for autonomous agents.' } },
  { id: 'ag-mc', type: 'kangqore', parentId: 'g-intelligence', position: { x: 40, y: 350 }, width: 240, height: 80, data: { label: 'Mission Control', sub: 'Logic Core', icon: Network, color: '#818cf8' } },
  { id: 'ag-402', type: 'kangqore', parentId: 'g-intelligence', position: { x: 300, y: 350 }, width: 180, height: 80, data: { label: 'Agent 402', sub: 'Research', icon: Robot, color: '#c084fc' } },
  { id: 'ag-719', type: 'kangqore', parentId: 'g-intelligence', position: { x: 500, y: 350 }, width: 180, height: 80, data: { label: 'Agent 719', sub: 'Scraper', icon: Robot, color: '#c084fc' } },
  
  // BIDS & Core Systems
  { id: 'ai-bids', type: 'kangqore', parentId: 'g-intelligence', position: { x: 880, y: 200 }, width: 280, height: 100, data: { label: 'BIDS', sub: 'Diagnostic System', icon: MagnifyingGlass, color: '#14b8a6' } },
  { id: 'ag-991', type: 'kangqore', parentId: 'g-intelligence', position: { x: 920, y: 350 }, width: 200, height: 80, data: { label: 'Agent 991', sub: 'Diagnostics bot', icon: Robot, color: '#5eead4' } },
  
  { id: 'ai-waanda', type: 'kangqore', parentId: 'g-intelligence', position: { x: 360, y: 200 }, width: 280, height: 100, data: { label: 'WAANDA', sub: 'AI Persona', icon: Brain, color: '#06b6d4' } },
  { id: 'ai-ontology', type: 'kangqore', parentId: 'g-intelligence', position: { x: -60, y: 50 }, width: 260, height: 100, data: { label: 'Ontology', sub: 'Data Map', icon: Graph, color: '#ec4899' } },
  { id: 'ai-aegis', type: 'kangqore', parentId: 'g-intelligence', position: { x: 880, y: 50 }, width: 280, height: 100, data: { label: 'AEGIS', sub: 'Security Core', icon: ShieldCheckered, color: '#ef4444' } }
];

const initialEdgesMacro = [
  // Portals -> OS Shell (Distinct Portal Colors)
  { id: 'e-pub-kv', source: 'p-public', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Public Traffic', style: { stroke: '#0ea5e9' } }, // Sky
  { id: 'e-pa-kv', source: 'p-admin', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Admin Access', style: { stroke: '#8b5cf6' } }, // Violet
  { id: 'e-pt-kv', source: 'p-team', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Internal Comms', style: { stroke: '#22c55e' } }, // Green
  { id: 'e-pc-kv', source: 'p-client', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Client Requests', style: { stroke: '#3b82f6' } }, // Blue
  { id: 'e-pp-kv', source: 'p-partner', target: 'kv-os', type: 'dataPacket', animated: true, label: 'B2B Sync', style: { stroke: '#10b981' } }, // Emerald
  { id: 'e-pi-kv', source: 'p-investor', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Financial Data', style: { stroke: '#eab308' } }, // Yellow
  { id: 'e-pex-kv', source: 'p-executive', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Strategic Ops', style: { stroke: '#f43f5e' } }, // Rose
  { id: 'e-pan-kv', source: 'p-analyst', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Data Mining', style: { stroke: '#06b6d4' } }, // Cyan
  { id: 'e-pjr-kv', source: 'p-journalist', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Press Kit', style: { stroke: '#ec4899' } }, // Pink
  { id: 'e-pca-kv', source: 'p-careers', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Applicants', style: { stroke: '#8b5cf6' } }, // Violet


  // OS Shell -> eQORE Suite (Distinct Module Colors)
  { id: 'e-kv-eq', source: 'kv-os', target: 'p-eqore', type: 'dataPacket', animated: true, label: 'Core Command', style: { stroke: '#f59e0b', strokeWidth: 2 } }, // Amber
  { id: 'e-eq-vis', source: 'p-eqore', target: 'p-vis', type: 'dataPacket', animated: true, style: { stroke: '#a855f7' }, label: 'Visual Sync', markerStart: { type: MarkerType.ArrowClosed, color: '#a855f7' } }, // Purple
  { id: 'e-eq-alis', source: 'p-eqore', target: 'p-alis', type: 'dataPacket', animated: true, style: { stroke: '#facc15' }, label: 'Logic Sync', markerStart: { type: MarkerType.ArrowClosed, color: '#facc15' } }, // Yellow
  { id: 'e-eq-lead', source: 'p-eqore', target: 'p-lead-int', type: 'dataPacket', animated: true, style: { stroke: '#f97316' }, label: 'Data Sync', markerStart: { type: MarkerType.ArrowClosed, color: '#f97316' } }, // Orange
  { id: 'e-eq-feedback', source: 'p-eqore', target: 'p-feedback', type: 'dataPacket', animated: true, style: { stroke: '#ec4899' }, label: 'Context Sync', markerStart: { type: MarkerType.ArrowClosed, color: '#ec4899' } }, // Pink
  { id: 'e-alis-feedback', source: 'p-alis', target: 'p-feedback', type: 'dataPacket', animated: true, style: { stroke: '#84cc16', strokeDasharray: '2 4' }, label: 'Logic Inject' }, // Lime
  
  // eQORE Suite -> Deep Intelligence (WAANDA & KIMMP)
  { id: 'e-eq-py', source: 'p-eqore', target: 'ai-python', type: 'dataPacket', animated: true, style: { stroke: '#d946ef', strokeWidth: 2, strokeDasharray: '4 4' } }, // Fuchsia
  { id: 'e-eq-waanda', source: 'p-eqore', target: 'ai-waanda', type: 'dataPacket', animated: true, label: 'Persona Sync', style: { stroke: '#06b6d4', strokeWidth: 2 } }, // Cyan
  
  { id: 'e-alis-py', source: 'p-alis', target: 'ai-python', type: 'dataPacket', animated: true, style: { stroke: '#be185d', strokeDasharray: '4 4' } }, // Dark Pink
  { id: 'e-alis-waanda', source: 'p-alis', target: 'ai-waanda', type: 'dataPacket', animated: true, label: 'Logic Sync', style: { stroke: '#0ea5e9' } }, // Sky Blue
  
  { id: 'e-vis-bids', source: 'p-vis', target: 'ai-bids', type: 'dataPacket', animated: true, style: { stroke: '#14b8a6', strokeDasharray: '4 4' } }, // Teal
  { id: 'e-vis-kimmp', source: 'p-vis', target: 'ai-kimmp', type: 'dataPacket', animated: true, label: 'Agent Vision', style: { stroke: '#6366f1' } }, // Indigo
  
  { id: 'e-lead-kimmp', source: 'p-lead-int', target: 'ai-kimmp', type: 'dataPacket', animated: true, label: 'Agent Deploy', style: { stroke: '#8b5cf6' } }, // Violet

  // OS Shell -> Router -> Backend
  { id: 'e-kv-router', source: 'kv-os', target: 'f-router', type: 'dataPacket', animated: true, label: 'HTTP / WSS', style: { stroke: '#34d399', strokeWidth: 2 } }, // Emerald Light
  { id: 'e-router-auth', source: 'f-router', target: 'sys-auth', type: 'dataPacket', animated: true, label: 'Verify', style: { stroke: '#14b8a6' } }, // Teal
  { id: 'e-router-core', source: 'f-router', target: 'core-api', type: 'dataPacket', animated: true, label: 'API Req', style: { stroke: '#10b981' } }, // Emerald
  
  // Core Backend -> DBs
  { id: 'e-core-db', source: 'core-api', target: 'core-db', type: 'dataPacket', animated: true, label: 'Prisma ORM', style: { stroke: '#f59e0b' } }, // Amber
  { id: 'e-core-vdb', source: 'core-api', target: 'sys-vector', type: 'dataPacket', animated: true, label: 'Vectors', style: { stroke: '#f43f5e' } }, // Rose

  // Core Backend -> Python AI
  { id: 'e-core-py', source: 'core-api', target: 'ai-python', type: 'dataPacket', animated: true, label: 'gRPC Call', style: { stroke: '#8b5cf6', strokeWidth: 2 } }, // Violet
  { id: 'e-py-core', source: 'ai-python', target: 'core-api', type: 'dataPacket', animated: true, label: 'Response', style: { stroke: '#d946ef' } }, // Fuchsia

  // Python -> Systems
  { id: 'e-py-mod', source: 'ai-python', target: 'ai-models', type: 'dataPacket', animated: true, label: 'Prompt', style: { stroke: '#ec4899' } }, // Pink
  { id: 'e-mod-py', source: 'ai-models', target: 'ai-python', type: 'dataPacket', animated: true, label: 'Inference', style: { stroke: '#be185d' } }, // Dark Pink
  
  // KIMMP & Agents
  { id: 'e-py-kimmp', source: 'ai-python', target: 'ai-kimmp', type: 'dataPacket', animated: true, label: 'Tasking', style: { stroke: '#6366f1' } }, // Indigo
  { id: 'e-kimmp-mc', source: 'ai-kimmp', target: 'ag-mc', type: 'dataPacket', animated: true, label: 'Orchestrate', style: { stroke: '#818cf8' } }, // Light Indigo
  { id: 'e-mc-402', source: 'ag-mc', target: 'ag-402', type: 'dataPacket', animated: true, label: 'Command', style: { stroke: '#c084fc' } }, // Light Purple
  { id: 'e-mc-719', source: 'ag-mc', target: 'ag-719', type: 'dataPacket', animated: true, label: 'Command', style: { stroke: '#a855f7' } }, // Purple
  { id: 'e-vdb-719', source: 'sys-vector', target: 'ag-719', type: 'dataPacket', animated: true, label: 'Embeddings', style: { stroke: '#f43f5e', strokeDasharray: '4 4' } }, // Rose

  // WAANDA & Ontology
  { id: 'e-py-waanda', source: 'ai-python', target: 'ai-waanda', type: 'dataPacket', animated: true, label: 'Thought', style: { stroke: '#06b6d4' } }, // Cyan
  { id: 'e-waanda-ont', source: 'ai-waanda', target: 'ai-ontology', type: 'dataPacket', animated: true, label: 'Queries', style: { stroke: '#ec4899' } }, // Pink
  { id: 'e-ont-vdb', source: 'ai-ontology', target: 'sys-vector', type: 'dataPacket', animated: true, label: 'Search', style: { stroke: '#f43f5e', strokeDasharray: '2 6' } }, // Rose
  { id: 'e-waanda-kimmp', source: 'ai-waanda', target: 'ai-kimmp', type: 'dataPacket', animated: true, label: 'Delegate', style: { stroke: '#0284c7', strokeWidth: 2 } }, // Light Blue
  { id: 'e-kimmp-waanda', source: 'ai-kimmp', target: 'ai-waanda', type: 'dataPacket', animated: true, label: 'Status', style: { stroke: '#4f46e5', strokeDasharray: '3 3' } }, // Indigo

  // BIDS & Diagnostics
  { id: 'e-py-bids', source: 'ai-python', target: 'ai-bids', type: 'dataPacket', animated: true, label: 'Scan Req', style: { stroke: '#14b8a6' } }, // Teal
  { id: 'e-bids-991', source: 'ai-bids', target: 'ag-991', type: 'dataPacket', animated: true, label: 'Diagnostics', style: { stroke: '#0d9488' } }, // Dark Teal

  // AEGIS Security
  { id: 'e-aegis-core', source: 'ai-aegis', target: 'core-api', type: 'dataPacket', animated: true, label: 'Monitor', style: { stroke: '#ef4444', strokeDasharray: '5 5' } }, // Red
  { id: 'e-aegis-py', source: 'ai-aegis', target: 'ai-python', type: 'dataPacket', animated: true, label: 'Audit', style: { stroke: '#dc2626', strokeDasharray: '5 5' } }, // Dark Red

  // WAANDA Omniscience (Global Surveillance)
  { id: 'e-waanda-os', source: 'ai-waanda', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Omni-View', style: { stroke: '#06b6d4', strokeDasharray: '5 5' } }, // Cyan
  { id: 'e-waanda-router', source: 'ai-waanda', target: 'f-router', type: 'dataPacket', animated: true, label: 'Traffic Inspect', style: { stroke: '#0891b2', strokeDasharray: '5 5' } }, // Dark Cyan
  { id: 'e-waanda-db', source: 'ai-waanda', target: 'core-db', type: 'dataPacket', animated: true, label: 'Direct Access', style: { stroke: '#f59e0b', strokeDasharray: '5 5' }, markerStart: { type: MarkerType.ArrowClosed, color: '#f59e0b' } }, // Amber
  { id: 'e-waanda-auth', source: 'ai-waanda', target: 'sys-auth', type: 'dataPacket', animated: true, label: 'Security Override', style: { stroke: '#ef4444', strokeDasharray: '5 5' } }, // Red
  { id: 'e-waanda-admin', source: 'ai-waanda', target: 'p-admin', type: 'dataPacket', animated: true, label: 'Direct Feed', style: { stroke: '#8b5cf6', strokeDasharray: '5 5' } }, // Violet

  // KIMMP Omniscience (Global Control)
  { id: 'e-kimmp-os', source: 'ai-kimmp', target: 'kv-os', type: 'dataPacket', animated: true, label: 'Global Inject', style: { stroke: '#4f46e5', strokeWidth: 2 } }, // Indigo
  { id: 'e-kimmp-db', source: 'ai-kimmp', target: 'core-db', type: 'dataPacket', animated: true, label: 'State Sync', style: { stroke: '#f59e0b', strokeDasharray: '2 8' }, markerStart: { type: MarkerType.ArrowClosed, color: '#f59e0b' } }, // Amber
  { id: 'e-kimmp-vdb', source: 'ai-kimmp', target: 'sys-vector', type: 'dataPacket', animated: true, label: 'Vector Sync', style: { stroke: '#f43f5e', strokeDasharray: '2 8' }, markerStart: { type: MarkerType.ArrowClosed, color: '#f43f5e' } }, // Rose
  { id: 'e-kimmp-admin', source: 'ai-kimmp', target: 'p-admin', type: 'dataPacket', animated: true, label: 'Metrics', style: { stroke: '#8b5cf6' } } // Violet
].map((e, i) => ({ 
  ...e, 
  markerEnd: (e as any).markerEnd || { type: MarkerType.ArrowClosed, color: e.style?.stroke || '#fff' },
  data: { ...(e as any).data, edgeNumber: i + 1 } 
}));

const initialKimmpNodes = [
  { id: 'g-kimmp-net', type: 'layerGroup', position: { x: 0, y: 0 }, width: 800, height: 600, data: { label: 'KIMMP Network (Internal)', color: '#6366f1', borderColor: '#818cf8' } },
  { id: 'mc', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 100, y: 100 }, width: 280, height: 100, data: { label: 'Mission Control', sub: 'Orchestrator', icon: Network, color: '#818cf8', desc: 'Central orchestrator for Agent deployments.' } },
  { id: 'de', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 100, y: 250 }, width: 280, height: 100, data: { label: 'Decision Engine', sub: 'Logic Core', icon: Brain, color: '#818cf8' } },
  { id: 'ag', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 100, y: 400 }, width: 280, height: 100, data: { label: 'Agent Registry', sub: 'Active Bots', icon: Robot, color: '#818cf8' } },
  { id: 'ag-1', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 500, y: 100 }, width: 280, height: 100, data: { label: 'Agent 402', sub: 'Research', icon: Robot, color: '#c084fc' } },
  { id: 'ag-2', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 500, y: 250 }, width: 280, height: 100, data: { label: 'Agent 719', sub: 'Data Scraper', icon: Robot, color: '#c084fc' } },
  { id: 'ag-3', type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 500, y: 400 }, width: 280, height: 100, data: { label: 'Agent 991', sub: 'Diagnostics', icon: Robot, color: '#c084fc' } },
];
const initialKimmpEdges = [
  { id: 'e-mc-de', source: 'mc', target: 'de', type: 'dataPacket', animated: true, style: { stroke: '#818cf8' } },
  { id: 'e-de-ag', source: 'de', target: 'ag', type: 'dataPacket', animated: true, style: { stroke: '#818cf8' } },
  { id: 'e-ag-a1', source: 'ag', target: 'ag-1', type: 'dataPacket', animated: true, style: { stroke: '#c084fc' } },
  { id: 'e-ag-a2', source: 'ag', target: 'ag-2', type: 'dataPacket', animated: true, style: { stroke: '#c084fc' } },
  { id: 'e-ag-a3', source: 'ag', target: 'ag-3', type: 'dataPacket', animated: true, style: { stroke: '#c084fc' } },
  { id: 'e-mc-a1', source: 'mc', target: 'ag-1', type: 'dataPacket', animated: true, style: { stroke: '#818cf8', strokeDasharray: '5 5' } },
].map((e, i) => ({ 
  ...e, 
  markerEnd: (e as any).markerEnd || { type: MarkerType.ArrowClosed, color: e.style?.stroke || '#fff' },
  data: { ...(e as any).data, edgeNumber: i + 1 } 
}));

function InnerNetwork() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the sub-page from the URL (e.g., /matrix, /thermal)
  const pathParts = location.pathname.split('/');
  const currentSubPage = pathParts[pathParts.length - 1];
  
  let activeTab = 'STANDARD';
  if (currentSubPage === 'matrix') activeTab = 'MATRIX';
  else if (currentSubPage === 'thermal') activeTab = 'THERMAL';
  
  const handleTabClick = (tab: string, path: string) => {
    // If clicking the currently active tab, go back to the standard neural network view
    if (activeTab === tab) {
      const basePath = location.pathname.replace(/\/(matrix|thermal)$/, '');
      navigate(basePath);
    } else {
      // If navigating to a new tab, ensure we build off the base path
      const basePath = location.pathname.replace(/\/(matrix|thermal)$/, '');
      navigate(`${basePath}/${path}`);
    }
  };

  const [chaosState, setChaosState] = useState('NORMAL'); 
  const [showMetrics, setShowMetrics] = useState(false);
  
  const isMatrixMode = activeTab === 'MATRIX';
  const isThermalMode = activeTab === 'THERMAL';

  const [focusGraph, setFocusGraph] = useState(null); 
  const [logs, setLogs] = useState([]);
  
  const [showNeuralCore, setShowNeuralCore] = useState(true);
  const [showSystemLogs, setShowSystemLogs] = useState(true);
  
  const [nodes, setNodes] = useState(initialNodesMacro);
  // Assign a unique number to every initial macro edge so they can be easily tracked visually
  const [edges, setEdges] = useState(initialEdgesMacro);
  
  const [dynamicKimmpNodes, setDynamicKimmpNodes] = useState([]);
  const [dynamicKimmpEdges, setDynamicKimmpEdges] = useState([]);
  const [agentProgress, setAgentProgress] = useState<Record<string, number>>({}); // agentId → 0-100

  const [semanticNodes, setSemanticNodes] = useState([]);
  const [semanticEdges, setSemanticEdges] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [time, setTime] = useState(new Date());

  const [searchQuery, setSearchQuery] = useState('');
  const [targetLockedNodeId, setTargetLockedNodeId] = useState(null);
  const [jarvisCommand, setJarvisCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState({
    presentation: true,
    product: true,
    intelligence: true,
    eqore: true
  });

  // 3D Parallax State
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const { fitView, setCenter, setViewport, getViewport, zoomIn, zoomOut } = useReactFlow();
  const { initAudio, playBlip, playErrorBlip, toggleAmbient, toggleAlarm, isReady } = useSciFiAudio();

  // --- KEYBOARD NAVIGATION (PAN & SMOOTH ZOOM) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input field (like the search box)
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const panStep = 150;
      const zoomDuration = 400;
      const panDuration = 300;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          const vUp = getViewport();
          setViewport({ ...vUp, y: vUp.y + panStep }, { duration: panDuration });
          break;
        case 'ArrowDown':
          e.preventDefault();
          const vDown = getViewport();
          setViewport({ ...vDown, y: vDown.y - panStep }, { duration: panDuration });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const vLeft = getViewport();
          setViewport({ ...vLeft, x: vLeft.x + panStep }, { duration: panDuration });
          break;
        case 'ArrowRight':
          e.preventDefault();
          const vRight = getViewport();
          setViewport({ ...vRight, x: vRight.x - panStep }, { duration: panDuration });
          break;
        case '=':
        case '+':
          e.preventDefault();
          zoomIn({ duration: zoomDuration });
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomOut({ duration: zoomDuration });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewport, getViewport, zoomIn, zoomOut]);
  const nodeTypes = useMemo(() => ({ kangqore: KangqoreNode, layerGroup: LayerGroupNode, shield: AegisShieldNode }), []);
  const edgeTypes = useMemo(() => ({ dataPacket: DataPacketEdge }), []);

  const handleAudioInit = () => {
    initAudio();
    toggleAmbient(true);
    playBlip();
  };

  const logMessage = useCallback((msg) => {
    setLogs(prev => {
      const newLogs = [...prev];
      if (newLogs.length > 10) newLogs.shift();
      const timestamp = new Date().toISOString().split('T')[1].substring(0,8);
      newLogs.push(`${timestamp} - ${msg}`);
      return newLogs;
    });
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    setTiltX(x);
    setTiltY(y);
  };

  useEffect(() => {
    // Get the authenticated singleton socket used across the entire OS
    // connectSocket() is idempotent — safe to call even if already connected
    connectSocket();
    const socket = getSocket();

    const mapAgentToNode = (agent, index) => {
      const isWorking = agent.status === 'WORKING';
      const progress = agent.taskProgress ?? 0;
      return {
        id: agent.id,
        type: 'kangqore',
        parentId: 'g-kimmp-net',
        position: { x: 700 + (index % 2 === 0 ? 0 : 350), y: 100 + (Math.floor(index / 2) * 150) },
        data: {
          label: agent.name,
          sub: agent.role,
          icon: Robot,
          color: agent.status === 'ERROR' ? '#ef4444' : isWorking ? '#22c55e' : '#c084fc',
          desc: agent.currentTask
            ? `▶ ${agent.currentTask}`
            : agent.completedTasks
            ? `✓ ${agent.completedTasks} tasks completed`
            : 'Status: IDLE',
          isWorking,
          taskProgress: progress,
          completedTasks: agent.completedTasks ?? 0,
        }
      };
    };

    const onConnected = () => logMessage('>> KIMMP: Live swarm telemetry connected.');

    const onTopology = (agents) => {
      logMessage(`>> SWARM: Synced ${agents.length} active agent(s).`);
      const nodes = agents.map((agent, i) => mapAgentToNode(agent, i));
      const edges = agents.map(agent => ({
        id: `e-mc-${agent.id}`,
        source: 'mc',
        target: agent.id,
        type: 'dataPacket',
        animated: agent.status === 'WORKING',
        style: {
          stroke: agent.status === 'ERROR' ? '#ef4444' : agent.status === 'WORKING' ? '#22c55e' : '#c084fc',
          strokeDasharray: agent.status === 'IDLE' ? '5 5' : 'none'
        }
      }));
      setDynamicKimmpNodes(nodes);
      setDynamicKimmpEdges(edges);
    };

    const onAgentSpawned = (agent) => {
      logMessage(`>> KIMMP: New agent [${agent.name}] spawned online.`);
      setDynamicKimmpNodes(prev => {
        if (prev.find(n => n.id === agent.id)) return prev;
        return [...prev, mapAgentToNode(agent, prev.length)];
      });
      setDynamicKimmpEdges(prev => {
        if (prev.find(e => e.target === agent.id)) return prev;
        return [...prev, { id: `e-mc-${agent.id}`, source: 'mc', target: agent.id, type: 'dataPacket', animated: false, style: { stroke: '#c084fc', strokeDasharray: '5 5' } }];
      });
    };

    const onAgentUpdated = (agent) => {
      setDynamicKimmpNodes(prev => {
        const idx = prev.findIndex(n => n.id === agent.id);
        if (idx === -1) return prev;
        const newNodes = [...prev];
        newNodes[idx] = mapAgentToNode(agent, idx);
        return newNodes;
      });
      setDynamicKimmpEdges(prev => {
        const idx = prev.findIndex(e => e.target === agent.id);
        if (idx === -1) return prev;
        const newEdges = [...prev];
        newEdges[idx] = {
          ...newEdges[idx],
          animated: agent.status === 'WORKING',
          style: {
            stroke: agent.status === 'ERROR' ? '#ef4444' : agent.status === 'WORKING' ? '#22c55e' : '#c084fc',
            strokeDasharray: agent.status === 'IDLE' ? '5 5' : 'none'
          }
        };
        return newEdges;
      });
    };

    const onSwarmLog = (msg) => logMessage(msg);

    const onAgentProgress = ({ id, progress }: { id: string; progress: number }) => {
      // Update lightweight progress state (avoids full node re-render on every tick)
      setAgentProgress(prev => ({ ...prev, [id]: progress }));
    };

    socket.on('connected', onConnected);
    socket.on('SWARM_TOPOLOGY', onTopology);
    socket.on('AGENT_SPAWNED', onAgentSpawned);
    socket.on('AGENT_UPDATED', onAgentUpdated);
    socket.on('AGENT_PROGRESS', onAgentProgress);
    socket.on('SWARM_LOG', onSwarmLog);

    // If already connected, request topology immediately
    if (socket.connected) {
      socket.emit('request:swarm_topology');
    }

    return () => {
      socket.off('connected', onConnected);
      socket.off('SWARM_TOPOLOGY', onTopology);
      socket.off('AGENT_SPAWNED', onAgentSpawned);
      socket.off('AGENT_UPDATED', onAgentUpdated);
      socket.off('AGENT_PROGRESS', onAgentProgress);
      socket.off('SWARM_LOG', onSwarmLog);
      // Do NOT disconnect — the socket is a shared singleton
    };
  }, [logMessage]);

  useEffect(() => {
    if (focusGraph === 'semantic-graph') {
      api.get('/admin/hcip/graph').then(res => {
        const data = res.data;
        if (data.nodes && data.edges) {
          const mapTypeToColor = (type: string) => {
            if (type === 'risk') return '#ef4444';
            if (type === 'state') return '#8b5cf6';
            if (type === 'objective') return '#f59e0b';
            if (type === 'persona') return '#ec4899';
            if (type === 'action') return '#00c875';
            return '#06b6d4'; // default
          };
          
          let sNodes = data.nodes.map((n: any) => ({
            id: n.id,
            type: 'kangqore',
            position: { x: 0, y: 0 },
            data: { 
              label: n.name || n.id.replace(/_/g, ' '),
              sub: n.type.toUpperCase(),
              icon: Graph,
              color: mapTypeToColor(n.type)
            }
          }));
          
          let sEdges = data.edges.map((e: any, i: number) => ({
            id: `se-${i}`,
            source: e.source,
            target: e.target,
            type: 'dataPacket',
            animated: true,
            style: { stroke: '#0ea5e9' }
          }));

          const layouted = getLayoutedElements(sNodes, sEdges, 'LR');
          setSemanticNodes(layouted.nodes);
          setSemanticEdges(layouted.edges);
          logMessage('>> KNOWLEDGE ENGINE: Graph topology synchronized.');
        }
      }).catch(err => {
        logMessage('!! API ERROR FETCHING SEMANTIC GRAPH');
        playErrorBlip();
      });
    }
  }, [focusGraph, playErrorBlip, logMessage]);

  useEffect(() => {
    let newNodes = initialNodesMacro;
    let newEdges = initialEdgesMacro;

    if (focusGraph === 'ai-kimmp') {
      newNodes = [...initialKimmpNodes, ...dynamicKimmpNodes];
      newEdges = [...initialKimmpEdges, ...dynamicKimmpEdges];
    } else if (focusGraph === 'semantic-graph') {
      newNodes = semanticNodes;
      newEdges = semanticEdges;
    } else {
      newNodes = newNodes.map(n => {
        let hidden = false;
        if (n.id === 'g-presentation' || n.parentId === 'g-presentation' || n.id === 'kv-os') hidden = !activeFilters.presentation;
        if (n.id === 'g-product' || n.parentId === 'g-product' || n.id === 's-aegis') hidden = !activeFilters.product;
        if (n.id === 'g-intelligence' || n.parentId === 'g-intelligence') hidden = !activeFilters.intelligence;
        if (n.id === 'g-eqore-suite' || n.parentId === 'g-eqore-suite') hidden = !activeFilters.eqore;
        return { ...n, hidden };
      });

      newEdges = newEdges.map(e => {
         const s = newNodes.find(n => n.id === e.source);
         const t = newNodes.find(n => n.id === e.target);
         const hidden = (s && (s as any).hidden) || (t && (t as any).hidden);
         return { ...e, hidden } as any;
      });
    }

    const finalNodes = newNodes.map(n => {
       if (n.id === 'ai-kimmp') return { ...n, data: { ...n.data, onDoubleClick: () => { playBlip(); setFocusGraph('ai-kimmp'); } } };
       if (n.id === 'ai-ontology') return { ...n, data: { ...n.data, onDoubleClick: () => { playBlip(); setFocusGraph('semantic-graph'); } } };
       return n;
    });

    const finalEdges = newEdges.map((e, i) => ({
      ...e,
      data: { ...e.data, edgeNumber: i + 1 }
    }));

    setNodes(finalNodes as any);
    setEdges(finalEdges as any);
  }, [focusGraph, dynamicKimmpNodes, dynamicKimmpEdges, semanticNodes, semanticEdges, playBlip, activeFilters]);

  // Sync live task progress into KIMMP node data without a full graph rebuild
  useEffect(() => {
    if (focusGraph !== 'ai-kimmp') return;
    setNodes((prev: any[]) => prev.map(n => {
      const progress = agentProgress[n.id];
      if (progress === undefined) return n;
      return { ...n, data: { ...n.data, taskProgress: progress } };
    }) as any);
  }, [agentProgress, focusGraph]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chaosState === 'DB_OUTAGE') toggleAlarm(true);
    else toggleAlarm(false);

    const logInterval = setInterval(() => {
      if (chaosState === 'NORMAL') {
        const msgs = ['[WAANDA] Synced active memory states.', '[KIMMP] Orchestrating idle agents.', '[AEGIS] Perimeter secure.', '[CORE] HTTP GET /api 200 OK'];
        logMessage(msgs[Math.floor(Math.random() * msgs.length)]);
      } else if (chaosState === 'HIGH_TRAFFIC') {
        const msgs = ['[SYS] WARNING - Payload threshold exceeded by 400%', '[KIMMP] Scaling agent deployment +40', '[AEGIS] Deflecting massive DDoS vector', '[DB] CPU Load critical (99%)'];
        logMessage(`>> ${msgs[Math.floor(Math.random() * msgs.length)]}`);
      } else if (chaosState === 'DB_OUTAGE') {
        const msgs = ['[CORE] CRITICAL FAULT DETECTED IN POSTGRES_PRISMA', '[WAANDA] Alerting Admin -> DB Offline', '[BIDS] Halt processing: No DB Connection', '[API] 503 Service Unavailable'];
        logMessage(`!! ${msgs[Math.floor(Math.random() * msgs.length)]}`);
      }
    }, 1500);
    return () => clearInterval(logInterval);
  }, [chaosState, logMessage, toggleAlarm]);

  const executeSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const foundNode = nodes.find(n => n.data?.label?.toLowerCase().includes(q) || n.id.includes(q));
      if (foundNode) {
        playBlip();
        setTargetLockedNodeId(foundNode.id);
        logMessage(`>> TARGET ACQUIRED: ${foundNode.data.label}`);
        setCenter(foundNode.position.x + 150, foundNode.position.y + 150, { zoom: 1.5, duration: 1500 });
      } else {
        playErrorBlip();
        logMessage(`!! TARGET NOT FOUND: ${searchQuery}`);
      }
      setSearchQuery('');
    }
  };

  const processJarvisString = (cmd) => {
    if (cmd.includes('deploy agent') || cmd.includes('/deploy agent')) {
        const agentName = cmd.split('agent')[1]?.replace('-', '')?.trim() || Math.floor(Math.random()*1000).toString();
        playBlip();
        const newNodeId = `ag-dyn-${Date.now()}`;
        const newY = 100 + (dynamicKimmpNodes.length * 150);
        
        setDynamicKimmpNodes(prev => [...prev, {
          id: newNodeId, type: 'kangqore', parentId: 'g-kimmp-net', position: { x: 700, y: newY },
          data: { label: `Agent ${agentName.toUpperCase()}`, sub: 'Dynamic Deploy', icon: Robot, color: '#f472b6' }
        }]);
        setDynamicKimmpEdges(prev => [...prev, {
          id: `e-mc-${newNodeId}`, source: 'mc', target: newNodeId, type: 'dataPacket', animated: true, style: { stroke: '#f472b6' }
        }]);
        logMessage(`>> JARVIS: Deployed new agent [${agentName.toUpperCase()}] to KIMMP Orchestrator.`);
        if (focusGraph !== 'ai-kimmp') setFocusGraph('ai-kimmp');
      } else if (cmd.includes('traffic') || cmd === '/chaos traffic') {
        playBlip();
        setChaosState('HIGH_TRAFFIC');
        logMessage('>> JARVIS: Initiating Chaos Mode - High Traffic simulation.');
      } else if (cmd.includes('outage') || cmd === '/chaos outage') {
        setChaosState('DB_OUTAGE');
        logMessage('>> JARVIS: Initiating Chaos Mode - DB Outage simulation.');
      } else if (cmd.includes('clear') || cmd === '/clear') {
        setLogs([]);
        playBlip();
      } else {
        playErrorBlip();
        logMessage(`!! JARVIS: Command not recognized: ${cmd}`);
      }
  };

  const executeCommand = (e) => {
    if (e.key === 'Enter' && jarvisCommand.trim()) {
      processJarvisString(jarvisCommand.toLowerCase());
      setJarvisCommand('');
    }
  };

  const toggleVoiceCommands = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      logMessage('!! JARVIS: Speech Recognition API not supported in this browser.');
      playErrorBlip();
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      playBlip();
      setJarvisCommand('Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setJarvisCommand(transcript);
      processJarvisString(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
      logMessage(`!! JARVIS Voice Error: ${event.error}`);
      playErrorBlip();
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => setJarvisCommand(''), 1000);
    };

    recognition.start();
  };

  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes }) => {
      if (selectedNodes.length > 0 && selectedNodes[0].type !== 'layerGroup' && selectedNodes[0].type !== 'shield') {
        setSelectedNodeId(selectedNodes[0].id);
        playBlip();
      } else {
        setSelectedNodeId(null);
      }
    },
  });

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const activeNodes = useMemo(() => {
    if (!selectedNodeId && !targetLockedNodeId) return nodes;
    const focusId = selectedNodeId || targetLockedNodeId;
    const connectedEdges = edges.filter(e => e.source === focusId || e.target === focusId);
    const neighborIds = new Set(connectedEdges.flatMap(e => [e.source, e.target]));
    neighborIds.add(focusId);

    return nodes.map(n => ({
      ...n,
      style: {
        ...(n as any).style,
        opacity: neighborIds.has(n.id) || n.type === 'layerGroup' || n.type === 'shield' ? 1 : (isThermalMode || isMatrixMode ? 0.3 : 0.1),
        transition: 'opacity 0.5s ease'
      }
    }));
  }, [nodes, edges, selectedNodeId, targetLockedNodeId, isThermalMode, isMatrixMode]);

  const activeEdges = useMemo(() => {
    const isHighTraffic = chaosState === 'HIGH_TRAFFIC';
    const activeStroke = isMatrixMode ? '#22c55e' : (isThermalMode ? (isHighTraffic ? '#ffffff' : '#ff4400') : null);

    if (!selectedNodeId && !targetLockedNodeId) {
      return edges.map(e => ({
        ...e,
        animated: true,
        style: { 
          ...e.style, 
          opacity: (chaosState === 'DB_OUTAGE' && (e.source === 'core-db' || e.target === 'core-db')) ? 0.3 : (isThermalMode || isMatrixMode ? 0.8 : 0.8), 
          strokeWidth: isThermalMode ? (isHighTraffic ? 4 : 2) : 2, 
          filter: `drop-shadow(0 0 5px ${activeStroke || e.style.stroke})`, 
          transition: 'all 0.4s ease',
          stroke: (chaosState === 'DB_OUTAGE' && (e.source === 'core-db' || e.target === 'core-db')) ? '#ef4444' : (activeStroke || e.style.stroke)
        }
      }));
    }

    const focusId = selectedNodeId || targetLockedNodeId;
    return edges.map(e => {
      const isConnected = e.source === focusId || e.target === focusId;
      const isBrokenDb = chaosState === 'DB_OUTAGE' && (e.source === 'core-db' || e.target === 'core-db');
      return {
        ...e,
        animated: isConnected && !isBrokenDb,
        style: {
          ...e.style,
          opacity: isConnected ? (isBrokenDb ? 0.4 : 1) : 0.05,
          strokeWidth: isConnected ? (isThermalMode && isHighTraffic ? 6 : (isMatrixMode ? 2 : 4)) : 1,
          filter: isConnected && !isBrokenDb ? `drop-shadow(0 0 10px ${activeStroke || e.style.stroke})` : 'none',
          transition: 'all 0.4s ease',
          stroke: isBrokenDb ? '#ef4444' : (activeStroke || e.style.stroke)
        }
      };
    });
  }, [edges, selectedNodeId, targetLockedNodeId, chaosState, isThermalMode, isMatrixMode]);

  return (
    <NetworkContext.Provider value={{ chaosState, showMetrics, isThermalMode, isMatrixMode, targetLockedNodeId }}>
      <div className="absolute inset-0 flex flex-col overflow-hidden font-sans text-slate-200"
           onMouseMove={handleMouseMove} style={{ backgroundColor: isThermalMode || isMatrixMode ? '#000000' : '#020617' }}>
        
        <style>{`
          .react-flow__edge-path { stroke-linecap: round; }
          .react-flow__edge.animated .react-flow__edge-path {
            stroke-dasharray: ${isThermalMode ? '2 10' : (isMatrixMode ? 'none' : '4 20')};
            animation: ${chaosState === 'HIGH_TRAFFIC' ? 'laserBeam 0.15s linear infinite' : 'laserBeam 0.6s linear infinite'};
          }
          .react-flow__edge-text { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; font-size: 8px !important; font-weight: 700 !important; text-transform: uppercase; fill: #cbd5e1 !important; letter-spacing: 0.1em; display: ${isThermalMode || isMatrixMode ? 'none' : 'block'}; }
          .react-flow__edge-textbg { fill: rgba(3, 7, 18, 0.9) !important; stroke: #334155 !important; stroke-width: 1px; rx: 4px; ry: 4px; }
          .react-flow__minimap { pointer-events: auto !important; }
          .react-flow__minimap svg { user-select: none !important; -webkit-user-select: none !important; }
          .react-flow__minimap-mask { fill: rgba(3, 7, 18, 0.7) !important; stroke: none !important; }
          
          /* Edge Glow Filters */
          svg > defs { display: block; }
          
          @keyframes laserBeam { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
          @keyframes slide { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
          @keyframes reticleSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
          
          .hud-scanline { background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15)); background-size: 100% 4px; }
          .hud-vignette { box-shadow: inset 0 0 150px 20px rgba(0,0,0,1); }
          .matrix-bg {
            background-image: linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent);
            background-size: 50px 50px;
            animation: slide 10s linear infinite;
          }

          /* Cyberpunk Shapes */
          .cyber-panel {
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
          }
          .cyber-panel-reverse {
            clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
          }
        `}</style>
        
        {/* Cinematic Framing Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 hud-vignette mix-blend-multiply" />
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 opacity-70" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 opacity-70" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 opacity-70" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 opacity-70" />
        </div>

        {isMatrixMode && <div className="absolute inset-0 matrix-bg pointer-events-none opacity-50 z-10" />}

        {!isThermalMode && !isMatrixMode && (
          <>
            <div className="absolute inset-0 hud-scanline pointer-events-none z-50 opacity-40 mix-blend-overlay" />
            <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className={`absolute bottom-[20%] right-[20%] w-[700px] h-[700px] ${chaosState === 'DB_OUTAGE' ? 'bg-red-500/20' : 'bg-purple-500/10'} rounded-full blur-[200px] pointer-events-none transition-colors duration-1000`} />
          </>
        )}

        {/* HUD LAYOUT OVERHAUL: TOP LEFT UNIFIED CONSOLE */}
        <div className="absolute top-8 left-8 z-40 pointer-events-auto flex flex-col gap-2 w-72">
          {showNeuralCore ? (
            <div className={`bg-[#020617]/70 backdrop-blur-2xl p-5 shadow-2xl cyber-panel border-l-4 ${isMatrixMode ? 'border-green-600 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)]'}`}>
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                {chaosState === 'DB_OUTAGE' ? <Warning className="text-red-500 animate-pulse w-5 h-5" /> : <Lightning className={`${isMatrixMode ? 'text-green-500' : 'text-cyan-400'} animate-[spin_4s_linear_infinite] w-5 h-5`} />}
                <div className="flex-1">
                  <h1 className={`text-base font-black tracking-widest uppercase ${chaosState === 'DB_OUTAGE' ? 'text-red-500' : (isMatrixMode ? 'text-green-500' : 'text-white')}`}>Neural Core</h1>
                  <p className={`text-[7px] font-mono tracking-[0.3em] font-bold ${chaosState === 'DB_OUTAGE' ? 'text-red-500' : (isMatrixMode ? 'text-green-600' : 'text-cyan-400')}`}>SYS.VER 9.5 // {chaosState}</p>
                </div>
                
                <div className="flex gap-1.5 items-center">
                  {!isReady ? (
                    <button onClick={handleAudioInit} className={`p-1.5 rounded border transition-all animate-pulse ${isMatrixMode ? 'bg-green-500/10 text-green-500 border-green-500 hover:bg-green-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20'}`} title="Initialize Audio">
                      <SpeakerHigh className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => toggleAmbient(false)} className={`p-1.5 rounded border transition-all ${isMatrixMode ? 'bg-black text-green-700 border-green-800 hover:text-green-500' : 'bg-[#030712]/80 text-slate-400 border-slate-700 hover:bg-slate-800'}`} title="Mute Audio">
                      <SpeakerSlash className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setShowNeuralCore(false)} className={`p-1.5 rounded border transition-all ${isMatrixMode ? 'bg-black text-green-700 border-green-800 hover:text-green-500' : 'bg-[#030712]/80 text-slate-400 border-slate-700 hover:bg-slate-800'}`} title="Minimize">
                    <span className="font-mono text-[10px] font-bold leading-none px-0.5">X</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 font-mono text-[8px] tracking-widest text-slate-400 uppercase mb-3">
                <div className="flex justify-between w-full"><span className={isMatrixMode ? 'text-green-700' : 'text-slate-500'}>LATENCY:</span> <span className={chaosState === 'HIGH_TRAFFIC' ? 'text-red-400' : (isMatrixMode ? 'text-green-400' : 'text-emerald-400')}>{(Math.random() * (chaosState === 'HIGH_TRAFFIC' ? 50 : 4) + 2).toFixed(1)}ms</span></div>
                <div className="flex justify-between w-full"><span className={isMatrixMode ? 'text-green-700' : 'text-slate-500'}>ACTIVE NODES:</span> <span className={isMatrixMode ? 'text-green-400' : 'text-cyan-400'}>{nodes.length}</span></div>
                <div className="flex justify-between w-full"><span className={isMatrixMode ? 'text-green-700' : 'text-slate-500'}>SYNCED EDGES:</span> <span className={isMatrixMode ? 'text-green-400' : 'text-cyan-400'}>{edges.length}</span></div>
                <div className="flex justify-between w-full"><span className={isMatrixMode ? 'text-green-700' : 'text-slate-500'}>SYS TIME:</span> <span className={isMatrixMode ? 'text-green-300' : 'text-white'}>{time.toLocaleTimeString()}</span></div>
              </div>

              <div className={`flex items-center gap-2 bg-black/50 border px-3 py-2 rounded-lg ${isMatrixMode ? 'border-green-600/50' : 'border-cyan-500/30'}`}>
                  <Target className={`w-3.5 h-3.5 ${isMatrixMode ? 'text-green-500' : 'text-cyan-400'}`} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={executeSearch}
                    placeholder="CMD + K TO TARGET" 
                    className={`bg-transparent border-none outline-none text-[8px] font-mono tracking-widest w-full uppercase ${isMatrixMode ? 'text-green-400 placeholder-green-700' : 'text-cyan-100 placeholder-cyan-500/50'}`}
                  />
              </div>
              
              {(selectedNodeId || targetLockedNodeId) && (
                <button onClick={() => { setSelectedNodeId(null); setTargetLockedNodeId(null); fitView({ duration: 1000 }); }} className="w-full mt-2 text-[8px] font-mono font-bold px-2 py-1.5 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 rounded-md transition-all uppercase tracking-widest flex justify-between items-center group">
                  <span>Disengage Lock</span>
                  <Warning className="w-3.5 h-3.5 group-hover:animate-ping" />
                </button>
              )}
              
              {focusGraph && (
                <button onClick={() => { setFocusGraph(null); playBlip(); }} className={`w-full mt-2 text-[8px] font-mono font-bold px-2 py-1.5 rounded-md border transition-all uppercase tracking-widest flex justify-between items-center group ${isMatrixMode ? 'bg-green-900/20 text-green-400 border-green-600 hover:bg-green-900/40' : 'bg-purple-500/10 text-purple-400 border-purple-500/50 hover:bg-purple-500/20'}`}>
                  <span>Return Macro View</span>
                  <CaretLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => setShowNeuralCore(true)} className={`bg-[#020617]/70 backdrop-blur-2xl px-4 py-2 border flex items-center gap-2 ${isMatrixMode ? 'border-green-600 text-green-500' : 'border-cyan-500 text-cyan-400'} hover:bg-white/5 transition-colors self-start`}>
              <Lightning className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase">SYS.CORE [RESTORE]</span>
            </button>
          )}
        </div>



        {/* HUD LAYOUT OVERHAUL: TOP RIGHT ANCHORED LOGS */}
        <div className="absolute top-8 right-8 z-40 w-72 pointer-events-auto flex flex-col items-end gap-2">
          {showSystemLogs ? (
            <div className={`w-full bg-[#020617]/70 backdrop-blur-2xl p-4 shadow-2xl cyber-panel-reverse border-r-4 ${isMatrixMode ? 'border-green-600' : 'border-cyan-500'}`}>
              <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isMatrixMode ? 'border-green-800' : 'border-white/10'}`}>
                <span className={`text-[7px] font-mono tracking-[0.2em] uppercase font-bold ${isMatrixMode ? 'text-green-600' : 'text-slate-400'}`}>System Logs</span>
                <div className="flex items-center gap-3">
                  <Pulse className={`w-3 h-3 animate-pulse ${isMatrixMode ? 'text-green-500' : 'text-emerald-400'}`} />
                  <button onClick={() => setShowSystemLogs(false)} className={`p-1 rounded transition-all ${isMatrixMode ? 'text-green-700 hover:text-green-500' : 'text-slate-500 hover:text-slate-300'}`} title="Minimize">
                    <span className="font-mono text-[9px] font-bold leading-none px-0.5">X</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 font-mono text-[7px] h-24 overflow-hidden justify-end pointer-events-none">
                {logs.map((log, i) => (
                  <div key={i} className={`${log.startsWith('!!') ? 'text-red-400 font-bold' : log.startsWith('>>') ? 'text-amber-400' : (isMatrixMode ? 'text-green-400' : 'text-cyan-300')} animate-[slideInRight_0.2s_ease-out]`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button onClick={() => setShowSystemLogs(true)} className={`bg-[#020617]/70 backdrop-blur-2xl px-4 py-2 border flex items-center gap-2 ${isMatrixMode ? 'border-green-600 text-green-500' : 'border-cyan-500 text-cyan-400'} hover:bg-white/5 transition-colors self-end`}>
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase">SYS.LOGS [RESTORE]</span>
              <Pulse className="w-4 h-4 animate-pulse" />
            </button>
          )}
        </div>

        {/* HUD LAYOUT OVERHAUL: BOTTOM RIGHT STACKED CHAOS & MINIMAP */}
        <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-4 pointer-events-auto items-end w-32">
          
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => { playBlip(); handleTabClick('MATRIX', 'matrix'); }}
              className={`flex-1 text-[7px] font-mono font-bold px-1 py-1.5 rounded-lg uppercase tracking-widest flex justify-center items-center gap-1.5 transition-all ${isMatrixMode ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-[#030712] border border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              <CodeBlock className="w-3 h-3" />
              <span>Matrix</span>
            </button>

            <button 
              onClick={() => { playBlip(); handleTabClick('THERMAL', 'thermal'); }}
              className={`flex-1 text-[7px] font-mono font-bold px-1 py-1.5 rounded-lg uppercase tracking-widest flex justify-center items-center gap-1.5 transition-all ${isThermalMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_15px_rgba(255,100,0,0.3)]' : 'bg-[#030712] border border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              <Thermometer className="w-3 h-3" />
              <span>Thermal</span>
            </button>
          </div>

          <div className="bg-[#020617]/80 p-3 backdrop-blur-2xl shadow-2xl w-full cyber-panel border-r-4 border-slate-700">
            <h3 className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] border-b border-white/10 pb-2 mb-2 flex items-center gap-1.5">
               <Warning className="w-3 h-3 text-amber-500" />
               Chaos Engineering
            </h3>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { playBlip(); setChaosState(chaosState === 'NORMAL' ? 'DB_OUTAGE' : 'NORMAL'); }}
                className={`text-[8px] font-mono font-bold px-2 py-1.5 rounded uppercase tracking-widest flex justify-between items-center transition-all ${chaosState === 'DB_OUTAGE' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'}`}
              >
                <span>DB Outage</span>
                <Database className="w-3 h-3" />
              </button>
              
              <button 
                onClick={() => { playBlip(); setChaosState(chaosState === 'NORMAL' ? 'HIGH_TRAFFIC' : 'NORMAL'); }}
                className={`text-[8px] font-mono font-bold px-2 py-1.5 rounded uppercase tracking-widest flex justify-between items-center transition-all ${chaosState === 'HIGH_TRAFFIC' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'}`}
              >
                <span>High Traffic</span>
                <Pulse className="w-3 h-3" />
              </button>
            </div>
          </div>
          

        </div>

        {/* HUD LAYOUT OVERHAUL: BOTTOM CENTER FILTER HUD */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center bg-[#020617]/80 backdrop-blur-2xl p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto gap-2 cyber-panel border-b-2 border-cyan-500/50">
          {Object.entries(activeFilters).map(([key, isActive]) => (
            <button
              key={key}
              onClick={() => setActiveFilters(prev => ({ ...prev, [key]: !isActive }))}
              className={`text-[7px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest transition-all cyber-panel ${isActive ? 'bg-cyan-500/20 text-cyan-400 border-b border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-black/40 text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="flex-1 w-full h-full relative z-20">
          <ReactFlow
            nodes={activeNodes}
            edges={activeEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => {
              playBlip();
              setTargetLockedNodeId(node.id);
              setCenter(node.position.x + 150, node.position.y + 150, { zoom: 1.5, duration: 1500 });
            }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            className="bg-transparent"
          >
            {!isThermalMode && !isMatrixMode && <Background variant={BackgroundVariant.Dots} color="#1e293b" gap={50} size={1.5} />}
          </ReactFlow>
        </div>

        {/* HUD LAYOUT OVERHAUL: RIGHT SIDE TELEMETRY SIDEBAR */}
        {targetLockedNodeId && nodes.find(n => n.id === targetLockedNodeId) && (() => {
          const targetNode = nodes.find(n => n.id === targetLockedNodeId);
          return (
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#030712]/95 border-l border-cyan-500/30 backdrop-blur-3xl shadow-[-20px_0_40px_rgba(0,0,0,0.8)] z-50 p-6 flex flex-col gap-6 animate-[slideInRight_0.3s_ease-out] pointer-events-auto">
              <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-black tracking-widest text-white uppercase">{targetNode.data?.label || targetNode.id}</h2>
                  <p className="text-[9px] font-mono tracking-widest text-cyan-400">{targetNode.data?.sub || 'SYSTEM NODE'}</p>
                </div>
                <button onClick={() => { setTargetLockedNodeId(null); setSelectedNodeId(null); fitView({ duration: 1000 }); }} className="text-slate-500 hover:text-white p-2 text-xs">✕</button>
              </div>

              <div className="flex flex-col gap-4">
                 <div>
                   <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1"><span>CPU LOAD</span> <span className="text-cyan-400">{(Math.random()*40 + 40).toFixed(1)}%</span></div>
                   <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden"><div className="bg-cyan-500 h-full animate-pulse" style={{width: `${Math.random()*40 + 40}%`}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1"><span>MEMORY</span> <span className="text-purple-400">{(Math.random()*2 + 1).toFixed(2)} TB</span></div>
                   <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden"><div className="bg-purple-500 h-full animate-pulse" style={{width: `${Math.random()*60 + 20}%`}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1"><span>NETWORK</span> <span className="text-emerald-400">{(Math.random()*500 + 100).toFixed(0)} MB/s</span></div>
                   <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden"><div className="bg-emerald-500 h-full animate-pulse" style={{width: `${Math.random()*80 + 10}%`}}></div></div>
                 </div>
              </div>

              <div className="flex-1 bg-black/50 border border-slate-800 rounded-xl p-3 overflow-hidden flex flex-col justify-end">
                 <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">Live Telemetry</span>
                 <div className="font-mono text-[8px] text-cyan-300 flex flex-col gap-1">
                   <div>&gt; Connection established.</div>
                   <div>&gt; Streaming data packets...</div>
                   <div>&gt; Health check: OK.</div>
                   <div className="animate-pulse">&gt; Waiting for input_</div>
                 </div>
              </div>
              
              <button className="w-full py-3 bg-cyan-500/10 text-cyan-400 font-mono text-[9px] font-bold tracking-widest uppercase border border-cyan-500/50 rounded-xl hover:bg-cyan-500/20 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                Initialize Sub-Routine
              </button>
            </div>
          );
        })()}
      </div>
    </NetworkContext.Provider>
  );
}

export function NeuralNetworkModule() {
  return (
    <ReactFlowProvider>
      <InnerNetwork />
    </ReactFlowProvider>
  );
}

export default NeuralNetworkModule;
