import { useState } from 'react';
import { SearchBox } from '../components/search/SearchBox.jsx';
import { HomeMap } from '../components/home/HomeMap.jsx';

export function Home({ app, sections, onNavigate }) {
  const [query, setQuery] = useState('');
  const visibleSections = sections.filter((section) =>
    `${section.title} ${section.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="screen home-screen">
      <section className="home-intro">
        <div className="home-title">
          <h1>Mapa clínico</h1>
          <p>{app.context}</p>
        </div>
        <SearchBox value={query} onChange={setQuery} placeholder="Buscar sección o recurso" />
      </section>
      <HomeMap sections={visibleSections} variant={app.homeVariant} onNavigate={onNavigate} />
    </div>
  );
}
