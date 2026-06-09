import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetchWithAuth = async (endpoint) => {
  const token = localStorage.getItem('token');
  
  /* Demo Mode Removed - Real Data Only */

  const headers = { Authorization: `Bearer ${token}` };
  const response = await fetch(`${API_URL}${endpoint}`, { headers });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export const useAdminDashboard = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.dateRange) queryParams.append('range', filters.dateRange);
  // Add other filters as needed

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  return {
    stats: useQuery({
      queryKey: ['dashboard', 'admin', 'stats', filters],
      queryFn: () => fetchWithAuth(`/api/dashboard/admin/stats${queryString}`),
    }),
    content: useQuery({
      queryKey: ['dashboard', 'admin', 'content'],
      queryFn: async () => {
         const data = await fetchWithAuth('/api/dashboard/admin/latest-content');
         return data.content || [];
      },
    }),
    users: useQuery({
      queryKey: ['dashboard', 'admin', 'users'],
      queryFn: async () => {
         const data = await fetchWithAuth('/api/dashboard/admin/recent-users');
         return data.users || [];
      },
    }),
  };
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const data = await fetchWithAuth('/api/admin/users?limit=100');
      return data.users || [];
    }
  });
};

export const useAdminContent = (filter = {}) => {
  return useQuery({
    queryKey: ['admin', 'content', filter],
    queryFn: async () => {
      let url = '/api/admin/content?page=1&page_size=100';
      if (filter.type) url += `&type=${filter.type}`;
      if (filter.status) url += `&status=${filter.status}`;
      const data = await fetchWithAuth(url);
      return data.items || [];
    }
  });
};

export const useAdminContentStats = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'stats'],
    queryFn: () => fetchWithAuth('/api/admin/content/stats/overview')
  });
};

export const useClientDashboard = () => {
  return {
    stats: useQuery({
        queryKey: ['dashboard', 'client', 'stats'],
        queryFn: () => fetchWithAuth('/api/dashboard/client/stats'),
    }),
    projects: useQuery({
        queryKey: ['dashboard', 'client', 'projects'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/client/projects');
           return data.projects || [];
        },
    }),
    summary: useQuery({
        queryKey: ['dashboard', 'client', 'summary'],
        queryFn: async () => {
             const data = await fetchWithAuth('/api/dashboard/client/summary');
             return data || { health: { score: 100, status: 'Healthy' }, financials: { budgetUtilized: 0 }, actionsRequired: 0 };
        }
    }),
    updates: useQuery({
        queryKey: ['dashboard', 'client', 'updates'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/client/updates');
           return data.updates || [];
        },
    }),
    deliverables: useQuery({
        queryKey: ['dashboard', 'client', 'deliverables'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/client/deliverables');
           return data.deliverables || [];
        },
    }),
    documents: useQuery({
        queryKey: ['dashboard', 'client', 'documents'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/documents/my-documents');
           return data.documents || [];
        },
    }),
    tickets: useQuery({
        queryKey: ['dashboard', 'client', 'tickets'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/client/tickets');
           return data.tickets || [];
        },
    }),
    settings: useQuery({
        queryKey: ['dashboard', 'client', 'settings'],
        queryFn: () => fetchWithAuth('/api/client/settings'),
    }),
  };
};

export const useClientProfile = (clientId) => {
    return useQuery({
        queryKey: ['client-profile', clientId],
        queryFn: async () => {
            if (!clientId) return null;
            const data = await fetchWithAuth(`/api/client-profiles/${clientId}/profile`);
            return data.profile;
        },
        enabled: !!clientId
    });
};

export const usePartnerDashboard = () => {
  return {
     stats: useQuery({
        queryKey: ['dashboard', 'partner', 'stats'],
        queryFn: () => fetchWithAuth('/api/partner/stats'),
     }),
     deliverables: useQuery({
        queryKey: ['partner', 'deliverables'],
        queryFn: async () => {
             const data = await fetchWithAuth('/api/partner/deliverables');
             return data.deliverables || [];
        }
     }),
     earnings: useQuery({
        queryKey: ['partner', 'earnings'],
        queryFn: async () => {
             const data = await fetchWithAuth('/api/partner/earnings');
             return data.earnings || { available_balance: 0, transactions: [] };
        }
     }),
     programs: useQuery({
        queryKey: ['dashboard', 'partner', 'programs'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/partner/projects');
           return data.projects || [];
        },
     }),
      tasks: useQuery({
        queryKey: ['dashboard', 'partner', 'tasks'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/partner/tasks');
           return data.tasks || [];
        },
     }),
      documents: useQuery({
        queryKey: ['dashboard', 'partner', 'documents'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/partner/documents');
           return data.documents || [];
        },
     }),
      certifications: useQuery({
        queryKey: ['dashboard', 'partner', 'certifications'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/partner/certifications');
           return data.certifications || [];
        },
     }),
  };
};

export const useInvestorDashboard = () => {
  return {
      stats: useQuery({
        queryKey: ['dashboard', 'investor', 'stats'],
        queryFn: () => fetchWithAuth('/api/dashboard/investor/stats'),
     }),
      financials: useQuery({
        queryKey: ['dashboard', 'investor', 'financials'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/investor/financials');
           return data.financials || [];
        },
     }),
      materials: useQuery({
        queryKey: ['dashboard', 'investor', 'materials'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/investor/board-materials');
           return data.materials || [];
        },
     }),
      esg: useQuery({
        queryKey: ['dashboard', 'investor', 'esg'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/investor/esg');
           return data.esg_reports || [];
        },
     }),
      updates: useQuery({
        queryKey: ['dashboard', 'investor', 'updates'],
        queryFn: async () => {
           const data = await fetchWithAuth('/api/dashboard/investor/leadership-updates');
           return data.updates || [];
        },
     }),
  };
};

