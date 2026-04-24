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

const roundToOne = (value) => Math.round(value * 10) / 10;

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
    status: 'pendiente',
    note: 'Se mantiene indexado, pero no es necesario todavía para el primer módulo.',
  },
  {
    id: 'aa-po2',
    title: 'Diferencia alveoloarterial de O2 (∆AaPO2)',
    chapter: 'Cap. 8 · Gasometría, pulsioximetría y capnografía',
    verifiedPage: 66,
    pdfPage: 91,
    status: 'pendiente',
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
    id: 'grace',
    title: 'GRACE',
    chapter: 'Cap. 26 · Síndrome coronario agudo',
    verifiedPage: 220,
    pdfPage: 245,
    status: 'pendiente',
    note: 'Tabla de riesgo isquémico explícita.',
  },
  {
    id: 'killip',
    title: 'Clase Killip',
    chapter: 'Cap. 26 · Síndrome coronario agudo',
    verifiedPage: 220,
    pdfPage: 245,
    status: 'pendiente',
    note: 'Clasificación de gravedad usada en el mismo bloque clínico.',
  },
  {
    id: 'wells-tvp',
    title: 'Modelo de Wells para TVP',
    chapter: 'Cap. 36 · Enfermedad tromboembólica venosa',
    verifiedPage: 261,
    pdfPage: 286,
    status: 'no aplicable por ahora',
    note: 'Detectado en tabla, pendiente del módulo correspondiente.',
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
    note: 'Escala validada para HDA, pendiente de módulo específico.',
  },
  {
    id: 'alvarado',
    title: 'Escala de Alvarado modificada',
    chapter: 'Cap. 50 · Dolor abdominal agudo',
    verifiedPage: 349,
    pdfPage: 374,
    status: 'pendiente',
    note: 'Referida en el diagnóstico diferencial del abdomen agudo.',
  },
  {
    id: 'glasgow',
    title: 'Escala de coma de Glasgow',
    chapter: 'Cap. 62 · Coma',
    verifiedPage: 429,
    pdfPage: 454,
    status: 'pendiente',
    note: 'Escala explícita para valoración del nivel de conciencia.',
  },
  {
    id: 'nihss',
    title: 'NIHSS',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 446,
    pdfPage: 471,
    status: 'pendiente',
    note: 'Tabla de valoración neurológica para ictus.',
  },
  {
    id: 'rankin-modificada',
    title: 'Escala de Rankin modificada',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 442,
    pdfPage: 467,
    status: 'pendiente',
    note: 'Se usa como criterio funcional en la selección terapéutica del ictus.',
  },
  {
    id: 'cincinnati',
    title: 'Escala de Cincinnati',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 446,
    pdfPage: 471,
    status: 'pendiente',
    note: 'Escala extrahospitalaria de sospecha citada en la activación del Código Ictus.',
  },
  {
    id: 'qsofa',
    title: 'qSOFA / SOFA',
    chapter: 'Cap. 107 · Sepsis',
    verifiedPage: 640,
    pdfPage: 665,
    status: 'pendiente',
    note: 'Se proponen ambas escalas para sospecha diagnóstica y valoración del riesgo.',
  },
];

export const getCalculator = (calculatorId) => calculatorCatalog[calculatorId] ?? implementedCalculators[0];
