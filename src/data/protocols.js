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
    summary: 'Sospecha, diagnóstico, CRB/CURB-65, destino, antibiótico inicial, revisión y seguimiento.',
    quickChecks: [
      'Síntomas de infección respiratoria baja y signos focales, taquipnea, hipoxemia o gravedad',
      'Confirmación con radiografía de tórax en hospital, idealmente dentro de 4 h',
      'CRB-65 en atención inicial y CURB-65 en hospital',
      'Sepsis, insuficiencia respiratoria, hipotensión, confusión o mala tolerancia oral',
      'Antibiótico empírico según gravedad y revisión IV a las 48 h',
    ],
    quickSummary: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        action: 'NAC si infección respiratoria baja con signos compatibles; Murillo exige infiltrado nuevo si hay Rx disponible.',
      },
      {
        id: 'riesgo',
        title: 'Riesgo',
        action: 'Usa CRB-65 fuera del hospital y CURB-65 en hospital siempre con juicio clínico.',
      },
      {
        id: 'destino',
        title: 'Destino',
        action: '0 bajo riesgo; 1-2 intermedio; ≥3 alto. Hipoxemia, sepsis o mala tolerancia oral pesan más que la cifra.',
      },
      {
        id: 'antibiotico',
        title: 'Antibiótico',
        action: 'NICE prioriza pauta por gravedad, inicio precoz y revisión de IV a 48 h.',
      },
    ],
    decisionCards: [
      {
        id: 'diagnostico',
        situation: 'Sospecha o diagnóstico inicial',
        action: 'Buscar fiebre o síntomas respiratorios, signos focales, taquipnea, hipoxemia, gravedad o infiltrado nuevo en radiografía.',
        nuance: 'NICE permite diagnóstico clínico si aún no hay Rx; Murillo define NAC por clínica compatible más infiltrado radiológico no atribuible a otra causa.',
      },
      {
        id: 'pruebas',
        situation: 'Pruebas iniciales en urgencias',
        action: 'Pulsioximetría, radiografía de tórax, analítica con función renal/urea y valorar gasometría si SpO2 ≤ 92% o comorbilidad cardiorrespiratoria.',
        nuance: 'NICE añade Rx dentro de 4 h en hospital, CRP basal en adultos ingresados y microbiología solo si gravedad moderada/alta o indicación como sepsis.',
      },
      {
        id: 'destino-crb',
        situation: 'Atención inicial / ambulatoria',
        action: 'CRB-65 0: domicilio con consejos de seguridad si estable. CRB-65 1: decidir entre domicilio con seguridad, atención urgente en el día/observación, hospitalización a domicilio o derivación. CRB-65 ≥ 2: considerar hospital.',
        nuance: 'Insuficiencia cardiorrespiratoria, sepsis o imposibilidad de vía oral obligan a derivar aunque el score sea bajo.',
      },
      {
        id: 'destino-curb',
        situation: 'Hospital',
        action: 'CURB-65 0-1: alta si estable y con seguimiento. CURB-65 2: observación/atención urgente en el día, hospitalización a domicilio o ingreso. CURB-65 ≥ 3: ingreso y valorar críticos.',
        nuance: 'La gravedad real puede ser mayor que el score si hay hipoxemia, complicación pleural, comorbilidad, fragilidad o embarazo.',
      },
    ],
    carePath: [
      {
        title: 'Domicilio',
        text: 'Bajo riesgo, tolera vía oral, sin hipoxemia ni inestabilidad, con red de apoyo y consejo de reevaluación.',
      },
      {
        title: 'Observación / atención urgente en el día',
        text: 'Riesgo intermedio, necesidad de pruebas o tratamiento breve, o vigilancia sin ingreso convencional inicial.',
      },
      {
        title: 'Ingreso',
        text: 'CURB-65 alto, comorbilidad relevante, mala evolución, imposibilidad de vía oral, hipoxemia o criterios de no alta segura.',
      },
      {
        title: 'UCI / críticos',
        text: 'Insuficiencia respiratoria, sepsis/shock, necesidad de soporte ventilatorio o deterioro clínico rápido.',
      },
    ],
    antibioticPlan: [
      {
        severity: 'Baja gravedad',
        regimen: 'Amoxicilina oral 500 mg/8 h 5 días; si alergia o sospecha de atípicos: doxiciclina, claritromicina o eritromicina en embarazo.',
      },
      {
        severity: 'Gravedad moderada',
        regimen: 'Amoxicilina oral 500 mg/8 h 5 días; añadir claritromicina si se sospechan atípicos. Alternativas en alergia: doxiciclina o claritromicina.',
      },
      {
        severity: 'Alta gravedad',
        regimen: 'Co-amoxiclav oral/IV 5 días más claritromicina oral/IV; eritromicina si embarazo. En alergia a penicilina: levofloxacino y valorar microbiología local.',
      },
    ],
    reassessment: [
      'Iniciar antibiótico tras establecer diagnóstico y dentro de 4 h si presentación hospitalaria.',
      'Usar vía oral de primera línea si puede tomarla y la gravedad no exige IV.',
      'Si se administra antibiótico IV, revisar a las 48 h y cambiar a vía oral si es posible.',
      'Duración habitual en adultos: 5 días si hay estabilidad clínica y microbiología no obliga a prolongar.',
      'Reevaluar si no mejora como se espera, empeora rápida o significativamente, o se vuelve sistémicamente enfermo.',
      'No pedir radiografía de control de rutina tras ingreso; considerar a 6 semanas si riesgo de cáncer/respiratorio, síntomas persistentes/deterioro o pérdida de peso.',
    ],
    noDischargeCriteria: [
      '2 o más en las últimas 24 h: T > 37,5 °C, FR ≥ 24, FC > 100, TAS ≤ 90, SpO2 < 90% en aire ambiente o por debajo de basal, estado mental anormal, incapacidad para comer sin ayuda.',
      'Cualquier alerta mayor: sepsis, insuficiencia respiratoria, hipotensión, confusión, hipoxemia, mala tolerancia oral, comorbilidad relevante o inmunosupresión.',
    ],
    warnings: [
      'No introduzcas recomendaciones antibióticas sin fuente y revisa alergias, función renal, embarazo, interacciones y resistencias locales.',
      'Si Murillo y NICE difieren, prioriza NICE NG250 2025 para antibiótico, reevaluación y seguimiento.',
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
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
