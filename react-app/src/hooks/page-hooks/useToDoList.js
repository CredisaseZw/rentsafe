import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useState } from "react";
import { capitalize } from "lodash";
import { userFriendlyErrorOrResponse } from "../../utils/index.js";

export default function useToDoList(works, reminders, maintenance) {
  const auth = usePage().props.Auth;
  const [error, setError] = useState("");
  const [lease, setLease] = useState({});
  const todos = [
    ...[...(works || []), ...(maintenance || [])].map((item) => {
      let details = `${item?.title?.toUpperCase()}: ${item.details}`;
      return {
        lease: {},
        date: item.scheduled_date,
        details: details,

        function: capitalize(item.function),
        balance_owing: item.current_balance,
        color: item.color,
        ...item,
      };
    }),
    ...reminders?.map((item) => ({
      lease: {},
      date: item.created_at,
      details: item.details,

      function: capitalize(item.function),
      balance_owing: item.current_balance,
      color: item.color,
      ...item,
    })),
  ];

  const [viewDefaults, setViewDefaults] = useState(undefined);

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
      .post(reverseUrl("resolve_task", todo.id), {
        type: Boolean(todo.frequency)
          ? "maintenance"
          : todo.function === "works"
            ? "works"
            : "reminder",
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
      .post(reverseUrl("delete_work_schedule", todo.id), {
        type: todo.scheduled_day ? "maintenance" : todo.function === "works" ? "works" : "reminder",
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
      Inertia.visit(reverseUrl("creditor_statements"), {
        data: {
          open_view_for: todo.lease_id,
        },
      });
    } else {
      Inertia.visit(reverseUrl("client-leases"), {
        data: {
          open_view_for: todo.lease_id,
        },
      });
    }
  }

  return {
    error,
    todos,
    lease,
    username,
    viewDefaults,
    done,
    dismiss,
    setError,
    goToOrigin,
    openScheduledWorks,
    closeWorks: () => setViewDefaults(undefined),
  };
}
