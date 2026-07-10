import { ModuleBlock } from './ModuleLayout.jsx';

export function DecisionBlock({ title = 'Sospecha clínica / orientación inicial', text = 'Contenido clínico pendiente.' }) {
  return (
    <ModuleBlock title={title} eyebrow="Orientación">
      <p>{text}</p>
    </ModuleBlock>
  );
}
