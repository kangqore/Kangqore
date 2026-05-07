// Mock data service for AI Infrastructure Dashboard
// In future, connect to AWS CloudWatch, OpenAI Usage API, Vector DB metrics

export const getInfrastructureMetrics = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  
    return {
      gpu: {
        capacity: {
          used: 68,
          available: 32,
          totalUnits: 128, // e.g. A100s
        },
        realTimeUsage: [
            { time: '10:00', usage: 45 },
            { time: '10:05', usage: 52 },
            { time: '10:10', usage: 68 },
            { time: '10:15', usage: 74 },
            { time: '10:20', usage: 62 },
            { time: '10:25', usage: 58 },
            { time: '10:30', usage: 68 },
        ]
      },
      api: {
        burnRate: 650000, // 6.5L / month
        runwayMonths: 8,
        costTrend: [
            { date: '2023-01', revenue: 120, cost: 40 },
            { date: '2023-02', revenue: 150, cost: 45 },
            { date: '2023-03', revenue: 200, cost: 55 },
            { date: '2023-04', revenue: 280, cost: 70 },
            { date: '2023-05', revenue: 350, cost: 85 },
            { date: '2023-06', revenue: 420, cost: 95 },
        ]
      },
      vectorDb: {
        storageUsed: 4.2, // TB
        unit: 'TB',
        growthRate: 15, // % MoM
      },
      inference: {
        throughput: 12400, // req/min
        peakvsAvg: 1.8, // Peak is 1.8x avg
        costPerInference: {
            current: 0.48,
            target: 0.40,
            currency: '₹'
        }
      },
      models: {
          iterationSpeed: 4, // days
          versions: [
              { version: 'v1.0', cost: 0.85 },
              { version: 'v1.1', cost: 0.65 },
              { version: 'v2.0', cost: 0.48 }, // Current
          ]
      },
      advanced: {
          internalUsage: 12, // %
          proprietaryDataRatio: 85, // %
          automationRate: 64, // %
          revenueAttribution: 72 // %
      }
    };
  };
