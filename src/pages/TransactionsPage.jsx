import { TransactionsTable } from '../components/DataTable';
import { CountCard } from '../components/MetricCard';
import { transactionFilters, transactionStats, transactions } from '../data/mockData';

export default function TransactionsPage() {
  return (
    <div className="page-stack">
      <section className="count-grid">
        {transactionStats.map((metric) => (
          <CountCard key={metric.title} {...metric} />
        ))}
      </section>

      <div className="filter-row">
        {transactionFilters.map((filter) => (
          <button key={filter} type="button" className={`filter-chip${filter === 'Type' ? ' active' : ''}`}>
            {filter}
          </button>
        ))}
      </div>

      <TransactionsTable title="Transaction log" rows={transactions} />
    </div>
  );
}
