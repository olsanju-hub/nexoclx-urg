import { ArrowLeft } from 'lucide-react';

export function DetailHeader({ title, subtitle, onBack }) {
  return (
    <div className="detail-header">
      {onBack && (
        <button className="back-button" type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={18} strokeWidth={2} />
          <span>Volver</span>
        </button>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
