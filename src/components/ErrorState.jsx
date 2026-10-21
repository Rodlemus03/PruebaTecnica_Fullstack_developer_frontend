import './RequestStates.css';

function ErrorState({ title = 'No se pudo cargar la información', error, onRetry }) {
  return (
    <div className="request-state request-state--error" role="alert">
      <p className="request-state__title">{title}</p>
      {error?.message && <p className="request-state__text">{error.message}</p>}
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorState;
