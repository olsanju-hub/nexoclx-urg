import { toNumber } from '../lib/clinicalToolEngine.js';

const round = (value, digits = 1) => (value === null || value === undefined ? null : Number(value.toFixed(digits)));

const lvoCondition = { any: [
  { id: 'lvoSigns', includes: 'aphasia' },
  { id: 'lvoSigns', includes: 'gaze' },
  { id: 'lvoSigns', includes: 'denseMotor' },
  { id: 'lvoSigns', includes: 'nihss' },
] };

const hypoperfusionCondition = { any: [
  { id: 'hypoperfusion', includes: 'mottled' },
  { id: 'hypoperfusion', includes: 'oliguria' },
  { id: 'hypoperfusion', includes: 'shockIndex' },
  { id: 'hypoperfusion', includes: 'cold' },
] };

const phStatus = (values) => {
  const ph = toNumber(values.ph);
  if (ph === null) return '';
  if (ph < 6.8 || ph > 7.8) return 'Valor extremo: comprobar muestra y transcripcion';
  if (ph < 7.35) return 'Acidemia';
  if (ph > 7.45) return 'Alcalemia';
  return 'pH normal: posible compensacion o trastorno mixto';
};

const primaryDisorder = (values) => {
  const ph = toNumber(values.ph);
  const pco2 = toNumber(values.pco2);
  const hco3 = toNumber(values.hco3);
  if ([ph, pco2, hco3].some((item) => item === null)) return '';
  const metabolicAcid = hco3 < 22;
  const metabolicAlk = hco3 > 26;
  const respAcid = pco2 > 45;
  const respAlk = pco2 < 35;
  if (ph < 7.35 && metabolicAcid && respAcid) return 'Acidemia mixta: acidosis metabolica + acidosis respiratoria';
  if (ph < 7.35 && metabolicAcid) return 'Acidosis metabolica predominante';
  if (ph < 7.35 && respAcid) return 'Acidosis respiratoria predominante';
  if (ph > 7.45 && metabolicAlk && respAlk) return 'Alcalemia mixta: alcalosis metabolica + alcalosis respiratoria';
  if (ph > 7.45 && metabolicAlk) return 'Alcalosis metabolica predominante';
  if (ph > 7.45 && respAlk) return 'Alcalosis respiratoria predominante';
  if (metabolicAcid && respAlk) return 'pH normal con acidosis metabolica + alcalosis respiratoria';
  if (metabolicAlk && respAcid) return 'pH normal: acidosis respiratoria cronica compensada o trastorno mixto';
  if (respAcid) return 'Acidosis respiratoria compensada posible';
  if (respAlk) return 'Alcalosis respiratoria compensada posible';
  return 'Sin trastorno primario evidente con estos datos';
};

const anionGap = (values) => {
  const na = toNumber(values.na);
  const cl = toNumber(values.cl);
  const hco3 = toNumber(values.hco3);
  if ([na, cl, hco3].some((item) => item === null)) return null;
  return round(na - cl - hco3);
};

const anionGapWithPotassium = (values) => {
  const gap = anionGap(values);
  const k = toNumber(values.k);
  if (gap === null || k === null) return null;
  return round(gap + k);
};

const correctedAnionGap = (values) => {
  const gap = anionGap(values);
  const albumin = toNumber(values.albumin);
  if (gap === null || albumin === null) return null;
  return round(gap + (2.5 * (4 - albumin)));
};

const interpretedAnionGap = (values) => correctedAnionGap(values) ?? anionGap(values);

const gapCategory = (values) => {
  const gap = interpretedAnionGap(values);
  if (gap === null) return '';
  if (gap > 12) return 'Anion gap elevado';
  if (gap < 8) return 'Anion gap bajo';
  return 'Anion gap normal';
};

const deltaRatio = (values) => {
  const gap = interpretedAnionGap(values);
  const hco3 = toNumber(values.hco3);
  if (gap === null || hco3 === null || gap <= 12 || hco3 >= 24) return null;
  return round((gap - 12) / (24 - hco3), 2);
};

