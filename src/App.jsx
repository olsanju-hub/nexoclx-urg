import React, { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import {
  calculateCha2ds2Va,
  calculateAlvarado,
  calculateAnaphylaxisAdrenaline,
  calculateBisap,
  calculateCockcroftGault,
  calculateCrb65,
  calculateCurb65,
  calculateFaDose,
  calculateHasBled,
  calculateIchScore,
  calculateKillip,
  calculateNihss,
  calculateScaDose,
  calculateSeizureDose,
  calculateStrokeThrombolysisDose,
  calculateVascularHeparinDose,
  getCalculator,
  implementedCalculators,
} from './data/calculators';
import { ClinicalFlowTree } from './components/ClinicalFlowTree';
import { getMotivoModule, groupModulesBySpecialty, motivoConsultaModules } from './data/modules';
import { getProtocolFlow } from './data/protocolFlows';
import { getProtocol as getLegacyProtocol } from './data/protocols';

const brandMark = `${import.meta.env.BASE_URL}branding/app-icon-512.png`;

const shellCardClass = 'shell-card';
const panelClass = 'floating-panel';
const mutedPanelClass = 'tonal-panel';
const subtleButtonClass = 'soft-button';
const ghostButtonClass = 'ghost-button';
const inputClass = 'app-input';
const listRowClass = 'list-row group';
const pageClass = 'mx-auto max-w-[72rem] space-y-3 sm:space-y-5 xl:space-y-6';

const primaryNavItems = [
  { key: 'home', label: 'Inicio', icon: LayoutDashboard },
  { key: 'protocols', label: 'Protocolos', icon: ClipboardList },
  { key: 'calculations', label: 'Cálculos', icon: Calculator },
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
  'crb-65': {
    confusion: false,
    respiratoryRate30: false,
    lowBloodPressure: false,
    age65: false,
  },
  'curb-65': {
    confusion: false,
    ureaOver7: false,
    respiratoryRate30: false,
    lowBloodPressure: false,
    age65: false,
  },
  killip: {
    classValue: '1',
  },
  nihss: {
    levelOfConsciousness: '0',
    locQuestions: '0',
    locCommands: '0',
    bestGaze: '0',
    visual: '0',
    facialPalsy: '0',
    motorArmLeft: '0',
    motorArmRight: '0',
    motorLegLeft: '0',
    motorLegRight: '0',
    limbAtaxia: '0',
    sensory: '0',
    bestLanguage: '0',
    dysarthria: '0',
    extinction: '0',
  },
  'ich-score': {
    gcsRange: '13-15',
    volume30: false,
    intraventricular: false,
    infratentorial: false,
    age80: false,
  },
  alvarado: {
    migration: false,
    anorexia: false,
    nauseaVomiting: false,
    rightLowerQuadrantTenderness: false,
    rebound: false,
    fever: false,
    leukocytosis: false,
    neutrophilia: false,
  },
  bisap: {
    bunOver25: false,
    impairedMentalStatus: false,
    sirs: false,
    ageOver60: false,
    pleuralEffusion: false,
  },
  'seizure-dose': {
    medication: 'midazolam-no-iv',
    weightKg: '',
  },
  'anaphylaxis-adrenaline': {
    weightKg: '',
    ageGroup: 'adult',
  },
  'sca-dose': {
    medication: 'heparina-icp',
    weightKg: '',
    age: '',
    renalSevere: false,
  },
  'fa-dose': {
    medication: 'amiodarona',
    weightKg: '',
    renalSevere: false,
  },
  'stroke-thrombolysis-dose': {
    weightKg: '',
  },
  'vascular-heparin-dose': {
    weightKg: '',
  },
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

  if (calculatorId === 'crb-65') {
    return calculateCrb65(values);
  }

  if (calculatorId === 'curb-65') {
    return calculateCurb65(values);
  }

  if (calculatorId === 'killip') {
    return calculateKillip(values);
  }

  if (calculatorId === 'nihss') {
    return calculateNihss(values);
  }

  if (calculatorId === 'ich-score') {
    return calculateIchScore(values);
  }

  if (calculatorId === 'alvarado') {
    return calculateAlvarado(values);
  }

  if (calculatorId === 'bisap') {
    return calculateBisap(values);
  }

  if (calculatorId === 'seizure-dose') {
    return calculateSeizureDose(values);
  }

  if (calculatorId === 'anaphylaxis-adrenaline') {
    return calculateAnaphylaxisAdrenaline(values);
  }

  if (calculatorId === 'sca-dose') {
    return calculateScaDose(values);
  }

  if (calculatorId === 'fa-dose') {
    return calculateFaDose(values);
  }

  if (calculatorId === 'stroke-thrombolysis-dose') {
    return calculateStrokeThrombolysisDose(values);
  }

  if (calculatorId === 'vascular-heparin-dose') {
    return calculateVascularHeparinDose(values);
  }

  return null;
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

  return 'home';
};

const getPageLabel = (route) => {
  if (route.view === 'protocol') {
    const protocolId = route.protocolId ?? 'fibrilacion-auricular';
    return getProtocolFlow(protocolId).title;
  }

  if (route.view === 'calculator') {
    return getCalculator(route.calculatorId).title;
  }

  if (route.view === 'protocols') {
    return 'Especialidades';
  }

  if (route.view === 'calculations') {
    return 'Cálculos';
  }

  return 'Inicio clínico';
};

const uniqueByKey = (items, keyBuilder) => Array.from(new Map(items.map((item) => [keyBuilder(item), item])).values());
const normalizeSearch = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const matchesSearch = (needle, ...parts) => parts.some((part) => normalizeSearch(part).includes(needle));

const getModulePrimaryReferences = (moduleId) => {
  const protocol = getLegacyProtocol(moduleId);
  const entries = protocol?.bibliography ?? getMotivoModule(moduleId).bibliography ?? [];
  return entries.slice(0, 1);
};

const buildSpecialtyCollections = () =>
  groupModulesBySpecialty(motivoConsultaModules).map((group) => {
    const implementedModules = group.modules.filter((module) => module.implemented);
    const moduleIds = new Set(implementedModules.map((module) => module.id));
    const calculators = implementedCalculators
      .filter((calculator) => moduleIds.has(calculator.moduleId))
      .sort((left, right) => left.title.localeCompare(right.title, 'es'));
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
      medications: [],
      bibliography,
    };
  });

