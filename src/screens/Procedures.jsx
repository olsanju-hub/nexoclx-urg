import { useMemo, useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { procedureModules } from '../data/urgClinicalData.js';
import { normalizeText } from '../lib/clinicalSearch.js';

export function Procedures({ onOpen }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    return procedureModules.filter((item) => normalizeText(`${item.title} ${item.terms?.join(' ')}`).includes(normalized));
  }, [query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Procedimientos</h1>
        <p>Indicaciones, preparacion, pasos, reevaluacion y escalada.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar procedimiento" />
      <CompactList label="Procedimientos">
        {filtered.map((item) => (
          <ListRow key={item.id} title={item.title} description={item.indications?.join(' · ')} meta={item.priority} onClick={() => onOpen(item.id)} />
        ))}
      </CompactList>
    </div>
  );
}
