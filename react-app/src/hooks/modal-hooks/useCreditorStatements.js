import { useEffect } from "react";
import useCreditorView from "./useCreditorView";
import { usePage } from "@inertiajs/inertia-react";

export default function useCreditorStatements(creditors, current_page, total_pages, total_items) {
  const viewLeaseId = new URL(usePage().url).searchParams.get("open_view_for");

  useEffect(() => {
    if (!viewLeaseId) return;
    const creditor = creditors.find((cred) => cred.lease_id == viewLeaseId);
    if (creditor) creditorViewProps.openCreditorView(creditor);
    else
      creditorViewProps.openCreditorView(
        creditor,
        `Creditor with ID '${viewLeaseId}' is not included in your current creditors list.`
      );
  }, [viewLeaseId]);

  const creditorViewProps = useCreditorView();

  const balanceTotal = creditors.reduce(
    (total, current_creditor) => total + current_creditor.balance_owed,
    0
  );

  return { balanceTotal, creditorViewProps };
}
