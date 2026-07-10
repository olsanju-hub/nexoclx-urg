import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Bibliography() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Bibliografía</h1>
        <p>Base preparada para futuras fuentes.</p>
      </div>
      <EmptyClinicalState text="No hay fuentes cargadas." />
    </div>
  );
}
