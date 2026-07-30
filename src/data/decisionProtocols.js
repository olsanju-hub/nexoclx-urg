import { toNumber } from '../lib/clinicalToolEngine.js';

const acidBaseStatus = (values) => {
  const ph = toNumber(values.ph);
  if (ph === null) return '';
  if (ph < 7.35) return 'Acidemia';
  if (ph > 7.45) return 'Alcalemia';
  return 'pH en rango o trastorno mixto';
};

const anionGap = (values) => {
  const na = toNumber(values.na);
  const cl = toNumber(values.cl);
  const hco3 = toNumber(values.hco3);
  if ([na, cl, hco3].some((item) => item === null)) return null;
  return Number((na - cl - hco3).toFixed(1));
};

const winterLow = (values) => {
  const hco3 = toNumber(values.hco3);
  if (hco3 === null) return null;
  return Number((1.5 * hco3 + 6).toFixed(1));
};

const winterHigh = (values) => {
  const hco3 = toNumber(values.hco3);
  if (hco3 === null) return null;
  return Number((1.5 * hco3 + 10).toFixed(1));
};

const paCo2Interpretation = (values) => {
  const pco2 = toNumber(values.pco2);
  const low = winterLow(values);
  const high = winterHigh(values);
  if ([pco2, low, high].some((item) => item === null)) return '';
  if (pco2 > high) return 'Hipoventilacion relativa: acidosis respiratoria anadida o fatiga';
  if (pco2 < low) return 'Hiperventilacion mayor de la esperada: alcalosis respiratoria anadida';
  return 'Compensacion respiratoria compatible con acidosis metabolica simple';
};

const gapCategory = (values) => {
  const gap = anionGap(values);
  if (gap === null) return '';
  if (gap >= 16) return 'Anion gap elevado';
  if (gap <= 8) return 'Anion gap bajo o normal-bajo';
  return 'Anion gap no elevado';
};

