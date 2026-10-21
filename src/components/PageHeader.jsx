import './PageHeader.css';

function PageHeader({ title, description, actions }) {
  return (
    <header className="page-header">
      <title>{`${title} | Control de compras`}</title>
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export default PageHeader;
