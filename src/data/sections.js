import {
  BookOpen,
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
  context: 'Urgencias hospitalarias',
  icon: `${import.meta.env.BASE_URL}icons/app-icon-192.png`,
  accent: '#0a84ff',
  homeVariant: 'standard',
};

export const primarySections = [
  {
    id: routes.protocols,
    title: 'Protocolos',
    description: 'Guías clínicas para atención urgente.',
    icon: FileText,
  },
  {
    id: routes.tools,
    title: 'Herramientas',
    description: 'Priorización y pruebas urgentes.',
    icon: Calculator,
  },
  {
    id: routes.procedures,
    title: 'Procedimientos',
    description: 'Técnicas y flujos asistenciales.',
    icon: Stethoscope,
  },
  {
    id: routes.sources,
    title: 'Fuentes',
    description: 'Guías y documentos consultados.',
    icon: BookOpen,
  },
];

export const secondarySections = [
  { id: routes.protocols, title: 'Protocolos', description: 'Guías clínicas para atención urgente.', icon: FolderOpen },
  { id: routes.tools, title: 'Herramientas', description: 'Priorización y pruebas urgentes.', icon: Wrench },
  { id: routes.procedures, title: 'Procedimientos', description: 'Técnicas y flujos asistenciales.', icon: Stethoscope },
  { id: routes.sources, title: 'Fuentes', description: 'Guías y documentos consultados.', icon: Library },
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
  { id: routes.sources, label: 'Fuentes' },
];

export const sectionIcons = {
  [routes.procedures]: Stethoscope,
  [routes.circuits]: Route,
};
