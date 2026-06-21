import { ChevronRight } from 'lucide-react';

export function ListRow({ title, description, meta, onClick }) {
  return (
    <button className="list-row" type="button" onClick={onClick}>
      <span className="list-row-copy">
        <span className="list-row-title">{title}</span>
        <span className="list-row-description">{description}</span>
      </span>
      <span className="list-row-side">
        {meta && <span className="row-meta">{meta}</span>}
        <ChevronRight aria-hidden="true" size={18} strokeWidth={2} />
      </span>
    </button>
  );
}
