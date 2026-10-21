import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({ open, title, children, confirmLabel, pendingLabel, pending, error, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleCancel(event) {
    event.preventDefault();
    if (!pending) onCancel();
  }

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby="confirm-dialog-title" onCancel={handleCancel}>
      <h2 id="confirm-dialog-title" className="confirm-dialog__title">
        {title}
      </h2>
      <div className="confirm-dialog__body">{children}</div>
      {error && (
        <p className="confirm-dialog__error" role="alert">
          {error}
        </p>
      )}
      <div className="confirm-dialog__actions">
        <button type="button" className="button button--secondary" disabled={pending} onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="button button--danger" disabled={pending} onClick={onConfirm}>
          {pending ? pendingLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
