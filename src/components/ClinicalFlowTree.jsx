import React, { useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, ChevronRight, ClipboardList, Pill } from 'lucide-react';
import { ProtocolHeader } from './protocols/ProtocolHeader';
import { ProtocolSection } from './protocols/ProtocolSection';

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

const FieldList = ({ items = [], className = '' }) => {
  const rows = items.filter(Boolean).map((item) => {
    const [label, ...rest] = item.split(': ');
    const value = rest.join(': ');
    return { item, label, value };
  });

  if (!rows.length) return null;

  return (
    <dl className={`clinical-sheet-field-list ${className}`}>
      {rows.map(({ item, label, value }) =>
        value ? (
          <div key={item} className="clinical-sheet-field-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ) : (
          <div key={item} className="clinical-sheet-field-row clinical-sheet-field-row-full">
            <dd>{item}</dd>
          </div>
        ),
      )}
    </dl>
  );
};

const ClinicalSheetNode = ({ node, onCalculatorOpen, onProcedureOpen, onProtocolOpen }) => {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(node.children?.length || node.items?.length > 3 || node.references?.length);
  const visibleItems = node.items?.slice(0, open ? undefined : 3) ?? [];

  if (node.calculatorId) {
    return (
      <button type="button" className="clinical-calc-button" onClick={() => onCalculatorOpen?.(node.calculatorId)}>
        {node.action ?? `Calcular ${node.title}`}
      </button>
    );
  }

  if (node.procedureId) {
    return (
      <button type="button" className="clinical-calc-button" onClick={() => onProcedureOpen?.(node.procedureId)}>
        {node.action ?? `Ver ${node.title}`}
      </button>
    );
  }

  if (node.protocolId) {
    return (
      <button type="button" className="clinical-calc-button" onClick={() => onProtocolOpen?.(node.protocolId)}>
        {node.action ?? `Ver ${node.title}`}
      </button>
    );
  }

  return (
    <div className={`clinical-sheet-node clinical-sheet-node-${node.severity ?? 'info'}`}>
      <div className="clinical-sheet-node-header">
        <h4>{node.title}</h4>
        {hasDetails ? (
          <button type="button" className="clinical-sheet-more" onClick={() => setOpen((current) => !current)}>
            {open ? 'Ver menos' : 'Ver más'}
          </button>
        ) : null}
      </div>

      {node.summary ? <p className="clinical-sheet-muted">{node.summary}</p> : null}

      {visibleItems.length ? (
        <ul className="clinical-sheet-list clinical-sheet-list-compact">
          {visibleItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {node.action && !node.calculatorId ? <p className="clinical-sheet-muted">{node.action}</p> : null}

      {open && node.references?.length ? (
        <ul className="clinical-sheet-list clinical-sheet-references-list">
          {node.references.map((reference) => (
            <li key={reference}>{reference}</li>
          ))}
        </ul>
      ) : null}

      {open && node.children?.length ? (
        <div className="clinical-sheet-detail-stack">
          {node.children.map((child) => (
            <ClinicalSheetNode key={child.id} node={child} onCalculatorOpen={onCalculatorOpen} onProcedureOpen={onProcedureOpen} onProtocolOpen={onProtocolOpen} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const PautaBlock = ({ card, onCalculatorOpen }) => {
  const detailItems = card.items?.length ? card.items : card.summary ? [card.summary] : [];
  const calculatorId = card.calculatorId ?? card.calculatorAction?.calculatorId ?? card.dosingCalculator?.calculatorId;
  const title = card.sourceUrl ? (
    <a href={card.sourceUrl} className="clinical-sheet-link">
      {card.title}
    </a>
  ) : (
    card.title
  );

  return (
    <article className={`clinical-pauta clinical-pauta-${card.severity ?? 'info'}`}>
      <h4>{title}</h4>
      {card.medication ? <p className="clinical-sheet-kicker">{card.medication}</p> : null}
      {card.summary ? <p className="clinical-sheet-muted">{card.summary}</p> : null}
      <FieldList items={detailItems} />
      {calculatorId ? (
        <div className="clinical-sheet-actions">
          <button type="button" className="clinical-calc-button" onClick={() => onCalculatorOpen?.(calculatorId)}>
            Calcular dosis
          </button>
        </div>
      ) : null}
    </article>
  );
};

const PANEL_SECTION_MAP = [
  { sourceId: 'que-es', id: 'sospecha', title: 'Sospecha' },
  { sourceId: 'que-pido', id: 'pruebas', title: 'Valoración' },
  { sourceId: 'que-espero', id: 'decision', title: 'Decisión' },
  { sourceId: 'tratamiento', id: 'tratamiento', title: 'Tratamiento' },
  { sourceId: 'seguimiento', id: 'destino', title: 'Destino' },
];

const collectPautaCards = (nodes = [], bucket = []) => {
  nodes.forEach((node) => {
    if (node.calculatorId || node.procedureId || node.type === 'calculator' || node.type === 'scale' || node.type === 'procedure' || node.type === 'references') {
      return;
    }

    const hasClinicalBody = node.summary || node.items?.length || node.medication;
    if (hasClinicalBody) {
      bucket.push(node);
    }

    if (node.children?.length) {
      collectPautaCards(node.children, bucket);
    }
  });

  return bucket;
};

const buildGenericTreatmentGroups = (section) => {
  const groups = section.children
    ?.map((node) => ({
      id: node.id,
      title: node.title,
      cards: collectPautaCards(node.children?.length ? node.children : [node]).slice(0, 12),
    }))
    .filter((group) => group.cards.length);

  return groups?.length ? groups : [];
};

const buildDecisionPanelSections = (protocol) => {
  if (protocol.panelSections?.length) return protocol.panelSections;

  return PANEL_SECTION_MAP.map(({ sourceId, id, title }) => {
    const source = protocol.sections.find((section) => section.id === sourceId);
    if (!source) {
      return {
        id,
        title,
        summary: 'Información no disponible en este protocolo.',
        points: [],
        detailNodes: [],
      };
    }

    const treatmentGroups = sourceId === 'tratamiento' ? buildGenericTreatmentGroups(source) : [];

    return {
      id,
      title,
      summary: source.summary,
      points: getSectionPreviewItems(source),
      actions: sourceId === 'decision' ? collectCalculatorActions(source.children) : [],
      treatmentGroups,
      detailNodes: treatmentGroups.length ? [] : source.children,
    };
  });
};

const DecisionPanelSection = ({ section, onCalculatorOpen, onProcedureOpen, onProtocolOpen }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const points = uniquePreviewItems(section.points).slice(0, MAX_SECTION_ITEMS);
  const hasDetails = Boolean(section.detailNodes?.length);

  return (
    <ProtocolSection aria-labelledby={`clinical-sheet-${section.id}`}>
      <div className="clinical-sheet-section-head">
        <h3 id={`clinical-sheet-${section.id}`}>{section.title}</h3>
        {section.summary ? <p>{section.summary}</p> : null}
      </div>

      {points.length ? (
        <ul className="clinical-sheet-list">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}

      {section.actions?.length ? (
        <div className="clinical-sheet-actions">
          {section.actions.map((action) => (
            <button
              key={action.calculatorId ?? action.procedureId ?? action.protocolId}
              type="button"
              className="clinical-calc-button"
              onClick={() =>
                action.protocolId
                  ? onProtocolOpen?.(action.protocolId)
                  : action.procedureId
                    ? onProcedureOpen?.(action.procedureId)
                    : onCalculatorOpen?.(action.calculatorId)
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}

      {section.treatmentGroups?.length ? (
        <div className="clinical-treatment-list">
          {section.treatmentGroups.map((group) => (
            <div key={group.id} className="clinical-treatment-group">
              <h3>{group.title}</h3>
              <div className="clinical-pauta-list">
                {group.cards.map((card) => (
                  <PautaBlock key={card.id} card={card} onCalculatorOpen={onCalculatorOpen} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasDetails ? (
        <div className="clinical-sheet-details">
          <button type="button" className="clinical-sheet-more" onClick={() => setDetailsOpen((current) => !current)}>
            {detailsOpen ? 'Ocultar detalle' : 'Ver más'}
          </button>
          {detailsOpen ? (
            <div className="clinical-sheet-detail-stack">
              {section.detailNodes.map((node) => (
                <ClinicalSheetNode key={node.id} node={node} onCalculatorOpen={onCalculatorOpen} onProcedureOpen={onProcedureOpen} onProtocolOpen={onProtocolOpen} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </ProtocolSection>
  );
};

const collectRelatedActions = (protocol, panelSections) => {
  const actions = new Map();

  const addAction = (action) => {
    const key = action.calculatorId ?? action.procedureId ?? action.protocolId;
    if (!key || actions.has(key)) return;
    actions.set(key, action);
  };

  panelSections.forEach((section) => {
    section.actions?.forEach(addAction);
    collectCalculatorActions(section.detailNodes).forEach(addAction);
    section.treatmentGroups?.forEach((group) => {
      group.cards.forEach((card) => {
        const calculatorId = card.calculatorId ?? card.calculatorAction?.calculatorId ?? card.dosingCalculator?.calculatorId;
        if (calculatorId) addAction({ calculatorId, label: `Calcular dosis: ${card.title}` });
      });
    });
  });

  protocol.sections?.forEach((section) => {
    collectCalculatorActions(section.children).forEach(addAction);
  });

  return [...actions.values()];
};

const RelatedTools = ({ actions, onCalculatorOpen, onProcedureOpen, onProtocolOpen }) => {
  if (!actions.length) return null;

  return (
    <details className="clinical-sheet-tools">
      <summary>
        <span>
          <strong>Herramientas relacionadas</strong>
          <small>Calculadoras y escalas conectadas a este protocolo.</small>
        </span>
        <span>{actions.length}</span>
      </summary>
      <div className="clinical-sheet-tool-list">
        {actions.map((action) => {
          const key = action.calculatorId ?? action.procedureId ?? action.protocolId;
          return (
            <button
              key={key}
              type="button"
              className="clinical-calc-button"
              onClick={() =>
                action.protocolId
                  ? onProtocolOpen?.(action.protocolId)
                  : action.procedureId
                    ? onProcedureOpen?.(action.procedureId)
                    : onCalculatorOpen?.(action.calculatorId)
              }
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </details>
  );
};

const DecisionPanelProtocol = ({ protocol, onCalculatorOpen, onProcedureOpen, onProtocolOpen, onBack, backLabel = 'Protocolos', kindLabel = 'Protocolo' }) => {
  const [referencesOpen, setReferencesOpen] = useState(false);
  const panelSections = buildDecisionPanelSections(protocol);
  const referencesSection =
    protocol.sections?.find((section) => section.type === 'references') ??
    (protocol.references?.length
      ? {
          children: [
            {
              id: 'references',
              title: 'Fuentes',
              type: 'references',
              references: protocol.references,
            },
          ],
        }
      : null);
  const toggleReferences = () => {
    setReferencesOpen((current) => !current);
  };

  return (
    <div className="clinical-flow-tree decision-panel-tree clinical-sheet">
      <ProtocolHeader protocol={protocol} onBack={onBack} backLabel={backLabel} kindLabel={kindLabel} />

      <nav className="clinical-sheet-tabs" aria-label="Secciones del protocolo">
        {panelSections.map((section) => (
          <a
            key={section.id}
            href={`#clinical-sheet-${section.id}`}
            className="clinical-sheet-tab"
          >
            {section.title}
          </a>
        ))}
      </nav>

      {protocol.prompt ? (
        <section className="clinical-sheet-prompt clinical-sheet-prompt-after-tabs">
          <h3>{protocol.prompt.title}</h3>
          {protocol.prompt.summary ? <p>{protocol.prompt.summary}</p> : null}
        </section>
      ) : null}

      <div className="clinical-sheet-section-stack">
        {panelSections.map((section) => (
          <DecisionPanelSection
            key={section.id}
            section={section}
            onCalculatorOpen={onCalculatorOpen}
            onProcedureOpen={onProcedureOpen}
            onProtocolOpen={onProtocolOpen}
          />
        ))}
      </div>

      <RelatedTools
        actions={collectRelatedActions(protocol, panelSections)}
        onCalculatorOpen={onCalculatorOpen}
        onProcedureOpen={onProcedureOpen}
        onProtocolOpen={onProtocolOpen}
      />

      {protocol.supportSections?.length ? (
        <section className="clinical-sheet-support" aria-label="Apoyo clínico">
          {protocol.supportSections.map((node) => (
            <details key={node.id} className="clinical-sheet-support-item">
              <summary>
                <span>
                  <strong>{node.title}</strong>
                  {node.summary ? <small>{node.summary}</small> : null}
                </span>
                <span>Ver</span>
              </summary>
              <div className="clinical-sheet-support-body">
                {node.items?.length ? (
                  <ul className="clinical-sheet-list clinical-sheet-list-compact">
                    {node.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <ClinicalSheetNode node={node} onCalculatorOpen={onCalculatorOpen} onProcedureOpen={onProcedureOpen} onProtocolOpen={onProtocolOpen} />
                )}
              </div>
            </details>
          ))}
        </section>
      ) : null}

      {referencesSection ? (
        <section className="clinical-sheet-references">
          <button type="button" className="clinical-sheet-reference-button" onClick={toggleReferences} aria-expanded={referencesOpen}>
            <span>Bibliografía textual</span>
            <span>{referencesOpen ? 'Ocultar' : 'Ver fuentes'}</span>
          </button>
          {referencesOpen ? (
            <div className="clinical-sheet-reference-body">
              {referencesSection.children?.map((node) => (
                <ClinicalSheetNode key={node.id} node={node} onCalculatorOpen={onCalculatorOpen} onProcedureOpen={onProcedureOpen} onProtocolOpen={onProtocolOpen} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export const ClinicalFlowTree = ({ protocol, onCalculatorOpen, onProcedureOpen, onProtocolOpen, onBack, backLabel, kindLabel }) => {
  return (
    <DecisionPanelProtocol
      protocol={protocol}
      onCalculatorOpen={onCalculatorOpen}
      onProcedureOpen={onProcedureOpen}
      onProtocolOpen={onProtocolOpen}
      onBack={onBack}
      backLabel={backLabel}
      kindLabel={kindLabel}
    />
  );
};
