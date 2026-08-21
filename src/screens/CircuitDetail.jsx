import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function CircuitDetail({ item, onBack }) {
  return (
    <div className="screen">
      <DetailHeader title={item?.title ?? 'Circuito'} subtitle={item?.description ?? 'Sin circuito cargado'} onBack={onBack} />
      <EmptyClinicalState text="Los circuitos se abren desde el detalle clinico principal para mantener una unica ruta de decision." />
    </div>
  );
}
