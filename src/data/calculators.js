import { createBibliographyEntry } from './bibliography';

const referenceEntry = ({ id, indexPage, verifiedPage = indexPage, pdfPage, note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'murillo7',
    indexPages: indexPage ? [indexPage] : [],
    verifiedPages: verifiedPage ? [verifiedPage] : [],
    pdfPages: pdfPage ? [pdfPage] : [],
    note,
  });

const escFaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-fa-2024',
    verifiedPages,
    pdfPages,
    note,
  });

const escScaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-sca-2023',
    verifiedPages,
    pdfPages,
    note,
  });

const ahaIschemicStrokeEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'aha-ictus-isquemico-2026',
    verifiedPages,
    pdfPages,
    note,
  });

const ahaHemorrhagicStrokeEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'aha-ictus-hemorragico-2022',
    verifiedPages,
    pdfPages,
    note,
  });

const niceNg250Entry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-ng250-2025',
    verifiedPages,
    pdfPages,
    note,
  });

const wsesAppendicitisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'wses-appendicitis-2020',
    verifiedPages,
    pdfPages,
    note,
  });

const acgPancreatitisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'acg-pancreatitis-2024',
    verifiedPages,
    pdfPages,
    note,
  });

const roundToOne = (value) => Math.round(value * 10) / 10;

const numeric = (value) => Number(value) || 0;

export const calculateCockcroftGault = ({ age, sex, weightKg, serumCreatinineMgDl }) => {
  const ageNumber = Number(age);
  const weightNumber = Number(weightKg);
  const creatinineNumber = Number(serumCreatinineMgDl);

  if (!ageNumber || !weightNumber || !creatinineNumber || creatinineNumber <= 0) {
    return null;
  }

  const base = ((140 - ageNumber) * weightNumber) / (72 * creatinineNumber);
  const adjusted = sex === 'female' ? base * 0.85 : base;

  return {
    value: roundToOne(adjusted),
    unit: 'mL/min',
    interpretation:
      adjusted < 15
        ? 'Aclaramiento muy reducido. Las fichas CIMA de ACOD obligan a extremar la revisión.'
        : adjusted < 30
          ? 'Aclaramiento reducido. Requiere ajuste o contraindicación según el fármaco.'
          : adjusted < 50
            ? 'Aclaramiento moderadamente reducido. Revisar dosis de anticoagulantes.'
            : 'Aclaramiento utilizable para revisar ajustes renales del módulo FA.',
    caution:
      'El libro indica que estas ecuaciones no son fiables en insuficiencia renal aguda o fuera de fase estable.',
  };
};

export const calculateCha2ds2Va = ({
  age,
  heartFailure,
  hypertension,
  diabetes,
  strokeOrEmbolism,
  vascularDisease,
}) => {
  const ageNumber = Number(age);
  let score = 0;

  if (heartFailure) {
    score += 1;
  }
  if (hypertension) {
    score += 1;
  }
  if (ageNumber >= 75) {
    score += 2;
  } else if (ageNumber >= 65) {
    score += 1;
  }
  if (diabetes) {
    score += 1;
  }
  if (strokeOrEmbolism) {
    score += 2;
  }
  if (vascularDisease) {
    score += 1;
  }

  let recommendation = 'Sin indicación de anticoagulación por CHA2DS2-VA si no hay otros motivos clínicos.';

  if (score === 1) {
    recommendation = 'Considerar anticoagulación oral según riesgo tromboembólico, sangrado y contexto clínico.';
  } else if (score >= 2) {
    recommendation = 'La guía ESC 2024 recomienda anticoagulación oral si no hay contraindicación.';
  }

  return {
    value: score,
    unit: 'puntos',
    interpretation: recommendation,
    caution: 'No sustituye la revisión de estenosis mitral moderada/grave, prótesis mecánica, función renal y factores de sangrado.',
  };
};

