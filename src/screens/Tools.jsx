import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { decisionProtocols } from '../data/decisionProtocols.js';
import { htaUrgToolGroups } from '../data/htaUrgSupportTools.js';

export function Tools({ onOpen, onOpenProtocol }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Herramientas</h1>
        <p>Timers, registros y calculadoras auxiliares agrupadas por patología.</p>
      </div>
      <div className="tool-group-stack">
        {htaUrgToolGroups.map((group) => (
          <section className="tool-pathology-group" key={group.id} aria-labelledby={`tool-group-${group.id}`}>
            <div className="tool-pathology-heading">
              <h2 id={`tool-group-${group.id}`}>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <CompactList label={`Herramientas de ${group.title}`}>
              {group.tools.map((tool) => (
                <ListRow
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  meta={tool.status}
                  onClick={() => onOpen(tool.id)}
                />
              ))}
            </CompactList>
          </section>
        ))}
        <section className="tool-pathology-group" aria-labelledby="tool-group-decision">
          <div className="tool-pathology-heading">
            <h2 id="tool-group-decision">Decision clinica transversal</h2>
            <p>Herramientas validadas para gravedad, activacion y destino.</p>
          </div>
          <CompactList label="Herramientas transversales">
            {decisionProtocols.map((tool) => (
              <ListRow
                key={tool.id}
                title={tool.title}
                description={tool.description}
                meta={tool.status}
                onClick={() => onOpenProtocol(tool.id)}
              />
            ))}
          </CompactList>
        </section>
      </div>
    </div>
  );
}
