import moment from 'moment';
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { userFriendlyErrorOrResponse } from '../../utils/index.js';
import { Inertia } from '@inertiajs/inertia';

export default function useInvoicing({
  tenant_list: invoices,
  errors,
  result,
  status,
  message,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceToDismiss, setInvoiceToDismiss] = useState(null);
  const today = new Date();

  const usdInvoices =
    invoices?.filter(
      (invoice) => invoice.lease_currency_type.toUpperCase() === 'USD'
    ) || [];

  const zwlInvoices =
    invoices?.filter(
      (invoice) => invoice.lease_currency_type.toUpperCase() === 'ZWG'
    ) || [];

  const [usdBatchTotal, setUsdBatchTotal] = useState(
    usdInvoices?.reduce((acc, curr) => acc + Number(curr.owing_amount), 0) || 0
  );

  const [zwlBatchTotal, setZwlBatchTotal] = useState(
    zwlInvoices?.reduce((acc, curr) => acc + Number(curr.owing_amount), 0) || 0
  );

  const [usdState, usdDispatch] = useReducer(
    usdReducer,
    usdInvoices.map((invoice) => ({
      ...invoice,
      invoice_date: today.toISOString().split('T')[0],
      edited: false,
      total: invoice?.owing_amount || 0,
      operationalCosts: '',
      tenant_acc_no: '',
      invoice_no: '',
    }))
  );

  const [zwlState, zwlDispatch] = useReducer(
    zwlReducer,
    zwlInvoices.map((invoice) => ({
      ...invoice,
      invoice_date: today.toISOString().split('T')[0],
      edited: false,
      total: invoice?.owing_amount || '',
      operationalCosts: '',
      tenant_acc_no: '',
      invoice_no: '',
    }))
  );

  function usdReducer(state, action) {
    switch (action.type) {
      case 'updateBaseRental':
        let newState = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                owing_amount: action.owing_amount,
                edited: true,
                total:
                  Number(invoice.operationalCosts) +
                  Number(action.owing_amount),
              }
            : invoice
        );
        setUsdBatchTotal(
          newState.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState;
      case 'updateInvDate':
        let newState8 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                invoice_date: action.invoice_date,
                edited: true,
              }
            : invoice
        );
        setUsdBatchTotal(
          newState8.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState8;

      case 'updateInvNumber':
        let newState9 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                invoice_no: action.invoice_no,
                edited: true,
              }
            : invoice
        );
        setUsdBatchTotal(
          newState9.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState9;
      case 'updateTenantAccNumber':
        let newState10 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                tenant_acc_no: action.tenant_acc_no,
                edited: true,
              }
            : invoice
        );
        setUsdBatchTotal(
          newState10.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState10;
      case 'updateOperatingCosts':
        let newState2 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                edited: true,
                operationalCosts: action.operationalCosts,
                total:
                  Number(invoice.owing_amount) +
                  Number(action.operationalCosts),
              }
            : invoice
        );
        setUsdBatchTotal(
          newState2.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState2;
      case 'filterSubmittedInvoices':
        let newState3 = state.filter(
          (item) => !action.idsToFilter.includes(item.id)
        );
        setUsdBatchTotal(
          newState3.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState3;
      default:
        return state;
    }
  }

  function zwlReducer(state, action) {
    switch (action.type) {
      case 'updateBaseRental':
        let newState = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                owing_amount: action.owing_amount,
                edited: true,
                total:
                  Number(invoice.operationalCosts) +
                  Number(action.owing_amount),
              }
            : invoice
        );
        setZwlBatchTotal(
          newState.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState;
      case 'updateInvDate':
        let newState9 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                invoice_date: action.invoice_date,
                edited: true,
              }
            : invoice
        );
        setZwlBatchTotal(
          newState9.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState9;
      case 'updateInvNumber':
        let newState11 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                invoice_no: action.invoice_no,
                edited: true,
              }
            : invoice
        );
        setZwlBatchTotal(
          newState11.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState11;
      case 'updateTenantAccNumber':
        let newState13 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                tenant_acc_no: action.tenant_acc_no,
                edited: true,
              }
            : invoice
        );
        setZwlBatchTotal(
          newState13.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState13;
      case 'updateOperatingCosts':
        let newState2 = state.map((invoice) =>
          invoice.id === action.id
            ? {
                ...invoice,
                edited: true,
                operationalCosts: action.operationalCosts,
                total:
                  Number(invoice.owing_amount) +
                  Number(action.operationalCosts),
              }
            : invoice
        );
        setZwlBatchTotal(
          newState2.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState2;
      case 'filterSubmittedInvoices':
        let newState3 = state.filter(
          (item) => !action.idsToFilter.includes(item.id)
        );
        setZwlBatchTotal(
          newState3.reduce((acc, curr) => acc + Number(curr.total), 0)
        );
        return newState3;
      default:
        return state;
    }
  }

  async function submitData() {
    setIsLoading(true);
    const data = [];
    const idsToFilter = [];

    usdState.forEach((item) => {
      if (item.edited) {
        data.push({
          leaseId: item.id,
          invoiceDate: item.invoice_date,
          baseRental: item.owing_amount,
          operationCosts: item.operationalCosts,
          invoiceNumber: item.invoice_no,
          tenantAccNumber: item.tenant_acc_no,
        });
        idsToFilter.push(item.id);
      }
    });

    zwlState.forEach((item) => {
      if (item.edited) {
        data.push({
          leaseId: item.id,
          invoiceDate: item.invoice_date,
          baseRental: item.owing_amount,
          operationCosts: item.operationalCosts,
          invoiceNumber: item.invoice_no,
          tenantAccNumber: item.tenant_acc_no,
        });
        idsToFilter.push(item.id);
      }
    });

    if (data.length === 0) {
      setIsLoading(false);
      toast.error('No changes detected, please fill in at least one invoice', {
        icon: '❌',
        duration: 5000,
      });
      return;
    }

    try {
      console.log({ data });
      await axios.post(reverseUrl('client_invoice'), data);
      usdDispatch({ type: 'filterSubmittedInvoices', idsToFilter });
      zwlDispatch({ type: 'filterSubmittedInvoices', idsToFilter });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError)
        toast.error(`An error occurred! ${error.response.statusText}`);
      else {
        toast.error(`An error occurred! ${JSON.stringify(error)}`, {
          icon: '❌',
        });
      }
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (errors) {
      console.log(errors);
      toast.error('Error: ' + JSON.stringify(errors), {
        duration: 5000,
        icon: '❌',
      });
    } else if (result === 'success' && message) {
      toast.success(message, { duration: 5000, icon: '✔' });
    }
  }, [errors, result, message]);

  const headerDate =
    moment().date() > 8 && moment().date() < 25
      ? moment().subtract(1, 'months').format('MMMM YYYY')
      : moment().format('MMMM YYYY');

  console.log({
    allState: {
      invoices,
      errors,
      result,
      status,
      message,
      usdBatchTotal,
      zwlBatchTotal,
      usdState,
      zwlState,
      isLoading,
      headerDate,
    },
  });

  const pastDue = invoices?.some(
    (inv) =>
      !!(today.getDate() < inv.payment_period_start && today.getDate() > 8)
  );

  function confirmDismissal() {
    setIsLoading(true);
    const idsToFilter = [invoiceToDismiss.id];
    const data = [
      {
        leaseId: invoiceToDismiss.id,
        invoiceDate: invoiceToDismiss.invoice_date,
        baseRental: invoiceToDismiss.owing_amount,
        operationCosts: invoiceToDismiss.operationalCosts,
        invoiceNumber: invoiceToDismiss.invoice_no,
        tenantAccNumber: invoiceToDismiss.tenant_acc_no,
        terminated: true,
      },
    ];
    console.log({ invoiceToDismiss, data });

    Inertia.post(reverseUrl('client_invoice'), data, {
      onSuccess: (page) => {
        console.log(page);
        usdDispatch({ type: 'filterSubmittedInvoices', idsToFilter });
        zwlDispatch({ type: 'filterSubmittedInvoices', idsToFilter });
        setInvoiceToDismiss(null);
      },
      onError: (errors) => {
        console.log(errors);
        setInvoiceToDismiss(null);
      },
    });
    setIsLoading(false);
  }

  return {
    today,
    pastDue,
    usdBatchTotal,
    zwlBatchTotal,
    usdState,
    zwlState,
    isLoading,
    headerDate,
    invoiceToDismiss,
    usdDispatch,
    zwlDispatch,
    submitData,
    confirmDismissal,
    setInvoiceToDismiss,
  };
}
