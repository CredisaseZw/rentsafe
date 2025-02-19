import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils';

export default function useWorksAndMaintenance(
  leaseId,
  creditorId,
  refresh,
  viewDefaults
) {
  const [isLoading, setIsLoading] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState(
    viewDefaults ? (viewDefaults.isWorks ? 'works' : 'maintenance') : 'works'
  );
  const [oncePerMonths, setOncePerMonths] = useState(2);
  const [maintenanceFrequency, setMaintenanceFrequency] = useState('weekly');

  async function submitWorks(e) {
    e.preventDefault();
    setIsLoading(true);
    setWasSuccessful(false);
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const data = {
      property: formData.property,
      tenant_landlord: formData.tenant_landlord,
      tradesman: formData.tradesman,
      reason: formData.reason,
      budget: formData.budget,
      title: formData.works_title,
      details: formData.works_detail,
      contractor: formData.contractor_name,
      required_materials: formData.required,
      responsible_person: formData.whose_account,
      scheduled_date: formData.date_schedule,
      ...(creditorId ? { creditor_id: creditorId } : {}),
      lease_id: leaseId,
    };

    console.log({ formData, data });
    axios
      .post(reverseUrl('create_work_schedule'), data)
      .then((res) => {
        console.log(res);
        toast.success('Works data submitted!');
        setWasSuccessful(true);
        refresh();
      })
      .catch((error) => {
        console.log(error);
        toast.error(userFriendlyErrorOrResponse(error));
      });

    setIsLoading(false);
  }

  async function submitMaintenance(e) {
    e.preventDefault();
    setIsLoading(true);
    setWasSuccessful(false);
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const data = {
      property: formData.property,
      tenant_landlord: formData.tenant_landlord,
      details: formData.maintenance_detail,
      title: formData.maintenance_title,
      tradesman: formData.tradesman,
      contractor: formData.contractor_name,
      required_materials: formData.required,
      budget: formData.budget,
      responsible_person: formData.whose_account,
      reason: formData.reason,
      frequency: formData.frequency,
      scheduled_day: formData.day_date,
      ...(formData.frequency === 'once_per'
        ? {
            month_frequency: Number(formData.month_frequency),
          }
        : {}),
      ...(creditorId ? { creditor_id: creditorId } : {}),
      lease_id: leaseId,
    };

    console.log({ data, formData });
    axios
      .post(reverseUrl('create_maintenance_schedule'), data)
      .then((res) => {
        console.log(res);
        toast.success('Maintenance data submited!');
        setWasSuccessful(true);
        refresh();
      })
      .catch((error) => {
        console.log(error);
        toast.error(userFriendlyErrorOrResponse(error));
      });

    setIsLoading(false);
  }

  function validateAndSetMonths(e) {
    setMaintenanceFrequency('once_per');
    if (e.target.value.trim() === '') {
      setOncePerMonths('');
      return;
    }
    let value = Number(e.target.value);
    if (Number.isNaN(value) || value < 1 || value > 999) return;
    setOncePerMonths(value);
  }

  return {
    activeTab,
    isLoading,
    oncePerMonths,
    wasSuccessful,
    maintenanceFrequency,
    showMaintenance: () => setActiveTab('maintenance'),
    showWorks: () => setActiveTab('works'),
    setOncePerMonths: validateAndSetMonths,
    setMaintenanceFrequency,
    setWasSuccessful,
    submitMaintenance,
    submitWorks,
  };
}
