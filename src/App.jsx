import React, { startTransition, useDeferredValue, useEffect, useState } from 'react';
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
  Search,
  ShieldAlert,
} from 'lucide-react';
import { buildReferenceHref } from './data/bibliography';
import {
  calculateCha2ds2Va,
  calculateCockcroftGault,
  calculateHasBled,
  getCalculator,
  implementedCalculators,
} from './data/calculators';
import { getMedication, medicationGroups, medicationList } from './data/medications';
import { getMotivoModule, groupModulesBySpecialty, motivoConsultaModules } from './data/modules';
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
  { key: 'protocols', label: 'Especialidades', icon: ClipboardList },
  { key: 'calculations', label: 'Cálculos', icon: Calculator },
  { key: 'medications', label: 'Fármacos', icon: Pill },
];

const initialCalculatorInputs = {
  'cha2ds2-va': {
    age: '',
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
  hypotensionOrShock: false,
  ischemia: false,
  pulmonaryEdema: false,
  syncopeOrHypoperfusion: false,
  reducedEjectionFraction: null,
  strokeRiskTier: null,
  valvularFa: null,
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

const initialArrhythmiaFlowState = {
  step: 1,
  rhythmFamily: null,
  shock: false,
  syncope: false,
  ischemia: false,
  heartFailure: false,
  tachyPattern: null,
  adenosineResponse: null,
  recentAsystole: false,
  mobitzTwo: false,
  completeBlockBroad: false,
  ventricularPause: false,
  atropineResponse: null,
};

const compactSentence = (value) => value.split('. ')[0]?.trim() ?? value;

const getCalculatorResult = (calculatorId, values) => {
  if (calculatorId === 'cha2ds2-va') {
    return calculateCha2ds2Va(values);
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
    return 'Especialidades';
  }

  if (route.view === 'calculations') {
    return 'Cálculos';
  }

  if (route.view === 'medications') {
    return 'Medicamentos';
  }

  return 'Inicio clínico';
};

const uniqueByKey = (items, keyBuilder) => Array.from(new Map(items.map((item) => [keyBuilder(item), item])).values());
const normalizeSearch = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const matchesSearch = (needle, ...parts) => parts.some((part) => normalizeSearch(part).includes(needle));

const getModulePrimaryReferences = (moduleId) => {
  const protocol = getProtocol(moduleId);
  const entries = protocol?.bibliography ?? getMotivoModule(moduleId).bibliography ?? [];

  if (moduleId === 'taquiarritmias-bradicardias') {
    return entries.slice(0, 3);
  }

  return entries.slice(0, 1);
};

const buildSpecialtyCollections = () =>
  groupModulesBySpecialty(motivoConsultaModules).map((group) => {
    const implementedModules = group.modules.filter((module) => module.implemented);
    const moduleIds = new Set(implementedModules.map((module) => module.id));
    const calculators = implementedCalculators
      .filter((calculator) => moduleIds.has(calculator.moduleId))
      .sort((left, right) => left.title.localeCompare(right.title, 'es'));
    const medications = uniqueByKey(
      medicationList
        .filter((medication) => medication.protocolId && moduleIds.has(medication.protocolId))
        .sort((left, right) => left.name.localeCompare(right.name, 'es')),
      (medication) => medication.id,
    );
    const bibliography = uniqueByKey(
      implementedModules.flatMap((module) =>
        getModulePrimaryReferences(module.id).map((entry) => ({
          ...entry,
          moduleTitle: module.title,
        })),
      ),
      (entry) => `${entry.moduleTitle}:${entry.internalId}`,
    );

    return {
      ...group,
      protocols: group.modules,
      calculators,
      medications,
      bibliography,
    };
  });

const filterSpecialtyCollections = (groups, query) => {
  const needle = normalizeSearch(query);

  if (!needle) {
    return groups;
  }

  return groups
    .map((group) => {
      const specialtyMatches = matchesSearch(needle, group.title, group.note);

      if (specialtyMatches) {
        return group;
      }

      const protocols = group.protocols.filter((module) => matchesSearch(needle, module.title, module.summary, module.section));
      const calculators = group.calculators.filter((calculator) => matchesSearch(needle, calculator.title, calculator.summary, calculator.block));
      const medications = group.medications.filter((medication) =>
        matchesSearch(needle, medication.name, medication.family, medication.contextUse ?? medication.indication),
      );
      const bibliography = group.bibliography.filter((entry) =>
        matchesSearch(needle, entry.moduleTitle, entry.shortReference, entry.note),
      );

      return {
        ...group,
        protocols,
        calculators,
        medications,
        bibliography,
      };
    })
    .filter((group) => group.protocols.length > 0 || group.calculators.length > 0 || group.medications.length > 0 || group.bibliography.length > 0);
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
  <section className={`${shellCardClass} overflow-hidden p-5 sm:p-6`}>
    <div className="flex flex-col gap-3 sm:gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2.5 text-[1.68rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:mt-3 sm:text-[2.05rem] xl:text-[2.3rem]">
          {title}
        </h1>
        {note ? <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[var(--text-soft)]">{note}</p> : null}
      </div>
      {aside}
    </div>
    {children ? <div className="mt-4 sm:mt-5">{children}</div> : null}
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

const ListActionRow = ({ title, meta, onClick, badge = null, disabled = false }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`${listRowClass} ${disabled ? 'cursor-default opacity-70' : ''}`}
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold text-[var(--text)]">{title}</p>
        {badge}
      </div>
      {meta ? <p className="mt-1 text-xs text-[var(--text-muted)]">{meta}</p> : null}
    </div>
    <ChevronRight
      className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
        disabled ? '' : 'group-hover:translate-x-0.5'
      }`}
    />
  </button>
);

const ProtocolSpecialtyList = ({ groups, onModuleOpen }) => (
  <div className="space-y-4">
    {groups.map((group) => (
      <div key={group.id}>
        <div className="mb-2">
          <p className="eyebrow eyebrow-muted">{group.title}</p>
          {group.note ? <p className="mt-1 text-xs text-[var(--text-muted)]">{group.note}</p> : null}
        </div>
        <div className="space-y-2">
          {group.modules.map((module) => (
            <ListActionRow
              key={module.id}
              title={module.title}
              meta={module.summary}
              badge={!module.implemented ? <StatusBadge tone="pending">Pendiente</StatusBadge> : null}
              disabled={!module.implemented}
              onClick={() => onModuleOpen(module.id)}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const SpecialtySectionRows = ({ title, children }) => (
  <section>
    <p className="eyebrow eyebrow-muted mb-2">{title}</p>
    <div className="space-y-2">{children}</div>
  </section>
);

const SpecialtyReferenceRow = ({ entry }) => (
  <a href={entry.href} target="_blank" rel="noreferrer" className="list-row">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--text)]">{entry.moduleTitle}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {entry.shortReference}
        {entry.note ? ` · ${entry.note}` : ''}
      </p>
    </div>
    <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
  </a>
);

const SearchField = ({ value, onChange, placeholder }) => (
  <label className={`${mutedPanelClass} flex items-center gap-3 px-4 py-3.5`}>
    <span className="icon-well h-10 w-10 rounded-[0.95rem] bg-[rgba(191,146,69,0.12)] text-[var(--accent-500)]">
      <Search className="h-4 w-4" />
    </span>
    <div className="min-w-0 flex-1">
      <p className="eyebrow eyebrow-muted">Buscar</p>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-transparent text-sm font-medium text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
      />
    </div>
  </label>
);

const EmptySearchState = ({ query }) => (
  <div className={`${panelClass} p-5 sm:p-6`}>
    <p className="eyebrow eyebrow-muted">Sin coincidencias</p>
    <p className="mt-2 text-sm font-semibold text-[var(--text)]">{query}</p>
    <p className="mt-1 text-sm text-[var(--text-soft)]">Prueba con otra especialidad, protocolo, cálculo o fármaco.</p>
  </div>
);

const SpecialtyAccordionList = ({ groups, onModuleOpen, onCalculatorOpen, onMedicationOpen, forceOpen = false }) => (
  <div className="space-y-3">
    {groups.map((group) => (
      <details
        key={group.id}
        className="group overflow-hidden rounded-[1.55rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.78)] shadow-[0_24px_48px_-38px_rgba(64,49,22,0.2)]"
        {...(forceOpen || group.id === 'cardiologia' ? { open: true } : {})}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-4.5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-muted">Especialidad</p>
            <p className="mt-1 text-[1.02rem] font-semibold tracking-[-0.03em] text-[var(--text)]">{group.title}</p>
            {group.note ? <p className="mt-1 max-w-2xl text-sm text-[var(--text-soft)]">{group.note}</p> : null}
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-90" />
        </summary>

        <div className="border-t border-[color:var(--line)] bg-[rgba(252,249,244,0.5)] px-4 py-4 sm:px-5">
          <div className="space-y-4">
            <SpecialtySectionRows title="Protocolos">
              {group.protocols.map((module) => (
                <ListActionRow
                  key={module.id}
                  title={module.title}
                  meta={module.summary}
                  badge={!module.implemented ? <StatusBadge tone="pending">Pendiente</StatusBadge> : null}
                  disabled={!module.implemented}
                  onClick={() => onModuleOpen(module.id)}
                />
              ))}
            </SpecialtySectionRows>

            {group.calculators.length > 0 ? (
              <SpecialtySectionRows title="Cálculos relacionados">
                {group.calculators.map((calculator) => (
                  <ListActionRow
                    key={calculator.id}
                    title={calculator.title}
                    meta={calculator.summary}
                    onClick={() => onCalculatorOpen(calculator.id)}
                  />
                ))}
              </SpecialtySectionRows>
            ) : null}

            {group.medications.length > 0 ? (
              <SpecialtySectionRows title="Medicamentos relacionados">
                {group.medications.map((medication) => {
                  const protocolLabel = medication.protocolId ? getProtocol(medication.protocolId)?.title ?? 'Protocolo' : 'Protocolo';
                  return (
                    <ListActionRow
                      key={medication.id}
                      title={medication.name}
                      meta={`${protocolLabel} · ${medication.family}`}
                      onClick={() => onMedicationOpen(medication.id)}
                    />
                  );
                })}
              </SpecialtySectionRows>
            ) : null}

            {group.bibliography.length > 0 ? (
              <SpecialtySectionRows title="Fuentes principales">
                {group.bibliography.map((entry) => (
                  <SpecialtyReferenceRow key={`${entry.moduleTitle}:${entry.internalId}`} entry={entry} />
                ))}
              </SpecialtySectionRows>
            ) : null}
          </div>
        </div>
      </details>
    ))}
  </div>
);

const QuickAccessCard = ({ icon: Icon, title, meta, onClick, tone = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex items-start gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 ${
      tone === 'accent'
        ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.9)] shadow-[0_24px_48px_-34px_rgba(171,126,48,0.3)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.88)] shadow-[0_18px_42px_-30px_rgba(64,49,22,0.16)] hover:border-[rgba(191,146,69,0.24)]'
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
      <p className="mt-1 text-xs text-[var(--text-muted)]">{compactSentence(medication.contextUse ?? medication.indication)}</p>
      <p className="mt-1 text-xs text-[var(--text-soft)]">{compactSentence(medication.contextDose ?? medication.dose)}</p>
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
      if (source.url) {
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

      {calculatorId === 'cha2ds2-va' ? (
        <div className="space-y-3">
          <div className="grid gap-3">
            <NumberField value={values.age} label="Edad" placeholder="Ej. 78" onChange={(value) => onChange('age', value)} />
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

const DisclosureBlock = ({ title, summary, children, tone = 'neutral', defaultOpen = false }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.92)]'
      : tone === 'warning'
        ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(248,241,223,0.94)]'
        : tone === 'accent'
          ? 'border-[rgba(191,146,69,0.24)] bg-[rgba(247,241,226,0.9)]'
          : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.88)]';

  return (
    <details className={`group rounded-[1.15rem] border ${toneClass}`} {...(defaultOpen ? { open: true } : {})}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="eyebrow eyebrow-muted">{title}</p>
          {summary ? <p className="mt-1 text-sm text-[var(--text-soft)]">{summary}</p> : null}
        </div>
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <div className="border-t border-[color:var(--line)] px-4 py-3 text-sm leading-relaxed text-[var(--text-soft)]">{children}</div>
    </details>
  );
};

const ProtocolFocusStrip = ({ current, decision, next }) => (
  <>
    <div className="mt-3 md:hidden">
      <div className={`${mutedPanelClass} px-3.5 py-3`}>
        <p className="eyebrow eyebrow-muted">Qué valoras</p>
        <p className="mt-1 text-sm font-semibold text-[var(--text)]">{current}</p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-soft)]">{decision}</p>
      </div>
    </div>

    <div className="mt-4 hidden gap-2.5 md:grid md:grid-cols-3 lg:gap-3">
      <ProtocolGuideBlock label="Qué valoras">
        <p className="font-semibold text-[var(--text)]">{current}</p>
      </ProtocolGuideBlock>
      <ProtocolGuideBlock label="Qué decide" tone="accent">
        <p className="font-semibold text-[var(--text)]">{decision}</p>
      </ProtocolGuideBlock>
      <ProtocolGuideBlock label="Qué sigue">
        <p className="font-semibold text-[var(--text)]">{next}</p>
      </ProtocolGuideBlock>
    </div>
  </>
);

const getFaFlowFocus = ({ step, stability, duration }) => {
  if (step === 1) {
    return {
      current: 'Posible FA rápida',
      decision: '¿Hay shock, isquemia, edema agudo o hipoperfusión?',
      next: 'Si no, define inicio del episodio y FEVI.',
    };
  }

  if (step === 2 && stability === 'stable') {
    return {
      current: 'Datos que cambian la conducta',
      decision: 'Inicio < 24 h o ≥ 24 h / desconocido y FEVI > 40% o ≤ 40%.',
      next: 'Después, frecuencia primero.',
    };
  }

  if (step === 2 && stability === 'unstable') {
    return {
      current: 'FA inestable',
      decision: 'Cardioversión eléctrica sincronizada ahora.',
      next: 'Después, anticoagulación y reevaluación.',
    };
  }

  if (step === 3) {
    return {
      current: duration === 'lt24' ? 'FA estable < 24 h' : 'FA estable ≥ 24 h o desconocida',
      decision: 'Control de frecuencia primero. Ritmo solo si sigue indicado.',
      next: 'Después, decide anticoagulación.',
    };
  }

  return {
    current: 'Anticoagulación',
    decision: 'CHA2DS2-VA, riesgo hemorrágico y FA valvular o no valvular.',
    next: 'Si hace falta, abre cálculo o fármaco.',
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

const getArrhythmiaFlowFocus = ({ step, rhythmFamily, tachyPattern }) => {
  if (step === 1) {
    return {
      current: 'Arritmia aguda',
      decision: '¿Es una taquicardia o una bradicardia?',
      next: 'Después, busca inestabilidad.',
    };
  }

  if (step === 2) {
    return {
      current: rhythmFamily === 'bradycardia' ? 'Bradicardia' : 'Taquicardia',
      decision: '¿Hay shock, síncope, isquemia o insuficiencia cardíaca?',
      next: 'Si está estable, clasifica mejor el ritmo.',
    };
  }

  if (step === 3 && rhythmFamily === 'tachycardia') {
    return {
      current: 'Taquicardia estable',
      decision: '¿QRS estrecho regular, estrecho irregular o ancho?',
      next: 'La conducta cambia según esa rama.',
    };
  }

  if (step === 3 && rhythmFamily === 'bradycardia') {
    return {
      current: 'Bradicardia sin datos de inestabilidad',
      decision: '¿Hay riesgo de asistolia o bloqueo de alto grado?',
      next: 'Si lo hay, acelera la vía de estimulación.',
    };
  }

  if (rhythmFamily === 'bradycardia') {
    return {
      current: 'Conducta en bradicardia',
      decision: 'Atropina si hay síntomas; pacing si no responde o hay alto riesgo.',
      next: 'Después, deja resuelta la causa y la vía de estimulación.',
    };
  }

  const tachyLabel =
    tachyPattern === 'narrow-regular'
      ? 'QRS estrecho regular'
      : tachyPattern === 'narrow-irregular'
        ? 'QRS estrecho irregular'
        : tachyPattern === 'wide-regular'
          ? 'QRS ancho regular'
          : tachyPattern === 'wide-irregular'
            ? 'QRS ancho irregular'
            : 'Taquicardia';

  return {
    current: tachyLabel,
    decision:
      tachyPattern === 'narrow-regular'
        ? 'Vagales y adenosina primero.'
        : tachyPattern === 'narrow-irregular'
          ? 'Piensa en FA/flutter y evita perder tiempo en ramas que no cambian la conducta.'
          : tachyPattern === 'wide-irregular'
            ? 'Si dudas, evita bloqueadores nodales y trata el contexto de mayor riesgo.'
            : 'Si no estás seguro, trata como TV.',
    next: 'Abre el procedimiento o el fármaco solo si hace falta.',
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
  <section className={`${shellCardClass} p-4 sm:p-6`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={onBack} className={ghostButtonClass}>
        <ArrowLeft className="h-4 w-4" />
        Volver
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
        <h1 className="mt-2 text-[1.38rem] font-semibold tracking-[-0.05em] text-[var(--text)] sm:mt-3 sm:text-[1.82rem] xl:text-[2.1rem]">
          {title}
        </h1>
      </div>
      <div className={`${mutedPanelClass} w-full min-w-0 px-4 py-3 sm:min-w-[210px] sm:px-4 sm:py-4 xl:max-w-[240px]`}>
        <p className="eyebrow eyebrow-muted">Paso {step} de {totalSteps}</p>
        <div className="mt-3 h-2 rounded-full bg-[rgba(111,104,93,0.08)]">
          <div className="progress-fill h-full rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>
    </div>

    <ProtocolFocusStrip current={current} decision={decision} next={next} />

    <div className="mt-4 hidden gap-2 overflow-x-auto pb-1 md:mt-5 md:flex md:flex-wrap">
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
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const specialtyCollections = filterSpecialtyCollections(buildSpecialtyCollections(), deferredSearchQuery);
  const featuredCalculators = implementedCalculators.slice(0, 3);
  const featuredMedications = ['adenosina', 'atropina', 'apixaban'];
  const hasSearchResults = specialtyCollections.length > 0;

  return (
    <div className={widePageClass}>
      <PageHero eyebrow="Biblioteca clínica" title="Inicio clínico">
        <div className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr]">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Módulo o fármaco"
          />
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={onProtocolsOpen} className={primaryButtonClass}>
              <ClipboardList className="h-4 w-4" />
              Especialidades
            </button>
            <button type="button" onClick={() => onModuleOpen('taquiarritmias-bradicardias')} className={subtleButtonClass}>
              <HeartPulse className="h-4 w-4" />
              Arritmias
            </button>
            <button type="button" onClick={() => onModuleOpen('sindrome-coronario-agudo')} className={subtleButtonClass}>
              <HeartPulse className="h-4 w-4" />
              IAM / SCA
            </button>
            <button type="button" onClick={() => onModuleOpen('fibrilacion-auricular')} className={subtleButtonClass}>
              <Activity className="h-4 w-4" />
              FA
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
        </div>
      </PageHero>

      <section className="grid gap-4 lg:grid-cols-[0.98fr_1.02fr] xl:gap-5">
        <DetailPanel title="Guardia rápida">
          <div className="grid gap-2.5 sm:grid-cols-2 xl:gap-3">
            <QuickAccessCard
              icon={HeartPulse}
              title="Taquiarritmias y bradicardias"
              meta="Taquicardia o bradicardia, inestabilidad y conducta inmediata."
              onClick={() => onModuleOpen('taquiarritmias-bradicardias')}
              tone="accent"
            />
            <QuickAccessCard
              icon={HeartPulse}
              title="Síndrome coronario agudo"
              meta="ECG, reperfusión y antitrombosis."
              onClick={() => onModuleOpen('sindrome-coronario-agudo')}
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
              title="CHA2DS2-VA"
              meta="Riesgo tromboembólico."
              onClick={() => onCalculatorOpen('cha2ds2-va')}
            />
          </div>
        </DetailPanel>

        <DetailPanel title="Especialidades">
          {hasSearchResults ? (
            <SpecialtyAccordionList
              groups={specialtyCollections}
              onModuleOpen={onModuleOpen}
              onCalculatorOpen={onCalculatorOpen}
              onMedicationOpen={onMedicationOpen}
              forceOpen={Boolean(normalizeSearch(deferredSearchQuery))}
            />
          ) : (
            <EmptySearchState query={deferredSearchQuery} />
          )}
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

const ProtocolsView = ({ onBack, onModuleOpen, onCalculatorOpen, onMedicationOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const specialtyCollections = filterSpecialtyCollections(buildSpecialtyCollections(), deferredSearchQuery);

  return (
    <div className={pageClass}>
      <BackBar label="Inicio" onClick={onBack} />

      <PageHero title="Especialidades">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filtrar contenido"
        />
      </PageHero>

      {specialtyCollections.length > 0 ? (
        <SpecialtyAccordionList
          groups={specialtyCollections}
          onModuleOpen={onModuleOpen}
          onCalculatorOpen={onCalculatorOpen}
          onMedicationOpen={onMedicationOpen}
          forceOpen={Boolean(normalizeSearch(deferredSearchQuery))}
        />
      ) : (
        <EmptySearchState query={deferredSearchQuery} />
      )}
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
  const referenceHref = protocol.bibliography[0]?.href ?? buildReferenceHref('esc-fa-2024');
  const {
    step,
    stability,
    duration,
    hypotensionOrShock,
    ischemia,
    pulmonaryEdema,
    syncopeOrHypoperfusion,
    reducedEjectionFraction,
    strokeRiskTier,
    valvularFa,
  } = faFlowState;
  const controlMedicationIds = reducedEjectionFraction ? ['metoprolol', 'digoxina', 'amiodarona'] : ['metoprolol', 'verapamilo', 'digoxina'];
  const preventionMedicationIds = ['apixaban', 'acenocumarol'];
  const quickCalculationIds = ['cha2ds2-va', 'has-bled', 'cockcroft-gault'];
  const flowFocus = getFaFlowFocus({ step, stability, duration });
  const isUnstable = hypotensionOrShock || ischemia || pulmonaryEdema || syncopeOrHypoperfusion;
  const timingLabel = duration === 'lt24' ? '< 24 h' : '≥ 24 h o desconocida';
  const ventricularFunctionLabel = reducedEjectionFraction ? 'FEVI ≤ 40% / insuficiencia cardiaca sistólica' : 'FEVI > 40% o sin HFrEF conocida';
  const rateControlText = reducedEjectionFraction
    ? 'FEVI ≤ 40% → betabloqueante IV si tolera la hemodinámica y/o digoxina IV. Amiodarona IV solo si no basta o la situación lo exige.'
    : 'FEVI > 40% → betabloqueante IV o verapamilo IV. Digoxina si no basta o no conviene otro frenador nodal.';
  const cardioversionText =
    duration === 'lt24'
      ? 'Si sigue sintomático o necesitas reversión rápida, puedes pasar a control del ritmo.'
      : 'No cardiovertir pronto sin 3 semanas de anticoagulación terapéutica o ETE.';
  const anticoagulationLabel =
    valvularFa === true
      ? 'FA valvular → anticoagula con AVK; CHA2DS2-VA no cambia el tipo.'
      : strokeRiskTier === 'zero'
        ? 'CHA2DS2-VA 0 → no anticoagular por este score si no hay otro motivo.'
        : strokeRiskTier === 'one'
          ? 'CHA2DS2-VA 1 → considera anticoagulación; si no es valvular, ACOD preferido.'
          : strokeRiskTier === 'two-plus'
            ? 'CHA2DS2-VA ≥ 2 → anticoagula; si no es valvular, ACOD preferido.'
            : 'Primero define CHA2DS2-VA y si es FA valvular o no valvular.';

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
        steps={['Estabilidad', 'Contexto', 'Conducta', 'Anticoagulación']}
        current={flowFocus.current}
        decision={flowFocus.decision}
        next={flowFocus.next}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 1" title="Pide inestabilidad" note="Marca solo lo que cambia la conducta ahora." />

          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={hypotensionOrShock} label="TAS < 90 / shock" onChange={(value) => updateFlow({ hypotensionOrShock: value })} />
            <BooleanField checked={ischemia} label="Isquemia o dolor torácico grave" onChange={(value) => updateFlow({ ischemia: value })} />
            <BooleanField checked={pulmonaryEdema} label="Edema agudo de pulmón / IC aguda" onChange={(value) => updateFlow({ pulmonaryEdema: value })} />
            <BooleanField
              checked={syncopeOrHypoperfusion}
              label="Síncope o hipoperfusión"
              onChange={(value) => updateFlow({ syncopeOrHypoperfusion: value })}
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Si marcas alguno" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Trata como inestable.</p>
              <p className="mt-1">Cardioversión sincronizada inmediata.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si no marcas ninguno">
              <p className="font-semibold text-[var(--text)]">Sigue como estable.</p>
              <p className="mt-1">Pide inicio del episodio y FEVI.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge tone={isUnstable ? 'critical' : 'active'}>{isUnstable ? 'Inestable' : 'Sin criterios de inestabilidad'}</StatusBadge>
            <button
              type="button"
              onClick={() =>
                updateFlow({
                  step: 2,
                  stability: isUnstable ? 'unstable' : 'stable',
                  duration: null,
                  reducedEjectionFraction: null,
                  strokeRiskTier: null,
                  valvularFa: null,
                })
              }
              className={primaryButtonClass}
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onFaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 && stability === 'stable' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 2" title="Pide los datos que cambian la rama" />

          <div className="space-y-6">
            <div>
              <p className="eyebrow eyebrow-muted mb-3">Inicio del episodio actual</p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton label="< 24 horas" active={duration === 'lt24'} onClick={() => updateFlow({ duration: 'lt24' })} />
                <FlowSelectButton
                  label="≥ 24 h o desconocido"
                  active={duration === 'gte24'}
                  onClick={() => updateFlow({ duration: 'gte24' })}
                />
              </div>
            </div>

            <div>
              <p className="eyebrow eyebrow-muted mb-3">FEVI ≤ 40% / insuficiencia cardiaca sistólica</p>
              <div className="grid grid-cols-2 gap-3">
                <FlowSelectButton label="Sí" active={reducedEjectionFraction === true} onClick={() => updateFlow({ reducedEjectionFraction: true })} />
                <FlowSelectButton
                  label="No / desconocido"
                  active={reducedEjectionFraction === false}
                  onClick={() => updateFlow({ reducedEjectionFraction: false })}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => updateFlow({ step: 1 })} className={subtleButtonClass}>
                Volver
              </button>
              <button
                type="button"
                disabled={!duration || reducedEjectionFraction === null}
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
          <SectionTitle eyebrow="Paso 2" title="Inestable → cardiovertir" />

          <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <ProtocolGuideBlock label="Haz ahora" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Cardioversión eléctrica sincronizada inmediata.</p>
              <p className="mt-1">No retrasarla para seguir clasificando la FA.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Después">
              <p className="font-semibold text-[var(--text)]">Revisar anticoagulación y plan de continuación.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock
              title="Cómo hacerlo"
              summary="Lo esencial del procedimiento sin salir del flujo."
              tone="critical"
              defaultOpen
            >
              <div className="space-y-2">
                <p>Activa modo sincronizado y confirma marcas sobre cada QRS.</p>
                <p>Si está consciente, analgesia y sedación antes de descargar si la situación lo permite.</p>
                <p>En FA, usa la energía bifásica máxima del desfibrilador desde el primer choque.</p>
                <p>Si no revierte, recoloca parches, optimiza contacto, corrige causas reversibles y repite según el equipo.</p>
                <p>Si sospechas intoxicación digitálica, extrema precaución antes de cardiovertir.</p>
              </div>
            </DisclosureBlock>

            <DisclosureBlock title="Anticoagulación después" summary="Qué no olvidar cuando ya lo has estabilizado.">
              Verifica cuanto antes la situación de anticoagulación y deja definido el plan de continuación tras la estabilización y la cardioversión.
            </DisclosureBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={onFaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Ir a anticoagulación
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && stability === 'stable' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Conducta y tratamiento" />

          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="active">{timingLabel}</StatusBadge>
            <StatusBadge tone={reducedEjectionFraction ? 'critical' : 'pending'}>{ventricularFunctionLabel}</StatusBadge>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Haz ahora" tone="accent">
              <p className="font-semibold text-[var(--text)]">{rateControlText}</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Ritmo" tone={duration === 'lt24' ? 'accent' : 'warning'}>
              <p className="font-semibold text-[var(--text)]">{cardioversionText}</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock
              title="Pautas útiles ahora"
              summary={reducedEjectionFraction ? 'FEVI ≤ 40% → prioriza IV compatible con HFrEF.' : 'FEVI > 40% → prioriza control de frecuencia IV.'}
              defaultOpen
            >
              <div className="space-y-2">
                {controlMedicationIds.map((medicationId) => (
                  <MedicationQuickRow
                    key={medicationId}
                    medication={getMedication(medicationId)}
                    onOpen={() => onMedicationOpen(medicationId)}
                  />
                ))}
              </div>
            </DisclosureBlock>

            <DisclosureBlock
              title="Cómo cardiovertir si eliges ritmo"
              summary={duration === 'lt24' ? 'Útil si sigue sintomático o necesitas reversión rápida.' : 'Solo si completas anticoagulación o haces ETE.'}
              tone={duration === 'lt24' ? 'accent' : 'warning'}
            >
              <div className="space-y-2">
                <p>Primero controla frecuencia y confirma que la estrategia de ritmo sigue mereciendo la pena.</p>
                {duration === 'lt24' ? (
                  <>
                    <p>La cardioversión eléctrica sincronizada es la opción más rápida si necesitas reversión inmediata.</p>
                    <p>Si eliges fármaco, la amiodarona IV queda como opción cuando hay HFrEF, cardiopatía estructural relevante o no hay alternativa mejor.</p>
                  </>
                ) : (
                  <>
                    <p>Si el episodio dura ≥ 24 h o es desconocido, no cardiovertir pronto sin 3 semanas de anticoagulación terapéutica o ETE.</p>
                    <p>Si finalmente cardiovertiste, mantén anticoagulación 4 semanas salvo escenarios muy seleccionados de muy bajo riesgo.</p>
                  </>
                )}
              </div>
            </DisclosureBlock>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <ProtocolGuideBlock label="Después">
              Decide anticoagulación cuando hayas resuelto la conducta inmediata.
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="No olvides" tone="warning">
              {protocol.warnings[0]}
            </ProtocolGuideBlock>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              <Calculator className="h-4 w-4" />
              Ir a anticoagulación
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Anticoagulación si cambia conducta" />

          <div className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
            <ProtocolGuideBlock label="Dato que cambia la conducta" tone="accent">
              <p className="font-semibold text-[var(--text)]">Calcula CHA2DS2-VA cuando ya has resuelto la conducta inmediata.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Sangrado" tone="warning">
              {protocol.warnings[3]}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-3">Resultado de CHA2DS2-VA</p>
            <div className="grid grid-cols-3 gap-3">
              <FlowSelectButton label="0" active={strokeRiskTier === 'zero'} onClick={() => updateFlow({ strokeRiskTier: 'zero' })} />
              <FlowSelectButton label="1" active={strokeRiskTier === 'one'} onClick={() => updateFlow({ strokeRiskTier: 'one' })} />
              <FlowSelectButton
                label="≥ 2"
                active={strokeRiskTier === 'two-plus'}
                onClick={() => updateFlow({ strokeRiskTier: 'two-plus' })}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-3">¿Prótesis mecánica o estenosis mitral moderada/grave?</p>
            <div className="grid grid-cols-2 gap-3">
              <FlowSelectButton label="Sí" active={valvularFa === true} onClick={() => updateFlow({ valvularFa: true })} />
              <FlowSelectButton label="No" active={valvularFa === false} onClick={() => updateFlow({ valvularFa: false })} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <ProtocolGuideBlock label="Elección">
              <p className="font-semibold text-[var(--text)]">{anticoagulationLabel}</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Cardioversión y continuación">
              Si se cardioverte, mantener anticoagulación 4 semanas salvo situaciones muy seleccionadas con inicio &lt; 24 h y riesgo muy bajo.
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4">
            <p className="eyebrow eyebrow-muted mb-2">Cálculos cuando cambian la decisión</p>
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
              {(valvularFa === true ? ['acenocumarol'] : preventionMedicationIds).map((medicationId) => (
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
              {protocol.warnings.slice(0, 3).concat(protocol.warnings.slice(4)).map((warning) => (
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
          <SectionTitle eyebrow="Paso 1" title="Pide PAS y PAD" />

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
          <SectionTitle eyebrow="Paso 2" title="¿Hay daño de órgano diana?" />

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
          <SectionTitle eyebrow="Paso 3" title="Clasifica" />

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
            title={classification === 'emergencia' ? 'Trata la emergencia' : 'Trata la urgencia'}
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
          <SectionTitle eyebrow="Paso 1" title="Pide ECG y datos críticos" note="ECG de 12 derivaciones en los primeros 10 min." />

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
          <SectionTitle eyebrow="Paso 2" title="¿SCACEST o SCASEST?" note="El ECG manda; la hs-cTn ordena la rama sin elevación del ST." />

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
          <SectionTitle eyebrow="Paso 3" title="Elige reperfusión" />

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
          <SectionTitle eyebrow="Paso 3" title="Define el riesgo" />

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
          <SectionTitle eyebrow="Paso 4" title="Qué haces ahora" />

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
          <SectionTitle eyebrow="Paso 5" title="Qué tratamiento pones" />

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

const TaquiarritmiasBradicardiasFlowView = ({
  protocol,
  arrhythmiaFlowState,
  onArrhythmiaFlowChange,
  onArrhythmiaFlowReset,
  onModuleOpen,
  onMedicationOpen,
  onBack,
}) => {
  const {
    step,
    rhythmFamily,
    shock,
    syncope,
    ischemia,
    heartFailure,
    tachyPattern,
    adenosineResponse,
    recentAsystole,
    mobitzTwo,
    completeBlockBroad,
    ventricularPause,
    atropineResponse,
  } = arrhythmiaFlowState;
  const isUnstable = shock || syncope || ischemia || heartFailure;
  const hasAsystoleRisk = recentAsystole || mobitzTwo || completeBlockBroad || ventricularPause;
  const flowFocus = getArrhythmiaFlowFocus({ step, rhythmFamily, tachyPattern });
  const referenceHref =
    rhythmFamily === 'bradycardia'
      ? buildReferenceHref('esc-bradicardias-2021')
      : tachyPattern === 'wide-regular' || tachyPattern === 'wide-irregular'
        ? buildReferenceHref('esc-arritmias-ventriculares-2022')
        : buildReferenceHref('esc-tsv-2019');

  const updateFlow = (changes) => {
    onArrhythmiaFlowChange(changes);
  };

  const resetForNextBranch = () =>
    updateFlow({
      tachyPattern: null,
      adenosineResponse: null,
      recentAsystole: false,
      mobitzTwo: false,
      completeBlockBroad: false,
      ventricularPause: false,
      atropineResponse: null,
    });

  return (
    <div className={pageClass}>
      <FlowHeader
        eyebrow="Arritmias agudas"
        title={protocol.longTitle ?? protocol.title}
        step={step}
        totalSteps={4}
        steps={['Ritmo', 'Riesgo', 'Clasificación', 'Conducta']}
        current={flowFocus.current}
        decision={flowFocus.decision}
        next={flowFocus.next}
        onBack={onBack}
        onOpenSource={referenceHref ? () => openPdf(referenceHref) : null}
      />

      {step === 1 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 1" title="¿Taquicardia o bradicardia?" />

          <div className="grid gap-4 lg:grid-cols-2">
            <FlowChoiceCard
              icon={HeartPulse}
              title="Taquicardia"
              note="Frecuencia rápida con pulso. Decide primero si hay inestabilidad."
              tone="critical"
              onClick={() => updateFlow({ rhythmFamily: 'tachycardia', step: 2 })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="Bradicardia"
              note="Frecuencia lenta. Decide si está causando síntomas o riesgo inmediato."
              onClick={() => updateFlow({ rhythmFamily: 'bradycardia', step: 2 })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-right-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle
            eyebrow="Paso 2"
            title={rhythmFamily === 'bradycardia' ? '¿Hay repercusión?' : '¿Hay inestabilidad?'}
            note="Marca solo lo que cambia la conducta ahora."
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={shock} label="Shock / hipotensión relevante" onChange={(value) => updateFlow({ shock: value })} />
            <BooleanField checked={syncope} label="Síncope o presíncope grave" onChange={(value) => updateFlow({ syncope: value })} />
            <BooleanField checked={ischemia} label="Isquemia / dolor torácico" onChange={(value) => updateFlow({ ischemia: value })} />
            <BooleanField checked={heartFailure} label="Insuficiencia cardíaca / edema agudo" onChange={(value) => updateFlow({ heartFailure: value })} />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Si marcas alguno" tone="critical">
              {rhythmFamily === 'bradycardia'
                ? 'Trátalo como bradicardia con repercusión: atropina y pacing si no responde.'
                : 'Trátalo como taquicardia inestable: cardioversión sincronizada inmediata.'}
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si no marcas ninguno">
              {rhythmFamily === 'bradycardia'
                ? 'Sigue con riesgo de asistolia o causas reversibles.'
                : 'Sigue con el patrón del ECG para decidir la siguiente rama.'}
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge tone={isUnstable ? 'critical' : 'active'}>
              {isUnstable ? 'Con repercusión / inestable' : 'Sin datos de inestabilidad'}
            </StatusBadge>
            <button
              type="button"
              onClick={() => {
                resetForNextBranch();
                updateFlow({ step: isUnstable ? 4 : 3 });
              }}
              className={primaryButtonClass}
            >
              Continuar
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                updateFlow({
                  step: 1,
                  rhythmFamily: null,
                  shock: false,
                  syncope: false,
                  ischemia: false,
                  heartFailure: false,
                })
              }
              className={subtleButtonClass}
            >
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && rhythmFamily === 'tachycardia' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="Clasifica por QRS y ritmo" />

          <div className="grid gap-3 lg:grid-cols-2">
            <FlowChoiceCard
              icon={Activity}
              title="QRS estrecho regular"
              note="TSV reentrante hasta que no se demuestre lo contrario."
              onClick={() => updateFlow({ tachyPattern: 'narrow-regular' })}
            />
            <FlowChoiceCard
              icon={Activity}
              title="QRS estrecho irregular"
              note="Piensa antes en FA / flutter con conducción variable."
              onClick={() => updateFlow({ tachyPattern: 'narrow-irregular' })}
            />
            <FlowChoiceCard
              icon={ShieldAlert}
              title="QRS ancho regular"
              note="Si dudas, manéjalo como TV."
              tone="critical"
              onClick={() => updateFlow({ tachyPattern: 'wide-regular' })}
            />
            <FlowChoiceCard
              icon={ShieldAlert}
              title="QRS ancho irregular"
              note="Piensa en FA preexcitada o TV polimórfica."
              tone="critical"
              onClick={() => updateFlow({ tachyPattern: 'wide-irregular' })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
            <button
              type="button"
              disabled={!tachyPattern}
              onClick={() => updateFlow({ step: 4 })}
              className={primaryButtonClass}
            >
              Ver conducta
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 && rhythmFamily === 'bradycardia' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 3" title="¿Hay riesgo de asistolia?" note="Pídelo solo si sigue estable." />

          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={recentAsystole} label="Asistolia reciente" onChange={(value) => updateFlow({ recentAsystole: value })} />
            <BooleanField checked={mobitzTwo} label="Bloqueo AV Mobitz II" onChange={(value) => updateFlow({ mobitzTwo: value })} />
            <BooleanField
              checked={completeBlockBroad}
              label="Bloqueo AV completo con QRS ancho"
              onChange={(value) => updateFlow({ completeBlockBroad: value })}
            />
            <BooleanField checked={ventricularPause} label="Pausa ventricular > 3 s" onChange={(value) => updateFlow({ ventricularPause: value })} />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Si marcas alguno" tone="warning">
              Ayuda experta, monitorización estrecha y deja preparada la vía de estimulación.
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si no marcas ninguno">Observa, identifica causas y no trates por inercia.</ProtocolGuideBlock>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge tone={hasAsystoleRisk ? 'critical' : 'active'}>{hasAsystoleRisk ? 'Riesgo de asistolia' : 'Sin alto riesgo inmediato'}</StatusBadge>
            <button type="button" onClick={() => updateFlow({ step: 4 })} className={primaryButtonClass}>
              Ver conducta
              <ChevronRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => updateFlow({ step: 2 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'tachycardia' && isUnstable ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-top-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Taquicardia inestable" />

          <div className="grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
            <ProtocolGuideBlock label="Haz ahora" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Cardioversión eléctrica sincronizada inmediata.</p>
              <p className="mt-1">No retrasarla para terminar de etiquetar el ritmo.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si falla">
              <p className="font-semibold text-[var(--text)]">Repite choque y valora amiodarona IV.</p>
              <p className="mt-1">Si persiste la inestabilidad, la electricidad sigue mandando.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock title="Cómo cardiovertir" summary="Solo lo imprescindible del procedimiento." tone="critical" defaultOpen>
              <div className="space-y-2">
                <p>Activa modo sincronizado y confirma marcas sobre cada QRS.</p>
                <p>Si está consciente, analgesia y sedación si la situación lo permite.</p>
                <p>Taquicardia de QRS ancho o fibrilación auricular: empieza con 120-150 J bipásica y escala si falla.</p>
                <p>Flutter o regular de QRS estrecho: suele bastar con 70-120 J bipásica.</p>
                <p>Da hasta 3 intentos, reactivando la sincronía si el equipo la pierde tras cada choque.</p>
              </div>
            </DisclosureBlock>

            <DisclosureBlock title="Si no revierte" summary="Siguiente escalón sin salir del flujo.">
              <div className="space-y-2">
                <p>Amiodarona 300 mg IV en 10-20 min y nuevo intento de cardioversión si la inestabilidad persiste.</p>
                <p>Monitoriza ECG, tensión arterial y prepara ayuda experta inmediata.</p>
              </div>
            </DisclosureBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => onMedicationOpen('amiodarona-vt')} className={subtleButtonClass}>
              Ver amiodarona IV
            </button>
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'tachycardia' && !isUnstable && tachyPattern === 'narrow-regular' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="QRS estrecho regular" />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Haz ahora" tone="accent">
              <p className="font-semibold text-[var(--text)]">Maniobras vagales y después adenosina IV rápida si no revierte.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si no revierte">
              <p className="font-semibold text-[var(--text)]">Reevalúa el ECG y pasa al siguiente escalón solo si sigue estable.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock title="Cómo dar adenosina" summary="Dosis y técnica útiles en urgencias." defaultOpen>
              <div className="space-y-2">
                <p>Bolo IV rápido: 6 mg; si no revierte en 1-2 min, 12 mg; si persiste, 18 mg.</p>
                <p>Usa una vena proximal o una cánula grande y sigue con lavado rápido de suero.</p>
                <p>Monitoriza ECG continuo y avisa de que el malestar será breve.</p>
                <p>No la uses para intentar terminar FA, flutter o TV.</p>
              </div>
            </DisclosureBlock>

            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">¿Revirtió con vagales / adenosina?</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <FlowSelectButton label="Sí" active={adenosineResponse === 'yes'} onClick={() => updateFlow({ adenosineResponse: 'yes' })} />
                <FlowSelectButton label="No" active={adenosineResponse === 'no'} onClick={() => updateFlow({ adenosineResponse: 'no' })} />
              </div>
            </div>

            {adenosineResponse === 'yes' ? (
              <ProtocolGuideBlock label="Después">
                <p className="font-semibold text-[var(--text)]">Registra ECG en sinusal, busca la causa y deja plan si recurre.</p>
              </ProtocolGuideBlock>
            ) : null}

            {adenosineResponse === 'no' ? (
              <div className="space-y-3">
                <ProtocolGuideBlock label="Siguiente escalón" tone="warning">
                  Si sigue estable, considera verapamilo o betabloqueante según contexto clínico. Si deteriora, cardiovertir.
                </ProtocolGuideBlock>
                <div className="space-y-2">
                  {['adenosina', 'verapamilo', 'metoprolol'].map((medicationId) => (
                    <MedicationQuickRow
                      key={medicationId}
                      medication={getMedication(medicationId)}
                      onOpen={() => onMedicationOpen(medicationId)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3, adenosineResponse: null })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'tachycardia' && !isUnstable && tachyPattern === 'narrow-irregular' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="QRS estrecho irregular" />

          <div className="grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <ProtocolGuideBlock label="Haz ahora" tone="accent">
              <p className="font-semibold text-[var(--text)]">Piensa antes en FA o flutter con conducción variable.</p>
              <p className="mt-1">ECG de 12 derivaciones, tratamiento del desencadenante y control de frecuencia si sigue estable.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Evita" tone="warning">
              <p className="font-semibold text-[var(--text)]">No pierdas tiempo con ramas que no cambian la conducta.</p>
              <p className="mt-1">Si sospechas preexcitación, evita bloqueadores nodales y cardioverte si deteriora.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock title="Cuándo abrir FA" summary="La decisión principal de esta rama suele estar allí." defaultOpen>
              <div className="space-y-2">
                <p>Si el ECG o el contexto encajan con fibrilación auricular, abre el protocolo de FA para estabilidad, frecuencia, ritmo y anticoagulación.</p>
                <p>Si la duración es incierta o el episodio lleva &gt; 24 h, no pases a cardioversión precoz sin anticoagulación o ETE.</p>
              </div>
            </DisclosureBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => onModuleOpen('fibrilacion-auricular')} className={primaryButtonClass}>
              Abrir FA
            </button>
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'tachycardia' && !isUnstable && tachyPattern === 'wide-regular' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="QRS ancho regular" />

          <div className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
            <ProtocolGuideBlock label="Haz ahora" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Si no tienes certeza de TSV con aberrancia, trátala como TV.</p>
              <p className="mt-1">Ayuda experta, monitorización continua y preparación de cardioversión.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Fármaco" tone="warning">
              <p className="font-semibold text-[var(--text)]">Amiodarona IV si sigue estable.</p>
              <p className="mt-1">Si empeora, la conducta vuelve a ser cardioversión sincronizada.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock title="Cuándo pensar en TSV con aberrancia" summary="No lo asumas si no tienes una certeza razonable.">
              <div className="space-y-2">
                <p>Si existe un diagnóstico previo cierto de TSV con aberrancia o bloqueo de rama conocido, puedes tratarla como una regular estrecha.</p>
                <p>Si no, el enfoque más seguro delante del paciente es manejarla como ventricular.</p>
              </div>
            </DisclosureBlock>

            <MedicationQuickRow medication={getMedication('amiodarona-vt')} onOpen={() => onMedicationOpen('amiodarona-vt')} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'tachycardia' && !isUnstable && tachyPattern === 'wide-irregular' ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="QRS ancho irregular" />

          <div className="grid gap-3 lg:grid-cols-2">
            <ProtocolGuideBlock label="Haz ahora" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Piensa en FA preexcitada o TV polimórfica.</p>
              <p className="mt-1">Monitorización, ayuda experta y cardioversión si aparece cualquier deterioro.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Evita" tone="warning">
              <p className="font-semibold text-[var(--text)]">No uses bloqueadores nodales si sospechas preexcitación.</p>
              <p className="mt-1">No mezcles decisiones de FA estable con esta rama.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <DisclosureBlock title="Si parece torsades / TV polimórfica" summary="Qué hacer sin cargar la pantalla principal." tone="critical" defaultOpen>
              <div className="space-y-2">
                <p>Corrige causas reversibles y suspende fármacos que prolonguen QT.</p>
                <p>Magnesio 2 g IV en 10 min si el contexto encaja con torsades.</p>
                <p>Si deteriora o no puedes sostenerlo estable, cardiovertir / desfibrilar según la situación clínica.</p>
              </div>
            </DisclosureBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'bradycardia' && isUnstable ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Bradicardia sintomática" />

          <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
            <ProtocolGuideBlock label="Haz ahora" tone="accent">
              <p className="font-semibold text-[var(--text)]">Atropina 0,5 mg IV y reevaluación rápida.</p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Si no responde" tone="critical">
              <p className="font-semibold text-[var(--danger-700)]">Marcapasos transcutáneo y ayuda experta.</p>
            </ProtocolGuideBlock>
          </div>

          <div className="mt-4 space-y-3">
            <MedicationQuickRow medication={getMedication('atropina')} onOpen={() => onMedicationOpen('atropina')} />

            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">¿Respuesta satisfactoria a atropina?</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <FlowSelectButton label="Sí" active={atropineResponse === 'yes'} onClick={() => updateFlow({ atropineResponse: 'yes' })} />
                <FlowSelectButton label="No" active={atropineResponse === 'no'} onClick={() => updateFlow({ atropineResponse: 'no' })} />
              </div>
            </div>

            {atropineResponse === 'yes' ? (
              <ProtocolGuideBlock label="Después">
                <p className="font-semibold text-[var(--text)]">Sigue monitorizando, registra ECG y busca la causa de la bradicardia.</p>
              </ProtocolGuideBlock>
            ) : null}

            {atropineResponse === 'no' ? (
              <div className="space-y-3">
                <ProtocolGuideBlock label="Siguiente escalón" tone="critical">
                  Marcapasos transcutáneo. Si no está disponible de inmediato, pide ayuda y valora adrenalina o isoprenalina como puente.
                </ProtocolGuideBlock>
                <DisclosureBlock title="Cómo hacer marcapasos transcutáneo" summary="Parámetros prácticos y comprobación de captura." tone="critical" defaultOpen>
                  <div className="space-y-2">
                    <p>Coloca los parches en posición pectoro-apical; si no se puede, usa antero-posterior.</p>
                    <p>Selecciona una frecuencia de 60-80/min y empieza con la energía más baja.</p>
                    <p>Sube la intensidad hasta lograr captura eléctrica, habitualmente 50-100 mA.</p>
                    <p>Confirma después captura mecánica palpando pulso y deja 5-10 mA por encima del umbral si el equipo lo permite.</p>
                    <p>Analgesia y sedación si está consciente y el tiempo clínico lo permite.</p>
                  </div>
                </DisclosureBlock>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 2, atropineResponse: null })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 && rhythmFamily === 'bradycardia' && !isUnstable ? (
        <section className={`${panelClass} animate-in fade-in slide-in-from-bottom-4 p-5 duration-300 sm:p-6`}>
          <SectionTitle eyebrow="Paso 4" title="Bradicardia sin repercusión inmediata" />

          <div className="grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <ProtocolGuideBlock label="Conducta" tone={hasAsystoleRisk ? 'warning' : 'accent'}>
              <p className="font-semibold text-[var(--text)]">
                {hasAsystoleRisk
                  ? 'Monitorización estrecha, ayuda experta y prepara vía de estimulación temporal.'
                  : 'Observa, registra ECG de 12 derivaciones y corrige la causa antes de tratar por reflejo.'}
              </p>
            </ProtocolGuideBlock>
            <ProtocolGuideBlock label="Después">
              <p className="font-semibold text-[var(--text)]">
                {hasAsystoleRisk
                  ? 'Si aparecen síntomas o empeora el bloqueo, pasa a atropina y pacing.'
                  : 'Si aparecen síntomas o datos de alto grado, reentra en la rama sintomática.'}
              </p>
            </ProtocolGuideBlock>
          </div>

          {hasAsystoleRisk ? (
            <div className="mt-4">
              <DisclosureBlock title="Qué vigilar" summary="Claves para no retrasar la estimulación." tone="warning" defaultOpen>
                <div className="space-y-2">
                  <p>Mobitz II, bloqueo AV completo con QRS ancho o pausas &gt; 3 s obligan a dejar resuelta la vía de estimulación.</p>
                  <p>No esperes a que la bradicardia se haga inestable para pedir ayuda experta.</p>
                </div>
              </DisclosureBlock>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateFlow({ step: 3 })} className={subtleButtonClass}>
              Volver
            </button>
            <button type="button" onClick={onArrhythmiaFlowReset} className={subtleButtonClass}>
              Reiniciar
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
  const primaryIndication = medication.contextUse ?? medication.indication;
  const primaryDose = medication.contextDose ?? medication.dose;
  const primaryRoute = medication.contextRoute ?? medication.route;
  const primaryFrequency = medication.contextFrequency ?? medication.frequency;
  const followUpPlan = medication.followUpPlan ?? medication.duration;
  const hasContextOverride = Boolean(
    medication.contextUse || medication.contextDose || medication.contextRoute || medication.contextFrequency || medication.followUpPlan,
  );
  const primaryPanelTitle = hasContextOverride ? 'Uso en este contexto' : 'Pauta clínica';
  const followUpLabel = hasContextOverride ? 'Después' : 'Duración';

  return (
    <div className={pageClass}>
      <BackBar label="Medicamentos" onClick={onBack} />

      <PageHero
        title={medication.name}
        note={primaryIndication}
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="active">{medication.family}</StatusBadge>
            <span className="text-sm text-[var(--text-muted)]">{protocolLabel}</span>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailPanel title={primaryPanelTitle}>
          <div className="space-y-3">
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Indicación</p>
              <p className="mt-2 text-sm text-[var(--text)]">{primaryIndication}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Dosis útil ahora</p>
              <p className="mt-2 text-sm text-[var(--text)]">{primaryDose}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Vía prioritaria</p>
              <p className="mt-2 text-sm text-[var(--text)]">{primaryRoute}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">Frecuencia</p>
              <p className="mt-2 text-sm text-[var(--text)]">{primaryFrequency}</p>
            </div>
            <div className={`${mutedPanelClass} p-4`}>
              <p className="eyebrow eyebrow-muted">{followUpLabel}</p>
              <p className="mt-2 text-sm text-[var(--text)]">{followUpPlan}</p>
            </div>
          </div>
        </DetailPanel>

        <DetailPanel title="Riesgos clave">
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
            <DisclosureBlock title="Ajuste renal y hepático" summary="Ábrelo solo si cambia la pauta.">
              <div className="space-y-3">
                <div>
                  <p className="eyebrow eyebrow-muted">Insuficiencia renal</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.renalAdjustment}</p>
                </div>
                <div>
                  <p className="eyebrow eyebrow-muted">Insuficiencia hepática</p>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.hepaticAdjustment}</p>
                </div>
              </div>
            </DisclosureBlock>
            <DisclosureBlock title="Más detalle" summary="Mantenimiento y matices prácticos.">
              <div className="space-y-3">
                {hasContextOverride ? (
                  <div className="space-y-3">
                    <div>
                      <p className="eyebrow eyebrow-muted">Pauta completa</p>
                      <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.dose}</p>
                    </div>
                    <div>
                      <p className="eyebrow eyebrow-muted">Vías disponibles</p>
                      <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.route}</p>
                    </div>
                    <div>
                      <p className="eyebrow eyebrow-muted">Ritmo de administración</p>
                      <p className="mt-2 text-sm text-[var(--text-soft)]">{medication.frequency}</p>
                    </div>
                  </div>
                ) : null}
                <div>
                  <p className="eyebrow eyebrow-muted">Observaciones prácticas</p>
                  <div className="mt-3 space-y-2">
                    {medication.practicalNotes.map((item) => (
                      <div
                        key={item}
                        className="rounded-[0.95rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-3 py-2.5 text-sm text-[var(--text-soft)]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DisclosureBlock>
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
  const [arrhythmiaFlowState, setArrhythmiaFlowState] = useState(initialArrhythmiaFlowState);

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

  const resetArrhythmiaFlow = () => {
    setArrhythmiaFlowState(initialArrhythmiaFlowState);
  };

  const updateArrhythmiaFlow = (changes) => {
    setArrhythmiaFlowState((current) => ({
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

    if (module.id === 'taquiarritmias-bradicardias') {
      resetArrhythmiaFlow();
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

      if (protocolId === 'taquiarritmias-bradicardias') {
        return (
          <TaquiarritmiasBradicardiasFlowView
            protocol={getProtocol(protocolId)}
            arrhythmiaFlowState={arrhythmiaFlowState}
            onArrhythmiaFlowChange={updateArrhythmiaFlow}
            onArrhythmiaFlowReset={resetArrhythmiaFlow}
            onModuleOpen={(moduleId) => openModule(moduleId, protocolReturnTo)}
            onMedicationOpen={(medicationId) => openMedication(medicationId, protocolReturnTo)}
            onBack={handleBack}
            onFinish={() => {
              resetArrhythmiaFlow();
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
          onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, { view: 'protocols' })}
          onMedicationOpen={(medicationId) => openMedication(medicationId, { view: 'protocols' })}
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
