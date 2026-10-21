import { getHealth } from '../api/health.js';
import { useRequest } from '../hooks/useRequest.js';
import './ApiStatus.css';

function describeStatus({ loading, error }) {
  if (loading) return { tone: 'checking', label: 'Conectando con la API' };
  if (error?.status === 503) return { tone: 'offline', label: 'Base de datos no disponible' };
  if (error) return { tone: 'offline', label: 'API sin conexión' };
  return { tone: 'online', label: 'API conectada' };
}

function ApiStatus() {
  const health = useRequest(getHealth);
  const { tone, label } = describeStatus(health);

  return (
    <button
      type="button"
      className={`api-status api-status--${tone}`}
      onClick={health.reload}
      title="Volver a comprobar la conexión"
    >
      <span className="api-status__dot" aria-hidden="true" />
      <span aria-live="polite">{label}</span>
    </button>
  );
}

export default ApiStatus;
