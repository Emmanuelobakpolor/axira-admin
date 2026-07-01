import { useEffect, useState } from 'react';
import { api } from '../api';

const FEE_META = {
  buy: {
    title: 'Buy Fee',
    heading: 'Buy Crypto Fee',
    description: 'Charged when a user buys crypto — flat USD amount converted to NGN plus a percentage of the order.',
  },
  sell: {
    title: 'Sell Fee',
    heading: 'Sell Crypto Fee',
    description: 'Deducted from the NGN payout when a user sells crypto — flat USD plus a percentage.',
  },
  swap: {
    title: 'Swap Fee',
    heading: 'Swap Crypto Fee',
    description: 'Applied on the notional NGN value when a user swaps between tokens — flat USD plus a percentage.',
  },
};

function FeeCard({ fee, onSave }) {
  const [flatUsd, setFlatUsd] = useState(fee.flat_usd);
  const [percent, setPercent] = useState(fee.percent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const meta = FEE_META[fee.fee_type] ?? {
    title: fee.fee_type,
    heading: fee.fee_type,
    description: '',
  };

  const dirty = flatUsd !== fee.flat_usd || percent !== fee.percent;

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await onSave(fee.id, { flat_usd: flatUsd, percent });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  let btnLabel = 'Save Changes';
  if (saving) btnLabel = 'Saving…';
  else if (saved) btnLabel = '✓ Saved';

  return (
    <article className="fee-card">
      <div className="fee-card-header">
        <h3>{meta.title}</h3>
      </div>

      <div className="fee-body">
        <div className="fee-icon">%</div>
        <div>
          <h4>{meta.heading}</h4>
          <p>{meta.description}</p>
        </div>
      </div>

      <div className="fee-fields">
        <label>
          <span>Flat fee (USD)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={flatUsd}
            onChange={(e) => setFlatUsd(e.target.value)}
          />
        </label>
        <label>
          <span>Percentage (%)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{error}</p>
      )}

      <button
        type="button"
        className="ghost-action"
        onClick={handleSave}
        disabled={saving || !dirty}
        style={{ opacity: !dirty && !saving ? 0.5 : 1 }}
      >
        {btnLabel}
      </button>
    </article>
  );
}

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .fees()
      .then((data) => setFees(data.fees))
      .catch((e) => setLoadError(e.message || 'Failed to load fees.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(id, data) {
    const updated = await api.updateFee(id, data);
    setFees((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  }

  if (loading) return <p style={{ padding: 24 }}>Loading fee settings…</p>;
  if (loadError) return <p style={{ padding: 24, color: '#ef4444' }}>{loadError}</p>;

  return (
    <div className="fees-grid">
      {fees.map((fee) => (
        <FeeCard key={fee.id} fee={fee} onSave={handleSave} />
      ))}
    </div>
  );
}
