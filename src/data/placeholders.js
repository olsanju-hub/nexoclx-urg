export const placeholderSources = [
  'ACC/AHA/ACEP/NAEMSP/SCAI. 2025 Guideline for the Management of Patients With Acute Coronary Syndromes. https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes',
  'ESC. 2023 Guidelines for the management of acute coronary syndromes. https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/',
  'ACC/AHA/ASE/CHEST/SAEM/SCCT/SCMR. 2021 Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. https://www.ahajournals.org/doi/10.1161/CIR.0000000000001029',
  'NICE. Recent-onset chest pain of suspected cardiac origin: assessment and diagnosis, CG95. https://www.nice.org.uk/guidance/cg95',
  'ESC/ERS. 2019 Guidelines for the diagnosis and management of acute pulmonary embolism. https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-pulmonary-embolism/',
  'ACC/AHA. 2022 Guideline for the Diagnosis and Management of Aortic Disease. https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106',
];

export const placeholderProtocols = [
  {
    id: 'dolor-toracico',
    title: 'Dolor torácico',
    description: 'Priorización, pruebas urgentes, tratamiento inicial y destino en urgencias hospitalarias.',
    status: 'Guía clínica',
    sections: [
      {
        step: '01',
        title: 'Triaje y estabilidad',
        body: 'Clasifica de entrada la gravedad clínica y activa atención inmediata si hay compromiso vital o sospecha de síndrome coronario agudo.',
        items: [
          'Valora ABCDE, constantes, saturación, dolor persistente, shock, insuficiencia respiratoria, síncope o arritmia.',
          'Ubica en área monitorizada si hay inestabilidad, cambios ECG, dolor continuo o alta sospecha de causa tiempo-dependiente.',
          'El tratamiento inicial debe seguir el circuito hospitalario y la guía vigente para el escenario identificado.',
        ],
      },
      {
        step: '02',
        title: 'ECG y troponina',
        body: 'El ECG de 12 derivaciones es la primera prueba y debe interpretarse de forma temprana; la troponina se integra en una vía seriada validada.',
        items: [
          'Un ECG inicial no diagnóstico no descarta síndrome coronario agudo si la sospecha clínica persiste.',
          'Los algoritmos de troponina de alta sensibilidad deben usarse con los tiempos y puntos de corte validados por el centro.',
          'Repite ECG o amplía derivaciones si persisten síntomas o aparecen datos de isquemia no explicados.',
        ],
      },
      {
        step: '03',
        title: 'Causas tiempo-dependientes',
        body: 'Ordena el diferencial urgente antes de atribuir el cuadro a una causa benigna.',
        items: [
          'SCA con o sin elevación del ST: dolor compatible, cambios ECG, troponina o riesgo clínico.',
          'TEP: disnea, síncope, hipoxemia, taquicardia, hemoptisis o factores tromboembólicos.',
          'Síndrome aórtico agudo, neumotórax, pericarditis o miocarditis cuando clínica y exploración orienten.',
        ],
      },
      {
        step: '04',
        title: 'Manejo inicial por escenario',
        body: 'El manejo se decide por estabilidad, ECG, troponina seriada y sospecha diagnóstica prioritaria.',
        items: [
          'Activa circuito de reperfusión ante ECG compatible con SCA con elevación del ST o equivalente según protocolo del centro.',
          'Observa y reevalúa a pacientes con dolor persistente, ECG no diagnóstico o troponina en evolución.',
          'Dirige imagen urgente o interconsulta específica cuando predomina sospecha de TEP, aorta, neumotórax o miopericarditis.',
        ],
      },
      {
        step: '05',
        title: 'Observación, ingreso o alta',
        body: 'La disposición requiere una vía clínica estructurada que combine síntomas, ECG, biomarcadores, riesgo y diagnóstico alternativo.',
        items: [
          'Ingreso o unidad monitorizada si hay inestabilidad, isquemia, biomarcadores positivos, causa grave o necesidad de tratamiento hospitalario.',
          'Observación si el episodio requiere ECG/troponina seriada o pruebas complementarias antes de decidir destino.',
          'Alta solo con bajo riesgo documentado, evaluación completa, diagnóstico alternativo razonable y plan de seguimiento.',
        ],
      },
      {
        step: '06',
        title: 'Interconsulta y transferencia interna',
        body: 'La interconsulta debe ser temprana cuando condiciona reperfusión, ingreso, imagen avanzada o tratamiento específico.',
        items: [
          'Cardiología para SCA, cambios ECG, troponina positiva o dolor isquémico persistente.',
          'Críticos, vascular, cirugía cardiaca o radiología según sospecha de shock, aorta, TEP de alto riesgo o neumotórax complicado.',
          'Documenta hora de inicio, ECG seriados, troponina, respuesta clínica y decisiones de destino.',
        ],
      },
    ],
    tools: [
      'ECG seriado y vía local de troponina de alta sensibilidad.',
      'Estratificación estructurada de riesgo integrada en el circuito hospitalario.',
      'Interconsulta temprana según ECG, biomarcadores, estabilidad y diagnóstico diferencial.',
    ],
    interactive: {
      title: 'Decisión rápida en urgencias',
      intro: 'Marca los datos presentes para priorizar ubicación, pruebas y destino asistencial.',
      checks: [
        'Compromiso vital, shock, insuficiencia respiratoria, síncope, arritmia o dolor persistente.',
        'ECG compatible con SCA con elevación del ST o equivalente según protocolo del centro.',
        'Troponina positiva, en evolución o vía seriada aún no completada.',
        'Sospecha dominante de TEP, síndrome aórtico agudo, neumotórax o miopericarditis.',
        'Necesidad de observación, imagen urgente, ingreso o interconsulta específica.',
      ],
      positiveTitle: 'Monitorizar, observar o ingresar según escenario',
      positiveBody: 'Con cualquier dato marcado, prioriza área monitorizada, ECG/troponina seriados, interconsulta o circuito específico según sospecha.',
      negativeTitle: 'Completar vía de bajo riesgo antes del alta',
      negativeBody: 'Solo plantear alta tras evaluación completa, bajo riesgo documentado, diagnóstico alternativo razonable y plan de seguimiento.',
      copyPrefix: 'Dolor torácico Urg',
    },
    sources: placeholderSources,
  },
];
