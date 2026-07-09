// ---------------------------------------------------------------------------
// Prediction Model Self-Registration
//
// Import this file to register all EPF models. WAANDA.boot() calls
// `await import('../domains/prediction')` — it does not need to name
// ChurnPredictionModel or RevenuePredictionModel individually.
//
// Registers into:
//   - ModelRegistry       — the technical model plugins (EPF inference layer)
//   - PredictionRegistry  — the business target catalogue
// ---------------------------------------------------------------------------

import { ModelRegistry }      from '../../os/epf/ModelRegistry'
import { PredictionRegistry } from '../../os/epf/PredictionRegistry'
import { ChurnPredictionModel }   from './ChurnPredictionModel'
import { RevenuePredictionModel } from './RevenuePredictionModel'

const models      = ModelRegistry.getInstance()
const predictions = PredictionRegistry.getInstance()

models.registerModel(new ChurnPredictionModel())
models.registerModel(new RevenuePredictionModel())

predictions.registerTarget('CUSTOMER_CHURN')
predictions.registerTarget('REVENUE')
