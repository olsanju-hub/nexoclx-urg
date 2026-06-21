export const placeholderProtocols = [
  {
    id: 'pendiente-validacion',
    title: 'Contenido pendiente de validacion',
    description: 'Este espacio no contiene recomendaciones clinicas operativas.',
    status: 'No operativo',
  },
  {
    id: 'fuentes-pendientes',
    title: 'Fuentes pendientes',
    description: 'Los protocolos se activaran solo con bibliografia aportada y revisada.',
    status: 'Pendiente',
  },
  {
    id: 'estructura-clinica',
    title: 'Estructura preparada',
    description: 'Listado listo para ordenar contenido validado por contexto asistencial.',
    status: 'Plantilla',
  },
];

export const placeholderBlocks = [
  {
    title: 'Uso clinico',
    body: 'Pantalla preparada para contenido util una vez exista bibliografia validada. No incluye criterios, tratamientos ni dosis.',
  },
  {
    title: 'Herramientas relacionadas',
    body: 'No hay herramientas activas. Las calculadoras requieren formula, fuente y revision antes de mostrarse.',
  },
];

export const placeholderSources = [
  'Pendiente de bibliografia validada.',
  'Pendiente de fecha de revision.',
];