const deltaInterpretation = (values) => {
  const ratio = deltaRatio(values);
  if (ratio === null) return '';
  if (ratio < 0.4) return 'Delta ratio bajo: acidosis metabolica sin gap anadida probable';
  if (ratio < 0.8) return 'Delta ratio bajo-intermedio: mezcla con acidosis hipercloremica posible';
  if (ratio <= 2) return 'Delta ratio compatible con acidosis metabolica con gap predominante';
  return 'Delta ratio alto: alcalosis metabolica o acidosis respiratoria cronica anadida posible';
};

const winterExpected = (values) => {
  const hco3 = toNumber(values.hco3);
  if (hco3 === null) return null;
  return round((1.5 * hco3) + 8);
};

const winterRange = (values) => {
  const ph = toNumber(values.ph);
  const hco3 = toNumber(values.hco3);
  if (ph === null || hco3 === null || ph >= 7.35 || hco3 >= 22) return '';
  const expected = winterExpected(values);
  if (expected === null) return '';
  return `${round(expected - 2)}-${round(expected + 2)} mmHg`;
};

const metabolicAlkalosisPco2Range = (values) => {
  const hco3 = toNumber(values.hco3);
  if (hco3 === null) return '';
  const expected = 40 + (0.7 * (hco3 - 24));
  return `${round(expected - 5)}-${round(expected + 5)} mmHg`;
};

const respiratoryCompensation = (values) => {
  const pco2 = toNumber(values.pco2);
  const hco3 = toNumber(values.hco3);
  if (pco2 === null || hco3 === null) return '';
  const delta = (pco2 - 40) / 10;
  if (pco2 > 45) {
    const acute = round(24 + delta);
    const chronic = round(24 + (3.5 * delta));
    return `Acidosis respiratoria: HCO3 esperado agudo ~${acute}, cronico ~${chronic} mEq/L`;
  }
  if (pco2 < 35) {
    const acute = round(24 + (2 * delta));
    const chronic = round(24 + (4 * delta));
    return `Alcalosis respiratoria: HCO3 esperado agudo ~${acute}, cronico ~${chronic} mEq/L`;
  }
  return '';
};

const compensationInterpretation = (values) => {
  const ph = toNumber(values.ph);
  const pco2 = toNumber(values.pco2);
  const hco3 = toNumber(values.hco3);
  if ([ph, pco2, hco3].some((item) => item === null)) return '';
  if (ph < 7.35 && hco3 < 22) {
    const expected = winterExpected(values);
    if (pco2 > expected + 2) return 'pCO2 mayor que Winter: acidosis respiratoria anadida o fatiga ventilatoria';
    if (pco2 < expected - 2) return 'pCO2 menor que Winter: alcalosis respiratoria anadida';
    return 'Compensacion respiratoria adecuada para acidosis metabolica';
  }
  if (ph > 7.45 && hco3 > 26) return `Alcalosis metabolica: pCO2 esperado ${metabolicAlkalosisPco2Range(values)}`;
  if ((ph < 7.35 && pco2 > 45) || (ph > 7.45 && pco2 < 35)) return respiratoryCompensation(values);
  if (ph >= 7.35 && ph <= 7.45 && hco3 < 22 && pco2 < 35) return 'pH normal con acidosis metabolica y alcalosis respiratoria: interpretar como mixto';
  if (ph >= 7.35 && ph <= 7.45 && hco3 > 26 && pco2 > 45) return 'pH normal con hipercapnia e HCO3 alto: acidosis respiratoria cronica compensada o mixto';
  if (ph >= 7.35 && ph <= 7.45) return 'Sin compensacion patologica evidente';
  return 'Interpretar con contexto clinico y muestra';
};

const pfRatio = (values) => {
  if (values.sampleType !== 'arterial') return null;
  const pao2 = toNumber(values.pao2);
  const fio2 = toNumber(values.fio2);
  if (pao2 === null || fio2 === null || fio2 < 21 || fio2 > 100) return null;
  return round(pao2 / (fio2 / 100), 0);
};

