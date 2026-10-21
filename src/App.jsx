import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import TicketsPage from './pages/TicketsPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import TicketCreatePage from './pages/TicketCreatePage.jsx';
import TicketEditPage from './pages/TicketEditPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/nuevo" element={<TicketCreatePage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="tickets/:id/editar" element={<TicketEditPage />} />
        <Route path="pagos" element={<PaymentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
