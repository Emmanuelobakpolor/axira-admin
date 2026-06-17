import { feeCards } from '../data/mockData';

function FeeCard({ title, heading, description, values, buttonLabel }) {
  return (
    <article className="fee-card">
      <div className="fee-card-header">
        <h3>{title}</h3>
        <button type="button">×</button>
      </div>

      <div className="fee-body">
        <div className="fee-icon">%</div>
        <div>
          <h4>{heading}</h4>
          <p>{description}</p>
        </div>
      </div>

      <div className="fee-fields">
        <label>
          <span>Flat (USD)</span>
          <input type="text" value={values[0]} readOnly />
        </label>
        <label>
          <span>Flat (USD)</span>
          <input type="text" value={values[1]} readOnly />
        </label>
      </div>

      <button type="button" className="ghost-action">
        {buttonLabel}
      </button>
    </article>
  );
}

export default function FeesPage() {
  return (
    <div className="fees-grid">
      {feeCards.map((card) => (
        <FeeCard key={card.title} {...card} />
      ))}
    </div>
  );
}
