export function formatDetailedTenantStatementData(payments, invoices) {
  return [...payments, ...invoices]
    .sort((a, b) => new Date(a.date_updated) - new Date(b.date_updated))
    .map((item) => ({
      ...item,
      type: item.reference === 'cash-receipt' ? 'payment' : 'invoice',
    }));
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
};

export const transformCreditData = (creditGiven, creditTaken) => {
  const statusLabels = {
    safe: 'Current',
    low: 'Past Due 1-30 days',
    medium: 'Past Due 31-60 days',
    high: 'Past Due 61-90 days',
    'non-payer': 'Past Due 90+ days',
  };

  const transformCredit = (creditData, bgColorMap) => {
    const transformedCredit = creditData.map((item) => ({
      label: statusLabels[item.status] || 'Current',
      amount: item.amount_owing || 0,
      bg: bgColorMap[item.status] || 'green',
    }));

    Object.values(statusLabels).forEach((label) => {
      if (!transformedCredit.some((item) => item.label === label)) {
        const bgColor =
          label === 'Current'
            ? 'green'
            : label === 'Past Due 1-30 days'
              ? 'orange'
              : label === 'Past Due 31-60 days'
                ? '#f87171'
                : label === 'Past Due 61-90 days'
                  ? '#991b1b'
                  : 'black';
        transformedCredit.push({
          label,
          amount: 0,
          bg: bgColor,
        });
      }
    });

    transformedCredit.sort((a, b) => {
      const labelOrder = [
        'Current',
        'Past Due 1-30 days',
        'Past Due 31-60 days',
        'Past Due 61-90 days',
        'Past Due 90+ days',
      ];
      return labelOrder.indexOf(a.label) - labelOrder.indexOf(b.label);
    });

    return transformedCredit;
  };

  const bgColorMap = {
    safe: 'green',
    low: 'orange',
    medium: '#f87171',
    high: '#991b1b',
    'non-payer': 'black',
  };

  const transformedCreditGiven = transformCredit(creditGiven, bgColorMap);
  const transformedCreditTaken = transformCredit(creditTaken, bgColorMap);

  const totalCreditGiven =
    transformedCreditGiven.reduce((acc, item) => acc + item.amount, 0) || 0;
  const totalCreditTaken =
    transformedCreditTaken.reduce((acc, item) => acc + item.amount, 0) || 0;

  const creditGivenWithPercentages = transformedCreditGiven.map((item) => ({
    ...item,
    percentage: Math.round((item.amount / totalCreditGiven) * 100, 2) || 0,
  }));

  const creditTakenWithPercentages = transformedCreditTaken.map((item) => ({
    ...item,
    percentage: Math.round((item.amount / totalCreditTaken) * 100, 2) || 0,
  }));

  return {
    creditGivenWithPercentages,
    creditTakenWithPercentages,
    totalCreditGiven,
    totalCreditTaken,
  };
};
