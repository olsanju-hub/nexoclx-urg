import { ChevronRight } from 'lucide-react';

export function SectionCard({ section, onClick }) {
  const Icon = section.icon;

  return (
    <button className="section-card" type="button" onClick={onClick}>
      <span className="section-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="section-copy">
        <span className="section-title">{section.title}</span>
        <span className="section-description">{section.description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="section-chevron" size={18} strokeWidth={2} />
    </button>
  );
}