export const calculateHasBled = ({
  systolicBloodPressure,
  renalDysfunction,
  hepaticDysfunction,
  strokeHistory,
  bleedingHistory,
  labileInr,
  age,
  drugsPredisposingBleeding,
  alcohol,
}) => {
  let score = 0;
  const ageNumber = Number(age);
  const systolic = Number(systolicBloodPressure);

  if (systolic > 160) {
    score += 1;
  }
  if (renalDysfunction) {
    score += 1;
  }
  if (hepaticDysfunction) {
    score += 1;
  }
  if (strokeHistory) {
    score += 1;
  }
  if (bleedingHistory) {
    score += 1;
  }
  if (labileInr) {
    score += 1;
  }
  if (ageNumber > 65) {
    score += 1;
  }
  if (drugsPredisposingBleeding) {
    score += 1;
  }
  if (alcohol) {
    score += 1;
  }

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 3
        ? 'Riesgo hemorrágico alto. Úsalo para corregir factores modificables y vigilar más de cerca, no para negar anticoagulación por sí solo.'
        : 'No hay riesgo hemorrágico alto por HAS-BLED, pero sigue revisando factores modificables antes y durante la anticoagulación.',
    caution: 'La guía ESC 2024 desaconseja usar escalas de sangrado de forma aislada para iniciar o suspender anticoagulación.',
  };
};

export const calculateCrb65 = ({ confusion, respiratoryRate30, lowBloodPressure, age65 }) => {
  const score = [confusion, respiratoryRate30, lowBloodPressure, age65].filter(Boolean).length;

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 3
        ? 'Riesgo alto. NICE recomienda usar juicio clínico y considerar derivación hospitalaria.'
        : score >= 2
          ? 'Riesgo intermedio-alto. NICE recomienda considerar derivación hospitalaria.'
          : score === 1
            ? 'Riesgo intermedio. NICE propone consejos de seguridad y reevaluación, o derivación a atención urgente en el día, hospitalización a domicilio, unidad virtual u hospital según contexto.'
            : 'Riesgo bajo. NICE permite manejo comunitario con consejo de seguridad si el juicio clínico lo respalda.',
    caution:
      'CRB-65 debe combinarse con juicio clínico; comorbilidad, embarazo, hipoxemia, sepsis o mala tolerancia oral pueden cambiar el destino.',
  };
};

export const calculateCurb65 = ({ confusion, ureaOver7, respiratoryRate30, lowBloodPressure, age65 }) => {
  const score = [confusion, ureaOver7, respiratoryRate30, lowBloodPressure, age65].filter(Boolean).length;

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 3
        ? 'Riesgo alto. NICE recomienda considerar ingreso y derivación a críticos si procede.'
        : score === 2
          ? 'Riesgo intermedio. NICE propone decidir entre atención urgente en el día, unidad virtual, hospitalización a domicilio o ingreso.'
          : 'Riesgo bajo. NICE permite alta con seguimiento y consejos de seguridad si no hay criterios clínicos de riesgo.',
    caution:
      'CURB-65 no sustituye la valoración de hipoxemia, sepsis, complicaciones pleurales, comorbilidad, fragilidad ni tolerancia oral.',
  };
};

export const calculateKillip = ({ classValue }) => {
  const value = Number(classValue);
  if (!value) return null;

  const labels = {
    1: 'Killip I',
    2: 'Killip II',
    3: 'Killip III',
    4: 'Killip IV',
  };

  return {
    value: labels[value],
    unit: '',
    interpretation:
      value >= 3
        ? 'Alto riesgo. Requiere monitorización estrecha/UCI según contexto y estrategia invasiva urgente si SCA.'
        : value === 2
          ? 'Insuficiencia cardíaca leve-moderada. Eleva riesgo y destino; monitorizar y tratar congestión.'
          : 'Sin insuficiencia cardíaca clínica por Killip. No elimina otros criterios de alto riesgo.',
    caution: 'Killip complementa ECG, troponina, hemodinámica y criterios ESC; no sustituye el juicio clínico.',
  };
};

export const calculateNihss = (values) => {
  const score = [
    'levelOfConsciousness',
    'locQuestions',
    'locCommands',
    'bestGaze',
    'visual',
    'facialPalsy',
    'motorArmLeft',
    'motorArmRight',
    'motorLegLeft',
    'motorLegRight',
    'limbAtaxia',
    'sensory',
    'bestLanguage',
    'dysarthria',
    'extinction',
  ].reduce((total, key) => total + numeric(values[key]), 0);

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 21
        ? 'Déficit muy grave. Activar circuito ictus, valorar gran vaso/trombectomía y destino monitorizado/UCI según evolución.'
        : score >= 16
          ? 'Déficit moderado-grave. Priorizar angio-TC si sospecha gran vaso y comunicación estructurada con neurología.'
          : score >= 5
            ? 'Déficit moderado. Valorar reperfusión si déficit discapacitante y ventana compatible.'
            : score >= 1
              ? 'Déficit leve. No descarta tratamiento si el déficit es discapacitante o hay oclusión de gran vaso.'
              : 'Sin déficit medible por NIHSS en este momento.',
    caution: 'NIHSS no debe retrasar TAC, trombólisis ni trombectomía si el paciente cumple criterios.',
  };
};

