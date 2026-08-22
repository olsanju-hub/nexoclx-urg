export const murilloBook = {
  application: 'NexoClx Urg',
  title: 'Urgencias Murillo 7a edicion',
  pdfFile: 'Urgencias Murillo 7ma.pdf',
  pdfPages: 1302,
  note: 'Referencia documental secundaria. Permite consultar el capitulo fuente sin sustituir al protocolo clinico.',
  pageOffset: 25,
  resourceBasePath: 'murillo',
  resourceType: 'chapter-pdf',
  resourceAvailable: true,
};

const slugify = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 70);

const chapterStartPages = {
  1: 2,
  2: 7,
  3: 14,
  8: 64,
  9: 71,
  10: 83,
  12: 108,
  13: 117,
  18: 154,
  19: 161,
  20: 167,
  21: 171,
  22: 177,
  23: 184,
  24: 202,
  25: 207,
  26: 214,
  27: 228,
  28: 231,
  32: 246,
  33: 249,
  34: 253,
  37: 268,
  38: 273,
  39: 277,
  40: 287,
  41: 293,
  42: 300,
  43: 305,
  48: 327,
  49: 336,
  50: 340,
  51: 358,
  54: 376,
  55: 383,
  59: 404,
  60: 416,
  61: 422,
  62: 428,
  63: 435,
  64: 442,
  65: 454,
  66: 462,
  67: 477,
  69: 492,
  70: 498,
  71: 502,
  72: 508,
  75: 528,
  76: 531,
  77: 535,
  78: 539,
  84: 564,
  85: 569,
  86: 573,
  87: 576,
  88: 579,
  89: 581,
  90: 583,
  94: 596,
  95: 601,
  96: 604,
  107: 640,
  108: 647,
  109: 651,
  124: 738,
  125: 742,
  128: 760,
  129: 764,
  130: 776,
  131: 784,
  149: 851,
  150: 858,
  154: 872,
  155: 880,
  180: 978,
  181: 994,
  189: 1054,
  190: 1056,
  191: 1062,
  204: 1126,
  205: 1131,
  206: 1133,
  207: 1136,
  213: 1176,
  214: 1183,
  215: 1190,
  216: 1216,
  217: 1229,
  218: 1257,
  219: 1261,
};

const getNextKnownChapterStart = (chapter) => {
  const nextChapter = Object.keys(chapterStartPages)
    .map(Number)
    .sort((a, b) => a - b)
    .find((candidate) => candidate > chapter);

  return nextChapter ? chapterStartPages[nextChapter] : 1270;
};

const c = (section, chapter, title, bookPage, moduleIds = []) => ({
  section,
  chapter,
  title,
  bookPage,
  pdfPage: bookPage + murilloBook.pageOffset,
  endBookPage: getNextKnownChapterStart(chapter) - 1,
  endPdfPage: getNextKnownChapterStart(chapter) - 1 + murilloBook.pageOffset,
  resource: `${murilloBook.resourceBasePath}/cap-${String(chapter).padStart(3, '0')}-${slugify(title)}.pdf`,
  resourceType: murilloBook.resourceType,
  resourceAvailable: murilloBook.resourceAvailable,
  moduleIds,
});

