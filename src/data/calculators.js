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

const escPeEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-pe-2019',
    verifiedPages,
    pdfPages,
    note,
  });

const niceVteEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-ng158-vte',
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

const rcukAnaphylaxisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'rcuk-anafilaxia-2021',
    verifiedPages,
    pdfPages,
    note,
  });

const niceAnaphylaxisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-cg134-anafilaxia',
    verifiedPages,
    pdfPages,
    note,
  });

const senEpilepsyEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'sen-epilepsia-2023',
    verifiedPages,
    pdfPages,
    note,
  });

const localV60Entry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'philips-v60-local',
    verifiedPages,
    pdfPages,
    note,
  });

const ersAtsVmniEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'ers-ats-vmni-2017',
    verifiedPages,
    pdfPages,
    note,
  });

const niceFluidEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-cg174-fluidoterapia',
    verifiedPages,
    pdfPages,
    note,
  });

const sscSepsisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'ssc-sepsis-2021',
    verifiedPages,
    pdfPages,
    note,
  });

const roundToOne = (value) => Math.round(value * 10) / 10;
const roundToTwo = (value) => Math.round(value * 100) / 100;

const numeric = (value) => Number(value) || 0;

const fluidLossesTotal = ({
  vomitingMl,
  diarrheaMl,
  drainsMl,
  bleedingMl,
  feverSweatMl,
  estimatedLossesMl,
}) =>
  numeric(vomitingMl) +
  numeric(diarrheaMl) +
  numeric(drainsMl) +
  numeric(bleedingMl) +
  numeric(feverSweatMl) +
  numeric(estimatedLossesMl);

const fluidBalanceWarnings = ({ urineMl, urineHours, weightKg, netBalance }) => {
  const urine = numeric(urineMl);
  const hours = numeric(urineHours);
  const weight = numeric(weightKg);
  const warnings = [];

  if (urine && hours) {
    const urineMlHour = urine / hours;
    const urineMlKgHour = weight ? urineMlHour / weight : null;
    const lowUrine = urineMlKgHour !== null ? urineMlKgHour < 0.5 : urineMlHour < 30;

    if (lowUrine) {
      warnings.push('Oliguria: reevaluar perfusión, TA, lactato/gasometría, creatinina, congestión y necesidad de escalar.');
    }
  }

  if (netBalance > 1500 || (weight && netBalance / weight > 20)) {
    warnings.push('Riesgo de sobrecarga: reevaluar congestión, oxigenación y perfusión antes de aportar más volumen.');
  }

  return warnings;
};

const doseResult = ({ title, value, unit = '', fields, interpretation, caution }) => ({
  value,
  unit,
  fields,
  interpretation,
  caution,
});

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
          : 'Riesgo bajo. NICE permite alta con alarma y revisión si no hay criterios clínicos de riesgo.',
    caution:
      'CURB-65 no sustituye la valoración de hipoxemia, sepsis, complicaciones pleurales, comorbilidad, fragilidad ni tolerancia oral.',
  };
};

export const calculateWellsTep = ({
  dvtSigns,
  peMostLikely,
  heartRateOver100,
  immobilizationOrSurgery,
  previousVte,
  hemoptysis,
  activeCancer,
}) => {
  const score =
    (dvtSigns ? 3 : 0) +
    (peMostLikely ? 3 : 0) +
    (heartRateOver100 ? 1.5 : 0) +
    (immobilizationOrSurgery ? 1.5 : 0) +
    (previousVte ? 1.5 : 0) +
    (hemoptysis ? 1 : 0) +
    (activeCancer ? 1 : 0);

  const probability =
    score > 6 ? 'alta' : score >= 2 ? 'intermedia' : 'baja';
  const simplified = score > 4 ? 'TEP probable' : 'TEP improbable';

  return {
    value: roundToOne(score),
    unit: 'puntos',
    interpretation:
      score > 6
        ? 'Probabilidad alta: no usar dímero D para descartar; angio-TC si estable y anticoagulación si no hay contraindicación.'
        : score > 4
          ? 'TEP probable: imagen directa si estable y anticoagulación si no hay contraindicación.'
          : 'TEP improbable o probabilidad baja/intermedia: dímero D si paciente estable; angio-TC si positivo o persiste alta sospecha.',
    fields: {
      'Modelo 3 niveles': probability,
      'Modelo 2 niveles': simplified,
      Conducta: score > 4 ? 'Imagen directa / tratar si probable.' : 'Dímero D si estable y no alta probabilidad.',
    },
    caution: 'No aplica a TEP inestable: si hay shock/hipotensión, monitorizar, eco urgente y tratar sin esperar dímero D.',
  };
};