export const calculateIchScore = ({ gcsRange, volume30, intraventricular, infratentorial, age80 }) => {
  const gcsPoints = gcsRange === '3-4' ? 2 : gcsRange === '5-12' ? 1 : 0;
  const score = gcsPoints + [volume30, intraventricular, infratentorial, age80].filter(Boolean).length;

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 3
        ? 'Riesgo alto. Priorizar UCI/neurocríticos, neurocirugía si procede y comunicación pronóstica estructurada.'
        : score >= 1
          ? 'Riesgo aumentado. Requiere ingreso monitorizado y vigilancia de deterioro/expansión.'
          : 'Riesgo bajo por ICH Score, sin excluir ingreso monitorizado ni decisiones por localización, PA o anticoagulación.',
    caution: 'No debe usarse para limitar tratamiento por sí solo; integra clínica, imagen, anticoagulación y preferencias.',
  };
};

export const calculateAlvarado = ({
  migration,
  anorexia,
  nauseaVomiting,
  rightLowerQuadrantTenderness,
  rebound,
  fever,
  leukocytosis,
  neutrophilia,
}) => {
  const score =
    [migration, anorexia, nauseaVomiting, rebound, fever, neutrophilia].filter(Boolean).length +
    (rightLowerQuadrantTenderness ? 2 : 0) +
    (leukocytosis ? 2 : 0);

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 7
        ? 'Probabilidad alta. Avisar cirugía y valorar imagen/cirugía según estabilidad y red local.'
        : score >= 5
          ? 'Riesgo intermedio. Observación, reevaluación e imagen si persiste sospecha.'
          : 'Riesgo bajo. Puede apoyar alta/observación corta solo si el juicio clínico y la reevaluación son tranquilizadores.',
    caution: 'No usar en solitario: embarazo, ancianos, inmunosupresión y presentaciones atípicas reducen fiabilidad.',
  };
};

export const calculateBisap = ({ bunOver25, impairedMentalStatus, sirs, ageOver60, pleuralEffusion }) => {
  const score = [bunOver25, impairedMentalStatus, sirs, ageOver60, pleuralEffusion].filter(Boolean).length;

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score >= 3
        ? 'Alto riesgo de pancreatitis grave. Ingreso monitorizado, vigilancia estrecha y valorar UCI si fallo orgánico o mala perfusión.'
        : 'Riesgo menor por BISAP, sin excluir ingreso si dolor, vómitos, comorbilidad, colangitis o mala evolución.',
    caution: 'BISAP ayuda a estratificar; la conducta final depende de fallo orgánico, perfusión, imagen y evolución.',
  };
};

