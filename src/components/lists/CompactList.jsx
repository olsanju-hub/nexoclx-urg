export function CompactList({ children, label }) {
  return (
    <section className="compact-list" aria-label={label}>
      {children}
    </section>
  );
}
