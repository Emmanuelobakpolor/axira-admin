import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountCard } from '../components/MetricCard';
import { StatusPill } from '../components/StatusPill';
import { api } from '../api';

const ORDER_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Buys', value: 'buy' },
  { label: 'Sells', value: 'sell' },
  { label: 'Swaps', value: 'swap' },
];

const STATUS_FILTERS = [
  { label: 'Any status', value: '' },
  { label: 'Processing', value: 'processing' },
  { label: 'Pending payment', value: 'pending_payment' },
  { label: 'Payment received', value: 'payment_received' },
  { label: 'Waiting deposit', value: 'waiting_deposit' },
  { label: 'Deposit confirmed', value: 'deposit_confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
];

// Mirrors REJECTABLE in AdminCryptoOrderActionView.
const ACTIONABLE = ['pending_payment', 'payment_received', 'waiting_deposit', 'deposit_confirmed', 'processing'];

function statusTone(s) {
  if (s === 'completed') return 'success';
  if (s === 'failed' || s === 'rejected' || s === 'expired') return 'danger';
  return 'warning';
}

function fmtNgn(v) {
  return '₦' + (parseFloat(v) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

function fmtCoin(v) {
  return (parseFloat(v) || 0).toLocaleString('en-US', { maximumFractionDigits: 8 });
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
}

function UserCell({ row, onOpen }) {
  return (
    <td>
      <button type="button" className="crypto-link" onClick={() => onOpen(row.user_id)}>
        {row.user}
      </button>
      <div className="crypto-sub">{row.email}</div>
    </td>
  );
}

function OrdersTable({ orders, busyRef, onAction, onOpenUser }) {
  return (
    <section className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>NGN</th>
              <th>Status</th>
              <th>Quidax</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={9} className="muted-text">No crypto orders.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.reference}>
                <td>{fmtDate(o.created_at)}</td>
                <td className="crypto-mono">{o.reference}</td>
                <UserCell row={o} onOpen={onOpenUser} />
                <td style={{ textTransform: 'capitalize' }}>{o.order_type}</td>
                <td>
                  {fmtCoin(o.coin_amount)} {o.coin}
                  {o.order_type === 'swap' && o.to_coin && (
                    <div className="crypto-sub">→ {fmtCoin(o.to_coin_amount)} {o.to_coin}</div>
                  )}
                </td>
                <td>
                  {fmtNgn(o.total_ngn)}
                  <div className="crypto-sub">fee {fmtNgn(o.fee_ngn)}</div>
                </td>
                <td>
                  <StatusPill tone={statusTone(o.status)}>{o.status.replaceAll('_', ' ')}</StatusPill>
                  {o.note && <div className="crypto-sub">{o.note}</div>}
                </td>
                <td className="crypto-mono">{o.quidax_order_id || '—'}</td>
                <td>
                  <div className="crypto-actions">
                    {o.proof_url && (
                      <a href={o.proof_url} target="_blank" rel="noreferrer" className="crypto-link">Proof</a>
                    )}
                    {ACTIONABLE.includes(o.status) && (
                      <>
                        <button
                          type="button"
                          className="crypto-btn approve"
                          disabled={busyRef === o.reference}
                          onClick={() => onAction(o, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="crypto-btn reject"
                          disabled={busyRef === o.reference}
                          onClick={() => onAction(o, 'reject')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WithdrawalsTable({ withdrawals, busyRef, onAction, onOpenUser }) {
  return (
    <section className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>User</th>
              <th>Amount</th>
              <th>To address</th>
              <th>Status</th>
              <th>Quidax / Tx</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {withdrawals.length === 0 && (
              <tr><td colSpan={8} className="muted-text">No crypto sends.</td></tr>
            )}
            {withdrawals.map((w) => (
              <tr key={w.reference}>
                <td>{fmtDate(w.created_at)}</td>
                <td className="crypto-mono">{w.reference}</td>
                <UserCell row={w} onOpen={onOpenUser} />
                <td>
                  {fmtCoin(w.amount)} {w.coin}
                  {parseFloat(w.fee) > 0 && <div className="crypto-sub">fee {fmtCoin(w.fee)}</div>}
                </td>
                <td>
                  <div className="crypto-mono crypto-address">{w.address}</div>
                  {w.network && <div className="crypto-sub">{w.network}</div>}
                </td>
                <td>
                  <StatusPill tone={statusTone(w.status)}>{w.status}</StatusPill>
                  {w.note && <div className="crypto-sub">{w.note}</div>}
                </td>
                <td className="crypto-mono">
                  {w.quidax_withdrawal_id || '—'}
                  {w.tx_id && <div className="crypto-sub crypto-address">{w.tx_id}</div>}
                </td>
                <td>
                  {w.status === 'processing' && (
                    <div className="crypto-actions">
                      <button
                        type="button"
                        className="crypto-btn approve"
                        disabled={busyRef === w.reference}
                        onClick={() => onAction(w, 'complete')}
                      >
                        Mark sent
                      </button>
                      <button
                        type="button"
                        className="crypto-btn reject"
                        disabled={busyRef === w.reference}
                        onClick={() => onAction(w, 'refund')}
                      >
                        Refund
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function CryptoPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orderType, setOrderType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyRef, setBusyRef] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const req = tab === 'orders'
      ? api.cryptoOrders({ ...(orderType && { type: orderType }), ...(orderStatus && { status: orderStatus }) })
      : api.cryptoWithdrawals();
    req
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab, orderType, orderStatus]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(order, action) {
    const label = `${order.order_type} ${fmtCoin(order.coin_amount)} ${order.coin} (${order.reference})`;
    let note = '';
    if (action === 'reject') {
      const input = window.prompt(`Reject ${label}?\nOptional reason shown to the user:`, '');
      if (input === null) return;
      note = input;
    } else if (!window.confirm(`Approve ${label}? This executes the order on Quidax.`)) {
      return;
    }

    setBusyRef(order.reference);
    try {
      await api.cryptoOrderAction(order.reference, action, note);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyRef('');
    }
  }

  async function handleWithdrawalAction(w, action) {
    const label = `${fmtCoin(w.amount)} ${w.coin} to ${w.address} (${w.reference})`;
    const prompt = action === 'complete'
      ? `Mark this send as SENT?\n\n${label}\n\nOnly do this if Quidax shows the coin actually left. The user's balance will not be returned.`
      : `REFUND this send?\n\n${label}\n\nOnly do this if Quidax shows the coin never left. The amount goes back to the user's available balance.`;
    if (!window.confirm(prompt)) return;

    setBusyRef(w.reference);
    try {
      await api.cryptoWithdrawalAction(w.reference, action);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyRef('');
    }
  }

  const openUser = (id) => navigate(`/users/${encodeURIComponent(id)}`);

  const stats = data?.stats
    ? (tab === 'orders'
      ? [
          { title: 'All orders', count: data.stats.total, amount: 'buy · sell · swap' },
          { title: 'Pending', count: data.stats.pending, amount: 'awaiting payment / deposit' },
          { title: 'Processing', count: data.stats.processing, amount: 'on Quidax' },
          { title: 'Failed', count: data.stats.failed, amount: `${data.stats.completed} completed` },
        ]
      : [
          { title: 'All sends', count: data.stats.total, amount: 'to external wallets' },
          { title: 'Processing', count: data.stats.processing, amount: 'awaiting Quidax' },
          { title: 'Completed', count: data.stats.completed, amount: 'delivered' },
          { title: 'Failed', count: data.stats.failed, amount: 'failed or rejected' },
        ])
    : [];

  return (
    <div className="page-stack">
      <div className="filter-row">
        {[{ label: 'Orders', value: 'orders' }, { label: 'Sends', value: 'withdrawals' }].map((t) => (
          <button
            key={t.value}
            type="button"
            className={`filter-chip${tab === t.value ? ' active' : ''}`}
            onClick={() => { setData(null); setTab(t.value); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="count-grid">
        {stats.map((s) => <CountCard key={s.title} {...s} />)}
      </section>

      {tab === 'orders' && (
        <div className="filter-row">
          {ORDER_FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              className={`filter-chip${orderType === f.value ? ' active' : ''}`}
              onClick={() => setOrderType(f.value)}
            >
              {f.label}
            </button>
          ))}
          <select
            className="crypto-select"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            aria-label="Filter by status"
          >
            {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {loading || !data ? (
        <p className="muted-text">Loading…</p>
      ) : tab === 'orders' ? (
        <OrdersTable orders={data.orders} busyRef={busyRef} onAction={handleAction} onOpenUser={openUser} />
      ) : (
        <WithdrawalsTable
          withdrawals={data.withdrawals}
          busyRef={busyRef}
          onAction={handleWithdrawalAction}
          onOpenUser={openUser}
        />
      )}
    </div>
  );
}
