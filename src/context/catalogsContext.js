import { createContext, useContext } from 'react';

export const CatalogsContext = createContext(null);

export function useCatalogs() {
  return useContext(CatalogsContext);
}
