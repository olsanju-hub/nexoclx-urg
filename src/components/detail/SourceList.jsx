export function SourceList({ sources }) {
  return (
    <section className="source-list">
      <h2>Fuentes</h2>
      <ul>
        {sources.map((source) => (
          <li key={source}>{source}</li>
        ))}
      </ul>
    </section>
  );
}