export const calculatorCatalog = {
  'cha2ds2-va': {
    id: 'cha2ds2-va',
    title: 'CHA2DS2-VA',
    shortTitle: 'CHA2DS2-VA',
    moduleId: 'fibrilacion-auricular',
    block: 'Fibrilación auricular',
    chapter: 'Guía ESC 2024 · Fibrilación auricular',
    verifiedPage: 32,
    pdfPage: 32,
    status: 'implementado',
    summary: 'Riesgo tromboembólico en FA sin estenosis mitral moderada/severa ni prótesis valvular mecánica.',
    bibliography: [
      escFaEntry({
        id: 'cha2ds2-va-fa',
        verifiedPages: [32],
        pdfPages: [32],
        note: 'La guía ESC 2024 usa CHA2DS2-VA para estratificar riesgo tromboembólico y decidir anticoagulación.',
      }),
    ],
  },
  'has-bled': {
    id: 'has-bled',
    title: 'HAS-BLED',
    shortTitle: 'HAS-BLED',
    moduleId: 'fibrilacion-auricular',
    block: 'Fibrilación auricular',
    chapter: 'Guía ESC 2024 · Fibrilación auricular',
    verifiedPage: 40,
    pdfPage: 40,
    status: 'implementado',
    summary: 'Riesgo hemorrágico para vigilar y corregir factores modificables durante la anticoagulación.',
    bibliography: [
      escFaEntry({
        id: 'has-bled-fa',
        verifiedPages: [39, 40],
        pdfPages: [39, 40],
        note: 'La guía ESC 2024 recuerda que las escalas de sangrado ayudan a vigilar, pero no deben decidir por sí solas iniciar o retirar ACO.',
      }),
    ],
  },
  'cockcroft-gault': {
    id: 'cockcroft-gault',
    title: 'Cockcroft-Gault',
    shortTitle: 'Cockcroft-Gault',
    moduleId: 'fibrilacion-auricular',
    block: 'Función renal para ajuste farmacológico',
    chapter: 'Cap. 5 · Bioquímica sanguínea',
    verifiedPage: 39,
    pdfPage: 64,
    status: 'implementado',
    summary: 'Estimación del aclaramiento de creatinina útil para revisar ajustes renales en FA.',
    bibliography: [
      referenceEntry({
        id: 'cockcroft-gault-bioquimica',
        verifiedPage: 39,
        pdfPage: 64,
        note: 'La obra lo cita como estimación útil cuando no se dispone de aclaramiento real de 24 h.',
      }),
    ],
  },
  'crb-65': {
    id: 'crb-65',
    title: 'CRB-65',
    shortTitle: 'CRB-65',
    moduleId: 'neumonia-comunidad',
    block: 'Neumonía adquirida en la comunidad',
    chapter: 'NICE NG250 2025 · Atención inicial',
    verifiedPage: 9,
    pdfPage: 9,
    status: 'implementado',
    summary: 'Riesgo de mortalidad y decisión de destino inicial en adultos con NAC fuera del hospital.',
    bibliography: [
      niceNg250Entry({
        id: 'crb65-nice-ng250',
        verifiedPages: [8, 9, 10],
        pdfPages: [8, 9, 10],
        note: 'NICE NG250 recomienda CRB-65 junto con juicio clínico para estratificar gravedad y decidir lugar de cuidados en atención inicial.',
      }),
    ],
  },
  'curb-65': {
    id: 'curb-65',
    title: 'CURB-65',
    shortTitle: 'CURB-65',
    moduleId: 'neumonia-comunidad',
    block: 'Neumonía adquirida en la comunidad',
    chapter: 'NICE NG250 2025 · Hospital',
    verifiedPage: 11,
    pdfPage: 11,
    status: 'implementado',
    summary: 'Riesgo de mortalidad y decisión de destino hospitalario en adultos con NAC.',
    bibliography: [
      niceNg250Entry({
        id: 'curb65-nice-ng250',
        verifiedPages: [10, 11, 12],
        pdfPages: [10, 11, 12],
        note: 'NICE NG250 recomienda CURB-65 junto con juicio clínico para estratificar gravedad y decidir alta, atención urgente en el día/observación, ingreso o críticos.',
      }),
    ],
  },
  killip: {
    id: 'killip',
    title: 'Killip',
    shortTitle: 'Killip',
    moduleId: 'sindrome-coronario-agudo',
    block: 'Síndrome coronario agudo',
    chapter: 'ESC SCA 2023 · Riesgo inicial',
    verifiedPage: 3720,
    pdfPage: null,
    status: 'implementado',
    summary: 'Clasificación clínica de insuficiencia cardíaca/shock en SCA que modifica gravedad, destino y estrategia.',
    bibliography: [
      escScaEntry({
        id: 'killip-sca-esc-2023',
        note: 'ESC 2023 considera Killip > I marcador clínico de alto riesgo en SCA.',
      }),
    ],
  },
  nihss: {
    id: 'nihss',
    title: 'NIHSS',
    shortTitle: 'NIHSS',
    moduleId: 'ictus-isquemico',
    block: 'Ictus isquémico',
    chapter: 'AHA/ASA 2026 · Escala de gravedad',
    verifiedPage: 1,
    pdfPage: null,
    status: 'implementado',
    summary: 'Cuantifica déficit neurológico basal y tras reperfusión; ayuda a comunicar gravedad y seleccionar circuito.',
    bibliography: [
      ahaIschemicStrokeEntry({
        id: 'nihss-aha-2026',
        note: 'AHA/ASA 2026 recomienda usar una escala de gravedad, preferentemente NIHSS, en sospecha de ictus isquémico.',
      }),
    ],
  },
  'ich-score': {
    id: 'ich-score',
    title: 'ICH Score',
    shortTitle: 'ICH Score',
    moduleId: 'ictus-hemorragico',
    block: 'Ictus hemorrágico',
    chapter: 'AHA/ASA 2022 · Estratificación inicial',
    verifiedPage: 1,
    pdfPage: null,
    status: 'implementado',
    summary: 'Estratifica gravedad inicial de hemorragia intracerebral con GCS, volumen, IVH, localización y edad.',
    bibliography: [
      ahaHemorrhagicStrokeEntry({
        id: 'ich-score-aha-2022',
        note: 'AHA/ASA 2022 recomienda escalas basales de gravedad para comunicación y planificación, sin usarlas como único límite terapéutico.',
      }),
    ],
  },
  alvarado: {
    id: 'alvarado',
    title: 'Alvarado',
    shortTitle: 'Alvarado',
    moduleId: 'dolor-abdomen-quirurgico',
    block: 'Abdomen quirúrgico',
    chapter: 'WSES Apendicitis 2020 · Riesgo preimagen',
    verifiedPage: 1,
    pdfPage: null,
    status: 'implementado',
    summary: 'Apoya la estratificación de sospecha de apendicitis y la necesidad de observación, imagen o cirugía.',
    bibliography: [
      wsesAppendicitisEntry({
        id: 'alvarado-wses-2020',
        note: 'WSES 2020 describe Alvarado/AIR como apoyo para estimar probabilidad preimagen y orientar alta, imagen o cirugía.',
      }),
    ],
  },
  bisap: {
    id: 'bisap',
    title: 'BISAP',
    shortTitle: 'BISAP',
    moduleId: 'dolor-hepatobiliar-pancreatico',
    block: 'Pancreatitis aguda',
    chapter: 'ACG Pancreatitis 2024 · Gravedad inicial',
    verifiedPage: 419,
    pdfPage: null,
    status: 'implementado',
    summary: 'Estratifica riesgo inicial en pancreatitis aguda para vigilancia, ingreso monitorizado o UCI.',
    bibliography: [
      acgPancreatitisEntry({
        id: 'bisap-acg-2024',
        note: 'ACG 2024 incluye BISAP entre herramientas de estratificación y enfatiza valorar BUN, SIRS y fallo orgánico.',
      }),
    ],
  },
};

