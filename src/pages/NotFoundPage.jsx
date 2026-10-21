import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/tickets">Volver a tickets</Link>
    </section>
  );
}

export default NotFoundPage;
