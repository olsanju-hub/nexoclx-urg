import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';

export function ProtocolDetail({ protocol, onBack }) {
  return (
    <div className="screen detail-screen protocol-detail">
      <DetailHeader title={protocol.title} subtitle={protocol.description} onBack={onBack} />

      <section className="protocol-flow" aria-label="Estructura del protocolo">
        {protocol.sections.map((section) => (
          <article className="protocol-step-card" key={section.step}>
            <span className="protocol-step-index">{section.step}</span>
            <div className="protocol-step-copy">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.items?.length > 0 && (
                <ul className="clinical-bullets">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <ContentBlock title="Herramientas relacionadas">
        <ul className="clinical-bullets">
          {protocol.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </ContentBlock>

      <SourceList sources={protocol.sources} />
    </div>
  );
}
