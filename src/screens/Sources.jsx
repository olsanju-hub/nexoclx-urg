import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderSources } from '../data/placeholders.js';

export function Sources() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Fuentes</h1>
        <p>Fuentes utilizadas para el protocolo Dolor torácico.</p>
      </div>
      <SourceList sources={placeholderSources} />
    </div>
  );
}
