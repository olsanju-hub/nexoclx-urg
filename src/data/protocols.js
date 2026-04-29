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
    title: 'Dolor abdominal',
    longTitle: 'Dolor abdominal agudo',
    chapter: 'Cap. 50',
    section: 'Urgencias del aparato digestivo',
    indexPage: 340,
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    summary: 'Filtro de gravedad, mapa por localización, sospechas, pruebas dirigidas, tratamiento inicial y destino.',
    severityChecks: [
      'Shock o hipotensión',
      'Peritonismo o abdomen rígido',
      'Fiebre o sospecha de sepsis',
      'Vómitos persistentes',
      'Sangrado digestivo',
      'Embarazo posible',
      'Anciano o paciente frágil',
      'Inmunosupresión',
      'Anticoagulación',
      'Dolor súbito intenso',
      'Dolor desproporcionado',
      'Cirugía abdominal previa',
      'Deterioro rápido',
    ],
    highRiskActions: [
      'Monitorización si procede.',
      'Vía venosa y analgesia precoz.',
      'Analítica urgente.',
      'Gasometría/lactato si shock, sepsis, dolor desproporcionado o isquemia posible.',
      'Imagen urgente según sospecha.',
      'Valoración especializada precoz: cirugía, ginecología, urología, vascular o críticos según contexto.',
      'No retrasar valoración quirúrgica si hay peritonitis o inestabilidad.',
    ],
    commonQuestions: [
      'Inicio súbito o progresivo',
      'Duración, intensidad, localización e irradiación',
      'Fiebre, vómitos, diarrea o estreñimiento',
      'Última deposición y expulsión de gases',
      'Sangre en heces o vómitos',
      'Síntomas urinarios',
      'Ictericia',
      'Cirugía previa',
      'Anticoagulación',
      'Embarazo posible',
      'Inmunosupresión',
      'Edad, fragilidad y comorbilidad',
    ],
    commonTests: [
      'Constantes y reevaluación seriada.',
      'Hemograma y bioquímica con función renal e iones si cambia conducta.',
      'PCR si sospecha inflamatoria o infecciosa.',
      'Orina si síntomas urinarios, flanco o dolor bajo.',
      'Test de embarazo si mujer en edad fértil o embarazo posible.',
      'Lactato/gasometría si shock, sepsis, dolor desproporcionado o isquemia posible.',
      'Imagen dirigida por sospecha; TC si diagnóstico incierto grave, obstrucción, perforación, isquemia o aneurisma.',
    ],
    generalTreatment: [
      'Analgesia precoz.',
      'Antiemético si vómitos.',
      'Vía venosa si dolor moderado/grave, vómitos, deshidratación o riesgo.',
      'Fluidoterapia si deshidratación, sepsis o hipotensión.',
      'Dieta absoluta si sospecha quirúrgica, obstrucción, pancreatitis o procedimiento probable.',
      'Monitorización si inestable.',
      'Antibiótico solo si sospecha infección intraabdominal, sepsis, colangitis, colecistitis complicada, diverticulitis complicada, perforación u otra indicación clara.',
      'Si hace falta antibiótico, elegir pauta según sospecha, gravedad, alergias, función renal y protocolos locales disponibles.',
    ],
    disposition: [
      {
        title: 'Bajo riesgo',
        text: 'Alta si buen estado general, constantes estables, sin peritonismo, dolor controlable, tolerancia oral y diagnóstico probable no grave.',
      },
      {
        title: 'Riesgo intermedio',
        text: 'Observación, reevaluación seriada, pruebas dirigidas e imagen si hay dolor persistente, fiebre, vómitos, alteración analítica, edad avanzada, comorbilidad o diagnóstico incierto.',
      },
      {
        title: 'Alto riesgo',
        text: 'Ingreso o valoración urgente si hay inestabilidad, peritonismo, sepsis, lactato elevado, dolor desproporcionado, sangrado significativo, obstrucción, perforación, isquemia, aneurisma o embarazo ectópico.',
      },
    ],
    dischargeSafety: [
      'Alta solo con estabilidad clínica, dolor controlado, tolerancia oral y exploración sin signos de alarma.',
      'Debe existir posibilidad real de reevaluación si empeora.',
      'Dar instrucciones de alarma: fiebre, empeoramiento, vómitos persistentes, síncope, sangre en heces o vómitos, ictericia, abdomen rígido, disnea, deterioro general o imposibilidad para hidratarse.',
    ],
    abdominalRegions: [
      {
        id: 'epigastrio',
        label: 'Epigastrio',
        diagnoses: ['Gastritis / dispepsia complicada', 'Úlcera péptica', 'Pancreatitis aguda', 'Colecistitis o cólico biliar alto', 'Síndrome coronario agudo como simulador', 'Perforación si dolor súbito o peritonismo'],
        questions: ['Irradiación a espalda', 'Alcohol', 'Relación con comidas', 'AINEs', 'Vómitos', 'Dolor torácico o disnea', 'Factores de riesgo cardiovascular'],
        tests: ['Hemograma, bioquímica, función renal e iones', 'Lipasa/amilasa si sospecha pancreatitis', 'Perfil hepático y bilirrubina si sospecha biliar', 'ECG y troponina si edad/riesgo cardiovascular o clínica compatible', 'Imagen según sospecha'],
        alerts: ['Dolor súbito con peritonismo', 'Dolor torácico o equivalentes isquémicos', 'Shock o mal estado general'],
      },
      {
        id: 'hipocondrio-derecho',
        label: 'Hipocondrio derecho',
        diagnoses: ['Cólico biliar', 'Colecistitis', 'Colangitis', 'Hepatitis', 'Absceso hepático', 'Neumonía basal derecha', 'Pielonefritis derecha si flanco asociado'],
        questions: ['Comidas grasas', 'Fiebre', 'Ictericia', 'Coluria/acolia', 'Vómitos', 'Dolor pleurítico o tos', 'Síntomas urinarios'],
        tests: ['Hemograma y PCR si procede', 'Perfil hepático y bilirrubina', 'Ecografía abdominal', 'Orina si síntomas urinarios', 'Radiografía de tórax si sospecha basal pulmonar'],
        alerts: ['Fiebre con ictericia', 'Sepsis', 'Dolor persistente con defensa'],
      },
      {
        id: 'hipocondrio-izquierdo',
        label: 'Hipocondrio izquierdo',
        diagnoses: ['Pancreatitis', 'Patología esplénica', 'Gastritis/úlcera', 'Neumonía basal izquierda', 'Cólico renal izquierdo si irradia a flanco'],
        questions: ['Traumatismo', 'Irradiación a espalda', 'Fiebre', 'Vómitos', 'Tos/disnea', 'Síntomas urinarios'],
        tests: ['Analítica básica', 'Lipasa/amilasa si sospecha pancreática', 'Orina si sospecha urinaria', 'Imagen según contexto'],
        alerts: ['Traumatismo o sospecha esplénica', 'Hipotensión', 'Dolor torácico o respiratorio asociado'],
      },
      {
        id: 'fosa-iliaca-derecha',
        label: 'Fosa iliaca derecha',
        diagnoses: ['Apendicitis', 'Adenitis mesentérica', 'Ileítis / enfermedad inflamatoria intestinal', 'Cólico renal distal', 'Embarazo ectópico, torsión, EPI o quiste complicado'],
        questions: ['Migración desde periumbilical', 'Anorexia', 'Fiebre', 'Náuseas/vómitos', 'Rebote o defensa', 'Diarrea', 'Síntomas urinarios', 'Embarazo posible', 'Sangrado/flujo vaginal'],
        tests: ['Hemograma y PCR', 'Orina', 'Test de embarazo si procede', 'Ecografía o TC según edad, sexo, exploración y disponibilidad', 'Valoración ginecológica si sospecha urgente'],
        alerts: ['Peritonismo', 'Embarazo positivo', 'Torsión o ectópico posible'],
      },
      {
        id: 'fosa-iliaca-izquierda',
        label: 'Fosa iliaca izquierda',
        diagnoses: ['Diverticulitis', 'Colitis', 'Estreñimiento complicado', 'Cólico renal distal', 'Patología ginecológica izquierda'],
        questions: ['Edad', 'Diverticulosis conocida', 'Fiebre', 'Diarrea o estreñimiento', 'Rectorragia', 'Síntomas urinarios', 'Embarazo posible', 'Dolor ginecológico'],
        tests: ['Hemograma y PCR', 'Orina', 'Test de embarazo si procede', 'TC o ecografía según sospecha y contexto'],
        alerts: ['Peritonismo', 'Sangrado relevante', 'Sepsis o mal estado general'],
      },
      {
        id: 'mesogastrio',
        label: 'Mesogastrio / periumbilical',
        diagnoses: ['Gastroenteritis', 'Obstrucción intestinal', 'Apendicitis inicial', 'Isquemia mesentérica', 'Aneurisma de aorta abdominal si riesgo vascular', 'Pancreatitis'],
        questions: ['Dolor migratorio', 'Diarrea/vómitos', 'Distensión', 'Ausencia de gases o heces', 'Cirugía previa', 'Dolor desproporcionado', 'Edad avanzada', 'FA o riesgo vascular'],
        tests: ['Analítica básica', 'Lactato/gasometría si gravedad o sospecha isquemia', 'TC si obstrucción, isquemia, aneurisma o diagnóstico incierto relevante', 'ECG si riesgo cardiovascular'],
        alerts: ['Dolor desproporcionado', 'Distensión con vómitos fecaloideos', 'Paciente vascular o edad avanzada'],
      },
      {
        id: 'hipogastrio',
        label: 'Hipogastrio / suprapúbico',
        diagnoses: ['Cistitis / retención urinaria', 'Pielonefritis baja o urinaria complicada', 'Patología ginecológica', 'Diverticulitis baja', 'Prostatitis en varón'],
        questions: ['Disuria', 'Polaquiuria', 'Hematuria', 'Retención urinaria', 'Fiebre', 'Dolor lumbar', 'Flujo o sangrado vaginal', 'Embarazo posible', 'Dolor testicular/prostático'],
        tests: ['Orina y sedimento', 'Función renal si sospecha complicada', 'Test de embarazo si procede', 'Ecografía ginecológica si sospecha ginecológica', 'Valoración urología/ginecología según hallazgos'],
        alerts: ['Retención con dolor importante', 'Embarazo positivo', 'Fiebre con mal estado general'],
      },
      {
        id: 'difuso',
        label: 'Dolor difuso',
        diagnoses: ['Peritonitis', 'Obstrucción', 'Isquemia mesentérica', 'Gastroenteritis', 'Sepsis abdominal', 'Perforación', 'Pancreatitis grave'],
        questions: ['Inicio súbito', 'Distensión', 'Vómitos fecaloideos', 'Ausencia de gases/heces', 'Fiebre', 'Dolor desproporcionado', 'Deterioro general', 'Cirugía previa', 'Anticoagulación', 'Edad avanzada'],
        tests: ['Analítica completa', 'Gasometría/lactato si gravedad', 'Imagen urgente, preferentemente TC si sospecha obstrucción, perforación, isquemia o diagnóstico incierto grave', 'Valoración quirúrgica precoz si peritonismo o inestabilidad'],
        alerts: ['Peritonismo', 'Inestabilidad', 'Dolor desproporcionado', 'Obstrucción o perforación posible'],
      },
      {
        id: 'flanco-derecho',
        label: 'Flanco derecho',
        diagnoses: ['Cólico renal', 'Pielonefritis', 'Patología muscular', 'Aneurisma/disecación como alarma si dolor brusco o paciente vascular'],
        questions: ['Irradiación a ingle', 'Hematuria', 'Disuria', 'Fiebre', 'Vómitos', 'Litiasis previa', 'Dolor brusco intenso', 'Riesgo vascular'],
        tests: ['Orina/sedimento', 'Función renal', 'Ecografía o TC si cólico complicado, fiebre, monorreno, insuficiencia renal, dolor no controlado o duda diagnóstica', 'TC/valoración vascular si sospecha aneurisma o disección'],
        alerts: ['Fiebre con obstrucción urinaria posible', 'Dolor brusco vascular', 'Dolor no controlado'],
      },
      {
        id: 'flanco-izquierdo',
        label: 'Flanco izquierdo',
        diagnoses: ['Cólico renal', 'Pielonefritis', 'Patología muscular', 'Aneurisma/disecación como alarma si dolor brusco o paciente vascular'],
        questions: ['Irradiación a ingle', 'Hematuria', 'Disuria', 'Fiebre', 'Vómitos', 'Litiasis previa', 'Dolor brusco intenso', 'Riesgo vascular'],
        tests: ['Orina/sedimento', 'Función renal', 'Ecografía o TC si cólico complicado, fiebre, monorreno, insuficiencia renal, dolor no controlado o duda diagnóstica', 'TC/valoración vascular si sospecha aneurisma o disección'],
        alerts: ['Fiebre con obstrucción urinaria posible', 'Dolor brusco vascular', 'Dolor no controlado'],
      },
    ],
    relatedSpecialties: ['Cirugía general', 'Urología', 'Ginecología', 'Vascular', 'Infecciosas'],
    bibliography: [
      referenceEntry({
        id: 'dolor-abdominal-cap50',
        indexPage: 340,
        verifiedPage: 340,
        pdfPage: 365,
        note: 'Capítulo base para valoración inicial del dolor abdominal agudo.',
      }),
      createBibliographyEntry({
        id: 'dolor-abdominal-alvarado',
        referenceId: 'murillo7',
        verifiedPages: [349],
        pdfPages: [374],
        note: 'Escala de Alvarado modificada auditada como futura mejora; no implementada en esta fase.',
      }),
    ],
  },
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
