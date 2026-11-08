import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const EMPTY_FORM = {
  brand: '',
  logo_url: '',
  country: 'US',
  card_type: 'ecode',
  min_usd: '',
  max_usd: '',
  rate_ngn: '',
};

const fmtNgn = (v) => `₦${Number(v).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
const fmtUsd = (v) => `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

function RateForm({ form, setForm, countries, cardTypes, editing, busy, error, onSubmit, onCancel }) {
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const example = Number(form.rate_ngn) > 0 && Number(form.min_usd) > 0
    ? `A ${fmtUsd(form.min_usd)} card pays ${fmtNgn(form.min_usd * form.rate_ngn)}`
    : 'Rate is what you pay in naira for each $1 of card value.';

  return (
    <section className="table-card rate-form">
      <h3>{editing ? `Edit ${editing.brand} rate` : 'Add a rate'}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="rate-fields">
          <label>
            <span>Brand</span>
            <input value={form.brand} onChange={set('brand')} placeholder="e.g. Amazon" required />
          </label>
          <label>
            <span>Country</span>
            <select value={form.country} onChange={set('country')}>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Card type</span>
            <select value={form.card_type} onChange={set('card_type')}>
              {cardTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Min card value ($)</span>
            <input type="number" min="1" step="0.01" value={form.min_usd} onChange={set('min_usd')} required />
          </label>
          <label>
            <span>Max card value ($)</span>
            <input type="number" min="1" step="0.01" value={form.max_usd} onChange={set('max_usd')} required />
          </label>
          <label>
            <span>Rate (₦ per $1)</span>
            <input type="number" min="0.01" step="0.01" value={form.rate_ngn} onChange={set('rate_ngn')} required />
          </label>
          <label className="rate-wide">
            <span>Logo image URL (optional)</span>
            <input value={form.logo_url} onChange={set('logo_url')} placeholder="https://…" />
          </label>
        </div>
        <p className="muted-text rate-hint">{example}</p>
        {error && <p className="form-error">{error}</p>}
        <div className="crypto-actions">
          <button type="submit" className="crypto-btn approve" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Add rate'}
          </button>
          {editing && (
            <button type="button" className="crypto-btn undo" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default function GiftCardRatesPage() {
  const [rates, setRates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [rowError, setRowError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .giftcardRates()
      .then((data) => {
        setRates(data.rates);
        setCountries(data.countries);
        setCardTypes(data.card_types);
      })
      .catch((e) => setLoadError(e.message || 'Failed to load rates.'))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rates.filter((r) => r.brand.toLowerCase().includes(q)) : rates;
  }, [rates, query]);

  function startEdit(rate) {
    setEditing(rate);
    setForm({
      brand: rate.brand,
      logo_url: rate.logo_url,
      country: rate.country,
      card_type: rate.card_type,
      min_usd: rate.min_usd,
      max_usd: rate.max_usd,
      rate_ngn: rate.rate_ngn,
    });
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  async function submit() {
    setBusy(true);
    setFormError('');
    try {
      if (editing) {
        const updated = await api.updateGiftcardRate(editing.id, form);
        setRates((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await api.createGiftcardRate(form);
        setRates((prev) => [...prev, created]);
      }
      cancelEdit();
    } catch (e) {
      setFormError(e.message || 'Failed to save. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(rate) {
    setRowError('');
    try {
      const updated = await api.updateGiftcardRate(rate.id, { is_active: !rate.is_active });
      setRates((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } catch (e) {
      setRowError(e.message || 'Failed to update.');
    }
  }

  async function remove(rate) {
    const label = `${rate.brand} ${rate.country_name} ${rate.card_type_label} ${fmtUsd(rate.min_usd)}–${fmtUsd(rate.max_usd)}`;
    if (!window.confirm(`Delete the ${label} rate? Customers will no longer be able to sell this card.`)) return;
    setRowError('');
    try {
      await api.deleteGiftcardRate(rate.id);
      setRates((prev) => prev.filter((r) => r.id !== rate.id));
      if (editing?.id === rate.id) cancelEdit();
    } catch (e) {
      setRowError(e.message || 'Failed to delete.');
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading gift card rates…</p>;
  if (loadError) return <p style={{ padding: 24, color: '#ef4444' }}>{loadError}</p>;

  return (
    <div className="page-stack">
      <RateForm
        form={form}
        setForm={setForm}
        countries={countries}
        cardTypes={cardTypes}
        editing={editing}
        busy={busy}
        error={formError}
        onSubmit={submit}
        onCancel={cancelEdit}
      />

      <div className="filter-row">
        <input
          className="crypto-select"
          placeholder="Search brand…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {rowError && <p className="form-error">{rowError}</p>}

      <section className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Country</th>
                <th>Type</th>
                <th>Card value</th>
                <th>Rate (₦/$1)</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted-text">
                    {rates.length === 0
                      ? 'No rates yet. Customers can’t sell any gift cards until you add one.'
                      : 'No rates match your search.'}
                  </td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.id} className={r.is_active ? '' : 'rate-inactive'}>
                  <td>
                    <div className="rate-brand">
                      {r.logo_url && <img src={r.logo_url} alt="" />}
                      <span>{r.brand}</span>
                    </div>
                  </td>
                  <td>{r.country_name}</td>
                  <td>{r.card_type_label}</td>
                  <td>{fmtUsd(r.min_usd)} – {fmtUsd(r.max_usd)}</td>
                  <td>
                    {fmtNgn(r.rate_ngn)}
                    <div className="crypto-sub">$100 pays {fmtNgn(100 * r.rate_ngn)}</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`crypto-btn ${r.is_active ? 'approve' : 'undo'}`}
                      onClick={() => toggleActive(r)}
                      title={r.is_active ? 'Click to stop buying this card' : 'Click to start buying this card'}
                    >
                      {r.is_active ? 'Buying' : 'Paused'}
                    </button>
                  </td>
                  <td>
                    <div className="crypto-actions">
                      <button type="button" className="crypto-link" onClick={() => startEdit(r)}>Edit</button>
                      <button type="button" className="crypto-btn reject" onClick={() => remove(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
