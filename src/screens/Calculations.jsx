import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Calculations() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Calculos</h1>
        <p>Calculadoras preparadas sin formulas activas.</p>
      </div>
      <ContentBlock title="Formula pendiente">
        <p>No se ejecuta ningun calculo clinico hasta disponer de formula, fuente, version y revision.</p>
      </ContentBlock>
      <EmptyClinicalState text="Esta seccion es estructural y no operativa." />
    </div>
  );
}
