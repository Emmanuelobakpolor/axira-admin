import { StatusPill, TypePill } from './StatusPill';

export function TransactionsTable({ title = 'Recent Transactions', rows, cta = 'View all' }) {
  return (
    <section className="table-card">
      <div className="section-head">
        <h3>{title}</h3>
        <button type="button">{cta}</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>User</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <td>{row.id}</td>
                <td><TypePill type={row.type} /></td>
                <td>{row.user}</td>
                <td className="asset-cell">{row.asset}</td>
                <td>{row.amount}</td>
                <td>{row.fee}</td>
                <td><StatusPill>{row.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function UsersTable({ rows }) {
  return (
    <section className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.email}-${index}`}>
                <td>
                  <div className="user-cell">
                    <strong>{row.name}</strong>
                    <span>{row.email}</span>
                    {row.tag ? <TypePill type={row.tag} /> : null}
                  </div>
                </td>
                <td>{row.balance}</td>
                <td><StatusPill>{row.status}</StatusPill></td>
                <td>{row.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
