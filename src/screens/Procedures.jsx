import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Procedures() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Procedimientos</h1>
        <p>Base preparada para futuros procedimientos.</p>
      </div>
      <EmptyClinicalState text="No hay procedimientos cargados." />
    </div>
  );
}
