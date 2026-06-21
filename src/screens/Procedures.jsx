import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Procedures() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Procedimientos</h1>
        <p>Seccion preparada para procedimientos validados.</p>
      </div>
      <EmptyClinicalState text="No hay pasos tecnicos activos sin fuente y revision." />
    </div>
  );
}