const frequentProtocolIds = [
  'fibrilacion-auricular',
  'sindrome-coronario-agudo',
  'ictus-isquemico',
  'neumonia-comunidad',
  'hta-urgencias',
  'dolor-urinario',
];

const protocolSearchAliases = {
  'fibrilacion-auricular': ['fa', 'arritmia', 'palpitaciones'],
  'sindrome-coronario-agudo': ['sca', 'infarto', 'dolor toracico', 'iam', 'scacest'],
  'ictus-isquemico': ['ictus', 'codigo ictus', 'trombolisis', 'trombectomia'],
  'ictus-hemorragico': ['ictus', 'hemorragia cerebral', 'tac'],
  'neumonia-comunidad': ['nac', 'neumonia', 'infeccion respiratoria'],
  'hta-urgencias': ['hta', 'hipertension', 'presion arterial'],
  bradicardias: ['bradicardia', 'bloqueo av'],
  'arritmias-ventriculares': ['tv', 'fv', 'torsades', 'taquicardia ventricular'],
  'dolor-urinario': ['colico renal', 'urologia', 'litiasis', 'flanco'],
  'crisis-convulsiva-epilepsia': ['convulsion', 'convulsiones', 'epilepsia', 'estatus epileptico', 'status epilepticus', 'primera crisis'],
  anafilaxia: ['reaccion alergica', 'alergia grave', 'adrenalina', 'shock anafilactico', 'urticaria', 'angioedema', 'broncoespasmo'],
};

const getProtocolCalculatorCount = (moduleId) => implementedCalculators.filter((calculator) => calculator.moduleId === moduleId).length;

const getProtocolSearchText = (module) =>
  [
    module.title,
    module.shortTitle,
    module.summary,
    module.section,
    module.chapter,
    ...(protocolSearchAliases[module.id] ?? []),
  ].join(' ');

