import React, { startTransition, useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  HeartPulse,
  Info,
  LayoutDashboard,
  Pill,
  ShieldAlert,
} from 'lucide-react';
import { buildReferenceHref } from './data/bibliography';
import {
  calculateCha2ds2Vasc,
  calculateCockcroftGault,
  calculateHasBled,
  getCalculator,
  implementedCalculators,
} from './data/calculators';
import { getMedication, medicationGroups } from './data/medications';
import { getMotivoModule, motivoConsultaModules } from './data/modules';
import { getProtocol } from './data/protocols';

const brandMark = `${import.meta.env.BASE_URL}branding/app-icon-512.png`;

const shellCardClass = 'shell-card';
const panelClass = 'floating-panel';
const mutedPanelClass = 'tonal-panel';
const subtleButtonClass = 'soft-button';
const primaryButtonClass = 'accent-button';
const ghostButtonClass = 'ghost-button';
const inputClass = 'app-input';
const listRowClass = 'list-row group';

const primaryNavItems = [
  { key: 'home', label: 'Inicio', icon: LayoutDashboard },
  { key: 'protocols', label: 'Protocolos', icon: ClipboardList },
  { key: 'calculations', label: 'Cálculos', icon: Calculator },
  { key: 'medications', label: 'Fármacos', icon: Pill },
];

const initialCalculatorInputs = {
  'cha2ds2-vasc': {
    age: '',
    sex: 'male',
    heartFailure: false,
    hypertension: false,
    diabetes: false,
    strokeOrEmbolism: false,
    vascularDisease: false,
  },
  'has-bled': {
    age: '',
    systolicBloodPressure: '',
    renalDysfunction: false,
    hepaticDysfunction: false,
    strokeHistory: false,
    bleedingHistory: false,
    labileInr: false,
    drugsPredisposingBleeding: false,
    alcohol: false,
  },
  'cockcroft-gault': {
    age: '',
    sex: 'male',
    weightKg: '',
    serumCreatinineMgDl: '',
  },
};

const initialFaFlowState = {
  step: 1,
  stability: null,
  duration: null,
  structuralHeartDisease: null,
};

const initialHtaFlowState = {
  step: 1,
  pas: '',
  pad: '',
  hasTargetOrganDamage: null,
};

const compactSentence = (value) => value.split('. ')[0]?.trim() ?? value;

const getCalculatorResult = (calculatorId, values) => {
  if (calculatorId === 'cha2ds2-vasc') {
    return calculateCha2ds2Vasc(values);
  }

  if (calculatorId === 'has-bled') {
    return calculateHasBled(values);
  }

  if (calculatorId === 'cockcroft-gault') {
    return calculateCockcroftGault(values);
  }

  return null;
};

const openPdf = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

const updateNestedState = (setState, key, field, value) => {
  setState((current) => ({
    ...current,
    [key]: {
      ...current[key],
      [field]: value,
    },
  }));
};

const getPrimarySection = (view) => {
  if (view === 'protocol' || view === 'protocols') {
    return 'protocols';
  }

  if (view === 'calculator' || view === 'calculations') {
    return 'calculations';
  }

  if (view === 'medication' || view === 'medications') {
    return 'medications';
  }

  return 'home';
};

const getPageLabel = (route) => {
  if (route.view === 'protocol') {
    return getProtocol(route.protocolId ?? 'fibrilacion-auricular').title;
  }

  if (route.view === 'calculator') {
    return getCalculator(route.calculatorId).title;
  }

  if (route.view === 'medication') {
    return getMedication(route.medicationId).name;
  }

  if (route.view === 'protocols') {
    return 'Protocolos';
  }

  if (route.view === 'calculations') {
    return 'Cálculos';
  }

  if (route.view === 'medications') {
    return 'Medicamentos';
  }

  return 'Inicio clínico';
};

const BrandLockup = ({ label }) => (
  <div className="flex min-w-0 items-center gap-3">
    <img src={brandMark} alt="NexoClx" className="h-11 w-11 rounded-[1.15rem] object-cover shadow-[0_18px_38px_-24px_rgba(78,58,20,0.34)]" />
    <div className="min-w-0">
      <div className="font-semibold tracking-[-0.04em] text-[var(--text)]">
        <span>Nexo</span>
        <span className="text-[var(--accent-500)]">Clx</span>
      </div>
      {label ? <p className="truncate pt-0.5 text-xs font-medium text-[var(--text-muted)]">{label}</p> : null}
    </div>
  </div>
);

const SectionTitle = ({ eyebrow, title, note, action = null }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div className="min-w-0">
      {eyebrow ? <p className="eyebrow eyebrow-muted">{eyebrow}</p> : null}
      <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--text)]">{title}</h2>
      {note ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">{note}</p> : null}
    </div>
    {action}
  </div>
);

const StatusBadge = ({ children, tone = 'neutral' }) => {
  const toneClass =
    tone === 'active'
      ? 'status-badge status-badge-active'
      : tone === 'pending'
        ? 'status-badge status-badge-pending'
        : tone === 'critical'
          ? 'status-badge status-badge-critical'
          : 'status-badge';

  return <span className={toneClass}>{children}</span>;
};

const PageHero = ({ eyebrow, title, note, aside = null, children = null }) => (
  <section className={`${shellCardClass} p-5 sm:p-6`}>
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 text-[1.95rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:text-[2.3rem]">
          {title}
        </h1>
        {note ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-soft)]">{note}</p> : null}
      </div>
      {aside}
    </div>
    {children ? <div className="mt-5">{children}</div> : null}
  </section>
);

const AppHeader = ({ isScrolled, pageLabel, activeKey, onHome, onSelect }) => (
  <header className={`fixed inset-x-0 top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(248,243,236,0.88)] backdrop-blur-xl ${isScrolled ? 'shadow-[0_22px_44px_-36px_rgba(64,49,22,0.28)]' : ''}`}>
    <div className="mx-auto flex h-[4.6rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
      <button type="button" onClick={onHome} className="min-w-0 text-left">
        <BrandLockup label={pageLabel} />
      </button>

      <nav className="ml-auto hidden items-center gap-1 rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.68)] p-1 shadow-[0_18px_36px_-28px_rgba(64,49,22,0.18)] lg:flex">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  </header>
);

