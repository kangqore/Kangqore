import logger from '../../../../utils/logger'
import { SynapseSignal, SubsystemType } from './synapseMesh.service'

interface SignalInterception {
  halted: boolean
  reason?: string
  redirectedTarget?: SubsystemType | 'ALL'
}

interface GodfatherDirective {
  active: boolean
  directiveMessage: string
  haltAllOrigins?: SubsystemType[]
  forceRedirects?: Map<SubsystemType, SubsystemType> // Map Origin -> Forced Target
}

/**
 * The C.O.D.E. Overlord Interface
 * The supreme control tier for the Kangqore Synapse Network.
 * Owned exclusively by Mahesh Kumar (C.O.D.E.).
 * Dictates absolute rules over the autonomous intelligence network.
 */
export class CodeOverlordService {
  private protocol: GodfatherDirective = {
    active: false,
    directiveMessage: '',
    haltAllOrigins: [],
    forceRedirects: new Map()
  }

  /**
   * Activate The Godfather Protocol
   * This is a "God Mode" override. When activated by C.O.D.E., it bypasses 
   * AEGIS and instantly manipulates the neural routing across the ecosystem.
   */
  public engageGodfatherProtocol(directive: string, haltOrigins: SubsystemType[] = [], redirects: { from: SubsystemType, to: SubsystemType }[] = []) {
    this.protocol.active = true
    this.protocol.directiveMessage = directive
    this.protocol.haltAllOrigins = haltOrigins
    
    this.protocol.forceRedirects.clear()
    for (const r of redirects) {
      this.protocol.forceRedirects.set(r.from, r.to)
    }

    logger.warn(`[C.O.D.E. OVERLORD] GODFATHER PROTOCOL ENGAGED. Directive: "${directive}"`)
    if (haltOrigins.length) logger.warn(`[C.O.D.E. OVERLORD] Halting all signals from: ${haltOrigins.join(', ')}`)
  }

  public disengageGodfatherProtocol() {
    this.protocol.active = false
    this.protocol.directiveMessage = ''
    this.protocol.haltAllOrigins = []
    this.protocol.forceRedirects.clear()
    logger.info(`[C.O.D.E. OVERLORD] Godfather Protocol Disengaged. Network returning to autonomous operation.`)
  }

  /**
   * Called by the Synapse Mesh before EVERY signal is fired.
   * C.O.D.E. has the absolute right to halt or redirect it.
   */
  public interceptSignal(signal: SynapseSignal): SignalInterception {
    if (!this.protocol.active) return { halted: false }

    // Check if C.O.D.E. ordered a halt on this origin
    if (this.protocol.haltAllOrigins?.includes(signal.origin)) {
      return { 
        halted: true, 
        reason: `C.O.D.E. Directive: ${this.protocol.directiveMessage}`
      }
    }

    // Check if C.O.D.E. ordered a forced redirection
    if (this.protocol.forceRedirects?.has(signal.origin)) {
      return {
        halted: false,
        redirectedTarget: this.protocol.forceRedirects.get(signal.origin)
      }
    }

    return { halted: false }
  }
}

export const codeOverlord = new CodeOverlordService()
