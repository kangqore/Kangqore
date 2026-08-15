import { Request, Response } from 'express';
import * as Aggregation from '../services/alisAggregation.service';
import * as DemandTrend from '../services/alisDemandTrend.service';
import * as ContentGap from '../services/alisContentGap.service';
import * as ExecutiveAlert from '../services/alisExecutiveAlert.service';
import * as Forecast from '../services/alisForecast.service';
import { TimeRange, isValidRange } from '../services/alisUtils';
import { AlisSignalProducer } from '../signals/alisSignalProducer.service';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Admin REST Controller (Phase 10)
// ---------------------------------------------------------------------------

function parseRange(req: Request): TimeRange {
  const r = req.query.timeRange as string;
  return isValidRange(r) ? r : '30d';
}

export const AlisAdminController = {
  async getOverview(req: Request, res: Response) {
    try {
      const data = await Aggregation.getOverview(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS overview failed', message: e.message });
    }
  },

  async getRevenue(req: Request, res: Response) {
    try {
      const data = await Aggregation.getRevenue(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS revenue failed', message: e.message });
    }
  },

  async getDepartments(req: Request, res: Response) {
    try {
      const data = await DemandTrend.getDepartments(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS departments failed', message: e.message });
    }
  },

  async getServices(req: Request, res: Response) {
    try {
      const data = await DemandTrend.getServices(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS services failed', message: e.message });
    }
  },

  async getSalesPerformance(req: Request, res: Response) {
    try {
      const data = await Aggregation.getSalesPerformance(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS sales performance failed', message: e.message });
    }
  },

  async getBuyerIntent(req: Request, res: Response) {
    try {
      const data = await Aggregation.getBuyerIntent(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS buyer intent failed', message: e.message });
    }
  },

  async getContentGaps(req: Request, res: Response) {
    try {
      const data = await ContentGap.getContentGaps(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS content gaps failed', message: e.message });
    }
  },

  async getAlerts(req: Request, res: Response) {
    try {
      const data = await ExecutiveAlert.getAlerts();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS alerts failed', message: e.message });
    }
  },

  async getGrowthRecs(req: Request, res: Response) {
    try {
      const data = await Forecast.getGrowthRecs(parseRange(req));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS growth recs failed', message: e.message });
    }
  },

  // Phase 2 — emit MARKET signals for high-demand departments.
  async emitMarketSignals(_req: Request, res: Response) {
    try {
      const result = await AlisSignalProducer.scanAndEmit();
      try { require('../../kangqore-view/waanda/adapters/AlisAdapter').notifyAlisSignalEmit() } catch {}
      res.json({ ok: true, ...result });
    } catch (e: any) {
      res.status(500).json({ error: 'ALIS signal scan failed', message: e.message });
    }
  },
};
