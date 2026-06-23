import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Tools({ app }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </div>
      <ContentBlock title="Estado del módulo">
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </ContentBlock>
      <ContentBlock title="Validación pendiente">
        <p>Contenido pendiente de validación bibliográfica.</p>
      </ContentBlock>
      <EmptyClinicalState text="Módulo no operativo. Pendiente de contenido clínico validado." />
    </div>
  );
}
