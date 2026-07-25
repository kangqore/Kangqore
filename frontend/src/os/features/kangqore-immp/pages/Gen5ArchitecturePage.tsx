const BLUE = '#4fc3f7', GREEN = '#10b981', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const GENERATIONS = [
  { gen: 'Gen1', label: 'Claude Orchestrator', status: 'LIVE', color: GREEN,  desc: 'KIMMP routes requests to Claude via structured prompts. Training data collection begins.', year: '2026 Q1' },
  { gen: 'Gen2', label: 'Fine-tuned Adapter',  status: 'LIVE', color: GREEN,  desc: 'LoRA adapter on Mistral-7B. A/B split vs Claude. Accuracy 78%. Corpus 50K+.', year: '2026 Q2' },
  { gen: 'Gen3', label: 'Domain Expert',       status: 'LIVE', color: GREEN,  desc: 'Multi-domain specialisation. Projects/Finance/CRM/HR verticals. Gen3 handles 20%.', year: '2026 Q2' },
  { gen: 'Gen4', label: 'WAANDAx Foundation',  status: 'LIVE', color: GREEN,  desc: 'Primary engine at 80% routing. Claude fallback 20%. Foundation model v0.1.', year: '2026 Q3' },
  { gen: 'Gen5', label: 'Cognitive Engine',    status: 'IN PROGRESS', color: AMBER, desc: 'Native reasoning. Sub-goal decomposition. Chain-of-thought. Mistral-22B / Qwen-32B target. 10% shadow/beta.', year: '2026 Q3' },
]

const MODULES = [
  { name: 'Sub-goal Decomposition', icon: '🔀', status: 'Building', desc: 'Breaks complex queries into ordered sub-goals before execution', color: AMBER },
  { name: 'Planning Sequence Generator', icon: '📋', status: 'Building', desc: 'Generates multi-step execution plans with dependency graphs', color: AMBER },
  { name: 'Contradiction Detection', icon: '⚡', status: 'Spec Complete', desc: 'Native inconsistency detection across multi-turn context', color: BLUE },
  { name: 'Uncertainty Quantification', icon: '📊', status: 'Spec Complete', desc: 'Per-inference confidence bounds with calibrated probabilities', color: BLUE },
  { name: 'Multi-turn Context Window', icon: '🔁', status: 'Spec Complete', desc: '64K token context with priority-weighted memory compression', color: BLUE },
  { name: 'Chain-of-Thought Engine', icon: '🧠', status: 'Building', desc: 'Explicit reasoning trace: premise → inference → conclusion', color: AMBER },
]

const STATUS_COLOR: Record<string, string> = { 'Building': AMBER, 'Spec Complete': BLUE, 'Live': GREEN }

export function Gen5ArchitecturePage() {
  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S199 · Gen5 Architecture</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Cognitive Engine — Gen5</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Native reasoning · chain-of-thought · Mistral-22B / Qwen-32B target · sub-goal decomposition · uncertainty quantification</p>
      </div>

      {/* Generation timeline */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>WAANDA Generation Roadmap</div>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, left: 24, right: 24, height: 2, background: '#263250', zIndex: 0 }} />
          {GENERATIONS.map((g, i) => (
            <div key={g.gen} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: g.color + '18', border: `2px solid ${g.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: g.color }}>{g.gen}</div>
              <div style={{ textAlign: 'center', padding: '0 4px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{g.label}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: g.color, marginBottom: 4 }}>{g.status}</div>
                <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.4 }}>{g.desc}</div>
                <div style={{ fontSize: 9, color: '#556', marginTop: 4 }}>{g.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model targets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { name: 'Mistral-22B',  label: 'Primary Target', color: AMBER,  params: '22B', ctx: '32K', reason: 'Best reasoning/cost ratio in class. LoRA fine-tune viable on 4×A100. Kangqore production-ready.' },
          { name: 'Qwen-32B',     label: 'Fallback Target', color: PURPLE, params: '32B', ctx: '64K', reason: 'Stronger chain-of-thought on long contexts. Higher cost but superior multi-step planning.' },
        ].map(m => (
          <div key={m.name} style={{ background: m.color + '06', border: `1px solid ${m.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: m.color }}>{m.name}</div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: m.color + '18', color: m.color }}>{m.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color }}>{m.params}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>Parameters</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color }}>{m.ctx}</div>
                <div style={{ fontSize: 9, color: '#8899aa' }}>Context</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{m.reason}</div>
          </div>
        ))}
      </div>

      {/* Reasoning modules */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          Gen5 Reasoning Modules
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {MODULES.map((m, i) => (
            <div key={m.name} style={{ padding: '14px 16px', borderRight: i % 3 !== 2 ? '1px solid #1e2a40' : undefined, borderBottom: i < 3 ? '1px solid #1e2a40' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: (STATUS_COLOR[m.status] ?? BLUE) + '18', color: STATUS_COLOR[m.status] ?? BLUE }}>{m.status}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 10, color: '#8899aa', lineHeight: 1.4 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
