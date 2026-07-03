import { useState } from 'react';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';

const steps = ['Priorizar estabilidad y ubicación monitorizada si procede.', 'Revisar ECG y vía de biomarcadores seriados.', 'Ordenar diagnóstico diferencial urgente.', 'Definir observación, ingreso, alta o interconsulta.'];

export function CircuitDetail({ onBack }) {
  const [selected, setSelected] = useState([]);
  const toggle = (item) => setSelected((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));

  return (
    <div className="screen">
      <DetailHeader title="Dolor torácico" subtitle="Circuito hospitalario" onBack={onBack} />
      <ContentBlock title="Flujo">
        <div className="checklist-grid">
          {steps.map((item) => (
            <label className={selected.includes(item) ? 'clinical-check is-checked' : 'clinical-check'} key={item}>
              <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <div className="decision-result">
          <h3>{selected.length === steps.length ? 'Destino orientado' : 'Completar circuito'}</h3>
          <p>El destino asistencial requiere integrar estabilidad, ECG, biomarcadores y sospecha principal.</p>
        </div>
      </ContentBlock>
    </div>
  );
}
