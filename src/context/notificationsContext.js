import { createContext, useContext } from 'react';

export const NotificationsContext = createContext(() => {});

export function useNotify() {
  return useContext(NotificationsContext);
}
