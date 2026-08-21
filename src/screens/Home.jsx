import { useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { HomeMap } from '../components/home/HomeMap.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { criticalAccess, syndromeAccess } from '../data/urgClinicalData.js';
import { getItemById, groupedSearch } from '../lib/clinicalSearch.js';

function ResultGroup({ title, results, onOpen }) {
  if (!results.length) return null;
  return (
    <section className="search-result-group">
      <h2>{title}</h2>
      <CompactList label={title}>
        {results.slice(0, 5).map(({ item, reasons }) => (
          <ListRow
            key={item.id}
            title={item.title}
            description={reasons.length ? reasons.slice(0, 2).join(' · ') : item.description}
            meta={item.type}
            onClick={() => onOpen(item.id)}
          />
        ))}
      </CompactList>
    </section>
  );
}

export function Home({ app, sections, onNavigate, onOpen }) {
  const [query, setQuery] = useState('');
  const results = groupedSearch(query);
  const hasQuery = query.trim().length > 1;

  return (
    <div className="screen home-screen">
      <section className="home-intro">
        <div className="home-title">
          <h1>NexoClx Urg</h1>
          <p>{app.context}</p>
        </div>
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar sintoma, diagnostico o escala" />
      </section>

      {hasQuery ? (
        <div className="search-results">
          <ResultGroup title="Protocolos" results={results.protocols} onOpen={onOpen} />
          <ResultGroup title="Procedimientos" results={results.procedures} onOpen={onOpen} />
          <ResultGroup title="Herramientas" results={results.tools} onOpen={onOpen} />
          <ResultGroup title="Circuitos" results={results.circuits} onOpen={onOpen} />
        </div>
      ) : (
        <>
          <section className="quick-section">
            <div className="section-heading compact">
              <h2>Paciente critico</h2>
              <p>Acceso inmediato a seguridad, tratamiento inicial, dosis y escalada.</p>
            </div>
            <div className="quick-grid">
              {criticalAccess.map((id) => {
                const item = getItemById(id);
                if (!item) return null;
                return <button key={id} type="button" onClick={() => onOpen(id)}>{item.title}</button>;
              })}
            </div>
          </section>

          <section className="quick-section">
            <div className="section-heading compact">
              <h2>Grandes sindromes</h2>
              <p>Entrada por lo que ves en boxes, pasillo, fast track o criticos.</p>
            </div>
            <div className="quick-grid">
              {syndromeAccess.map((group) => (
                <button key={group.id} type="button" onClick={() => onOpen(group.items[0])}>{group.title}</button>
              ))}
            </div>
          </section>

          <HomeMap sections={sections} variant={app.homeVariant} onNavigate={onNavigate} />
        </>
      )}
    </div>
  );
}