export const implementedCalculators = Object.values(calculatorCatalog);

export const calculationAudit = [
  {
    id: 'cockcroft-gault',
    title: 'Aclaramiento de creatinina (Cockcroft-Gault)',
    chapter: 'Cap. 5 · Bioquímica sanguínea',
    verifiedPage: 39,
    pdfPage: 64,
    status: 'implementado',
    note: 'Se usa en FA para revisar ajustes renales de anticoagulantes.',
  },
  {
    id: 'ckd-epi',
    title: 'TFG estimado (CKD-EPI)',
    chapter: 'Cap. 5 · Bioquímica sanguínea',
    verifiedPage: 39,
    pdfPage: 64,
    status: 'indexado',
    note: 'Se mantiene indexado, pero no es necesario todavía para el primer módulo.',
  },
  {
    id: 'aa-po2',
    title: 'Diferencia alveoloarterial de O2 (∆AaPO2)',
    chapter: 'Cap. 8 · Gasometría, pulsioximetría y capnografía',
    verifiedPage: 66,
    pdfPage: 91,
    status: 'indexado',
    note: 'Fórmula citada en la obra. Queda fuera del primer protocolo real.',
  },
  {
    id: 'cha2ds2-va',
    title: 'CHA2DS2-VA',
    chapter: 'Guía ESC 2024 · Fibrilación auricular',
    verifiedPage: 32,
    pdfPage: 32,
    status: 'implementado',
    note: 'Escala integrada en el módulo de fibrilación auricular y usada como referencia principal actual.',
  },
  {
    id: 'has-bled',
    title: 'HAS-BLED',
    chapter: 'Guía ESC 2024 · Fibrilación auricular',
    verifiedPage: 40,
    pdfPage: 40,
    status: 'implementado',
    note: 'Escala integrada en FA para revisar riesgo hemorrágico y factores corregibles, no para vetar ACO por sí sola.',
  },
  {
    id: 'crb-65',
    title: 'CRB-65',
    chapter: 'NICE NG250 2025 · Neumonía adquirida en la comunidad',
    verifiedPage: 9,
    pdfPage: 9,
    status: 'implementado',
    note: 'Integrado para valoración inicial extrahospitalaria o de primer contacto en NAC.',
  },
  {
    id: 'curb-65',
    title: 'CURB-65',
    chapter: 'NICE NG250 2025 · Neumonía adquirida en la comunidad',
    verifiedPage: 11,
    pdfPage: 11,
    status: 'implementado',
    note: 'Integrado para valoración hospitalaria y decisión de destino en NAC.',
  },
  {
    id: 'grace',
    title: 'GRACE',
    chapter: 'Cap. 26 · Síndrome coronario agudo',
    verifiedPage: 220,
    pdfPage: 245,
    status: 'indexado',
    note: 'Tabla de riesgo isquémico explícita.',
  },
  {
    id: 'killip',
    title: 'Clase Killip',
    chapter: 'ESC SCA 2023 · Síndrome coronario agudo',
    verifiedPage: null,
    pdfPage: null,
    status: 'implementado',
    note: 'Integrado en SCA para gravedad, destino monitorizado y estrategia urgente.',
  },
  {
    id: 'wells-tvp',
    title: 'Modelo de Wells para TVP',
    chapter: 'Cap. 36 · Enfermedad tromboembólica venosa',
    verifiedPage: 261,
    pdfPage: 286,
    status: 'no aplicable por ahora',
    note: 'Detectado en tabla, indexado para el módulo correspondiente.',
  },
  {
    id: 'wells-tep',
    title: 'Modelo de Wells para TEP',
    chapter: 'Cap. 39 · Tromboembolia pulmonar',
    verifiedPage: 278,
    pdfPage: 303,
    status: 'no aplicable por ahora',
    note: 'Escala cuantificable detectada, fuera del alcance actual.',
  },
  {
    id: 'pesi',
    title: 'PESI / sPESI',
    chapter: 'Cap. 39 · Tromboembolia pulmonar',
    verifiedPage: 281,
    pdfPage: 306,
    status: 'no aplicable por ahora',
    note: 'Herramienta pronóstica de TEP detectada en el capítulo.',
  },
  {
    id: 'glasgow-blatchford',
    title: 'Glasgow-Blatchford',
    chapter: 'Cap. 48 · Hemorragia digestiva alta',
    verifiedPage: 329,
    pdfPage: 354,
    status: 'no aplicable por ahora',
    note: 'Escala validada para HDA, indexado para módulo específico.',
  },
  {
    id: 'alvarado',
    title: 'Escala de Alvarado modificada',
    chapter: 'WSES Apendicitis 2020 · Dolor abdominal agudo',
    verifiedPage: null,
    pdfPage: null,
    status: 'implementado',
    note: 'Integrada en abdomen quirúrgico para sospecha de apendicitis sin peritonitis franca.',
  },
  {
    id: 'glasgow',
    title: 'Escala de coma de Glasgow',
    chapter: 'Cap. 62 · Coma',
    verifiedPage: 429,
    pdfPage: 454,
    status: 'indexado',
    note: 'Escala explícita para valoración del nivel de conciencia.',
  },
  {
    id: 'nihss',
    title: 'NIHSS',
    chapter: 'AHA/ASA 2026 · Ictus isquémico',
    verifiedPage: null,
    pdfPage: null,
    status: 'implementado',
    note: 'Integrado en ictus isquémico para cuantificar déficit, comunicar gravedad y orientar circuito.',
  },
  {
    id: 'ich-score',
    title: 'ICH Score',
    chapter: 'AHA/ASA 2022 · Ictus hemorrágico',
    verifiedPage: null,
    pdfPage: null,
    status: 'implementado',
    note: 'Integrado en ictus hemorrágico para gravedad inicial y destino monitorizado.',
  },
  {
    id: 'bisap',
    title: 'BISAP',
    chapter: 'ACG Pancreatitis 2024 · Pancreatitis aguda',
    verifiedPage: null,
    pdfPage: null,
    status: 'implementado',
    note: 'Integrado en hepatobiliar-pancreático para estratificar riesgo inicial de pancreatitis.',
  },
  {
    id: 'rankin-modificada',
    title: 'Escala de Rankin modificada',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 442,
    pdfPage: 467,
    status: 'indexado',
    note: 'Se usa como criterio funcional en la selección terapéutica del ictus.',
  },
  {
    id: 'cincinnati',
    title: 'Escala de Cincinnati',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 446,
    pdfPage: 471,
    status: 'indexado',
    note: 'Escala extrahospitalaria de sospecha citada en la activación del Código Ictus.',
  },
  {
    id: 'qsofa',
    title: 'qSOFA / SOFA',
    chapter: 'Cap. 107 · Sepsis',
    verifiedPage: 640,
    pdfPage: 665,
    status: 'indexado',
    note: 'Se proponen ambas escalas para sospecha diagnóstica y valoración del riesgo.',
  },
];

export const getCalculator = (calculatorId) => calculatorCatalog[calculatorId] ?? implementedCalculators[0];
