import { Link } from 'react-router';
import { formatAmount, formatCompact, formatShortRange } from '../../utils/format.js';
import './WeekChart.css';

const NICE_STEPS = [1, 2, 2.5, 5, 10];

function buildScale(maxValue) {
  if (maxValue <= 0) return { max: 1, ticks: [0] };

  const roughStep = maxValue / 3;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = NICE_STEPS.find((candidate) => candidate * magnitude >= roughStep) * magnitude;
  const max = Math.ceil(maxValue / step) * step;
  const ticks = [];

  for (let value = 0; value <= max; value += step) ticks.push(value);

  return { max, ticks };
}

function weekLink({ year, week }) {
  return `?year=${year}&week=${week}`;
}

function WeekChart({ weeks, selected }) {
  const ordered = [...weeks].sort((a, b) => a.year - b.year || a.week - b.week);
  const values = ordered.map((item) => Number(item.total));
  const largest = Math.max(...values);
  const { max, ticks } = buildScale(largest);
  const showYear = new Set(ordered.map((item) => item.year)).size > 1;

  return (
    <figure className="week-chart">
      <figcaption className="week-chart__caption">Total a pagar por semana con tickets. Elige una columna para ver su detalle.</figcaption>
      <div className="week-chart__plot">
        <div className="week-chart__grid" aria-hidden="true">
          {ticks.map((tick) => (
            <div key={tick} className="week-chart__tick" style={{ bottom: `${(tick / max) * 100}%` }}>
              <span>{formatCompact(tick)}</span>
            </div>
          ))}
        </div>
        <ol className="week-chart__columns">
          {ordered.map((item, index) => {
            const isSelected = selected?.year === item.year && selected?.week === item.week;
            const isLargest = values[index] === largest;
            const range = formatShortRange(item.startDate, item.endDate);

            return (
              <li key={`${item.year}-${item.week}`} className="week-chart__item">
                <Link
                  to={weekLink(item)}
                  className="week-chart__column"
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`Semana ${item.week} de ${item.year}, ${range}: ${formatAmount(item.total)} en ${item.ticketCount} tickets`}
                >
                  <span className="week-chart__bar-area">
                    <span className="week-chart__bar" style={{ height: `${(values[index] / max) * 100}%` }}>
                      {(isSelected || isLargest) && (
                        <span className={`week-chart__value${isLargest ? '' : ' week-chart__value--selected'}`}>
                          {formatCompact(values[index])}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="week-chart__label" aria-hidden="true">
                    S{item.week}
                    {showYear && <span className="week-chart__year">{item.year}</span>}
                  </span>
                  <span className="week-chart__tooltip" aria-hidden="true">
                    <strong className="numeric">{formatAmount(item.total)}</strong>
                    <span>
                      Semana {item.week} de {item.year}, {range}
                    </span>
                    <span>
                      {item.ticketCount} tickets de {item.supplierCount} proveedores
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <details className="week-chart__table">
        <summary>Ver las semanas como tabla</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Semana</th>
              <th scope="col">Fechas</th>
              <th scope="col" className="is-numeric">
                Proveedores
              </th>
              <th scope="col" className="is-numeric">
                Tickets
              </th>
              <th scope="col" className="is-numeric">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {[...ordered].reverse().map((item) => (
              <tr key={`${item.year}-${item.week}`}>
                <td>
                  <Link to={weekLink(item)}>
                    Semana {item.week} de {item.year}
                  </Link>
                </td>
                <td>{formatShortRange(item.startDate, item.endDate)}</td>
                <td className="is-numeric numeric">{item.supplierCount}</td>
                <td className="is-numeric numeric">{item.ticketCount}</td>
                <td className="is-numeric numeric">{formatAmount(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export default WeekChart;
