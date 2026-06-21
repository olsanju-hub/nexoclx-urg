import { SectionCard } from './SectionCard.jsx';

export function HomeMap({ sections, onNavigate }) {
  return (
    <section className="home-map" aria-label="Secciones">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} onClick={() => onNavigate(section.id)} />
      ))}
    </section>
  );
}
