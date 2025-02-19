import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userFriendlyErrorOrResponse } from '../../utils/index.js';
import { Inertia } from '@inertiajs/inertia';

export default function useToDoList(makeActive) {
  const auth = usePage().props.Auth;
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [lease, setLease] = useState({});
  const [todos, setTodos] = useState([]);
  const [viewDefaults, setViewDefaults] = useState(undefined);

  function fetchAndSetTodos() {
    axios(reverseUrl('todo_list'))
      .then((res) => {
        const worksAndMaintenanceData = [
          ...res.data.works,
          ...res.data.maintenance,
        ].map((item) => {
          let details = `${item.title.toUpperCase()}: ${item.details}`;
          return {
            lease: {},
            date: item.scheduled_date,
            details: details,

            function: capitalize(item.function),
            balance_owing: item.current_balance,
            color: item.color,
            ...item,
          };
        });

        const remindersData = res.data.reminders.map((item) => ({
          lease: {},
          date: item.created_at,
          details: item.details,

          function: capitalize(item.function),
          balance_owing: item.current_balance,
          color: item.color,
          ...item,
        }));

        setTodos([...worksAndMaintenanceData, ...remindersData]);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => fetchAndSetTodos(), []);

  const openModal = () => setShow(true);

  function closeModal() {
    makeActive('use-last-last');
    setShow(false);
  }

  const username = `${auth.user_profile.first_name} ${auth.user_profile.last_name} - ${auth.user_profile.individual_id}`;

  function openScheduledWorks(todo) {
    const newViewDefaults = {
      tenant_landlord: todo.tenant_landlord,
      property: todo.property,
      title: todo.title,
      details: todo.details,
      tradesman: todo.tradesman,
      contractor_name: todo.contractor,
      required: todo.required_materials,
      budget: todo.budget,
      reason: todo.reason,
      whose_account: todo.responsible_person,
      date_schedule: todo.scheduled_date || todo.date,

      isWorks: true,
      frequency: undefined,
      month_frequency: undefined,
      day_date: undefined,

      // isWorks: todo.isWorks,
      // frequency: todo.frequency,
      // month_frequency: todo.month_frequency,
      // day_date: todo.day_date,
    };

    console.log({ todo, newViewDefaults });

    setViewDefaults(newViewDefaults);
  }

  function done(todo) {
    axios
      .post(reverseUrl('resolve_task', todo.id), {
        type: Boolean(todo.frequency)
          ? 'maintenance'
          : todo.function === 'works'
            ? 'works'
            : 'reminder',
      })
      .then((res) => {
        console.log(res);
        fetchAndSetTodos();
      })
      .catch((err) => {
        setError(userFriendlyErrorOrResponse(err));
        console.log(err);
      });
  }

  function dismiss(todo) {
    axios
      .post(reverseUrl('delete_work_schedule', todo.id), {
        type: todo.scheduled_day
          ? 'maintenance'
          : todo.function === 'works'
            ? 'works'
            : 'reminder',
      })
      .then((res) => {
        console.log(res);
        fetchAndSetTodos();
      })
      .catch((err) => {
        setError(userFriendlyErrorOrResponse(err));
        console.log(err);
      });
  }

  function goToOrigin(todo) {
    console.log(todo);
    if (todo.is_creditor) {
      Inertia.visit(reverseUrl('creditor_statements'), {
        data: {
          open_view_for: todo.lease_id,
        },
      });
    } else {
      Inertia.visit(reverseUrl('client-leases'), {
        data: {
          open_view_for: todo.lease_id,
        },
      });
    }

    closeModal();
  }

  return {
    error,
    show,
    todos,
    lease,
    username,
    viewDefaults,
    done,
    dismiss,
    setError,
    openModal,
    closeModal,
    goToOrigin,
    fetchAndSetTodos,
    openScheduledWorks,
    closeWorks: () => setViewDefaults(undefined),
  };
}
