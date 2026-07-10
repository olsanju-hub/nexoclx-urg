import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function CircuitDetail({ onBack }) {
  return (
    <div className="screen">
      <DetailHeader title="Circuito" subtitle="Sin circuito cargado" onBack={onBack} />
      <EmptyClinicalState text="No hay circuito cargado." />
    </div>
  );
}
