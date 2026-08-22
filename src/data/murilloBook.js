export const murilloBook = {
  application: 'NexoClx Urg',
  title: 'Urgencias Murillo 7a edicion',
  pdfFile: 'Urgencias Murillo 7ma.pdf',
  pdfPages: 1302,
  note: 'Referencia documental secundaria. Indica seccion, capitulo, pagina de libro y pagina PDF del Murillo original.',
  pageOffset: 4,
  resourceAvailable: false,
  unavailableReason: 'PDF no publicado en GitHub Pages por tamaño aproximado de 128 MB y potencial restriccion de redistribucion.',
  officialSourceUrl: 'https://shop.elsevier.com/books/medicina-de-urgencias-y-emergencias/montero-perez/978-84-1382-004-0',
  officialSourceLabel: 'Ficha editorial oficial Elsevier',
};

const c = (section, chapter, title, bookPage, moduleIds = []) => ({
  section,
  chapter,
  title,
  bookPage,
  pdfPage: bookPage + murilloBook.pageOffset,
  moduleIds,
});

export const murilloIndex = [
  c('I. Soporte vital y tecnicas iniciales', 1, 'Soporte vital basico en adultos', 2, ['pcr-adulto', 'rcp']),
  c('I. Soporte vital y tecnicas iniciales', 2, 'Soporte vital avanzado en adultos', 7, ['pcr-adulto', 'abcde', 'rcp']),
  c('II. Pruebas y procedimientos de urgencias', 8, 'Gasometria, pulsioximetria y capnografia', 64, ['acido-base', 'disnea']),
  c('II. Pruebas y procedimientos de urgencias', 9, 'Electrocardiografia de urgencias', 71, ['dolor-toracico', 'sca', 'arritmias']),
  c('II. Pruebas y procedimientos de urgencias', 12, 'Ecografia', 117, ['ecografia-clinica', 'shock', 'trauma-grave']),
  c('IV. Urgencias cardiovasculares', 18, 'Shock', 154, ['shock', 'abcde', 'sepsis']),
  c('IV. Urgencias cardiovasculares', 19, 'Insuficiencia cardiaca', 161, ['ica-eap']),
  c('IV. Urgencias cardiovasculares', 20, 'Edema agudo de pulmon cardiogenico', 167, ['ica-eap', 'disnea', 'vmni-srni']),
  c('IV. Urgencias cardiovasculares', 21, 'Arritmias cardiacas: estrategia diagnostica y tratamiento general', 171, ['arritmias']),
  c('IV. Urgencias cardiovasculares', 23, 'Fibrilacion y fluter auriculares', 184, ['arritmias']),
  c('IV. Urgencias cardiovasculares', 25, 'Dolor toracico agudo', 207, ['dolor-toracico']),
  c('IV. Urgencias cardiovasculares', 26, 'Sindrome coronario agudo', 214, ['sca', 'codigo-iam', 'hemodinamica']),
  c('IV. Urgencias cardiovasculares', 27, 'Sindrome aortico agudo', 228, ['sindrome-aortico']),
  c('IV. Urgencias cardiovasculares', 32, 'Urgencia hipertensiva', 253, ['hta-urgencias']),
  c('IV. Urgencias cardiovasculares', 33, 'Emergencia hipertensiva', 257, ['hta-urgencias']),
  c('V. Urgencias respiratorias', 37, 'Disnea aguda', 268, ['disnea']),
  c('V. Urgencias respiratorias', 39, 'Tromboembolia pulmonar', 277, ['tep']),
  c('V. Urgencias respiratorias', 40, 'Ataque de asma', 287, ['asma-epoc']),
  c('V. Urgencias respiratorias', 41, 'EPOC agudizada', 293, ['asma-epoc']),
  c('V. Urgencias respiratorias', 42, 'Neumonia adquirida en la comunidad', 300, ['neumonia']),
  c('VI. Urgencias digestivas', 48, 'Hemorragia digestiva alta', 327, ['hemorragia-digestiva']),
  c('VI. Urgencias digestivas', 50, 'Dolor abdominal agudo', 340, ['dolor-abdominal']),
  c('VI. Urgencias digestivas', 54, 'Pancreatitis aguda', 376, ['pancreatitis-hepatobiliar']),
  c('IX. Urgencias neurologicas', 59, 'Cefalea', 404, ['cefalea']),
  c('IX. Urgencias neurologicas', 61, 'Sincope', 421, ['sincope']),
  c('IX. Urgencias neurologicas', 62, 'Coma', 430, ['coma']),
  c('IX. Urgencias neurologicas', 63, 'Crisis epilepticas', 439, ['crisis-epileptica']),
  c('IX. Urgencias neurologicas', 64, 'Ictus', 449, ['ictus', 'codigo-ictus', 'neurointervencionismo']),
  c('IX. Urgencias neurologicas', 66, 'Meningitis y encefalitis', 472, ['meningitis-encefalitis']),
  c('X. Urgencias psiquiatricas', 69, 'Agitacion psicomotriz', 510, ['agitacion', 'contencion']),
  c('X. Urgencias psiquiatricas', 71, 'Riesgo suicida', 525, ['riesgo-suicida', 'psiquiatria']),
  c('XI. Urgencias endocrinometabolicas', 72, 'Hipoglucemia', 536, ['glucemia']),
  c('XI. Urgencias endocrinometabolicas', 77, 'Cetoacidosis diabetica y situacion hiperosmolar', 573, ['cad-ehh']),
  c('XI. Urgencias endocrinometabolicas', 83, 'Hiponatremia', 612, ['electrolitos']),
  c('XI. Urgencias endocrinometabolicas', 84, 'Hipernatremia', 619, ['electrolitos', 'deficit-agua']),
  c('XI. Urgencias endocrinometabolicas', 85, 'Hiperpotasemia', 625, ['electrolitos']),
  c('XI. Urgencias endocrinometabolicas', 93, 'Hipomagnesemia e hipermagnesemia', 671, ['electrolitos']),
  c('XII. Urgencias nefrourologicas', 94, 'Insuficiencia renal aguda', 676, ['renal-urologia']),
  c('XII. Urgencias nefrourologicas', 95, 'Enfermedad renal cronica', 684, ['renal-urologia']),
  c('XIV. Urgencias infecciosas', 107, 'Sindrome febril', 762, ['infecciones-especiales']),
  c('XIV. Urgencias infecciosas', 108, 'Sepsis', 770, ['sepsis', 'codigo-sepsis']),
  c('XIV. Urgencias infecciosas', 124, 'Antibioterapia en Urgencias', 860, ['sepsis', 'neumonia', 'infecciones-especiales']),
  c('XV. Hematologia y anticoagulacion', 128, 'Tratamiento del paciente anticoagulado', 894, ['hemorragia-digestiva', 'tce', 'arritmias']),
  c('XXI. Alergia y piel', 189, 'Urticaria y angioedema', 1112, ['piel-alergia']),
  c('XXI. Alergia y piel', 190, 'Anafilaxia', 1117, ['piel-alergia']),
  c('XXIII. Toxicologia', 204, 'Intoxicaciones', 1192, ['toxicologia', 'descontaminacion']),
  c('XXIV. Procedimientos y soporte', 214, 'Analgesia y sedacion en Urgencias', 1264, ['analgesia-sedacion', 'sedacion', 'intubacion-isr']),
  c('XXIV. Procedimientos y soporte', 216, 'Ventilacion mecanica no invasiva', 1280, ['vmni', 'vmni-srni']),
  c('XXIV. Procedimientos y soporte', 218, 'Donante potencial', 1294, ['donante-potencial']),
];

