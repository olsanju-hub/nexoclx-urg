import { useMemo, useState } from 'react';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';

const checks = [
  'ECG inicial revisado.',
  'ECG seriado indicado si persisten síntomas o cambia la clínica.',
  'Troponina integrada en la vía local validada.',
  'Estabilidad y necesidad de área monitorizada revisadas.',
  'Destino asistencial decidido: observación, ingreso, alta o interconsulta.',
];

export function Tools() {
  const [selected, setSelected] = useState([]);
  const [copied, setCopied] = useState(false);
  const summary = useMemo(() => `Dolor torácico Urg - pruebas y destino\n${selected.map((item) => `- ${item}`).join('\n') || '- Sin elementos marcados.'}`, [selected]);
  const toggle = (item) => {
    setSelected((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
    setCopied(false);
  };
  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Pruebas y destino.</p>
      </div>
      <ContentBlock title="Checklist de pruebas y destino">
        <div className="checklist-grid">
          {checks.map((item) => (
            <label className={selected.includes(item) ? 'clinical-check is-checked' : 'clinical-check'} key={item}>
              <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <div className="decision-result">
          <h3>{selected.length >= 4 ? 'Circuito orientado' : 'Faltan elementos de decisión'}</h3>
          <p>Integra ECG, biomarcadores, estabilidad y diagnóstico diferencial antes de cerrar destino.</p>
          <button className="copy-button" type="button" onClick={copySummary}>{copied ? 'Resumen copiado' : 'Copiar resumen'}</button>
        </div>
      </ContentBlock>
    </div>
  );
}
