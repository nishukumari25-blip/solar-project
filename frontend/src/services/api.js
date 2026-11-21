// Centralized API Client for Solaris EPC ERP Frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('solaris_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error ${endpoint}]:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => request('/auth/me'),
    getUsers: () => request('/auth/users'),
  },

  // Dashboard & Analytics
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getCharts: () => request('/dashboard/charts'),
  },

  // Leads & CRM
  crm: {
    getLeads: (params = '') => request(`/leads${params ? `?${params}` : ''}`),
    getLeadById: (id) => request(`/leads/${id}`),
    createLead: (leadData) => request('/leads', { method: 'POST', body: JSON.stringify(leadData) }),
    updateLead: (id, leadData) => request(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(leadData) }),
  },

  // Site Survey & Technical Design
  survey: {
    getSurveys: () => request('/surveys'),
    createSurvey: (surveyData) => request('/surveys', { method: 'POST', body: JSON.stringify(surveyData) }),
  },

  // Quotations & BOM
  quotations: {
    getQuotations: () => request('/quotations'),
    getQuotationById: (id) => request(`/quotations/${id}`),
    createQuotation: (quoteData) => request('/quotations', { method: 'POST', body: JSON.stringify(quoteData) }),
    convertToOrder: (id, params) => request(`/quotations/${id}/convert-to-order`, { method: 'POST', body: JSON.stringify(params) }),
    getBOMTemplates: () => request('/quotations/bom-templates'),
  },

  // Projects & Milestones
  projects: {
    getProjects: (params = '') => request(`/projects${params ? `?${params}` : ''}`),
    getProjectById: (id) => request(`/projects/${id}`),
    closeProject: (id) => request(`/projects/${id}/close`, { method: 'POST' }),
  },

  milestones: {
    getMilestones: (projectId = '') => request(`/milestones${projectId ? `?projectId=${projectId}` : ''}`),
    updateMilestone: (id, data) => request(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Procurement & Inventory
  procurement: {
    getVendors: () => request('/procurement/vendors'),
    createVendor: (vendorData) => request('/procurement/vendors', { method: 'POST', body: JSON.stringify(vendorData) }),
    getPRs: () => request('/procurement/purchase-requisitions'),
    getPOs: () => request('/procurement/purchase-orders'),
    createPO: (poData) => request('/procurement/purchase-orders', { method: 'POST', body: JSON.stringify(poData) }),
    getMaterials: () => request('/procurement/materials'),
    getLeftovers: () => request('/procurement/leftovers'),
    transferLeftover: (id, targetProject) => request(`/procurement/leftovers/${id}/transfer`, { method: 'POST', body: JSON.stringify({ targetProject }) }),
  },

  // GRN & Serial Numbers
  grn: {
    getGRNs: () => request('/grn'),
    createGRN: (grnData) => request('/grn', { method: 'POST', body: JSON.stringify(grnData) }),
    reverseGRN: (id, reversalReason) => request(`/grn/${id}/reverse`, { method: 'POST', body: JSON.stringify({ reversalReason }) }),
  },

  // Subsidy & DISCOM
  subsidy: {
    getSubsidies: () => request('/subsidy'),
    updateSubsidyStage: (id, stage) => request(`/subsidy/${id}`, { method: 'PUT', body: JSON.stringify({ stage }) }),
    getWCR: () => request('/subsidy/wcr'),
    getServiceOrders: () => request('/subsidy/service-orders'),
    getNetMetering: () => request('/subsidy/net-metering'),
  },

  // Finance & Accounts
  finance: {
    getCustomerPayments: () => request('/finance/payments'),
    recordPayment: (paymentData) => request('/finance/payments', { method: 'POST', body: JSON.stringify(paymentData) }),
    getBankLoans: () => request('/finance/bank-loans'),
    getInvoices: () => request('/finance/invoices'),
    getReceipts: () => request('/finance/receipts'),
    getVendorBills: () => request('/finance/vendor-bills'),
    getProjectPnL: () => request('/finance/pnl'),
  },

  // Approvals
  approvals: {
    getApprovals: (status = '') => request(`/approvals${status ? `?status=${status}` : ''}`),
    decideApproval: (id, isApproved, remarks) => request(`/approvals/${id}/decide`, { method: 'POST', body: JSON.stringify({ isApproved, remarks }) }),
  },

  // Notifications
  notifications: {
    getNotifications: () => request('/notifications'),
    markAllRead: () => request('/notifications/mark-read', { method: 'PUT' }),
  },

  // Settings
  settings: {
    getSettings: () => request('/settings'),
    updateCompany: (data) => request('/settings/company', { method: 'PUT', body: JSON.stringify(data) }),
    updateThresholds: (data) => request('/settings/thresholds', { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export default api;
