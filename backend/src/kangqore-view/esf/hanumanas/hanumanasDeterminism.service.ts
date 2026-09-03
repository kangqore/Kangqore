import logger from '../../../utils/logger'
import { OntologyTimeSeriesService } from '../../eof/OntologyTimeSeries'

interface BoundsCheckResult {
  isHallucination: boolean
  originalValue: number
  clampedValue: number
  variance: number // Number of standard deviations away
  bounds: {
    upper: number
    lower: number
    mean: number
  }
}

/**
 * HANUMANAS Determinism Engine
 * Puts a strict mathematical leash on the Krisnam LLM.
 * Intercepts stochastic predictions and clamps them to the physical realities of the enterprise ontology.
 */
export class HanumanasDeterminismEngine {

  /**
   * Calculates Mean and Standard Deviation (σ)
   */
  private calculateStatistics(values: number[]): { mean: number, stdDev: number } {
    if (values.length === 0) return { mean: 0, stdDev: 0 }
    
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length
    
    if (values.length === 1) return { mean, stdDev: 0 }

    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1)
    return { mean, stdDev: Math.sqrt(variance) }
  }

  /**
   * Validates a predicted value against historical time-series data.
   * If the value exceeds the max allowable standard deviations (default 2σ), it clamps it.
   */
  public async verifyPrediction(
    objectId: string, 
    propertyName: string, 
    predictedValue: number, 
    maxSigma: number = 2
  ): Promise<BoundsCheckResult> {
    
    // Fetch historical data to construct the baseline physical reality
    const historicalSeries = await OntologyTimeSeriesService.query(objectId, { propertyName, resolution: 'raw' })
    const points = historicalSeries[propertyName] || []
    
    const values = points.map(p => p.value)
    
    // If no history exists, we cannot deterministically bound it. 
    // Fallback to accepting the prediction but logging a warning.
    if (values.length < 2) {
      logger.warn(`[HANUMANAS DETERMINISM] Insufficient historical data for ${objectId}.${propertyName}. Allowing Krisnam prediction unguarded.`)
      return {
        isHallucination: false,
        originalValue: predictedValue,
        clampedValue: predictedValue,
        variance: 0,
        bounds: { upper: predictedValue, lower: predictedValue, mean: predictedValue }
      }
    }

    const { mean, stdDev } = this.calculateStatistics(values)
    
    const upperLimit = mean + (maxSigma * stdDev)
    const lowerLimit = mean - (maxSigma * stdDev)

    // Calculate how many sigmas away the prediction is
    const zScore = stdDev === 0 ? 0 : Math.abs(predictedValue - mean) / stdDev

    const isHallucination = zScore > maxSigma
    let clampedValue = predictedValue

    if (isHallucination) {
      logger.warn(`[HANUMANAS DETERMINISM] HALLUCINATION DETECTED! Krisnam predicted ${predictedValue} for ${objectId}.${propertyName} (Variance: ${zScore.toFixed(2)}σ). Clamping to mathematical bounds.`)
      clampedValue = Math.max(lowerLimit, Math.min(predictedValue, upperLimit))
    }

    return {
      isHallucination,
      originalValue: predictedValue,
      clampedValue,
      variance: zScore,
      bounds: { upper: upperLimit, lower: lowerLimit, mean }
    }
  }
}

export const hanumanasDeterminism = new HanumanasDeterminismEngine()
