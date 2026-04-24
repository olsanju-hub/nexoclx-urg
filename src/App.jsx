import React, { startTransition, useEffect, useState } from 'react';
import {
  Activity,
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
const pageClass = 'mx-auto max-w-[72rem] space-y-3 sm:space-y-5 xl:space-y-6';
const widePageClass = 'mx-auto max-w-[76rem] space-y-3 sm:space-y-5 xl:space-y-6';

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

const initialScaFlowState = {
  step: 1,
  stability: null,
  syndromeType: null,
  stemiScenario: null,
  nsteacsRisk: null,
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
    <img
      src={brandMark}
      alt="NexoClx"
      className="h-10 w-10 rounded-[1rem] object-cover shadow-[0_18px_38px_-24px_rgba(78,58,20,0.34)] sm:h-11 sm:w-11 sm:rounded-[1.15rem]"
    />
    <div className="min-w-0">
      <div className="text-[0.98rem] font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-[1rem]">
        <span>Nexo</span>
        <span className="text-[var(--accent-500)]">Clx</span>
      </div>
      {label ? <p className="truncate pt-0.5 text-[0.72rem] font-medium text-[var(--text-muted)] sm:text-xs">{label}</p> : null}
    </div>
  </div>
);

const SectionTitle = ({ eyebrow, title, note, action = null }) => (
  <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      {eyebrow ? <p className="eyebrow eyebrow-muted">{eyebrow}</p> : null}
      <h2 className="mt-1.5 text-[1.05rem] font-semibold tracking-[-0.03em] text-[var(--text)] sm:mt-2 sm:text-[1.15rem]">{title}</h2>
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
    <div className="flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2.5 text-[1.68rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:mt-3 sm:text-[2.05rem] xl:text-[2.3rem]">
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
    <div className="mx-auto flex h-[4.2rem] max-w-[82rem] items-center gap-3 px-3.5 sm:h-[4.6rem] sm:gap-4 sm:px-6 lg:px-8 xl:px-10">
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
  <div className="mb-3 flex flex-wrap items-center justify-between gap-3 sm:mb-4">
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
    <SectionTitle title="Fuente" />
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

const ProtocolGuideBlock = ({ label, children, tone = 'neutral' }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.9)]'
      : tone === 'warning'
        ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.9)]'
        : tone === 'accent'
          ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.88)]'
          : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.82)]';

  return (
    <div className={`rounded-[1.15rem] border px-3.5 py-3.5 sm:rounded-[1.2rem] sm:px-4 sm:py-4 ${toneClass}`}>
      <p className="eyebrow eyebrow-muted">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{children}</div>
    </div>
  );
};

const ProtocolFocusStrip = ({ current, decision, next }) => (
  <div className="mt-4 grid gap-2.5 md:grid-cols-3 lg:gap-3">
    <ProtocolGuideBlock label="Ahora">
      <p className="font-semibold text-[var(--text)]">{current}</p>
    </ProtocolGuideBlock>
    <ProtocolGuideBlock label="Decisión" tone="accent">
      <p className="font-semibold text-[var(--text)]">{decision}</p>
    </ProtocolGuideBlock>
    <ProtocolGuideBlock label="Después">
      <p className="font-semibold text-[var(--text)]">{next}</p>
    </ProtocolGuideBlock>
  </div>
);

const getFaFlowFocus = ({ step, stability, duration }) => {
  if (step === 1) {
    return {
      current: 'Estabilidad hemodinámica',
      decision: '¿Hay inestabilidad?',
      next: 'Si está estable, definir contexto. Si no, actuar.',
    };
  }

  if (step === 2 && stability === 'stable') {
    return {
      current: 'Duración y cardiopatía estructural',
      decision: 'Definir si el episodio es < 48 h o > 48 h/desconocido.',
      next: 'Pasar a conducta inicial.',
    };
  }

  if (step === 2 && stability === 'unstable') {
    return {
      current: 'FA inestable',
      decision: 'Cardioversión urgente.',
      next: 'Después, valorar prevención de ictus.',
    };
  }

  if (step === 3) {
    return {
      current: duration === 'lt48' ? 'FA estable < 48 h' : 'FA estable > 48 h o desconocida',
      decision: 'Control de frecuencia y estrategia de cardioversión.',
      next: 'Valorar anticoagulación.',
    };
  }

  return {
    current: 'Prevención de ictus',
    decision: 'Decidir anticoagulación.',
    next: 'Abrir cálculos o fármacos si hacen falta.',
  };
};

