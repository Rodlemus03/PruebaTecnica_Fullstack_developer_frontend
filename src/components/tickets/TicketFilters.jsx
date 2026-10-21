import { useEffect, useEffectEvent, useState } from 'react';
import { useCatalogs } from '../../context/catalogsContext.js';
import './TicketFilters.css';

const SEARCH_DELAY_MS = 350;

function TicketFilters({ filters, hasFilters, showCatalogError, onChange, onClear }) {
  const catalogs = useCatalogs();
  const [searchText, setSearchText] = useState(filters.search);
  const [appliedSearch, setAppliedSearch] = useState(filters.search);

  if (filters.search !== appliedSearch) {
    setAppliedSearch(filters.search);
    setSearchText(filters.search);
  }

  const commitSearch = useEffectEvent((value) => onChange({ search: value }, { replace: true }));

  useEffect(() => {
    const value = searchText.trim();
    if (value === appliedSearch) return undefined;

    const timer = setTimeout(() => commitSearch(value), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchText, appliedSearch]);

  const catalogsUnavailable = catalogs.loading || Boolean(catalogs.error);
  const catalogWarning = showCatalogError && Boolean(catalogs.error);

  return (
    <section className="ticket-filters" aria-label="Filtros de tickets">
      <div className="ticket-filters__grid">
        <label className="field ticket-filters__search">
          <span className="field__label">Buscar</span>
          <input
            type="search"
            className="input"
            placeholder="Código de ticket o proveedor"
            value={searchText}
            maxLength={50}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Proveedor</span>
          <select
            className="input"
            value={filters.supplierId}
            disabled={catalogsUnavailable}
            onChange={(event) => onChange({ supplierId: event.target.value })}
          >
            <option value="">Todos</option>
            {catalogs.suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} ({supplier.code})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Land</span>
          <select
            className="input"
            value={filters.landId}
            disabled={catalogsUnavailable}
            onChange={(event) => onChange({ landId: event.target.value })}
          >
            <option value="">Todos</option>
            {catalogs.lands.map((land) => (
              <option key={land.id} value={land.id}>
                {land.name} ({land.code})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Producto</span>
          <select
            className="input"
            value={filters.productId}
            disabled={catalogsUnavailable}
            onChange={(event) => onChange({ productId: event.target.value })}
          >
            <option value="">Todos</option>
            {catalogs.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.code})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Desde</span>
          <input
            type="date"
            className="input"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(event) => onChange({ dateFrom: event.target.value })}
          />
        </label>

        <label className="field">
          <span className="field__label">Hasta</span>
          <input
            type="date"
            className="input"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(event) => onChange({ dateTo: event.target.value })}
          />
        </label>
      </div>

      {(hasFilters || catalogWarning) && (
        <div className="ticket-filters__footer">
          {catalogWarning && (
            <p className="ticket-filters__warning" role="alert">
              No se pudieron cargar proveedores, lands y productos.{' '}
              <button type="button" className="link-button" onClick={catalogs.reload}>
                Reintentar
              </button>
            </p>
          )}
          {hasFilters && (
            <button type="button" className="link-button ticket-filters__clear" onClick={onClear}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default TicketFilters;
