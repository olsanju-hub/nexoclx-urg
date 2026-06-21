import { ShieldCheck } from 'lucide-react';

export function EmptyClinicalState({ title = 'Contenido no operativo', text }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">
        <ShieldCheck size={20} strokeWidth={2} />
      </span>
      <div>
        <p className="empty-state-title">{title}</p>
        <p className="empty-state-text">{text}</p>
      </div>
    </div>
  );
}
