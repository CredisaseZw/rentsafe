import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { wait } from '../../utils/index.js';
export default function useSalesInvoicingInvoiceTab() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = usePage();

  function fetchInvoiceList() {
    setLoading(true);
    // dev
    //  const list = [
    //    {
    //      id: 1,
    //      date_created: '2021-09-01',
    //      customer: 'John Doe',
    //      currency: 'USD',
    //      invoice: 'INV-001',
    //      total: 100.0,
    //    },
    //    {
    //      id: 2,
    //      date_created: '2021-09-02',
    //      customer: 'Jane Doe',
    //      currency: 'USD',
    //      invoice: 'INV-002',
    //      total: 200.0,
    //    },
    //    {
    //      id: 3,
    //      date_created: '2021-09-03',
    //      customer: 'John Doe',
    //      currency: 'USD',
    //      invoice: 'INV-003',
    //      total: 300.0,
    //    },
    //    {
    //      id: 4,
    //      date_created: '2021-09-04',
    //      customer: 'Jane Doe',
    //      currency: 'USD',
    //      invoice: 'INV-004',
    //      total: 400.0,
    //    },
    //    {
    //      id: 5,
    //      date_created: '2021-09-05',
    //      customer: 'John Doe',
    //      currency: 'USD',
    //      invoice: 'INV-005',
    //      total: 500.0,
    //    },
    //    {
    //      id: 6,
    //      date_created: '2021-09-06',
    //      customer: 'Jane Doe',
    //      currency: 'USD',
    //      invoice: 'INV-006',
    //      total: 600.0,
    //    },
    //    {
    //      id: 7,
    //      date_created: '2021-09-07',
    //      customer: 'John Doe',
    //      currency: 'USD',
    //      invoice: 'INV-007',
    //      total: 700.0,
    //    },
    //    {
    //      id: 8,
    //      date_created: '2021-09-08',
    //      customer: 'Jane Doe',
    //      currency: 'USD',
    //      invoice: 'INV-008',
    //      total: 800.0,
    //    },
    //    {
    //      id: 9,
    //      date_created: '2021-09-09',
    //      customer: 'John Doe',
    //      currency: 'USD',
    //      invoice: 'INV-009',
    //      total: 900.0,
    //    },
    //    {
    //      id: 10,
    //      date_created: '2021-09-10',
    //      customer: 'Jane Doe',
    //      currency: 'USD',
    //      invoice: 'INV-010',
    //      total: 1000.0,
    //    },
    //  ];
    const list = [];
    wait(1).then(() => {
      setInvoiceList(list);
      setLoading(false);
    });

    //  prod

    //  axios
    //    .get('/accounting/invoices')
    //    .then((res) => {
    //      setLoading(false);
    //      setInvoiceList(res.data);
    //    })
    //    .catch((err) => {
    //      setLoading(false);
    //      console.log(err);
    //    });
  }

  useEffect(() => {
    fetchInvoiceList();
  }, [url]);

  function handleFilters(e) {
    e.preventDefault();
    const year = e.target.year.value;
    const month = e.target.month.value;

    const updatesdUrl = new URL(url);
    updatesdUrl.searchParams.set('year', year);
    updatesdUrl.searchParams.set('month', month);

    Inertia.replace(updatesdUrl.href, { preserveState: true });
  }

  return { loading, invoiceList, handleFilters };
}
