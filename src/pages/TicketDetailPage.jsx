import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { deleteTicket, getTicket } from '../api/tickets.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import TicketReceipt from '../components/tickets/TicketReceipt.jsx';
import { useNotify } from '../context/notificationsContext.js';
import { useRequest } from '../hooks/useRequest.js';
import { formatAmount } from '../utils/format.js';
import './TicketDetailPage.css';

function TicketDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();
  const from = location.state?.from || '';
  const backTo = `/tickets${from}`;
  const ticket = useRequest((signal) => getTicket(id, signal), id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadedTicket = ticket.data && !ticket.loading && !ticket.error ? ticket.data : null;

  function openConfirm() {
    setDeleteError('');
    setConfirmOpen(true);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError('');

    try {
      await deleteTicket(loadedTicket.id);
      notify(`Ticket ${loadedTicket.code} eliminado`);
      navigate(backTo, { replace: true });
    } catch (error) {
      setDeleteError(error.message);
      setDeleting(false);
    }
  }

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

    if (!loadedTicket) {
      return <LoadingState label="Cargando ticket…" />;
    }

    return <TicketReceipt ticket={loadedTicket} />;
  }

  return (
    <div className="ticket-detail">
      <title>{`${loadedTicket ? `Ticket ${loadedTicket.code}` : 'Ticket'} | Control de compras`}</title>
      <div className="ticket-detail__toolbar">
        <Link to={backTo} className="back-link">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Volver a tickets
        </Link>
        {loadedTicket && (
          <div className="ticket-detail__actions">
            <Link to={`/tickets/${loadedTicket.id}/editar`} state={{ from }} className="button button--secondary">
              Editar
            </Link>
            <button type="button" className="button button--danger-quiet" onClick={openConfirm}>
              Eliminar
            </button>
          </div>
        )}
      </div>

      {renderContent()}

      {loadedTicket && (
        <ConfirmDialog
          open={confirmOpen}
          title={`¿Eliminar el ticket ${loadedTicket.code}?`}
          confirmLabel="Eliminar ticket"
          pendingLabel="Eliminando…"
          pending={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        >
          Se eliminarán el ticket y {loadedTicket.lineCount === 1 ? 'su línea' : `sus ${loadedTicket.lineCount} líneas`}, por
          un total de{' '}
          <strong className="numeric">{formatAmount(loadedTicket.total)}</strong>. Esta acción no se puede
          deshacer.
        </ConfirmDialog>
      )}
    </div>
  );
}

export default TicketDetailPage;