const primaryReferenceChapters = {
  disnea: 37,
  'renal-urologia': 94,
  'dolor-toracico': 25,
  sca: 26,
  sepsis: 108,
  arritmias: 23,
  electrolitos: 85,
  'ica-eap': 20,
  tep: 39,
  ictus: 64,
};

const entryToReference = (moduleId, entry) => ({
  application: murilloBook.application,
  moduleId,
  book: murilloBook.title,
  section: entry.section,
  chapter: entry.title,
  chapterNumber: entry.chapter,
  printedPage: entry.bookPage,
  pdfPage: entry.pdfPage,
  pdfFile: murilloBook.pdfFile,
  resource: null,
  resourceAvailable: murilloBook.resourceAvailable,
  unavailableReason: murilloBook.unavailableReason,
  officialSourceUrl: murilloBook.officialSourceUrl,
});

export const moduleBookReferences = murilloIndex.reduce((references, entry) => {
  entry.moduleIds.forEach((moduleId) => {
    const reference = entryToReference(moduleId, entry);
    const isPrimary = primaryReferenceChapters[moduleId] === entry.chapter;

    if (!references[moduleId] || isPrimary) {
      if (references[moduleId]) {
        reference.relatedReferences = [references[moduleId], ...(references[moduleId].relatedReferences ?? [])];
      }
      references[moduleId] = reference;
    } else {
      references[moduleId].relatedReferences = [...(references[moduleId].relatedReferences ?? []), reference];
    }
  });

  return references;
}, {});

export const getMurilloEntriesForItem = (itemId) => murilloIndex.filter((entry) => entry.moduleIds.includes(itemId));

export const bibliographicReferenceShape = {
  application: 'NexoClx AP | NexoClx Ped | NexoClx Urg | NexoClx 061',
  moduleId: 'module-id',
  book: 'Titulo de la fuente',
  chapter: 'Capitulo fuente',
  chapterNumber: 'numero-capitulo',
  printedPage: 'pagina impresa',
  pdfPage: 'pagina PDF',
  resource: 'URL autorizada o null',
  resourceAvailable: false,
};
