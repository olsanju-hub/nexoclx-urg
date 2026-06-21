import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Tools({ app }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Area preparada para calculos y ayudas de {app.context.toLowerCase()}.</p>
      </div>
      <ContentBlock title="Calculadoras">
        <p>No hay formulas activas. Cada herramienta requerira formula, fuente, version y revision antes de estar disponible.</p>
      </ContentBlock>
      <ContentBlock title="Ayudas de decision">
        <p>Sin criterios operativos. Este espacio solo define la estructura visual.</p>
      </ContentBlock>
      <EmptyClinicalState text="Las herramientas no realizan calculos clinicos en esta version." />
    </div>
  );
}