const PrimaryNavigation = ({ activeKey, onSelect }) => (
  <nav className="mobile-nav lg:hidden">
    <div className="grid grid-cols-4 gap-1">
      {primaryNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeKey === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={`mobile-nav-pill ${isActive ? 'mobile-nav-pill-active' : ''}`}
          >
            <span className={`mobile-nav-icon ${isActive ? 'mobile-nav-icon-active' : ''}`}>
              <Icon className="h-[1.125rem] w-[1.125rem]" />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

const BackBar = ({ label = 'Volver', onClick, action = null }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <button type="button" onClick={onClick} className={ghostButtonClass}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
    {action}
  </div>
);

const DetailPanel = ({ title, note, action = null, children, eyebrow = null }) => (
  <section className={`${panelClass} p-4 sm:p-5`}>
    <SectionTitle eyebrow={eyebrow} title={title} note={note} action={action} />
    {children}
  </section>
);

const ListActionRow = ({ title, meta, onClick, badge = null }) => (
  <button type="button" onClick={onClick} className={listRowClass}>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold text-[var(--text)]">{title}</p>
        {badge}
      </div>
      {meta ? <p className="mt-1 text-xs text-[var(--text-muted)]">{meta}</p> : null}
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
  </button>
);

const HomeMetric = ({ label, value }) => (
  <div className={`${mutedPanelClass} px-3.5 py-3`}>
    <p className="eyebrow eyebrow-muted">{label}</p>
    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--text)]">{value}</p>
  </div>
);

