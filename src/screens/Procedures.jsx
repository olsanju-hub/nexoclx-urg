import { useState } from 'react';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';

const items = ['ECG inicial revisado.', 'ECG seriado planteado si persisten síntomas.', 'Biomarcadores integrados en vía local.', 'Destino asistencial documentado.'];

export function Procedures() {
  const [selected, setSelected] = useState([]);
  const toggle = (item) => setSelected((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Procedimientos</h1>
        <p>Pasos clave.</p>
      </div>
      <ContentBlock title="Dolor torácico">
        <div className="checklist-grid">
          {items.map((item) => (
            <label className={selected.includes(item) ? 'clinical-check is-checked' : 'clinical-check'} key={item}>
              <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </ContentBlock>
    </div>
  );
}