export const useClientRisks = () => {
  return useQuery({
    queryKey: ['client', 'risks'],
    queryFn: async () => {
      const data = await fetchWithAuth('/api/risks');
      return data.risks || [];
    }
  });
};

export const useClientDecisions = () => {
    return useQuery({
      queryKey: ['client', 'decisions'],
      queryFn: async () => {
        const data = await fetchWithAuth('/api/decisions');
        return data.decisions || [];
      }
    });
};

export const useClientInvoices = () => {
    return useQuery({
      queryKey: ['client', 'invoices'],
      queryFn: async () => {
        const data = await fetchWithAuth('/api/invoices');
        return data.invoices || [];
      }
    });
};

// Admin Governance Hooks
export const useAdminRisks = (clientId) => {
  return useQuery({
    queryKey: ['admin', 'risks', clientId],
    queryFn: async () => {
      const query = clientId ? `?clientId=${clientId}` : '';
      const data = await fetchWithAuth(`/api/risks${query}`);
      return data.risks || [];
    },
    enabled: !!clientId
  });
};

export const useAdminDecisions = (clientId) => {
  return useQuery({
    queryKey: ['admin', 'decisions', clientId],
    queryFn: async () => {
      const query = clientId ? `?clientId=${clientId}` : '';
      const data = await fetchWithAuth(`/api/decisions${query}`);
      return data.decisions || [];
    },
    enabled: !!clientId
  });
};

export const useAdminInvoices = (clientId) => {
  return useQuery({
    queryKey: ['admin', 'invoices', clientId],
    queryFn: async () => {
      const query = clientId ? `?clientId=${clientId}` : '';
      const data = await fetchWithAuth(`/api/invoices${query}`);
      return data.invoices || [];
    },
    enabled: !!clientId
  });
};

export const useClientChangeRequests = () => {
    return useQuery({
      queryKey: ['client', 'change-requests'],
      queryFn: async () => {
        const data = await fetchWithAuth('/api/change-requests');
        return data.requests || [];
      }
    });
};

export const useAdminChangeRequests = (clientId) => {
    return useQuery({
      queryKey: ['admin', 'change-requests', clientId],
      queryFn: async () => {
        const query = clientId ? `?clientId=${clientId}` : '';
        const data = await fetchWithAuth(`/api/change-requests${query}`);
        return data.requests || [];
      },
      enabled: !!clientId
    });
};


// MNC Pillar 2: Business Context Hook
export const useProjectContext = (projectId) => {
    return useQuery({
        queryKey: ['project-context', projectId],
        queryFn: async () => {
            if (!projectId) return null;
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/projects/${projectId}/context`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.context;
        },
        enabled: !!projectId
    });
};

export const useAdminDeliverables = (clientId) => {

    return useQuery({
      queryKey: ['admin', 'deliverables', clientId],
      queryFn: async () => {
        const query = clientId ? `?clientId=${clientId}` : '';
        const data = await fetchWithAuth(`/api/deliverables${query}`);
        return data.deliverables || [];
      },
      enabled: !!clientId
    });
};

export const useAdminDocuments = (clientId) => {
    return useQuery({
      queryKey: ['admin', 'documents', clientId],
      queryFn: async () => {
        const query = clientId ? `?clientId=${clientId}` : '';
        const data = await fetchWithAuth(`/api/documents${query}`);
        // Fallback or transform if API returns different structure
        return data.documents || [];
      },
      enabled: !!clientId
    });
};

export const useClientDocuments = () => {
    return useQuery({
        queryKey: ['client', 'documents'],
        queryFn: async () => {
            const data = await fetchWithAuth('/api/documents/my-documents');
            return data.documents || [];
        }
    });
};



export const useAdminClientHealth = (clientId) => {
    return useQuery({
        queryKey: ['admin', 'client-health', clientId],
        queryFn: () => fetchWithAuth(`/api/client/metrics/health?clientId=${clientId}`),
        enabled: !!clientId
    });
};

export const useAdminClientROI = (clientId) => {
    return useQuery({
        queryKey: ['admin', 'client-roi', clientId],
        queryFn: () => fetchWithAuth(`/api/client/metrics/roi?clientId=${clientId}`),
        enabled: !!clientId
    });
};

export const useAdminClientVelocity = (clientId) => {
    return useQuery({
        queryKey: ['admin', 'client-velocity', clientId],
        queryFn: () => fetchWithAuth(`/api/client/metrics/velocity?clientId=${clientId}`),
        enabled: !!clientId
    });
};

export const useAdminClientPerception = (clientId) => {
    return useQuery({
        queryKey: ['admin', 'client-perception', clientId],
        queryFn: () => fetchWithAuth(`/api/client/metrics/perception?clientId=${clientId}`),
        enabled: !!clientId
    });
};

export const useAdminAuditLogs = (filter = {}) => {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filter],
    queryFn: async () => {
      const { page = 1, limit = 20, userId } = filter;
      let url = `/api/admin/audit-logs?page=${page}&limit=${limit}`;
      if (userId) url += `&userId=${userId}`;
      
      const data = await fetchWithAuth(url);
      return data; // Returns { logs: [], pagination: {} }
    }
  });
};
