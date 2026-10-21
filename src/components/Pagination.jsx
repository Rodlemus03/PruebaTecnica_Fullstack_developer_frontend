import './Pagination.css';

function Pagination({ meta, pageSizes, itemLabel, onPageChange, onLimitChange }) {
  const { page, limit, totalItems, totalPages } = meta;
  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, totalItems);

  return (
    <nav className="pagination" aria-label="Paginación">
      <p className="pagination__summary numeric">
        Mostrando {firstItem}–{lastItem} de {totalItems} {itemLabel}
      </p>
      <div className="pagination__controls">
        <label className="pagination__size">
          Por página
          <select className="input" value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="button button--secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>
        <span className="pagination__page numeric">
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          className="button button--secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
