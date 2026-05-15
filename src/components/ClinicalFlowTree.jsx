import React, { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, ChevronRight, ClipboardList, Pill, Stethoscope } from 'lucide-react';

const severityLabels = {
  info: 'Info',
  warning: 'Clave',
  danger: 'Alerta',
  success: 'Seguro',
};

const typeLabels = {
  alert: 'Alerta',
  calculator: 'Calculo',
  decision: 'Decision',
  references: 'Fuentes',
  scale: 'Escala',
  section: 'Seccion',
  step: 'Paso',
  treatment: 'Tratamiento',
};

const DEFAULT_MAX_INITIAL_ITEMS = 4;
const MAX_SECTION_ITEMS = 5;

const compactText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const truncateText = (value = '', maxLength = 118) => {
  const text = compactText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}.` : text;
};

const getPreview = (node) => {
  const source = node.summary ?? node.items?.[0] ?? node.references?.[0] ?? node.action ?? node.medication ?? '';
  const [firstSentence] = source.split('. ');
  return firstSentence ? `${firstSentence.replace(/\.$/, '')}.` : '';
};

const formatPreviewItem = (node, item) => {
  const text = item ?? node.summary ?? node.action ?? node.references?.[0] ?? '';
  if (!text) return null;
  return node.medication || node.type === 'treatment' || node.type === 'decision' || node.type === 'alert'
    ? `${node.title}: ${truncateText(text)}`
    : truncateText(text);
};

const uniquePreviewItems = (items = []) => [...new Set(items.filter(Boolean))];

const collectNodePreviewItems = (node, bucket = [], maxItems = DEFAULT_MAX_INITIAL_ITEMS) => {
  if (node.calculatorId || bucket.length >= maxItems) return bucket;

  if (node.items?.length) {
    node.items.slice(0, maxItems - bucket.length).forEach((item) => {
      const preview = formatPreviewItem(node, item);
      if (preview) bucket.push(preview);
    });
    return bucket;
  }

  const preview = formatPreviewItem(node);
  if (preview) bucket.push(preview);

  if (node.children?.length && bucket.length < maxItems) {
    node.children.forEach((child) => collectNodePreviewItems(child, bucket, maxItems));
  }

  return bucket;
};

const collectTreatmentPreviewItems = (nodes = [], maxItems = DEFAULT_MAX_INITIAL_ITEMS) => {
  const medicationItems = [];
  const otherItems = [];

  const walk = (node) => {
    if (node.calculatorId) return;

    if (node.medication) {
      const preview = formatPreviewItem(node);
      if (preview) medicationItems.push(preview);
      return;
    }

    if (node.summary) {
      const preview = formatPreviewItem(node);
      if (preview) otherItems.push(preview);
    }

    if (!node.children?.length) {
      if (!node.summary) {
        const preview = formatPreviewItem(node);
        if (preview) otherItems.push(preview);
      }
      return;
    }

    node.children.forEach(walk);
  };

  nodes.forEach(walk);
  return uniquePreviewItems([...medicationItems, ...otherItems]).slice(0, maxItems);
};

const getSectionPreviewItems = (section) => {
  const maxItems = Math.min(section.maxInitialItems ?? DEFAULT_MAX_INITIAL_ITEMS, MAX_SECTION_ITEMS);

  if (section.initialItems?.length) {
    return uniquePreviewItems(section.initialItems).slice(0, maxItems);
  }

  if (section.type === 'references') {
    return ['Bibliografía textual cerrada.'];
  }

  if (section.id === 'tratamiento') {
    return collectTreatmentPreviewItems(section.children, maxItems);
  }

  const items = [];
  section.children?.forEach((node) => collectNodePreviewItems(node, items, maxItems));
  return uniquePreviewItems(items).slice(0, maxItems);
};

const collectCalculatorActions = (nodes = [], bucket = new Map()) => {
  nodes.forEach((node) => {
    if (node.calculatorId && !bucket.has(node.calculatorId)) {
      bucket.set(node.calculatorId, node.action ?? `Calcular ${node.title}`);
    }

    if (node.children?.length) {
      collectCalculatorActions(node.children, bucket);
    }
  });

  return [...bucket.entries()].map(([calculatorId, label]) => ({ calculatorId, label }));
};

const TypeIcon = ({ type }) => {
  if (type === 'alert') return <AlertTriangle className="h-3.5 w-3.5" />;
  if (type === 'calculator' || type === 'scale') return <Calculator className="h-3.5 w-3.5" />;
  if (type === 'treatment') return <Pill className="h-3.5 w-3.5" />;
  if (type === 'decision') return <CheckCircle2 className="h-3.5 w-3.5" />;
  return <ClipboardList className="h-3.5 w-3.5" />;
};

const FlowNode = ({ node, depth = 0, onCalculatorOpen }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(node.children?.length);
  const hasBody = Boolean(node.summary || node.items?.length || node.references?.length || node.action || node.calculatorId || node.medication);
  const canToggle = hasChildren || hasBody;
  const visible = open || !canToggle;
  const preview = !visible ? getPreview(node) : '';

  return (
    <article className={`flow-node flow-node-${node.severity ?? 'info'}`} style={{ '--flow-depth': depth }}>
      <button
        type="button"
        className="flow-node-header"
        onClick={() => canToggle && setOpen((current) => !current)}
        aria-expanded={visible}
      >
        <span className="flow-node-icon">
          <TypeIcon type={node.type} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flow-node-heading">
            <span className="flow-node-title">{node.title}</span>
            <span className={`flow-node-tag flow-node-tag-${node.type}`}>{typeLabels[node.type] ?? node.type}</span>
          </span>
          <span className="flow-node-meta">
            {node.severity ? severityLabels[node.severity] : 'Info'}
          </span>
        </span>
        {canToggle ? <ChevronRight className={`flow-node-chevron ${visible ? 'rotate-90' : ''}`} /> : null}
      </button>

      {preview ? <p className="flow-node-preview">{preview}</p> : null}

      {visible ? (
        <div className="flow-node-body">
          {node.summary ? <p className="flow-node-summary">{node.summary}</p> : null}
          {node.items?.length ? (
            <ul className="flow-node-list">
              {node.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {node.medication ? <p className="flow-node-callout">{node.medication}</p> : null}
          {node.calculatorId ? (
            <button type="button" className="flow-node-action flow-node-action-button" onClick={() => onCalculatorOpen?.(node.calculatorId)}>
              {node.action ?? `Calcular ${node.calculatorId}`}
            </button>
          ) : node.action ? (
            <p className="flow-node-action">{node.action}</p>
          ) : null}
          {node.references?.length ? (
            <ul className="flow-node-list flow-node-references">
              {node.references.map((reference) => (
                <li key={reference}>{reference}</li>
              ))}
            </ul>
          ) : null}
          {hasChildren ? (
            <div className="flow-node-children">
              {node.children.map((child) => (
                <FlowNode key={child.id} node={child} depth={depth + 1} onCalculatorOpen={onCalculatorOpen} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

const FlowSection = ({ section, onCalculatorOpen }) => {
  const [open, setOpen] = useState(false);
  const previewItems = getSectionPreviewItems(section);
  const calculatorActions = collectCalculatorActions(section.children);

  return (
    <section id={`flow-section-${section.id}`} className={`flow-section flow-section-${section.id}`}>
      <button type="button" className="flow-section-header" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>
          <span className="flow-section-kicker">{typeLabels[section.type] ?? 'Seccion'}</span>
          <span className="flow-section-title">{section.title}</span>
        </span>
        <span className="flow-section-toggle">
          {open ? 'Ocultar' : 'Ver detalle'}
          <ChevronRight className={`flow-node-chevron ${open ? 'rotate-90' : ''}`} />
        </span>
      </button>
      <div className="flow-section-preview">
        {section.summary ? <p className="flow-section-summary">{section.summary}</p> : null}
        {previewItems.length ? (
          <ul className="flow-section-preview-list">
            {previewItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {calculatorActions.length ? (
          <div className="flow-section-actions">
            {calculatorActions.map((action) => (
              <button
                key={action.calculatorId}
                type="button"
                className="flow-node-action flow-node-action-button"
                onClick={() => onCalculatorOpen?.(action.calculatorId)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {open ? (
        <div className="flow-section-body">
          {section.children?.map((node) => (
            <FlowNode key={node.id} node={node} onCalculatorOpen={onCalculatorOpen} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

const PautaCard = ({ card }) => {
  const detailItems = card.items?.length ? card.items : card.summary ? [card.summary] : [];

  return (
    <article className={`pauta-card pauta-card-${card.severity ?? 'info'}`}>
      <div className="pauta-card-header">
        <span className="flow-node-icon">
          <TypeIcon type={card.type} />
        </span>
        <span className="min-w-0">
          <span className="pauta-card-title">{card.title}</span>
          {card.medication ? <span className="pauta-card-meta">{card.medication}</span> : null}
        </span>
      </div>
      {card.summary ? <p className="pauta-card-summary">{card.summary}</p> : null}
      {detailItems.length ? (
        <dl className="pauta-card-list">
          {detailItems.map((item) => {
            const [label, ...rest] = item.split(': ');
            const value = rest.join(': ');
            return value ? (
              <div key={item} className="pauta-card-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ) : (
              <div key={item} className="pauta-card-row pauta-card-row-full">
                <dd>{item}</dd>
              </div>
            );
          })}
        </dl>
      ) : null}
    </article>
  );
};

const DecisionPanelSection = ({ section, active, onToggle, onCalculatorOpen }) => {
  const points = uniquePreviewItems(section.points).slice(0, MAX_SECTION_ITEMS);

  return (
    <section className={`decision-panel-card ${active ? 'decision-panel-card-active' : ''}`}>
      <button type="button" className="decision-panel-card-button" onClick={onToggle} aria-expanded={active}>
        <span>
          <span className="decision-panel-card-title">{section.title}</span>
          {section.summary ? <span className="decision-panel-card-summary">{section.summary}</span> : null}
        </span>
        <span className="flow-section-toggle">
          {active ? 'Cerrar' : 'Ver detalle'}
          <ChevronRight className={`flow-node-chevron ${active ? 'rotate-90' : ''}`} />
        </span>
      </button>

      <div className="decision-panel-card-preview">
        {points.length ? (
          <ul className="flow-section-preview-list">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
        {section.actions?.length ? (
          <div className="flow-section-actions">
            {section.actions.map((action) => (
              <button
                key={action.calculatorId}
                type="button"
                className="flow-node-action flow-node-action-button"
                onClick={() => onCalculatorOpen?.(action.calculatorId)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {active ? (
        <div className="decision-panel-detail">
          {section.treatmentGroups?.length ? (
            <div className="pauta-group-list">
              {section.treatmentGroups.map((group) => (
                <div key={group.id} className="pauta-group">
                  <h3>{group.title}</h3>
                  <div className="pauta-card-grid">
                    {group.cards.map((card) => (
                      <PautaCard key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {section.detailNodes?.length ? (
            <div className="flow-section-body decision-panel-nodes">
              {section.detailNodes.map((node) => (
                <FlowNode key={node.id} node={node} onCalculatorOpen={onCalculatorOpen} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

const DecisionPanelProtocol = ({ protocol, onCalculatorOpen }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [referencesOpen, setReferencesOpen] = useState(false);
  const referencesSection = protocol.sections.find((section) => section.type === 'references');

  const togglePanel = (panelId) => {
    setReferencesOpen(false);
    setActivePanel((current) => (current === panelId ? null : panelId));
  };

  const toggleReferences = () => {
    setActivePanel(null);
    setReferencesOpen((current) => !current);
  };

  return (
    <div className="clinical-flow-tree decision-panel-tree">
      <header className="flow-hero">
        <div className="flow-hero-icon">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <p className="flow-hero-kicker">Protocolo piloto</p>
          <h2>{protocol.title}</h2>
          <p>{protocol.specialty}</p>
        </div>
      </header>

      <div className="decision-panel-grid">
        {protocol.panelSections.map((section) => (
          <DecisionPanelSection
            key={section.id}
            section={section}
            active={activePanel === section.id}
            onToggle={() => togglePanel(section.id)}
            onCalculatorOpen={onCalculatorOpen}
          />
        ))}
      </div>

      {referencesSection ? (
        <section className="decision-panel-references">
          <button type="button" className="flow-section-header" onClick={toggleReferences} aria-expanded={referencesOpen}>
            <span>
              <span className="flow-section-kicker">Fuentes</span>
              <span className="flow-section-title">{referencesSection.title}</span>
            </span>
            <span className="flow-section-toggle">
              {referencesOpen ? 'Ocultar' : 'Ver detalle'}
              <ChevronRight className={`flow-node-chevron ${referencesOpen ? 'rotate-90' : ''}`} />
            </span>
          </button>
          {referencesOpen ? (
            <div className="flow-section-body">
              {referencesSection.children?.map((node) => (
                <FlowNode key={node.id} node={node} onCalculatorOpen={onCalculatorOpen} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export const ClinicalFlowTree = ({ protocol, onCalculatorOpen }) => {
  if (protocol.layout === 'decision-panel') {
    return <DecisionPanelProtocol protocol={protocol} onCalculatorOpen={onCalculatorOpen} />;
  }

  const mainSections = protocol.sections.filter((section) => section.type !== 'references');

  return (
    <div className="clinical-flow-tree">
      <header className="flow-hero">
        <div className="flow-hero-icon">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <p className="flow-hero-kicker">Protocolos</p>
          <h2>{protocol.title}</h2>
          <p>{protocol.specialty}</p>
        </div>
      </header>
      <nav className="flow-jump-nav" aria-label="Bloques principales del protocolo">
        {mainSections.map((section, index) => (
          <a key={section.id} href={`#flow-section-${section.id}`} className="flow-jump-link">
            <span>{index + 1}</span>
            {section.title}
          </a>
        ))}
      </nav>
      <div className="flow-sections">
        {protocol.sections.map((section) => (
          <FlowSection key={section.id} section={section} onCalculatorOpen={onCalculatorOpen} />
        ))}
      </div>
    </div>
  );
};
