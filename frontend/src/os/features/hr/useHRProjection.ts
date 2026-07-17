// Generation III — HR Workspace WEE projection hook
// Constitutional Law 3: all enterprise data surfaces through WEE, never direct DB access.

import { useState, useEffect } from 'react'
import { WaandaExperienceEngine, WaandaCognitiveMirror } from '../../runtime/wee'
import type { ExperienceModel, ExperienceContract } from '../../runtime/wee'

const CONTRACT: ExperienceContract = {
  id: 'hr-workspace-v1',
  projectionScope: 'HR',
  persona: 'OPERATOR',
  requiredCapabilities: ['talent', 'hiring', 'onboarding', 'performance'],
  context: { workspaceId: 'hr', workspaceTitle: 'People & HR' },
}

export function useHRProjection(): ExperienceModel | null {
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
