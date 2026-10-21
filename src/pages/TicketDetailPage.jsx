import { Link, useLocation, useParams } from 'react-router';
import { getTicket } from '../api/tickets.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import TicketReceipt from '../components/tickets/TicketReceipt.jsx';
import { useRequest } from '../hooks/useRequest.js';
import './TicketDetailPage.css';

function TicketDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const backTo = `/tickets${location.state?.from || ''}`;
  const ticket = useRequest((signal) => getTicket(id, signal), id);

  function renderContent() {
    if (ticket.error && [400, 404].includes(ticket.error.status)) {
      return (
        <EmptyState
          title="No encontramos este ticket"
          text="Puede que se haya eliminado o que el enlace sea incorrecto."
          action={
            <Link to="/tickets" className="button button--secondary">
              Ver todos los tickets
            </Link>
          }
        />
      );
    }

    if (ticket.error) {
      return <ErrorState title="No se pudo cargar el ticket" error={ticket.error} onRetry={ticket.reload} />;
    }

    if (!ticket.data || ticket.loading) {
      return <LoadingState label="Cargando ticket…" />;
    }

    return <TicketReceipt ticket={ticket.data} />;
  }

  return (
    <div className="ticket-detail">
      <title>{`${ticket.data && !ticket.loading ? `Ticket ${ticket.data.code}` : 'Ticket'} | Control de compras`}</title>
      <div className="ticket-detail__toolbar">
        <Link to={backTo} className="back-link">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Volver a tickets
        </Link>
      </div>
      {renderContent()}
    </div>
  );
}

export default TicketDetailPage;
