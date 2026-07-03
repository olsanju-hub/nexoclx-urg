import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';

export function Circuits({ onOpen }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Circuitos</h1>
        <p>Secuencia asistencial.</p>
      </div>
      <CompactList label="Listado de circuitos">
        <ListRow
          title="Dolor torácico"
          description="Priorización, observación, ingreso, alta o interconsulta."
          meta="Circuito"
          onClick={onOpen}
        />
      </CompactList>
    </div>
  );
}
