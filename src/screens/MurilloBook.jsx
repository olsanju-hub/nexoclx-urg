import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { murilloBook, murilloIndex, getMurilloEntriesForItem, murilloPdfUrl } from '../data/murilloBook.js';
import { normalizeText } from '../lib/clinicalSearch.js';

const openPdfPage = (pdfPage) => {
  window.open(murilloPdfUrl(pdfPage), '_blank', 'noopener,noreferrer');
};

export function MurilloBook({ item }) {
  const [query, setQuery] = useState('');
  const linkedEntries = item ? getMurilloEntriesForItem(item.id) : [];
  const entries = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return murilloIndex;
    return murilloIndex.filter((entry) => normalizeText(`${entry.section} ${entry.chapter} ${entry.title}`).includes(normalized));
  }, [query]);

  return (
    <div className="screen">
      <div className="section-heading">
        <BookOpen aria-hidden="true" size={30} strokeWidth={2} />
        <h1>Indice Murillo 7a edicion</h1>
        <p>{murilloBook.note}</p>
      </div>

      {item && (
        <section className="decision-result clinical-section is-destination">
          <h3>Referencia para {item.title}</h3>
          {linkedEntries.length ? (
            <div className="reference-list">
              {linkedEntries.map((entry) => (
                <button
                  className="reference-link"
                  key={`${entry.chapter}-${entry.title}`}
                  type="button"
                  onClick={() => openPdfPage(entry.pdfPage)}
                >
                  <span>{entry.section}</span>
                  <strong>Cap. {entry.chapter}. {entry.title}</strong>
                  <small>Pagina libro {entry.bookPage}; pagina PDF {entry.pdfPage}. Abrir PDF.</small>
                </button>
              ))}
            </div>
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
            title={`${entry.section} · Cap. ${entry.chapter}. ${entry.title}`}
            description={`Pagina libro ${entry.bookPage}; pagina PDF ${entry.pdfPage}. Abre el PDF original si esta disponible.`}
            meta="PDF"
            onClick={() => openPdfPage(entry.pdfPage)}
          />
        ))}
      </CompactList>
    </div>
  );
}
