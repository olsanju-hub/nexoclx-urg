import { ClinicalActionTool } from '../components/detail/ClinicalActionTool.jsx';
import { DetailHeader } from '../components/detail/DetailHeader.jsx';

export function ProtocolDetail({ protocol, onBack }) {
  return (
    <div className="screen detail-screen protocol-detail">
      <DetailHeader title={protocol.title} subtitle={protocol.description} onBack={onBack} />
      {protocol.assessment ? (
        <ClinicalActionTool protocol={protocol} />
      ) : (
        <section className="decision-panel">
          <div className="decision-header">
            <div>
              <h2>Herramienta pendiente de estructurar</h2>
              <p>Este tema debe convertirse al modelo de conducta clínica antes de considerarse final.</p>
            </div>
            <span className="status-pill is-alert">Revisar</span>
          </div>
        </section>
      )}
    </div>
  );
}
