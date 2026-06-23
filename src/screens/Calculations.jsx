import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Calculations() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Cálculos</h1>
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </div>
      <ContentBlock title="Estado del módulo">
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </ContentBlock>
      <EmptyClinicalState text="Contenido pendiente de validación bibliográfica." />
    </div>
  );
}
