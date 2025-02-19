import { useForm } from '@inertiajs/inertia-react';
import toast from 'react-hot-toast';
import { truncate } from 'lodash';
import { useState } from 'react';

export default function useReceipt(myKey, handleClose, leaseDetails) {
  const [minDate, setMinDate] = useState(
    leaseDetails?.opening_balance_date
      ? new Date(leaseDetails.opening_balance_date).toISOString().split('T')[0]
      : undefined
  );

  const { data, setData, post, reset, processing } = useForm({
    myKey,
    rows: leaseDetails
      ? [
          {
            id: 1,
            lease_id: leaseDetails.lease_id,
            paymentDate: new Date().toISOString().split('T')[0],
            tenant: leaseDetails.name,
            receiptNumber: '',
            details: '',
            currency: leaseDetails.currency,
            rent_owing: Number(leaseDetails.owing_amount),
            color: leaseDetails.color,
            paymentAmount: '',
            accountBalance: leaseDetails.owing_amount,
            opening_balance_date: leaseDetails.opening_balance_date,
            isVariable: leaseDetails.rent_variable,
            ...(leaseDetails.rent_variable
              ? {
                  baseAmount: '',
                  commission: '',
                  operatingCost: '',
                }
              : {}),
          },
        ]
      : initialRows,
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(reverseUrl('create_receipt_and_payment'), {
      onBefore: () => console.log(data),
      onSuccess: (res) => {
        console.log(res);
        if (res.props?.result === 'error') {
          toast.error(res.props?.result);
        } else {
          toast.success('Receipts created successfully');
          reset();
          handleClose();
        }
      },
      onError: (err) => {
        console.log(err);
        toast.error(
          'Something went wrong! Please try again: ' +
            JSON.stringify(truncate(err, 15))
        );
      },
    });
  }

  function addRow() {
    const newRow = { ...initialRows[0], id: data.rows.length + 1 };
    setData((prev) => ({ ...prev, rows: [...prev.rows, newRow] }));
  }

  function removeRow(index) {
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((row, i) => i !== index),
    }));
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'paymentDate') {
      const selectedDate = new Date(value);
      const openingBalanceDate = new Date(data.opening_balance_date);
      const maxDate = new Date(new Date().toISOString().split('T')[0]);

      // if (selectedDate < openingBalanceDate) {
      if (selectedDate < new Date(minDate)) {
        toast.error(
          `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
        );
        return;
      }

      if (selectedDate > maxDate) {
        toast.error(
          `You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.`
        );
        return;
      }
    }

    if (name === 'paymentAmount') {
      if (Number.isNaN(Number(value))) return;
    }

    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === index
          ? {
              ...row,
              [name]: value,
              accountBalance:
                name === 'paymentAmount'
                  ? Number(row.rent_owing) - Number(value)
                  : row.accountBalance,
            }
          : row
      ),
    }));
  };

  const handlePaymentAmount = (e, index) => {
    let { name, value } = e.target;

    if (value.includes('.') && !value.includes('..')) {
      const valueToAdd = Number(Number(value).toFixed(2));
      if (Number.isNaN(valueToAdd)) return;
      setData((prev) => ({
        ...prev,
        rows: prev.rows.map((row, i) =>
          i === index
            ? {
                ...row,
                [name]: value,
                paymentAmount:
                  name === 'baseAmount'
                    ? Number(row.operatingCost) +
                      Number(row.commission) +
                      valueToAdd
                    : name === 'operatingCost'
                      ? Number(row.baseAmount) +
                        Number(row.commission) +
                        valueToAdd
                      : name === 'commission'
                        ? Number(row.baseAmount) +
                          Number(row.operatingCost) +
                          valueToAdd
                        : valueToAdd,
                accountBalance:
                  Number(row.rent_owing) - Number(row.paymentAmount),
              }
            : row
        ),
      }));

      return;
    }

    if (value === '') {
      value = 0;
      setData((prev) => ({
        ...prev,
        rows: prev.rows.map((row, i) =>
          i === index
            ? {
                ...row,
                [name]: '',
                paymentAmount:
                  name === 'baseAmount'
                    ? Number(row.operatingCost) + Number(row.commission) + value
                    : name === 'operatingCost'
                      ? Number(row.baseAmount) + Number(row.commission) + value
                      : name === 'commission'
                        ? Number(row.baseAmount) +
                          Number(row.operatingCost) +
                          value
                        : value,
                accountBalance:
                  Number(row.rent_owing) - Number(row.paymentAmount),
              }
            : row
        ),
      }));

      return;
    }

    value = Number(value);
    if (Number.isNaN(value)) return;

    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === index
          ? {
              ...row,
              [name]: value,
              paymentAmount:
                name === 'baseAmount'
                  ? Number(row.operatingCost) + Number(row.commission) + value
                  : name === 'operatingCost'
                    ? Number(row.baseAmount) + Number(row.commission) + value
                    : name === 'commission'
                      ? Number(row.baseAmount) +
                        Number(row.operatingCost) +
                        value
                      : value,
              accountBalance:
                Number(row.rent_owing) - (Number(row.paymentAmount) + value),
            }
          : row
      ),
    }));
  };

  const handleTenantSelect = (selectedTenantData, index) => {
    if (!selectedTenantData) return;
    console.log(selectedTenantData);

    setMinDate(
      new Date(selectedTenantData.opening_balance_date)
        .toISOString()
        .split('T')[0]
    );

    setData((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) =>
        i === index
          ? {
              ...row,
              tenant: selectedTenantData.tenant,
              lease_id: selectedTenantData.lease_id,
              currency: selectedTenantData.Currency,
              opening_balance_date: selectedTenantData.opening_balance_date,
              rent_owing: selectedTenantData.rent_owing,
              accountBalance:
                selectedTenantData.rent_owing - (row.paymentAmount || ''),
              color: selectedTenantData.color,
              isVariable: selectedTenantData.is_variable,
              ...(selectedTenantData.is_variable
                ? {
                    baseAmount: '',
                    commission: '',
                    operatingCost: '',
                  }
                : {}),
            }
          : row
      ),
    }));
  };

  return {
    data,
    minDate,
    processing,
    addRow,
    removeRow,
    handleSubmit,
    handleInputChange,
    handleTenantSelect,
    handlePaymentAmount,
  };
}

const initialRows = [
  {
    id: 1,
    paymentDate: new Date().toISOString().split('T')[0],
    tenant: '',
    receiptNumber: '',
    details: '',
    currency: '',
    rent_owing: '',
    color: '',
    paymentAmount: '',
    accountBalance: '',
    opening_balance_date: '',
    isVariable: false,
  },
];
