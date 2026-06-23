import { SectionCard } from './SectionCard.jsx';

export function HomeMap({ sections, variant = 'standard', onNavigate }) {
  return (
    <section className={`home-map home-map-${variant}`} aria-label="Secciones">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} onClick={() => onNavigate(section.id)} />
      ))}
    </section>
  );
}
