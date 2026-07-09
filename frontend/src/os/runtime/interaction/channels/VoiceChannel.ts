// Voice Channel
// Generation III Runtime

import { InteractionRuntime } from '../InteractionRuntime';

export class VoiceChannel {
    constructor(private runtime: InteractionRuntime) {}

    public handleTranscript(transcript: string) {
        // Voice transcripts are routed to WAANDA for processing, or direct command matching
        this.runtime.dispatchAction({
            type: 'NAVIGATION', 
            target: 'voice-router',
            payload: { transcript },
            originChannel: 'VOICE',
            timestamp: new Date().toISOString()
        });
    }
}
