import { TransactionsTable } from '../components/DataTable';
import { BalanceCard, MetricCard } from '../components/MetricCard';
import { summaryMetrics, topMetrics, transactions } from '../data/mockData';

export default function OverviewPage() {
  return (
    <div className="page-stack">
      <section className="metrics-grid">
        {topMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      

      <TransactionsTable rows={transactions} />
    </div>
  );
}
