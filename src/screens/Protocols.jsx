import { useMemo, useState } from 'react';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';

export function Protocols({ protocols, onOpen }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return protocols.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery));
  }, [protocols, query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Protocolos</h1>
        <p>Base preparada para futuros protocolos.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar protocolo" />
      {protocols.length === 0 ? (
        <EmptyClinicalState text="No hay protocolos cargados." />
      ) : (
        <>
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
          {filtered.length === 0 && <p className="empty-results">Sin resultados para esta búsqueda.</p>}
        </>
      )}
    </div>
  );
}
