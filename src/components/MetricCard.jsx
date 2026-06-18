const icons = {
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="6" r="3" />
      <path d="M2 18c0-3.314 2.686-6 6-6" />
      <circle cx="15" cy="7" r="2.5" />
      <path d="M18.5 18c0-2.761-1.567-5-3.5-5s-3.5 2.239-3.5 5" />
    </svg>
  ),
  deposit: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v10M6 9l4 4 4-4" />
      <path d="M3 16h14" />
    </svg>
  ),
  ngn: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M7 6v8M13 6v8M7 10h6" />
    </svg>
  ),
  withdrawal: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="14" height="11" rx="2" />
      <path d="M3 9h14M7 5V3M13 5V3" />
    </svg>
  ),
};

export function MetricCard({ title, value, accent, trend, link, icon }) {
  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <div
          className="metric-icon"
          style={{
            color: accent,
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
          }}
        >
          {icons[icon] ?? icons.deposit}
        </div>
        <div className="metric-copy">
          <p>{title}</p>
          <h3>{value}</h3>
        </div>
      </div>
      <div className="metric-footer">
        <button type="button" className="view-link">
          {link}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 7h8M8 4l3 3-3 3" />
          </svg>
        </button>
        {trend ? <span className="trend-pill">↑ {trend}</span> : null}
      </div>
    </article>
  );
}

export function WideMetricCard({ title, value, suffix }) {
  return (
    <article className="wide-metric-card">
      <p>{title}</p>
      <h3>
        {value} <span>{suffix}</span>
      </h3>
    </article>
  );
}

export function BalanceCard({ title, value, suffix }) {
  return (
    <article className="balance-card">
      <div className="balance-card-notch" />
      <p className="balance-card-label">{title}</p>
      <h3 className="balance-card-value">
        {value}
        {suffix && <span>{suffix}</span>}
      </h3>
    </article>
  );
}

export function CountCard({ title, count, amount }) {
  return (
    <article className="count-card">
      <div className="count-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
          <path d="M3 8h14" />
        </svg>
      </div>
      <div>
        <p>{title}</p>
        <h3>{count}</h3>
        <span>{amount}</span>
      </div>
    </article>
  );
}
