import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function CircuitDetail({ onBack }) {
  return (
    <div className="screen">
      <DetailHeader title="Circuito pendiente" subtitle="Contenido no operativo" onBack={onBack} />
      <EmptyClinicalState text="Los circuitos requieren fuentes y validacion antes de activarse." />
    </div>
  );
}
