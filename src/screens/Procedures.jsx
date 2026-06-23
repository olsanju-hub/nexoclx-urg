import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Procedures() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Procedimientos</h1>
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </div>
      <EmptyClinicalState text="Módulo no operativo. Pendiente de contenido clínico validado." />
    </div>
  );
}
