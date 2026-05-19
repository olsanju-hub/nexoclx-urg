import { bibliographyCatalog, createBibliographyEntry } from './bibliography';

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

export const coreReference = bibliographyCatalog.murillo7;

export const clinicalIndexAudit = [
  {
    id: 'fibrilacion-auricular',
    title: 'Fibrilación y flúter auriculares',
    chapter: 'Cap. 23',
    section: 'Urgencias cardiovasculares',
    indexPage: 184,
    verifiedPage: 184,
    pdfPage: 209,
    status: 'implementado',
    note: 'Capítulo base verificado: el arranque útil real está en p. 184.',
  },
  {
    id: 'hta-urgencias',
    title: 'Urgencia y emergencia hipertensivas',
    chapter: 'Caps. 32-33',
    section: 'Urgencias cardiovasculares',
    indexPage: 246,
    verifiedPage: 246,
    pdfPage: 271,
    status: 'implementado',
    note: 'Urgencia hipertensiva inicia en p. 246 y emergencia hipertensiva en p. 249.',
  },
  {
    id: 'svb-adultos',
    title: 'Soporte vital básico en adultos',
    chapter: 'Cap. 1',
    section: 'Soporte vital',
    indexPage: 2,
    verifiedPage: 2,
    pdfPage: 27,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'sva-adultos',
    title: 'Soporte vital avanzado en adultos',
    chapter: 'Cap. 2',
    section: 'Soporte vital',
    indexPage: 7,
    verifiedPage: 7,
    pdfPage: 32,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'gasometria',
    title: 'Gasometría, pulsioximetría y capnografía',
    chapter: 'Cap. 8',
    section: 'Exploraciones complementarias',
    indexPage: 64,
    verifiedPage: 64,
    pdfPage: 89,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'ecg-urgencias',
    title: 'Electrocardiografía de urgencias',
    chapter: 'Cap. 9',
    section: 'Exploraciones complementarias',
    indexPage: 71,
    verifiedPage: 71,
    pdfPage: 96,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'radiografia-torax',
    title: 'Radiografía de tórax',
    chapter: 'Cap. 10',
    section: 'Exploraciones complementarias',
    indexPage: 83,
    verifiedPage: 83,
    pdfPage: 108,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'ecografia',
    title: 'Ecografía',
    chapter: 'Cap. 12',
    section: 'Exploraciones complementarias',
    indexPage: 108,
    verifiedPage: 108,
    pdfPage: 133,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'shock',
    title: 'Shock',
    chapter: 'Cap. 18',
    section: 'Urgencias cardiovasculares',
    indexPage: 154,
    verifiedPage: 154,
    pdfPage: 179,
    status: 'auditado',
    note: 'El arranque conceptual está en la página indexada; el rótulo del capítulo se repite en la siguiente.',
  },
  {
    id: 'insuficiencia-cardiaca',
    title: 'Insuficiencia cardíaca',
    chapter: 'Cap. 19',
    section: 'Urgencias cardiovasculares',
    indexPage: 161,
    verifiedPage: 161,
    pdfPage: 186,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'dolor-toracico-agudo',
    title: 'Dolor torácico agudo',
    chapter: 'Cap. 25',
    section: 'Urgencias cardiovasculares',
    indexPage: 207,
    verifiedPage: 207,
    pdfPage: 232,
    status: 'auditado',
    note: 'El contenido arranca en la página indexada.',
  },
  {
    id: 'sindrome-coronario-agudo',
    title: 'Síndrome coronario agudo',
    chapter: 'Cap. 26',
    section: 'Urgencias cardiovasculares',
    indexPage: 214,
    verifiedPage: 214,
    pdfPage: 239,
    status: 'auditado',
    note: 'El arranque conceptual está en la página indexada; el rótulo del capítulo aparece a continuación.',
  },
  {
    id: 'nauseas-vomitos-diarrea',
    title: 'Náuseas, vómitos y diarrea',
    chapter: 'Cap. 51',
    section: 'Urgencias del aparato digestivo',
    indexPage: 358,
    verifiedPage: 358,
    pdfPage: 383,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'coma',
    title: 'Coma',
    chapter: 'Cap. 62',
    section: 'Urgencias neurológicas',
    indexPage: 428,
    verifiedPage: 428,
    pdfPage: 453,
    status: 'auditado',
    note: 'El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente.',
  },
  {
    id: 'crisis-epilepticas',
    title: 'Crisis epilépticas',
    chapter: 'Cap. 63',
    section: 'Urgencias neurológicas',
    indexPage: 435,
    verifiedPage: 435,
    pdfPage: 460,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'ictus',
    title: 'Ictus',
    chapter: 'Cap. 64',
    section: 'Urgencias neurológicas',
    indexPage: 442,
    verifiedPage: 442,
    pdfPage: 467,
    status: 'auditado',
    note: 'El arranque conceptual está en la página indexada; el rótulo del capítulo aparece en la siguiente.',
  },
  {
    id: 'sepsis',
    title: 'Sepsis',
    chapter: 'Cap. 107',
    section: 'Infecciones en medicina de urgencias',
    indexPage: 640,
    verifiedPage: 640,
    pdfPage: 665,
    status: 'auditado',
    note: 'Sin discrepancia entre índice y arranque real.',
  },
  {
    id: 'neumonia-comunidad',
    title: 'Neumonía adquirida en la comunidad',
    chapter: 'Cap. 42',
    section: 'Urgencias del aparato respiratorio',
    indexPage: 300,
    verifiedPage: 300,
    pdfPage: 325,
    status: 'implementado',
    note: 'Capítulo 42 verificado en Murillo; NICE NG250 2025 queda como fuente principal actualizada para decisiones de antibiótico, reevaluación y seguimiento.',
  },
];

