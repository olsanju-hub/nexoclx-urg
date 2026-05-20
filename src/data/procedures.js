import { createBibliographyEntry } from './bibliography';

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

const spanishSrniEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'separ-semes-semicyuc-srni',
    verifiedPages,
    pdfPages,
    note,
  });

const goldCopdEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'gold-epoc-2025',
    verifiedPages,
    pdfPages,
    note,
  });

const ginaAsthmaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'gina-asma-2025',
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

export const procedureCatalog = {
  vmni: {
    id: 'vmni',
    title: 'VMNI',
    longTitle: 'VMNI',
    section: 'Procedimientos',
    specialtyId: 'respiratorio',
    relatedSpecialties: ['urgencias'],
    status: 'implementado',
    implemented: true,
    summary: 'Inicio, ajustes, monitorización y criterios de fracaso de ventilación mecánica no invasiva.',
    searchTerms: [
      'vmni',
      'vni',
      'ventilacion no invasiva',
      'ventilacion mecanica no invasiva',
      'bipap',
      'cpap',
      'v60',
      'insuficiencia respiratoria',
      'hipercapnia',
    ],
    calculatorIds: [
      'vmni-predicted-weight',
      'vmni-tidal-volume',
      'vmni-pressure-support',
      'vmni-pao2-fio2',
      'vmni-spo2-fio2',
      'vmni-reassessment',
    ],
    bibliography: [
      localV60Entry({
        id: 'vmni-v60-local',
        verifiedPages: [3, 4, 5, 6, 9],
        pdfPages: [3, 4, 5, 6, 9],
        note: 'Fuente técnica local: modos CPAP, S/T, PCV, AVAPS, circuito, mascarilla/puerto, alarmas, fugas y Auto-Trak. No se publica ni enlaza el PDF.',
      }),
      ersAtsVmniEntry({
        id: 'vmni-ers-ats-2017',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Indicaciones en EPOC con acidosis respiratoria, edema pulmonar cardiogénico y necesidad de monitorizar respuesta sin retrasar intubación.',
      }),
      spanishSrniEntry({
        id: 'vmni-consenso-espanol',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Consenso español de soporte respiratorio no invasivo como apoyo de organización, monitorización y seguridad.',
      }),
      goldCopdEntry({
        id: 'vmni-gold-epoc',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Uso preferente de VMNI frente a ventilación invasiva en agudización de EPOC con insuficiencia respiratoria aguda si no hay deterioro inmediato.',
      }),
      ginaAsthmaEntry({
        id: 'vmni-gina-asma',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Asma grave: soporte ventilatorio solo en paciente seleccionado y con vigilancia estrecha.',
      }),
    ],
  },
  'fluidoterapia-iv': {
    id: 'fluidoterapia-iv',
    title: 'Fluidoterapia IV en urgencias',
    longTitle: 'Fluidoterapia IV en urgencias',
    section: 'Procedimientos',
    specialtyId: 'urgencias',
    relatedSpecialties: ['infecciosas'],
    status: 'implementado',
    implemented: true,
    summary: 'Indicación, elección de líquido, cantidad, ritmo y reevaluación de líquidos IV en urgencias.',
    searchTerms: [
      'fluidoterapia',
      'liquidos iv',
      'sueroterapia',
      'suero fisiologico',
      'ssf',
      'ringer lactato',
      'plasmalyte',
      'glucosado',
      'glucosalino',
      'mantenimiento',
      'resucitacion',
      'reposicion',
      'deshidratacion',
      'hipovolemia',
      'sepsis',
      'shock',
    ],
    calculatorIds: [
      'fluid-bolus-weight',
      'sepsis-30mlkg',
      'fluid-remaining',
      'maintenance-fluids-adult',
      'simple-fluid-balance',
      'infusion-rate',
    ],
    bibliography: [
      niceFluidEntry({
        id: 'fluidoterapia-nice-cg174',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Fuente principal para indicación, tipo de fluido, resucitación, mantenimiento, reposición y reevaluación.',
      }),
      sscSepsisEntry({
        id: 'fluidoterapia-ssc-sepsis',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Apoyo para resucitación inicial en sepsis con hipoperfusión o shock séptico.',
      }),
    ],
  },
};

export const procedureList = Object.values(procedureCatalog);

const calculatorAction = (calculatorId, label) => ({
  calculatorId,
  label,
});

