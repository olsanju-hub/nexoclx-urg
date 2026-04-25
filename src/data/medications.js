import { createBibliographyEntry } from './bibliography';

const referenceEntry = ({ id, indexPage, verifiedPage = indexPage, pdfPage, note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'murillo7',
    indexPages: indexPage ? [indexPage] : [],
    verifiedPages: verifiedPage ? [verifiedPage] : [],
    pdfPages: pdfPage ? [pdfPage] : [],
    note,
  });

const escHtaReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-hta-2024',
    verifiedPages,
    pdfPages,
    note,
  });

const escScaReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-sca-2023',
    verifiedPages,
    pdfPages,
    note,
  });

const escFaReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-fa-2024',
    verifiedPages,
    pdfPages,
    note,
  });

const escTsvReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-tsv-2019',
    verifiedPages,
    pdfPages,
    note,
  });

const escBradyReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-bradicardias-2021',
    verifiedPages,
    pdfPages,
    note,
  });

const escVentricularReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'esc-arritmias-ventriculares-2022',
    verifiedPages,
    pdfPages,
    note,
  });

const ahaIschemicStrokeReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'aha-ictus-isquemico-2026',
    verifiedPages,
    pdfPages,
    note,
  });

const ahaHemorrhagicStrokeReferenceEntry = ({ id, verifiedPages = [], pdfPages = [], note }) =>
  createBibliographyEntry({
    id,
    referenceId: 'aha-ictus-hemorragico-2022',
    verifiedPages,
    pdfPages,
    note,
  });

const externalSource = (label, url) => ({ label, url, type: 'external' });
const cimaSource = (label, url) => ({ label, url, type: 'cima' });
const protocolSource = (label, bibliography) => ({ label, bibliography, type: 'protocol' });

