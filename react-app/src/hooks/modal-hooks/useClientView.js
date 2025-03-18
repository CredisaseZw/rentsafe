import axios from "axios";
import { useState } from "react";
import { mapToMessages, userFriendlyErrorOrResponse } from "../../utils";

export default function useClientView() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lease, setLease] = useState(null);

  function openClientView(lease, errMessage) {
    setLease(lease);
    setShowModal(true);
    setIsLoading(true);
    setError("");

    if (errMessage) {
      setError(errMessage);
      setData(null);
      setIsLoading(false);
      return;
    }

    axios(reverseUrl("client_details"), {
      params: { lease_id: lease.lease_id },
    })
      .then((res) => {
        const resData = {
          tenantName: lease.name,
          agedAnalysis: {
            oneTwentyDays: res.data.aged_analysis["120_days_plus"],
            ninetyDays: res.data.aged_analysis["90_days"],
            sixtyDays: res.data.aged_analysis["60_days"],
            thirtyDays: res.data.aged_analysis["30_days"],
            current: res.data.aged_analysis["current"],
          },
          contactDetails: {
            contactPerson: `${res.data["client"]["firstname"]} ${res.data["client"]["surname"]}`,
            smsNumber: res.data["client"]["sms_number"],
            otherNumbers: res.data["client"]["other_numbers"]
              ? res.data["client"]["other_numbers"].join(", ")
              : "",
            emailAddress: res.data["client"]["email"],
            address: res.data["client"]["address"],
          },
          paymentPlans: res.data["payment_plans"].map((plan) => ({
            id: plan.id,
            person: plan.spoke_with,
            date: plan.expected_pay_date,
            amount: plan.amount,
          })),
          communicationHistory: res.data["communication_history"].map((item) => ({
            text: item.message,
            timestamp: item.created_at,
            user: item.user_name,
            actionDone: item.action_done ? item.action_done : null,
            communicationType: item.type,
            data: null,
          })),
          debtorIntelligence:
            Object.values(res.data["debtor_intelligence"]).length &&
            Object.values(res.data["debtor_intelligence"]).every(Boolean)
              ? {
                  text: res.data["debtor_intelligence"]["note"],
                  timestamp: res.data["debtor_intelligence"]["updated_at"],
                  user: res.data["debtor_intelligence"]["user_name"],
                }
              : null,
          forecastInflows: {
            zeroToSevenDays: res.data["forecast_inflows"]["0-7"],
            eightToFourteenDays: res.data["forecast_inflows"]["8-14"],
            fourteenToTwentyOneDays: res.data["forecast_inflows"]["14-21"],
            twentyOnePlusDays: res.data["forecast_inflows"]["21+"],
            total: res.data["forecast_inflows"]["total"],
          },
        };

        resData.communicationHistory = resData.communicationHistory.concat(
          mapToMessages({
            works: res.data.works_data || [],
            maintenance: res.data.maintenance_data || [],
          })
        );

        console.log({ res, resData, lease });
        setData(resData);
        setError("");
        setIsLoading(false);
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setData(null);
        setIsLoading(false);
      });
  }

  function refreshClientViewData() {
    console.log("refreshing..");

    setIsLoading(true);
    setError("");

    axios(reverseUrl("client_details"), {
      params: { lease_id: lease.lease_id },
    })
      .then((res) => {
        const resData = {
          tenantName: lease.name,
          agedAnalysis: {
            oneTwentyDays: res.data.aged_analysis["120_days_plus"],
            ninetyDays: res.data.aged_analysis["90_days"],
            sixtyDays: res.data.aged_analysis["60_days"],
            thirtyDays: res.data.aged_analysis["30_days"],
            current: res.data.aged_analysis["current"],
          },
          contactDetails: {
            contactPerson: `${res.data["client"]["firstname"]} ${res.data["client"]["surname"]}`,
            smsNumber: res.data["client"]["sms_number"],
            otherNumbers: res.data["client"]["other_numbers"]
              ? res.data["client"]["other_numbers"].join(", ")
              : "",
            emailAddress: res.data["client"]["email"],
            address: res.data["client"]["address"],
          },
          paymentPlans: res.data["payment_plans"].map((plan) => ({
            id: plan.id,
            person: plan.spoke_with,
            date: plan.expected_pay_date,
            amount: plan.amount,
          })),
          communicationHistory: res.data["communication_history"].map((item) => ({
            text: item.message,
            timestamp: item.created_at,
            user: item.user_name,
            actionDone: item.action_done ? item.action_done : null,
            communicationType: item.type,
            data: null,
          })),
          debtorIntelligence:
            Object.values(res.data["debtor_intelligence"]).length &&
            Object.values(res.data["debtor_intelligence"]).every(Boolean)
              ? {
                  text: res.data["debtor_intelligence"]["note"],
                  timestamp: res.data["debtor_intelligence"]["updated_at"],
                  user: res.data["debtor_intelligence"]["user_name"],
                }
              : null,
          forecastInflows: {
            zeroToSevenDays: res.data["forecast_inflows"]["0-7"],
            eightToFourteenDays: res.data["forecast_inflows"]["8-14"],
            fourteenToTwentyOneDays: res.data["forecast_inflows"]["14-21"],
            twentyOnePlusDays: res.data["forecast_inflows"]["21+"],
            total: res.data["forecast_inflows"]["total"],
          },
        };

        resData.communicationHistory = resData.communicationHistory.concat(
          mapToMessages({
            works: res.data.works_data || [],
            maintenance: res.data.maintenance_data || [],
          })
        );

        console.log({ res, resData, lease });
        setData(resData);
        setError("");
        setIsLoading(false);
      })
      .catch((error) => {
        setError(userFriendlyErrorOrResponse(error));
        setData(null);
        setIsLoading(false);
      });
  }

  function hideClientView() {
    setShowModal(false);
  }

  return {
    showModal,
    openClientView,
    hideClientView,
    data,
    error,
    isLoading,
    clientId: lease ? lease.id : null,
    refreshClientViewData,
    lease,
  };
}