export const murilloIndex = [
  c('I. Soporte vital', 1, 'Soporte vital basico en adultos', 2, ['pcr-adulto', 'rcp']),
  c('I. Soporte vital', 2, 'Soporte vital avanzado en adultos', 7, ['pcr-adulto', 'abcde', 'rcp']),
  c('II. Exploraciones complementarias en medicina de urgencias', 8, 'Gasometria, pulsioximetria y capnografia', 64, ['acido-base', 'disnea']),
  c('II. Exploraciones complementarias en medicina de urgencias', 9, 'Electrocardiografia de urgencias', 71, ['dolor-toracico', 'sca', 'arritmias']),
  c('II. Exploraciones complementarias en medicina de urgencias', 12, 'Ecografia', 108, ['ecografia-clinica', 'shock', 'trauma-grave']),
  c('III. Urgencias cardiovasculares', 18, 'Shock', 154, ['shock', 'abcde', 'sepsis']),
  c('III. Urgencias cardiovasculares', 19, 'Insuficiencia cardiaca', 161, ['ica-eap']),
  c('III. Urgencias cardiovasculares', 20, 'Edema agudo de pulmon cardiogenico', 167, ['ica-eap', 'disnea', 'vmni-srni']),
  c('III. Urgencias cardiovasculares', 21, 'Arritmias cardiacas: estrategia diagnostica y tratamiento general', 171, ['arritmias']),
  c('III. Urgencias cardiovasculares', 23, 'Fibrilacion y fluter auriculares', 184, ['arritmias']),
  c('III. Urgencias cardiovasculares', 25, 'Dolor toracico agudo', 207, ['dolor-toracico']),
  c('III. Urgencias cardiovasculares', 26, 'Sindrome coronario agudo', 214, ['sca', 'codigo-iam', 'hemodinamica']),
  c('III. Urgencias cardiovasculares', 27, 'Sindrome aortico agudo', 228, ['sindrome-aortico']),
  c('III. Urgencias cardiovasculares', 32, 'Urgencia hipertensiva', 246, ['hta-urgencias']),
  c('III. Urgencias cardiovasculares', 33, 'Emergencia hipertensiva', 249, ['hta-urgencias']),
  c('IV. Urgencias del aparato respiratorio', 37, 'Disnea aguda', 268, ['disnea']),
  c('IV. Urgencias del aparato respiratorio', 39, 'Tromboembolia pulmonar', 277, ['tep']),
  c('IV. Urgencias del aparato respiratorio', 40, 'Ataque de asma', 287, ['asma-epoc']),
  c('IV. Urgencias del aparato respiratorio', 41, 'EPOC agudizada', 293, ['asma-epoc']),
  c('IV. Urgencias del aparato respiratorio', 42, 'Neumonia adquirida en la comunidad', 300, ['neumonia']),
  c('V. Urgencias del aparato digestivo', 48, 'Hemorragia digestiva alta', 327, ['hemorragia-digestiva']),
  c('V. Urgencias del aparato digestivo', 50, 'Dolor abdominal agudo', 340, ['dolor-abdominal']),
  c('V. Urgencias del aparato digestivo', 54, 'Pancreatitis aguda', 376, ['pancreatitis-hepatobiliar']),
  c('VI. Urgencias neurologicas', 59, 'Cefalea', 404, ['cefalea']),
  c('VI. Urgencias neurologicas', 61, 'Sincope', 422, ['sincope']),
  c('VI. Urgencias neurologicas', 62, 'Coma', 428, ['coma']),
  c('VI. Urgencias neurologicas', 63, 'Crisis epilepticas', 435, ['crisis-epileptica']),
  c('VI. Urgencias neurologicas', 64, 'Ictus', 442, ['ictus', 'codigo-ictus', 'neurointervencionismo']),
  c('VI. Urgencias neurologicas', 66, 'Sindrome meningeo, absceso cerebral, absceso epidural espinal y encefalitis', 462, ['meningitis-encefalitis']),
  c('VII. Urgencias psiquiatricas', 69, 'Agitacion psicomotriz', 492, ['agitacion', 'contencion']),
  c('VII. Urgencias psiquiatricas', 71, 'Valoracion del riesgo de suicidio en urgencias', 502, ['riesgo-suicida', 'psiquiatria']),
  c('VIII. Urgencias endocrinometabolicas', 75, 'Hipoglucemia', 528, ['glucemia']),
  c('VIII. Urgencias endocrinometabolicas', 77, 'Cetoacidosis diabetica', 535, ['cad-ehh']),
  c('VIII. Urgencias endocrinometabolicas', 84, 'Hiponatremia', 564, ['electrolitos']),
  c('VIII. Urgencias endocrinometabolicas', 85, 'Hipernatremia', 569, ['electrolitos', 'deficit-agua']),
  c('VIII. Urgencias endocrinometabolicas', 87, 'Hiperpotasemia', 576, ['electrolitos']),
  c('VIII. Urgencias endocrinometabolicas', 88, 'Hipomagnesemia', 579, ['electrolitos']),
  c('VIII. Urgencias endocrinometabolicas', 89, 'Hipermagnesemia', 581, ['electrolitos']),
  c('IX. Urgencias nefrourologicas', 94, 'Lesion renal aguda', 596, ['renal-urologia']),
  c('IX. Urgencias nefrourologicas', 95, 'Enfermedad renal cronica', 601, ['renal-urologia']),
  c('X. Infecciones en medicina de urgencias', 107, 'Sepsis', 640, ['sepsis', 'codigo-sepsis']),
  c('X. Infecciones en medicina de urgencias', 108, 'Sindrome febril sin foco en pacientes no inmunodeprimidos', 647, ['infecciones-especiales']),
  c('XIV. Intoxicaciones agudas y envenenamientos', 130, 'Intoxicaciones agudas: actitud diagnostica y tratamiento general', 776, ['toxicologia', 'descontaminacion']),
  c('XIV. Intoxicaciones agudas y envenenamientos', 149, 'Antagonistas y antidotos', 851, ['toxicologia']),
  c('XVI. Urgencias por agentes fisicos y quimicos', 154, 'Quemaduras termicas', 872, ['quemaduras']),
  c('XX. Urgencias traumatologicas', 180, 'Atencion inicial al paciente con traumatismo grave', 978, ['trauma-grave', 'codigo-trauma']),
  c('XXI. Urgencias dermatologicas', 190, 'Urticaria y anafilaxia', 1056, ['piel-alergia', 'anafilaxia']),
  c('XXIII. Urgencias obstetricas y ginecologicas', 206, 'Estados hipertensivos del embarazo. Preeclampsia y eclampsia', 1133, ['obstetricia']),
  c('XXIV. Miscelanea', 213, 'Fluidoterapia en urgencias', 1176, ['shock', 'sepsis', 'renal-urologia']),
  c('XXIV. Miscelanea', 214, 'Analgesia, sedacion y relajacion muscular en urgencias. Secuencia rapida de intubacion. Sedacion paliativa', 1183, ['analgesia-sedacion', 'sedacion', 'intubacion-isr']),
  c('XXIV. Miscelanea', 216, 'Soporte respiratorio no invasivo', 1216, ['vmni', 'vmni-srni']),
  c('XXIV. Miscelanea', 218, 'Atencion al potencial donante de organos en urgencias', 1257, ['donante-potencial']),
];

const primaryReferenceChapters = {
  disnea: 37,
  'renal-urologia': 94,
  'dolor-toracico': 25,
  sca: 26,
  sepsis: 107,
  'codigo-sepsis': 107,
  arritmias: 23,
  electrolitos: 87,
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
  endPrintedPage: entry.endBookPage,
  endPdfPage: entry.endPdfPage,
  pdfFile: murilloBook.pdfFile,
  resource: entry.resource,
  resourceType: entry.resourceType,
  resourceAvailable: entry.resourceAvailable,
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
  resourceType: 'pdf | chapter-pdf | image | external-url | unavailable',
};
