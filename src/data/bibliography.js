const baseUrl = import.meta.env.BASE_URL;
const buildFilePath = (relativePath) => encodeURI(`${baseUrl}${relativePath}`);

export const bibliographyCatalog = {
  murillo7: {
    id: 'murillo7',
    title: 'Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición',
    shortTitle: 'Murillo 7.ª ed.',
    filePath: buildFilePath('biblio/urgencias-murillo-7ma.pdf'),
  },
  'esc-fa-2024': {
    id: 'esc-fa-2024',
    title: 'Guía ESC 2024 sobre el manejo de la fibrilación auricular',
    shortTitle: 'ESC FA 2024',
    filePath: buildFilePath('biblio/FA 2024.pdf'),
  },
  'esc-hta-2024': {
    id: 'esc-hta-2024',
    title: 'Guía ESC 2024 sobre el manejo de la presión arterial elevada y la hipertensión',
    shortTitle: 'ESC HTA 2024',
    filePath: buildFilePath('biblio/HTA 2024.pdf'),
  },
  'esc-sca-2023': {
    id: 'esc-sca-2023',
    title: 'Guía ESC 2023 sobre el diagnóstico y tratamiento de los síndromes coronarios agudos',
    shortTitle: 'ESC SCA 2023',
    filePath: buildFilePath('biblio/SCA 2023.pdf'),
  },
  'esc-tsv-2019': {
    id: 'esc-tsv-2019',
    title: 'Guía ESC 2019 sobre el tratamiento de pacientes con taquicardia supraventricular',
    shortTitle: 'ESC TSV 2019',
    filePath: buildFilePath('biblio/TSV 2019.pdf'),
  },
  'esc-bradicardias-2021': {
    id: 'esc-bradicardias-2021',
    title: 'Comentarios a la guía ESC 2021 sobre estimulación cardiaca y terapia de resincronización',
    shortTitle: 'ESC Bradicardias 2021',
    filePath: buildFilePath('biblio/est car 2021.pdf'),
  },
  'esc-arritmias-ventriculares-2022': {
    id: 'esc-arritmias-ventriculares-2022',
    title: 'Comentarios a la guía ESC 2022 sobre el tratamiento de pacientes con arritmias ventriculares y la prevención de la muerte cardiaca súbita',
    shortTitle: 'ESC Arritmias ventriculares 2022',
    filePath: buildFilePath('biblio/ arritmias ventriculares y la prevención de la muerte cardiaca súbita 2022.pdf'),
  },
  'aha-ictus-isquemico-2026': {
    id: 'aha-ictus-isquemico-2026',
    title: '2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke',
    shortTitle: 'AHA Ictus isquémico 2026',
    filePath: buildFilePath('biblio/Ictus isquemico aha.pdf'),
  },
  'aha-ictus-hemorragico-2022': {
    id: 'aha-ictus-hemorragico-2022',
    title: '2022 Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage',
    shortTitle: 'AHA Ictus hemorrágico 2022',
    filePath: buildFilePath('biblio/Ictus hemorragico AHA 2022.pdf'),
  },
};

export const buildReferenceHref = (referenceId, pdfPage) => {
  const source = bibliographyCatalog[referenceId];

  if (!source) {
    return null;
  }

  return pdfPage ? `${source.filePath}#page=${pdfPage}` : source.filePath;
};

export const createBibliographyEntry = ({
  id,
  referenceId,
  indexPages = [],
  verifiedPages = [],
  pdfPages = [],
  note = '',
}) => {
  const source = bibliographyCatalog[referenceId];
  const firstPdfPage = Array.isArray(pdfPages) && pdfPages.length > 0 ? pdfPages[0] : null;

  return {
    id,
    referenceId,
    reference: source?.title ?? referenceId,
    shortReference: source?.shortTitle ?? referenceId,
    filePath: source?.filePath ?? '',
    indexPages,
    verifiedPages,
    pdfPages,
    href: buildReferenceHref(referenceId, firstPdfPage),
    internalId: `${referenceId}:${id}`,
    note,
  };
};
