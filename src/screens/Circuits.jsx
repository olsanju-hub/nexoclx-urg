import { useMemo, useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { circuitModules } from '../data/urgClinicalData.js';
import { normalizeText } from '../lib/clinicalSearch.js';

export function Circuits({ onOpen }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    return circuitModules.filter((item) => normalizeText(`${item.title} ${item.terms?.join(' ')}`).includes(normalized));
  }, [query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Circuitos</h1>
        <p>Activacion, datos minimos, recurso y destino.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar circuito" />
      <CompactList label="Circuitos">
        {filtered.map((item) => (
          <ListRow key={item.id} title={item.title} description={item.activate?.join(' · ')} meta={item.priority} onClick={() => onOpen(item.id)} />
        ))}
      </CompactList>
    </div>
  );
}
