import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';

export function More({ sections, onNavigate }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Más</h1>
        <p>Secciones.</p>
      </div>
      <CompactList label="Más accesos">
        {sections.map((section) => (
          <ListRow
            key={section.id}
            title={section.title}
            description={section.description}
            onClick={() => onNavigate(section.id)}
          />
        ))}
      </CompactList>
    </div>
  );
}