export const protocolSpecialties = [
  {
    id: 'cardiologia',
    title: 'Cardiología',
    note: 'Arritmias, hipertensión, insuficiencia cardiaca y síndrome coronario agudo.',
  },
  {
    id: 'neurologia',
    title: 'Neurología',
    note: 'Ictus y alteración del nivel de consciencia.',
  },
  {
    id: 'digestivo',
    title: 'Digestivo',
    note: 'Dolor epigástrico, biliar, diverticular y otros cuadros digestivos.',
  },
  {
    id: 'cirugia-general',
    title: 'Cirugía general',
    note: 'Abdomen agudo quirúrgico, peritonismo, apendicitis y obstrucción.',
  },
  {
    id: 'urologia',
    title: 'Urología',
    note: 'Cólico renal, retención, infección urinaria complicada y dolor de flanco.',
  },
  {
    id: 'ginecologia',
    title: 'Ginecología',
    note: 'Dolor pélvico, embarazo ectópico, torsión y patología anexial urgente.',
  },
  {
    id: 'vascular',
    title: 'Vascular',
    note: 'Dolor abdominal desproporcionado, isquemia mesentérica y aneurisma.',
  },
  {
    id: 'infecciosas',
    title: 'Infecciosas',
    note: 'Neumonía, sepsis y otros síndromes infecciosos.',
  },
  {
    id: 'respiratorio',
    title: 'Respiratorio',
    note: 'Asma, EPOC y otros cuadros respiratorios urgentes.',
  },
  {
    id: 'urgencias',
    title: 'Urgencias',
    note: 'Cuadros transversales tiempo-dependientes y soporte inicial.',
  },
];

