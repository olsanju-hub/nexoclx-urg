import { ActionNowBlock } from './ActionNowBlock.jsx';
import { CalculatorSlot } from './CalculatorSlot.jsx';
import { DecisionBlock } from './DecisionBlock.jsx';
import { EscalationBlock } from './EscalationBlock.jsx';
import { MinimumDataBlock } from './MinimumDataBlock.jsx';
import { ModuleLayout } from './ModuleLayout.jsx';
import { ModuleSourceBlock } from './ModuleSourceBlock.jsx';
import { SafetyChecklistBlock } from './SafetyChecklistBlock.jsx';
import { SeverityBlock } from './SeverityBlock.jsx';
import { TreatmentBlock } from './TreatmentBlock.jsx';

export function EmptyClinicalModule({ title = 'Módulo estructural', context = 'Contenido clínico pendiente.' }) {
  return (
    <ModuleLayout title={title} subtitle={context}>
      <MinimumDataBlock />
      <DecisionBlock />
      <SeverityBlock />
      <ActionNowBlock />
      <TreatmentBlock />
      <CalculatorSlot />
      <EscalationBlock />
      <SafetyChecklistBlock />
      <ModuleSourceBlock />
    </ModuleLayout>
  );
}
