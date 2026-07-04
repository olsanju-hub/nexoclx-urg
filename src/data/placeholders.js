export const placeholderSources = [
  'ACC/AHA/ACEP/NAEMSP/SCAI. 2025 Guideline for the Management of Patients With Acute Coronary Syndromes. https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes',
  'ESC. 2023 Guidelines for the management of acute coronary syndromes. https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/',
  'ACC/AHA/ASE/CHEST/SAEM/SCCT/SCMR. 2021 Guideline for the Evaluation and Diagnosis of Chest Pain. Circulation. https://www.ahajournals.org/doi/10.1161/CIR.0000000000001029',
  'NICE. Recent-onset chest pain of suspected cardiac origin: assessment and diagnosis, CG95. https://www.nice.org.uk/guidance/cg95',
  'ESC/ERS. 2019 Guidelines for the diagnosis and management of acute pulmonary embolism. https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-pulmonary-embolism/',
  'ACC/AHA. 2022 Guideline for the Diagnosis and Management of Aortic Disease. https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106',
];

export const hypertensionSources = [
  'ESC. 2024 Guidelines for the management of elevated blood pressure and hypertension. https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
  'European Society of Hypertension. 2023 ESH Guidelines for the management of arterial hypertension. Journal of Hypertension. https://journals.lww.com/jhypertension/fulltext/2023/12000/2023_esh_guidelines_for_the_management_of_arterial.2.aspx',
  'NICE. Hypertension in adults: diagnosis and management, NG136. https://www.nice.org.uk/guidance/ng136/chapter/recommendations',
  'NICE. Hypertension in adults: diagnosis and management, visual summary. https://www.nice.org.uk/guidance/ng136/resources/visual-summary-pdf-6899919517',
  'BNF/NICE. Amlodipine. https://bnf.nice.org.uk/drugs/amlodipine/',
  'BNF/NICE. Ramipril. https://bnf.nice.org.uk/drugs/ramipril/',
  'BNF/NICE. Losartan potassium. https://bnf.nice.org.uk/drugs/losartan-potassium/',
  'BNF/NICE. Indapamide. https://bnf.nice.org.uk/drugs/indapamide/',
  'Peacock WF, et al. Treatment of hypertensive emergencies. Ann Transl Med. 2017. https://pmc.ncbi.nlm.nih.gov/articles/PMC5440310/',
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
        body: 'La disposición requiere una vía clínica estructurada que combine síntomas, ECG, biomarcadores, estabilidad y diagnóstico alternativo.',
        items: [
          'Ingreso o unidad monitorizada si hay inestabilidad, isquemia, biomarcadores positivos, causa grave o necesidad de tratamiento hospitalario.',
          'Observación si el episodio requiere ECG/troponina seriada o pruebas complementarias antes de decidir destino.',
          'Alta solo con estabilidad documentada, evaluación completa, diagnóstico alternativo razonable y plan de seguimiento.',
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
      'Destino estructurado según estabilidad, ECG, troponina y sospecha diferencial.',
      'Interconsulta temprana según ECG, biomarcadores, estabilidad y diagnóstico diferencial.',
    ],
    interactive: {
      title: 'Decisión rápida en urgencias',
      intro: 'Marca los datos presentes.',
      checks: [
        'Compromiso vital, shock, insuficiencia respiratoria, síncope, arritmia o dolor persistente.',
        'ECG compatible con SCA con elevación del ST o equivalente según protocolo del centro.',
        'Troponina positiva, en evolución o vía seriada aún no completada.',
        'Sospecha dominante de TEP, síndrome aórtico agudo, neumotórax o miopericarditis.',
        'Necesidad de observación, imagen urgente, ingreso o interconsulta específica.',
      ],
      positiveTitle: 'Monitorizar, observar o ingresar según escenario',
      positiveBody: 'Con cualquier dato marcado, prioriza área monitorizada, ECG/troponina seriados, interconsulta o circuito específico según sospecha.',
      negativeTitle: 'Completar vía clínica antes del alta',
      negativeBody: 'Solo plantear alta tras evaluación completa, estabilidad documentada, diagnóstico alternativo razonable y plan de seguimiento.',
      copyPrefix: 'Dolor torácico Urg',
    },
    assessment: {
      title: 'Herramienta de triaje y destino',
      intro: 'Introduce hallazgos para orientar monitorización, observación, ingreso o alta segura.',
      copyPrefix: 'Dolor torácico Urg',
      fields: [
        { id: 'activePain', type: 'checkbox', label: 'Dolor activo, persistente o recurrente' },
        { id: 'unstable', type: 'checkbox', label: 'Shock, insuficiencia respiratoria, síncope, arritmia o compromiso vital' },
        {
          id: 'ecg',
          type: 'select',
          label: 'ECG inicial',
          required: true,
          options: [
            { value: 'normal', label: 'Sin cambios agudos' },
            { value: 'ischemic', label: 'Cambios isquémicos o arritmia relevante' },
            { value: 'stemi', label: 'Elevación ST o equivalente' },
          ],
        },
        {
          id: 'troponin',
          type: 'select',
          label: 'Troponina / vía seriada',
          required: true,
          options: [
            { value: 'not-done', label: 'No realizada' },
            { value: 'negative-complete', label: 'Vía seriada negativa completa' },
            { value: 'pending', label: 'Pendiente o en evolución' },
            { value: 'positive', label: 'Positiva' },
          ],
        },
        { id: 'criticalDifferential', type: 'checkbox', label: 'Sospecha de TEP, aorta, neumotórax o miopericarditis' },
        { id: 'needsConsult', type: 'checkbox', label: 'Necesita imagen urgente, interconsulta, observación o ingreso' },
      ],
      outcomes: [
        {
          any: ['unstable', { id: 'ecg', equals: 'stemi' }],
          status: 'Crítico',
          tone: 'alert',
          title: 'Área monitorizada y circuito tiempo-dependiente',
          body: 'La entrada sugiere compromiso vital o SCA con elevación/equivalente.',
          actions: [
            'Monitorizar y activar circuito de reperfusión o críticos según escenario.',
            'Repetir ECG si persisten síntomas o cambia la clínica.',
            'Interconsulta temprana y documentación de hora de inicio.',
          ],
        },
        {
          any: ['activePain', 'criticalDifferential', 'needsConsult', { id: 'ecg', equals: 'ischemic' }, { id: 'troponin', equals: 'positive' }, { id: 'troponin', equals: 'pending' }],
          status: 'Observar',
          tone: 'alert',
          title: 'Observación, imagen o ingreso según sospecha',
          body: 'No es una vía de alta directa: quedan datos activos o diferenciales tiempo-dependientes.',
          actions: [
            'Completar ECG/troponina seriados o prueba dirigida.',
            'Mantener vigilancia si dolor activo, biomarcadores en evolución o diagnóstico no cerrado.',
            'Ingresar o interconsultar si aparece causa grave o necesidad terapéutica hospitalaria.',
          ],
        },
      ],
      incompleteOutcome: {
        status: 'Datos',
        title: 'Completa ECG y troponina/vía seriada',
        body: 'La disposición en urgencias no debe proponerse sin ECG y estado de la vía de troponina cuando aplica.',
        actions: [
          'Registrar ECG inicial.',
          'Indicar si troponina está no realizada, pendiente, positiva o vía seriada negativa completa.',
          'Marcar dolor activo, inestabilidad o diferencial grave si existen.',
        ],
      },
      defaultOutcome: {
        status: 'Alta',
        title: 'Alta solo tras vía completa y diagnóstico razonable',
        body: 'Sin datos marcados, el alta exige evaluación completa, vía seriada negativa si procede y seguimiento.',
        actions: [
          'Documentar estabilidad y diagnóstico alternativo razonable.',
          'Entregar señales de reconsulta.',
          'Planificar seguimiento según circuito local.',
        ],
      },
    },
    sources: placeholderSources,
  },
  {
    id: 'hta',
    title: 'HTA',
    description: 'Diferenciación de daño agudo, conducta urgente y destino hospitalario.',
    status: 'Guía clínica',
    sections: [
      {
        step: '01',
        title: 'Confirmar gravedad real',
        body: 'Repite la presión arterial con técnica correcta y clasifica al paciente por daño agudo, no solo por la cifra.',
        items: [
          'Valora ABCDE, dolor torácico, disnea, focalidad neurológica, confusión, alteración visual, oliguria, embarazo o dolor dorsal brusco.',
          'Comprueba fármacos, suspensión reciente de tratamiento, tóxicos, dolor, ansiedad, retención urinaria y causas reversibles.',
          'Usa monitorización y área de mayor vigilancia si hay síntomas, signos de daño de órgano o necesidad de tratamiento intravenoso.',
        ],
      },
      {
        step: '02',
        title: 'Semáforo de conducta',
        body: 'La emergencia hipertensiva exige daño agudo de órgano diana y tratamiento monitorizado; la HTA sin daño agudo no requiere descenso brusco.',
        items: [
          'Emergencia: encefalopatía, ictus candidato a vía específica, SCA, edema agudo de pulmón, disección aórtica, insuficiencia renal aguda o eclampsia.',
          'HTA grave sin daño agudo: observar, reevaluar, reiniciar o ajustar tratamiento oral y planificar seguimiento.',
          'Evita reducciones rápidas no indicadas si no hay daño agudo documentado.',
        ],
      },
      {
        step: '03',
        title: 'Pruebas dirigidas',
        body: 'Solicita pruebas según síntomas y sospecha de órgano afectado.',
        items: [
          'ECG, troponina y radiografía/imagen si hay dolor torácico, disnea, sospecha de SCA o edema pulmonar.',
          'Analítica con función renal, electrolitos y orina cuando condiciona daño renal, tratamiento o ingreso.',
          'Neuroimagen o circuito ictus si hay focalidad, alteración neurológica o criterio temporal aplicable.',
        ],
      },
      {
        step: '04',
        title: 'Tratamiento y destino',
        body: 'El tratamiento depende del escenario: ajuste oral y seguimiento si no hay daño agudo; intravenoso titulado e ingreso si hay emergencia.',
        items: [
          'Emergencia hipertensiva: monitorización, vía intravenosa titulable, objetivos definidos por el proceso y valoración de UCI/interconsulta.',
          'HTA grave sin daño agudo: evitar descenso brusco; ajustar tratamiento oral y confirmar seguimiento estrecho.',
          'Alta solo si no hay daño agudo, hay estabilidad clínica, plan terapéutico y seguimiento documentado.',
        ],
      },
    ],
    tools: [
      'Selector de daño agudo de órgano diana.',
      'Semáforo: emergencia hipertensiva, HTA grave sin daño agudo o seguimiento ambulatorio.',
      'Resumen copiable para evolución, interconsulta o ingreso.',
    ],
    treatment: [
      {
        title: 'Sin daño agudo',
        body: 'La conducta es reevaluación, tratamiento oral y seguimiento; no descenso rápido intravenoso.',
        items: [
          'Reiniciar o intensificar tratamiento oral según perfil: amlodipino 5 mg cada 24 h hasta 10 mg; ramipril 1,25-2,5 mg cada 24 h hasta 10 mg; losartán 50 mg cada 24 h hasta 100 mg; indapamida 2,5 mg cada 24 h o MR 1,5 mg.',
          'Comprobar función renal y potasio cuando se indiquen IECA, ARA-II, diuréticos o antagonistas mineralocorticoides.',
        ],
      },
      {
        title: 'Emergencia hipertensiva',
        body: 'Requiere monitorización, tratamiento titulado y objetivo dependiente del órgano afectado.',
        items: [
          'Labetalol intravenoso: bolo inicial 0,3-1 mg/kg con máximo inicial 20 mg, seguido de perfusión 0,4-1 mg/kg/h según respuesta y vigilancia.',
          'Priorizar tratamiento específico si predomina SCA, edema agudo de pulmón, disección aórtica, ictus, insuficiencia renal aguda o eclampsia.',
          'Ingreso o unidad monitorizada si hay daño agudo, perfusión intravenosa, deterioro clínico o necesidad de interconsulta urgente.',
        ],
      },
      {
        title: 'Alta y seguimiento',
        body: 'Solo si la evaluación descarta daño agudo y queda un plan seguro.',
        items: [
          'Documentar cifras, repetición de medida, ausencia de daño agudo, cambios terapéuticos y seguimiento.',
          'Entregar señales de reconsulta urgente: dolor torácico, disnea, focalidad neurológica, confusión, síncope o empeoramiento.',
        ],
      },
    ],
    interactive: {
      title: 'Decisión rápida HTA Urg',
      intro: 'Marca los datos presentes.',
      checks: [
        'Dolor torácico, disnea, edema pulmonar, focalidad neurológica, confusión, alteración visual, oliguria o dolor dorsal brusco.',
        'ECG, biomarcadores, función renal, neuroimagen o clínica sugieren daño agudo de órgano diana.',
        'Necesidad de tratamiento intravenoso titulado o monitorización continua.',
        'HTA grave sin daño agudo pero sin seguimiento fiable o con mala tolerancia clínica.',
      ],
      positiveTitle: 'Escalar a emergencia, observación o ingreso',
      positiveBody: 'Si hay daño agudo, monitoriza, trata según órgano afectado e ingresa o interconsulta. Si no hay daño agudo pero el plan no es seguro, observa y ajusta.',
      negativeTitle: 'Ajuste oral y alta segura',
      negativeBody: 'Con estabilidad y sin daño agudo, evita descenso brusco, ajusta tratamiento oral y documenta seguimiento y signos de alarma.',
      copyPrefix: 'HTA Urg',
    },
    assessment: {
      title: 'Herramienta HTA en urgencias',
      intro: 'Introduce cifras, daño orgánico y seguridad del plan para orientar conducta.',
      copyPrefix: 'HTA Urg',
      fields: [
        { id: 'sbp', type: 'number', label: 'Presión sistólica', min: 70, max: 300, unit: 'mmHg', required: true },
        { id: 'dbp', type: 'number', label: 'Presión diastólica', min: 40, max: 180, unit: 'mmHg', required: true },
        {
          id: 'organDamage',
          type: 'select',
          label: 'Daño agudo de órgano diana',
          required: true,
          options: [
            { value: 'none', label: 'No objetivado' },
            { value: 'suspected', label: 'Sospechado' },
            { value: 'confirmed', label: 'Confirmado' },
          ],
        },
        { id: 'chestDyspnea', type: 'checkbox', label: 'Dolor torácico, disnea, edema pulmonar o cambios ECG' },
        { id: 'neuroRenal', type: 'checkbox', label: 'Focalidad, confusión, alteración visual, oliguria o deterioro renal' },
        { id: 'unsafeDischarge', type: 'checkbox', label: 'No hay seguimiento fiable o persiste mala tolerancia clínica' },
      ],
      outcomes: [
        {
          any: ['chestDyspnea', 'neuroRenal', { id: 'organDamage', equals: 'suspected' }, { id: 'organDamage', equals: 'confirmed' }],
          status: 'Emergencia',
          tone: 'alert',
          title: 'Emergencia hipertensiva hasta demostrar lo contrario',
          body: 'La combinación de HTA y daño agudo sospechado requiere monitorización y manejo hospitalario.',
          actions: [
            'Monitorizar, solicitar pruebas dirigidas e iniciar tratamiento según órgano afectado.',
            'Valorar intravenoso titulado e ingreso/interconsulta.',
            'Evitar alta o descenso no monitorizado.',
          ],
        },
        {
          any: [{ id: 'sbp', gte: 180 }, { id: 'dbp', gte: 120 }, 'unsafeDischarge'],
          status: 'Observar',
          tone: 'alert',
          title: 'HTA grave: reevaluar daño y seguridad del plan',
          body: 'Si no hay daño agudo, la salida es observación, ajuste oral y seguimiento; no descenso brusco.',
          actions: [
            'Repetir medida y revisar causas reversibles.',
            'Ajustar tratamiento oral si procede.',
            'Alta solo con estabilidad, ausencia de daño agudo y seguimiento documentado.',
          ],
        },
      ],
      incompleteOutcome: {
        status: 'Datos',
        title: 'Completa cifras y daño orgánico',
        body: 'La herramienta diferencia HTA sin daño agudo, urgencia y emergencia a partir de TA y daño de órgano.',
        actions: [
          'Introducir presión sistólica y diastólica.',
          'Seleccionar daño agudo: no objetivado, sospechado o confirmado.',
          'Marcar síntomas torácicos, neurológicos, renales o inseguridad del alta si existen.',
        ],
      },
      defaultOutcome: {
        status: 'Oral',
        title: 'Ajuste oral y seguimiento',
        body: 'Sin daño agudo ni inseguridad del plan, prioriza tratamiento oral, educación y seguimiento.',
        actions: [
          'Documentar ausencia de daño agudo.',
          'Evitar descenso rápido intravenoso.',
          'Entregar signos de alarma y control programado.',
        ],
      },
    },
    sources: hypertensionSources,
  },
];
