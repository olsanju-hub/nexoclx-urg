import { decisionProtocols } from './decisionProtocols.js';

export const placeholderProtocols = [
  {
    id: 'hta-urgencias',
    title: 'HTA en Urgencias',
    description: 'Daño orgánico, tratamiento inicial y destino.',
    status: 'Interactivo',
  },
  ...decisionProtocols,
];
