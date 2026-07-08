import { useMemo, useState } from 'react';
import {
  formatClinicalSummary,
  getClinicalOutput,
  getDefaultValues,
} from '../../lib/clinicalToolEngine.js';

function FieldControl({ field, value, onChange }) {
  if (field.type === 'number') {
    return (
      <span className="tool-input-wrap">
        <input
          inputMode="decimal"
          min={field.min}
          max={field.max}
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.unit && <small>{field.unit}</small>}
      </span>
    );
  }
  if (field.type === 'select') {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Seleccionar</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }
  if (field.type === 'checkbox') {
    return <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />;
  }
  if (field.type === 'multi') {
    return (
      <div className="checklist-grid">
        {field.options.map((option) => {
          const current = Array.isArray(value) ? value : [];
          const selected = current.includes(option.value);
          return (
            <label className={selected ? 'clinical-check is-checked' : 'clinical-check'} key={option.value}>
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) => {
                  onChange(event.target.checked
                    ? [...current, option.value]
                    : current.filter((item) => item !== option.value));
                }}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }
  return <input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />;
}

function ComputedValue({ name, value }) {
  if (value === null || value === undefined || value === '') return null;
  return <li>{name}: {typeof value === 'object' && value.label ? value.label : String(value)}</li>;
}

export function ClinicalActionTool({ protocol }) {
  const [values, setValues] = useState(() => getDefaultValues(protocol.assessment.fields));
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => getClinicalOutput(protocol.assessment, values), [protocol.assessment, values]);
  const summary = useMemo(
    () => formatClinicalSummary({ protocol, values, computed: output.computed, outcome: output.outcome }),
    [output, protocol, values],
  );

  const updateValue = (field, value) => {
    setValues((current) => ({ ...current, [field.id]: value }));
    setCopied(false);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  const computedEntries = Object.entries(output.computed ?? {}).filter(([, value]) => (
    value !== null && value !== undefined && value !== ''
  ));

  return (
    <section className="decision-panel" aria-label={protocol.assessment.title}>
      <div className="decision-header">
        <div>
          <h2>{protocol.assessment.title}</h2>
          <p>{protocol.assessment.intro}</p>
        </div>
        <span className={output.outcome?.tone === 'alert' ? 'status-pill is-alert' : 'status-pill'}>
          {output.outcome?.status ?? 'Valorar'}
        </span>
      </div>

      <div className="tool-fields">
        {protocol.assessment.fields.map((field) => (
          <label className={field.type === 'checkbox' && values[field.id] ? 'tool-field is-checked' : 'tool-field'} key={field.id}>
            <span>{field.label}</span>
            <FieldControl field={field} value={values[field.id]} onChange={(value) => updateValue(field, value)} />
          </label>
        ))}
      </div>

      {computedEntries.length > 0 && (
        <div className="decision-result">
          <h3>Cálculos integrados</h3>
          <ul className="clinical-bullets">
            {computedEntries.map(([name, value]) => <ComputedValue key={name} name={name} value={value} />)}
          </ul>
        </div>
      )}

      {output.interpretations?.length > 0 && (
        <div className="decision-result">
          <h3>Interpretación</h3>
          {output.interpretations.map((item) => (
            <article key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              {item.actions?.length > 0 && (
                <ul className="clinical-bullets">
                  {item.actions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="decision-result">
        <h3>{output.outcome?.title}</h3>
        <p>{output.outcome?.body}</p>
        {output.outcome?.actions?.length > 0 && (
          <ul className="clinical-bullets">
            {output.outcome.actions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        )}
        <button className="copy-button" type="button" onClick={copySummary}>
          {copied ? 'Resumen copiado' : 'Copiar resumen'}
        </button>
      </div>
    </section>
  );
}
