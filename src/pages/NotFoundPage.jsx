import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';

function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página no encontrada" description="La dirección que abriste no existe en esta aplicación." />
      <Link to="/tickets" className="button button--primary">
        Ir a tickets
      </Link>
    </>
  );
}

export default NotFoundPage;
