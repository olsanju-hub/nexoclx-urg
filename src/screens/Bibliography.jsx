import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderSources } from '../data/placeholders.js';

export function Bibliography() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Bibliografía</h1>
        <p>Pendiente de bibliografía validada.</p>
      </div>
      <SourceList sources={placeholderSources} />
      <EmptyClinicalState text="Pendiente de bibliografía validada." />
    </div>
  );
}
