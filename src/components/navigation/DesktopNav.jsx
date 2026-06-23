export function DesktopNav({ items, activeRoute, onNavigate }) {
  return (
    <nav className="desktop-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activeRoute === item.id ? 'desktop-nav-item is-active' : 'desktop-nav-item'}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
