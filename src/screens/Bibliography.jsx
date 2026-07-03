import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderSources } from '../data/placeholders.js';

export function Bibliography() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Bibliografía</h1>
        <p>Verificación bibliográfica.</p>
      </div>
      <SourceList sources={placeholderSources} />
    </div>
  );
}
