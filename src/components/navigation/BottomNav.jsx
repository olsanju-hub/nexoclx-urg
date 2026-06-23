export function BottomNav({ items, activeRoute, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación inferior">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeRoute === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={active ? 'bottom-nav-item is-active' : 'bottom-nav-item'}
            onClick={() => onNavigate(item.id)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={2.1} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