export const motivoConsultaModules = [
  {
    id: 'fibrilacion-auricular',
    title: 'Fibrilación auricular',
    shortTitle: 'Fibrilación auricular',
    chapter: 'Guía ESC 2024',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 184,
    pdfPage: 209,
    status: 'implementado',
    implemented: true,
    summary: 'Estabilidad, inicio < 24 h o ≥ 24 h, control de frecuencia y anticoagulación.',
    bibliography: [
      escFaEntry({
        id: 'fa-esc-module',
        verifiedPages: [75, 76],
        pdfPages: [75, 76],
        note: 'Referencia principal actual del módulo de FA.',
      }),
      referenceEntry({
        id: 'fa-murillo-support',
        indexPage: 184,
        verifiedPage: 184,
        pdfPage: 209,
        note: 'Apoyo práctico secundario en la obra base.',
      }),
    ],
  },
  {
    id: 'hta-urgencias',
    title: 'HTA en urgencias',
    shortTitle: 'HTA en urgencias',
    chapter: 'Caps. 32-33',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 246,
    pdfPage: 271,
    status: 'implementado',
    implemented: true,
    summary: 'Separar urgencia de emergencia y bajar la PA sin descensos bruscos.',
    bibliography: [
      escHtaEntry({
        id: 'esc-hta-acute-management-module',
        verifiedPages: [79, 80],
        pdfPages: [80, 81],
        note: 'Referencia principal actual para el manejo agudo de HTA.',
      }),
      referenceEntry({
        id: 'hta-urgencia-start',
        indexPage: 246,
        verifiedPage: 246,
        pdfPage: 271,
        note: 'Inicio real del capítulo de urgencia hipertensiva.',
      }),
      referenceEntry({
        id: 'hta-emergencia-start',
        indexPage: 249,
        verifiedPage: 249,
        pdfPage: 274,
        note: 'Inicio real del capítulo de emergencia hipertensiva.',
      }),
    ],
  },
  {
    id: 'sindrome-coronario-agudo',
    title: 'Síndrome coronario agudo',
    shortTitle: 'Síndrome coronario agudo',
    chapter: 'Cap. 26',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 214,
    pdfPage: 239,
    status: 'implementado',
    implemented: true,
    summary: 'ECG, hs-cTn, riesgo y reperfusión ordenados para decidir rápido.',
    bibliography: [
      escScaEntry({
        id: 'esc-sca-triage-module',
        verifiedPages: [16, 19],
        pdfPages: [17, 20],
        note: 'Referencia principal actual para triaje y diagnóstico inicial del SCA.',
      }),
      escScaEntry({
        id: 'esc-sca-treatment-module',
        verifiedPages: [25, 32, 40],
        pdfPages: [26, 33, 41],
        note: 'Tratamiento inicial, estrategia invasiva y antitrombosis según guía ESC 2023.',
      }),
      referenceEntry({
        id: 'sca-treatment-cap26',
        indexPage: 221,
        verifiedPage: 221,
        pdfPage: 246,
        note: 'Bloque terapéutico y de reperfusión del capítulo.',
      }),
    ],
  },
  {
    id: 'insuficiencia-cardiaca',
    title: 'Insuficiencia cardiaca',
    shortTitle: 'ICC',
    chapter: 'Cap. 19',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 161,
    pdfPage: 186,
    status: 'auditado',
    implemented: false,
    summary: 'Tema auditado. Protocolo operativo no activo.',
    bibliography: [
      referenceEntry({
        id: 'icc-cap19',
        indexPage: 161,
        verifiedPage: 161,
        pdfPage: 186,
        note: 'Capítulo base auditado para futura integración del protocolo de ICC.',
      }),
    ],
  },
  {
    id: 'taquicardia-supraventricular',
    title: 'Taquicardia supraventricular',
    shortTitle: 'TSV',
    chapter: 'Guía ESC 2019',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'auditado',
    implemented: false,
    summary: 'Tema auditado. Protocolo independiente no activo.',
    bibliography: [
      escTsvEntry({
        id: 'tsv-esc-module',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal actual para TSV.',
      }),
    ],
  },
  {
    id: 'bradicardias',
    title: 'Bradicardias',
    shortTitle: 'Bradicardias',
    chapter: 'Documento ESC 2021',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    implemented: true,
    summary: 'Bradicardia con o sin repercusión, bloqueo AV de alto riesgo y vía de estimulación urgente.',
    bibliography: [
      escBradyEntry({
        id: 'brady-esc-module',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal del módulo para bradicardias, trastornos de conducción y necesidad de estimulación.',
      }),
    ],
  },
  {
    id: 'arritmias-ventriculares',
    title: 'Arritmias ventriculares',
    shortTitle: 'Arritmias ventriculares',
    chapter: 'Documento ESC 2022',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    implemented: true,
    summary: 'TV monomorfa, TV polimórfica / torsades y conducta eléctrica o farmacológica urgente.',
    bibliography: [
      escVentricularEntry({
        id: 'ventricular-esc-module',
        verifiedPages: [1, 2],
        pdfPages: [1, 2],
        note: 'Referencia principal del módulo para taquicardia ventricular y arritmias ventriculares agudas.',
      }),
    ],
  },
  {
    id: 'shock',
    title: 'Shock',
    shortTitle: 'Shock',
    chapter: 'Cap. 18',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 154,
    pdfPage: 179,
    status: 'auditado',
    implemented: false,
    summary: 'Tema auditado. Sin protocolo operativo en esta fase.',
    bibliography: [
      referenceEntry({
        id: 'shock-cap18',
        indexPage: 154,
        pdfPage: 179,
        note: 'Arranque conceptual verificado del capítulo.',
      }),
    ],
  },
  {
    id: 'dolor-toracico-agudo',
    title: 'Dolor torácico agudo',
    shortTitle: 'Dolor torácico agudo',
    chapter: 'Cap. 25',
    section: 'Cardiología',
    specialtyId: 'cardiologia',
    verifiedPage: 207,
    pdfPage: 232,
    status: 'auditado',
    implemented: false,
    summary: 'Tema auditado. Sin protocolo operativo en esta fase.',
    bibliography: [
      referenceEntry({
        id: 'dolor-toracico-cap25',
        indexPage: 207,
        pdfPage: 232,
        note: 'Inicio verificado del capítulo base.',
      }),
    ],
  },
  {
    id: 'ictus-isquemico',
    title: 'Ictus isquémico',
    shortTitle: 'Ictus isquémico',
    chapter: 'AHA 2026',
    section: 'Neurología',
    specialtyId: 'neurologia',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    implemented: true,
    summary: 'Código ictus, TAC sin sangrado, trombólisis y trombectomía ordenados para decidir rápido.',
    bibliography: [
      ahaIschemicStrokeEntry({
        id: 'ictus-isquemico-aha-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal del módulo de ictus isquémico.',
      }),
      referenceEntry({
        id: 'ictus-isquemico-murillo-module',
        indexPage: 442,
        pdfPage: 467,
        note: 'Apoyo práctico secundario del capítulo de ictus en la obra base.',
      }),
    ],
  },
  {
    id: 'ictus-hemorragico',
    title: 'Ictus hemorrágico',
    shortTitle: 'Ictus hemorrágico',
    chapter: 'AHA 2022',
    section: 'Neurología',
    specialtyId: 'neurologia',
    verifiedPage: 1,
    pdfPage: 1,
    status: 'implementado',
    implemented: true,
    summary: 'TAC, control de PA, reversión de anticoagulación y neurocirugía/UCI sin rodeos.',
    bibliography: [
      ahaHemorrhagicStrokeEntry({
        id: 'ictus-hemorragico-aha-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal del módulo de ictus hemorrágico.',
      }),
      referenceEntry({
        id: 'ictus-hemorragico-murillo-module',
        indexPage: 442,
        pdfPage: 467,
        note: 'Apoyo práctico secundario del capítulo de ictus en la obra base.',
      }),
    ],
  },
  {
    id: 'crisis-convulsiva-epilepsia',
    title: 'Crisis convulsiva / epilepsia en urgencias',
    shortTitle: 'Crisis convulsiva',
    chapter: 'Cap. 63 + SEN/NICE/AES',
    section: 'Neurología',
    specialtyId: 'neurologia',
    verifiedPage: 435,
    pdfPage: 460,
    status: 'implementado',
    implemented: true,
    summary:
      'Convulsión, epilepsia, primera crisis, crisis provocada y estatus epiléptico con tratamiento urgente escalonado.',
    bibliography: [
      referenceEntry({
        id: 'convulsiones-murillo-module',
        indexPage: 435,
        verifiedPage: 435,
        pdfPage: 460,
        note: 'Capítulo base para crisis epilépticas y estatus en urgencias.',
      }),
      senEpilepsyEntry({
        id: 'convulsiones-sen-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Apoyo de sociedad neurológica española para urgencias en epilepsia.',
      }),
      niceEpilepsyEntry({
        id: 'convulsiones-nice-module',
        verifiedPages: [7],
        pdfPages: [7],
        note: 'Tratamiento urgente de crisis prolongadas y estatus.',
      }),
      aesStatusEntry({
        id: 'convulsiones-aes-module',
        verifiedPages: [48, 49, 50, 51],
        pdfPages: [48, 49, 50, 51],
        note: 'Tratamiento escalonado del estatus convulsivo.',
      }),
    ],
  },
  {
    id: 'anafilaxia',
    title: 'Anafilaxia',
    shortTitle: 'Anafilaxia',
    chapter: 'Cap. 190 + NICE/RCUK',
    section: 'Urgencias',
    specialtyId: 'urgencias',
    verifiedPage: 1059,
    pdfPage: 1084,
    status: 'implementado',
    implemented: true,
    summary: 'Diagnóstico clínico, adrenalina IM inmediata, soporte y observación tras resolución.',
    bibliography: [
      referenceEntry({
        id: 'anafilaxia-murillo-module',
        indexPage: 1059,
        verifiedPage: 1059,
        pdfPage: 1084,
        note: 'Capítulo base para urticaria, angioedema y anafilaxia en urgencias.',
      }),
      niceAnaphylaxisEntry({
        id: 'anafilaxia-nice-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Valoración, observación, alta segura y derivación tras anafilaxia.',
      }),
      rcukAnaphylaxisEntry({
        id: 'anafilaxia-rcuk-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Tratamiento urgente y repetición de adrenalina IM.',
      }),
    ],
  },
  {
    id: 'asma-exacerbacion',
    title: 'Crisis asmática',
    shortTitle: 'Asma',
    chapter: 'Cap. 40 + GINA/GEMA',
    section: 'Respiratorio',
    specialtyId: 'respiratorio',
    verifiedPage: 290,
    pdfPage: 315,
    status: 'implementado',
    implemented: true,
    summary: 'Gravedad, PEF si disponible, broncodilatadores, corticoide precoz y destino de la crisis asmática.',
    bibliography: [
      referenceEntry({
        id: 'asma-murillo-module',
        indexPage: 290,
        verifiedPage: 290,
        pdfPage: 315,
        note: 'Capítulo base de ataque de asma en urgencias.',
      }),
      ginaAsthmaEntry({
        id: 'asma-gina-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia internacional actual para exacerbaciones asmáticas.',
      }),
      gemaAsthmaEntry({
        id: 'asma-gema-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia española para clasificación y manejo de crisis asmática.',
      }),
    ],
  },
  {
    id: 'epoc-agudizacion',
    title: 'Agudización de EPOC',
    shortTitle: 'EPOC',
    chapter: 'Cap. 41 + GOLD/GesEPOC',
    section: 'Respiratorio',
    specialtyId: 'respiratorio',
    verifiedPage: 294,
    pdfPage: 319,
    status: 'implementado',
    implemented: true,
    summary: 'Disnea, esputo, gasometría, oxígeno controlado, broncodilatadores, corticoide, antibiótico si criterios y VNI.',
    bibliography: [
      referenceEntry({
        id: 'epoc-murillo-module',
        indexPage: 294,
        verifiedPage: 294,
        pdfPage: 319,
        note: 'Capítulo base de EPOC agudizada en urgencias.',
      }),
      goldCopdEntry({
        id: 'epoc-gold-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia internacional actual para agudización de EPOC.',
      }),
      gesepocEntry({
        id: 'epoc-gesepoc-module',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia española para diagnóstico y tratamiento del síndrome de agudización.',
      }),
    ],
  },
  {
    id: 'sepsis',
    title: 'Sepsis / shock séptico',
    shortTitle: 'Sepsis',
    chapter: 'Cap. 107 + SSC 2021',
    section: 'Infecciosas',
    specialtyId: 'infecciosas',
    verifiedPage: 640,
    pdfPage: 665,
    status: 'implementado',
    implemented: true,
    summary: 'Infección grave, lactato, antibiótico precoz, fluidoterapia, control de foco y destino monitorizado.',
    bibliography: [
      referenceEntry({
        id: 'sepsis-cap107',
        indexPage: 640,
        pdfPage: 665,
        note: 'Inicio verificado del capítulo base.',
      }),
      createBibliographyEntry({
        id: 'sepsis-ssc-module',
        referenceId: 'ssc-sepsis-2021',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Referencia principal para manejo inicial de sepsis y shock séptico.',
      }),
      createBibliographyEntry({
        id: 'sepsis-nice-module',
        referenceId: 'nice-ng253-sepsis',
        verifiedPages: [1],
        pdfPages: [1],
        note: 'Apoyo para reconocimiento y actuación temprana.',
      }),
    ],
  },
  {
    id: 'neumonia-comunidad',
    title: 'Neumonía adquirida en la comunidad',
    shortTitle: 'Neumonía',
    chapter: 'NICE NG250 2025 + Cap. 42',
    section: 'Infecciosas',
    specialtyId: 'infecciosas',
    verifiedPage: 9,
    pdfPage: 9,
    status: 'implementado',
    implemented: true,
    summary: 'Sospecha, diagnóstico, CRB/CURB-65, destino, antibiótico inicial y reevaluación.',
    bibliography: [
      niceNg250Entry({
        id: 'neumonia-nice-module',
        verifiedPages: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 36, 37, 38, 39],
        pdfPages: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 36, 37, 38, 39],
        note: 'Fuente principal actualizada: estratificación, destino, antibióticos, reevaluación y seguimiento.',
      }),
      referenceEntry({
        id: 'neumonia-murillo-cap42',
        indexPage: 300,
        verifiedPage: 300,
        pdfPage: 325,
        note: 'Capítulo base de Murillo 7.ª ed. para concepto, sospecha clínica y pruebas urgentes.',
      }),
    ],
  },
  {
    id: 'coma',
    title: 'Coma',
    shortTitle: 'Coma',
    chapter: 'Cap. 62',
    section: 'Neurología',
    specialtyId: 'neurologia',
    verifiedPage: 428,
    pdfPage: 453,
    status: 'auditado',
    implemented: false,
    summary: 'Tema auditado. Sin protocolo operativo en esta fase.',
    bibliography: [
      referenceEntry({
        id: 'coma-cap62',
        indexPage: 428,
        pdfPage: 453,
        note: 'Inicio verificado del capítulo base.',
      }),
    ],
  },
{
    id: 'dolor-abdomen-quirurgico',
    title: 'Abdomen quirurgico',
    shortTitle: 'Abdomen quirurgico',
    chapter: 'Cap. 50',
    section: 'Cirugia general',
    specialtyId: 'cirugia-general',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Apendicitis, perforacion, obstruccion, diverticulitis complicada, peritonitis y hernia complicada.',
    bibliography: [referenceEntry({ id: 'dolor-quirurgico-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama quirurgica.' })],
  },
  {
    id: 'dolor-hepatobiliar-pancreatico',
    title: 'Hepatobiliar-pancreatico',
    shortTitle: 'Hepatobiliar',
    chapter: 'Cap. 50',
    section: 'Digestivo',
    specialtyId: 'digestivo',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Colico biliar, colecistitis, colangitis, hepatitis, pancreatitis y absceso hepatico.',
    bibliography: [referenceEntry({ id: 'dolor-hepatobiliar-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama hepatobiliar-pancreatica.' })],
  },
  {
    id: 'dolor-urinario',
    title: 'Dolor urinario',
    shortTitle: 'Urinario',
    chapter: 'Cap. 50',
    section: 'Urologia',
    specialtyId: 'urologia',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Colico renal, pielonefritis, infeccion urinaria complicada, retencion y prostatitis.',
    bibliography: [referenceEntry({ id: 'dolor-urinario-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama urinaria.' })],
  },
  {
    id: 'dolor-ginecologico',
    title: 'Dolor ginecologico',
    shortTitle: 'Ginecologico',
    chapter: 'Cap. 50',
    section: 'Ginecologia',
    specialtyId: 'ginecologia',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Embarazo ectopico, torsion ovarica, EPI, quiste complicado y complicacion gestacional.',
    bibliography: [referenceEntry({ id: 'dolor-ginecologico-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama ginecologica.' })],
  },
  {
    id: 'dolor-vascular',
    title: 'Dolor vascular',
    shortTitle: 'Vascular',
    chapter: 'Cap. 50',
    section: 'Vascular',
    specialtyId: 'vascular',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Isquemia mesenterica, aneurisma, diseccion y embolia/trombosis visceral.',
    bibliography: [referenceEntry({ id: 'dolor-vascular-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama vascular.' })],
  },
  {
    id: 'dolor-infeccioso-digestivo',
    title: 'Infeccioso-digestivo',
    shortTitle: 'Infeccioso-digestivo',
    chapter: 'Cap. 50',
    section: 'Digestivo / Infecciosas',
    specialtyId: 'infecciosas',
    verifiedPage: 340,
    pdfPage: 365,
    status: 'implementado',
    implemented: true,
    summary: 'Gastroenteritis, colitis, diverticulitis, sepsis abdominal y absceso intraabdominal.',
    bibliography: [referenceEntry({ id: 'dolor-infeccioso-module', indexPage: 340, pdfPage: 365, note: 'Dolor abdominal agudo: rama infeccioso-digestiva.' })],
  },
];

