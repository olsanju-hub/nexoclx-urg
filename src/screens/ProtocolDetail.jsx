import { DetailHeader } from '../components/detail/DetailHeader.jsx';
import { ContentBlock } from '../components/detail/ContentBlock.jsx';
import { SourceList } from '../components/detail/SourceList.jsx';
import { placeholderBlocks, placeholderSources } from '../data/placeholders.js';

export function ProtocolDetail({ protocol, onBack }) {
  return (
    <div className="screen detail-screen">
      <DetailHeader title={protocol.title} subtitle={protocol.description} onBack={onBack} />
      {placeholderBlocks.map((block) => (
        <ContentBlock key={block.title} title={block.title}>
          <p>{block.body}</p>
        </ContentBlock>
      ))}
      <SourceList sources={placeholderSources} />
    </div>
  );
}
