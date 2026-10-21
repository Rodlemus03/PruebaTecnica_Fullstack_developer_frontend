import './RequestStates.css';

function LoadingState({ label = 'Cargando información…' }) {
  return (
    <div className="request-state request-state--loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export default LoadingState;
