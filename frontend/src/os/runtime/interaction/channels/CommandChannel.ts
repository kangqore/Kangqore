// Command Channel
// Generation III Runtime

import { InteractionRuntime } from '../InteractionRuntime';

export class CommandChannel {
    constructor(private runtime: InteractionRuntime) {}

    public executeCommand(commandId: string, payload: any) {
        this.runtime.dispatchAction({
            type: 'EXECUTION',
            target: commandId,
            payload,
            originChannel: 'COMMAND_PALETTE',
            timestamp: new Date().toISOString()
        });
    }
}