const getHtaFlowFocus = ({ step, hasTargetOrganDamage }) => {
  if (step === 1) {
    return {
      current: 'Cifra tensional',
      decision: 'Registrar PAS y PAD.',
      next: 'Buscar daño de órgano diana.',
    };
  }

  if (step === 2) {
    return {
      current: 'Daño de órgano diana',
      decision: '¿Hay emergencia hipertensiva?',
      next: 'Clasificar el caso.',
    };
  }

  if (step === 3) {
    return {
      current: 'Clasificación',
      decision: hasTargetOrganDamage ? 'Emergencia hipertensiva.' : 'Urgencia hipertensiva.',
      next: 'Elegir conducta y tratamiento.',
    };
  }

  return {
    current: 'Tratamiento',
    decision: hasTargetOrganDamage ? 'Vía intravenosa y monitorización.' : 'Vía oral y reevaluación.',
    next: 'Revisar fármacos y advertencias.',
  };
};

const getScaFlowFocus = ({ step, syndromeType, stability, stemiScenario, nsteacsRisk }) => {
  if (step === 1) {
    return {
      current: 'Posible síndrome coronario agudo',
      decision: '¿Hay inestabilidad o muy alto riesgo?',
      next: 'Tipificar por ECG.',
    };
  }

  if (step === 2) {
    return {
      current: 'Clasificación inicial',
      decision: '¿SCACEST o SCASEST?',
      next: 'Definir reperfusión o riesgo invasivo.',
    };
  }

  if (step === 3 && syndromeType === 'stemi') {
    return {
      current: 'SCACEST',
      decision: 'Elegir reperfusión inmediata o fibrinólisis.',
      next: 'Activar código infarto y destino.',
    };
  }

  if (step === 3) {
    return {
      current: 'SCASEST',
      decision: stability === 'unstable' ? 'Confirma muy alto riesgo.' : 'Define muy alto, alto o menor riesgo.',
      next: 'Fijar el tiempo de coronariografía.',
    };
  }

  if (step === 4) {
    if (syndromeType === 'stemi') {
      return {
        current: 'Conducta inmediata',
        decision:
          stemiScenario === 'pci'
            ? 'ICP primaria urgente.'
            : stemiScenario === 'fibrinolysis'
              ? 'Fibrinólisis precoz y traslado.'
              : 'Ingreso y valoración cardiológica urgente.',
        next: 'Revisar tratamiento inicial.',
      };
    }

    return {
      current: 'Conducta inmediata',
      decision:
        nsteacsRisk === 'very-high'
          ? 'ICP urgente < 2 h.'
          : nsteacsRisk === 'high'
            ? 'ICP precoz < 24 h.'
            : 'Ingreso, monitorización y estrategia diferida.',
      next: 'Revisar tratamiento inicial.',
    };
  }

  return {
    current: 'Tratamiento inicial',
    decision: 'Analgesia, antiisquemia y antitrombosis.',
    next: 'Confirmar ingreso y advertencias.',
  };
};

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

