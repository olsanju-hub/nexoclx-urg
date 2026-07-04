import { useMemo, useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';

const getDefaultValues = (fields = []) => fields.reduce((values, field) => ({
  ...values,
  [field.id]: field.type === 'checkbox' ? false : '',
}), {});

const conditionIsMet = (condition, values) => {
  if (typeof condition === 'string') {
    return Boolean(values[condition]);
  }
  if (condition.gte !== undefined) {
    const value = Number(values[condition.id]);
    return values[condition.id] !== '' && !Number.isNaN(value) && value >= condition.gte;
  }
  if (condition.lte !== undefined) {
    const value = Number(values[condition.id]);
    return values[condition.id] !== '' && !Number.isNaN(value) && value <= condition.lte;
  }
  if (condition.equals !== undefined) {
    return values[condition.id] === condition.equals;
  }
  return false;
};

const outcomeMatches = (outcome, values) => {
  if (outcome.any?.some((condition) => conditionIsMet(condition, values))) return true;
  if (outcome.all?.length > 0 && outcome.all.every((condition) => conditionIsMet(condition, values))) return true;
  return false;
};

const getMissingFields = (fields, values) => fields.filter((field) => field.required && values[field.id] === '');

function ClinicalToolPanel({ protocol }) {
  const [values, setValues] = useState(() => getDefaultValues(protocol.assessment.fields));
  const [copied, setCopied] = useState(false);
  const missingFields = useMemo(() => getMissingFields(protocol.assessment.fields, values), [protocol.assessment.fields, values]);
  const outcome = useMemo(
    () => {
      if (missingFields.length > 0) {
        return protocol.assessment.incompleteOutcome ?? {
          status: 'Datos',
          title: 'Faltan datos obligatorios',
          body: 'Completa los campos marcados para obtener una salida clínica.',
          actions: [],
        };
      }
      return protocol.assessment.outcomes.find((item) => outcomeMatches(item, values)) ?? protocol.assessment.defaultOutcome;
    },
    [missingFields, protocol.assessment, values],
  );
  const summary = useMemo(() => {
    const findings = protocol.assessment.fields
      .map((field) => {
        const value = values[field.id];
        if (field.type === 'checkbox') return value ? `- ${field.label}` : null;
        if (value === '') return null;
        const option = field.options?.find((item) => item.value === value);
        return `- ${field.label}: ${option?.label ?? value}${field.unit ? ` ${field.unit}` : ''}`;
      })
      .filter(Boolean)
      .join('\n') || '- Sin datos introducidos.';
    return `${protocol.assessment.copyPrefix}\n${findings}\nSalida: ${outcome.title}. ${outcome.body}`;
  }, [outcome.body, outcome.title, protocol.assessment, values]);

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field.id]: value }));
    setCopied(false);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <section className="decision-panel" aria-label={protocol.assessment.title}>
      <div className="decision-header">
        <div>
          <h2>{protocol.assessment.title}</h2>
          <p>{protocol.assessment.intro}</p>
        </div>
        <span className={outcome.tone === 'alert' ? 'status-pill is-alert' : 'status-pill'}>{outcome.status}</span>
      </div>
      <div className="tool-fields">
        {protocol.assessment.fields.map((field) => (
          <label className={field.type === 'checkbox' && values[field.id] ? 'tool-field is-checked' : 'tool-field'} key={field.id}>
            <span>{field.label}</span>
            {field.type === 'number' && (
              <span className="tool-input-wrap">
                <input
                  inputMode="numeric"
                  min={field.min}
                  max={field.max}
                  type="number"
                  value={values[field.id]}
                  onChange={(event) => updateValue(field, event.target.value)}
                />
                {field.unit && <small>{field.unit}</small>}
              </span>
            )}
            {field.type === 'select' && (
              <select value={values[field.id]} onChange={(event) => updateValue(field, event.target.value)}>
                <option value="">Seleccionar</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
            {field.type === 'checkbox' && (
              <input type="checkbox" checked={values[field.id]} onChange={(event) => updateValue(field, event.target.checked)} />
            )}
          </label>
        ))}
      </div>
      <div className="decision-result">
        <h3>{outcome.title}</h3>
        <p>{outcome.body}</p>
        {outcome.actions?.length > 0 && (
          <ul className="clinical-bullets">
            {outcome.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        )}
        <button className="copy-button" type="button" onClick={copySummary}>{copied ? 'Resumen copiado' : 'Copiar resumen'}</button>
      </div>
    </section>
  );
}

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
      {protocol.assessment ? <ClinicalToolPanel protocol={protocol} /> : protocol.interactive && <DecisionPanel protocol={protocol} />}

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
