import { ModuleBlock } from './ModuleLayout.jsx';

const defaultLevels = ['Bajo: pendiente de definir', 'Intermedio: pendiente de definir', 'Alto: pendiente de definir'];

export function SeverityBlock({ levels = defaultLevels }) {
  return (
    <ModuleBlock title="Gravedad o riesgo" eyebrow="Clasificación">
      <div className="module-severity-grid">
        {levels.map((level) => (
          <span className="module-severity-item" key={level}>{level}</span>
        ))}
      </div>
    </ModuleBlock>
  );
}
