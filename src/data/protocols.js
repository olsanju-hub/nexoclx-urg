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
  bradicardias: {
    id: 'bradicardias',
    title: 'Bradicardias',
    longTitle: 'Bradicardias',
    chapter: 'Guía ESC 2021',
    section: 'Urgencias cardiovasculares',
    indexPage: 71,
    verifiedPage: 71,
    pdfPage: 96,
    status: 'implementado',
    summary: 'Ritmo lento con o sin repercusión, bloqueo AV de alto riesgo y vía de estimulación urgente.',
    quickChecks: [
      'ECG de 12 derivaciones, presión arterial y monitorización',
      'Shock, síncope, isquemia o insuficiencia cardíaca',
      'Bradicardia sinusal frente a bloqueo AV / trastorno de conducción',
      'Mobitz II, bloqueo AV completo con QRS ancho o pausas > 3 s',
      'Causas reversibles y fármacos bradicardizantes',
    ],
    quickSummary: [
      {
        id: 'brady-unstable',
        title: 'Con repercusión',
        action: 'Atropina IV y, si no responde o hay alto riesgo, marcapasos transcutáneo.',
      },
      {
        id: 'brady-sinus',
        title: 'Sinusal / nodo',
        action: 'Corrige causa, ECG y vigila antes de tratar por inercia si está estable.',
      },
      {
        id: 'brady-av',
        title: 'Bloqueo AV / alto riesgo',
        action: 'Ayuda experta y deja preparada la vía de estimulación aunque siga estable.',
      },
    ],
    decisionCards: [
      {
        id: 'brady-symptomatic',
        situation: 'Bradicardia con shock, síncope, isquemia o insuficiencia cardíaca',
        action: 'Atropina IV y reevaluación rápida. Si no responde o el bloqueo es de alto grado, marcapasos transcutáneo.',
        nuance: 'La atropina no debe retrasar la estimulación cuando el paciente sigue mal o el bloqueo es avanzado.',
      },
      {
        id: 'brady-sinus-stable',
        situation: 'Bradicardia sinusal o del nodo, estable',
        action: 'ECG, causas reversibles, revisión de fármacos y observación clínica.',
        nuance: 'Si aparecen síntomas o empeora la perfusión, vuelve a la rama sintomática.',
      },
      {
        id: 'brady-high-risk',
        situation: 'Mobitz II, bloqueo AV completo con QRS ancho o pausas > 3 s',
        action: 'Monitorización estrecha, ayuda experta y preparación de estimulación temporal.',
        nuance: 'No esperes al deterioro hemodinámico para dejar resuelta la vía de pacing.',
      },
    ],
    warnings: [
      'La atropina no debe retrasar el marcapasos externo en bloqueo de alto grado o inestabilidad persistente.',
      'Dosis menores de 0,5 mg de atropina pueden empeorar la bradicardia.',
      'Si sospechas una causa reversible, corrígela en paralelo y no después.',
    ],
    medicationGroups: [
      {
        title: 'Bradicardia sintomática',
        medicationIds: ['atropina'],
      },
    ],
    bibliography: [
      escBradyEntry({
        id: 'brady-acute-esc-2021',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal para bradicardias, trastornos de conducción y necesidad de estimulación.',
      }),
    ],
  },
  'arritmias-ventriculares': {
    id: 'arritmias-ventriculares',
    title: 'Arritmias ventriculares',
    longTitle: 'Arritmias ventriculares',
    chapter: 'Guía ESC 2022',
    section: 'Urgencias cardiovasculares',
    indexPage: 71,
    verifiedPage: 71,
    pdfPage: 96,
    status: 'implementado',
    summary: 'TV con pulso o sin pulso, estabilidad clínica y manejo inicial de TV monomorfa o torsades.',
    quickChecks: [
      'Confirma si hay pulso y monitoriza ECG continuo',
      'Shock, síncope, isquemia o insuficiencia cardíaca',
      'TV monomorfa regular frente a TV polimórfica / torsades',
      'QT largo, hipopotasemia, hipomagnesemia o fármacos desencadenantes',
      'Ayuda experta y preparación de electricidad si hay deterioro',
    ],
    quickSummary: [
      {
        id: 'vt-pulseless',
        title: 'Sin pulso',
        action: 'Desfibrilación y algoritmo de parada; este módulo solo deja clara esa salida.',
      },
      {
        id: 'vt-unstable',
        title: 'TV con pulso inestable',
        action: 'Cardioversión urgente; si es polimórfica o no sincroniza, desfibrilación.',
      },
      {
        id: 'vt-stable',
        title: 'TV monomorfa estable',
        action: 'Si no estás seguro del mecanismo, trátala como ventricular y usa amiodarona IV.',
      },
      {
        id: 'torsades',
        title: 'TV polimórfica / torsades',
        action: 'Magnesio IV, corregir causas y electricidad si no se sostiene estable.',
      },
    ],
    decisionCards: [
      {
        id: 'vt-pulseless-decision',
        situation: 'Arritmia ventricular sin pulso',
        action: 'Desfibrilación inmediata y protocolo de parada cardiorrespiratoria.',
        nuance: 'La bibliografía principal cargada aquí manda en el reconocimiento de la arritmia, pero no sustituye un módulo completo de ALS/ERC para la parada.',
      },
      {
        id: 'vt-unstable-decision',
        situation: 'TV con pulso e inestabilidad hemodinámica',
        action: 'Cardioversión sincronizada inmediata. Si es polimórfica o la sincronía no es posible, desfibrilar.',
        nuance: 'No retrases la electricidad por terminar de afinar el subtipo de TV.',
      },
      {
        id: 'vt-monomorphic-stable',
        situation: 'TV monomorfa estable',
        action: 'Si dudas del mecanismo del QRS ancho, trátala como ventricular y usa amiodarona IV.',
        nuance: 'Monitorización continua y preparación de cardioversión si cambia la perfusión.',
      },
      {
        id: 'vt-polymorphic',
        situation: 'TV polimórfica / torsades de pointes',
        action: 'Sulfato de magnesio IV, corrección de electrolitos y retirada de fármacos que prolonguen QT.',
        nuance: 'Si deteriora o no puedes mantener sincronía, el siguiente paso es la electricidad.',
      },
    ],
    warnings: [
      'Si el QRS es ancho y no estás seguro, es más seguro tratarlo como taquicardia ventricular.',
      'En TV con pulso inestable manda la electricidad, no la explicación teórica del ECG.',
      'Torsades obliga a buscar QT largo, electrolitos y fármacos desencadenantes en paralelo al tratamiento.',
    ],
    medicationGroups: [
      {
        title: 'TV monomorfa estable',
        medicationIds: ['amiodarona-vt'],
      },
      {
        title: 'TV polimórfica / torsades',
        medicationIds: ['magnesio-torsades'],
      },
    ],
    bibliography: [
      escVentricularEntry({
        id: 'ventricular-acute-esc-2022',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal para taquicardia ventricular, arritmias ventriculares agudas y torsades.',
      }),
    ],
  },
  'ictus-isquemico': {
    id: 'ictus-isquemico',
    title: 'Ictus isquémico',
    longTitle: 'Ictus isquémico',
    chapter: 'AHA 2026',
    section: 'Urgencias neurológicas',
    indexPage: 442,
    verifiedPage: 442,
    pdfPage: 467,
    status: 'implementado',
    summary: 'Código ictus, TAC sin sangrado, ventana terapéutica y reperfusión ordenados para actuar.',
    quickChecks: [
      'Hora de última vez bien y glucemia capilar',
      'TAC craneal sin sangrado y angio-TC si sospecha de gran vaso',
      'Déficit discapacitante oclusión de gran vaso sí/no',
      'Candidatura a trombólisis IV y a trombectomía',
      'Control de PA y destino a centro con capacidad de reperfusión',
    ],
    warnings: [
      'No retrases el TAC ni la activación del código ictus por completar estudios secundarios.',
      'Antes de trombólisis IV, controla la PA por debajo de 185/110 mmHg; después, mantén < 180/105 mmHg.',
      'Si sospechas oclusión de gran vaso, la trombectomía manda sobre el detalle secundario del protocolo local.',
    ],
    medicationGroups: [
      {
        title: 'Reperfusión y control tensional',
        medicationIds: ['alteplasa-ictus', 'labetalol-ictus'],
      },
    ],
    bibliography: [
      ahaIschemicStrokeEntry({
        id: 'ictus-isquemico-aha-2026',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal del módulo: manejo inicial, trombólisis IV y trombectomía.',
      }),
      createBibliographyEntry({
        id: 'ictus-isquemico-murillo',
        referenceId: 'murillo7',
        verifiedPages: [442, 443, 444, 445],
        pdfPages: [467, 468, 469, 470],
        note: 'Apoyo práctico secundario para ictus agudo en la obra base.',
      }),
    ],
  },
  'ictus-hemorragico': {
    id: 'ictus-hemorragico',
    title: 'Ictus hemorrágico',
    longTitle: 'Ictus hemorrágico',
    chapter: 'AHA 2022',
    section: 'Urgencias neurológicas',
    indexPage: 442,
    verifiedPage: 442,
    pdfPage: 467,
    status: 'implementado',
    summary: 'TAC, control de PA, reversión de anticoagulación y destino neurocrítico sin texto sobrante.',
    quickChecks: [
      'TAC craneal urgente y valoración de vía aérea / Glasgow',
      'PAS actual y necesidad de control tensional rápido',
      'Anticoagulación activa o antiagregación relevante',
      'Signos de herniación, hidrocefalia o hemorragia cerebelosa',
      'Destino a UCI / neurocirugía y medidas de neuroprotección',
    ],
    warnings: [
      'La neuroimagen urgente y la reversión de anticoagulación no deben retrasarse.',
      'No uses transfusión de plaquetas de rutina en ICH asociada a antiagregación si no hay cirugía urgente o trombocitopenia grave.',
      'La hemorragia cerebelosa con deterioro, compresión de tronco o hidrocefalia requiere valoración neuroquirúrgica inmediata.',
    ],
    medicationGroups: [
      {
        title: 'Control tensional inicial',
        medicationIds: ['labetalol-ictus'],
      },
    ],
    bibliography: [
      ahaHemorrhagicStrokeEntry({
        id: 'ictus-hemorragico-aha-2022',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal del módulo: control de PA, reversión y criterios de neurocirugía / UCI.',
      }),
      createBibliographyEntry({
        id: 'ictus-hemorragico-murillo',
        referenceId: 'murillo7',
        verifiedPages: [442, 443, 444, 445],
        pdfPages: [467, 468, 469, 470],
        note: 'Apoyo práctico secundario del capítulo de ictus en la obra base.',
      }),
    ],
  },
  'neumonia-comunidad': {
    id: 'neumonia-comunidad',
    title: 'Neumonía',
    longTitle: 'Neumonía adquirida en la comunidad',
    chapter: 'NICE NG250 2025 + Cap. 42',
    section: 'Urgencias del aparato respiratorio',
    indexPage: 300,
    verifiedPage: 300,
    pdfPage: 325,
    status: 'implementado',
    summary: 'Entrada, confirmación, gravedad, destino, tratamiento, reevaluación, alta segura y seguimiento.',
    quickChecks: [
      'Adulto con sospecha de NAC; excluir nosocomial, pediátrica, ventilación mecánica o inmunosupresión compleja',
      'Primero descartar sepsis, insuficiencia respiratoria, shock, hipotensión, confusión o necesidad de soporte ventilatorio',
      'Confirmar clínica respiratoria, constantes, estado mental y radiografía/imagen si está en urgencias u hospital',
      'CRB-65 si valoración inicial o ambulatoria; CURB-65 si está en hospital',
      'Elegir destino y antibiótico según gravedad, estabilidad, tolerancia oral y soporte domiciliario',
    ],
    quickSummary: [
      {
        id: 'entrada',
        title: 'Entrada',
        action: 'Si parece NAC, confirma adulto inmunocompetente y busca criterios de alarma antes de seguir.',
      },
      {
        id: 'confirmacion',
        title: 'Confirmación',
        action: 'Si está en urgencias/hospital, confirma con Rx o imagen y pide pruebas solo si cambian conducta o hay gravedad.',
      },
      {
        id: 'gravedad',
        title: 'Gravedad',
        action: 'Si es valoración inicial usa CRB-65; si es hospital usa CURB-65. Ajusta por hipoxemia, comorbilidad y soporte.',
      },
      {
        id: 'salida',
        title: 'Salida',
        action: 'Decide domicilio, observación, ingreso o UCI; si usas IV, revisa a las 48 h y pasa a oral si está estable.',
      },
    ],
    decisionCards: [
      {
        id: 'entrada',
        situation: '1. Entrada',
        action: 'Si el paciente es adulto y parece NAC, descarta de entrada neumonía nosocomial, pediátrica, ventilación mecánica e inmunosupresión compleja.',
        nuance: 'Si hay sepsis, insuficiencia respiratoria, hipotensión, confusión, shock o necesidad de soporte ventilatorio, no esperes a completar el flujo: trata como alto riesgo.',
      },
      {
        id: 'confirmacion',
        situation: '2. Confirmación diagnóstica',
        action: 'Si hay clínica respiratoria compatible, toma FR, SatO2, TA, FC, temperatura y estado mental. En urgencias u hospital, confirma con radiografía o imagen.',
        nuance: 'Pide analítica, gasometría, PCR/procalcitonina o microbiología solo si cambia conducta o hay gravedad. En bajo riesgo, no pidas microbiología rutinaria si no cambia el manejo.',
      },
      {
        id: 'gravedad',
        situation: '3. Gravedad',
        action: 'Si estás en ámbito inicial o ambulatorio, usa CRB-65. Si estás en hospital, usa CURB-65.',
        nuance: 'No decidas solo por la escala. Añade juicio clínico, comorbilidad, fragilidad, embarazo, hipoxemia, tolerancia oral y soporte domiciliario.',
      },
      {
        id: 'destino',
        situation: '4. Decisión de destino',
        action: 'Bajo riesgo: domicilio si está estable, tolera vía oral, tiene SatO2 aceptable y red de apoyo. Riesgo intermedio: observación, unidad rápida, hospitalización a domicilio/SDEC o ingreso.',
        nuance: 'Alto riesgo o alarma: ingreso. Valora UCI/intensivos si hay fracaso respiratorio, shock, sepsis grave, deterioro neurológico o necesidad de soporte ventilatorio.',
      },
    ],
    carePath: [
      {
        title: 'Bajo riesgo',
        text: 'Si está estable, tolera vía oral, SatO2 aceptable y tiene apoyo, manejo ambulatorio con instrucciones claras.',
      },
      {
        title: 'Riesgo intermedio',
        text: 'Si necesita vigilancia, pruebas o tratamiento breve, valorar observación, unidad rápida, hospitalización a domicilio/SDEC o ingreso.',
      },
      {
        title: 'Ingreso',
        text: 'Si hay alto riesgo, comorbilidad relevante, mala evolución, hipoxemia, imposibilidad de vía oral o no alta segura.',
      },
      {
        title: 'UCI / críticos',
        text: 'Si hay fracaso respiratorio, shock, sepsis grave, deterioro neurológico o necesidad de soporte ventilatorio.',
      },
    ],
    antibioticPlan: [
      {
        severity: '5. Bajo riesgo',
        regimen: 'Si tolera vía oral: amoxicilina 500 mg/8 h 5 días. Si alergia o sospecha de atípicos: doxiciclina, claritromicina o eritromicina en embarazo.',
      },
      {
        severity: '5. Riesgo moderado',
        regimen: 'Si tolera vía oral: amoxicilina 500 mg/8 h 5 días. Añadir claritromicina si sospechas atípicos. En alergia: doxiciclina o claritromicina.',
      },
      {
        severity: '5. Alto riesgo',
        regimen: 'Si precisa tratamiento inicial IV o vigilancia estrecha: co-amoxiclav oral/IV 5 días más claritromicina oral/IV. Eritromicina si embarazo. En alergia a penicilina: levofloxacino y revisar microbiología local.',
      },
    ],
    reassessment: [
      '6. Si usa antibiótico IV: revisar a las 48 h y pasar a vía oral si hay estabilidad.',
      '6. Reevaluar antes si empeora, aumenta la disnea, persiste fiebre, aparece hipotensión, confusión, hipoxemia o mala tolerancia oral.',
      '6. Si no mejora como esperas: reconsiderar diagnóstico, complicaciones, resistencias, virus/influenza, derrame/empiema, TEP u otro diagnóstico alternativo.',
      '8. Duración habitual: 5 días si hay estabilidad clínica.',
      '8. Radiografía de control no rutinaria. Considerarla a las 6 semanas si fumador, > 50 años, síntomas persistentes o deterioro, pérdida de peso o sospecha de enfermedad pulmonar subyacente.',
      '8. Explicar evolución esperable: la fiebre mejora primero; tos, disnea y cansancio pueden tardar semanas.',
    ],
    noDischargeCriteria: [
      '7. No dar alta si hay inestabilidad clínica relevante.',
      '7. No dar alta si en las últimas 24 h mantiene 2 o más: fiebre, FR elevada, FC > 100, TAS baja, SatO2 baja, alteración mental o incapacidad para comer/beber sin ayuda.',
      '7. Dar instrucciones de alarma: empeoramiento rápido, no mejoría en 72 h, disnea, fiebre persistente, confusión, intolerancia oral o deterioro general.',
    ],
    warnings: [
      'Antes de elegir antibiótico: revisar alergias, función renal, embarazo, QT/interacciones y antibióticos recientes.',
      'Antes de indicar alta: confirmar gravedad clínica, estabilidad respiratoria, tolerancia oral, red de apoyo y necesidad de reevaluación.',
      'CRB-65 y CURB-65 no sustituyen el juicio clínico: hipoxemia, sepsis, complicaciones, fragilidad o inmunosupresión pueden elevar el nivel de cuidados.',
    ],
    calculatorIds: ['crb-65', 'curb-65'],
    bibliography: [
      niceNg250Entry({
        id: 'neumonia-ng250-assessment',
        verifiedPages: [8, 9, 10, 11, 12, 13, 14],
        pdfPages: [8, 9, 10, 11, 12, 13, 14],
        note: 'Sospecha, CRB-65, CURB-65, decisión de lugar de cuidados y pruebas hospitalarias.',
      }),
      niceNg250Entry({
        id: 'neumonia-ng250-antibiotics',
        verifiedPages: [15, 16, 17, 36, 37, 38, 39],
        pdfPages: [15, 16, 17, 36, 37, 38, 39],
        note: 'Inicio y revisión de antibióticos, duración, alta segura, reevaluación y radiografía de control.',
      }),
      referenceEntry({
        id: 'neumonia-murillo-start',
        indexPage: 300,
        verifiedPage: 300,
        pdfPage: 325,
        note: 'Capítulo 42: concepto, clínica inicial, diagnóstico y pruebas urgentes.',
      }),
      createBibliographyEntry({
        id: 'neumonia-murillo-tests',
        referenceId: 'murillo7',
        verifiedPages: [301, 302, 303],
        pdfPages: [326, 327, 328],
        note: 'Apoyo práctico para clínica, exploración, pulsioximetría, gasometría, radiografía y tratamiento inicial.',
      }),
    ],
  },
  'dolor-abdominal-agudo': {
    id: 'dolor-abdominal-agudo',
    title: 'Dolor abdominal agudo',
    longTitle: 'Dolor abdominal agudo',
    chapter: 'Cap. 50',
    section: 'Entrada transversal',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    summary: 'Triaje transversal: gravedad, localizacion y derivacion a rama clinica por especialidad.',
    triage: {
      severityTitle: 'Primero descarta gravedad',
      severityChecks: ['Shock o hipotension', 'Peritonismo o abdomen rigido', 'Fiebre/sepsis', 'Vomitos persistentes', 'Sangrado digestivo', 'Embarazo posible', 'Anciano/fragil', 'Inmunosupresion', 'Anticoagulacion', 'Dolor subito intenso', 'Dolor desproporcionado', 'Cirugia abdominal previa', 'Deterioro rapido'],
      highRisk: ['Monitorizacion si procede.', 'Via venosa.', 'Analgesia precoz.', 'Analitica urgente.', 'Gasometria/lactato si shock, sepsis o isquemia posible.', 'Imagen urgente segun sospecha.', 'Valoracion precoz por cirugia, ginecologia, urologia, vascular o criticos segun contexto.', 'No retrasar cirugia si peritonitis o inestabilidad.'],
      commonTreatment: ['Analgesia precoz.', 'Antiemetico si vomitos.', 'Via venosa si dolor moderado/grave o riesgo clinico.', 'Fluidoterapia si deshidratacion, sepsis o hipotension.', 'Dieta absoluta si sospecha quirurgica, obstruccion, pancreatitis o procedimiento probable.', 'Monitorizacion si inestable.', 'Antibiotico solo si infeccion intraabdominal, sepsis, colangitis, colecistitis complicada, diverticulitis complicada, perforacion u otra indicacion clara.'],
      regions: [
        { id: 'epigastrio', label: 'Epigastrio', suspects: ['Pancreatitis', 'Ulcera/perforacion', 'Biliar alto', 'SCA simulador'], branches: ['dolor-hepatobiliar-pancreatico', 'dolor-simuladores-extraabdominales', 'dolor-abdomen-quirurgico'], tests: ['Lipasa/amilasa si pancreatitis.', 'Perfil hepatico y bilirrubina si biliar.', 'ECG y troponina si edad/riesgo cardiovascular o clinica compatible.', 'Imagen segun sospecha.'], destination: 'Digestivo si pancreatico/biliar; SCA si sospecha cardiaca; cirugia si defensa o peritonismo.' },
        { id: 'hipocondrio-derecho', label: 'Hipocondrio derecho', suspects: ['Colico biliar', 'Colecistitis/colangitis', 'Hepatitis', 'Neumonia basal derecha'], branches: ['dolor-hepatobiliar-pancreatico', 'dolor-infeccioso-digestivo', 'dolor-simuladores-extraabdominales'], tests: ['Hemograma y PCR si procede.', 'Perfil hepatico y bilirrubina.', 'Ecografia abdominal.', 'Orina si sintomas urinarios.', 'Radiografia de torax si sospecha basal.'], destination: 'Digestivo; infecciosas si fiebre/sepsis; simulador respiratorio si clinica basal.' },
        { id: 'hipocondrio-izquierdo', label: 'Hipocondrio izquierdo', suspects: ['Pancreatitis', 'Patologia esplenica', 'Gastritis/ulcera', 'Neumonia basal izquierda', 'Colico renal izquierdo'], branches: ['dolor-hepatobiliar-pancreatico', 'dolor-simuladores-extraabdominales', 'dolor-urinario'], tests: ['Analitica basica.', 'Lipasa/amilasa si sospecha pancreatica.', 'Orina si sospecha urinaria.', 'Imagen segun contexto.'], destination: 'Digestivo o simulador; urologia si flanco/urinario.' },
        { id: 'fosa-iliaca-derecha', label: 'Fosa iliaca derecha', suspects: ['Apendicitis', 'Ileitis/EII', 'Colico renal distal', 'Ectopico/torsion/EPI/quiste'], branches: ['dolor-abdomen-quirurgico', 'dolor-ginecologico', 'dolor-urinario', 'dolor-infeccioso-digestivo'], tests: ['Hemograma y PCR.', 'Orina.', 'Test de embarazo si procede.', 'Ecografia o TC segun edad, sexo y exploracion.', 'Ginecologia si sospecha urgente.'], destination: 'Cirugia si apendicitis/peritonismo; ginecologia si embarazo o dolor anexial; urologia si urinario.' },
        { id: 'fosa-iliaca-izquierda', label: 'Fosa iliaca izquierda', suspects: ['Diverticulitis', 'Colitis', 'Estrenimiento complicado', 'Colico renal distal', 'Ginecologico izquierdo'], branches: ['dolor-infeccioso-digestivo', 'dolor-ginecologico', 'dolor-urinario', 'dolor-abdomen-quirurgico'], tests: ['Hemograma y PCR.', 'Orina.', 'Test de embarazo si procede.', 'TC o ecografia segun sospecha.'], destination: 'Digestivo-infecciosas; cirugia si complicacion o peritonismo.' },
        { id: 'mesogastrio', label: 'Mesogastrio/periumbilical', suspects: ['Gastroenteritis', 'Obstruccion', 'Apendicitis inicial', 'Isquemia mesenterica', 'AAA si riesgo vascular'], branches: ['dolor-abdomen-quirurgico', 'dolor-vascular', 'dolor-hepatobiliar-pancreatico', 'dolor-infeccioso-digestivo'], tests: ['Analitica basica.', 'Lactato/gasometria si gravedad o isquemia.', 'TC si obstruccion, isquemia, aneurisma o duda grave.', 'ECG si riesgo cardiovascular.'], destination: 'Cirugia/vascular si gravedad; digestivo-infecciosas si cuadro leve compatible.' },
        { id: 'hipogastrio', label: 'Hipogastrio/suprapubico', suspects: ['Cistitis/retencion', 'ITU complicada', 'Ginecologico', 'Diverticulitis baja', 'Prostatitis'], branches: ['dolor-urinario', 'dolor-ginecologico', 'dolor-infeccioso-digestivo', 'dolor-abdomen-quirurgico'], tests: ['Orina y sedimento.', 'Funcion renal si complicada.', 'Test de embarazo si procede.', 'Ecografia ginecologica si sospecha.', 'Urologia/ginecologia segun hallazgos.'], destination: 'Urologia o ginecologia; cirugia si peritonismo o progresion.' },
        { id: 'difuso', label: 'Dolor difuso', suspects: ['Peritonitis', 'Obstruccion', 'Isquemia', 'Sepsis abdominal', 'Perforacion', 'Pancreatitis grave'], branches: ['dolor-abdomen-quirurgico', 'dolor-vascular', 'dolor-infeccioso-digestivo', 'dolor-hepatobiliar-pancreatico'], tests: ['Analitica completa.', 'Gasometria/lactato si gravedad.', 'TC urgente si obstruccion, perforacion, isquemia o duda grave.', 'Cirugia precoz si peritonismo o inestabilidad.'], destination: 'Cirugia/vascular/criticos si inestable; no alta si peritonismo.' },
        { id: 'flanco-derecho', label: 'Flanco derecho', suspects: ['Colico renal', 'Pielonefritis', 'Muscular', 'Aneurisma/disecacion si brusco o vascular'], branches: ['dolor-urinario', 'dolor-vascular', 'dolor-simuladores-extraabdominales'], tests: ['Orina/sedimento.', 'Funcion renal.', 'Eco/TC si complicado, fiebre, monorreno, fracaso renal, dolor no controlado o duda.', 'TC/vascular si aneurisma o diseccion.'], destination: 'Urologia; vascular si brusco/desproporcionado.' },
        { id: 'flanco-izquierdo', label: 'Flanco izquierdo', suspects: ['Colico renal', 'Pielonefritis', 'Muscular', 'Aneurisma/disecacion si brusco o vascular'], branches: ['dolor-urinario', 'dolor-vascular', 'dolor-simuladores-extraabdominales'], tests: ['Orina/sedimento.', 'Funcion renal.', 'Eco/TC si complicado, fiebre, monorreno, fracaso renal, dolor no controlado o duda.', 'TC/vascular si aneurisma o diseccion.'], destination: 'Urologia; vascular si brusco/desproporcionado.' },
      ],
    },
    bibliography: [referenceEntry({ id: 'dolor-abdominal-triage-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, Dolor abdominal agudo. Entrada transversal de triaje.' })],
  },
  'dolor-abdomen-quirurgico': {
    id: 'dolor-abdomen-quirurgico', title: 'Abdomen quirurgico', longTitle: 'Abdomen quirurgico / Cirugia general', chapter: 'Cap. 50', section: 'Cirugia general', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Apendicitis, perforacion, obstruccion, diverticulitis complicada, peritonitis y hernia complicada.',
    guardia: { clinica: 'Dolor progresivo o subito, defensa/rebote, distension, vomitos persistentes, ausencia de gases/heces, fiebre o sepsis.', diagnostico: 'Buscar abdomen quirurgico: apendicitis, perforacion, obstruccion, diverticulitis complicada, peritonitis o hernia complicada.', tratamiento: 'Analgesia, via venosa, fluidoterapia si precisa, dieta absoluta. Antibiotico solo si infeccion intraabdominal, sepsis, perforacion o complicacion.', alertas: ['Peritonismo o inestabilidad.', 'Obstruccion, perforacion o deterioro.', 'Sepsis o lactato elevado.'], pruebas: ['Hemograma, bioquimica y PCR.', 'Gasometria/lactato si gravedad.', 'TC si obstruccion, perforacion, complicacion o duda grave.', 'Ecografia si el contexto lo favorece.'], manejo: ['No retrasar cirugia si peritonitis o inestabilidad.', 'Avisar cirugia precozmente.', 'No inventar dosis antibioticas sin ficha auditada.'], destino: 'Observacion si duda y estable; ingreso/cirugia si abdomen quirurgico probable; UCI si shock o sepsis grave.', destinoItems: ['Observacion con reevaluacion si estable y dudoso.', 'Ingreso/quirófano si abdomen quirurgico probable.', 'Criticos si shock, sepsis grave o deterioro.'], seguimiento: ['Reevaluar dolor, abdomen, constantes y tolerancia.', 'Escalar si aparece defensa, fiebre, lactato o deterioro.'] },
    bibliography: [referenceEntry({ id: 'dolor-quirurgico-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor abdominal agudo quirurgico.' })],
  },
  'dolor-hepatobiliar-pancreatico': {
    id: 'dolor-hepatobiliar-pancreatico', title: 'Hepatobiliar-pancreatico', longTitle: 'Dolor hepatobiliar-pancreatico', chapter: 'Cap. 50', section: 'Digestivo', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Colico biliar, colecistitis, colangitis, hepatitis, pancreatitis y absceso hepatico.',
    guardia: { clinica: 'Epigastrio o hipocondrio derecho, irradiacion a espalda/hombro, ictericia, fiebre, vomitos, comidas grasas, alcohol o litiasis.', diagnostico: 'Diferenciar colico biliar, colecistitis, colangitis, hepatitis, pancreatitis y absceso hepatico.', tratamiento: 'Analgesia, antiemetico, fluidoterapia si vomitos/deshidratacion/pancreatitis, dieta absoluta si pancreatitis, colecistitis, colangitis o intervencion probable.', alertas: ['Fiebre con ictericia.', 'Sepsis o hipotension.', 'Pancreatitis grave o dolor persistente.', 'Vomitos con mala tolerancia.'], pruebas: ['Perfil hepatico y bilirrubina.', 'Lipasa/amilasa si epigastrio o sospecha pancreatica.', 'Hemograma y PCR.', 'Ecografia abdominal.', 'TC si pancreatitis grave, complicacion o duda.'], manejo: ['Antibiotico si colangitis, colecistitis complicada, sepsis o infeccion probable.', 'No dar alta si fiebre, ictericia, dolor persistente o pancreatitis.', 'Valorar digestivo/cirugia segun sospecha.'], destino: 'Alta solo en colico biliar resuelto y sin alarma; observacion/ingreso si fiebre, ictericia, pancreatitis, colecistitis o colangitis.', destinoItems: ['Alta si colico resuelto, afebril y tolera.', 'Ingreso si fiebre, ictericia, pancreatitis o dolor persistente.', 'Cirugia/digestivo si complicacion.'], seguimiento: ['Volver por fiebre, ictericia, coluria, vomitos o empeoramiento.', 'Reevaluar si no mejora.'] },
    bibliography: [referenceEntry({ id: 'dolor-hepatobiliar-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, orientacion hepatobiliar-pancreatica.' })],
  },
  'dolor-urinario': {
    id: 'dolor-urinario', title: 'Dolor urinario', longTitle: 'Dolor abdominal urinario / Urologia', chapter: 'Cap. 50', section: 'Urologia', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Colico renal, pielonefritis, ITU complicada, retencion y prostatitis.',
    guardia: { clinica: 'Flanco o hipogastrio, irradiacion a ingle, hematuria, disuria, fiebre, vomitos, monorreno, fracaso renal o inmunosupresion.', diagnostico: 'Separar colico renal no complicado de pielonefritis, obstruccion infectada, ITU complicada, retencion o prostatitis.', tratamiento: 'Analgesia, antiemetico si vomitos, hidratacion si precisa. Antibiotico solo si infeccion urinaria, pielonefritis, prostatitis o sepsis. Sondaje si retencion y procede.', alertas: ['Fiebre con obstruccion posible.', 'Monorreno o insuficiencia renal.', 'Dolor no controlado.', 'Sepsis o vomitos persistentes.'], pruebas: ['Tira/sedimento de orina.', 'Funcion renal.', 'Hemograma/PCR si fiebre o infeccion.', 'Ecografia o TC si complicado, fiebre, monorreno, fracaso renal, dolor no controlado o duda.'], manejo: ['Alta si colico no complicado, afebril, dolor controlado y funcion renal aceptable.', 'Urologia urgente si obstruccion infectada.', 'No inventar dosis antibioticas sin ficha auditada.'], destino: 'Alta si no complicado; ingreso/urologia si fiebre, obstruccion infectada, monorreno, fracaso renal, dolor no controlado o sepsis.', destinoItems: ['Alta con alarma si bajo riesgo.', 'Observacion si vomitos o dolor persistente.', 'Ingreso/urologia si fiebre, sepsis, monorreno o fracaso renal.'], seguimiento: ['Volver por fiebre, anuria, vomitos, dolor incoercible o deterioro.', 'Reevaluar si recurre o precisa analgesia repetida.'] },
    bibliography: [referenceEntry({ id: 'dolor-urinario-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor de flanco e hipogastrio urinario.' })],
  },
  'dolor-ginecologico': {
    id: 'dolor-ginecologico', title: 'Dolor ginecologico', longTitle: 'Dolor abdominal ginecologico', chapter: 'Cap. 50', section: 'Ginecologia', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Ectopico, torsion ovarica, EPI, quiste complicado y complicacion gestacional.',
    guardia: { clinica: 'Mujer en edad fertil con dolor hipogastrico o fosa iliaca, amenorrea, sangrado, flujo, sincope, hipotension o dolor subito intenso.', diagnostico: 'Primero descartar embarazo ectopico y torsion; despues EPI, quiste complicado y complicacion gestacional.', tratamiento: 'Analgesia, via venosa si moderado/grave, fluidoterapia si inestabilidad. No retrasar ginecologia si ectopico o torsion probable.', alertas: ['Test de embarazo positivo con dolor o sangrado.', 'Sincope, hipotension o palidez.', 'Dolor anexial brusco intenso.', 'Fiebre o defensa.'], pruebas: ['Test de embarazo obligatorio si posibilidad de embarazo.', 'Hemograma si sangrado o mal estado.', 'Orina si duda urinaria.', 'Ecografia ginecologica si sospecha.', 'Ginecologia urgente si ectopico, torsion, sangrado significativo o inestabilidad.'], manejo: ['Antibiotico solo si EPI/infeccion probable y pauta auditada.', 'No alta con sospecha de ectopico o torsion.', 'Observacion si diagnostico incierto.'], destino: 'Ginecologia urgente si ectopico, torsion, sangrado o inestabilidad; alta solo si bajo riesgo, estable y seguimiento claro.', destinoItems: ['Observacion si duda.', 'Ginecologia/ingreso si ectopico, torsion, sangrado o inestabilidad.', 'Alta solo con embarazo descartado si procede y alarma clara.'], seguimiento: ['Volver por sangrado, sincope, fiebre, dolor creciente, vomitos o deterioro.', 'Reevaluacion si persiste dolor.'] },
    bibliography: [referenceEntry({ id: 'dolor-ginecologico-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor bajo y causas ginecologicas urgentes.' })],
  },
  'dolor-vascular': {
    id: 'dolor-vascular', title: 'Dolor vascular', longTitle: 'Dolor abdominal vascular', chapter: 'Cap. 50', section: 'Vascular', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Isquemia mesenterica, aneurisma, diseccion y embolia/trombosis visceral.',
    guardia: { clinica: 'Dolor subito intenso o desproporcionado, edad avanzada, FA, aterosclerosis, hipotension/sincope, lactato elevado o riesgo embolico.', diagnostico: 'Pensar en isquemia mesenterica, aneurisma de aorta, diseccion o trombosis/embolia visceral.', tratamiento: 'Monitorizacion, via venosa, analgesia, fluidoterapia si shock y aviso precoz a vascular/cirugia/criticos.', alertas: ['Dolor desproporcionado.', 'Hipotension o sincope.', 'FA/riesgo embolico.', 'Lactato elevado o acidosis.'], pruebas: ['Gasometria/lactato.', 'Analitica completa.', 'ECG si sospecha embolica/cardiaca.', 'TC angiografica si sospecha vascular y disponibilidad.'], manejo: ['No tranquilizarse por exploracion pobre si dolor desproporcionado.', 'No retrasar valoracion especializada.', 'Escalar si hipotension, acidosis o peritonismo.'], destino: 'Ingreso urgente; UCI si inestable; vascular/cirugia segun sospecha.', destinoItems: ['Ingreso urgente.', 'UCI/criticos si inestabilidad.', 'Vascular/cirugia si aneurisma, diseccion o isquemia.'], seguimiento: ['Control seriado de dolor, constantes, perfusion y lactato.', 'Escalar ante deterioro.'] },
    bibliography: [referenceEntry({ id: 'dolor-vascular-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor desproporcionado y sospecha vascular.' })],
  },
  'dolor-infeccioso-digestivo': {
    id: 'dolor-infeccioso-digestivo', title: 'Infeccioso-digestivo', longTitle: 'Dolor infeccioso-digestivo', chapter: 'Cap. 50', section: 'Digestivo / Infecciosas', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Gastroenteritis, colitis, diverticulitis, sepsis abdominal y absceso intraabdominal.',
    guardia: { clinica: 'Fiebre, diarrea, rectorragia, dolor localizado, inmunosupresion, mal estado general o deshidratacion.', diagnostico: 'Valorar gastroenteritis, colitis, diverticulitis no complicada/complicada, sepsis abdominal o absceso.', tratamiento: 'Hidratacion oral o IV segun tolerancia, antiemetico si vomitos y analgesia. Antibiotico solo si indicacion clara y pauta auditada.', alertas: ['Sepsis o mal estado general.', 'Inmunosupresion.', 'Dolor localizado intenso.', 'Deshidratacion o mala tolerancia.'], pruebas: ['Hemograma, bioquimica y PCR.', 'Orina si duda.', 'Coprocultivo solo si cambia conducta o contexto lo justifica.', 'TC si dolor localizado intenso, diverticulitis complicada, sepsis, inmunosupresion o mala evolucion.'], manejo: ['No usar antibiotico automatico en todo dolor abdominal con diarrea.', 'Observar si mala tolerancia o diagnostico incierto.', 'Escalar si sepsis o complicacion.'], destino: 'Alta si leve, estable y tolera; observacion/ingreso si deshidratacion, sepsis, inmunosupresion, dolor persistente o complicacion.', destinoItems: ['Alta si leve y tolera.', 'Observacion si dolor persistente o mala tolerancia.', 'Ingreso si sepsis, inmunosupresion o complicacion.'], seguimiento: ['Volver por fiebre persistente, sangre, deshidratacion, dolor progresivo o deterioro.', 'Reevaluar si no mejora.'] },
    bibliography: [referenceEntry({ id: 'dolor-infeccioso-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, cuadros infeccioso-digestivos.' })],
  },
  'dolor-simuladores-extraabdominales': {
    id: 'dolor-simuladores-extraabdominales', title: 'Simuladores extraabdominales', longTitle: 'Simuladores extraabdominales de dolor abdominal', chapter: 'Cap. 50', section: 'Transversal', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'SCA, neumonia basal, metabolico, zoster inicial y patologia testicular.',
    guardia: { clinica: 'Epigastralgia de riesgo, disnea/tos/dolor pleuritico, hiperglucemia/cetosis, dolor dermatomal o dolor testicular.', diagnostico: 'No cerrar como digestivo sin descartar SCA, neumonia basal, cetoacidosis/metabolico, zoster inicial o patologia testicular.', tratamiento: 'Derivar al protocolo especifico si existe. Tratar soporte inicial segun gravedad y no retrasar circuito tiempo-dependiente.', alertas: ['Dolor toracico, disnea o riesgo cardiovascular.', 'Hipoxemia o fiebre respiratoria.', 'Hiperglucemia, cetosis o acidosis.', 'Dolor testicular.'], pruebas: ['ECG/troponina si epigastrio o riesgo cardiovascular.', 'Radiografia de torax si clinica respiratoria.', 'Glucemia/cetonemia o gasometria si sospecha metabolica.', 'Exploracion testicular si dolor irradiado o sospecha.'], manejo: ['Si SCA posible: circuito cardiologico.', 'Si neumonia basal: valorar protocolo NAC.', 'Si metabolico o testicular: derivar al circuito correspondiente.'], destino: 'Depende del simulador; no dar alta digestiva si queda una causa extraabdominal relevante sin descartar.', destinoItems: ['Protocolo especifico si existe.', 'Observacion si duda diagnostica.', 'Ingreso/derivacion si cuadro tiempo-dependiente o inestable.'], seguimiento: ['Alarma segun diagnostico alternativo.', 'Reevaluar si pruebas iniciales no explican el dolor.'] },
    bibliography: [referenceEntry({ id: 'dolor-simuladores-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, simuladores extraabdominales.' })],
  },
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
