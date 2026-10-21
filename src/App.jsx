import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import TicketsPage from './pages/TicketsPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="pagos" element={<PaymentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
