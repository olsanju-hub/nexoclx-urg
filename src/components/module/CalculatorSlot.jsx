import { ModuleBlock } from './ModuleLayout.jsx';

export function CalculatorSlot({ text = 'Espacio reservado para cálculo validado.' }) {
  return (
    <ModuleBlock title="Cálculos / herramientas" eyebrow="Slot">
      <div className="module-calculator-slot">{text}</div>
    </ModuleBlock>
  );
}
