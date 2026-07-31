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
  const rawValue = typeof value === 'object' && value.label ? value.label : String(value);
  const readableValue = rawValue.replace(/^HK-[A-Z0-9-]+:\s*/i, '');
  const displayValue = readableValue.charAt(0).toUpperCase() + readableValue.slice(1);
  return <li>{name}: {displayValue}</li>;
}

const formatDateTime = (date) => new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'short',
  timeStyle: 'short',
}).format(date);

const getFieldValueLabel = (field, value) => {
  if (value === '' || value === null || value === undefined) return '';
  const option = field.options?.find((item) => item.value === value);
  return option?.label ?? value;
};

function SimpleTraceField({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <label className="trace-note">
        <span>{field.label}</span>
        <select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
          <option value="">Seleccionar</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  }
  if (field.type === 'number') {
    return (
      <label className="trace-note">
        <span>{field.label}</span>
        <input
          inputMode="decimal"
          min={field.min}
          max={field.max}
          type="number"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }
  return (
    <label className="trace-note">
      <span>{field.label}</span>
      <input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

const reevaluationFields = {
  calcium: [
    { id: 'ecgAfter', label: 'ECG posterior', type: 'select', options: [
      { value: 'normalized', label: 'Normalizado o claramente mejor' },
      { value: 'persistent-risk', label: 'Persisten cambios de riesgo' },
      { value: 'pending', label: 'Pendiente/no disponible' },
    ] },
    { id: 'stabilityAfter', label: 'Estabilidad clínica', type: 'select', options: [
      { value: 'stable', label: 'Estable' },
      { value: 'unstable', label: 'Inestable o arritmia' },
    ] },
  ],
  insulin: [
    { id: 'glucoseAfter', label: 'Glucemia posterior', type: 'select', options: [
      { value: 'ok', label: 'Sin hipoglucemia' },
      { value: 'low', label: 'Hipoglucemia o síntomas compatibles' },
      { value: 'pending', label: 'Pendiente' },
    ] },
    { id: 'potassiumAfter', label: 'Potasio posterior', type: 'select', options: [
      { value: 'improved', label: 'Mejora o desciende' },
      { value: 'persistent-severe', label: 'Persiste severo/refractario' },
      { value: 'pending', label: 'Pendiente/no disponible' },
    ] },
    { id: 'stabilityAfter', label: 'Estabilidad clínica', type: 'select', options: [
      { value: 'stable', label: 'Estable' },
      { value: 'unstable', label: 'Inestable' },
    ] },
  ],
  observation: [
    { id: 'clinicalCourse', label: 'Evolución clínica', type: 'select', options: [
      { value: 'improved', label: 'Mejora' },
      { value: 'stable', label: 'Sin empeorar' },
      { value: 'worse', label: 'Empeora o nuevos síntomas' },
    ] },
    { id: 'newRiskData', label: 'Nuevos datos', type: 'select', options: [
      { value: 'safe', label: 'Sin datos de gravedad' },
      { value: 'risk', label: 'ECG/potasio/función renal de riesgo' },
      { value: 'pending', label: 'Pendientes' },
    ] },
  ],
  transfer: [
    { id: 'transferStatus', label: 'Estado del traslado/prealerta', type: 'select', options: [
      { value: 'accepted', label: 'Destino/prealerta confirmados' },
      { value: 'pending', label: 'Pendiente de regulación' },
      { value: 'unstable', label: 'Inestable durante traslado' },
    ] },
  ],
};

const getReevaluationDecision = (kind, values = {}) => {
  if (kind === 'calcium') {
    if (!values.ecgAfter || !values.stabilityAfter) return 'Obtener ECG posterior y estabilidad para decidir repetir, continuar o escalar.';
    if (values.ecgAfter === 'persistent-risk' || values.stabilityAfter === 'unstable') return 'Repetir estabilización según protocolo local y escalar a críticos/UCIP si persiste riesgo.';
    if (values.ecgAfter === 'pending') return 'Mantener monitorización y no cerrar hasta disponer de ECG o destino seguro.';
    return 'Continuar tratamiento etiológico y vigilancia; reevaluar potasio/ECG según evolución.';
  }
  if (kind === 'insulin') {
    if (!values.glucoseAfter || !values.potassiumAfter || !values.stabilityAfter) return 'Obtener glucemia, potasio si disponible y estabilidad para decidir nueva rama.';
    if (values.glucoseAfter === 'low') return 'Tratar hipoglucemia y mantener vigilancia; no repetir insulina sin nueva decisión profesional.';
    if (values.potassiumAfter === 'persistent-severe' || values.stabilityAfter === 'unstable') return 'Escalar, valorar tratamiento repetido o depuración renal según contexto.';
    if (values.potassiumAfter === 'pending') return 'Mantener monitorización hasta potasio posterior o destino seguro.';
    return 'Continuar vigilancia y plan de destino según estabilidad, ECG y causa.';
  }
  if (kind === 'observation') {
    if (!values.clinicalCourse || !values.newRiskData) return 'Completar evolución clínica y nuevos datos para decidir alta, ingreso o escalada.';
    if (values.clinicalCourse === 'worse' || values.newRiskData === 'risk') return 'Cambiar a rama de gravedad: monitorizar, tratar o escalar según dato dominante.';
    if (values.newRiskData === 'pending') return 'Mantener observación hasta datos mínimos para destino seguro.';
    return 'Alta/seguimiento posible si no hay criterios de gravedad y existe plan seguro.';
  }
  if (kind === 'transfer') {
    if (!values.transferStatus) return 'Confirmar destino o regulación antes de cerrar el episodio.';
    if (values.transferStatus === 'unstable') return 'Escalar soporte, prealertar deterioro y priorizar hospital útil.';
    if (values.transferStatus === 'pending') return 'Mantener soporte y regulación activa; no registrar llegada automáticamente.';
    return 'Continuar traslado/prealerta hasta transferencia efectiva; llegada no registrada automáticamente.';
  }
  return 'Reevaluar datos clínicos y decidir continuar, escalar, derivar o cerrar con plan seguro.';
};

function ReevaluationBlock({ action, value, onChange }) {
  const kind = action.reevaluationKind ?? 'observation';
  const fields = reevaluationFields[kind] ?? reevaluationFields.observation;
  return (
    <div className="trace-reevaluation">
      <h4>Reevaluación</h4>
      <p>Respuesta pendiente: introduce solo los datos que cambian la siguiente decisión.</p>
      <div className="trace-field-grid">
        {fields.map((field) => (
          <SimpleTraceField
            key={field.id}
            field={field}
            value={value?.[field.id]}
            onChange={(nextValue) => onChange({ ...value, [field.id]: nextValue })}
          />
        ))}
      </div>
      <div className="trace-next-step">
        <strong>Nueva decisión</strong>
        <p>{getReevaluationDecision(kind, value)}</p>
      </div>
    </div>
  );
}

function RecommendationDetails({ recommendation, computed }) {
  const computedDetails = recommendation.computedDetails
    ?.map((id) => computed[id])
    .filter((value) => value !== null && value !== undefined && value !== '');
  if (!computedDetails?.length) return <p>{recommendation.detail}</p>;
  return (
    <>
      <p>{recommendation.detail}</p>
      <ul className="clinical-bullets">
        {computedDetails.map((item) => <li key={item}>Dosis: {item}</li>)}
      </ul>
    </>
  );
}

function OperationalTrace({
  recommendations = [],
  contextLabel,
  computed,
  decisions,
  executedActions,
  executionInputs,
  reevaluations,
  onDecision,
  onModify,
  onExecutionInput,
  onExecute,
  onReevaluation,
}) {
  if (!recommendations.length && !executedActions.length) return null;

  return (
    <div className="decision-result trace-panel">
      {recommendations.length > 0 && (
        <>
          <h3>Recomendación</h3>
          <div className="trace-stack">
            {recommendations.map((recommendation, index) => {
              const decision = decisions[recommendation.id];
              const hasDecision = decision?.status === 'accepted' || decision?.status === 'modified';
              const isRejected = decision?.status === 'rejected';
              const fieldValues = executionInputs[recommendation.id] ?? {};
              const missingExecutionField = recommendation.executionFields?.some((field) => field.required && !fieldValues[field.id]);
              return (
                <article className={index === 0 ? 'trace-item is-primary' : 'trace-item'} key={recommendation.id}>
                  <div className="trace-item-header">
                    <div>
                      <h4>{recommendation.label}</h4>
                      <RecommendationDetails recommendation={recommendation} computed={computed} />
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
                  {hasDecision && recommendation.executionFields?.length > 0 && (
                    <div className="trace-field-grid">
                      {recommendation.executionFields.map((field) => (
                        <SimpleTraceField
                          key={field.id}
                          field={field}
                          value={fieldValues[field.id]}
                          onChange={(nextValue) => onExecutionInput(recommendation.id, { ...fieldValues, [field.id]: nextValue })}
                        />
                      ))}
                    </div>
                  )}
                  {hasDecision && recommendation.executable !== false && (
                    <>
                      {missingExecutionField && <p className="trace-warning">Completa el dato requerido antes de registrar la acción.</p>}
                      <button className="copy-button trace-execute" type="button" disabled={missingExecutionField} onClick={() => onExecute(recommendation, decision)}>
                        Confirmar como realizada
                      </button>
                    </>
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
            return (
              <article className="trace-item" key={action.id}>
                <h4>{action.action}</h4>
                <p>{action.decision === 'modified' && action.note ? action.note : action.detail}</p>
                <ul className="clinical-bullets">
                  <li>Fecha y hora: {action.executedAt}</li>
                  <li>Contexto asistencial: {contextLabel}</li>
                  <li>Estado: completado</li>
                  {action.executionSummary?.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <ReevaluationBlock
                  action={action}
                  value={reevaluations[action.id] ?? {}}
                  onChange={(nextValue) => onReevaluation(action.id, nextValue)}
                />
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
  const [executionInputs, setExecutionInputs] = useState({});
  const [reevaluations, setReevaluations] = useState({});
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

  const handleExecutionInput = (id, inputValues) => {
    setExecutionInputs((current) => ({ ...current, [id]: inputValues }));
  };

  const handleExecute = (recommendation, decision) => {
    const alreadyExecuted = executedActions.some((action) => action.recommendationId === recommendation.id);
    if (alreadyExecuted) return;
    const fieldValues = executionInputs[recommendation.id] ?? {};
    const executionSummary = recommendation.executionFields
      ?.map((field) => {
        const label = getFieldValueLabel(field, fieldValues[field.id]);
        return label ? `${field.label}: ${label}` : null;
      })
      .filter(Boolean);
    setExecutedActions((current) => [
      ...current,
      {
        id: `${recommendation.id}-${Date.now()}`,
        recommendationId: recommendation.id,
        action: recommendation.label,
        detail: recommendation.detail,
        decision: decision.status,
        note: decision.note,
        reevaluationKind: recommendation.reevaluationKind,
        executionSummary,
        executedAt: formatDateTime(new Date()),
      },
    ]);
  };

  const handleReevaluation = (id, nextValue) => {
    setReevaluations((current) => ({ ...current, [id]: nextValue }));
  };

  const usesOperationalTrace = Boolean(protocol.assessment.operationalTrace);
  const computedEntries = Object.entries(output.computed ?? {}).filter(([name, value]) => (
    value !== null && value !== undefined && value !== ''
    && !(usesOperationalTrace && /calculad[ao]/i.test(name))
  ));
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
          computed={output.computed ?? {}}
          decisions={decisions}
          executedActions={executedActions}
          executionInputs={executionInputs}
          reevaluations={reevaluations}
          onDecision={handleDecision}
          onModify={handleModify}
          onExecutionInput={handleExecutionInput}
          onExecute={handleExecute}
          onReevaluation={handleReevaluation}
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
