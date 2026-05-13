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

const getInitialNodeOpen = (node) =>
  Boolean(node.initiallyOpen && typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);

const getPreview = (node) => {
  const source = node.summary ?? node.items?.[0] ?? node.references?.[0] ?? node.action ?? node.medication ?? '';
  const [firstSentence] = source.split('. ');
  return firstSentence ? `${firstSentence.replace(/\.$/, '')}.` : '';
};

const TypeIcon = ({ type }) => {
  if (type === 'alert') return <AlertTriangle className="h-3.5 w-3.5" />;
  if (type === 'calculator' || type === 'scale') return <Calculator className="h-3.5 w-3.5" />;
  if (type === 'treatment') return <Pill className="h-3.5 w-3.5" />;
  if (type === 'decision') return <CheckCircle2 className="h-3.5 w-3.5" />;
  return <ClipboardList className="h-3.5 w-3.5" />;
};

const FlowNode = ({ node, depth = 0 }) => {
  const [open, setOpen] = useState(() => getInitialNodeOpen(node));
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
          {node.calculatorId || node.action ? (
            <p className="flow-node-action">
              {node.action ?? `Calculadora: ${node.calculatorId}`}
            </p>
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
                <FlowNode key={child.id} node={child} depth={depth + 1} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

const FlowSection = ({ section }) => {
  const [open, setOpen] = useState(section.initiallyOpen !== false);

  return (
    <section id={`flow-section-${section.id}`} className={`flow-section flow-section-${section.id}`}>
      <button type="button" className="flow-section-header" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>
          <span className="flow-section-kicker">{typeLabels[section.type] ?? 'Seccion'}</span>
          <span className="flow-section-title">{section.title}</span>
        </span>
        <ChevronRight className={`flow-node-chevron ${open ? 'rotate-90' : ''}`} />
      </button>
      {open ? (
        <div className="flow-section-body">
          {section.children?.map((node) => (
            <FlowNode key={node.id} node={node} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export const ClinicalFlowTree = ({ protocol }) => {
  const mainSections = protocol.sections.slice(0, 3);

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
          {protocol.summary ? <p className="flow-hero-summary">{protocol.summary}</p> : null}
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
          <FlowSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};