const filterProtocolModules = (modules, query, specialtyId = 'todos') => {
  const needle = normalizeSearch(query);

  return modules.filter((module) => {
    const specialtyMatches = specialtyId === 'todos' || module.specialtyId === specialtyId;
    const queryMatches = !needle || matchesSearch(needle, getProtocolSearchText(module));
    return specialtyMatches && queryMatches;
  });
};

const filterCalculatorItems = (query) => {
  const needle = normalizeSearch(query);
  if (!needle) return [];

  return implementedCalculators.filter((calculator) =>
    matchesSearch(needle, calculator.title, calculator.summary, calculator.block, calculator.moduleId),
  );
};

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
      return {
        ...group,
        protocols,
        calculators,
        medications: [],
        bibliography: [],
      };
    })
    .filter((group) => group.protocols.length > 0 || group.calculators.length > 0);
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
  <header className={`fixed inset-x-0 top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] backdrop-blur-xl ${isScrolled ? 'shadow-[0_18px_38px_-34px_rgba(0,0,0,0.18)]' : ''}`}>
    <div className="mx-auto flex h-[4.2rem] max-w-[82rem] items-center gap-3 px-3.5 sm:h-[4.6rem] sm:gap-4 sm:px-6 lg:px-8 xl:px-10">
      <button type="button" onClick={onHome} className="min-w-0 text-left">
        <BrandLockup label={pageLabel} />
      </button>

      <nav className="ml-auto hidden items-center gap-1 rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] p-1 shadow-[0_14px_30px_-26px_rgba(0,0,0,0.14)] lg:flex">
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
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${primaryNavItems.length}, minmax(0, 1fr))` }}>
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

const ProtocolCompactCard = ({ module, onClick, compact = false }) => {
  const calculatorCount = module.calculatorCount ?? getProtocolCalculatorCount(module.id);

  return (
    <button type="button" onClick={onClick} className={`protocol-compact-card ${compact ? 'protocol-compact-card-slim' : ''} group`}>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{module.title}</p>
          {!compact && calculatorCount ? <StatusBadge tone="active">{calculatorCount} cálculo{calculatorCount > 1 ? 's' : ''}</StatusBadge> : null}
        </div>
        <p className="mt-1 text-[0.72rem] font-semibold text-[var(--text-muted)]">{module.section}</p>
        {!compact ? <p className="mt-1 line-clamp-1 text-xs leading-snug text-[var(--text-soft)]">{module.summary}</p> : null}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
};

const CalculatorCompactRow = ({ calculator, onClick }) => (
  <button type="button" onClick={onClick} className="protocol-compact-card group">
    <div className="min-w-0 flex-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold text-[var(--text)]">{calculator.title}</p>
        <StatusBadge>Cálculo</StatusBadge>
      </div>
      <p className="mt-1 line-clamp-1 text-xs leading-snug text-[var(--text-soft)]">{calculator.summary}</p>
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
  </button>
);

const SpecialtyChips = ({ groups, activeId = 'todos', onSelect }) => (
  <div className="specialty-chip-row">
    <button
      type="button"
      onClick={() => onSelect('todos')}
      className={`specialty-chip ${activeId === 'todos' ? 'specialty-chip-active' : ''}`}
    >
      Todos
    </button>
    {groups.map((group) => (
      <button
        key={group.id}
        type="button"
        onClick={() => onSelect(group.id)}
        className={`specialty-chip ${activeId === group.id ? 'specialty-chip-active' : ''}`}
      >
        {group.title}
      </button>
    ))}
  </div>
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
              badge={!module.implemented ? <StatusBadge tone="pending">Indexado</StatusBadge> : null}
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
  <div className="list-row">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--text)]">{entry.moduleTitle}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        {entry.shortReference}
        {entry.note ? ` · ${entry.note}` : ''}
      </p>
    </div>
  </div>
);

const SearchField = ({ value, onChange, placeholder, prominent = false }) => (
  <label className={`${prominent ? 'primary-search-field' : mutedPanelClass} flex items-center gap-3 px-4 py-3.5`}>
    <span className={`icon-well ${prominent ? 'h-9 w-9' : 'h-10 w-10'} rounded-[0.95rem] bg-[rgba(15,111,124,0.1)] text-[var(--accent-500)]`}>
      <Search className="h-4 w-4" />
    </span>
    <div className="min-w-0 flex-1">
      {!prominent ? <p className="eyebrow eyebrow-muted">Buscar</p> : null}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${prominent ? 'text-[0.98rem] sm:text-[1.05rem]' : 'mt-1 text-sm'} w-full bg-transparent font-medium text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]`}
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

