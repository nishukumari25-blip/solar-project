import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import * as mock from '../data/mockData';

const ERPContext = createContext();

export const ERPProvider = ({ children }) => {
  // State slices initialized with mock data as fallback during initial render/boot
  const [company, setCompany] = useState(mock.INITIAL_COMPANY);
  const [thresholds, setThresholds] = useState(mock.INITIAL_THRESHOLDS);
  const [leads, setLeads] = useState(mock.INITIAL_LEADS);
  const [surveys, setSurveys] = useState(mock.INITIAL_SURVEYS);
  const [bomTemplates, setBomTemplates] = useState(mock.INITIAL_BOM_TEMPLATES);
  const [quotations, setQuotations] = useState(mock.INITIAL_QUOTATIONS);
  const [projects, setProjects] = useState(mock.INITIAL_PROJECTS);
  const [milestones, setMilestones] = useState(mock.INITIAL_MILESTONES);
  const [vendors, setVendors] = useState(mock.INITIAL_VENDORS);
  const [prs, setPrs] = useState(mock.INITIAL_PURCHASE_REQUISITIONS);
  const [pos, setPos] = useState(mock.INITIAL_PURCHASE_ORDERS);
  const [grns, setGrns] = useState(mock.INITIAL_GRNS);
  const [serials, setSerials] = useState(mock.INITIAL_SERIALS);
  const [projectMaterials, setProjectMaterials] = useState(mock.INITIAL_PROJECT_MATERIALS);
  const [leftovers, setLeftovers] = useState(mock.INITIAL_LEFTOVERS);
  const [subsidies, setSubsidies] = useState(mock.INITIAL_SUBSIDIES);
  const [bankLoans, setBankLoans] = useState(mock.INITIAL_BANK_LOANS);
  const [customerPayments, setCustomerPayments] = useState(mock.INITIAL_CUSTOMER_PAYMENTS);
  const [invoices, setInvoices] = useState(mock.INITIAL_INVOICES);
  const [receipts, setReceipts] = useState(mock.INITIAL_RECEIPTS);
  const [vendorBills, setVendorBills] = useState(mock.INITIAL_VENDOR_BILLS);
  const [projectPnl, setProjectPnl] = useState(mock.INITIAL_PROJECT_PNL);
  const [approvals, setApprovals] = useState(mock.INITIAL_APPROVALS);
  const [notifications, setNotifications] = useState(mock.INITIAL_NOTIFICATIONS);

  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Fetch all live records from backend API
  const refreshData = useCallback(async () => {
    try {
      const [
        leadsRes,
        surveysRes,
        bomRes,
        quotesRes,
        projectsRes,
        milestonesRes,
        vendorsRes,
        prsRes,
        posRes,
        grnsRes,
        materialsRes,
        leftoversRes,
        subsidiesRes,
        loansRes,
        paymentsRes,
        invoicesRes,
        receiptsRes,
        billsRes,
        pnlRes,
        approvalsRes,
        notifsRes,
        settingsRes,
      ] = await Promise.all([
        api.crm.getLeads(),
        api.survey.getSurveys(),
        api.quotations.getBOMTemplates(),
        api.quotations.getQuotations(),
        api.projects.getProjects(),
        api.milestones.getMilestones(),
        api.procurement.getVendors(),
        api.procurement.getPRs(),
        api.procurement.getPOs(),
        api.grn.getGRNs(),
        api.procurement.getMaterials(),
        api.procurement.getLeftovers(),
        api.subsidy.getSubsidies(),
        api.finance.getBankLoans(),
        api.finance.getCustomerPayments(),
        api.finance.getInvoices(),
        api.finance.getReceipts(),
        api.finance.getVendorBills(),
        api.finance.getProjectPnL(),
        api.approvals.getApprovals(),
        api.notifications.getNotifications(),
        api.settings.getSettings(),
      ]);

      if (leadsRes?.data) setLeads(leadsRes.data);
      if (surveysRes?.data) setSurveys(surveysRes.data);
      if (bomRes?.data) setBomTemplates(bomRes.data);
      if (quotesRes?.data) setQuotations(quotesRes.data);
      if (projectsRes?.data) setProjects(projectsRes.data);
      if (milestonesRes?.data) setMilestones(milestonesRes.data);
      if (vendorsRes?.data) setVendors(vendorsRes.data);
      if (prsRes?.data) setPrs(prsRes.data);
      if (posRes?.data) setPos(posRes.data);
      if (grnsRes?.data) setGrns(grnsRes.data);
      if (materialsRes?.data) setProjectMaterials(materialsRes.data);
      if (leftoversRes?.data) setLeftovers(leftoversRes.data);
      if (subsidiesRes?.data) setSubsidies(subsidiesRes.data);
      if (loansRes?.data) setBankLoans(loansRes.data);
      if (paymentsRes?.data) setCustomerPayments(paymentsRes.data);
      if (invoicesRes?.data) setInvoices(invoicesRes.data);
      if (receiptsRes?.data) setReceipts(receiptsRes.data);
      if (billsRes?.data) setVendorBills(billsRes.data);
      if (pnlRes?.data) setProjectPnl(pnlRes.data);
      if (approvalsRes?.data) setApprovals(approvalsRes.data);
      if (notifsRes?.data) setNotifications(notifsRes.data);
      if (settingsRes?.data) {
        if (settingsRes.data.company) setCompany(settingsRes.data.company);
        if (settingsRes.data.thresholds) setThresholds(settingsRes.data.thresholds);
      }

      setIsLiveConnected(true);
    } catch (err) {
      console.log('[ERPContext] API sync fallback:', err.message);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Push notification helper
  const addNotification = async (title, message, type = 'info', targetPath = '/') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      targetPath,
      unread: true,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // --- CRM & LEADS ---
  const addLead = async (leadData) => {
    try {
      const res = await api.crm.createLead(leadData);
      if (res.data) {
        setLeads((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      // If backend fails, throw to UI
      throw err;
    }
  };

  const updateLead = async (id, updatedFields) => {
    try {
      const res = await api.crm.updateLead(id, updatedFields);
      if (res.data) {
        setLeads((prev) => prev.map((l) => (l._id === id || l.id === id ? res.data : l)));
        return res.data;
      }
    } catch (err) {
      setLeads((prev) => prev.map((l) => (l._id === id || l.id === id ? { ...l, ...updatedFields } : l)));
    }
  };

  // --- SITE SURVEY & DESIGN ---
  const addSurvey = async (surveyData) => {
    try {
      const res = await api.survey.createSurvey(surveyData);
      if (res.data) {
        setSurveys((prev) => [res.data, ...prev]);
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- QUOTATIONS ---
  const addQuotation = async (quoteData) => {
    try {
      const res = await api.quotations.createQuotation(quoteData);
      if (res.data) {
        setQuotations((prev) => [res.data, ...prev]);
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- ATOMIC CONVERSION TO ORDER ---
  const convertQuotationToOrder = async (quoteId, conversionParams) => {
    try {
      const res = await api.quotations.convertToOrder(quoteId, conversionParams);
      if (res.data) {
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- PROJECTS & CLOSURE ---
  const closeProject = async (projectId) => {
    try {
      const res = await api.projects.closeProject(projectId);
      if (res.data) {
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- MILESTONES ---
  const updateMilestone = async (id, data) => {
    try {
      const res = await api.milestones.updateMilestone(id, data);
      if (res.data) {
        setMilestones((prev) => prev.map((m) => (m._id === id || m.id === id ? res.data : m)));
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- PROCUREMENT ---
  const addVendor = async (vendorData) => {
    try {
      const res = await api.procurement.createVendor(vendorData);
      if (res.data) {
        setVendors((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const addPO = async (poData) => {
    try {
      const res = await api.procurement.createPO(poData);
      if (res.data) {
        setPos((prev) => [res.data, ...prev]);
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- SITE GRN ---
  const addGRN = async (grnData) => {
    try {
      const res = await api.grn.createGRN(grnData);
      if (res.data) {
        setGrns((prev) => [res.data, ...prev]);
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- SUBSIDY ---
  const updateSubsidyStage = async (id, stage) => {
    try {
      const res = await api.subsidy.updateSubsidyStage(id, stage);
      if (res.data) {
        setSubsidies((prev) => prev.map((s) => (s._id === id || s.id === id ? res.data : s)));
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- FINANCE ---
  const recordCustomerPayment = async (paymentData) => {
    try {
      const res = await api.finance.recordPayment(paymentData);
      if (res.data) {
        await refreshData();
        return res.data.payment;
      }
    } catch (err) {
      throw err;
    }
  };

  // --- APPROVALS ---
  const processApproval = async (approvalId, isApproved, remarks) => {
    try {
      const res = await api.approvals.decideApproval(approvalId, isApproved, remarks);
      if (res.data) {
        await refreshData();
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // Reset Demo State
  const resetDemoData = async () => {
    localStorage.clear();
    setCompany(mock.INITIAL_COMPANY);
    setThresholds(mock.INITIAL_THRESHOLDS);
    setLeads(mock.INITIAL_LEADS);
    setSurveys(mock.INITIAL_SURVEYS);
    setBomTemplates(mock.INITIAL_BOM_TEMPLATES);
    setQuotations(mock.INITIAL_QUOTATIONS);
    setProjects(mock.INITIAL_PROJECTS);
    setMilestones(mock.INITIAL_MILESTONES);
    setVendors(mock.INITIAL_VENDORS);
    setPrs(mock.INITIAL_PURCHASE_REQUISITIONS);
    setPos(mock.INITIAL_PURCHASE_ORDERS);
    setGrns(mock.INITIAL_GRNS);
    setSerials(mock.INITIAL_SERIALS);
    setProjectMaterials(mock.INITIAL_PROJECT_MATERIALS);
    setLeftovers(mock.INITIAL_LEFTOVERS);
    setSubsidies(mock.INITIAL_SUBSIDIES);
    setBankLoans(mock.INITIAL_BANK_LOANS);
    setCustomerPayments(mock.INITIAL_CUSTOMER_PAYMENTS);
    setInvoices(mock.INITIAL_INVOICES);
    setReceipts(mock.INITIAL_RECEIPTS);
    setVendorBills(mock.INITIAL_VENDOR_BILLS);
    setProjectPnl(mock.INITIAL_PROJECT_PNL);
    setApprovals(mock.INITIAL_APPROVALS);
    setNotifications(mock.INITIAL_NOTIFICATIONS);
    await refreshData();
  };

  return (
    <ERPContext.Provider
      value={{
        isLoading,
        isLiveConnected,
        refreshData,
        company, setCompany,
        thresholds, setThresholds,
        leads, addLead, updateLead,
        surveys, addSurvey,
        bomTemplates, setBomTemplates,
        quotations, addQuotation, convertQuotationToOrder,
        projects, closeProject,
        milestones, updateMilestone,
        vendors, addVendor, setVendors,
        prs, setPrs,
        pos, addPO, setPos,
        grns, addGRN,
        serials,
        projectMaterials,
        leftovers, setLeftovers,
        subsidies, updateSubsidyStage,
        bankLoans, setBankLoans,
        customerPayments, recordCustomerPayment,
        invoices, setInvoices,
        receipts,
        vendorBills, setVendorBills,
        projectPnl,
        approvals, processApproval,
        notifications, addNotification,
        resetDemoData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => useContext(ERPContext);
