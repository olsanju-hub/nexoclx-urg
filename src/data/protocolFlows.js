import { getCalculator } from './calculators';
import { getMedication } from './medications';
import { protocolList } from './protocols';

const PRIMARY_SECTION_TITLES = {
  definition: 'Sospecha',
  orders: 'Pruebas',
  findings: 'Decisión',
  treatment: 'Tratamiento',
  followUp: 'Destino',
};

const slugify = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);

const compactText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const brief = (value = '', maxLength = 150) => {
  const text = compactText(value);
  return text.length > maxLength ? `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}.` : text;
};

const asReferenceItems = (entries = []) =>
  entries.map((entry) => {
    const pages = entry.verifiedPages?.length ? ` pags. ${entry.verifiedPages.join(', ')}` : '';
    return `${entry.shortReference}${pages}. ${entry.note ?? ''}`.trim();
  });

const asMedicationReferenceItems = (protocol) => {
  const medicationIds = asArray(protocol.medicationGroups).flatMap((group) => asArray(group.medicationIds));
  const references = medicationIds.flatMap((medicationId) =>
    asArray(getMedication(medicationId).sources).map((source) => {
      if (source.bibliography) {
        const [item] = asReferenceItems([source.bibliography]);
        return item;
      }

      return `${source.label}. Fuente textual consultada.`;
    }),
  );

  return [...new Set(references)];
};

const shortAdjustment = (label, value) => (value ? `${label}: ${brief(value, 125)}` : null);

const maxDoseFrom = (value = '') => {
  const text = compactText(value);
  const match = text.match(/(?:máxim[ao]s?|hasta|sin sobrepasar)[^.;]*/i);
  return match ? brief(match[0].replace(/^hasta\s+/i, ''), 100) : null;
};

const medicationDetailItems = (medication) => {
  const avoid = medication.contraindications?.length
    ? medication.contraindications.slice(0, 2).map((item) => brief(item, 105)).join(' ')
    : null;
  const doseText = medication.contextDose ?? medication.dose;
  const maxDose = maxDoseFrom(doseText);

  return [
    `Fármaco/intervención: ${medication.name}`,
    doseText ? `Dosis: ${doseText}` : null,
    medication.contextRoute || medication.route ? `Vía: ${medication.contextRoute ?? medication.route}` : null,
    medication.contextFrequency || medication.frequency ? `Frecuencia: ${medication.contextFrequency ?? medication.frequency}` : null,
    medication.followUpPlan || medication.duration ? `Duración: ${brief(medication.followUpPlan ?? medication.duration, 130)}` : null,
    maxDose ? `Máximo: ${maxDose}` : null,
    avoid ? `Evitar: ${avoid}` : null,
    shortAdjustment('Ajuste renal', medication.renalAdjustment),
    shortAdjustment('Ajuste hepático', medication.hepaticAdjustment),
    medication.followUpPlan || medication.practicalNotes?.length
      ? `Reevaluar: ${brief(medication.followUpPlan ?? medication.practicalNotes[0], 130)}`
      : null,
  ].filter(Boolean);
};

const medicationDosingCalculators = {
  'midazolam-convulsiones': 'seizure-dose',
  'diazepam-convulsiones': 'seizure-dose',
  'lorazepam-estatus': 'seizure-dose',
  'valproato-estatus': 'seizure-dose',
  'fenitoina-estatus': 'seizure-dose',
  'heparina-sodica': 'sca-dose',
  'enoxaparina-sca': 'sca-dose',
  'tenecteplasa-sca': 'sca-dose',
  'alteplasa-sca': 'sca-dose',
  amiodarona: 'fa-dose',
  'flecainida-fa': 'fa-dose',
  'propafenona-fa': 'fa-dose',
  enoxaparina: 'fa-dose',
  'alteplasa-ictus': 'stroke-thrombolysis-dose',
  'adrenalina-anafilaxia': 'anaphylaxis-adrenaline',
};

const medicationNode = (medicationId) => {
  const medication = getMedication(medicationId);
  const doseSummary = medication.contextDose ?? medication.dose ?? medication.contextUse ?? medication.indication;
  const cimaSource = asArray(medication.sources).find(
    (source) => source.type === 'cima' && source.url && !source.url.toLowerCase().includes('.pdf'),
  );

  return {
    id: `med-${medication.id}`,
    title: medication.name,
    type: 'treatment',
    summary: doseSummary,
    items: medicationDetailItems(medication),
    medication: medication.family,
    sourceUrl: cimaSource?.url,
    calculatorId: medicationDosingCalculators[medication.id],
  };
};

const calculatorNode = (calculatorId) => {
  const calculator = getCalculator(calculatorId);

  return {
    id: `calc-${calculatorId}`,
    title: calculator.title,
    type: 'calculator',
    summary: calculator.summary,
    calculatorId,
    action: `Calcular ${calculator.title}`,
  };
};

const calculatorAction = (calculatorId) => {
  const calculator = getCalculator(calculatorId);
  return {
    calculatorId,
    label: `Calcular ${calculator.title}`,
  };
};

const procedureAction = (procedureId, label) => ({
  procedureId,
  label,
});

const protocolAction = (protocolId, label) => ({
  protocolId,
  label,
});

const treatmentCalculatorNodes = (protocol, calculators) => {
  if (protocol.id === 'fibrilacion-auricular') {
    const calculatorMap = {
      'cha2ds2-va': {
        id: 'riesgo-tromboembolico',
        title: 'Riesgo tromboembólico',
        summary: 'Decide indicación de anticoagulación.',
        severity: 'info',
      },
      'has-bled': {
        id: 'riesgo-hemorragico',
        title: 'Riesgo hemorrágico modificable',
        summary: 'Detecta factores corregibles antes y durante anticoagulación.',
        severity: 'warning',
      },
      'cockcroft-gault': {
        id: 'funcion-renal-anticoagulacion',
        title: 'Función renal para anticoagulación',
        summary: 'Ajusta elección o dosis cuando procede.',
        severity: 'info',
      },
    };

    return calculators.map((calculatorId) => {
      const meta = calculatorMap[calculatorId] ?? {
        id: `calculo-${calculatorId}`,
        title: getCalculator(calculatorId).title,
        summary: 'Abrir la calculadora concreta.',
        severity: 'info',
      };

      return {
        id: meta.id,
        title: meta.title,
        type: 'calculator',
        summary: meta.summary,
        severity: meta.severity,
        children: [calculatorNode(calculatorId)],
      };
    });
  }

  return [
    {
      id: 'calculos-tratamiento',
      title: 'Cálculos que cambian tratamiento',
      type: 'calculator',
      summary: 'Abrir la calculadora concreta desde el punto de decisión.',
      children: calculators.map(calculatorNode),
    },
  ];
};

const referencesSection = (protocol) => ({
  id: 'bibliografia',
  title: 'Bibliografía textual',
  type: 'references',
  children: [
    {
      id: 'fuentes',
      title: 'Fuentes usadas',
      type: 'references',
      references: [...asReferenceItems(protocol.bibliography), ...asMedicationReferenceItems(protocol)],
    },
  ],
});

const definitionSection = (protocol) => ({
  id: 'que-es',
  title: PRIMARY_SECTION_TITLES.definition,
  type: 'section',
  summary: brief(protocol.summary, 130),
  maxInitialItems: 0,
  children: [
    {
      id: 'definicion',
      title: protocol.title,
      type: 'step',
      summary: brief(protocol.summary, 180),
      severity: 'info',
    },
  ],
});

const defaultOrders = (protocol) => {
  const checks = asArray(protocol.quickChecks);

  return {
    id: 'que-pido',
    title: PRIMARY_SECTION_TITLES.orders,
    type: 'section',
    summary: 'Pruebas iniciales y datos que orientan la conducta.',
    children: [
      {
        id: 'pruebas-iniciales',
        title: 'Pruebas iniciales',
        type: 'step',
        items: checks.length ? checks : ['Constantes, exploración dirigida y pruebas según sospecha clínica.'],
      },
    ],
  };
};

const defaultFindings = (protocol) => ({
  id: 'que-espero',
  title: PRIMARY_SECTION_TITLES.findings,
  type: 'section',
  summary: 'Hallazgos y puntos de decisión que cambian prioridad, tratamiento o destino.',
  children: [
    ...decisionNodes(protocol),
    ...(protocol.warnings?.length
      ? [
          {
            id: 'gravedad',
            title: 'Criterios de gravedad',
            type: 'alert',
            severity: 'warning',
            items: protocol.warnings,
          },
        ]
      : []),
  ],
});

const decisionNodes = (protocol) =>
  asArray(protocol.decisionCards).map((card) => ({
    id: card.id ?? slugify(card.situation),
    title: card.situation,
    type: card.id?.includes('destino') ? 'decision' : 'step',
    summary: card.action,
    items: asArray(card.nuance),
    severity: card.id?.includes('inestable') || card.id?.includes('critical') || card.id?.includes('unstable') ? 'danger' : 'info',
  }));

const cardiologyInterventionNodes = (protocol) => {
  if (protocol.id === 'fibrilacion-auricular') {
    return [
      {
        id: 'cardioversion-electrica-fa',
        title: 'Cardioversión eléctrica',
        type: 'treatment',
        severity: 'danger',
        summary: 'Sincronizada urgente si inestabilidad; sedación según protocolo local si no retrasa la descarga.',
        items: [
          'Indicación: hipotensión, shock, isquemia, edema pulmonar o mala perfusión atribuible a FA.',
          'Dosis/energía: choque sincronizado; si hay duda, usar energía alta/máxima del desfibrilador para FA.',
          'Vía: cardioversión eléctrica sincronizada.',
          'Evitar si: intoxicación digitálica; si toma digoxina, iniciar con menor energía según Murillo.',
          'Reevaluar/siguiente paso: ritmo, PA, síntomas, causa desencadenante y anticoagulación según duración de FA/riesgo.',
        ],
      },
      {
        id: 'cardioversion-farmacologica-fa',
        title: 'Cardioversión farmacológica',
        type: 'treatment',
        summary: 'Solo si estable y el contexto permite control de ritmo precoz con fármaco verificado.',
        items: [
          'Sin cardiopatía estructural significativa: flecainida IV 1,5-3 mg/kg o propafenona IV 1,5-2 mg/kg; alternativas VO verificadas en detalle.',
          'Con HFrEF, hipertrofia severa o enfermedad coronaria: amiodarona IV 5-7 mg/kg; aceptar reversión más lenta.',
          'No mezclar antiarrítmicos de clase I y III en el mismo momento.',
          'Evitar si: duración ≥ 24 h/desconocida sin 3 semanas de ACO terapéutica o ETE sin trombo, salvo inestabilidad.',
          'Reevaluar/siguiente paso: si falla o empeora, cardioversión eléctrica; documentar anticoagulación.',
        ],
      },
    ];
  }

  if (protocol.id === 'sindrome-coronario-agudo') {
    return [
      {
        id: 'monitorizacion-sca',
        title: 'Monitorización inicial',
        type: 'step',
        summary: 'ECG, monitor, vía venosa y troponinas sin retrasar reperfusión si SCACEST.',
        items: [
          'ECG 12 derivaciones en los primeros 10 min y monitorización continua.',
          'Vía venosa, hemograma, bioquímica, coagulación y hs-cTn seriada si no hay SCACEST.',
          'No esperar troponina si ECG y clínica indican SCACEST o SCASEST de muy alto riesgo.',
        ],
      },
      {
        id: 'oxigeno-sca',
        title: 'Oxígeno',
        type: 'treatment',
        summary: 'Solo si hipoxemia, insuficiencia respiratoria o shock.',
        items: [
          'Indicación: SpO2 < 90%, dificultad respiratoria o shock.',
          'Vía: gafas nasales, Venturi o reservorio según necesidad clínica.',
          'Reevaluar: SatO2, trabajo respiratorio y necesidad de VNI/intubación si no mejora.',
        ],
      },
      {
        id: 'reperfusion-scacest',
        title: 'Reperfusión en SCACEST',
        type: 'decision',
        severity: 'danger',
        summary: 'ICP primaria si acceso en tiempo; fibrinólisis solo si procede y no hay contraindicación.',
        items: [
          'No esperar hs-cTn si SCACEST claro.',
          'Priorizar ICP primaria si puede realizarse en tiempo; si demora esperada > 120 min, fibrinólisis precoz si no contraindicada.',
          'Tras fibrinólisis, traslado a centro con ICP; angiografía de rescate inmediata si falla, hay reoclusión o reinfarto.',
        ],
      },
    ];
  }

  if (protocol.id === 'hta-urgencias') {
    return [
      {
        id: 'urgencia-hta-objetivo',
        title: 'Urgencia hipertensiva',
        type: 'decision',
        summary: 'Sin daño agudo de órgano diana: descenso gradual y tratamiento oral si procede.',
        items: [
          'Confirmar cifras, reposo y reevaluación.',
          'Evitar descensos bruscos o vía IV si no hay daño agudo de órgano.',
          'Reevaluar PA y clínica antes del alta; cerrar observación o control tras urgencias.',
        ],
      },
      {
        id: 'emergencia-hta-objetivo',
        title: 'Emergencia hipertensiva',
        type: 'alert',
        severity: 'danger',
        summary: 'Daño agudo de órgano diana: ingreso, monitorización y perfusión IV titulada.',
        items: [
          'Monitorización continua y tratamiento IV de acción corta.',
          'Objetivo: reducción controlada, evitando caídas rápidas no monitorizadas.',
          'UCI/área monitorizada si daño neurológico, coronario, edema pulmonar, disección o fracaso renal agudo.',
        ],
      },
    ];
  }

  if (protocol.id === 'bradicardias') {
    return [
      {
        id: 'marcapasos-transcutaneo',
        title: 'Marcapasos transcutáneo',
        type: 'treatment',
        severity: 'danger',
        summary: 'Preparar si inestabilidad persistente o bloqueo avanzado.',
        items: [
          'Indicación: mala perfusión, síncope, isquemia, insuficiencia cardíaca o bloqueo AV de alto riesgo que no responde rápido.',
          'Dosis/intervención: pacing transcutáneo como puente si no hay respuesta a atropina o pacing transvenoso no está disponible.',
          'Evitar retrasos: no repetir atropina si persiste mala perfusión o bloqueo AV alto con QRS ancho.',
          'Reevaluar/siguiente paso: avisar UCI/cardiología y preparar marcapasos transvenoso si Mobitz II, BAV completo con QRS ancho o pausas > 3 s.',
        ],
      },
    ];
  }

  if (protocol.id === 'arritmias-ventriculares') {
    return [
      {
        id: 'tv-sin-pulso',
        title: 'TV/FV sin pulso',
        type: 'alert',
        severity: 'danger',
        summary: 'Desfibrilación inmediata, RCP 2 min y fármacos tras choques según ALS.',
        items: [
          'Dosis/intervención: desfibrilación bifásica al menos 150 J; escalar si falla o usar máxima energía si se desconoce el equipo.',
          'Adrenalina 1 mg IV/IO tras 3 choques y cada 3-5 min.',
          'Amiodarona 300 mg IV/IO tras 3 choques; 150 mg tras 5 choques. Lidocaína alternativa si no hay amiodarona.',
          'Reevaluar/siguiente paso: ciclos de RCP de 2 min, ritmo, desfibrilación si procede y causas reversibles.',
        ],
      },
      {
        id: 'tv-pulso-inestable',
        title: 'TV con pulso inestable',
        type: 'treatment',
        severity: 'danger',
        summary: 'Cardioversión sincronizada urgente.',
        items: [
          'Indicación: shock, síncope, isquemia, edema pulmonar o deterioro.',
          'Dosis/intervención: choque sincronizado inicial 120-150 J; aumentar escalonadamente si falla.',
          'Si es polimórfica o no sincroniza, desfibrilar.',
          'Sedación/anestesia si consciente y no retrasa la electricidad; si falla, amiodarona 300 mg IV en 10-20 min y reintentar.',
        ],
      },
    ];
  }

  return [];
};

const treatmentInitialItems = (protocol) => {
  if (protocol.id === 'sindrome-coronario-agudo') {
    return [
      'AAS 150-300 mg VO carga o 75-250 mg IV si no tolera VO.',
      'P2Y12: ticagrelor 180 mg VO o clopidogrel 300-600 mg VO; prasugrel 60 mg si ICP y sin contraindicación.',
      'Anticoagulación: heparina sódica 70-100 UI/kg IV durante ICP; alternativas según estrategia en detalle.',
      'SCACEST: ICP primaria si llega en tiempo; si demora > 120 min, fibrinólisis con tenecteplasa/alteplasa/reteplasa verificadas.',
      'Nitroglicerina si dolor/isquemia sin hipotensión, VD ni PDE5; morfina IV titulada si dolor intenso persistente.',
    ];
  }

  if (protocol.id === 'fibrilacion-auricular') {
    return [
      'Inestable: cardioversión eléctrica sincronizada urgente; sedación según protocolo local si no retrasa.',
      'Frecuencia: metoprolol IV 2,5-5 mg, verapamilo IV 5 mg, digoxina IV 0,25 mg o amiodarona IV 5-7 mg/kg según FEVI/contexto.',
      'Cardioversión farmacológica: flecainida IV 1,5-3 mg/kg o propafenona IV 1,5-2 mg/kg si no hay cardiopatía estructural; amiodarona si HFrEF/coronaria.',
      'Anticoagulación: decidir con CHA2DS2-VA, duración de FA y función renal; ACOD salvo estenosis mitral moderada/grave o prótesis mecánica.',
    ];
  }

  if (protocol.id === 'bradicardias') {
    return [
      'Atropina 0,5-1 mg IV; repetir cada 3-5 min hasta 3 mg si bradicardia con signos adversos.',
      'Si atropina falla o hay bloqueo AV alto: marcapasos transcutáneo como puente.',
      'Adrenalina 2-10 microg/min IV en perfusión titulada si no hay pacing inmediato.',
      'Isoprenalina 1-2 microg/min IV de inicio; titular hasta 20 microg/min si se elige cronotrópico de puente.',
      'Avisar UCI/cardiología y preparar marcapasos transvenoso si Mobitz II, BAV completo con QRS ancho o mala perfusión persistente.',
    ];
  }

  if (protocol.id === 'arritmias-ventriculares') {
    return [
      'TV/FV sin pulso: RCP 2 min + desfibrilación bifásica al menos 150 J; escalar si falla.',
      'Adrenalina 1 mg IV/IO tras 3 choques y cada 3-5 min; amiodarona 300 mg tras 3 choques y 150 mg tras 5.',
      'TV con pulso inestable: cardioversión sincronizada 120-150 J; sedación si consciente y no retrasa.',
      'TV monomorfa estable: amiodarona 300 mg IV en 10-60 min, luego 900 mg/24 h si precisa.',
      'Torsades/TV polimórfica: sulfato de magnesio 2 g IV en 10-15 min; corregir K/Mg y retirar fármacos QT.',
    ];
  }

  return null;
};

