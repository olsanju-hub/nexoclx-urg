import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { murilloIndex, getMurilloEntriesForItem } from '../data/murilloBook.js';
import { normalizeText } from '../lib/clinicalSearch.js';

const openResource = (entry) => {
  if (!entry.resourceAvailable || !entry.resource) return;
  window.open(entry.resource, '_blank', 'noopener,noreferrer');
};

export function MurilloBook({ item }) {
  const [query, setQuery] = useState('');
  const linkedEntries = item ? getMurilloEntriesForItem(item.id) : [];
  const visibleEntries = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return murilloIndex;
    return murilloIndex.filter((entry) => [
      entry.section,
      entry.chapter,
      entry.title,
      entry.bookPage,
    ].some((value) => normalizeText(String(value)).includes(normalizedQuery)));
  }, [query]);
  const entriesBySection = visibleEntries.reduce((sections, entry) => {
    sections[entry.section] = [...(sections[entry.section] ?? []), entry];
    return sections;
  }, {});

  return (
    <div className="screen">
      <div className="section-heading">
        <BookOpen aria-hidden="true" size={30} strokeWidth={2} />
        <h1>Murillo 7a edicion</h1>
      </div>

      {item ? (
        <section className="clinical-section">
          {linkedEntries.length ? (
            <div className="reference-list">
              {linkedEntries.map((entry) => (
                <button
                  className="reference-link"
                  key={`${entry.chapter}-${entry.title}`}
                  onClick={() => openResource(entry)}
                  type="button"
                >
                  <span>{entry.section}</span>
                  <strong>Cap. {entry.chapter}. {entry.title}</strong>
                  <small>Pagina {entry.bookPage}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="reference-list" />
          )}
        </section>
      ) : (
        <section className="clinical-section">
          <label className="reference-search">
            <span>Buscar capitulo</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por capitulo, seccion o pagina"
            />
          </label>
        </section>
      )}

      {!item && (
        <div className="reference-list">
          {Object.entries(entriesBySection).map(([section, entries]) => (
            <section className="clinical-section" key={section}>
              <h3>{section}</h3>
              <div className="reference-list">
                {entries.map((entry) => (
                  <button
                    className="reference-link"
                    key={`${entry.chapter}-${entry.title}`}
                    onClick={() => openResource(entry)}
                    type="button"
                  >
                    <span>Capitulo {entry.chapter}</span>
                    <strong>{entry.title}</strong>
                    <small>Pagina {entry.bookPage}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
