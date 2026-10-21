import { formatAmount, formatLongDate, formatQuantity } from '../../utils/format.js';
import './TicketReceipt.css';

function TicketReceipt({ ticket }) {
  return (
    <article className="receipt-frame" aria-labelledby="receipt-code">
      <div className="receipt">
        <header className="receipt__header">
          <div>
            <p className="receipt__kicker">Ticket de compra</p>
            <h1 id="receipt-code" className="receipt__code">
              {ticket.code}
            </h1>
          </div>
          <p className="receipt__date">
            <time dateTime={ticket.date}>{formatLongDate(ticket.date)}</time>
          </p>
        </header>

        <dl className="receipt__parties">
          <div>
            <dt>Proveedor</dt>
            <dd>
              {ticket.supplier.name}
              <span>{ticket.supplier.code}</span>
            </dd>
          </div>
          <div>
            <dt>Land</dt>
            <dd>
              {ticket.land.name}
              <span>{ticket.land.code}</span>
            </dd>
          </div>
        </dl>

        <div className="receipt__lines-wrapper">
          <table className="receipt__lines">
            <caption className="visually-hidden">Líneas del ticket {ticket.code}</caption>
            <thead>
              <tr>
                <th scope="col" className="receipt__line-number">
                  Línea
                </th>
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
                  <td className="receipt__line-number numeric">{line.lineNumber}</td>
                  <td className="receipt__product">
                    {line.product.name}
                    <span className="receipt__product-code">{line.product.code}</span>
                  </td>
                  <td className="receipt__quantity is-numeric numeric">{formatQuantity(line.quantity)}</td>
                  <td className="receipt__price is-numeric numeric">{formatAmount(line.price)}</td>
                  <td className="receipt__amount is-numeric numeric">{formatAmount(line.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="receipt__total-row">
          Total del ticket
          <strong className="receipt__total numeric">{formatAmount(ticket.total)}</strong>
        </p>
      </div>
    </article>
  );
}

export default TicketReceipt;
