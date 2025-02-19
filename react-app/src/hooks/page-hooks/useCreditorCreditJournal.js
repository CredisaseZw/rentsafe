import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

export default function useCreditorCreditJournal() {
  const [rows, setRows] = useState(initialRows);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e, index) {
    const { name, value } = e.target;
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        index === rowIndex ? { ...row, [name]: value } : row
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(reverseUrl('creditor_credit_journal'), { rows })
      .then((res) => {
        console.log(res);
        if (res.data.error) throw new Error(res.data.error);
        toast.success('Journal entry(s) created successfully');
        setRows([
          {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            creditorName: '',
            details: '',
            accountBalance: '',
            creditAmount: '',
            endBalance: '',
            leaseId: '',
            accountBalance: '',
            endDate: '',
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to submit data \n' + error);
      });

    setIsLoading(false);
  }

  function removeRow(index) {
    setRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        ...{
          id: prev.length + 1,
          date: new Date().toISOString().split('T')[0],
          creditorName: '',
          details: '',
          accountBalance: '',
          endBalance: '',
          creditAmount: '',
          leaseId: '',
          accountBalance: '',
          endDate: '',
        },
      },
    ]);
  }

  return {
    rows,
    isLoading,
    addRow,
    setRows,
    removeRow,
    handleSubmit,
    handleInputChange,
  };
}

const initialRows = [
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    creditorName: '',
    details: '',
    accountBalance: '',
    creditAmount: '',
    endBalance: '',
    leaseId: '',
    accountBalance: '',
    endDate: '',
  },
];
