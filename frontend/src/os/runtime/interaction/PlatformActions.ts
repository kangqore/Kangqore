// Platform Actions
// Generation III Runtime

export interface PlatformAction {
    type: 'MUTATION' | 'SIMULATION' | 'OPTIMIZATION' | 'EXECUTION' | 'NAVIGATION';
    target: string;
    payload: any;
    originChannel: string;
    timestamp: string;
}
