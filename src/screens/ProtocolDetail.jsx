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
          </label>
        ))}
      </div>
      {result && (
        <div className="calculator-result">
          <strong>{result.value}</strong>
          <p>{result.interpretation}</p>
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
