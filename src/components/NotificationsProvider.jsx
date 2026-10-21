import { useCallback, useRef, useState } from 'react';
import { NotificationsContext } from '../context/notificationsContext.js';
import './Notifications.css';

const AUTO_DISMISS_MS = 6000;

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const lastId = useRef(0);

  const dismiss = useCallback((id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'success') => {
      lastId.current += 1;
      const id = lastId.current;

      setNotifications((current) => [...current, { id, message, type }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <NotificationsContext value={notify}>
      {children}
      <div className="notifications" role="status" aria-live="polite">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification notification--${notification.type}`}>
            <p>{notification.message}</p>
            <button
              type="button"
              className="notification__close"
              aria-label="Cerrar aviso"
              onClick={() => dismiss(notification.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationsContext>
  );
}

export default NotificationsProvider;
