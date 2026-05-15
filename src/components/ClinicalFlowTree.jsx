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

export const ClinicalFlowTree = ({ protocol, onCalculatorOpen }) => {
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
