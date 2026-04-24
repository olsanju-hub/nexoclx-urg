const baseUrl = import.meta.env.BASE_URL;
const buildFilePath = (relativePath) => encodeURI(`${baseUrl}${relativePath}`);

export const bibliographyCatalog = {
  murillo7: {
    id: 'murillo7',
    title: 'Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición',
    shortTitle: 'Murillo 7.ª ed.',
    filePath: buildFilePath('biblio/urgencias-murillo-7ma.pdf'),
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
