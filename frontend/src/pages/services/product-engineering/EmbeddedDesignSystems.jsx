import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck, Cpu, CircuitBoard, Settings, Workflow, BrainCircuit, Globe, Database, Shield, Target, TrendingUp, Bot, Network, Eye, Cog, Factory, Heart, Building2, ShoppingCart, Monitor, Wifi, Server, HardDrive, Boxes, GitBranch, Wrench, Cable } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const EmbeddedDesignSystems = () => {
  // ============================================
  // 1) HERO SECTION
  // ============================================
  const service = {
    name: 'Embedded Design Systems & IT/OT',
    titleLine1: 'Embedded Design',
    titleHighlight: 'Systems',
    slug: 'embedded-design-systems',
    shortDescription: 'From concept to production—complete embedded product engineering spanning hardware, firmware, FPGA, mechanical design, and IT/OT convergence.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">From concept to production—complete embedded product engineering spanning hardware, firmware, FPGA, mechanical design, and IT/OT convergence.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises transform ideas into production-ready embedded products. From system architecture and high-speed board design to firmware development, FPGA/ASIC engineering, mechanical enclosures, and regulatory certifications—we deliver end-to-end under one roof, cutting across networking, industrial automation, IoT, medical devices, and more.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: 'Fast', label: 'Concept to prototype', color: 'text-blue-500' },
      { value: '95%', label: 'First-pass design success', color: 'text-brand-blue' },
      { value: '100%', label: 'Verification coverage target', color: 'text-indigo-500' },
      { value: 'CE/FCC/UL', label: 'Regulatory certified', color: 'text-purple-500' }
    ],

    // ============================================
    // 2–4) HIGH FIDELITY SECTIONS
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'EMBEDDED ENGINEERING :: 2026',
        titleLine1: 'Idea to Product.',
        titleHighlight: 'Production',
        titleLine2: 'Ready.',
        description: 'Embedded product design requires specialized talent, expensive tools, and modern equipment—along with industrial design, mechanical engineering, thermal analysis, and regulatory certifications. Getting all these capabilities under one roof is rare. Kangqore brings the full stack together: system architecture, hardware design, software, mechanical design, prototyping, validation, certifications, and pilot production.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Fragmented vendor chains, revision cycles, disconnected hardware-software workflows, shrinking time-to-market, and the cost of maintaining tools, personnel, and infrastructure in-house.',
        requirementLabel: 'Our Approach',
        requirementText: 'One team, full-stack ownership. First-time-right design methodology. From small form factor designs to multi-board system designs—delivered with proven practices that ensure superior product quality and high fault coverage.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&q=80',
        statusLabel: 'Engineering Maturity',
        statusValue: 'Production-Grade'
      },
      philosophy: {
        icon: <CircuitBoard className="w-7 h-7 text-brand-blue" />,
        title: 'Our',
        titleHighlight: 'Engineering Framework.',
        description: 'At Kangqore, embedded engineering spans every phase of the product lifecycle—from architecture and design through prototyping, validation, certification, and production handover.',
        pills: ['Architect', 'Design', 'Validate', 'Produce']
      },
      matrix: {
        engineId: 'Engine :: EDS_Flow_V3',
        title: 'How We Deliver',
        subtext: 'A structured, production-grade delivery model covering every phase from feasibility analysis to pilot production and manufacturing support.',
        layers: [
          { title: 'Architect', id: 'EDS_ARCH', icon: <Search />, desc: 'System architecture + feasibility analysis + BoM cost modeling. Define the product blueprint with technical and commercial viability established upfront.' },
          { title: 'Design', id: 'EDS_DES', icon: <Layers />, desc: 'Schematic capture + PCB layout + firmware architecture + FPGA RTL + mechanical enclosure. Hardware-software co-design with simulation and signal integrity analysis.' },
          { title: 'Validate', id: 'EDS_VAL', icon: <Cpu />, desc: 'Board bring-up + EVT/DVT + pre-compliance EMI/EMC + FMEA/MTBF analysis. Validate the design with working prototypes before committing to production tooling.' },
          { title: 'Produce', id: 'EDS_PROD', icon: <TrendingUp />, desc: 'Regulatory certifications (CE, FCC, BIS, UL, RoHS) + DFM optimization + pilot production + manufacturing handover. Transition from lab to factory at scale.' }
        ]
      },
      schematic: {
        titleLine1: 'Engineer',
        titleHighlight: 'Excellence.',
        description: 'Build products where hardware, firmware, and mechanical design work as one—connected, certified, and designed for the demands of volume production.',
        stats: [
          { label: 'Design', val: 'FIRST-TIME-RIGHT' },
          { label: 'Coverage', val: 'CHIP-TO-CLOUD' },
          { label: 'Output', val: 'PRODUCTION-READY' }
        ]
      }
    }
  };

  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform your business with cutting-edge product engineering solutions.'
  };

  // ============================================
  // CAPABILITIES — 4 cards
  // ============================================
  const capabilities = [
    {
      title: 'Product Design',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'From miniature wearable devices to complex multi-board system designs—a one-stop-shop for any electronic product design. First-time-right practices ensure superior product quality, extended availability, and high fault coverage.',
      items: [
        'Single board computers: PC/104, 3.5" SBC, Industrial PC',
        'System on Modules & carrier boards: COM Express, SMARC, Qseven',
        'Wearable devices & IoT gateways',
        'Healthcare devices & medical electronics',
        'Servers, storage solutions & data acquisition I/O boards',
        'Protocol analyzer boards & analytical instruments',
        'Networking devices: modems, routers, switches, DSLAM',
        'Industrial control systems & automation hardware',
        'Multi-board system design',
        'Power electronics: AC-DC/DC-DC, inverters, UPS, solar conversion'
      ]
    },
    {
      title: 'Board Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'From architecture to manufacturing—complete hardware board design for single board, multi-board, mixed signal, FPGA-based, power-optimized, small form factor, and high-density board designs.',
      items: [
        'Feasibility analysis: technical & BoM cost feasibility',
        'Schematics & PCB layout development',
        'High-speed interfaces: PCIe Gen 5, 100G Ethernet, HDMI 2.0, SAS-3',
        'Wireless/RF interfaces: Wi-Fi, Bluetooth, Zigbee, LoRa, 3G, LTE',
        'Analog & mixed signal board design',
        'Multi-layer high-speed PCB (Rogers/Megtron 6, rigid-flex)',
        'Pre & post layout signal integrity, thermal & PI simulation',
        'Reliability analysis: FMEA, MTBF prediction',
        'Prototyping: PCB fabrication & assembly',
        'Board bring-up, EVT & DVT testing',
        'Sustenance: cost reduction, obsolescence management',
        'EMI/EMC & certifications: BIS, WPC, CE, FCC, RoHS, UL, ESD',
        'Production handover, pilot production & manufacturing support'
      ]
    },
    {
      title: 'Firmware Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Software for all kinds of electronic devices—from small-footprint, power-optimized firmware to safety-critical real-time applications across Embedded Linux, VxWorks, QNX, FreeRTOS, Android, and more.',
      items: [
        'Bootloader development & BIOS customization',
        'Device driver development & diagnostics',
        'Board Support Packages (BSP) across processor architectures',
        'OS porting & OS migration (PPC, ARM, x86)',
        'Protocol stack porting & integration',
        'Application software development, porting & integration',
        'Embedded cybersecurity & secure boot',
        'IoT edge/gateway software',
        'Feature enhancement & maintenance',
        'UX/UI design for embedded interfaces',
        'Mobile application development',
        'Production test automation & test software'
      ]
    },
    {
      title: 'FPGA Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Expertise in FPGA-based designs from low-density CPLDs to multi-million gate FPGAs/SoCs. End-to-end capability with devices from Xilinx, Intel, Lattice, and Actel for quick development cycles.',
      items: [
        'RTL & testbench design: VHDL / Verilog / SystemVerilog',
        'High-speed protocols: PCIe Gen 1–5, NVMe 1.3, Gen Z, CXL, 10GbE',
        'External interfaces: SPI, I2C, LPC, PCI, CAN, GPMC, ADC, DAC',
        'On-chip interfaces: APB, AHB, AXI3, AXI4, Avalon',
        'Memory interfaces: NAND, NOR, DDR3, DDR4, HMC, HBM',
        'Soft processor IPs: NIOS II, MicroBlaze',
        'Functional & timing simulation',
        'Platform migration & resource optimization (logic, I/O, speed)',
        'IP core development & glue logic design',
        '3rd party IP core integration',
        'ASIC prototyping in FPGA'
      ]
    },
    {
      title: 'FPGA/ASIC Verification & Validation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Expert verification engineers delivering projects across networking, storage, military, aerospace, industrial, test & measurement, and consumer electronics—achieving 100% code and functional coverage.',
      items: [
        'Testbench architecture & test plan creation',
        'Bus functional models, protocol drivers, sequencers & monitors',
        'Test case development & execution',
        'System / SoC / IP / subsystem / block-level verification',
        'Design & development: VHDL / Verilog / SystemVerilog / UVM / OVM',
        'Assertion-based verification',
        'Code coverage & functional coverage closure to 100%',
        'Perl / Shell / Python / Makefile script development'
      ]
    },
    {
      title: 'Mechanical Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'The right enclosure and mechanicals for your product—considering aesthetics, cost, cooling requirements, durability, ruggedness, and safety aspects. From rackmount to rugged NEMA enclosures.',
      items: [
        'Industrial design & conceptual drawings',
        'Rapid prototyping & 3D printing',
        'Sheet metal & plastic enclosure engineering',
        'Rackmount chassis & DIN rail system design',
        'Desktop, handheld & box-type enclosures',
        'NEMA & rugged enclosure design',
        'Thermal design & cooling solutions',
        'Drawing format conversion',
        'Packaging, carton & label design for production'
      ]
    },
    {
      title: 'Embedded System & Application Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Complete software services for embedded products—from architectural design, coding, and testing to maintenance. BSP, device drivers, test software, communication protocols, and embedded UI across all processor families.',
      items: [
        'BSP: PPC, ARM, x86 across Linux, VxWorks, Android, FreeRTOS',
        'Device drivers for peripherals & diagnostics',
        'Test & diagnostic software development',
        'Wired & wireless communication protocols',
        'Industrial protocol implementation',
        'Embedded UI design & development',
        'Application software porting & integration'
      ]
    },
    {
      title: 'System Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'High-performance system software for networking, telecom, and infrastructure products—dataplane software, control protocols, virtual appliances, and middleware development.',
      items: [
        'Dataplane software development',
        'Control protocol stacks for switching & routing',
        'Management agents & middleware',
        'Embedded application software',
        'Virtual appliance software & VNF development',
        'NFV infrastructure engineering',
        'MANO (Management & Orchestration) engineering'
      ]
    },
    {
      title: 'Application Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Enterprise-grade application software for embedded and network products—SDN controllers, network management systems, web portals, mobile applications, and UX/UI design.',
      items: [
        'SDN controller & SDN application development',
        'NFV infrastructure & MANO engineering',
        'Element management / network management systems',
        'Web applications & enterprise portals',
        'Mobile application development (iOS & Android)',
        'UX/UI design & user experience engineering'
      ]
    }
  ];

  // ============================================
  // TRUST PILLARS — Engineering Philosophy
  // ============================================
  const trustPillars = [
    {
      title: 'First-Time-Right Design',
      tag: 'Quality',
      description: 'Our proven design practices ensure superior product quality, extended availability, and high fault coverage. Simulation, signal integrity analysis, and thermal modeling happen before you commit to silicon or tooling—minimizing revision cycles.'
    },
    {
      title: 'One Roof, Full Stack',
      tag: 'End-to-End',
      description: 'System architecture, hardware design, firmware, FPGA, mechanical enclosures, prototyping, regulatory certifications, and pilot production—all delivered by one integrated team. No fragmented vendor chains.'
    },
    {
      title: 'Regulatory-Ready Engineering',
      tag: 'Certified',
      description: 'We design for compliance from day one—CE, FCC, BIS, WPC, RoHS, UL, ESD, and environmental testing. Certification is part of the engineering plan, with direct liaison to accredited test houses.'
    },
    {
      title: 'Cross-Domain Expertise',
      tag: 'Versatile',
      description: 'Deep experience across networking, storage, telecom, industrial automation, IoT, medical devices, wearables, consumer electronics, and power systems—from small form factor designs to complex multi-board systems.'
    }
  ];

  // ============================================
  // TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'Processors & SoCs', items: ['ARM Cortex-M/A/R', 'x86 (Intel/AMD)', 'PowerPC', 'ESP32', 'STM32', 'NXP i.MX', 'NVIDIA Jetson'] },
    { category: 'FPGA Vendors', items: ['Xilinx/AMD', 'Intel (Altera)', 'Lattice', 'Actel/Microchip', 'Cadence', 'Synopsys'] },
    { category: 'RTOS & Embedded OS', items: ['Embedded Linux', 'FreeRTOS', 'VxWorks', 'QNX', 'Zephyr', 'ThreadX', 'Android'] },
    { category: 'EDA & CAD Tools', items: ['Altium Designer', 'OrCAD/Allegro', 'KiCad', 'MATLAB/Simulink', 'SolidWorks', 'AutoCAD'] },
    { category: 'Protocols & Interfaces', items: ['PCIe Gen 3/4/5', '100G Ethernet', 'USB 3.x', 'HDMI 2.0', 'SPI/I2C/CAN', 'MQTT/OPC-UA'] },
    { category: 'IoT & Connectivity', items: ['Wi-Fi', 'BLE', 'Zigbee', 'LoRa', 'LTE/5G', 'Modbus', 'AWS IoT', 'Azure IoT Hub'] }
  ];

  // ============================================
  // WHY KANGQORE — 5 tiles
  // ============================================
  const whyKangqoreIntro = `Kangqore transforms ideas into complete, production-ready embedded products—combining hardware, firmware, FPGA, and mechanical engineering under one roof with proven first-time-right methodologies.`;

  const whyKangqore = [
    {
      title: 'Concept-to-Production Under One Roof',
      description: 'System architecture, hardware board design, firmware, FPGA, mechanical enclosures, prototyping, regulatory certifications, pilot production—all from a single, integrated engineering partner.'
    },
    {
      title: 'Multi-Domain Product Experience',
      description: 'Proven track record across networking equipment, storage solutions, industrial controllers, IoT gateways, medical devices, wearables, power electronics, and telecom infrastructure.'
    },
    {
      title: 'High-Speed & High-Complexity Design',
      description: 'Expertise in PCIe Gen 5, 100G Ethernet, DDR4/5, NVMe, and multi-million gate FPGA/SoC designs. We handle the hardest signal integrity and timing challenges.'
    },
    {
      title: 'Accelerated Time-to-Market',
      description: 'First-time-right methodology minimizes design revisions. From concept to working prototype in 6–8 weeks, with structured EVT/DVT phases and direct manufacturing liaison.'
    },
    {
      title: 'Manufacturing-Ready Deliverables',
      description: 'Every engagement produces production-ready outputs: Gerber files, BoM, firmware images, test jigs, mechanical drawings, certification documentation, and manufacturing support packages.'
    }
  ];

  // ============================================
  // INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Networking & Telecom' },
    { name: 'Industrial Automation' },
    { name: 'Healthcare & Medical Devices' },
    { name: 'IoT & Connected Devices' },
    { name: 'Consumer Electronics' },
    { name: 'Energy & Power Systems' }
  ];

  // ============================================
  // FAQs
  // ============================================
  const customFAQs = [
    {
      question: 'What types of embedded products do you design?',
      answer: 'We design a wide range of embedded products including single board computers, system-on-modules, IoT gateways, industrial control systems, networking equipment (routers, switches, modems), medical devices, wearable electronics, data acquisition boards, protocol analyzers, power electronics (AC-DC/DC-DC supplies, inverters, UPS, solar converters), and multi-board system designs.'
    },
    {
      question: 'Do you handle both hardware and software design?',
      answer: 'Yes. We provide complete hardware-software co-design under one roof. This includes schematic capture, PCB layout, signal integrity analysis, firmware development across all major RTOS platforms (Linux, VxWorks, FreeRTOS, QNX, Zephyr), FPGA/ASIC design and verification, mechanical enclosure engineering, and IoT/edge software—all integrated into a single delivery program.'
    },
    {
      question: 'What FPGA/ASIC capabilities do you offer?',
      answer: 'Our FPGA engineering covers RTL design (VHDL/Verilog/SystemVerilog), high-speed protocol implementation (PCIe Gen 1–5, NVMe, CXL, 100G Ethernet), IP core development, ASIC prototyping in FPGA, and full verification with UVM/OVM testbenches achieving 100% code and functional coverage. We work with Xilinx/AMD, Intel (Altera), Lattice, and Actel devices.'
    },
    {
      question: 'How do you handle regulatory certifications?',
      answer: 'Regulatory compliance is built into our engineering process from the architecture phase. We design for EMI/EMC pre-compliance, conduct FMEA and MTBF analysis, prepare certification documentation, and coordinate with accredited test houses for CE, FCC, BIS, WPC, UL, RoHS, ESD, and environmental testing. This avoids costly redesigns late in the cycle.'
    },
    {
      question: 'What is your engagement model for embedded projects?',
      answer: 'We offer three models: (1) Project-based delivery for defined-scope product design engagements, (2) Dedicated engineering pods for ongoing product development and sustenance, and (3) Design audit & consulting for architecture reviews, BoM cost optimization, and technology migration roadmaps. Most new engagements start with a feasibility study and prototyping phase.'
    },
    {
      question: 'Do you support legacy product modernization and sustenance?',
      answer: 'Yes. We help enterprises modernize legacy embedded platforms—including obsolescence management, cost reduction programs, feature enhancements, technology migration (e.g., monolithic to microservices, legacy RTOS to embedded Linux), and ongoing sustenance services for products already in production.'
    }
  ];

  // ============================================
  // METRICS STRIP
  // ============================================
  const metricsStripSection = (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {[
            { label: '6–8 Weeks', sub: 'Concept to prototype' },
            { label: '95%', sub: 'First-pass design success' },
            { label: 'PCIe Gen 5', sub: 'High-speed design capability' },
            { label: '100%', sub: 'Verification coverage target' },
            { label: 'Multi-Domain', sub: '6+ industry verticals' },
            { label: 'CE/FCC/UL', sub: 'Regulatory certification' }
          ].map((metric, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-lg lg:text-xl font-bold text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                {metric.label}
              </div>
              <div className="text-xs text-white/50 font-medium tracking-wide uppercase">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const preWhyKangqoreSections = (
    <>
      {metricsStripSection}
    </>
  );

  // ============================================
  // RELATED OFFERINGS
  // ============================================
  const relatedOfferings = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:w-2/3 mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
            Complementary services that extend your embedded engineering investment across the digital enterprise.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              name: 'Intelligent Automation',
              link: '/services/automation/intelligent-automation',
              icon: <Bot className="w-5 h-5" />,
              desc: 'Automate industrial workflows and IT/OT processes with RPA, AI, and process orchestration for operational efficiency.'
            },
            {
              name: 'Cloud Transformation',
              link: '/services/cloud/cloud-transformation',
              icon: <Globe className="w-5 h-5" />,
              desc: 'Migrate device data and IoT workloads to cloud-native architectures for scalable analytics and remote device management.'
            },
            {
              name: 'Data Engineering & Analytics',
              link: '/services/data-ai/data-engineering',
              icon: <Database className="w-5 h-5" />,
              desc: 'Build the data pipelines that transform raw sensor and device telemetry into actionable operational intelligence.'
            },
            {
              name: 'Cybersecurity & Compliance',
              link: '/services/cybersecurity',
              icon: <Shield className="w-5 h-5" />,
              desc: 'Secure embedded devices, OT networks, and IoT ecosystems with industrial-grade security frameworks and compliance.'
            },
            {
              name: 'Quality Engineering & Testing',
              link: '/services/engineering/quality-engineering',
              icon: <Target className="w-5 h-5" />,
              desc: 'Validate embedded systems with hardware-in-the-loop testing, compliance verification, and automated test frameworks.'
            },
            {
              name: 'DevOps & CI/CD',
              link: '/services/engineering/devops',
              icon: <GitBranch className="w-5 h-5" />,
              desc: 'Implement embedded CI/CD pipelines for firmware builds, automated testing, and over-the-air deployment at scale.'
            }
          ].map((offering, idx) => (
            <Link
              key={idx}
              to={offering.link}
              className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
            >
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                {offering.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // PRODUCT LIFECYCLE FLOW — Animated Section
  // ============================================
  const lifecyclePhases = [
    {
      phase: 'Concept',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <circle cx="24" cy="18" r="8" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M20 28h8v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" stroke="white" strokeWidth="1.5"/>
          <line x1="24" y1="10" x2="24" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="30" y1="12" x2="33" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="18" y1="12" x2="15" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      items: ['Technical feasibility', 'Budgeting / cost', 'Project plan', 'Architectural design']
    },
    {
      phase: 'Analysis',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
          <line x1="27" y1="27" x2="36" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 20h8M20 16v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      items: ['Requirements engineering', 'Risk assessment', 'Technology evaluation', 'BoM cost feasibility']
    },
    {
      phase: 'Design',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <rect x="8" y="8" width="32" height="24" rx="3" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M14 18l6 4-6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="24" y1="26" x2="34" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="8" y1="36" x2="40" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="24" cy="40" r="2" stroke="white" strokeWidth="1.5"/>
        </svg>
      ),
      items: ['Schematics, PCB layout design', 'FPGA design', 'Firmware', 'BSP, Protocol stacks', 'Application software', 'User interface', 'Enclosure design']
    },
    {
      phase: 'Prototype & Test',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <rect x="10" y="6" width="28" height="36" rx="3" stroke="white" strokeWidth="1.5" fill="none"/>
          <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="16" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="16" y1="26" x2="24" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M28 24l3 3 5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      items: ['Component procurement', 'PCB fabrication & assembly', 'Board bring-up & functional tests', 'System integration', 'Design verification', 'Design verification tests, system tests']
    },
    {
      phase: 'Certify',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <path d="M24 4l6 12h12l-10 8 4 14-12-8-12 8 4-14L6 16h12z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
          <path d="M20 22l3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      items: ['Pre-compliance tests for EMI/EMC, Safety', 'Regulatory certification - FCC, CE, UL, etc', 'Environmental tests']
    },
    {
      phase: 'Product',
      svg: (
        <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
          <rect x="16" y="30" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M24 6v20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M18 14l6-8 6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="20" y1="36" x2="28" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      items: ['Production Handover', 'Manufacturing tests & diagnostics', 'Post delivery support, Product sustenance']
    }
  ];

  const productLifecycleSection = (
    <div className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style>{`
          @keyframes lcFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-6px) rotate(0.5deg); }
            66% { transform: translateY(-3px) rotate(-0.5deg); }
          }
          @keyframes lcGlow {
            0%, 100% { box-shadow: 0 8px 25px rgba(0,133,255,0.25), 0 0 0 0 rgba(0,133,255,0); }
            50% { box-shadow: 0 18px 50px rgba(0,133,255,0.45), 0 0 80px rgba(0,210,255,0.1); }
          }
          @keyframes lcArrowFlow {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes lcCheckBounce {
            0% { transform: scale(0) rotate(-45deg); opacity: 0; }
            60% { transform: scale(1.2) rotate(5deg); }
            80% { transform: scale(0.95) rotate(-2deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes lcFadeIn {
            from { opacity: 0; transform: translateY(30px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes lcShimmer {
            0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
            30% { opacity: 0.6; }
            100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
          }
          @keyframes lcPulseRing {
            0% { transform: scale(0.85); opacity: 0.6; }
            100% { transform: scale(1.7); opacity: 0; }
          }
          @keyframes lcDotTrail {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.3); }
          }
          .lc-phase { animation: lcFadeIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
          .lc-phase:nth-child(1) { animation-delay: 0s; }
          .lc-phase:nth-child(2) { animation-delay: 0.12s; }
          .lc-phase:nth-child(3) { animation-delay: 0.24s; }
          .lc-phase:nth-child(4) { animation-delay: 0.36s; }
          .lc-phase:nth-child(5) { animation-delay: 0.48s; }
          .lc-phase:nth-child(6) { animation-delay: 0.60s; }
          .lc-card {
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            z-index: 1;
            padding: 1.5rem;
            margin: -1.5rem;
            border-radius: 2rem;
            height: calc(100% + 3rem);
          }
          .lc-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 2rem;
            background: linear-gradient(135deg, rgba(0,133,255,0.06) 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.5s ease;
          }
          .lc-card:hover::before { opacity: 1; }
          .lc-card:hover {
            background: rgba(255,255,255,0.85);
            box-shadow: 0 40px 100px -20px rgba(0,133,255,0.18), 0 0 0 1px rgba(0,133,255,0.08);
            z-index: 10;
            transform: translateY(-10px) scale(1.01);
          }
          .lc-tile {
            position: relative;
            overflow: hidden;
            animation: lcFloat 4.5s ease-in-out infinite, lcGlow 4s ease-in-out infinite;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .lc-shimmer {
            position: absolute;
            top: 0; left: 0; bottom: 0;
            width: 40%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
            animation: lcShimmer 3.5s ease-in-out infinite;
            pointer-events: none;
          }
          .lc-pulse-ring {
            position: absolute;
            inset: -8px;
            border-radius: 1.5rem;
            border: 2px solid rgba(0,133,255,0.3);
            animation: lcPulseRing 2.5s ease-out infinite;
            pointer-events: none;
          }
          .lc-card:hover .lc-tile {
            animation: none;
            transform: scale(1.12) translateY(-6px);
            box-shadow: 0 24px 50px rgba(0,133,255,0.35), 0 0 0 8px rgba(0,133,255,0.08);
          }
          .lc-check {
            animation: lcCheckBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          .lc-phase:nth-child(1) .lc-check { animation-delay: 0.4s; }
          .lc-phase:nth-child(2) .lc-check { animation-delay: 0.52s; }
          .lc-phase:nth-child(3) .lc-check { animation-delay: 0.64s; }
          .lc-phase:nth-child(4) .lc-check { animation-delay: 0.76s; }
          .lc-phase:nth-child(5) .lc-check { animation-delay: 0.88s; }
          .lc-phase:nth-child(6) .lc-check { animation-delay: 1.0s; }
          .lc-arrow-line {
            background: linear-gradient(90deg, transparent 0%, rgba(0,133,255,0.15) 15%, rgba(0,210,255,0.5) 50%, rgba(0,133,255,0.15) 85%, transparent 100%);
            background-size: 200% 100%;
            animation: lcArrowFlow 1.8s linear infinite;
          }
          .lc-dot { animation: lcDotTrail 1.8s ease-in-out infinite; }
          .lc-dot:nth-child(1) { animation-delay: 0s; }
          .lc-dot:nth-child(2) { animation-delay: 0.3s; }
          .lc-dot:nth-child(3) { animation-delay: 0.6s; }
        `}</style>

        {/* Desktop: Grid Flow with Animated Cards */}
        <div className="hidden lg:grid grid-cols-6 gap-6 relative px-6 mt-10">
          {lifecyclePhases.map((step, idx) => (
            <div key={idx} className="lc-phase flex flex-col relative group">
              <div className="lc-card flex flex-col items-center">
                
                {/* Visual Header */}
                <div className="relative mb-8 flex justify-center w-full">
                  <div className="relative z-10">
                    {/* Pulse ring behind the tile */}
                    <div className="lc-pulse-ring" style={{ animationDelay: `${idx * 0.4}s` }}></div>
                    <div
                      className="lc-tile w-[100px] h-[100px] rounded-2xl bg-gradient-to-br from-[#0085FF] via-[#00A3FF] to-[#00D2FF] flex items-center justify-center cursor-pointer"
                      style={{ animationDelay: `${idx * 0.7}s` }}
                    >
                      {/* Shimmer beam */}
                      <div className="lc-shimmer" style={{ animationDelay: `${idx * 0.6}s` }}></div>
                      {step.svg}
                    </div>
                    {/* Checkmark badge */}
                    <div className="lc-check absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 shadow-md border-2 border-blue-100 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke="url(#checkGradEds)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <linearGradient id="checkGradEds" x1="3" y1="7" x2="11" y2="4">
                            <stop stopColor="#0085FF"/>
                            <stop offset="1" stopColor="#00D2FF"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Arrow connector with animated dots */}
                  {idx < lifecyclePhases.length - 1 && (
                    <div className="absolute top-[50%] left-[calc(50%+52px)] w-[calc(100%-104px+1.5rem)] -translate-y-1/2 flex items-center gap-1" style={{ zIndex: 0 }}>
                      <div className="lc-arrow-line h-[2px] flex-1 rounded-full"></div>
                      {/* Animated dot trail overlay */}
                      <div className="absolute inset-0 flex items-center justify-around px-2">
                        <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                        <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                        <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 14 14" className="text-blue-500 shrink-0 relative z-10 drop-shadow-sm transition-all duration-500 group-hover:translate-x-1 group-hover:scale-125">
                        <path d="M2 2L12 7L2 12" fill="none" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <linearGradient id="arrowGrad" x1="2" y1="7" x2="12" y2="7">
                            <stop stopColor="#0085FF"/>
                            <stop offset="1" stopColor="#00D2FF"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="text-center w-full mb-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white italic font-display tracking-tight leading-tight group-hover:text-brand-blue transition-colors duration-300">{step.phase}</h4>
                </div>
                <div className="w-full flex-1 flex flex-col">
                  <ul className="space-y-3">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[12px] xl:text-[13px] text-gray-500 leading-snug text-left group-hover:text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        <span className="mt-[0.4rem] w-1.5 h-1.5 bg-brand-blue/40 rounded-full shrink-0 group-hover:bg-brand-blue group-hover:scale-125 transition-all duration-300"></span>
                        <span className="opacity-90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Mobile: 2-col grid with compact cards */}
        <div className="lg:hidden grid grid-cols-2 gap-6">
          {lifecyclePhases.map((step, idx) => (
            <div key={idx} className="lc-phase flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0085FF] via-[#00A3FF] to-[#00D2FF] flex items-center justify-center shadow-lg">
                  {step.svg}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-sm flex items-center justify-center border border-blue-100">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-6" stroke="#0085FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white italic mb-2">{step.phase}</h4>
              <ul className="space-y-1 text-left w-full">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                    <span className="mt-1 w-1 h-1 bg-brand-blue/30 rounded-full shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom context */}
        <div className="mt-20">
          <div className="flex items-start gap-6 max-w-4xl border-l-2 border-brand-blue/30 pl-6 py-2">
            <p className="text-lg text-gray-500 font-light leading-relaxed tracking-wide">
              Through skilled personnel, latest tools, sophisticated labs, and trusted ecosystem partners, we cater to cutting-edge technology and legacy platforms — <span className="text-gray-900 dark:text-white font-medium">from small form factor designs to multi-board system architectures.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // ASSEMBLE PAGE DATA
  // ============================================
  const pageData = {
    service: {
      ...service,
      preMatrixSection: productLifecycleSection,
      technologies,
      technologiesTitle: 'Tools & Technologies',
      technologiesDescription: 'Industry-standard tools across processors, FPGA, RTOS, EDA, high-speed interfaces, and IoT connectivity platforms.',
      capabilities,
      capabilitiesDescription: 'Kangqore delivers end-to-end embedded product engineering—from product design and high-speed board engineering to firmware, system software, FPGA/ASIC verification, and mechanical enclosure design. Every phase of the product lifecycle under one roof.',
      industryTitle: 'Industries We Engineer For.',
      trustPillars,
      trustPillarsRightTitle: 'Our Engineering Philosophy',
      trustPillarsRightDescription: 'Kangqore engineers embedded products with a first-time-right methodology—designing for quality, compliance, manufacturability, and scale from the very first schematic.',
      trustPillarsRightButton: 'Request Assessment',
      preWhyKangqoreSections,
      whyKangqoreIntro,
      whyKangqore,
      industries,
      customFAQs,
      postFAQSections: relatedOfferings
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default EmbeddedDesignSystems;
