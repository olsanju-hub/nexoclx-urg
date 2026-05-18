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
};

export const procedureList = Object.values(procedureCatalog);

const calculatorAction = (calculatorId, label) => ({
  calculatorId,
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

export const procedureFlowCatalog = {
  vmni: buildVmniProcedure(procedureCatalog.vmni),
};

export const procedureFlowList = Object.values(procedureFlowCatalog);

export const getProcedure = (procedureId) => procedureCatalog[procedureId] ?? procedureList[0];

export const getProcedureFlow = (procedureId) => procedureFlowCatalog[procedureId] ?? procedureFlowList[0];