const QuickAccessCard = ({ icon: Icon, title, meta, onClick, tone = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex items-start gap-3 rounded-[1.45rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 ${
      tone === 'accent'
        ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.86)] shadow-[0_22px_44px_-34px_rgba(171,126,48,0.28)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] shadow-[0_18px_38px_-30px_rgba(64,49,22,0.16)] hover:border-[rgba(191,146,69,0.24)]'
    }`}
  >
    <span
      className={`icon-well ${tone === 'accent' ? 'bg-[rgba(191,146,69,0.16)] text-[var(--accent-500)]' : ''}`}
    >
      <Icon className="h-[1.125rem] w-[1.125rem]" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--text-soft)]">{meta}</p>
    </div>
    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
  </button>
);

const ProtocolSectionButton = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className={`section-chip ${active ? 'section-chip-active' : ''}`}>
    {label}
  </button>
);

const MedicationQuickRow = ({ medication, onOpen }) => (
  <button type="button" onClick={onOpen} className={listRowClass}>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-[var(--text)]">{medication.name}</p>
        <span className="rounded-full bg-[rgba(191,146,69,0.12)] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-500)]">
          {medication.family}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{compactSentence(medication.indication)}</p>
      <p className="mt-1 text-xs text-[var(--text-soft)]">{compactSentence(medication.dose)}</p>
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
  </button>
);

const BibliographyBlock = ({ entries }) => (
  <section className={`${panelClass} p-4 sm:p-5`}>
    <SectionTitle
      eyebrow="Referencia"
      title="Bibliografía"
      note="Enlaces directos a las páginas verificadas del contenido visible."
    />
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className={`${mutedPanelClass} p-4`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{entry.shortReference}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Libro: p. {entry.verifiedPages.join(', ')}
                {entry.pdfPages.length > 0 ? ` · PDF: p. ${entry.pdfPages.join(', ')}` : ''}
              </p>
              {entry.note ? <p className="mt-2 text-sm text-[var(--text-soft)]">{entry.note}</p> : null}
            </div>
            {entry.href ? (
              <a href={entry.href} target="_blank" rel="noreferrer" className={subtleButtonClass}>
                Abrir
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SourceList = ({ sources }) => (
  <div className="space-y-2">
    {sources.map((source) => {
      if (source.type === 'cima') {
        return (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="list-row"
          >
            <span className="text-sm text-[var(--text-soft)]">{source.label}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          </a>
        );
      }

      return (
        <div key={source.label} className={`${mutedPanelClass} p-4`}>
          <p className="text-sm font-medium text-[var(--text)]">{source.label}</p>
          {source.bibliography?.note ? (
            <p className="mt-1 text-xs text-[var(--text-muted)]">{source.bibliography.note}</p>
          ) : null}
          {source.bibliography?.href ? (
            <a
              href={source.bibliography.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-500)]"
            >
              Abrir referencia
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      );
    })}
  </div>
);

const BooleanField = ({ checked, label, onChange }) => (
  <label
    className={`flex items-center gap-3 rounded-[1rem] border px-3.5 py-3 text-sm transition-colors ${
      checked
        ? 'border-[rgba(191,146,69,0.3)] bg-[rgba(247,241,226,0.82)] text-[var(--text)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] text-[var(--text-soft)]'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-[color:var(--line-strong)]"
      style={{ accentColor: 'var(--accent-500)' }}
    />
    <span>{label}</span>
  </label>
);

const NumberField = ({ value, label, placeholder, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-[var(--text-soft)]">
    <span>{label}</span>
    <input
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  </label>
);

const SelectField = ({ value, label, options, onChange }) => (
  <label className="flex flex-col gap-1.5 text-sm text-[var(--text-soft)]">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const CalculatorResult = ({ result }) =>
  result ? (
    <div className="rounded-[1.15rem] border border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.9)] px-4 py-3">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
        {result.value} <span className="text-sm font-medium text-[var(--text-muted)]">{result.unit}</span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-soft)]">{result.interpretation}</p>
      {result.caution ? <p className="mt-2 text-xs text-[var(--text-muted)]">{result.caution}</p> : null}
    </div>
  ) : (
    <div className="rounded-[1.15rem] border border-[color:var(--line)] bg-[rgba(245,240,232,0.88)] px-4 py-3 text-sm text-[var(--text-muted)]">
      Completa los campos para obtener el resultado.
    </div>
  );

const CalculatorPanel = ({ calculatorId, values, onChange, onOpenDetail, compact = false }) => {
  const calculator = getCalculator(calculatorId);
  const wrapperClass = compact ? `${mutedPanelClass} p-4` : `${panelClass} p-5`;
  const result = getCalculatorResult(calculatorId, values);

  return (
    <section className={wrapperClass}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-[-0.02em] text-[var(--text)]">{calculator.title}</h3>
          <p className="mt-1 text-sm text-[var(--text-soft)]">{calculator.summary}</p>
        </div>
        {onOpenDetail ? (
          <button type="button" onClick={onOpenDetail} className={subtleButtonClass}>
            Abrir
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {calculatorId === 'cha2ds2-vasc' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField value={values.age} label="Edad" placeholder="Ej. 78" onChange={(value) => onChange('age', value)} />
            <SelectField
              value={values.sex}
              label="Sexo"
              options={[
                { value: 'male', label: 'Hombre' },
                { value: 'female', label: 'Mujer' },
              ]}
              onChange={(value) => onChange('sex', value)}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField
              checked={values.heartFailure}
              label="Insuficiencia cardíaca / disfunción VI"
              onChange={(value) => onChange('heartFailure', value)}
            />
            <BooleanField
              checked={values.hypertension}
              label="Hipertensión arterial"
              onChange={(value) => onChange('hypertension', value)}
            />
            <BooleanField checked={values.diabetes} label="Diabetes mellitus" onChange={(value) => onChange('diabetes', value)} />
            <BooleanField
              checked={values.strokeOrEmbolism}
              label="Ictus / tromboembolia previa"
              onChange={(value) => onChange('strokeOrEmbolism', value)}
            />
            <BooleanField
              checked={values.vascularDisease}
              label="Enfermedad vascular"
              onChange={(value) => onChange('vascularDisease', value)}
            />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'has-bled' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField value={values.age} label="Edad" placeholder="Ej. 78" onChange={(value) => onChange('age', value)} />
            <NumberField
              value={values.systolicBloodPressure}
              label="PAS máxima habitual"
              placeholder="Ej. 165"
              onChange={(value) => onChange('systolicBloodPressure', value)}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.renalDysfunction} label="Función renal alterada" onChange={(value) => onChange('renalDysfunction', value)} />
            <BooleanField checked={values.hepaticDysfunction} label="Función hepática alterada" onChange={(value) => onChange('hepaticDysfunction', value)} />
            <BooleanField checked={values.strokeHistory} label="Ictus previo" onChange={(value) => onChange('strokeHistory', value)} />
            <BooleanField checked={values.bleedingHistory} label="Sangrado / predisposición" onChange={(value) => onChange('bleedingHistory', value)} />
            <BooleanField checked={values.labileInr} label="INR lábil" onChange={(value) => onChange('labileInr', value)} />
            <BooleanField
              checked={values.drugsPredisposingBleeding}
              label="Fármacos que aumentan sangrado"
              onChange={(value) => onChange('drugsPredisposingBleeding', value)}
            />
            <BooleanField checked={values.alcohol} label="Alcohol relevante" onChange={(value) => onChange('alcohol', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'cockcroft-gault' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField value={values.age} label="Edad" placeholder="Ej. 78" onChange={(value) => onChange('age', value)} />
            <SelectField
              value={values.sex}
              label="Sexo"
              options={[
                { value: 'male', label: 'Hombre' },
                { value: 'female', label: 'Mujer' },
              ]}
              onChange={(value) => onChange('sex', value)}
            />
            <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 72" onChange={(value) => onChange('weightKg', value)} />
            <NumberField
              value={values.serumCreatinineMgDl}
              label="Creatinina sérica (mg/dL)"
              placeholder="Ej. 1.3"
              onChange={(value) => onChange('serumCreatinineMgDl', value)}
            />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}
    </section>
  );
};

const FlowStepChip = ({ index, label, active }) => (
  <div className={`step-chip ${active ? 'step-chip-active' : ''}`}>
    {index}. {label}
  </div>
);

const FlowChoiceCard = ({ icon: Icon, title, note, onClick, tone = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex w-full items-center gap-4 rounded-[1.55rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 sm:px-5 sm:py-5 ${
      tone === 'critical'
        ? 'border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.88)] hover:bg-[rgba(249,236,232,0.95)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] hover:border-[rgba(191,146,69,0.24)]'
    }`}
  >
    <span
      className={`icon-well ${
        tone === 'critical'
          ? 'bg-[rgba(164,76,63,0.12)] text-[var(--danger-500)]'
          : 'bg-[rgba(191,146,69,0.14)] text-[var(--accent-500)]'
      }`}
    >
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className={`text-sm font-semibold ${tone === 'critical' ? 'text-[var(--danger-700)]' : 'text-[var(--text)]'}`}>
        {title}
      </p>
      <p className={`mt-1 text-xs leading-relaxed ${tone === 'critical' ? 'text-[var(--danger-600)]' : 'text-[var(--text-soft)]'}`}>
        {note}
      </p>
    </div>
    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
  </button>
);

const FlowSelectButton = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className={`choice-button ${active ? 'choice-button-active' : ''}`}>
    {label}
  </button>
);

const FlowActionCard = ({ title, body, tone = 'neutral', children = null }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-[rgba(164,76,63,0.22)] bg-[rgba(164,76,63,0.92)] text-white shadow-[0_28px_58px_-38px_rgba(139,57,44,0.42)]'
      : tone === 'warning'
        ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.94)] text-[var(--text)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.9)] text-[var(--text)]';

  const bodyClass =
    tone === 'critical'
      ? 'text-[rgba(255,248,245,0.9)]'
      : tone === 'warning'
        ? 'text-[var(--text-soft)]'
        : 'text-[var(--text-soft)]';

  return (
    <section className={`rounded-[1.7rem] border px-5 py-5 shadow-[0_24px_50px_-42px_rgba(64,49,22,0.2)] ${toneClass}`}>
      <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{body}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
};

const FlowHeader = ({ eyebrow, title, note, step, totalSteps, steps, onBack, onOpenSource }) => (
  <section className={`${shellCardClass} p-5 sm:p-6`}>
    <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={onBack} className={ghostButtonClass}>
        <ArrowLeft className="h-4 w-4" />
        Cancelar
      </button>
      {onOpenSource ? (
        <button type="button" onClick={onOpenSource} className={subtleButtonClass}>
          <BookOpen className="h-4 w-4" />
          Fuente
        </button>
      ) : null}
    </div>

    <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:text-[2.15rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-soft)]">{note}</p>
      </div>
      <div className={`${mutedPanelClass} min-w-[210px] px-4 py-4 xl:max-w-[240px]`}>
        <p className="eyebrow eyebrow-muted">Paso {step} de {totalSteps}</p>
        <div className="mt-3 h-2 rounded-full bg-[rgba(111,104,93,0.08)]">
          <div className="progress-fill h-full rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {steps.map((item, index) => (
        <FlowStepChip key={item} index={index + 1} label={item} active={step === index + 1} />
      ))}
    </div>
  </section>
);

const HomeView = ({
  onProtocolsOpen,
  onModuleOpen,
  onCalculationsOpen,
  onCalculatorOpen,
  onMedicationsOpen,
  onMedicationOpen,
}) => {
  const activeModules = motivoConsultaModules.filter((module) => module.implemented);
  const featuredCalculators = implementedCalculators.slice(0, 3);
  const featuredMedications = ['apixaban', 'labetalol', 'amiodarona'];

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <section className={`${shellCardClass} p-5 sm:p-6`}>
          <p className="eyebrow">Biblioteca clínica rápida</p>
          <div className="mt-4 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <img
                src={brandMark}
                alt="NexoClx"
                className="mt-0.5 h-12 w-12 rounded-[1.2rem] object-cover shadow-[0_20px_44px_-28px_rgba(78,58,20,0.34)]"
              />
              <div className="min-w-0">
                <div className="font-semibold tracking-[-0.05em] text-[var(--text)] sm:text-lg">
                  <span>Nexo</span>
                  <span className="text-[var(--accent-500)]">Clx</span>
                </div>
                <h1 className="mt-3 max-w-3xl text-[2rem] font-semibold tracking-[-0.06em] text-[var(--text)] sm:text-[2.45rem]">
                  Protocolos, cálculos y fármacos listos para consulta clínica real.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
                  Interfaz ligera, acceso directo y contexto suficiente para decidir sin convertir la home en una
                  pantalla decorativa.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HomeMetric label="Protocolos activos" value={`${activeModules.length}`} />
              <HomeMetric label="Cálculos disponibles" value={`${implementedCalculators.length}`} />
              <HomeMetric
                label="Fichas conectadas"
                value={`${medicationGroups.reduce((count, group) => count + group.items.length, 0)}`}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onProtocolsOpen} className={primaryButtonClass}>
                <ClipboardList className="h-4 w-4" />
                Abrir protocolos
              </button>
              <button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>
                <Calculator className="h-4 w-4" />
                Cálculos rápidos
              </button>
              <button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>
                <Pill className="h-4 w-4" />
                Medicamentos
              </button>
            </div>
          </div>
        </section>

        <section className={`${panelClass} p-5 sm:p-6`}>
          <SectionTitle
            eyebrow="Uso directo"
            title="Rutas de guardia"
            note="Atajos operativos para abrir el punto clínico más útil sin ruido visual."
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <QuickAccessCard
              icon={Activity}
              title="Fibrilación auricular"
              meta="Flujo breve por estabilidad, ritmo y anticoagulación."
              onClick={() => onModuleOpen('fibrilacion-auricular')}
              tone="accent"
            />
            <QuickAccessCard
              icon={HeartPulse}
              title="HTA en urgencias"
              meta="Diferenciar urgencia y emergencia hipertensiva en pocos pasos."
              onClick={() => onModuleOpen('hta-urgencias')}
            />
            <QuickAccessCard
              icon={Calculator}
              title="CHA2DS2-VASc"
              meta="Escala inmediata para prevención embólica."
              onClick={() => onCalculatorOpen('cha2ds2-vasc')}
            />
            <QuickAccessCard
              icon={Pill}
              title="Apixabán"
              meta="Ficha rápida para anticoagulación frecuente."
              onClick={() => onMedicationOpen('apixaban')}
            />
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DetailPanel
          eyebrow="Prioridad"
          title="Protocolos operativos"
          note="Solo se muestra lo que ya está listo para uso clínico, con acceso directo a los flujos."
          action={<StatusBadge tone="active">{activeModules.length} activos</StatusBadge>}
        >
          <div className="space-y-2">
            {activeModules.map((module) => (
              <ListActionRow
                key={module.id}
                title={module.title}
                meta={module.summary}
                badge={<StatusBadge tone="active">Activo</StatusBadge>}
                onClick={() => onModuleOpen(module.id)}
              />
            ))}
          </div>
        </DetailPanel>

        <DetailPanel
          eyebrow="Decisión rápida"
          title="Cálculos listos"
          note="Escalas ya integradas y útiles para las decisiones visibles en los protocolos activos."
          action={
            <button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>
              Ver todos
            </button>
          }
        >
          <div className="space-y-2">
            {featuredCalculators.map((calculator) => (
              <ListActionRow
                key={calculator.id}
                title={calculator.title}
                meta={calculator.summary}
                onClick={() => onCalculatorOpen(calculator.id)}
              />
            ))}
          </div>
        </DetailPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
        <DetailPanel
          eyebrow="Consulta farmacológica"
          title="Medicamentos frecuentes"
          note="Fichas conectadas a los flujos más consultados, sin duplicar la navegación principal."
          action={
            <button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>
              Ver todos
            </button>
          }
        >
          <div className="space-y-2">
            {featuredMedications.map((medicationId) => (
              <MedicationQuickRow
                key={medicationId}
                medication={getMedication(medicationId)}
                onOpen={() => onMedicationOpen(medicationId)}
              />
            ))}
          </div>
        </DetailPanel>

        <DetailPanel
          eyebrow="Contexto útil"
          title="Accesos que reducen pasos"
          note="La app entra directa en lo accionable: protocolos breves, cálculos ya conectados y fichas enlazadas."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Protocolo FA</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">Frecuencia, cardioversión y riesgo embólico</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                Flujo de 4 pasos con cálculos y anticoagulación enlazados en el mismo recorrido.
              </p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Protocolo HTA</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">Cifra, daño diana y tratamiento</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                Clasificación rápida con salida directa a vía oral o intravenosa sin interfaz pesada.
              </p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Cockcroft-Gault</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">Ajuste renal conectado</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                Disponible como módulo aislado o como apoyo inmediato a la decisión anticoagulante.
              </p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Fichas clínicas</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">Dosis, seguridad y fuentes</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                Cada medicamento mantiene pauta, ajustes y bibliografía en la misma línea visual.
              </p>
            </div>
          </div>
        </DetailPanel>
      </section>
    </div>
  );
};

const ProtocolsView = ({ onBack, onModuleOpen }) => {
  const activeModules = motivoConsultaModules.filter((module) => module.implemented);

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <BackBar label="Inicio" onClick={onBack} />

      <PageHero
        eyebrow="Protocolos activos"
        title="Protocolos"
        note="Vista corta y limpia para abrir los recorridos clínicos operativos sin sensación de panel administrativo."
        aside={<StatusBadge tone="active">{activeModules.length} activos</StatusBadge>}
      />

      <DetailPanel title="Lista activa" note="Abre el protocolo solo cuando lo necesites y vuelve al contexto anterior sin fricción.">
        <div className="space-y-2">
          {activeModules.map((module) => (
            <ListActionRow
              key={module.id}
              title={module.title}
              meta={module.summary}
              badge={<StatusBadge tone="active">Activo</StatusBadge>}
              onClick={() => onModuleOpen(module.id)}
            />
          ))}
        </div>
      </DetailPanel>
    </div>
  );
};

const FibrilacionAuricularFlowView = ({
  protocol,
  faFlowState,
  onFaFlowChange,
  onFaFlowReset,
  onCalculatorOpen,
  onCalculationsHub,
  onMedicationOpen,
  onMedicationsHub,
  onBack,
  onFinish,
}) => {
  const referenceHref = protocol.bibliography[0]?.href ?? buildReferenceHref('murillo7', protocol.pdfPage);
  const { step, stability, duration, structuralHeartDisease } = faFlowState;
  const controlMedicationIds = structuralHeartDisease ? ['digoxina', 'amiodarona'] : ['metoprolol', 'verapamilo'];
  const preventionMedicationIds = ['apixaban', 'acenocumarol'];
  const quickCalculationIds = ['cha2ds2-vasc', 'has-bled', 'cockcroft-gault'];

  const updateFlow = (changes) => {
    onFaFlowChange(changes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <FlowHeader
        eyebrow="Protocolo FA"
        title={protocol.longTitle ?? protocol.title}
        note="Flujo clínico breve para decidir conducta inmediata sin abrir bloques largos ni perder contexto."
        step={step}
        totalSteps={4}
        steps={['Estabilidad', 'Contexto', 'Conducta', 'Ictus']}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 1"
            title="Estabilidad hemodinámica"
            note="Evalúa shock, edema agudo de pulmón o síndrome coronario agudo antes de decidir el resto."
          />
          <div className="grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="Inestabilidad / crítico"
              note="Shock, angina grave o insuficiencia cardíaca aguda."
              tone="critical"
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'unstable',
                  duration: null,
                  structuralHeartDisease: null,
                })
              }
            />
            <FlowChoiceCard
              icon={Activity}
              title="Estabilidad clínica"
              note="Sin compromiso hemodinámico inmediato."
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'stable',
                })
              }
            />
          </div>
        </section>
      ) : null}

      {step === 2 && stability === 'stable' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 2" title="Contexto del episodio" note="Completa las dos variables antes de pasar a la conducta." />

          <div className="space-y-6">
            <div>
              <p className="eyebrow eyebrow-muted mb-3">Tiempo de evolución</p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton label="< 48 horas" active={duration === 'lt48'} onClick={() => updateFlow({ duration: 'lt48' })} />
                <FlowSelectButton
                  label="> 48 h o desconocida"
                  active={duration === 'gt48'}
                  onClick={() => updateFlow({ duration: 'gt48' })}
                />
              </div>
            </div>

            <div>
              <p className="eyebrow eyebrow-muted mb-3">Cardiopatía estructural significativa</p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton label="Sí" active={structuralHeartDisease === true} onClick={() => updateFlow({ structuralHeartDisease: true })} />
                <FlowSelectButton
                  label="No / desconocido"
                  active={structuralHeartDisease === false}
                  onClick={() => updateFlow({ structuralHeartDisease: false })}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => updateFlow({ step: 1 })} className={subtleButtonClass}>
                Volver
              </button>
              <button
                type="button"
                disabled={!duration || structuralHeartDisease === null}
                onClick={() => updateFlow({ step: 3 })}
                className={primaryButtonClass}
              >
                Continuar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {step === 2 && stability === 'unstable' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <FlowActionCard
            title="Conducta inmediata: cardioversión eléctrica urgente"
            body="Prioridad absoluta: estabilización hemodinámica. La fibrilación rápida inestable no debe esperar a un desarrollo largo del protocolo."
            tone="critical"
          >
            <div className="space-y-3">
              <div className="rounded-[1.15rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
                <p className="eyebrow text-[rgba(255,244,238,0.72)]">Preprocedimiento</p>
                <p className="mt-2 text-sm text-[rgba(255,248,245,0.9)]">
                  Analgesia y sedación. Si el paciente toma digoxina, considera iniciar con menor energía y evita cardioversión si sospechas intoxicación digitálica.
                </p>
              </div>
              <div className="rounded-[1.15rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
                <p className="eyebrow text-[rgba(255,244,238,0.72)]">Anticoagulación aguda</p>
                <p className="mt-2 text-sm text-[rgba(255,248,245,0.9)]">
                  Si no está anticoagulado, plantea HBPM terapéutica en fase aguda y documenta el plan de continuación.
                </p>
              </div>
              <div className="space-y-2">
                {['enoxaparina', 'amiodarona'].map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>
            </div>
          </FlowActionCard>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onFaFlowReset} className={subtleButtonClass}>
              Reevaluar estabilidad
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Ir a prevención de ictus
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 && stability === 'stable' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <section className={`${panelClass} overflow-hidden p-0`}>
            <div className="border-b border-[color:var(--line)] bg-[rgba(247,241,226,0.78)] px-5 py-5 sm:px-6">
              <p className="eyebrow">Paso 3</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">Conducta inicial</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">
                Objetivo operativo: control de frecuencia y definición de cardioversión.
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className={`${mutedPanelClass} px-4 py-4`}>
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                  <Info className="h-4 w-4 text-[var(--accent-500)]" />
                  {structuralHeartDisease
                    ? 'Con cardiopatía estructural significativa'
                    : 'Sin cardiopatía estructural significativa'}
                </p>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  {structuralHeartDisease
                    ? 'Prioriza digoxina para control de frecuencia y reserva amiodarona como apoyo si la situación lo exige.'
                    : 'Prioriza betabloqueante o verapamilo/diltiazem según perfil clínico y tolerancia.'}
                </p>
              </div>

              <div className="space-y-2">
                {controlMedicationIds.map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>

              <FlowActionCard
                title={duration === 'lt48' ? 'Control del ritmo: cardioversión urgente' : 'Control del ritmo: cardioversión electiva'}
                body={
                  duration === 'lt48'
                    ? 'Si el episodio es menor de 48 horas, puedes plantear cardioversión farmacológica o eléctrica tras controlar síntomas y revisar el contexto clínico.'
                    : 'Si el episodio supera 48 horas o la duración es desconocida, necesita anticoagulación previa o ETE antes de la cardioversión.'
                }
                tone={duration === 'lt48' ? 'neutral' : 'warning'}
              >
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onMedicationOpen('amiodarona')} className={subtleButtonClass}>
                    Abrir amiodarona
                  </button>
                  <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
                    Ver fármacos
                  </button>
                </div>
              </FlowActionCard>

              <div className="rounded-[1.2rem] border border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.92)] px-4 py-3 text-sm text-[var(--text-soft)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-500)]" />
                  <span>{protocol.warnings[0]}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver al contexto
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Evaluar riesgo embólico
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 4"
            title="Prevención de ictus"
            note="Abre las escalas y enlaza la estrategia de anticoagulación sin salir de la arquitectura general."
          />

          <div className="rounded-[1.35rem] border border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.9)] px-5 py-5">
            <p className="eyebrow">Criterio operativo</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
              Anticoagulación oral si CHA2DS2-VASc es igual o mayor de 1 en hombres o igual o mayor de 2 en mujeres. Si no hay prótesis valvular mecánica ni estenosis mitral moderada/grave, prioriza ACOD.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {quickCalculationIds.map((calculatorId) => {
              const calculator = getCalculator(calculatorId);
              return (
                <ListActionRow
                  key={calculatorId}
                  title={calculator.title}
                  meta={calculator.summary}
                  onClick={() => onCalculatorOpen(calculatorId)}
                />
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-2">
            {preventionMedicationIds.map((medicationId) => (
              <MedicationQuickRow
                key={medicationId}
                medication={getMedication(medicationId)}
                onOpen={() => onMedicationOpen(medicationId)}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: stability === 'unstable' ? 2 : 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onCalculationsHub} className={subtleButtonClass}>
              Abrir cálculos
            </button>
            <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
              Abrir medicamentos
            </button>
            <button type="button" onClick={onFinish} className={primaryButtonClass}>
              Finalizar
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const HipertensionUrgenciasFlowView = ({
  protocol,
  htaFlowState,
  onHtaFlowChange,
  onHtaFlowReset,
  onCalculationsHub,
  onMedicationOpen,
  onMedicationsHub,
  onBack,
  onFinish,
}) => {
  const referenceHref = protocol.bibliography[0]?.href ?? buildReferenceHref('murillo7', protocol.pdfPage);
  const { step, pas, pad, hasTargetOrganDamage } = htaFlowState;
  const systolic = Number(pas);
  const diastolic = Number(pad);

  const pressureStage =
    systolic >= 180 || diastolic >= 110
      ? {
          label: 'Grave · estadio 3',
          containerClass: 'border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.92)] text-[var(--danger-700)]',
          iconClass: 'text-[var(--danger-500)]',
        }
      : systolic >= 160 || diastolic >= 100
        ? {
            label: 'Moderada · estadio 2',
            containerClass: 'border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.92)] text-[var(--accent-ink)]',
            iconClass: 'text-[var(--accent-500)]',
          }
        : systolic >= 140 || diastolic >= 90
          ? {
              label: 'Ligera · estadio 1',
              containerClass: 'border-[rgba(191,146,69,0.18)] bg-[rgba(247,241,226,0.84)] text-[var(--accent-ink)]',
              iconClass: 'text-[var(--accent-500)]',
            }
          : {
              label: 'Normal o elevación leve',
              containerClass: 'border-[color:var(--line)] bg-[rgba(245,240,232,0.84)] text-[var(--text-soft)]',
              iconClass: 'text-[var(--text-muted)]',
            };

  const classification = hasTargetOrganDamage === null ? null : hasTargetOrganDamage ? 'emergencia' : 'urgencia';

  const updateFlow = (changes) => {
    onHtaFlowChange(changes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <FlowHeader
        eyebrow="Protocolo HTA"
        title={protocol.longTitle ?? protocol.title}
        note="Flujo breve para separar urgencia de emergencia hipertensiva y decidir la conducta inicial con la menor fricción posible."
        step={step}
        totalSteps={4}
        steps={['Presión', 'Daño diana', 'Tipo', 'Conducta']}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 1"
            title="Registro de presión arterial"
            note="Introduce PAS y PAD antes de decidir si el cuadro es leve, moderado o grave."
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="eyebrow eyebrow-muted">PAS</span>
              <input
                type="number"
                value={pas}
                onChange={(event) => onHtaFlowChange({ pas: event.target.value })}
                placeholder="180"
                className={`${inputClass} text-2xl font-semibold tracking-[-0.04em]`}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="eyebrow eyebrow-muted">PAD</span>
              <input
                type="number"
                value={pad}
                onChange={(event) => onHtaFlowChange({ pad: event.target.value })}
                placeholder="110"
                className={`${inputClass} text-2xl font-semibold tracking-[-0.04em]`}
              />
            </label>
          </div>

          {pas && pad ? (
            <div className={`mt-4 flex items-center justify-between rounded-[1.2rem] border px-4 py-3 ${pressureStage.containerClass}`}>
              <span className="text-sm font-semibold uppercase tracking-[0.16em]">{pressureStage.label}</span>
              <Info className={`h-4 w-4 ${pressureStage.iconClass}`} />
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={!pas || !pad} onClick={() => updateFlow({ step: 2 })} className={primaryButtonClass}>
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 2"
            title="Cribado de daño de órgano diana"
            note="Busca datos clínicos de afectación neurológica, cardiovascular, renal, visual o gestacional."
          />

          <div className="space-y-2">
            {[
              'Neurológico: cefalea intensa, focalidad, confusión o disminución del nivel de conciencia.',
              'Cardiovascular: dolor torácico, disnea, edema agudo de pulmón o shock.',
              'Renal: oliguria o deterioro renal agudo.',
              'Visual: visión borrosa, escotomas o retinopatía grave.',
              'Gestación: sospecha de preeclampsia o eclampsia.',
            ].map((item) => (
              <div key={item} className={`${mutedPanelClass} px-4 py-3 text-sm text-[var(--text-soft)]`}>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="Sí, hay daño de órgano diana"
              note="Clasifica como emergencia hipertensiva y prepara monitorización con tratamiento intravenoso."
              tone="critical"
              onClick={() => updateFlow({ hasTargetOrganDamage: true, step: 3 })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="No, no hay daño agudo de órgano"
              note="Clasifica como urgencia hipertensiva y plantea descenso gradual con vía oral."
              onClick={() => updateFlow({ hasTargetOrganDamage: false, step: 3 })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 1 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {classification === 'emergencia' ? (
            <FlowActionCard
              title="Clasificación: emergencia hipertensiva"
              body="Existe daño agudo de órgano diana. Requiere monitorización y descenso controlado de la presión arterial en 1-2 horas."
              tone="critical"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.15rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
                  <p className="eyebrow text-[rgba(255,244,238,0.72)]">Objetivo</p>
                  <p className="mt-2 text-sm text-[rgba(255,248,245,0.9)]">
                    Reducir en torno al 20-25% de la presión arterial media en el intervalo inicial, salvo matices según el órgano afectado.
                  </p>
                </div>
                <div className="rounded-[1.15rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
                  <p className="eyebrow text-[rgba(255,244,238,0.72)]">Entorno</p>
                  <p className="mt-2 text-sm text-[rgba(255,248,245,0.9)]">
                    Monitorización continua, vía venosa y reevaluación periódica del estado neurológico, cardiopulmonar y renal.
                  </p>
                </div>
              </div>
            </FlowActionCard>
          ) : (
            <FlowActionCard
              title="Clasificación: urgencia hipertensiva"
              body="No hay daño agudo de órgano diana. El descenso de la presión debe ser progresivo y la vía oral suele ser suficiente."
              tone="warning"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.15rem] border border-[rgba(191,146,69,0.22)] bg-[rgba(255,255,255,0.68)] px-4 py-3">
                  <p className="eyebrow">Objetivo</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">
                    Descenso gradual en 24-48 h, evitando caídas bruscas y sin perseguir normalización inmediata.
                  </p>
                </div>
                <div className="rounded-[1.15rem] border border-[rgba(191,146,69,0.22)] bg-[rgba(255,255,255,0.68)] px-4 py-3">
                  <p className="eyebrow">Medidas generales</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">
                    Reposo en ambiente tranquilo, control del dolor o ansiedad y nueva toma de tensión antes de escalar el tratamiento.
                  </p>
                </div>
              </div>
            </FlowActionCard>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              Ir a conducta
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 4"
            title={classification === 'emergencia' ? 'Conducta terapéutica de emergencia' : 'Conducta terapéutica de urgencia'}
            note={
              classification === 'emergencia'
                ? 'Tratamiento intravenoso titulado y monitorizado.'
                : 'Tratamiento oral corto y reevaluación posterior.'
            }
          />

          {classification === 'emergencia' ? (
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.9)] px-4 py-4 text-sm text-[var(--danger-700)]">
                Prioriza tratamiento intravenoso y monitorización continua. Si el contexto es coronario o edema agudo de pulmón, la nitroglicerina gana peso; si es HTA maligna o encefalopatía, el capítulo prioriza nitroprusiato.
              </div>

              <div className="space-y-2">
                {['nitroprusiato', 'labetalol', 'nitroglicerina'].map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.9)] px-4 py-3 text-sm text-[var(--text-soft)]">
                La bibliografía base cita urapidil como alternativa intravenosa, pero el flujo rápido se centra aquí en los fármacos que ya quedan conectados a fichas completas.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-[color:var(--line)] bg-[rgba(245,240,232,0.88)] px-4 py-4 text-sm text-[var(--text-soft)]">
                Reposo, reevaluación tras 30 min y corrección de desencadenantes como dolor, ansiedad o incumplimiento terapéutico antes de intensificar fármacos.
              </div>

              <div className="space-y-2">
                {['captopril', 'labetalol', 'amlodipino'].map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.9)] px-4 py-3 text-sm text-[var(--text-soft)]">
                No usar nifedipino sublingual por riesgo de hipotensión brusca e hipoperfusión.
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onCalculationsHub} className={subtleButtonClass}>
              Abrir cálculos
            </button>
            <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
              Abrir medicamentos
            </button>
            <button
              type="button"
              onClick={() => {
                onHtaFlowReset();
                onFinish();
              }}
              className={primaryButtonClass}
            >
              Finalizar
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const CalculationsView = ({ onBack, onCalculatorOpen }) => (
  <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
    <BackBar label="Inicio" onClick={onBack} />

    <PageHero
      eyebrow="Herramientas rápidas"
      title="Cálculos"
      note="Escalas clínicas visibles, compactas y listas para abrir sin añadir ruido a la home."
      aside={<StatusBadge tone="active">{implementedCalculators.length} activos</StatusBadge>}
    />

    <DetailPanel title="Disponibles" note="Las mismas escalas pueden abrirse desde FA en modo rápido.">
      <div className="space-y-2">
        {implementedCalculators.map((calculator) => (
          <ListActionRow
            key={calculator.id}
            title={calculator.title}
            meta={`${calculator.block} · p. ${calculator.verifiedPage}`}
            onClick={() => onCalculatorOpen(calculator.id)}
          />
        ))}
      </div>
    </DetailPanel>
  </div>
);

const CalculatorDetailView = ({ calculatorId, values, onChange, onBack }) => {
  const calculator = getCalculator(calculatorId);

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <BackBar label="Cálculos" onClick={onBack} />

      <PageHero
        eyebrow="Escala activa"
        title={calculator.title}
        note={calculator.summary}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="active">Implementado</StatusBadge>
            <span className="text-sm text-[var(--text-muted)]">
              {calculator.chapter} · p. {calculator.verifiedPage}
            </span>
          </div>
        }
      />

      <CalculatorPanel calculatorId={calculatorId} values={values} onChange={onChange} />
      <BibliographyBlock entries={calculator.bibliography} />
    </div>
  );
};

const MedicationsView = ({ onBack, onMedicationOpen }) => {
  const [activeGroupId, setActiveGroupId] = useState(medicationGroups[0]?.id ?? '');
  const currentGroup = medicationGroups.find((group) => group.id === activeGroupId) ?? medicationGroups[0];

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <BackBar label="Inicio" onClick={onBack} />

      <PageHero
        eyebrow="Fármacos conectados"
        title="Medicamentos"
        note="Las fichas mantienen la información clínica completa, pero la entrada principal se simplifica en grupos claros y más ligeros."
        aside={
          <StatusBadge tone="active">
            {medicationGroups.reduce((count, group) => count + group.items.length, 0)} fichas
          </StatusBadge>
        }
      >
        <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
          {medicationGroups.map((group) => (
            <ProtocolSectionButton
              key={group.id}
              label={group.title}
              active={currentGroup.id === group.id}
              onClick={() => setActiveGroupId(group.id)}
            />
          ))}
        </div>
      </PageHero>

      <DetailPanel
        title={currentGroup.title}
        note="Desde aquí puedes abrir la ficha completa y volver al contexto anterior."
      >
        <div className="space-y-2">
          {currentGroup.items.map((medicationId) => {
            const medication = getMedication(medicationId);

            return (
              <MedicationQuickRow
                key={medication.id}
                medication={medication}
                onOpen={() => onMedicationOpen(medication.id)}
              />
            );
          })}
        </div>
      </DetailPanel>
    </div>
  );
};

const MedicationDetailView = ({ medication, onBack }) => {
  const protocolLabel = medication.protocolId ? getProtocol(medication.protocolId)?.title ?? 'Módulo clínico' : 'Módulo clínico';

  return (
    <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
      <BackBar label="Medicamentos" onClick={onBack} />

      <PageHero
        eyebrow="Ficha farmacológica"
        title={medication.name}
        note={medication.indication}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="active">{medication.family}</StatusBadge>
            <span className="text-sm text-[var(--text-muted)]">{protocolLabel}</span>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailPanel title="Pauta clínica">
          <div className="space-y-3">
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Dosis</p>
              <p className="mt-2 text-sm text-[var(--text)]">{medication.dose}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Vía</p>
              <p className="mt-2 text-sm text-[var(--text)]">{medication.route}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Frecuencia</p>
              <p className="mt-2 text-sm text-[var(--text)]">{medication.frequency}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Duración</p>
              <p className="mt-2 text-sm text-[var(--text)]">{medication.duration}</p>
            </div>
          </div>
        </DetailPanel>

        <DetailPanel title="Seguridad y ajustes">
          <div className="space-y-3">
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Contraindicaciones / precauciones</p>
              <div className="mt-3 space-y-2">
                {medication.contraindications.map((item) => (
                  <div key={item} className="rounded-[0.95rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-3 py-2.5 text-sm text-[var(--text-soft)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Insuficiencia renal</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.renalAdjustment}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Insuficiencia hepática</p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.hepaticAdjustment}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Observaciones prácticas</p>
              <div className="mt-3 space-y-2">
                {medication.practicalNotes.map((item) => (
                  <div key={item} className="rounded-[0.95rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-3 py-2.5 text-sm text-[var(--text-soft)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailPanel>
      </div>

      <DetailPanel title="Fuentes">
        <div className="space-y-3">
          <div className={`${mutedPanelClass} p-4 text-sm text-[var(--text-soft)]`}>{medication.sourceScope}</div>
          <SourceList sources={medication.sources} />
        </div>
      </DetailPanel>
    </div>
  );
};

const App = () => {
  const [route, setRoute] = useState({ view: 'home' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState(initialCalculatorInputs);
  const [faFlowState, setFaFlowState] = useState(initialFaFlowState);
  const [htaFlowState, setHtaFlowState] = useState(initialHtaFlowState);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (nextRoute) => {
    startTransition(() => {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const resetFaFlow = () => {
    setFaFlowState(initialFaFlowState);
  };

  const updateFaFlow = (changes) => {
    setFaFlowState((current) => ({
      ...current,
      ...changes,
    }));
  };

  const resetHtaFlow = () => {
    setHtaFlowState(initialHtaFlowState);
  };

  const updateHtaFlow = (changes) => {
    setHtaFlowState((current) => ({
      ...current,
      ...changes,
    }));
  };

  const openModule = (moduleId, returnTo = { view: 'protocols' }) => {
    const module = getMotivoModule(moduleId);

    if (!module.implemented) {
      return;
    }

    if (module.id === 'fibrilacion-auricular') {
      resetFaFlow();
    }

    if (module.id === 'hta-urgencias') {
      resetHtaFlow();
    }

    navigate({ view: 'protocol', protocolId: module.id, returnTo });
  };

  const openCalculations = (returnTo = { view: 'home' }) => {
    navigate({ view: 'calculations', returnTo });
  };

  const openCalculator = (calculatorId, returnTo = { view: 'home' }) => {
    navigate({ view: 'calculator', calculatorId, returnTo });
  };

  const openMedications = (returnTo = { view: 'home' }) => {
    navigate({ view: 'medications', returnTo });
  };

  const openMedication = (medicationId, returnTo = { view: 'home' }) => {
    navigate({ view: 'medication', medicationId, returnTo });
  };

  const handleBack = () => {
    if (route.returnTo) {
      navigate(route.returnTo);
      return;
    }

    navigate({ view: 'home' });
  };

  const handlePrimaryNavigation = (sectionKey) => {
    if (sectionKey === 'home') {
      navigate({ view: 'home' });
      return;
    }

    if (sectionKey === 'protocols') {
      navigate({ view: 'protocols' });
      return;
    }

    if (sectionKey === 'calculations') {
      openCalculations({ view: 'home' });
      return;
    }

    openMedications({ view: 'home' });
  };

  const renderView = () => {
    if (route.view === 'protocol') {
      const protocolId = route.protocolId ?? 'fibrilacion-auricular';
      const protocolReturnTo = {
        view: 'protocol',
        protocolId,
      };

      if (protocolId === 'hta-urgencias') {
        return (
          <HipertensionUrgenciasFlowView
            protocol={getProtocol(protocolId)}
            htaFlowState={htaFlowState}
            onHtaFlowChange={updateHtaFlow}
            onHtaFlowReset={resetHtaFlow}
            onCalculationsHub={() => openCalculations(protocolReturnTo)}
            onMedicationOpen={(medicationId) => openMedication(medicationId, protocolReturnTo)}
            onMedicationsHub={() => openMedications(protocolReturnTo)}
            onBack={handleBack}
            onFinish={() => {
              resetHtaFlow();
              navigate({ view: 'home' });
            }}
          />
        );
      }

      return (
        <FibrilacionAuricularFlowView
          protocol={getProtocol(protocolId)}
          faFlowState={faFlowState}
          onFaFlowChange={updateFaFlow}
          onFaFlowReset={resetFaFlow}
          onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, protocolReturnTo)}
          onCalculationsHub={() => openCalculations(protocolReturnTo)}
          onMedicationOpen={(medicationId) => openMedication(medicationId, protocolReturnTo)}
          onMedicationsHub={() => openMedications(protocolReturnTo)}
          onBack={handleBack}
          onFinish={() => {
            resetFaFlow();
            navigate({ view: 'home' });
          }}
        />
      );
    }

    if (route.view === 'protocols') {
      return (
        <ProtocolsView
          onBack={() => navigate({ view: 'home' })}
          onModuleOpen={(moduleId) => openModule(moduleId, { view: 'protocols' })}
        />
      );
    }

    if (route.view === 'calculations') {
      return (
        <CalculationsView
          onBack={handleBack}
          onCalculatorOpen={(calculatorId) =>
            openCalculator(calculatorId, { view: 'calculations', returnTo: route.returnTo ?? { view: 'home' } })
          }
        />
      );
    }

    if (route.view === 'calculator') {
      return (
        <CalculatorDetailView
          calculatorId={route.calculatorId}
          values={calculatorInputs[route.calculatorId]}
          onChange={(field, value) => updateNestedState(setCalculatorInputs, route.calculatorId, field, value)}
          onBack={handleBack}
        />
      );
    }

    if (route.view === 'medications') {
      return (
        <MedicationsView
          onBack={handleBack}
          onMedicationOpen={(medicationId) =>
            openMedication(medicationId, { view: 'medications', returnTo: route.returnTo ?? { view: 'home' } })
          }
        />
      );
    }

    if (route.view === 'medication') {
      return <MedicationDetailView medication={getMedication(route.medicationId)} onBack={handleBack} />;
    }

    return (
      <HomeView
        onProtocolsOpen={() => navigate({ view: 'protocols' })}
        onModuleOpen={(moduleId) => openModule(moduleId, { view: 'home' })}
        onCalculationsOpen={() => openCalculations({ view: 'home' })}
        onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, { view: 'home' })}
        onMedicationsOpen={() => openMedications({ view: 'home' })}
        onMedicationOpen={(medicationId) => openMedication(medicationId, { view: 'home' })}
      />
    );
  };

  return (
    <div className="min-h-screen text-[var(--text)]">
      <PrimaryNavigation activeKey={getPrimarySection(route.view)} onSelect={handlePrimaryNavigation} />
      <AppHeader
        isScrolled={isScrolled}
        pageLabel={getPageLabel(route)}
        activeKey={getPrimarySection(route.view)}
        onHome={() => navigate({ view: 'home' })}
        onSelect={handlePrimaryNavigation}
      />
      <main className="pb-28 pt-[5.6rem] lg:pb-12">
        <div className="px-4 pb-2 sm:px-6 lg:px-8">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
