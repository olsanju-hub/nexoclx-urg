import { ModuleBlock } from './ModuleLayout.jsx';

export function ModuleSourceBlock({ text = 'Fuente pendiente de añadir.' }) {
  return (
    <ModuleBlock title="Fuente del módulo" eyebrow="Trazabilidad">
      <p>{text}</p>
    </ModuleBlock>
  );
}
