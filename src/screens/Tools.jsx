import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';
import { htaUrgToolGroups } from '../data/htaUrgSupportTools.js';

export function Tools({ onOpen }) {
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
      </div>
    </div>
  );
}
