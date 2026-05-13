import { getProtocol } from './protocols';

const pneumoniaProtocol = getProtocol('neumonia-comunidad');

const asReferenceItems = (entries = []) =>
  entries.map((entry) => {
    const pages = entry.verifiedPages?.length ? ` pags. ${entry.verifiedPages.join(', ')}` : '';
    return `${entry.shortReference}${pages}. ${entry.note ?? ''}`.trim();
  });

export const protocolFlowCatalog = {
  'neumonia-comunidad': {
    id: 'neumonia-comunidad',
    title: pneumoniaProtocol.longTitle ?? pneumoniaProtocol.title,
    specialty: pneumoniaProtocol.section,
    summary: pneumoniaProtocol.summary,
    sections: [
      {
        id: 'diagnostico',
        title: 'Diagnostico / Pruebas Dx',
        type: 'section',
        initiallyOpen: true,
        children: [
          {
            id: 'sospecha',
            title: 'Sospecha y entrada',
            type: 'step',
            summary: pneumoniaProtocol.decisionCards[0].action,
            items: [
              pneumoniaProtocol.decisionCards[0].nuance,
              ...pneumoniaProtocol.quickChecks.slice(0, 3),
            ],
            severity: 'warning',
            initiallyOpen: true,
          },
          {
            id: 'confirmacion',
            title: 'Confirmacion diagnostica',
            type: 'decision',
            summary: pneumoniaProtocol.decisionCards[1].action,
            items: [pneumoniaProtocol.decisionCards[1].nuance],
            initiallyOpen: true,
          },
          {
            id: 'gravedad',
            title: 'Gravedad',
            type: 'scale',
            summary: pneumoniaProtocol.decisionCards[2].action,
            items: [pneumoniaProtocol.decisionCards[2].nuance],
            calculatorId: 'crb-65',
            action: 'Abrir CRB-65 / CURB-65 desde Calculos',
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento en Urgencias',
        type: 'section',
        initiallyOpen: true,
        children: [
          {
            id: 'seguridad-antibiotico',
            title: 'Antes de prescribir',
            type: 'alert',
            severity: 'warning',
            items: [pneumoniaProtocol.warnings[0]],
            initiallyOpen: true,
          },
          ...pneumoniaProtocol.antibioticPlan.map((item) => ({
            id: item.severity.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: item.severity,
            type: 'treatment',
            summary: item.regimen,
            medication: 'Antibiotico segun escenario clinico auditado en el protocolo NAC',
          })),
          {
            id: 'reevaluacion-iv',
            title: 'Reevaluacion',
            type: 'step',
            items: pneumoniaProtocol.reassessment.slice(0, 3),
            severity: 'info',
          },
        ],
      },
      {
        id: 'seguimiento',
        title: 'Seguimiento / destino',
        type: 'section',
        initiallyOpen: true,
        children: [
          {
            id: 'destino',
            title: 'Decision de destino',
            type: 'decision',
            summary: pneumoniaProtocol.decisionCards[3].action,
            items: [pneumoniaProtocol.decisionCards[3].nuance],
            severity: 'info',
            initiallyOpen: true,
            children: pneumoniaProtocol.carePath.map((item) => ({
              id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
            items: pneumoniaProtocol.noDischargeCriteria,
          },
          {
            id: 'seguimiento',
            title: 'Seguimiento',
            type: 'step',
            items: pneumoniaProtocol.reassessment.slice(3),
          },
        ],
      },
      {
        id: 'bibliografia',
        title: 'Bibliografia textual',
        type: 'references',
        children: [
          {
            id: 'fuentes',
            title: 'Fuentes usadas',
            type: 'references',
            references: asReferenceItems(pneumoniaProtocol.bibliography),
          },
        ],
      },
    ],
  },
};

export const protocolFlowList = Object.values(protocolFlowCatalog);

export const getProtocolFlow = (protocolId) => protocolFlowCatalog[protocolId] ?? protocolFlowList[0];
