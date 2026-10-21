import { Link, useNavigate } from 'react-router';
import { formatAmount, formatDate } from '../../utils/format.js';
import './TicketsTable.css';

const DEFAULT_DIRECTIONS = { code: 'ascending', date: 'descending', total: 'descending' };

function SortableHeader({ field, label, sort, onSortChange, className }) {
  const active = sort.replace('-', '') === field;
  const descending = sort.startsWith('-');

  let nextSort = DEFAULT_DIRECTIONS[field] === 'descending' ? `-${field}` : field;
  if (active) nextSort = descending ? field : `-${field}`;

  const ariaSort = active ? (descending ? 'descending' : 'ascending') : 'none';
  const icon = active ? (descending ? '↓' : '↑') : '↕';

  return (
    <th scope="col" aria-sort={ariaSort} className={className}>
      <button type="button" className="sort-button" onClick={() => onSortChange(nextSort)}>
        {label}
        <span className="sort-button__icon" aria-hidden="true">
          {icon}
        </span>
      </button>
    </th>
  );
}

function TicketsTable({ tickets, sort, loading, listSearch, onSortChange }) {
  const navigate = useNavigate();
  const linkState = { from: listSearch ? `?${listSearch}` : '' };

  return (
    <div className="tickets-table" aria-busy={loading}>
      <table>
        <caption className="visually-hidden">Tickets de compra</caption>
        <thead>
          <tr>
            <SortableHeader field="code" label="Código" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="date" label="Fecha" sort={sort} onSortChange={onSortChange} />
            <th scope="col">Proveedor</th>
            <th scope="col">Land</th>
            <th scope="col" className="is-numeric">
              Líneas
            </th>
            <SortableHeader field="total" label="Total" sort={sort} onSortChange={onSortChange} className="is-numeric" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`, { state: linkState })}>
              <td className="tickets-table__code-cell">
                <Link
                  to={`/tickets/${ticket.id}`}
                  state={linkState}
                  className="tickets-table__code"
                  onClick={(event) => event.stopPropagation()}
                >
                  {ticket.code}
                </Link>
              </td>
              <td className="tickets-table__date-cell numeric">{formatDate(ticket.date)}</td>
              <td className="tickets-table__supplier-cell">
                <span className="tickets-table__name">{ticket.supplier.name}</span>
                <span className="tickets-table__muted">{ticket.supplier.code}</span>
              </td>
              <td className="tickets-table__land-cell">{ticket.land.name}</td>
              <td className="tickets-table__lines-cell is-numeric numeric">
                {ticket.lineCount}
                <span className="tickets-table__lines-label"> {ticket.lineCount === 1 ? 'línea' : 'líneas'}</span>
              </td>
              <td className="tickets-table__total-cell is-numeric numeric">{formatAmount(ticket.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsTable;
