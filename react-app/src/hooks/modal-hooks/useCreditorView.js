import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { mapToMessages, userFriendlyErrorOrResponse } from '../../utils';

export default function useCreditorView() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creditor, setCreditor] = useState(null);

  function openCreditorView(creditor, errMessage) {
    setCreditor(creditor);
    setShowModal(true);
    setIsLoading(true);
    setError('');

    if (errMessage) {
      setError(errMessage);
      setData(null);
      setIsLoading(false);
      return;
    }

    axios(reverseUrl('creditor_details'), {
      params: { creditor_id: creditor.creditor_id },
    })
      .then((res) => {
        const resData = {
          isCreditorView: true,
          tenantName: creditor.creditor_name,
          agedAnalysis: {
            oneTwentyDays: res.data.aged_analysis['120_days_plus'],
            ninetyDays: res.data.aged_analysis['90_days'],
            sixtyDays: res.data.aged_analysis['60_days'],
            thirtyDays: res.data.aged_analysis['30_days'],
            current: res.data.aged_analysis['current'],
          },
          contactDetails: {
            contactPerson: `${res.data['creditor']['firstname']} ${res.data['creditor']['surname']}`,
            smsNumber: res.data['creditor']['sms_number'],
            otherNumbers: res.data['creditor']['other_number'],
            emailAddress: res.data['creditor']['email'],
            address: res.data['creditor']['address'],
          },
          paymentPlans: res.data['payment_plans'].map((plan) => ({
            id: plan.id,
            person: plan.spoke_with,
            date: plan.expected_pay_date,
            amount: plan.amount,
          })),
          communicationHistory: res.data['communication_history'].map(
            (item) => ({
              text: item.message,
              timestamp: item.created_at,
              user: item.user_name,
              actionDone: item.action_done ? item.action_done : null,
              communicationType: item.type,
              data: null,
            })
          ),
          debtorIntelligence:
            Object.values(res.data['debtor_intelligence']).length &&
            Object.values(res.data['debtor_intelligence']).every(Boolean)
              ? {
                  text: res.data['debtor_intelligence']['note'],
                  timestamp: res.data['debtor_intelligence']['updated_at'],
                  user: res.data['debtor_intelligence']['user_name'],
                }
              : null,
          forecastInflows: {
            zeroToSevenDays: res.data['forecast_inflows']['0-7'],
            eightToFourteenDays: res.data['forecast_inflows']['8-14'],
            fourteenToTwentyOneDays: res.data['forecast_inflows']['14-21'],
            twentyOnePlusDays: res.data['forecast_inflows']['21+'],
            total: res.data['forecast_inflows']['total'],
          },
        };

        resData.communicationHistory = resData.communicationHistory.concat(
          mapToMessages({
            works: res.data.works_data || [],
            maintenance: res.data.maintenance_data || [],
          })
        );

        console.log({ res, resData, creditor });
        setData(resData);
        setError('');
        setIsLoading(false);
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setData(null);
        setIsLoading(false);
      });
  }

  function refreshCreditorViewData() {
    console.log('refreshing..');

    setIsLoading(true);
    setError('');

    axios(reverseUrl('creditor_details'), {
      params: { creditor_id: creditor.creditor_id },
    })
      .then((res) => {
        const resData = {
          isCreditorView: true,
          tenantName: creditor.creditor_name,
          agedAnalysis: {
            oneTwentyDays: res.data.aged_analysis['120_days_plus'],
            ninetyDays: res.data.aged_analysis['90_days'],
            sixtyDays: res.data.aged_analysis['60_days'],
            thirtyDays: res.data.aged_analysis['30_days'],
            current: res.data.aged_analysis['current'],
          },
          contactDetails: {
            contactPerson: `${res.data['creditor']['firstname']} ${res.data['creditor']['surname']}`,
            smsNumber: res.data['creditor']['sms_number'],
            otherNumbers: res.data['creditor']['other_number'],
            emailAddress: res.data['creditor']['email'],
            address: res.data['creditor']['address'],
          },
          paymentPlans: res.data['payment_plans'].map((plan) => ({
            id: plan.id,
            person: plan.spoke_with,
            date: plan.expected_pay_date,
            amount: plan.amount,
          })),
          communicationHistory: res.data['communication_history'].map(
            (item) => ({
              text: item.message,
              timestamp: item.created_at,
              user: item.user_name,
              actionDone: item.action_done ? item.action_done : null,
              communicationType: item.type,
              data: null,
            })
          ),
          debtorIntelligence:
            Object.values(res.data['debtor_intelligence']).length &&
            Object.values(res.data['debtor_intelligence']).every(Boolean)
              ? {
                  text: res.data['debtor_intelligence']['note'],
                  timestamp: res.data['debtor_intelligence']['updated_at'],
                  user: res.data['debtor_intelligence']['user_name'],
                }
              : null,
          forecastInflows: {
            zeroToSevenDays: res.data['forecast_inflows']['0-7'],
            eightToFourteenDays: res.data['forecast_inflows']['8-14'],
            fourteenToTwentyOneDays: res.data['forecast_inflows']['14-21'],
            twentyOnePlusDays: res.data['forecast_inflows']['21+'],
            total: res.data['forecast_inflows']['total'],
          },
        };

        resData.communicationHistory = resData.communicationHistory.concat(
          mapToMessages({
            works: res.data.works_data || [],
            maintenance: res.data.maintenance_data || [],
          })
        );

        console.log({ res, resData, creditor });
        setData(resData);
        setError('');
        setIsLoading(false);
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setData(null);
        setIsLoading(false);
      });
  }

  function hideCreditorView() {
    setShowModal(false);
  }

  return {
    data,
    error,
    isLoading,
    showModal,
    lease: creditor,
    clientId: creditor ? creditor.creditor_id : null,
    refreshCreditorViewData,
    openCreditorView,
    hideCreditorView,
    creditorName: creditor ? creditor.creditor_name : '',
  };
}
