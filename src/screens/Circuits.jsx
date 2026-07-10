import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Circuits() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Circuitos</h1>
        <p>Base preparada para futuros circuitos.</p>
      </div>
      <EmptyClinicalState text="No hay circuitos cargados." />
    </div>
  );
}
