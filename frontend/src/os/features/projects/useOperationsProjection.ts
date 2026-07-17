// Generation III — Projects Workspace WEE projection hook
// Subscribes to WaandaCognitiveMirror and re-projects whenever cognitive state changes.
// Constitutional Law 3: all enterprise data surfaces through WEE, never direct DB access.

import { useState, useEffect } from 'react'
import { WaandaExperienceEngine, WaandaCognitiveMirror } from '../../runtime/wee'
import type { ExperienceModel, ExperienceContract } from '../../runtime/wee'

const CONTRACT: ExperienceContract = {
  id: 'projects-workspace-v1',
  projectionScope: 'OPERATIONS',
  persona: 'OPERATOR',
  requiredCapabilities: ['projects', 'workflows', 'decisions'],
  context: { workspaceId: 'projects', workspaceTitle: 'Projects' },
}

export function useOperationsProjection(): ExperienceModel | null {
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
