import { getCalculator } from './calculators';
import { getMedication } from './medications';
import { protocolList } from './protocols';

const PRIMARY_SECTION_TITLES = {
  definition: 'Qué es',
  orders: 'Qué pido',
  findings: 'Qué espero encontrar',
  treatment: 'Tratamiento',
  followUp: 'Destino / seguimiento',
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
          'Reevaluar PA y clínica antes de alta; ajustar seguimiento ambulatorio.',
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
  const primaryCareGroup =
    protocol.id === 'hta-urgencias' ? medicationGroups.find((group) => group.title === 'Urgencia hipertensiva') : null;

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
        summary: 'Fármacos y medidas concretas cuando están auditadas.',
        children: [
          ...cardiologyInterventionNodes(protocol),
          ...medicationGroups.map((group) => ({
            id: `grupo-${slugify(group.title)}`,
            title: group.title,
            type: 'treatment',
            summary: 'Abrir para ver fármacos y dosis.',
            children: asArray(group.medicationIds).map(medicationNode),
          })),
        ],
      },
      ...(primaryCareGroup
        ? [
            {
              id: 'tratamiento-ap',
              title: 'Tratamiento en Atención Primaria',
              type: 'treatment',
              summary: 'Solo si no hay daño agudo de órgano diana y el paciente permite manejo ambulatorio.',
              children: [
                ...asArray(primaryCareGroup.medicationIds).map(medicationNode),
                {
                  id: 'reevaluar-derivar',
                  title: 'Reevaluar / derivar',
                  type: 'decision',
                  summary: 'Derivar si aparece daño de órgano diana, clínica de alarma, embarazo, mala respuesta o necesidad de vía IV.',
                  severity: 'warning',
                },
              ],
            },
          ]
        : []),
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
  summary: 'Destino, observación, ingreso o seguimiento según gravedad y respuesta.',
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
      id: 'tratamiento-ap',
      title: 'Tratamiento en Atención Primaria',
      type: 'treatment',
      summary: 'Aplicar solo en bajo riesgo con estabilidad y tolerancia oral.',
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
        'CRB-65 si valoración inicial o ambulatoria.',
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
        'No usar Alvarado como botón: no hay calculadora implementada y no sustituye valoración quirúrgica.',
      ],
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
        'Cólico biliar resuelto, afebril, analítica sin alarma y tolera: alta con cirugía programada/seguimiento.',
        'Fiebre, ictericia, colangitis, colecistitis, pancreatitis o dolor persistente: observación/ingreso.',
        'Pancreatitis grave: hipoxemia, shock, oliguria, lactato alto, hematocrito elevado, fallo orgánico o mala perfusión.',
        'No añadir BISAP como botón: no está implementada y no cambia conducta sin integración real.',
      ],
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
        'Alta: cólico biliar resuelto, afebril, sin ictericia, tolera vía oral y seguimiento/cirugía programada.',
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
        'Cólico no complicado: afebril, dolor controlado, tolera VO, función renal sin alarma y seguimiento.',
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
            'Reconsulta si no mejora o aparece clínica infecciosa tras alta por cólico.',
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
        summary: 'Destino y seguimiento según estabilidad, alarma y respuesta inicial.',
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
            title: 'Seguimiento',
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
        summary: 'Pautas de guardia en tarjetas; máximos, contraindicaciones y ajustes quedan dentro de cada pauta.',
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
          'SCASEST alto riesgo: troponina positiva, cambios dinámicos ST/T o GRACE alto si disponible: coronariografía < 24 h.',
          'Killip III-IV o inestabilidad: área monitorizada/UCI y manejo invasivo urgente.',
          'No usar fibrinólisis en SCASEST.',
        ],
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
            title: 'Reevaluación y seguimiento',
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
        summary: 'Alta solo si no hay daño agudo, la PA desciende de forma segura y hay seguimiento cercano.',
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
        summary: 'Electricidad, RCP y fármacos en tarjetas; no convertir la parada en texto largo.',
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
              'NIHSS y Rankin cambian selección terapéutica, pero en esta app aún no son calculadoras funcionales.',
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
        detailNodes: decisionNodes(protocol),
      },
      {
        id: 'tratamiento',
        title: 'Tratamiento',
        summary: 'Reperfusión si candidato y control tensional dirigido; cada pauta queda en tarjeta.',
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

const buildFlow = (protocol) => {
  if (protocol.id === 'fibrilacion-auricular') {
    return buildFaDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'sindrome-coronario-agudo') {
    return buildScaDecisionPanelFlow(protocol);
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
