import { Link, NavLink, Outlet, useLocation } from 'react-router';
import ApiStatus from './ApiStatus.jsx';
import CatalogsProvider from './CatalogsProvider.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import NotificationsProvider from './NotificationsProvider.jsx';
import './Layout.css';

function Layout() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/tickets" className="app-brand">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#2f6b4f" />
              <path d="M8 9h16v4a3 3 0 0 0 0 6v4H8v-4a3 3 0 0 0 0-6z" fill="#ffffff" />
              <path d="M13 13h6M13 16h6M13 19h4" stroke="#2f6b4f" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Control de compras
          </Link>
          <nav className="app-nav" aria-label="Secciones principales">
            <NavLink to="/tickets" className="app-nav__link">
              Tickets
            </NavLink>
            <NavLink to="/pagos" className="app-nav__link">
              Pagos semanales
            </NavLink>
          </nav>
          <ApiStatus />
        </div>
      </header>
      <main id="contenido" className="app-main" tabIndex={-1}>
        <NotificationsProvider>
          <CatalogsProvider>
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </CatalogsProvider>
        </NotificationsProvider>
      </main>
    </>
  );
}

export default Layout;
