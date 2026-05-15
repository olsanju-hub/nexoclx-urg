import { getCalculator } from './calculators';
import { getMedication } from './medications';
import { protocolList } from './protocols';

const PRIMARY_SECTION_TITLES = {
  definition: 'Qué es',
  orders: 'Qué pido',
  findings: 'Qué espero encontrar',
  treatment: 'Tratamiento',
  followUp: 'Destino / seguimiento',
};

const slugify = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);

const compactText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const brief = (value = '', maxLength = 150) => {
  const text = compactText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}.` : text;
};

const asReferenceItems = (entries = []) =>
  entries.map((entry) => {
    const pages = entry.verifiedPages?.length ? ` pags. ${entry.verifiedPages.join(', ')}` : '';
    return `${entry.shortReference}${pages}. ${entry.note ?? ''}`.trim();
  });

const shortAdjustment = (label, value) => (value ? `${label}: ${brief(value, 125)}` : null);

const maxDoseFrom = (value = '') => {
  const text = compactText(value);
  const match = text.match(/(?:máxim[ao]s?|hasta|sin sobrepasar)[^.;]*/i);
  return match ? brief(match[0].replace(/^hasta\s+/i, ''), 100) : null;
};

const medicationDetailItems = (medication) => {
  const avoid = medication.contraindications?.length
    ? medication.contraindications.slice(0, 2).map((item) => brief(item, 105)).join(' ')
    : null;
  const doseText = medication.contextDose ?? medication.dose;
  const maxDose = maxDoseFrom(doseText);

  return [
    `Fármaco: ${medication.name}`,
    doseText ? `Dosis: ${doseText}` : null,
    medication.contextRoute || medication.route ? `Vía: ${medication.contextRoute ?? medication.route}` : null,
    medication.contextFrequency || medication.frequency ? `Frecuencia: ${medication.contextFrequency ?? medication.frequency}` : null,
    medication.followUpPlan || medication.duration ? `Duración: ${brief(medication.followUpPlan ?? medication.duration, 130)}` : null,
    maxDose ? `Máximo: ${maxDose}` : null,
    avoid ? `Evitar: ${avoid}` : null,
    shortAdjustment('Ajuste renal', medication.renalAdjustment),
    shortAdjustment('Ajuste hepático', medication.hepaticAdjustment),
    medication.followUpPlan || medication.practicalNotes?.length
      ? `Reevaluar: ${brief(medication.followUpPlan ?? medication.practicalNotes[0], 130)}`
      : null,
  ].filter(Boolean);
};

const medicationNode = (medicationId) => {
  const medication = getMedication(medicationId);
  const doseSummary = medication.contextDose ?? medication.dose ?? medication.contextUse ?? medication.indication;

  return {
    id: `med-${medication.id}`,
    title: medication.name,
    type: 'treatment',
    summary: doseSummary,
    items: medicationDetailItems(medication),
    medication: medication.family,
  };
};

const calculatorNode = (calculatorId) => {
  const calculator = getCalculator(calculatorId);

  return {
    id: `calc-${calculatorId}`,
    title: calculator.title,
    type: 'calculator',
    summary: calculator.summary,
    calculatorId,
    action: `Calcular ${calculator.title}`,
  };
};

const treatmentCalculatorNodes = (protocol, calculators) => {
  if (protocol.id === 'fibrilacion-auricular') {
    const calculatorMap = {
      'cha2ds2-va': {
        id: 'riesgo-tromboembolico',
        title: 'Riesgo tromboembólico',
        summary: 'Decide indicación de anticoagulación.',
        severity: 'info',
      },
      'has-bled': {
        id: 'riesgo-hemorragico',
        title: 'Riesgo hemorrágico modificable',
        summary: 'Detecta factores corregibles antes y durante anticoagulación.',
        severity: 'warning',
      },
      'cockcroft-gault': {
        id: 'funcion-renal-anticoagulacion',
        title: 'Función renal para anticoagulación',
        summary: 'Ajusta elección o dosis cuando procede.',
        severity: 'info',
      },
    };

    return calculators.map((calculatorId) => {
      const meta = calculatorMap[calculatorId] ?? {
        id: `calculo-${calculatorId}`,
        title: getCalculator(calculatorId).title,
        summary: 'Abrir la calculadora concreta.',
        severity: 'info',
      };

      return {
        id: meta.id,
        title: meta.title,
        type: 'calculator',
        summary: meta.summary,
        severity: meta.severity,
        children: [calculatorNode(calculatorId)],
      };
    });
  }

  return [
    {
      id: 'calculos-tratamiento',
      title: 'Cálculos que cambian tratamiento',
      type: 'calculator',
      summary: 'Abrir la calculadora concreta desde el punto de decisión.',
      children: calculators.map(calculatorNode),
    },
  ];
};

const referencesSection = (protocol) => ({
  id: 'bibliografia',
  title: 'Bibliografía textual',
  type: 'references',
  children: [
    {
      id: 'fuentes',
      title: 'Fuentes usadas',
      type: 'references',
      references: asReferenceItems(protocol.bibliography),
    },
  ],
});

const definitionSection = (protocol) => ({
  id: 'que-es',
  title: PRIMARY_SECTION_TITLES.definition,
  type: 'section',
  summary: brief(protocol.summary, 130),
  maxInitialItems: 0,
  children: [
    {
      id: 'definicion',
      title: protocol.title,
      type: 'step',
      summary: brief(protocol.summary, 180),
      severity: 'info',
    },
  ],
});

const defaultOrders = (protocol) => {
  const checks = asArray(protocol.quickChecks);

  return {
    id: 'que-pido',
    title: PRIMARY_SECTION_TITLES.orders,
    type: 'section',
    summary: 'Pruebas iniciales y datos que orientan la conducta.',
    children: [
      {
        id: 'pruebas-iniciales',
        title: 'Pruebas iniciales',
        type: 'step',
        items: checks.length ? checks : ['Constantes, exploración dirigida y pruebas según sospecha clínica.'],
      },
    ],
  };
};

const defaultFindings = (protocol) => ({
  id: 'que-espero',
  title: PRIMARY_SECTION_TITLES.findings,
  type: 'section',
  summary: 'Hallazgos y puntos de decisión que cambian prioridad, tratamiento o destino.',
  children: [
    ...decisionNodes(protocol),
    ...(protocol.warnings?.length
      ? [
          {
            id: 'gravedad',
            title: 'Criterios de gravedad',
            type: 'alert',
            severity: 'warning',
            items: protocol.warnings,
          },
        ]
      : []),
  ],
});

const decisionNodes = (protocol) =>
  asArray(protocol.decisionCards).map((card) => ({
    id: card.id ?? slugify(card.situation),
    title: card.situation,
    type: card.id?.includes('destino') ? 'decision' : 'step',
    summary: card.action,
    items: asArray(card.nuance),
    severity: card.id?.includes('inestable') || card.id?.includes('critical') || card.id?.includes('unstable') ? 'danger' : 'info',
  }));

const cardiologyInterventionNodes = (protocol) => {
  if (protocol.id === 'fibrilacion-auricular') {
    return [
      {
        id: 'cardioversion-electrica-fa',
        title: 'Cardioversión eléctrica',
        type: 'treatment',
        severity: 'danger',
        summary: 'Urgente si inestabilidad; electiva solo si duración y anticoagulación lo permiten.',
        items: [
          'Indicación: hipotensión, shock, isquemia, edema pulmonar o mala perfusión atribuible a FA.',
          'Vía: eléctrica sincronizada con sedoanalgesia según protocolo local.',
          'Evitar: intoxicación digitálica; si toma digoxina, iniciar con menor energía según Murillo.',
          'Reevaluar: ritmo, PA, síntomas y plan anticoagulante tras la reversión.',
        ],
      },
      {
        id: 'cardioversion-farmacologica-fa',
        title: 'Cardioversión farmacológica',
        type: 'treatment',
        summary: 'Solo si estable y el contexto permite control de ritmo precoz.',
        items: [
          'Elegir según cardiopatía estructural, FEVI, duración del episodio y anticoagulación.',
          'Amiodarona IV queda disponible como pauta concreta en la tarjeta de tratamiento.',
          'No mezclar antiarrítmicos de clase I y III en el mismo momento.',
        ],
      },
    ];
  }

  if (protocol.id === 'sindrome-coronario-agudo') {
    return [
      {
        id: 'monitorizacion-sca',
        title: 'Monitorización inicial',
        type: 'step',
        summary: 'ECG, monitor, vía venosa y troponinas sin retrasar reperfusión si SCACEST.',
        items: [
          'ECG 12 derivaciones en los primeros 10 min y monitorización continua.',
          'Vía venosa, hemograma, bioquímica, coagulación y hs-cTn seriada si no hay SCACEST.',
          'No esperar troponina si ECG y clínica indican SCACEST o SCASEST de muy alto riesgo.',
        ],
      },
      {
        id: 'oxigeno-sca',
        title: 'Oxígeno',
        type: 'treatment',
        summary: 'Solo si hipoxemia, insuficiencia respiratoria o shock.',
        items: [
          'Indicación: SpO2 < 90%, dificultad respiratoria o shock.',
          'Vía: gafas nasales, Venturi o reservorio según necesidad clínica.',
          'Reevaluar: SatO2, trabajo respiratorio y necesidad de VNI/intubación si no mejora.',
        ],
      },
      {
        id: 'reperfusion-scacest',
        title: 'Reperfusión en SCACEST',
        type: 'decision',
        severity: 'danger',
        summary: 'ICP primaria si acceso en tiempo; fibrinólisis solo si procede y no hay contraindicación.',
        items: [
          'No esperar hs-cTn si SCACEST claro.',
          'Priorizar ICP primaria si puede realizarse en tiempo.',
          'Si no hay ICP en tiempo, valorar fibrinólisis con contraindicaciones revisadas; no se muestra dosis porque no está cargada como pauta auditada.',
        ],
      },
    ];
  }

  if (protocol.id === 'hta-urgencias') {
    return [
      {
        id: 'urgencia-hta-objetivo',
        title: 'Urgencia hipertensiva',
        type: 'decision',
        summary: 'Sin daño agudo de órgano diana: descenso gradual y tratamiento oral si procede.',
        items: [
          'Confirmar cifras, reposo y reevaluación.',
          'Evitar descensos bruscos o vía IV si no hay daño agudo de órgano.',
          'Reevaluar PA y clínica antes de alta; ajustar seguimiento ambulatorio.',
        ],
      },
      {
        id: 'emergencia-hta-objetivo',
        title: 'Emergencia hipertensiva',
        type: 'alert',
        severity: 'danger',
        summary: 'Daño agudo de órgano diana: ingreso, monitorización y perfusión IV titulada.',
        items: [
          'Monitorización continua y tratamiento IV de acción corta.',
          'Objetivo: reducción controlada, evitando caídas rápidas no monitorizadas.',
          'UCI/área monitorizada si daño neurológico, coronario, edema pulmonar, disección o fracaso renal agudo.',
        ],
      },
    ];
  }

  if (protocol.id === 'bradicardias') {
    return [
      {
        id: 'marcapasos-transcutaneo',
        title: 'Marcapasos transcutáneo',
        type: 'treatment',
        severity: 'danger',
        summary: 'Preparar si inestabilidad persistente o bloqueo avanzado.',
        items: [
          'Indicación: mala perfusión, síncope, isquemia, insuficiencia cardíaca o bloqueo AV de alto riesgo que no responde rápido.',
          'No retrasar por repetir atropina si el paciente sigue inestable.',
          'Avisar UCI/cardiología y preparar estimulación temporal si Mobitz II, BAV completo con QRS ancho o pausas > 3 s.',
        ],
      },
    ];
  }

  if (protocol.id === 'arritmias-ventriculares') {
    return [
      {
        id: 'tv-sin-pulso',
        title: 'TV/FV sin pulso',
        type: 'alert',
        severity: 'danger',
        summary: 'Desfibrilación inmediata y algoritmo de parada.',
        items: [
          'Iniciar RCP y desfibrilación según protocolo de soporte vital.',
          'Adrenalina y amiodarona pertenecen al algoritmo de parada; no se duplican aquí si no están cargadas como pauta auditada.',
        ],
      },
      {
        id: 'tv-pulso-inestable',
        title: 'TV con pulso inestable',
        type: 'treatment',
        severity: 'danger',
        summary: 'Cardioversión sincronizada urgente.',
        items: [
          'Indicación: shock, síncope, isquemia, edema pulmonar o deterioro.',
          'Si es polimórfica o no sincroniza, desfibrilar.',
          'Sedoanalgesia si no retrasa la electricidad y el paciente lo permite.',
        ],
      },
    ];
  }

  return [];
};

const genericTreatmentSection = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);
  const calculators = asArray(protocol.calculatorIds);
  const primaryCareGroup =
    protocol.id === 'hta-urgencias' ? medicationGroups.find((group) => group.title === 'Urgencia hipertensiva') : null;

  return {
    id: 'tratamiento',
    title: PRIMARY_SECTION_TITLES.treatment,
    type: 'section',
    summary: 'Pauta breve inicial; máximos, contraindicaciones, ajustes, alternativas y fuentes quedan en detalle.',
    children: [
      {
        id: 'tratamiento-urgencias',
        title: 'Pautas en Urgencias',
        type: 'treatment',
        summary: 'Fármacos y medidas concretas cuando están auditadas.',
        children: [
          ...cardiologyInterventionNodes(protocol),
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            type: 'treatment',
            summary: 'Abrir para ver fármacos y dosis.',
            children: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      ...(primaryCareGroup
        ? [
            {
              id: 'tratamiento-ap',
              title: 'Tratamiento en Atención Primaria',
              type: 'treatment',
              summary: 'Solo si no hay daño agudo de órgano diana y el paciente permite manejo ambulatorio.',
              children: [
                ...asArray(primaryCareGroup.medicationIds).map(medicationNode),
                {
                  id: 'reevaluar-derivar',
                  title: 'Reevaluar / derivar',
                  type: 'decision',
                  summary: 'Derivar si aparece daño de órgano diana, clínica de alarma, embarazo, mala respuesta o necesidad de vía IV.',
                  severity: 'warning',
                },
              ],
            },
          ]
        : []),
      ...(calculators.length ? treatmentCalculatorNodes(protocol, calculators) : []),
      ...(protocol.warnings?.length
        ? [
            {
              id: 'seguridad',
              title: 'Seguridad',
              type: 'alert',
              severity: 'warning',
              items: protocol.warnings,
            },
          ]
        : []),
    ],
  };
};

const genericFollowUpSection = (protocol) => ({
  id: 'seguimiento',
  title: PRIMARY_SECTION_TITLES.followUp,
  type: 'section',
  summary: 'Destino, observación, ingreso o seguimiento según gravedad y respuesta.',
  children: [
    {
      id: 'destino',
      title: 'Destino',
      type: 'decision',
      summary: 'Definir alta, observación, ingreso o unidad monitorizada según gravedad y respuesta.',
      items: [
        ...asArray(protocol.quickSummary).map((item) => `${item.title}: ${item.action}`),
        ...asArray(protocol.warnings).slice(0, 2),
      ],
      severity: 'success',
    },
  ],
});

const pneumoniaOrdersSection = (protocol) => ({
  id: 'que-pido',
  title: PRIMARY_SECTION_TITLES.orders,
  type: 'section',
  summary: 'Confirmar neumonía, gravedad y necesidad de microbiología o analítica.',
  children: [
    {
      id: 'clinica-constantes-imagen',
      title: 'Clínica, constantes e imagen',
      type: 'step',
      items: protocol.quickChecks.slice(0, 3),
    },
    {
      id: 'microbiologia-analitica',
      title: 'Analítica / microbiología',
      type: 'step',
      summary: 'Pedir solo si cambia conducta o hay gravedad.',
      items: [protocol.decisionCards[1]?.nuance].filter(Boolean),
    },
    {
      id: 'gravedad',
      title: 'Escalas de gravedad',
      type: 'scale',
      summary: protocol.decisionCards[2]?.action,
      children: protocol.calculatorIds.map(calculatorNode),
    },
  ],
});

const pneumoniaFindingsSection = (protocol) => ({
  id: 'que-espero',
  title: PRIMARY_SECTION_TITLES.findings,
  type: 'section',
  summary: 'Identificar gravedad, criterios de ingreso y situaciones donde el alta no es segura.',
  children: [
    {
      id: 'criterios-destino',
      title: 'Gravedad y destino',
      type: 'decision',
      summary: protocol.decisionCards[3]?.action,
      items: [protocol.decisionCards[3]?.nuance].filter(Boolean),
    },
    {
      id: 'alertas',
      title: 'No alta segura',
      type: 'alert',
      severity: 'warning',
      items: protocol.noDischargeCriteria,
    },
  ],
});

const pneumoniaTreatmentSection = (protocol) => ({
  id: 'tratamiento',
  title: PRIMARY_SECTION_TITLES.treatment,
  type: 'section',
  summary: 'Antibiótico inicial resumido; seguridad, escenarios y reevaluación quedan cerrados en detalle.',
  children: [
    {
      id: 'tratamiento-urgencias',
      title: 'Antibiótico inicial en Urgencias',
      type: 'treatment',
      summary: 'Elegir antibiótico por gravedad y revisar seguridad antes de prescribir.',
      children: [
        {
          id: 'seguridad-antibiotico',
          title: 'Antes de prescribir',
          type: 'alert',
          severity: 'warning',
          items: [protocol.warnings[0]],
        },
        ...protocol.antibioticPlan.map((item) => ({
          id: slugify(item.severity),
          title: item.severity,
          type: 'treatment',
          summary: brief(item.regimen, 190),
        })),
      ],
    },
    {
      id: 'tratamiento-ap',
      title: 'Tratamiento en Atención Primaria',
      type: 'treatment',
      summary: 'Aplicar solo en bajo riesgo con estabilidad y tolerancia oral.',
      items: [
        brief(protocol.antibioticPlan[0]?.regimen, 190),
        'Reevaluar/derivar: si empeora, no mejora en 72 h, disnea, fiebre persistente, confusión, intolerancia oral o deterioro general.',
      ].filter(Boolean),
      severity: 'success',
    },
  ],
});

const pneumoniaFollowUpSection = (protocol) => ({
  id: 'seguimiento',
  title: PRIMARY_SECTION_TITLES.followUp,
  type: 'section',
  summary: 'Destino y revisión según gravedad, estabilidad, tolerancia oral y criterios de no alta.',
  children: [
    {
      id: 'destino',
      title: 'Decisión de destino',
      type: 'decision',
      summary: protocol.decisionCards[3]?.action,
      items: [protocol.decisionCards[3]?.nuance].filter(Boolean),
      children: protocol.carePath.map((item) => ({
        id: slugify(item.title),
        title: item.title,
        type: item.title.includes('UCI') ? 'alert' : 'decision',
        summary: item.text,
        severity: item.title.includes('UCI') ? 'danger' : item.title.includes('Bajo') ? 'success' : 'info',
      })),
    },
    {
      id: 'alta-segura',
      title: 'Alta segura',
      type: 'decision',
      severity: 'success',
      items: protocol.noDischargeCriteria,
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      type: 'step',
      items: protocol.reassessment,
    },
  ],
});

const buildPneumoniaFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  sections: [
    definitionSection(protocol),
    pneumoniaOrdersSection(protocol),
    pneumoniaFindingsSection(protocol),
    pneumoniaTreatmentSection(protocol),
    pneumoniaFollowUpSection(protocol),
    referencesSection(protocol),
  ],
});

const guardiaFlow = (protocol) => {
  const guardia = protocol.guardia;

  return {
    id: protocol.id,
    title: protocol.longTitle ?? protocol.title,
    specialty: protocol.section,
    summary: brief(protocol.summary, 170),
    sections: [
      {
        id: 'que-es',
        title: PRIMARY_SECTION_TITLES.definition,
        type: 'section',
        summary: brief(guardia.clinica, 130),
        maxInitialItems: 0,
        children: [
          {
            id: 'clinica',
            title: protocol.title,
            type: 'step',
            summary: guardia.clinica,
            severity: 'warning',
          },
        ],
      },
      {
        id: 'que-pido',
        title: PRIMARY_SECTION_TITLES.orders,
        type: 'section',
        summary: 'Pruebas y datos de entrada para orientar el escenario de guardia.',
        children: [
          {
            id: 'pruebas',
            title: 'Pruebas',
            type: 'step',
            items: guardia.pruebas,
          },
        ],
      },
      {
        id: 'que-espero',
        title: PRIMARY_SECTION_TITLES.findings,
        type: 'section',
        summary: 'Diagnóstico probable y criterios de gravedad que obligan a escalar.',
        children: [
          {
            id: 'diagnostico',
            title: 'Hallazgos clave',
            type: 'decision',
            summary: guardia.diagnostico,
          },
          {
            id: 'alarmas',
            title: 'Criterios de gravedad',
            type: 'alert',
            severity: 'danger',
            items: guardia.alertas,
          },
        ],
      },
      {
        id: 'tratamiento',
        title: PRIMARY_SECTION_TITLES.treatment,
        type: 'section',
        summary: 'Medidas iniciales resumidas; datos previos, escalones y reevaluación quedan en detalle.',
        children: [
          {
            id: 'tratamiento-urgencias',
            title: 'Medidas en Urgencias',
            type: 'treatment',
            summary: guardia.tratamiento,
            children: [
              ...(guardia.datosTratamiento
                ? [
                    {
                      id: 'datos',
                      title: 'Datos antes de tratar',
                      type: 'step',
                      items: guardia.datosTratamiento,
                      severity: 'warning',
                    },
                  ]
                : []),
              ...asArray(guardia.tratamientoItems).map((item) => ({
                id: slugify(item.title),
                title: item.title,
                type: 'treatment',
                items: item.items,
                severity: item.tone === 'critical' ? 'danger' : item.tone === 'warning' ? 'warning' : 'info',
              })),
            ],
          },
        ],
      },
      {
        id: 'seguimiento',
        title: PRIMARY_SECTION_TITLES.followUp,
        type: 'section',
        summary: 'Destino y seguimiento según estabilidad, alarma y respuesta inicial.',
        children: [
          {
            id: 'destino',
            title: 'Destino',
            type: 'decision',
            summary: guardia.destino,
            items: guardia.destinoItems,
            severity: 'success',
          },
          {
            id: 'seguimiento',
            title: 'Seguimiento',
            type: 'step',
            items: guardia.seguimiento,
          },
          ...(guardia.simuladores
            ? [
                {
                  id: 'simuladores',
                  title: 'Simuladores extraabdominales',
                  type: 'alert',
                  severity: 'warning',
                  items: guardia.simuladores,
                },
              ]
            : []),
        ],
      },
      referencesSection(protocol),
    ],
  };
};

const genericFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  sections: [
    definitionSection(protocol),
    defaultOrders(protocol),
    defaultFindings(protocol),
    genericTreatmentSection(protocol),
    genericFollowUpSection(protocol),
    referencesSection(protocol),
  ],
});

const buildFlow = (protocol) => {
  if (protocol.id === 'neumonia-comunidad') {
    return buildPneumoniaFlow(protocol);
  }

  if (protocol.guardia) {
    return guardiaFlow(protocol);
  }

  return genericFlow(protocol);
};

export const protocolFlowCatalog = Object.fromEntries(
  protocolList
    .filter((protocol) => protocol.status === 'implementado')
    .map((protocol) => [protocol.id, buildFlow(protocol)]),
);

export const protocolFlowList = Object.values(protocolFlowCatalog);

export const getProtocolFlow = (protocolId) => protocolFlowCatalog[protocolId] ?? protocolFlowList[0];