const SpecialtyAccordionList = ({
  groups,
  onModuleOpen,
  onCalculatorOpen,
  forceOpen = false,
  preferredOpenId = null,
}) => (
  <div className="space-y-3">
    {groups.map((group) => (
      <details
        key={group.id}
        className="group overflow-hidden rounded-[1.35rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.92)] shadow-[0_18px_40px_-34px_rgba(0,0,0,0.16)]"
        {...(forceOpen || group.id === preferredOpenId || (!preferredOpenId && group.id === 'cardiologia') ? { open: true } : {})}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-4.5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-[1.02rem] font-semibold tracking-[-0.03em] text-[var(--text)]">{group.title}</p>
            {group.note ? <p className="mt-1 max-w-2xl text-sm text-[var(--text-soft)]">{group.note}</p> : null}
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-90" />
        </summary>

        <div className="border-t border-[color:var(--line)] bg-[rgba(252,249,244,0.5)] px-4 py-4 sm:px-5">
          <div className="space-y-4">
            {group.protocols.length > 0 ? (
              <SpecialtySectionRows title="Protocolos">
                {group.protocols.map((module) => (
                  <ListActionRow
                    key={module.id}
                    title={module.title}
                    meta={module.summary}
                    badge={!module.implemented ? <StatusBadge tone="pending">Indexado</StatusBadge> : null}
                    disabled={!module.implemented}
                    onClick={() => onModuleOpen(module.id)}
                  />
                ))}
              </SpecialtySectionRows>
            ) : null}

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

          </div>
        </div>
      </details>
    ))}
  </div>
);

const SpecialtyLandingGrid = ({ groups, onOpen }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {groups.map((group) => (
      <button
        key={group.id}
        type="button"
        onClick={() => onOpen(group.id)}
        className="group flex items-center justify-between rounded-[1.45rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] px-4 py-4 text-left shadow-[0_18px_38px_-30px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(0,113,227,0.20)]"
      >
        <span className="text-sm font-semibold text-[var(--text)]">{group.title}</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    ))}
  </div>
);