const FlowHeader = ({ eyebrow, title, step, totalSteps, steps, current, decision, next, onBack, onOpenSource }) => (
  <section className={`${shellCardClass} p-5 sm:p-6`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
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

    <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2.5 text-[1.55rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:mt-3 sm:text-[1.82rem] xl:text-[2.1rem]">
          {title}
        </h1>
      </div>
      <div className={`${mutedPanelClass} w-full min-w-0 px-4 py-3.5 sm:min-w-[210px] sm:px-4 sm:py-4 xl:max-w-[240px]`}>
        <p className="eyebrow eyebrow-muted">Paso {step} de {totalSteps}</p>
        <div className="mt-3 h-2 rounded-full bg-[rgba(111,104,93,0.08)]">
          <div className="progress-fill h-full rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>
    </div>

    <ProtocolFocusStrip current={current} decision={decision} next={next} />

    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:mt-5 md:flex-wrap">
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
    <div className={widePageClass}>
      <PageHero title="Inicio">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onProtocolsOpen} className={primaryButtonClass}>
            <ClipboardList className="h-4 w-4" />
            Protocolos
          </button>
          <button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>
            <Calculator className="h-4 w-4" />
            Cálculos
          </button>
          <button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>
            <Pill className="h-4 w-4" />
            Medicamentos
          </button>
        </div>
      </PageHero>

      <section className="grid gap-4 lg:grid-cols-[0.98fr_1.02fr] xl:gap-5">
        <DetailPanel title="Acceso directo">
          <div className="grid gap-2.5 sm:grid-cols-2 xl:gap-3">
            <QuickAccessCard
              icon={HeartPulse}
              title="Síndrome coronario agudo"
              meta="ECG, reperfusión y antitrombosis."
              onClick={() => onModuleOpen('sindrome-coronario-agudo')}
              tone="accent"
            />
            <QuickAccessCard
              icon={Activity}
              title="Fibrilación auricular"
              meta="Estabilidad, cardioversión y anticoagulación."
              onClick={() => onModuleOpen('fibrilacion-auricular')}
            />
            <QuickAccessCard
              icon={HeartPulse}
              title="HTA en urgencias"
              meta="Cifra, daño diana y tratamiento."
              onClick={() => onModuleOpen('hta-urgencias')}
            />
            <QuickAccessCard
              icon={Calculator}
              title="CHA2DS2-VASc"
              meta="Riesgo embólico."
              onClick={() => onCalculatorOpen('cha2ds2-vasc')}
            />
          </div>
        </DetailPanel>

        <DetailPanel title="Protocolos">
          <div className="space-y-2">
            {activeModules.map((module) => (
              <ListActionRow key={module.id} title={module.title} meta={module.summary} onClick={() => onModuleOpen(module.id)} />
            ))}
          </div>
        </DetailPanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr] xl:gap-5">
        <DetailPanel title="Cálculos" action={<button type="button" onClick={onCalculationsOpen} className={subtleButtonClass}>Ver todos</button>}>
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

        <DetailPanel title="Medicamentos" action={<button type="button" onClick={onMedicationsOpen} className={subtleButtonClass}>Ver todos</button>}>
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
      </section>
    </div>
  );
};

