import { useEffect, useMemo, useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ivTreatments } from '../data/htaUrgProtocol.js';
import { htaUrgSupportSources, htaUrgSupportTools } from '../data/htaUrgSupportTools.js';

const timerOptions = [5, 10, 15, 30, 60];

const round = (value, decimals = 0) => {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const classifyGfr = (egfr) => {
  if (egfr === null) return 'Sin resultado.';
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
};

const calculateEgfr = ({ age, sex, creatinine, unit }) => {
  const ageNumber = Number(age);
  let scr = Number(creatinine);
  if (!Number.isFinite(ageNumber) || !Number.isFinite(scr) || ageNumber < 18 || scr <= 0) return null;
  if (unit === 'umol') scr /= 88.4;
  const isFemale = sex === 'female';
  const k = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  return 142
    * (Math.min(scr / k, 1) ** alpha)
    * (Math.max(scr / k, 1) ** -1.2)
    * (0.9938 ** ageNumber)
    * (isFemale ? 1.012 : 1);
};

function Field({ label, children }) {
  return (
    <label className="urg-hta-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ToolResult({ title, rows }) {
  return (
    <div className="urg-hta-result is-ok">
      <span>Resultado</span>
      <h2>{title}</h2>
      {rows.map((row) => (
        <div className="urg-hta-result-row" key={row.label}>
          <span>{row.label}</span>
          <p>{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function BibliographyModal({ onClose }) {
  return (
    <div className="urg-hta-modal-backdrop" role="presentation">
      <section className="urg-hta-modal" role="dialog" aria-modal="true" aria-labelledby="hta-tool-bibliography-title">
        <div className="urg-hta-modal-header">
          <h2 id="hta-tool-bibliography-title">Bibliografía</h2>
          <button type="button" onClick={onClose}>Cerrar</button>
        </div>
        <div className="urg-hta-source-list">
          {htaUrgSupportSources.map((source) => (
            <article key={source.label}>
              <h3>{source.label}</h3>
              <p>{source.supports}</p>
              <a href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function OpenProtocolButton({ onOpenProtocol }) {
  return <button className="urg-hta-primary-action" type="button" onClick={onOpenProtocol}>Abrir protocolo HTA</button>;
}

function ReassessmentTimerTool({ onOpenProtocol }) {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [reason, setReason] = useState('reposo');
  const [customMinutes, setCustomMinutes] = useState('');
  const active = secondsLeft !== null && secondsLeft > 0;
  const done = secondsLeft === 0;

  useEffect(() => {
    if (!active) return undefined;
    const id = window.setInterval(() => setSecondsLeft((current) => (current && current > 0 ? current - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  const start = (minutes) => setSecondsLeft(minutes * 60);
  const minutes = secondsLeft === null ? '--' : String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = secondsLeft === null ? '--' : String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className="urg-hta-grid">
      <div className="urg-hta-card">
        <h2>Timer</h2>
        <Field label="Motivo">
          <select value={reason} onChange={(event) => setReason(event.target.value)}>
            <option value="reposo">Reposo</option>
            <option value="captopril VO">Captopril VO</option>
            <option value="amlodipino VO">Amlodipino VO</option>
            <option value="labetalol IV">Labetalol IV</option>
            <option value="nitroglicerina IV">Nitroglicerina IV</option>
            <option value="otro">Otro</option>
          </select>
        </Field>
        <div className="urg-hta-timer-actions">
          {timerOptions.map((option) => <button type="button" key={option} onClick={() => start(option)}>{option} min</button>)}
          <input inputMode="numeric" type="number" min="1" max="240" value={customMinutes} onChange={(event) => setCustomMinutes(event.target.value)} placeholder="min" />
          <button type="button" onClick={() => start(Number(customMinutes) || 5)}>Iniciar</button>
          <button type="button" onClick={() => setSecondsLeft(null)}>Reset</button>
        </div>
        <OpenProtocolButton onOpenProtocol={onOpenProtocol} />
      </div>
      <section className={`urg-hta-timer ${done ? 'is-done' : ''}`}>
        <div>
          <span>Revaloración</span>
          <strong>{minutes}:{seconds}</strong>
          <p>{done ? 'Tiempo cumplido: revalorar TA, síntomas y daño orgánico.' : `Motivo: ${reason}.`}</p>
        </div>
      </section>
    </section>
  );
}

function BpSeriesTool({ onOpenProtocol }) {
  const [records, setRecords] = useState([{ minutes: '0', sbp: '', dbp: '', hr: '', symptoms: 'unknown' }]);
  const update = (index, key, value) => setRecords((current) => current.map((record, itemIndex) => (itemIndex === index ? { ...record, [key]: value } : record)));
  const addRecord = () => setRecords((current) => [...current, { minutes: '', sbp: '', dbp: '', hr: '', symptoms: 'unknown' }]);
  const valid = records.filter((record) => Number(record.sbp) > 0 && Number(record.dbp) > 0);
  const first = valid[0];
  const last = valid[valid.length - 1];
  const sbpDelta = first && last ? Number(last.sbp) - Number(first.sbp) : null;
  const dbpDelta = first && last ? Number(last.dbp) - Number(first.dbp) : null;
  const sbpPercent = first && last ? (sbpDelta / Number(first.sbp)) * 100 : null;
  const trend = valid.length < 2
    ? 'Añade al menos dos registros.'
    : sbpDelta > 5
      ? 'Sube'
      : sbpDelta < -5
        ? 'Desciende'
        : 'Estable';

  return (
    <section className="urg-hta-grid">
      <div className="urg-hta-card">
        <h2>Registros</h2>
        <div className="urg-hta-record-list">
          {records.map((record, index) => (
            <div className="urg-hta-record" key={`${index}-${records.length}`}>
              <Field label="Min"><input inputMode="numeric" type="number" value={record.minutes} onChange={(event) => update(index, 'minutes', event.target.value)} /></Field>
              <Field label="PAS"><input inputMode="numeric" type="number" value={record.sbp} onChange={(event) => update(index, 'sbp', event.target.value)} /></Field>
              <Field label="PAD"><input inputMode="numeric" type="number" value={record.dbp} onChange={(event) => update(index, 'dbp', event.target.value)} /></Field>
              <Field label="FC"><input inputMode="numeric" type="number" value={record.hr} onChange={(event) => update(index, 'hr', event.target.value)} /></Field>
              <Field label="Síntomas">
                <select value={record.symptoms} onChange={(event) => update(index, 'symptoms', event.target.value)}>
                  <option value="unknown">No consta</option>
                  <option value="no">No</option>
                  <option value="yes">Sí</option>
                </select>
              </Field>
            </div>
          ))}
        </div>
        <button className="urg-hta-primary-action" type="button" onClick={addRecord}>Añadir registro</button>
        <OpenProtocolButton onOpenProtocol={onOpenProtocol} />
      </div>
      <ToolResult
        title="Tendencia"
        rows={[
          { label: 'Registros válidos', value: `${valid.length}` },
          { label: 'Cambio PAS/PAD', value: first && last ? `${sbpDelta} / ${dbpDelta} mmHg` : 'Sin comparación.' },
          { label: 'Cambio PAS %', value: Number.isFinite(sbpPercent) ? `${round(sbpPercent, 1)}%` : 'Sin comparación.' },
          { label: 'Tendencia', value: trend },
          { label: 'Qué hacer', value: 'Usar la tendencia junto a síntomas y daño orgánico. No decide emergencia por sí sola.' },
        ]}
      />
    </section>
  );
}

function EgfrTool({ onOpenProtocol }) {
  const [values, setValues] = useState({ age: '', sex: 'male', creatinine: '', unit: 'mgdl' });
  const egfr = calculateEgfr(values);
  const rounded = round(egfr);
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <section className="urg-hta-grid">
      <div className="urg-hta-card">
        <h2>CKD-EPI 2021</h2>
        <div className="urg-hta-two-col">
          <Field label="Edad"><input inputMode="numeric" type="number" value={values.age} onChange={(event) => update('age', event.target.value)} /></Field>
          <Field label="Sexo"><select value={values.sex} onChange={(event) => update('sex', event.target.value)}><option value="male">Hombre</option><option value="female">Mujer</option></select></Field>
          <Field label="Creatinina"><input inputMode="decimal" type="number" value={values.creatinine} onChange={(event) => update('creatinine', event.target.value)} /></Field>
          <Field label="Unidad"><select value={values.unit} onChange={(event) => update('unit', event.target.value)}><option value="mgdl">mg/dL</option><option value="umol">micromol/L</option></select></Field>
        </div>
        <OpenProtocolButton onOpenProtocol={onOpenProtocol} />
      </div>
      <ToolResult
        title="eGFR"
        rows={[
          { label: 'Resultado', value: rounded ? `${rounded} mL/min/1,73 m2` : 'Introduce edad y creatinina válidas.' },
          { label: 'Categoría', value: classifyGfr(egfr) },
          { label: 'Qué hacer', value: 'Integrar con potasio, diuresis, daño renal agudo, contraste y seguridad farmacológica.' },
        ]}
      />
    </section>
  );
}

function LabControlTool({ onOpenProtocol }) {
  const [values, setValues] = useState({ baselineCreatinine: '', currentCreatinine: '', potassium: '', sodium: '', treatment: 'sraa' });
  const baseline = Number(values.baselineCreatinine);
  const current = Number(values.currentCreatinine);
  const potassium = Number(values.potassium);
  const sodium = Number(values.sodium);
  const creatinineRise = Number.isFinite(baseline) && Number.isFinite(current) && baseline > 0 ? ((current - baseline) / baseline) * 100 : null;
  const update = (key, value) => setValues((currentValues) => ({ ...currentValues, [key]: value }));
  let action = 'Completa datos para orientar seguridad.';
  if (Number.isFinite(potassium) && potassium >= 6) action = 'Hiperpotasemia relevante: valorar monitorización, ECG, suspensión/ajuste y circuito urgente según clínica.';
  else if (creatinineRise !== null && creatinineRise >= 30) action = 'Deterioro renal relevante: revisar volemia, AINE, SRAA/diuréticos/contraste y repetir analítica.';
  else if (Number.isFinite(sodium) && sodium < 130) action = 'Hiponatremia: correlacionar con síntomas y diuréticos; valorar observación/ingreso según gravedad.';
  else if (creatinineRise !== null || Number.isFinite(potassium) || Number.isFinite(sodium)) action = 'Sin alerta mayor introducida; monitorizar según tratamiento y contexto.';

  return (
    <section className="urg-hta-grid">
      <div className="urg-hta-card">
        <h2>Control analítico</h2>
        <Field label="Tratamiento implicado">
          <select value={values.treatment} onChange={(event) => update('treatment', event.target.value)}>
            <option value="sraa">IECA / ARA-II</option>
            <option value="diuretic">Diurético</option>
            <option value="spironolactone">Espironolactona</option>
            <option value="iv">Tratamiento IV</option>
            <option value="contrast">Contraste</option>
          </select>
        </Field>
        <div className="urg-hta-two-col">
          <Field label="Creatinina basal"><input inputMode="decimal" type="number" value={values.baselineCreatinine} onChange={(event) => update('baselineCreatinine', event.target.value)} /></Field>
          <Field label="Creatinina actual"><input inputMode="decimal" type="number" value={values.currentCreatinine} onChange={(event) => update('currentCreatinine', event.target.value)} /></Field>
          <Field label="Potasio"><input inputMode="decimal" type="number" value={values.potassium} onChange={(event) => update('potassium', event.target.value)} /></Field>
          <Field label="Sodio"><input inputMode="decimal" type="number" value={values.sodium} onChange={(event) => update('sodium', event.target.value)} /></Field>
        </div>
        <OpenProtocolButton onOpenProtocol={onOpenProtocol} />
      </div>
      <ToolResult
        title="Seguridad"
        rows={[
          { label: 'Creatinina', value: creatinineRise === null ? 'Sin comparación.' : `${round(creatinineRise, 1)}% respecto a basal.` },
          { label: 'Qué hacer', value: action },
          { label: 'Comprobar', value: 'Síntomas, ECG si hiperpotasemia relevante, diuresis, volemia, AINE, SRAA/diuréticos y contraste.' },
        ]}
      />
    </section>
  );
}

function IvPerfusionsTool({ onOpenProtocol }) {
  return (
    <section className="urg-hta-grid">
      <div className="urg-hta-card">
        <h2>Perfusiones IV HTA</h2>
        <div className="urg-hta-result-row">
          <span>Seguridad</span>
          <p>No calcula diluciones ni velocidades locales. Usar concentraciones del centro, bomba validada y ficha técnica.</p>
        </div>
        <OpenProtocolButton onOpenProtocol={onOpenProtocol} />
      </div>
      <div className="urg-hta-mini-grid">
        {ivTreatments.map((item) => (
          <article key={item.id}>
            <span>{item.scenario}</span>
            <h3>{item.title}</h3>
            <p>{item.dose}</p>
            <small>{item.caution} Revalorar: {item.reassess}. Fuente: {item.source}</small>
          </article>
        ))}
        <article>
          <span>No calculado</span>
          <h3>Dilución / velocidad</h3>
          <p>Requiere concentración disponible, presentación local, protocolo de perfusión y validación de farmacia/urgencias.</p>
        </article>
      </div>
    </section>
  );
}

export function HtaUrgSupportTool({ toolId, onBack, onOpenProtocol }) {
  const [showBibliography, setShowBibliography] = useState(false);
  const tool = htaUrgSupportTools.find((item) => item.id === toolId) ?? htaUrgSupportTools[0];
  const content = {
    'hta-timer': <ReassessmentTimerTool onOpenProtocol={onOpenProtocol} />,
    'bp-series': <BpSeriesTool onOpenProtocol={onOpenProtocol} />,
    egfr: <EgfrTool onOpenProtocol={onOpenProtocol} />,
    'lab-control': <LabControlTool onOpenProtocol={onOpenProtocol} />,
    'iv-perfusions': <IvPerfusionsTool onOpenProtocol={onOpenProtocol} />,
  }[tool.id];

  return (
    <div className="screen detail-screen urg-hta">
      <div className="urg-hta-header">
        <DetailHeader title={tool.title} subtitle={tool.description} onBack={onBack} />
        <button className="urg-hta-bibliography-button" type="button" onClick={() => setShowBibliography(true)} aria-label="Abrir bibliografía">B</button>
      </div>
      {content}
      {showBibliography && <BibliographyModal onClose={() => setShowBibliography(false)} />}
    </div>
  );
}
