// ExperienceAPI — concrete singleton facade over the Enterprise Platform.
// Generation III Runtime / Constitution 3 v2.0

import type { ExperienceAPI as IExperienceAPI, EnterpriseObjectViewModel, Simulation, Optimization } from '../types/experience';
import type { WorkspaceCommand } from '../types/manifest';

async function bff<T>(path: string, opts?: RequestInit): Promise<T | null> {
    try {
        const res = await fetch(path, { credentials: 'include', ...opts })
        if (!res.ok) return null
        return res.json() as Promise<T>
    } catch {
        return null
    }
}

export class ExperienceAPI implements IExperienceAPI {
    private static instance: ExperienceAPI;

    static getInstance(): ExperienceAPI {
        if (!ExperienceAPI.instance) {
            ExperienceAPI.instance = new ExperienceAPI();
        }
        return ExperienceAPI.instance;
    }

    async getObject(id: string, _lens: string): Promise<EnterpriseObjectViewModel> {
        const data = await bff<{ domains: any[] }>('/api/os/edf/domains')
        const domain = data?.domains?.find((d: any) => d.id === id)
        if (domain) {
            return {
                object:  domain,
                summary: `${domain.name} — ${domain.purpose ?? ''}`.trim(),
                metrics: [
                    { id: 'capabilities', label: 'Capabilities', value: domain.capabilities ?? 0, trend: 'FLAT', delta: 0 },
                    { id: 'objects',      label: 'Objects',      value: domain.objects ?? 0,      trend: 'FLAT', delta: 0 },
                    { id: 'goals',        label: 'Goals',        value: domain.goals ?? 0,         trend: 'FLAT', delta: 0 },
                ],
                predictions:   [],
                simulations:   [],
                optimizations: [],
                permissions: {
                    canView:     true,
                    canEdit:     false,
                    canSimulate: !!domain.ready,
                    canExecute:  false,
                    policies:    [],
                },
                actions:  [],
                timeline: [],
            }
        }
        return {
            object: { id },
            summary: '',
            metrics: [],
            predictions: [],
            simulations: [],
            optimizations: [],
            permissions: { canView: true, canEdit: false, canSimulate: false, canExecute: false, policies: [] },
            actions: [],
            timeline: [],
        }
    }

    async getMission(id: string): Promise<any> {
        const data = await bff<{ history: any[] }>('/api/admin/kangqore-immp/systems/history')
        const entry = data?.history?.find((d: any) => d.id === id || d.dispatchId === id)
        return entry ?? null
    }

    async executeCommand(command: WorkspaceCommand, context: any): Promise<any> {
        const plan = {
            planId:         `cmd_${command.id}_${Date.now()}`,
            objective:      command.description ?? command.title,
            agents:         [] as string[],
            executionOrder: 'SEQUENTIAL',
            context: {
                requestId: `req_${Date.now()}`,
                domainId:  context?.domainId ?? 'enterprise',
                inputs:    { command: command.action, ...context },
                priority:  'NORMAL',
            },
        }
        return bff('/api/os/eaf/orchestrate', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(plan),
        })
    }

    async simulate(intent: any): Promise<Simulation> {
        const scenario = {
            scenarioId:   `scen_${Date.now()}`,
            name:         intent?.name ?? intent?.goal ?? 'Workspace Simulation',
            description:  intent?.description ?? '',
            type:         intent?.type ?? 'WHAT_IF',
            horizon:      intent?.horizon ?? 'DAYS_30',
            variables:    intent?.variables ?? [],
            iterations:   intent?.iterations ?? 100,
            domainScope:  intent?.domains ?? [],
            createdAt:    new Date(),
        }
        const result = await bff<any>('/api/os/esf/simulations/run', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(scenario),
        })
        if (!result) return { id: '', branchId: '', status: 'FAILED', results: null }
        return {
            id:       result.resultId ?? scenario.scenarioId,
            branchId: scenario.scenarioId,
            status:   result.status ?? 'COMPLETED',
            results:  result,
        }
    }

    async optimize(_intent: any): Promise<Optimization> {
        // EOF not yet mounted — returns structured stub
        return {
            id:              `opt_${Date.now()}`,
            runId:           '',
            objective:       _intent?.goal ?? 'optimize',
            recommendations: [],
        }
    }
}
