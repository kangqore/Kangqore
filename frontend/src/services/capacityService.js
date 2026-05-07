// Mock data service for Capacity Management Dashboard
// In future, this will connect to HRMS/Payroll/Project Management APIs

export const getCapacityMetrics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    utilization: {
      current: 74,
      target: 80,
      status: 'At Risk',
      trend: 'down',
      history: [
        { month: 'Jan', value: 78, target: 80 },
        { month: 'Feb', value: 76, target: 80 },
        { month: 'Mar', value: 75, target: 80 },
        { month: 'Apr', value: 72, target: 80 },
        { month: 'May', value: 74, target: 80 },
        { month: 'Jun', value: 74, target: 80 }, // Current
        { month: 'Jul', value: 76, target: 80 }, // Forecast
        { month: 'Aug', value: 79, target: 80 }, // Forecast
      ]
    },
    bench: {
      count: 4,
      costPerMonth: 1800000, // 18L
      percentOfWorkforce: 12,
      details: [
        { id: 1, role: 'Backend Dev', level: 'Senior', daysOnBench: 12 },
        { id: 2, role: 'Frontend Dev', level: 'Mid', daysOnBench: 5 },
        { id: 3, role: 'QA Engineer', level: 'Junior', daysOnBench: 22 },
        { id: 4, role: 'DevOps', level: 'Senior', daysOnBench: 2 }
      ]
    },
    financials: {
      revenuePerEmployee: {
        value: 4800000, // 48L
        growth: 12 // 12% YoY
      },
      blendedBillRate: {
        value: 2850,
        trend: 'up' // vs last quarter
      }
    },
    allocation: {
      distribution: [
        { name: 'Client Projects', value: 65, color: '#3b82f6' },
        { name: 'Internal Tools', value: 15, color: '#10b981' },
        { name: 'R&D', value: 12, color: '#8b5cf6' },
        { name: 'Bench', value: 8, color: '#f59e0b' }
      ],
      projectRatios: {
        client: 65,
        internal: 15,
        rnd: 12,
        bench: 8
      }
    },
    roles: [
        { role: 'Tech Lead', revenue: 85, target: 90 },
        { role: 'Backend Dev', revenue: 70, target: 75 },
        { role: 'Frontend Dev', revenue: 65, target: 70 },
        { role: 'QA', revenue: 40, target: 45 },
        { role: 'DevOps', revenue: 75, target: 80 },
    ],
    hiringForecast: [
        { month: 'Jun', required: 45, available: 42 },
        { month: 'Jul', required: 48, available: 44 },
        { month: 'Aug', required: 52, available: 46 },
        { month: 'Sep', required: 55, available: 50 },
    ]
  };
};