export const calculateSpesiTep = ({
  ageOver80,
  cancer,
  chronicCardiopulmonaryDisease,
  heartRate110,
  systolicBloodPressureUnder100,
  oxygenSaturationUnder90,
}) => {
  const score = [
    ageOver80,
    cancer,
    chronicCardiopulmonaryDisease,
    heartRate110,
    systolicBloodPressureUnder100,
    oxygenSaturationUnder90,
  ].filter(Boolean).length;

  return {
    value: score,
    unit: 'puntos',
    interpretation:
      score === 0
        ? 'Bajo riesgo por sPESI. Valorar alta/ambulatorio solo si TEP estable, sin hipoxemia, sin sangrado, tratamiento y seguimiento garantizados.'
        : 'Mayor riesgo por sPESI. Valorar observación/ingreso y estratificación con VD, biomarcadores y contexto clínico.',
    fields: {
      Riesgo: score === 0 ? 'bajo' : 'no bajo',
      Conducta: score === 0 ? 'Puede apoyar manejo ambulatorio seleccionado.' : 'No usar para alta directa.',
    },
    caution: 'sPESI no sustituye Hestia, soporte domiciliario, riesgo hemorrágico, función renal ni juicio clínico.',
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

export const calculateSeizureDose = ({ medication, weightKg }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  const common = {
    peso: `${weight} kg`,
  };

  if (medication === 'midazolam-no-iv') {
    const raw = roundToTwo(weight * 0.2);
    const dose = Math.min(raw, 10);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Midazolam',
        'Peso': common.peso,
        'Dosis calculada': `${dose} mg${raw > 10 ? ' (0,2 mg/kg limitado por máximo)' : ' (0,2 mg/kg)'}`,
        'Máximo aplicado si procede': '10 mg',
        'Vía': 'IM, bucal o intranasal',
        'Repetición/frecuencia': 'Repetir si persiste la crisis con monitorización respiratoria.',
        'Evitar si': 'Depresión respiratoria sin soporte disponible.',
        'Reevaluar': 'Cese de crisis, SatO2, ventilación, PA y necesidad de segunda línea IV.',
      },
      interpretation: 'Primera línea si crisis >5 min o repetida sin recuperación y no conviene retrasar por vía IV.',
      caution: 'No retrasa ABC ni soporte ventilatorio.',
    });
  }

  if (medication === 'midazolam-iv') {
    const dose = roundToTwo(weight * 0.1);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Midazolam',
        'Peso': common.peso,
        'Dosis calculada': `${dose} mg (0,1 mg/kg)`,
        'Máximo aplicado si procede': `Límite total acumulado descrito: ${roundToTwo(weight * 0.4)} mg (0,4 mg/kg).`,
        'Vía': 'IV lenta',
        'Repetición/frecuencia': 'Repetir si persiste la crisis y hay soporte respiratorio.',
        'Evitar si': 'Depresión respiratoria sin capacidad de soporte de vía aérea.',
        'Reevaluar': 'Ventilación y necesidad de segunda línea si no cede.',
      },
      interpretation: 'Opción IV de primera línea cuando ya hay acceso venoso.',
      caution: 'Evita repetir benzodiacepinas indefinidamente.',
    });
  }

  if (medication === 'diazepam-rectal') {
    const dose = roundToTwo(weight * 0.5);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Diazepam',
        'Peso': common.peso,
        'Dosis calculada': `${dose} mg (0,5 mg/kg)`,
        'Máximo aplicado si procede': 'No se aplica máximo cerrado en esta pauta local; vigilar sedación.',
        'Vía': 'Rectal',
        'Repetición/frecuencia': 'Usar como alternativa si no hay vía IV y no hay midazolam adecuado.',
        'Evitar si': 'Depresión respiratoria, miastenia o intoxicación por depresores del SNC.',
        'Reevaluar': 'Cese de crisis, ventilación y paso a segunda línea si persiste.',
      },
      interpretation: 'Alternativa si no hay acceso IV y no se dispone de midazolam adecuado.',
      caution: 'En adulto con vía IV, la pauta actual visible usa diazepam IV 10 mg lento.',
    });
  }

  if (medication === 'lorazepam') {
    const raw = roundToTwo(weight * 0.1);
    const dose = Math.min(raw, 4);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Lorazepam',
        'Peso': common.peso,
        'Dosis calculada': `${dose} mg (0,1 mg/kg)`,
        'Máximo aplicado si procede': '4 mg/dosis; máximo 2 dosis.',
        'Vía': 'IV',
        'Repetición/frecuencia': 'Valorar segunda dosis si persiste a los 10-15 min.',
        'Evitar si': 'Depresión respiratoria relevante sin soporte ventilatorio disponible.',
        'Reevaluar': 'Cese de crisis, ventilación, SatO2, PA y necesidad de segunda línea.',
      },
      interpretation: 'Opción IV si está disponible y se puede vigilar vía aérea.',
      caution: 'Disponer de soporte de vía aérea antes de repetir benzodiacepina.',
    });
  }

  if (medication === 'valproato') {
    const low = roundToTwo(weight * 15);
    const high = roundToTwo(weight * 25);
    return doseResult({
      value: `${low}-${high} mg`,
      fields: {
        'Fármaco': 'Valproato sódico',
        'Peso': common.peso,
        'Dosis calculada': `${low}-${high} mg (15-25 mg/kg)`,
        'Máximo aplicado si procede': 'Usar 25 mg/kg como techo de carga mostrado.',
        'Vía': 'IV lento',
        'Repetición/frecuencia': 'Carga en 3-5 min; perfusión 1 mg/kg/h si se continúa.',
        'Evitar si': 'Embarazo, posibilidad de embarazo con alternativa, hepatopatía, pancreatopatía o trastorno del ciclo de la urea.',
        'Reevaluar': 'Crisis, perfil hepático, plaquetas/coagulación y plan de neurología.',
      },
      interpretation: 'Segunda línea si persiste tras benzodiacepina y no hay contraindicación.',
      caution: 'Revisar contraindicaciones antes de administrarlo.',
    });
  }

  if (medication === 'fenitoina') {
    const load = roundToTwo(weight * 18);
    const maintenanceLow = roundToTwo(weight * 5);
    const maintenanceHigh = roundToTwo(weight * 7);
    return doseResult({
      value: `${load} mg`,
      fields: {
        'Fármaco': 'Fenitoína',
        'Peso': common.peso,
        'Dosis calculada': `${load} mg carga (18 mg/kg)`,
        'Máximo aplicado si procede': 'Velocidad máxima 50 mg/min; no diluir en glucosado.',
        'Vía': 'IV en suero fisiológico',
        'Repetición/frecuencia': `Mantenimiento si procede: ${maintenanceLow}-${maintenanceHigh} mg/día repartido en 3-4 dosis.`,
        'Evitar si': 'Bradicardia sinusal, bloqueo SA/AV, Adams-Stokes, hipotensión grave o alto riesgo cardíaco.',
        'Reevaluar': 'ECG, PA, respiración, cese de crisis y niveles/toxicidad si continúa.',
      },
      interpretation: 'Segunda línea si persiste el estatus y se puede monitorizar ECG/PA.',
      caution: 'Administrar con monitorización continua.',
    });
  }

  return null;
};

export const calculateAnaphylaxisAdrenaline = ({ weightKg, ageGroup }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  const raw = roundToTwo(weight * 0.01);
  const maxDose = ageGroup === 'adult' ? 0.5 : 0.3;
  const dose = Math.min(raw, maxDose);
  const volume = roundToTwo(dose);

  return doseResult({
    value: `${dose} mg`,
    fields: {
      'Fármaco': 'Adrenalina 1 mg/ml',
      'Peso': `${weight} kg`,
      'Edad/grupo si aplica': ageGroup === 'adult' ? 'Adulto/adolescente' : 'Pediátrico',
      'Dosis calculada': `${dose} mg (${volume} ml de 1 mg/ml)`,
      'Máximo aplicado si procede': `${maxDose} mg`,
      'Vía': 'IM en cara anterolateral del muslo',
      'Repetición/frecuencia': 'Repetir cada 5-15 min si persiste compromiso respiratorio/circulatorio.',
      'Evitar si': 'No retrasar por contraindicaciones relativas en anafilaxia grave; evitar vía IV sin monitorización experta.',
      'Reevaluar': 'ABC, SatO2, PA, estridor/broncoespasmo, urticaria/angioedema y necesidad de UCI.',
    },
    interpretation: 'Primera línea en anafilaxia probable con compromiso respiratorio o cardiovascular.',
    caution: 'Si la situación es crítica, no demorar la administración por completar el cálculo.',
  });
};

