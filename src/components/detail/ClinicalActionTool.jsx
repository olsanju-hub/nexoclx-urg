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

const formatDateTime = (date) => new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'short',
  timeStyle: 'short',
}).format(date);

function OperationalTrace({ recommendations = [], contextLabel, decisions, executedActions, responses, onDecision, onModify, onExecute, onResponse }) {
  if (!recommendations.length && !executedActions.length) return null;

  return (
    <div className="decision-result trace-panel">
      {recommendations.length > 0 && (
        <>
          <h3>Recomendación</h3>
          <div className="trace-stack">
            {recommendations.map((recommendation) => {
              const decision = decisions[recommendation.id];
              const hasDecision = decision?.status === 'accepted' || decision?.status === 'modified';
              const isRejected = decision?.status === 'rejected';
              return (
                <article className="trace-item" key={recommendation.id}>
                  <div className="trace-item-header">
                    <div>
                      <h4>{recommendation.label}</h4>
                      <p>{recommendation.detail}</p>
                    </div>
                    {recommendation.critical && <span className="status-pill is-alert">Crítica</span>}
                  </div>
                  {recommendation.rule && <small className="trace-rule">Regla: {recommendation.rule}</small>}
                  <p className="trace-decision">Confirmar decisión profesional</p>
                  <div className="trace-actions" aria-label={`Confirmar decisión para ${recommendation.label}`}>
                    <button type="button" onClick={() => onDecision(recommendation, 'accepted')}>Aceptar</button>
                    <button type="button" onClick={() => onDecision(recommendation, 'modified')}>Modificar</button>
                    <button type="button" onClick={() => onDecision(recommendation, 'rejected')}>Rechazar</button>
                  </div>
                  {decision?.status === 'modified' && (
                    <label className="trace-note">
                      <span>Modificación profesional</span>
                      <textarea
                        value={decision.note ?? ''}
                        onChange={(event) => onModify(recommendation.id, event.target.value)}
                        placeholder="Describe la conducta modificada"
                      />
                    </label>
                  )}
                  {decision && (
                    <p className="trace-decision">
                      Confirmar decisión: {decision.status === 'accepted' ? 'aceptada' : decision.status === 'modified' ? 'modificada' : 'rechazada'}
                    </p>
                  )}
                  {isRejected && (
                    <p className="trace-warning">La recomendación rechazada no cierra el caso. Reevalúa o selecciona otra conducta segura.</p>
                  )}
                  {hasDecision && recommendation.executable !== false && (
                    <button className="copy-button trace-execute" type="button" onClick={() => onExecute(recommendation, decision)}>
                      Confirmar como realizada
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {executedActions.length > 0 && (
        <div className="trace-executed">
          <h3>Acción realizada</h3>
          {executedActions.map((action) => {
            const response = responses[action.id] ?? 'pending';
            return (
              <article className="trace-item" key={action.id}>
                <h4>{action.action}</h4>
                <p>{action.decision === 'modified' && action.note ? action.note : action.detail}</p>
                <ul className="clinical-bullets">
                  <li>Fecha y hora: {action.executedAt}</li>
                  <li>Contexto asistencial: {contextLabel}</li>
                  <li>Estado: completado</li>
                  <li>Respuesta: {response === 'pending' ? 'pendiente' : response === 'success' ? 'registrada favorable' : 'fracaso o escalada necesaria'}</li>
                </ul>
                <div className="trace-actions">
                  <button type="button" onClick={() => onResponse(action.id, 'success')}>Registrar respuesta</button>
                  <button type="button" onClick={() => onResponse(action.id, 'failure')}>Fracaso / escalar</button>
                  <button type="button" onClick={() => onResponse(action.id, 'pending')}>Volver a reevaluación</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ClinicalActionTool({ protocol }) {
  const [values, setValues] = useState(() => getDefaultValues(protocol.assessment.fields));
  const [copied, setCopied] = useState(false);
  const [decisions, setDecisions] = useState({});
  const [executedActions, setExecutedActions] = useState([]);
  const [responses, setResponses] = useState({});
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

  const handleDecision = (recommendation, status) => {
    setDecisions((current) => ({
      ...current,
      [recommendation.id]: {
        ...current[recommendation.id],
        status,
        note: status === 'modified' ? current[recommendation.id]?.note ?? '' : '',
      },
    }));
  };

  const handleModify = (id, note) => {
    setDecisions((current) => ({
      ...current,
      [id]: { ...current[id], status: 'modified', note },
    }));
  };

  const handleExecute = (recommendation, decision) => {
    const alreadyExecuted = executedActions.some((action) => action.recommendationId === recommendation.id);
    if (alreadyExecuted) return;
    setExecutedActions((current) => [
      ...current,
      {
        id: `${recommendation.id}-${Date.now()}`,
        recommendationId: recommendation.id,
        action: recommendation.label,
        detail: recommendation.detail,
        decision: decision.status,
        note: decision.note,
        executedAt: formatDateTime(new Date()),
      },
    ]);
  };

  const handleResponse = (id, status) => {
    setResponses((current) => ({ ...current, [id]: status }));
  };

  const computedEntries = Object.entries(output.computed ?? {}).filter(([, value]) => (
    value !== null && value !== undefined && value !== ''
  ));
  const usesOperationalTrace = Boolean(protocol.assessment.operationalTrace);
  const recommendations = output.outcome?.recommendations ?? [];

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
          <h3>{usesOperationalTrace ? 'Hecho calculado' : 'Cálculos integrados'}</h3>
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
        <h3>{usesOperationalTrace ? 'Resultado' : output.outcome?.title}</h3>
        {usesOperationalTrace && <h4>{output.outcome?.title}</h4>}
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

      {usesOperationalTrace && (
        <OperationalTrace
          recommendations={recommendations}
          contextLabel={protocol.assessment.contextLabel ?? 'NexoClx'}
          decisions={decisions}
          executedActions={executedActions}
          responses={responses}
          onDecision={handleDecision}
          onModify={handleModify}
          onExecute={handleExecute}
          onResponse={handleResponse}
        />
      )}

      {protocol.sources?.length > 0 && (
        <details className="decision-result">
          <summary>Fuentes</summary>
          <ul className="clinical-bullets">
            {protocol.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                {source.supports ? `: ${source.supports}` : ''}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
