import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderSources } from '../data/placeholders.js';

export function Sources() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Fuentes</h1>
        <p>Bibliografia pendiente de incorporacion.</p>
      </div>
      <SourceList sources={placeholderSources} />
      <EmptyClinicalState text="No se muestra contenido clinico sin fuente verificable." />
    </div>
  );
}
