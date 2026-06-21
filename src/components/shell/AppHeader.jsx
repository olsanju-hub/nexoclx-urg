export function AppHeader({ app, title, isHome, onHome, children }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="brand-button" type="button" onClick={onHome} aria-label="Volver a inicio">
          <img className="brand-icon" src={app.icon} alt="" />
          <span className="brand-copy">
            <span className="brand-name">{app.name}</span>
            <span className="brand-context">{app.context}</span>
          </span>
        </button>
        <div className="header-route" aria-hidden={isHome ? 'true' : 'false'}>
          {!isHome && <span>{title}</span>}
        </div>
        {children}
      </div>
    </header>
  );
}
