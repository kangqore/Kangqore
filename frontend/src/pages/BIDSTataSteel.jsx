import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const handlePrint = () => window.print();

export default function BIDSTataSteel() {
  useEffect(() => { document.title = 'Kangqore BIDS™ — Tata Steel Diagnostic Proposal'; }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Inter', sans-serif; background: #f4f4f0; }

        .playbook { font-family: 'Inter', sans-serif; color: #0f0f0f; background: #f4f4f0; }

        .page {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          margin: 0 auto 24px;
          padding: 18mm 18mm 18mm 18mm;
          position: relative;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }

        .page-dark {
          background: #05080f;
          color: #ffffff;
        }

        .page-cover {
          background: #05080f;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 297mm;
          padding: 18mm;
        }

        .brand-gradient { background: linear-gradient(135deg, #2564ea, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .brand-gradient-bg { background: linear-gradient(135deg, #2564ea, #38bdf8); }

        .label { font-size: 8px; font-weight: 800; letter-spacing: 0.35em; text-transform: uppercase; color: #2564ea; margin-bottom: 10px; }
        .label-muted { color: #999; }
        .label-white { color: rgba(255,255,255,0.4); }

        .divider { height: 1px; background: #e8e8e4; margin: 24px 0; }
        .divider-dark { background: rgba(255,255,255,0.07); }
        .divider-accent { height: 2px; width: 40px; background: linear-gradient(135deg, #2564ea, #38bdf8); margin-bottom: 16px; }

        .stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .stat-num { font-size: 36px; font-weight: 900; color: #0f0f0f; line-height: 1; margin-bottom: 4px; }
        .stat-lbl { font-size: 8px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }

        .pillar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .pillar-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0ec; }
        .pillar-n { font-size: 9px; font-weight: 800; color: #ccc; width: 20px; flex-shrink: 0; margin-top: 2px; }
        .pillar-name { font-size: 11px; font-weight: 600; color: #0f0f0f; line-height: 1.3; }
        .pillar-tag { font-size: 9px; color: #999; font-weight: 400; display: block; margin-top: 2px; }

        .score-bar-wrap { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .score-label { font-size: 10px; font-weight: 600; color: #333; width: 140px; flex-shrink: 0; }
        .score-track { flex: 1; height: 4px; background: #f0f0ec; border-radius: 2px; overflow: hidden; }
        .score-fill { height: 100%; border-radius: 2px; }
        .score-val { font-size: 10px; font-weight: 800; width: 24px; text-align: right; flex-shrink: 0; }
        .score-status { font-size: 8px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; width: 52px; flex-shrink: 0; text-align: right; }

        .step-row { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f0f0ec; }
        .step-n { font-size: 9px; font-weight: 800; color: #2564ea; width: 24px; flex-shrink: 0; margin-top: 2px; }
        .step-title { font-size: 12px; font-weight: 700; color: #0f0f0f; margin-bottom: 3px; }
        .step-desc { font-size: 10px; color: #666; line-height: 1.6; }

        .deliverable-row { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f0f0ec; }
        .del-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #2564ea, #38bdf8); flex-shrink: 0; margin-top: 4px; }
        .del-title { font-size: 12px; font-weight: 700; color: #0f0f0f; margin-bottom: 2px; }
        .del-desc { font-size: 10px; color: #666; line-height: 1.5; }

        .finding-card { border: 1px solid #e8e8e4; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
        .finding-industry { font-size: 11px; font-weight: 800; color: #0f0f0f; margin-bottom: 8px; }
        .finding-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 5px; }
        .finding-dot { width: 4px; height: 4px; border-radius: 50%; background: #2564ea; flex-shrink: 0; margin-top: 5px; }
        .finding-text { font-size: 10px; color: #555; line-height: 1.5; }

        .tier-card { border: 1px solid #e8e8e4; border-radius: 10px; padding: 18px; }
        .tier-card-featured { border-color: #2564ea; background: #f0f5ff; }

        .trust-item { border: 1px solid #e8e8e4; border-radius: 8px; padding: 14px; margin-bottom: 10px; }

        .no-print-download {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
        }

        .playbook-wrap { padding-top: 56px; }

        .btn-download {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 50px;
          background: linear-gradient(135deg, #2564ea, #38bdf8);
          color: white; font-size: 13px; font-weight: 700;
          cursor: pointer; border: none; box-shadow: 0 4px 20px rgba(37,100,234,0.4);
          font-family: 'Inter', sans-serif;
        }

        .compliance-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .compliance-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; border: 1px solid #e0e0dc; border-radius: 20px; color: #888; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

        .engine-card { border: 1px solid #e8e8e4; border-radius: 10px; padding: 14px; }
        .engine-name { font-size: 11px; font-weight: 800; color: #0f0f0f; margin-bottom: 4px; }
        .engine-desc { font-size: 9px; color: #777; line-height: 1.6; }

        .highlight-box { background: #f0f5ff; border: 1px solid #c7d9ff; border-radius: 10px; padding: 18px; margin: 20px 0; }
        .highlight-box p { font-size: 13px; font-weight: 600; color: #1a3a8f; line-height: 1.6; }

        .vs-row { display: flex; gap: 0; }
        .vs-col { flex: 1; padding: 14px; }
        .vs-col-left { background: #fafaf8; border: 1px solid #e8e8e4; border-right: none; border-radius: 10px 0 0 10px; }
        .vs-col-right { background: #f0f5ff; border: 1px solid #c7d9ff; border-radius: 0 10px 10px 0; }
        .vs-head { font-size: 9px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 12px; }
        .vs-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; }
        .vs-dot-grey { width: 5px; height: 5px; border-radius: 50%; background: #ccc; flex-shrink: 0; margin-top: 4px; }
        .vs-dot-blue { width: 5px; height: 5px; border-radius: 50%; background: #2564ea; flex-shrink: 0; margin-top: 4px; }
        .vs-text { font-size: 10px; color: #555; line-height: 1.5; }

        .page-num { position: absolute; bottom: 12mm; right: 18mm; font-size: 9px; font-weight: 600; color: #ccc; letter-spacing: 0.1em; }
        .page-footer { position: absolute; bottom: 12mm; left: 18mm; right: 18mm; display: flex; justify-content: space-between; align-items: center; }
        .footer-brand { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #ccc; }
        .footer-conf { font-size: 8px; font-weight: 600; color: #ddd; letter-spacing: 0.1em; text-transform: uppercase; }

        @media print {
          .no-print-download { display: none !important; }
          .playbook-wrap { padding-top: 0 !important; }
          body { background: white; }
          .page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
            break-after: page;
          }
          .page:last-child { page-break-after: avoid; break-after: avoid; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      {/* Screen-only top bar */}
      <div className="no-print-download" style={{ top: 0, bottom: 'auto', left: 0, right: 0, background: '#05080f', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/bids" style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>
          ← Back to BIDS™
        </Link>
        <button className="btn-download" onClick={handlePrint} style={{ position: 'static', bottom: 'auto', right: 'auto' }}>
          ↓ Download PDF
        </button>
      </div>

      <div className="playbook playbook-wrap">

        {/* ── COVER PAGE ── */}
        <div className="page page-cover">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '60px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2564ea, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '900' }}>K</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'white', letterSpacing: '0.1em' }}>KANGQORE</span>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(56,189,248,0.8)', marginBottom: '16px' }}>ENTERPRISE DIAGNOSTIC PROPOSAL</p>
              <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-0.03em', color: 'white', marginBottom: '20px' }}>
                Kangqore<br />
                <span style={{ background: 'linear-gradient(135deg, #2564ea, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>BIDS™</span>
              </h1>
              <p style={{ fontSize: '16px', fontWeight: '300', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Business Diagnostic Intelligence System</p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px', marginBottom: '32px' }}>
              <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' }}>PREPARED FOR</p>
              <p style={{ fontSize: '28px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Tata Steel</p>
              <p style={{ fontSize: '12px', fontWeight: '400', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Manufacturing Edition · Strategic Transformation Diagnostic</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '24px', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[['16','Diagnostic Pillars'],['6','Intelligence Engines'],['10','Deliverables'],['10','Industry Editions'],['61','Services']].map(([v,l]) => (
                <div key={l}>
                  <p style={{ fontSize: '28px', fontWeight: '900', color: 'white', lineHeight: '1' }}>{v}</p>
                  <p style={{ fontSize: '8px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>Confidential · For Discussion Purposes Only</p>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', marginTop: '4px' }}>Kangqore · kangqore.com · June 2026</p>
            </div>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', fontWeight: '600' }}>01</p>
          </div>
        </div>

        {/* ── PAGE 2: EXECUTIVE CONTEXT ── */}
        <div className="page">
          <div className="label">The Context</div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.15', letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '8px' }}>
            Tata Steel is at a defining<br />
            <span style={{ background: 'linear-gradient(135deg, #2564ea, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transformation inflection point.</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', marginBottom: '28px', maxWidth: '480px', fontWeight: '400' }}>
            The transition to green steel, the shift from blast furnace to electric arc, the digitalization of operations, and the pressure to modernize legacy infrastructure — all happening simultaneously, at scale, across multiple geographies.
          </p>

          <div className="divider" />

          <div className="two-col" style={{ marginBottom: '24px' }}>
            <div>
              <p className="label label-muted" style={{ marginBottom: '12px' }}>Strategic Pressures</p>
              {[
                'Carbon neutrality commitments requiring full operational transformation',
                'Technology modernization across decades of manufacturing infrastructure',
                'AI and automation adoption to maintain global competitiveness',
                'Multi-site operational visibility and performance standardization',
                'Workforce capability transformation as processes evolve',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2564ea', flexShrink: 0, marginTop: '5px' }} />
                  <p style={{ fontSize: '10px', color: '#555', lineHeight: '1.6' }}>{item}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="label label-muted" style={{ marginBottom: '12px' }}>Investment Risks Without Diagnosis</p>
              {[
                'Transformation programs addressing symptoms rather than root causes',
                'Technology investments misaligned to actual operational constraints',
                'AI and automation projects without the data maturity to support them',
                'Security gaps across OT/IT boundaries in an increasingly connected plant',
                'Capital deployed before constraints are fully understood',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fb7185', flexShrink: 0, marginTop: '5px' }} />
                  <p style={{ fontSize: '10px', color: '#555', lineHeight: '1.6' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="highlight-box">
            <p>"The cost of misdiagnosis in a program of this scale is not measured in project budgets — it is measured in years of competitive position and billions in capital directed at the wrong priorities."</p>
          </div>

          <div className="divider" />

          <p style={{ fontSize: '11px', color: '#888', lineHeight: '1.7' }}>
            This proposal outlines how Kangqore BIDS™ — the Business Diagnostic Intelligence System — provides the structured diagnostic intelligence Tata Steel needs before committing to the next phase of transformation investment.
          </p>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>02</span>
          </div>
        </div>

        {/* ── PAGE 3: THE PROBLEM ── */}
        <div className="page">
          <div className="label">The Problem</div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.15', letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '20px' }}>
            Most transformation programs fail<br />because the enterprise was <span style={{ background: 'linear-gradient(135deg, #2564ea, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>never fully diagnosed.</span>
          </h2>

          <div className="three-col" style={{ marginBottom: '24px' }}>
            {[
              { title: 'The Problem', color: '#fb7185', body: 'Organizations rarely fail because they lack investment. Critical constraints — operational, technological, and strategic — remain hidden beneath the surface. Without a comprehensive diagnosis, investments address symptoms rather than causes.' },
              { title: 'The Economic Reality', color: '#fb923c', body: 'Without diagnostic intelligence, operational inefficiencies compound, technology debt accumulates, security exposure increases, and growth opportunities remain undiscovered — while transformation budgets produce diminishing returns.' },
              { title: 'The Real Cost', color: '#f472b6', body: 'Every constraint that goes undiagnosed has a compounding business cost. The question is not whether these costs exist — it is whether your organization has measured them before committing the next £ of transformation capital.' },
            ].map((c) => (
              <div key={c.title} style={{ borderTop: `2px solid ${c.color}`, paddingTop: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: c.color, marginBottom: '8px' }}>{c.title}</p>
                <p style={{ fontSize: '10px', color: '#555', lineHeight: '1.7' }}>{c.body}</p>
              </div>
            ))}
          </div>

          <div className="divider" />

          <p className="label label-muted" style={{ marginBottom: '12px' }}>Hidden Constraints Found in Manufacturing Enterprises</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {[
              { constraint: 'Fragmented production data across disconnected systems', impact: 'Elevated operational costs · Poor decision velocity' },
              { constraint: 'Manual quality control workflows at scale', impact: 'Consistency risks · Compliance exposure' },
              { constraint: 'Technology debt in legacy manufacturing platforms', impact: 'Slower modernization · Integration cost' },
              { constraint: 'Weak AI readiness across data and infrastructure', impact: 'Lost automation gains · Competitive lag' },
              { constraint: 'OT/IT security boundary gaps', impact: 'Elevated breach exposure · Regulatory risk' },
              { constraint: 'Limited operational visibility at supervisory level', impact: 'Reactive management · Inefficiency compounding' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', gridColumn: 'span 2', padding: '8px 0', borderBottom: '1px solid #f0f0ec' }}>
                <p style={{ fontSize: '10px', fontWeight: '600', color: '#0f0f0f' }}>{row.constraint}</p>
                <p style={{ fontSize: '10px', color: '#888' }}>{row.impact}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f8f8f5', borderRadius: '8px', borderLeft: '3px solid #2564ea' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#0f0f0f' }}>
              "The enterprises that diagnose before they invest don't just reduce risk. They outgrow everyone who didn't."
            </p>
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>03</span>
          </div>
        </div>

        {/* ── PAGE 4: WHAT IS BIDS™ ── */}
        <div className="page">
          <div className="label">The Solution</div>
          <h2 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.15', letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '8px' }}>
            The complete enterprise diagnostic<br /><span style={{ background: 'linear-gradient(135deg, #2564ea, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>intelligence</span> framework.
          </h2>
          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', marginBottom: '24px', maxWidth: '500px' }}>
            Kangqore BIDS™ evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem — diagnosing the full enterprise before any transformation investment is made.
          </p>

          <div className="divider" />

          <div className="stat-grid" style={{ marginBottom: '24px' }}>
            {[['16','Diagnostic Pillars'],['6','Intelligence Engines'],['10','Deliverables'],['10','Industry Editions'],['61','Specialized Services']].map(([v,l]) => (
              <div key={l} style={{ borderTop: '2px solid #f0f0ec', paddingTop: '12px' }}>
                <p className="stat-num">{v}</p>
                <p className="stat-lbl">{l}</p>
              </div>
            ))}
          </div>

          <div className="divider" />

          <p className="label label-muted" style={{ marginBottom: '14px' }}>What makes it structurally different</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { n: '01', title: 'Not a survey or checklist', desc: 'Every engagement combines qualitative, quantitative, operational, and technical intelligence across 16 pillars.' },
              { n: '02', title: 'No platform to sell you', desc: 'Kangqore owns no reseller relationships with AWS, Salesforce, SAP, or any third-party platform. The diagnostic is designed to surface what is true.' },
              { n: '03', title: 'The diagnostic is the product', desc: 'BIDS™ is a priced, scoped, standalone intelligence engagement — not a pre-sales motion for a larger contract.' },
              { n: '04', title: 'Diagnosis to execution without translation loss', desc: 'The team that diagnoses holds execution capability across every pillar. No re-scoping. No second firm.' },
            ].map((item) => (
              <div key={item.n} style={{ border: '1px solid #e8e8e4', borderRadius: '8px', padding: '14px' }}>
                <p style={{ fontSize: '9px', fontWeight: '800', color: '#2564ea', marginBottom: '4px', letterSpacing: '0.2em' }}>{item.n}</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f0f0f', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '9px', color: '#777', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', borderTop: '1px solid #f0f0ec', paddingTop: '12px' }}>
            Built upon: NIST CSF 2.0 · NIST AI RMF · ISO/IEC 27001 · ISO/IEC 42001 · AWS Cloud Adoption Framework · CIS Critical Controls · DORA Metrics · TOGAF · Enterprise Risk Management
          </p>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>04</span>
          </div>
        </div>

        {/* ── PAGE 5: 16 PILLARS MAPPED TO TATA STEEL ── */}
        <div className="page">
          <div className="label">Manufacturing Edition</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '6px' }}>16 Diagnostic Intelligence Pillars</h2>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '18px' }}>How each pillar applies in the context of a global manufacturing enterprise.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {[
              { n: '01', name: 'Business Strategy Intelligence',      tag: 'Strategy Maturity · Growth Readiness',        note: 'Alignment of green steel strategy, decarbonisation roadmap, and capital allocation to market position.' },
              { n: '02', name: 'Leadership Intelligence',             tag: 'Leadership Effectiveness Score',              note: 'Executive decision velocity, cross-regional governance, and transformation sponsorship.' },
              { n: '03', name: 'Financial Intelligence',              tag: 'Financial Health Score',                      note: 'Capital efficiency, investment allocation, and financial resilience across transformation spend.' },
              { n: '04', name: 'Operational Intelligence',            tag: 'Operational Efficiency Score',                note: 'Production workflows, process maturity, operational bottlenecks, and multi-site standardization.' },
              { n: '05', name: 'Workforce Intelligence',              tag: 'Workforce Readiness Score',                   note: 'Skills readiness for EAF transition, automation capability, and change management maturity.' },
              { n: '06', name: 'Customer Intelligence',               tag: 'Customer Experience Score',                   note: 'Commercial relationship quality, contract fulfilment performance, and customer intelligence maturity.' },
              { n: '07', name: 'Sales Intelligence',                  tag: 'Revenue Engine Score',                        note: 'Revenue pipeline performance, pricing intelligence, and commercial execution capability.' },
              { n: '08', name: 'Growth Intelligence',                 tag: 'Digital Growth Score',                        note: 'Market expansion readiness, digital channel performance, and new market entry capability.' },
              { n: '09', name: 'Technology Intelligence',             tag: 'Technology Maturity Score',                   note: 'Manufacturing technology stack health, legacy system exposure, and modernization roadmap clarity.' },
              { n: '10', name: 'Cloud & Infrastructure Intelligence', tag: 'Infrastructure Readiness Score',               note: 'Cloud adoption maturity, OT/IT convergence readiness, and infrastructure scalability for smart manufacturing.' },
              { n: '11', name: 'Data Intelligence',                   tag: 'Data Maturity Score',                         note: 'Production data quality, analytics infrastructure, and intelligence capability across plant operations.' },
              { n: '12', name: 'AI Intelligence',                     tag: 'AI Readiness Score',                          note: 'Predictive maintenance, quality AI, demand forecasting, and AI governance readiness.' },
              { n: '13', name: 'Automation Intelligence',             tag: 'Automation Maturity Score',                   note: 'Process automation coverage, robotics integration, and workflow orchestration across manufacturing.' },
              { n: '14', name: 'Cybersecurity Intelligence',          tag: 'Cyber Resilience Score',                      note: 'OT security posture, IT/OT boundary controls, regulatory compliance, and incident response capability.' },
              { n: '15', name: 'Governance & Risk Intelligence',      tag: 'Governance Maturity Score',                   note: 'ESG governance, operational risk management, compliance posture, and regulatory readiness.' },
              { n: '16', name: 'Transformation Intelligence',         tag: 'Transformation Readiness Score',              note: 'Change management maturity, transformation execution velocity, and program delivery capability.' },
            ].map((p) => (
              <div key={p.n} style={{ padding: '10px 12px 10px 0', borderBottom: '1px solid #f0f0ec', display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#ccc', flexShrink: 0, marginTop: '2px', width: '18px' }}>{p.n}</span>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: '700', color: '#0f0f0f', marginBottom: '2px' }}>{p.name}</p>
                  <p style={{ fontSize: '8px', color: '#2564ea', fontWeight: '600', marginBottom: '2px' }}>{p.tag}</p>
                  <p style={{ fontSize: '9px', color: '#888', lineHeight: '1.5' }}>{p.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>05</span>
          </div>
        </div>

        {/* ── PAGE 6: 6 ENGINES ── */}
        <div className="page">
          <div className="label">Under the Hood</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '6px' }}>6 Intelligence Engines</h2>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>Every engagement is powered by six integrated intelligence engines that synthesise pillar findings into actionable business intelligence.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { color: '#22d3ee', name: 'Cognition Intelligence Engine',   dept: 'Cognition', desc: 'Diagnoses AI readiness, GenAI adoption potential, data maturity for intelligence workloads, and automation opportunity. For Tata Steel: evaluates predictive maintenance readiness, production quality AI, and data infrastructure for smart manufacturing.' },
              { color: '#60a5fa', name: 'Foundry Intelligence Engine',     dept: 'Foundry',   desc: 'Evaluates infrastructure health, cloud migration readiness, engineering platform maturity, and technology resilience. For Tata Steel: OT/IT convergence, legacy system health, and infrastructure readiness for connected plant operations.' },
              { color: '#a78bfa', name: 'Reimagine Intelligence Engine',   dept: 'Reimagine', desc: 'Identifies modernization priorities, legacy system exposure, and digital transformation readiness. For Tata Steel: blast furnace to EAF transition technology mapping, process modernization, and change execution capability.' },
              { color: '#fb7185', name: 'Shield Intelligence Engine',      dept: 'Shield',    desc: 'Assesses cybersecurity posture, compliance gap exposure, and AI governance coverage. For Tata Steel: OT security across plant environments, regulatory compliance posture, and operational trust maturity.' },
              { color: '#fbbf24', name: 'Platforms Intelligence Engine',   dept: 'Platforms', desc: 'Diagnoses enterprise platform utilization, integration complexity, and process maturity. For Tata Steel: SAP and manufacturing platform health, integration sprawl, and consolidation opportunities.' },
              { color: '#34d399', name: 'Growth Intelligence Engine',      dept: 'Growth',    desc: 'Maps revenue engine performance, marketing execution gaps, and digital visibility. For Tata Steel: commercial capability, pricing intelligence, and customer relationship maturity.' },
            ].map((e) => (
              <div key={e.name} style={{ border: '1px solid #e8e8e4', borderRadius: '10px', padding: '14px', borderTop: `3px solid ${e.color}` }}>
                <p style={{ fontSize: '10px', fontWeight: '800', color: '#0f0f0f', marginBottom: '6px' }}>{e.dept} Engine</p>
                <p style={{ fontSize: '9px', color: '#666', lineHeight: '1.6' }}>{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="divider" />

          <p className="label label-muted" style={{ marginBottom: '12px' }}>8-Layer Diagnostic Architecture</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { n: '01', layer: 'Executive Intelligence',       color: '#22d3ee' },
              { n: '02', layer: 'Operational Intelligence',     color: '#fb923c' },
              { n: '03', layer: 'Technology Intelligence',      color: '#60a5fa' },
              { n: '04', layer: 'Data & AI Intelligence',       color: '#86efac' },
              { n: '05', layer: 'Security & Risk Intelligence', color: '#f472b6' },
              { n: '06', layer: 'Growth Intelligence',          color: '#fde047' },
              { n: '07', layer: 'Benchmark Intelligence',       color: '#a78bfa' },
              { n: '08', layer: 'Prescription Intelligence',    color: '#e8614a' },
            ].map((l) => (
              <div key={l.n} style={{ padding: '10px', border: '1px solid #e8e8e4', borderRadius: '8px' }}>
                <div style={{ width: '20px', height: '2px', background: l.color, marginBottom: '6px' }} />
                <p style={{ fontSize: '9px', fontWeight: '700', color: '#0f0f0f' }}>{l.layer}</p>
              </div>
            ))}
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>06</span>
          </div>
        </div>

        {/* ── PAGE 7: THE 10-STEP PROCESS ── */}
        <div className="page">
          <div className="label">The Process</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '6px' }}>The Diagnostic Engagement Process</h2>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '18px' }}>A structured, ten-step process from initial request through executive delivery — designed to match the pace of how executive teams make decisions.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {[
              { n: '01', name: 'Request Submitted',                color: '#22d3ee', desc: 'Submit your diagnostic request along with key business, technology, operational, or transformation objectives.' },
              { n: '02', name: 'Initial Review',                   color: '#fb923c', desc: 'The Kangqore team performs a preliminary review of your requirements and organizational context. Response within 24–48 business hours.', sla: 'Response within 24–48 business hours' },
              { n: '03', name: 'Executive Scoping Session',        color: '#60a5fa', desc: 'A 30–60 minute executive discovery session focused on business objectives, strategic priorities, current challenges, and transformation goals.' },
              { n: '04', name: 'Root Cause Identification',        color: '#f472b6', desc: 'The initial diagnostic phase identifies potential areas of concern, hidden constraints, operational bottlenecks, technology gaps, and risk exposure.' },
              { n: '05', name: 'Diagnostic Proposal & Scope',      color: '#fde047', desc: 'Receive a tailored engagement proposal outlining assessment scope, stakeholder involvement, diagnostic pillars, timeline, deliverables, and engagement structure.' },
              { n: '06', name: 'Enterprise Evaluation',            color: '#86efac', desc: 'Evaluated across the diagnostic framework using leadership interviews, documentation reviews, technology assessments, operational analysis, data and AI evaluations, and security reviews.' },
              { n: '07', name: 'Intelligence Scoring & Findings',  color: '#a78bfa', desc: 'The assessment is processed through the Intelligence Engines to generate the Business Health Score, Constraint Analysis, Risk Register, Opportunity Register, and Transformation Priorities.' },
              { n: '08', name: 'Executive Findings Presentation',  color: '#e8614a', desc: 'Leadership teams receive a detailed presentation of findings, root causes, risks, opportunities, and strategic recommendations.' },
              { n: '09', name: 'Transformation Blueprint',         color: '#22d3ee', desc: 'Receive a prioritized 30/60/90/180-day roadmap designed to improve performance, resilience, growth, operational efficiency, technology maturity, and AI readiness.' },
              { n: '10', name: 'Transformation Engagement',        color: '#60a5fa', desc: 'The diagnostic prescription maps directly to Kangqore\'s transformation ecosystem. Execution begins where diagnosis ends — no re-scoping, no second firm, no gap.' },
            ].map((step) => (
              <div key={step.n} style={{ padding: '10px 16px 10px 0', borderBottom: '1px solid #f0f0ec', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: step.color, flexShrink: 0, marginTop: '2px', width: '20px' }}>{step.n}</span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f0f0f', marginBottom: '3px' }}>{step.name}</p>
                  <p style={{ fontSize: '9px', color: '#777', lineHeight: '1.6' }}>{step.desc}</p>
                  {step.sla && <p style={{ fontSize: '8px', color: '#2564ea', fontWeight: '700', marginTop: '3px' }}>{step.sla}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>07</span>
          </div>
        </div>

        {/* ── PAGE 8: DELIVERABLES ── */}
        <div className="page">
          <div className="label">What You Receive</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '18px' }}>Every Engagement Delivers</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '24px' }}>
            {[
              { n: '01', name: 'Diagnostic Scorecard',         desc: 'Enterprise-wide scoring across all sixteen intelligence pillars — benchmarked, classified, and ranked by business impact.' },
              { n: '02', name: 'Executive Intelligence Report', desc: 'Comprehensive executive-level findings, root cause analysis, and strategic recommendations for the leadership team.' },
              { n: '03', name: 'Transformation Blueprint',     desc: 'Prioritized transformation strategy and phased execution roadmap aligned to identified constraints and opportunities.' },
              { n: '04', name: 'Risk Register',                desc: 'Identified and scored organizational, technology, operational, and cybersecurity risks — quantified by business exposure.' },
              { n: '05', name: 'Opportunity Register',         desc: 'High-value growth, efficiency, AI, automation, and modernization opportunities mapped with estimated business impact.' },
              { n: '06', name: 'Service Prescription Matrix',  desc: 'Recommended capability areas aligned to identified constraints — execution-ready from day one, no re-scoping required.' },
              { n: '07', name: '30/60/90/180-Day Roadmap',     desc: 'A phased transformation execution plan giving the executive team a sequenced action plan from day one.' },
              { n: '08', name: 'Executive Board Presentation', desc: 'Boardroom-ready strategic findings presentation structured for board-level review and governance decision-making.' },
              { n: '09', name: 'Executive Workshop',           desc: 'Leadership alignment and transformation planning session to ensure executive team ownership of diagnostic findings.' },
              { n: '10', name: 'ROI Projection Report',        desc: 'Estimated value creation, efficiency gains, risk reduction, and growth potential — quantified against investment requirements.' },
            ].map((d) => (
              <div key={d.n} style={{ padding: '10px 16px 10px 0', borderBottom: '1px solid #f0f0ec', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#2564ea', flexShrink: 0, marginTop: '2px', width: '20px' }}>{d.n}</span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f0f0f', marginBottom: '3px' }}>{d.name}</p>
                  <p style={{ fontSize: '9px', color: '#777', lineHeight: '1.6' }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8f8f5', border: '1px solid #e8e8e4', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#0f0f0f', marginBottom: '6px' }}>All deliverables are provided as a complete intelligence product.</p>
            <p style={{ fontSize: '10px', color: '#666', lineHeight: '1.6' }}>
              The Service Prescription Matrix maps every identified constraint to a Kangqore capability area, so the path from diagnosis to execution is immediate — no re-scoping, no second engagement, no translation loss.
            </p>
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>08</span>
          </div>
        </div>

        {/* ── PAGE 9: REPRESENTATIVE MANUFACTURING SCORECARD ── */}
        <div className="page">
          <div className="label">Representative Output</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '6px' }}>This is what you receive.</h2>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '16px' }}>Representative manufacturing enterprise scorecard — illustrative, not attributable to a specific organization.</p>

          {/* Scorecard header */}
          <div style={{ border: '1px solid #e8e8e4', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ padding: '14px 18px', background: '#fafaf8', borderBottom: '1px solid #f0f0ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Representative Diagnostic Scorecard</p>
                <p style={{ fontSize: '13px', fontWeight: '800', color: '#0f0f0f' }}>Manufacturing Enterprise <span style={{ color: '#aaa', fontWeight: '400', fontSize: '11px' }}>· Manufacturing Edition · Illustrative</span></p>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                {[['Industry Avg','56','#aaa'],['Sector Leader','82','#34d399'],['Health Score','59/100','#2564ea'],['Classification','Moderate','#fbbf24']].map(([l,v,c]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '8px', color: '#aaa', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>{l}</p>
                    <p style={{ fontSize: '16px', fontWeight: '900', color: c }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: '8px', fontWeight: '800', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ccc', marginBottom: '10px' }}>16 Diagnostic Intelligence Pillars</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 32px' }}>
                {[
                  { name: 'Business Strategy',       score: 72, c: '#34d399', s: 'Good',     sc: '#34d399' },
                  { name: 'Leadership',               score: 65, c: '#38bdf8', s: 'Good',     sc: '#38bdf8' },
                  { name: 'Financial Health',         score: 74, c: '#38bdf8', s: 'Good',     sc: '#38bdf8' },
                  { name: 'Operational Efficiency',   score: 32, c: '#fb7185', s: 'Critical', sc: '#fb7185' },
                  { name: 'Workforce',                score: 54, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Customer',                 score: 68, c: '#38bdf8', s: 'Good',     sc: '#38bdf8' },
                  { name: 'Sales',                    score: 60, c: '#38bdf8', s: 'Good',     sc: '#38bdf8' },
                  { name: 'Growth',                   score: 55, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Technology Maturity',      score: 49, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Cloud & Infrastructure',   score: 44, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Data Intelligence',        score: 51, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'AI Readiness',             score: 29, c: '#fb7185', s: 'Critical', sc: '#fb7185' },
                  { name: 'Automation',               score: 41, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Cybersecurity',            score: 55, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                  { name: 'Governance & Risk',        score: 70, c: '#38bdf8', s: 'Good',     sc: '#38bdf8' },
                  { name: 'Transformation',           score: 46, c: '#fbbf24', s: 'Moderate', sc: '#fbbf24' },
                ].map((p) => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0' }}>
                    <span style={{ fontSize: '9px', fontWeight: '500', color: '#555', width: '130px', flexShrink: 0 }}>{p.name}</span>
                    <div style={{ flex: 1, height: '3px', background: '#f0f0ec', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '2px', background: p.c, width: `${p.score}%` }} />
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#333', width: '22px', textAlign: 'right', flexShrink: 0 }}>{p.score}</span>
                    <span style={{ fontSize: '7px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: p.sc, width: '48px', flexShrink: 0, textAlign: 'right' }}>{p.s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 18px', borderTop: '1px solid #f0f0ec', background: '#fafaf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[['#fb7185','2 Critical'],['#fbbf24','8 Moderate'],['#38bdf8','5 Good'],['#34d399','1 Strong']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: '9px', color: '#888', fontWeight: '600' }}>{l}</span>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '8px', color: '#ccc', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Representative · Illustrative Only</span>
            </div>
          </div>

          {/* Top 3 Priorities */}
          <div style={{ border: '1px solid #e8e8e4', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 18px', borderBottom: '1px solid #f0f0ec' }}>
              <p style={{ fontSize: '8px', fontWeight: '800', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa' }}>Immediate Priorities — Top 3 Critical Findings</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
              {[
                { rank: '01', pillar: 'Operational Efficiency', score: 32, status: 'Critical', sc: '#fb7185', impact: 'Elevated operating costs across fragmented production processes', action: 'Business Process Reengineering & Manufacturing Intelligence' },
                { rank: '02', pillar: 'AI Readiness',            score: 29, status: 'Critical', sc: '#fb7185', impact: 'Significant competitive exposure as manufacturing peers accelerate AI adoption', action: 'AI & Cognitive Computing Strategy — Manufacturing Edition' },
                { rank: '03', pillar: 'Technology Maturity',     score: 49, status: 'Moderate', sc: '#fbbf24', impact: 'Legacy system debt constraining modernization velocity and integration capability', action: 'Application Modernization & Platform Engineering' },
              ].map((f, i) => (
                <div key={f.rank} style={{ padding: '14px 16px', borderLeft: i > 0 ? '1px solid #f0f0ec' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#ccc' }}>{f.rank}</span>
                    <span style={{ fontSize: '7px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '20px', color: f.sc, background: f.sc + '18' }}>{f.status}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: '#0f0f0f', marginBottom: '2px' }}>{f.pillar}</p>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#ddd', marginBottom: '6px' }}>{f.score}<span style={{ fontSize: '10px', fontWeight: '400' }}>/100</span></p>
                  <p style={{ fontSize: '9px', color: '#888', lineHeight: '1.5', marginBottom: '6px' }}>{f.impact}</p>
                  <p style={{ fontSize: '9px', color: '#2564ea', fontWeight: '700' }}>{f.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>09</span>
          </div>
        </div>

        {/* ── PAGE 10: RECOMMENDED ENGAGEMENT ── */}
        <div className="page">
          <div className="label">Recommended Engagement</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '6px' }}>Strategic Transformation Diagnostic</h2>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>Given the scale of Tata Steel's transformation ambition, geographic complexity, and multi-site operating environment, Kangqore recommends the Strategic Transformation Diagnostic engagement.</p>

          <div style={{ border: '2px solid #2564ea', borderRadius: '12px', padding: '20px', background: '#f0f5ff', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2564ea', marginBottom: '4px' }}>Recommended Model</p>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#0f0f0f' }}>Strategic Transformation Diagnostic</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '8px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Duration</p>
                <p style={{ fontSize: '14px', fontWeight: '900', color: '#2564ea' }}>6–12 Weeks</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                'Extended multi-site assessment across UK and European operations',
                'Full 16-pillar diagnostic with all 6 intelligence engines',
                'Regulatory and compliance depth (OT security, ESG, GDPR)',
                'Multi-stakeholder engagement across leadership layers',
                'Complete 10 executive deliverables including Board Presentation',
                'Full benchmark analysis against manufacturing sector leaders',
                'Executive workshop series for leadership alignment',
                'Full transformation roadmap with 30/60/90/180-day sequencing',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#2564ea', flexShrink: 0, marginTop: '4px' }} />
                  <p style={{ fontSize: '9px', color: '#333', lineHeight: '1.5' }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <p className="label label-muted" style={{ marginBottom: '14px' }}>Outcomes After Kangqore BIDS™</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {[
              'Critical constraints — operational, technological, and strategic — identified, scored, and ranked by business impact',
              'Every engagement produces a ranked, scored roadmap — not a list of recommendations',
              'The Risk Register identifies and quantifies operational, technology, cybersecurity, and OT security risk exposures',
              'Technology Maturity and Cloud scores identify consolidation opportunities, cost exposure, and modernization priorities',
              'AI Readiness — consistently one of the highest-priority findings — with clear pathways to manufacturing AI adoption',
              'The Opportunity Register maps automation, AI, and efficiency wins with estimated business impact',
              'The 30/60/90/180-Day Roadmap gives the executive team a sequenced action plan from day one',
              'ROI Projection Report quantifies estimated value creation against transformation investment',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#ccc', flexShrink: 0, marginTop: '2px' }}>{String(i+1).padStart(2,'0')}</span>
                <p style={{ fontSize: '10px', color: '#444', lineHeight: '1.6' }}>{item}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px', background: '#f8f8f5', borderRadius: '8px', borderLeft: '3px solid #2564ea' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f0f0f', marginBottom: '4px' }}>All engagements begin with a complimentary scoping session.</p>
            <p style={{ fontSize: '10px', color: '#666' }}>Investment is confirmed following scope definition and stakeholder alignment. We respond to all scoping requests within 24–48 business hours.</p>
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>10</span>
          </div>
        </div>

        {/* ── PAGE 11: WHY KANGQORE + SECURITY ── */}
        <div className="page">
          <div className="label">Engagement Integrity</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', color: '#0f0f0f', marginBottom: '18px' }}>No platform to push. No outcome pre-engineered.</h2>

          <div className="vs-row" style={{ marginBottom: '24px' }}>
            <div className="vs-col vs-col-left">
              <p className="vs-head" style={{ color: '#aaa' }}>How most diagnostics actually work</p>
              {[
                'The finding follows the product — Infosys leads to cloud, Accenture leads to automation contracts',
                'Big 4 diagnostics are priced low because the real revenue is the £50M implementation that follows',
                'The scope of the diagnostic is bounded by what the firm can sell — not what the business needs',
                'Qualitative recommendations with no pillar scores, no benchmarks, no accountability',
              ].map((t, i) => (
                <div key={i} className="vs-item">
                  <div className="vs-dot-grey" />
                  <p className="vs-text">{t}</p>
                </div>
              ))}
            </div>
            <div className="vs-col vs-col-right">
              <p className="vs-head" style={{ color: '#2564ea' }}>Why Kangqore BIDS™ is structurally different</p>
              {[
                'Kangqore owns no platform to sell — no AWS, Azure, SAP, or Salesforce reseller relationships influencing the findings',
                'BIDS™ is a priced, scoped, standalone intelligence engagement — the scorecard and blueprint are the commercial output',
                'All 16 pillars assessed with equal rigour — no pillar skipped because it falls outside our service line',
                'Because Kangqore holds execution capability across every pillar, the same team that found it can fix it',
              ].map((t, i) => (
                <div key={i} className="vs-item">
                  <div className="vs-dot-blue" />
                  <p className="vs-text">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <p className="label label-muted" style={{ marginBottom: '14px' }}>How we access your organization — and how we don't</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { title: 'No persistent system access', body: 'Our diagnostic protocol is structured-interview and evidence-led. We do not require live API access, system credentials, or ongoing integration hooks to complete an engagement.' },
              { title: 'NDA-first, always', body: 'Mutual NDA executed before any discovery session, document review, or data sharing. Confidentiality is a pre-condition of the engagement, not an afterthought.' },
              { title: 'Data handling & retention', body: 'All client data, supporting documentation, and findings artifacts are returned or securely deleted within 30 days of final deliverable sign-off.' },
              { title: 'Proprietary diagnostic framework', body: 'The BIDS™ methodology — how we structure assessments, synthesise findings, and score pillars — is Kangqore\'s proprietary intellectual property, not disclosed or shared with third parties.' },
            ].map((item) => (
              <div key={item.title} style={{ border: '1px solid #e8e8e4', borderRadius: '8px', padding: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f0f0f', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '9px', color: '#777', lineHeight: '1.6' }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="divider" />
          <p className="label label-muted" style={{ marginBottom: '10px' }}>Security & Compliance Posture</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['NDA Executed — Active','Client Data Isolation — Active','Data Minimization Controls — Active','Right to Deletion — Active','GDPR-Aligned — Active','ISO 27001 Alignment — In Progress','SOC 2 Type II — Planned'].map((b) => (
              <span key={b} style={{ fontSize: '8px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid #e0e0dc', borderRadius: '20px', color: '#888' }}>{b}</span>
            ))}
          </div>

          <div className="page-footer">
            <span className="footer-brand">Kangqore BIDS™ · Tata Steel Proposal</span>
            <span className="footer-conf">Confidential</span>
            <span style={{ fontSize: '9px', fontWeight: '600', color: '#ccc' }}>11</span>
          </div>
        </div>

        {/* ── PAGE 12: NEXT STEPS / CLOSING ── */}
        <div className="page page-dark">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '257mm' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #2564ea, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: '900' }}>K</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'white', letterSpacing: '0.1em' }}>KANGQORE</span>
              </div>

              <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(56,189,248,0.7)', marginBottom: '16px' }}>NEXT STEPS</p>
              <h2 style={{ fontSize: '36px', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.03em', color: 'white', marginBottom: '24px' }}>
                Start with a scoping<br />
                <span style={{ background: 'linear-gradient(135deg, #2564ea, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>conversation.</span>
              </h2>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '420px', fontWeight: '300', marginBottom: '36px' }}>
                Every Kangqore BIDS™ engagement begins with a complimentary 30-minute executive scoping session — a clear picture of how the diagnostic works, what it covers, and whether the scope aligns with Tata Steel's current transformation priorities.
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '28px', marginBottom: '32px' }}>
                <p style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>Three ways to begin</p>
                {[
                  { n: '01', action: 'Book a scoping session', detail: 'kangqore.com/contact — 30 minutes, no commitment' },
                  { n: '02', action: 'Request a Diagnostic Proposal', detail: 'We scope and return a tailored engagement proposal within 48 hours' },
                  { n: '03', action: 'Download the full BIDS™ framework', detail: 'kangqore.com/bids — complete diagnostic documentation' },
                ].map((step) => (
                  <div key={step.n} style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#2564ea', flexShrink: 0, width: '20px', marginTop: '2px' }}>{step.n}</span>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'white', marginBottom: '2px' }}>{step.action}</p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '28px', marginBottom: '28px' }}>
                <p style={{ fontSize: '24px', fontWeight: '900', color: 'rgba(255,255,255,0.35)', lineHeight: '1.3', maxWidth: '480px' }}>
                  The enterprises that diagnose before they invest don't just reduce risk.{' '}
                  <span style={{ color: 'white' }}>They outgrow everyone who didn't.</span>
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Kangqore · Business Diagnostic Intelligence System™</p>
                  <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.1)' }}>kangqore.com · Confidential · For Discussion Purposes Only · June 2026</p>
                </div>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', fontWeight: '600' }}>12</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
