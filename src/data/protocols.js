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

const escHfEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-hf-2021',
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

const senEpilepsyEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'sen-epilepsia-2023',
    verifiedPages,
    pdfPages,
    note,
  });

const niceEpilepsyEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-ng217-epilepsia',
    verifiedPages,
    pdfPages,
    note,
  });

const aesStatusEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'aes-estatus-2016',
    verifiedPages,
    pdfPages,
    note,
  });

const niceAnaphylaxisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'nice-cg134-anafilaxia',
    verifiedPages,
    pdfPages,
    note,
  });

const rcukAnaphylaxisEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'rcuk-anafilaxia-2021',
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

const gemaAsthmaEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'gema-asma',
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

const gesepocEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'gesepoc-2021',
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
    summary: 'FA clínica confirmada por ECG: decide estabilidad, duración, frecuencia/ritmo y anticoagulación.',
    quickChecks: [
      'ECG 12 derivaciones y tira de ritmo mínimo 30 s.',
      'Constantes y estabilidad: shock, isquemia, edema pulmonar, mala perfusión, síncope o preexcitación.',
      'Analítica: hemograma, glucosa, urea/creatinina, Na/K/Cl; coagulación si shock, coagulopatía o anticoagulación.',
      'Troponina si dolor torácico; BNP/NT-proBNP si insuficiencia cardíaca; gasometría/lactato si SpO2 < 90% o shock.',
      'Inicio del episodio, FEVI/cardiopatía estructural, CHA2DS2-VA, HAS-BLED y Cockcroft-Gault si vas a anticoagular.',
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
        title: 'Cardioversión farmacológica',
        medicationIds: ['flecainida-fa', 'propafenona-fa', 'amiodarona'],
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
      'Confirmar PAS/PAD con técnica correcta, reposo y repetición si procede.',
      'Buscar daño agudo: focalidad, dolor torácico/dorsal, edema pulmonar, confusión, oliguria, embarazo o deterioro renal.',
      'ECG, analítica renal/electrolitos y orina; añadir troponina, Rx tórax, gasometría o neuroimagen según clínica.',
      'Urgencia hipertensiva: sin daño agudo; descenso gradual oral y seguimiento estrecho.',
      'Emergencia hipertensiva: daño agudo; ingreso, monitorización y tratamiento IV titulado.',
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
      'ECG de 12 derivaciones en los primeros 10 min; repetir si dolor persiste o ECG no diagnóstico.',
      'Monitorización, constantes y desfibrilador disponible si dolor activo, inestabilidad o arritmias.',
      'hs-cTn seriada 0 h/1 h o 0 h/2 h si no hay SCACEST; no esperarla si SCACEST claro.',
      'Analítica: hemograma, bioquímica/creatinina, iones y coagulación antes de anticoagulación/reperfusión.',
      'Ecocardiografía si shock, insuficiencia cardíaca, duda diagnóstica o sospecha de complicación.',
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
      {
        title: 'Fibrinólisis SCACEST',
        medicationIds: ['tenecteplasa-sca', 'alteplasa-sca', 'reteplasa-sca'],
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
  'insuficiencia-cardiaca': {
    id: 'insuficiencia-cardiaca',
    title: 'Insuficiencia cardiaca aguda / edema agudo de pulmón',
    longTitle: 'Insuficiencia cardiaca aguda / edema agudo de pulmón',
    chapter: 'Cap. 19 + ESC IC 2021',
    section: 'Urgencias cardiovasculares',
    specialtyId: 'cardiologia',
    indexPage: 161,
    verifiedPage: 161,
    pdfPage: 186,
    status: 'implementado',
    summary:
      'Disnea y congestión aguda: separar EAP hipertensivo, congestión sin shock y bajo gasto/shock cardiogénico.',
    quickChecks: [
      'Constantes, SatO2, trabajo respiratorio, perfusión y presión arterial desde el triaje.',
      'ECG 12 derivaciones, monitorización y buscar SCA, arritmia, HTA, infección, TEP, anemia, insuficiencia renal o incumplimiento.',
      'Rx tórax y ecografía pulmonar/cardiaca si disponibles y cambian conducta.',
      'Analítica con hemograma, creatinina/urea, iones, glucemia; troponina, BNP/NT-proBNP, gasometría o lactato según contexto.',
    ],
    calculatorIds: ['simple-fluid-balance', 'infusion-rate', 'cockcroft-gault'],
    medicationGroups: [
      {
        title: 'Tratamiento farmacológico',
        medicationIds: ['furosemida-ica', 'nitroglicerina-ica'],
      },
    ],
    warnings: [
      'Hipotensión, mala perfusión, lactato elevado o alteración mental orientan a bajo gasto/shock cardiogénico.',
      'EAP con hipoxemia o trabajo respiratorio requiere oxígeno, VMNI/CPAP precoz y destino monitorizado.',
      'Dolor torácico, cambios ECG o troponina dinámica obligan a rama SCA.',
      'No usar nitratos si hipotensión, shock, hipovolemia o PDE5 reciente.',
    ],
    bibliography: [
      referenceEntry({
        id: 'ica-murillo-cap19',
        indexPage: 161,
        verifiedPage: 161,
        pdfPage: 186,
        note: 'Capítulo base de insuficiencia cardiaca en urgencias.',
      }),
      escHfEntry({
        id: 'ica-esc-hf-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para diagnóstico, fenotipos y manejo inicial de la insuficiencia cardiaca aguda.',
      }),
      createBibliographyEntry({
        id: 'ica-esc-hf-2023-update',
        referenceId: 'esc-hf-2023-update',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Actualización focalizada ESC que mantiene el marco de la guía 2021.',
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
      'ECG 12 derivaciones, tira de ritmo, presión arterial, SatO2 y monitorización si síntomas o bloqueo alto',
      'Analítica dirigida: glucosa, K/Mg/Ca, función renal; gasometría/lactato si mala perfusión',
      'Troponina si dolor torácico, cambios isquémicos o sospecha de SCA',
      'Mobitz II, BAV completo con QRS ancho, pausas > 3 s o FC ventricular < 40/min',
      'Fármacos bradicardizantes, hiperpotasemia, hipoxia, hipotermia o intoxicación',
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
        medicationIds: ['atropina', 'adrenalina-bradicardia', 'isoprenalina-bradicardia'],
      },
    ],
    bibliography: [
      escBradyEntry({
        id: 'brady-acute-esc-2021',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal para bradicardias, trastornos de conducción y necesidad de estimulación.',
      }),
      referenceEntry({
        id: 'brady-murillo-cap21',
        indexPage: 176,
        verifiedPage: 176,
        pdfPage: 201,
        note: 'Tratamiento general de las bradiarritmias: atropina, pacing transcutáneo, isoprenalina/adrenalina como puente y criterios de riesgo.',
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
      'Pulso, estabilidad, monitor/desfibrilador, PA, SatO2 y accesos IV/IO',
      'ECG 12 derivaciones si no retrasa cardioversión/desfibrilación',
      'Analítica: K/Mg/Ca, función renal, glucosa; gasometría/lactato si shock o mala perfusión',
      'Troponina y ECG seriado si dolor, isquemia, SCA o TV en contexto de IAM',
      'QT largo, hipopotasemia, hipomagnesemia, DAI, tóxicos o fármacos desencadenantes',
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
        title: 'TV/FV sin pulso',
        medicationIds: ['adrenalina-parada', 'amiodarona-parada', 'lidocaina-parada'],
      },
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
      referenceEntry({
        id: 'ventricular-murillo-als',
        indexPage: 23,
        verifiedPage: 23,
        pdfPage: 48,
        note: 'Ritmo desfibrilable, ciclos de RCP, desfibrilación, adrenalina, amiodarona/lidocaína y magnesio en torsades.',
      }),
      referenceEntry({
        id: 'ventricular-murillo-cap23',
        indexPage: 199,
        verifiedPage: 199,
        pdfPage: 224,
        note: 'Taquicardia ventricular monomorfa/polimórfica, torsades, lidocaína y sulfato de magnesio.',
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
      'No retrases el TAC ni la activación del código ictus por estudios secundarios.',
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
  'crisis-convulsiva-epilepsia': {
    id: 'crisis-convulsiva-epilepsia',
    title: 'Crisis convulsiva / epilepsia en urgencias',
    longTitle: 'Crisis convulsiva / epilepsia en urgencias',
    chapter: 'Cap. 63 + SEN/NICE/AES',
    section: 'Urgencias neurológicas',
    indexPage: 435,
    verifiedPage: 435,
    pdfPage: 460,
    status: 'implementado',
    summary:
      'Crisis autolimitada, primera crisis, crisis provocada y estatus epiléptico con tratamiento escalonado.',
    quickChecks: [
      'Glucemia capilar inmediata, constantes, SatO2 y protección ABC.',
      'Diferenciar crisis finalizada con recuperación completa, crisis en curso, crisis recurrente y estatus.',
      'Buscar causa provocada: hipoglucemia, fiebre/infección, tóxicos, abstinencia, iones, ictus, TCE o infección SNC.',
      'TC craneal si primera crisis, focalidad, traumatismo, anticoagulación, inmunosupresión, fiebre/meningismo o déficit persistente.',
      'Benzodiacepina si crisis >5 min o repetida sin recuperación; segunda línea IV si persiste.',
    ],
    warnings: [
      'No introducir objetos en la boca ni forzar la apertura mandibular durante la crisis.',
      'No retrasar benzodiacepina si la crisis dura >5 min o se repite sin recuperación.',
      'Estatus, depresión respiratoria o necesidad de anestesia/intubación exige UCI.',
    ],
    medicationGroups: [
      {
        title: 'Benzodiacepina de primera línea',
        medicationIds: ['midazolam-convulsiones', 'diazepam-convulsiones', 'lorazepam-estatus'],
      },
      {
        title: 'Segunda línea en estatus',
        medicationIds: ['levetiracetam-estatus', 'valproato-estatus', 'fenitoina-estatus'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'convulsiones-murillo-cap63',
        indexPage: 435,
        verifiedPage: 435,
        pdfPage: 460,
        note: 'Capítulo 63: sospecha, pruebas iniciales, criterios de TC/ingreso y tratamiento de crisis/estatus.',
      }),
      senEpilepsyEntry({
        id: 'convulsiones-sen-2023',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia española de apoyo para urgencias en crisis epilépticas y epilepsia.',
      }),
      niceEpilepsyEntry({
        id: 'convulsiones-nice-ng217',
        verifiedPages: [7],
        pdfPages: [7],
        note: 'Tratamiento de crisis prolongadas, repetidas y estatus convulsivo.',
      }),
      aesStatusEntry({
        id: 'convulsiones-aes-2016',
        verifiedPages: [48, 49, 50, 51],
        pdfPages: [48, 49, 50, 51],
        note: 'Algoritmo farmacológico del estatus epiléptico convulsivo.',
      }),
    ],
  },
  anafilaxia: {
    id: 'anafilaxia',
    title: 'Anafilaxia',
    longTitle: 'Anafilaxia / shock anafiláctico',
    chapter: 'Cap. 190 + NICE/RCUK',
    section: 'Urgencias',
    indexPage: 1059,
    verifiedPage: 1059,
    pdfPage: 1084,
    status: 'implementado',
    summary: 'Diagnóstico clínico, adrenalina IM inmediata, soporte y observación tras resolución.',
    quickChecks: [
      'Inicio agudo tras exposición probable con afectación cutánea, respiratoria, cardiovascular o digestiva persistente.',
      'La anafilaxia puede existir sin urticaria; no esperar analítica para tratar.',
      'Adrenalina IM en muslo si compromiso respiratorio, cardiovascular o anafilaxia probable.',
      'Monitorizar si gravedad, adrenalina repetida, hipotensión, broncoespasmo, estridor o comorbilidad.',
      'Alta solo tras estabilidad completa, educación, plan escrito y derivación a alergología.',
    ],
    warnings: [
      'No retrasar adrenalina por pruebas complementarias.',
      'Antihistamínicos y corticoides no sustituyen adrenalina IM.',
      'Adrenalina IV/perfusión solo en entorno monitorizado y con personal experto.',
    ],
    calculatorIds: ['anaphylaxis-adrenaline'],
    medicationGroups: [
      {
        title: 'Primera línea',
        medicationIds: ['adrenalina-anafilaxia'],
      },
      {
        title: 'Adyuvantes',
        medicationIds: ['salbutamol-anafilaxia', 'dexclorfeniramina-anafilaxia', 'metilprednisolona-anafilaxia'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'anafilaxia-murillo-cap190',
        indexPage: 1059,
        verifiedPage: 1059,
        pdfPage: 1084,
        note: 'Capítulo 190: diagnóstico clínico, gravedad, pruebas que no retrasan tratamiento, adrenalina y observación.',
      }),
      niceAnaphylaxisEntry({
        id: 'anafilaxia-nice-cg134',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Observación, información al alta, autoinyectores y derivación a alergología.',
      }),
      rcukAnaphylaxisEntry({
        id: 'anafilaxia-rcuk-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Adrenalina IM como primera línea y repetición según respuesta.',
      }),
    ],
  },
  'asma-exacerbacion': {
    id: 'asma-exacerbacion',
    title: 'Crisis asmática',
    longTitle: 'Crisis asmática / exacerbación asmática',
    chapter: 'Cap. 40 + GINA/GEMA',
    section: 'Urgencias del aparato respiratorio',
    indexPage: 290,
    verifiedPage: 290,
    pdfPage: 315,
    status: 'implementado',
    summary: 'Exacerbación asmática con gravedad, pruebas útiles, broncodilatadores, corticoide precoz y destino.',
    quickChecks: [
      'Disnea, tos, opresión torácica, sibilancias o aumento de medicación de rescate.',
      'Valorar habla, tiraje, frecuencia respiratoria, SatO2, auscultación y agotamiento.',
      'Silencio auscultatorio, confusión, cianosis, hipotensión o bradicardia son datos de riesgo vital.',
      'PEF si está disponible y no retrasa tratamiento; gasometría si grave, mala respuesta o sospecha hipercapnia.',
      'Alta solo tras respuesta completa, estabilidad y plan terapéutico claro.',
    ],
    warnings: [
      'No retrasar broncodilatadores ni corticoide por pruebas complementarias.',
      'La adrenalina IM no es tratamiento rutinario de crisis asmática; reservar para anafilaxia asociada u otra indicación clara.',
      'Hipercapnia, agotamiento o alteración mental indican riesgo de fracaso respiratorio.',
    ],
    medicationGroups: [
      {
        title: 'Broncodilatadores',
        medicationIds: ['salbutamol-asma', 'ipratropio-asma'],
      },
      {
        title: 'Corticoide y rescate',
        medicationIds: ['prednisona-asma', 'hidrocortisona-asma', 'magnesio-asma'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'asma-murillo-cap40',
        indexPage: 290,
        verifiedPage: 290,
        pdfPage: 315,
        note: 'Capítulo 40: gravedad, PEF, broncodilatadores, corticoides, magnesio y destino.',
      }),
      ginaAsthmaEntry({
        id: 'asma-gina-2025',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Estrategia actual para exacerbaciones, gravedad, oxígeno y tratamiento inicial.',
      }),
      gemaAsthmaEntry({
        id: 'asma-gema',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Guía española de referencia para clasificación y manejo de exacerbaciones asmáticas.',
      }),
    ],
  },
  'epoc-agudizacion': {
    id: 'epoc-agudizacion',
    title: 'Agudización de EPOC',
    longTitle: 'Agudización de EPOC',
    chapter: 'Cap. 41 + GOLD/GesEPOC',
    section: 'Urgencias del aparato respiratorio',
    indexPage: 294,
    verifiedPage: 294,
    pdfPage: 319,
    status: 'implementado',
    summary: 'AEPOC con gravedad, gasometría, oxígeno controlado, broncodilatadores, corticoide, antibiótico si criterios y VNI.',
    quickChecks: [
      'EPOC conocida o sospechada con aumento de disnea, volumen o purulencia del esputo.',
      'Buscar confusión, somnolencia, cianosis, uso de musculatura accesoria, agotamiento, hipotensión o sepsis.',
      'Gasometría si SatO2 baja, disnea grave, somnolencia, hipercapnia/acidosis probable o VNI.',
      'Oxígeno controlado con objetivo 88-92% si riesgo de hipercapnia.',
      'Antibiótico solo si purulencia, aumento de síntomas, neumonía, ventilación o gravedad.',
    ],
    warnings: [
      'Evitar hiperoxia en EPOC con riesgo de hipercapnia.',
      'No usar antibiótico sin criterios clínicos o gravedad que lo justifique.',
      'Acidosis respiratoria, hipercapnia, agotamiento o alteración mental obligan a valorar VNI/UCI.',
    ],
    calculatorIds: ['cockcroft-gault'],
    medicationGroups: [
      {
        title: 'Broncodilatadores',
        medicationIds: ['salbutamol-epoc', 'ipratropio-epoc'],
      },
      {
        title: 'Corticoide sistémico',
        medicationIds: ['prednisona-epoc', 'metilprednisolona-epoc'],
      },
      {
        title: 'Antibiótico si criterios',
        medicationIds: ['amoxicilina-clavulanico-epoc', 'azitromicina-epoc', 'levofloxacino-epoc', 'ceftriaxona-epoc'],
      },
    ],
    bibliography: [
      referenceEntry({
        id: 'epoc-murillo-cap41',
        indexPage: 294,
        verifiedPage: 294,
        pdfPage: 319,
        note: 'Capítulo 41: definición, gravedad, gasometría, VNI, broncodilatadores, corticoides y antibióticos.',
      }),
      goldCopdEntry({
        id: 'epoc-gold-2025',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia internacional actual para exacerbaciones de EPOC, oxígeno, corticoide, antibiótico y ventilación.',
      }),
      gesepocEntry({
        id: 'epoc-gesepoc-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Guía española para diagnóstico y tratamiento del síndrome de agudización de EPOC.',
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
      'CRB-65 si valoración inicial rápida; CURB-65 si está en hospital',
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
        action: 'Si necesitas una valoración inicial rápida, usa CRB-65. Si está en hospital, usa CURB-65.',
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
        text: 'Si está estable, tolera vía oral, SatO2 aceptable y tiene apoyo, alta con tratamiento e instrucciones claras.',
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
        regimen: 'Si tolera VO: amoxicilina 500 mg VO cada 8 h durante 5 días. Si alergia a penicilina o sospecha de atípicos: doxiciclina 200 mg VO el día 1 y luego 100 mg/24 h 4 días, o claritromicina 500 mg VO cada 12 h 5 días. Embarazo: eritromicina 500 mg VO cada 6 h 5 días.',
      },
      {
        severity: '5. Riesgo moderado',
        regimen: 'Si tolera VO: amoxicilina 500 mg VO cada 8 h 5 días. Si sospecha de atípicos: añadir claritromicina 500 mg VO cada 12 h 5 días; en embarazo usar eritromicina 500 mg VO cada 6 h 5 días. Si alergia a penicilina: doxiciclina 200 mg VO día 1 y luego 100 mg/24 h 4 días, o claritromicina 500 mg VO cada 12 h 5 días.',
      },
      {
        severity: '5. Alto riesgo',
        regimen: 'Si precisa IV o vigilancia estrecha: co-amoxiclav 500/125 mg VO cada 8 h o 1,2 g IV cada 8 h durante 5 días, más claritromicina 500 mg VO/IV cada 12 h 5 días. Embarazo: eritromicina 500 mg VO cada 6 h 5 días. Alergia a penicilina: levofloxacino 500 mg VO/IV cada 12 h 5 días y revisar restricciones de fluoroquinolonas, QT, interacciones y función renal.',
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
  sepsis: {
    id: 'sepsis',
    title: 'Sepsis / shock séptico',
    longTitle: 'Sepsis / shock séptico',
    chapter: 'Cap. 107 + SSC 2021',
    section: 'Infecciosas / Urgencias',
    verifiedPage: 640,
    pdfPage: 665,
    status: 'implementado',
    summary: 'Infección grave, lactato, antibiótico precoz, fluidoterapia, control de foco y destino monitorizado.',
    calculatorIds: ['sepsis-30mlkg', 'fluid-remaining', 'simple-fluid-balance'],
    bibliography: [
      referenceEntry({
        id: 'sepsis-murillo-cap107',
        indexPage: 640,
        verifiedPage: 640,
        pdfPage: 665,
        note: 'Capítulo base para sospecha, gravedad y manejo inicial de sepsis en urgencias.',
      }),
      createBibliographyEntry({
        id: 'sepsis-ssc-2021',
        referenceId: 'ssc-sepsis-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para lactato, antibiótico precoz, fluidos, vasopresores, control de foco y reevaluación.',
      }),
      createBibliographyEntry({
        id: 'sepsis-nice-ng253',
        referenceId: 'nice-ng253-sepsis',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia de apoyo para reconocimiento precoz, estratificación y tratamiento inicial.',
      }),
      createBibliographyEntry({
        id: 'sepsis-fluidoterapia-nice',
        referenceId: 'nice-cg174-fluidoterapia',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Apoyo para fluidoterapia IV, reevaluación y balance.',
      }),
    ],
  },
  'dolor-abdomen-quirurgico': {
    id: 'dolor-abdomen-quirurgico', title: 'Abdomen quirurgico', longTitle: 'Abdomen quirurgico / Cirugia general', chapter: 'Cap. 50', section: 'Cirugia general', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Apendicitis, perforacion, obstruccion, diverticulitis complicada, peritonitis y hernia complicada.',
    guardia: { clinica: 'Dolor progresivo o subito, defensa/rebote, distension, vomitos persistentes, ausencia de gases/heces, fiebre o sepsis.', diagnostico: 'Buscar abdomen quirurgico: apendicitis, perforacion, obstruccion, diverticulitis complicada, peritonitis o hernia complicada.', tratamiento: 'Actuar por escalones: estabilizar, controlar dolor segun protocolo local auditado, mantener dieta absoluta y activar cirugia si hay peritonitis, obstruccion, perforacion o deterioro.', datosTratamiento: ['Alergias medicamentosas.', 'Funcion renal y riesgo de sangrado/anticoagulacion antes de AINE.', 'Embarazo posible si procede.', 'TA, FC, SatO2, temperatura y nivel de conciencia.', 'Tolerancia oral y vomitos.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'warning', items: ['Via venosa si dolor moderado-grave, vomitos, sepsis o cirugia probable.', 'Dieta absoluta si sospecha quirurgica, obstruccion, perforacion o procedimiento probable.', 'Reevaluar abdomen, constantes y dolor tras cada intervencion.'] }, { title: '2. Farmaco / intervencion', items: ['Dolor: usar pauta analgesica local auditada segun funcion renal, sangrado, embarazo, alergias y fragilidad.', 'Nauseas/vomitos: antiemetico de protocolo local si impiden hidratacion, analgesia o valoracion.', 'Antibioterapia segun foco, gravedad, alergias, funcion renal y protocolo local si sepsis, perforacion, peritonitis o infeccion intraabdominal complicada.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Avisar cirugia precozmente si peritonismo, obstruccion, perforacion, hernia complicada o deterioro.', 'No retrasar quirofano por pruebas secundarias si hay inestabilidad o peritonitis franca.', 'Criticos si shock, sepsis grave o necesidad de soporte.'] }], alertas: ['Peritonismo o inestabilidad.', 'Obstruccion, perforacion o deterioro.', 'Sepsis o lactato elevado.'], pruebas: ['Hemograma, bioquimica y PCR.', 'Gasometria/lactato si gravedad.', 'TC si obstruccion, perforacion, complicacion o duda grave.', 'Ecografia si el contexto lo favorece.'], manejo: ['No retrasar cirugia si peritonitis o inestabilidad.', 'Avisar cirugia precozmente.', 'Elegir antibiotico con protocolo local, alergias y funcion renal si hay indicacion clara.'], destino: 'Observacion si duda y estable; ingreso/cirugia si abdomen quirurgico probable; UCI si shock o sepsis grave.', destinoItems: ['Observacion con reevaluacion si estable y dudoso.', 'Ingreso/quirófano si abdomen quirurgico probable.', 'Criticos si shock, sepsis grave o deterioro.'], seguimiento: ['Reevaluar dolor, abdomen, constantes y tolerancia.', 'Escalar si aparece defensa, fiebre, lactato o deterioro.'], simuladores: ['Epigastralgia con riesgo cardiovascular: descartar SCA.', 'Clinica respiratoria basal: descartar neumonia.'] },
    bibliography: [referenceEntry({ id: 'dolor-quirurgico-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor abdominal agudo quirurgico.' }), createBibliographyEntry({ id: 'dolor-quirurgico-wses-appendicitis', referenceId: 'wses-appendicitis-2020', note: 'Corrobora el enfoque de apendicitis, estratificacion diagnostica, imagen, antibiotico perioperatorio y cirugia/observacion.' }), createBibliographyEntry({ id: 'dolor-quirurgico-wses-diverticulitis', referenceId: 'wses-diverticulitis-2020', note: 'Corrobora criterios de diverticulitis complicada, imagen, antibiotico selectivo y destino.' })],
  },
  'dolor-hepatobiliar-pancreatico': {
    id: 'dolor-hepatobiliar-pancreatico', title: 'Hepatobiliar-pancreatico', longTitle: 'Dolor hepatobiliar-pancreatico', chapter: 'Cap. 50', section: 'Digestivo', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Colico biliar, colecistitis, colangitis, hepatitis, pancreatitis y absceso hepatico.',
    guardia: { clinica: 'Epigastrio o hipocondrio derecho, irradiacion a espalda/hombro, ictericia, fiebre, vomitos, comidas grasas, alcohol o litiasis.', diagnostico: 'Diferenciar colico biliar, colecistitis, colangitis, hepatitis, pancreatitis y absceso hepatico.', tratamiento: 'Actuar por escenario: control del dolor, antiemetico si mala tolerancia, reposicion de volumen si deshidratacion/pancreatitis y dieta absoluta si pancreatitis, colecistitis, colangitis o intervencion probable.', datosTratamiento: ['Alergias.', 'Funcion renal antes de analgesia o contraste.', 'Embarazo posible.', 'QT/interacciones si se plantea antiemetico.', 'Gravedad: fiebre, ictericia, hipotension, sepsis o pancreatitis grave.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'warning', items: ['Canalizar via venosa si vomitos, dolor intenso, sepsis, pancreatitis o ingreso probable.', 'Reposicion de volumen segun estado hemodinamico, diuresis, deshidratacion y comorbilidad.', 'Dieta absoluta si pancreatitis, colecistitis, colangitis o procedimiento probable.'] }, { title: '2. Farmaco / intervencion', items: ['Dolor: pauta analgesica local auditada evitando AINE si insuficiencia renal, sangrado, alergia, embarazo avanzado o alto riesgo digestivo.', 'Vomitos: antiemetico de protocolo local tras revisar QT, interacciones y embarazo.', 'Antibioterapia segun foco, gravedad, alergias, funcion renal y protocolo local si colangitis, colecistitis complicada, sepsis o absceso.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Digestivo/cirugia si fiebre con ictericia, sepsis, dolor persistente, pancreatitis grave o colecistitis/colangitis.', 'Imagen urgente si mala evolucion, complicacion o duda relevante.', 'Ingreso si no tolera via oral, precisa IV o mantiene criterios de alarma.'] }], alertas: ['Fiebre con ictericia.', 'Sepsis o hipotension.', 'Pancreatitis grave o dolor persistente.', 'Vomitos con mala tolerancia.'], pruebas: ['Perfil hepatico y bilirrubina.', 'Lipasa/amilasa si epigastrio o sospecha pancreatica.', 'Hemograma y PCR.', 'Ecografia abdominal.', 'TC si pancreatitis grave, complicacion o duda.'], manejo: ['Antibioterapia segun foco, gravedad, alergias, funcion renal y protocolo local si colangitis, colecistitis complicada, sepsis o infeccion probable.', 'No dar alta si fiebre, ictericia, dolor persistente o pancreatitis.', 'Valorar digestivo/cirugia segun sospecha.'], destino: 'Alta solo en colico biliar resuelto y sin alarma; observacion/ingreso si fiebre, ictericia, pancreatitis, colecistitis o colangitis.', destinoItems: ['Alta si colico resuelto, afebril y tolera.', 'Ingreso si fiebre, ictericia, pancreatitis o dolor persistente.', 'Cirugia/digestivo si complicacion.'], seguimiento: ['Volver por fiebre, ictericia, coluria, vomitos o empeoramiento.', 'Reevaluar si no mejora.'], simuladores: ['Epigastralgia en paciente de riesgo: valorar SCA/Cardiologia.', 'Tos, disnea o dolor pleuritico: valorar neumonia basal/Respiratorio.'] },
    bibliography: [referenceEntry({ id: 'dolor-hepatobiliar-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, orientacion hepatobiliar-pancreatica.' }), createBibliographyEntry({ id: 'dolor-hepatobiliar-acg-pancreatitis', referenceId: 'acg-pancreatitis-2024', note: 'Corrobora manejo inicial de pancreatitis aguda, fluidos dirigidos, nutricion, antibiotico no rutinario y criterios de gravedad.' })],
  },
  'dolor-urinario': {
    id: 'dolor-urinario', title: 'Dolor urinario', longTitle: 'Dolor abdominal urinario / Urologia', chapter: 'Cap. 50', section: 'Urologia', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Colico renal, pielonefritis, ITU complicada, retencion y prostatitis.',
    guardia: { clinica: 'Flanco o hipogastrio, irradiacion a ingle, hematuria, disuria, fiebre, vomitos, monorreno, fracaso renal o inmunosupresion.', diagnostico: 'Separar colico renal no complicado de pielonefritis, obstruccion infectada, ITU complicada, retencion o prostatitis.', tratamiento: 'Escalonar: controlar dolor, tratar vomitos si impiden via oral, hidratar segun tolerancia y derivar si colico complicado, fiebre, fracaso renal, monorreno o dolor no controlado.', datosTratamiento: ['Alergias.', 'Funcion renal/creatinina y monorreno.', 'Embarazo posible.', 'Fiebre o sepsis.', 'Tolerancia oral, vomitos y dolor tras tratamiento inicial.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'warning', items: ['Orina/sedimento y funcion renal antes de decidir alta si sospecha colico renal.', 'Via venosa si dolor intenso, vomitos, sepsis o mala tolerancia.', 'Hidratacion oral o IV segun tolerancia; no forzar sobrecarga.'] }, { title: '2. Farmaco / intervencion', items: ['Dolor tipo colico: pauta analgesica local auditada, evitando AINE si insuficiencia renal, sangrado activo, alergia, embarazo avanzado o fragilidad de alto riesgo.', 'Vomitos: antiemetico de protocolo local si impiden analgesia, hidratacion o alta segura.', 'Antibioterapia segun foco, gravedad, alergias, funcion renal y protocolo local si ITU febril, pielonefritis, prostatitis, sepsis u obstruccion infectada.', 'Retencion: sondaje vesical si procede y vigilar diuresis.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Urologia urgente si obstruccion infectada, fiebre con litiasis, monorreno, fracaso renal o anuria.', 'Observacion/ingreso si dolor no controlado, vomitos persistentes o mala tolerancia.', 'Alta solo si afebril, dolor controlado, funcion renal aceptable y alarma entendida.'] }], alertas: ['Fiebre con obstruccion posible.', 'Monorreno o insuficiencia renal.', 'Dolor no controlado.', 'Sepsis o vomitos persistentes.'], pruebas: ['Tira/sedimento de orina.', 'Funcion renal.', 'Hemograma/PCR si fiebre o infeccion.', 'Ecografia o TC si complicado, fiebre, monorreno, fracaso renal, dolor no controlado o duda.'], manejo: ['Alta si colico no complicado, afebril, dolor controlado y funcion renal aceptable.', 'Urologia urgente si obstruccion infectada.', 'Elegir antibiotico con protocolo local, alergias y funcion renal si hay indicacion clara.'], destino: 'Alta si no complicado; ingreso/urologia si fiebre, obstruccion infectada, monorreno, fracaso renal, dolor no controlado o sepsis.', destinoItems: ['Alta con alarma si bajo riesgo.', 'Observacion si vomitos o dolor persistente.', 'Ingreso/urologia si fiebre, sepsis, monorreno o fracaso renal.'], seguimiento: ['Volver por fiebre, anuria, vomitos, dolor incoercible o deterioro.', 'Reevaluar si recurre o precisa analgesia repetida.'], simuladores: ['Dolor brusco o paciente vascular: valorar rama Vascular.', 'Dolor testicular: valorar patologia escrotal/Urologia.'] },
    bibliography: [referenceEntry({ id: 'dolor-urinario-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor de flanco e hipogastrio urinario.' }), createBibliographyEntry({ id: 'dolor-urinario-eau-urolithiasis', referenceId: 'eau-urolithiasis-2025', note: 'Corrobora colico renal, imagen en casos complicados, analgesia condicionada por seguridad y criterios de urologia urgente.' }), createBibliographyEntry({ id: 'dolor-urinario-eau-infections', referenceId: 'eau-urological-infections-2025', note: 'Corrobora pielonefritis, ITU complicada, obstruccion infectada y uso de antibiotico segun gravedad y funcion renal.' })],
  },
  'dolor-ginecologico': {
    id: 'dolor-ginecologico', title: 'Dolor ginecologico', longTitle: 'Dolor abdominal ginecologico', chapter: 'Cap. 50', section: 'Ginecologia', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Ectopico, torsion ovarica, EPI, quiste complicado y complicacion gestacional.',
    guardia: { clinica: 'Mujer en edad fertil con dolor hipogastrico o fosa iliaca, amenorrea, sangrado, flujo, sincope, hipotension o dolor subito intenso.', diagnostico: 'Primero descartar embarazo ectopico y torsion; despues EPI, quiste complicado y complicacion gestacional.', tratamiento: 'Primero descartar embarazo ectopico o torsion; despues controlar dolor, estabilizar si sangrado/inestabilidad y avisar ginecologia si hay sospecha urgente.', datosTratamiento: ['Test de embarazo si posibilidad de embarazo.', 'Alergias.', 'TA, FC, SatO2 y signos de sangrado.', 'Funcion renal si precisa contraste o analgesia con riesgo.', 'Anticoagulacion y comorbilidad.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'warning', items: ['Via venosa si dolor moderado-grave, sangrado, sincope, hipotension o mal estado.', 'Reposicion de volumen segun estabilidad hemodinamica y sangrado.', 'No retrasar ecografia/ginecologia si ectopico o torsion probable.'] }, { title: '2. Farmaco / intervencion', items: ['Dolor: pauta analgesica local auditada segun embarazo, funcion renal, sangrado, alergias y fragilidad.', 'Infeccion/EPI: antibioterapia solo con pauta local auditada y tras valorar embarazo, alergias y gravedad.', 'Evitar alta sin descartar embarazo cuando sea clinicamente posible.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Ginecologia urgente si test positivo con dolor/sangrado, torsion probable, sangrado significativo o inestabilidad.', 'Observacion si diagnostico incierto o dolor persistente.', 'Ingreso si inestabilidad, infeccion grave, sangrado o necesidad de procedimiento.'] }], alertas: ['Test de embarazo positivo con dolor o sangrado.', 'Sincope, hipotension o palidez.', 'Dolor anexial brusco intenso.', 'Fiebre o defensa.'], pruebas: ['Test de embarazo obligatorio si posibilidad de embarazo.', 'Hemograma si sangrado o mal estado.', 'Orina si duda urinaria.', 'Ecografia ginecologica si sospecha.', 'Ginecologia urgente si ectopico, torsion, sangrado significativo o inestabilidad.'], manejo: ['Antibioterapia segun protocolo local si EPI/infeccion probable, revisando embarazo, alergias y gravedad.', 'No alta con sospecha de ectopico o torsion.', 'Observacion si diagnostico incierto.'], destino: 'Ginecologia urgente si ectopico, torsion, sangrado o inestabilidad; alta solo si bajo riesgo, estable y seguimiento claro.', destinoItems: ['Observacion si duda.', 'Ginecologia/ingreso si ectopico, torsion, sangrado o inestabilidad.', 'Alta solo con embarazo descartado si procede y alarma clara.'], seguimiento: ['Volver por sangrado, sincope, fiebre, dolor creciente, vomitos o deterioro.', 'Reevaluacion si persiste dolor.'] },
    bibliography: [referenceEntry({ id: 'dolor-ginecologico-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor bajo y causas ginecologicas urgentes.' }), createBibliographyEntry({ id: 'dolor-ginecologico-acog-ectopic', referenceId: 'acog-ectopic-2018', note: 'Corrobora que el ectopico con inestabilidad es emergencia quirurgica y que el test de embarazo orienta el flujo inicial.' })],
  },
  'dolor-vascular': {
    id: 'dolor-vascular', title: 'Dolor vascular', longTitle: 'Dolor abdominal vascular', chapter: 'Cap. 50', section: 'Vascular', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Isquemia mesenterica, aneurisma, diseccion y embolia/trombosis visceral.',
    guardia: { clinica: 'Dolor subito intenso o desproporcionado, edad avanzada, FA, aterosclerosis, hipotension/sincope, lactato elevado o riesgo embolico.', diagnostico: 'Pensar en isquemia mesenterica, aneurisma de aorta, diseccion o trombosis/embolia visceral.', tratamiento: 'Tratar como tiempo-dependiente: monitorizacion, via venosa, control del dolor, soporte hemodinamico si shock y aviso precoz a vascular/cirugia/criticos.', datosTratamiento: ['TA, FC, SatO2, nivel de conciencia y perfusion.', 'Lactato/gasometria y funcion renal.', 'Anticoagulacion activa y riesgo embolico.', 'Alergias y funcion renal antes de contraste.', 'FA, aterosclerosis, sincope o dolor desproporcionado.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'critical', items: ['Monitorizar si sospecha vascular, shock, sincope, acidosis o dolor desproporcionado.', 'Dos vias venosas si inestable y preparacion para imagen/traslado.', 'Soporte de volumen si shock, vigilando respuesta, perfusion y comorbilidad.'] }, { title: '2. Farmaco / intervencion', items: ['Dolor: pauta analgesica IV local auditada con reevaluacion frecuente.', 'Contraste/TC angiografica: revisar funcion renal y alergias, sin retrasar si la sospecha vital es alta.', 'Anticoagulacion o antiagregacion: no iniciar pauta empirica desde este modulo; decidir con vascular/cirugia segun diagnostico.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Aviso precoz a vascular/cirugia/criticos.', 'TC angiografica si sospecha y disponibilidad.', 'UCI/criticos si hipotension, acidosis, lactato elevado o deterioro.'] }], alertas: ['Dolor desproporcionado.', 'Hipotension o sincope.', 'FA/riesgo embolico.', 'Lactato elevado o acidosis.'], pruebas: ['Gasometria/lactato.', 'Analitica completa.', 'ECG si sospecha embolica/cardiaca.', 'TC angiografica si sospecha vascular y disponibilidad.'], manejo: ['No tranquilizarse por exploracion pobre si dolor desproporcionado.', 'No retrasar valoracion especializada.', 'Escalar si hipotension, acidosis o peritonismo.'], destino: 'Ingreso urgente; UCI si inestable; vascular/cirugia segun sospecha.', destinoItems: ['Ingreso urgente.', 'UCI/criticos si inestabilidad.', 'Vascular/cirugia si aneurisma, diseccion o isquemia.'], seguimiento: ['Control seriado de dolor, constantes, perfusion y lactato.', 'Escalar ante deterioro.'] },
    bibliography: [referenceEntry({ id: 'dolor-vascular-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, dolor desproporcionado y sospecha vascular.' }), createBibliographyEntry({ id: 'dolor-vascular-wses-ami', referenceId: 'wses-ami-2022', note: 'Corrobora angio-TC precoz, antibiotico amplio, heparina no fraccionada si no contraindicada y cirugia/revascularizacion urgente en isquemia mesenterica aguda.' }), createBibliographyEntry({ id: 'dolor-vascular-ssc-sepsis', referenceId: 'ssc-sepsis-2021', note: 'Apoya la actuacion inmediata ante shock, lactato elevado, sepsis y necesidad de soporte sin retrasar valoracion especializada.' })],
  },
  'dolor-infeccioso-digestivo': {
    id: 'dolor-infeccioso-digestivo', title: 'Infeccioso-digestivo', longTitle: 'Dolor infeccioso-digestivo', chapter: 'Cap. 50', section: 'Digestivo / Infecciosas', verifiedPage: 340, pdfPage: 365, status: 'implementado', summary: 'Gastroenteritis, colitis, diverticulitis, sepsis abdominal y absceso intraabdominal.',
    guardia: { clinica: 'Fiebre, diarrea, rectorragia, dolor localizado, inmunosupresion, mal estado general o deshidratacion.', diagnostico: 'Valorar gastroenteritis, colitis, diverticulitis no complicada/complicada, sepsis abdominal o absceso.', tratamiento: 'Priorizar hidratacion segun tolerancia, control sintomatico y detectar sepsis, inmunosupresion, diverticulitis complicada o absceso antes de decidir antibiotico.', datosTratamiento: ['Tolerancia oral y signos de deshidratacion.', 'TA, FC, temperatura y SatO2.', 'Funcion renal/electrolitos si vomitos, diarrea intensa o fragilidad.', 'Alergias.', 'Inmunosupresion, edad avanzada o comorbilidad.'], tratamientoItems: [{ title: '1. Medida inicial', tone: 'warning', items: ['Rehidratacion oral si leve y tolera; via IV si deshidratacion, sepsis, vomitos persistentes o fragilidad.', 'Control de diuresis, constantes y tolerancia.', 'Aislamiento/medidas de contacto segun contexto local si diarrea infecciosa.'] }, { title: '2. Farmaco / intervencion', items: ['Vomitos: antiemetico de protocolo local si impide hidratacion o medicacion oral, revisando QT/interacciones.', 'Dolor: pauta analgesica local auditada, evitando AINE si sangrado digestivo, insuficiencia renal, anticoagulacion o alto riesgo digestivo.', 'Antibioterapia segun foco, gravedad, alergias, funcion renal y protocolo local si sepsis, inmunosupresion, diverticulitis complicada, absceso o infeccion intraabdominal.'] }, { title: '3. Escalon siguiente', tone: 'critical', items: ['Observacion si mala tolerancia, dolor persistente o diagnostico incierto.', 'Ingreso si sepsis, inmunosupresion, deshidratacion relevante o complicacion.', 'TC si dolor localizado intenso, mala evolucion o sospecha de complicacion.'] }], alertas: ['Sepsis o mal estado general.', 'Inmunosupresion.', 'Dolor localizado intenso.', 'Deshidratacion o mala tolerancia.'], pruebas: ['Hemograma, bioquimica y PCR.', 'Orina si duda.', 'Coprocultivo solo si cambia conducta o contexto lo justifica.', 'TC si dolor localizado intenso, diverticulitis complicada, sepsis, inmunosupresion o mala evolucion.'], manejo: ['No usar antibiotico automatico en todo dolor abdominal con diarrea.', 'Observar si mala tolerancia o diagnostico incierto.', 'Escalar si sepsis o complicacion.'], destino: 'Alta si leve, estable y tolera; observacion/ingreso si deshidratacion, sepsis, inmunosupresion, dolor persistente o complicacion.', destinoItems: ['Alta si leve y tolera.', 'Observacion si dolor persistente o mala tolerancia.', 'Ingreso si sepsis, inmunosupresion o complicacion.'], seguimiento: ['Volver por fiebre persistente, sangre, deshidratacion, dolor progresivo o deterioro.', 'Reevaluar si no mejora.'], simuladores: ['Hiperglucemia/cetosis: valorar descompensacion metabolica/Endocrino.', 'Dolor cutaneo dermatomal: valorar herpes zoster.'] },
    bibliography: [referenceEntry({ id: 'dolor-infeccioso-cap50', indexPage: 340, pdfPage: 365, note: 'Murillo 7. ed., cap. 50, cuadros infeccioso-digestivos.' }), createBibliographyEntry({ id: 'dolor-infeccioso-wses-diverticulitis', referenceId: 'wses-diverticulitis-2020', note: 'Corrobora diverticulitis no complicada/complicada, indicacion selectiva de antibiotico, imagen y destino.' }), createBibliographyEntry({ id: 'dolor-infeccioso-ssc-sepsis', referenceId: 'ssc-sepsis-2021', note: 'Corrobora lactato, reanimacion, antibiotico precoz cuando hay sepsis/shock y reevaluacion.' })],
  },
};

export const protocolList = Object.values(protocolCatalog);

export const getProtocol = (protocolId) => protocolCatalog[protocolId] ?? protocolList[0];
