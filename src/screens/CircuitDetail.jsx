import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function CircuitDetail({ onBack }) {
  return (
    <div className="screen">
      <DetailHeader title="Módulo pendiente" subtitle="Módulo no operativo" onBack={onBack} />
      <EmptyClinicalState text="Módulo no operativo. Pendiente de contenido clínico validado." />
    </div>
  );
}
