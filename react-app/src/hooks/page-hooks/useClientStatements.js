import { usePage } from '@inertiajs/inertia-react';
import { useForm } from '@inertiajs/inertia-react';

export default function useClientStatements() {
  const {
    props: { tenant_list: tenants, total_pages, total_items, current_page },
  } = usePage();

  const { data, get } = useForm();

  function onOpenStatement(tenantId) {
    const url = `/clients/accounting/detailed-statement/${tenantId}/`;
    get(url);
  }

  const usdStatements = tenants.filter(
    (tenant) => tenant.lease_currency_type.toUpperCase() === 'USD'
  );

  const zwlStatements = tenants.filter(
    (tenant) => tenant.lease_currency_type.toUpperCase() !== 'USD'
  );

  const usdTotal = usdStatements.reduce(
    (acc, tenant) => acc + parseFloat(tenant.owing_amount),
    0
  );

  const zwlTotal = zwlStatements.reduce(
    (acc, tenant) => acc + parseFloat(tenant.owing_amount),
    0
  );

  return {
    data,
    tenants,
    usdTotal,
    zwlTotal,
    total_pages,
    total_items,
    current_page,
    usdStatements,
    zwlStatements,
    onOpenStatement,
    get,
  };
}
