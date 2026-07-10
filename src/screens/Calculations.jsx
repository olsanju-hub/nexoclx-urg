import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Calculations() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Cálculos</h1>
        <p>Base preparada para futuros cálculos.</p>
      </div>
      <EmptyClinicalState text="No hay cálculos cargados." />
    </div>
  );
}
