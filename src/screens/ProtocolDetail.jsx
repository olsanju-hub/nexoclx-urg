import { ClinicalActionTool } from '../components/detail/ClinicalActionTool.jsx';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { EmptyClinicalState } from '../components/feedback/EmptyClinicalState.jsx';

export function ProtocolDetail({ protocol, onBack }) {
  if (!protocol) {
    return (
      <div className="screen detail-screen protocol-detail">
        <DetailHeader title="Protocolo" subtitle="Sin protocolo cargado" onBack={onBack} />
        <EmptyClinicalState text="No hay protocolo cargado." />
      </div>
    );
  }

  return (
    <div className="screen detail-screen protocol-detail">
      <DetailHeader title={protocol.title} subtitle={protocol.description} onBack={onBack} />
      {protocol.assessment ? (
        <ClinicalActionTool protocol={protocol} />
      ) : (
        <EmptyClinicalState text="No hay herramienta cargada para este protocolo." />
      )}
    </div>
  );
}
