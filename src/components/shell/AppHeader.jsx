import { BookOpen } from 'lucide-react';

export function AppHeader({ app, title, isHome, onHome, onBook, children }) {
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
        <div className="header-actions">
          {children}
          <button className="book-reference-button" type="button" onClick={onBook} aria-label="Abrir indice Murillo">
            <BookOpen aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