const dataQuality = (values) => {
  const ph = toNumber(values.ph);
  const pco2 = toNumber(values.pco2);
  const hco3 = toNumber(values.hco3);
  if ([ph, pco2, hco3].some((item) => item === null)) return '';
  if (ph < 6.8 || ph > 7.8 || pco2 < 10 || pco2 > 110 || hco3 < 3 || hco3 > 55) {
    return 'Dato extremo: comprobar identidad de muestra, unidades y transcripcion';
  }
  return '';
};

export const decisionProtocols = [
  {
    id: 'sepsis-shock',
    title: 'Sepsis y shock septico',
    description: 'Cribado adulto de gravedad, lactato, foco, reanimacion y destino.',
    status: 'Interactivo',
    assessment: {
      title: 'Asistente de sepsis en adultos',
      intro: 'Orienta gravedad y escalada; qSOFA no descarta sepsis ni sustituye la valoracion clinica.',
      copyPrefix: 'Valoracion sepsis/shock',
      fields: [
        { id: 'infection', label: 'Sospecha clinica de infeccion', type: 'select', required: true, options: [
          { value: 'yes', label: 'Si' },
          { value: 'no', label: 'No clara' },
        ] },
        { id: 'sbp', label: 'PAS', type: 'number', unit: 'mmHg', min: 40, max: 260, required: true },
        { id: 'map', label: 'PAM si disponible', type: 'number', unit: 'mmHg', min: 20, max: 160 },
        { id: 'rr', label: 'Frecuencia respiratoria', type: 'number', unit: 'rpm', min: 4, max: 70, required: true },
        { id: 'lactate', label: 'Lactato inicial', type: 'number', unit: 'mmol/L', min: 0, max: 30 },
        { id: 'mentalStatus', label: 'Confusion o deterioro neurologico nuevo', type: 'checkbox' },
        { id: 'fluidRisk', label: 'Alto riesgo de sobrecarga con fluidos', type: 'checkbox' },
        { id: 'hypoperfusion', label: 'Datos de hipoperfusion', type: 'multi', options: [
          { value: 'mottled', label: 'Piel moteada o relleno capilar lento' },
          { value: 'oliguria', label: 'Oliguria' },
          { value: 'shockIndex', label: 'Taquicardia desproporcionada' },
          { value: 'cold', label: 'Frialdad o mala perfusion periferica' },
        ] },
      ],
      calculations: [
        { id: 'qSOFA', type: 'sumScore', items: [
          { points: 1, when: { id: 'sbp', lte: 100 } },
          { points: 1, when: { id: 'rr', gte: 22 } },
          { points: 1, when: 'mentalStatus' },
        ] },
      ],
      interpretations: [
        {
          id: 'qsofa-high',
          when: { source: 'computed', id: 'qSOFA', gte: 2 },
          title: 'qSOFA elevado',
          body: 'Alerta de alto riesgo fuera de UCI. No diagnostica sepsis y un qSOFA bajo no la excluye.',
          actions: ['Acelerar valoracion, lactato, foco y monitorizacion.'],
        },
        {
          id: 'qsofa-low',
          when: { all: [{ source: 'computed', id: 'qSOFA', lte: 1 }, { id: 'infection', equals: 'yes' }] },
          title: 'qSOFA bajo con sospecha infecciosa',
          body: 'No usar qSOFA como prueba de descarte; si la impresion clinica preocupa, continuar cribado y reevaluacion.',
          actions: ['Valorar disfuncion organica, lactato, constantes seriadas y contexto de fragilidad/inmunosupresion.'],
        },
        {
          id: 'lactate-high',
          when: { id: 'lactate', gte: 2 },
          title: 'Lactato aumentado',
          body: 'Requiere interpretacion en contexto y medicion seriada si sepsis con hipoperfusion o shock.',
          actions: ['Buscar hipoperfusion, foco no controlado y causas no septicas de lactato.'],
        },
        {
          id: 'fluid-risk',
          when: 'fluidRisk',
          title: 'Riesgo de sobrecarga',
          body: 'Individualizar volumen; usar bolos pequenos, reevaluacion dinamica y monitorizacion estrecha.',
          actions: ['Considerar insuficiencia cardiaca, ERC avanzada, cirrosis, edad/frailty y respuesta al bolo.'],
        },
      ],
      outcomes: [
        {
          status: 'Shock',
          tone: 'alert',
          title: 'Tratar como sepsis con hipoperfusion/shock',
          body: 'Sospecha infecciosa con hipotension, lactato alto o signos de hipoperfusion.',
          when: { all: [
            { id: 'infection', equals: 'yes' },
            { any: [
              { id: 'sbp', lte: 90 },
              { id: 'map', lt: 65 },
              { id: 'lactate', gte: 4 },
              hypoperfusionCondition,
            ] },
          ] },
          actions: [
            'ABCDE, monitorizacion, vias, lactato, hemocultivos idealmente antes del antibiotico si no lo retrasan y control del foco.',
            'Antibiotico inmediato si shock o probabilidad alta; ajustar a foco, alergias, funcion renal, gravedad y epidemiologia local.',
            'Cristaloide como primera linea; considerar al menos 30 mL/kg en las primeras 3 h si hipoperfusion/shock, individualizando volumen y reevaluando respuesta dinamica.',
            'Si persiste PAM <65 o hipoperfusion tras fluidos adecuados, iniciar noradrenalina segun entorno y activar UCI/criticos.',
          ],
        },
        {
          status: 'Sepsis probable',
          tone: 'alert',
          title: 'Alta sospecha de sepsis sin shock franco',
          body: 'Sospecha infecciosa con qSOFA elevado o lactato aumentado.',
          when: { all: [
            { id: 'infection', equals: 'yes' },
            { any: [
              { source: 'computed', id: 'qSOFA', gte: 2 },
              { id: 'lactate', gte: 2 },
            ] },
          ] },
          actions: [
            'Completar foco, constantes seriadas, analitica dirigida y pruebas de imagen segun sospecha.',
            'Antibioterapia precoz si la probabilidad clinica es alta; evitar cobertura innecesaria de MDR/anaerobios si no hay factores de riesgo.',
            'Observar o ingresar segun disfuncion organica, comorbilidad, lactato, respuesta y seguridad del alta.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Vigilar',
        title: 'Sin criterios interactivos de sepsis de alto riesgo',
        body: 'La herramienta no descarta sepsis; solo resume los datos introducidos.',
        actions: [
          'Reevaluar si cambian constantes, estado mental, diuresis, lactato o impresion clinica.',
          'Usar protocolos locales de sepsis y juicio clinico para decidir observacion, alta o ingreso.',
        ],
      },
    },
    sources: [
      { label: 'Prescott HC, Antonelli M, Alhazzani W, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026. Crit Care Med. 2026.', url: 'https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026', supports: 'Lactato, hemocultivos, antibioticos, cristaloides, 30 mL/kg individualizado, reevaluacion dinamica y vasopresores.' },
      { label: 'Singer M, Deutschman CS, Seymour CW, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016.', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881', supports: 'Definicion de sepsis/shock septico y papel pronostico de qSOFA.' },
    ],
  },
  {
    id: 'codigo-ictus',
    title: 'Codigo ictus',
    description: 'Ventana terapeutica, datos minimos, imagen urgente y traslado util.',
    status: 'Interactivo',
    assessment: {
      title: 'Activacion de codigo ictus en adultos',
      intro: 'Orienta activacion; no sustituye neuroimagen, neurologia ni el protocolo territorial.',
      copyPrefix: 'Valoracion codigo ictus',
      fields: [
        { id: 'deficit', label: 'Deficit neurologico focal actual y discapacitante', type: 'select', required: true, options: [
          { value: 'yes', label: 'Si' },
          { value: 'resolved', label: 'Resuelto o no discapacitante' },
          { value: 'no', label: 'No claro' },
        ] },
        { id: 'onsetType', label: 'Tipo de inicio', type: 'select', required: true, options: [
          { value: 'known', label: 'Inicio conocido' },
          { value: 'wake', label: 'Ictus al despertar' },
          { value: 'unknown', label: 'Hora desconocida' },
        ] },
        { id: 'lastKnownWell', label: 'Ultima vez visto bien', type: 'number', unit: 'horas', min: 0, max: 72 },
        { id: 'symptomAge', label: 'Tiempo desde deteccion de sintomas', type: 'number', unit: 'horas', min: 0, max: 72 },
        { id: 'glucose', label: 'Glucemia capilar', type: 'number', unit: 'mg/dL', min: 10, max: 800, required: true },
        { id: 'lvoSigns', label: 'Datos sugerentes de oclusion de gran vaso', type: 'multi', options: [
          { value: 'aphasia', label: 'Afasia o negligencia' },
          { value: 'gaze', label: 'Desviacion de mirada' },
          { value: 'denseMotor', label: 'Hemiparesia densa' },
          { value: 'nihss', label: 'NIHSS alto si disponible' },
        ] },
        { id: 'anticoag', label: 'Anticoagulacion, cirugia reciente o sangrado activo', type: 'checkbox' },
        { id: 'bp', label: 'TA muy elevada no controlada', type: 'checkbox' },
      ],
      interpretations: [
        {
          id: 'glucose-low',
          when: { id: 'glucose', lt: 60 },
          title: 'Hipoglucemia como imitador',
          body: 'Corregir de inmediato. Si persiste focalidad tras corregir, mantener circuito de ictus.',
          actions: ['No usar la glucemia baja para cancelar automaticamente la activacion si el deficit persiste.'],
        },
        {
          id: 'lvo',
          when: lvoCondition,
          title: 'Sospecha de gran vaso',
          body: 'No es diagnostico definitivo. Aumenta prioridad de angio-TC y valoracion de trombectomia.',
          actions: ['Coordinar con centro capaz de trombectomia segun red territorial y tiempos reales.'],
        },
        {
          id: 'reperfusion-note',
          when: { id: 'deficit', equals: 'yes' },
          title: 'Reperfusion no automatizada',
          body: 'Alteplasa o tenecteplasa pueden ser opciones en adultos elegibles dentro de 4,5 h; en seleccion avanzada, algunos pacientes con inicio desconocido o 4,5-9 h pueden valorarse con imagen.',
          actions: ['Contraindicaciones, TA y eleccion del farmaco dependen de neuroimagen, protocolo local y equipo de ictus.'],
        },
      ],
      outcomes: [
        {
          status: 'Activar',
          tone: 'alert',
          title: 'Activar codigo ictus y neuroimagen urgente',
          body: 'Deficit focal discapacitante en ventana de trombolisis estandar o escenario que requiere seleccion por imagen.',
          all: [
            { id: 'deficit', equals: 'yes' },
            { any: [
              { all: [{ id: 'onsetType', equals: 'known' }, { id: 'lastKnownWell', lte: 4.5 }] },
              { all: [{ id: 'onsetType', equals: 'known' }, { id: 'lastKnownWell', lte: 24 }, lvoCondition] },
              { id: 'onsetType', equals: 'wake' },
              { id: 'onsetType', equals: 'unknown' },
            ] },
          ],
          actions: [
            'Registrar ultima vez visto bien, hora de deteccion, Rankin basal aproximado, glucemia, TA, anticoagulacion y situacion basal.',
            'TC craneal sin contraste; angio-TC si sospecha de gran vaso, ventana extendida o protocolo local.',
            'No retrasar pruebas ni traslado por contraindicaciones potenciales; se revisan antes de trombolisis/trombectomia.',
            'No recomendar trombolisis ni trombectomia sin neuroimagen y criterios territoriales.',
          ],
        },
        {
          status: 'AIT/observacion',
          title: 'Deficit resuelto o no discapacitante',
          body: 'No equivale a alta automatica: puede requerir circuito AIT/ictus segun riesgo y recurrencia.',
          any: [
            { id: 'deficit', equals: 'resolved' },
            { id: 'deficit', equals: 'no' },
          ],
          actions: [
            'Valorar imagen, ECG, vascular, antiagregacion/anticoagulacion segun diagnostico y riesgo hemorragico.',
            'Ingreso, observacion o via rapida segun riesgo, recurrencia, estenosis, FA, comorbilidad y soporte.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Datos',
        title: 'Completar datos o reevaluar focalidad',
        body: 'La decision depende de focalidad, ultima vez visto bien, glucemia y protocolo local.',
        actions: ['Descartar imitadores sin retrasar el circuito si el deficit focal persiste.'],
      },
    },
    sources: [
      { label: 'American Heart Association/American Stroke Association. 2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke. Stroke. 2026. doi:10.1161/STR.0000000000000513.', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000513', supports: 'Trombolisis con alteplasa o tenecteplasa, seleccion por imagen, trombectomia, triaje y sistemas de ictus.' },
      { label: 'American Heart Association. Top Things to Know: 2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke. 2026.', url: 'https://professional.heart.org/en/science-news/2026-guideline-for-the-early-management-of-patients-with-acute-ischemic-stroke/top-things-to-know', supports: 'Resumen oficial de cambios: tenecteplasa, ictus de despertar, LVO y destino prehospitalario.' },
    ],
  },
  {
    id: 'gasometria-acido-base',
    title: 'Gasometria y acido-base',
    description: 'pH, trastorno primario, anion gap, compensacion y P/F si arterial.',
    status: 'Calculadora',
    assessment: {
      title: 'Interpretador acido-base',
      intro: 'Calcula patrones; no decide tratamiento sin contexto clinico, muestra y evolucion.',
      copyPrefix: 'Gasometria acido-base',
      fields: [
        { id: 'sampleType', label: 'Tipo de muestra', type: 'select', required: true, options: [
          { value: 'arterial', label: 'Arterial' },
          { value: 'venous', label: 'Venosa' },
        ] },
        { id: 'ph', label: 'pH', type: 'number', min: 6.7, max: 7.8, required: true },
        { id: 'pco2', label: 'pCO2', type: 'number', unit: 'mmHg', min: 5, max: 120, required: true },
        { id: 'hco3', label: 'HCO3 medido/calculado', type: 'number', unit: 'mEq/L', min: 1, max: 60, required: true },
        { id: 'na', label: 'Sodio', type: 'number', unit: 'mEq/L', min: 90, max: 180 },
        { id: 'k', label: 'Potasio', type: 'number', unit: 'mEq/L', min: 1, max: 10 },
        { id: 'cl', label: 'Cloro', type: 'number', unit: 'mEq/L', min: 60, max: 140 },
        { id: 'albumin', label: 'Albumina', type: 'number', unit: 'g/dL', min: 0.5, max: 7 },
        { id: 'lactate', label: 'Lactato', type: 'number', unit: 'mmol/L', min: 0, max: 30 },
        { id: 'pao2', label: 'PaO2 si muestra arterial', type: 'number', unit: 'mmHg', min: 20, max: 700 },
        { id: 'fio2', label: 'FiO2 conocida', type: 'number', unit: '%', min: 21, max: 100 },
      ],
      calculations: [
        { id: 'Estado pH', type: 'custom', fn: phStatus },
        { id: 'Trastorno primario', type: 'custom', fn: primaryDisorder },
        { id: 'Anion gap sin K', type: 'custom', fn: anionGap },
        { id: 'Anion gap con K', type: 'custom', fn: anionGapWithPotassium },
        { id: 'Anion gap corregido por albumina', type: 'custom', fn: correctedAnionGap },
        { id: 'Anion gap interpretado', type: 'custom', fn: interpretedAnionGap },
        { id: 'Categoria gap', type: 'custom', fn: gapCategory },
        { id: 'Delta ratio', type: 'custom', fn: deltaRatio },
        { id: 'Interpretacion delta', type: 'custom', fn: deltaInterpretation },
        { id: 'Winter pCO2 esperado', type: 'custom', fn: winterRange },
        { id: 'Compensacion', type: 'custom', fn: compensationInterpretation },
        { id: 'PaO2/FiO2', type: 'custom', fn: pfRatio },
        { id: 'Calidad del dato', type: 'custom', fn: dataQuality },
      ],
      interpretations: [
        {
          id: 'gap-high',
          when: { source: 'computed', id: 'Anion gap interpretado', gt: 12 },
          title: 'Anion gap elevado',
          body: 'Pensar en lactato/shock, cetoacidosis, insuficiencia renal, salicilatos y alcoholes toxicos segun contexto.',
          actions: ['Correlacionar con albumina, lactato, cetonas, funcion renal, osmolaridad y toxicologia si procede.'],
        },
        {
          id: 'lactate-four',
          when: { id: 'lactate', gte: 4 },
          title: 'Lactato de alto riesgo',
          body: 'Obliga a reevaluar perfusion y tendencia; no se corrige de forma aislada.',
          actions: ['Buscar shock, hipoxemia, convulsiones, isquemia, farmacos o toxicos.'],
        },
        {
          id: 'pf-low',
          when: { source: 'computed', id: 'PaO2/FiO2', lt: 300 },
          title: 'PaO2/FiO2 bajo',
          body: 'Solo se calcula con muestra arterial y FiO2 conocida. No diagnostica SDRA por si solo.',
          actions: ['Integrar con imagen, PEEP/CPAP, origen del edema e insuficiencia respiratoria.'],
        },
      ],
      outcomes: [
        {
          status: 'Critico',
          tone: 'alert',
          title: 'Alteracion acido-base de alto riesgo',
          body: 'pH extremo, lactato alto, oxigenacion alterada o dato probablemente erroneo.',
          any: [
            { id: 'ph', lt: 7.1 },
            { id: 'ph', gt: 7.55 },
            { id: 'lactate', gte: 4 },
            { source: 'computed', id: 'PaO2/FiO2', lt: 200 },
          ],
          actions: [
            'Repetir/confirmar muestra si hay valores incompatibles o discordantes con la clinica.',
            'Tratar la causa primaria y reevaluar tendencia; no automatizar bicarbonato, ventilacion ni ingreso solo por la calculadora.',
            'Valorar criticos si pH extremo, hipercapnia con deterioro, hipoxemia grave, hiperpotasemia, shock, intoxicacion o fallo organico.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Interpretar',
        title: 'Interpretacion calculada',
        body: 'Los calculos ayudan a detectar trastorno primario y mezclas, pero dependen del contexto y de la calidad de la muestra.',
        actions: [
          'Venosa: pH/pCO2 orientan, pero PaO2/FiO2 no se muestra y la oxigenacion exige muestra arterial o pulsioximetria fiable.',
          'HCO3 puede ser calculado por el gasometro o medido en bioquimica; si hay discordancia, revisar muestra y electrolitos.',
        ],
      },
    },
    sources: [
      { label: 'Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007.', url: 'https://pubmed.ncbi.nlm.nih.gov/17699401/', supports: 'Anion gap, limitaciones y correccion por albumina.' },
      { label: 'Figge J, Jabor A, Kazda A, Fencl V. Anion gap and hypoalbuminemia. Crit Care Med. 1998.', url: 'https://pubmed.ncbi.nlm.nih.gov/9824071/', supports: 'Factor de correccion del anion gap por albumina.' },
      { label: 'MSD Manual Professional Edition. Acid-Base Disorders. Reviewed 2025.', url: 'https://www.msdmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders', supports: 'Rangos de pH, formulas de compensacion y enfoque diagnostico.' },
    ],
  },
];
