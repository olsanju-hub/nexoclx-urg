import { useMemo, useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';
import { getItemById } from '../lib/clinicalSearch.js';

function TagRow({ item }) {
  return (
    <div className="tag-row">
      <span>{item.type}</span>
      <span>{item.priority}</span>
      {item.areas?.map((area) => <span key={area}>{area}</span>)}
    </div>
  );
}

function ClinicalBlock({ title, items }) {
  if (!items?.length) return null;
  const list = Array.isArray(items) ? items : [items];
  return (
    <section className="decision-result clinical-section">
      <h3>{title}</h3>
      <ul className="clinical-bullets">
        {list.map((value) => <li key={value}>{value}</li>)}
      </ul>
    </section>
  );
}

function LinkedItems({ title, ids = [], onOpen }) {
  const items = ids.map(getItemById).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="decision-result clinical-section">
      <h3>{title}</h3>
      <div className="linked-chip-grid">
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => onOpen(item.id)}>{item.title}</button>
        ))}
      </div>
    </section>
  );
}

function DestinationBlock({ destination }) {
  if (!destination) return null;
  return (
    <section className="decision-result clinical-section is-destination">
      <h3>Destino</h3>
      <div className="destination-grid">
        {Object.entries(destination).map(([key, values]) => (
          <article key={key}>
            <strong>{key.toUpperCase()}</strong>
            <ul className="clinical-bullets">
              {(Array.isArray(values) ? values : [values]).map((value) => <li key={value}>{value}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

const calculatorConfigs = {
  news2: {
    summary: 'Estratifica deterioro fisiologico en Urgencias y activa intensidad de vigilancia/respuesta.',
    action: 'NEWS2 alto obliga a reevaluacion urgente, monitorizacion y considerar criticos/UCI.',
    fields: [
      { id: 'fr', label: 'FR score', unit: '0-3', hint: 'Puntua la frecuencia respiratoria medida, no la impresion subjetiva.' },
      { id: 'sat', label: 'SatO2 score', unit: '0-3', hint: 'Usa la escala de saturacion aplicable al paciente.' },
      { id: 'oxygen', label: 'Oxigeno', unit: '0 no / 2 si', hint: 'Suma 2 si precisa oxigeno suplementario.' },
      { id: 'pas', label: 'PAS score', unit: '0-3', hint: 'Toma la presion arterial sistolica actual.' },
      { id: 'fc', label: 'FC score', unit: '0-3', hint: 'Frecuencia cardiaca monitorizada o tomada manual.' },
      { id: 'temp', label: 'Temp score', unit: '0-3', hint: 'Temperatura objetiva.' },
      { id: 'mental', label: 'Conciencia', unit: '0 alerta / 3 alterada', hint: 'AVPU: alerta puntua 0; nueva confusion/respuesta a voz/dolor/no responde puntua 3.' },
    ],
    calculate: (values) => {
      const keys = ['fr', 'sat', 'oxygen', 'pas', 'fc', 'temp', 'mental'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result >= 7 ? 'Alto riesgo: criticos/UCI y reevaluacion urgente.' : result >= 5 ? 'Riesgo medio-alto: respuesta clinica urgente y monitorizacion.' : result >= 1 ? 'Riesgo bajo-intermedio: vigilancia segun contexto.' : 'Bajo riesgo si clinica concordante.' };
    },
  },
  glasgow: {
    summary: 'Cuantifica nivel de conciencia para coma, TCE, ictus, intoxicacion y necesidad de via aerea.',
    action: 'GCS <=8 o deterioro obliga a proteger via aerea/criticos salvo techo terapeutico.',
    fields: [{ id: 'eye', label: 'Ocular', unit: '1-4', hint: 'Apertura ocular espontanea, a voz, dolor o ninguna.' }, { id: 'verbal', label: 'Verbal', unit: '1-5', hint: 'Orientado, confuso, palabras, sonidos o ninguna respuesta.' }, { id: 'motor', label: 'Motora', unit: '1-6', hint: 'Obedece, localiza, retirada, flexion, extension o ninguna.' }],
    calculate: ({ eye, verbal, motor }) => {
      if ([eye, verbal, motor].some((value) => value === '')) return null;
      const result = Number(eye) + Number(verbal) + Number(motor);
      return { value: `${result}/15`, interpretation: result <= 8 ? 'Coma grave: proteger via aerea y criticos.' : result <= 12 ? 'Alteracion moderada: TC/monitorizacion segun causa.' : 'Leve si estable; reevaluar tendencia.' };
    },
  },
  heart: {
    summary: 'Estima riesgo en dolor toracico con ECG y troponina disponibles.',
    action: 'Solo apoya alta si bajo riesgo, ECG/troponina seriada concordantes y no hay diagnostico tiempo-dependiente alternativo.',
    fields: [{ id: 'history', label: 'Historia', unit: '0-2', hint: '0 poco sospechosa, 1 intermedia, 2 muy sugestiva de SCA.' }, { id: 'ecg', label: 'ECG', unit: '0-2', hint: '0 normal, 1 cambios inespecificos, 2 cambios isquemicos significativos.' }, { id: 'age', label: 'Edad', unit: '0-2', hint: '0 <45, 1 45-64, 2 >=65 anos.' }, { id: 'risk', label: 'Factores riesgo', unit: '0-2', hint: 'HTA, DM, tabaco, dislipemia, familia, obesidad, aterosclerosis.' }, { id: 'troponin', label: 'Troponina', unit: '0-2', hint: 'Usa valor respecto al limite superior y dinamica seriada.' }],
    calculate: (values) => {
      const keys = ['history', 'ecg', 'age', 'risk', 'troponin'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result <= 3 ? 'Bajo riesgo si troponina seriada/ECG concordantes: valorar alta protocolizada.' : result <= 6 ? 'Riesgo intermedio: observacion, troponinas seriadas y valoracion.' : 'Alto riesgo: ingreso/cardiologia/estrategia invasiva segun contexto.' };
    },
  },
  grace: {
    summary: 'Aproxima riesgo en SCA para decidir monitorizacion e invasiva temprana.',
    action: 'Alto riesgo o inestabilidad: cardiologia/hemodinamica y monitorizacion, no alta.',
    fields: [{ id: 'age', label: 'Edad', unit: 'anos', hint: 'Edad real.' }, { id: 'hr', label: 'FC', unit: 'lpm', hint: 'Frecuencia cardiaca inicial.' }, { id: 'sbp', label: 'PAS', unit: 'mmHg', hint: 'Presion sistolica inicial.' }, { id: 'creatinine', label: 'Creatinina', unit: 'mg/dL', hint: 'Creatinina inicial; convierte si el laboratorio informa en micromol/L.' }, { id: 'killip', label: 'Killip', unit: '1-4', hint: '1 sin IC; 2 crepitantes/S3; 3 EAP; 4 shock.' }, { id: 'st', label: 'Desviacion ST', unit: '0/1', hint: 'ST elevado/deprimido o equivalente isquemico.' }, { id: 'troponin', label: 'Troponina positiva', unit: '0/1', hint: 'Troponina por encima del percentil 99 o dinamica significativa.' }, { id: 'arrest', label: 'PCR al ingreso', unit: '0/1', hint: 'Parada cardiaca relacionada con el episodio actual.' }],
    calculate: ({ age, hr, sbp, creatinine, killip, st, troponin, arrest }) => {
      if ([age, hr, sbp, creatinine, killip, st, troponin, arrest].some((value) => value === '')) return null;
      const score = (Number(age) >= 75 ? 45 : Number(age) >= 65 ? 35 : Number(age) >= 55 ? 25 : 10)
        + (Number(hr) >= 110 ? 25 : Number(hr) >= 90 ? 15 : 5)
        + (Number(sbp) < 90 ? 45 : Number(sbp) < 120 ? 25 : 5)
        + (Number(creatinine) >= 2 ? 25 : Number(creatinine) >= 1.3 ? 15 : 5)
        + (Number(killip) >= 3 ? 35 : Number(killip) === 2 ? 20 : 0)
        + (Number(st) ? 25 : 0)
        + (Number(troponin) ? 15 : 0)
        + (Number(arrest) ? 40 : 0);
      return { value: `${score} puntos orientativos`, interpretation: score >= 140 ? 'Alto/muy alto riesgo: cardiologia, monitorizacion y estrategia invasiva urgente segun ECG/clinica.' : score >= 109 ? 'Riesgo intermedio: observacion monitorizada y estrategia invasiva segun evolucion.' : 'Riesgo bajo si ECG/troponinas seriadas y clinica son concordantes.' };
    },
  },
  'wells-tep': {
    summary: 'Estima probabilidad clinica de TEP antes de D-dimero o angioTC.',
    action: 'TEP probable orienta a imagen y anticoagulacion si no contraindica; TEP improbable permite D-dimero/PERC segun contexto.',
    fields: [{ id: 'dvt', label: 'Clinica TVP', unit: '0/3', hint: 'Dolor/edema unilateral, trayecto venoso o signos objetivos.' }, { id: 'alternative', label: 'TEP mas probable', unit: '0/3', hint: 'Juicio clinico: no hay diagnostico alternativo mas probable.' }, { id: 'hr', label: 'FC >100', unit: '0/1.5', hint: 'Frecuencia cardiaca inicial.' }, { id: 'immobilization', label: 'Cirugia/inmovilizacion', unit: '0/1.5', hint: 'Cirugia reciente o inmovilizacion prolongada.' }, { id: 'vte', label: 'ETV previa', unit: '0/1.5', hint: 'TEP o TVP previos.' }, { id: 'hemoptysis', label: 'Hemoptisis', unit: '0/1', hint: 'Hemoptisis actual no explicada.' }, { id: 'cancer', label: 'Cancer activo', unit: '0/1', hint: 'Tratamiento activo, paliativo o diagnostico reciente.' }],
    calculate: (values) => {
      const keys = ['dvt', 'alternative', 'hr', 'immobilization', 'vte', 'hemoptysis', 'cancer'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result.toFixed(1)} puntos`, interpretation: result > 4 ? 'TEP probable: angioTC/eco si shock y anticoagulacion si no contraindica.' : 'TEP improbable: PERC si muy baja probabilidad o D-dimero segun contexto.' };
    },
  },
  pesi: {
    summary: 'Estratifica riesgo en TEP confirmado para alta seleccionada, ingreso o UCI.',
    action: 'No usar para descartar TEP; se aplica tras diagnostico o sospecha muy alta.',
    fields: [{ id: 'age', label: 'Edad', unit: 'anos', hint: 'Edad real, suma directamente.' }, { id: 'male', label: 'Varon', unit: '0/10', hint: 'Suma 10 si varon.' }, { id: 'cancer', label: 'Cancer', unit: '0/30', hint: 'Cancer activo.' }, { id: 'hf', label: 'IC', unit: '0/10', hint: 'Insuficiencia cardiaca previa.' }, { id: 'lung', label: 'Enf. pulmonar', unit: '0/10', hint: 'EPOC u otra enfermedad pulmonar cronica significativa.' }, { id: 'hr', label: 'FC >=110', unit: '0/20', hint: 'Frecuencia cardiaca actual.' }, { id: 'sbp', label: 'PAS <100', unit: '0/30', hint: 'Hipotension actual.' }, { id: 'rr', label: 'FR >=30', unit: '0/20', hint: 'Frecuencia respiratoria.' }, { id: 'temp', label: 'Temp <36', unit: '0/20', hint: 'Hipotermia.' }, { id: 'mental', label: 'Alteracion mental', unit: '0/60', hint: 'Confusion, somnolencia o bajo nivel de conciencia.' }, { id: 'sat', label: 'SatO2 <90', unit: '0/20', hint: 'Saturacion basal o con oxigeno segun contexto.' }],
    calculate: (values) => {
      const keys = ['age', 'male', 'cancer', 'hf', 'lung', 'hr', 'sbp', 'rr', 'temp', 'mental', 'sat'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = Number(values.age) + keys.filter((key) => key !== 'age').reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result <= 85 ? 'Bajo riesgo si TEP confirmado estable y sin contraindicaciones sociales/clinicas: valorar alta protocolizada.' : result <= 105 ? 'Riesgo intermedio: ingreso/observacion.' : 'Alto riesgo: ingreso monitorizado/UCI segun disfuncion VD, biomarcadores o shock.' };
    },
  },
  nihss: {
    summary: 'Cuantifica deficit neurologico en ictus para comunicar gravedad y tendencia.',
    action: 'No retrasa codigo ictus; deficit leve pero incapacitante tambien puede requerir circuito.',
    fields: [{ id: 'loc', label: 'Conciencia/preguntas/ordenes', unit: '0-7', hint: 'Suma nivel de conciencia, preguntas y ordenes.' }, { id: 'gaze', label: 'Mirada/campos', unit: '0-5', hint: 'Desviacion mirada y hemianopsia.' }, { id: 'face', label: 'Facial', unit: '0-3', hint: 'Asimetria facial.' }, { id: 'motorArm', label: 'Motor brazos', unit: '0-8', hint: 'Paresia de ambos brazos.' }, { id: 'motorLeg', label: 'Motor piernas', unit: '0-8', hint: 'Paresia de ambas piernas.' }, { id: 'ataxia', label: 'Ataxia', unit: '0-2', hint: 'Ataxia de extremidades.' }, { id: 'sensory', label: 'Sensibilidad', unit: '0-2', hint: 'Hipoestesia.' }, { id: 'language', label: 'Lenguaje/disartria/extincion', unit: '0-8', hint: 'Afasia, disartria, negligencia/extincion.' }],
    calculate: (values) => {
      const keys = ['loc', 'gaze', 'face', 'motorArm', 'motorLeg', 'ataxia', 'sensory', 'language'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result >= 15 ? 'Ictus moderado-grave: codigo ictus, neuroimagen urgente y valorar gran vaso.' : result >= 5 ? 'Deficit relevante: codigo ictus si cumple criterios y seguimiento de tendencia.' : 'Deficit leve: no excluye tratamiento si incapacitante; documentar sintomas y hora.' };
    },
  },
  'curb65': {
    fields: [{ id: 'confusion', label: 'Confusion', unit: '0/1' }, { id: 'urea', label: 'Urea alta', unit: '0/1' }, { id: 'fr', label: 'FR >=30', unit: '0/1' }, { id: 'bp', label: 'PA baja', unit: '0/1' }, { id: 'age', label: 'Edad >=65', unit: '0/1' }],
    calculate: (values) => {
      const keys = ['confusion', 'urea', 'fr', 'bp', 'age'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result >= 3 ? 'Neumonia grave: ingreso y valorar UCI.' : result === 2 ? 'Riesgo intermedio: ingreso/observacion.' : 'Bajo riesgo si no hay hipoxemia, comorbilidad ni mala situacion social.' };
    },
  },
  perc: {
    fields: [{ id: 'age', label: 'Edad <50', unit: '1 si cumple' }, { id: 'hr', label: 'FC <100', unit: '1' }, { id: 'sat', label: 'SatO2 >=95', unit: '1' }, { id: 'hemoptysis', label: 'Sin hemoptisis', unit: '1' }, { id: 'estrogen', label: 'Sin estrogenos', unit: '1' }, { id: 'surgery', label: 'Sin cirugia/trauma', unit: '1' }, { id: 'vte', label: 'Sin ETV previa', unit: '1' }, { id: 'leg', label: 'Sin edema unilateral', unit: '1' }],
    calculate: (values) => {
      const keys = ['age', 'hr', 'sat', 'hemoptysis', 'estrogen', 'surgery', 'vte', 'leg'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result}/8 criterios negativos`, interpretation: result === 8 ? 'Si probabilidad clinica muy baja: puede evitar D-dimero/TC.' : 'PERC positivo: no descarta TEP; usar Wells/D-dimero/imagen segun probabilidad.' };
    },
  },
  race: {
    fields: [{ id: 'face', label: 'Cara', unit: '0-2' }, { id: 'arm', label: 'Brazo', unit: '0-2' }, { id: 'leg', label: 'Pierna', unit: '0-2' }, { id: 'gaze', label: 'Mirada', unit: '0-1' }, { id: 'aphasia', label: 'Afasia/agnosia', unit: '0-2' }],
    calculate: (values) => {
      const keys = ['face', 'arm', 'leg', 'gaze', 'aphasia'];
      if (keys.some((key) => values[key] === '')) return null;
      const result = keys.reduce((sum, key) => sum + Number(values[key]), 0);
      return { value: `${result} puntos`, interpretation: result >= 5 ? 'Alta sospecha de gran vaso: activar neurointervencionismo segun circuito.' : 'Menor probabilidad de gran vaso; no excluye codigo ictus.' };
    },
  },
  'anion-gap': {
    fields: [{ id: 'na', label: 'Na', unit: 'mmol/L' }, { id: 'cl', label: 'Cl', unit: 'mmol/L' }, { id: 'hco3', label: 'HCO3', unit: 'mmol/L' }],
    calculate: ({ na, cl, hco3 }) => {
      if ([na, cl, hco3].some((value) => value === '')) return null;
      const result = Number(na) - Number(cl) - Number(hco3);
      return { value: `${result.toFixed(1)} mmol/L`, interpretation: result > 12 ? 'Anion gap elevado: lactato, CAD, renal, toxicos o shock.' : 'Anion gap no elevado: buscar perdidas bicarbonato, renal tubular u otras causas.' };
    },
  },
  osmolaridad: {
    fields: [{ id: 'na', label: 'Na', unit: 'mmol/L' }, { id: 'glucose', label: 'Glucosa', unit: 'mg/dL' }, { id: 'urea', label: 'Urea', unit: 'mg/dL' }],
    calculate: ({ na, glucose, urea }) => {
      if ([na, glucose, urea].some((value) => value === '')) return null;
      const result = 2 * Number(na) + Number(glucose) / 18 + Number(urea) / 6;
      return { value: `${result.toFixed(0)} mOsm/kg`, interpretation: result >= 320 ? 'Hiperosmolaridad relevante: EHH, hipernatremia o toxicos segun contexto.' : 'No alcanza umbral hiperosmolar grave; interpretar con clinica.' };
    },
  },
  'sodio-corregido': {
    fields: [{ id: 'na', label: 'Na medido', unit: 'mmol/L' }, { id: 'glucose', label: 'Glucosa', unit: 'mg/dL' }],
    calculate: ({ na, glucose }) => {
      if ([na, glucose].some((value) => value === '')) return null;
      const result = Number(na) + 1.6 * ((Number(glucose) - 100) / 100);
      return { value: `${result.toFixed(1)} mmol/L`, interpretation: 'Usar para no infravalorar hipernatremia real en hiperglucemia.' };
    },
  },
  'deficit-agua': {
    fields: [{ id: 'weight', label: 'Peso', unit: 'kg' }, { id: 'na', label: 'Na', unit: 'mmol/L' }, { id: 'factor', label: 'Factor agua corporal', unit: '0.5 mujer/anciano, 0.6 varon' }],
    calculate: ({ weight, na, factor }) => {
      if ([weight, na, factor].some((value) => value === '')) return null;
      const result = Number(factor) * Number(weight) * ((Number(na) / 140) - 1);
      return { value: `${Math.max(0, result).toFixed(1)} L`, interpretation: 'Planificar correccion prudente; no corregir rapido salvo indicacion experta.' };
    },
  },
  parkland: {
    fields: [{ id: 'weight', label: 'Peso', unit: 'kg' }, { id: 'tbsa', label: 'SCQ', unit: '%' }, { id: 'hours', label: 'Horas desde quemadura', unit: 'h' }],
    calculate: ({ weight, tbsa, hours }) => {
      if ([weight, tbsa, hours].some((value) => value === '')) return null;
      const total = 4 * Number(weight) * Number(tbsa);
      const first8 = total / 2;
      const remainingFirst8 = Math.max(0, 8 - Number(hours));
      const rate = remainingFirst8 > 0 ? first8 / remainingFirst8 : total / 16;
      return { value: `${Math.round(total)} mL/24 h`, interpretation: `Orientativo. Ritmo actual aproximado: ${Math.round(rate)} mL/h, ajustar a diuresis y estado clinico.` };
    },
  },
  qsofa: {
    fields: [{ id: 'fr', label: 'FR >=22', unit: '0/1' }, { id: 'pas', label: 'PAS <=100', unit: '0/1' }, { id: 'mental', label: 'Alteracion mental', unit: '0/1' }],
    calculate: ({ fr, pas, mental }) => {
      if ([fr, pas, mental].some((value) => value === '')) return null;
      const result = Number(fr) + Number(pas) + Number(mental);
      return { value: `${result} puntos`, interpretation: result >= 2 ? 'Alto riesgo: buscar sepsis, lactato, disfuncion organica y escalada.' : 'No descarta sepsis; interpretar con clinica y NEWS2/lactato.' };
    },
  },
};

function CalculatorPanel({ item }) {
  const config = calculatorConfigs[item.id];
  const [values, setValues] = useState({});
  const result = useMemo(() => config?.calculate(values), [config, values]);
  if (!config) return null;
  return (
    <section className="decision-result clinical-section calculator-panel">
      <h3>Calculadora</h3>
      {config.summary && <p className="calculator-summary">{config.summary}</p>}
      <div className="calculator-grid">
        {config.fields.map((field) => (
          <label key={field.id}>
            <span>{field.label}</span>
            <input
              inputMode="decimal"
              value={values[field.id] ?? ''}
              onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
              placeholder={field.unit}
            />
            {field.hint && <small>{field.hint}</small>}
          </label>
        ))}
      </div>
      {result && (
        <div className="calculator-result">
          <strong>{result.value}</strong>
          <p>{result.interpretation}</p>
          {config.action && <p>{config.action}</p>}
        </div>
      )}
    </section>
  );
}

function ToolDetail({ item }) {
  return (
    <>
      <ClinicalBlock title="Utilidad" items={[item.description]} />
      <ClinicalBlock title="Datos necesarios" items={item.fields} />
      <ClinicalBlock title="Resultado" items={[item.result]} />
      <ClinicalBlock title="Decision que modifica" items={[item.result]} />
      <CalculatorPanel item={item} />
    </>
  );
}

function ProcedureDetail({ item }) {
  return (
    <>
      <ClinicalBlock title="Indicaciones" items={item.indications} />
      <ClinicalBlock title="Contraindicaciones" items={item.contraindications} />
      <ClinicalBlock title="Preparación / material" items={item.preparation} />
      <ClinicalBlock title="Pasos" items={item.steps} />
      <ClinicalBlock title="Medicación / dosis" items={item.medication} />
      <ClinicalBlock title="Parámetros / objetivos" items={item.parameters} />
      <ClinicalBlock title="Complicaciones" items={item.complications} />
      <ClinicalBlock title="Reevaluación" items={item.reevaluation} />
      <ClinicalBlock title="Fracaso / escalada" items={item.failure} />
    </>
  );
}

function CircuitDetailInline({ item }) {
  return (
    <>
      <ClinicalBlock title="Cuándo activarlo" items={item.activate} />
      <ClinicalBlock title="Criterios" items={item.criteria} />
      <ClinicalBlock title="Pruebas necesarias" items={item.tests} />
      <ClinicalBlock title="Tratamiento inicial" items={item.initialTreatment} />
      <ClinicalBlock title="Datos mínimos a comunicar" items={item.data} />
      <ClinicalBlock title="Comunicación" items={item.communication} />
      <ClinicalBlock title="Destino" items={item.destination} />
    </>
  );
}

export function ProtocolDetail({ item, onBack, onOpen }) {
  if (!item) {
    return (
      <div className="screen detail-screen protocol-detail">
        <DetailHeader title="Protocolo" subtitle="Sin protocolo cargado" onBack={onBack} />
        <EmptyClinicalState text="No hay protocolo cargado." />
      </div>
    );
  }

  return (
    <div className="screen detail-screen protocol-detail">
      <DetailHeader title={item.title} subtitle={item.description} onBack={onBack} />
      <TagRow item={item} />

      {item.type === 'protocol' && (
        <>
          <ClinicalBlock title="Entrada rápida" items={item.clinical.quickEntry} />
          <ClinicalBlock title="Primera decisión" items={item.clinical.firstDecision} />
          <ClinicalBlock title="Sospecha" items={item.clinical.suspicion} />
          <ClinicalBlock title="Datos mínimos" items={item.clinical.minData} />
          <ClinicalBlock title="Gravedad" items={item.clinical.severity} />
          <ClinicalBlock title="Qué solicitar / qué cambia conducta" items={item.clinical.testPlan} />
          <ClinicalBlock title="Pruebas iniciales" items={item.clinical.tests} />
          <ClinicalBlock title="Interpretación" items={item.clinical.interpretation} />
          <ClinicalBlock title="Tratamiento en Urgencias" items={item.clinical.medicationPlan} />
          <ClinicalBlock title="Tratamiento inicial" items={item.clinical.treatment} />
          <ClinicalBlock title="Dosis / fármacos" items={item.clinical.doses} />
          <ClinicalBlock title="Situaciones especiales" items={item.clinical.specialSituations} />
          <LinkedItems title="Herramientas integradas" ids={item.tools} onOpen={onOpen} />
          <LinkedItems title="Procedimientos relacionados" ids={item.procedures} onOpen={onOpen} />
          <LinkedItems title="Circuitos" ids={item.circuits} onOpen={onOpen} />
          <ClinicalBlock title="Reevaluación" items={item.clinical.reevaluation} />
          <DestinationBlock destination={item.clinical.destination} />
        </>
      )}

      {item.type === 'tool' && <ToolDetail item={item} />}
      {item.type === 'procedure' && <ProcedureDetail item={item} />}
      {item.type === 'circuit' && <CircuitDetailInline item={item} />}

      {item.sources?.length > 0 && (
        <section className="decision-result clinical-section">
          <h3>Fuentes</h3>
          <ul className="clinical-bullets">
            {item.sources.map((source) => <li key={source}>{source}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
