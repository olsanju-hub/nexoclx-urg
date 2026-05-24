import { ArrowLeft } from 'lucide-react';

export function ProtocolHeader({ protocol, onBack, backLabel = 'Protocolos', kindLabel = 'Protocolo' }) {
  return (
    <header className="clinical-sheet-hero">
      <div className="clinical-sheet-hero-top">
        {onBack ? (
          <button type="button" className="clinical-sheet-back-button" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        ) : null}
      </div>
      <div className="clinical-sheet-title-block">
        <h2>{protocol.title}</h2>
      </div>
    </header>
  );
}
