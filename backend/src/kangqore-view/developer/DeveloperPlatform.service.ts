// Phase 5.1 & 5.3 — Developer Platform Service & "Build an App in a Day" Engine
// Enables developers to: Create App → Connect Ontology → Create Action → Create Agent → Build UI → Test → Publish

import { prisma } from '../../lib/prisma'
import { validateAppManifest, KangqoreAppManifest } from './AppManifest'
import { generateDeveloperCliScript, generateTypescriptSdkBundle, generatePythonSdkBundle } from './DeveloperCliGenerator'
import { AppSandboxEngine, SandboxExecutionInput } from './AppSandboxEngine'

export interface CreateDeveloperAppInput {
  name: string
  publisherEmail: string
  description: string
  category?: 'CERTIFIED' | 'GOVERNED' | 'AI_NATIVE' | 'ENTERPRISE_READY' | 'COMMUNITY' | 'PARTNER'
  ontologyObjectTypes?: string[]
}

export const DeveloperPlatformService = {
  async createApp(input: CreateDeveloperAppInput, userId: string) {
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const appId = `app-dev-${slug}-${Date.now().toString(36)}`
    const apiKey = `kq_dev_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`
    const clientSecret = `sec_${Math.random().toString(36).substring(2, 16)}`

    const initialManifest: KangqoreAppManifest = {
      manifestVersion: '1.0',
      appId,
      name: input.name,
      version: '1.0.0',
      category: input.category || 'AI_NATIVE',
      publisher: {
        name: 'Developer User',
        email: input.publisherEmail,
      },
      description: input.description,
      permissions: [
        { resource: 'WorkItem', action: 'READ', reason: 'Access workspace items' },
        { resource: 'OntologyObject', action: 'WRITE', reason: 'Sync ontology state' },
      ],
      ontologyBindings: (input.ontologyObjectTypes || ['WorkItem', 'Project']).map(t => ({
        objectType: t,
        relationshipTypes: ['belongsTo', 'dependsOn'],
      })),
      actions: [
        {
          name: 'executeWorkflowStep',
          displayName: 'Execute Workflow Step',
          description: 'Triggers app workflow step within AEGIS security sandbox',
          parameters: [
            { name: 'stepName', type: 'string', required: true },
            { name: 'payload', type: 'string', required: false },
          ],
        },
      ],
      agents: [
        {
          name: 'AppCopilotAgent',
          role: `${input.name} Assistant`,
          goal: 'Automate app workflows safely',
          capabilities: ['ONTOLOGY_QUERY', 'ACTION_EXECUTE'],
        },
      ],
      uiWidgets: [
        {
          name: 'AppDashboardWidget',
          title: `${input.name} Panel`,
          type: 'DASHBOARD_PANEL',
          entryUrl: `/apps/${appId}/widget`,
        },
      ],
    }

    return {
      appId,
      name: input.name,
      version: '1.0.0',
      apiKey,
      clientSecret,
      manifest: initialManifest,
      createdAt: new Date().toISOString(),
      developerDocsUrl: `https://developers.kangqoreview.com/docs/apps/${appId}`,
    }
  },

  validateManifest(manifest: any) {
    return validateAppManifest(manifest)
  },

  async runSandboxTest(input: SandboxExecutionInput) {
    return AppSandboxEngine.execute(input)
  },

  getDeveloperCliScript() {
    return generateDeveloperCliScript()
  },

  getSdkBundle(language: 'typescript' | 'python') {
    if (language === 'python') {
      return { filename: 'kangqore_view_sdk.py', code: generatePythonSdkBundle() }
    }
    return { filename: 'index.ts', code: generateTypescriptSdkBundle() }
  },
}
