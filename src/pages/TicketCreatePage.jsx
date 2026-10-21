import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createTicket } from '../api/tickets.js';
import PageHeader from '../components/PageHeader.jsx';
import TicketForm from '../components/tickets/TicketForm.jsx';
import { createEmptyTicket } from '../components/tickets/ticketFormModel.js';
import { useNotify } from '../context/notificationsContext.js';

function TicketCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const from = location.state?.from || '';
  const [initialValues] = useState(createEmptyTicket);

  async function handleSubmit(payload) {
    const ticket = await createTicket(payload);

    notify(`Ticket ${ticket.code} creado`);
    navigate(`/tickets/${ticket.id}`, { replace: true, state: { from } });
  }

  return (
    <>
      <PageHeader
        title="Nuevo ticket"
        description="Registra la compra y sus líneas. El importe de cada línea se calcula con la cantidad y el precio."
      />
      <TicketForm
        initialValues={initialValues}
        submitLabel="Crear ticket"
        pendingLabel="Creando ticket…"
        cancelTo={`/tickets${from}`}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default TicketCreatePage;
