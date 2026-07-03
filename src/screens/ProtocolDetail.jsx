import { useMemo, useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';

function DecisionPanel({ protocol }) {
  const [selected, setSelected] = useState([]);
  const [copied, setCopied] = useState(false);
  const decision = selected.length > 0
    ? { title: protocol.interactive.positiveTitle, body: protocol.interactive.positiveBody }
    : { title: protocol.interactive.negativeTitle, body: protocol.interactive.negativeBody };
  const summary = useMemo(() => {
    const findings = selected.length > 0 ? selected.map((item) => `- ${item}`).join('\n') : '- Sin datos de alto riesgo marcados.';
    return `${protocol.interactive.copyPrefix}\n${findings}\nConducta: ${decision.title}. ${decision.body}`;
  }, [decision.body, decision.title, protocol.interactive.copyPrefix, selected]);

  const toggle = (item) => {
    setSelected((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
    setCopied(false);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <section className="decision-panel" aria-label={protocol.interactive.title}>
      <div className="decision-header">
        <div>
          <h2>{protocol.interactive.title}</h2>
          <p>{protocol.interactive.intro}</p>
        </div>
        <span className={selected.length > 0 ? 'status-pill is-alert' : 'status-pill'}>{selected.length > 0 ? 'Actuar' : 'Completar'}</span>
      </div>
      <div className="checklist-grid">
        {protocol.interactive.checks.map((item) => (
          <label className={selected.includes(item) ? 'clinical-check is-checked' : 'clinical-check'} key={item}>
            <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="decision-result">
        <h3>{decision.title}</h3>
        <p>{decision.body}</p>
        <button className="copy-button" type="button" onClick={copySummary}>{copied ? 'Resumen copiado' : 'Copiar resumen'}</button>
      </div>
    </section>
  );
}

export function ProtocolDetail({ protocol, onBack }) {
  return (
    <div className="screen detail-screen protocol-detail">
      <DetailHeader title={protocol.title} subtitle={protocol.description} onBack={onBack} />
      {protocol.interactive && <DecisionPanel protocol={protocol} />}

      <section className="protocol-flow" aria-label="Estructura del protocolo">
        {protocol.sections.map((section) => (
          <article className="protocol-step-card" key={section.step}>
            <span className="protocol-step-index">{section.step}</span>
            <div className="protocol-step-copy">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.items?.length > 0 && (
                <ul className="clinical-bullets">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <ContentBlock title="Herramientas relacionadas">
        <ul className="clinical-bullets">
          {protocol.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </ContentBlock>

      {protocol.treatment?.length > 0 && (
        <ContentBlock title="Tratamiento">
          <div className="treatment-grid">
            {protocol.treatment.map((item) => (
              <article className="treatment-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.items?.length > 0 && (
                  <ul className="clinical-bullets">
                    {item.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </ContentBlock>
      )}

      <SourceList sources={protocol.sources} />
    </div>
  );
}