export const calculateScaDose = ({ medication, weightKg, age, renalSevere }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  if (medication === 'heparina-icp') {
    return doseResult({
      value: `${Math.round(weight * 70)}-${Math.round(weight * 100)} UI`,
      fields: {
        'Fármaco': 'Heparina sódica',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${Math.round(weight * 70)}-${Math.round(weight * 100)} UI`,
        'Máximo aplicado si procede': 'No mostrado; usar protocolo de hemodinámica si ACT/anti-GPIIbIIIa modifica dosis.',
        'Vía': 'IV bolo durante ICP',
        'Repetición/frecuencia': 'Bolo inicial según estrategia invasiva.',
        'Evitar si': 'Sangrado activo, HIT o contraindicación hemorrágica relevante.',
        'Reevaluar': 'Sangrado, plaquetas y estrategia invasiva.',
      },
      interpretation: 'Cálculo de bolo en ICP según pauta visible del SCA.',
      caution: 'Si la estrategia cambia, usar protocolo de cardiología/hemodinámica local.',
    });
  }

  if (medication === 'enoxaparina') {
    const dose = roundToOne(weight);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Enoxaparina',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${dose} mg (1 mg/kg)`,
        'Máximo aplicado si procede': 'No se muestra máximo cerrado; ajustar a presentación y riesgo hemorrágico.',
        'Vía': 'SC; bolo IV 0,3 mg/kg si última SC >8 h antes de ICP',
        'Repetición/frecuencia': renalSevere ? 'Cada 24 h si ClCr <30 ml/min.' : 'Cada 12 h si ClCr ≥30 ml/min.',
        'Evitar si': 'Sangrado activo, diatesis hemorrágica o contraindicación de anticoagulación.',
        'Reevaluar': 'Función renal, sangrado, plaquetas y momento de coronariografía.',
      },
      interpretation: 'Pauta de SCA con ajuste de intervalo por función renal.',
      caution: 'Usar Cockcroft-Gault si la función renal no está clara.',
    });
  }

  if (medication === 'tenecteplasa') {
    const ageNumber = numeric(age);
    const base =
      weight < 60 ? 30 : weight < 70 ? 35 : weight < 80 ? 40 : weight < 90 ? 45 : 50;
    const dose = ageNumber >= 75 ? base / 2 : base;
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Tenecteplasa',
        'Peso': `${weight} kg`,
        'Edad/grupo si aplica': ageNumber ? `${ageNumber} años` : 'Edad no indicada',
        'Dosis calculada': `${dose} mg en bolo IV`,
        'Máximo aplicado si procede': ageNumber >= 75 ? 'Mitad de dosis por edad ≥75 años; máximo base 50 mg.' : 'Máximo 50 mg.',
        'Vía': 'IV bolo',
        'Repetición/frecuencia': 'Dosis única.',
        'Evitar si': 'Contraindicación mayor de fibrinólisis o ICP primaria disponible en tiempo.',
        'Reevaluar': 'Reperfusión a 60-90 min, sangrado, arritmias y necesidad de angiografía de rescate.',
      },
      interpretation: 'Fibrinólisis de SCACEST si no hay ICP primaria en tiempo y no hay contraindicación.',
      caution: 'No usar en SCASEST.',
    });
  }

  if (medication === 'alteplasa-sca') {
    const firstInfusion = Math.min(roundToTwo(weight * 0.75), 50);
    const secondInfusion = Math.min(roundToTwo(weight * 0.5), 35);
    const total = roundToTwo(15 + firstInfusion + secondInfusion);
    return doseResult({
      value: `${total} mg total`,
      fields: {
        'Fármaco': 'Alteplasa',
        'Peso': `${weight} kg`,
        'Dosis calculada': `15 mg bolo + ${firstInfusion} mg en 30 min + ${secondInfusion} mg en 60 min`,
        'Máximo aplicado si procede': 'Máximo total 100 mg; tramos máximos 50 mg y 35 mg.',
        'Vía': 'IV',
        'Repetición/frecuencia': 'Bolo y perfusión acelerada de 90 min.',
        'Evitar si': 'Contraindicación mayor de fibrinólisis o SCASEST.',
        'Reevaluar': 'Reperfusión, sangrado y traslado a centro con ICP.',
      },
      interpretation: 'Alternativa fibrinolítica en SCACEST si no hay ICP primaria en tiempo.',
      caution: 'Requiere antitrombótico coadyuvante y monitorización.',
    });
  }

  return null;
};

