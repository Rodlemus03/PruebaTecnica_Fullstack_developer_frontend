import { useSearchParams } from 'react-router';
import { getTickets } from '../api/tickets.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import TicketFilters from '../components/tickets/TicketFilters.jsx';
import TicketsTable from '../components/tickets/TicketsTable.jsx';
import { useCatalogs } from '../context/catalogsContext.js';
import { useRequest } from '../hooks/useRequest.js';

const FILTER_KEYS = ['search', 'supplierId', 'landId', 'productId', 'dateFrom', 'dateTo'];
const PAGE_SIZES = [20, 50, 100];
const DEFAULT_SORT = '-date';

function readPage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function TicketsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogs = useCatalogs();

  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || '']));
  const page = readPage(searchParams.get('page'));
  const limit = PAGE_SIZES.includes(Number(searchParams.get('limit'))) ? Number(searchParams.get('limit')) : PAGE_SIZES[0];
  const sort = searchParams.get('sort') || DEFAULT_SORT;
  const hasFilters = FILTER_KEYS.some((key) => filters[key]);

  const query = { ...filters, page, limit, sort };
  const tickets = useRequest((signal) => getTickets(query, signal), JSON.stringify(query));

  function updateParams(changes, { resetPage = true, replace = false } = {}) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        Object.entries(changes).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) next.delete(key);
          else next.set(key, String(value));
        });

        if (resetPage) next.delete('page');
        return next;
      },
      { replace },
    );
  }

  function retryLoading() {
    tickets.reload();
    if (catalogs.error) catalogs.reload();
  }

  function clearFilters() {
    updateParams(Object.fromEntries(FILTER_KEYS.map((key) => [key, ''])));
  }

  function renderContent() {
    if (tickets.error) {
      return <ErrorState title="No se pudieron cargar los tickets" error={tickets.error} onRetry={retryLoading} />;
    }

    if (!tickets.data) {
      return <LoadingState label="Cargando tickets…" />;
    }

    const { data: items, meta } = tickets.data;

    if (items.length === 0 && meta.totalItems > 0) {
      return (
        <EmptyState
          title="Esta página no tiene tickets"
          text={`Hay ${meta.totalItems} tickets en ${meta.totalPages} páginas.`}
          action={
            <button type="button" className="button button--secondary" onClick={() => updateParams({})}>
              Ir a la primera página
            </button>
          }
        />
      );
    }

    if (items.length === 0) {
      return hasFilters ? (
        <EmptyState
          title="Ningún ticket coincide con los filtros"
          text="Prueba con otra búsqueda o quita algunos filtros."
          action={
            <button type="button" className="button button--secondary" onClick={clearFilters}>
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <EmptyState title="Aún no hay tickets" text="Importa el Excel desde el backend o registra el primer ticket." />
      );
    }

    return (
      <>
        <TicketsTable
          tickets={items}
          sort={sort}
          loading={tickets.loading}
          listSearch={searchParams.toString()}
          onSortChange={(value) => updateParams({ sort: value === DEFAULT_SORT ? '' : value })}
        />
        <Pagination
          meta={meta}
          pageSizes={PAGE_SIZES}
          itemLabel="tickets"
          onPageChange={(value) => {
            updateParams({ page: value === 1 ? '' : value }, { resetPage: false });
            window.scrollTo({ top: 0 });
          }}
          onLimitChange={(value) => updateParams({ limit: value === PAGE_SIZES[0] ? '' : value })}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Tickets" description="Consulta, registra y corrige los tickets de compra a proveedores." />
      <TicketFilters
        filters={filters}
        hasFilters={hasFilters}
        showCatalogError={!tickets.error}
        onChange={updateParams}
        onClear={clearFilters}
      />
      {renderContent()}
    </>
  );
}

export default TicketsPage;
