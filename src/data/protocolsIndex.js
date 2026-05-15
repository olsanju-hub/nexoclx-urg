/**
 * Protocolos médicos consolidados - Versión simplificada
 * Mínima información esencial sin relleno
 * Estructura: definición + órdenes + hallazgos + tratamiento + seguimiento + redFlags + notas
 */

import { allProtocols as part1Protocols } from './protocolsSimplified';
import { allProtocolsPartTwo as part2Protocols } from './protocolsSimplified2';

const allProtocols = {
  ...part1Protocols,
  ...part2Protocols,
};

export const getProtocol = (id) => allProtocols[id] || null;

export const protocolsBySpecialty = {
  Cardiología: [
    'crisis-hipertensiva',
    'sincope',
    'fibrilacion-auricular',
    'sindrome-coronario-agudo',
    'insuficiencia-cardiaca-aguda',
    'sindrome-cardiorrenal',
    'taquicardias-ecg-dependientes',
    'bradicardias-ecg-dependientes',
  ],
  Respiratorio: [
    'neumonia',
    'epoc-exacerbacion',
    'asma-exacerbacion',
    'tromboembolia-pulmonar',
    'derrame-pleural',
    'insuficiencia-respiratoria-aguda',
  ],
  Neurología: [
    'ictus-agudo',
    'cefalea-banderas-rojas',
    'crisis-convulsiva',
    'epilepsia-seguimiento',
    'encefalitis-infeccion-snc',
    'traumatismo-craneoencefalico-antiagregado',
    'migraña',
  ],
  Digestivo: [
    'cuerpo-extrano-vias-digestivas',
    'diarrea-aguda',
    'hepatitis-aguda',
    'complicaciones-eim-crohn-colitis',
    'helicobacter-pylori',
    'fisura-anal',
    'hemorroides',
  ],
  Nefrología: [
    'insuficiencia-renal-aguda',
    'enfermedad-renal-cronica-reagudizada',
    'hiponatremia',
    'hipernatremia',
    'hipopotasemia',
    'hiperpotasemia',
    'hipocalcemia',
    'hipercalcemia',
    'hipomagnesemia',
    'hipermagnesemia',
    'rabdomiolisis',
    'colico-renal',
  ],
  Endocrinología: [
    'cetoacidosis-diabetica',
    'complicaciones-agudas-diabetes',
    'urgencias-tiroideas',
  ],
  ORL: [
    'absceso-periamigdalino',
    'otitis',
  ],
  Oftalmología: [
    'traumatismo-ocular',
    'cuerpo-extrano-ocular',
    'glaucoma-agudo',
    'uveitis-anterior',
    'ulcera-corneal',
    'desprendimiento-retina',
    'disminucion-agudeza-visual',
    'dacriocistitis-aguda',
    'blefaritis',
    'orzuelo',
    'chalazion',
    'epiescleritis',
    'hiposfagma',
  ],
  Ginecología: [
    'sangrado-primer-trimestre',
    'infeccion-vaginal-aguda',
    'sifilis',
    'infecciones-agudas-ets',
  ],
  Pediatría: [
    'bronquiolitis',
    'laringo-traqueitis',
  ],
  Toxicología: [
    'intoxicacion-alcohol',
    'intoxicacion-opioides',
    'intoxicacion-monoxido-carbono',
  ],
  Dermatología: [
    'escabiosis',
    'angioedema',
  ],
};

export const specialties = Object.keys(protocolsBySpecialty);
