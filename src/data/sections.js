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
  icon: '/icons/app-icon-192.png',
  accent: '#0a84ff',
};

export const primarySections = [
  {
    id: routes.protocols,
    title: 'Protocolos',
    description: 'Gravedad, observacion y alta.',
    icon: FileText,
  },
  {
    id: routes.tools,
    title: 'Herramientas',
    description: 'Ayudas urgentes pendientes.',
    icon: Calculator,
  },
  {
    id: routes.procedures,
    title: 'Procedimientos',
    description: 'Tecnicas pendientes.',
    icon: Stethoscope,
  },
  {
    id: routes.sources,
    title: 'Fuentes',
    description: 'Fuentes pendientes.',
    icon: BookOpen,
  },
];

export const secondarySections = [
  { id: routes.protocols, title: 'Protocolos', description: 'Listado estructural no operativo.', icon: FolderOpen },
  { id: routes.tools, title: 'Herramientas', description: 'Sin formulas clinicas activas.', icon: Wrench },
  { id: routes.procedures, title: 'Procedimientos', description: 'Sin pasos clinicos activos.', icon: Stethoscope },
  { id: routes.sources, title: 'Fuentes', description: 'Pendiente de fuentes.', icon: Library },
];

export const bottomNavItems = [
  { id: routes.home, label: 'Inicio', icon: HeartPulse },
  { id: routes.protocols, label: 'Protocolos', icon: FileText },
  { id: routes.tools, label: 'Herramientas', icon: Calculator },
  { id: routes.more, label: 'Mas', icon: MoreHorizontal },
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
