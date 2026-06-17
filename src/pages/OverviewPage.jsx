import { TransactionsTable } from '../components/DataTable';
import { MetricCard, WideMetricCard } from '../components/MetricCard';
import { summaryMetrics, topMetrics, transactions } from '../data/mockData';

export default function OverviewPage() {
  return (
    <div className="page-stack">
      <section className="metrics-grid">
        {topMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="wide-metrics-grid">
        {summaryMetrics.map((metric) => (
          <WideMetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <TransactionsTable rows={transactions} />
    </div>
  );
}
