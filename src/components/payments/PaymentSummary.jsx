import { formatAmount, formatDateRange } from '../../utils/format.js';
import './PaymentSummary.css';

function PaymentSummary({ payments }) {
  const { year, week, startDate, endDate, summary } = payments;

  return (
    <section className="payment-summary" aria-labelledby="payment-summary-title">
      <div className="payment-summary__heading">
        <h2 id="payment-summary-title" className="payment-summary__title">
          Semana {week} de {year}
        </h2>
        <p className="payment-summary__range">{formatDateRange(startDate, endDate)}</p>
      </div>
      <div className="payment-summary__figures">
        <div className="payment-summary__hero">
          <p className="payment-summary__label">Total a pagar</p>
          <p className="payment-summary__amount">{formatAmount(summary.total)}</p>
        </div>
        <dl className="payment-summary__stats">
          <div>
            <dt>Proveedores</dt>
            <dd>{summary.supplierCount}</dd>
          </div>
          <div>
            <dt>Tickets</dt>
            <dd>{summary.ticketCount}</dd>
          </div>
          <div>
            <dt>Líneas</dt>
            <dd>{summary.lineCount}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default PaymentSummary;
