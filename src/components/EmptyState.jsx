import './RequestStates.css';

function EmptyState({ title, text, action }) {
  return (
    <div className="request-state">
      <p className="request-state__title">{title}</p>
      {text && <p className="request-state__text">{text}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
