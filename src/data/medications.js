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

const cimaSource = (label, url) => ({ label, url, type: 'cima' });
const protocolSource = (label, bibliography) => ({ label, bibliography, type: 'protocol' });

export const medicationCatalog = {
  metoprolol: {
    id: 'metoprolol',
    name: 'Metoprolol',
    protocolId: 'fibrilacion-auricular',
    family: 'Control de frecuencia',
    indication:
      'Control de la frecuencia ventricular en fibrilación auricular rápida sin insuficiencia cardíaca manifiesta.',
    dose:
      'En este contexto: 100 mg VO cada 12 h o 2,5 mg IV lento; repetir cada 10 min hasta 15 mg totales si hace falta.',
    route: 'Oral / intravenosa',
    frequency: 'Cada 12 h por vía oral; bolos IV titulados en fase aguda.',
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
      'En FA el libro lo sitúa como primera opción si no hay insuficiencia cardíaca.',
      'No combinar de entrada con verapamilo o diltiazem.',
    ],
    sourceScope:
      'La pauta IV específica del contexto FA procede del capítulo 23 del Murillo; la ficha técnica CIMA consultada corresponde a la formulación oral.',
    sources: [
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
    dose:
      'En este contexto: 40-80 mg VO cada 8 h; IV 5 mg en 10 min, repetible cada 20 min hasta 20 mg totales.',
    route: 'Oral / intravenosa',
    frequency: 'Cada 8 h por vía oral; bolos IV titulados en fase aguda.',
    duration: 'Uso agudo con reevaluación posterior del control de frecuencia.',
    contraindications: [
      'Shock cardiogénico, bloqueo AV de segundo/tercer grado o síndrome del nodo sinusal enfermo.',
      'Insuficiencia cardíaca con fracción de eyección reducida.',
      'Flutter o FA con vía accesoria (WPW / Lown-Ganong-Levine).',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada no fija reducción estándar, pero exige uso con precaución y vigilancia estrecha si la función renal está alterada.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada indica metabolismo más lento en insuficiencia hepática y recomienda iniciar con dosis bajas.',
    practicalNotes: [
      'En la obra se reserva para FA rápida sin insuficiencia cardíaca.',
      'No asociar de entrada con betabloqueantes.',
      'Usar con precaución junto con digoxina porque puede elevar sus concentraciones.',
    ],
    sourceScope:
      'La pauta IV concreta del contexto FA procede del capítulo 23 del Murillo; la ficha CIMA consultada corresponde a la formulación oral.',
    sources: [
      cimaSource('CIMA · Manidón 80 mg comprimidos', 'https://cima.aemps.es/cima/dochtml/ft/50891'),
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
      'Control de frecuencia en FA cuando no se toleran betabloqueantes/verapamilo o cuando existe insuficiencia cardíaca.',
    dose:
      'En este contexto: digitalización VO 0,25 mg cada 8 h durante 48 h y luego 0,25 mg/24 h; IV 0,25 mg cada 2 h hasta control o 1,5 mg máximos.',
    route: 'Oral / intravenosa',
    frequency: 'Cargas fraccionadas y luego mantenimiento diario.',
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
      'En la obra es fármaco de elección si hay insuficiencia cardíaca, aunque pierde eficacia cuando predomina la activación simpática.',
      'Si el paciente ya toma digitálicos no debe redigitalizarse.',
      'La cardioversión eléctrica requiere precaución añadida en tratamiento digitálico.',
    ],
    sourceScope:
      'La pauta específica de carga y mantenimiento en FA procede del capítulo 23 del Murillo; la ficha CIMA consultada refuerza individualización y monitorización.',
    sources: [
      cimaSource(
        'CIMA · Digoxina Teofarma 0,25 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/23850/FichaTecnica_23850.html',
      ),
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
      'Última opción aguda para control de frecuencia o alternativa de control del ritmo cuando no hay opciones más limpias o existe insuficiencia cardíaca moderada-grave.',
    dose:
      'En este contexto: IV 5-7 mg/kg de carga, con posibilidad de completar 1,2-1,8 g en 24 h; VO 200 mg cada 8 h 7 días, luego cada 12 h 7 días y después 200 mg/24 h 5 días/semana.',
    route: 'Oral / intravenosa',
    frequency: 'Carga aguda y mantenimiento posterior según respuesta.',
    duration: 'Solo uso agudo en control de frecuencia del libro; otras indicaciones dependen de cardiología.',
    contraindications: [
      'Bradicardia sinusal, trastorno grave de conducción o enfermedad del nodo sinusal sin marcapasos.',
      'Disfunción tiroidea.',
      'Precaución extrema con fármacos que prolongan QT o inducen torsade de pointes.',
    ],
    renalAdjustment:
      'La ficha CIMA oral consultada no establece un ajuste renal cuantificado; recomienda empezar con la dosis más baja razonable considerando la función renal y la comorbilidad.',
    hepaticAdjustment:
      'La ficha CIMA oral consultada no detalla un esquema numérico de ajuste hepático; obliga a prudencia clínica y vigilancia por su perfil de toxicidad.',
    practicalNotes: [
      'En la obra solo se usa como última opción en control de frecuencia agudo o como fármaco de ritmo en determinados escenarios.',
      'No mezclar antiarrítmicos de clase I y III en el mismo momento.',
    ],
    sourceScope:
      'La pauta detallada de FA procede del capítulo 23 del Murillo; la ficha CIMA oral consultada aporta contraindicaciones y recomendaciones generales de inicio.',
    sources: [
      cimaSource(
        'CIMA · Trangorex 200 mg comprimidos',
        'https://cima.aemps.es/cima/dochtml/ft/48048/FT_48048.html',
      ),
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
      'En el libro se incluye como anti-Xa de referencia para FA no valvular.',
      'Revisar el Cockcroft-Gault antes de decidir dosis si la función renal es dudosa.',
    ],
    sourceScope:
      'La indicación contextual procede del capítulo 23 del Murillo y la dosificación estructural principal de la ficha técnica CIMA.',
    sources: [
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
      'El libro lo sitúa entre los ACOD anti-IIa para FA no valvular.',
      'Si se pauta, documentar siempre aclaramiento de creatinina previo.',
    ],
    sourceScope:
      'La posología de FA está respaldada por la ficha CIMA; el uso contextual dentro del protocolo proviene del capítulo 23 del Murillo.',
    sources: [
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
      'El libro lo cita entre los anti-Xa disponibles para FA no valvular.',
      'En este módulo conviene apoyarse en Cockcroft-Gault antes de seleccionar dosis.',
    ],
    sourceScope:
      'La dosis principal procede de la ficha CIMA consultada; el encaje clínico dentro de FA viene del capítulo 23 del Murillo.',
    sources: [
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
      'En este módulo el libro lo incluye como anti-Xa para FA no valvular.',
    ],
    sourceScope:
      'La pauta base procede de CIMA y el uso contextual en FA de la bibliografía de Murillo.',
    sources: [
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
      'El libro orienta a INR 2,5-3,5 si FA con estenosis mitral moderada/grave o prótesis mecánica; INR 2-3 en otros contextos con AVK.',
    ],
    sourceScope:
      'La pauta de inicio específica del protocolo FA y los objetivos de INR proceden del Murillo; la individualización detallada por INR procede de la ficha CIMA.',
    sources: [
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
      'La ficha CIMA no lista FA como indicación literal; en este proyecto se usa como puente anticoagulante porque así aparece en el capítulo 23 del Murillo.',
      'Si se usa como puente con AVK, documentar claramente el plan de suspensión y el primer control de coagulación.',
    ],
    sourceScope:
      'El uso en FA es protocolario y procede del Murillo; la ficha CIMA aporta la base de seguridad, presentación y ajuste renal de la HBPM.',
    sources: [
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
      'La pauta contextual y las contraindicaciones principales proceden del capítulo 32 del Murillo.',
    sources: [
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
      'La pauta oral procede del capítulo de urgencia hipertensiva y la pauta intravenosa del capítulo de emergencia hipertensiva.',
    sources: [
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
      'La pauta de inicio y el papel contextual proceden del capítulo 32 del Murillo.',
    sources: [
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
      'La indicación y la pauta de perfusión proceden del capítulo 33 del Murillo.',
    sources: [
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
      'La pauta de perfusión y las advertencias clave proceden del capítulo 33 del Murillo.',
    sources: [
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
      'En este contexto: 150-300 mg VO masticados como dosis de carga si no lo ha tomado en las últimas 24 h; después 100-150 mg/24 h VO.',
    route: 'Oral',
    frequency: 'Carga única y después una toma diaria.',
    duration: 'Inicio inmediato y continuación según evolución hospitalaria y cardiología.',
    contraindications: [
      'Sangrado activo o riesgo hemorrágico no asumible.',
      'Hipersensibilidad conocida a salicilatos.',
      'Si ya recibió ácido acetilsalicílico en las últimas 24 h, revisar antes de repetir la carga.',
    ],
    renalAdjustment:
      'El capítulo no aporta un ajuste renal específico para la pauta inicial; la prioridad es valorar el riesgo hemorrágico y la función renal global.',
    hepaticAdjustment:
      'El capítulo no define un ajuste hepático específico para la carga inicial; si existe hepatopatía con riesgo hemorrágico, individualizar.',
    practicalNotes: [
      'Debe administrarse lo más precozmente posible ante un SCA.',
      'La carga se realiza con preparado sin recubrimiento entérico y masticado.',
    ],
    sourceScope:
      'La indicación y la pauta de carga y mantenimiento proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · antiagregación inicial en SCA',
        referenceEntry({
          id: 'aas-sca',
          verifiedPage: 223,
          pdfPage: 248,
          note: 'Ácido acetilsalicílico como tratamiento antiagregante inicial del SCA.',
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
      'Segundo antiagregante junto con ácido acetilsalicílico en SCACEST y en SCASEST de riesgo isquémico intermedio o alto.',
    dose:
      'En este contexto: 180 mg VO de carga y después 90 mg VO cada 12 h.',
    route: 'Oral',
    frequency: 'Carga única y después cada 12 h.',
    duration: 'Inicio agudo y continuación según estrategia invasiva y plan cardiológico.',
    contraindications: [
      'Contraindicado en pacientes sometidos a diálisis según el capítulo.',
      'Revisar el riesgo hemorrágico antes de asociarlo a ácido acetilsalicílico.',
      'No usarlo como sustituto aislado del tratamiento antitrombótico completo.',
    ],
    renalAdjustment:
      'El capítulo señala que no precisa ajuste de dosis en insuficiencia renal, pero lo contraindica en pacientes en diálisis.',
    hepaticAdjustment:
      'La obra base no detalla un ajuste hepático concreto en este contexto agudo; si existe hepatopatía significativa, individualizar.',
    practicalNotes: [
      'En SCASEST se prioriza cuando el riesgo isquémico es intermedio o alto.',
      'También está indicado en SCACEST asociado a ácido acetilsalicílico.',
    ],
    sourceScope:
      'La indicación, dosis de carga y mantenimiento proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · ticagrelor en SCA',
        referenceEntry({
          id: 'ticagrelor-sca',
          verifiedPage: 223,
          pdfPage: 248,
          note: 'Uso de ticagrelor asociado a ácido acetilsalicílico en el síndrome coronario agudo.',
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
      'Alternativa antiagregante asociada a ácido acetilsalicílico en SCASEST de menor riesgo o cuando no pueden utilizarse ticagrelor o prasugrel.',
    dose:
      'En este contexto: 300-600 mg VO de carga y después 75 mg/24 h VO.',
    route: 'Oral',
    frequency: 'Carga única y después una toma diaria.',
    duration: 'Inicio agudo y continuación según la estrategia de revascularización y el plan cardiológico.',
    contraindications: [
      'Sangrado activo clínicamente relevante.',
      'No es la opción preferente si puede usarse ticagrelor en SCASEST de riesgo intermedio o alto.',
      'No se recomienda asociarlo con omeprazol según el capítulo.',
    ],
    renalAdjustment:
      'La obra base no aporta un ajuste renal específico para la pauta aguda; vigilar riesgo hemorrágico y la estrategia de revascularización.',
    hepaticAdjustment:
      'El capítulo no define un ajuste hepático numérico en este contexto; si existe hepatopatía significativa, individualizar.',
    practicalNotes: [
      'Es la alternativa cuando no puedes usar ticagrelor o prasugrel.',
      'Puede utilizarse en SCACEST junto con ácido acetilsalicílico si así se decide antes de la ICP.',
    ],
    sourceScope:
      'La indicación y la pauta de carga y mantenimiento proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · clopidogrel en SCA',
        referenceEntry({
          id: 'clopidogrel-sca',
          verifiedPage: 223,
          pdfPage: 248,
          note: 'Clopidogrel como alternativa antiagregante inicial en síndrome coronario agudo.',
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
      'Anticoagulación inicial cuando se prevé una intervención coronaria percutánea urgente o precoz en SCACEST o SCASEST.',
    dose:
      'En este contexto: 100 UI/kg IV iniciales, con máximo de 5.000 UI.',
    route: 'Intravenosa',
    frequency: 'Bolo inicial según estrategia invasiva.',
    duration: 'Uso agudo al inicio del proceso y durante la estrategia invasiva.',
    contraindications: [
      'Sangrado activo o diátesis hemorrágica relevante.',
      'Antecedente o sospecha de trombocitopenia inducida por heparina.',
      'Revisar que realmente se prevea ICP urgente o precoz antes de elegirla.',
    ],
    renalAdjustment:
      'El capítulo no aporta un ajuste renal específico para la dosis inicial; controlar sangrado y la respuesta anticoagulante según evolución.',
    hepaticAdjustment:
      'La obra base no define un ajuste hepático cuantificado en este escenario agudo; individualizar si existe hepatopatía con coagulopatía.',
    practicalNotes: [
      'Es la opción descrita cuando vas a ICP primaria o precoz.',
      'Si no se prevé ICP inmediata en SCASEST, el capítulo dirige hacia fondaparinux o enoxaparina.',
    ],
    sourceScope:
      'La indicación y la dosis inicial proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · heparina sódica en SCA',
        referenceEntry({
          id: 'heparina-sca',
          verifiedPage: 223,
          pdfPage: 248,
          note: 'Heparina sódica como anticoagulación inicial cuando se prevé estrategia invasiva.',
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
      'Anticoagulación en SCASEST cuando no se prevé una intervención coronaria percutánea primaria inmediata.',
    dose:
      'En este contexto: 30 mg IV iniciales y, a los 15 min, 1 mg/kg SC; después 1 mg/kg/12 h. Si la persona es mayor de 75 años, omitir el bolo inicial y usar 0,75 mg/kg/12 h. Si el aclaramiento de creatinina es < 30 mL/min, 1 mg/kg/24 h.',
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
      'La obra base no define un ajuste hepático concreto; si existe hepatopatía con riesgo hemorrágico, individualizar y vigilar.',
    practicalNotes: [
      'El libro la reserva para SCASEST cuando no se prevé ICP primaria inmediata.',
      'En personas mayores de 75 años se omite el bolo inicial intravenoso.',
    ],
    sourceScope:
      'La indicación, la pauta completa y las contraindicaciones proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · enoxaparina en SCASEST',
        referenceEntry({
          id: 'enoxaparina-sca',
          verifiedPage: 224,
          pdfPage: 249,
          note: 'Pauta de enoxaparina y ajustes por edad y función renal en SCASEST.',
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
      'Tratamiento antiisquémico y analgésico inicial de elección cuando el paciente con SCA presenta dolor torácico en el momento de la valoración.',
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
      'El capítulo no describe un ajuste renal específico; la titulación se guía por la respuesta hemodinámica.',
    hepaticAdjustment:
      'La obra base no define un ajuste hepático específico en la fase aguda; vigilar tolerancia y presión arterial.',
    practicalNotes: [
      'Es el analgésico antiisquémico inicial de elección si hay dolor de probable origen coronario.',
      'No sustituye a la analgesia opioide si el dolor persiste.',
    ],
    sourceScope:
      'Las pautas sublingual e intravenosa y sus contraindicaciones proceden del capítulo 26 del Murillo.',
    sources: [
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
      'Analgesia cuando ha fracasado la nitroglicerina sublingual para controlar el dolor, sobre todo en angina inestable, IAM anterior o simpaticotonía.',
    dose:
      'En este contexto: 2 mg/min IV hasta control del dolor o 10 mg totales. Si a los 10 min continúa el dolor, puede repetirse la dosis. Si hace falta, perfusión continua a 40 microg/min.',
    route: 'Intravenosa',
    frequency: 'Bolos titulados y, si hace falta, perfusión continua.',
    duration: 'Uso agudo mientras persista dolor isquémico no controlado.',
    contraindications: [
      'En IAM inferior o inferoposterior, vagotonía o bloqueo AV debe usarse con precaución y asociar atropina o valorar meperidina.',
      'Precaución si existe depresión respiratoria o deterioro hemodinámico.',
      'No sustituye al tratamiento de reperfusión ni al antitrombótico.',
    ],
    renalAdjustment:
      'El capítulo no fija un ajuste renal específico para esta pauta aguda; si la función renal está muy comprometida, vigilar acumulación y depresión respiratoria.',
    hepaticAdjustment:
      'La obra base no establece un ajuste hepático numérico; si existe hepatopatía avanzada, extremar la vigilancia clínica.',
    practicalNotes: [
      'Se emplea cuando la nitroglicerina no controla el dolor.',
      'En IAM inferior o con vagotonía el propio capítulo aconseja precaución y valorar alternativas.',
    ],
    sourceScope:
      'La indicación y la pauta intravenosa proceden del capítulo 26 del Murillo.',
    sources: [
      protocolSource(
        'Murillo 7.ª ed. · morfina en SCA',
        referenceEntry({
          id: 'morfina-sca',
          verifiedPage: 221,
          pdfPage: 246,
          note: 'Pauta de morfina intravenosa para el control del dolor coronario.',
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
    items: ['acido-acetilsalicilico', 'ticagrelor', 'clopidogrel', 'heparina-sodica', 'enoxaparina-sca'],
  },
];

export const getMedication = (medicationId) => medicationCatalog[medicationId] ?? medicationList[0];