export const calculateFaDose = ({ medication, weightKg, renalSevere }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  if (medication === 'amiodarona') {
    const low = roundToTwo(weight * 5);
    const high = roundToTwo(weight * 7);
    return doseResult({
      value: `${low}-${high} mg`,
      fields: {
        'Fármaco': 'Amiodarona',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${low}-${high} mg (5-7 mg/kg)`,
        'Máximo aplicado si procede': 'Límite práctico de carga diaria visible: 1,2-1,8 g/24 h según respuesta.',
        'Vía': 'IV',
        'Repetición/frecuencia': 'Carga inicial; completar perfusión según respuesta y monitorización.',
        'Evitar si': 'QT largo, bradicardia marcada, BAV avanzado sin marcapasos o hipotensión grave.',
        'Reevaluar': 'Ritmo, QT, PA, frecuencia, K/Mg y necesidad de cardioversión eléctrica.',
      },
      interpretation: 'Opción de control de ritmo/frecuencia en FA seleccionada, especialmente si cardiopatía estructural.',
      caution: 'Monitorizar ECG y hemodinámica.',
    });
  }

  if (medication === 'flecainida') {
    const low = roundToTwo(weight * 1.5);
    const high = roundToTwo(weight * 3);
    return doseResult({
      value: `${low}-${high} mg`,
      fields: {
        'Fármaco': 'Flecainida',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${low}-${high} mg (1,5-3 mg/kg)`,
        'Máximo aplicado si procede': 'No se aplica máximo cerrado en esta calculadora; respetar pauta local y monitorización.',
        'Vía': 'IV en 20 min',
        'Repetición/frecuencia': 'Dosis única de cardioversión farmacológica.',
        'Evitar si': 'Cardiopatía estructural, enfermedad coronaria, HFrEF, QRS ancho o sospecha de preexcitación no controlada.',
        'Reevaluar': 'QRS, QT, PA, ritmo y necesidad de cardioversión eléctrica.',
      },
      interpretation: 'Solo en FA estable seleccionada sin cardiopatía estructural significativa.',
      caution: 'No combinar con antiarrítmicos clase III en el mismo momento.',
    });
  }

  if (medication === 'propafenona') {
    const low = roundToTwo(weight * 1.5);
    const high = roundToTwo(weight * 2);
    return doseResult({
      value: `${low}-${high} mg`,
      fields: {
        'Fármaco': 'Propafenona',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${low}-${high} mg (1,5-2 mg/kg)`,
        'Máximo aplicado si procede': 'No se aplica máximo cerrado en esta calculadora; respetar pauta local y monitorización.',
        'Vía': 'IV en 20 min',
        'Repetición/frecuencia': 'Dosis única de cardioversión farmacológica.',
        'Evitar si': 'Cardiopatía estructural, HFrEF, enfermedad coronaria, broncoespasmo grave o trastorno de conducción relevante.',
        'Reevaluar': 'QRS, QT, PA, ritmo y necesidad de cardioversión eléctrica.',
      },
      interpretation: 'Solo en FA estable seleccionada sin cardiopatía estructural significativa.',
      caution: 'Monitorización ECG durante y después de la administración.',
    });
  }

  if (medication === 'enoxaparina-fa') {
    const dose = roundToOne(weight);
    return doseResult({
      value: `${dose} mg`,
      fields: {
        'Fármaco': 'Enoxaparina',
        'Peso': `${weight} kg`,
        'Dosis calculada': `${dose} mg (1 mg/kg)`,
        'Máximo aplicado si procede': 'No se muestra máximo cerrado; ajustar a presentación, sangrado y contexto.',
        'Vía': 'SC',
        'Repetición/frecuencia': renalSevere ? 'Cada 24 h si ClCr 15-30 ml/min.' : 'Cada 12 h si ClCr ≥30 ml/min.',
        'Evitar si': 'Sangrado activo, HIT, contraindicación de anticoagulación o ClCr <15 ml/min fuera de indicación especializada.',
        'Reevaluar': 'Cockcroft-Gault, sangrado, plaquetas y transición a anticoagulación definitiva.',
      },
      interpretation: 'Puente anticoagulante si se elige HBPM en FA y el contexto lo justifica.',
      caution: 'No duplica la decisión CHA2DS2-VA/HAS-BLED; solo calcula dosis si ya se decidió usarla.',
    });
  }

  return null;
};

export const calculateStrokeThrombolysisDose = ({ weightKg }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  const total = Math.min(roundToTwo(weight * 0.9), 90);
  const bolus = roundToTwo(total * 0.1);
  const infusion = roundToTwo(total - bolus);

  return doseResult({
    value: `${total} mg total`,
    fields: {
      'Fármaco': 'Alteplasa',
      'Peso': `${weight} kg`,
      'Dosis calculada': `${total} mg total: ${bolus} mg bolo + ${infusion} mg perfusión`,
      'Máximo aplicado si procede': '90 mg total.',
      'Vía': 'IV',
      'Repetición/frecuencia': '10% en bolo inicial y 90% en 60 min.',
      'Evitar si': 'Contraindicación de fibrinólisis, hemorragia intracraneal o criterios de exclusión del código ictus.',
      'Reevaluar': 'NIHSS, PA, sangrado, angioedema y necesidad de trombectomía/traslado.',
    },
    interpretation: 'Trombolisis IV si candidato confirmado por código ictus.',
    caution: 'No iniciar sin verificar criterios de inclusión/exclusión y neuroimagen.',
  });
};

export const calculateVascularHeparinDose = ({ weightKg }) => {
  const weight = numeric(weightKg);
  if (!weight) return null;

  const bolus = Math.round(weight * 80);
  const infusion = Math.round(weight * 18);

  return doseResult({
    value: `${bolus} UI bolo`,
    fields: {
      'Fármaco': 'Heparina sódica',
      'Peso': `${weight} kg`,
      'Dosis calculada': `${bolus} UI bolo + ${infusion} UI/h perfusión`,
      'Máximo aplicado si procede': 'Alternativa visible: bolo 5.000 UI y perfusión 1.300 UI/h según contexto.',
      'Vía': 'IV',
      'Repetición/frecuencia': 'Perfusión continua ajustada a TTPA.',
      'Evitar si': 'Sangrado activo, HIT o contraindicación hemorrágica/especializada.',
      'Reevaluar': 'TTPA/anti-Xa, sangrado, plaquetas, TA, perfusión, lactato y plan de reperfusión/procedimiento.',
    },
    interpretation: 'Apoyo al cálculo de heparina sódica IV ajustable cuando se indica anticoagulación por peso.',
    caution: 'En TEP inestable, alto riesgo hemorrágico o posible reperfusión, coordinar con UCI/especialista y protocolo local.',
  });
};

const normalizeFio2 = (fio2) => {
  const value = Number(fio2);
  if (!value || value <= 0) return 0;
  return value > 1 ? value / 100 : value;
};

export const calculateVmniPredictedWeight = ({ sex, heightCm }) => {
  const height = Number(heightCm);
  if (!height || height <= 0) return null;

  const inchesOverFiveFeet = Math.max(0, (height - 152.4) / 2.54);
  const predicted = sex === 'female' ? 45.5 + 2.3 * inchesOverFiveFeet : 50 + 2.3 * inchesOverFiveFeet;

  return {
    value: roundToOne(predicted),
    unit: 'kg',
    interpretation: 'Peso predicho útil para estimar volumen corriente objetivo y evitar sobredimensionar por peso real.',
    caution: 'En talla < 152 cm se muestra el peso base de la fórmula; ajustar con criterio clínico local.',
  };
};

export const calculateVmniTidalVolume = ({ predictedWeightKg, mlKgLow, mlKgHigh }) => {
  const weight = Number(predictedWeightKg);
  const low = Number(mlKgLow);
  const high = Number(mlKgHigh);
  if (!weight || !low || !high || low <= 0 || high <= 0) return null;

  const min = roundToOne(weight * Math.min(low, high));
  const max = roundToOne(weight * Math.max(low, high));

  return {
    value: `${min}-${max}`,
    unit: 'mL',
    interpretation: 'Rango orientativo de VT objetivo para vigilar ventilación, fugas y tolerancia durante VMNI.',
    caution: 'No es un objetivo rígido: prioriza clínica, pH/PaCO2, fugas, asincronía y riesgo de fracaso.',
  };
};

export const calculateVmniPressureSupport = ({ ipap, epap }) => {
  const ipapValue = Number(ipap);
  const epapValue = Number(epap);
  if (!ipapValue || !epapValue || ipapValue <= 0 || epapValue < 0) return null;

  const pressureSupport = roundToOne(ipapValue - epapValue);

  return {
    value: pressureSupport,
    unit: 'cmH2O',
    interpretation:
      pressureSupport > 0
        ? 'PS = IPAP - EPAP. Más PS suele aumentar ventilación; revisa tolerancia, fugas, volúmenes y PaCO2.'
        : 'IPAP debe ser mayor que EPAP para aportar soporte inspiratorio efectivo en S/T.',
    caution: 'Si necesitas cambios rápidos o la clínica empeora, reevaluar indicación y escalada.',
  };
};

export const calculateVmniPao2Fio2 = ({ pao2, fio2 }) => {
  const pao2Value = Number(pao2);
  const fio2Fraction = normalizeFio2(fio2);
  if (!pao2Value || !fio2Fraction) return null;

  const ratio = pao2Value / fio2Fraction;

  return {
    value: Math.round(ratio),
    unit: 'mmHg',
    interpretation:
      ratio < 100
        ? 'Hipoxemia muy grave. Revalorar soporte, causa, UCI/intubación y respuesta inmediata.'
        : ratio < 200
          ? 'Hipoxemia moderada-grave. Vigilar estrechamente y buscar fracaso precoz.'
          : ratio < 300
            ? 'Hipoxemia leve-moderada. Interpretar con clínica y evolución.'
            : 'Oxigenación conservada o mejorada para este índice.',
    caution: 'Usar FiO2 como fracción o porcentaje. El índice no sustituye valoración clínica ni tendencia.',
  };
};

export const calculateVmniSpo2Fio2 = ({ spo2, fio2 }) => {
  const spo2Value = Number(spo2);
  const fio2Fraction = normalizeFio2(fio2);
  if (!spo2Value || !fio2Fraction) return null;

  const ratio = spo2Value / fio2Fraction;

  return {
    value: Math.round(ratio),
    unit: '',
    interpretation:
      ratio < 235
        ? 'Relación baja. Orienta a hipoxemia relevante; si la decisión es crítica, confirmar con gasometría.'
        : ratio < 315
          ? 'Relación intermedia. Seguir tendencia, trabajo respiratorio y necesidad de FiO2.'
          : 'Relación orientativamente favorable si la lectura de SpO2 es fiable.',
    caution: 'Orientativo: no sustituye gasometría cuando se necesita PaO2, PaCO2 o pH.',
  };
};

export const calculateVmniReassessment = ({
  initialPh,
  followUpPh,
  initialPaco2,
  followUpPaco2,
  initialRr,
  currentRr,
  initialSpo2,
  currentSpo2,
}) => {
  const ph0 = Number(initialPh);
  const ph1 = Number(followUpPh);
  const co20 = Number(initialPaco2);
  const co21 = Number(followUpPaco2);
  const rr0 = Number(initialRr);
  const rr1 = Number(currentRr);
  const spo20 = Number(initialSpo2);
  const spo21 = Number(currentSpo2);

  if (!ph0 || !ph1 || !co20 || !co21 || !rr0 || !rr1 || !spo20 || !spo21) return null;

  const phImproves = ph1 > ph0;
  const co2Improves = co21 < co20;
  const rrImproves = rr1 < rr0;
  const spo2Improves = spo21 >= spo20;
  const positives = [phImproves, co2Improves, rrImproves, spo2Improves].filter(Boolean).length;
  const worsens = ph1 < ph0 || co21 > co20 || rr1 > rr0 + 2 || spo21 < spo20;

  return {
    value: positives,
    unit: 'criterios favorables',
    interpretation: worsens
      ? 'Empeora o no sigue una tendencia segura. Reevaluar fugas, ajustes, causa y escalada/UCI sin retrasar intubación si hay deterioro.'
      : positives >= 3
        ? 'Tendencia favorable. Mantener vigilancia, ajustar confort/fugas y repetir control según evolución.'
        : 'Respuesta insuficiente o parcial. Revisar indicación, ajustes, sincronía y necesidad de ayuda experta.',
    caution: 'No decide intubación automáticamente. La clínica, el nivel de conciencia y la disponibilidad de soporte avanzado mandan.',
  };
};

export const calculateFluidRemaining = ({
  targetMl,
  crystalloidGivenMl,
  urineMl,
  urineHours,
  weightKg,
  vomitingMl,
  diarrheaMl,
  drainsMl,
  bleedingMl,
  feverSweatMl,
}) => {
  const target = numeric(targetMl);
  const given = numeric(crystalloidGivenMl);

  if (!target && !given) return null;

  const urine = numeric(urineMl);
  const hours = numeric(urineHours);
  const weight = numeric(weightKg);
  const losses = fluidLossesTotal({ vomitingMl, diarrheaMl, drainsMl, bleedingMl, feverSweatMl });
  const remaining = target ? Math.max(target - given, 0) : 0;
  const netBalance = given - urine - losses;
  const urineMlHour = urine && hours ? urine / hours : null;
  const urineMlKgHour = urineMlHour && weight ? urineMlHour / weight : null;
  const warnings = fluidBalanceWarnings({ urineMl, urineHours, weightKg, netBalance });

  return {
    value: Math.round(remaining),
    unit: 'mL pendientes',
    interpretation: 'Cálculo principal: objetivo total menos cristaloide ya administrado. La diuresis no se resta del objetivo inicial de resucitación.',
    fields: {
      'Objetivo total': target ? `${Math.round(target)} mL` : 'No indicado',
      'Cristaloide administrado': `${Math.round(given)} mL`,
      'Volumen pendiente': `${Math.round(remaining)} mL`,
      'Diuresis': urine ? `${Math.round(urine)} mL` : 'No introducida',
      'Diuresis ml/h': urineMlHour ? `${roundToOne(urineMlHour)} mL/h` : 'No calculable',
      'Diuresis ml/kg/h': urineMlKgHour ? `${roundToTwo(urineMlKgHour)} mL/kg/h` : 'No calculable',
      'Otras pérdidas': `${Math.round(losses)} mL`,
      'Balance neto aproximado': `${Math.round(netBalance)} mL`,
    },
    caution:
      warnings.length > 0
        ? warnings.join(' ')
        : 'Usar diuresis y balance como datos de reevaluación; no indicar nuevos bolos solo por oliguria aislada.',
  };
};

export const calculateSimpleFluidBalance = ({
  ivIntakeMl,
  oralIntakeMl,
  urineMl,
  urineHours,
  weightKg,
  vomitingDiarrheaDrainsMl,
  estimatedLossesMl,
}) => {
  const iv = numeric(ivIntakeMl);
  const oral = numeric(oralIntakeMl);
  const urine = numeric(urineMl);
  const hours = numeric(urineHours);
  const weight = numeric(weightKg);
  const otherLosses = numeric(vomitingDiarrheaDrainsMl) + numeric(estimatedLossesMl);
  const totalIntake = iv + oral;
  const netBalance = totalIntake - urine - otherLosses;
  const urineMlHour = urine && hours ? urine / hours : null;
  const urineMlKgHour = urineMlHour && weight ? urineMlHour / weight : null;
  const warnings = fluidBalanceWarnings({ urineMl, urineHours, weightKg, netBalance });

  if (!totalIntake && !urine && !otherLosses) return null;

  return {
    value: Math.round(netBalance),
    unit: 'mL netos',
    interpretation:
      netBalance > 0
        ? 'Balance positivo aproximado. Interpretar con perfusión, congestión, función renal y evolución.'
        : netBalance < 0
          ? 'Balance negativo aproximado. Interpretar con clínica, pérdidas activas, TA, lactato y función renal.'
          : 'Balance neutro aproximado.',
    fields: {
      'Ingresos IV': `${Math.round(iv)} mL`,
      'Ingresos orales': `${Math.round(oral)} mL`,
      'Diuresis': `${Math.round(urine)} mL`,
      'Diuresis ml/h': urineMlHour ? `${roundToOne(urineMlHour)} mL/h` : 'No calculable',
      'Diuresis ml/kg/h': urineMlKgHour ? `${roundToTwo(urineMlKgHour)} mL/kg/h` : 'No calculable',
      'Otras pérdidas': `${Math.round(otherLosses)} mL`,
      'Balance neto': `${Math.round(netBalance)} mL`,
    },
    caution:
      warnings.length > 0
        ? warnings.join(' ')
        : 'La diuresis aislada no decide bolos, UCI, intubación ni vasopresor; obliga a reevaluar el contexto.',
  };
};

export const calculateFluidBolusByWeight = ({ weightKg, mlKg = 10, maxBolusMl = 500 }) => {
  const weight = numeric(weightKg);
  const dose = numeric(mlKg);
  const max = numeric(maxBolusMl);

  if (!weight || !dose) return null;

  const calculated = weight * dose;
  const bolus = max ? Math.min(calculated, max) : calculated;
  const maxApplied = max && calculated > max;

  return {
    value: Math.round(bolus),
    unit: 'mL',
    interpretation: 'Bolo orientativo para reevaluación clínica; no sustituye valoración de perfusión, congestión ni respuesta.',
    fields: {
      Peso: `${weight} kg`,
      'Rango usado': `${dose} mL/kg`,
      'Volumen calculado': `${Math.round(calculated)} mL`,
      'Máximo aplicado': maxApplied ? `${Math.round(max)} mL` : 'No',
      Vía: 'IV',
      Reevaluar: 'TA, FC, relleno capilar, trabajo respiratorio, SatO2, auscultación, diuresis y lactato si procede.',
    },
    caution: 'En anciano, insuficiencia cardiaca, ERC o cirrosis, usar bolos más cautos y reevaluar con mayor frecuencia.',
  };
};

export const calculateSepsisThirtyMlKg = ({ weightKg, crystalloidGivenMl }) => {
  const weight = numeric(weightKg);
  const given = numeric(crystalloidGivenMl);

  if (!weight) return null;

  const target = weight * 30;
  const remaining = Math.max(target - given, 0);

  return {
    value: Math.round(remaining),
    unit: 'mL pendientes',
    interpretation:
      'Objetivo orientativo 30 mL/kg si hay hipoperfusión inducida por sepsis o shock séptico. Individualizar y reevaluar respuesta y sobrecarga.',
    fields: {
      Peso: `${weight} kg`,
      'Objetivo 30 mL/kg': `${Math.round(target)} mL`,
      'Cristaloide administrado': `${Math.round(given)} mL`,
      'Volumen pendiente': `${Math.round(remaining)} mL`,
      Plazo: 'Primeras 3 h si sepsis con hipoperfusión o shock séptico, según contexto clínico.',
      Reevaluar: 'Perfusión, TA/PAM, lactato, diuresis, congestión pulmonar, necesidad de vasopresor/UCI.',
    },
    caution: 'No administrar de forma automática si hay riesgo de sobrecarga; no retrasar vasopresor/UCI si shock persiste.',
  };
};

export const calculateAdultMaintenanceFluids = ({ weightKg, mlKgDay = 25 }) => {
  const weight = numeric(weightKg);
  const dose = numeric(mlKgDay);

  if (!weight || !dose) return null;

  const daily = weight * dose;
  const hourly = daily / 24;

  return {
    value: Math.round(daily),
    unit: 'mL/día',
    interpretation: 'Mantenimiento adulto orientativo si no puede recibir vía oral/enteral; ajustar por pérdidas, comorbilidad y electrolitos.',
    fields: {
      Peso: `${weight} kg`,
      'Rango usado': `${dose} mL/kg/día`,
      'Volumen diario': `${Math.round(daily)} mL/día`,
      'Velocidad aproximada': `${Math.round(hourly)} mL/h`,
      Reevaluar: 'Na/K/Cl, glucemia, creatinina, balance, edema, diuresis y tolerancia oral.',
    },
    caution: 'Reducir o individualizar en fragilidad, insuficiencia cardiaca, ERC, cirrosis, riesgo de sobrecarga o hiponatremia.',
  };
};

export const calculateInfusionRate = ({ volumeMl, hours }) => {
  const volume = numeric(volumeMl);
  const duration = numeric(hours);

  if (!volume || !duration) return null;

  const rate = volume / duration;

  return {
    value: Math.round(rate),
    unit: 'mL/h',
    interpretation: 'Velocidad de perfusión para el volumen y tiempo indicados; ajustar a respuesta clínica y prescripción local.',
    fields: {
      Volumen: `${Math.round(volume)} mL`,
      Tiempo: `${duration} h`,
      'Velocidad': `${roundToOne(rate)} mL/h`,
      Reevaluar: 'Vía venosa, bomba, objetivo terapéutico, balance, electrolitos y tolerancia.',
    },
    caution: 'No decide el volumen total ni el tipo de líquido; solo convierte volumen/tiempo en mL/h.',
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
  'wells-tep': {
    id: 'wells-tep',
    title: 'Wells TEP',
    shortTitle: 'Wells TEP',
    moduleId: 'tep',
    block: 'Tromboembolismo pulmonar',
    chapter: 'ESC TEP 2019 + NICE NG158',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Probabilidad clínica pretest para decidir dímero D o imagen directa en sospecha estable de TEP.',
    bibliography: [
      escPeEntry({
        id: 'wells-tep-esc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'ESC recomienda valorar probabilidad clínica antes de dímero D o imagen en sospecha de TEP.',
      }),
      niceVteEntry({
        id: 'wells-tep-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'NICE usa puntuación de Wells para orientar dímero D o imagen en sospecha de TEP.',
      }),
    ],
  },
  'spesi-tep': {
    id: 'spesi-tep',
    title: 'sPESI',
    shortTitle: 'sPESI',
    moduleId: 'tep',
    block: 'Tromboembolismo pulmonar',
    chapter: 'ESC TEP 2019',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Estratificación pronóstica simple para apoyar destino en TEP confirmado estable.',
    bibliography: [
      escPeEntry({
        id: 'spesi-tep-esc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'ESC integra sPESI/PESI en la estratificación de riesgo y selección de bajo riesgo.',
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
  'seizure-dose': {
    id: 'seizure-dose',
    title: 'Dosis antiepilépticos por peso',
    shortTitle: 'Dosis crisis',
    moduleId: 'crisis-convulsiva-epilepsia',
    block: 'Crisis convulsiva / epilepsia',
    chapter: 'Cap. 63 + SEN/NICE/AES',
    verifiedPage: 438,
    pdfPage: 463,
    status: 'implementado',
    summary: 'Calcula dosis de fármacos usados en crisis prolongada o estatus cuando dependen del peso.',
    bibliography: [
      referenceEntry({
        id: 'seizure-dose-murillo',
        indexPage: 435,
        verifiedPage: 438,
        pdfPage: 463,
        note: 'Dosis por peso de benzodiacepinas y segunda línea en crisis prolongada/estatus.',
      }),
      senEpilepsyEntry({
        id: 'seizure-dose-sen',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia española de apoyo para crisis epilépticas y epilepsia en urgencias.',
      }),
    ],
  },
  'anaphylaxis-adrenaline': {
    id: 'anaphylaxis-adrenaline',
    title: 'Adrenalina IM por peso',
    shortTitle: 'Adrenalina IM',
    moduleId: 'anafilaxia',
    block: 'Anafilaxia',
    chapter: 'Cap. 190 + NICE/RCUK',
    verifiedPage: 1059,
    pdfPage: 1084,
    status: 'implementado',
    summary: 'Calcula adrenalina IM 1 mg/ml por peso y grupo adulto/pediátrico con máximo aplicado.',
    bibliography: [
      referenceEntry({
        id: 'anaphylaxis-adrenaline-murillo',
        indexPage: 1059,
        verifiedPage: 1059,
        pdfPage: 1084,
        note: 'Adrenalina IM como primera línea y repetición en anafilaxia.',
      }),
      niceAnaphylaxisEntry({
        id: 'anaphylaxis-adrenaline-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Observación y alta tras tratamiento de emergencia de anafilaxia.',
      }),
      rcukAnaphylaxisEntry({
        id: 'anaphylaxis-adrenaline-rcuk',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Adrenalina IM, dosis por grupo y repetición según respuesta.',
      }),
    ],
  },
  'sca-dose': {
    id: 'sca-dose',
    title: 'Dosis SCA por peso',
    shortTitle: 'Dosis SCA',
    moduleId: 'sindrome-coronario-agudo',
    block: 'Síndrome coronario agudo',
    chapter: 'ESC SCA 2023 + Cap. 26',
    verifiedPage: 224,
    pdfPage: 249,
    status: 'implementado',
    summary: 'Calcula anticoagulación/fibrinólisis del SCA cuando depende de peso, edad o función renal.',
    bibliography: [
      escScaEntry({
        id: 'sca-dose-esc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Anticoagulación y fibrinólisis en SCA según estrategia clínica.',
      }),
      referenceEntry({
        id: 'sca-dose-murillo',
        indexPage: 214,
        verifiedPage: 224,
        pdfPage: 249,
        note: 'Dosis de heparina, enoxaparina y fibrinolíticos en SCA.',
      }),
    ],
  },
  'fa-dose': {
    id: 'fa-dose',
    title: 'Dosis FA por peso',
    shortTitle: 'Dosis FA',
    moduleId: 'fibrilacion-auricular',
    block: 'Fibrilación auricular',
    chapter: 'ESC FA 2024 + CIMA',
    verifiedPage: 43,
    pdfPage: 43,
    status: 'implementado',
    summary: 'Calcula fármacos ya visibles de FA cuando la pauta depende de peso o función renal.',
    bibliography: [
      escFaEntry({
        id: 'fa-dose-esc',
        verifiedPages: [43, 44, 45, 46, 47, 48],
        pdfPages: [43, 44, 45, 46, 47, 48],
        note: 'Cardioversión, antiarrítmicos y anticoagulación según contexto de FA.',
      }),
    ],
  },
  'stroke-thrombolysis-dose': {
    id: 'stroke-thrombolysis-dose',
    title: 'Alteplasa ictus por peso',
    shortTitle: 'Alteplasa ictus',
    moduleId: 'ictus-isquemico',
    block: 'Ictus isquémico',
    chapter: 'AHA/ASA 2026 + Cap. 64',
    verifiedPage: 442,
    pdfPage: 467,
    status: 'implementado',
    summary: 'Calcula alteplasa IV 0,9 mg/kg con máximo y reparto bolo/perfusión.',
    bibliography: [
      ahaIschemicStrokeEntry({
        id: 'stroke-thrombolysis-aha',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Trombolisis IV en candidato seleccionado dentro del circuito de ictus.',
      }),
      referenceEntry({
        id: 'stroke-thrombolysis-murillo',
        indexPage: 442,
        verifiedPage: 442,
        pdfPage: 467,
        note: 'Dosis de trombolisis intravenosa en ictus isquémico.',
      }),
    ],
  },
  'vascular-heparin-dose': {
    id: 'vascular-heparin-dose',
    title: 'Heparina IV por peso',
    shortTitle: 'Heparina IV',
    moduleId: 'tep',
    block: 'Anticoagulación IV',
    chapter: 'TEP / vascular',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    summary: 'Calcula bolo y perfusión de heparina sódica IV cuando se indica anticoagulación ajustable.',
    bibliography: [
      escPeEntry({
        id: 'heparin-iv-tep-esc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'La HNF IV es útil si se prevé reperfusión, inestabilidad o necesidad de reversibilidad/ajuste estrecho.',
      }),
      referenceEntry({
        id: 'vascular-heparin-murillo',
        indexPage: 340,
        verifiedPage: 340,
        pdfPage: 365,
        note: 'Pauta ponderal de heparina IV reutilizada como cálculo de anticoagulación ajustable.',
      }),
    ],
  },
  'vmni-predicted-weight': {
    id: 'vmni-predicted-weight',
    title: 'Peso ideal / predicho',
    shortTitle: 'Peso predicho',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Peso predicho por sexo y talla para estimar volumen corriente objetivo.',
    bibliography: [
      ersAtsVmniEntry({
        id: 'vmni-predicted-weight-ersats',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Monitorización de respuesta ventilatoria durante VMNI; el peso predicho apoya la lectura de volumen corriente.',
      }),
    ],
  },
  'vmni-tidal-volume': {
    id: 'vmni-tidal-volume',
    title: 'Volumen corriente objetivo',
    shortTitle: 'VT objetivo',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Rango de VT orientativo a partir de peso predicho y ml/kg seleccionados.',
    bibliography: [
      localV60Entry({
        id: 'vmni-vt-v60',
        verifiedPages: [4, 6],
        pdfPages: [4, 6],
        note: 'El equipo muestra volúmenes y puede usar objetivos de volumen en modos específicos; interpretar con fugas y tolerancia.',
      }),
      ersAtsVmniEntry({
        id: 'vmni-vt-ersats',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'La respuesta ventilatoria se interpreta junto a clínica, gasometría y riesgo de fracaso.',
      }),
    ],
  },
  'vmni-pressure-support': {
    id: 'vmni-pressure-support',
    title: 'Presión de soporte',
    shortTitle: 'PS',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Calcula PS = IPAP − EPAP para interpretar el soporte ventilatorio.',
    bibliography: [
      localV60Entry({
        id: 'vmni-ps-v60',
        verifiedPages: [4, 6],
        pdfPages: [4, 6],
        note: 'Modos con IPAP/EPAP y ajustes de presión en VMNI.',
      }),
    ],
  },
  'vmni-pao2-fio2': {
    id: 'vmni-pao2-fio2',
    title: 'PaO2/FiO2',
    shortTitle: 'P/F',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Índice de oxigenación con PaO2 y FiO2 configurada.',
    bibliography: [
      ersAtsVmniEntry({
        id: 'vmni-pao2fio2-ersats',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'La oxigenación y la necesidad de escalada se interpretan junto a trabajo respiratorio y evolución.',
      }),
    ],
  },
  'vmni-spo2-fio2': {
    id: 'vmni-spo2-fio2',
    title: 'SpO2/FiO2',
    shortTitle: 'S/F',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Índice aproximado si no hay PaO2 inmediata; no sustituye gasometría.',
    bibliography: [
      ersAtsVmniEntry({
        id: 'vmni-spo2fio2-ersats',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'La respuesta a VMNI debe confirmarse con gasometría cuando hay hipercapnia/acidosis o decisión crítica.',
      }),
    ],
  },
  'vmni-reassessment': {
    id: 'vmni-reassessment',
    title: 'Reevaluación VMNI',
    shortTitle: 'Reevaluación',
    moduleId: 'vmni',
    block: 'VMNI',
    chapter: 'Procedimiento VMNI',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Compara pH, PaCO2, FR y SatO2 para orientar respuesta a 1-2 h.',
    bibliography: [
      ersAtsVmniEntry({
        id: 'vmni-reevaluacion-ersats',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Monitorización estrecha de respuesta y acceso rápido a intubación si no mejora.',
      }),
      localV60Entry({
        id: 'vmni-reevaluacion-v60',
        verifiedPages: [6, 9],
        pdfPages: [6, 9],
        note: 'Revisión de fugas, alarmas y sincronía en el equipo local.',
      }),
    ],
  },
  'fluid-remaining': {
    id: 'fluid-remaining',
    title: 'Volumen pendiente / líquidos ya administrados',
    shortTitle: 'Volumen pendiente',
    moduleId: 'urgencias',
    block: 'Urgencias',
    chapter: 'Cap. 18 · Shock',
    verifiedPage: 154,
    pdfPage: 179,
    status: 'implementado',
    summary: 'Calcula objetivo menos cristaloide administrado y añade diuresis/balance como reevaluación.',
    bibliography: [
      niceFluidEntry({
        id: 'fluid-remaining-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Cálculo de volumen administrado/pendiente integrado con reevaluación clínica y balance.',
      }),
      referenceEntry({
        id: 'fluid-remaining-murillo',
        indexPage: 154,
        verifiedPage: 154,
        pdfPage: 179,
        note: 'Apoyo práctico para reevaluación de perfusión, respuesta y riesgo de sobrecarga durante resucitación.',
      }),
    ],
  },
  'simple-fluid-balance': {
    id: 'simple-fluid-balance',
    title: 'Balance simple',
    shortTitle: 'Balance simple',
    moduleId: 'urgencias',
    block: 'Urgencias',
    chapter: 'Cap. 18 · Shock',
    verifiedPage: 154,
    pdfPage: 179,
    status: 'implementado',
    summary: 'Balance aproximado con ingresos, diuresis y pérdidas, incluyendo ml/kg/h si hay peso y tiempo.',
    bibliography: [
      niceFluidEntry({
        id: 'simple-fluid-balance-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'NICE estructura indicación, pérdidas y reevaluación en fluidoterapia IV.',
      }),
      referenceEntry({
        id: 'simple-fluid-balance-murillo',
        indexPage: 154,
        verifiedPage: 154,
        pdfPage: 179,
        note: 'Apoyo práctico para seguimiento de perfusión, diuresis y sobrecarga durante reevaluación clínica.',
      }),
    ],
  },
  'fluid-bolus-weight': {
    id: 'fluid-bolus-weight',
    title: 'Bolo de cristaloide por peso',
    shortTitle: 'Bolo por peso',
    moduleId: 'urgencias',
    block: 'Fluidoterapia IV',
    chapter: 'NICE CG174 · Fluidoterapia IV',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Calcula un bolo orientativo por mL/kg con máximo configurable y obliga a reevaluar.',
    bibliography: [
      niceFluidEntry({
        id: 'fluid-bolus-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'NICE recomienda bolos de cristaloide para resucitación con reevaluación clínica.',
      }),
    ],
  },
  'sepsis-30mlkg': {
    id: 'sepsis-30mlkg',
    title: 'Sepsis 30 mL/kg',
    shortTitle: '30 mL/kg sepsis',
    moduleId: 'sepsis',
    block: 'Sepsis',
    chapter: 'SSC Sepsis 2021',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Calcula objetivo 30 mL/kg y volumen pendiente en sepsis con hipoperfusión o shock.',
    bibliography: [
      sscSepsisEntry({
        id: 'sepsis-30mlkg-ssc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'SSC 2021 sugiere al menos 30 mL/kg en primeras 3 h si hipoperfusión inducida por sepsis o shock séptico.',
      }),
    ],
  },
  'maintenance-fluids-adult': {
    id: 'maintenance-fluids-adult',
    title: 'Mantenimiento adulto',
    shortTitle: 'Mantenimiento',
    moduleId: 'urgencias',
    block: 'Fluidoterapia IV',
    chapter: 'NICE CG174 · Fluidoterapia IV',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    summary: 'Estima mantenimiento diario adulto por peso y mL/kg/día seleccionado.',
    bibliography: [
      niceFluidEntry({
        id: 'maintenance-fluids-nice',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'NICE describe necesidades habituales de mantenimiento y ajuste por contexto clínico.',
      }),
    ],
  },
  'infusion-rate': {
    id: 'infusion-rate',
    title: 'Velocidad de perfusión',
    shortTitle: 'mL/h',
    moduleId: 'urgencias',
    block: 'Fluidoterapia IV',
    chapter: 'Cálculo de perfusión',
    verifiedPage: 154,
    pdfPage: 179,
    status: 'implementado',
    summary: 'Convierte volumen y tiempo en velocidad mL/h.',
    bibliography: [
      referenceEntry({
        id: 'infusion-rate-murillo',
        indexPage: 154,
        verifiedPage: 154,
        pdfPage: 179,
        note: 'Cálculo operativo de administración IV con reevaluación clínica.',
      }),
    ],
  },
};

export const implementedCalculators = Object.values(calculatorCatalog).filter((calculator) => calculator.status === 'implementado');

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
    status: 'implementado',
    note: 'Integrado en TEP para decidir dímero D frente a imagen directa.',
  },
  {
    id: 'spesi-tep',
    title: 'sPESI',
    chapter: 'Cap. 39 · Tromboembolia pulmonar',
    verifiedPage: 281,
    pdfPage: 306,
    status: 'implementado',
    note: 'Integrado en TEP para apoyar bajo riesgo y destino; PESI completo se descarta por complejidad.',
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
    id: 'seizure-dose',
    title: 'Dosis antiepilépticos por peso',
    chapter: 'Cap. 63 · Crisis epilépticas',
    verifiedPage: 438,
    pdfPage: 463,
    status: 'implementado',
    note: 'Integrado en tratamiento de crisis convulsiva para midazolam, diazepam rectal, valproato y fenitoína.',
  },
  {
    id: 'anaphylaxis-adrenaline',
    title: 'Adrenalina IM por peso',
    chapter: 'Cap. 190 · Anafilaxia',
    verifiedPage: 1059,
    pdfPage: 1084,
    status: 'implementado',
    note: 'Integrado en anafilaxia para calcular adrenalina IM por peso y grupo adulto/pediátrico.',
  },
  {
    id: 'sca-dose',
    title: 'Dosis SCA por peso',
    chapter: 'Cap. 26 · Síndrome coronario agudo',
    verifiedPage: 224,
    pdfPage: 249,
    status: 'implementado',
    note: 'Integrado en SCA para heparina, enoxaparina, tenecteplasa y alteplasa.',
  },
  {
    id: 'fa-dose',
    title: 'Dosis FA por peso',
    chapter: 'ESC FA 2024 · Fibrilación auricular',
    verifiedPage: 43,
    pdfPage: 43,
    status: 'implementado',
    note: 'Integrado en FA para antiarrítmicos y enoxaparina cuando se usa una pauta ponderal.',
  },
  {
    id: 'stroke-thrombolysis-dose',
    title: 'Alteplasa ictus por peso',
    chapter: 'Cap. 64 · Ictus',
    verifiedPage: 442,
    pdfPage: 467,
    status: 'implementado',
    note: 'Integrado en ictus isquémico para calcular 0,9 mg/kg, máximo 90 mg, bolo y perfusión.',
  },
  {
    id: 'vascular-heparin-dose',
    title: 'Heparina IV por peso',
    chapter: 'TEP / vascular',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    note: 'Integrado en TEP y vascular abdominal cuando se decide anticoagulación con heparina IV.',
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
