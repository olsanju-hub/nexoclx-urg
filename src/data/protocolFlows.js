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

  return {
    id: `med-${medication.id}`,
    title: medication.name,
    type: 'treatment',
    summary: doseSummary,
    items: medicationDetailItems(medication),
    medication: medication.family,
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
        summary: 'Sincronizada urgente si inestabilidad; sedación según protocolo local si no retrasa.',
        items: [
          'Indicación: hipotensión, shock, isquemia, edema pulmonar o mala perfusión atribuible a FA.',
          'Dosis/energía: choque sincronizado; estrategia razonable con energía máxima del desfibrilador para FA.',
          'Vía: cardioversión eléctrica sincronizada.',
          'Evitar: intoxicación digitálica; si toma digoxina, iniciar con menor energía según Murillo.',
          'Reevaluar/siguiente paso: ritmo, PA, síntomas y anticoagulación según duración de FA y riesgo.',
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
      'Atropina 0,5 mg IV; repetir cada 3-5 min hasta 3 mg si bradicardia con signos adversos.',
      'Si atropina falla: marcapasos transcutáneo como puente o adrenalina 2-10 microg/min IV.',
      'Isoprenalina 5 microg/min IV de inicio si se elige cronotrópico de segunda línea.',
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
  sections: [
    definitionSection(protocol),
    pneumoniaOrdersSection(protocol),
    pneumoniaFindingsSection(protocol),
    pneumoniaTreatmentSection(protocol),
    pneumoniaFollowUpSection(protocol),
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
        summary: 'FA clínica con ritmo irregular y respuesta ventricular variable; prioriza estabilidad y causa desencadenante.',
        points: [
          'Palpitaciones, dolor torácico, disnea, mareo, síncope o embolia.',
          'ECG con ausencia de ondas P repetidas e intervalos RR irregulares.',
          'Red flags: shock, isquemia, edema agudo de pulmón, mala perfusión o preexcitación.',
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
        summary: 'Confirmar ritmo, repercusión y datos que cambian frecuencia, cardioversión o anticoagulación.',
        points: [
          'ECG 12 derivaciones y tira de ritmo.',
          'Constantes, estabilidad hemodinámica, SatO2 si disnea y búsqueda de insuficiencia cardíaca/isquemia.',
          'Inicio del episodio: < 24 h, ≥ 24 h o desconocido.',
          'FEVI/cardiopatía estructural y función renal si vas a anticoagular.',
        ],
        detailNodes: [
          {
            id: 'pruebas-fa',
            title: 'Datos que cambian conducta',
            type: 'step',
            items: asArray(protocol.quickChecks),
          },
        ],
      },
      {
        id: 'decision',
        title: 'Decisión',
        summary: 'Decidir estabilidad, ritmo/frecuencia y anticoagulación sin repetir calculadoras.',
        points: [
          'Inestable: cardioversión eléctrica sincronizada urgente.',
          'Estable < 24 h: controlar frecuencia y valorar ritmo precoz si procede.',
          '≥ 24 h/desconocida: frecuencia y anticoagulación/ETE antes de cardioversión precoz.',
          'Anticoagulación: riesgo tromboembólico, sangrado modificable y función renal.',
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
          'Ingreso/monitorización si inestabilidad, isquemia, insuficiencia cardíaca o mal control.',
          'Observación si precisa titulación de frecuencia, cardioversión o inicio seguro de anticoagulación.',
          'Alta solo si estable, controlada, con plan anticoagulante y signos de alarma claros.',
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

const buildFlow = (protocol) => {
  if (protocol.id === 'fibrilacion-auricular') {
    return buildFaDecisionPanelFlow(protocol);
  }

  if (protocol.id === 'neumonia-comunidad') {
    return buildPneumoniaFlow(protocol);
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
