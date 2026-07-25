const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const CAPABILITIES = [
  {
    title: 'Sub-goal Decomposition', status: 'Building', color: AMBER,
    steps: ['Parse complex query', 'Identify atomic sub-goals', 'Order by dependency', 'Execute sequentially', 'Merge results'],
    example: 'Q: Should we expand into EU market? → [1] Assess regulatory landscape [2] Estimate TAM [3] Evaluate competitive position [4] Model financial impact [5] Synthesise recommendation',
  },
  {
    title: 'Planning Sequence Generator', status: 'Building', color: AMBER,
    steps: ['Receive high-level goal', 'Generate candidate plans', 'Score by feasibility', 'Select optimal path', 'Output dependency graph'],
    example: 'Goal: Close £2M ARR by Q4 → Plan: [Activate 10 enterprise trials] → [Convert 3 to paid] → [Upsell BIDS to 5 existing] → [OEM partner pipeline]',
  },
  {
    title: 'Contradiction Detection', status: 'Spec Complete', color: BLUE,
    steps: ['Parse all premises', 'Build knowledge graph', 'Run consistency check', 'Flag contradictions', 'Surface to user'],
    example: '"Expand headcount" conflicts with "reduce OPEX by 20%" — WAANDA flags before proceeding.',
  },
  {
    title: 'Uncertainty Quantification', status: 'Spec Complete', color: BLUE,
    steps: ['Compute epistemic uncertainty', 'Compute aleatoric uncertainty', 'Calibrate confidence bounds', 'Propagate through sub-goals', 'Report final uncertainty'],
    example: 'Decision confidence: 82% ± 7%. Primary source of uncertainty: competitor response (unknown). Recommend: gather 2 more signals before committing.',
  },
]

const STATUS_COLOR: Record<string, string> = { 'Building': AMBER, 'Spec Complete': BLUE, 'Live': GREEN }

export function Gen5ReasoningModulePage() {
  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S202 · Gen5 Reasoning Module</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Cognitive Reasoning Engine</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Sub-goal decomposition · planning sequence · contradiction detection · uncertainty quantification · multi-turn context</p>
      </div>

      {/* Architecture overview */}
      <div style={{ background: '#1a2235', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '18px 22px', marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Chain-of-Thought Architecture</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {['Input', '→', 'Decompose', '→', 'Plan', '→', 'Validate', '→', 'Execute', '→', 'Synthesise', '→', 'Output'].map((step, i) => (
              <span key={i} style={{ fontSize: step === '→' ? 14 : 10, color: step === '→' ? '#556' : AMBER, fontWeight: step === '→' ? 400 : 700, padding: step === '→' ? 0 : '2px 8px', borderRadius: 4, background: step === '→' ? 'transparent' : AMBER + '15' }}>{step}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 2 }}>Target Model</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: AMBER }}>Mistral-22B</div>
          <div style={{ fontSize: 10, color: '#8899aa' }}>LoRA + QLoRA adapters</div>
        </div>
      </div>

      {/* Capability deep-dives */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {CAPABILITIES.map(cap => (
          <div key={cap.title} style={{ background: '#1a2235', border: `1px solid ${cap.color}25`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '13px 16px', borderBottom: `1px solid ${cap.color}20`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', flex: 1 }}>{cap.title}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: (STATUS_COLOR[cap.status] ?? BLUE) + '18', color: STATUS_COLOR[cap.status] ?? BLUE }}>{cap.status}</span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {cap.steps.map((s, i) => (
                  <span key={i} style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#263250', color: '#8899aa' }}>{i + 1}. {s}</span>
                ))}
              </div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.6, background: '#0f1828', padding: '8px 10px', borderRadius: 6, fontStyle: 'italic' }}>
                {cap.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
