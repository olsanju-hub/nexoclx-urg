import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Circuits({ onOpen }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Circuitos</h1>
        <p>Rutas asistenciales pendientes.</p>
      </div>
      <CompactList label="Listado de circuitos">
        <ListRow
          title="Circuito pendiente de validacion"
          description="Sin activacion, criterios ni coordinacion operativa."
          meta="No operativo"
          onClick={onOpen}
        />
      </CompactList>
      <EmptyClinicalState text="Requiere fuente y revision." />
    </div>
  );
}
