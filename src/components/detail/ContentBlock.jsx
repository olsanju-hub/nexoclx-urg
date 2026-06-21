export function ContentBlock({ title, children }) {
  return (
    <section className="content-block">
      <h2>{title}</h2>
      <div className="content-block-body">{children}</div>
    </section>
  );
}
