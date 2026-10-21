import { Link } from 'react-router';
import { formatAmount, formatDate, formatQuantity } from '../../utils/format.js';

function SupplierBreakdown({ item }) {
  return (
    <div className="breakdown">
      <section className="breakdown__section">
        <h3 className="breakdown__title">Por producto</h3>
        <div className="breakdown__table-wrapper">
          <table className="breakdown__table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col" className="is-numeric">
                  Líneas
                </th>
                <th scope="col" className="is-numeric">
                  Cantidad
                </th>
                <th scope="col" className="is-numeric">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody>
              {item.products.map((row) => (
                <tr key={row.product.id}>
                  <td>
                    {row.product.name} <span className="breakdown__muted">{row.product.code}</span>
                  </td>
                  <td className="is-numeric numeric">{row.lineCount}</td>
                  <td className="is-numeric numeric">{formatQuantity(row.quantity)}</td>
                  <td className="is-numeric numeric">{formatAmount(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="breakdown__section">
        <h3 className="breakdown__title">Tickets de la semana</h3>
        {item.tickets.map((ticket) => (
          <article key={ticket.id} className="breakdown-ticket">
            <header className="breakdown-ticket__header">
              <Link to={`/tickets/${ticket.id}`} className="breakdown-ticket__code">
                {ticket.code}
              </Link>
              <span className="breakdown__muted">
                {formatDate(ticket.date)}, {ticket.land.name}
              </span>
              <strong className="breakdown-ticket__total numeric">{formatAmount(ticket.total)}</strong>
            </header>
            <div className="breakdown__table-wrapper">
              <table className="breakdown__table">
                <caption className="visually-hidden">Líneas del ticket {ticket.code}</caption>
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" className="is-numeric">
                      Cantidad
                    </th>
                    <th scope="col" className="is-numeric">
                      Precio
                    </th>
                    <th scope="col" className="is-numeric">
                      Importe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.details.map((line) => (
                    <tr key={line.id}>
                      <td>{line.product.name}</td>
                      <td className="is-numeric numeric">{formatQuantity(line.quantity)}</td>
                      <td className="is-numeric numeric">{formatAmount(line.price)}</td>
                      <td className="is-numeric numeric">{formatAmount(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default SupplierBreakdown;
