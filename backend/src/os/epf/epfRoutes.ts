import { Router } from 'express';
import { PredictionLedger } from './PredictionLedger';

const router = Router();

// GET /api/os/epf/predictions — Enterprise Prediction Fabric ledger
// Returns all in-memory prediction entries. Empty until a prediction cycle runs.
// WaandaCognitiveMirror polls this to surface EPF state in the WEE cognitive state.
router.get('/predictions', (_req, res) => {
  try {
    const entries = PredictionLedger.getInstance().getAllEntries();
    res.json({
      predictions: entries.map(e => ({
        id:         e.predictionId,
        target:     e.request.target,
        horizon:    e.request.horizon,
        confidence: e.prediction.confidence,
        state:      e.prediction.state,
        outcome:    e.prediction.outcome,
        driftDetected: e.driftDetected ?? false,
        errorMargin:   e.errorMargin,
        loggedAt:   e.loggedAt,
      })),
      total: entries.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'EPF ledger unavailable' });
  }
});

export default router;
