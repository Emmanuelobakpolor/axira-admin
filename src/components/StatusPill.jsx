export function StatusPill({ children, tone = 'success' }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export function TypePill({ type }) {
  const toneMap = {
    Swap: 'swap',
    Deposit: 'deposit',
    Withdrawal: 'withdrawal',
    Female: 'female',
  };

  return <span className={`type-pill ${toneMap[type] ?? 'deposit'}`}>{type}</span>;
}