export const medicationCatalog = {
  metoprolol: {
    id: 'metoprolol',
    name: 'Metoprolol',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de la frecuencia ventricular en fibrilación auricular aguda, sobre todo si FEVI > 40%; también puede usarse con FEVI ≤ 40% si la situación hemodinámica lo permite.',
    contextUse: 'FA aguda estable con respuesta ventricular rápida. Prioriza control de frecuencia si tolera la hemodinámica.',
    contextDose: 'IV 2,5-5 mg lento; repetir cada 10 min hasta 15 mg totales si hace falta.',
    contextRoute: 'Intravenosa en fase aguda.',
    contextFrequency: 'Bolos titulados y reevaluación tras cada dosis.',
    followUpPlan: 'VO solo si después se decide mantenimiento.',
    dose: 'IV 2,5-5 mg lento; repetir cada 10 min hasta 15 mg totales si hace falta. Después, si se mantiene, VO 100 mg cada 12 h ajustado a respuesta.',
    route: 'Intravenosa en fase aguda; oral para continuación.',
    frequency: 'Bolos IV titulados en fase aguda; mantenimiento oral posterior según control.',
    duration: 'Uso agudo y transición posterior según respuesta clínica y plan cardiológico.',
    contraindications: [
      'Bradicardia marcada o bloqueo AV clínicamente relevante.',
      'Shock cardiogénico o hipotensión no tolerada.',
      'Precaución si se combina con verapamilo o digoxina por riesgo de enlentecimiento excesivo.',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada indica escasa influencia de la insuficiencia renal sobre la biodisponibilidad; no describe un ajuste fijo, pero obliga a monitorizar la tolerancia clínica.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada señala aumento de exposición en cirrosis hepática grave o derivación portocava; conviene empezar bajo y vigilar.',
    practicalNotes: [
      'La guía ESC 2024 lo sitúa entre las opciones de primera línea para control agudo de frecuencia.',
      'Si la FEVI es ≤ 40%, puede usarse junto con digoxina según tolerancia y contexto clínico.',
      'No combinar de entrada con verapamilo o diltiazem.',
    ],
    sourceScope:
      'La estrategia clínica de FA aguda sigue la guía ESC 2024; la pauta IV contextual se apoya además en Murillo. La ficha CIMA consultada es oral y sirve como apoyo para mantenimiento, no para priorizar la vía aguda.',
    sources: [
      protocolSource(
        'ESC FA 2024 · control agudo de frecuencia',
        escFaReferenceEntry({
          id: 'metoprolol-fa-esc',
          verifiedPages: [43, 44, 45],
          pdfPages: [43, 44, 45],
          note: 'Betabloqueantes como primera línea de control agudo de frecuencia en FA según FEVI y estabilidad.',
        }),
      ),
      cimaSource(
        'CIMA · Beloken 100 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/55748/FichaTecnica_55748.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'metoprolol-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pauta oral e intravenosa en FA rápida.',
        }),
      ),
    ],
  },
  verapamilo: {
    id: 'verapamilo',
    name: 'Verapamilo',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de la frecuencia ventricular en fibrilación auricular rápida cuando no hay insuficiencia cardíaca con fracción reducida ni vía accesoria.',
    contextUse: 'FA aguda estable con FEVI > 40% y sin vía accesoria.',
    contextDose: 'IV 5 mg lento en 10 min; puede repetirse cada 15-20 min hasta 20 mg totales si hace falta.',
    contextRoute: 'Intravenosa en fase aguda.',
    contextFrequency: 'Bolos titulados con reevaluación clínica y ECG.',
    followUpPlan: 'VO solo si después se decide mantenimiento.',
    dose: 'IV 5 mg lento en 10 min; puede repetirse cada 15-20 min hasta 20 mg totales si hace falta. Después, si se mantiene, VO 40-80 mg cada 8 h.',
    route: 'Intravenosa en fase aguda; oral para continuación.',
    frequency: 'Bolos IV titulados en fase aguda; mantenimiento oral posterior si procede.',
    duration: 'Uso agudo con reevaluación posterior del control de frecuencia.',
    contraindications: [
      'Shock cardiogénico, bloqueo AV de segundo/tercer grado o síndrome del nodo sinusal enfermo.',
      'Insuficiencia cardíaca con fracción de eyección reducida.',
      'Flutter o FA con vía accesoria (WPW / Lown-Ganong-Levine).',
    ],
    renalAdjustment:
      'La ficha CIMA inyectable consultada no fija una reducción estándar, pero exige uso con precaución y vigilancia estrecha si la función renal está alterada.',
    hepaticAdjustment:
      'La ficha CIMA inyectable consultada indica metabolismo más lento en insuficiencia hepática y recomienda iniciar con dosis bajas.',
    practicalNotes: [
      'La guía ESC 2024 lo mantiene como opción de primera línea si la FEVI es > 40% y no hay vía accesoria.',
      'No asociar de entrada con betabloqueantes.',
      'Usar con precaución junto con digoxina porque puede elevar sus concentraciones.',
    ],
    sourceScope:
      'La estrategia clínica de FA aguda sigue la guía ESC 2024; la pauta IV concreta del contexto FA se apoya además en Murillo y la ficha CIMA consultada corresponde a la formulación inyectable.',
    sources: [
      protocolSource(
        'ESC FA 2024 · control agudo de frecuencia',
        escFaReferenceEntry({
          id: 'verapamilo-fa-esc',
          verifiedPages: [43, 44, 45],
          pdfPages: [43, 44, 45],
          note: 'Diltiazem o verapamilo como opciones en FA aguda si no hay FEVI reducida.',
        }),
      ),
      cimaSource('CIMA · Manidón 5 mg/2 ml solución inyectable', 'https://cima.aemps.es/cima/dochtml/ft/39784/FT_39784.html'),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'verapamilo-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pauta oral e intravenosa en FA rápida.',
        }),
      ),
    ],
  },
  digoxina: {
    id: 'digoxina',
    name: 'Digoxina',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de frecuencia en FA aguda, especialmente si hay FEVI ≤ 40% o insuficiencia cardíaca y no basta o no conviene otro frenador nodal.',
    contextUse: 'FA aguda con FEVI ≤ 40% o IC, o como apoyo si no basta otro frenador nodal.',
    contextDose: 'IV 0,25 mg cada 2 h hasta control o 1,5 mg máximos. Si ya toma digitálicos, no redigitalizar.',
    contextRoute: 'Intravenosa en fase aguda.',
    contextFrequency: 'Cargas fraccionadas con reevaluación clínica, ECG y función renal.',
    followUpPlan: 'VO solo para mantenimiento si después se decide y con ajuste renal.',
    dose:
      'IV 0,25 mg cada 2 h hasta control o 1,5 mg máximos. Después, si se mantiene, VO 0,25 mg/24 h individualizado; evita redigitalizar si ya tomaba digitálicos.',
    route: 'Intravenosa en fase aguda; oral para continuación.',
    frequency: 'Cargas IV fraccionadas y luego mantenimiento diario si se mantiene.',
    duration: 'Ajuste individual según frecuencia, función renal y niveles séricos.',
    contraindications: [
      'Taquicardia o fibrilación ventricular.',
      'Bloqueo AV avanzado o enfermedad del seno sintomática sin marcapasos.',
      'Arritmias supraventriculares con vía accesoria auriculoventricular si no se ha valorado el riesgo.',
    ],
    renalAdjustment:
      'La ficha CIMA consultada exige individualizar la dosis según aclaramiento de creatinina y controlar niveles séricos; la insuficiencia renal es una causa frecuente de toxicidad.',
    hepaticAdjustment:
      'La ficha CIMA consultada no aporta un ajuste hepático cerrado. Mantener individualización y vigilancia clínica si hay disfunción multiorgánica.',
    practicalNotes: [
      'La guía ESC 2024 la sitúa entre las primeras opciones si la FEVI es ≤ 40% o si se necesita apoyo adicional al control de frecuencia.',
      'Si el paciente ya toma digitálicos no debe redigitalizarse.',
      'La cardioversión eléctrica requiere precaución añadida en tratamiento digitálico.',
    ],
    sourceScope:
      'La estrategia clínica de FA aguda sigue la guía ESC 2024; la pauta específica de carga y mantenimiento se apoya además en Murillo y la ficha CIMA consultada corresponde a la formulación inyectable.',
    sources: [
      protocolSource(
        'ESC FA 2024 · control agudo de frecuencia',
        escFaReferenceEntry({
          id: 'digoxina-fa-esc',
          verifiedPages: [43, 44, 45],
          pdfPages: [43, 44, 45],
          note: 'Digoxina como primera línea con FEVI reducida o como fármaco adicional según el contexto clínico.',
        }),
      ),
      cimaSource('CIMA · Digoxina 0,25 mg/ml solución inyectable', 'https://cima.aemps.es/cima/dochtml/ft/25126/FichaTecnica_25126.html'),
      protocolSource(
        'Murillo 7.ª ed. · control de frecuencia en FA',
        referenceEntry({
          id: 'digoxina-fa',
          verifiedPage: 187,
          pdfPage: 212,
          note: 'Cuadro 23.2 con pautas de digitalización oral e intravenosa.',
        }),
      ),
    ],
  },
  amiodarona: {
    id: 'amiodarona',
    name: 'Amiodarona',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia y ritmo',
    indication:
      'Última opción aguda para control de frecuencia o alternativa de control del ritmo cuando otras opciones no son adecuadas o existe FEVI reducida / cardiopatía significativa.',
    contextUse:
      'FA aguda cuando no basta el control nodal previo o si eliges ritmo en FEVI reducida / cardiopatía estructural relevante.',
    contextDose: 'IV 5-7 mg/kg de carga, con posibilidad de completar 1,2-1,8 g en 24 h según respuesta.',
    contextRoute: 'Intravenosa en fase aguda.',
    contextFrequency: 'Carga inicial y perfusión con reevaluación de ritmo, QT y tolerancia.',
    followUpPlan: 'VO solo si después se decide continuación.',
    dose:
      'IV 5-7 mg/kg de carga, con posibilidad de completar 1,2-1,8 g en 24 h según respuesta. Después, si se mantiene, VO 200 mg cada 8 h 7 días, luego cada 12 h 7 días y después 200 mg/24 h 5 días/semana.',
    route: 'Intravenosa en fase aguda; oral para continuación.',
    frequency: 'Carga aguda IV y mantenimiento posterior según respuesta.',
    duration: 'Solo uso agudo en control de frecuencia del libro; otras indicaciones dependen de cardiología.',
    contraindications: [
      'Bradicardia sinusal, trastorno grave de conducción o enfermedad del nodo sinusal sin marcapasos.',
      'Disfunción tiroidea.',
      'Precaución extrema con fármacos que prolongan QT o inducen torsade de pointes.',
    ],
    renalAdjustment:
      'La ficha CIMA inyectable consultada no establece un ajuste renal cuantificado; obliga a prudencia clínica y monitorización.',
    hepaticAdjustment:
      'La ficha CIMA inyectable consultada no detalla un esquema numérico de ajuste hepático; obliga a prudencia clínica y vigilancia por su perfil de toxicidad.',
    practicalNotes: [
      'La guía ESC 2024 la reserva como última opción para control de frecuencia agudo.',
      'También puede encajar en cardioversión farmacológica si existe HFrEF, hipertrofia severa o enfermedad coronaria y se acepta una reversión más lenta.',
      'No mezclar antiarrítmicos de clase I y III en el mismo momento.',
    ],
    sourceScope:
      'La estrategia clínica de FA aguda sigue la guía ESC 2024; la pauta detallada del contexto FA se apoya además en Murillo y la ficha CIMA consultada corresponde a la formulación inyectable.',
    sources: [
      protocolSource(
        'ESC FA 2024 · control de frecuencia y cardioversión',
        escFaReferenceEntry({
          id: 'amiodarona-fa-esc',
          verifiedPages: [43, 44, 45, 46, 47, 48],
          pdfPages: [43, 44, 45, 46, 47, 48],
          note: 'Reservada para control de frecuencia seleccionado y como opción de cardioversión/ritmo en determinados perfiles estructurales.',
        }),
      ),
      cimaSource('CIMA · Trangorex 150 mg/3 ml solución inyectable', 'https://cima.aemps.es/cima/dochtml/ft/54723/FT_54723.html'),
      protocolSource(
        'Murillo 7.ª ed. · control de ritmo y frecuencia en FA',
        referenceEntry({
          id: 'amiodarona-fa',
          verifiedPage: 188,
          pdfPage: 213,
          note: 'Cuadro 23.3 con pauta de cardioversión y mantenimiento.',
        }),
      ),
    ],
  },
  'alteplasa-ictus': {
    id: 'alteplasa-ictus',
    name: 'Alteplasa IV',
    protocolId: 'ictus-isquemico',
    family: 'Trombólisis en ictus',
    indication:
      'Trombólisis intravenosa en ictus isquémico agudo cuando la neuroimagen descarta sangrado y el paciente es candidato dentro de la ventana y sin contraindicación mayor.',
    contextUse: 'Ictus isquémico agudo con última vez bien compatible con trombólisis IV y TAC sin sangrado.',
    contextDose: '0,9 mg/kg IV, máximo 90 mg: 10% en bolo y 90% en perfusión durante 60 min.',
    contextRoute: 'Intravenosa.',
    contextFrequency: 'Bolo inicial único y perfusión única durante 60 min.',
    followUpPlan: 'Monitoriza PA y sangrado. Evita antiagregación o anticoagulación en las primeras 24 h y repite imagen antes de iniciarlas.',
    dose:
      '0,9 mg/kg IV, máximo 90 mg: 10% en bolo inicial y el resto en perfusión durante 60 min.',
    route: 'Intravenosa.',
    frequency: 'Administración única.',
    duration: 'Uso agudo puntual.',
    contraindications: [
      'No usar si la neuroimagen muestra hemorragia intracraneal.',
      'Controla la PA antes de iniciar: no trombolizar si no consigues situarla por debajo de 185/110 mmHg.',
      'Evita si existe contraindicación mayor de sangrado o si no puedes definir una ventana razonable de tratamiento.',
    ],
    renalAdjustment:
      'La pauta aguda no suele ajustarse por función renal, pero el riesgo hemorrágico y la comorbilidad obligan a individualizar.',
    hepaticAdjustment:
      'No existe un ajuste estándar de urgencias; la hepatopatía relevante incrementa el riesgo hemorrágico y puede contraindicar la estrategia.',
    practicalNotes: [
      'No retrases la trombólisis IV por esperar estudios que no cambian la candidatura inmediata.',
      'Si además hay oclusión de gran vaso, la trombólisis no debe retrasar la trombectomía cuando esté indicada.',
      'Tras la trombólisis, el objetivo tensional cambia y exige vigilancia estrecha.',
    ],
    sourceScope:
      'El módulo de ictus isquémico usa como referencia principal la guía AHA 2026 cargada en el proyecto; la obra base aporta apoyo práctico complementario sobre el manejo urgente del ictus.',
    sources: [
      protocolSource(
        'AHA ictus isquémico 2026 · trombólisis IV y selección de reperfusión',
        ahaIschemicStrokeReferenceEntry({
          id: 'alteplasa-ictus-aha',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Referencia principal del módulo para trombólisis y reperfusión en ictus isquémico agudo.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · ictus agudo',
        referenceEntry({
          id: 'alteplasa-ictus-murillo',
          verifiedPage: 442,
          pdfPage: 467,
          note: 'Apoyo práctico secundario para manejo urgente del ictus.',
        }),
      ),
    ],
  },
  adenosina: {
    id: 'adenosina',
    name: 'Adenosina',
    protocolId: 'taquicardia-supraventricular',
    family: 'TSV · conversión aguda',
    indication:
      'Conversión rápida de la taquicardia regular de QRS estrecho dependiente del nodo AV cuando las maniobras vagales no revierten el episodio.',
    contextUse: 'Taquicardia regular de QRS estrecho, estable, tras maniobras vagales inefectivas.',
    contextDose: 'IV rápida en bolo: 6 mg, luego 12 mg y después 18 mg si no revierte en 1-2 min.',
    contextRoute: 'Intravenosa rápida en bolo, seguida de lavado rápido con suero.',
    contextFrequency: 'Escalado en bolos separados 1-2 min con monitorización ECG continua.',
    followUpPlan: 'Si no revierte, reevalúa el ritmo y pasa al siguiente escalón terapéutico.',
    dose:
      'IV rápida en bolo: 6 mg inicial; si no revierte en 1-2 min, 12 mg; si persiste, 18 mg con monitorización continua.',
    route: 'Intravenosa rápida en bolo.',
    frequency: 'Bolos escalonados con reevaluación inmediata tras cada dosis.',
    duration: 'Uso agudo puntual.',
    contraindications: [
      'No usar para terminar fibrilación auricular, flutter auricular o taquicardia ventricular.',
      'Precaución en asma o broncoespasmo y en hipotensión relevante.',
      'Evitar si sospechas fibrilación auricular preexcitada.',
    ],
    renalAdjustment:
      'No requiere ajuste renal específico para el bolo agudo según la ficha consultada.',
    hepaticAdjustment:
      'No requiere ajuste hepático específico para el bolo agudo según la ficha consultada.',
    practicalNotes: [
      'Debe administrarse con monitorización y equipo de reanimación disponible.',
      'Usa una vena proximal o una cánula periférica grande y sigue siempre con lavado rápido.',
      'Si enlentece transitoriamente la respuesta ventricular sin revertir, puede ayudar a identificar flutter o actividad auricular.',
    ],
    sourceScope:
      'La guía ESC 2019 sigue siendo la referencia principal para TSV. La pauta operativa se completa con la ficha CIMA y con algoritmos de soporte vital como apoyo práctico.',
    sources: [
      protocolSource(
        'ESC TSV 2019 · manejo agudo de TSV',
        escTsvReferenceEntry({
          id: 'adenosina-tsv-esc',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Vagal y adenosina IV como eje del manejo agudo de la taquicardia regular supraventricular.',
        }),
      ),
      cimaSource(
        'CIMA · Adenosina Accord 6 mg/2 ml solución inyectable',
        'https://cima.aemps.es/cima/dochtml/ft/81545/FichaTecnica_81545.html',
      ),
      externalSource(
        'Resuscitation Council UK · Adult tachycardia algorithm 2021',
        'https://www.resus.org.uk/sites/default/files/2021-04/Tachycardia%20Algorithm%202021.pdf',
      ),
    ],
  },
  atropina: {
    id: 'atropina',
    name: 'Atropina',
    protocolId: 'bradicardias',
    family: 'Bradicardia sintomática',
    indication:
      'Tratamiento inicial de la bradicardia sintomática o con rasgos de inestabilidad mientras se corrigen causas y se prepara estimulación si hace falta.',
    contextUse: 'Bradicardia con shock, síncope, isquemia o insuficiencia cardíaca.',
    contextDose: '0,5 mg IV; repetir cada 3-5 min hasta 3 mg si hace falta.',
    contextRoute: 'Intravenosa.',
    contextFrequency: 'Bolos repetidos según respuesta clínica y del ECG.',
    followUpPlan: 'Si no hay respuesta adecuada o hay bloqueo de alto grado, no retrasar marcapasos transcutáneo.',
    dose:
      'Bradicardia sinusal: 0,5 mg IV cada 2-5 min. Bloqueo AV: 0,5 mg IV cada 3-5 min. Dosis máxima total: 3 mg.',
    route: 'Intravenosa o intramuscular, pero en este contexto la vía útil es IV.',
    frequency: 'Bolos repetidos hasta respuesta o dosis máxima.',
    duration: 'Uso agudo puntual.',
    contraindications: [
      'En urgencia vital, las contraindicaciones habituales pierden relevancia práctica.',
      'Precaución en isquemia miocárdica aguda porque el aumento de frecuencia puede empeorarla.',
      'No debe retrasar el marcapasos externo si el paciente sigue inestable o hay bloqueo de alto grado.',
    ],
    renalAdjustment:
      'La ficha consultada aconseja precaución en insuficiencia renal, sin un ajuste numérico fijo para esta pauta aguda.',
    hepaticAdjustment:
      'La ficha consultada aconseja precaución en insuficiencia hepática, sin un ajuste numérico fijo para esta pauta aguda.',
    practicalNotes: [
      'Dosis menores de 0,5 mg pueden empeorar la bradicardia.',
      'Si sospechas bloqueo AV de alto grado, prepara estimulación aunque estés administrando atropina.',
      'En trasplante cardíaco puede ser ineficaz o paradójica.',
    ],
    sourceScope:
      'La estrategia de bradicardia sigue la guía ESC 2021 disponible en el proyecto; la pauta concreta se apoya en la ficha CIMA de atropina y en algoritmos de soporte vital para el escalado con pacing.',
    sources: [
      protocolSource(
        'ESC Bradicardias 2021 · bradicardia y estimulación',
        escBradyReferenceEntry({
          id: 'atropina-brady-esc',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Bradicardia sintomática y necesidad de estimulación temporal si el tratamiento inicial es insuficiente.',
        }),
      ),
      cimaSource(
        'CIMA · Atropina 1 mg/ml solución inyectable',
        'https://cima.aemps.es/cima/pdfs/es/ft/85535/FT_85535.html.pdf',
      ),
      externalSource(
        'Resuscitation Council UK · ALS chapter 11 bradycardia',
        'https://lms.resus.org.uk/modules/m10-v2-cardiac-arrest/10346/resources/chapter_11.pdf',
      ),
    ],
  },
  'amiodarona-vt': {
    id: 'amiodarona-vt',
    name: 'Amiodarona IV',
    protocolId: 'arritmias-ventriculares',
    family: 'QRS ancho / TV',
    indication:
      'Taquicardia regular de QRS ancho tratada como ventricular cuando el paciente sigue estable y no hay certeza de TSV con aberrancia.',
    contextUse: 'Taquicardia regular de QRS ancho, estable, manejada como TV.',
    contextDose: '300 mg IV en 10-60 min; después 900 mg IV en 24 h si hace falta continuación.',
    contextRoute: 'Intravenosa.',
    contextFrequency: 'Carga única inicial y perfusión de continuación según respuesta y monitorización.',
    followUpPlan: 'Si empeora o no revierte, cardioversión sincronizada y ayuda experta.',
    dose:
      '300 mg IV en 10-60 min para taquicardia regular de QRS ancho estable tratada como TV. Si se mantiene la indicación, continuar con 900 mg IV en 24 h.',
    route: 'Intravenosa.',
    frequency: 'Carga inicial seguida de perfusión si se decide mantener.',
    duration: 'Uso agudo con reevaluación estrecha.',
    contraindications: [
      'Bradicardia marcada, bloqueo avanzado o enfermedad del nodo sin marcapasos.',
      'Precaución extrema si el QT está prolongado o hay otros fármacos proarrítmicos.',
      'No sustituye a la cardioversión si aparece inestabilidad.',
    ],
    renalAdjustment:
      'La ficha CIMA inyectable consultada no establece un ajuste renal cuantificado para esta pauta aguda.',
    hepaticAdjustment:
      'La ficha CIMA inyectable consultada obliga a prudencia clínica y vigilancia si existe hepatopatía relevante.',
    practicalNotes: [
      'Si no estás seguro del mecanismo del QRS ancho, es más seguro tratarlo como ventricular.',
      'Requiere monitorización continua de ECG, presión arterial y QT.',
      'En TV polimórfica o torsades, el fármaco clave cambia y debes corregir electrolitos y valorar magnesio.',
    ],
    sourceScope:
      'La guía ESC 2022 es la referencia principal del módulo de arritmias ventriculares; la pauta de administración IV se completa con la ficha CIMA inyectable y algoritmos de soporte vital como apoyo práctico.',
    sources: [
      protocolSource(
        'ESC Arritmias ventriculares 2022 · manejo agudo',
        escVentricularReferenceEntry({
          id: 'amiodarona-vt-esc',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Referencia principal para taquicardia de QRS ancho y arritmias ventriculares en el módulo.',
        }),
      ),
      cimaSource('CIMA · Trangorex 150 mg/3 ml solución inyectable', 'https://cima.aemps.es/cima/dochtml/ft/54723/FT_54723.html'),
      externalSource(
        'Resuscitation Council UK · Adult tachycardia algorithm 2021',
        'https://www.resus.org.uk/sites/default/files/2021-04/Tachycardia%20Algorithm%202021.pdf',
      ),
    ],
  },
  'magnesio-torsades': {
    id: 'magnesio-torsades',
    name: 'Sulfato de magnesio IV',
    protocolId: 'arritmias-ventriculares',
    family: 'TV polimórfica / torsades',
    indication:
      'Tratamiento inicial de la torsades de pointes o de la taquicardia ventricular polimórfica cuando el contexto sugiere QT largo o desencadenante eléctrico reversible.',
    contextUse: 'TV polimórfica / torsades con pulso o episodio recurrente mientras se corrigen causas.',
    contextDose: '2 g IV en 10-15 min; si recurre o persiste, reevaluar y considerar nueva dosis o perfusión según respuesta.',
    contextRoute: 'Intravenosa.',
    contextFrequency: 'Bolo agudo con reevaluación del ritmo, QT y estabilidad clínica.',
    followUpPlan: 'Corregir potasio y magnesio, retirar fármacos que prolonguen QT y preparar electricidad si hay deterioro.',
    dose:
      '2 g IV en 10-15 min como pauta aguda inicial en torsades / TV polimórfica con sospecha de QT largo. Reevaluar necesidad de repetición o perfusión según respuesta y contexto.',
    route: 'Intravenosa.',
    frequency: 'Bolo agudo inicial con reevaluación inmediata.',
    duration: 'Uso agudo puntual y posible continuación corta según recurrencia.',
    contraindications: [
      'Precaución en insuficiencia renal avanzada por riesgo de acumulación.',
      'La hipotensión o la depresión respiratoria obligan a vigilancia estrecha durante la administración.',
      'No sustituye a la electricidad si la arritmia no se mantiene estable.',
    ],
    renalAdjustment:
      'No hay un ajuste numérico breve y uniforme para este contexto agudo; en insuficiencia renal avanzada, extremar vigilancia clínica y de magnesemia.',
    hepaticAdjustment:
      'No requiere ajuste hepático específico para el bolo agudo en torsades.',
    practicalNotes: [
      'Piensa en QT largo, hipopotasemia, hipomagnesemia o fármacos desencadenantes mientras administras el bolo.',
      'Si la arritmia recurre o se hace inestable, la electricidad pasa a primer plano.',
      'No retrases la corrección de electrolitos ni la retirada del desencadenante esperando solo a la respuesta del magnesio.',
    ],
    sourceScope:
      'La guía ESC 2022 es la referencia principal del módulo de arritmias ventriculares; esta ficha prioriza la torsades y la TV polimórfica dentro del contexto urgente.',
    sources: [
      protocolSource(
        'ESC Arritmias ventriculares 2022 · TV polimórfica / torsades',
        escVentricularReferenceEntry({
          id: 'magnesio-torsades-esc',
          verifiedPages: [1, 2],
          pdfPages: [1, 2],
          note: 'Referencia principal para torsades, QT largo y arritmias ventriculares polimórficas en agudo.',
        }),
      ),
      referenceEntry({
        id: 'magnesio-murillo',
        indexPage: 186,
        verifiedPage: 186,
        pdfPage: 211,
        note: 'Apoyo práctico secundario de arritmias agudas en la obra base.',
      }),
    ],
  },
  apixaban: {
    id: 'apixaban',
    name: 'Apixabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 5 mg VO cada 12 h. Reducir a 2,5 mg cada 12 h en pacientes con al menos dos de estos criterios: edad ≥ 80 años, peso ≤ 60 kg, creatinina sérica ≥ 1,5 mg/dL. El libro cita 2,5-5 mg/12 h.',
    route: 'Oral',
    frequency: 'Cada 12 h.',
    duration: 'Tratamiento crónico o periodos peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Hepatopatía asociada a coagulopatía y riesgo hemorrágico clínicamente relevante.',
      'No recomendado si aclaramiento de creatinina < 15 mL/min o en diálisis según la ficha consultada.',
    ],
    renalAdjustment:
      'CIMA: si el aclaramiento de creatinina es 15-29 mL/min, en FA no valvular usar 2,5 mg cada 12 h; no recomendado si es < 15 mL/min.',
    hepaticAdjustment:
      'CIMA: contraindicado si hay hepatopatía con coagulopatía y riesgo de sangrado; no recomendado en insuficiencia hepática grave.',
    practicalNotes: [
      'La guía ESC 2024 prioriza ACOD frente a AVK salvo prótesis mecánica o estenosis mitral moderada/grave.',
      'Revisar el Cockcroft-Gault antes de decidir dosis si la función renal es dudosa.',
    ],
    sourceScope:
      'La indicación estratégica en FA y la preferencia por ACOD siguen la guía ESC 2024; la dosificación detallada se contrasta con CIMA y Murillo aporta apoyo práctico.',
    sources: [
      protocolSource(
        'ESC FA 2024 · anticoagulación oral',
        escFaReferenceEntry({
          id: 'apixaban-fa-esc',
          verifiedPages: [32, 33, 34, 35, 36],
          pdfPages: [32, 33, 34, 35, 36],
          note: 'Anticoagulación oral recomendada con preferencia por ACOD en FA no valvular.',
        }),
      ),
      cimaSource(
        'CIMA · Eliquis 5 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/111691014/FT_111691014.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'apixaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de apixabán en FA.',
        }),
      ),
    ],
  },
  dabigatran: {
    id: 'dabigatran',
    name: 'Dabigatrán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 150 mg VO cada 12 h; considerar 110 mg cada 12 h en pacientes de mayor edad o con riesgo de sangrado. El libro cita 110-150 mg/12 h.',
    route: 'Oral',
    frequency: 'Cada 12 h.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Aclaramiento de creatinina < 30 mL/min.',
      'Lesión orgánica con riesgo relevante de sangrado o combinación con determinados inhibidores potentes de la P-gp.',
    ],
    renalAdjustment:
      'CIMA: contraindicado si el aclaramiento de creatinina es < 30 mL/min. Entre 30-50 mL/min obliga a reevaluar riesgo hemorrágico y puede motivar reducción.',
    hepaticAdjustment:
      'No he podido extraer de forma fiable una pauta hepática cuantificada de la ficha CIMA consultada; debe revisarse la ficha completa si existe hepatopatía relevante antes de indicar el fármaco.',
    practicalNotes: [
      'La guía ESC 2024 prioriza ACOD frente a AVK salvo prótesis mecánica o estenosis mitral moderada/grave.',
      'Si se pauta, documentar siempre aclaramiento de creatinina previo.',
    ],
    sourceScope:
      'La indicación estratégica en FA y la preferencia por ACOD siguen la guía ESC 2024; la posología se apoya en CIMA y Murillo queda como apoyo práctico.',
    sources: [
      protocolSource(
        'ESC FA 2024 · anticoagulación oral',
        escFaReferenceEntry({
          id: 'dabigatran-fa-esc',
          verifiedPages: [32, 33, 34, 35, 36],
          pdfPages: [32, 33, 34, 35, 36],
          note: 'Uso de ACOD como estrategia preferente en FA no valvular.',
        }),
      ),
      cimaSource(
        'CIMA · Pradaxa 150 mg cápsulas duras',
        'https://cima.aemps.es/cima/dochtml/ft/08442011/FichaTecnica_08442011.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'dabigatran-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de dabigatrán en FA.',
        }),
      ),
    ],
  },
  edoxaban: {
    id: 'edoxaban',
    name: 'Edoxabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 60 mg VO cada 24 h; reducir a 30 mg cada 24 h si el aclaramiento de creatinina es 15-50 mL/min, peso ≤ 60 kg o hay determinados inhibidores de la P-gp. El libro cita 30-60 mg/24 h.',
    route: 'Oral',
    frequency: 'Cada 24 h.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Sangrado activo clínicamente significativo.',
      'Hepatopatía asociada a coagulopatía y riesgo de sangrado clínicamente relevante.',
      'No recomendado si el aclaramiento de creatinina es < 15 mL/min.',
    ],
    renalAdjustment:
      'La ficha CIMA del edoxabán reduce a 30 mg/24 h si el aclaramiento de creatinina está entre 15 y 50 mL/min. No se recomienda por debajo de 15 mL/min.',
    hepaticAdjustment:
      'Contraindicado si existe hepatopatía con coagulopatía y riesgo hemorrágico. Si hay insuficiencia hepática leve o moderada sin coagulopatía, la ficha debe revisarse completa antes de prescribir.',
    practicalNotes: [
      'La guía ESC 2024 prioriza ACOD frente a AVK salvo prótesis mecánica o estenosis mitral moderada/grave.',
      'En este módulo conviene apoyarse en Cockcroft-Gault antes de seleccionar dosis.',
    ],
    sourceScope:
      'La indicación estratégica en FA y la preferencia por ACOD siguen la guía ESC 2024; la dosificación detallada se apoya en CIMA y Murillo queda como apoyo práctico.',
    sources: [
      protocolSource(
        'ESC FA 2024 · anticoagulación oral',
        escFaReferenceEntry({
          id: 'edoxaban-fa-esc',
          verifiedPages: [32, 33, 34, 35, 36],
          pdfPages: [32, 33, 34, 35, 36],
          note: 'Uso de ACOD como estrategia preferente en FA no valvular.',
        }),
      ),
      cimaSource(
        'CIMA · Lixiana 30 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/115993015/FT_115993015.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'edoxaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de edoxabán en FA.',
        }),
      ),
    ],
  },
  rivaroxaban: {
    id: 'rivaroxaban',
    name: 'Rivaroxabán',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA no valvular cuando la estratificación tromboembólica la justifica.',
    dose:
      'CIMA: 20 mg VO cada 24 h con alimentos; 15 mg cada 24 h si el aclaramiento de creatinina es 15-49 mL/min cuando el riesgo hemorrágico lo aconseja. El libro cita 15-20 mg/24 h.',
    route: 'Oral',
    frequency: 'Cada 24 h con alimentos.',
    duration: 'Tratamiento crónico o peri-cardioversión según duración del episodio y riesgo.',
    contraindications: [
      'Hemorragia activa clínicamente significativa.',
      'Hepatopatía asociada a coagulopatía y riesgo hemorrágico, incluidos Child-Pugh B y C.',
      'No recomendado si aclaramiento de creatinina < 15 mL/min.',
    ],
    renalAdjustment:
      'La ficha CIMA ajusta a 15 mg/24 h en FA cuando el aclaramiento de creatinina está entre 15 y 49 mL/min; no recomendado por debajo de 15 mL/min.',
    hepaticAdjustment:
      'La ficha CIMA contraindica rivaroxabán si existe hepatopatía con coagulopatía y riesgo de sangrado clínicamente relevante, incluidos Child-Pugh B y C.',
    practicalNotes: [
      'Debe tomarse con alimentos para asegurar exposición adecuada.',
      'La guía ESC 2024 prioriza ACOD frente a AVK salvo prótesis mecánica o estenosis mitral moderada/grave.',
    ],
    sourceScope:
      'La indicación estratégica en FA y la preferencia por ACOD siguen la guía ESC 2024; la dosificación se apoya en CIMA y Murillo queda como apoyo práctico.',
    sources: [
      protocolSource(
        'ESC FA 2024 · anticoagulación oral',
        escFaReferenceEntry({
          id: 'rivaroxaban-fa-esc',
          verifiedPages: [32, 33, 34, 35, 36],
          pdfPages: [32, 33, 34, 35, 36],
          note: 'Uso de ACOD como estrategia preferente en FA no valvular.',
        }),
      ),
      cimaSource(
        'CIMA · Xarelto 20 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/08472018/FT_08472018.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación en FA',
        referenceEntry({
          id: 'rivaroxaban-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con dosis orientativa de rivaroxabán en FA.',
        }),
      ),
    ],
  },
  acenocumarol: {
    id: 'acenocumarol',
    name: 'Acenocumarol',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación oral en FA asociada a estenosis mitral moderada/grave o prótesis valvular mecánica, y alternativa con INR guiado en otros contextos.',
    dose:
      'CIMA: inicio habitual 1-3 mg/día en una única toma, con ajuste por INR. En el capítulo de FA se usa 3 mg/24 h asociado inicialmente a enoxaparina.',
    route: 'Oral',
    frequency: 'Una toma diaria, ajustada por INR.',
    duration: 'Crónica si FA con estenosis mitral moderada/grave o prótesis mecánica; también peri-cardioversión cuando se elige AVK.',
    contraindications: [
      'Embarazo.',
      'Situaciones con riesgo hemorrágico alto: diátesis hemorrágica, sangrado activo relevante, hipertensión grave.',
      'Insuficiencia hepática grave o insuficiencia renal grave si el riesgo hemorrágico supera el trombótico.',
    ],
    renalAdjustment:
      'La ficha CIMA no da una dosis fija por aclaramiento; insiste en cautela en insuficiencia renal leve-moderada y evita el uso en insuficiencia renal grave si el riesgo hemorrágico supera el beneficio.',
    hepaticAdjustment:
      'La ficha CIMA contraindica insuficiencia hepática grave y pide especial precaución en insuficiencia hepática leve-moderada por alteración de síntesis de factores y riesgo de sangrado.',
    practicalNotes: [
      'Requiere control estrecho de INR.',
      'La guía ESC 2024 lo reserva sobre todo para prótesis mecánica o estenosis mitral moderada/grave.',
      'Murillo orienta a INR 2,5-3,5 si FA con estenosis mitral moderada/grave o prótesis mecánica; INR 2-3 en otros contextos con AVK.',
    ],
    sourceScope:
      'La indicación estratégica en FA sigue la guía ESC 2024; la pauta de inicio y objetivos de INR se completan con Murillo y la individualización detallada procede de CIMA.',
    sources: [
      protocolSource(
        'ESC FA 2024 · AVK en FA valvular',
        escFaReferenceEntry({
          id: 'acenocumarol-fa-esc',
          verifiedPages: [32, 33, 34, 35, 36],
          pdfPages: [32, 33, 34, 35, 36],
          note: 'Los AVK siguen siendo la referencia si hay prótesis mecánica o estenosis mitral moderada/grave.',
        }),
      ),
      cimaSource(
        'CIMA · Sintrom 4 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/25670/ft_25670.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación con AVK en FA',
        referenceEntry({
          id: 'acenocumarol-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con pauta inicial de acenocumarol e INR objetivo.',
        }),
      ),
    ],
  },
  enoxaparina: {
    id: 'enoxaparina',
    name: 'Enoxaparina',
    protocolId: 'fibrilacion-auricular',
    family: 'Anticoagulación puente',
    indication:
      'Anticoagulación terapéutica puente en FA aguda cuando aún no hay anticoagulación oral establecida o antes de cardioversión según el capítulo de FA.',
    dose:
      'En este contexto: 1 mg/kg SC cada 12 h durante las primeras 48 h asociado a AVK, o dosis única terapéutica de 100 UI/kg SC en episodios agudos según escenario clínico del capítulo.',
    route: 'Subcutánea',
    frequency: 'Cada 12 h en pauta terapéutica puente; dosis única en algunos episodios agudos.',
    duration: 'Uso corto mientras se estabiliza la estrategia anticoagulante.',
    contraindications: [
      'Hemorragia activa clínicamente relevante.',
      'Antecedente de trombocitopenia inmune inducida por heparina en los últimos 100 días o anticuerpos circulantes.',
      'Precaución alta si el riesgo de sangrado supera el beneficio esperado.',
    ],
    renalAdjustment:
      'CIMA: si el aclaramiento de creatinina es 15-30 mL/min, las pautas terapéuticas pasan a 1 mg/kg cada 24 h. No recomendada si es < 15 mL/min fuera de hemodiálisis.',
    hepaticAdjustment:
      'CIMA: datos limitados; usar con precaución en insuficiencia hepática por aumento potencial del riesgo hemorrágico.',
    practicalNotes: [
      'No es la referencia principal crónica del protocolo FA, pero sigue siendo apoyo práctico en escenarios puente o peri-cardioversión seleccionados.',
      'La ficha CIMA no lista FA como indicación literal; en este proyecto se usa como puente anticoagulante porque así aparece en el capítulo 23 del Murillo.',
      'Si se usa como puente con AVK, documentar claramente el plan de suspensión y el primer control de coagulación.',
    ],
    sourceScope:
      'La guía ESC 2024 ordena la estrategia anticoagulante peri-cardioversión; el uso concreto de HBPM como apoyo práctico en este proyecto sigue apoyándose en Murillo y CIMA.',
    sources: [
      protocolSource(
        'ESC FA 2024 · cardioversión y anticoagulación',
        escFaReferenceEntry({
          id: 'enoxaparina-fa-esc',
          verifiedPages: [46, 47, 48, 49],
          pdfPages: [46, 47, 48, 49],
          note: 'Marco general de anticoagulación alrededor de la cardioversión en FA aguda.',
        }),
      ),
      cimaSource(
        'CIMA · Clexane 10.000 UI (100 mg)/1 ml',
        'https://cima.aemps.es/cima/dochtml/ft/62472/FT_62472.html',
      ),
      protocolSource(
        'Murillo 7.ª ed. · anticoagulación puente en FA',
        referenceEntry({
          id: 'enoxaparina-fa',
          verifiedPage: 189,
          pdfPage: 214,
          note: 'Cuadro 23.4 con pauta terapéutica de HBPM asociada a AVK.',
        }),
      ),
    ],
  },
  captopril: {
    id: 'captopril',
    name: 'Captopril',
    protocolId: 'hta-urgencias',
    family: 'Urgencia hipertensiva',
    indication:
      'Descenso gradual de la presión arterial en urgencia hipertensiva sin daño agudo de órgano diana.',
    dose:
      'En este contexto: 25 mg VO; puede repetirse a los 30 min si persiste la elevación tensional.',
    route: 'Oral',
    frequency: 'Dosis puntual con reevaluación clínica y tensional posterior.',
    duration: 'Uso agudo en urgencias y ajuste ambulatorio posterior según respuesta.',
    contraindications: [
      'Embarazo.',
      'Hiperpotasemia o insuficiencia renal relevante.',
      'Antecedente de angioedema asociado a IECA.',
    ],
    renalAdjustment:
      'El capítulo de HTA lo contraindica si existe insuficiencia renal relevante. Si se mantiene tratamiento, conviene reevaluar creatinina y potasio.',
    hepaticAdjustment:
      'La obra base no aporta un ajuste hepático numérico. Mantener prudencia clínica si existe hepatopatía avanzada.',
    practicalNotes: [
      'No usar por vía sublingual.',
      'Inicio de acción a los 15-30 min y máximo efecto en 1-2 h.',
      'Si hay daño agudo de órgano diana no es la estrategia de elección.',
    ],
    sourceScope:
      'La guía ESC 2024 manda la estrategia aguda de HTA y Murillo se mantiene como apoyo para la pauta práctica concreta de captopril.',
    sources: [
      protocolSource(
        'ESC HTA 2024 · manejo agudo de la HTA',
        escHtaReferenceEntry({
          id: 'esc-captopril-hta',
          verifiedPages: [80],
          pdfPages: [81],
          note: 'La guía admite IECA de acción corta por vía oral en pacientes seleccionados y dentro de un entorno hospitalario.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · urgencia hipertensiva',
        referenceEntry({
          id: 'captopril-hta',
          verifiedPage: 247,
          pdfPage: 272,
          note: 'Tratamiento oral inicial en urgencia hipertensiva.',
        }),
      ),
    ],
  },
  labetalol: {
    id: 'labetalol',
    name: 'Labetalol',
    protocolId: 'hta-urgencias',
    family: 'Urgencia y emergencia hipertensiva',
    indication:
      'Control de la presión arterial en urgencia hipertensiva por vía oral y en emergencia hipertensiva por vía intravenosa.',
    dose:
      'En este contexto: 100 mg VO y repetir a las 2 h si hace falta. En emergencia: 20 mg IV lento cada 5 min hasta 100 mg o perfusión 0,5-2 mg/min; después 100 mg VO/12 h.',
    route: 'Oral / intravenosa',
    frequency: 'Bolos o perfusión IV titulados; cada 12 h por vía oral al pasar a estabilidad.',
    duration: 'Uso agudo con transición posterior cuando las cifras se estabilizan.',
    contraindications: [
      'Insuficiencia cardíaca con fallo sistólico.',
      'Asma, EPOC broncoespástica o broncoespasmo activo.',
      'Bloqueo AV de segundo/tercer grado o isquemia arterial periférica relevante.',
    ],
    renalAdjustment:
      'La obra base no fija un ajuste renal cerrado. Requiere individualización y monitorización hemodinámica.',
    hepaticAdjustment:
      'El capítulo no aporta un ajuste hepático cuantificado; si existe hepatopatía relevante conviene extremar la vigilancia clínica.',
    practicalNotes: [
      'En urgencia hipertensiva por vía oral inicia acción a los 15-30 min y máximo efecto a las 2-4 h.',
      'En emergencia hipertensiva se usa por vía intravenosa con monitorización continua.',
      'Puede mantenerse por vía oral tras estabilización.',
    ],
    sourceScope:
      'La guía ESC 2024 marca el uso de tratamiento intravenoso de acción corta en la emergencia hipertensiva; Murillo se mantiene como apoyo para las dosis prácticas oral e intravenosa.',
    sources: [
      protocolSource(
        'ESC HTA 2024 · manejo agudo de la HTA',
        escHtaReferenceEntry({
          id: 'esc-labetalol-hta',
          verifiedPages: [79, 80, 81],
          pdfPages: [80, 81, 82],
          note: 'Referencia principal del manejo agudo; incluye papel del labetalol IV en embarazo y necesidad de titulación cuidadosa.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · urgencia hipertensiva',
        referenceEntry({
          id: 'labetalol-hta-oral',
          verifiedPage: 247,
          pdfPage: 272,
          note: 'Labetalol oral en urgencia hipertensiva.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · emergencia hipertensiva',
        referenceEntry({
          id: 'labetalol-hta-iv',
          verifiedPage: 251,
          pdfPage: 276,
          note: 'Labetalol intravenoso y transición oral en emergencia hipertensiva.',
        }),
      ),
    ],
  },
  amlodipino: {
    id: 'amlodipino',
    name: 'Amlodipino',
    protocolId: 'hta-urgencias',
    family: 'Urgencia hipertensiva',
    indication:
      'Alternativa oral de inicio más lento para descenso gradual de la presión arterial en urgencia hipertensiva.',
    dose: 'En este contexto: 5 mg VO; el máximo efecto aparece entre 1 y 6 h.',
    route: 'Oral',
    frequency: 'Dosis inicial diaria con reevaluación posterior.',
    duration: 'Uso agudo y ajuste ambulatorio posterior según control tensional.',
    contraindications: [
      'Evitar si se requiere un descenso inmediato de la presión arterial.',
      'Precaución en bloqueo AV de alto grado según el capítulo base.',
      'Vigilar hipotensión si se asocia a otros vasodilatadores.',
    ],
    renalAdjustment:
      'La obra base no describe un ajuste renal específico; mantener vigilancia clínica y hemodinámica.',
    hepaticAdjustment:
      'No se describe un ajuste hepático numérico en la bibliografía base; iniciar con prudencia si existe hepatopatía avanzada.',
    practicalNotes: [
      'Es más lento que captopril o labetalol oral.',
      'Encaja mejor cuando se busca un descenso progresivo en 24-48 h.',
    ],
    sourceScope:
      'La guía ESC 2024 fija el marco general de descenso gradual en HTA sin daño agudo; Murillo se conserva como apoyo para el uso contextual y la dosis de amlodipino.',
    sources: [
      protocolSource(
        'ESC HTA 2024 · descenso agudo y a corto plazo de la PA',
        escHtaReferenceEntry({
          id: 'esc-amlodipino-hta',
          verifiedPages: [79, 80],
          pdfPages: [80, 81],
          note: 'La guía prioriza descenso gradual sin reducciones bruscas cuando no hay daño agudo de órgano diana.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · urgencia hipertensiva',
        createBibliographyEntry({
          id: 'amlodipino-hta',
          referenceId: 'murillo7',
          verifiedPages: [247, 248],
          pdfPages: [272, 273],
          note: 'Antagonista del calcio citado en el tratamiento oral de la urgencia hipertensiva.',
        }),
      ),
    ],
  },
  'labetalol-ictus': {
    id: 'labetalol-ictus',
    name: 'Labetalol IV',
    protocolId: 'ictus-hemorragico',
    family: 'Control tensional en ictus',
    indication:
      'Control rápido y titulado de la presión arterial en ictus hemorrágico y en ictus isquémico cuando la PA impide trombólisis o precisa control estrecho.',
    contextUse: 'Ictus hemorrágico con necesidad de descenso controlado de PAS, o ictus isquémico candidato a reperfusión con PA por encima del objetivo.',
    contextDose: '10-20 mg IV lento; repetir o titular según respuesta. Si la situación lo requiere, perfusión 0,5-2 mg/min con monitorización continua.',
    contextRoute: 'Intravenosa.',
    contextFrequency: 'Bolos titulados o perfusión continua según objetivo tensional.',
    followUpPlan: 'Reevalúa objetivo de PA según el tipo de ictus y la estrategia de reperfusión o de control del sangrado.',
    dose:
      '10-20 mg IV lento y repetir según respuesta. Si hace falta control sostenido, perfusión IV 0,5-2 mg/min con monitorización continua.',
    route: 'Intravenosa.',
    frequency: 'Bolos repetidos o perfusión titulada.',
    duration: 'Uso agudo con reevaluación hemodinámica continua.',
    contraindications: [
      'Asma o broncoespasmo activo.',
      'Bloqueo AV avanzado o bradicardia significativa.',
      'Shock cardiogénico o insuficiencia cardíaca descompensada donde no tolere betabloqueo.',
    ],
    renalAdjustment:
      'No existe un ajuste renal de urgencias cerrado; la titulación debe seguir la respuesta hemodinámica.',
    hepaticAdjustment:
      'La hepatopatía relevante obliga a prudencia clínica, pero el uso agudo se guía por respuesta y seguridad.',
    practicalNotes: [
      'Antes de trombólisis IV en ictus isquémico, controla la PA por debajo de 185/110 mmHg.',
      'En ictus hemorrágico con PAS 150-220 mmHg y sin contraindicación, busca un descenso suave y mantenido, no brusco.',
      'La variabilidad tensional importa tanto como la cifra absoluta: evita oscilaciones grandes.',
    ],
    sourceScope:
      'La indicación se reparte entre la guía AHA 2026 para ictus isquémico y la guía AHA 2022 para ictus hemorrágico; Murillo queda como apoyo complementario del manejo urgente.',
    sources: [
      protocolSource(
        'AHA ictus hemorrágico 2022 · control agudo de PA',
        ahaHemorrhagicStrokeReferenceEntry({
          id: 'labetalol-ictus-hemorragico-aha',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Referencia principal para descenso agudo y sostenido de la PA en hemorragia intracerebral.',
        }),
      ),
      protocolSource(
        'AHA ictus isquémico 2026 · objetivos tensionales previos a trombólisis',
        ahaIschemicStrokeReferenceEntry({
          id: 'labetalol-ictus-isquemico-aha',
          verifiedPages: [1],
          pdfPages: [1],
          note: 'Referencia principal para control de PA antes y después de la trombólisis en ictus isquémico.',
        }),
      ),
    ],
  },
  nitroglicerina: {
    id: 'nitroglicerina',
    name: 'Nitroglicerina',
    protocolId: 'hta-urgencias',
    family: 'Emergencia hipertensiva',
    indication:
      'Perfusión intravenosa útil cuando la emergencia hipertensiva coexiste con síndrome coronario agudo, edema agudo de pulmón o descarga catecolaminérgica.',
    dose:
      'En este contexto: 20 microg/min IV iniciales, titulando según respuesta clínica y tensional.',
    route: 'Intravenosa',
    frequency: 'Perfusión continua titulada.',
    duration: 'Uso agudo monitorizado mientras persiste la indicación.',
    contraindications: [
      'Hipotensión o deterioro hemodinámico no corregido.',
      'No es la primera elección aislada si no hay contexto coronario o edema agudo de pulmón.',
      'Requiere monitorización estrecha para evitar descensos bruscos.',
    ],
    renalAdjustment:
      'La bibliografía base no describe un ajuste renal específico; la titulación se guía por respuesta hemodinámica.',
    hepaticAdjustment:
      'La bibliografía base no define un ajuste hepático específico; ajustar por respuesta clínica y tolerancia.',
    practicalNotes: [
      'Especialmente útil si hay síndrome coronario agudo o edema agudo de pulmón.',
      'Debe titularse con monitorización continua.',
    ],
    sourceScope:
      'La guía ESC 2024 es la referencia principal para el manejo IV en HTA aguda y el uso de nitroglicerina en edema pulmonar o embarazo; Murillo aporta la pauta práctica de perfusión.',
    sources: [
      protocolSource(
        'ESC HTA 2024 · HTA aguda y embarazo',
        escHtaReferenceEntry({
          id: 'esc-nitroglicerina-hta',
          verifiedPages: [79, 81],
          pdfPages: [80, 82],
          note: 'Tratamiento intravenoso en emergencia hipertensiva y nitroglicerina IV si se asocia a edema pulmonar en preeclampsia/eclampsia.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · emergencia hipertensiva',
        referenceEntry({
          id: 'nitroglicerina-hta',
          verifiedPage: 251,
          pdfPage: 276,
          note: 'Perfusión de nitroglicerina en emergencia hipertensiva.',
        }),
      ),
    ],
  },
  nitroprusiato: {
    id: 'nitroprusiato',
    name: 'Nitroprusiato sódico',
    protocolId: 'hta-urgencias',
    family: 'Emergencia hipertensiva',
    indication:
      'Tratamiento intravenoso de elección en hipertensión maligna o encefalopatía hipertensiva dentro de la emergencia hipertensiva.',
    dose:
      'En este contexto: 1 microg/kg/min IV inicial; puede subir hasta 3 microg/kg/min y hasta 10 microg/kg/min en disección aórtica.',
    route: 'Intravenosa',
    frequency: 'Perfusión continua titulada.',
    duration: 'Uso agudo monitorizado hasta controlar la situación crítica.',
    contraindications: [
      'Eclampsia.',
      'Riesgo de intoxicación cianhídrica en insuficiencia renal o infusiones prolongadas.',
      'Necesita monitorización continua y proteger la solución de la luz.',
    ],
    renalAdjustment:
      'La obra advierte de acumulación de tiocianato e intoxicación cianhídrica en insuficiencia renal o cuando la perfusión se prolonga.',
    hepaticAdjustment:
      'Los radicales cianhídricos se metabolizan en el hígado; si existe hepatopatía significativa conviene extremar la vigilancia clínica.',
    practicalNotes: [
      'Proteger la solución de la luz.',
      'El capítulo lo sitúa como tratamiento de elección en hipertensión maligna y encefalopatía hipertensiva.',
    ],
    sourceScope:
      'La guía ESC 2024 marca la necesidad de fármacos intravenosos de acción corta y descenso titulado; Murillo se mantiene como apoyo para la pauta concreta de nitroprusiato.',
    sources: [
      protocolSource(
        'ESC HTA 2024 · emergencia hipertensiva',
        escHtaReferenceEntry({
          id: 'esc-nitroprusiato-hta',
          verifiedPages: [79, 80],
          pdfPages: [80, 81],
          note: 'La referencia principal actual prioriza tratamiento intravenoso de acción corta y evita descensos bruscos.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · emergencia hipertensiva',
        referenceEntry({
          id: 'nitroprusiato-hta',
          verifiedPage: 251,
          pdfPage: 276,
          note: 'Pauta intravenosa de nitroprusiato sódico en emergencia hipertensiva.',
        }),
      ),
    ],
  },
  'acido-acetilsalicilico': {
    id: 'acido-acetilsalicilico',
    name: 'Ácido acetilsalicílico',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Antiagregación',
    indication:
      'Antiagregación inicial en cualquier síndrome coronario agudo desde la sospecha clínica.',
    dose:
      'En este contexto: 150-300 mg VO masticados como dosis de carga o 75-250 mg IV si no es posible la vía oral; después 75-100 mg/24 h.',
    route: 'Oral',
    frequency: 'Carga única y después una toma diaria.',
    duration: 'Inicio inmediato y continuación según evolución hospitalaria y cardiología.',
    contraindications: [
      'Sangrado activo o riesgo hemorrágico no asumible.',
      'Hipersensibilidad conocida a salicilatos.',
      'Si ya recibió ácido acetilsalicílico en las últimas 24 h, revisar antes de repetir la carga.',
    ],
    renalAdjustment:
      'La guía ESC 2023 no exige un ajuste renal específico para la carga inicial; la prioridad es valorar el riesgo hemorrágico y la función renal global.',
    hepaticAdjustment:
      'La guía no define un ajuste hepático específico para la carga inicial; si existe hepatopatía con riesgo hemorrágico, individualizar.',
    practicalNotes: [
      'Debe administrarse lo más precozmente posible ante un SCA.',
      'La carga se realiza con preparado sin recubrimiento entérico y masticado.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para la antiagregación inicial con aspirina en el SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · aspirina en SCA',
        escScaReferenceEntry({
          id: 'aas-sca-esc',
          verifiedPages: [33],
          pdfPages: [34],
          note: 'Tabla de dosis de aspirina en el síndrome coronario agudo.',
        }),
      ),
    ],
  },
  prasugrel: {
    id: 'prasugrel',
    name: 'Prasugrel',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Antiagregación',
    indication:
      'Inhibidor del P2Y12 para pacientes con SCA que van a intervención coronaria percutánea y no tienen contraindicación.',
    dose:
      'En este contexto: 60 mg VO de carga y después 10 mg/24 h. Si pesa < 60 kg o, si se decide usarlo con edad ≥ 75 años, emplear 5 mg/24 h.',
    route: 'Oral',
    frequency: 'Carga única y después una toma diaria.',
    duration: 'Inicio agudo y continuación según el plan de revascularización y cardiología.',
    contraindications: [
      'Ictus o AIT previo.',
      'Sangrado activo o riesgo hemorrágico no asumible.',
      'Precaución especial en edad ≥ 75 años o peso < 60 kg.',
    ],
    renalAdjustment:
      'La guía ESC 2023 no exige ajuste de dosis por insuficiencia renal.',
    hepaticAdjustment:
      'La guía no ofrece un ajuste numérico en hepatopatía; si el riesgo hemorrágico es relevante, individualizar.',
    practicalNotes: [
      'En pacientes con SCA que van a ICP suele preferirse frente a ticagrelor cuando no hay contraindicación.',
      'No debe pretratarse de rutina en SCASEST si la anatomía coronaria es desconocida y se prevé coronariografía precoz.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para indicación, dosis y contraindicaciones de prasugrel en SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · prasugrel',
        escScaReferenceEntry({
          id: 'prasugrel-sca-esc',
          verifiedPages: [33, 40],
          pdfPages: [34, 41],
          note: 'Tabla de dosis y recomendaciones de elección del inhibidor P2Y12 en el SCA.',
        }),
      ),
    ],
  },
  ticagrelor: {
    id: 'ticagrelor',
    name: 'Ticagrelor',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Antiagregación',
    indication:
      'Inhibidor del P2Y12 junto con ácido acetilsalicílico en SCACEST o SCASEST cuando no se usa prasugrel como opción preferente para ICP.',
    dose:
      'En este contexto: 180 mg VO de carga y después 90 mg VO cada 12 h.',
    route: 'Oral',
    frequency: 'Carga única y después cada 12 h.',
    duration: 'Inicio agudo y continuación según estrategia invasiva y plan cardiológico.',
    contraindications: [
      'Revisar el riesgo hemorrágico antes de asociarlo a ácido acetilsalicílico.',
      'No usarlo como sustituto aislado del tratamiento antitrombótico completo.',
      'Si el paciente va a ICP y puede usarse prasugrel, este suele ser la opción preferida.',
    ],
    renalAdjustment:
      'La guía ESC 2023 no exige ajuste de dosis por insuficiencia renal.',
    hepaticAdjustment:
      'La guía no ofrece un ajuste numérico en hepatopatía; si existe hepatopatía significativa o riesgo hemorrágico alto, individualizar.',
    practicalNotes: [
      'Está recomendado con independencia de la estrategia invasiva si no se escoge prasugrel como opción preferente para ICP.',
      'No debe usarse como pretratamiento rutinario en SCASEST cuando se prevé coronariografía en < 24 h y la anatomía es desconocida.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para la carga, mantenimiento y momento de uso de ticagrelor en SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · ticagrelor',
        escScaReferenceEntry({
          id: 'ticagrelor-sca-esc',
          verifiedPages: [33, 40],
          pdfPages: [34, 41],
          note: 'Dosis y recomendaciones de uso del ticagrelor en síndrome coronario agudo.',
        }),
      ),
    ],
  },
  clopidogrel: {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Antiagregación',
    indication:
      'Alternativa antiagregante asociada a ácido acetilsalicílico cuando prasugrel o ticagrelor no están disponibles, no se toleran o están contraindicados; también en fibrinólisis.',
    dose:
      'En este contexto: 300-600 mg VO de carga y después 75 mg/24 h. Si se usa con fibrinólisis, 300 mg de carga o 75 mg si la persona tiene > 75 años.',
    route: 'Oral',
    frequency: 'Carga única y después una toma diaria.',
    duration: 'Inicio agudo y continuación según la estrategia de revascularización y el plan cardiológico.',
    contraindications: [
      'Sangrado activo clínicamente relevante.',
      'No es la opción preferente si puede usarse ticagrelor en SCASEST de riesgo intermedio o alto.',
      'Evitar interacciones que reduzcan su efecto antiagregante.',
    ],
    renalAdjustment:
      'La guía ESC 2023 no exige un ajuste renal específico para la pauta aguda; vigilar riesgo hemorrágico y la estrategia de revascularización.',
    hepaticAdjustment:
      'La guía no define un ajuste hepático numérico en este contexto; si existe hepatopatía significativa, individualizar.',
    practicalNotes: [
      'Es la alternativa cuando no puedes usar prasugrel o ticagrelor.',
      'Mantiene un papel claro si el SCACEST se trata con fibrinólisis.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para el uso de clopidogrel en SCA y fibrinólisis.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · clopidogrel',
        escScaReferenceEntry({
          id: 'clopidogrel-sca-esc',
          verifiedPages: [33],
          pdfPages: [34],
          note: 'Dosis de carga y mantenimiento de clopidogrel en SCA.',
        }),
      ),
    ],
  },
  'heparina-sodica': {
    id: 'heparina-sodica',
    name: 'Heparina sódica',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación parenteral cuando el SCA va a una intervención coronaria percutánea urgente o precoz.',
    dose:
      'En este contexto: bolo IV ajustado al peso de 70-100 UI/kg durante la ICP. Si se usa como tratamiento inicial, puede continuarse en perfusión ajustada para mantener un aPTT de 60-80 s.',
    route: 'Intravenosa',
    frequency: 'Bolo inicial según estrategia invasiva.',
    duration: 'Uso agudo al inicio del proceso y durante la estrategia invasiva.',
    contraindications: [
      'Sangrado activo o diátesis hemorrágica relevante.',
      'Antecedente o sospecha de trombocitopenia inducida por heparina.',
      'Revisar que realmente se prevea ICP urgente o precoz antes de elegirla.',
    ],
    renalAdjustment:
      'La guía ESC 2023 no exige un ajuste renal específico para la dosis inicial; controlar sangrado y la respuesta anticoagulante según evolución.',
    hepaticAdjustment:
      'La guía no define un ajuste hepático cuantificado en este escenario agudo; individualizar si existe hepatopatía con coagulopatía.',
    practicalNotes: [
      'Es la opción descrita cuando vas a ICP primaria o precoz.',
      'Si no se prevé ICP inmediata en SCASEST, el capítulo dirige hacia fondaparinux o enoxaparina.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para la anticoagulación con heparina no fraccionada en SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · heparina no fraccionada',
        escScaReferenceEntry({
          id: 'heparina-sca-esc',
          verifiedPages: [33, 40],
          pdfPages: [34, 41],
          note: 'Tabla de dosis y recomendación de bolo de HNF durante la ICP.',
        }),
      ),
    ],
  },
  'enoxaparina-sca': {
    id: 'enoxaparina-sca',
    name: 'Enoxaparina',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación alternativa en SCA, sobre todo si en SCASEST se prevé coronariografía precoz (< 24 h) o como alternativa a HNF en IAMCEST con ICP.',
    dose:
      'En este contexto: 1 mg/kg SC cada 12 h durante al menos 2 días y hasta la estabilización clínica. Si el aclaramiento de creatinina es < 30 mL/min, 1 mg/kg/24 h. Si la última dosis SC fue > 8 h antes de la ICP, añadir 0,3 mg/kg IV.',
    route: 'Intravenosa / subcutánea',
    frequency: 'Bolo inicial y mantenimiento cada 12 h, o cada 24 h si hay insuficiencia renal grave.',
    duration: 'Uso agudo mientras se completa el estudio y la estrategia invasiva diferida.',
    contraindications: [
      'Diátesis hemorrágica.',
      'Hipertensión arterial grave no controlada.',
      'Retinopatía hemorrágica, aneurisma cerebral o hemorragia intracraneal.',
    ],
    renalAdjustment:
      'Si el aclaramiento de creatinina es inferior a 30 mL/min, la pauta de mantenimiento pasa a 1 mg/kg/24 h.',
    hepaticAdjustment:
      'La guía no define un ajuste hepático concreto; si existe hepatopatía con riesgo hemorrágico, individualizar y vigilar.',
    practicalNotes: [
      'En SCASEST con coronariografía prevista en < 24 h es alternativa a la HNF.',
      'En IAMCEST con ICP puede considerarse alternativa a la HNF.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para la pauta de enoxaparina en SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · enoxaparina',
        escScaReferenceEntry({
          id: 'enoxaparina-sca-esc',
          verifiedPages: [33, 40],
          pdfPages: [34, 41],
          note: 'Dosis de enoxaparina y papel como alternativa a HNF según la estrategia invasiva.',
        }),
      ),
    ],
  },
  'fondaparinux-sca': {
    id: 'fondaparinux-sca',
    name: 'Fondaparinux',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Anticoagulación',
    indication:
      'Anticoagulación de elección en SCASEST cuando no se prevé coronariografía invasiva temprana (< 24 h).',
    dose:
      'En este contexto: 2,5 mg SC cada 24 h. Si finalmente se realiza ICP, administrar además un bolo único de HNF. Evitar si el aclaramiento de creatinina es < 20 mL/min.',
    route: 'Subcutánea',
    frequency: 'Una vez al día.',
    duration: 'Uso agudo mientras se completa el estudio y la estrategia invasiva diferida o selectiva.',
    contraindications: [
      'Sangrado activo o riesgo hemorrágico no asumible.',
      'Aclaramiento de creatinina < 20 mL/min.',
      'No usar como anticoagulante de elección en IAMCEST con ICP primaria.',
    ],
    renalAdjustment:
      'La guía ESC 2023 indica evitarlo si el aclaramiento de creatinina es < 20 mL/min.',
    hepaticAdjustment:
      'La guía no aporta un ajuste hepático numérico; si existe hepatopatía con riesgo hemorrágico, individualizar.',
    practicalNotes: [
      'Es la opción recomendada en SCASEST si no se prevé coronariografía en < 24 h.',
      'Si el paciente acaba en ICP, añade un bolo de HNF para evitar trombosis del catéter.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para el uso de fondaparinux en SCASEST.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · fondaparinux',
        escScaReferenceEntry({
          id: 'fondaparinux-sca-esc',
          verifiedPages: [33, 40],
          pdfPages: [34, 41],
          note: 'Dosis de fondaparinux y recomendación como anticoagulación de elección cuando no se prevé angiografía < 24 h.',
        }),
      ),
    ],
  },
  'nitroglicerina-sca': {
    id: 'nitroglicerina-sca',
    name: 'Nitroglicerina',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Antiisquémico',
    indication:
      'Tratamiento antiisquémico para aliviar síntomas cuando el paciente con SCA presenta dolor torácico en el momento de la valoración.',
    dose:
      'En este contexto: 0,8-1 mg sublinguales cada 5 min hasta 3 dosis. Si persiste el dolor o existe IAM anterior extenso, insuficiencia cardíaca o isquemia persistente con hipertensión, iniciar perfusión IV desde 10 microg/min y titular.',
    route: 'Sublingual / intravenosa',
    frequency: 'Dosis sublinguales repetibles y perfusión continua si hace falta.',
    duration: 'Uso agudo mientras persista dolor o isquemia y siempre con control hemodinámico.',
    contraindications: [
      'Infarto de ventrículo derecho.',
      'Hipotensión arterial, bradicardia grave o taquicardia mantenida.',
      'Uso reciente de sildenafilo, vardenafilo o tadalafilo.',
    ],
    renalAdjustment:
      'No requiere un ajuste renal específico en esta pauta aguda; la titulación se guía por la respuesta hemodinámica.',
    hepaticAdjustment:
      'No hay un ajuste hepático numérico establecido para esta pauta aguda; vigilar tolerancia y presión arterial.',
    practicalNotes: [
      'Puede aliviar la isquemia, pero no debe usarse como maniobra diagnóstica.',
      'No sustituye a la analgesia opioide si el dolor persiste.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para indicación y contraindicaciones; Murillo se mantiene como apoyo para la pauta sublingual e intravenosa práctica.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · nitratos en SCA',
        escScaReferenceEntry({
          id: 'nitroglicerina-sca-esc',
          verifiedPages: [25],
          pdfPages: [26],
          note: 'Uso sintomático de nitratos y contraindicaciones principales en la fase aguda.',
        }),
      ),
      protocolSource(
        'Murillo 7.ª ed. · nitroglicerina en SCA',
        referenceEntry({
          id: 'nitroglicerina-sca',
          verifiedPage: 222,
          pdfPage: 247,
          note: 'Uso sublingual e intravenoso de nitroglicerina en el síndrome coronario agudo.',
        }),
      ),
    ],
  },
  'morfina-sca': {
    id: 'morfina-sca',
    name: 'Morfina',
    protocolId: 'sindrome-coronario-agudo',
    family: 'Analgesia',
    indication:
      'Analgesia intravenosa cuando persiste dolor torácico intenso a pesar de nitratos y medidas iniciales.',
    dose:
      'En este contexto: 5-10 mg IV, titulando según control del dolor y tolerancia hemodinámica.',
    route: 'Intravenosa',
    frequency: 'Bolos titulados y, si hace falta, perfusión continua.',
    duration: 'Uso agudo mientras persista dolor isquémico no controlado.',
    contraindications: [
      'Precaución si existe depresión respiratoria o deterioro hemodinámico.',
      'Usar con cuidado si hay bradicardia o predominio vagal.',
      'No sustituye al tratamiento de reperfusión ni al antitrombótico.',
    ],
    renalAdjustment:
      'La guía no fija un ajuste renal específico para esta pauta aguda; si la función renal está muy comprometida, vigilar acumulación y depresión respiratoria.',
    hepaticAdjustment:
      'La guía no establece un ajuste hepático numérico; si existe hepatopatía avanzada, extremar la vigilancia clínica.',
    practicalNotes: [
      'Se usa cuando el dolor sigue siendo intenso pese a nitratos y medidas iniciales.',
      'Puede retrasar la absorción y el efecto de los antiagregantes orales.',
    ],
    sourceScope:
      'La guía ESC 2023 es la referencia principal para la analgesia opioide en el SCA.',
    sources: [
      protocolSource(
        'ESC SCA 2023 · opiáceos en SCA',
        escScaReferenceEntry({
          id: 'morfina-sca-esc',
          verifiedPages: [25],
          pdfPages: [26],
          note: 'La guía contempla opiáceos IV como morfina 5-10 mg para dolor torácico intenso.',
        }),
      ),
    ],
  },
};

export const medicationList = Object.values(medicationCatalog);

export const medicationGroups = [
  {
    id: 'control-frecuencia',
    title: 'Control de frecuencia',
    items: ['metoprolol', 'verapamilo', 'digoxina', 'amiodarona'],
  },
  {
    id: 'anticoagulacion',
    title: 'Anticoagulación en FA no valvular',
    items: ['apixaban', 'dabigatran', 'edoxaban', 'rivaroxaban'],
  },
  {
    id: 'puente-o-avk',
    title: 'Puente o AVK',
    items: ['acenocumarol', 'enoxaparina'],
  },
  {
    id: 'hta-oral',
    title: 'HTA oral',
    items: ['captopril', 'labetalol', 'amlodipino'],
  },
  {
    id: 'hta-iv',
    title: 'HTA IV',
    items: ['nitroprusiato', 'nitroglicerina', 'labetalol'],
  },
  {
    id: 'sca-antiisquemico',
    title: 'SCA · analgesia y antiisquémico',
    items: ['nitroglicerina-sca', 'morfina-sca'],
  },
  {
    id: 'sca-antitrombotico',
    title: 'SCA · antitrombótico',
    items: [
      'acido-acetilsalicilico',
      'prasugrel',
      'ticagrelor',
      'clopidogrel',
      'heparina-sodica',
      'enoxaparina-sca',
      'fondaparinux-sca',
    ],
  },
  {
    id: 'arritmias-agudas',
    title: 'Arritmias agudas',
    items: ['adenosina', 'atropina', 'amiodarona-vt', 'magnesio-torsades'],
  },
  {
    id: 'ictus',
    title: 'Ictus',
    items: ['alteplasa-ictus', 'labetalol-ictus'],
  },
];

export const getMedication = (medicationId) => medicationCatalog[medicationId] ?? medicationList[0];
