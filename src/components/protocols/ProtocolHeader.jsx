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
        <p className="clinical-sheet-kicker">{kindLabel}</p>
      </div>
      <div className="clinical-sheet-title-block">
        <h2>{protocol.title}</h2>
        <p>{protocol.specialty}</p>
      </div>
      <dl className="clinical-sheet-meta-grid">
        <div><dt>Contexto</dt><dd>Urgencias hospitalarias</dd></div>
        <div><dt>Categoría</dt><dd>{protocol.specialty}</dd></div>
        <div><dt>Tipo</dt><dd>{kindLabel}</dd></div>
        {protocol.summary ? <div><dt>Resumen</dt><dd>{protocol.summary}</dd></div> : null}
      </dl>
    </header>
  );
}
