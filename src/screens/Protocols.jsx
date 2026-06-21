import { useMemo, useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Protocols({ protocols, onOpen }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => protocols.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())),
    [protocols, query],
  );

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Protocolos</h1>
        <p>Listado estructural preparado para contenido validado.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar protocolo" />
      <div className="filter-strip" aria-label="Filtros">
        <button className="filter-chip is-active" type="button">Todos</button>
        <button className="filter-chip" type="button">Pendientes</button>
        <button className="filter-chip" type="button">Fuentes</button>
      </div>
      <CompactList label="Listado de protocolos">
        {filtered.map((protocol) => (
          <ListRow
            key={protocol.id}
            title={protocol.title}
            description={protocol.description}
            meta={protocol.status}
            onClick={() => onOpen(protocol.id)}
          />
        ))}
      </CompactList>
      <EmptyClinicalState text="No hay decisiones clinicas activas hasta incorporar bibliografia y revision." />
    </div>
  );
}