const protocolAction = (protocolId, label) => ({
  protocolId,
  label,
});

const actionNode = (id, title, calculatorId, summary) => ({
  id,
  title,
  type: 'calculator',
  severity: 'info',
  summary,
  calculatorId,
  action: `Calcular ${title}`,
});

const asReferenceItems = (entries = []) =>
  entries.map((entry) => {
    const pages = entry.verifiedPages?.length ? ` pags. ${entry.verifiedPages.join(', ')}` : '';
    return `${entry.shortReference}${pages}. ${entry.note ?? ''}`.trim();
  });

const buildVmniProcedure = (procedure) => ({
  id: procedure.id,
  title: procedure.title,
  longTitle: procedure.longTitle,
  specialty: 'Procedimientos',
  section: 'Respiratorio / Urgencias',
  summary: procedure.summary,
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'indicaciones',
      title: 'Indicaciones',
      summary: 'Iniciar VMNI si hay indicación clínica, respiración espontánea y posibilidad de vigilancia estrecha.',
      points: [
        'EPOC agudizado con insuficiencia respiratoria hipercápnica/acidosis respiratoria.',
        'Edema agudo de pulmón cardiogénico si predomina fracaso respiratorio y no hay indicación inmediata de intubación.',
        'Insuficiencia respiratoria con trabajo respiratorio aumentado en pacientes seleccionados y monitorizables.',
        'Asma grave solo en paciente seleccionado, cooperador y con plan claro de intubación si fracasa.',
        'Debe respirar espontáneamente, colaborar y poder proteger vía aérea salvo criterio experto en área monitorizada.',
      ],
      detailNodes: [
        {
          id: 'vmni-indicaciones-epoc',
          title: 'EPOC hipercápnico',
          type: 'decision',
          severity: 'warning',
          items: [
            'Considerar si pH <= 7,35, PaCO2 > 45 mmHg y FR > 20-24 rpm pese a tratamiento inicial.',
            'Cuanto menor sea el pH, mayor riesgo de fracaso: iniciar donde exista acceso rápido a intubación.',
            'No retrasar intubación si deteriora nivel de conciencia, oxigenación o hemodinámica.',
          ],
        },
      ],
    },
    {
      id: 'contraindicaciones',
      title: 'Contraindicaciones',
      summary: 'No iniciar sin ayuda experta si precisa intubación inmediata, no protege vía aérea o no tolera la interfaz.',
      points: [
        'Parada respiratoria, necesidad inmediata de intubación o agotamiento extremo.',
        'Incapacidad para proteger vía aérea, vómitos activos, alto riesgo de aspiración o secreciones no manejables.',
        'Shock o inestabilidad grave no controlada, arritmia grave o deterioro importante del nivel de conciencia.',
        'Trauma/cirugía facial, imposibilidad de ajustar interfaz, agitación extrema o intolerancia.',
        'Neumotórax no drenado o fracaso de VMNI con empeoramiento clínico/gasométrico.',
      ],
      detailNodes: [
        {
          id: 'vmni-no-retrasar',
          title: 'No retrasar escalada',
          type: 'alert',
          severity: 'danger',
          items: [
            'La VMNI no sustituye una vía aérea definitiva cuando el paciente se deteriora.',
            'Si no hay personal, monitorización o alternativa ventilatoria, pedir ayuda antes de iniciar.',
            'Reevaluar precozmente y preparar intubación si no mejora.',
          ],
        },
      ],
    },
    {
      id: 'preparacion',
      title: 'Preparación',
      summary: 'Explicar, monitorizar, elegir interfaz, comprobar circuito/fugas y preparar alternativa si fracasa.',
      points: [
        'Explicar la técnica al paciente y elegir una interfaz que permita sellado y tolerancia.',
        'Monitorizar SatO2, FR, FC, TA y ECG si procede; gasometría inicial si indicación ventilatoria.',
        'Preparar aspiración, plan de intubación si fracasa y alternativa ventilatoria disponible.',
        'Confirmar oxígeno, circuito, filtro, puerto de exhalación, mascarilla, alarmas y ausencia de obstrucción.',
        'No dejar mascarilla conectada al paciente si el ventilador no está funcionando.',
      ],
      detailNodes: [
        {
          id: 'vmni-v60-preparacion',
          title: 'Equipo tipo V60',
          type: 'step',
          severity: 'info',
          items: [
            'Seleccionar mascarilla/puerto de exhalación según el equipo y comprobar que no está obstruido.',
            'El puerto de exhalación y EPAP suficientes ayudan a purgar gas exhalado y evitar reinhalación de CO2.',
            'Configurar alarmas antes de iniciar y revisar fugas porque pueden alterar volúmenes medidos.',
          ],
        },
      ],
    },
    {
      id: 'puesta-en-marcha',
      title: 'Puesta en marcha',
      summary: 'Encender, elegir modo, configurar oxígeno/presiones/alarmas e iniciar con vigilancia estrecha.',
      points: [
        'Encender equipo, comprobar circuito, seleccionar modo y confirmar mascarilla/puerto si el ventilador lo solicita.',
        'Configurar FiO2, presiones iniciales, frecuencia de respaldo si S/T y alarmas relevantes.',
        'Colocar interfaz con el paciente vigilado; sostener inicialmente la mascarilla si mejora tolerancia.',
        'Revisar fugas, sincronía, comodidad, volúmenes, FR, SatO2 y trabajo respiratorio.',
        'Ajustar de forma gradual y reevaluar en 15-30 min.',
      ],
      actions: [
        calculatorAction('vmni-pressure-support', 'Calcular presión de soporte'),
        calculatorAction('vmni-pao2-fio2', 'Calcular PaO2/FiO2'),
        calculatorAction('vmni-spo2-fio2', 'Calcular SpO2/FiO2'),
      ],
      detailNodes: [
        {
          id: 'vmni-modos',
          title: 'Modos útiles',
          type: 'step',
          severity: 'info',
          items: [
            'CPAP: presión continua; útil si predomina oxigenación/reclutamiento, como edema agudo de pulmón.',
            'S/T: IPAP + EPAP con frecuencia de respaldo; típico en hipoventilación o hipercapnia.',
            'PCV: opción disponible en algunos equipos si se usa por experiencia local.',
            'AVAPS: no usar como primera opción en inestabilidad aguda si se necesitan cambios rápidos de IPAP, salvo indicación y experiencia local.',
          ],
        },
      ],
    },
    {
      id: 'ajustes',
      title: 'Ajustes',
      summary: 'Usar valores orientativos, titular por tolerancia, oxigenación, ventilación y gasometría.',
      points: [
        'EPOC hipercápnico: S/T, EPAP 4-5 cmH2O, IPAP 10-12 cmH2O e incrementar IPAP según ventilación/tolerancia.',
        'Edema agudo de pulmón: CPAP 5-10 cmH2O o S/T si hipercapnia/fatiga; titular por TA, SatO2 y trabajo respiratorio.',
        'Hipoxemia no EPOC seleccionada: EPAP/FiO2 para oxigenación con vigilancia de fracaso precoz.',
        'Asma grave seleccionada: usar con cautela, presiones bajas iniciales y mucho tiempo espiratorio; no retrasar intubación.',
        'Objetivo de SatO2: 88-92% en EPOC con riesgo hipercapnia; 92-96% en otros escenarios salvo indicación distinta.',
      ],
      actions: [
        calculatorAction('vmni-predicted-weight', 'Calcular peso ideal'),
        calculatorAction('vmni-tidal-volume', 'Calcular VT objetivo'),
        calculatorAction('vmni-pressure-support', 'Calcular PS'),
      ],
      detailNodes: [
        {
          id: 'vmni-ajustes-detalle',
          title: 'Titulación práctica',
          type: 'decision',
          severity: 'warning',
          items: [
            'Presión de soporte = IPAP - EPAP; más PS suele aumentar ventilación, pero puede empeorar fugas o intolerancia.',
            'Subir IPAP si PaCO2 alta, VT bajo o trabajo respiratorio persiste, revisando fugas y sincronía.',
            'Subir EPAP o FiO2 si oxigenación insuficiente, evitando hiperinsuflación o mala tolerancia.',
            'Ajustar rise time/rampa por confort y patrón; Auto-Trak puede gestionar trigger/ciclado y fugas según equipo.',
          ],
        },
      ],
    },
    {
      id: 'reevaluacion',
      title: 'Reevaluación',
      summary: 'Revisar respuesta a 15-30 min y gasometría a 1-2 h si hipercapnia/acidosis.',
      points: [
        'A los 15-30 min: tolerancia, fugas, FR, trabajo respiratorio, SatO2, sincronía y nivel de conciencia.',
        'Gasometría a 1-2 h si hipercapnia/acidosis o evolución dudosa.',
        'Éxito: menor disnea/trabajo, baja FR, mejora pH, PaCO2 favorable, mejor SatO2/PaO2 y buena tolerancia.',
        'Fracaso: conciencia peor, hipoxemia persistente, acidosis peor, PaCO2 en ascenso con deterioro, shock o agotamiento.',
        'No retrasar intubación/UCI si fracasa o aparecen aspiración, secreciones, fugas no controlables o arritmias graves.',
      ],
      actions: [calculatorAction('vmni-reassessment', 'Reevaluar VMNI')],
      detailNodes: [
        {
          id: 'vmni-problemas',
          title: 'Problemas frecuentes',
          type: 'step',
          severity: 'info',
          items: [
            'Fugas: recolocar interfaz, revisar talla, puerto, circuito y presión; evitar apretar hasta lesionar.',
            'Asincronía: revisar fugas, trigger/ciclado, rise time, IPAP/EPAP y confort.',
            'Sequedad/lesiones: humidificación si procede, protección cutánea y descansos vigilados.',
            'Distensión gástrica: bajar presiones si posible, vigilar vómitos/aspiración y reevaluar indicación.',
            'Reinhalación de CO2: comprobar EPAP suficiente, puerto de exhalación correcto y circuito no obstruido.',
          ],
        },
      ],
    },
  ],
  references: asReferenceItems(procedure.bibliography),
});

