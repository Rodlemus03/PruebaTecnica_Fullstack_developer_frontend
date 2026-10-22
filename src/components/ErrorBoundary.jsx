import { Component } from 'react';
import './RequestStates.css';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="request-state request-state--error" role="alert">
        <p className="request-state__title">Algo salió mal al mostrar esta página</p>
        <p className="request-state__text">
          Recarga la página para intentarlo de nuevo. Si el problema continúa, revisa que la API esté respondiendo
          correctamente.
        </p>
        <button type="button" className="button button--secondary" onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
