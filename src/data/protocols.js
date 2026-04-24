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

const escHtaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-hta-2024',
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

const escFaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-fa-2024',
    verifiedPages,
    pdfPages,
    note,
  });

const escTsvEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-tsv-2019',
    verifiedPages,
    pdfPages,
    note,
  });

const escBradyEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-bradicardias-2021',
    verifiedPages,
    pdfPages,
    note,
  });

const escVentricularEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-arritmias-ventriculares-2022',
    verifiedPages,
    pdfPages,
    note,
  });

export const protocolCatalog = {
  'fibrilacion-auricular': {
    id: 'fibrilacion-auricular',
    title: 'Fibrilación auricular',
    longTitle: 'Fibrilación auricular',
    chapter: 'Guía ESC 2024',
    section: 'Urgencias cardiovasculares',
    indexPage: 184,
    verifiedPage: 184,
    pdfPage: 209,
    status: 'implementado',
    summary: 'Estabilidad, inicio < 24 h o ≥ 24 h/desconocido, control de frecuencia y anticoagulación.',
    quickChecks: [
      'ECG y tira de ritmo',
      'Estable o inestable',
      'Inicio del episodio actual: < 24 h, ≥ 24 h o desconocido',
      'FEVI > 40% o FEVI ≤ 40% / insuficiencia cardíaca sistólica',
      'CHA2DS2-VA, factores de sangrado y función renal si vas a anticoagular',
    ],
    quickSummary: [
      {
        id: 'inestable',
        title: 'Inestable',
        action: 'Cardioversión eléctrica urgente y luego plan anticoagulante.',
      },
      {
        id: 'lt24',
        title: 'Estable < 24 h',
        action: 'Controlar frecuencia primero. Si sigue indicado, valorar control precoz del ritmo.',
      },
      {
        id: 'gte24',
        title: '≥ 24 h / desconocida',
        action: 'Frecuencia primero. Anticoagulación o ETE antes de cardioversión precoz.',
      },
      {
        id: 'always',
        title: 'Siempre',
        action: 'Revisar CHA2DS2-VA, factores de sangrado y función renal si vas a anticoagular.',
      },
    ],
    decisionCards: [
      {
        id: 'inestable',
        situation: 'FA con inestabilidad hemodinámica',
        action: 'Cardioversión eléctrica urgente. No retrases la actuación por la duración del episodio.',
        nuance: 'Tras estabilizar, documenta anticoagulación y plan de continuación según duración del episodio, cardioversión y riesgo tromboembólico.',
      },
      {
        id: 'lt24',
        situation: 'FA rápida, estable, < 24 h',
        action: 'Controla primero la frecuencia. Después, si persisten síntomas o interesa control precoz del ritmo, valora cardioversión eléctrica o farmacológica.',
        nuance: 'Mantén anticoagulación 4 semanas tras cardioversión salvo escenarios muy seleccionados con inicio < 24 h y riesgo tromboembólico muy bajo.',
      },
      {
        id: 'gte24',
        situation: 'FA rápida, estable, ≥ 24 h o de duración desconocida',
        action: 'Control de frecuencia y anticoagulación antes de cardioversión precoz, o ETE si se plantea estrategia temprana guiada.',
        nuance: 'Si no hay estenosis mitral moderada/grave ni prótesis mecánica, prioriza ACOD; si existen, orientar a AVK.',
      },
      {
        id: 'slow-normal',
        situation: 'FA lenta o frecuencia 60-100 lat/min',
        action: 'Si no hay síntomas relevantes, priorizar causa desencadenante y necesidad de anticoagulación.',
        nuance: 'Si la frecuencia es < 40 lat/min o hay pausas > 3 s, manejar como bradiarritmia.',
      },
    ],
    warnings: [
      'No combines de entrada betabloqueante con verapamilo o diltiazem; si un fármaco no basta, la combinación exige monitorización estrecha.',
      'Digoxina y verapamilo pueden aumentar el riesgo de bradicardia y elevar niveles de digoxina.',
      'Si el episodio dura ≥ 24 h o es desconocido, no plantees cardioversión precoz sin 3 semanas de ACO terapéutica o ETE.',
      'HAS-BLED no debe usarse para negar anticoagulación; corrige factores modificables y vigila más de cerca.',
      'Con estenosis mitral moderada/grave o prótesis mecánica, orientar a AVK.',
    ],
    calculatorIds: ['cha2ds2-va', 'has-bled', 'cockcroft-gault'],
    medicationGroups: [
      {
        title: 'Control de frecuencia',
        medicationIds: ['metoprolol', 'verapamilo', 'digoxina', 'amiodarona'],
      },
      {
        title: 'Anticoagulación en FA no valvular',
        medicationIds: ['apixaban', 'dabigatran', 'edoxaban', 'rivaroxaban'],
      },
      {
        title: 'Puente o AVK',
        medicationIds: ['acenocumarol', 'enoxaparina'],
      },
    ],
    bibliography: [
      escFaEntry({
        id: 'esc-fa-key-recommendations',
        verifiedPages: [75, 76],
        pdfPages: [75, 76],
        note: 'Referencia principal actual del protocolo: mensajes operativos de la guía ESC 2024.',
      }),
      escFaEntry({
        id: 'esc-fa-risk-anticoag',
        verifiedPages: [32, 39, 40],
        pdfPages: [32, 39, 40],
        note: 'CHA2DS2-VA, umbrales de anticoagulación y manejo del riesgo hemorrágico.',
      }),
      escFaEntry({
        id: 'esc-fa-rate-control',
        verifiedPages: [43, 44, 45],
        pdfPages: [43, 44, 45],
        note: 'Control agudo de frecuencia según FEVI y estabilidad clínica.',
      }),
      escFaEntry({
        id: 'esc-fa-cardioversion',
        verifiedPages: [46, 47, 48, 49],
        pdfPages: [46, 47, 48, 49],
        note: 'Cardioversión en FA aguda y requisito de anticoagulación o ETE cuando el episodio es ≥ 24 h o desconocido.',
      }),
      referenceEntry({
        id: 'fa-start',
        indexPage: 184,
        verifiedPage: 184,
        pdfPage: 209,
        note: 'Referencia secundaria de apoyo práctico en la obra base.',
      }),
      createBibliographyEntry({
        id: 'fa-flow',
        referenceId: 'murillo7',
        verifiedPages: [187, 188, 191, 192],
        pdfPages: [212, 213, 216, 217],
        note: 'Apoyo práctico complementario sobre control de frecuencia, ritmo y dosificación contextual.',
      }),
      createBibliographyEntry({
        id: 'fa-anticoag',
        referenceId: 'murillo7',
        verifiedPages: [189, 190],
        pdfPages: [214, 215],
        note: 'Referencia secundaria de apoyo para anticoagulación y seguimiento clínico.',
      }),
    ],
  },
  'hta-urgencias': {
    id: 'hta-urgencias',
    title: 'HTA en urgencias',
    longTitle: 'Urgencia y emergencia hipertensivas',
    chapter: 'Caps. 32-33',
    section: 'Urgencias cardiovasculares',
    indexPage: 246,
    verifiedPage: 246,
    pdfPage: 271,
    status: 'implementado',
    summary: 'Separar urgencia y emergencia, reconocer daño agudo de órgano diana y bajar la presión de forma segura.',
    quickChecks: [
      'Confirmar PAS y PAD',
      'Buscar daño agudo de órgano diana',
      'Decidir si precisa ingreso y monitorización',
      'Elegir descenso gradual u hospitalario titulado',
    ],
    quickSummary: [
      {
        id: 'medicion',
        title: 'Registro inicial',
        action: 'Tomar PAS/PAD y reevaluar la cifra en contexto clínico.',
      },
      {
        id: 'dod',
        title: 'Daño diana',
        action: 'Buscar focalidad, dolor torácico, edema pulmonar, deterioro renal o contexto gestacional.',
      },
      {
        id: 'urgencia',
        title: 'Urgencia hipertensiva',
        action: 'Sin daño agudo de órgano. Reposo, reevaluación y descenso progresivo; no suele requerir ingreso.',
      },
      {
        id: 'emergencia',
        title: 'Emergencia hipertensiva',
        action: 'Con daño agudo de órgano. Ingreso, monitorización y tratamiento intravenoso titulado.',
      },
    ],
    warnings: [
      'Evita reducciones rápidas, no controladas o excesivas de la presión arterial.',
      'La vía intravenosa y la monitorización continua se reservan para la emergencia hipertensiva o el manejo hospitalario seleccionado.',
      'La cifra aislada no basta: manda el daño de órgano diana y el contexto clínico.',
    ],
    medicationGroups: [
      {
        title: 'Urgencia hipertensiva',
        medicationIds: ['captopril', 'labetalol', 'amlodipino'],
      },
      {
        title: 'Emergencia hipertensiva',
        medicationIds: ['labetalol', 'nitroglicerina', 'nitroprusiato'],
      },
    ],
    bibliography: [
      escHtaEntry({
        id: 'esc-hta-acute-management',
        verifiedPages: [79, 80],
        pdfPages: [80, 81],
        note: 'Referencia principal: descenso agudo y manejo hospitalario de la emergencia hipertensiva.',
      }),
      escHtaEntry({
        id: 'esc-hta-pregnancy',
        verifiedPages: [81],
        pdfPages: [82],
        note: 'HTA grave del embarazo, preeclampsia y edema pulmonar en el contexto hipertensivo agudo.',
      }),
      referenceEntry({
        id: 'hta-urgency-start',
        indexPage: 246,
        verifiedPage: 246,
        pdfPage: 271,
        note: 'Inicio real del capítulo de urgencia hipertensiva.',
      }),
      referenceEntry({
        id: 'hta-emergency-start',
        indexPage: 249,
        verifiedPage: 249,
        pdfPage: 274,
        note: 'Inicio real del capítulo de emergencia hipertensiva.',
      }),
      createBibliographyEntry({
        id: 'hta-oral-treatment',
        referenceId: 'murillo7',
        verifiedPages: [247, 248],
        pdfPages: [272, 273],
        note: 'Medidas generales y tratamiento oral de la urgencia hipertensiva.',
      }),
      createBibliographyEntry({
        id: 'hta-iv-treatment',
        referenceId: 'murillo7',
        verifiedPages: [250, 251],
        pdfPages: [275, 276],
        note: 'Objetivos terapéuticos y fármacos intravenosos de la emergencia hipertensiva.',
      }),
    ],
  },
  'sindrome-coronario-agudo': {
    id: 'sindrome-coronario-agudo',
    title: 'Síndrome coronario agudo',
    longTitle: 'Infarto / síndrome coronario agudo',
    chapter: 'Cap. 26',
    section: 'Urgencias cardiovasculares',
    indexPage: 214,
    verifiedPage: 214,
    pdfPage: 239,
    status: 'implementado',
    summary: 'ECG, hs-cTn y riesgo para decidir reperfusión, coronariografía y antitrombosis sin retrasos.',
    quickChecks: [
      'ECG de 12 derivaciones en los primeros 10 min',
      'Detectar shock, edema agudo de pulmón o arritmias graves',
      'Pedir hs-cTn y aplicar 0 h/1 h o 0 h/2 h si no hay SCACEST',
      'Clasificar en SCACEST o SCASEST',
      'Decidir reperfusión, coronariografía e ingreso monitorizado',
    ],
    quickSummary: [
      {
        id: 'critical',
        title: 'Muy alto riesgo',
        action: 'Shock, edema pulmonar, arritmias malignas o dolor refractario: angiografía inmediata.',
      },
      {
        id: 'stemi',
        title: 'SCACEST',
        action: 'No esperar hs-cTn. Reperfusión inmediata con ICP primaria o fibrinólisis si no llegas a tiempo.',
      },
      {
        id: 'nstemi-high',
        title: 'SCASEST',
        action: 'Usa hs-cTn 0 h/1 h o 0 h/2 h y el riesgo para decidir angiografía inmediata, < 24 h o durante el ingreso.',
      },
      {
        id: 'always',
        title: 'Siempre',
        action: 'Monitorizar, tratar el dolor y dejar definido el destino del paciente.',
      },
    ],
    warnings: [
      'No esperes hs-cTn si la clínica y el ECG encajan con SCACEST o con SCASEST de muy alto riesgo.',
      'La fibrinólisis no tiene lugar en el SCASEST.',
      'Evita nitratos en infarto de ventrículo derecho, hipotensión o uso reciente de inhibidores de la PDE5.',
      'No uses oxígeno de rutina si la SpO2 es > 90%; todos los SCA requieren monitorización e ingreso.',
    ],
    medicationGroups: [
      {
        title: 'Analgesia y antiisquémico',
        medicationIds: ['nitroglicerina-sca', 'morfina-sca'],
      },
      {
        title: 'Antitrombótico inicial',
        medicationIds: [
          'acido-acetilsalicilico',
          'prasugrel',
          'ticagrelor',
          'clopidogrel',
          'heparina-sodica',
          'enoxaparina-sca',
          'fondaparinux-sca',
        ],
      },
    ],
    bibliography: [
      escScaEntry({
        id: 'esc-sca-triage',
        verifiedPages: [16, 19],
        pdfPages: [17, 20],
        note: 'Referencia principal: triaje, ECG precoz y algoritmos de hs-cTn 0 h/1 h o 0 h/2 h.',
      }),
      escScaEntry({
        id: 'esc-sca-initial-treatment',
        verifiedPages: [25],
        pdfPages: [26],
        note: 'Monitorización, oxígeno, nitratos y analgesia en la fase aguda.',
      }),
      escScaEntry({
        id: 'esc-sca-invasive-strategy',
        verifiedPages: [32],
        pdfPages: [33],
        note: 'Tiempos de estrategia invasiva en SCASEST y marco del tratamiento antitrombótico.',
      }),
      escScaEntry({
        id: 'esc-sca-antithrombotic',
        verifiedPages: [33, 40],
        pdfPages: [34, 41],
        note: 'Dosis y recomendaciones de antiagregación y anticoagulación en SCA.',
      }),
      createBibliographyEntry({
        id: 'sca-diagnosis',
        referenceId: 'murillo7',
        verifiedPages: [215, 216, 217, 218],
        pdfPages: [240, 241, 242, 243],
        note: 'Clasificación, clínica, ECG y biomarcadores para tipificar SCACEST y SCASEST.',
      }),
      createBibliographyEntry({
        id: 'sca-treatment',
        referenceId: 'murillo7',
        verifiedPages: [221, 222, 223, 224, 225, 226],
        pdfPages: [246, 247, 248, 249, 250, 251],
        note: 'Tratamiento general, antiisquémico, antiagregación, anticoagulación y reperfusión.',
      }),
    ],
  },
  'taquiarritmias-bradicardias': {
    id: 'taquiarritmias-bradicardias',
    title: 'Taquiarritmias y bradicardias',
    longTitle: 'Taquiarritmias y bradicardias',
    chapter: 'Guías ESC 2019 / 2021 / 2022',
    section: 'Urgencias cardiovasculares',
    indexPage: 71,
    verifiedPage: 71,
    pdfPage: 96,
    status: 'implementado',
    summary: '¿Taquicardia o bradicardia? Inestabilidad, patrón del QRS y conducta eléctrica o farmacológica inmediata.',
    quickChecks: [
      'ECG, pulsioximetría, presión arterial y vía venosa',
      'Shock, síncope, isquemia o insuficiencia cardíaca',
      'Si es taquicardia: QRS estrecho o ancho, regular o irregular',
      'Si es bradicardia: síntomas y riesgo de asistolia',
      'Abrir procedimiento o fármaco solo cuando cambia la conducta',
    ],
    quickSummary: [
      {
        id: 'unstable-tachy',
        title: 'Taquicardia inestable',
        action: 'Cardioversión sincronizada inmediata.',
      },
      {
        id: 'narrow-regular',
        title: 'QRS estrecho regular',
        action: 'Maniobras vagales y adenosina; si no revierte, siguiente escalón.',
      },
      {
        id: 'wide',
        title: 'QRS ancho',
        action: 'Si hay duda, manejar como TV y preparar cardioversión.',
      },
      {
        id: 'brady',
        title: 'Bradicardia sintomática',
        action: 'Atropina y, si no responde o hay alto riesgo, marcapasos transcutáneo.',
      },
    ],
    decisionCards: [
      {
        id: 'tachy-unstable',
        situation: 'Taquicardia con shock, síncope, isquemia o insuficiencia cardíaca',
        action: 'Cardioversión sincronizada inmediata. No retrases el choque por clasificar el ritmo.',
        nuance: 'Si no revierte y persiste la inestabilidad, repetir choque tras optimizar sedación/sincronía y considerar amiodarona IV.',
      },
      {
        id: 'narrow-regular-stable',
        situation: 'Taquicardia regular de QRS estrecho, estable',
        action: 'Empieza por maniobras vagales y continúa con adenosina IV rápida si no revierte.',
        nuance: 'Si no revierte, reevalúa el ritmo y considera verapamilo o betabloqueante solo si sigue estable y el contexto lo permite.',
      },
      {
        id: 'wide-stable',
        situation: 'Taquicardia de QRS ancho, estable',
        action: 'Si no tienes certeza de TSV con aberrancia, trata como TV.',
        nuance: 'La irregularidad obliga a pensar en fibrilación auricular preexcitada o TV polimórfica y evita bloqueadores nodales.',
      },
      {
        id: 'brady-symptomatic',
        situation: 'Bradicardia con síntomas o alto riesgo de asistolia',
        action: 'Atropina IV y preparación de marcapasos transcutáneo si no hay respuesta adecuada.',
        nuance: 'Mobitz II, bloqueo completo con QRS ancho o pausas > 3 s obligan a ayuda experta y vía de estimulación temporal.',
      },
    ],
    warnings: [
      'No uses bloqueadores nodales si sospechas fibrilación auricular preexcitada.',
      'En toda taquicardia inestable manda la cardioversión sincronizada, no la clasificación fina del ECG.',
      'Si el QRS es ancho y no estás seguro, trátalo como taquicardia ventricular.',
      'La atropina no debe retrasar el marcapasos externo en bloqueo de alto grado o inestabilidad persistente.',
    ],
    medicationGroups: [
      {
        title: 'Taquicardia regular de QRS estrecho',
        medicationIds: ['adenosina', 'verapamilo', 'metoprolol'],
      },
      {
        title: 'QRS ancho o TV',
        medicationIds: ['amiodarona-vt'],
      },
      {
        title: 'Bradicardia sintomática',
        medicationIds: ['atropina'],
      },
    ],
    bibliography: [
      escTsvEntry({
        id: 'tsv-acute-esc-2019',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para taquicardia regular de QRS estrecho y abordaje inicial de taquicardias supraventriculares.',
      }),
      escBradyEntry({
        id: 'brady-acute-esc-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para bradicardias, trastornos de conducción y necesidad de estimulación.',
      }),
      escVentricularEntry({
        id: 'ventricular-acute-esc-2022',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para taquicardia de QRS ancho y arritmias ventriculares.',
      }),
    ],
  },
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
