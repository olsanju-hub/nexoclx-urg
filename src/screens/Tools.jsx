import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Tools() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Base preparada para futuras herramientas clínicas.</p>
      </div>
      <EmptyClinicalState text="No hay herramientas cargadas." />
    </div>
  );
}