const ProtocolsView = ({ onBack, onModuleOpen }) => {
  const activeModules = motivoConsultaModules.filter((module) => module.implemented);

  return (
    <div className={pageClass}>
      <BackBar label="Inicio" onClick={onBack} />

      <PageHero title="Protocolos" />

      <DetailPanel title="Protocolos">
        <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {activeModules.map((module) => (
            <ListActionRow
              key={module.id}
              title={module.title}
              meta={module.summary}
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
  const flowFocus = getFaFlowFocus({ step, stability, duration });
  const timingLabel = duration === 'lt48' ? '< 48 h' : '> 48 h o desconocida';
  const structuralLabel = structuralHeartDisease ? 'Con cardiopatía estructural significativa' : 'Sin cardiopatía estructural significativa';
  const rateControlText = structuralHeartDisease
    ? 'Prioriza digoxina. Reserva amiodarona si necesitas apoyo.'
    : 'Prioriza betabloqueante o verapamilo/diltiazem según perfil clínico.';
  const cardioversionText =
    duration === 'lt48'
      ? 'Tras controlar síntomas y frecuencia, puedes plantear cardioversión farmacológica o eléctrica.'
      : 'Necesita anticoagulación previa o ETE antes de la cardioversión.';

  const updateFlow = (changes) => {
    onFaFlowChange(changes);
  };

  return (
    <div className={pageClass}>
      <FlowHeader
        eyebrow="Protocolo FA"
        title={protocol.longTitle ?? protocol.title}
        step={step}
        totalSteps={4}
        steps={['Estabilidad', 'Contexto', 'Conducta', 'Ictus']}
        current={flowFocus.current}
        decision={flowFocus.decision}
        next={flowFocus.next}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 1" title="Estabilidad hemodinámica" note="Decide si hay inestabilidad." />
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
          <SectionTitle eyebrow="Paso 2" title="Contexto del episodio" note="Define duración y cardiopatía estructural." />

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
        <section className={`${panelClass} animate-in fade-in slide-in-from-top-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 2" title="FA inestable" note="Actúa ahora." />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Clasificación" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Inestabilidad hemodinámica.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Conducta inmediata" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Cardioversión eléctrica urgente.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Preprocedimiento" tone="critical">
              Analgesia y sedación. Si el paciente toma digoxina, considera iniciar con menor energía y evita cardioversión si sospechas intoxicación digitálica.
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Anticoagulación aguda" tone="critical">
              Si no está anticoagulado, plantea HBPM terapéutica en fase aguda y documenta el plan de continuación.
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Tratamiento relacionado</p>
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

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onFaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Ir a prevención de ictus
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && stability === 'stable' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Conducta" note="Clasifica el caso y trata." />

          <div className="grid gap-3 lg:grid-cols-3">
            <ProtocolGuideBlock label="Caso" tone="accent">
              <p className="font-semibold text-[var(--text)]">{timingLabel}</p>
              <p className="mt-1">{structuralLabel}.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Conducta inmediata">
              <p className="font-semibold text-[var(--text)]">Control de frecuencia.</p>
              <p className="mt-1">{rateControlText}</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Cardioversión" tone={duration === 'lt48' ? 'accent' : 'warning'}>
              <p className="font-semibold text-[var(--text)]">{duration === 'lt48' ? 'Urgente' : 'Electiva / diferida'}</p>
              <p className="mt-1">{cardioversionText}</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Tratamiento</p>
            <div className="space-y-2">
              {controlMedicationIds.map((medicationId) => (
                <MedicationQuickRow
                  key={medicationId}
                  medication={getMedication(medicationId)}
                  onOpen={() => onMedicationOpen(medicationId)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <ProtocolGuideBlock label="Siguiente">
              Valora prevención de ictus cuando hayas resuelto la conducta inmediata.
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Advertencia" tone="warning">
              {protocol.warnings[0]}
            </ProtocolGuideBlock>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Evaluar riesgo embólico
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Prevención de ictus" note="Decide anticoagulación." />

          <div className="grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <ProtocolGuideBlock label="Conducta" tone="accent">
              <p className="font-semibold text-[var(--text)]">
                Anticoagulación oral si CHA2DS2-VASc es igual o mayor de 1 en hombres o igual o mayor de 2 en mujeres.
              </p>
              <p className="mt-1">
                Si no hay prótesis valvular mecánica ni estenosis mitral moderada/grave, prioriza ACOD.
              </p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Advertencia" tone="warning">
              {protocol.warnings[2]}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Cálculos</p>
            <div className="space-y-2">
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
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Medicamentos</p>
            <div className="grid gap-2 lg:grid-cols-2">
              {preventionMedicationIds.map((medicationId) => (
                <MedicationQuickRow
                  key={medicationId}
                  medication={getMedication(medicationId)}
                  onOpen={() => onMedicationOpen(medicationId)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Advertencias</p>
            <div className="space-y-2">
              {protocol.warnings.slice(1).map((warning) => (
                <div key={warning} className={`${mutedPanelClass} px-4 py-3 text-sm text-[var(--text-soft)]`}>
                  {warning}
                </div>
              ))}
            </div>
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
  const flowFocus = getHtaFlowFocus({ step, hasTargetOrganDamage });

  const updateFlow = (changes) => {
    onHtaFlowChange(changes);
  };

  return (
    <div className={pageClass}>
      <FlowHeader
        eyebrow="Protocolo HTA"
        title={protocol.longTitle ?? protocol.title}
        step={step}
        totalSteps={4}
        steps={['Presión', 'Daño diana', 'Tipo', 'Conducta']}
        current={flowFocus.current}
        decision={flowFocus.decision}
        next={flowFocus.next}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 1" title="Registro de presión arterial" note="Introduce PAS y PAD." />

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
          <SectionTitle eyebrow="Paso 2" title="Daño de órgano diana" note="Decide si hay emergencia hipertensiva." />

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
              note="Emergencia hipertensiva."
              tone="critical"
              onClick={() => updateFlow({ hasTargetOrganDamage: true, step: 3 })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="No, no hay daño agudo de órgano"
              note="Urgencia hipertensiva."
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
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Clasificación" note="Define urgencia o emergencia." />

          <div className="grid gap-3 lg:grid-cols-3">
            <ProtocolGuideBlock label="Cifra">
              <p className="font-semibold text-[var(--text)]">{pressureStage.label}</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Daño de órgano diana" tone={classification === 'emergencia' ? 'critical' : 'accent'}>
              <p className="font-semibold text-[var(--text)]">{classification === 'emergencia' ? 'Sí' : 'No'}</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Caso" tone={classification === 'emergencia' ? 'critical' : 'warning'}>
              <p className="font-semibold text-[var(--text)]">
                {classification === 'emergencia' ? 'Emergencia hipertensiva' : 'Urgencia hipertensiva'}
              </p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Conducta inmediata" tone={classification === 'emergencia' ? 'critical' : 'warning'}>
              {classification === 'emergencia'
                ? 'Ingreso, monitorización y descenso controlado con fármaco intravenoso de acción corta.'
                : 'Confirma cifras, corrige desencadenantes y baja la presión de forma progresiva. La vía oral suele ser suficiente.'}
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label={classification === 'emergencia' ? 'Objetivo' : 'Medidas generales'}>
              {classification === 'emergencia'
                ? 'Titula según el órgano afectado y evita caídas bruscas o excesivas de la presión arterial.'
                : 'Reposo, control del dolor o la ansiedad y nueva toma antes de intensificar el tratamiento.'}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              Ir a tratamiento
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 4"
            title={classification === 'emergencia' ? 'Tratamiento de emergencia' : 'Tratamiento de urgencia'}
            note={
              classification === 'emergencia'
                ? 'Ingresa, monitoriza y empieza tratamiento intravenoso titulado.'
                : 'Empieza tratamiento oral, corrige desencadenantes y reevaluación.'
            }
          />

          <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
            <ProtocolGuideBlock label="Conducta" tone={classification === 'emergencia' ? 'critical' : 'warning'}>
              {classification === 'emergencia'
                ? 'Prioriza fármaco intravenoso de acción corta y monitorización continua. Si hay contexto coronario o edema agudo de pulmón, la nitroglicerina gana peso; el resto depende del órgano afectado y del escenario.'
                : 'Reposo, control del dolor o la ansiedad, repetición de la toma y ajuste oral si la elevación persiste.'}
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Advertencia" tone="warning">
              {classification === 'emergencia' ? protocol.warnings[1] : protocol.warnings[0]}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Tratamiento</p>
            <div className="space-y-2">
              {(classification === 'emergencia'
                ? ['labetalol', 'nitroglicerina', 'nitroprusiato']
                : ['captopril', 'labetalol', 'amlodipino']
              ).map((medicationId) => (
                <MedicationQuickRow
                  key={medicationId}
                  medication={getMedication(medicationId)}
                  onOpen={() => onMedicationOpen(medicationId)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Advertencias</p>
            <div className="space-y-2">
              {(classification === 'emergencia'
                ? [protocol.warnings[1], protocol.warnings[2]]
                : [protocol.warnings[0], protocol.warnings[2]]
              ).map((warning) => (
                <div key={warning} className={`${mutedPanelClass} px-4 py-3 text-sm text-[var(--text-soft)]`}>
                  {warning}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
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

const SindromeCoronarioAgudoFlowView = ({
  protocol,
  scaFlowState,
  onScaFlowChange,
  onScaFlowReset,
  onMedicationOpen,
  onMedicationsHub,
  onBack,
  onFinish,
}) => {
  const referenceHref = protocol.bibliography[0]?.href ?? buildReferenceHref('murillo7', protocol.pdfPage);
  const { step, stability, syndromeType, stemiScenario, nsteacsRisk } = scaFlowState;
  const flowFocus = getScaFlowFocus({ step, syndromeType, stability, stemiScenario, nsteacsRisk });

  const nsteacsRiskLabel =
    nsteacsRisk === 'very-high' ? 'Muy alto riesgo' : nsteacsRisk === 'high' ? 'Alto riesgo' : 'Intermedio / bajo riesgo';

  const stemiScenarioLabel =
    stemiScenario === 'pci'
      ? 'ICP primaria urgente'
      : stemiScenario === 'fibrinolysis'
        ? 'Fibrinólisis precoz'
        : 'Valoración cardiológica urgente';

  const stemiConductText =
    stemiScenario === 'pci'
      ? 'Activa código infarto y deriva a hemodinámica. No esperes troponina.'
      : stemiScenario === 'fibrinolysis'
        ? 'Fibrinólisis precoz si no llegas a ICP en menos de 120 min y traslado posterior para ICP.'
        : 'Si han pasado más de 12 h, valora ICP si persiste isquemia, shock, insuficiencia cardíaca o arritmias graves; si no, ingreso y valoración cardiológica durante el ingreso.';

  const stemiDestinationText =
    stemiScenario === 'fibrinolysis' ? 'UCI y traslado a centro con hemodinámica.' : 'UCI / hemodinámica.';

  const nsteacsConductText =
    nsteacsRisk === 'very-high'
      ? 'Coronariografía inmediata, idealmente en menos de 2 h.'
      : nsteacsRisk === 'high'
        ? 'Coronariografía precoz en menos de 24 h.'
        : 'Observación monitorizada, hs-cTn seriada y estrategia invasiva durante el ingreso o selectiva según la sospecha clínica.';

  const nsteacsDestinationText =
    nsteacsRisk === 'low-intermediate' ? 'Observación monitorizada o cardiología según dolor, ECG y troponina.' : 'UCI o cardiología monitorizada.';

  const antithromboticText =
    syndromeType === 'stemi'
      ? 'Aspirina siempre. Añade prasugrel o ticagrelor si va a ICP; clopidogrel si no puedes usar un inhibidor potente o si fibrinolizas. Anticoagula con HNF durante la ICP; enoxaparina es alternativa.'
      : nsteacsRisk === 'low-intermediate'
        ? 'Aspirina desde el inicio. Si no se prevé coronariografía < 24 h y no hay alto riesgo hemorrágico, valora inhibidor del P2Y12. Fondaparinux es la anticoagulación de elección; si acaba en ICP, añade HNF.'
        : 'Aspirina desde el inicio. Si se define ICP, prasugrel suele preferirse; ticagrelor es alternativa. Si se prevé coronariografía < 24 h, HNF o enoxaparina; si no, fondaparinux.';

  const treatmentMedicationIds =
    syndromeType === 'stemi'
      ? [
          'acido-acetilsalicilico',
          'prasugrel',
          'ticagrelor',
          'clopidogrel',
          'heparina-sodica',
          'enoxaparina-sca',
          'nitroglicerina-sca',
          'morfina-sca',
        ]
      : nsteacsRisk === 'low-intermediate'
        ? ['acido-acetilsalicilico', 'ticagrelor', 'clopidogrel', 'fondaparinux-sca', 'nitroglicerina-sca', 'morfina-sca']
        : [
            'acido-acetilsalicilico',
            'prasugrel',
            'ticagrelor',
            'clopidogrel',
            'heparina-sodica',
            'enoxaparina-sca',
            'fondaparinux-sca',
            'nitroglicerina-sca',
            'morfina-sca',
          ];

  const fibrinolysisWarnings = [
    'Descarta ACV hemorrágico previo, disección aórtica o sangrado gastrointestinal reciente.',
    'No fibrolises si hay traumatismo craneal, cirugía o punción no compresible reciente.',
    'Revisa HTA grave no controlada, anticoagulación oral y embarazo reciente antes de decidir.',
  ];

  const updateFlow = (changes) => {
    onScaFlowChange(changes);
  };

  return (
    <div className={pageClass}>
      <FlowHeader
        eyebrow="Protocolo SCA"
        title={protocol.longTitle ?? protocol.title}
        step={step}
        totalSteps={5}
        steps={['Gravedad', 'Tipo', 'Escenario', 'Conducta', 'Tratamiento']}
        current={flowFocus.current}
        decision={flowFocus.decision}
        next={flowFocus.next}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 1" title="Cribado de gravedad" note="ECG de 12 derivaciones en los primeros 10 min." />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Haz ahora" tone="accent">
              <div className="space-y-1.5">
                <p>Monitoriza, canaliza una vía y pide hs-cTn, hemograma, bioquímica y coagulación.</p>
                <p>Si no hay SCACEST, aplica 0 h/1 h o 0 h/2 h para la troponina.</p>
                <p>Usa oxígeno solo si la SpO2 es menor del 90%.</p>
              </div>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Piensa en Killip">
              <div className="space-y-1.5">
                <p>I: sin insuficiencia cardíaca.</p>
                <p>II: crepitantes, galope o ingurgitación yugular.</p>
                <p>III: edema agudo de pulmón. IV: shock cardiogénico.</p>
              </div>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="Inestabilidad o muy alto riesgo"
              note="Shock, edema agudo de pulmón, arritmias ventriculares o angina refractaria."
              tone="critical"
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'unstable',
                  syndromeType: null,
                  stemiScenario: null,
                  nsteacsRisk: null,
                })
              }
            />
            <FlowChoiceCard
              icon={Activity}
              title="Sin inestabilidad inmediata"
              note="Paciente estable para tipificar el síndrome."
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: 'stable',
                  syndromeType: null,
                  stemiScenario: null,
                  nsteacsRisk: null,
                })
              }
            />
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 2" title="Clasificación inicial" note="Tipifica el síndrome con ECG y hs-cTn." />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="No retrases" tone="warning">
              {protocol.warnings[0]}
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Datos que mandan">
              <div className="space-y-1.5">
                <p>SCACEST: elevación persistente del ST o BCRI nuevo/presumiblemente nuevo.</p>
                <p>SCASEST: sin elevación persistente del ST; hs-cTn 0 h/1 h o 0 h/2 h y el riesgo ordenan la conducta.</p>
              </div>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 grid gap-4">
            <FlowChoiceCard
              icon={HeartPulse}
              title="SCACEST / BCRI nuevo"
              note="Reperfusión precoz si el contexto es compatible."
              tone="critical"
              onClick={() =>
                updateFlow({
                  step: 3,
                  syndromeType: 'stemi',
                  stemiScenario: null,
                  nsteacsRisk: null,
                })
              }
            />
            <FlowChoiceCard
              icon={Activity}
              title="SCASEST"
              note="Usa hs-cTn y el riesgo para fijar el tiempo de coronariografía."
              onClick={() =>
                updateFlow({
                  step: 3,
                  syndromeType: 'nstemi',
                  stemiScenario: null,
                  nsteacsRisk: stability === 'unstable' ? 'very-high' : null,
                })
              }
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 1 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && syndromeType === 'stemi' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Escenario de SCACEST" note="Decide la estrategia de reperfusión." />

          {stability === 'unstable' ? (
            <div className="mb-4">
              <ProtocolGuideBlock label="Muy alto riesgo" tone="critical">
                Shock, insuficiencia cardíaca aguda grave o arritmias malignas inclinan a ICP urgente.
              </ProtocolGuideBlock>
            </div>
          ) : null}

          <div className="grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="< 12 h y ICP disponible en < 120 min"
              note="Código infarto y hemodinámica urgente."
              tone="critical"
              onClick={() => updateFlow({ step: 4, stemiScenario: 'pci' })}
            />
            <FlowChoiceCard
              icon={HeartPulse}
              title="< 12 h y demora > 120 min"
              note="Fibrinólisis precoz y traslado para ICP posterior."
              onClick={() => updateFlow({ step: 4, stemiScenario: 'fibrinolysis' })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="> 12 h o sin criterio claro de reperfusión inmediata"
              note="Ingreso y valoración cardiológica urgente según síntomas y complicaciones."
              onClick={() => updateFlow({ step: 4, stemiScenario: 'late' })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && syndromeType === 'nstemi' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Riesgo en SCASEST" note="Define el tiempo de coronariografía." />

          <div className="grid gap-4">
            <FlowChoiceCard
              icon={ShieldAlert}
              title="Muy alto riesgo"
              note="Angina refractaria, insuficiencia cardíaca, arritmias ventriculares o inestabilidad hemodinámica."
              tone="critical"
              onClick={() => updateFlow({ step: 4, nsteacsRisk: 'very-high' })}
            />
            <FlowChoiceCard
              icon={HeartPulse}
              title="Alto riesgo"
              note="Troponina dinámica, cambios ST/T o GRACE > 140."
              onClick={() => updateFlow({ step: 4, nsteacsRisk: 'high' })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="Intermedio / bajo riesgo"
              note="Sin criterios previos; observación monitorizada y estrategia selectiva según clínica, ECG y troponina."
              onClick={() => updateFlow({ step: 4, nsteacsRisk: 'low-intermediate' })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Conducta inmediata" note="Deja fijado qué haces ahora y adónde va el paciente." />

          {syndromeType === 'stemi' ? (
            <div className="grid gap-3 lg:grid-cols-3">
              <ProtocolGuideBlock label="Caso" tone="critical">
                <p className="font-semibold text-[var(--text)]">SCACEST</p>
                <p className="mt-1">{stemiScenarioLabel}.</p>
              </ProtocolGuideBlock>
              <ProtocolGuideBlock label="Conducta" tone={stemiScenario === 'late' ? 'warning' : 'critical'}>
                {stemiConductText}
              </ProtocolGuideBlock>
              <ProtocolGuideBlock label="Destino">
                <p className="font-semibold text-[var(--text)]">{stemiDestinationText}</p>
                <p className="mt-1">Todos requieren ingreso.</p>
              </ProtocolGuideBlock>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-3">
              <ProtocolGuideBlock label="Caso" tone={nsteacsRisk === 'very-high' ? 'critical' : 'accent'}>
                <p className="font-semibold text-[var(--text)]">SCASEST</p>
                <p className="mt-1">{nsteacsRiskLabel}.</p>
              </ProtocolGuideBlock>
              <ProtocolGuideBlock label="Conducta" tone={nsteacsRisk === 'very-high' ? 'critical' : 'warning'}>
                {nsteacsConductText}
              </ProtocolGuideBlock>
              <ProtocolGuideBlock label="Destino">
                <p className="font-semibold text-[var(--text)]">{nsteacsDestinationText}</p>
                <p className="mt-1">Monitoriza ECG y troponina seriada.</p>
              </ProtocolGuideBlock>
            </div>
          )}

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <ProtocolGuideBlock label="Tiempo" tone="accent">
              {syndromeType === 'stemi'
                ? 'Si el SCACEST tiene menos de 12 h, reperfunde lo antes posible. Deseable FMC a ICP < 90 min; si no llegas en < 120 min, valora fibrinólisis.'
                : 'Muy alto riesgo: inmediata, idealmente < 2 h. Alto riesgo: < 24 h. Menor riesgo: durante el ingreso o estrategia selectiva.'}
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Advertencia" tone="warning">
              {syndromeType === 'stemi' ? protocol.warnings[0] : protocol.warnings[1]}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={() => updateFlow({ step: 5 })} className={primaryButtonClass}>
              Ir a tratamiento
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 5" title="Tratamiento inicial" note="Ordena lo imprescindible antes de perder tiempo en matices." />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Medidas generales" tone="accent">
              <div className="space-y-1.5">
                <p>Reposo, monitorización continua y vía venosa.</p>
                <p>Troponina, hemograma, bioquímica y coagulación desde el inicio.</p>
                <p>Oxígeno solo si la SpO2 es menor del 90%.</p>
              </div>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Antitrombosis">
              {antithromboticText}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
            <ProtocolGuideBlock label="Dolor / isquemia" tone="warning">
              Nitroglicerina sublingual si no hay contraindicaciones. Si el dolor sigue siendo intenso, valora perfusión IV y añade morfina.
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Después">
              {protocol.warnings[3]}
            </ProtocolGuideBlock>
          </div>

          {stemiScenario === 'fibrinolysis' ? (
            <div className="mt-4">
              <ProtocolGuideBlock label="Antes de fibrinólisis" tone="critical">
                <div className="space-y-1.5">
                  {fibrinolysisWarnings.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </ProtocolGuideBlock>
            </div>
          ) : null}

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Medicamentos</p>
            <div className="space-y-2">
              {treatmentMedicationIds.map((medicationId) => (
                <MedicationQuickRow
                  key={medicationId}
                  medication={getMedication(medicationId)}
                  onOpen={() => onMedicationOpen(medicationId)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Advertencias</p>
            <div className="space-y-2">
              {[protocol.warnings[1], protocol.warnings[2], protocol.warnings[3]].map((warning) => (
                <div key={warning} className={`${mutedPanelClass} px-4 py-3 text-sm text-[var(--text-soft)]`}>
                  {warning}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onMedicationsHub} className={subtleButtonClass}>
              Abrir medicamentos
            </button>
            <button
              type="button"
              onClick={() => {
                onScaFlowReset();
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
  <div className={pageClass}>
    <BackBar label="Inicio" onClick={onBack} />

    <PageHero title="Cálculos" />

    <DetailPanel title="Cálculos">
      <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
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
    <div className={pageClass}>
      <BackBar label="Cálculos" onClick={onBack} />

      <PageHero
        title={calculator.title}
        note={calculator.summary}
        aside={
          <span className="text-sm text-[var(--text-muted)]">
            {calculator.chapter} · p. {calculator.verifiedPage}
          </span>
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
    <div className={pageClass}>
      <BackBar label="Inicio" onClick={onBack} />

      <PageHero title="Medicamentos">
        <div className="-mx-1 mt-1 flex gap-2 overflow-x-auto px-1 pb-1">
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

      <DetailPanel title={currentGroup.title}>
        <div className="space-y-2 xl:grid xl:grid-cols-2 xl:gap-3 xl:space-y-0">
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
    <div className={pageClass}>
      <BackBar label="Medicamentos" onClick={onBack} />

      <PageHero
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
  const [scaFlowState, setScaFlowState] = useState(initialScaFlowState);

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

  const resetScaFlow = () => {
    setScaFlowState(initialScaFlowState);
  };

  const updateScaFlow = (changes) => {
    setScaFlowState((current) => ({
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

    if (module.id === 'sindrome-coronario-agudo') {
      resetScaFlow();
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

      if (protocolId === 'sindrome-coronario-agudo') {
        return (
          <SindromeCoronarioAgudoFlowView
            protocol={getProtocol(protocolId)}
            scaFlowState={scaFlowState}
            onScaFlowChange={updateScaFlow}
            onScaFlowReset={resetScaFlow}
            onMedicationOpen={(medicationId) => openMedication(medicationId, protocolReturnTo)}
            onMedicationsHub={() => openMedications(protocolReturnTo)}
            onBack={handleBack}
            onFinish={() => {
              resetScaFlow();
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
      <main className="app-main">
        <div className="app-main-inner">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
