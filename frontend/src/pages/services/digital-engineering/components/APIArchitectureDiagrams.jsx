import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Brand Palette ───────────────────────────────────────────────────────────
const BRAND = {
  blue: '#2564ea',
  cyan: '#4ab6d4',
  dark: '#0f172a',
  mid: '#1e293b',
  light: '#f8fafc',
  muted: '#94a3b8',
  border: '#e2e8f0',
};

// ═══════════════════════════════════════════════════════════════════════════════
// Diagram 1: API Gateway Facade — Clients → Gateway Stack → Microservices
// ═══════════════════════════════════════════════════════════════════════════════
export const GatewayFacadeDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });

      // Client icons fade in
      tl.fromTo('.gf-client', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 0);

      // Gateway rows stagger reveal
      tl.fromTo('.gf-row', { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out', transformOrigin: 'left center' }, 0.3);

      // Connector lines draw in
      tl.fromTo('.gf-line', { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, ease: 'power1.out' }, 0.6);

      // Microservice badges scale in
      tl.fromTo('.gf-service', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)' }, 0.9);

      // Rest API badges pop
      tl.fromTo('.gf-badge', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' }, 1.2);

      // Animate flowing data dots continuously
      gsap.to('.gf-particle', {
        motionPath: { autoRotate: false },
        repeat: -1,
        duration: 2.5,
        ease: 'none',
        stagger: { each: 0.6, repeat: -1 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const gatewayRows = [
    'Facade of Microservices, Single Entry Point',
    'Course, Consumer Driven APIs',
    'Protocol / Data Transformation',
    'Service Registry and Discovery',
    'Security and Authorization',
    'Request Dispatching and Load Balancing',
    'Orchestration',
    'Throttling',
    'Monitoring',
  ];

  const services = [
    { name: 'Inventory Microservice', y: 70 },
    { name: 'Product Microservice',   y: 200 },
    { name: 'Customer Microservice',  y: 330 },
    { name: 'Shipping Microservice',  y: 460 },
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 960 580" className="w-full h-auto" fill="none" style={{ minWidth: 700 }}>
        <defs>
          <linearGradient id="gf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.blue} />
            <stop offset="100%" stopColor={BRAND.cyan} />
          </linearGradient>
          <linearGradient id="gf-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.dark} />
            <stop offset="100%" stopColor={BRAND.mid} />
          </linearGradient>
          <filter id="gf-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="gf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#gf-grad)" />
          </marker>
        </defs>

        {/* Client Icons */}
        {/* Desktop */}
        <g className="gf-client" opacity="0">
          <rect x="35" y="110" width="50" height="36" rx="4" fill={BRAND.dark} />
          <rect x="48" y="146" width="24" height="4" rx="1" fill={BRAND.muted} />
          <rect x="54" y="150" width="12" height="8" rx="1" fill={BRAND.muted} />
        </g>
        {/* Mobile */}
        <g className="gf-client" opacity="0">
          <rect x="45" y="255" width="28" height="48" rx="6" fill={BRAND.dark} />
          <circle cx="59" cy="295" r="3" fill={BRAND.muted} />
        </g>
        {/* IoT Gear */}
        <g className="gf-client" opacity="0">
          <circle cx="60" cy="440" r="18" stroke={BRAND.dark} strokeWidth="3" fill="none" />
          <circle cx="60" cy="440" r="6" fill={BRAND.dark} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <line key={i} x1={60 + 18 * Math.cos(a * Math.PI / 180)} y1={440 + 18 * Math.sin(a * Math.PI / 180)} x2={60 + 24 * Math.cos(a * Math.PI / 180)} y2={440 + 24 * Math.sin(a * Math.PI / 180)} stroke={BRAND.dark} strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>

        {/* Left Connector Lines */}
        <path className="gf-line" d="M 95 130 L 175 130 L 175 290 L 210 290" stroke="url(#gf-grad)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" markerEnd="url(#gf-arrow)" filter="url(#gf-glow)" />
        <path className="gf-line" d="M 85 280 L 210 280" stroke="url(#gf-grad)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" markerEnd="url(#gf-arrow)" filter="url(#gf-glow)" />
        <path className="gf-line" d="M 95 440 L 175 440 L 175 300 L 210 300" stroke="url(#gf-grad)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" markerEnd="url(#gf-arrow)" filter="url(#gf-glow)" />

        {/* Gateway Stack */}
        {gatewayRows.map((text, i) => {
          const y = 50 + i * 54;
          const isEven = i % 2 === 0;
          return (
            <g key={i} className="gf-row" opacity="0">
              <rect x="220" y={y} width="380" height="50" rx="8" fill={isEven ? BRAND.dark : BRAND.mid} />
              <text x="410" y={y + 30} fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="Inter, sans-serif">{text}</text>
            </g>
          );
        })}

        {/* Right Connector Lines */}
        {services.map((s, i) => (
          <path key={i} className="gf-line" d={`M 600 ${290} L 660 ${290} L 660 ${s.y + 25} L 700 ${s.y + 25}`} stroke="url(#gf-grad)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" markerEnd="url(#gf-arrow)" filter="url(#gf-glow)" />
        ))}

        {/* Rest API Badges */}
        {services.map((s, i) => (
          <g key={i} className="gf-badge" opacity="0">
            <ellipse cx="720" cy={s.y + 25} rx="26" ry="16" fill="url(#gf-grad)" />
            <text x="720" y={s.y + 29} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">REST API</text>
          </g>
        ))}

        {/* Microservice Blocks */}
        {services.map((s, i) => (
          <g key={i} className="gf-service" opacity="0">
            <rect x="755" y={s.y} width="180" height="50" rx="10" fill="url(#gf-grad-dark)" />
            <rect x="755" y={s.y} width="6" height="50" rx="3" fill="url(#gf-grad)" />
            <text x="862" y={s.y + 30} fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="Inter, sans-serif">{s.name}</text>
          </g>
        ))}

        {/* Animated Data Particles */}
        {[0, 1, 2].map(i => (
          <circle key={i} className="gf-particle" r="3" fill={BRAND.cyan} opacity="0.8">
            <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`}>
              <mpath xlinkHref={`#gf-flow-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          </circle>
        ))}
        <path id="gf-flow-0" d="M 85 280 L 210 280 L 600 290 L 720 100 L 860 100" fill="none" stroke="none" />
        <path id="gf-flow-1" d="M 85 280 L 210 280 L 600 290 L 720 340 L 860 340" fill="none" stroke="none" />
        <path id="gf-flow-2" d="M 85 280 L 210 280 L 600 290 L 720 470 L 860 470" fill="none" stroke="none" />
      </svg>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// Diagram 2: Microservices Architecture Layers
// ═══════════════════════════════════════════════════════════════════════════════
export const ArchitectureLayersDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });

      tl.fromTo('.al-device', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0);
      tl.fromTo('.al-arrows', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.3);
      tl.fromTo('.al-platform', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.4);
      tl.fromTo('.al-module', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, 0.7);
      tl.fromTo('.al-cluster', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 1.0);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 900 680" className="w-full h-auto" fill="none" style={{ minWidth: 650 }}>
        <defs>
          <linearGradient id="al-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.blue} />
            <stop offset="100%" stopColor={BRAND.cyan} />
          </linearGradient>
          <filter id="al-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Section Label */}
        <text x="60" y="40" fill={BRAND.dark} fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">Delivery Channels</text>

        {/* Devices */}
        <g className="al-device">
          <rect x="320" y="25" width="24" height="42" rx="5" fill={BRAND.blue} opacity="0.9" />
          <rect x="326" y="30" width="12" height="28" rx="2" fill="#fff" opacity="0.3" />
        </g>
        <g className="al-device">
          <rect x="390" y="30" width="50" height="34" rx="3" fill={BRAND.dark} />
          <rect x="395" y="34" width="40" height="22" rx="1" fill={BRAND.blue} opacity="0.3" />
          <rect x="405" y="64" width="20" height="4" rx="1" fill={BRAND.muted} />
        </g>
        <g className="al-device">
          <rect x="490" y="28" width="55" height="38" rx="3" fill={BRAND.dark} />
          <rect x="495" y="32" width="45" height="28" rx="1" fill={BRAND.blue} opacity="0.3" />
          <rect x="507" y="66" width="20" height="4" rx="1" fill={BRAND.muted} />
        </g>

        {/* Down Arrows */}
        <g className="al-arrows">
          <path d="M 380 80 L 420 115" stroke="url(#al-grad)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 460 80 L 470 115" stroke="url(#al-grad)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 520 80 L 510 115" stroke="url(#al-grad)" strokeWidth="2" strokeDasharray="4 4" />
        </g>

        {/* Architecture Label */}
        <text x="60" y="160" fill={BRAND.dark} fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">Architecture</text>

        {/* Platform Background */}
        <rect className="al-platform" x="60" y="175" width="780" height="310" rx="24" fill={BRAND.light} stroke={BRAND.border} strokeWidth="1.5" filter="url(#al-shadow)" opacity="0" />

        {/* Architecture Modules */}
        {/* Monitoring & Analytics */}
        <g className="al-module" opacity="0">
          <rect x="85" y="210" width="150" height="80" rx="14" fill="url(#al-grad)" />
          <text x="160" y="246" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Monitoring &</text>
          <text x="160" y="264" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Analytics</text>
        </g>

        {/* Security */}
        <g className="al-module" opacity="0">
          <rect x="260" y="195" width="140" height="80" rx="14" fill={BRAND.dark} />
          <text x="330" y="231" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Security,</text>
          <text x="330" y="249" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Access Mgmt</text>
        </g>

        {/* API Gateway Circle */}
        <g className="al-module" opacity="0">
          <circle cx="480" cy="235" r="50" fill="url(#al-grad)" />
          <text x="480" y="230" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">API</text>
          <text x="480" y="248" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Gateway</text>
          {/* Pulsing ring */}
          <circle cx="480" cy="235" r="50" stroke={BRAND.cyan} strokeWidth="1.5" fill="none" opacity="0.4">
            <animate attributeName="r" values="50;58;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Service Router */}
        <g className="al-module" opacity="0">
          <circle cx="610" cy="310" r="45" fill={BRAND.mid} />
          <text x="610" y="305" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Service</text>
          <text x="610" y="323" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Router</text>
        </g>

        {/* Service Registry */}
        <g className="al-module" opacity="0">
          <rect x="690" y="275" width="130" height="70" rx="14" fill={BRAND.blue} opacity="0.85" />
          <text x="755" y="306" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Service</text>
          <text x="755" y="324" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Registry</text>
        </g>

        {/* Microservice Clusters */}
        {[
          { x: 85, label: 'Microservice A Cluster' },
          { x: 330, label: 'Microservice B Cluster' },
          { x: 575, label: 'Microservice C Cluster' },
        ].map((m, i) => (
          <g key={i} className="al-cluster" opacity="0">
            <rect x={m.x} y="510" width="210" height="130" rx="18" fill="#ffffff" stroke={BRAND.border} strokeWidth="1.5" filter="url(#al-shadow)" />
            <text x={m.x + 105} y="538" fill={BRAND.dark} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">{m.label}</text>

            {/* Micro-service gears */}
            {[0, 1, 2].map(j => (
              <g key={j}>
                <circle cx={m.x + 45 + j * 60} cy="575" r="16" stroke="url(#al-grad)" strokeWidth="2.5" fill="none" strokeDasharray="4 3" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" values={`0 ${m.x + 45 + j * 60} 575;360 ${m.x + 45 + j * 60} 575`} dur={`${8 + j * 2}s`} repeatCount="indefinite" />
                </circle>
                <text x={m.x + 45 + j * 60} y="580" fill={BRAND.blue} fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">μ</text>
              </g>
            ))}

            {/* DB icons */}
            {[0, 1].map(j => (
              <g key={j}>
                <ellipse cx={m.x + 65 + j * 80} cy="620" rx="18" ry="7" fill="none" stroke={BRAND.muted} strokeWidth="1.5" />
                <path d={`M ${m.x + 47 + j * 80} 620 L ${m.x + 47 + j * 80} 636 Q ${m.x + 65 + j * 80} 648 ${m.x + 83 + j * 80} 636 L ${m.x + 83 + j * 80} 620`} fill="none" stroke={BRAND.muted} strokeWidth="1.5" />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// Diagram 3: Gateway Load Balancer — Clients → LB → Gateway Instances
// ═══════════════════════════════════════════════════════════════════════════════
export const GatewayLoadBalancerDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });

      tl.fromTo('.lb-clients', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
      tl.fromTo('.lb-balancer', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.3);
      tl.fromTo('.lb-line', { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, ease: 'power1.out' }, 0.5);
      tl.fromTo('.lb-machine', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 0.7);
      tl.fromTo('.lb-instance', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0.9);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 850 480" className="w-full h-auto" fill="none" style={{ minWidth: 600 }}>
        <defs>
          <linearGradient id="lb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.blue} />
            <stop offset="100%" stopColor={BRAND.cyan} />
          </linearGradient>
          <filter id="lb-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lb-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
          </filter>
          <marker id="lb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#lb-grad)" />
          </marker>
        </defs>

        {/* Clients Block */}
        <g className="lb-clients" opacity="0">
          <rect x="40" y="195" width="130" height="70" rx="12" fill={BRAND.dark} filter="url(#lb-shadow)" />
          <text x="105" y="236" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Clients</text>
        </g>

        {/* Arrow: Clients → LB */}
        <path className="lb-line" d="M 175 230 L 260 230" stroke="url(#lb-grad)" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#lb-arrow)" filter="url(#lb-glow)" />

        {/* Load Balancer */}
        <g className="lb-balancer" opacity="0">
          <rect x="270" y="190" width="170" height="80" rx="14" fill="url(#lb-grad)" filter="url(#lb-shadow)" />
          <text x="355" y="236" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Load Balancer</text>
        </g>

        {/* Label */}
        <text x="500" y="55" fill={BRAND.muted} fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Load balanced traffic</text>

        {/* Arrow: LB → Machine 1 */}
        <path className="lb-line" d="M 445 210 L 510 210 L 510 100 L 560 100" stroke="url(#lb-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#lb-arrow)" filter="url(#lb-glow)" />
        <path className="lb-line" d="M 510 100 L 510 165 L 560 165" stroke="url(#lb-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#lb-arrow)" filter="url(#lb-glow)" />

        {/* Arrow: LB → Machine 2 */}
        <path className="lb-line" d="M 445 250 L 510 250 L 510 310 L 560 310" stroke="url(#lb-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#lb-arrow)" filter="url(#lb-glow)" />
        <path className="lb-line" d="M 510 310 L 510 375 L 560 375" stroke="url(#lb-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#lb-arrow)" filter="url(#lb-glow)" />

        {/* Machine 1 Boundary */}
        <g className="lb-machine" opacity="0">
          <rect x="555" y="60" width="260" height="160" rx="16" fill="none" stroke={BRAND.blue} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" />
          <text x="685" y="210" fill={BRAND.muted} fontSize="11" fontWeight="600" fontStyle="italic" textAnchor="middle" fontFamily="Inter, sans-serif">Physical / Virtual Machine</text>
        </g>

        {/* Machine 2 Boundary */}
        <g className="lb-machine" opacity="0">
          <rect x="555" y="270" width="260" height="160" rx="16" fill="none" stroke={BRAND.blue} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" />
          <text x="685" y="420" fill={BRAND.muted} fontSize="11" fontWeight="600" fontStyle="italic" textAnchor="middle" fontFamily="Inter, sans-serif">Physical / Virtual Machine</text>
        </g>

        {/* Gateway Instances */}
        {[
          { y: 80, label: 'API Gateway Instance 1' },
          { y: 145, label: 'API Gateway Instance 2' },
          { y: 290, label: 'API Gateway Instance 3' },
          { y: 355, label: 'API Gateway Instance 4' },
        ].map((inst, i) => (
          <g key={i} className="lb-instance" opacity="0">
            <rect x="580" y={inst.y} width="210" height="48" rx="10" fill={BRAND.dark} />
            <rect x="580" y={inst.y} width="5" height="48" rx="2.5" fill="url(#lb-grad)" />
            <text x="692" y={inst.y + 29} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="Inter, sans-serif">{inst.label}</text>
          </g>
        ))}

        {/* Animated Traffic Particles */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} r="3.5" fill={BRAND.cyan} opacity="0">
            <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
              <mpath xlinkHref={`#lb-flow-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          </circle>
        ))}
        <path id="lb-flow-0" d="M 105 230 L 355 230 L 510 100 L 685 100" fill="none" stroke="none" />
        <path id="lb-flow-1" d="M 105 230 L 355 230 L 510 165 L 685 165" fill="none" stroke="none" />
        <path id="lb-flow-2" d="M 105 230 L 355 230 L 510 310 L 685 310" fill="none" stroke="none" />
        <path id="lb-flow-3" d="M 105 230 L 355 230 L 510 375 L 685 375" fill="none" stroke="none" />
      </svg>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// Diagram 4: Security Flow — OAuth/JWT Auth Flow
// ═══════════════════════════════════════════════════════════════════════════════
export const SecurityFlowDiagram = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });

      tl.fromTo('.sf-client', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
      tl.fromTo('.sf-divider', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'top center' }, 0.2);
      tl.fromTo('.sf-gateway', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.4);
      tl.fromTo('.sf-auth', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.5);
      tl.fromTo('.sf-line', { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08, ease: 'power1.out' }, 0.6);
      tl.fromTo('.sf-step', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' }, 0.8);
      tl.fromTo('.sf-service', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 1.0);
    }, ref);
    return () => ctx.revert();
  }, []);

  const microservices = [
    { name: 'Inventory Microservice', y: 115 },
    { name: 'Customer Microservice',  y: 215 },
    { name: 'Shipping Microservice',  y: 315 },
    { name: 'Product Microservice',   y: 415 },
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 960 560" className="w-full h-auto" fill="none" style={{ minWidth: 700 }}>
        <defs>
          <linearGradient id="sf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.blue} />
            <stop offset="100%" stopColor={BRAND.cyan} />
          </linearGradient>
          <filter id="sf-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sf-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
          </filter>
          <marker id="sf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#sf-grad)" />
          </marker>
        </defs>

        {/* Public / Private Divider */}
        <line className="sf-divider" x1="530" y1="30" x2="530" y2="530" stroke={BRAND.border} strokeWidth="2" strokeDasharray="6 4" />
        <text x="430" y="545" fill={BRAND.muted} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Public Internet</text>
        <text x="730" y="545" fill={BRAND.muted} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Private Subnet</text>

        {/* Client */}
        <g className="sf-client" opacity="0">
          <rect x="40" y="260" width="110" height="60" rx="12" fill={BRAND.dark} filter="url(#sf-shadow)" />
          <text x="95" y="296" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Client</text>
        </g>

        {/* Authorization Server */}
        <g className="sf-auth" opacity="0">
          <rect x="280" y="55" width="200" height="60" rx="12" fill={BRAND.dark} filter="url(#sf-shadow)" />
          <text x="380" y="91" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">Authorization Servers</text>
          {/* User Store icon */}
          <ellipse cx="510" cy="68" rx="22" ry="10" fill="none" stroke={BRAND.muted} strokeWidth="1.5" />
          <path d="M 488 68 L 488 88 Q 510 100 532 88 L 532 68" fill="none" stroke={BRAND.muted} strokeWidth="1.5" />
          <text x="510" y="112" fill={BRAND.muted} fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="Inter, sans-serif">User Store</text>
        </g>

        {/* API Gateway */}
        <g className="sf-gateway" opacity="0">
          <rect x="280" y="250" width="200" height="70" rx="14" fill="url(#sf-grad)" filter="url(#sf-shadow)" />
          <text x="380" y="291" fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">API Gateway</text>
          {/* TLS Lock icon */}
          <rect x="230" y="295" width="26" height="20" rx="3" fill={BRAND.dark} />
          <path d="M 237 295 L 237 288 Q 243 278 249 288 L 249 295" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <text x="243" y="325" fill={BRAND.blue} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">TLS</text>
        </g>

        {/* Flow Lines & Step Numbers */}
        {/* 1: Client → Auth Server (curved, Access Token) */}
        <path className="sf-line" d="M 95 260 Q 95 85, 275 85" stroke="url(#sf-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" fill="none" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        <g className="sf-step" opacity="0">
          <circle cx="125" cy="170" r="14" fill="url(#sf-grad)" />
          <text x="125" y="175" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">1</text>
        </g>
        <text x="145" y="145" fill={BRAND.muted} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Access Token</text>

        {/* 2: Client → API Gateway */}
        <path className="sf-line" d="M 155 290 L 275 290" stroke="url(#sf-grad)" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        <g className="sf-step" opacity="0">
          <circle cx="215" cy="280" r="14" fill="url(#sf-grad)" />
          <text x="215" y="285" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">2</text>
        </g>
        <text x="200" y="310" fill={BRAND.muted} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Access Token</text>

        {/* 3: Gateway → Auth Server */}
        <path className="sf-line" d="M 360 248 L 360 120" stroke="url(#sf-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        <g className="sf-step" opacity="0">
          <circle cx="350" cy="185" r="14" fill="url(#sf-grad)" />
          <text x="350" y="190" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">3</text>
        </g>
        <text x="335" y="170" fill={BRAND.muted} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Access Token</text>

        {/* 4: Auth Server → Gateway (JWT) */}
        <path className="sf-line" d="M 400 120 L 400 248" stroke="url(#sf-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        <g className="sf-step" opacity="0">
          <circle cx="415" cy="185" r="14" fill="url(#sf-grad)" />
          <text x="415" y="190" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">4</text>
        </g>
        <text x="430" y="170" fill={BRAND.muted} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">JWT</text>

        {/* 5: Gateway → Microservices */}
        <path className="sf-line" d="M 485 285 L 570 285" stroke="url(#sf-grad)" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset="300" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        <g className="sf-step" opacity="0">
          <circle cx="520" cy="270" r="14" fill="url(#sf-grad)" />
          <text x="520" y="275" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">5</text>
        </g>
        <text x="527" y="250" fill={BRAND.muted} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">HTTPS</text>

        {/* Fan-out lines to microservices */}
        {microservices.map((s, i) => (
          <path key={i} className="sf-line" d={`M 600 285 L 600 ${s.y + 25} L 640 ${s.y + 25}`} stroke="url(#sf-grad)" strokeWidth="1.5" strokeDasharray="300" strokeDashoffset="300" fill="none" markerEnd="url(#sf-arrow)" filter="url(#sf-glow)" />
        ))}

        {/* JWT Labels on fan-out */}
        <text x="573" y="175" fill={BRAND.muted} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">JWT</text>
        <text x="573" y="365" fill={BRAND.muted} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">HTTPS</text>

        {/* Microservices */}
        {microservices.map((s, i) => (
          <g key={i} className="sf-service" opacity="0">
            {/* REST API cloud badge */}
            <ellipse cx="665" cy={s.y + 25} rx="24" ry="14" fill="url(#sf-grad)" />
            <text x="665" y={s.y + 29} fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">REST API</text>

            {/* Service block */}
            <rect x="700" y={s.y} width="210" height="50" rx="10" fill={BRAND.dark} filter="url(#sf-shadow)" />
            <rect x="700" y={s.y} width="5" height="50" rx="2.5" fill="url(#sf-grad)" />
            <text x="812" y={s.y + 30} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="Inter, sans-serif">{s.name}</text>
          </g>
        ))}

        {/* Animated Auth Token Particle */}
        {[0, 1].map(i => (
          <circle key={i} r="4" fill={BRAND.cyan} opacity="0">
            <animateMotion dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`}>
              <mpath xlinkHref={`#sf-flow-${i}`} />
            </animateMotion>
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${4 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
          </circle>
        ))}
        <path id="sf-flow-0" d="M 95 260 Q 95 85 380 85 L 380 248 L 400 120 L 400 248 L 485 285 L 600 140 L 810 140" fill="none" stroke="none" />
        <path id="sf-flow-1" d="M 95 290 L 380 290 L 485 285 L 600 415 L 810 440" fill="none" stroke="none" />
      </svg>
    </div>
  );
};
