import { ContentBlock } from '../components/detail/ContentBlock.jsx';

export function Tools() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Apoyo rápido vinculado al protocolo Dolor torácico.</p>
      </div>
      <ContentBlock title="Pruebas urgentes">
        <p>ECG seriado, troponina integrada en vía local validada y revaloración clínica.</p>
      </ContentBlock>
      <ContentBlock title="Destino asistencial">
        <p>Observación, ingreso, alta o interconsulta según estabilidad, ECG, biomarcadores y diagnóstico diferencial.</p>
      </ContentBlock>
    </div>
  );
}
