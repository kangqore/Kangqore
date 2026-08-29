import logger from '../../../utils/logger'
import { codeOverlord } from './codeOverlord.service'

export type SubsystemType = 'HATHAWAY' | 'NOLAN' | 'AEGIS' | 'ALIS' | 'HCIP' | 'EQORE' | 'VIS' | 'KIMMP'

export interface SynapseSignal {
  id: string
  origin: SubsystemType
  target?: SubsystemType | 'ALL' // 'ALL' broadcasts to every node
  signalType: 'CAPACITY_SHORTAGE' | 'COMPLIANCE_BLOCK' | 'ONTOLOGY_SHIFT' | 'MARKET_INTEL' | 'UX_ANOMALY' | 'POLICY_OVERRIDE'
  payload: any
  timestamp: string
}

export type PerceptronCallback = (signal: SynapseSignal) => Promise<void>

/**
 * The Kangqore Synapse Mesh
 * Connects all subsystems into a unified artificial neural network.
 * Passes intelligence signals seamlessly across nodes.
 */
export class SynapseMeshService {
  private nodes: Map<SubsystemType, PerceptronCallback[]> = new Map()

  /**
   * Register a subsystem as a perceptron node to listen for incoming signals.
   */
  public registerNode(system: SubsystemType, callback: PerceptronCallback) {
    if (!this.nodes.has(system)) {
      this.nodes.set(system, [])
    }
    this.nodes.get(system)!.push(callback)
    logger.info(`[SynapseMesh] Neural connection established for perceptron: ${system}`)
  }

  /**
   * Fire a signal across the neural mesh.
   */
  public async fire(signal: SynapseSignal): Promise<void> {
    logger.info(`[SynapseMesh] Signal Fired: ${signal.origin} -> ${signal.target || 'ALL'} [${signal.signalType}]`)

    // 1. The C.O.D.E. Override Check
    // If the Godfather Protocol is active, C.O.D.E. can intercept, halt, or redirect this signal.
    const intercept = codeOverlord.interceptSignal(signal)
    if (intercept.halted) {
      logger.warn(`[SynapseMesh] SIGNAL HALTED BY C.O.D.E. OVERLORD. Reason: ${intercept.reason}`)
      return
    }
    if (intercept.redirectedTarget) {
      logger.info(`[SynapseMesh] SIGNAL REDIRECTED BY C.O.D.E. OVERLORD to ${intercept.redirectedTarget}`)
      signal.target = intercept.redirectedTarget
    }

    // 2. Broadcast the signal to the target perceptron(s)
    const targets = signal.target === 'ALL' 
      ? Array.from(this.nodes.keys()) 
      : [signal.target as SubsystemType]

    const promises: Promise<void>[] = []
    
    for (const t of targets) {
      if (t === signal.origin) continue // Don't fire back to self
      const callbacks = this.nodes.get(t) || []
      for (const cb of callbacks) {
        promises.push(cb(signal).catch(err => {
          logger.error(`[SynapseMesh] Node ${t} failed to process signal from ${signal.origin}:`, err)
        }))
      }
    }

    await Promise.allSettled(promises)
  }
}

export const synapseMesh = new SynapseMeshService()
