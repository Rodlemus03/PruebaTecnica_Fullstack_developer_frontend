import { getCatalogs } from '../api/catalogs.js';
import { CatalogsContext } from '../context/catalogsContext.js';
import { useRequest } from '../hooks/useRequest.js';

const emptyCatalogs = { suppliers: [], lands: [], products: [] };

function CatalogsProvider({ children }) {
  const catalogs = useRequest(getCatalogs);

  const value = {
    ...(catalogs.data || emptyCatalogs),
    loading: catalogs.loading,
    error: catalogs.error,
    reload: catalogs.reload,
  };

  return <CatalogsContext value={value}>{children}</CatalogsContext>;
}

export default CatalogsProvider;
