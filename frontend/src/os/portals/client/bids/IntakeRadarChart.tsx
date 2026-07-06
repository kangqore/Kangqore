import { motion } from 'framer-motion'
import { IntakeEngine } from './intakeTypes'

interface Props {
  engines:          IntakeEngine[]
  sectionsDone:     number[]
  engines_answers:  Record<string, Record<string, any>>
}

export function IntakeRadarChart({ engines, sectionsDone, engines_answers }: Props) {
  const size   = 140
  const cx     = size / 2
  const cy     = size / 2
  const radius = 52

  // Compute 0–1 score per engine
  const scores = engines.map((engine, i) => {
    const answers  = engines_answers[engine.id] ?? {}
    const answered = Object.values(answers).filter(v => {
      if (v === null || v === undefined) return false
      if (typeof v === 'string' && v.trim() === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    }).length
    const total = engine.questions.filter(q => q.required).length || 1
    return Math.min(answered / total, 1)
  })

  const n     = engines.length
  const step  = (2 * Math.PI) / n
  const start = -Math.PI / 2

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]

  const ringPath = (ratio: number) => {
    const pts = engines.map((_, i) => {
      const angle = start + i * step
      return {
        x: cx + ratio * radius * Math.cos(angle),
        y: cy + ratio * radius * Math.sin(angle),
      }
    })
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'
  }

  const spokePoints = engines.map((_, i) => {
    const angle = start + i * step
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  // Filled polygon for current scores
  const scorePath = engines.map((_, i) => {
    const angle = start + i * step
    const r     = scores[i] * radius
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  })
  const filled = scorePath.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Ring grid */}
      {rings.map(r => (
        <path
          key={r}
          d={ringPath(r)}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={0.75}
        />
      ))}

      {/* Spokes */}
      {spokePoints.map((pt, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.75}
        />
      ))}

      {/* Filled score polygon */}
      <motion.path
        d={filled}
        fill="rgba(37,100,234,0.18)"
        stroke="#2564ea"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Score dots */}
      {scorePath.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={2.5}
          fill={engines[i].color}
          initial={{ scale: 0 }}
          animate={{ scale: scores[i] > 0 ? 1 : 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
        />
      ))}

      {/* Engine labels */}
      {spokePoints.map((pt, i) => {
        const angle   = start + i * step
        const labelR  = radius + 16
        const lx      = cx + labelR * Math.cos(angle)
        const ly      = cy + labelR * Math.sin(angle)
        const engine  = engines[i]
        const shortName = engine.name.split(' ')[0]

        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={7}
            fontWeight={600}
            fill={scores[i] > 0.3 ? engine.color : '#475569'}
            style={{ transition: 'fill 0.3s' }}
          >
            {shortName}
          </text>
        )
      })}
    </svg>
  )
}
