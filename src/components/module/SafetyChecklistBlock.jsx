import { ModuleBlock } from './ModuleLayout.jsx';

export function SafetyChecklistBlock({ items = ['No pasar por alto: pendiente de definir'] }) {
  return (
    <ModuleBlock title="No pasar por alto" eyebrow="Seguridad">
      <ul className="module-checklist">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ModuleBlock>
  );
}
