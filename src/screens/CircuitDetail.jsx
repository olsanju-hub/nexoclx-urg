import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';

export function CircuitDetail({ onBack }) {
  return (
    <div className="screen">
      <DetailHeader title="Dolor torácico" subtitle="Circuito hospitalario" onBack={onBack} />
      <ContentBlock title="Flujo">
        <p>Priorizar estabilidad, ECG, biomarcadores seriados, diagnóstico diferencial urgente y destino asistencial según el protocolo.</p>
      </ContentBlock>
    </div>
  );
}
