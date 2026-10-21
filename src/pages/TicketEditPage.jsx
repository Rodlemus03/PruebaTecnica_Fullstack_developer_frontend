import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { getTicket, updateTicket } from '../api/tickets.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TicketForm from '../components/tickets/TicketForm.jsx';
import { ticketToFormValues } from '../components/tickets/ticketFormModel.js';
import { useNotify } from '../context/notificationsContext.js';
import { useRequest } from '../hooks/useRequest.js';

function TicketEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const from = location.state?.from || '';
  const detailPath = `/tickets/${id}`;
  const ticket = useRequest((signal) => getTicket(id, signal), id);

  async function handleSubmit(payload) {
    const updated = await updateTicket(id, payload);

    notify(`Cambios guardados en el ticket ${updated.code}`);
    navigate(detailPath, { replace: true, state: { from } });
  }

  if (ticket.error && [400, 404].includes(ticket.error.status)) {
    return (
      <>
        <PageHeader title="Editar ticket" />
        <EmptyState
          title="No encontramos este ticket"
          text="Puede que se haya eliminado o que el enlace sea incorrecto."
          action={
            <Link to="/tickets" className="button button--secondary">
              Ver todos los tickets
            </Link>
          }
        />
      </>
    );
  }

  if (ticket.error) {
    return (
      <>
        <PageHeader title="Editar ticket" />
        <ErrorState title="No se pudo cargar el ticket" error={ticket.error} onRetry={ticket.reload} />
      </>
    );
  }

  if (!ticket.data || ticket.loading) {
    return (
      <>
        <PageHeader title="Editar ticket" />
        <LoadingState label="Cargando ticket…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Editar ticket ${ticket.data.code}`}
        description="Al guardar se reemplazan las líneas del ticket por las que ves en este formulario."
      />
      <TicketForm
        key={ticket.data.id}
        initialValues={ticketToFormValues(ticket.data)}
        submitLabel="Guardar cambios"
        pendingLabel="Guardando…"
        cancelTo={detailPath}
        cancelState={{ from }}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default TicketEditPage;
