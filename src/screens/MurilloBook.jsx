import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { murilloBook, murilloIndex, getMurilloEntriesForItem } from '../data/murilloBook.js';
import { normalizeText } from '../lib/clinicalSearch.js';

export function MurilloBook({ item, onOpenItem }) {
  const [query, setQuery] = useState('');
  const linkedEntries = item ? getMurilloEntriesForItem(item.id) : [];
  const entries = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return murilloIndex;
    return murilloIndex.filter((entry) => normalizeText(`${entry.chapter} ${entry.title} ${entry.moduleIds.join(' ')}`).includes(normalized));
  }, [query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <BookOpen aria-hidden="true" size={30} strokeWidth={2} />
        <h1>Indice Murillo</h1>
        <p>{murilloBook.note}</p>
      </div>

      {item && (
        <section className="decision-result clinical-section is-destination">
          <h3>Referencia para {item.title}</h3>
          {linkedEntries.length ? (
            <ul className="clinical-bullets">
              {linkedEntries.map((entry) => (
                <li key={`${entry.chapter}-${entry.title}`}>
                  Cap. {entry.chapter}. {entry.title}. Pagina libro {entry.bookPage}; pagina PDF aproximada {entry.pdfPage}.
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay capitulo Murillo vinculado de forma especifica a este modulo.</p>
          )}
        </section>
      )}

      <SearchBox value={query} onChange={setQuery} placeholder="Buscar capitulo Murillo" />

      <CompactList label="Indice Murillo">
        {entries.map((entry) => (
          <ListRow
            key={`${entry.chapter}-${entry.title}`}
            title={`Cap. ${entry.chapter}. ${entry.title}`}
            description={`Pagina libro ${entry.bookPage}; pagina PDF aproximada ${entry.pdfPage}`}
            meta="Murillo"
            onClick={() => {
              const firstModule = entry.moduleIds[0];
              if (firstModule) onOpenItem(firstModule);
            }}
          />
        ))}
      </CompactList>
    </div>
  );
}