const sortModules = (left, right) => {
  const implementedDelta = Number(right.implemented) - Number(left.implemented);

  if (implementedDelta !== 0) {
    return implementedDelta;
  }

  return left.title.localeCompare(right.title, 'es');
};

export const groupModulesBySpecialty = (modules = motivoConsultaModules, { implementedOnly = false } = {}) =>
  protocolSpecialties
    .map((specialty) => ({
      ...specialty,
      modules: modules
        .filter((module) => module.specialtyId === specialty.id && (!implementedOnly || module.implemented))
        .sort(sortModules),
    }))
    .filter((specialty) => specialty.modules.length > 0);

export const recentActivity = [
  {
    time: 'FA',
    title: 'Protocolo real',
    meta: 'Fibrilación auricular',
    target: { type: 'protocol', id: 'fibrilacion-auricular' },
  },
  {
    time: 'CAL',
    title: 'CHA2DS2-VA',
    meta: 'Módulo FA',
    target: { type: 'calculator', id: 'cha2ds2-va' },
  },
  {
    time: 'CAL',
    title: 'HAS-BLED',
    meta: 'Módulo FA',
    target: { type: 'calculator', id: 'has-bled' },
  },
  {
    time: 'MED',
    title: 'Apixabán',
    meta: 'Ficha farmacológica',
    target: { type: 'medication', id: 'apixaban' },
  },
  {
    time: 'MED',
    title: 'Metoprolol',
    meta: 'Control de frecuencia',
    target: { type: 'medication', id: 'metoprolol' },
  },
];

