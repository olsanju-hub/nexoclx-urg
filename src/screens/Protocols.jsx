import { useMemo, useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function Protocols({ protocols, onOpen }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return protocols.filter((item) => {
      const matchesQuery = `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && item.status === 'Pendiente') ||
        (filter === 'sources' && item.title.toLowerCase().includes('bibliografía'));
      return matchesQuery && matchesFilter;
    });
  }, [filter, protocols, query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Protocolos</h1>
        <p>Contenido pendiente de validación bibliográfica.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar protocolo" />
      <div className="filter-strip" aria-label="Filtros">
        <button className={filter === 'all' ? 'filter-chip is-active' : 'filter-chip'} type="button" onClick={() => setFilter('all')}>
          Todos
        </button>
        <button className={filter === 'pending' ? 'filter-chip is-active' : 'filter-chip'} type="button" onClick={() => setFilter('pending')}>
          Pendientes
        </button>
        <button className={filter === 'sources' ? 'filter-chip is-active' : 'filter-chip'} type="button" onClick={() => setFilter('sources')}>
          Fuentes
        </button>
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
      <EmptyClinicalState text="Módulo no operativo. Pendiente de contenido clínico validado." />
    </div>
  );
}
