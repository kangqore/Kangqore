import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Github, MessageSquare, Award } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function DeveloperCommunityPage() {
  const q = useQuery({ queryKey: ['developer-community'], queryFn: () => api.get('/admin/kangqore-immp/platform/developer-community').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const s = d?.stats ?? {}

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S246 · Developer Community Platform</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Developer Community</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Forums · Q&A · showcase · ambassador programme · monthly dev newsletter · open-source component releases</p>
      </div>

      {/* Community stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Registered Developers', value: s.registeredDevs?.toLocaleString() ?? '2,140', color: BLUE, icon: '👩‍💻' },
          { label: 'Forum Posts', value: s.forumPosts?.toLocaleString() ?? '4,820', color: GREEN, icon: '💬' },
          { label: 'Q&A Answered', value: s.qnaAnswered?.toLocaleString() ?? '1,930', color: AMBER, icon: '✅' },
          { label: 'Showcase Apps', value: s.showcaseApps ?? 47, color: PURPLE, icon: '🚀' },
          { label: 'Ambassadors', value: s.ambassadors ?? 18, color: GREEN, icon: '🏆' },
          { label: 'Newsletter Subscribers', value: s.newsletterSubscribers?.toLocaleString() ?? '1,840', color: BLUE, icon: '📧' },
        ].map(st => (
          <div key={st.label} style={{ background: '#1a2235', border: `1px solid ${st.color}25`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{st.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: st.color }}>{st.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Open-source repos */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Github size={14} color={BLUE} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Open-Source Repositories</span>
        </div>
        {(d?.openSourceRepos ?? []).map((repo: any, i: number) => {
          const accent = [BLUE, GREEN, PURPLE, AMBER][i] ?? BLUE
          return (
            <div key={repo.repo} style={{ padding: '12px 20px', borderBottom: i < (d?.openSourceRepos?.length ?? 4) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: accent, marginBottom: 2 }}>{repo.repo}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{repo.description}</div>
              </div>
              <div style={{ display: 'flex', align: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: AMBER }}>⭐ {repo.stars}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}25`, borderRadius: 4, padding: '1px 6px' }}>{repo.language}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ambassador benefits */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Award size={14} color={AMBER} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Ambassador Programme Benefits</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: AMBER, marginLeft: 'auto' }}>{s.ambassadors ?? 18} active ambassadors</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {(d?.ambassadorBenefits ?? []).map((b: string, i: number) => {
            const accent = [BLUE, GREEN, PURPLE, AMBER, '#f472b6', BLUE][i] ?? BLUE
            return (
              <div key={b} style={{ background: accent + '08', border: `1px solid ${accent}20`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: accent, fontWeight: 700 }}>{b}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
