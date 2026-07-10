import { ModuleBlock } from './ModuleLayout.jsx';

export function ActionNowBlock({ actions = ['Pendiente de definir'] }) {
  return (
    <ModuleBlock title="Qué hacer ahora" eyebrow="Conducta">
      <ul className="module-action-list">
        {actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </ModuleBlock>
  );
}
