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

function ToolDetail({ item }) {
  return (
    <>
      <ClinicalBlock title="Utilidad" items={[item.description]} />
      <ClinicalBlock title="Datos necesarios" items={item.fields} />
      <ClinicalBlock title="Resultado" items={[item.result]} />
      <ClinicalBlock title="Decision que modifica" items={[item.result]} />
    </>
  );
}

function ProcedureDetail({ item }) {
  return (
    <>
      <ClinicalBlock title="Indicaciones" items={item.indications} />
      <ClinicalBlock title="Contraindicaciones" items={item.contraindications} />
      <ClinicalBlock title="Pasos" items={item.steps} />
      <ClinicalBlock title="Fracaso / escalada" items={item.failure} />
    </>
  );
}

function CircuitDetailInline({ item }) {
  return (
    <>
      <ClinicalBlock title="Cuándo activarlo" items={item.activate} />
      <ClinicalBlock title="Datos mínimos a comunicar" items={item.data} />
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
          <ClinicalBlock title="Sospecha" items={item.clinical.suspicion} />
          <ClinicalBlock title="Datos mínimos" items={item.clinical.minData} />
          <ClinicalBlock title="Gravedad" items={item.clinical.severity} />
          <ClinicalBlock title="Pruebas iniciales" items={item.clinical.tests} />
          <ClinicalBlock title="Interpretación" items={item.clinical.interpretation} />
          <ClinicalBlock title="Tratamiento inicial" items={item.clinical.treatment} />
          <ClinicalBlock title="Dosis / fármacos" items={item.clinical.doses} />
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
