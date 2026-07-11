// Waanda Kernel
// Generation III Runtime - Apex Layer

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WaandaCognitiveMirror } from '../wee';

export interface WaandaContextState {
    globalMemory: Record<string, any>;
    activeMissionId: string | null;
    isListening: boolean;
}

export interface IWaandaKernel {
    state: WaandaContextState;
    commandOS: (directive: string, payload: any) => void;
    remember: (key: string, value: any) => void;
}

const WaandaContext = createContext<IWaandaKernel | null>(null);

export const useWaanda = () => {
    const ctx = useContext(WaandaContext);
    if (!ctx) throw new Error('Must be used within WaandaKernel');
    return ctx;
};

/**
 * WAANDA (The Apex Intelligence)
 * This component acts as the true Context Provider for the OS.
 */
export const WaandaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WaandaContextState>({
        globalMemory: {},
        activeMissionId: null,
        isListening: false,  // false until CognitiveMirror confirms OPERATIONAL
    });

    // Fix 5: derive isListening from actual CognitiveMirror boot status
    useEffect(() => {
        const unsub = WaandaCognitiveMirror.subscribe(s => {
            setState(prev => ({ ...prev, isListening: s.bootStatus === 'OPERATIONAL' }));
        });
        return unsub;
    }, []);

    // Fix 4: handle kernel-owned WAANDA_DIRECTIVE events (ACTIVATE_MISSION, DEACTIVATE_MISSION, SET_LISTENING)
    useEffect(() => {
        const handler = (e: Event) => {
            const { directive, payload } = (e as CustomEvent).detail ?? {};
            if (directive === 'ACTIVATE_MISSION') {
                setState(prev => ({ ...prev, activeMissionId: payload?.missionId ?? null }));
            } else if (directive === 'DEACTIVATE_MISSION') {
                setState(prev => ({ ...prev, activeMissionId: null }));
            } else if (directive === 'SET_LISTENING') {
                setState(prev => ({ ...prev, isListening: !!payload?.active }));
            }
        };
        window.addEventListener('WAANDA_DIRECTIVE', handler);
        return () => window.removeEventListener('WAANDA_DIRECTIVE', handler);
    }, []);

    const remember = useCallback((key: string, value: any) => {
        setState(prev => ({
            ...prev,
            globalMemory: { ...prev.globalMemory, [key]: value }
        }));
    }, []);

    const commandOS = useCallback((directive: string, payload: any) => {
        console.log(`[WAANDA] Executing Directive: ${directive}`, payload);
        window.dispatchEvent(new CustomEvent('WAANDA_DIRECTIVE', { detail: { directive, payload } }));
    }, []);

    const kernelApi: IWaandaKernel = { state, commandOS, remember };

    return (
        <WaandaContext.Provider value={kernelApi}>
            <div className="waanda-apex-layer">
                {state.isListening && <div className="waanda-listening-indicator">WAANDA is Active</div>}
                {children}
            </div>
        </WaandaContext.Provider>
    );
};
