import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderSources } from '../data/placeholders.js';

export function Bibliography() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Bibliografia</h1>
        <p>Fuentes pendientes de incorporacion.</p>
      </div>
      <SourceList sources={placeholderSources} />
      <EmptyClinicalState text="No se muestra contenido clinico sin fuente verificable." />
    </div>
  );
}