export const bibliographyBaseUsed = [
  {
    id: 'esc-fa-2024',
    title: bibliographyCatalog['esc-fa-2024'].title,
    shortTitle: bibliographyCatalog['esc-fa-2024'].shortTitle,
    status: 'activa · principal en FA',
    note: 'Guía principal para fibrilación auricular, cardioversión, control de frecuencia y anticoagulación.',
  },
  {
    id: 'esc-hta-2024',
    title: bibliographyCatalog['esc-hta-2024'].title,
    shortTitle: bibliographyCatalog['esc-hta-2024'].shortTitle,
    status: 'activa · principal en HTA',
    note: 'Guía principal para HTA en urgencias y manejo agudo de la presión arterial.',
  },
  {
    id: 'esc-sca-2023',
    title: bibliographyCatalog['esc-sca-2023'].title,
    shortTitle: bibliographyCatalog['esc-sca-2023'].shortTitle,
    status: 'activa · principal en IAM/SCA',
    note: 'Guía principal para síndrome coronario agudo, triaje, reperfusión y antitrombosis.',
  },
  {
    id: 'esc-tsv-2019',
    title: bibliographyCatalog['esc-tsv-2019'].title,
    shortTitle: bibliographyCatalog['esc-tsv-2019'].shortTitle,
    status: 'activa · principal en TSV',
    note: 'Guía principal actual para taquicardia supraventricular; referencia indexada para módulo independiente.',
  },
  {
    id: 'esc-bradicardias-2021',
    title: bibliographyCatalog['esc-bradicardias-2021'].title,
    shortTitle: bibliographyCatalog['esc-bradicardias-2021'].shortTitle,
    status: 'activa · principal en bradicardias',
    note: 'Referencia principal del módulo de bradicardias y estimulación.',
  },
  {
    id: 'esc-arritmias-ventriculares-2022',
    title: bibliographyCatalog['esc-arritmias-ventriculares-2022'].title,
    shortTitle: bibliographyCatalog['esc-arritmias-ventriculares-2022'].shortTitle,
    status: 'activa · principal en arritmias ventriculares',
    note: 'Referencia principal del módulo de arritmias ventriculares.',
  },
  {
    id: 'murillo7',
    title: bibliographyCatalog.murillo7.title,
    shortTitle: bibliographyCatalog.murillo7.shortTitle,
    status: 'activa · base práctica',
    note: 'Obra base inicial para protocolos de urgencias; las decisiones críticas se corroboran con guías recientes cuando existen.',
  },
  {
    id: 'nice-ng250-2025',
    title: bibliographyCatalog['nice-ng250-2025'].title,
    shortTitle: bibliographyCatalog['nice-ng250-2025'].shortTitle,
    status: 'activa · principal en neumonía',
    note: 'Guía principal actualizada para neumonía: diagnóstico, lugar de cuidados, antibióticos, reevaluación y seguimiento.',
  },
  {
    id: 'wses-appendicitis-2020',
    title: bibliographyCatalog['wses-appendicitis-2020'].title,
    shortTitle: bibliographyCatalog['wses-appendicitis-2020'].shortTitle,
    status: 'activa · corroboración quirúrgica',
    note: 'Referencia de apoyo para abdomen quirúrgico y sospecha de apendicitis.',
  },
  {
    id: 'wses-diverticulitis-2020',
    title: bibliographyCatalog['wses-diverticulitis-2020'].title,
    shortTitle: bibliographyCatalog['wses-diverticulitis-2020'].shortTitle,
    status: 'activa · corroboración digestivo-infecciosa',
    note: 'Referencia de apoyo para diverticulitis y dolor infeccioso-digestivo.',
  },
  {
    id: 'acg-pancreatitis-2024',
    title: bibliographyCatalog['acg-pancreatitis-2024'].title,
    shortTitle: bibliographyCatalog['acg-pancreatitis-2024'].shortTitle,
    status: 'activa · corroboración digestiva',
    note: 'Referencia de apoyo para dolor hepatobiliar-pancreático.',
  },
  {
    id: 'eau-urolithiasis-2025',
    title: bibliographyCatalog['eau-urolithiasis-2025'].title,
    shortTitle: bibliographyCatalog['eau-urolithiasis-2025'].shortTitle,
    status: 'activa · corroboración urológica',
    note: 'Referencia de apoyo para cólico renal y dolor de flanco.',
  },
  {
    id: 'eau-urological-infections-2025',
    title: bibliographyCatalog['eau-urological-infections-2025'].title,
    shortTitle: bibliographyCatalog['eau-urological-infections-2025'].shortTitle,
    status: 'activa · corroboración urológica',
    note: 'Referencia de apoyo para pielonefritis, ITU complicada y obstrucción infectada.',
  },
  {
    id: 'acog-ectopic-2018',
    title: bibliographyCatalog['acog-ectopic-2018'].title,
    shortTitle: bibliographyCatalog['acog-ectopic-2018'].shortTitle,
    status: 'activa · corroboración ginecológica',
    note: 'Referencia de apoyo para dolor pélvico con sospecha de embarazo ectópico.',
  },
  {
    id: 'ssc-sepsis-2021',
    title: bibliographyCatalog['ssc-sepsis-2021'].title,
    shortTitle: bibliographyCatalog['ssc-sepsis-2021'].shortTitle,
    status: 'activa · corroboración sepsis',
    note: 'Referencia de apoyo para sepsis, shock y dolor abdominal infeccioso o vascular con deterioro.',
  },
  {
    id: 'nice-cg174-fluidoterapia',
    title: bibliographyCatalog['nice-cg174-fluidoterapia'].title,
    shortTitle: bibliographyCatalog['nice-cg174-fluidoterapia'].shortTitle,
    status: 'activa · fluidoterapia IV',
    note: 'Referencia principal para fluidoterapia IV, mantenimiento, reposición y reevaluación.',
  },
  {
    id: 'nice-ng253-sepsis',
    title: bibliographyCatalog['nice-ng253-sepsis'].title,
    shortTitle: bibliographyCatalog['nice-ng253-sepsis'].shortTitle,
    status: 'activa · sepsis',
    note: 'Referencia de apoyo para reconocimiento y tratamiento temprano de sepsis.',
  },
  {
    id: 'radiologia-indexada',
    title: 'Bibliografía específica de radiología',
    shortTitle: 'Radiología indexada',
    status: 'no disponible en workspace',
    note: 'No se ha detectado ningún nuevo archivo de radiología en el repositorio actual.',
  },
];

export const getMotivoModule = (moduleId) =>
  motivoConsultaModules.find((module) => module.id === moduleId) ?? motivoConsultaModules[0];