const genericTreatmentSection = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);
  const calculators = asArray(protocol.calculatorIds);

  return {
    id: 'tratamiento',
    title: PRIMARY_SECTION_TITLES.treatment,
    type: 'section',
    summary: 'Pauta breve inicial; máximos, contraindicaciones, ajustes, alternativas y fuentes quedan en detalle.',
    initialItems: treatmentInitialItems(protocol),
    maxInitialItems: treatmentInitialItems(protocol)?.length ?? undefined,
    children: [
      {
        id: 'tratamiento-urgencias',
        title: 'Pautas en Urgencias',
        type: 'treatment',
        summary: 'Fármacos y medidas iniciales con dosis y criterios de uso cuando proceda.',
        children: [
          ...cardiologyInterventionNodes(protocol),
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            type: 'treatment',
            summary: 'Pautas con dosis, vía y criterios de seguridad.',
            children: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      ...(calculators.length ? treatmentCalculatorNodes(protocol, calculators) : []),
      ...(protocol.warnings?.length
        ? [
            {
              id: 'seguridad',
              title: 'Seguridad',
              type: 'alert',
              severity: 'warning',
              items: protocol.warnings,
            },
          ]
        : []),
    ],
  };
};

const genericFollowUpSection = (protocol) => ({
  id: 'seguimiento',
  title: PRIMARY_SECTION_TITLES.followUp,
  type: 'section',
  summary: 'Alta, observación, ingreso o unidad monitorizada según gravedad y respuesta.',
  children: [
    {
      id: 'destino',
      title: 'Destino',
      type: 'decision',
      summary: 'Definir alta, observación, ingreso o unidad monitorizada según gravedad y respuesta.',
      items: [
        ...asArray(protocol.quickSummary).map((item) => `${item.title}: ${item.action}`),
        ...asArray(protocol.warnings).slice(0, 2),
      ],
      severity: 'success',
    },
  ],
});

const pneumoniaOrdersSection = (protocol) => ({
  id: 'que-pido',
  title: PRIMARY_SECTION_TITLES.orders,
  type: 'section',
  summary: 'Confirmar neumonía, gravedad y necesidad de microbiología o analítica.',
  children: [
    {
      id: 'clinica-constantes-imagen',
      title: 'Clínica, constantes e imagen',
      type: 'step',
      items: protocol.quickChecks.slice(0, 3),
    },
    {
      id: 'microbiologia-analitica',
      title: 'Analítica / microbiología',
      type: 'step',
      summary: 'Pedir solo si cambia conducta o hay gravedad.',
      items: [protocol.decisionCards[1]?.nuance].filter(Boolean),
    },
    {
      id: 'gravedad',
      title: 'Escalas de gravedad',
      type: 'scale',
      summary: protocol.decisionCards[2]?.action,
      children: protocol.calculatorIds.map(calculatorNode),
    },
  ],
});

const pneumoniaFindingsSection = (protocol) => ({
  id: 'que-espero',
  title: PRIMARY_SECTION_TITLES.findings,
  type: 'section',
  summary: 'Identificar gravedad, criterios de ingreso y situaciones donde el alta no es segura.',
  children: [
    {
      id: 'criterios-destino',
      title: 'Gravedad y destino',
      type: 'decision',
      summary: protocol.decisionCards[3]?.action,
      items: [protocol.decisionCards[3]?.nuance].filter(Boolean),
    },
    {
      id: 'alertas',
      title: 'No alta segura',
      type: 'alert',
      severity: 'warning',
      items: protocol.noDischargeCriteria,
    },
  ],
});

const pneumoniaTreatmentSection = (protocol) => ({
  id: 'tratamiento',
  title: PRIMARY_SECTION_TITLES.treatment,
  type: 'section',
  summary: 'Antibiótico inicial resumido; seguridad, escenarios y reevaluación quedan cerrados en detalle.',
  children: [
    {
      id: 'tratamiento-urgencias',
      title: 'Antibiótico inicial en Urgencias',
      type: 'treatment',
      summary: 'Elegir antibiótico por gravedad y revisar seguridad antes de prescribir.',
      children: [
        {
          id: 'seguridad-antibiotico',
          title: 'Antes de prescribir',
          type: 'alert',
          severity: 'warning',
          items: [protocol.warnings[0]],
        },
        ...protocol.antibioticPlan.map((item) => ({
          id: slugify(item.severity),
          title: item.severity,
          type: 'treatment',
          summary: brief(item.regimen, 190),
        })),
      ],
    },
    {
      id: 'tratamiento-al-alta',
      title: 'Tratamiento al alta',
      type: 'treatment',
      summary: 'Aplicar solo en bajo riesgo con estabilidad, tolerancia oral y criterios de alta.',
      items: [
        brief(protocol.antibioticPlan[0]?.regimen, 190),
        'Reevaluar/derivar: si empeora, no mejora en 72 h, disnea, fiebre persistente, confusión, intolerancia oral o deterioro general.',
      ].filter(Boolean),
      severity: 'success',
    },
  ],
});

const pneumoniaFollowUpSection = (protocol) => ({
  id: 'seguimiento',
  title: PRIMARY_SECTION_TITLES.followUp,
  type: 'section',
  summary: 'Destino y revisión según gravedad, estabilidad, tolerancia oral y criterios de no alta.',
  children: [
    {
      id: 'destino',
      title: 'Decisión de destino',
      type: 'decision',
      summary: protocol.decisionCards[3]?.action,
      items: [protocol.decisionCards[3]?.nuance].filter(Boolean),
      children: protocol.carePath.map((item) => ({
        id: slugify(item.title),
        title: item.title,
        type: item.title.includes('UCI') ? 'alert' : 'decision',
        summary: item.text,
        severity: item.title.includes('UCI') ? 'danger' : item.title.includes('Bajo') ? 'success' : 'info',
      })),
    },
    {
      id: 'alta-segura',
      title: 'Alta segura',
      type: 'decision',
      severity: 'success',
      items: protocol.noDischargeCriteria,
    },
    {
      id: 'seguimiento',
      title: 'Seguimiento',
      type: 'step',
      items: protocol.reassessment,
    },
  ],
});

const buildPneumoniaFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Clínica respiratoria compatible; primero descartar gravedad y neumonía no comunitaria.',
      points: [
        'Tos, fiebre, expectoración, dolor pleurítico, disnea o auscultación focal.',
        'Excluir nosocomial, ventilación mecánica, pediátrica o inmunosupresión compleja.',
        'Alarma: sepsis, insuficiencia respiratoria, hipotensión, confusión, shock o soporte ventilatorio.',
      ],
      detailNodes: [
        {
          id: 'sospecha-nac',
          title: 'Entrada',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.decisionCards[0]?.action,
            protocol.decisionCards[0]?.nuance,
            'Valorar comorbilidad, fragilidad, embarazo, soporte domiciliario y tolerancia oral desde el inicio.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Confirmar neumonía y pedir solo pruebas que cambian gravedad, destino o antibiótico.',
      points: [
        'Constantes completas: FR, SatO2, TA, FC, temperatura y estado mental.',
        'Rx tórax o imagen si está en urgencias/hospital o si el diagnóstico condiciona destino.',
        'Analítica si gravedad, ingreso o comorbilidad: hemograma, bioquímica/creatinina, PCR y gasometría si hipoxemia.',
        'Microbiología solo si gravedad, ingreso, mala evolución, brote o si cambia el antibiótico.',
      ],
      detailNodes: [
        {
          id: 'pruebas-nac',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            protocol.decisionCards[1]?.action,
            protocol.decisionCards[1]?.nuance,
            'Hipoxemia, hipotensión, confusión, fracaso respiratorio o sepsis elevan el nivel de cuidados aunque la escala sea baja.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'CRB-65/CURB-65 ayudan a destino, siempre con juicio clínico.',
      points: [
        'CRB-65 si valoración inicial rápida.',
        'CURB-65 si valoración hospitalaria.',
        'Bajo riesgo: domicilio solo si estable, tolera VO, SatO2 aceptable y apoyo.',
        'Alto riesgo o alarma: ingreso; UCI si fracaso respiratorio, shock, sepsis grave o soporte ventilatorio.',
      ],
      actions: asArray(protocol.calculatorIds).map(calculatorAction),
      detailNodes: [
        {
          id: 'decision-nac',
          title: 'No decidir solo por la escala',
          type: 'decision',
          severity: 'info',
          items: [
            protocol.decisionCards[2]?.nuance,
            protocol.decisionCards[3]?.action,
            protocol.decisionCards[3]?.nuance,
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Antibiótico según gravedad; revisar alergias, función renal, embarazo, QT e interacciones.',
      points: [
        'Bajo riesgo VO: amoxicilina 500 mg cada 8 h 5 días; alternativas si alergia/atípicos.',
        'Riesgo moderado VO: amoxicilina 500 mg cada 8 h 5 días; añadir macrólido si atípicos.',
        'Alto riesgo/IV: co-amoxiclav 1,2 g IV cada 8 h + claritromicina 500 mg cada 12 h 5 días.',
        'Alergia a penicilina en alto riesgo: levofloxacino 500 mg VO/IV cada 12 h 5 días si encaja seguridad.',
      ],
      treatmentGroups: [
        {
          id: 'antibiotico-nac',
          title: 'Antibiótico inicial',
          cards: [
            {
              id: 'nac-amoxicilina',
              title: 'Amoxicilina',
              type: 'treatment',
              summary: 'Bajo riesgo o riesgo moderado si tolera vía oral.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/62586/FT_62586.html',
              items: [
                'Dosis: 500 mg.',
                'Vía: VO.',
                'Frecuencia: cada 8 h.',
                'Duración: 5 días si estabilidad clínica.',
                'Evitar si: alergia a penicilina.',
              ],
            },
            {
              id: 'nac-doxiciclina',
              title: 'Doxiciclina',
              type: 'treatment',
              summary: 'Alternativa si alergia a penicilina o sospecha de atípicos.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/50404/FichaTecnica_50404.html',
              items: [
                'Dosis: 200 mg el día 1; después 100 mg.',
                'Vía: VO.',
                'Frecuencia: 100 mg/24 h tras el primer día.',
                'Duración: 4 días más tras carga inicial.',
                'Evitar si: embarazo salvo indicación experta.',
              ],
            },
            {
              id: 'nac-claritromicina-eritromicina',
              title: 'Claritromicina',
              type: 'treatment',
              summary: 'Macrólido para sospecha de atípicos.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/64606/FT_64606.html',
              items: [
                'Dosis: 500 mg.',
                'Vía: VO; puede ser IV en alto riesgo según pauta local.',
                'Frecuencia: cada 12 h.',
                'Duración: 5 días.',
                'Evitar si: QT largo o interacciones relevantes.',
              ],
            },
            {
              id: 'nac-eritromicina',
              title: 'Eritromicina',
              type: 'treatment',
              summary: 'Macrólido preferido en el dato actual si embarazo.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/39690/FT_39690.html',
              items: [
                'Dosis: 500 mg.',
                'Vía: VO.',
                'Frecuencia: cada 6 h.',
                'Duración: 5 días.',
                'Evitar si: QT largo o interacciones relevantes.',
              ],
            },
            {
              id: 'nac-coamoxiclav',
              title: 'Amoxicilina/ácido clavulánico',
              type: 'treatment',
              summary: 'Alto riesgo, necesidad IV o vigilancia estrecha; asociar macrólido si procede.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/66765/FT_66765.html',
              items: [
                'Dosis: 500/125 mg VO o 1,2 g IV.',
                'Vía: VO o IV.',
                'Frecuencia: cada 8 h.',
                'Duración: 5 días si estabilidad clínica.',
                'Reevaluar: paso IV a VO a las 48 h si estable.',
              ],
            },
            {
              id: 'nac-levofloxacino',
              title: 'Levofloxacino',
              type: 'treatment',
              severity: 'warning',
              summary: 'Alternativa en alergia a penicilina en alto riesgo tras revisar seguridad.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/71603/FichaTecnica_71603.html',
              items: [
                'Dosis: 500 mg.',
                'Vía: VO o IV.',
                'Frecuencia: cada 12 h.',
                'Duración: 5 días.',
                'Evitar si: riesgo alto por fluoroquinolonas, QT/interacciones o ajuste renal no revisado.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-nac',
          title: 'Seguridad antes de prescribir',
          type: 'alert',
          severity: 'warning',
          items: protocol.warnings,
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo si estable, tolera vía oral y no cumple criterios de no alta segura.',
      points: [
        'Domicilio: bajo riesgo, SatO2 aceptable, tolerancia oral, apoyo y alarma explicada.',
        'Observación/unidad rápida: riesgo intermedio, necesidad de pruebas, tratamiento breve o reevaluación.',
        'Ingreso: alto riesgo, comorbilidad relevante, hipoxemia, mala tolerancia o no alta segura.',
        'UCI: fracaso respiratorio, shock, sepsis grave, deterioro neurológico o soporte ventilatorio.',
      ],
      detailNodes: [
        {
          id: 'destino-nac',
          title: 'Reevaluación y alta segura',
          type: 'decision',
          severity: 'success',
          items: [...protocol.noDischargeCriteria, ...protocol.reassessment].slice(0, 8),
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    pneumoniaOrdersSection(protocol),
    pneumoniaFindingsSection(protocol),
    pneumoniaTreatmentSection(protocol),
    pneumoniaFollowUpSection(protocol),
    referencesSection(protocol),
  ],
});

const buildSurgicalAbdomenFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Dolor abdominal con datos de irritación, obstrucción, perforación, sepsis o deterioro.',
      points: [
        'Pensar en abdomen quirúrgico ante defensa, rebote, dolor progresivo o dolor súbito intenso.',
        'Apendicitis, perforación, obstrucción, diverticulitis complicada, peritonitis y hernia complicada.',
        'Alarma: inestabilidad, sepsis, lactato elevado, neumoperitoneo, peritonismo o deterioro.',
      ],
      detailNodes: [
        {
          id: 'entrada-quirurgica',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.guardia?.clinica,
            'No tranquilizarse por exploración pobre en ancianos, inmunodeprimidos, alcohol/drogas, corticoides o analgesia previa.',
            'Reevaluar abdomen y constantes de forma seriada si el diagnóstico inicial no es claro.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Analítica dirigida e imagen solo si cambia cirugía, ingreso o diagnóstico diferencial.',
      points: [
        'Hemograma, bioquímica con creatinina/electrolitos, perfil hepático si procede y PCR/procalcitonina si sospecha infección.',
        'Gasometría venosa con lactato si sepsis, shock, acidosis, insuficiencia renal o sospecha vascular.',
        'Orina/tira reactiva y test de embarazo si procede; ECG/troponina si epigastralgia o riesgo cardiovascular.',
        'TC abdominal si duda grave, diverticulitis, obstrucción, perforación, apendicitis con eco no concluyente o complicación.',
      ],
      detailNodes: [
        {
          id: 'imagen-abdomen-quirurgico',
          title: 'Imagen que cambia conducta',
          type: 'step',
          items: [
            'Rx tórax/abdomen si sospecha neumoperitoneo, obstrucción o cuerpo extraño.',
            'Ecografía si colecistitis, hidronefrosis, aneurisma, hemoperitoneo, ectópico o irritación peritoneal sin origen claro.',
            'TC es la prueba más sensible en la mayoría de causas de abdomen agudo no obstétrico cuando el paciente está estable.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Separar observación segura de cirugía urgente, reanimación y UCI.',
      points: [
        'Peritonitis franca, neumoperitoneo, isquemia, sepsis sin foco alternativo o shock refractario: cirugía urgente.',
        'Estable pero sin diagnóstico claro: observación, estudio dirigido y reevaluación por cirugía.',
        'Diverticulitis no complicada radiológica y paciente sano/estable: valorar alta; complicada o grave: ingreso y antibiótico IV.',
        'Si sospecha apendicitis sin peritonitis: Alvarado ayuda a bajo/intermedio/alto riesgo y necesidad de imagen/cirugía.',
      ],
      actions: [calculatorAction('alvarado')],
      detailNodes: [
        {
          id: 'criterios-escalada-abdomen',
          title: 'Criterios que obligan a escalar',
          type: 'alert',
          severity: 'danger',
          items: [
            'Inestabilidad o repercusión hemodinámica.',
            'Neumoperitoneo o sospecha de perforación de víscera hueca.',
            'Dolor con signos de sepsis sin otra explicación.',
            'Sospecha de isquemia mesentérica.',
            'Obstrucción, hernia complicada o deterioro clínico.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Dieta absoluta, vía venosa, analgesia temprana, antiemético si precisa y antibiótico solo si indicado.',
      points: [
        'Dieta absoluta y vía venosa si cirugía, obstrucción, perforación, vómitos, sepsis o dolor moderado-grave.',
        'Paracetamol 1 g IV cada 6 h o metamizol 2 g IV cada 6 h si encaja seguridad.',
        'Metoclopramida 10 mg IM/IV cada 8 h si vómitos y no precisa sonda nasogástrica.',
        'Antibiótico IV si indicación quirúrgica/infección intraabdominal complicada: piperacilina-tazobactam 4/0,5 g IV cada 8 h; cada 6 h si muy grave.',
      ],
      treatmentGroups: [
        {
          id: 'medidas-iniciales',
          title: 'Medidas iniciales en Urgencias',
          cards: [
            {
              id: 'abdomen-dieta-via',
              title: 'Dieta absoluta + vía venosa',
              type: 'treatment',
              severity: 'warning',
              summary: 'Si cirugía probable, obstrucción, perforación, vómitos, sepsis o dolor moderado-grave.',
              items: [
                'Dosis: no farmacológica.',
                'Vía: venosa periférica si precisa analgesia IV, fluidos, antibiótico o quirófano.',
                'Frecuencia: reevaluación seriada tras cada intervención.',
                'Evitar si: no aplica.',
                'Reevaluar: abdomen, dolor, constantes, diuresis y lactato si gravedad.',
              ],
            },
            {
              id: 'abdomen-sonda',
              title: 'Sonda nasogástrica',
              type: 'treatment',
              severity: 'warning',
              summary: 'Si obstrucción de intestino delgado o dilatación gástrica aguda.',
              items: [
                'Dosis: descompresión con aspiración continua si está indicada.',
                'Vía: nasogástrica.',
                'Frecuencia: mantener mientras haya indicación y control clínico.',
                'Evitar si: no indicada o contraindicación local.',
                'Reevaluar: vómitos, distensión, dolor y balance.',
              ],
            },
          ],
        },
        {
          id: 'analgesia-antiemetico',
          title: 'Analgesia y vómitos',
          cards: [
            {
              id: 'abdomen-paracetamol',
              title: 'Paracetamol IV',
              type: 'treatment',
              summary: 'Dolor abdominal moderado si la vía oral no es adecuada.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/74477/FichaTecnica_74477.html',
              items: [
                'Dosis: 1 g.',
                'Vía: IV.',
                'Frecuencia: cada 6 h; intervalo mínimo 4 h si función renal normal.',
                'Máximo: 4 g/día si >50 kg sin riesgo hepatotóxico; 3 g/día si riesgo hepatotóxico.',
                'Evitar si: hepatopatía grave o sobredosis/uso concomitante de paracetamol.',
                'Reevaluar: dolor y exploración; la analgesia no debe retrasar la búsqueda de causa.',
              ],
            },
            {
              id: 'abdomen-metamizol',
              title: 'Metamizol magnésico IV',
              type: 'treatment',
              severity: 'warning',
              summary: 'Alternativa analgésica IV si encaja seguridad individual.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/63430/FT_63430.html',
              items: [
                'Dosis: 2 g.',
                'Vía: IV diluido en 100 mL de suero fisiológico.',
                'Frecuencia: cada 6 h.',
                'Máximo: 4 g/día habitual; ficha técnica permite hasta 5 g/día si necesario.',
                'Evitar si: alergia a pirazolonas, agranulocitosis previa, embarazo avanzado o inestabilidad sin monitorización.',
                'Reevaluar: dolor, tensión arterial y aparición de reacción adversa.',
              ],
            },
            {
              id: 'abdomen-metoclopramida',
              title: 'Metoclopramida',
              type: 'treatment',
              summary: 'Náuseas/vómitos si no está indicada la sonda nasogástrica.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/78556/FichaTecnica_78556.html',
              items: [
                'Dosis: 10 mg.',
                'Vía: IM o IV.',
                'Frecuencia: cada 8 h.',
                'Máximo: 30 mg/día en adultos.',
                'Evitar si: obstrucción/perforación digestiva, hemorragia digestiva, Parkinson o antecedente extrapiramidal relevante.',
                'Reevaluar: vómitos, tolerancia, QT/interacciones y necesidad de imagen o sonda.',
              ],
            },
          ],
        },
        {
          id: 'antibiotico-intraabdominal',
          title: 'Antibiótico si abdomen quirúrgico/infección complicada',
          cards: [
            {
              id: 'abdomen-piperacilina-tazobactam',
              title: 'Piperacilina/tazobactam',
              type: 'treatment',
              severity: 'danger',
              summary: 'Infección intraabdominal complicada, sepsis o gravedad; adaptar a protocolo local.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/68080/fichatecnica_68080.html',
              items: [
                'Dosis: 4 g/0,5 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 8 h; cada 6 h si infección particularmente grave.',
                'Máximo: ajustar por función renal; ClCr 20-40: 4/0,5 g cada 8 h; ClCr <20: 4/0,5 g cada 12 h.',
                'Evitar si: alergia a betalactámicos; revisar sodio y riesgo de BLEE según contexto.',
                'Reevaluar: cultivos si proceden, foco quirúrgico, función renal y desescalada.',
              ],
            },
            {
              id: 'abdomen-ertapenem',
              title: 'Ertapenem',
              type: 'treatment',
              severity: 'warning',
              summary: 'Alternativa IV descrita para infección intraabdominal cuando encaja microbiología/local.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/83230/FT_83230.html',
              items: [
                'Dosis: 1 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 24 h.',
                'Máximo: 1 g/día en adulto.',
                'Evitar si: alergia a carbapenémicos o sospecha de patógeno no cubierto.',
                'Reevaluar: necesidad de control de foco, función renal y desescalada.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-tratamiento-abdomen',
          title: 'Seguridad antes de prescribir',
          type: 'step',
          severity: 'warning',
          items: [
            'Confirmar alergias, embarazo posible, función renal/hepática, sangrado/anticoagulación y fragilidad.',
            'No iniciar antibiótico en todo dolor abdominal: reservar para indicación quirúrgica, sepsis, peritonitis, perforación o infección intraabdominal complicada.',
            'No retrasar quirófano por pruebas secundarias si hay inestabilidad o peritonitis franca.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo si estable, tolera, diagnóstico benigno probable y reevaluación clara.',
      points: [
        'Observación si dolor agudo estable pero diagnóstico incierto o requiere reevaluación por cirugía.',
        'Ingreso/cirugía si abdomen quirúrgico probable, peritonitis, obstrucción, perforación o mala evolución.',
        'UCI/Críticos si shock, sepsis grave, lactato elevado, acidosis o necesidad de soporte.',
        'Alta solo con constantes normales, vómitos controlados, tolerancia oral y signos de alarma explicados.',
      ],
      detailNodes: [
        {
          id: 'signos-alarma-alta-abdomen',
          title: 'Signos de alarma al alta',
          type: 'alert',
          severity: 'warning',
          items: [
            'Dolor que se focaliza o empeora al toser/estornudar, o no mejora en 24 h.',
            'Intolerancia oral o disminución de diuresis.',
            'Síncope, sangre en vómitos/heces, fiebre persistente, escalofríos o distensión.',
            'Cualquier síntoma nuevo o empeoramiento.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Analítica dirigida e imagen si cambia conducta.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Criterios de gravedad y decisión quirúrgica.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Pautas iniciales y tratamiento bajo demanda.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Destino y signos de alarma.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const buildHepatobiliaryPancreaticFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Epigastrio/hipocondrio derecho con vómitos, ictericia, fiebre o irradiación a espalda.',
      points: [
        'Cólico biliar: dolor HCD/epigastrio, náuseas y desencadenante graso, sin fiebre ni ictericia persistente.',
        'Colecistitis/colangitis: dolor prolongado, fiebre, escalofríos, Murphy, ictericia o colestasis.',
        'Pancreatitis: epigastralgia transfixiva o en cinturón, vómitos, alcohol/litiasis y lipasa/amilasa elevadas.',
        'Alarma: hipotensión, sepsis, ictericia febril, dolor persistente, hipoxemia, oliguria o mala perfusión.',
      ],
      detailNodes: [
        {
          id: 'entrada-hepatobiliar',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.guardia?.clinica,
            'En epigastralgia con factores cardiovasculares, ECG y troponina para no perder SCA inferior.',
            'En dolor HCD con fiebre/ictericia, asumir infección biliar hasta demostrar lo contrario.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Confirmar patrón biliar/pancreático y detectar infección, obstrucción o gravedad.',
      points: [
        'Hemograma, glucosa, urea/creatinina, iones, PCR/procalcitonina si infección, y perfil hepático con bilirrubina directa.',
        'Lipasa o amilasa si epigastralgia, vómitos o sospecha pancreática.',
        'Ecografía abdominal si sospecha biliar, colecistitis, colangitis, dilatación de vía biliar o ictericia.',
        'TC si pancreatitis grave, mala evolución, complicación, eco no concluyente o duda diagnóstica relevante.',
      ],
      detailNodes: [
        {
          id: 'resultados-hepatobiliar',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'Colestasis, hiperbilirrubinemia directa o dilatación de vía biliar orientan a coledocolitiasis/colangitis.',
            'Leucocitosis, PCR elevada, fiebre o sepsis apoyan colecistitis/colangitis o infección complicada.',
            'Hematocrito, urea/BUN, creatinina y lactato ayudan a valorar perfusión y reposición en pancreatitis.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Distinguir cólico resuelto de colecistitis/colangitis, pancreatitis grave o complicación.',
      points: [
        'Cólico biliar resuelto, afebril, analítica sin alarma y tolera: alta con alarma y circuito quirúrgico diferido si procede.',
        'Fiebre, ictericia, colangitis, colecistitis, pancreatitis o dolor persistente: observación/ingreso.',
        'Pancreatitis grave: hipoxemia, shock, oliguria, lactato alto, hematocrito elevado, fallo orgánico o mala perfusión.',
        'En pancreatitis: BISAP ayuda a identificar alto riesgo y necesidad de vigilancia estrecha/UCI.',
      ],
      actions: [calculatorAction('bisap')],
      detailNodes: [
        {
          id: 'escalada-hepatobiliar',
          title: 'Escalada urgente',
          type: 'alert',
          severity: 'danger',
          items: [
            'Digestivo/cirugía si fiebre con ictericia, sepsis, colecistitis, colangitis o coledocolitiasis obstructiva.',
            'UCI/Críticos si shock, hipoxemia, acidosis/lactato elevado, oliguria o fallo orgánico.',
            'No retrasar control de foco si colangitis grave o sepsis biliar.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Analgesia, vómitos y fluidos dirigidos; antibiótico solo si infección biliar/complicada.',
      points: [
        'Dieta absoluta si pancreatitis, colecistitis, colangitis, vómitos o procedimiento probable.',
        'Pancreatitis sin shock: Ringer lactato 2.500-3.000 mL/24 h ajustado a comorbilidad y respuesta.',
        'Si shock/hipoperfusión en pancreatitis: Ringer lactato 5-10 mL/kg/h hasta objetivos hemodinámicos.',
        'Metoclopramida 10 mg IV cada 8 h si vómitos; metamizol 2 g IV cada 8 h para dolor pancreático si encaja seguridad.',
        'Piperacilina/tazobactam 4/0,5 g IV cada 8 h en infección biliar complicada; cada 6 h si grave.',
      ],
      treatmentGroups: [
        {
          id: 'medidas-hepatobiliar',
          title: 'Medidas iniciales',
          cards: [
            {
              id: 'hbp-dieta-via',
              title: 'Dieta absoluta + vía venosa',
              type: 'treatment',
              severity: 'warning',
              summary: 'Pancreatitis, colecistitis, colangitis, vómitos persistentes o procedimiento probable.',
              items: [
                'Dosis: no farmacológica.',
                'Vía: venosa periférica si vómitos, dolor intenso, sepsis, pancreatitis o ingreso probable.',
                'Frecuencia: reevaluación seriada.',
                'Evitar si: no aplica.',
                'Reevaluar: dolor, vómitos, diuresis, constantes y necesidad de ingreso/procedimiento.',
              ],
            },
            {
              id: 'hbp-ringer-lactato',
              title: 'Ringer lactato',
              type: 'treatment',
              severity: 'warning',
              summary: 'Reposición inicial en pancreatitis, ajustada a comorbilidad y perfusión.',
              items: [
                'Dosis: 2.500-3.000 mL/24 h si no hay alteración hemodinámica.',
                'Vía: IV.',
                'Frecuencia/perfusión: 5-10 mL/kg/h si PAS <90 mmHg y FC >120 hasta objetivos.',
                'Máximo: evitar sobrecarga; ajustar por insuficiencia cardiaca, renal o respiratoria.',
                'Evitar si: hipercalcemia como causa de pancreatitis, donde Murillo prioriza salino fisiológico.',
                'Reevaluar: FC <120, PAM 65-85 mmHg, diuresis >0,5 mL/kg/h, hematocrito 35-44%, creatinina y lactato.',
              ],
            },
          ],
        },
        {
          id: 'analgesia-vomitos-hbp',
          title: 'Dolor y vómitos',
          cards: [
            {
              id: 'hbp-metamizol',
              title: 'Metamizol magnésico IV',
              type: 'treatment',
              severity: 'warning',
              summary: 'Escalón analgésico en pancreatitis/dolor intenso si encaja seguridad.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/63430/FT_63430.html',
              items: [
                'Dosis: 2 g.',
                'Vía: IV diluido en 100 mL de suero fisiológico.',
                'Frecuencia: cada 8 h en pancreatitis; cada 6 h en dolor abdominal general si procede.',
                'Máximo: 4 g/día habitual; ficha técnica permite hasta 5 g/día si necesario.',
                'Evitar si: alergia a pirazolonas, agranulocitosis previa, tercer trimestre de embarazo o inestabilidad sin monitorización.',
                'Reevaluar: dolor, TA y signos de reacción adversa.',
              ],
            },
            {
              id: 'hbp-metoclopramida',
              title: 'Metoclopramida',
              type: 'treatment',
              summary: 'Náuseas/vómitos si no precisa aspiración nasogástrica.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/78556/FichaTecnica_78556.html',
              items: [
                'Dosis: 10 mg.',
                'Vía: IV.',
                'Frecuencia: cada 8 h.',
                'Máximo: 30 mg/día en adultos.',
                'Evitar si: obstrucción/perforación digestiva, hemorragia digestiva, Parkinson o antecedente extrapiramidal relevante.',
                'Reevaluar: vómitos, QT/interacciones, tolerancia y necesidad de sonda.',
              ],
            },
          ],
        },
        {
          id: 'antibiotico-biliar',
          title: 'Antibiótico si infección biliar o pancreática complicada',
          cards: [
            {
              id: 'hbp-piperacilina-tazobactam',
              title: 'Piperacilina/tazobactam',
              type: 'treatment',
              severity: 'danger',
              summary: 'Colecistitis/colangitis complicada, sepsis biliar o pancreatitis infectada con indicación.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/68080/fichatecnica_68080.html',
              items: [
                'Dosis: 4 g/0,5 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 8 h; cada 6 h si infección particularmente grave.',
                'Máximo: ajustar por función renal; ClCr 20-40: 4/0,5 g cada 8 h; ClCr <20: 4/0,5 g cada 12 h.',
                'Evitar si: alergia a betalactámicos; revisar sodio y microbiología local.',
                'Reevaluar: hemocultivos si sepsis, control de foco, CPRE/cirugía si procede y desescalada.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-hbp',
          title: 'Seguridad antes de tratar',
          type: 'step',
          severity: 'warning',
          items: [
            'No usar antibiótico profiláctico en pancreatitis aguda sin infección: reservar para infección confirmada, gas en TC, colangitis u otra infección.',
            'Revisar alergias, embarazo, función renal/hepática, QT/interacciones, riesgo de sobrecarga y necesidad de control de foco.',
            'Si hay criterios de gravedad, vómitos frecuentes o íleo, valorar sonda nasogástrica con aspiración continua.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo en cólico biliar resuelto, estable y sin datos de infección u obstrucción.',
      points: [
        'Alta: cólico biliar resuelto, afebril, sin ictericia, tolera vía oral y revisión diferida/cirugía programada si procede.',
        'Observación/ingreso: dolor persistente, vómitos, pancreatitis, colecistitis, colangitis o ictericia obstructiva.',
        'Digestivo/cirugía: colangitis, coledocolitiasis, colecistitis, absceso, complicación o necesidad de CPRE/procedimiento.',
        'UCI: shock, sepsis grave, hipoxemia, oliguria, acidosis/lactato elevado o fallo orgánico.',
      ],
      detailNodes: [
        {
          id: 'alarma-hbp-alta',
          title: 'Signos de alarma',
          type: 'alert',
          severity: 'warning',
          items: [
            'Fiebre, escalofríos, ictericia, coluria, acolia o prurito intenso.',
            'Dolor persistente o progresivo, vómitos, intolerancia oral o síncope.',
            'Disnea, confusión, oliguria, mareo intenso o deterioro general.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Perfil biliar/pancreático e imagen dirigida.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Criterios de infección, obstrucción o pancreatitis grave.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Pautas iniciales y tratamiento bajo demanda.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Destino según gravedad y tolerancia.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const buildUrinaryAbdominalPainFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Flanco/hipogastrio con cólico, hematuria, disuria, fiebre, vómitos o retención.',
      points: [
        'Cólico renal: dolor en flanco irradiado a ingle, cortejo vegetativo y microhematuria frecuente.',
        'ITU alta/pielonefritis: fiebre, dolor lumbar, puñopercusión, mal estado o sepsis.',
        'Complicado: monorreno, embarazo, varón, anciano, diabetes, inmunosupresión, IR, obstrucción o sonda/manipulación.',
        'Alarma: fiebre con obstrucción, fracaso renal, anuria/oliguria, dolor no controlado, sepsis o vómitos persistentes.',
      ],
      detailNodes: [
        {
          id: 'entrada-urinaria',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.guardia?.clinica,
            'No dar alta si hay fiebre, obstrucción infectada, monorreno, fracaso renal, embarazo o dolor/vómitos no controlados.',
            'Separar dolor cólico no complicado de infección urinaria alta o derivación urológica urgente.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Orina, función renal e imagen solo si cambia alta, antibiótico, contraste o derivación.',
      points: [
        'Tira/sedimento de orina; urocultivo si fiebre, ITU alta, complicada, embarazo, sepsis o antibiótico.',
        'Creatinina, urea, iones, hemograma y PCR si fiebre, ingreso, comorbilidad, monorreno o duda de alta.',
        'Test de embarazo si procede antes de imagen, AINE o antibiótico.',
        'Ecografía/TC si cólico complicado, fiebre, monorreno, fracaso renal, dolor persistente, duda diagnóstica o mala evolución.',
      ],
      detailNodes: [
        {
          id: 'imagen-urinaria',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'Hidronefrosis con fiebre o sepsis obliga a urología urgente y derivación/desobstrucción.',
            'Creatinina elevada o ClCr bajo condiciona AINE, contraste y dosis antibiótica.',
            'Piuria/nitritos con fiebre orientan a ITU alta; microhematuria apoya cólico pero no excluye apendicitis/diverticulitis cercana.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Alta solo si cólico no complicado, afebril, función renal segura y dolor controlado.',
      points: [
        'Cólico no complicado: afebril, dolor controlado, tolera VO, función renal sin alarma y plan de alta claro.',
        'Ingreso/observación: dolor o vómitos persistentes, fiebre, monorreno, IR, embarazo, fragilidad o diagnóstico incierto.',
        'Urología urgente: obstrucción infectada, anuria/oliguria, monorreno obstruido, sepsis, fracaso renal o dolor intratable.',
        'Calcular Cockcroft-Gault si AINE, antibiótico, contraste o ingreso dependen de función renal.',
      ],
      actions: [calculatorAction('cockcroft-gault')],
      detailNodes: [
        {
          id: 'criterios-urologia',
          title: 'Criterios de escalada',
          type: 'alert',
          severity: 'danger',
          items: [
            'Fiebre/sepsis con obstrucción: antibiótico IV y valoración urológica urgente.',
            'Retención urinaria: sondaje vesical si procede; si prostatitis aguda con retención, valorar cistostomía para evitar manipulación uretral.',
            'Cólico con fracaso renal, monorreno, embarazo o dolor no controlado: no alta desde urgencias.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'AINE como primera línea si función renal y seguridad lo permiten; antibiótico solo si infección.',
      points: [
        'Dexketoprofeno 50 mg IM/IV cada 8-12 h para cólico renal; máximo 150 mg/día y no más de 2 días IV.',
        'Paracetamol 1 g IV cada 6 h o metamizol 2 g IV/IM si AINE contraindicado o como rescate.',
        'Metoclopramida 10 mg IV cada 8 h u ondansetrón 4-8 mg IV cada 12 h si vómitos.',
        'Pielonefritis no complicada alta: ceftriaxona 1 g IM/IV dosis única y cefixima 400 mg VO cada 24 h hasta completar 7 días según cultivo.',
        'Pielonefritis complicada o ITU alta con ingreso: ceftriaxona 2 g IV cada 24 h; sepsis grave: piperacilina/tazobactam 4/0,5 g IV cada 6-8 h.',
      ],
      treatmentGroups: [
        {
          id: 'colico-renal',
          title: 'Cólico renal',
          cards: [
            {
              id: 'urinario-dexketoprofeno',
              title: 'Dexketoprofeno',
              type: 'treatment',
              severity: 'warning',
              summary: 'Primera línea si no hay contraindicación renal, hemorrágica, digestiva o embarazo avanzado.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/77962/FichaTecnica_77962.html',
              items: [
                'Dosis: 50 mg.',
                'Vía: IM o IV diluido en 100 mL de suero fisiológico si perfusión.',
                'Frecuencia: cada 8-12 h; repetir a las 6 h si necesario.',
                'Duración: periodo sintomático agudo; IV no más de 2 días.',
                'Máximo: 150 mg/día.',
                'Evitar si: ClCr <50 mL/min, sangrado/úlcera activa, alergia a AINE, insuficiencia cardiaca grave o embarazo avanzado.',
                'Reevaluar: dolor, TA, función renal, vómitos y necesidad de imagen/derivación.',
              ],
            },
            {
              id: 'urinario-paracetamol',
              title: 'Paracetamol IV',
              type: 'treatment',
              summary: 'Alternativa o coadyuvante si AINE no encaja.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/74477/FichaTecnica_74477.html',
              items: [
                'Dosis: 1 g.',
                'Vía: IV.',
                'Frecuencia: cada 6 h.',
                'Máximo: 4 g/día si >50 kg sin riesgo hepatotóxico; 3 g/día si riesgo hepatotóxico.',
                'Evitar si: hepatopatía grave o uso concomitante de paracetamol.',
                'Reevaluar: dolor y necesidad de rescate.',
              ],
            },
            {
              id: 'urinario-metamizol',
              title: 'Metamizol magnésico',
              type: 'treatment',
              severity: 'warning',
              summary: 'Rescate analgésico si encaja seguridad individual.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/63430/FT_63430.html',
              items: [
                'Dosis: 2 g.',
                'Vía: IM en asistencia inicial; IV diluido si ingreso o precisa perfusión.',
                'Frecuencia: cada 8 h si ingreso; cada 6 h según dolor y seguridad.',
                'Máximo: 4 g/día habitual; ficha técnica permite hasta 5 g/día si necesario.',
                'Evitar si: alergia a pirazolonas, agranulocitosis previa, tercer trimestre de embarazo o inestabilidad sin monitorización.',
                'Reevaluar: dolor, TA y hemograma si síntomas de discrasia.',
              ],
            },
          ],
        },
        {
          id: 'vomitos-retencion',
          title: 'Vómitos y retención',
          cards: [
            {
              id: 'urinario-metoclopramida',
              title: 'Metoclopramida',
              type: 'treatment',
              summary: 'Vómitos que impiden hidratación, analgesia o alta segura.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/78556/FichaTecnica_78556.html',
              items: [
                'Dosis: 10 mg.',
                'Vía: IV.',
                'Frecuencia: cada 8 h.',
                'Máximo: 30 mg/día en adultos.',
                'Evitar si: obstrucción/perforación digestiva, Parkinson, epilepsia o antecedente extrapiramidal relevante.',
                'Reevaluar: tolerancia oral, QT/interacciones y necesidad de observación.',
              ],
            },
            {
              id: 'urinario-sondaje',
              title: 'Sondaje vesical',
              type: 'treatment',
              severity: 'warning',
              summary: 'Retención urinaria con globo o imposibilidad miccional.',
              items: [
                'Dosis: no farmacológica.',
                'Vía: uretral si procede; cistostomía si prostatitis aguda con retención y criterio urológico.',
                'Frecuencia: intervención única con control de diuresis.',
                'Evitar si: sospecha de lesión uretral o contraindicación local.',
                'Reevaluar: dolor, diuresis, hematuria, infección y necesidad de urología.',
              ],
            },
          ],
        },
        {
          id: 'itu-alta-pielonefritis',
          title: 'ITU alta / pielonefritis',
          cards: [
            {
              id: 'urinario-ceftriaxona',
              title: 'Ceftriaxona',
              type: 'treatment',
              severity: 'danger',
              summary: 'Pielonefritis no complicada inicial o complicada sin riesgo multirresistente grave.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/66753/FichaTecnica_66753.html',
              items: [
                'Dosis: 1 g IM/IV dosis única si alta; 2 g IV si ingreso/complicada.',
                'Vía: IM o IV.',
                'Frecuencia: dosis única si alta; cada 24 h si ingreso.',
                'Duración: continuar VO según urocultivo hasta completar 7 días en no complicada; ajustar en complicada.',
                'Máximo: 4 g/día según ficha técnica; no exceder 2 g/día si fracaso renal preterminal con disfunción hepática.',
                'Evitar si: alergia a cefalosporinas/betalactámicos relevante.',
                'Reevaluar: fiebre, sepsis, urocultivo, función renal y obstrucción.',
              ],
            },
            {
              id: 'urinario-cefixima',
              title: 'Cefixima',
              type: 'treatment',
              summary: 'Continuación oral en pielonefritis no complicada tras dosis inicial y urocultivo.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/66397/fichatecnica_66397.htm',
              items: [
                'Dosis: 400 mg.',
                'Vía: VO.',
                'Frecuencia: cada 24 h.',
                'Duración: hasta completar 7 días según Murillo; ficha técnica recoge 10 días para algunas indicaciones.',
                'Máximo: 400 mg/día; reducir a la mitad si ClCr <=20 mL/min.',
                'Evitar si: alergia a cefalosporinas/betalactámicos relevante.',
                'Reevaluar: urocultivo, fiebre, tolerancia oral y evolución en 48-72 h.',
              ],
            },
            {
              id: 'urinario-piperacilina-tazobactam',
              title: 'Piperacilina/tazobactam',
              type: 'treatment',
              severity: 'danger',
              summary: 'Sepsis grave/shock séptico o riesgo de infección complicada según contexto local.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/68080/fichatecnica_68080.html',
              items: [
                'Dosis: 4 g/0,5 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 6-8 h.',
                'Máximo: ajustar por función renal; ClCr 20-40: 4/0,5 g cada 8 h; ClCr <20: 4/0,5 g cada 12 h.',
                'Evitar si: alergia a betalactámicos; revisar BLEE/microbiología local.',
                'Reevaluar: urocultivo/hemocultivos, foco obstructivo, lactato, función renal y desescalada.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-urinaria',
          title: 'Seguridad antes de tratar',
          type: 'step',
          severity: 'warning',
          items: [
            'Confirmar alergias, embarazo, función renal, monorreno, anticoagulación/sangrado y riesgo digestivo antes de AINE o antibiótico.',
            'No forzar sobrehidratación en cólico renal no complicado; hidratar según tolerancia y estado clínico.',
            'Si fiebre + obstrucción, el antibiótico no sustituye la desobstrucción: avisar urología.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo con dolor controlado, afebril, tolerancia oral y función renal segura.',
      points: [
        'Alta: cólico no complicado, afebril, sin obstrucción infectada, tolera VO y analgesia efectiva.',
        'Observación: dolor/vómitos persistentes, diagnóstico incierto, necesidad de imagen o reevaluación.',
        'Ingreso/urología: fiebre, pielonefritis complicada, obstrucción, monorreno, embarazo, IR, sepsis o retención compleja.',
        'UCI: shock séptico, lactato elevado, hipotensión, deterioro neurológico o necesidad de soporte.',
      ],
      detailNodes: [
        {
          id: 'alarma-urinaria-alta',
          title: 'Signos de alarma',
          type: 'alert',
          severity: 'warning',
          items: [
            'Fiebre, escalofríos, dolor no controlado, vómitos persistentes o anuria/oliguria.',
            'Hematuria intensa, síncope, deterioro general o intolerancia a la medicación.',
            'Volver a urgencias si no mejora o aparece clínica infecciosa tras alta por cólico.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Orina, función renal e imagen si cambia conducta.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Separar cólico no complicado de infección/obstrucción.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Pautas iniciales y antibiótico si infección.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Destino según dolor, fiebre, riñón y obstrucción.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const buildGynecologicAbdominalPainFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Dolor pélvico o bajo abdomen: primero descartar embarazo ectópico, torsión y sangrado.',
      points: [
        'Ectópico: amenorrea, metrorragia y dolor; puede presentarse sin clínica clásica.',
        'Torsión: dolor anexial brusco intenso, náuseas/vómitos y masa/quiste conocido o sospechado.',
        'EPI: dolor bajo, fiebre, flujo, dolor cervical/anexial, sangrado o riesgo ITS.',
        'Alarma: test de embarazo positivo con dolor/sangrado, síncope, hipotensión, palidez, fiebre o defensa.',
      ],
      detailNodes: [
        {
          id: 'entrada-ginecologica',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.guardia?.clinica,
            'El embarazo ectópico puede simular cualquier proceso ginecológico; no dar alta sin orientar embarazo si es posible.',
            'Torsión y ectópico inestable son tiempo-dependientes: avisar ginecología sin esperar pruebas secundarias.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Test de embarazo, hemograma y ecografía si cambian cirugía, ingreso o antibiótico.',
      points: [
        'Test de embarazo obligatorio si posibilidad de gestación; β-HCG si positivo o duda diagnóstica.',
        'Hemograma, grupo/Rh y coagulación si sangrado, síncope, embarazo positivo, mal estado o cirugía probable.',
        'PCR/VSG y microbiología ITS si sospecha EPI; VIH, clamidia y gonorrea cuando cambien tratamiento o continuidad.',
        'Ecografía ginecológica/transvaginal si ectópico, torsión, quiste complicado, EPI complicada o diagnóstico incierto.',
      ],
      detailNodes: [
        {
          id: 'resultados-ginecologia',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'β-HCG positiva sin saco intrauterino con cifras por encima del umbral local obliga a descartar ectópico.',
            'Líquido libre, masa anexial, dolor intenso o signos de shock orientan a cirugía/valoración urgente.',
            'Absceso tuboovárico, peritonitis pélvica o mala evolución en EPI obligan a ingreso.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Separar alta segura de ectópico/torsión/EPI complicada con ingreso.',
      points: [
        'Inestable o shock con sospecha de ectópico: reanimación y ginecología/quirófano urgente.',
        'Torsión probable: ginecología urgente aunque la ecografía no sea definitiva.',
        'EPI al alta solo si estadio leve, diagnóstico claro, tolera VO y sin criterios de ingreso.',
        'Ingreso si embarazo, vómitos, T >=39 °C, diagnóstico incierto, reacción peritoneal, absceso o falta de respuesta en 48-72 h.',
      ],
      detailNodes: [
        {
          id: 'criterios-ingreso-gine',
          title: 'Criterios de ingreso o derivación urgente',
          type: 'alert',
          severity: 'danger',
          items: [
            'Embarazo positivo con dolor/sangrado, síncope, hipotensión o signos de abdomen agudo.',
            'Torsión probable, sangrado significativo, piosálpinx, absceso ovárico/tuboovárico o reacción peritoneal.',
            'EPI con embarazo, náuseas/vómitos, temperatura >=39 °C, inmunodepresión, diagnóstico incierto o no respuesta.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Estabilizar primero; analgesia segura y antibiótico concreto solo si EPI leve al alta.',
      points: [
        'Ectópico inestable: decúbito, dos vías venosas, cristaloide según hemodinámica y ginecología/quirófano.',
        'Paracetamol 1 g IV cada 6 h o metamizol 2 g IV/IM si encaja embarazo y seguridad.',
        'EPI leve al alta: ceftriaxona 250 mg IM dosis única + doxiciclina 100 mg VO cada 12 h + metronidazol 500 mg VO cada 12 h 14 días.',
        'Si EPI complicada, embarazo, absceso, vómitos o mala evolución: ingreso y pauta parenteral por ginecología.',
      ],
      treatmentGroups: [
        {
          id: 'estabilizacion-gine',
          title: 'Ectópico/torsión/sangrado',
          cards: [
            {
              id: 'gine-estabilizacion',
              title: 'Estabilización inicial',
              type: 'treatment',
              severity: 'danger',
              summary: 'Si shock, síncope, ectópico roto probable, sangrado o abdomen agudo.',
              items: [
                'Dosis: no farmacológica.',
                'Vía: dos vías venosas si inestable; cristaloide según situación hemodinámica.',
                'Frecuencia: monitorización continua si shock o sangrado.',
                'Evitar si: no retrasar ginecología/quirófano por pruebas secundarias.',
                'Reevaluar: TA, FC, perfusión, dolor, sangrado, Hb y necesidad de hemoderivados/procedimiento.',
              ],
            },
            {
              id: 'gine-paracetamol',
              title: 'Paracetamol IV',
              type: 'treatment',
              summary: 'Analgesia inicial si precisa vía IV.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/74477/FichaTecnica_74477.html',
              items: [
                'Dosis: 1 g.',
                'Vía: IV.',
                'Frecuencia: cada 6 h.',
                'Máximo: 4 g/día si >50 kg sin riesgo hepatotóxico; 3 g/día si riesgo hepatotóxico.',
                'Evitar si: hepatopatía grave o uso concomitante de paracetamol.',
                'Reevaluar: dolor, abdomen y necesidad de ginecología urgente.',
              ],
            },
          ],
        },
        {
          id: 'epi-al-alta',
          title: 'EPI leve al alta',
          cards: [
            {
              id: 'gine-ceftriaxona',
              title: 'Ceftriaxona',
              type: 'treatment',
              severity: 'warning',
              summary: 'Pauta de alta de EPI leve junto a doxiciclina y metronidazol.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/62639/FichaTecnica_62639.html',
              items: [
                'Dosis: 250 mg.',
                'Vía: IM.',
                'Frecuencia: dosis única.',
                'Duración: dosis única; el resto de pauta continúa 14 días.',
                'Evitar si: alergia a cefalosporinas/betalactámicos relevante.',
                'Reevaluar: mejoría clínica en 48-72 h; ingresar si no mejora.',
              ],
            },
            {
              id: 'gine-doxiciclina',
              title: 'Doxiciclina',
              type: 'treatment',
              severity: 'warning',
              summary: 'Pauta de alta de EPI leve junto a ceftriaxona y metronidazol.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/50404/FichaTecnica_50404.html',
              items: [
                'Dosis: 100 mg.',
                'Vía: VO.',
                'Frecuencia: cada 12 h.',
                'Duración: 14 días.',
                'Evitar si: embarazo o alergia a tetraciclinas.',
                'Reevaluar: adherencia, tolerancia y resultado de microbiología/ITS.',
              ],
            },
            {
              id: 'gine-metronidazol',
              title: 'Metronidazol',
              type: 'treatment',
              severity: 'warning',
              summary: 'Cobertura anaerobia en EPI leve tratable al alta.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/84614/FT_84614.html',
              items: [
                'Dosis: 500 mg.',
                'Vía: VO.',
                'Frecuencia: cada 12 h.',
                'Duración: 14 días.',
                'Evitar si: hipersensibilidad; evitar alcohol durante tratamiento.',
                'Reevaluar: tolerancia digestiva y respuesta en 48-72 h.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-gine',
          title: 'Seguridad antes de tratar',
          type: 'step',
          severity: 'warning',
          items: [
            'Confirmar embarazo, alergias, función renal/hepática, sangrado, anticoagulación y gravedad antes de analgésicos o antibiótico.',
            'No dar alta con EPI si embarazo, vómitos, absceso, reacción peritoneal, T >=39 °C o diagnóstico incierto.',
            'Avisar ginecología urgente si ectópico o torsión probable, incluso con exploración inicial poco expresiva.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo con embarazo urgente descartado, estabilidad y revisión clara.',
      points: [
        'Ginecología/quirófano: ectópico inestable, torsión probable, sangrado importante o abdomen agudo.',
        'Ingreso: EPI complicada, embarazo, absceso, vómitos, fiebre alta, mala evolución o diagnóstico incierto.',
        'Alta: dolor leve/controlado, estable, embarazo urgente descartado si procede y plan de revisión.',
        'Revisión en 48-72 h si EPI tratada al alta; antes si empeora.',
      ],
      detailNodes: [
        {
          id: 'alarma-gine-alta',
          title: 'Signos de alarma',
          type: 'alert',
          severity: 'warning',
          items: [
            'Síncope, mareo intenso, sangrado, fiebre, dolor creciente, vómitos o deterioro.',
            'Test de embarazo positivo, nueva metrorragia o dolor unilateral intenso.',
            'No mejoría de EPI en 48-72 h o intolerancia al antibiótico.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Embarazo, sangrado, infección e imagen si cambia conducta.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Descartar ectópico/torsión e identificar EPI complicada.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Estabilización y pautas bajo demanda.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Destino según embarazo, estabilidad e infección.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const buildVascularAbdominalPainFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Dolor abdominal brusco, desproporcionado o con shock: pensar en isquemia, aneurisma o disección.',
      points: [
        'Isquemia mesentérica: dolor intenso/desproporcionado, FA, embolia, aterosclerosis, lactato o acidosis.',
        'Aneurisma/disección: dolor súbito abdominal/lumbar, síncope, hipotensión, masa pulsátil o riesgo vascular.',
        'No tranquilizarse por exploración pobre si el dolor es desproporcionado o el paciente está anticoagulado/frágil.',
        'Alarma: shock, síncope, lactato elevado, acidosis, peritonismo, sangrado o deterioro.',
      ],
      detailNodes: [
        {
          id: 'entrada-vascular',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'danger',
          items: [
            protocol.guardia?.clinica,
            'La sospecha vascular es tiempo-dependiente: avisar vascular/cirugía/UCI desde la valoración inicial.',
            'Mantener alta sospecha en FA, aterosclerosis, edad avanzada, bajo gasto, vasopresores o dolor posprandial previo.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Confirmar perfusión y pedir angio-TC sin retrasar soporte ni aviso especializado.',
      points: [
        'Monitorización, constantes, ECG si FA/riesgo cardiaco, dos vías venosas si inestable.',
        'Gasometría venosa/arterial con lactato, hemograma, coagulación, bioquímica/creatinina, iones y grupo/reserva si shock.',
        'Angio-TC abdominal urgente si sospecha vascular y situación lo permite.',
        'Ecografía a pie de cama puede orientar aneurisma/hemoperitoneo, pero no descarta isquemia mesentérica.',
      ],
      detailNodes: [
        {
          id: 'resultados-vascular',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'Lactato/acidosis o deterioro elevan prioridad, pero un lactato normal no excluye isquemia mesentérica inicial.',
            'Creatinina condiciona contraste, pero no debe bloquear angio-TC si la sospecha vital es alta.',
            'Peritonismo o neumatosis/necrosis sugieren laparotomía urgente y control de foco.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Inestable o sospecha alta: circuito crítico vascular, no observación pasiva.',
      points: [
        'Sospecha de isquemia mesentérica: angio-TC urgente y equipo interdisciplinar para reperfusión/cirugía.',
        'Peritonitis, shock o necrosis probable: cirugía urgente; UCI si soporte hemodinámico o acidosis.',
        'Aneurisma roto/disección sospechada: vascular/cirugía y control hemodinámico según protocolo local.',
        'No iniciar anticoagulación si sangrado activo, disección/aneurisma roto probable o contraindicación: decidir con vascular/cirugía.',
      ],
      detailNodes: [
        {
          id: 'criterios-vascular',
          title: 'Criterios de máxima prioridad',
          type: 'alert',
          severity: 'danger',
          items: [
            'Dolor desproporcionado + FA/riesgo embolígeno.',
            'Hipotensión, síncope, anemia aguda o sospecha de rotura aneurismática.',
            'Acidosis, lactato elevado, peritonismo o deterioro durante observación.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Soporte, analgesia, antibiótico/heparina solo si el escenario vascular lo justifica.',
      points: [
        'Dos vías venosas, monitorización, oxígeno si precisa y cristaloide si shock evitando sobrecarga.',
        'Morfina 2,5-15 mg IV lenta titulada si dolor intenso y monitorización.',
        'Isquemia mesentérica aguda: antibiótico amplio precoz; piperacilina/tazobactam 4/0,5 g IV cada 6-8 h.',
        'Heparina sódica IV si isquemia mesentérica/embolismo arterial y no contraindicación: bolo 80 UI/kg y 18 UI/kg/h ajustado a TTPA.',
      ],
      treatmentGroups: [
        {
          id: 'soporte-vascular',
          title: 'Soporte inicial',
          cards: [
            {
              id: 'vascular-soporte',
              title: 'Monitorización + dos vías venosas',
              type: 'treatment',
              severity: 'danger',
              summary: 'Sospecha vascular, shock, síncope, acidosis o dolor desproporcionado.',
              items: [
                'Dosis: no farmacológica.',
                'Vía: dos vías venosas periféricas; valorar vía central/arterial en críticos.',
                'Frecuencia: monitorización continua si inestable.',
                'Evitar si: no retrasar angio-TC ni valoración vascular/cirugía.',
                'Reevaluar: TA, FC, perfusión, diuresis, dolor, lactato y necesidad de UCI.',
              ],
            },
            {
              id: 'vascular-cristaloide',
              title: 'Cristaloide IV',
              type: 'treatment',
              severity: 'warning',
              summary: 'Shock o hipoperfusión, con objetivos de perfusión y control de sobrecarga.',
              items: [
                'Dosis: bolos pequeños según TA, perfusión, lactato y comorbilidad.',
                'Vía: IV.',
                'Frecuencia: reevaluación tras cada bolo.',
                'Máximo: evitar sobrecarga que empeore perfusión intestinal o respiración.',
                'Reevaluar: PAM, diuresis, lactato, crepitantes y necesidad de vasopresor/UCI.',
              ],
            },
          ],
        },
        {
          id: 'dolor-vascular-tratamiento',
          title: 'Dolor intenso',
          cards: [
            {
              id: 'vascular-morfina',
              title: 'Morfina',
              type: 'treatment',
              severity: 'warning',
              summary: 'Dolor vascular intenso con monitorización y reevaluación frecuente.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/42221/FichaTecnica_42221.html',
              items: [
                'Dosis: 2,5-15 mg titulados según respuesta.',
                'Vía: IV lenta durante 4-5 min.',
                'Frecuencia: individualizar; titular con dosis pequeñas y reevaluación.',
                'Máximo: individualizar según respuesta, edad, función renal/respiratoria y sedación.',
                'Evitar si: depresión respiratoria, hipotensión no controlada, bajo nivel de conciencia o alto riesgo sin monitorización.',
                'Reevaluar: dolor, FR, SatO2, TA, sedación y necesidad de antídoto/soporte.',
              ],
            },
          ],
        },
        {
          id: 'isquemia-mesenterica',
          title: 'Isquemia mesentérica aguda',
          cards: [
            {
              id: 'vascular-piperacilina-tazobactam',
              title: 'Piperacilina/tazobactam',
              type: 'treatment',
              severity: 'danger',
              summary: 'Antibiótico amplio precoz en isquemia mesentérica aguda o sepsis abdominal vascular.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/68080/fichatecnica_68080.html',
              items: [
                'Dosis: 4 g/0,5 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 6-8 h.',
                'Máximo: ajustar por función renal; ClCr 20-40: 4/0,5 g cada 8 h; ClCr <20: 4/0,5 g cada 12 h.',
                'Evitar si: alergia a betalactámicos; adaptar a microbiología local.',
                'Reevaluar: control de foco, lactato, función renal, cultivos si sepsis y desescalada.',
              ],
            },
            {
              id: 'vascular-heparina-sodica',
              title: 'Heparina sódica IV',
              type: 'treatment',
              severity: 'danger',
              summary: 'Si isquemia mesentérica/embolismo arterial y no hay contraindicación hemorrágica.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/56029/FichaTecnica_56029.html',
              calculatorId: 'vascular-heparin-dose',
              items: [
                'Dosis: bolo inicial 80 UI/kg IV o 5.000 UI independientemente del peso.',
                'Vía: IV.',
                'Frecuencia/perfusión: 18 UI/kg/h o 1.300 UI/h, ajustando a TTPA.',
                'Máximo: objetivo TTPA 1,5-2,5 veces control; individualizar por protocolo local.',
                'Evitar si: sangrado activo, aneurisma roto/disección con hemorragia probable, cirugía inmediata sin consenso o contraindicación.',
                'Reevaluar: TTPA, sangrado, plaquetas, necesidad de revascularización y decisión vascular/cirugía.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-vascular',
          title: 'Seguridad antes de anticoagular',
          type: 'step',
          severity: 'warning',
          items: [
            'Confirmar escenario: isquemia mesentérica/embolismo arterial frente a aneurisma roto, disección o sangrado.',
            'Revisar anticoagulación previa, plaquetas, coagulación, sangrado activo, cirugía inmediata y función renal.',
            'La heparina no sustituye angio-TC, revascularización, laparotomía ni control de foco si están indicados.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Ingreso urgente; UCI si inestable, acidosis, lactato elevado o soporte.',
      points: [
        'Ingreso urgente en todo dolor vascular probable aunque mejore inicialmente.',
        'Vascular/cirugía: isquemia mesentérica, aneurisma, disección, trombosis/embolia visceral o peritonismo.',
        'UCI/Críticos: shock, lactato/acidosis, hipoxemia, vasopresor, sangrado o fallo orgánico.',
        'No alta desde urgencias si persiste sospecha vascular o no se ha completado estudio/valoración especializada.',
      ],
      detailNodes: [
        {
          id: 'seguimiento-vascular',
          title: 'Reevaluación',
          type: 'alert',
          severity: 'danger',
          items: [
            'Control seriado de dolor, abdomen, perfusión, TA, FC, diuresis, lactato y gasometría.',
            'Escalar ante dolor creciente, defensa, hipotensión, acidosis o aumento de lactato.',
            'Documentar tiempos: sospecha, angio-TC, aviso a vascular/cirugía y tratamiento inicial.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Lactato, función renal, coagulación y angio-TC urgente.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Criterios de isquemia, rotura, shock o cirugía.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Soporte, antibiótico/heparina si procede y especialista.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Ingreso urgente y UCI si inestable.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const buildInfectiousDigestiveAbdominalPainFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Fiebre, diarrea, dolor localizado o mal estado: distinguir cuadro leve de sepsis/complicación.',
      points: [
        'GEA leve: diarrea/vómitos con tolerancia parcial, sin sangre, sin sepsis ni dolor focal intenso.',
        'Inflamatoria/complicada: fiebre, sangre, escalofríos, dolor localizado, inmunosupresión o duración >1 semana.',
        'Diverticulitis: dolor FII continuo, fiebre, masa/empastamiento o PCR/leucocitosis.',
        'Alarma: sepsis, deshidratación, inmunosupresión, dolor focal intenso, peritonismo, absceso o mala evolución.',
      ],
      detailNodes: [
        {
          id: 'entrada-infeccioso-digestiva',
          title: 'Entrada clínica',
          type: 'alert',
          severity: 'warning',
          items: [
            protocol.guardia?.clinica,
            'No todo dolor con diarrea necesita antibiótico; primero valorar gravedad, deshidratación, foco y riesgo.',
            'En inmunosupresión, ancianos o comorbilidad relevante, bajar umbral para analítica, imagen y observación.',
          ].filter(Boolean),
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Analítica y microbiología solo si cambian antibiótico, ingreso o aislamiento.',
      points: [
        'Constantes, hidratación, diuresis y exploración abdominal seriada si dolor localizado.',
        'Hemograma, bioquímica/creatinina, iones y PCR si gravedad, fragilidad, fiebre, sangre, ingreso o mala tolerancia.',
        'Gasometría/lactato y hemocultivos si sepsis, shock o mala perfusión.',
        'Coprocultivo/toxina C. difficile solo si sangre, fiebre alta, brote, inmunosupresión, antibiótico reciente o cambia conducta.',
        'TC si diverticulitis complicada, dolor focal intenso, sepsis, inmunosupresión, absceso o mala evolución.',
      ],
      detailNodes: [
        {
          id: 'resultados-infeccioso-digestivo',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'Hipotensión, confusión, lactato elevado, oliguria o mala perfusión obligan a manejo de sepsis.',
            'Absceso, perforación, obstrucción, peritonismo o diverticulitis complicada cambian a ingreso/cirugía.',
            'Insuficiencia renal o deshidratación modifica fluidos, AINE y antibióticos.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Alta si leve y tolera; ingreso si sepsis, deshidratación, inmunosupresión o complicación.',
      points: [
        'Leve, estable, sin sangre ni alarma y tolera VO: rehidratación oral y alta con alarma.',
        'Mala tolerancia, deshidratación, dolor persistente o diagnóstico incierto: observación y reevaluación.',
        'Sepsis, inmunosupresión, diverticulitis complicada, absceso o peritonismo: ingreso y antibiótico/imagen.',
        'Sepsis clínica, hipoperfusión o lactato elevado: ingreso, antibiótico precoz si foco probable y valorar UCI.',
      ],
      detailNodes: [
        {
          id: 'criterios-ingreso-infeccioso',
          title: 'Criterios de ingreso',
          type: 'alert',
          severity: 'danger',
          items: [
            'Shock, lactato elevado, confusión, oliguria o necesidad de soporte.',
            'Deshidratación relevante, vómitos persistentes o imposibilidad de vía oral.',
            'Inmunosupresión, edad avanzada/frágil, comorbilidad grave, absceso, perforación o peritonismo.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Rehidratación y síntomas; antibiótico solo si diarrea inflamatoria seleccionada, sepsis o complicación.',
      points: [
        'Rehidratación oral si leve y tolera; vía IV si deshidratación, sepsis, vómitos persistentes o fragilidad.',
        'Metoclopramida 10 mg IV cada 8 h si vómitos impiden hidratación o medicación oral.',
        'Paracetamol 1 g VO/IV cada 6 h para dolor/fiebre; evitar espasmolíticos en GEA.',
        'No antibiótico empírico en la mayoría de GEA; valorar si fiebre >38 °C, sangre, inmunosupresión, >50 años, deshidratación o >1 semana.',
        'Sepsis/diverticulitis complicada/absceso: piperacilina-tazobactam 4/0,5 g IV cada 6-8 h y control de foco.',
      ],
      treatmentGroups: [
        {
          id: 'hidratacion-infeccioso',
          title: 'Hidratación y soporte',
          cards: [
            {
              id: 'inf-dig-rehidratacion-oral',
              title: 'Rehidratación oral',
              type: 'treatment',
              severity: 'success',
              summary: 'GEA leve/moderada si tolera y no hay shock ni vómitos incoercibles.',
              items: [
                'Dosis: tomas pequeñas y frecuentes; ajustar a sed, pérdidas y diuresis.',
                'Vía: VO.',
                'Frecuencia: continua durante las primeras horas.',
                'Evitar si: shock, bajo nivel de conciencia, íleo, vómitos incoercibles o alto riesgo de aspiración.',
                'Reevaluar: diuresis, sed, mareo, constantes, vómitos y tolerancia.',
              ],
            },
            {
              id: 'inf-dig-fluidoterapia-iv',
              title: 'Cristaloide IV',
              type: 'treatment',
              severity: 'warning',
              summary: 'Deshidratación relevante, sepsis, mala perfusión, fragilidad o vómitos persistentes.',
              items: [
                'Dosis: bolos o perfusión según TA, perfusión, diuresis, iones y comorbilidad.',
                'Vía: IV.',
                'Frecuencia: reevaluación tras cada carga o cambio de perfusión.',
                'Máximo: evitar sobrecarga en cardiopatía, nefropatía o fragilidad.',
                'Reevaluar: TA, FC, diuresis, lactato, sodio/potasio y tolerancia oral.',
              ],
            },
          ],
        },
        {
          id: 'sintomatico-infeccioso',
          title: 'Síntomas',
          cards: [
            {
              id: 'inf-dig-metoclopramida',
              title: 'Metoclopramida',
              type: 'treatment',
              summary: 'Vómitos que impiden hidratación o medicación oral.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/78556/FichaTecnica_78556.html',
              items: [
                'Dosis: 10 mg.',
                'Vía: IV o IM.',
                'Frecuencia: cada 8 h.',
                'Máximo: 30 mg/día en adultos.',
                'Evitar si: obstrucción/perforación digestiva, Parkinson, epilepsia o antecedente extrapiramidal relevante.',
                'Reevaluar: vómitos, tolerancia, QT/interacciones y necesidad de observación.',
              ],
            },
            {
              id: 'inf-dig-paracetamol',
              title: 'Paracetamol',
              type: 'treatment',
              summary: 'Dolor o fiebre sin datos de abdomen quirúrgico que obliguen a escalar.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/74477/FichaTecnica_74477.html',
              items: [
                'Dosis: 1 g.',
                'Vía: VO o IV.',
                'Frecuencia: cada 6 h.',
                'Máximo: 4 g/día si >50 kg sin riesgo hepatotóxico; 3 g/día si riesgo hepatotóxico.',
                'Evitar si: hepatopatía grave o uso concomitante de paracetamol.',
                'Reevaluar: dolor, fiebre y aparición de focalidad/peritonismo.',
              ],
            },
          ],
        },
        {
          id: 'antibiotico-infeccioso',
          title: 'Antibiótico si sepsis o complicación',
          cards: [
            {
              id: 'inf-dig-piperacilina-tazobactam',
              title: 'Piperacilina/tazobactam',
              type: 'treatment',
              severity: 'danger',
              summary: 'Sepsis abdominal, diverticulitis complicada, absceso o infección intraabdominal complicada.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/68080/fichatecnica_68080.html',
              items: [
                'Dosis: 4 g/0,5 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 6-8 h.',
                'Máximo: ajustar por función renal; ClCr 20-40: 4/0,5 g cada 8 h; ClCr <20: 4/0,5 g cada 12 h.',
                'Evitar si: alergia a betalactámicos; adaptar a foco, cultivo y microbiología local.',
                'Reevaluar: lactato, fiebre, dolor, foco, cultivos si proceden, función renal y desescalada.',
              ],
            },
            {
              id: 'inf-dig-ertapenem',
              title: 'Ertapenem',
              type: 'treatment',
              severity: 'warning',
              summary: 'Alternativa IV descrita para diverticulitis complicada/infección intraabdominal si encaja contexto.',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/83230/FT_83230.html',
              items: [
                'Dosis: 1 g.',
                'Vía: IV en perfusión.',
                'Frecuencia: cada 24 h.',
                'Máximo: 1 g/día en adulto.',
                'Evitar si: alergia a carbapenémicos o sospecha de patógeno no cubierto.',
                'Reevaluar: control de foco, función renal, cultivos y desescalada.',
              ],
            },
          ],
        },
      ],
      detailNodes: [
        {
          id: 'seguridad-infeccioso',
          title: 'Seguridad antes de tratar',
          type: 'step',
          severity: 'warning',
          items: [
            'Evitar loperamida si diarrea inflamatoria, fiebre alta, sangre, sospecha de C. difficile, íleo o colitis grave.',
            'Confirmar alergias, función renal, QT/interacciones, embarazo y riesgo de deshidratación antes de fármacos.',
            'El antibiótico no sustituye drenaje/control de foco si hay absceso, perforación o peritonitis.',
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta si leve y tolera; observación/ingreso si no hay seguridad clínica.',
      points: [
        'Alta: cuadro leve, estable, tolera VO, sin sangre, sin sepsis, sin inmunosupresión y alarma explicada.',
        'Observación: mala tolerancia, deshidratación leve-moderada, dolor persistente o diagnóstico incierto.',
        'Ingreso: sepsis, inmunosupresión, deshidratación relevante, diverticulitis complicada, absceso o peritonismo.',
        'UCI: shock, lactato elevado, hipotensión, confusión, fallo orgánico o necesidad de soporte.',
      ],
      detailNodes: [
        {
          id: 'alarma-infeccioso-alta',
          title: 'Signos de alarma',
          type: 'alert',
          severity: 'warning',
          items: [
            'Fiebre persistente, sangre en heces, dolor progresivo/localizado o distensión.',
            'Vómitos persistentes, sed intensa, mareo, oliguria o deterioro general.',
            'No mejoría, inmunosupresión o reaparición de fiebre/dolor tras alta.',
          ],
        },
      ],
    },
  ],
  sections: [
    definitionSection(protocol),
    {
      id: 'que-pido',
      title: PRIMARY_SECTION_TITLES.orders,
      type: 'section',
      summary: 'Analítica, microbiología e imagen solo si cambian conducta.',
      children: [],
    },
    {
      id: 'que-espero',
      title: PRIMARY_SECTION_TITLES.findings,
      type: 'section',
      summary: 'Distinguir leve de sepsis, deshidratación o complicación.',
      children: [],
    },
    {
      id: 'tratamiento',
      title: PRIMARY_SECTION_TITLES.treatment,
      type: 'section',
      summary: 'Hidratación, síntomas y antibiótico selectivo.',
      children: [],
    },
    {
      id: 'seguimiento',
      title: PRIMARY_SECTION_TITLES.followUp,
      type: 'section',
      summary: 'Destino según tolerancia, riesgo y complicación.',
      children: [],
    },
    referencesSection(protocol),
  ],
});

const guardiaFlow = (protocol) => {
  const guardia = protocol.guardia;

  return {
    id: protocol.id,
    title: protocol.longTitle ?? protocol.title,
    specialty: protocol.section,
    summary: brief(protocol.summary, 170),
    sections: [
      {
        id: 'que-es',
        title: PRIMARY_SECTION_TITLES.definition,
        type: 'section',
        summary: brief(guardia.clinica, 130),
        maxInitialItems: 0,
        children: [
          {
            id: 'clinica',
            title: protocol.title,
            type: 'step',
            summary: guardia.clinica,
            severity: 'warning',
          },
        ],
      },
      {
        id: 'que-pido',
        title: PRIMARY_SECTION_TITLES.orders,
        type: 'section',
        summary: 'Pruebas y datos de entrada para orientar el escenario de guardia.',
        children: [
          {
            id: 'pruebas',
            title: 'Pruebas',
            type: 'step',
            items: guardia.pruebas,
          },
        ],
      },
      {
        id: 'que-espero',
        title: PRIMARY_SECTION_TITLES.findings,
        type: 'section',
        summary: 'Diagnóstico probable y criterios de gravedad que obligan a escalar.',
        children: [
          {
            id: 'diagnostico',
            title: 'Hallazgos clave',
            type: 'decision',
            summary: guardia.diagnostico,
          },
          {
            id: 'alarmas',
            title: 'Criterios de gravedad',
            type: 'alert',
            severity: 'danger',
            items: guardia.alertas,
          },
        ],
      },
      {
        id: 'tratamiento',
        title: PRIMARY_SECTION_TITLES.treatment,
        type: 'section',
        summary: 'Medidas iniciales resumidas; datos previos, escalones y reevaluación quedan en detalle.',
        children: [
          {
            id: 'tratamiento-urgencias',
            title: 'Medidas en Urgencias',
            type: 'treatment',
            summary: guardia.tratamiento,
            children: [
              ...(guardia.datosTratamiento
                ? [
                    {
                      id: 'datos',
                      title: 'Datos antes de tratar',
                      type: 'step',
                      items: guardia.datosTratamiento,
                      severity: 'warning',
                    },
                  ]
                : []),
              ...asArray(guardia.tratamientoItems).map((item) => ({
                id: slugify(item.title),
                title: item.title,
                type: 'treatment',
                items: item.items,
                severity: item.tone === 'critical' ? 'danger' : item.tone === 'warning' ? 'warning' : 'info',
              })),
            ],
          },
        ],
      },
      {
        id: 'seguimiento',
        title: PRIMARY_SECTION_TITLES.followUp,
        type: 'section',
        summary: 'Destino y revisión según estabilidad, alarma y respuesta inicial.',
        children: [
          {
            id: 'destino',
            title: 'Destino',
            type: 'decision',
            summary: guardia.destino,
            items: guardia.destinoItems,
            severity: 'success',
          },
          {
            id: 'seguimiento',
            title: 'Revisión tras urgencias',
            type: 'step',
            items: guardia.seguimiento,
          },
          ...(guardia.simuladores
            ? [
                {
                  id: 'simuladores',
                  title: 'Simuladores extraabdominales',
                  type: 'alert',
                  severity: 'warning',
                  items: guardia.simuladores,
                },
              ]
            : []),
        ],
      },
      referencesSection(protocol),
    ],
  };
};

const genericFlow = (protocol) => ({
  id: protocol.id,
  title: protocol.longTitle ?? protocol.title,
  specialty: protocol.section,
  summary: brief(protocol.summary, 170),
  sections: [
    definitionSection(protocol),
    defaultOrders(protocol),
    defaultFindings(protocol),
    genericTreatmentSection(protocol),
    genericFollowUpSection(protocol),
    referencesSection(protocol),
  ],
});

const buildFaDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Ritmo irregular con respuesta ventricular variable; lo urgente es estabilidad, duración y desencadenante.',
        points: [
          'Palpitaciones, dolor torácico, disnea, mareo, síncope o embolia.',
          'ECG con ausencia de ondas P repetidas e intervalos RR irregulares.',
          'Red flags: shock, isquemia, edema pulmonar, mala perfusión, síncope o preexcitación.',
        ],
        detailNodes: [
          {
            id: 'sospecha-fa',
            title: 'Cuándo pensar en FA',
            type: 'step',
            summary: protocol.summary,
            items: asArray(protocol.quickChecks).slice(0, 4),
          },
          {
            id: 'red-flags-fa',
            title: 'Red flags',
            type: 'alert',
            severity: 'danger',
            items: asArray(protocol.warnings).slice(0, 3),
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Confirmar ritmo y pedir solo datos que cambian frecuencia, cardioversión, anticoagulación o destino.',
        points: [
          'ECG 12 derivaciones y tira de ritmo mínimo 30 s; monitor si rápida, síntomas o tratamiento IV.',
          'Hemograma, glucosa, urea/creatinina, Na/K/Cl; coagulación si shock, coagulopatía o anticoagulación.',
          'Troponina si dolor torácico; BNP/NT-proBNP si insuficiencia cardíaca.',
          'Rx tórax si sospecha cardiopulmonar; gasometría/lactato si SpO2 < 90% o shock.',
          'Fecha/hora de inicio, FEVI/cardiopatía estructural y Cockcroft-Gault si vas a anticoagular.',
        ],
        detailNodes: [
          {
            id: 'pruebas-fa',
            title: 'Pruebas y resultados que cambian conducta',
            type: 'step',
            items: [
              'ECG: FA si no hay ondas P repetidas, línea de base irregular y RR irregular; QRS ancho o FC > 200 sugiere preexcitación.',
              'Analítica: creatinina/electrolitos para ACOD, digoxina y antiarrítmicos; K/Mg alterados aumentan recurrencia y toxicidad.',
              'Coagulación: necesaria si ya toma anticoagulantes, hay coagulopatía o se plantea cardioversión/ingreso.',
              'Imagen: Rx tórax si disnea, insuficiencia cardíaca, infección respiratoria o duda cardiopulmonar; ETE si cardioversión precoz guiada.',
              'Gasometría/lactato: solo si hipoxemia marcada, shock o mala perfusión.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Decidir estabilidad, ritmo/frecuencia y anticoagulación sin repetir calculadoras.',
        points: [
          'Inestable: cardioversión eléctrica sincronizada urgente.',
          'Estable: frecuencia primero; ritmo precoz solo si síntomas, primera crisis o mala tolerancia.',
          '≥ 24 h/desconocida: no cardiovertir precozmente sin 3 semanas de ACO terapéutica o ETE sin trombo.',
          'Anticoagulación: CHA2DS2-VA, HAS-BLED modificable y Cockcroft-Gault para dosis.',
          'FA valvular: estenosis mitral moderada/grave o prótesis mecánica orienta a AVK, no ACOD.',
        ],
        actions: asArray(protocol.calculatorIds).map(calculatorAction),
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Control de estabilidad, frecuencia/ritmo y anticoagulación según duración, riesgo y función renal.',
        points: treatmentInitialItems(protocol),
        treatmentGroups: [
          {
            id: 'intervenciones-fa',
            title: 'Tratamiento en Urgencias',
            cards: cardiologyInterventionNodes(protocol),
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta, observación o ingreso según estabilidad, control, anticoagulación y causa desencadenante.',
        points: [
          'UCI/monitorización si shock, isquemia, edema pulmonar, preexcitación o necesidad de cardioversión urgente.',
          'Observación si requiere fármacos IV, cardioversión, titulación de frecuencia o inicio seguro de anticoagulación.',
          'Ingreso si insuficiencia cardíaca, SCA, embolia, infección grave, alteración electrolítica relevante o mal control.',
          'Alta solo si estable, FC controlada o aceptable, causa abordada, anticoagulación decidida y revisión planificada.',
        ],
        detailNodes: [
          {
            id: 'destino-fa',
            title: 'Criterios prácticos',
            type: 'decision',
            severity: 'success',
            items: [
              ...asArray(protocol.quickSummary).map((item) => `${item.title}: ${item.action}`),
              ...asArray(protocol.warnings).slice(0, 2),
            ],
          },
        ],
      },
    ],
  };
};

const buildScaDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Dolor o equivalente isquémico con ECG/troponina compatibles; no esperar biomarcadores si hay SCACEST.',
        points: [
          'Dolor torácico opresivo > 20 min, irradiado o con cortejo vegetativo.',
          'Equivalentes: disnea, síncope, edema pulmonar, shock o arritmia grave.',
          'Alarma: elevación persistente de ST, dolor refractario, inestabilidad o sospecha de complicación mecánica.',
        ],
        detailNodes: [
          {
            id: 'clinica-sca',
            title: 'Cuándo pensar en SCA',
            type: 'step',
            summary: protocol.summary,
            items: [
              'Valorar factores de riesgo, antecedentes coronarios, revascularización previa y tratamiento antitrombótico actual.',
              'No descartar SCA por clínica atípica en diabetes, edad avanzada, mujeres o insuficiencia renal.',
              'Comparar con ECG previos si bloqueo de rama, marcapasos o alteraciones basales.',
            ],
          },
          {
            id: 'alertas-sca',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: asArray(protocol.warnings).slice(0, 4),
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'ECG inmediato, monitorización, troponina seriada si no hay SCACEST y analítica para anticoagular/reperfusión.',
        points: [
          'ECG 12 derivaciones en < 10 min; repetir si dolor persiste o el ECG inicial no es diagnóstico.',
          'Monitor, constantes, dos vías si alto riesgo y desfibrilador disponible.',
          'Analítica: hs-cTn seriada, hemograma, bioquímica/creatinina, iones y coagulación.',
          'Ecocardiografía si duda diagnóstica, shock, insuficiencia cardíaca o sospecha de complicación.',
          'Rx tórax solo si cambia diagnóstico o manejo; no retrasar reperfusión.',
        ],
        detailNodes: [
          {
            id: 'pruebas-sca',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'SCACEST o equivalentes: activar reperfusión sin esperar troponina.',
              'SCASEST: hs-cTn 0/1 h o 0/2 h si disponible; ascenso/descenso dinámico apoya IAM.',
              'Creatinina y hemograma: ajustan contraste, anticoagulación y riesgo hemorrágico.',
              'Eco: alteración segmentaria nueva, insuficiencia mitral aguda, taponamiento o disfunción ventricular cambian destino.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Separar SCACEST, SCASEST de muy alto/alto riesgo y cuadros que requieren ingreso monitorizado.',
        points: [
          'SCACEST: ICP primaria si llega en tiempo; fibrinólisis si demora > 120 min y no hay contraindicación.',
          'SCASEST muy alto riesgo: shock, dolor refractario, arritmia maligna o insuficiencia cardíaca: angiografía inmediata.',
          'SCASEST alto riesgo: troponina positiva, cambios dinámicos ST/T o criterios ESC de alto riesgo: coronariografía < 24 h.',
          'Killip III-IV o inestabilidad: área monitorizada/UCI y manejo invasivo urgente.',
          'No usar fibrinólisis en SCASEST.',
        ],
        actions: [calculatorAction('killip')],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Antiagregación, anticoagulación, antiisquémicos y reperfusión según rama; cada fármaco abre su pauta.',
        points: treatmentInitialItems(protocol),
        treatmentGroups: [
          {
            id: 'intervenciones-sca',
            title: 'Decisiones tiempo-dependientes',
            cards: cardiologyInterventionNodes(protocol),
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Todo SCA requiere destino monitorizado; alta solo tras descartar SCA con protocolo diagnóstico completo.',
        points: [
          'SCACEST: sala de hemodinámica o fibrinólisis + traslado a centro con ICP.',
          'SCASEST muy alto/alto riesgo: ingreso monitorizado y cardiología/hemodinámica según tiempos.',
          'UCI si shock, Killip III-IV, arritmias malignas, necesidad de soporte o complicación mecánica.',
          'Observación si dolor resuelto pero diagnóstico aún no descartado: ECG/troponina seriados.',
          'Alta solo si baja sospecha, ECG no isquémico, troponinas seriadas negativas y plan de revisión claro.',
        ],
        detailNodes: [
          {
            id: 'destino-sca',
            title: 'Reevaluación y alarma',
            type: 'decision',
            severity: 'success',
            items: [
              'Reevaluar dolor, ECG, constantes, sangrado y respuesta a antitrombóticos.',
              'Tras fibrinólisis: comprobar resolución de ST/dolor; si falla, angiografía de rescate inmediata.',
              'Al alta tras descarte: explicar alarma por dolor recurrente, disnea, síncope o sangrado.',
            ],
          },
        ],
      },
    ],
  };
};

const buildHtaDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'PA muy elevada: lo importante es separar cifra aislada de daño agudo de órgano diana.',
        points: [
          'Confirmar PA con técnica correcta, reposo y repetición en ambos brazos si procede.',
          'Pensar en emergencia si hay focalidad, dolor torácico, disnea/edema pulmonar, confusión, embarazo o deterioro renal.',
          'Cefalea, ansiedad o epistaxis sin daño agudo no equivalen por sí solas a emergencia.',
        ],
        detailNodes: [
          {
            id: 'sospecha-hta',
            title: 'Qué buscar al inicio',
            type: 'step',
            items: [
              'Síntomas neurológicos, visuales, dolor torácico, dolor dorsal, disnea, oliguria, embarazo/puerperio y consumo de simpaticomiméticos.',
              'Revisar tratamiento antihipertensivo, adherencia, AINE/descongestivos, cocaína/anfetaminas y retirada de fármacos.',
              'Valorar si la elevación es crónica/mal controlada o brusca con daño agudo.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Pedir pruebas dirigidas a daño de órgano: corazón, cerebro, riñón, retina, aorta y embarazo.',
        points: [
          'ECG y Rx tórax si dolor torácico, disnea, insuficiencia cardíaca o sospecha cardiovascular.',
          'Analítica: hemograma, glucosa, urea/creatinina, Na/K/Ca y orina/sedimento si posible daño renal.',
          'Troponina si dolor torácico o ECG compatible; BNP/gasometría si edema pulmonar o insuficiencia respiratoria.',
          'Neuroimagen si focalidad, confusión, crisis, cefalea brusca intensa o sospecha de ictus/hemorragia.',
          'Embarazo: tira/test y proteinuria si posibilidad de gestación o puerperio.',
        ],
        detailNodes: [
          {
            id: 'pruebas-hta',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'Creatinina elevada, hematuria/proteinuria o oliguria orientan a afectación renal aguda.',
              'ECG/troponina positivos cambian a SCA/emergencia hipertensiva cardiaca.',
              'Edema pulmonar en Rx o hipoxemia obliga a tratamiento IV monitorizado.',
              'Focalidad o disminución de conciencia obliga a rama ictus/hemorragia y objetivos tensionales específicos.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Sin daño agudo: descenso gradual. Con daño agudo: emergencia, ingreso y perfusión IV titulada.',
        points: [
          'Urgencia hipertensiva: PA alta sin daño agudo; reposo, tratamiento oral si procede y reevaluación.',
          'Emergencia hipertensiva: daño agudo neurológico, coronario, pulmonar, renal, aórtico o gestacional.',
          'No bajar rápido una PA crónicamente elevada sin daño agudo: riesgo de hipoperfusión.',
          'Elegir objetivo y fármaco según órgano afectado; no usar vía IV fuera de contexto monitorizado.',
        ],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Oral y gradual si urgencia; IV titulada y monitorizada si emergencia.',
        points: [
          'Urgencia: reposo y reevaluación; captopril 25 mg VO, labetalol 100 mg VO o amlodipino 5 mg VO según contexto.',
          'Emergencia: monitorización, vía IV y objetivo tensional por órgano afectado.',
          'Labetalol IV 20 mg cada 5 min hasta 100 mg o perfusión 0,5-2 mg/min si encaja.',
          'Nitroglicerina IV si SCA/edema pulmonar; nitroprusiato IV si HTA maligna/encefalopatía y monitorización estricta.',
        ],
        treatmentGroups: medicationGroups.map((group) => ({
          id: `grupo-${slugify(group.title)}`,
          title: group.title,
          cards: asArray(group.medicationIds).map(medicationNode),
        })),
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta solo si no hay daño agudo, la PA desciende de forma segura y queda control tras urgencias.',
        points: [
          'Alta: sin daño agudo, síntomas resueltos/banales, plan oral claro y control en 24-72 h.',
          'Observación: dudas diagnósticas, síntomas persistentes, necesidad de reevaluación o ajuste oral.',
          'Ingreso/UCI: cualquier daño agudo de órgano, perfusión IV, embarazo grave, disección, edema pulmonar, SCA o ictus.',
          'Reevaluar PA, clínica, diuresis, ECG y analítica según el órgano afectado.',
        ],
        detailNodes: [
          {
            id: 'destino-hta',
            title: 'Seguridad al alta',
            type: 'decision',
            severity: 'success',
            items: [
              'No dar alta si hay focalidad, dolor torácico, disnea, deterioro renal, embarazo grave o sospecha de disección.',
              'Explicar alarma por dolor torácico/dorsal, disnea, focalidad, confusión, visión borrosa, oliguria o síncope.',
              'Evitar duplicar fármacos sin revisar medicación habitual y adherencia.',
            ],
          },
        ],
      },
    ],
  };
};

const buildBradyDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Ritmo lento: decidir si produce hipoperfusión o si hay bloqueo con riesgo de asistolia.',
        points: [
          'Pensar en bradiarritmia si FC baja, pausas, síncope, mareo, disnea, dolor torácico o confusión.',
          'Datos adversos: shock, síncope, isquemia, insuficiencia cardíaca o mala perfusión.',
          'Buscar fármacos bradicardizantes, hiperpotasemia, isquemia, hipoxia, hipotermia o intoxicación.',
          'Alto riesgo: Mobitz II, BAV completo con QRS ancho, pausas > 3 s o FC ventricular < 40/min en vigilia.',
        ],
        detailNodes: [
          {
            id: 'sospecha-bradi',
            title: 'Cuándo tratar de inmediato',
            type: 'alert',
            severity: 'danger',
            items: [
              'La bradicardia estable permite ECG, causas reversibles y observación dirigida.',
              'La bradicardia con signos adversos requiere tratamiento y vía de estimulación preparada.',
              'En BAV avanzado o escape ventricular, no esperar a que aparezca shock para avisar y preparar pacing.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'ECG y monitorización primero; analítica dirigida a causas reversibles que cambian tratamiento.',
        points: [
          'ECG 12 derivaciones y tira de ritmo; monitor, PA, SatO2 y accesos IV si síntomas o bloqueo alto.',
          'Analítica: glucosa, K/Mg/Ca, función renal, gasometría/lactato si mala perfusión o hipoxemia.',
          'Troponina si dolor, cambios isquémicos o sospecha de SCA; revisar digoxina/betabloqueantes/calcioantagonistas.',
          'Imagen solo dirigida: Rx tórax/eco si insuficiencia cardíaca, shock o duda cardiopulmonar.',
        ],
        detailNodes: [
          {
            id: 'pruebas-bradi',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'ECG: distinguir bradicardia sinusal, bloqueo AV nodal, Mobitz II, BAV completo y escape ancho.',
              'Hiperpotasemia, hipoxia, hipotermia, hipoglucemia o intoxicación obligan a tratamiento causal paralelo.',
              'Elevación de troponina o clínica isquémica cambia a rama SCA y puede explicar bloqueo inferior/anterior.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Separar estable, sintomática y alto riesgo; pacing no debe retrasarse por repetir atropina.',
        points: [
          'Estable sin alto riesgo: observar, corregir causa y revisar medicación.',
          'Con signos adversos: atropina IV y reevaluación inmediata.',
          'Si atropina falla o hay Mobitz II/BAV completo con QRS ancho: marcapasos transcutáneo y ayuda experta.',
          'Si no hay pacing inmediato: adrenalina o isoprenalina IV como puente monitorizado.',
        ],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Atropina si sintomática; pacing y perfusiones como puente cuando persiste riesgo o bloqueo avanzado.',
        points: treatmentInitialItems(protocol),
        treatmentGroups: [
          {
            id: 'intervenciones-bradi',
            title: 'Estimulación',
            cards: cardiologyInterventionNodes(protocol),
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta solo si estable y causa banal corregida; bloqueo alto o tratamiento IV requiere ingreso monitorizado.',
        points: [
          'UCI/área monitorizada si shock, síncope, isquemia, insuficiencia cardíaca, perfusión vasoactiva o pacing.',
          'Cardiología/UCI si Mobitz II, BAV completo, QRS ancho, pausas > 3 s o mala perfusión persistente.',
          'Observación si síntomas resueltos pero causa no aclarada, fármaco implicado o recurrencia posible.',
          'Alta solo si estable, sin bloqueo de alto riesgo, causa corregida y seguimiento definido.',
        ],
        detailNodes: [
          {
            id: 'destino-bradi',
            title: 'Reevaluación',
            type: 'decision',
            severity: 'success',
            items: [
              'Reevaluar FC, PA, perfusión, ECG y causa reversible tras cada intervención.',
              'No retirar monitorización hasta confirmar estabilidad mantenida y ausencia de pausas o bloqueo progresivo.',
              'Explicar alarma por síncope, dolor torácico, disnea, mareo persistente o palpitaciones.',
            ],
          },
        ],
      },
    ],
  };
};

const buildVentricularDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Taquicardia de QRS ancho: primero pulso y estabilidad; si dudas, tratar como ventricular.',
        points: [
          'QRS ancho regular o polimórfico con palpitaciones, dolor torácico, disnea, síncope o mala perfusión.',
          'Sin pulso: FV/TV sin pulso y algoritmo de parada.',
          'Con pulso inestable: shock, síncope, isquemia, edema pulmonar o deterioro.',
          'Sospechar torsades si TV polimórfica con QT largo, bradicardia, hipoK/hipoMg o fármacos que prolongan QT.',
        ],
        detailNodes: [
          {
            id: 'sospecha-tv',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: [
              'No retrasar desfibrilación/cardioversión por completar el diagnóstico si hay inestabilidad.',
              'Preparar desfibrilador desde el inicio aunque el paciente esté inicialmente estable.',
              'Buscar DAI, cardiopatía estructural, IAM, intoxicación, alteraciones iónicas y QT largo.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Monitor y ECG si no retrasa electricidad; analítica dirigida a isquemia, iones y causas reversibles.',
        points: [
          'Monitor/desfibrilador, PA, SatO2, accesos IV/IO y ECG 12 derivaciones si el paciente lo permite.',
          'Analítica: K, Mg, Ca, función renal, glucosa y gasometría/lactato si shock o mala perfusión.',
          'Troponina y ECG seriado si dolor, cambios isquémicos, SCA o TV en contexto de IAM.',
          'Revisar fármacos QT, antiarrítmicos, digoxina, tóxicos y alteraciones metabólicas.',
        ],
        detailNodes: [
          {
            id: 'pruebas-tv',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'TV/FV sin pulso: no esperar pruebas; desfibrilar y RCP.',
              'TV monomorfa estable: ECG ayuda, pero QRS ancho incierto se maneja como TV.',
              'QTc largo, hipoK o hipoMg orientan a torsades y magnesio/corrección electrolítica.',
              'SCA o shock cambia destino a hemodinámica/UCI según contexto.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'La rama depende de pulso, estabilidad, morfología y QT; la electricidad manda si hay deterioro.',
        points: [
          'TV/FV sin pulso: RCP 2 min, desfibrilación y fármacos según algoritmo.',
          'TV con pulso inestable: cardioversión sincronizada; si no sincroniza o es polimórfica, desfibrilar.',
          'TV monomorfa estable: amiodarona IV y preparación de cardioversión si cambia la perfusión.',
          'Torsades/TV polimórfica estable: magnesio IV, K > 4 mEq/L si posible y retirar desencadenantes.',
        ],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Priorizar desfibrilación o cardioversión cuando corresponda, RCP de alta calidad y fármacos según ritmo y respuesta.',
        points: treatmentInitialItems(protocol),
        treatmentGroups: [
          {
            id: 'intervenciones-tv',
            title: 'Electricidad y algoritmos',
            cards: cardiologyInterventionNodes(protocol),
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Toda TV sostenida, torsades o parada recuperada requiere monitorización y causa corregida.',
        points: [
          'UCI/área crítica tras FV/TV sin pulso, ROSC, shock, cardioversión urgente o perfusión antiarrítmica.',
          'Ingreso monitorizado si TV sostenida, cardiopatía estructural, SCA, alteraciones iónicas graves o recurrencia.',
          'Cardiología/UCI si DAI con descargas, tormenta arrítmica, QT largo, síncope o necesidad de ablación/DAI.',
          'Alta solo si no fue TV sostenida, causa benigna clara, ECG/iones corregidos y plan de seguimiento seguro.',
        ],
        detailNodes: [
          {
            id: 'destino-tv',
            title: 'Reevaluación',
            type: 'decision',
            severity: 'success',
            items: [
              'Reevaluar ritmo, perfusión, QT, K/Mg, dolor torácico, troponina y recurrencia tras cada intervención.',
              'Buscar causas reversibles: hipoxia, hipo/hiperpotasemia, acidosis, hipotermia, tóxicos, trombosis coronaria y taponamiento.',
              'Tras ROSC: cuidados postparada, control térmico según protocolo local y valoración de causa coronaria si procede.',
            ],
          },
        ],
      },
    ],
  };
};

const buildIschemicStrokeDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Déficit neurológico focal brusco: activar código ictus y fijar última vez bien.',
        points: [
          'Debilidad facial/braquial, afasia, disartria, hemianopsia, ataxia o pérdida sensitiva brusca.',
          'Registrar hora de última vez bien, situación basal y Rankin previo si se conoce.',
          'Glucemia capilar inmediata para descartar simulador tratable.',
          'Alarma: disminución de conciencia, déficit discapacitante, clínica de gran vaso o deterioro progresivo.',
        ],
        detailNodes: [
          {
            id: 'sospecha-ictus-isquemico',
            title: 'No perder tiempo',
            type: 'alert',
            severity: 'danger',
            items: [
              'No retrasar TAC ni activación por analíticas o pruebas secundarias.',
              'Preguntar anticoagulación, cirugía reciente, sangrado, ictus previo y comorbilidad relevante.',
              'NIHSS cuantifica el déficit basal y ayuda a comunicar gravedad sin retrasar reperfusión.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'TAC sin contraste para descartar sangrado; angio-TC si sospecha gran vaso y no retrasa reperfusión.',
        points: [
          'Glucemia capilar, constantes, ECG/monitor y SatO2; dos accesos si candidato a reperfusión.',
          'TAC craneal sin contraste urgente para excluir hemorragia.',
          'Angio-TC cabeza-cuello si déficit grave/discapacitante o sospecha de oclusión de gran vaso.',
          'Analítica: hemograma, coagulación, glucosa, iones y creatinina; no retrasar trombólisis si no cambia seguridad inmediata.',
        ],
        detailNodes: [
          {
            id: 'pruebas-ictus-isquemico',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'Hemorragia en TAC cambia a protocolo de ictus hemorrágico.',
              'Oclusión de gran vaso activa trombectomía/traslado a centro con capacidad endovascular.',
              'PA > 185/110 mmHg impide trombólisis hasta control tensional.',
              'Anticoagulación o coagulopatía obliga a revisar contraindicaciones antes de alteplasa.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Decidir reperfusión IV, trombectomía, control tensional y destino monitorizado.',
        points: [
          'Candidato a trombólisis IV: déficit discapacitante, ventana compatible, TAC sin sangrado y sin contraindicación mayor.',
          'Si PA > 185/110 mmHg, controlar antes de trombólisis; después mantener < 180/105 mmHg.',
          'Sospecha/confirmación de gran vaso: no retrasar trombectomía por tratamientos secundarios.',
          'Si no candidato a reperfusión: soporte, evitar descenso brusco de PA y definir ingreso en unidad de ictus.',
        ],
        actions: [calculatorAction('nihss')],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Reperfusión si candidato, control tensional dirigido y vigilancia de complicaciones.',
        points: [
          'Alteplasa 0,9 mg/kg IV, máximo 90 mg: 10% bolo y 90% en 60 min si candidato.',
          'Controlar PA < 185/110 mmHg antes de trombólisis; mantener < 180/105 mmHg después.',
          'Labetalol 10-20 mg IV lento; repetir o perfusión 0,5-2 mg/min si precisa control sostenido.',
          'Trombectomía si oclusión de gran vaso y criterios; activar traslado/neurorradiología sin demoras.',
          'Evitar antiagregación/anticoagulación en las primeras 24 h tras trombólisis hasta nueva imagen.',
        ],
        treatmentGroups: medicationGroups.map((group) => ({
          id: `grupo-${slugify(group.title)}`,
          title: group.title,
          cards: asArray(group.medicationIds).map(medicationNode),
        })),
        detailNodes: [
          {
            id: 'trombectomia-ictus-isquemico',
            title: 'Trombectomía mecánica',
            type: 'treatment',
            severity: 'danger',
            summary: 'Prioritaria si hay oclusión de gran vaso y criterios de selección.',
            items: [
              'Intervención: activar centro con capacidad endovascular o traslado según red local.',
              'No retrasar por tratamientos secundarios si hay sospecha de gran vaso.',
              'Reevaluar: perfusión, NIHSS clínico, PA, glucemia y complicaciones durante traslado.',
            ],
          },
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Unidad de ictus o centro de reperfusión; UCI si inestabilidad, complicaciones o soporte avanzado.',
        points: [
          'Centro con trombectomía si gran vaso o sospecha alta y red local lo indica.',
          'Unidad de ictus/ingreso monitorizado tras trombólisis, AIT de alto riesgo o déficit persistente.',
          'UCI si compromiso de vía aérea, edema maligno, deterioro neurológico, shock o complicación hemorrágica.',
          'Alta solo en simulador/diagnóstico alternativo seguro o AIT de bajo riesgo con circuito urgente establecido.',
        ],
        detailNodes: [
          {
            id: 'reevaluacion-ictus-isquemico',
            title: 'Seguimiento inmediato',
            type: 'decision',
            severity: 'success',
            items: [
              'Reevaluar déficit, PA, glucemia, nivel de conciencia y sangrado de forma seriada.',
              'Repetir neuroimagen si deterioro, cefalea intensa, vómitos, hipertensión brusca o sospecha de transformación hemorrágica.',
              'Avisar por empeoramiento neurológico, disminución de conciencia, sangrado o nueva cefalea intensa.',
            ],
          },
        ],
      },
    ],
  };
};

const buildHemorrhagicStrokeDecisionPanelFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Déficit neurológico brusco con cefalea, vómitos, disminución de conciencia o PA muy elevada.',
        points: [
          'Pensar en hemorragia si cefalea brusca intensa, vómitos, crisis, rigidez, coma o déficit focal progresivo.',
          'Registrar hora de inicio, Glasgow clínico, anticoagulación/antiagregación y situación basal.',
          'Red flags: deterioro de conciencia, signos de herniación, hidrocefalia, hemorragia cerebelosa o anticoagulación activa.',
          'No distinguir isquémico/hemorrágico sin neuroimagen urgente.',
        ],
        detailNodes: [
          {
            id: 'sospecha-hemorragico',
            title: 'Datos que obligan a escalar',
            type: 'alert',
            severity: 'danger',
            items: [
              'Deterioro neurológico, anisocoria, vómitos repetidos, hipertensión marcada o compromiso de vía aérea.',
              'Tratamiento con AVK, ACOD, heparina, antiagregación múltiple o trombocitopenia relevante.',
              'Hemorragia cerebelosa o hidrocefalia requieren neurocirugía precoz.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'TAC urgente, coagulación y datos para revertir anticoagulación y decidir neurocirugía/UCI.',
        points: [
          'TAC craneal sin contraste urgente; angio-TC si sospecha vascular, expansión, aneurisma o malformación.',
          'Constantes, Glasgow clínico, glucemia, ECG/monitor y valoración de vía aérea.',
          'Analítica: hemograma, plaquetas, TP/INR, TTPa, fibrinógeno si procede, creatinina, iones y glucosa.',
          'Identificar anticoagulante, última dosis, función renal y disponibilidad de reversión específica.',
        ],
        detailNodes: [
          {
            id: 'pruebas-hemorragico',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'Volumen/localización, hidrocefalia, efecto masa o sangrado cerebeloso cambian destino y neurocirugía.',
              'INR elevado, ACOD reciente, heparina o coagulopatía obligan a reversión urgente.',
              'PA alta sostenida cambia a control tensional IV monitorizado.',
              'TAC sin sangrado con sospecha persistente obliga a ruta diagnóstica según neurología/neurocirugía.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Priorizar vía aérea, PA, reversión de anticoagulación y necesidad de neurocirugía/UCI.',
        points: [
          'Inestable, Glasgow bajo o deterioro: UCI, vía aérea si procede y neurocirugía/neurología urgente.',
          'PAS elevada sostenida: descenso controlado y mantenido, evitando variabilidad y caídas bruscas.',
          'Anticoagulación activa: reversión lo antes posible según fármaco, última dosis, INR y función renal.',
          'Cerebelosa con deterioro, compresión de tronco o hidrocefalia: valoración neuroquirúrgica inmediata.',
        ],
        actions: [calculatorAction('ich-score')],
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Control tensional titulado, reversión urgente si anticoagulado y medidas neurocríticas dirigidas.',
        points: [
          'Labetalol 10-20 mg IV lento; repetir o perfusión 0,5-2 mg/min si precisa control sostenido.',
          'Reversión de anticoagulación activa sin demora según anticoagulante, INR, última dosis y protocolo local.',
          'Evitar transfusión de plaquetas rutinaria por antiagregación si no hay cirugía urgente o trombocitopenia grave.',
          'Cabecera elevada, normoxia, normoglucemia, normotermia y tratar crisis si aparecen.',
        ],
        treatmentGroups: medicationGroups.map((group) => ({
          id: `grupo-${slugify(group.title)}`,
          title: group.title,
          cards: asArray(group.medicationIds).map(medicationNode),
        })),
        detailNodes: [
          {
            id: 'reversion-hemorragico',
            title: 'Reversión y neurocirugía',
            type: 'treatment',
            severity: 'danger',
            summary: 'Intervención tiempo-dependiente; no esperar a traslado si el recurso está disponible.',
            items: [
              'Fármaco/intervención: reversión específica o no específica según anticoagulante y disponibilidad local.',
              'Dosis: usar pauta del protocolo local/ficha correspondiente; no se muestra una dosis única porque depende del anticoagulante.',
              'Reevaluar: sangrado, PA, Glasgow, neuroimagen y necesidad de quirófano/UCI.',
            ],
          },
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Ingreso monitorizado; UCI/neurocirugía si deterioro, anticoagulación, hidrocefalia o sangrado de riesgo.',
        points: [
          'UCI si bajo nivel de conciencia, ventilación, PA IV, expansión, hidrocefalia, resangrado o reversión compleja.',
          'Neurocirugía si hemorragia cerebelosa de riesgo, hidrocefalia, efecto masa o lesión estructural tratable.',
          'Unidad de ictus/neurología si estable pero requiere control, vigilancia y estudio etiológico.',
          'No alta desde urgencias salvo diagnóstico alternativo seguro tras neuroimagen y valoración especializada.',
        ],
        detailNodes: [
          {
            id: 'reevaluacion-hemorragico',
            title: 'Reevaluación',
            type: 'decision',
            severity: 'success',
            items: [
              'Control seriado de Glasgow clínico, pupilas, PA, vómitos, cefalea, crisis y déficit focal.',
              'Repetir imagen si deterioro neurológico, resangrado sospechado, cefalea/vómitos nuevos o antes de decisiones quirúrgicas.',
              'Avisar de forma inmediata por somnolencia progresiva, anisocoria, crisis, vómitos repetidos o empeoramiento focal.',
            ],
          },
        ],
      },
    ],
  };
};

const buildSeizureEmergencyFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Diferenciar crisis autolimitada, crisis en curso, primera crisis, causa provocada y estatus.',
        points: [
          'Crisis epiléptica autolimitada: episodio tónico-clónico o focal con recuperación postictal progresiva.',
          'Crisis en curso o repetida sin recuperación completa obliga a tratar como urgencia tiempo-dependiente.',
          'Estatus epiléptico convulsivo: crisis ≥5 min o crisis repetidas sin recuperar conciencia.',
          'Primera crisis o cambio de semiología exige buscar causa estructural, metabólica, tóxica o infecciosa.',
          'Provocada: hipoglucemia, fiebre, tóxicos, abstinencia, Na/Ca/Mg, ictus, TCE o infección del SNC.',
        ],
        detailNodes: [
          {
            id: 'red-flags-convulsiones',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: [
              'Crisis >5 min, series de crisis, mala recuperación, focalidad persistente, fiebre/meningismo o traumatismo.',
              'Anticoagulación, inmunosupresión, embarazo, cefalea intensa, déficit nuevo o sospecha de lesión estructural.',
              'Hipoxemia, acidosis, depresión respiratoria o necesidad de repetir benzodiacepina.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Glucemia y constantes primero; analítica, tóxicos, niveles y neuroimagen si cambian conducta.',
        points: [
          'Glucemia capilar inmediata, constantes, SatO2 y ECG si síncope/arrítmico, tóxicos, QT o comorbilidad lo sugieren.',
          'Analítica: hemograma, iones, calcio, magnesio, función renal/hepática; CK si crisis prolongada.',
          'Tóxicos si procede y niveles de antiepilépticos si toma tratamiento y están disponibles.',
          'Gasometría/lactato si crisis prolongada, hipoxia, acidosis, shock o mala recuperación.',
          'TC craneal si primera crisis, focalidad, TCE, anticoagulación, cefalea intensa, inmunosupresión, fiebre/meningismo, déficit persistente o sospecha estructural.',
        ],
        detailNodes: [
          {
            id: 'pruebas-convulsiones-detalle',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'Hipoglucemia, hiponatremia, hipocalcemia o hipomagnesemia orientan a corrección causal inmediata.',
              'TC anormal, déficit persistente o sospecha de infección SNC cambia a ingreso y valoración neurológica/neuroquirúrgica.',
              'Punción lumbar solo si sospecha infección del SNC y tras imagen si procede por focalidad, inmunosupresión o hipertensión intracraneal.',
              'Niveles bajos de antiepilépticos ayudan a ajustar tratamiento si ya toma medicación.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Separar recuperación completa de primera crisis, recurrencia, causa provocada y estatus.',
        points: [
          'Crisis conocida, aislada y recuperación completa: investigar desencadenante y valorar alta si no hay alarma.',
          'Primera crisis: observación, búsqueda causal, neuroimagen si criterios y derivación a neurología.',
          'Crisis recurrente, focalidad o mala recuperación: observación/ingreso y ajuste con neurología.',
          'Crisis provocada: corregir hipoglucemia, fiebre/infección, tóxicos/abstinencia o alteración hidroelectrolítica.',
          'Estatus o depresión respiratoria: tratamiento escalonado, monitorización, UCI si persiste o precisa vía aérea.',
        ],
        detailNodes: [
          {
            id: 'decision-neuroimagen-ingreso',
            title: 'Neuroimagen, ingreso y UCI',
            type: 'decision',
            severity: 'warning',
            items: [
              'Neuroimagen urgente si primera crisis con alarma, focalidad, TCE, anticoagulación, inmunosupresión, fiebre/meningismo o déficit persistente.',
              'Ingreso si crisis seriadas, focalidad desconocida, causa estructural/infecciosa/metabólica relevante o ajuste terapéutico complejo.',
              'UCI si estatus, necesidad de intubación, depresión respiratoria, anestesia o perfusión continua.',
            ],
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'ABC y causa reversible; benzodiacepina si >5 min; segunda línea IV si persiste.',
        points: [
          'ABC, monitorizar, proteger de traumatismos, oxígeno si hipoxemia y no introducir objetos en la boca.',
          'Posición lateral en postictal; aspirar secreciones y preparar vía aérea si mala ventilación.',
          'Glucosa IV si hipoglucemia confirmada; tiamina antes si alcoholismo o desnutrición.',
          'Benzodiacepina si crisis >5 min o repetida sin recuperación.',
          'Si persiste: segunda línea IV y aviso a neurología/UCI; estatus refractario requiere UCI/anestesia/intubación.',
        ],
        treatmentGroups: [
          {
            id: 'medidas-iniciales-convulsiones',
            title: 'Medidas iniciales',
            cards: [
              {
                id: 'abc-convulsiones',
                title: 'ABC y seguridad',
                type: 'treatment',
                severity: 'info',
                summary: 'Priorizar vía aérea, respiración, circulación y prevención de lesiones.',
                items: [
                  'Fármaco/intervención: ABC, monitorización y protección física.',
                  'Dosis: no aplica.',
                  'Vía: oxígeno si hipoxemia; vía venosa si crisis prolongada, recurrencia o tratamiento IV probable.',
                  'Evitar: objetos en la boca, inmovilización forzada y retraso de benzodiacepina si >5 min.',
                  'Reevaluar: SatO2, ventilación, PA, glucemia, cese de crisis y recuperación postictal.',
                ],
              },
              {
                id: 'hipoglucemia-convulsiones',
                title: 'Hipoglucemia',
                type: 'treatment',
                severity: 'warning',
                summary: 'Corregir de inmediato si la glucemia capilar confirma hipoglucemia.',
                items: [
                  'Fármaco/intervención: glucosa IV si hipoglucemia confirmada.',
                  'Dosis: usar pauta local de hipoglucemia; no se muestra dosis única desde este protocolo.',
                  'Vía: intravenosa si compromiso neurológico.',
                  'Evitar: sueros glucosados sin hipoglucemia confirmada como rutina en estatus.',
                  'Reevaluar: recuperación, glucemia repetida y causa de la hipoglucemia.',
                ],
              },
              {
                id: 'estatus-refractario',
                title: 'Estatus refractario',
                type: 'treatment',
                severity: 'danger',
                summary: 'Persistencia pese a benzodiacepina y segunda línea: activar UCI/anestesia.',
                items: [
                  'Fármaco/intervención: intubación, anestesia y perfusión según protocolo local.',
                  'Dosis: no se muestra una pauta única porque depende del fármaco/anestesia local y monitorización EEG.',
                  'Vía: UCI con soporte ventilatorio y monitorización continua.',
                  'Evitar: repetir benzodiacepinas indefinidamente sin escalar.',
                  'Reevaluar: cese clínico/EEG, ventilación, hemodinámica y causa reversible.',
                ],
              },
            ],
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta solo si recuperación completa y sin alarma; observación, ingreso o UCI si riesgo.',
        points: [
          'Alta si crisis aislada conocida, recuperación completa, causa corregida y sin datos de alarma.',
          'Observación si primera crisis, crisis prolongada, lesión, intoxicación, alteración metabólica o mala recuperación.',
          'Ingreso/neurología si crisis recurrentes, focalidad, causa estructural, infección SNC o ajuste terapéutico complejo.',
          'UCI si estatus, depresión respiratoria, necesidad de intubación, anestesia o perfusión continua.',
        ],
        detailNodes: [
          {
            id: 'seguimiento-convulsiones',
            title: 'Seguimiento y alarma',
            type: 'decision',
            severity: 'success',
            items: [
              'Neurología preferente tras primera crisis o si hay cambio de patrón, recurrencia, déficit o duda de tratamiento.',
              'Explicar regreso urgente por nueva crisis, fiebre/meningismo, cefalea intensa, déficit, somnolencia progresiva o traumatismo.',
              'No conducir ni realizar actividades de riesgo hasta valoración y normativa aplicable.',
            ],
          },
        ],
      },
    ],
  };
};

const buildAnaphylaxisFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Inicio agudo tras exposición probable con piel/mucosas, respiratorio, cardiovascular o digestivo.',
        points: [
          'Inicio agudo tras exposición probable a alérgeno, fármaco, alimento, picadura u otro desencadenante.',
          'Piel/mucosas: urticaria, prurito, flushing o angioedema; puede faltar la urticaria.',
          'Respiratorio: disnea, broncoespasmo, estridor, hipoxemia o dificultad para hablar.',
          'Cardiovascular: hipotensión, síncope, colapso o shock.',
          'Digestivo persistente: vómitos, dolor abdominal o diarrea, sobre todo si se asocia a otro sistema.',
        ],
        detailNodes: [
          {
            id: 'red-flags-anafilaxia',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: [
              'Estridor, broncoespasmo grave, SatO2 baja, hipotensión, síncope o deterioro del nivel de conciencia.',
              'Necesidad de adrenalina repetida, exposición a veneno/fármaco, asma, edad avanzada o comorbilidad cardiovascular.',
              'La ausencia de urticaria no descarta anafilaxia si hay compromiso respiratorio o circulatorio.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Diagnóstico clínico: constantes y monitorización si gravedad; no retrasar adrenalina.',
        points: [
          'Diagnóstico clínico: no esperar analítica ni triptasa para tratar.',
          'Constantes, SatO2 y monitorización si gravedad, hipotensión, broncoespasmo, estridor o adrenalina repetida.',
          'Glucemia si alteración del nivel de conciencia; ECG si inestabilidad, edad/riesgo o adrenalina repetida.',
          'Triptasa sérica si disponible y no retrasa tratamiento; gasometría/lactato si shock o insuficiencia respiratoria.',
          'Buscar desencadenante, medicación previa, asma, betabloqueantes/IECA y reacción bifásica previa.',
        ],
        detailNodes: [
          {
            id: 'pruebas-anafilaxia-detalle',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'Hipoxemia, lactato elevado, hipotensión persistente o necesidad de adrenalina repetida obligan a monitorización y posible UCI.',
              'ECG ayuda si dolor torácico, arritmia, cardiopatía o uso repetido de adrenalina.',
              'La triptasa apoya el diagnóstico retrospectivo y la derivación, pero no decide el tratamiento inmediato.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Diferenciar reacción leve de anafilaxia; si hay compromiso respiratorio/circulatorio, adrenalina IM inmediata.',
        points: [
          'Anafilaxia probable: afectación respiratoria o cardiovascular, o dos sistemas tras exposición probable.',
          'Reacción leve: piel/mucosas aisladas sin disnea, estridor, broncoespasmo, hipotensión, síncope ni síntomas progresivos.',
          'Shock anafiláctico: hipotensión, mala perfusión, síncope o colapso; monitorizar y escalar soporte.',
          'Broncoespasmo/estridor: adrenalina IM, oxígeno y soporte; valorar vía aérea precoz si progresivo.',
          'Tras resolución, decidir observación, ingreso/UCI y derivación a alergología.',
        ],
        detailNodes: [
          {
            id: 'decision-anafilaxia',
            title: 'Nivel de cuidados',
            type: 'decision',
            severity: 'warning',
            items: [
              'UCI/intubación si shock persistente, estridor progresivo, depresión respiratoria o necesidad de perfusión de adrenalina.',
              'Observación tras anafilaxia incluso si mejora; mayor vigilancia si adrenalina repetida o comorbilidad.',
              'La adrenalina IV/perfusión queda reservada a entorno monitorizado con personal experto.',
            ],
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Adrenalina IM es primera línea; soporte ABC y adyuvantes sin retrasar lo vital.',
        points: [
          'ABC, retirar desencadenante si es posible, posición cómoda o decúbito si hipotensión y oxígeno si hipoxemia.',
          'Adrenalina IM inmediata si anafilaxia probable con compromiso respiratorio/circulatorio.',
          'Fluidoterapia IV si hipotensión o shock; broncodilatador inhalado si broncoespasmo persistente.',
          'Antihistamínico y corticoide solo como adyuvantes, nunca sustitutos de adrenalina.',
          'Shock refractario: UCI/anestesia, vía aérea y adrenalina IV/perfusión según protocolo local experto.',
        ],
        treatmentGroups: [
          {
            id: 'soporte-anafilaxia',
            title: 'Soporte inicial',
            cards: [
              {
                id: 'abc-anafilaxia',
                title: 'ABC y soporte',
                type: 'treatment',
                severity: 'danger',
                summary: 'No retrasar adrenalina si hay compromiso respiratorio o circulatorio.',
                items: [
                  'Fármaco/intervención: ABC, retirada del desencadenante si es posible, oxígeno si hipoxemia y monitorización si gravedad.',
                  'Dosis: oxígeno titulado a SatO2; fluidos IV en bolos según PA, perfusión y comorbilidad.',
                  'Vía: oxígeno inhalado; suero IV si hipotensión o shock.',
                  'Evitar: bipedestación en hipotensión, retrasar adrenalina por canalizar vía o esperar pruebas.',
                  'Reevaluar: SatO2, PA, pulso, estridor, broncoespasmo, urticaria/angioedema y respuesta a adrenalina.',
                ],
              },
              {
                id: 'adrenalina-iv-anafilaxia',
                title: 'Shock refractario',
                type: 'treatment',
                severity: 'danger',
                summary: 'Escalar a UCI/anestesia si no responde a adrenalina IM y fluidos.',
                items: [
                  'Fármaco/intervención: adrenalina IV/perfusión solo en entorno monitorizado y con personal experto.',
                  'Dosis: según protocolo local de críticos; no se muestra una pauta única desde esta ficha.',
                  'Vía: IV monitorizada, preferentemente en UCI/área de reanimación.',
                  'Evitar: bolos IV no diluidos o sin monitorización.',
                  'Reevaluar: PAM, perfusión, ECG, lactato, necesidad de intubación y reacción bifásica.',
                ],
              },
            ],
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta solo tras estabilidad completa; observación, ingreso o UCI según gravedad y riesgo de recurrencia.',
        points: [
          'Observación tras anafilaxia; más prolongada si adrenalina repetida, shock, broncoespasmo/estridor o comorbilidad.',
          'Ingreso/UCI si shock, estridor, broncoespasmo grave, hipotensión persistente, depresión respiratoria o necesidad de intubación/perfusión.',
          'Alta solo si estabilidad completa, educación, evitación del desencadenante, plan escrito y adrenalina autoinyectable si procede.',
          'Derivar a alergología y explicar signos de alarma: disnea, mareo/síncope, urticaria progresiva, vómitos persistentes o edema facial/laríngeo.',
        ],
        detailNodes: [
          {
            id: 'alta-anafilaxia',
            title: 'Alta segura',
            type: 'decision',
            severity: 'success',
            items: [
              'Entregar recomendaciones escritas, plan de actuación y demostración del autoinyector si está indicado.',
              'Evitar el desencadenante sospechoso hasta valoración especializada.',
              'Volver de inmediato por recurrencia respiratoria, cardiovascular, angioedema, síncope o síntomas progresivos.',
            ],
          },
        ],
      },
    ],
  };
};

const buildAsthmaExacerbationFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Disnea, tos, opresión o sibilancias con aumento de rescate; buscar datos de gravedad.',
        points: [
          'Disnea, tos, opresión torácica, sibilancias o aumento de SABA respecto a su situación basal.',
          'Dificultad para hablar, tiraje, taquipnea, taquicardia o SatO2 baja orientan a crisis relevante.',
          'Silencio auscultatorio, agotamiento, confusión, cianosis, hipotensión o bradicardia son alarma.',
          'Antecedente de asma grave, ingreso/UCI, intubación previa o corticoides recientes aumenta riesgo.',
          'Valorar anafilaxia, infección, neumotórax, TEP o causa cardiaca si clínica no encaja.',
        ],
        detailNodes: [
          {
            id: 'red-flags-asma',
            title: 'Riesgo vital',
            type: 'alert',
            severity: 'danger',
            items: [
              'Alteración del nivel de conciencia, agotamiento, silencio auscultatorio o cianosis obligan a manejo avanzado.',
              'Hipercapnia o normalización de PaCO2 en paciente agotado es mala señal.',
              'Mala respuesta tras tratamiento inicial exige observación estrecha, ingreso o UCI según evolución.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Constantes y SatO2 siempre; PEF si no retrasa tratamiento; gasometría e imagen solo si cambian conducta.',
        points: [
          'Constantes, SatO2, frecuencia respiratoria y cardiaca; PEF si disponible y no retrasa tratamiento.',
          'Gasometría si crisis grave, mala respuesta, agotamiento, hipoxemia o sospecha de hipercapnia.',
          'Rx tórax solo si mala evolución, fiebre, dolor torácico, sospecha neumonía/neumotórax o diagnóstico alternativo.',
          'ECG si dolor torácico, arritmia, edad/riesgo cardiovascular o beta-agonistas repetidos.',
          'Analítica si crisis grave, ingreso, sospecha infección, hipopotasemia o tratamiento intensivo.',
        ],
        detailNodes: [
          {
            id: 'pruebas-asma-detalle',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'PEF <50% o descenso marcado tras tratamiento apoya gravedad y necesidad de vigilancia.',
              'Hipoxemia persistente, acidosis o hipercapnia obligan a escalar soporte y valorar UCI.',
              'Neumotórax, neumonía o insuficiencia cardiaca modifican tratamiento y destino.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Clasificar leve/moderada, grave o riesgo vital y decidir respuesta, observación, ingreso o UCI.',
        points: [
          'Leve/moderada: habla conservada, sin agotamiento ni alarma y respuesta clara al broncodilatador.',
          'Grave: dificultad para hablar, tiraje, FR/FC elevadas, SatO2 baja, PEF reducido o respuesta incompleta.',
          'Riesgo vital: silencio auscultatorio, cianosis, confusión, agotamiento, hipotensión, bradicardia o hipercapnia.',
          'Buena respuesta: mejoría sostenida de síntomas, SatO2 y PEF si se mide; plan de alta posible.',
          'Mala respuesta: repetir broncodilatador, añadir ipratropio/corticoide, considerar magnesio e ingreso/UCI.',
        ],
        detailNodes: [
          {
            id: 'decision-asma-destino',
            title: 'Escalada',
            type: 'decision',
            severity: 'warning',
            items: [
              'Observación si necesita broncodilatadores repetidos, respuesta parcial o factores de riesgo.',
              'Ingreso si crisis grave, hipoxemia persistente, comorbilidad, agotamiento o mala respuesta.',
              'UCI si deterioro, hipercapnia, alteración mental, silencio auscultatorio o necesidad de ventilación/intubación.',
            ],
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Oxígeno si hipoxemia, SABA repetido, ipratropio si moderada-grave, corticoide precoz y magnesio si refractaria.',
        points: [
          'Oxígeno si hipoxemia; en adulto orientar a SatO2 93-95% salvo otra indicación clínica.',
          'Salbutamol inhalado/nebulizado de inicio y repetir según respuesta durante la primera hora.',
          'Añadir ipratropio si crisis moderada-grave, grave o mala respuesta inicial.',
          'Corticoide sistémico precoz; vía oral si tolera, IV si no puede deglutir, vomita o precisa ventilación.',
          'Sulfato de magnesio IV si crisis grave/refractaria; adrenalina IM solo si anafilaxia asociada.',
        ],
        actions: [procedureAction('vmni', 'Ver procedimiento VMNI')],
        treatmentGroups: [
          {
            id: 'soporte-asma',
            title: 'Soporte inicial',
            cards: [
              {
                id: 'oxigeno-asma',
                title: 'Oxígeno y monitorización',
                type: 'treatment',
                severity: 'info',
                summary: 'Administrar si hipoxemia o crisis grave mientras actúan broncodilatadores y corticoide.',
                items: [
                  'Fármaco/intervención: oxígeno, monitorización y posición cómoda.',
                  'Dosis: titular para SatO2 93-95% en adultos si no hay otra indicación.',
                  'Vía: gafas, mascarilla o nebulización según situación clínica.',
                  'Evitar: retrasar broncodilatadores o corticoide por pruebas complementarias.',
                  'Reevaluar: SatO2, habla, tiraje, auscultación, FR/FC y PEF si disponible.',
                ],
              },
              {
                id: 'anafilaxia-asma',
                title: 'Anafilaxia asociada',
                type: 'treatment',
                severity: 'danger',
                summary: 'Si hay anafilaxia, la prioridad es adrenalina IM y soporte específico.',
                items: [
                  'Fármaco/intervención: manejar como anafilaxia si hay exposición probable con compromiso respiratorio/circulatorio.',
                  'Dosis: usar protocolo de Anafilaxia para adrenalina IM.',
                  'Vía: IM en muslo si anafilaxia probable.',
                  'Evitar: tratar una anafilaxia solo con salbutamol, antihistamínicos o corticoide.',
                  'Reevaluar: PA, SatO2, broncoespasmo, estridor y necesidad de adrenalina repetida.',
                ],
              },
            ],
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta solo con respuesta completa; observar, ingresar o UCI si respuesta parcial, gravedad o riesgo.',
        points: [
          'Alta si respuesta completa, SatO2 adecuada, sin signos de gravedad, PEF mejorado si se usa y plan escrito.',
          'Observación si respuesta parcial, necesidad de broncodilatadores repetidos o factores de riesgo.',
          'Ingreso si crisis grave, hipoxemia persistente, mala respuesta, comorbilidad, agotamiento o riesgo social.',
          'UCI si deterioro, hipercapnia, agotamiento, alteración mental, silencio auscultatorio o necesidad de VNI/intubación.',
          'Revisar técnica inhalatoria, tratamiento controlador, rescate y signos de alarma antes del alta.',
        ],
        detailNodes: [
          {
            id: 'alta-asma',
            title: 'Alta segura',
            type: 'decision',
            severity: 'success',
            items: [
              'Confirmar mejoría sostenida tras espaciar broncodilatadores y ausencia de datos de riesgo vital.',
              'Indicar corticoide pautado si procede, rescate, revisión temprana y ajuste de controlador.',
              'Volver por disnea progresiva, necesidad creciente de rescate, dificultad para hablar, cianosis, somnolencia o mala respuesta.',
            ],
          },
        ],
      },
    ],
  };
};

const buildCopdExacerbationFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'EPOC conocida o probable con aumento de disnea, esputo o purulencia; buscar alarma respiratoria.',
        points: [
          'Paciente con EPOC conocida o sospechada y aumento agudo de disnea o intolerancia al esfuerzo.',
          'Aumento del volumen de esputo o purulencia, tos, sibilancias o broncoespasmo.',
          'Confusión, somnolencia, cianosis, agotamiento, hipotensión, sepsis o uso de musculatura accesoria son alarma.',
          'Buscar desencadenantes: infección, neumonía, insuficiencia cardiaca, arritmia, TEP, neumotórax o mala adherencia.',
          'Diferenciar de asma, anafilaxia y causa cardiaca si la historia respiratoria no es clara.',
        ],
        detailNodes: [
          {
            id: 'red-flags-epoc',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: [
              'Somnolencia, confusión, agotamiento o respiración paradójica sugieren fracaso ventilatorio.',
              'Hipotensión, sepsis, arritmia o dolor torácico obligan a buscar causa alternativa o asociada.',
              'Hipoxemia persistente pese a oxígeno controlado o sospecha de hipercapnia cambia destino y soporte.',
            ],
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Constantes, SatO2 y gasometría si gravedad; Rx/ECG/analítica para descartar complicaciones.',
        points: [
          'Constantes, SatO2, frecuencia respiratoria y trabajo respiratorio desde la llegada.',
          'Gasometría arterial o venosa si SatO2 baja, disnea grave, somnolencia, hipercapnia/acidosis probable o VNI.',
          'Rx tórax si moderado-grave, ingreso o sospecha de neumonía, neumotórax, insuficiencia cardiaca u otra causa.',
          'ECG si dolor torácico, arritmia, insuficiencia cardiaca o riesgo cardiovascular.',
          'Analítica: hemograma, bioquímica, función renal, iones y PCR si infección/ingreso; microbiología si grave, ingreso o mala evolución.',
        ],
        detailNodes: [
          {
            id: 'pruebas-epoc-detalle',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'pH <7,35 con PaCO2 >45 mmHg orienta a insuficiencia respiratoria hipercápnica y VNI si no hay contraindicación.',
              'Neumonía, neumotórax, edema pulmonar o TEP cambian tratamiento y destino.',
              'Creatinina alterada obliga a revisar antibiótico, contraste y fármacos con ajuste renal.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Clasificar leve, moderada o grave; decidir antibiótico, VNI, ingreso o UCI.',
        points: [
          'Leve: aumento de síntomas sin insuficiencia respiratoria ni datos de alarma; alta posible si responde.',
          'Moderada: precisa tratamiento en urgencias, broncodilatadores repetidos, corticoide o vigilancia.',
          'Grave: hipoxemia persistente, hipercapnia/acidosis, neumonía, comorbilidad, mala respuesta o fragilidad.',
          'Antibiótico si esputo purulento con aumento de disnea/volumen, neumonía, ventilación o gravedad.',
          'VNI si acidosis respiratoria/hipercapnia, disnea con trabajo respiratorio o hipoxemia persistente pese a oxígeno controlado.',
        ],
        actions: [procedureAction('vmni', 'Ver procedimiento VMNI'), calculatorAction('cockcroft-gault')],
        detailNodes: [
          {
            id: 'decision-epoc-vni',
            title: 'VNI / UCI',
            type: 'decision',
            severity: 'warning',
            items: [
              'VNI si pH <7,35 y PaCO2 >45 mmHg, FR elevada, fatiga o hipoxemia persistente sin contraindicación.',
              'UCI si pH muy bajo, fracaso de VNI, alteración mental, shock, arritmia grave, agotamiento o necesidad de intubación.',
              'No retrasar intubación si hay deterioro neurológico, broncoaspiración, inestabilidad o imposibilidad de VNI.',
            ],
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Oxígeno controlado, SABA/SAMA, corticoide sistémico, antibiótico solo con criterios y VNI si acidosis.',
        points: [
          'Oxígeno controlado con objetivo SatO2 88-92% si EPOC/riesgo de hipercapnia; evitar hiperoxia.',
          'Salbutamol e ipratropio inhalados/nebulizados; cambiar a dispositivos habituales antes del alta.',
          'Corticoide sistémico: vía oral si tolera; IV si grave o no tolera vía oral.',
          'Antibiótico solo con purulencia/aumento de síntomas, neumonía, ventilación o gravedad.',
          'VNI si acidosis respiratoria o hipercapnia con criterios; fluidos solo si deshidratación o shock.',
        ],
        actions: [procedureAction('vmni', 'Ver procedimiento VMNI'), calculatorAction('cockcroft-gault')],
        treatmentGroups: [
          {
            id: 'soporte-epoc',
            title: 'Soporte inicial',
            cards: [
              {
                id: 'oxigeno-epoc',
                title: 'Oxígeno controlado',
                type: 'treatment',
                severity: 'warning',
                summary: 'Titular oxígeno evitando hiperoxia en EPOC con riesgo de hipercapnia.',
                items: [
                  'Fármaco/intervención: oxígeno controlado y monitorización.',
                  'Dosis: objetivo SatO2 88-92% si riesgo hipercapnia/EPOC.',
                  'Vía: gafas nasales o Venturi según gravedad; evitar flujo excesivo no monitorizado.',
                  'Evitar: SatO2 altas mantenidas si hay riesgo de retención de CO2.',
                  'Reevaluar: SatO2, FR, conciencia y gasometría si grave o VNI.',
                ],
              },
              {
                id: 'vni-epoc',
                title: 'Ventilación no invasiva',
                type: 'treatment',
                severity: 'danger',
                summary: 'Indicada si acidosis hipercápnica o trabajo respiratorio importante sin contraindicación.',
                items: [
                  'Fármaco/intervención: VNI en área monitorizada.',
                  'Dosis: ajustar presiones según tolerancia, fuga, pH, PaCO2 y trabajo respiratorio.',
                  'Vía: interfaz no invasiva con vigilancia estrecha.',
                  'Evitar: VNI si indicación clara de intubación, alto riesgo de aspiración, neumotórax no drenado o inestabilidad no controlada.',
                  'Reevaluar: adaptación, FR, conciencia, pH/PaCO2 y respuesta en 1-2 h.',
                ],
              },
            ],
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta si leve y estable; observación, ingreso o UCI según oxigenación, gasometría, respuesta y comorbilidad.',
        points: [
          'Alta si leve, buena respuesta, SatO2 objetivo estable, tolerancia oral, soporte domiciliario y plan claro.',
          'Observación si respuesta parcial, comorbilidad, duda diagnóstica o necesidad de broncodilatadores repetidos.',
          'Ingreso si hipoxemia, hipercapnia, acidosis, neumonía, mala respuesta, comorbilidad o fragilidad.',
          'UCI si acidosis grave, fracaso de VNI, alteración mental, shock, agotamiento o necesidad de intubación.',
          'Antes del alta: inhaladores, técnica, corticoide/antibiótico si procede, seguimiento y signos de alarma.',
        ],
        detailNodes: [
          {
            id: 'alta-epoc',
            title: 'Alta segura',
            type: 'decision',
            severity: 'success',
            items: [
              'Confirmar estabilidad respiratoria tras espaciar broncodilatadores y con oxígeno basal o objetivo individual.',
              'Revisar inhaladores y asegurar revisión precoz tras urgencias por continuidad asistencial/neumología.',
              'Volver por disnea progresiva, somnolencia, cianosis, fiebre persistente, esputo purulento creciente, dolor torácico o mala tolerancia oral.',
            ],
          },
        ],
      },
    ],
  };
};

const buildPulmonaryEmbolismFlow = (protocol) => ({
  ...genericFlow(protocol),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Disnea, dolor pleurítico, síncope, hipoxemia o TVP: detectar rápido el TEP inestable.',
      points: [
        'Disnea brusca o inexplicada, dolor torácico pleurítico, síncope/presíncope, taquicardia o hipoxemia.',
        'Hemoptisis, dolor pleurítico con roce, ansiedad súbita o deterioro respiratorio sin explicación alternativa clara.',
        'Buscar signos de TVP: dolor, aumento de perímetro, edema unilateral o trayecto venoso doloroso.',
        'Factores de riesgo: cirugía/inmovilización, cáncer, embarazo/puerperio, estrógenos, antecedente ETV, trombofilia o ingreso reciente.',
        'Alarma: hipotensión, shock, síncope, hipoxemia importante o dolor torácico con mala perfusión.',
      ],
      detailNodes: [
        {
          id: 'tep-alto-riesgo-sospecha',
          title: 'Banderas rojas',
          type: 'alert',
          severity: 'danger',
          items: [
            'Hipotensión, shock, parada, síncope o deterioro respiratorio franco.',
            'Hipoxemia importante, cianosis, trabajo respiratorio alto o necesidad de soporte.',
            'Dolor torácico con inestabilidad: descartar SCA, disección, neumotórax y TEP alto riesgo en paralelo.',
          ],
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Probabilidad clínica primero; dímero D solo si baja/intermedia y estable; angio-TC si alta o positivo.',
      points: [
        'Constantes, SatO2, monitorización si gravedad, ECG y vía IV si sospecha relevante.',
        'Rx tórax como apoyo/diferencial; no descarta TEP.',
        'Analítica: hemograma, bioquímica, función renal, iones y coagulación si anticoagulación/procedimiento.',
        'Gasometría si hipoxemia, gravedad o duda ventilatoria; troponina y BNP/NT-proBNP si estratificación o VD.',
        'Dímero D solo en probabilidad baja/intermedia y estable; angio-TC si probabilidad alta o dímero D positivo.',
      ],
      detailNodes: [
        {
          id: 'tep-pruebas-imagen',
          title: 'Imagen y cama crítica',
          type: 'step',
          severity: 'warning',
          items: [
            'Angio-TC pulmonar si probabilidad alta o dímero D positivo; comprobar función renal antes de contraste si la situación lo permite.',
            'Eco-doppler venoso si hay sospecha de TVP o no se puede realizar angio-TC.',
            'Ecocardiografía urgente si shock/inestabilidad o sospecha de TEP de alto riesgo; no retrasa tratamiento si el paciente se deteriora.',
          ],
        },
        {
          id: 'tep-no-dimero-alta',
          title: 'No usar mal el dímero D',
          type: 'alert',
          severity: 'danger',
          items: [
            'No pedir dímero D para descartar TEP con alta probabilidad clínica.',
            'No esperar dímero D si el paciente está inestable o precisa reperfusión/soporte.',
            'Un dímero D positivo no confirma TEP: obliga a imagen si cambia conducta.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Separar TEP alto riesgo de estable; usar Wells para diagnóstico y sPESI para destino si confirmado.',
      points: [
        'TEP inestable/alto riesgo: hipotensión, shock, parada o deterioro con disfunción VD probable; activar UCI y reperfusión.',
        'TEP estable con riesgo intermedio: normotenso, pero VD/biomarcadores alterados o sPESI ≥1; observación/ingreso monitorizado.',
        'TEP estable bajo riesgo: sPESI 0, sin hipoxemia ni sangrado y con tratamiento/seguimiento posible.',
        'Sospecha baja/intermedia: Wells orienta dímero D; sospecha alta: imagen directa y anticoagulación si no contraindicación.',
        'Embarazo/puerperio o alto riesgo de sangrado: consultar circuito específico y evitar automatismos.',
      ],
      actions: [
        calculatorAction('wells-tep'),
        calculatorAction('spesi-tep'),
        calculatorAction('cockcroft-gault'),
        protocolAction('sindrome-coronario-agudo', 'Ver SCA si dolor torácico diferencial'),
      ],
      detailNodes: [
        {
          id: 'tep-sangrado',
          title: 'Antes de anticoagular o fibrinolisar',
          type: 'decision',
          severity: 'warning',
          items: [
            'Revisar sangrado activo, cirugía reciente, ictus reciente, plaquetas bajas, coagulopatía o punción no compresible.',
            'Función renal condiciona HBPM/ACOD y contraste; usar Cockcroft-Gault si dudas.',
            'Si contraindicación absoluta a anticoagulación, valorar filtro cava/circuito especializado según disponibilidad.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'Soporte inicial, anticoagulación si probable/confirmado y reperfusión si TEP alto riesgo.',
      points: [
        'ABCDE, oxígeno si hipoxemia, monitorización si gravedad, vía IV y analgesia si dolor.',
        'Anticoagular si TEP probable/confirmado y no hay contraindicación; no esperar a imagen si alta/intermedia probabilidad y demora.',
        'HBPM si estable y función renal compatible; UFH IV si inestable, IR grave o posible trombólisis/catéter/cirugía.',
        'TEP alto riesgo con shock/hipotensión persistente: activar UCI y valorar trombólisis sistémica si no contraindicada.',
        'ACOD al alta/transición solo si bajo riesgo, función renal y sangrado revisados y seguimiento organizado.',
        'Fluidoterapia solo con cautela si hipoperfusión; VMNI/soporte ventilatorio solo si insuficiencia respiratoria y vigilancia estrecha.',
      ],
      actions: [
        calculatorAction('vascular-heparin-dose'),
        calculatorAction('cockcroft-gault'),
        procedureAction('fluidoterapia-iv', 'Ver Fluidoterapia IV con cautela'),
        procedureAction('vmni', 'Ver VMNI si soporte respiratorio'),
      ],
      treatmentGroups: [
        {
          id: 'tep-soporte',
          title: 'Medidas iniciales',
          cards: [
            {
              id: 'tep-abcde',
              title: 'ABCDE y soporte',
              type: 'treatment',
              severity: 'warning',
              summary: 'Prioridad en TEP inestable o hipoxémico.',
              items: [
                'Intervención: monitorización, vía IV, SatO2 continua si gravedad y analgesia si dolor.',
                'Dosis: oxígeno titulado si hipoxemia; evitar hiperoxia innecesaria.',
                'Vía: gafas, mascarilla o soporte ventilatorio según trabajo respiratorio.',
                'Evitar: retrasar UCI/reperfusión por pruebas no disponibles en shock.',
                'Reevaluar: TA, SatO2, FR, perfusión, dolor, lactato/gasometría y necesidad de vasopresor.',
              ],
            },
            {
              id: 'tep-fluidos',
              title: 'Fluidoterapia con cautela',
              type: 'treatment',
              severity: 'warning',
              summary: 'No es rutina: el exceso puede empeorar el ventrículo derecho.',
              items: [
                'Intervención: bolos pequeños solo si hipoperfusión y sospecha de bajo precarga real.',
                'Dosis: reevaluar tras cada bolo; no perseguir 30 mL/kg como en sepsis.',
                'Evitar: sobrecarga si VD dilatado, congestión o empeora oxigenación.',
                'Reevaluar: TA, perfusión, SatO2, crepitantes, ecocardio si disponible y respuesta clínica.',
              ],
              procedureId: 'fluidoterapia-iv',
            },
          ],
        },
        {
          id: 'tep-anticoagulacion',
          title: 'Anticoagulación',
          cards: [
            {
              id: 'tep-enoxaparina',
              title: 'Enoxaparina',
              type: 'treatment',
              severity: 'info',
              summary: 'HBPM de elección práctica si TEP estable y función renal compatible.',
              medication: 'Anticoagulación TEP estable',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/82491/FT_82491.html',
              items: [
                'Fármaco/intervención: enoxaparina.',
                'Dosis: 1 mg/kg SC cada 12 h; alternativa 1,5 mg/kg SC cada 24 h en pacientes no complicados y bajo riesgo de recurrencia.',
                'Vía: subcutánea.',
                'Ajuste renal: calcular ClCr; si 15-30 mL/min, 1 mg/kg SC cada 24 h según ficha; no recomendada si ClCr <15 mL/min fuera de indicación especializada.',
                'Evitar: sangrado activo, antecedente de HIT reciente, plaquetopenia relevante, cirugía reciente de alto riesgo o TEP que probablemente requiera trombólisis/cirugía.',
                'Reevaluar: sangrado, plaquetas, función renal, peso real y transición a anticoagulación oral si procede.',
              ],
            },
            {
              id: 'tep-heparina-sodica',
              title: 'Heparina sódica IV',
              type: 'treatment',
              severity: 'warning',
              summary: 'Preferible si inestabilidad, IR grave o posible reperfusión/procedimiento.',
              medication: 'Anticoagulación ajustable',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/58691/FT_58691.html',
              calculatorId: 'vascular-heparin-dose',
              items: [
                'Fármaco/intervención: heparina sódica no fraccionada.',
                'Dosis: bolo IV 80 UI/kg y perfusión inicial 18 UI/kg/h; en TEP grave puede aumentarse hasta 120 UI/kg según ficha/protocolo local.',
                'Vía: IV bolo y perfusión ajustada a aPTT/anti-Xa según circuito local.',
                'Frecuencia/perfusión: perfusión continua; no ajustar automáticamente sin TTPa/anti-Xa y protocolo local.',
                'Evitar: sangrado activo, HIT, plaquetopenia relevante, cirugía reciente de alto riesgo o contraindicación de anticoagulación.',
                'Reevaluar: TTPa/anti-Xa, plaquetas, sangrado, TA, perfusión y necesidad de reperfusión/procedimiento.',
              ],
            },
            {
              id: 'tep-fondaparinux',
              title: 'Fondaparinux',
              type: 'treatment',
              severity: 'info',
              summary: 'Alternativa SC en TEP estable si no se precisa anticoagulación IV ajustable.',
              medication: 'Anticoagulación TEP estable',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/02206011/FT_02206011.html',
              items: [
                'Fármaco/intervención: fondaparinux.',
                'Dosis: <50 kg 5 mg SC cada 24 h; 50-100 kg 7,5 mg SC cada 24 h; >100 kg 10 mg SC cada 24 h.',
                'Vía: subcutánea.',
                'Ajuste renal: contraindicado si ClCr <30 mL/min; usar con precaución si ClCr 30-50 mL/min.',
                'Evitar: TEP inestable, necesidad probable de trombólisis/embolectomía, sangrado activo, endocarditis bacteriana aguda, plaquetopenia relevante o ClCr <30 mL/min.',
                'Reevaluar: sangrado, peso, función renal, plaquetas y transición a anticoagulación oral si procede.',
              ],
            },
            {
              id: 'tep-apixaban-transicion',
              title: 'Apixabán al alta / transición',
              type: 'treatment',
              severity: 'success',
              summary: 'Solo en TEP estable seleccionado, con tratamiento y seguimiento cerrados.',
              medication: 'Anticoagulación oral',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/111691014/FT_111691014.html',
              items: [
                'Apixabán: 10 mg VO cada 12 h durante 7 días; después 5 mg VO cada 12 h.',
                'Uso: TEP estable seleccionado; no para shock, hipotensión persistente ni reperfusión/procedimiento probable.',
                'Revisar: ClCr con Cockcroft-Gault, sangrado, interacciones P-gp/CYP3A4, adherencia, embarazo, cáncer activo y soporte.',
                'Evitar: sangrado activo, hepatopatía con coagulopatía, embarazo/lactancia sin circuito específico o ClCr fuera de ficha técnica.',
                'Reevaluar: sangrado, disnea/dolor, SatO2, tolerancia, educación de signos de alarma y cita/seguimiento local.',
              ],
            },
            {
              id: 'tep-rivaroxaban-transicion',
              title: 'Rivaroxabán al alta / transición',
              type: 'treatment',
              severity: 'success',
              summary: 'Alternativa oral si bajo riesgo y plan ambulatorio viable.',
              medication: 'Anticoagulación oral',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/08472016/FT_08472016.html',
              items: [
                'Rivaroxabán: 15 mg VO cada 12 h durante 3 semanas; después 20 mg VO cada 24 h con alimento.',
                'Uso: TEP estable seleccionado; no para shock, hipotensión persistente ni reperfusión/procedimiento probable.',
                'Revisar: ClCr con Cockcroft-Gault, sangrado, interacciones P-gp/CYP3A4, adherencia, embarazo, cáncer activo y soporte.',
                'Evitar: sangrado activo, hepatopatía con coagulopatía, embarazo/lactancia sin circuito específico o ClCr fuera de ficha técnica.',
                'Reevaluar: sangrado, disnea/dolor, SatO2, tolerancia, educación de signos de alarma y cita/seguimiento local.',
              ],
            },
          ],
        },
        {
          id: 'tep-reperfusion',
          title: 'TEP alto riesgo / reperfusión',
          cards: [
            {
              id: 'tep-alteplasa',
              title: 'Alteplasa',
              type: 'treatment',
              severity: 'danger',
              summary: 'Trombólisis sistémica para embolia pulmonar aguda masiva/alto riesgo si no contraindicada.',
              medication: 'Fibrinólisis TEP alto riesgo',
              sourceUrl: 'https://cima.aemps.es/cima/dochtml/ft/59494/FT_59494.html',
              items: [
                'Indicación: TEP alto riesgo con shock/hipotensión persistente, en entorno monitorizado/UCI y si no hay contraindicación mayor.',
                'Dosis: si peso ≥65 kg, 10 mg bolo IV en 1-2 min y 90 mg en perfusión IV durante 2 h; máximo total 100 mg.',
                'Dosis si <65 kg: 10 mg bolo IV y perfusión durante 2 h hasta máximo total 1,5 mg/kg.',
                'Vía: intravenosa; reconstituida para uso inmediato.',
                'Evitar: sangrado activo, ictus/cirugía reciente, lesión SNC, coagulopatía, punción no compresible o contraindicación mayor de fibrinólisis.',
                'Reevaluar: TA, SatO2, perfusión y sangrado; suspender/avisar si hemorragia y reiniciar heparina solo cuando TTPa sea seguro según ficha/protocolo.',
              ],
            },
            {
              id: 'tep-cateter-cirugia',
              title: 'Catéter / embolectomía',
              type: 'treatment',
              severity: 'danger',
              summary: 'Alternativa si trombólisis contraindicada o fracaso, según disponibilidad.',
              items: [
                'Intervención: activar UCI/cardiología/neumología/radiología intervencionista o cirugía según circuito.',
                'Indicación: TEP alto riesgo con contraindicación de trombólisis, fracaso o deterioro pese a tratamiento.',
                'Evitar: retrasar soporte hemodinámico y traslado a centro útil si no existe recurso local.',
                'Reevaluar: estabilidad, sangrado, VD, lactato y necesidad de soporte circulatorio.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Alta solo si bajo riesgo y tratamiento organizado; UCI si shock, trombólisis o deterioro.',
      points: [
        'Alta/ambulatorio solo si bajo riesgo, estable, sin hipoxemia, sin sangrado, buen soporte y seguimiento claro.',
        'Observación/ingreso si dolor, hipoxemia, comorbilidad, riesgo intermedio, duda diagnóstica, sangrado o mal soporte.',
        'UCI si shock, hipotensión, vasopresor, trombólisis, hipoxemia grave, disfunción VD grave, deterioro o parada.',
        'Seguimiento: anticoagulación organizada, control clínico, signos de alarma y estudio etiológico posterior si procede.',
        'Volver por disnea o dolor progresivo, síncope, hemoptisis, sangrado, melena, cefalea brusca o empeoramiento general.',
      ],
      detailNodes: [
        {
          id: 'tep-alta-segura',
          title: 'Alta segura',
          type: 'decision',
          severity: 'success',
          items: [
            'Confirmar estabilidad sostenida, SatO2 adecuada, sin disfunción grave de VD, sin sangrado y sin contraindicación al tratamiento.',
            'Asegurar primera dosis, receta/plan de anticoagulación, educación sobre sangrado y revisión según circuito local.',
            'No dar alta si embarazo/puerperio, cáncer inestable, mal soporte, hipoxemia, dolor no controlado o duda diagnóstica relevante.',
          ],
        },
      ],
    },
  ],
});

const buildAcuteHeartFailureFlow = (protocol) => {
  const medicationGroups = asArray(protocol.medicationGroups);

  return {
    ...genericFlow(protocol),
    layout: 'decision-panel',
    panelSections: [
      {
        id: 'sospecha',
        title: 'Sospecha',
        summary: 'Disnea aguda con congestión, hipoxemia o bajo gasto; separar EAP hipertensivo de shock cardiogénico.',
        points: [
          'Disnea aguda, ortopnea/disnea paroxística nocturna, crepitantes, ingurgitación yugular o edemas.',
          'SatO2 baja, hipertensión marcada o hipotensión con mala perfusión.',
          'Buscar desencadenante: SCA, arritmia, infección, crisis hipertensiva, incumplimiento, anemia, TEP o insuficiencia renal.',
          'Fenotipos útiles: congestión predominante, EAP hipertensivo, bajo gasto/shock e insuficiencia respiratoria.',
        ],
        detailNodes: [
          {
            id: 'ica-red-flags',
            title: 'Datos de alarma',
            type: 'alert',
            severity: 'danger',
            items: asArray(protocol.warnings),
          },
        ],
      },
      {
        id: 'pruebas',
        title: 'Pruebas',
        summary: 'Confirmar congestión, detectar desencadenante y medir respiratorio, renal, electrolitos y perfusión.',
        points: [
          'Constantes, SatO2, monitorización y ECG 12 derivaciones.',
          'Rx tórax si disponible y cambia conducta; ecografía pulmonar/cardiaca si se puede hacer sin retrasar medidas.',
          'Analítica: hemograma, urea/creatinina, iones, glucemia y función hepática si gravedad.',
          'Troponina si sospecha SCA o descompensación grave; BNP/NT-proBNP si duda diagnóstica.',
          'Gasometría si hipoxemia, hipercapnia, acidosis, EPOC o gravedad; lactato si shock/hipoperfusión.',
        ],
        detailNodes: [
          {
            id: 'ica-resultados',
            title: 'Resultados que cambian conducta',
            type: 'step',
            items: [
              'ECG/troponina: si sugiere SCA, activar protocolo SCA y destino monitorizado.',
              'Creatinina, potasio y sodio condicionan diurético, seguridad y seguimiento.',
              'Hipercapnia/acidosis o trabajo respiratorio elevado apoyan VMNI y área monitorizada.',
              'Lactato elevado o hipoperfusión persistente orientan a shock cardiogénico/UCI.',
            ],
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Clasificar fenotipo y decidir VMNI, diurético/nitratos, causa desencadenante y destino.',
        points: [
          'EAP hipertensivo: disnea intensa, congestión, PA alta; VMNI/CPAP y nitratos si TA lo permite.',
          'ICA congestiva sin shock: diurético IV, control de diuresis y electrolitos.',
          'Hipotensión/bajo gasto o shock cardiogénico: no nitratos; UCI/cardiología precoz.',
          'Tratar desencadenante: SCA, FA rápida, HTA, infección, TEP, anemia o insuficiencia renal.',
          'VMNI si hipoxemia, trabajo respiratorio o EAP sin contraindicación.',
        ],
        actions: [
          procedureAction('vmni', 'Ver procedimiento VMNI'),
          protocolAction('sindrome-coronario-agudo', 'Ver SCA'),
          protocolAction('hta-urgencias', 'Ver HTA'),
          procedureAction('fluidoterapia-iv', 'Ver Fluidoterapia IV'),
        ],
        detailNodes: [
          {
            id: 'ica-fluidoterapia-precaucion',
            title: 'Fluidoterapia solo si toca',
            type: 'alert',
            severity: 'warning',
            items: [
              'No usar fluidos como rutina en congestión o EAP.',
              'Valorar Fluidoterapia IV solo si sospecha hipovolemia, bajo gasto con déficit real o necesidad de reevaluar balance.',
              'Si shock persiste, no retrasar UCI/cardiología por completar cálculos.',
            ],
          },
        ],
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Posición incorporada, oxígeno/VMNI si precisa, diurético si congestión, nitratos si EAP hipertensivo y TA suficiente.',
        points: [
          'Posición incorporada, monitorización, vía IV, oxígeno si hipoxemia y tratar desencadenante.',
          'VMNI/CPAP si EAP con dificultad respiratoria, hipoxemia o trabajo respiratorio.',
          'Furosemida IV si congestión/sobrecarga; controlar diuresis, TA, creatinina y potasio.',
          'Nitroglicerina IV si EAP hipertensivo o congestión con TA suficiente; evitar si hipotensión/shock/PDE5.',
          'Shock cardiogénico: UCI/cardiología precoz; vasoactivos solo en entorno monitorizado/protocolo local.',
        ],
        actions: [
          procedureAction('vmni', 'Ver procedimiento VMNI'),
          calculatorAction('simple-fluid-balance'),
          calculatorAction('infusion-rate'),
          calculatorAction('cockcroft-gault'),
        ],
        treatmentGroups: [
          {
            id: 'ica-medidas-iniciales',
            title: 'Medidas iniciales',
            cards: [
              {
                id: 'ica-posicion-oxigeno',
                title: 'Soporte inicial',
                type: 'treatment',
                severity: 'warning',
                summary: 'Actuar rápido sobre respiratorio, perfusión y desencadenante.',
                items: [
                  'Intervención: posición incorporada, monitorización, vía IV y oxígeno si hipoxemia.',
                  'Dosis: oxígeno titulado a objetivo de SatO2 según contexto clínico.',
                  'Vía: gafas, mascarilla o VMNI si trabajo respiratorio/hipoxemia.',
                  'Evitar: oxígeno rutinario si no hay hipoxemia o retrasar VMNI en EAP franco.',
                  'Reevaluar: SatO2, FR, trabajo respiratorio, TA, perfusión y necesidad de UCI.',
                ],
              },
              {
                id: 'ica-vmni',
                title: 'VMNI / CPAP',
                type: 'treatment',
                severity: 'danger',
                summary: 'Útil en EAP con hipoxemia o trabajo respiratorio si no hay contraindicación.',
                items: [
                  'Intervención: VMNI/CPAP en área monitorizada.',
                  'Dosis: ajustar según procedimiento VMNI, tolerancia, fugas, SatO2 y gasometría si procede.',
                  'Vía: interfaz no invasiva con vigilancia estrecha.',
                  'Evitar: disminución marcada de conciencia, vómitos activos, shock no controlado o indicación de intubación inmediata.',
                  'Reevaluar: disnea, FR, SatO2, TA, sincronía y gasometría si gravedad.',
                ],
                procedureId: 'vmni',
              },
            ],
          },
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            cards: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      {
        id: 'destino',
        title: 'Destino',
        summary: 'Alta rara; observación, ingreso o UCI según respuesta, oxígeno/VMNI, renal, electrolitos y desencadenante.',
        points: [
          'Alta solo en casos muy seleccionados con resolución clara, estabilidad, bajo riesgo y seguimiento estrecho.',
          'Observación si respuesta rápida pero necesita vigilancia de diuresis, TA, oxígeno o analítica.',
          'Ingreso si requiere IV, oxígeno, VMNI, causa no resuelta, insuficiencia renal, alteraciones iónicas o comorbilidad.',
          'UCI/cardiología si shock, hipoxemia persistente, VMNI prolongada, arritmia grave, SCA, lactato elevado, hipotensión o vasoactivos.',
          'Tras urgencias: peso, diuresis, creatinina, potasio y ajuste del tratamiento habitual.',
        ],
        detailNodes: [
          {
            id: 'ica-alta-segura',
            title: 'Antes del alta',
            type: 'decision',
            severity: 'success',
            items: [
              'Confirmar estabilidad respiratoria y hemodinámica sin tratamiento IV activo.',
              'Revisar desencadenante, tratamiento habitual, diurético, función renal y potasio.',
              'Explicar alarma por disnea, ortopnea, ganancia de peso, síncope, dolor torácico o edemas progresivos.',
            ],
          },
        ],
      },
    ],
  };
};

const buildSepsisFlow = (protocol) => ({
  ...genericFlow(protocol),
  layout: 'decision-panel',
  panelSections: [
    {
      id: 'sospecha',
      title: 'Sospecha',
      summary: 'Sospechar sepsis ante infección con hipoperfusión, disfunción orgánica o deterioro clínico.',
      points: [
        'Infección sospechada o confirmada con deterioro, fragilidad, inmunosupresión o comorbilidad relevante.',
        'Hipotensión, mala perfusión, relleno capilar lento, piel moteada, oliguria o lactato elevado si disponible.',
        'Alteración mental, taquipnea/disnea, hipoxemia, fiebre o hipotermia.',
        'Shock séptico: hipotensión/hipoperfusión persistente con necesidad de soporte pese a resucitación inicial.',
        'Anciano, inmunosuprimido o frágil puede presentar poca fiebre y deterioro inespecífico.',
      ],
      detailNodes: [
        {
          id: 'sepsis-alarmas',
          title: 'Datos de alarma',
          type: 'alert',
          severity: 'danger',
          items: [
            'PAS baja, PAM baja, lactato elevado, confusión, oliguria o piel fría/moteada.',
            'Insuficiencia respiratoria, acidosis, coagulopatía, fracaso renal o hepático.',
            'Neutropenia, inmunosupresión, embarazo/puerperio, edad avanzada o foco no controlado.',
          ],
        },
      ],
    },
    {
      id: 'pruebas',
      title: 'Pruebas',
      summary: 'Medir gravedad, buscar foco y tomar cultivos sin retrasar antibiótico urgente.',
      points: [
        'Constantes completas y monitorización si gravedad: TA/PAM, FC, FR, SatO2, temperatura y estado mental.',
        'Lactato, hemograma, bioquímica, función renal, iones; hepático y coagulación si gravedad o disfunción.',
        'Gasometría si shock, insuficiencia respiratoria, acidosis o lactato elevado.',
        'Hemocultivos antes del antibiótico si no retrasa; cultivos según foco y sedimento/orina si urinario.',
        'Imagen por foco y estabilidad: Rx tórax, ecografía, TC u otras pruebas sin retrasar control de foco si inestable.',
      ],
      detailNodes: [
        {
          id: 'sepsis-resultados',
          title: 'Resultados que cambian conducta',
          type: 'step',
          items: [
            'Lactato elevado o ascendente obliga a resucitación, reevaluación y destino monitorizado.',
            'Creatinina, iones y función hepática modifican fluidos, contraste, antibiótico y seguridad.',
            'Foco drenable, obstrucción infectada, peritonitis, empiema o material infectado exige control de foco precoz.',
          ],
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decisión',
      summary: 'Diferenciar infección, sepsis probable y shock séptico; decidir antibiótico, fluidos, foco y UCI.',
      points: [
        'Infección sin sepsis: estable, sin hipoperfusión ni disfunción; tratamiento según foco y vigilancia.',
        'Sepsis probable: infección con disfunción, lactato elevado, hipotensión, alteración mental, oliguria o mala perfusión.',
        'Shock séptico: hipotensión/hipoperfusión persistente; no retrasar UCI, vasopresor ni control de foco.',
        'No usar qSOFA como único filtro de gravedad; priorizar juicio clínico, lactato, constantes y disfunción orgánica.',
        'Control de foco urgente si hay foco drenable, obstrucción, isquemia, necrosis o dispositivo infectado.',
      ],
      actions: [procedureAction('fluidoterapia-iv', 'Ver Fluidoterapia IV en urgencias'), calculatorAction('sepsis-30mlkg')],
      detailNodes: [
        {
          id: 'sepsis-qsofa',
          title: 'qSOFA / SOFA',
          type: 'decision',
          severity: 'warning',
          items: [
            'qSOFA puede orientar riesgo, pero no debe sustituir la valoración clínica completa ni el seguimiento de disfunción orgánica.',
            'La ausencia de qSOFA positivo no descarta sepsis ni debe retrasar tratamiento si el paciente impresiona grave.',
            'SOFA requiere datos completos de órgano y laboratorio; usarlo cuando esté disponible sin retrasar medidas iniciales.',
          ],
        },
      ],
    },
    {
      id: 'tratamiento',
      title: 'Tratamiento',
      summary: 'ABCDE, oxígeno si hipoxemia, antibiótico precoz, fluidos si hipoperfusión, control de foco y UCI si shock.',
      points: [
        'ABCDE, monitorización, dos vías si grave, oxígeno si hipoxemia y reevaluación clínica frecuente.',
        'Hemocultivos antes del antibiótico si no retrasa; antibiótico precoz según foco, gravedad, alergias y resistencias locales.',
        'Cristaloide IV si hipoperfusión o shock; valorar 30 mL/kg en primeras 3 h con reevaluación frecuente.',
        'Usar Fluidoterapia IV para tipo, volumen, ritmo, balance y riesgo de sobrecarga.',
        'Noradrenalina si shock persiste tras fluidos adecuados o durante resucitación si precisa, en entorno monitorizado/UCI/protocolo local.',
      ],
      actions: [
        procedureAction('fluidoterapia-iv', 'Ver Fluidoterapia IV en urgencias'),
        calculatorAction('fluid-remaining'),
        calculatorAction('sepsis-30mlkg'),
        calculatorAction('simple-fluid-balance'),
      ],
      treatmentGroups: [
        {
          id: 'sepsis-soporte',
          title: 'Soporte y resucitación',
          cards: [
            {
              id: 'sepsis-abcde',
              title: 'ABCDE y monitorización',
              type: 'treatment',
              severity: 'warning',
              summary: 'Actuar en paralelo: soporte, muestras si no retrasan, antibiótico, fluidos y foco.',
              items: [
                'Intervención: ABCDE, monitorización, vía venosa, oxígeno si hipoxemia y reevaluación seriada.',
                'Dosis: oxígeno titulado a SatO2 según contexto; fluidos solo si hipoperfusión/shock o déficit clínico.',
                'Vía: IV para fluidos/antibiótico si gravedad; monitorización continua si shock.',
                'Evitar: retrasar antibiótico o control de foco por completar pruebas secundarias.',
                'Reevaluar: TA/PAM, FC, FR, SatO2, mental, perfusión, diuresis, lactato y congestión.',
              ],
            },
            {
              id: 'sepsis-fluidos',
              title: 'Fluidoterapia',
              type: 'treatment',
              severity: 'warning',
              summary: 'Cristaloide IV si hipoperfusión o shock, individualizando por respuesta y sobrecarga.',
              items: [
                'Intervención: cristaloide IV, preferentemente balanceado si disponible y no contraindicado.',
                'Dosis: valorar 30 mL/kg en primeras 3 h si hipoperfusión inducida por sepsis o shock séptico.',
                'Vía: IV; administrar en bolos/ritmo según gravedad, comorbilidad y reevaluación.',
                'Evitar: automatizar por oliguria aislada o ignorar congestión, ERC, insuficiencia cardiaca o cirrosis.',
                'Reevaluar: respuesta a cada bolo, lactato, diuresis, balance, crepitantes, edema y necesidad de vasopresor/UCI.',
              ],
              calculatorId: 'fluid-remaining',
            },
            {
              id: 'sepsis-antibiotico',
              title: 'Antibiótico precoz',
              type: 'treatment',
              severity: 'danger',
              summary: 'Pauta empírica según foco, gravedad, alergias y resistencias locales; no hay esquema único.',
              items: [
                'Intervención: antibiótico empírico precoz según foco probable y protocolo local.',
                'Dosis: no se fija esquema universal; revisar foco, alergias, función renal/hepática y resistencias locales.',
                'Vía: IV si shock, sepsis grave, mala tolerancia oral, foco profundo o necesidad de ingreso.',
                'Evitar: retrasar por cultivos si la extracción no es inmediata.',
                'Reevaluar: cultivos, foco, respuesta, toxicidad y desescalada cuando haya datos.',
              ],
            },
            {
              id: 'sepsis-vasopresor',
              title: 'Vasopresor / UCI',
              type: 'treatment',
              severity: 'danger',
              summary: 'Si shock persiste, activar UCI y noradrenalina según protocolo local monitorizado.',
              items: [
                'Intervención: aviso precoz a UCI si hipotensión, lactato elevado persistente o mala perfusión.',
                'Dosis: noradrenalina según protocolo local en entorno monitorizado; no se dosifica desde esta ficha.',
                'Vía: preferente central; periférica temporal solo según protocolo y vigilancia local si no hay alternativa inmediata.',
                'Evitar: retrasar vasopresor/UCI si shock persiste durante resucitación.',
                'Reevaluar: PAM, perfusión, lactato, arritmias, extravasación si vía periférica y control de foco.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'destino',
      title: 'Destino',
      summary: 'Ingreso monitorizado o UCI según shock, lactato, disfunción orgánica, soporte y respuesta.',
      points: [
        'Observación/ingreso si sepsis estable, precisa antibiótico IV, cultivos, fluidos, control de foco o vigilancia.',
        'UCI si shock, vasopresor, lactato elevado persistente, insuficiencia respiratoria, deterioro mental o fracaso multiorgánico.',
        'Reevaluar lactato si inicialmente elevado o si no mejora la perfusión.',
        'Seguimiento de cultivos, foco, función renal/electrolitos, balance y desescalada antibiótica.',
        'Alta solo si infección leve sin sepsis, estabilidad sostenida, foco controlado, tolerancia oral y seguimiento claro.',
      ],
      detailNodes: [
        {
          id: 'sepsis-revaluacion',
          title: 'Reevaluación estructurada',
          type: 'decision',
          severity: 'warning',
          items: [
            'Revisar respuesta a fluidos y antibiótico, perfusión, lactato, diuresis y signos de sobrecarga.',
            'Confirmar que existe plan de foco: drenaje, cirugía, retirada de dispositivo, urología o imagen según caso.',
            'Desescalar antibiótico cuando haya microbiología y evolución compatible.',
          ],
        },
      ],
    },
  ],
});

const buildFlow = (protocol) => {
  if (protocol.id === 'fibrilacion-auricular') {
    return buildFaDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'sindrome-coronario-agudo') {
    return buildScaDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'insuficiencia-cardiaca') {
    return buildAcuteHeartFailureFlow(protocol);
  }

  if (protocol.id === 'hta-urgencias') {
    return buildHtaDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'bradicardias') {
    return buildBradyDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'arritmias-ventriculares') {
    return buildVentricularDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'ictus-isquemico') {
    return buildIschemicStrokeDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'ictus-hemorragico') {
    return buildHemorrhagicStrokeDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'crisis-convulsiva-epilepsia') {
    return buildSeizureEmergencyFlow(protocol);
  }

  if (protocol.id === 'anafilaxia') {
    return buildAnaphylaxisFlow(protocol);
  }

  if (protocol.id === 'asma-exacerbacion') {
    return buildAsthmaExacerbationFlow(protocol);
  }

  if (protocol.id === 'epoc-agudizacion') {
    return buildCopdExacerbationFlow(protocol);
  }

  if (protocol.id === 'tep') {
    return buildPulmonaryEmbolismFlow(protocol);
  }

  if (protocol.id === 'sepsis') {
    return buildSepsisFlow(protocol);
  }

  if (protocol.id === 'neumonia-comunidad') {
    return buildPneumoniaFlow(protocol);
  }

  if (protocol.id === 'dolor-abdomen-quirurgico') {
    return buildSurgicalAbdomenFlow(protocol);
  }

  if (protocol.id === 'dolor-hepatobiliar-pancreatico') {
    return buildHepatobiliaryPancreaticFlow(protocol);
  }

  if (protocol.id === 'dolor-urinario') {
    return buildUrinaryAbdominalPainFlow(protocol);
  }

  if (protocol.id === 'dolor-ginecologico') {
    return buildGynecologicAbdominalPainFlow(protocol);
  }

  if (protocol.id === 'dolor-vascular') {
    return buildVascularAbdominalPainFlow(protocol);
  }

  if (protocol.id === 'dolor-infeccioso-digestivo') {
    return buildInfectiousDigestiveAbdominalPainFlow(protocol);
  }

  if (protocol.guardia) {
    return guardiaFlow(protocol);
  }

  return genericFlow(protocol);
};

export const protocolFlowCatalog = Object.fromEntries(
  protocolList
    .filter((protocol) => protocol.status === 'implementado')
    .map((protocol) => [protocol.id, buildFlow(protocol)]),
);

export const protocolFlowList = Object.values(protocolFlowCatalog);

export const getProtocolFlow = (protocolId) => protocolFlowCatalog[protocolId] ?? protocolFlowList[0];
