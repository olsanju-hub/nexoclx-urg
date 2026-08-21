import { useMemo, useState } from 'react';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { clinicalTools } from '../data/urgClinicalData.js';
import { normalizeText } from '../lib/clinicalSearch.js';

export function Tools({ onOpen }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    return clinicalTools.filter((tool) => normalizeText(`${tool.title} ${tool.description} ${tool.terms?.join(' ')}`).includes(normalized));
  }, [query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Escalas y calculos que modifican conducta; no funcionan como calculadoras aisladas.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Buscar escala o calculo" />
      <CompactList label="Herramientas">
        {filtered.map((tool) => (
          <ListRow key={tool.id} title={tool.title} description={tool.description} meta={tool.priority} onClick={() => onOpen(tool.id)} />
        ))}
      </CompactList>
    </div>
  );
}
