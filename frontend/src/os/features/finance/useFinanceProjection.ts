// Generation III — Finance Workspace WEE projection hook
// Constitutional Law 3: all enterprise data surfaces through WEE, never direct DB access.

import { useState, useEffect } from 'react'
import { WaandaExperienceEngine, WaandaCognitiveMirror } from '../../runtime/wee'
import type { ExperienceModel, ExperienceContract } from '../../runtime/wee'

const CONTRACT: ExperienceContract = {
  id: 'finance-workspace-v1',
  projectionScope: 'FINANCE',
  persona: 'OPERATOR',
  requiredCapabilities: ['finance', 'invoices', 'budget', 'decisions'],
  context: { workspaceId: 'finance', workspaceTitle: 'Finance' },
}

export function useFinanceProjection(): ExperienceModel | null {
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
