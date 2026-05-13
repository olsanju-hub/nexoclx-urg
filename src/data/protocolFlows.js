import { getCalculator } from './calculators';
import { getMedication } from './medications';
import { protocolList } from './protocols';

const PRIMARY_SECTION_TITLES = {
  diagnosis: 'Diagnóstico / Pruebas Dx',
  treatment: 'Tratamiento',
  followUp: 'Seguimiento / destino',
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

const firstSentence = (value = '') => compactText(value).split('. ')[0]?.replace(/\.$/, '') ?? '';

const asReferenceItems = (entries = []) =>
  entries.map((entry) => {
    const pages = entry.verifiedPages?.length ? ` pags. ${entry.verifiedPages.join(', ')}` : '';
    return `${entry.shortReference}${pages}. ${entry.note ?? ''}`.trim();
  });

const medicationDetailItems = (medication) =>
  [
    `Fármaco: ${medication.name}`,
    medication.contextDose || medication.dose ? `Dosis: ${medication.contextDose ?? medication.dose}` : null,
    medication.contextRoute || medication.route ? `Vía: ${medication.contextRoute ?? medication.route}` : null,
    medication.contextFrequency || medication.frequency ? `Frecuencia: ${medication.contextFrequency ?? medication.frequency}` : null,
    medication.followUpPlan || medication.duration ? `Duración/plan: ${medication.followUpPlan ?? medication.duration}` : null,
    medication.contraindications?.length ? `Evitar: ${medication.contraindications.slice(0, 2).join(' ')}` : null,
    medication.renalAdjustment ? `Ajuste renal: ${medication.renalAdjustment}` : null,
    medication.hepaticAdjustment ? `Ajuste hepático: ${medication.hepaticAdjustment}` : null,
  ].filter(Boolean);

const medicationNode = (medicationId) => {
  const medication = getMedication(medicationId);

  return {
    id: `med-${medication.id}`,
    title: medication.name,
    type: 'treatment',
    summary: medication.contextUse ?? medication.indication,
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

const diagnosisSection = (protocol) => ({
  id: 'diagnostico',
  title: PRIMARY_SECTION_TITLES.diagnosis,
  type: 'section',
  initiallyOpen: true,
  children: [
    {
      id: 'entrada',
      title: 'Entrada rápida',
      type: 'step',
      summary: protocol.summary,
      items: asArray(protocol.quickChecks),
      severity: 'info',
      initiallyOpen: true,
    },
    ...(protocol.calculatorIds?.length
      ? [
          {
            id: 'calculos-diagnosticos',
            title: 'Escalas / calculadoras',
            type: 'scale',
            summary: 'Usar solo cuando cambia la conducta.',
            children: protocol.calculatorIds.map(calculatorNode),
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

const genericTreatmentSection = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);
  const calculators = asArray(protocol.calculatorIds);
  const primaryCareGroup =
    protocol.id === 'hta-urgencias' ? medicationGroups.find((group) => group.title === 'Urgencia hipertensiva') : null;

  return {
    id: 'tratamiento',
    title: PRIMARY_SECTION_TITLES.treatment,
    type: 'section',
    initiallyOpen: true,
    children: [
      {
        id: 'tratamiento-urgencias',
        title: 'Tratamiento en Urgencias',
        type: 'treatment',
        summary: firstSentence(protocol.summary),
        children: [
          ...decisionNodes(protocol),
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            type: 'treatment',
            summary: 'Pauta concreta auditada dentro del protocolo.',
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
      ...(calculators.length
        ? [
            {
              id: 'calculos-tratamiento',
              title: 'Cálculos que cambian tratamiento',
              type: 'calculator',
              summary: 'Abrir la calculadora concreta desde el nodo.',
              children: calculators.map(calculatorNode),
            },
          ]
        : []),
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
  initiallyOpen: true,
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

const pneumoniaTreatmentSection = (protocol) => ({
  id: 'tratamiento',
  title: PRIMARY_SECTION_TITLES.treatment,
  type: 'section',
  initiallyOpen: true,
  children: [
    {
      id: 'tratamiento-urgencias',
      title: 'Tratamiento en Urgencias',
      type: 'treatment',
      summary: 'Elegir antibiótico por gravedad y revisar seguridad antes de prescribir.',
      children: [
        {
          id: 'seguridad-antibiotico',
          title: 'Antes de prescribir',
          type: 'alert',
          severity: 'warning',
          items: [protocol.warnings[0]],
          initiallyOpen: true,
        },
        ...protocol.antibioticPlan.map((item) => ({
          id: slugify(item.severity),
          title: item.severity,
          type: 'treatment',
          summary: item.regimen,
        })),
      ],
    },
    {
      id: 'tratamiento-ap',
      title: 'Tratamiento en Atención Primaria',
      type: 'treatment',
      summary: 'Aplicar solo en bajo riesgo con estabilidad y tolerancia oral.',
      items: [
        protocol.antibioticPlan[0]?.regimen,
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
  initiallyOpen: true,
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
  summary: protocol.summary,
  sections: [
    {
      ...diagnosisSection(protocol),
      children: [
        ...diagnosisSection(protocol).children,
        {
          id: 'gravedad',
          title: 'CRB-65 / CURB-65',
          type: 'scale',
          summary: protocol.decisionCards[2]?.action,
          items: [protocol.decisionCards[2]?.nuance].filter(Boolean),
          children: protocol.calculatorIds.map(calculatorNode),
        },
      ],
    },
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
    summary: protocol.summary,
    sections: [
      {
        id: 'diagnostico',
        title: PRIMARY_SECTION_TITLES.diagnosis,
        type: 'section',
        initiallyOpen: true,
        children: [
          {
            id: 'clinica',
            title: 'Clínica',
            type: 'step',
            summary: guardia.clinica,
            severity: 'warning',
          },
          {
            id: 'diagnostico',
            title: 'Diagnóstico',
            type: 'decision',
            summary: guardia.diagnostico,
          },
          {
            id: 'pruebas',
            title: 'Pruebas',
            type: 'step',
            items: guardia.pruebas,
          },
        ],
      },
      {
        id: 'tratamiento',
        title: PRIMARY_SECTION_TITLES.treatment,
        type: 'section',
        initiallyOpen: true,
        children: [
          {
            id: 'tratamiento-urgencias',
            title: 'Tratamiento en Urgencias',
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
        initiallyOpen: true,
        children: [
          {
            id: 'alarmas',
            title: 'Alarmas',
            type: 'alert',
            severity: 'danger',
            items: guardia.alertas,
          },
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
  summary: protocol.summary,
  sections: [
    diagnosisSection(protocol),
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
