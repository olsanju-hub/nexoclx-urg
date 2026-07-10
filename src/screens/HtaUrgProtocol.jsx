import { useEffect, useMemo, useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { htaUrgSources, ivTreatments, oralTreatments } from '../data/htaUrgProtocol.js';

const initialValues = {
  sbp: '',
  dbp: '',
  presentation: 'asymptomatic',
  treatment: 'none',
  knownHta: false,
  poorAdherence: false,
  recentWithdrawal: false,
  stimulants: false,
  ckd: false,
  cvd: false,
  frailty: false,
  neuroDamage: false,
  coronaryDamage: false,
  heartFailureDamage: false,
  dissectionDamage: false,
  renalDamage: false,
  retinaDamage: false,
  pregnancyDamage: false,
};

const presentations = {
  asymptomatic: 'Asintomático',
  mild: 'Síntomas leves/inespecíficos',
  chestPain: 'Dolor torácico',
  dyspnea: 'Disnea',
  pulmonaryEdema: 'Edema agudo de pulmón',
  focalDeficit: 'Déficit neurológico',
  visual: 'Alteración visual intensa',
  encephalopathy: 'Confusión / encefalopatía',
  stroke: 'Sospecha de ictus',
  acs: 'Sospecha de SCA',
  dissection: 'Sospecha de disección aórtica',
  renal: 'IRA / oliguria',
  pregnancy: 'Embarazo / puerperio',
};

const treatments = {
  none: 'Ninguno',
  ace: 'IECA',
  arb: 'ARA-II',
  ccb: 'Calcioantagonista',
  diuretic: 'Diurético',
  beta: 'Betabloqueante',
  dual: 'Doble terapia',
  triple: 'Triple terapia',
  spironolactone: 'Espironolactona',
  other: 'Otros',
};

const timerOptions = [5, 10, 15, 30, 60];

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasOrganDamage(values) {
  return values.neuroDamage || values.coronaryDamage || values.heartFailureDamage || values.dissectionDamage || values.renalDamage || values.retinaDamage || values.pregnancyDamage;
}

function classifyBp(sbp, dbp) {
  if (sbp === null || dbp === null) return { label: 'PA no clasificada', tone: 'neutral' };
  if (sbp >= 180 || dbp >= 120) return { label: 'PA severa', tone: 'alert' };
  if (sbp >= 160 || dbp >= 100) return { label: 'PA muy elevada', tone: 'warning' };
  if (sbp >= 140 || dbp >= 90) return { label: 'HTA', tone: 'warning' };
  return { label: 'PA no severa', tone: 'ok' };
}

function inferScenario(values) {
  if (values.presentation === 'pregnancy' || values.pregnancyDamage) return 'pregnancy';
  if (values.presentation === 'dissection' || values.dissectionDamage) return 'dissection';
  if (values.presentation === 'stroke' || values.presentation === 'focalDeficit' || values.neuroDamage) return 'neuro';
  if (values.presentation === 'acs' || values.presentation === 'chestPain' || values.coronaryDamage) return 'coronary';
  if (values.presentation === 'pulmonaryEdema' || values.presentation === 'dyspnea' || values.heartFailureDamage) return 'pulmonary';
  if (values.presentation === 'renal' || values.renalDamage) return 'renal';
  if (values.presentation === 'mild') return 'mild';
  return 'asymptomatic';
}

function urgentTests(scenario, damage) {
  const tests = ['Repetir PA con técnica correcta', 'ECG', 'Creatinina/eGFR e iones'];
  if (damage) tests.push('Monitorización y vía venosa');
  if (scenario === 'coronary') tests.push('Troponina seriada según clínica', 'Rx tórax si dolor/disnea');
  if (scenario === 'pulmonary') tests.push('Rx tórax', 'Gasometría si insuficiencia respiratoria', 'Analítica con función renal/electrolitos');
  if (scenario === 'neuro') tests.push('Neuroimagen urgente según clínica', 'Glucemia y valoración código ictus');
  if (scenario === 'dissection') tests.push('AngioTC si estabilidad y sospecha compatible', 'ECG y Rx tórax sin retrasar circuito');
  if (scenario === 'renal') tests.push('Orina/sedimento, proteinuria/hematuria si procede', 'Balance hídrico/diuresis');
  if (scenario === 'mild' || scenario === 'asymptomatic') tests.push('Pruebas dirigidas por clínica; no pedir todo si no cambia conducta');
  return tests.join(' · ');
}

function buildRecommendation(values) {
  const sbp = toNumber(values.sbp);
  const dbp = toNumber(values.dbp);
  const bp = classifyBp(sbp, dbp);
  const damage = hasOrganDamage(values);
  const scenario = inferScenario(values);
  const severe = sbp >= 180 || dbp >= 120;
  const mildSymptoms = scenario === 'mild';

  if (sbp === null || dbp === null) {
    return {
      tone: 'neutral',
      title: 'Introduce PA',
      classification: 'Sin datos suficientes',
      suspicion: 'No evaluable',
      damage: 'No evaluado',
      severity: 'No clasificada',
      tests: 'PAS/PAD válidas antes de decidir.',
      now: 'Completar cifras y clínica.',
      treatment: 'No iniciar tratamiento sin datos mínimos salvo inestabilidad clínica.',
      dose: 'No aplica.',
      reassessment: 'Tras medición correcta.',
      target: 'No aplica.',
      avoid: 'Decidir por una toma aislada mal medida.',
      destination: 'Completar evaluación.',
      source: 'NICE NG136 / ESC 2024.',
    };
  }

  if (scenario === 'pregnancy') {
    return {
      tone: 'alert',
      title: 'Ruta obstétrica',
      classification: `${bp.label}. Embarazo/puerperio fuera de este protocolo general.`,
      suspicion: 'Preeclampsia/eclampsia u otra HTA específica de embarazo.',
      damage: values.pregnancyDamage ? 'Posible daño obstétrico.' : 'Requiere ruta específica.',
      severity: 'Alta si síntomas o PA severa.',
      tests: 'No usar algoritmo general; activar circuito obstétrico.',
      now: 'Valoración obstétrica urgente si PA severa o clínica compatible.',
      treatment: 'Protocolo específico obstétrico.',
      dose: 'Ruta específica obstétrica.',
      reassessment: 'Inmediata según circuito.',
      target: 'Según protocolo de embarazo.',
      avoid: 'IECA/ARA-II y manejo adulto general.',
      destination: 'Obstetricia / urgencias obstétricas.',
      source: 'Exclusión de seguridad.',
    };
  }

  if (scenario === 'dissection') {
    return {
      tone: 'alert',
      title: 'Sospecha de disección',
      classification: `${bp.label}. Emergencia tiempo-dependiente.`,
      suspicion: 'Disección aórtica hasta descartarla.',
      damage: 'Aórtico/vascular.',
      severity: 'Crítica.',
      tests: urgentTests('dissection', true),
      now: 'Monitorización, vía venosa, analgesia, angioTC si procede e interconsulta urgente.',
      treatment: 'No usar algoritmo general; control estrecho en circuito específico.',
      dose: 'Pauta específica no implementada por seguridad local.',
      reassessment: 'Continua.',
      target: 'Control rápido y estrecho según protocolo específico.',
      avoid: 'Retrasar imagen/interconsulta o descenso no monitorizado.',
      destination: 'UCI / cirugía vascular-cardiaca según circuito.',
      source: 'ESC 2024.',
    };
  }

  if (damage) {
    const pulmonary = scenario === 'pulmonary';
    const coronary = scenario === 'coronary';
    const neuro = scenario === 'neuro';
    return {
      tone: 'alert',
      title: 'Emergencia hipertensiva',
      classification: `${bp.label} + daño agudo de órgano diana.`,
      suspicion: scenario === 'renal' ? 'Daño renal agudo asociado a HTA.' : coronary ? 'SCA/dolor torácico con HTA.' : pulmonary ? 'Edema pulmonar/congestión.' : neuro ? 'Daño neurológico; requiere protocolo específico.' : 'Emergencia hipertensiva.',
      damage: 'Presente.',
      severity: 'Alta.',
      tests: urgentTests(scenario, true),
      now: 'Monitorizar, vía venosa, tratar escenario y evitar descenso brusco no indicado.',
      treatment: pulmonary || coronary ? 'Nitroglicerina IV si SCA/congestión y no contraindicada; furosemida IV si congestión.' : neuro ? 'Ruta neurológica; no bajar PA indiscriminadamente.' : 'Labetalol IV si no contraindicado y requiere control IV.',
      dose: pulmonary || coronary ? 'Nitroglicerina IV 5-10 microgramos/min y titular. Furosemida 20-40 mg IV si sobrecarga.' : neuro ? 'Objetivo y pauta según protocolo neurológico específico.' : 'Labetalol IV 20 mg lento; repetir 40-80 mg cada 10 min. Máximo 300 mg.',
      reassessment: pulmonary || coronary ? '5-10 min si perfusión IV; 30-60 min si diurético.' : '10-15 min tras bolo IV o continua si perfusión.',
      target: 'Reducción controlada inicial; evitar caída excesiva salvo escenarios específicos.',
      avoid: 'Vía sublingual, descensos bruscos y tratamiento IV si no hay daño agudo.',
      destination: pulmonary || coronary || neuro ? 'Ingreso/UCI o interconsulta específica según gravedad.' : 'Ingreso monitorizado; UCI si perfusión/titulación estrecha.',
      source: 'ESC 2024 / AEMPS CIMA.',
    };
  }

  if (severe) {
    return {
      tone: mildSymptoms ? 'warning' : 'ok',
      title: 'HTA severa sin daño agudo',
      classification: `${bp.label} sin daño agudo objetivado.`,
      suspicion: mildSymptoms ? 'Síntomas leves no equivalen a emergencia; descartar daño.' : 'HTA severa asintomática.',
      damage: 'No marcado.',
      severity: mildSymptoms ? 'Intermedia' : 'No emergencia si reevaluación estable.',
      tests: urgentTests(scenario, false),
      now: 'Reposo, repetir PA, revisar adherencia, retirada de fármacos, dolor, ansiedad o tóxicos.',
      treatment: 'Tratamiento oral o ajuste si persiste tras reposo y no hay daño agudo.',
      dose: 'Captopril 12,5-25 mg VO si procede y no contraindicado; amlodipino 5 mg VO si se busca ajuste sostenido.',
      reassessment: '30-60 min con captopril; 60-120 min si ajuste oral/observación.',
      target: 'Descenso gradual; no normalizar de forma brusca.',
      avoid: 'Tratamiento IV y vía sublingual si no hay daño agudo.',
      destination: 'Observación si dudas/síntomas; alta si buen estado, reevaluación favorable y seguimiento garantizado.',
      source: 'NICE NG136 / ESC 2024 / AEMPS CIMA.',
    };
  }

  return {
    tone: 'ok',
    title: 'HTA no emergente',
    classification: bp.label,
    suspicion: 'Sin datos de emergencia hipertensiva.',
    damage: 'No marcado.',
    severity: 'Baja-intermedia según contexto.',
    tests: urgentTests(scenario, false),
    now: 'Confirmar medida y orientar seguimiento/ajuste no urgente.',
    treatment: 'No requiere tratamiento IV. Ajuste oral solo si contexto clínico lo justifica.',
    dose: 'Si ajuste: usar tratamiento crónico adecuado, no rescate brusco.',
    reassessment: 'Según síntomas y cifras repetidas.',
    target: 'Control progresivo.',
    avoid: 'Sobreactuar por una toma aislada.',
    destination: 'Alta con plan y seguimiento si estabilidad; observación si dudas.',
    source: 'NICE NG136 / ESC 2024.',
  };
}

function Field({ label, children }) {
  return (
    <label className="urg-hta-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ResultRow({ label, value }) {
  return (
    <div className="urg-hta-result-row">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function BibliographyModal({ onClose }) {
  return (
    <div className="urg-hta-modal-backdrop" role="presentation">
      <section className="urg-hta-modal" role="dialog" aria-modal="true" aria-labelledby="hta-urg-bibliography-title">
        <div className="urg-hta-modal-header">
          <h2 id="hta-urg-bibliography-title">Bibliografía</h2>
          <button type="button" onClick={onClose}>Cerrar</button>
        </div>
        <div className="urg-hta-source-list">
          {htaUrgSources.map((source) => (
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

function TimerPanel() {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [reason, setReason] = useState('Revalorar TA, síntomas y daño orgánico');
  const [customMinutes, setCustomMinutes] = useState('');
  const active = secondsLeft !== null && secondsLeft > 0;
  const done = secondsLeft === 0;

  useEffect(() => {
    if (!active) return undefined;
    const id = window.setInterval(() => {
      setSecondsLeft((current) => (current && current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  const start = (minutes, nextReason = reason) => {
    setReason(nextReason);
    setSecondsLeft(minutes * 60);
  };
  const minutes = secondsLeft === null ? '--' : String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = secondsLeft === null ? '--' : String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className={`urg-hta-timer ${done ? 'is-done' : ''}`}>
      <div>
        <span>Revaloración</span>
        <strong>{minutes}:{seconds}</strong>
        <p>{done ? 'Tiempo cumplido: revalorar TA, síntomas y daño orgánico.' : reason}</p>
      </div>
      <div className="urg-hta-timer-actions">
        {timerOptions.map((option) => (
          <button type="button" key={option} onClick={() => start(option)}>{option} min</button>
        ))}
        <input inputMode="numeric" type="number" min="1" max="240" value={customMinutes} onChange={(event) => setCustomMinutes(event.target.value)} placeholder="min" />
        <button type="button" onClick={() => start(Number(customMinutes) || 5)}>Iniciar</button>
        <button type="button" onClick={() => setSecondsLeft(null)}>Reset</button>
      </div>
    </section>
  );
}

export function HtaUrgProtocol({ onBack }) {
  const [values, setValues] = useState(initialValues);
  const [showBibliography, setShowBibliography] = useState(false);
  const recommendation = useMemo(() => buildRecommendation(values), [values]);
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <div className="screen detail-screen urg-hta">
      <div className="urg-hta-header">
        <DetailHeader title="HTA en Urgencias" subtitle="Daño orgánico, tratamiento inicial y destino" onBack={onBack} />
        <button className="urg-hta-bibliography-button" type="button" onClick={() => setShowBibliography(true)} aria-label="Abrir bibliografía">B</button>
      </div>

      <section className="urg-hta-grid">
        <div className="urg-hta-card">
          <h2>Triage</h2>
          <div className="urg-hta-two-col">
            <Field label="PAS"><input inputMode="numeric" type="number" value={values.sbp} onChange={(event) => update('sbp', event.target.value)} placeholder="mmHg" /></Field>
            <Field label="PAD"><input inputMode="numeric" type="number" value={values.dbp} onChange={(event) => update('dbp', event.target.value)} placeholder="mmHg" /></Field>
          </div>
          <Field label="Situación clínica">
            <select value={values.presentation} onChange={(event) => update('presentation', event.target.value)}>
              {Object.entries(presentations).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
          <Field label="Tratamiento actual">
            <select value={values.treatment} onChange={(event) => update('treatment', event.target.value)}>
              {Object.entries(treatments).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
          <div className="urg-hta-check-grid">
            {[
              ['knownHta', 'HTA conocida'],
              ['poorAdherence', 'Adherencia dudosa'],
              ['recentWithdrawal', 'Retirada reciente'],
              ['stimulants', 'Tóxicos/simpaticomiméticos'],
              ['ckd', 'ERC'],
              ['cvd', 'ECV previa'],
              ['frailty', 'Fragilidad/anciano'],
            ].map(([id, label]) => (
              <label key={id}><input type="checkbox" checked={values[id]} onChange={(event) => update(id, event.target.checked)} />{label}</label>
            ))}
          </div>
        </div>

        <div className={`urg-hta-result is-${recommendation.tone}`}>
          <span>{recommendation.title}</span>
          <ResultRow label="Clasificación" value={recommendation.classification} />
          <ResultRow label="Sospecha principal" value={recommendation.suspicion} />
          <ResultRow label="Daño orgánico" value={recommendation.damage} />
          <ResultRow label="Gravedad" value={recommendation.severity} />
          <ResultRow label="Pruebas urgentes" value={recommendation.tests} />
          <ResultRow label="Qué hacer ahora" value={recommendation.now} />
          <ResultRow label="Tratamiento recomendado" value={recommendation.treatment} />
          <ResultRow label="Dosis / pauta" value={recommendation.dose} />
          <ResultRow label="Revaloración" value={recommendation.reassessment} />
          <ResultRow label="Objetivo de descenso" value={recommendation.target} />
          <ResultRow label="Evitar" value={recommendation.avoid} />
          <ResultRow label="Destino" value={recommendation.destination} />
          <ResultRow label="Fuente" value={recommendation.source} />
        </div>
      </section>

      <section className="urg-hta-card">
        <h2>Daño agudo de órgano diana</h2>
        <div className="urg-hta-check-grid">
          {[
            ['neuroDamage', 'Neurológico'],
            ['coronaryDamage', 'Coronario'],
            ['heartFailureDamage', 'IC / edema pulmonar'],
            ['dissectionDamage', 'Disección aórtica'],
            ['renalDamage', 'Renal'],
            ['retinaDamage', 'Retinopatía grave'],
            ['pregnancyDamage', 'Preeclampsia/eclampsia'],
          ].map(([id, label]) => (
            <label key={id}><input type="checkbox" checked={values[id]} onChange={(event) => update(id, event.target.checked)} />{label}</label>
          ))}
        </div>
      </section>

      <section className="urg-hta-accordion" aria-label="Protocolo HTA urgencias">
        <details open>
          <summary>Pruebas</summary>
          <div className="urg-hta-mini-grid">
            <article><span>Base</span><p>PA repetida, ECG, creatinina/eGFR, iones.</p></article>
            <article><span>Dolor torácico/SCA</span><p>ECG inmediato, troponina si procede, Rx tórax según clínica.</p></article>
            <article><span>Neurológico</span><p>Neuroimagen/ruta ictus; no bajar PA de forma indiscriminada.</p></article>
            <article><span>Disección</span><p>AngioTC e interconsulta urgente si sospecha compatible.</p></article>
          </div>
        </details>
        <details>
          <summary>Tratamiento IV</summary>
          <div className="urg-hta-mini-grid">
            {ivTreatments.map((item) => (
              <article key={item.id}>
                <span>{item.scenario}</span>
                <h3>{item.title}</h3>
                <p>{item.dose}</p>
                <small>{item.caution} Revalorar: {item.reassess}. Fuente: {item.source}</small>
              </article>
            ))}
          </div>
        </details>
        <details>
          <summary>Tratamiento VO</summary>
          <div className="urg-hta-mini-grid">
            {oralTreatments.map((item) => (
              <article key={item.id}>
                <span>{item.scenario}</span>
                <h3>{item.title}</h3>
                <p>{item.dose}</p>
                <small>{item.caution} Revalorar: {item.reassess}. Fuente: {item.source}</small>
              </article>
            ))}
          </div>
        </details>
        <details>
          <summary>Revaloración / destino</summary>
          <div className="urg-hta-mini-grid">
            <article><span>Alta</span><p>Sin daño agudo, buen estado, reevaluación favorable, plan y seguimiento.</p></article>
            <article><span>Observación</span><p>Síntomas leves, dudas diagnósticas o respuesta pendiente.</p></article>
            <article><span>Ingreso</span><p>Daño orgánico, descompensación, comorbilidad o necesidad de tratamiento IV.</p></article>
            <article><span>UCI/interconsulta</span><p>Perfusión IV/titulación estrecha, disección, EAP grave, encefalopatía o SCA grave.</p></article>
          </div>
        </details>
      </section>

      <TimerPanel />

      {showBibliography && <BibliographyModal onClose={() => setShowBibliography(false)} />}
    </div>
  );
}
