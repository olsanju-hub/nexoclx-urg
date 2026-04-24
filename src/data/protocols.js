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

export const protocolCatalog = {
  'fibrilacion-auricular': {
    id: 'fibrilacion-auricular',
    title: 'Fibrilación auricular',
    longTitle: 'Fibrilación y flúter auriculares',
    chapter: 'Cap. 23',
    section: 'Urgencias cardiovasculares',
    indexPage: 184,
    verifiedPage: 184,
    pdfPage: 209,
    status: 'implementado',
    summary: 'Decidir por estabilidad, duración del episodio y necesidad de anticoagulación.',
    quickChecks: [
      'ECG y tira de ritmo',
      'Estable o inestable',
      'Duración: < 48 h, > 48 h o desconocida',
      'Creatinina y coagulación si cambia la decisión terapéutica',
    ],
    quickSummary: [
      {
        id: 'inestable',
        title: 'Inestable',
        action: 'Cardioversión urgente o anticoagulación + ETE según duración.',
      },
      {
        id: 'lt48',
        title: 'Estable < 48 h',
        action: 'Controlar frecuencia primero. Valorar ritmo y anticoagulación posterior.',
      },
      {
        id: 'gt48',
        title: '> 48 h / desconocida',
        action: 'Frecuencia primero. Anticoagulación antes de cardioversión.',
      },
      {
        id: 'always',
        title: 'Siempre',
        action: 'Revisar CHA2DS2-VASc, HAS-BLED y función renal si vas a anticoagular.',
      },
    ],
    decisionCards: [
      {
        id: 'inestable',
        situation: 'FA con inestabilidad hemodinámica',
        action: 'Medidas generales y cardioversión eléctrica urgente si la FA rápida es < 48 h o fracasa el tratamiento farmacológico.',
        nuance: 'Si dura > 48 h o es desconocida, anticoagulación terapéutica y valorar ecocardiografía transesofágica antes de cardioversión.',
      },
      {
        id: 'lt48',
        situation: 'FA rápida, estable, < 48 h',
        action: 'Controlar primero la frecuencia. Sin insuficiencia cardíaca: metoprolol o verapamilo; con insuficiencia cardíaca: digoxina; amiodarona como rescate agudo.',
        nuance: 'Tras controlar frecuencia, valorar cardioversión y si hace falta anticoagulación de 4 semanas según duración y riesgo.',
      },
      {
        id: 'gt48',
        situation: 'FA rápida, estable, > 48 h o de duración desconocida',
        action: 'Control de frecuencia y estrategia anticoagulante antes de cardioversión.',
        nuance: 'Sin estenosis mitral moderada/grave ni prótesis mecánica, pensar en ACOD; si existen, orientar a AVK.',
      },
      {
        id: 'slow-normal',
        situation: 'FA lenta o frecuencia 60-100 lat/min',
        action: 'Si no hay síntomas relevantes, priorizar causa desencadenante y necesidad de anticoagulación.',
        nuance: 'Si la frecuencia es < 40 lat/min o hay pausas > 3 s, manejar como bradiarritmia.',
      },
    ],
    warnings: [
      'No combinar de entrada betabloqueante con verapamilo o diltiazem.',
      'Digoxina + verapamilo puede elevar niveles de digoxina.',
      'HAS-BLED ≥ 3 no contraindica por sí mismo anticoagular; obliga a control más estrecho.',
      'Con estenosis mitral moderada/grave o prótesis mecánica, el capítulo orienta a AVK.',
    ],
    calculatorIds: ['cha2ds2-vasc', 'has-bled', 'cockcroft-gault'],
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
      referenceEntry({
        id: 'fa-start',
        indexPage: 184,
        verifiedPage: 184,
        pdfPage: 209,
        note: 'Inicio real del capítulo verificado en el PDF local.',
      }),
      createBibliographyEntry({
        id: 'fa-flow',
        referenceId: 'murillo7',
        verifiedPages: [187, 188, 191, 192],
        pdfPages: [212, 213, 216, 217],
        note: 'Objetivos terapéuticos, control de frecuencia, control del ritmo y ramas según duración del episodio.',
      }),
      createBibliographyEntry({
        id: 'fa-anticoag',
        referenceId: 'murillo7',
        verifiedPages: [189, 190],
        pdfPages: [214, 215],
        note: 'CHA2DS2-VASc, HAS-BLED y tratamiento anticoagulante orientado por riesgo.',
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
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
