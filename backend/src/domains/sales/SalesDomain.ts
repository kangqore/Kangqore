import { EnterpriseDomain } from '../../kangqore-view/edf/contracts/EnterpriseDomain';
import { SalesExecutiveCortex } from './SalesExecutiveCortex';

export const SalesDomain: EnterpriseDomain = {
  metadata: {
    id: 'DOM_SALES',
    name: 'Sales Domain',
    version: '1.0.0',
    purpose: 'Manages opportunities, pipeline, quotations, revenue forecasting, and win/loss analysis. Consumes Customer Twins.'
  },
  objects: [
    { objectId: 'OBJ_OPPORTUNITY', name: 'Opportunity', inheritsFrom: 'Relationship', description: 'A potential sale associating a Person with a Product.' },
    { objectId: 'OBJ_QUOTATION', name: 'Quotation', inheritsFrom: 'Agreement', description: 'A formal price offering for a Product.' }
  ],
  relationships: [
    { sourceObjectId: 'OBJ_CUSTOMER', targetObjectId: 'OBJ_OPPORTUNITY', relationshipType: 'HAS_OPPORTUNITY' }
  ],
  twins: [
    {
      type: 'DEAL_PROFILE',
      fields: {
        dealId: 'string',
        customerId: 'string',
        value: 'number',
        stage: 'string',
        probability: 'number'
      }
    }
  ],
  goals: [
    {
      goalId: 'GOAL_SALES_REVENUE',
      owner: 'DOM_SALES',
      priority: 'CRITICAL',
      kpi: 'Quarterly Revenue Target',
      successCriteria: ['> $10M booked'],
      constraints: ['Discounts < 20%'],
      progress: 60,
      dependencies: ['DOM_CUSTOMER'], // Explicit dependency on Customer domain
      status: 'ACTIVE'
    }
  ],
  capabilities: [
    {
      id: 'CAP_CREATE_QUOTATION',
      version: 1,
      owner: 'DOM_SALES',
      category: 'DOCUMENT_GENERATION',
      permissions: ['READ_TWIN'],
      health: 'UP',
      sla: '99.5%',
      estimatedCost: 0.10,
      estimatedLatencyMs: 1500,
      inputSchema: { dealId: 'string' },
      outputSchema: { quoteUrl: 'string' }
    },
    {
      id: 'CAP_NOTIFY_ACCOUNT_EXECUTIVE',
      version: 1,
      owner: 'DOM_SALES',
      category: 'COMMUNICATION',
      permissions: ['READ_TWIN'],
      health: 'UP',
      sla: '99.9%',
      estimatedCost: 0,
      estimatedLatencyMs: 200,
      inputSchema: {},
      outputSchema: {}
    }
  ],
  kpis: [
    {
      kpiId: 'KPI_REVENUE',
      name: 'Quarterly Revenue Target',
      targetValue: 100000,
      currentValue: 0
    },
    {
      kpiId: 'KPI_PIPELINE_VELOCITY',
      name: 'Pipeline Velocity',
      targetValue: 45,
      currentValue: 42
    }
  ],
  policies: [
    {
      policyId: 'POL_SALES_001',
      statement: 'Deals with probability < 10% are excluded from executive revenue forecasts.'
    }
  ],
  events: [
    { eventId: 'EVT_DEAL_CREATED', topic: 'sales.pipeline.deal_created' },
    { eventId: 'EVT_DEAL_WON', topic: 'sales.pipeline.deal_won' },
    { eventId: 'EVT_DEAL_LOST', topic: 'sales.pipeline.deal_lost' }
  ],
  executive: new SalesExecutiveCortex()
};
