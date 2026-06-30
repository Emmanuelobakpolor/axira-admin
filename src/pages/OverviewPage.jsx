import { useEffect, useState } from 'react';
import { TransactionsTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { api } from '../api';

function fmt(ngn) {
  const n = parseFloat(ngn) || 0;
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toTableRow(tx) {
  const assetMap = { deposit: 'NGN', withdrawal: 'NGN', giftcard_buy: tx.brand || 'Gift Card', giftcard_sell: tx.brand || 'Gift Card' };
  return {
    id: tx.reference || tx.id,
    type: tx.type,
    user: tx.user,
    asset: assetMap[tx.type] || 'NGN',
    amount: fmt(tx.amount_ngn),
    fee: '₦0.00',
    status: tx.status,
  };
}

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.overview()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-stack"><p className="muted-text">Loading…</p></div>;
  if (error) return <div className="page-stack"><p className="form-error">{error}</p></div>;

  const metrics = [
    {
      title: 'Total Users',
      value: data.total_users.toLocaleString(),
      accent: '#10b981',
      icon: 'users',
      link: 'View All',
    },
    {
      title: 'Deposits Today',
      value: fmt(data.deposits_today_ngn),
      trend: `${data.deposits_today_count} txns`,
      accent: '#10b981',
      icon: 'deposit',
      link: 'View All',
    },
    {
      title: 'Total NGN Deposits',
      value: fmt(data.total_deposits_ngn),
      accent: '#3b82f6',
      icon: 'ngn',
      link: 'View All',
    },
    {
      title: 'Total Withdrawals',
      value: fmt(data.total_withdrawals_ngn),
      accent: '#f59e0b',
      icon: 'withdrawal',
      link: 'View All',
    },
  ];

  return (
    <div className="page-stack">
      <section className="metrics-grid">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </section>

      <TransactionsTable rows={data.recent_transactions.map(toTableRow)} />
    </div>
  );
}
