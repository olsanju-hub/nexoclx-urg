import { CompactList } from '../components/lists/CompactList.jsx';
import { ListRow } from '../components/lists/ListRow.jsx';

export function More({ sections, onNavigate }) {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Mas</h1>
        <p>Accesos secundarios de la app.</p>
      </div>
      <CompactList label="Mas accesos">
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
