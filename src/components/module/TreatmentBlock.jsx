import { ModuleBlock } from './ModuleLayout.jsx';

export function TreatmentBlock({ text = 'No contiene recomendaciones clínicas.' }) {
  return (
    <ModuleBlock title="Tratamiento" eyebrow="Espacio futuro">
      <p>{text}</p>
    </ModuleBlock>
  );
}
