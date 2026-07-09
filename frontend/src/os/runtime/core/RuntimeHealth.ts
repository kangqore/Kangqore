// Runtime Health Observable
// Generation III Runtime

import { RuntimeContainer } from './RuntimeContainer';

export interface RuntimeDiagnostic {
    version: string;
    loadedServices: string[];
    memoryUsageMB: number;
    fps: number;
    viewModelLatencyMs: number;
    activeCommands: number;
    policyChecks: number;
}

/**
 * Tracks the observable health of the platform for diagnostics.
 */
export class RuntimeHealth {
    private static instance: RuntimeHealth;
    private policyChecksCount = 0;
    private activeCommandsCount = 0;
    private lastVMLatency = 0;
    
    // Merged from workspace/RuntimeHealth
    private latencyMetrics: Record<string, number[]> = {};
    private errorMetrics: Record<string, Error[]> = {};

    private constructor() {}

    public static getInstance(): RuntimeHealth {
        if (!RuntimeHealth.instance) {
            RuntimeHealth.instance = new RuntimeHealth();
        }
        return RuntimeHealth.instance;
    }

    public recordPolicyCheck(): void {
        this.policyChecksCount++;
    }

    public recordCommandStart(): void {
        this.activeCommandsCount++;
    }

    public recordCommandEnd(): void {
        this.activeCommandsCount = Math.max(0, this.activeCommandsCount - 1);
    }

    public recordViewModelLatency(ms: number): void {
        this.lastVMLatency = ms;
    }

    public recordLatency(operation: string, ms: number) {
        if (!this.latencyMetrics[operation]) {
            this.latencyMetrics[operation] = [];
        }
        this.latencyMetrics[operation].push(ms);
        
        // Keep only last 100
        if (this.latencyMetrics[operation].length > 100) {
            this.latencyMetrics[operation].shift();
        }
    }

    public recordError(operation: string, error: any) {
        if (!this.errorMetrics[operation]) {
            this.errorMetrics[operation] = [];
        }
        this.errorMetrics[operation].push(error);
        
        console.error(`[RuntimeHealth] Error in ${operation}:`, error);
    }

    public getDiagnostics(): RuntimeDiagnostic {
        const container = RuntimeContainer.getInstance();
        
        // Use performance API safely if available
        let mem = 0;
        if (typeof performance !== 'undefined' && (performance as any).memory) {
            mem = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
        }

        return {
            version: '3.0.0', // Generation III Runtime v1.0
            loadedServices: container.getRegisteredKeys(),
            memoryUsageMB: mem,
            fps: 60, // Placeholder for actual rAF monitoring
            viewModelLatencyMs: this.lastVMLatency,
            activeCommands: this.activeCommandsCount,
            policyChecks: this.policyChecksCount,
            operationLatency: this.latencyMetrics,
            operationErrors: this.errorMetrics
        };
    }
}
