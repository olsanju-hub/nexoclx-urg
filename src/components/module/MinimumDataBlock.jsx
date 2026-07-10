import { ModuleBlock } from './ModuleLayout.jsx';

export function MinimumDataBlock({ items = ['Pendiente de definir'] }) {
  return (
    <ModuleBlock title="Datos mínimos" eyebrow="Entrada">
      <ul className="module-checklist">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ModuleBlock>
  );
}
