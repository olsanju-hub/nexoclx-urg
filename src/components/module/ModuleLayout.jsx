export function ModuleLayout({ title, subtitle, children }) {
  return (
    <article className="module-layout" aria-label={title}>
      <header className="module-layout-header">
        <div>
          <p className="module-kicker">Estructura de módulo clínico</p>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </header>
      <div className="module-layout-grid">{children}</div>
    </article>
  );
}

export function ModuleBlock({ title, eyebrow, children }) {
  return (
    <section className="module-block">
      <div className="module-block-header">
        {eyebrow && <span>{eyebrow}</span>}
        <h3>{title}</h3>
      </div>
      <div className="module-block-body">{children}</div>
    </section>
  );
}
