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
    summary: 'Clasificar daño de órgano diana y decidir tratamiento oral o intravenoso sin convertirlo en una guía larga.',
    quickChecks: [
      'Registrar PAS y PAD',
      'Buscar daño agudo de órgano diana',
      'Definir si es urgencia o emergencia',
      'Elegir vía oral o intravenosa y monitorización',
    ],
    quickSummary: [
      {
        id: 'medicion',
        title: 'Registro inicial',
        action: 'Tomar PAS/PAD y estimar si la elevación es ligera, moderada o grave.',
      },
      {
        id: 'dod',
        title: 'Daño diana',
        action: 'Buscar focalidad neurológica, dolor torácico, edema pulmonar, disfunción renal o contexto gestacional.',
      },
      {
        id: 'urgencia',
        title: 'Urgencia hipertensiva',
        action: 'Sin daño agudo de órgano. Reposo, reevaluación y descenso gradual con vía oral.',
      },
      {
        id: 'emergencia',
        title: 'Emergencia hipertensiva',
        action: 'Con daño agudo de órgano. Monitorización y tratamiento intravenoso titulado.',
      },
    ],
    warnings: [
      'No usar nifedipino sublingual por riesgo de hipotensión brusca e hipoperfusión.',
      'La vía intravenosa se reserva para emergencia hipertensiva o imposibilidad de vía oral.',
      'La presión debe descender de forma controlada; no trates solo la cifra.',
    ],
    medicationGroups: [
      {
        title: 'Urgencia hipertensiva',
        medicationIds: ['captopril', 'labetalol', 'amlodipino'],
      },
      {
        title: 'Emergencia hipertensiva',
        medicationIds: ['nitroprusiato', 'labetalol', 'nitroglicerina'],
      },
    ],
    bibliography: [
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
    summary: 'Diferenciar SCACEST y SCASEST, detectar muy alto riesgo y activar reperfusión o ingreso sin retrasos.',
    quickChecks: [
      'ECG de 12 derivaciones en los primeros 10 min',
      'Descartar shock, edema agudo de pulmón o arritmias graves',
      'Clasificar en SCACEST o SCASEST',
      'Decidir reperfusión, ingreso y tratamiento antitrombótico inicial',
    ],
    quickSummary: [
      {
        id: 'critical',
        title: 'Muy alto riesgo',
        action: 'Angina refractaria, insuficiencia cardíaca, arritmias ventriculares o inestabilidad: coronariografía urgente.',
      },
      {
        id: 'stemi',
        title: 'SCACEST',
        action: 'No esperar troponina. Reperfusión precoz con ICP primaria o fibrinólisis si no llega a tiempo.',
      },
      {
        id: 'nstemi-high',
        title: 'SCASEST alto riesgo',
        action: 'Doble antiagregación, anticoagulación y estrategia invasiva en menos de 24 h.',
      },
      {
        id: 'always',
        title: 'Siempre',
        action: 'Monitorizar, tratar el dolor y dejar claro el destino del paciente.',
      },
    ],
    warnings: [
      'No esperar el resultado de la troponina si la clínica y el ECG son compatibles con SCACEST.',
      'La fibrinólisis está contraindicada en el SCASEST.',
      'Evitar nitratos en infarto de ventrículo derecho, hipotensión o uso reciente de inhibidores de la PDE5.',
      'Todos los pacientes con SCA requieren ingreso hospitalario.',
    ],
    medicationGroups: [
      {
        title: 'Analgesia y antiisquémico',
        medicationIds: ['nitroglicerina-sca', 'morfina-sca'],
      },
      {
        title: 'Antitrombótico inicial',
        medicationIds: ['acido-acetilsalicilico', 'ticagrelor', 'clopidogrel', 'heparina-sodica', 'enoxaparina-sca'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'sca-start',
        indexPage: 214,
        verifiedPage: 214,
        pdfPage: 239,
        note: 'Inicio real del capítulo de síndrome coronario agudo.',
      }),
      createBibliographyEntry({
        id: 'sca-diagnosis',
        referenceId: 'murillo7',
        verifiedPages: [215, 216, 217, 218],
        pdfPages: [240, 241, 242, 243],
        note: 'Clasificación, clínica, ECG y biomarcadores para tipificar SCACEST y SCASEST.',
      }),
      createBibliographyEntry({
        id: 'sca-risk',
        referenceId: 'murillo7',
        verifiedPages: [219, 220],
        pdfPages: [244, 245],
        note: 'Estratificación del riesgo, escala GRACE, Killip y criterios de ingreso.',
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
