import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Circuits({ onOpen }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Circuitos</h1>
        <p>Módulo no operativo. Pendiente de contenido clínico validado.</p>
      </div>
      <CompactList label="Listado de circuitos">
        <ListRow
          title="Módulo pendiente"
          description="Módulo no operativo. Pendiente de contenido clínico validado."
          meta="No operativo"
          onClick={onOpen}
        />
      </CompactList>
      <EmptyClinicalState text="Módulo no operativo. Pendiente de contenido clínico validado." />
    </div>
  );
}
