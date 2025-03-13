import { transformCreditData } from '../../utils/formatting';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function useClientDashboard() {
  const creditGiven = usePage().props.client_credits_given;
  const creditTaken = usePage().props.client_credits_taken;
  const worstCreditStatus = usePage().props.worst_credit_status;

  function navigateToLeases(color) {
    Inertia.visit(reverseUrl('client-leases'), {
      data: {
        color,
      },
    });
  }

  const {
    totalCreditGiven,
    totalCreditTaken,
    creditGivenWithPercentages,
    creditTakenWithPercentages,
  } = transformCreditData(creditGiven, creditTaken);

  const data1 = {
    labels: [
      'Current',
      'Past Due 1-30 days',
      'Past Due 31-60 days',
      'Past Due 61-90 days',
      'Past Due 90+ days',
    ],
    datasets: [
      {
        label: '% of Total Credit Taken',
        data: creditGivenWithPercentages.map((item) => item.percentage),
        backgroundColor: ['green', 'orange', '#f87171', '#991b1b', 'black'],
        borderWidth: 0,
      },
    ],
  };

  const data2 = {
    labels: [
      'Current',
      'Past Due 1-30 days',
      'Past Due 31-60 days',
      'Past Due 61-90 days',
      'Past Due 90+ days',
    ],
    datasets: [
      {
        label: '% of Total Credit Given',
        data: creditTakenWithPercentages.map((item) => item.percentage),
        backgroundColor: ['green', 'orange', '#f87171', '#991b1b', 'black'],
        borderWidth: 0,
      },
    ],
  };

  return {
    data1,
    data2,
    totalCreditGiven,
    totalCreditTaken,
    worstCreditStatus,
    creditGivenWithPercentages,
    creditTakenWithPercentages,
    navigateToLeases,
  };
}