const buildFluidTherapyProcedure = (procedure) => ({
  id: procedure.id,
  title: procedure.title,
  longTitle: procedure.longTitle,
  specialty: 'Procedimientos',
  section: 'Urgencias',
  summary: 'Define el objetivo del líquido, calcula volumen/ritmo y reevalúa respuesta clínica.',
  layout: 'decision-panel',
  prompt: {
    title: '¿Cuál es el objetivo ahora?',
    summary: 'Identifica el problema clínico, elige fluido razonable y decide si seguir, frenar o escalar.',
  },
  panelSections: [
    {
      id: 'shock',
      title: 'Resucitar',
      summary: 'Shock / hipoperfusión: restaurar perfusión sin convertir el bolo en orden automática.',
      points: [
        'Objetivo clínico: mejorar perfusión, TA/PAM, relleno capilar, estado mental, lactato y diuresis contextual.',
        'Líquido preferente: cristaloide IV, balanceado/Ringer lactato/Plasma-Lyte si disponible y no contraindicado.',
        'Volumen/ritmo: iniciar bolo 250-500 mL y reevaluar respuesta clínica antes de repetir.',
        'Variables clave: IC, ERC, cirrosis, fragilidad, congestión pulmonar, lactato, creatinina y causa del shock.',
        'No seguir con más fluidos si no mejora perfusión, aparece sobrecarga o precisa vasopresor/UCI.',
      ],
      actions: [
        calculatorAction('fluid-bolus-weight', 'Calcular bolo por peso'),
        calculatorAction('simple-fluid-balance', 'Balance simple'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-shock-detalle',
          title: 'Reevaluación tras bolo',
          type: 'step',
          items: [
            'Reevaluar TA/PAM, FC, FR, SatO2, relleno capilar, piel, conciencia, dolor/disnea y trabajo respiratorio.',
            'Si hay sepsis probable, usar la ruta Sepsis para objetivo 30 mL/kg y volumen pendiente.',
            'Si shock persiste pese a volumen razonable, escalar estrategia: vasopresor/UCI/control de causa según contexto.',
          ],
        },
      ],
    },
    {
      id: 'sepsis-objetivo',
      title: 'Sepsis',
      summary: 'Objetivo inicial y volumen pendiente en sepsis con hipoperfusión o shock séptico.',
      points: [
        'Objetivo clínico: resucitación inicial si hay hipoperfusión inducida por sepsis o shock séptico.',
        'Líquido preferente: cristaloide IV, habitualmente balanceado si disponible y no contraindicado.',
        'Volumen/ritmo: valorar 30 mL/kg en primeras 3 h con reevaluación frecuente; individualizar si riesgo de sobrecarga.',
        'Variables clave: peso, volumen ya administrado, lactato, PAM, diuresis, creatinina, congestión y foco infeccioso.',
        'No seguir automáticamente por oliguria aislada; si shock persiste, valorar vasopresor/UCI sin retraso.',
      ],
      actions: [
        calculatorAction('sepsis-30mlkg', 'Calcular 30 mL/kg sepsis'),
        calculatorAction('fluid-remaining', 'Calcular volumen pendiente'),
        protocolAction('sepsis', 'Ver protocolo Sepsis'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-sepsis-seguridad',
          title: 'Seguridad',
          type: 'alert',
          severity: 'warning',
          items: [
            'La diuresis informa perfusión y balance, pero no resta automáticamente el volumen pendiente.',
            'Si pendiente ≤ 0, el objetivo está alcanzado o superado: reevaluar antes de más fluidos.',
            'No retrasar antibiótico, control de foco, vasopresor o UCI por completar cálculos.',
          ],
        },
      ],
    },
    {
      id: 'deshidratacion',
      title: 'Rehidratar',
      summary: 'Pérdidas digestivas o deshidratación estable: corregir déficit de forma guiada por clínica y analítica.',
      points: [
        'Objetivo clínico: corregir deshidratación estable, no tratar shock ni mantenimiento basal.',
        'Líquido preferente: vía oral/enteral si es posible; si IV, cristaloide según sodio, cloro, glucemia y contexto.',
        'Volumen/ritmo: bolos pequeños o perfusión según tolerancia, déficit estimado y comorbilidad.',
        'Variables clave: TA, FC, mucosas, sed, diuresis, creatinina, sodio, potasio y pérdidas en curso.',
        'No seguir con más fluidos si aparece congestión, hiponatremia progresiva o no hay objetivo clínico claro.',
      ],
      actions: [
        calculatorAction('fluid-bolus-weight', 'Calcular bolo por peso'),
        calculatorAction('simple-fluid-balance', 'Balance simple'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-deshidratacion-liquidos',
          title: 'Líquidos útiles',
          type: 'step',
          items: [
            'Cristaloide balanceado/Ringer lactato/Plasma-Lyte: útil si se busca expansión de volumen y no hay contraindicación.',
            'Suero salino 0,9%: valorar si vómitos con hipocloremia/alcalosis o hiponatremia hipovolémica según contexto.',
            'Glucosado 5% no es líquido de resucitación hemodinámica; usar como agua libre/glucosa según contexto y vigilando sodio.',
          ],
        },
      ],
    },
    {
      id: 'mantenimiento',
      title: 'Mantener',
      summary: 'No puede beber: cubrir necesidades basales sin usar mantenimiento como resucitación.',
      points: [
        'Objetivo clínico: cubrir agua/electrolitos mientras no puede vía oral/enteral.',
        'Líquido preferente: composición según sodio, glucemia, potasio, función renal y protocolo local.',
        'Volumen/ritmo: calcular volumen diario y ritmo mL/h; ajustar por edad, fiebre, pérdidas, IC, ERC y cirrosis.',
        'Variables clave: Na, K, Cl, glucemia, creatinina, balance, edemas, diuresis y tolerancia oral prevista.',
        'No seguir si reaparece vía oral, hay sobrecarga, hiponatremia o el paciente pasa a resucitación activa.',
      ],
      actions: [
        calculatorAction('maintenance-fluids-adult', 'Calcular mantenimiento'),
        calculatorAction('infusion-rate', 'Calcular velocidad de perfusión'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-mantenimiento-liquidos',
          title: 'Elegir composición',
          type: 'step',
          items: [
            'Glucosalino: considerar en mantenimiento o situaciones seleccionadas según protocolo local, sodio y glucemia.',
            'Glucosado 5% aporta agua libre/glucosa; vigilar hiponatremia si uso inadecuado.',
            'Sueros con potasio: solo con potasio conocido, diuresis y función renal razonables.',
          ],
        },
      ],
    },
    {
      id: 'reposicion',
      title: 'Reponer pérdidas',
      summary: 'Pérdidas medidas: compensar vómitos, diarrea, drenajes, poliuria o sangrado según composición y balance.',
      points: [
        'Objetivo clínico: sustituir pérdidas activas o recientes, no cubrir un objetivo de sepsis ni mantenimiento basal.',
        'Líquido preferente: elegir según tipo de pérdida, sodio, potasio, cloro, glucemia y función renal.',
        'Volumen/ritmo: reponer pérdidas medidas o estimadas en un periodo definido y revisar respuesta.',
        'Variables clave: cuantía de pérdidas, electrolitos, creatinina, TA/FC, diuresis, peso y signos de congestión.',
        'No seguir si el balance se vuelve muy positivo, cambia la causa o aparecen datos de sobrecarga.',
      ],
      actions: [
        calculatorAction('simple-fluid-balance', 'Balance simple'),
        calculatorAction('infusion-rate', 'Velocidad de perfusión'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-reposicion-vigilancia',
          title: 'Vigilar',
          type: 'step',
          items: [
            'Revisar sodio, potasio, cloro, creatinina y glucemia si las pérdidas continúan.',
            'Reevaluar peso, mucosas, TA, FC, diuresis y signos de congestión.',
            'Ajustar el líquido si aparecen hiponatremia, hiperpotasemia, acidosis o deterioro renal.',
          ],
        },
      ],
    },
    {
      id: 'ya-recibio',
      title: 'Reevaluar',
      summary: 'Ya recibió líquidos: calcular pendiente, balance y tolerancia antes de decidir el siguiente paso.',
      points: [
        'Objetivo clínico: saber qué volumen falta y si el paciente tolera más aporte.',
        'Líquido preferente: depende del objetivo inicial; registrar cristaloide ya administrado.',
        'Volumen/ritmo: cálculo principal = objetivo total menos cristaloide administrado.',
        'Variables clave: diuresis, pérdidas, balance neto, congestión, lactato, creatinina, TA/PAM y oxigenación.',
        'No seguir si pendiente ≤ 0, hay sobrecarga o no existe respuesta clínica favorable.',
      ],
      actions: [calculatorAction('fluid-remaining', 'Volumen pendiente / líquidos ya administrados')],
      detailNodes: [
        {
          id: 'fluidoterapia-ya-recibio-seguridad',
          title: 'Seguridad',
          type: 'alert',
          severity: 'warning',
          items: [
            'La oliguria aislada no indica nuevos bolos: reevaluar TA, lactato, creatinina, congestión, perfusión y causa.',
            'Si el balance es muy positivo o hay congestión, revisar oxigenación y tolerancia antes de nuevos bolos.',
            'La app ayuda a calcular; no decide continuar o parar fluidos automáticamente.',
          ],
        },
      ],
    },
    {
      id: 'sobrecarga',
      title: 'Limitar',
      summary: 'Riesgo de sobrecarga: usar volumen mínimo útil y escalar si el shock no tolera más fluidos.',
      points: [
        'Objetivo clínico: mejorar perfusión evitando edema pulmonar o congestión sistémica.',
        'Líquido preferente: cristaloide solo si hay objetivo claro; evitar mantenimiento o bolos por inercia.',
        'Volumen/ritmo: bolos pequeños, por ejemplo 250 mL, con reevaluación estrecha antes de repetir.',
        'Variables clave: IC, ERC, cirrosis, fragilidad, crepitantes, yugulares, SatO2, edema, diuresis y balance.',
        'No seguir si aumenta trabajo respiratorio, cae SatO2 o no mejora perfusión; valorar vasopresor/UCI.',
      ],
      actions: [
        calculatorAction('simple-fluid-balance', 'Balance simple'),
        calculatorAction('fluid-remaining', 'Volumen pendiente'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-sobrecarga-reevaluacion',
          title: 'Reevaluar antes de repetir',
          type: 'step',
          items: [
            'TA, FC, FR, SatO2, relleno capilar, piel, estado mental y respuesta clínica al bolo.',
            'Lactato si shock/sepsis; gasometría si gravedad, acidosis o insuficiencia respiratoria.',
            'Iones, creatinina, glucemia y cloro si fluidos mantenidos o grandes volúmenes.',
          ],
        },
        {
          id: 'fluidoterapia-sobrecarga-liquidos',
          title: 'Elección del líquido',
          type: 'step',
          items: [
            'Cristaloide balanceado/Ringer lactato/Plasma-Lyte: útil para resucitación habitual si no contraindicado.',
            'Suero salino 0,9%: útil si hipocloremia/alcalosis por vómitos o hiponatremia hipovolémica según contexto.',
            'Sueros con potasio: solo con potasio conocido, diuresis y función renal razonables.',
          ],
        },
      ],
    },
    {
      id: 'situaciones-especiales',
      title: 'Situaciones especiales',
      summary: 'Glucosa, hiponatremia hipovolémica y vómitos con alcalosis: elegir fluido por problema dominante.',
      points: [
        'Objetivo clínico: corregir el trastorno dominante sin usar soluciones inadecuadas como resucitación.',
        'Glucosado 5%: aporte de agua libre/glucosa; no es líquido de resucitación hemodinámica y exige vigilar sodio.',
        'Hiponatremia hipovolémica: valorar suero salino 0,9% según contexto clínico y ritmo seguro de corrección.',
        'Vómitos con alcalosis/hipocloremia: suero salino 0,9% puede ser razonable si encaja con analítica y volumen.',
        'No seguir si sodio cambia de forma insegura, aparece sobrecarga o el problema ya no es déficit de volumen.',
      ],
      actions: [
        calculatorAction('simple-fluid-balance', 'Balance simple'),
        calculatorAction('infusion-rate', 'Velocidad de perfusión'),
      ],
      detailNodes: [
        {
          id: 'fluidoterapia-especiales-vigilancia',
          title: 'Variables que cambian la decisión',
          type: 'step',
          items: [
            'Sodio, potasio, cloro, glucemia, creatinina, osmolaridad si procede y velocidad de cambio del sodio.',
            'Situación neurológica, volemia clínica, diuresis, pérdidas digestivas y riesgo de sobrecarga.',
            'Si el trastorno electrolítico es grave o sintomático, aplicar protocolo específico/local y monitorización estrecha.',
          ],
        },
      ],
    },
  ],
  supportSections: [
    {
      id: 'fluidoterapia-eleccion-liquido',
      title: 'Elección del líquido',
      summary: 'Elegir fluido según objetivo clínico, electrolitos, comorbilidad y compatibilidad.',
      items: [
        'Cristaloide balanceado / Ringer lactato / Plasma-Lyte: útil para resucitación habitual si no contraindicado.',
        'Suero salino 0,9%: útil si hipocloremia/alcalosis por vómitos o hiponatremia hipovolémica según contexto; evitar grandes volúmenes sin reevaluar por carga de cloro.',
        'Glucosado 5%: no es líquido de resucitación hemodinámica; usar como aporte de agua libre/glucosa según contexto y vigilar sodio.',
        'Sueros con potasio: solo con potasio conocido, diuresis y función renal razonables.',
      ],
    },
    {
      id: 'fluidoterapia-reevaluacion',
      title: 'Reevaluación',
      summary: 'Después de cada bolo o cambio de ritmo, decidir si continuar, frenar, cambiar estrategia o escalar.',
      items: [
        'TA, FC, FR, SatO2, relleno capilar, piel, estado mental, trabajo respiratorio y respuesta clínica.',
        'Diuresis, balance neto y pérdidas activas como datos de reevaluación, no como orden automática de bolos.',
        'Lactato si shock/sepsis; gasometría si gravedad, acidosis o insuficiencia respiratoria.',
        'Iones, creatinina, glucemia, cloro, auscultación pulmonar, edema e ingurgitación yugular.',
      ],
    },
    {
      id: 'fluidoterapia-precauciones',
      title: 'Precauciones',
      summary: 'Si hay comorbilidad, mala respuesta o toxicidad, individualizar y escalar pronto.',
      items: [
        'Insuficiencia cardiaca, ERC, cirrosis, anciano/frágil o edema pulmonar: bolos pequeños y reevaluación estrecha.',
        'Hiponatremia, hiperpotasemia, acidosis o deterioro renal obligan a revisar líquido, ritmo y monitorización.',
        'Sepsis con mala respuesta a fluidos: valorar vasopresores, control de foco y UCI.',
        'La app no decide fluidos automáticamente: ayuda a ordenar objetivo, volumen, ritmo, seguridad y reevaluación.',
      ],
    },
  ],
  references: asReferenceItems(procedure.bibliography),
});

export const procedureFlowCatalog = {
  vmni: buildVmniProcedure(procedureCatalog.vmni),
  'fluidoterapia-iv': buildFluidTherapyProcedure(procedureCatalog['fluidoterapia-iv']),
};

export const procedureFlowList = Object.values(procedureFlowCatalog);

export const getProcedure = (procedureId) => procedureCatalog[procedureId] ?? procedureList[0];

export const getProcedureFlow = (procedureId) => procedureFlowCatalog[procedureId] ?? procedureFlowList[0];
