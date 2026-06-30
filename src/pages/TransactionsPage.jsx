import { useEffect, useState } from 'react';
import { TransactionsTable } from '../components/DataTable';
import { CountCard } from '../components/MetricCard';
import { api } from '../api';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Withdrawals', value: 'withdrawal' },
  { label: 'Gift Cards', value: 'giftcard' },
];

function fmtNgn(ngn) {
  const n = parseFloat(ngn) || 0;
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

function toTableRow(tx) {
  const assetMap = { deposit: 'NGN', withdrawal: 'NGN', giftcard_buy: tx.brand || 'Gift Card', giftcard_sell: tx.brand || 'Gift Card' };
  return {
    id: tx.reference || tx.id,
    type: tx.type,
    user: tx.user,
    asset: assetMap[tx.type] || 'NGN',
    amount: fmtNgn(tx.amount_ngn),
    fee: '₦0.00',
    status: tx.status,
  };
}

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.transactions(activeFilter)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeFilter]);

  if (error) return <div className="page-stack"><p className="form-error">{error}</p></div>;

  const stats = data
    ? [
        {
          title: 'Deposits',
          count: data.stats.deposits.count,
          amount: fmtNgn(data.stats.deposits.total_ngn),
        },
        {
          title: 'Withdrawals',
          count: data.stats.withdrawals.count,
          amount: fmtNgn(data.stats.withdrawals.total_ngn),
        },
        {
          title: 'Gift Card Buys',
          count: data.stats.giftcard_buys.count,
          amount: fmtNgn(data.stats.giftcard_buys.total_ngn),
        },
        {
          title: 'Gift Card Sales',
          count: data.stats.giftcard_sales.count,
          amount: `${data.stats.giftcard_sales.pending} pending`,
        },
      ]
    : [];

  return (
    <div className="page-stack">
      <section className="count-grid">
        {stats.map((s) => (
          <CountCard key={s.title} {...s} />
        ))}
      </section>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            className={`filter-chip${activeFilter === f.value ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted-text">Loading…</p>
      ) : (
        <TransactionsTable title="Transaction log" rows={(data?.transactions ?? []).map(toTableRow)} />
      )}
    </div>
  );
}
