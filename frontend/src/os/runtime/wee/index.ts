// WAANDA Experience Engine — barrel export
// Boot sequence: call bootWEE() once at runtime startup.

export { WaandaExperienceEngine } from './WaandaExperienceEngine'
export { WaandaCognitiveMirror }  from './WaandaCognitiveMirror'
export type {
  WaandaCognitiveState,
  ExperienceContract,
  ProjectionPolicy,
  ExperienceModel,
  CognitiveStateAdapter,
  ProjectionScope,
  CognitivePhase,
} from './types'
export { DEFAULT_PROJECTION_POLICY, EMPTY_WAANDA_STATE } from './types'

import { WaandaExperienceEngine } from './WaandaExperienceEngine'
import { WaandaCognitiveMirror }  from './WaandaCognitiveMirror'
import { PersonalCognitiveAdapter }       from './adapters/PersonalCognitiveAdapter'
import { ExecutiveCognitiveAdapter }      from './adapters/ExecutiveCognitiveAdapter'
import { RevenueCognitiveAdapter }        from './adapters/RevenueCognitiveAdapter'
import { OperationsCognitiveAdapter }     from './adapters/OperationsCognitiveAdapter'
import { IntelligenceCognitiveAdapter }   from './adapters/IntelligenceCognitiveAdapter'
import { PlatformCognitiveAdapter }       from './adapters/PlatformCognitiveAdapter'
import { CollaborationCognitiveAdapter }  from './adapters/CollaborationCognitiveAdapter'
import { GovernanceCognitiveAdapter }     from './adapters/GovernanceCognitiveAdapter'
import { EcosystemCognitiveAdapter }      from './adapters/EcosystemCognitiveAdapter'

export function bootWEE(): void {
  WaandaExperienceEngine.registerAdapter(PersonalCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(ExecutiveCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(RevenueCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(OperationsCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(IntelligenceCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(PlatformCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(CollaborationCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(GovernanceCognitiveAdapter)
  WaandaExperienceEngine.registerAdapter(EcosystemCognitiveAdapter)
  WaandaCognitiveMirror.start()
}
