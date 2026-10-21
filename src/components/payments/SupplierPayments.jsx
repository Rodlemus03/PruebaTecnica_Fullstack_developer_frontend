import { useState } from 'react';
import { amountToMillis, formatAmount } from '../../utils/format.js';
import SupplierBreakdown from './SupplierBreakdown.jsx';
import './SupplierPayments.css';

const SORTERS = {
  total: (a, b) => amountToMillis(b.total) - amountToMillis(a.total) || a.supplier.code.localeCompare(b.supplier.code),
  code: (a, b) => a.supplier.code.localeCompare(b.supplier.code),
};

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function describeShare(share) {
  if (share > 0 && share < 0.05) return 'Menos de 0.1 % de la semana';
  return `${share.toFixed(1)} % de la semana`;
}

function SupplierPaymentRow({ item, weekMillis, expanded, onToggle }) {
  const panelId = `pago-proveedor-${item.supplier.id}`;
  const share = weekMillis > 0 ? (amountToMillis(item.total) / weekMillis) * 100 : 0;

  return (
    <li className="supplier-payment">
      <button
        type="button"
        className="supplier-payment__summary"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="supplier-payment__name">
          {item.supplier.name}
          <span className="supplier-payment__meta">
            {item.supplier.code}, {plural(item.ticketCount, 'ticket', 'tickets')},{' '}
            {plural(item.lineCount, 'línea', 'líneas')}
          </span>
        </span>
        <span className="supplier-payment__share">
          <span className="supplier-payment__meter" aria-hidden="true">
            <span style={{ width: `${share}%` }} />
          </span>
          <span className="numeric">{describeShare(share)}</span>
        </span>
        <span className="supplier-payment__total numeric">{formatAmount(item.total)}</span>
        <svg className="supplier-payment__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <div id={panelId} className="supplier-payment__panel" hidden={!expanded}>
        {expanded && <SupplierBreakdown item={item} />}
      </div>
    </li>
  );
}

function SupplierPayments({ suppliers, weekTotal }) {
  const [sortBy, setSortBy] = useState('total');
  const [expanded, setExpanded] = useState(() => new Set());
  const sorted = [...suppliers].sort(SORTERS[sortBy]);
  const weekMillis = amountToMillis(weekTotal);
  const allExpanded = expanded.size === suppliers.length;

  function toggle(id) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setExpanded(allExpanded ? new Set() : new Set(suppliers.map((item) => item.supplier.id)));
  }

  return (
    <section className="supplier-payments" aria-labelledby="supplier-payments-title">
      <div className="supplier-payments__toolbar">
        <h2 id="supplier-payments-title" className="supplier-payments__title">
          Pagos por proveedor
        </h2>
        <div className="supplier-payments__controls">
          <label className="supplier-payments__sort">
            Ordenar por
            <select className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="total">Mayor pago</option>
              <option value="code">Código de proveedor</option>
            </select>
          </label>
          <button type="button" className="link-button" onClick={toggleAll}>
            {allExpanded ? 'Contraer todo' : 'Desplegar todo'}
          </button>
        </div>
      </div>
      <ul className="supplier-payments__list">
        {sorted.map((item) => (
          <SupplierPaymentRow
            key={item.supplier.id}
            item={item}
            weekMillis={weekMillis}
            expanded={expanded.has(item.supplier.id)}
            onToggle={() => toggle(item.supplier.id)}
          />
        ))}
      </ul>
    </section>
  );
}

export default SupplierPayments;
