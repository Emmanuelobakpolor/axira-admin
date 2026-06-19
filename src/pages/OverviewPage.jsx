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

      <section className="wide-metrics-grid">
        {summaryMetrics.map((card) => (
          <div key={card.title} className="wide-metric-card">
            <p>{card.title}</p>
            <h3>
              {card.value}
              <span>{card.suffix}</span>
            </h3>
          </div>
        ))}
      </section>

      <TransactionsTable rows={transactions} />
    </div>
  );
}
