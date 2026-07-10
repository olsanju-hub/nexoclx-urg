import { ModuleBlock } from './ModuleLayout.jsx';

export function EscalationBlock({ context = 'Derivación, ingreso, activación o traslado pendiente de definir.' }) {
  return (
    <ModuleBlock title="Escalada / destino" eyebrow="Salida">
      <p>{context}</p>
    </ModuleBlock>
  );
}
