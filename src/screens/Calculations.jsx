import { useState } from 'react';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';

export function Calculations() {
  const [mode, setMode] = useState('monitor');
  const result = {
    monitor: 'Prioriza área monitorizada, ECG/troponina seriados e interconsulta o circuito específico según sospecha.',
    observe: 'Mantén observación si la vía seriada o pruebas complementarias aún condicionan destino.',
    discharge: 'Solo plantear alta con bajo riesgo documentado, evaluación completa y seguimiento.',
  }[mode];

  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Selector de destino</h1>
        <p>Elige el escenario.</p>
      </div>
      <ContentBlock title="Dolor torácico">
        <div className="segmented-control" aria-label="Destino">
          <button className={mode === 'monitor' ? 'is-active' : ''} type="button" onClick={() => setMode('monitor')}>Monitorizar</button>
          <button className={mode === 'observe' ? 'is-active' : ''} type="button" onClick={() => setMode('observe')}>Observar</button>
          <button className={mode === 'discharge' ? 'is-active' : ''} type="button" onClick={() => setMode('discharge')}>Alta</button>
        </div>
        <div className="decision-result">
          <h3>{mode === 'monitor' ? 'Prioridad alta' : mode === 'observe' ? 'Decisión diferida' : 'Cierre seguro'}</h3>
          <p>{result}</p>
        </div>
      </ContentBlock>
    </div>
  );
}
