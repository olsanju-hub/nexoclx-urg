import {
  Calculator,
  FileText,
  FolderOpen,
  HeartPulse,
  Library,
  MoreHorizontal,
  Route,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { routes } from '../app/routes.js';

export const appConfig = {
  name: 'NexoClx Urg',
  context: 'Asistente clinico rapido para guardia hospitalaria',
  icon: `${import.meta.env.BASE_URL}icons/app-icon-192.png`,
  accent: '#0a84ff',
  homeVariant: 'balanced-five',
};

export const primarySections = [
  {
    id: routes.protocols,
    title: 'Protocolos',
    description: '54 protocolos por motivo, sindrome, gravedad y destino.',
    icon: FileText,
  },
  {
    id: routes.tools,
    title: 'Herramientas',
    description: 'Escalas y calculos que cambian conducta.',
    icon: Calculator,
  },
  {
    id: routes.procedures,
    title: 'Procedimientos',
    description: 'Secuencias practicas para boxes y criticos.',
    icon: Stethoscope,
  },
  {
    id: routes.circuits,
    title: 'Circuitos',
    description: 'IAM, ictus, sepsis, trauma, UCI y especialistas.',
    icon: Route,
  },
  {
    id: routes.sources,
    title: 'Fuentes',
    description: 'Murillo como mapa y guias vigentes como clinica.',
    icon: Library,
  },
];

export const secondarySections = [
  { id: routes.procedures, title: 'Procedimientos', description: 'Secuencias practicas.', icon: Stethoscope },
  { id: routes.circuits, title: 'Circuitos', description: 'Activacion y destino.', icon: Route },
  { id: routes.sources, title: 'Fuentes', description: 'Trazabilidad clinica.', icon: Library },
];

export const bottomNavItems = [
  { id: routes.home, label: 'Inicio', icon: HeartPulse },
  { id: routes.protocols, label: 'Protocolos', icon: FileText },
  { id: routes.tools, label: 'Herramientas', icon: Calculator },
  { id: routes.more, label: 'Más', icon: MoreHorizontal },
];

export const desktopNavItems = [
  { id: routes.protocols, label: 'Protocolos' },
  { id: routes.tools, label: 'Herramientas' },
  { id: routes.procedures, label: 'Procedimientos' },
  { id: routes.circuits, label: 'Circuitos' },
  { id: routes.sources, label: 'Fuentes' },
];

export const sectionIcons = {
  [routes.procedures]: Stethoscope,
  [routes.circuits]: Route,
  [routes.sources]: Library,
};