const QuickAccessCard = ({ icon: Icon, title, meta, onClick, tone = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex items-start gap-3 rounded-[1.5rem] border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 ${
      tone === 'accent'
        ? 'border-[rgba(0,113,227,0.20)] bg-[rgba(0,113,227,0.08)] shadow-[0_24px_48px_-34px_rgba(0,113,227,0.24)]'
        : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.88)] shadow-[0_18px_42px_-30px_rgba(0,0,0,0.12)] hover:border-[rgba(0,113,227,0.20)]'
    }`}
  >
    <span
      className={`icon-well ${tone === 'accent' ? 'bg-[rgba(0,113,227,0.10)] text-[var(--accent-500)]' : ''}`}
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

const BibliographyBlock = ({ entries }) => (
  <section className={`${panelClass} p-4 sm:p-5`}>
    <SectionTitle title="Fuentes" note="Referencias textuales verificadas." />
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.internalId} className={`${mutedPanelClass} p-4`}>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{entry.shortReference}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {entry.verifiedPages.length > 0 ? `Página verificada: ${entry.verifiedPages.join(', ')}` : 'Página no especificada'}
            </p>
            {entry.note ? <p className="mt-2 text-sm text-[var(--text-soft)]">{entry.note}</p> : null}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const BooleanField = ({ checked, label, onChange }) => (
  <label
    className={`flex items-center gap-3 rounded-[1rem] border px-3.5 py-3 text-sm transition-colors ${
      checked
        ? 'border-[rgba(0,113,227,0.28)] bg-[rgba(0,113,227,0.07)] text-[var(--text)]'
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

const scoreOptions = (max) =>
  Array.from({ length: max + 1 }, (_, value) => ({
    value: String(value),
    label: String(value),
  }));

const nihssFields = [
  ['levelOfConsciousness', '1a. Nivel de conciencia', 3],
  ['locQuestions', '1b. Preguntas LOC', 2],
  ['locCommands', '1c. Órdenes LOC', 2],
  ['bestGaze', '2. Mirada', 2],
  ['visual', '3. Campos visuales', 3],
  ['facialPalsy', '4. Paresia facial', 3],
  ['motorArmLeft', '5a. Brazo izquierdo', 4],
  ['motorArmRight', '5b. Brazo derecho', 4],
  ['motorLegLeft', '6a. Pierna izquierda', 4],
  ['motorLegRight', '6b. Pierna derecha', 4],
  ['limbAtaxia', '7. Ataxia', 2],
  ['sensory', '8. Sensibilidad', 2],
  ['bestLanguage', '9. Lenguaje', 3],
  ['dysarthria', '10. Disartria', 2],
  ['extinction', '11. Extinción/inatención', 2],
];

const CalculatorResult = ({ result }) =>
  result ? (
    <div className="rounded-[1.15rem] border border-[rgba(0,113,227,0.20)] bg-[rgba(0,113,227,0.08)] px-4 py-3">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
        {result.value} <span className="text-sm font-medium text-[var(--text-muted)]">{result.unit}</span>
      </p>
      <p className="mt-1 text-sm text-[var(--text-soft)]">{result.interpretation}</p>
      {result.fields ? (
        <dl className="mt-3 space-y-1.5 text-sm">
          {Object.entries(result.fields).map(([label, value]) => (
            <div key={label} className="grid gap-0.5 sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold text-[var(--text-muted)]">{label}:</dt>
              <dd className="min-w-0 text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
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

      {calculatorId === 'crb-65' ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.confusion} label="Confusión nueva" onChange={(value) => onChange('confusion', value)} />
            <BooleanField checked={values.respiratoryRate30} label="FR ≥ 30/min" onChange={(value) => onChange('respiratoryRate30', value)} />
            <BooleanField
              checked={values.lowBloodPressure}
              label="TAS < 90 o TAD ≤ 60"
              onChange={(value) => onChange('lowBloodPressure', value)}
            />
            <BooleanField checked={values.age65} label="Edad ≥ 65 años" onChange={(value) => onChange('age65', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'curb-65' ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.confusion} label="Confusión nueva" onChange={(value) => onChange('confusion', value)} />
            <BooleanField checked={values.ureaOver7} label="Urea > 7 mmol/L" onChange={(value) => onChange('ureaOver7', value)} />
            <BooleanField checked={values.respiratoryRate30} label="FR ≥ 30/min" onChange={(value) => onChange('respiratoryRate30', value)} />
            <BooleanField
              checked={values.lowBloodPressure}
              label="TAS < 90 o TAD ≤ 60"
              onChange={(value) => onChange('lowBloodPressure', value)}
            />
            <BooleanField checked={values.age65} label="Edad ≥ 65 años" onChange={(value) => onChange('age65', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'killip' ? (
        <div className="space-y-3">
          <SelectField
            value={values.classValue}
            label="Clase clínica"
            options={[
              { value: '1', label: 'I · Sin insuficiencia cardíaca' },
              { value: '2', label: 'II · Crepitantes/S3/ingurgitación yugular' },
              { value: '3', label: 'III · Edema agudo de pulmón' },
              { value: '4', label: 'IV · Shock cardiogénico' },
            ]}
            onChange={(value) => onChange('classValue', value)}
          />
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'nihss' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {nihssFields.map(([field, label, max]) => (
              <SelectField
                key={field}
                value={values[field]}
                label={label}
                options={scoreOptions(max)}
                onChange={(value) => onChange(field, value)}
              />
            ))}
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'ich-score' ? (
        <div className="space-y-3">
          <SelectField
            value={values.gcsRange}
            label="Glasgow"
            options={[
              { value: '13-15', label: '13-15 puntos' },
              { value: '5-12', label: '5-12 puntos' },
              { value: '3-4', label: '3-4 puntos' },
            ]}
            onChange={(value) => onChange('gcsRange', value)}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.volume30} label="Volumen ≥ 30 mL" onChange={(value) => onChange('volume30', value)} />
            <BooleanField checked={values.intraventricular} label="Extensión intraventricular" onChange={(value) => onChange('intraventricular', value)} />
            <BooleanField checked={values.infratentorial} label="Origen infratentorial" onChange={(value) => onChange('infratentorial', value)} />
            <BooleanField checked={values.age80} label="Edad ≥ 80 años" onChange={(value) => onChange('age80', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'alvarado' ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.migration} label="Migración a FID" onChange={(value) => onChange('migration', value)} />
            <BooleanField checked={values.anorexia} label="Anorexia" onChange={(value) => onChange('anorexia', value)} />
            <BooleanField checked={values.nauseaVomiting} label="Náuseas/vómitos" onChange={(value) => onChange('nauseaVomiting', value)} />
            <BooleanField checked={values.rightLowerQuadrantTenderness} label="Dolor a palpación FID (2)" onChange={(value) => onChange('rightLowerQuadrantTenderness', value)} />
            <BooleanField checked={values.rebound} label="Rebote/irritación" onChange={(value) => onChange('rebound', value)} />
            <BooleanField checked={values.fever} label="Fiebre" onChange={(value) => onChange('fever', value)} />
            <BooleanField checked={values.leukocytosis} label="Leucocitosis (2)" onChange={(value) => onChange('leukocytosis', value)} />
            <BooleanField checked={values.neutrophilia} label="Neutrofilia/desviación izquierda" onChange={(value) => onChange('neutrophilia', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'bisap' ? (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <BooleanField checked={values.bunOver25} label="BUN > 25 mg/dL" onChange={(value) => onChange('bunOver25', value)} />
            <BooleanField checked={values.impairedMentalStatus} label="Alteración mental" onChange={(value) => onChange('impairedMentalStatus', value)} />
            <BooleanField checked={values.sirs} label="SIRS presente" onChange={(value) => onChange('sirs', value)} />
            <BooleanField checked={values.ageOver60} label="Edad > 60 años" onChange={(value) => onChange('ageOver60', value)} />
            <BooleanField checked={values.pleuralEffusion} label="Derrame pleural" onChange={(value) => onChange('pleuralEffusion', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'seizure-dose' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              value={values.medication}
              label="Fármaco"
              options={[
                { value: 'midazolam-no-iv', label: 'Midazolam sin vía IV' },
                { value: 'midazolam-iv', label: 'Midazolam IV' },
                { value: 'diazepam-rectal', label: 'Diazepam rectal' },
                { value: 'lorazepam', label: 'Lorazepam IV' },
                { value: 'valproato', label: 'Valproato IV' },
                { value: 'fenitoina', label: 'Fenitoína IV' },
              ]}
              onChange={(value) => onChange('medication', value)}
            />
            <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 70" onChange={(value) => onChange('weightKg', value)} />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'anaphylaxis-adrenaline' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 25" onChange={(value) => onChange('weightKg', value)} />
            <SelectField
              value={values.ageGroup}
              label="Grupo"
              options={[
                { value: 'adult', label: 'Adulto/adolescente' },
                { value: 'pediatric', label: 'Pediátrico' },
              ]}
              onChange={(value) => onChange('ageGroup', value)}
            />
          </div>
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'sca-dose' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              value={values.medication}
              label="Pauta"
              options={[
                { value: 'heparina-icp', label: 'Heparina sódica ICP' },
                { value: 'enoxaparina', label: 'Enoxaparina' },
                { value: 'tenecteplasa', label: 'Tenecteplasa' },
                { value: 'alteplasa-sca', label: 'Alteplasa SCA' },
              ]}
              onChange={(value) => onChange('medication', value)}
            />
            <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 78" onChange={(value) => onChange('weightKg', value)} />
            <NumberField value={values.age} label="Edad" placeholder="Ej. 76" onChange={(value) => onChange('age', value)} />
          </div>
          <BooleanField
            checked={values.renalSevere}
            label="ClCr < 30 ml/min si enoxaparina"
            onChange={(value) => onChange('renalSevere', value)}
          />
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'fa-dose' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              value={values.medication}
              label="Pauta"
              options={[
                { value: 'amiodarona', label: 'Amiodarona IV' },
                { value: 'flecainida', label: 'Flecainida IV' },
                { value: 'propafenona', label: 'Propafenona IV' },
                { value: 'enoxaparina-fa', label: 'Enoxaparina FA' },
              ]}
              onChange={(value) => onChange('medication', value)}
            />
            <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 72" onChange={(value) => onChange('weightKg', value)} />
          </div>
          <BooleanField
            checked={values.renalSevere}
            label="ClCr 15-30 ml/min si enoxaparina"
            onChange={(value) => onChange('renalSevere', value)}
          />
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'stroke-thrombolysis-dose' ? (
        <div className="space-y-3">
          <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 80" onChange={(value) => onChange('weightKg', value)} />
          <CalculatorResult result={result} />
        </div>
      ) : null}

      {calculatorId === 'vascular-heparin-dose' ? (
        <div className="space-y-3">
          <NumberField value={values.weightKg} label="Peso (kg)" placeholder="Ej. 75" onChange={(value) => onChange('weightKg', value)} />
          <CalculatorResult result={result} />
        </div>
      ) : null}
    </section>
  );
};

const DisclosureBlock = ({ title, summary, children, tone = 'neutral', defaultOpen = false }) => {
  const toneClass =
    tone === 'critical'
      ? 'border-[rgba(164,76,63,0.18)] bg-[rgba(249,236,232,0.92)]'
      : tone === 'warning'
        ? 'border-[rgba(0,113,227,0.20)] bg-[rgba(245,245,247,0.94)]'
        : tone === 'accent'
          ? 'border-[rgba(0,113,227,0.20)] bg-[rgba(0,113,227,0.08)]'
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

const HomeView = ({
  onSpecialtyOpen,
  onModuleOpen,
  onCalculatorOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const specialtyCollections = buildSpecialtyCollections();
  const simplifiedProtocols = specialtyCollections.flatMap((group) => group.protocols);
  const hasSearchQuery = Boolean(normalizeSearch(deferredSearchQuery));
  const protocolResults = filterProtocolModules(simplifiedProtocols, deferredSearchQuery).slice(0, 8);
  const calculatorResults = filterCalculatorItems(deferredSearchQuery).slice(0, 4);
  const hasSearchResults = protocolResults.length > 0 || calculatorResults.length > 0;
  const frequentProtocols = frequentProtocolIds
    .map((id) => simplifiedProtocols.find((module) => module.id === id))
    .filter(Boolean);

  return (
    <div className={pageClass}>
      <section className="home-search-panel">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar protocolo, síntoma o cálculo"
          prominent
        />
      </section>

      {hasSearchQuery ? (
        <section className="compact-section">
          <SectionTitle title="Resultados" />
          {hasSearchResults ? (
            <div className="space-y-2">
              {protocolResults.map((module) => (
                <ProtocolCompactCard key={module.id} module={module} onClick={() => onModuleOpen(module.id)} />
              ))}
              {calculatorResults.map((calculator) => (
                <CalculatorCompactRow key={calculator.id} calculator={calculator} onClick={() => onCalculatorOpen(calculator.id)} />
              ))}
            </div>
          ) : (
            <EmptySearchState query={deferredSearchQuery} />
          )}
        </section>
      ) : (
        <>
          <section className="compact-section">
            <SectionTitle title="Especialidades" />
            <div className="home-specialty-grid">
              {specialtyCollections.map((group) => (
                <button key={group.id} type="button" onClick={() => onSpecialtyOpen(group.id)} className="specialty-chip">
                  {group.title}
                </button>
              ))}
            </div>
          </section>

          <section className="compact-section compact-section-secondary">
            <SectionTitle title="Frecuentes" />
            <div className="compact-list">
              {frequentProtocols.map((module) => (
                <ProtocolCompactCard key={module.id} module={module} onClick={() => onModuleOpen(module.id)} compact />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const ProtocolsView = ({ onBack, onModuleOpen, onCalculatorOpen, focusSpecialtyId = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialtyId, setActiveSpecialtyId] = useState(focusSpecialtyId ?? 'todos');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const specialtyCollections = buildSpecialtyCollections();
  const displayedCollections = specialtyCollections
    .map((group) => ({
      ...group,
      protocols: filterProtocolModules(group.protocols, deferredSearchQuery, activeSpecialtyId),
    }))
    .filter((group) => group.protocols.length > 0);

  return (
    <div className={pageClass}>
      <BackBar label="Inicio" onClick={onBack} />

      <section className="compact-section">
        <SectionTitle title="Protocolos" />
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar protocolo, síntoma o cálculo"
        />
        <div className="mt-3">
          <SpecialtyChips groups={specialtyCollections} activeId={activeSpecialtyId} onSelect={setActiveSpecialtyId} />
        </div>
      </section>

      {displayedCollections.length > 0 ? (
        <div className="space-y-4">
          {displayedCollections.map((group) => (
            <section key={group.id} className="compact-section">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow eyebrow-muted">{group.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">{group.protocols.length} protocolos</p>
                </div>
                {activeSpecialtyId === 'todos' ? (
                  <button
                    type="button"
                    onClick={() => setActiveSpecialtyId(group.id)}
                    className="ghost-button"
                  >
                    Ver
                  </button>
                ) : null}
              </div>
              <div className="space-y-2">
                {group.protocols.map((module) => (
                  <ProtocolCompactCard key={module.id} module={module} onClick={() => onModuleOpen(module.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptySearchState query={deferredSearchQuery} />
      )}
    </div>
  );
};

const ClinicalProtocolFlowView = ({ protocolId, onBack, onCalculatorOpen }) => {
  const flow = getProtocolFlow(protocolId);

  return (
    <div className={pageClass}>
      <ClinicalFlowTree protocol={flow} onCalculatorOpen={onCalculatorOpen} onBack={onBack} backLabel="Protocolos" />
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

const App = () => {
  const [route, setRoute] = useState({ view: 'home' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState(initialCalculatorInputs);

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

  const openModule = (moduleId, returnTo = { view: 'protocols' }) => {
    const module = getMotivoModule(moduleId);

    if (!module.implemented) {
      return;
    }

    navigate({ view: 'protocol', protocolId: module.id, returnTo });
  };

  const openSpecialty = (specialtyId) => {
    navigate({ view: 'protocols', focusSpecialtyId: specialtyId });
  };

  const openCalculations = (returnTo = { view: 'home' }) => {
    navigate({ view: 'calculations', returnTo });
  };

  const openCalculator = (calculatorId, returnTo = { view: 'home' }) => {
    navigate({ view: 'calculator', calculatorId, returnTo });
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

    navigate({ view: 'home' });
  };

  const renderView = () => {
    if (route.view === 'protocol') {
      const protocolId = route.protocolId ?? 'fibrilacion-auricular';
      const protocolReturnTo = {
        view: 'protocol',
        protocolId,
      };

      return (
        <ClinicalProtocolFlowView
          protocolId={protocolId}
          onBack={handleBack}
          onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, protocolReturnTo)}
        />
      );
    }

    if (route.view === 'protocols') {
      return (
        <ProtocolsView
          onBack={() => navigate({ view: 'home' })}
          onModuleOpen={(moduleId) => openModule(moduleId, { view: 'protocols' })}
          onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, { view: 'protocols' })}
          focusSpecialtyId={route.focusSpecialtyId ?? null}
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

    return (
      <HomeView
        onSpecialtyOpen={openSpecialty}
        onModuleOpen={(moduleId) => openModule(moduleId, { view: 'home' })}
        onCalculatorOpen={(calculatorId) => openCalculator(calculatorId, { view: 'home' })}
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
