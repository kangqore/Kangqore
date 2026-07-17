// Generation III — Leadership / Mission Control WEE projection hook
// Uses EXECUTIVE scope: OIS, grade, pending decisions, platform health, domain risk, synthesis.
// Constitutional Law 3: all state surfaces through WEE, never direct fetch.

import { useState, useEffect } from 'react'
import { WaandaExperienceEngine, WaandaCognitiveMirror } from '../../../runtime/wee'
import type { ExperienceModel, ExperienceContract } from '../../../runtime/wee'

const CONTRACT: ExperienceContract = {
  id: 'leadership-mission-control-v1',
  projectionScope: 'EXECUTIVE',
  persona: 'EXECUTIVE',
  requiredCapabilities: ['ois', 'decisions', 'goals', 'forecast', 'missions'],
  context: { workspaceId: 'leadership', workspaceTitle: 'Leadership' },
}

export function useLeadershipProjection(): ExperienceModel | null {
  const [model, setModel] = useState<ExperienceModel | null>(null)

  useEffect(() => {
    let cancelled = false

    async function project() {
      const m = await WaandaExperienceEngine.project(CONTRACT)
      if (!cancelled) setModel(m)
    }

    void project()
    const unsub = WaandaCognitiveMirror.subscribe(() => { void project() })
    return () => { cancelled = true; unsub() }
  }, [])

  return model
}
