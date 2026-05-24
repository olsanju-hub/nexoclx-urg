export function ProtocolSection({ children, className = '', ...props }) {
  return (
    <section className={`clinical-sheet-section ${className}`} {...props}>
      {children}
    </section>
  );
}