export const decisionProtocols = [
  {
    id: 'sepsis-shock',
    title: 'Sepsis y shock septico',
    description: 'Cribado de gravedad, lactato, foco, reanimacion y destino.',
    status: 'Interactivo',
    assessment: {
      title: 'Asistente de sepsis',
      intro: 'Integra sospecha infecciosa, qSOFA orientativo, hipoperfusion y necesidad de escalada.',
      copyPrefix: 'Valoracion sepsis/shock',
      fields: [
        { id: 'infection', label: 'Sospecha clinica de infeccion', type: 'select', required: true, options: [
          { value: 'yes', label: 'Si' },
          { value: 'no', label: 'No clara' },
        ] },
        { id: 'sbp', label: 'PAS', type: 'number', unit: 'mmHg', min: 40, max: 260, required: true },
        { id: 'map', label: 'PAM si disponible', type: 'number', unit: 'mmHg', min: 20, max: 160 },
        { id: 'rr', label: 'Frecuencia respiratoria', type: 'number', unit: 'rpm', min: 4, max: 70, required: true },
        { id: 'lactate', label: 'Lactato', type: 'number', unit: 'mmol/L', min: 0, max: 30 },
        { id: 'mentalStatus', label: 'Confusion o deterioro neurologico nuevo', type: 'checkbox' },
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
          body: 'qSOFA no diagnostica sepsis, pero identifica mayor riesgo de mala evolucion fuera de UCI.',
          actions: ['Monitorizacion, lactato si no se ha obtenido y valoracion medica inmediata.'],
        },
        {
          id: 'lactate-high',
          when: { id: 'lactate', gte: 2 },
          title: 'Lactato elevado',
          body: 'Interpretar el lactato en contexto: su elevacion obliga a buscar hipoperfusion, foco no controlado y causas no septicas.',
          actions: ['Repetir tendencia tras la reanimacion inicial y no tratar el numero de forma aislada.'],
        },
      ],
      outcomes: [
        {
          status: 'Shock',
          tone: 'alert',
          title: 'Actuar como sepsis con hipoperfusion/shock',
          body: 'Hay hipotension, lactato relevante o datos de hipoperfusion en contexto infeccioso.',
          when: { all: [
            { id: 'infection', equals: 'yes' },
            { any: [
              { id: 'sbp', lte: 90 },
              { id: 'map', lt: 65 },
              { id: 'lactate', gte: 4 },
              { id: 'hypoperfusion', includes: 'mottled' },
              { id: 'hypoperfusion', includes: 'oliguria' },
              { id: 'hypoperfusion', includes: 'shockIndex' },
              { id: 'hypoperfusion', includes: 'cold' },
            ] },
          ] },
          actions: [
            'Priorizar ABCDE, monitorizacion, vias venosas, lactato, hemocultivos si no retrasan el antibiotico y control del foco.',
            'Antibiotico inmediato si shock o alta probabilidad de sepsis; revisar foco, alergias, funcion renal y resistencias locales.',
            'Cristaloide balanceado en bolos revalorados; si persiste PAM baja, iniciar vasopresor segun entorno y activar UCI/criticos.',
            'Ingreso en area monitorizada/UCI segun respuesta, necesidad de vasopresor, fallo organico o foco no controlado.',
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
            'Antibioterapia precoz si la probabilidad clinica es alta; si es posible sepsis sin shock, confirmar rapido antes de retrasos relevantes.',
            'Observar o ingresar segun foco, comorbilidad, respuesta y seguridad del alta.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Vigilar',
        title: 'Sin criterios interactivos de shock o sepsis de alto riesgo',
        body: 'No hay datos suficientes de hipoperfusion en los campos introducidos.',
        actions: [
          'Reevaluar si cambian constantes, estado mental, diuresis, lactato o impresion clinica.',
          'No usar qSOFA como unica regla de descarte.',
        ],
      },
    },
    sources: [
      { label: 'Surviving Sepsis Campaign 2021', url: 'https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines', supports: 'Reanimacion, lactato, antibiotico precoz, cristaloides y vasopresores.' },
      { label: 'Sepsis-3', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881', supports: 'Concepto de sepsis, shock septico y qSOFA como alerta pronostica.' },
    ],
  },
  {
    id: 'codigo-ictus',
    title: 'Codigo ictus',
    description: 'Ventana terapeutica, datos minimos, contraindicaciones clave y traslado util.',
    status: 'Interactivo',
    assessment: {
      title: 'Activacion de codigo ictus',
      intro: 'Orienta activacion, imagen urgente y necesidad de centro con trombectomia.',
      copyPrefix: 'Valoracion codigo ictus',
      fields: [
        { id: 'deficit', label: 'Deficit neurologico focal actual y discapacitante', type: 'select', required: true, options: [
          { value: 'yes', label: 'Si' },
          { value: 'resolved', label: 'Resuelto o no discapacitante' },
          { value: 'no', label: 'No claro' },
        ] },
        { id: 'lastKnownWell', label: 'Ultima vez visto normal', type: 'number', unit: 'horas', min: 0, max: 72, required: true },
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
          body: 'La hipoglucemia puede simular ictus y debe corregirse de inmediato sin retrasar la valoracion neurologica si persiste deficit.',
          actions: ['Tratar hipoglucemia y reevaluar focalidad.'],
        },
        {
          id: 'lvo',
          when: { any: [
            { id: 'lvoSigns', includes: 'aphasia' },
            { id: 'lvoSigns', includes: 'gaze' },
            { id: 'lvoSigns', includes: 'denseMotor' },
            { id: 'lvoSigns', includes: 'nihss' },
          ] },
          title: 'Sospecha de gran vaso',
          body: 'Los signos corticales o deficit motor intenso aumentan la prioridad de angio-TC y centro con trombectomia.',
          actions: ['Prealerta a centro util con capacidad de ictus y trombectomia si el tiempo lo permite.'],
        },
      ],
      outcomes: [
        {
          status: 'Activar',
          tone: 'alert',
          title: 'Activar codigo ictus y neuroimagen urgente',
          body: 'Deficit focal discapacitante dentro de ventana de reperfusion o con sospecha de gran vaso.',
          all: [
            { id: 'deficit', equals: 'yes' },
            { any: [
              { id: 'lastKnownWell', lte: 4.5 },
              { all: [{ id: 'lastKnownWell', lte: 24 }, { any: [
                { id: 'lvoSigns', includes: 'aphasia' },
                { id: 'lvoSigns', includes: 'gaze' },
                { id: 'lvoSigns', includes: 'denseMotor' },
                { id: 'lvoSigns', includes: 'nihss' },
              ] }] },
            ] },
          ],
          actions: [
            'Registrar hora de ultima normalidad, inicio observado si existe, glucemia, TA, anticoagulacion y situacion basal.',
            'TC craneal sin contraste y angio-TC si sospecha de gran vaso o ventana extendida.',
            'No retrasar traslado por pruebas no imprescindibles; elegir hospital util segun ventana y trombectomia.',
            'Revisar contraindicaciones de trombolisis, pero no usarlas para no activar el circuito.',
          ],
        },
        {
          status: 'AIT/observacion',
          title: 'Deficit resuelto o fuera de ventana inmediata',
          body: 'Puede requerir circuito de AIT/ictus igualmente si el evento fue focal, reciente o de alto riesgo.',
          any: [
            { id: 'deficit', equals: 'resolved' },
            { id: 'lastKnownWell', gt: 24 },
          ],
          actions: [
            'Valorar imagen, ECG, vascular, antiagregacion/anticoagulacion segun diagnostico y riesgo hemorragico.',
            'Ingreso, observacion o via rapida segun riesgo, recurrencia, estenosis, FA, comorbilidad y soporte.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Reevaluar',
        title: 'No cumple criterios introducidos de activacion inmediata',
        body: 'Si la focalidad es dudosa, priorizar reevaluacion seriada y descartar imitadores.',
        actions: ['Corregir glucemia extrema, revisar crisis, migraña, sepsis, intoxicaciones y trastornos metabolicos.'],
      },
    },
    sources: [
      { label: 'ACEP Clinical Policy, acute ischemic stroke', url: 'https://www.acep.org/patient-care/clinical-policies/acute-ischemic-stroke', supports: 'Uso de tromboliticos en urgencias y decision compartida.' },
      { label: 'AHA/ASA acute ischemic stroke guidance', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000211', supports: 'Ventanas de reperfusion, imagen y trombectomia.' },
    ],
  },
  {
    id: 'gasometria-acido-base',
    title: 'Gasometria y acido-base',
    description: 'Anion gap, formula de Winter y alarmas de compensacion.',
    status: 'Calculadora',
    assessment: {
      title: 'Interpretador acido-base',
      intro: 'Calcula anion gap y compensacion respiratoria esperada para detectar trastornos mixtos.',
      copyPrefix: 'Gasometria acido-base',
      fields: [
        { id: 'ph', label: 'pH', type: 'number', min: 6.7, max: 7.8, required: true },
        { id: 'pco2', label: 'pCO2', type: 'number', unit: 'mmHg', min: 5, max: 120, required: true },
        { id: 'hco3', label: 'HCO3', type: 'number', unit: 'mEq/L', min: 1, max: 60, required: true },
        { id: 'na', label: 'Sodio', type: 'number', unit: 'mEq/L', min: 90, max: 180 },
        { id: 'cl', label: 'Cloro', type: 'number', unit: 'mEq/L', min: 60, max: 140 },
        { id: 'lactate', label: 'Lactato', type: 'number', unit: 'mmol/L', min: 0, max: 30 },
      ],
      calculations: [
        { id: 'Estado pH', type: 'custom', fn: acidBaseStatus },
        { id: 'Anion gap', type: 'custom', fn: anionGap },
        { id: 'Categoria gap', type: 'custom', fn: gapCategory },
        { id: 'Winter pCO2 minimo', type: 'custom', fn: winterLow },
        { id: 'Winter pCO2 maximo', type: 'custom', fn: winterHigh },
        { id: 'Compensacion', type: 'custom', fn: paCo2Interpretation },
      ],
      interpretations: [
        {
          id: 'gap-high',
          when: { source: 'computed', id: 'Anion gap', gte: 16 },
          title: 'Acidosis con anion gap elevado posible',
          body: 'Pensar en lactato/sepsis o shock, cetoacidosis, insuficiencia renal, salicilatos y alcoholes toxicos segun contexto.',
          actions: ['Buscar causa, potasio, cetonas, funcion renal, lactato seriado y toxicologia si procede.'],
        },
        {
          id: 'lactate-four',
          when: { id: 'lactate', gte: 4 },
          title: 'Lactato de alto riesgo',
          body: 'Un lactato muy elevado en urgencias obliga a descartar hipoperfusion y acelerar reanimacion/control de causa.',
          actions: ['Reevaluar perfusion y tendencia tras intervencion inicial.'],
        },
      ],
      outcomes: [
        {
          status: 'Critico',
          tone: 'alert',
          title: 'Alteracion acido-base de alto riesgo',
          body: 'pH extremo, lactato alto o sospecha de compensacion inadecuada.',
          any: [
            { id: 'ph', lt: 7.1 },
            { id: 'ph', gt: 7.55 },
            { id: 'lactate', gte: 4 },
          ],
          actions: [
            'Monitorizar, repetir gasometria tras tratamiento y tratar la causa primaria.',
            'Si pCO2 esta por encima de Winter en acidosis metabolica: valorar fatiga, hipoventilacion y soporte ventilatorio.',
            'Ingreso/criticos si pH extremo, lactato persistente, hipoxemia, hiperpotasemia, shock o fallo organico.',
          ],
        },
      ],
      defaultOutcome: {
        status: 'Interpretar',
        title: 'Interpretacion calculada',
        body: 'Usa los calculos integrados para confirmar trastorno primario, gap y compensacion.',
        actions: [
          'Una compensacion fuera de rango sugiere trastorno mixto y cambia el diagnostico diferencial.',
          'El anion gap normal no descarta gravedad si hay hipercloremia, perdidas digestivas o acidosis tubular.',
        ],
      },
    },
    sources: [
      { label: 'MSD/Merck Manual Professional: Acid-base disorders', url: 'https://www.msdmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders', supports: 'Calculo e interpretacion del anion gap y trastornos mixtos.' },
      { label: 'Berend K. Diagnostic use of base excess in acid-base disorders. NEJM 2014.', url: 'https://www.nejm.org/doi/full/10.1056/NEJMra1003327', supports: 'Enfoque fisiologico de alteraciones acido-base.' },
    ],
  },
];
