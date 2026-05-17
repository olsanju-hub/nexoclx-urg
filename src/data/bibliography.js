export const bibliographyCatalog = {
  murillo7: {
    id: 'murillo7',
    title: 'Medicina de urgencias y emergencias. Guía diagnóstica y protocolos de actuación, 7.ª edición',
    shortTitle: 'Murillo 7.ª ed.',
  },
  'esc-fa-2024': {
    id: 'esc-fa-2024',
    title: 'Guía ESC 2024 sobre el manejo de la fibrilación auricular',
    shortTitle: 'ESC FA 2024',
  },
  'esc-hta-2024': {
    id: 'esc-hta-2024',
    title: 'Guía ESC 2024 sobre el manejo de la presión arterial elevada y la hipertensión',
    shortTitle: 'ESC HTA 2024',
  },
  'esc-sca-2023': {
    id: 'esc-sca-2023',
    title: 'Guía ESC 2023 sobre el diagnóstico y tratamiento de los síndromes coronarios agudos',
    shortTitle: 'ESC SCA 2023',
  },
  'esc-tsv-2019': {
    id: 'esc-tsv-2019',
    title: 'Guía ESC 2019 sobre el tratamiento de pacientes con taquicardia supraventricular',
    shortTitle: 'ESC TSV 2019',
  },
  'esc-bradicardias-2021': {
    id: 'esc-bradicardias-2021',
    title: 'Comentarios a la guía ESC 2021 sobre estimulación cardiaca y terapia de resincronización',
    shortTitle: 'ESC Bradicardias 2021',
  },
  'esc-arritmias-ventriculares-2022': {
    id: 'esc-arritmias-ventriculares-2022',
    title: 'Comentarios a la guía ESC 2022 sobre el tratamiento de pacientes con arritmias ventriculares y la prevención de la muerte cardiaca súbita',
    shortTitle: 'ESC Arritmias ventriculares 2022',
  },
  'aha-ictus-isquemico-2026': {
    id: 'aha-ictus-isquemico-2026',
    title: '2026 Guideline for the Early Management of Patients With Acute Ischemic Stroke',
    shortTitle: 'AHA Ictus isquémico 2026',
  },
  'aha-ictus-hemorragico-2022': {
    id: 'aha-ictus-hemorragico-2022',
    title: '2022 Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage',
    shortTitle: 'AHA Ictus hemorrágico 2022',
  },
  'nice-ng250-2025': {
    id: 'nice-ng250-2025',
    title: 'NICE NG250: Neumonía: diagnóstico y manejo',
    shortTitle: 'NICE NG250 2025',
  },
  'wses-appendicitis-2020': {
    id: 'wses-appendicitis-2020',
    title: 'WSES Jerusalem guidelines 2020: diagnóstico y tratamiento de la apendicitis aguda',
    shortTitle: 'WSES Apendicitis 2020',
  },
  'wses-diverticulitis-2020': {
    id: 'wses-diverticulitis-2020',
    title: 'WSES 2020: manejo de la diverticulitis colónica aguda en urgencias',
    shortTitle: 'WSES Diverticulitis 2020',
  },
  'wses-ami-2022': {
    id: 'wses-ami-2022',
    title: 'WSES 2022: actualización de las guías de isquemia mesentérica aguda',
    shortTitle: 'WSES Isquemia mesentérica 2022',
  },
  'acg-pancreatitis-2024': {
    id: 'acg-pancreatitis-2024',
    title: 'American College of Gastroenterology guideline 2024: manejo de la pancreatitis aguda',
    shortTitle: 'ACG Pancreatitis 2024',
  },
  'eau-urolithiasis-2025': {
    id: 'eau-urolithiasis-2025',
    title: 'EAU Guidelines on Urolithiasis, edición 2025',
    shortTitle: 'EAU Urolitiasis 2025',
  },
  'eau-urological-infections-2025': {
    id: 'eau-urological-infections-2025',
    title: 'EAU Guidelines on Urological Infections, edición 2025',
    shortTitle: 'EAU Infecciones urinarias 2025',
  },
  'acog-ectopic-2018': {
    id: 'acog-ectopic-2018',
    title: 'ACOG Practice Bulletin No. 193: Tubal Ectopic Pregnancy, 2018; reafirmado 2025',
    shortTitle: 'ACOG Ectópico 2018/2025',
  },
  'ssc-sepsis-2021': {
    id: 'ssc-sepsis-2021',
    title: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021',
    shortTitle: 'SSC Sepsis 2021',
  },
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

  return {
    id,
    referenceId,
    reference: source?.title ?? referenceId,
    shortReference: source?.shortTitle ?? referenceId,
    indexPages,
    verifiedPages,
    historicalPdfPages: pdfPages,
    isTextualReference: true,
    hasPublicPdfLink: false,
    internalId: `${referenceId}:${id}`,
    note,
  };
};
