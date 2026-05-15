/**
 * Continuación: Endocrinología, ORL, Oftalmología, Ginecología, Pediatría, Toxicología, Dermatología
 */

const createProtocol = (protocol) => ({
  id: protocol.id,
  title: protocol.title,
  category: protocol.category,
  specialty: protocol.specialty,
  definition: protocol.definition,
  diagnosticOrders: protocol.diagnosticOrders,
  expectedFindings: protocol.expectedFindings,
  treatment: protocol.treatment,
  followUp: protocol.followUp,
  redFlags: protocol.redFlags,
  notes: protocol.notes,
});

// ENDOCRINOLOGÍA
const endocrinologyProtocols = {
  'cetoacidosis-diabetica': createProtocol({
    id: 'cetoacidosis-diabetica',
    title: 'Cetoacidosis diabética',
    category: 'Emergencia',
    specialty: 'Endocrinología',
    definition: 'Descompensación severa diabetes tipo 1: hiperglucemia, cetosis, acidosis metabólica.',
    diagnosticOrders: [
      'Glucosa, cetonas sérica/orina (β-hidroxibutirato preferido)',
      'Arterial gas: pH, HCO3, anión gap',
      'Electrolitos: K+, Na, Cl',
      'Creatinina, BUN, osmolaridad',
      'Amilasa, lipasa (descartar pancreatitis)',
      'Lactato si shock',
    ],
    expectedFindings: [
      'Glucosa >250, habitualmente >600',
      'pH <7.35, HCO3 <18, anión gap >12',
      'Cetonas detectables en sangre/orina',
      'Osmolaridad calculada <320 (si >320 HHS)',
      'Aliento cetónico (frutal)',
      'Respiración Kussmaul (profunda, rápida)',
    ],
    treatment: [
      'Fluidos: NS 15-20ml/kg primera hora, luego 5-10ml/kg/h',
      'Insulina: 0.1 UI/kg bolo IV, luego 0.1 UI/kg/h',
      'NO reducir glucosa >100mg/dL/h (edema cerebral)',
      'Reposición K+ agresiva: iniciar cuando K+ <5.5',
      'Monitor ECG continuo por hiperpotasemia',
      'Trata precipitante: infección, omisión insulina',
    ],
    followUp: [
      'UCI mínimo 24h',
      'Educación insulina y manejo enfermedad',
      'Endocrinólogo seguimiento',
    ],
    redFlags: ['pH <7.0', 'Edema cerebral', 'Arritmias por K+', 'Shock', 'Insuficiencia respiratoria'],
    notes: 'Mortalidad 5-15%. Complicación edema cerebral 1%, mortalidad 40% si presente. Hipopotasemia verdadera oculta por pH alto.',
  }),

  'complicaciones-agudas-diabetes': createProtocol({
    id: 'complicaciones-agudas-diabetes',
    title: 'Otras complicaciones agudas de la diabetes',
    category: 'Urgencia',
    specialty: 'Endocrinología',
    definition: 'HHS, hipoglucemia severa, lactoacidosis. Descompensaciones sin cetosis.',
    diagnosticOrders: [
      'Glucosa, osmolaridad, cetonas',
      'Arterial gas, lactato',
      'Electrolitos, creatinina',
      'Análisis orina',
    ],
    expectedFindings: [
      'HHS: glucosa >600, osmolaridad >320, sin cetosis',
      'Hipoglucemia: <70mg/dL, síntomas autonomía/neuroglicopenia',
      'Lactoacidosis: lactato >5, pH <7.35',
    ],
    treatment: [
      'HHS: rehidratación lenta (mayor deshidratación que CAD), insulina cautela',
      'Hipoglucemia: dextrosa 15-20g oral si alerta, IV 25g D50 si inconsciencia',
      'Glucagón 1mg IM/SC si no IV disponible',
      'Lactoacidosis: corregir hipoperfusión, bicarb controversial',
    ],
    followUp: [
      'Monitorización UCI de pauta según severidad',
      'Endocrinólogo urgente',
    ],
    redFlags: ['Coma', 'Arritmias', 'Shock', 'Encefalopatía'],
    notes: 'Hipoglucemia en diabetes tipo 1 common, muerte súbita posible. HHS mortalidad 10-50% (mayor que CAD).',
  }),

  'urgencias-tiroideas': createProtocol({
    id: 'urgencias-tiroideas',
    title: 'Urgencias tiroideas',
    category: 'Emergencia',
    specialty: 'Endocrinología',
    definition: 'Crisis tirotóxica y mixedema. Tormenta tiroidea vs. coma mixedematoso.',
    diagnosticOrders: [
      'TSH, T3, T4 libre',
      'ECG: taquicardia, FA',
      'Laboratorio: electrolitos, glucosa, cortisol',
      'Gasometría si severo',
    ],
    expectedFindings: [
      'Crisis tirotóxica: fiebre >39, taquicardia >140, insuficiencia cardíaca, confusión',
      'Coma mixedematoso: hipotermia, bradicardia, hipotensión, coma',
    ],
    treatment: [
      'Crisis tirotóxica: propranolol 20-40mg/6h IV',
      'PTU 150-200mg/6h VO/NG o Metimazol 10-20mg/6h',
      'Lugol 8-10 gotas/8h (después de PTU/metimazol)',
      'Corticoides: prednisona 40-60mg/día',
      'Coma mixedematoso: Levotiroxina 300-500µg IV iniciales, luego 50-100µg/24h',
      'Calentamiento pasivo (NO activo)',
      'Soporte inotrópico si hipotensión',
    ],
    followUp: [
      'UCI, monitorización cardíaca continua',
      'Endocrinología urgente',
      'Tiroidectomía después normalización crisis',
    ],
    redFlags: ['Fibrilación auricular', 'Insuficiencia cardíaca', 'Choque', 'Coma', 'Hipotermia <32°C'],
    notes: 'Crisis tirotóxica mortalidad 10% even con tx. Coma mixedematoso 30-60% mortalidad.',
  }),
};

// ORL
const orlProtocols = {
  'absceso-periamigdalino': createProtocol({
    id: 'absceso-periamigdalino',
    title: 'Absceso periamigdalino',
    category: 'Urgencia',
    specialty: 'ORL',
    definition: 'Infección tejido periamigdalino, colección purulenta. Complicación amigdalitis.',
    diagnosticOrders: [
      'Inspección orofaríngea',
      'TC cuello si sospecha complicación mediastinal',
      'Laboratorio: BH, cultivo si drenaje',
    ],
    expectedFindings: [
      'Disfagia progresiva, odinofagia severa',
      'Disfonía, trismo, respiración ruidosa',
      'Desviación úvula, amígdala desplazada',
      'Fiebre, adenopatía cervical',
    ],
    treatment: [
      'Antibióticos: Amoxicilina-clavulánico 1g/8h IV',
      'O Ceftriaxona 1g/12h IV',
      'Analgesia, antipiréticos',
      'Drenaje con aguja/incisión si fluctuante',
      'Dexametasona 4-8mg si epiglotitis sospecha',
    ],
    followUp: [
      'ORL para drenaje si no responde 48h',
      'Amigdalectomía después resolución si recurrente',
    ],
    redFlags: ['Vía aérea comprometida', 'Trismo severo', 'Mediastinitis', 'Sepsis'],
    notes: 'Complicación amigdalitis 1-2%. Requiere drenaje si no responde antibióticos en 48-72h.',
  }),

  'otitis': createProtocol({
    id: 'otitis',
    title: 'Otitis',
    category: 'Urgencia',
    specialty: 'ORL',
    definition: 'Inflamación conducto auditivo externo o medio. Bacteriana, viral o fúngica.',
    diagnosticOrders: [
      'Otoscopia: membrana timpánica, cerumen, pus',
      'Cultivo si pus o riesgo pseudomona',
      'Audiometría si pérdida audición sospecha',
    ],
    expectedFindings: [
      'Otitis externa: prurito, otalgia, edema CAE',
      'Otitis media: otalgia, fiebre, hipoacusia, reflejo luminoso borroso',
      'Posible otorrea si membrana perforada',
    ],
    treatment: [
      'Otitis externa: gotas otológicas (fluoroquinolona)',
      'Limpieza cerumen, analgesia',
      'Antibiótico sistémico si severo o inmunosuprimido',
      'Otitis media: antibióticos (amoxicilina-clavulánico)',
      'Descongestivos nasales si eustaquiano obstruido',
      'Analgesia',
    ],
    followUp: [
      'Control 3-4 días si severo',
      'ORL si no mejora o complicación',
    ],
    redFlags: ['Parálisis facial', 'Vértigo', 'Fístula laberinto', 'Mastoiditis', 'Meningitis'],
    notes: 'Otitis externa común en nadadores. Otitis media frecuente en niños. Pseudomona (diabéticos, anciano).',
  }),
};

// OFTALMOLOGÍA
const ophthalmologyProtocols = {
  'traumatismo-ocular': createProtocol({
    id: 'traumatismo-ocular',
    title: 'Traumatismo ocular',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Trauma ojo: contusión, laceración, quemadura. Riesgo pérdida visión.',
    diagnosticOrders: [
      'Agudeza visual (ambos ojos)',
      'Biomicroscopía: córnea, iris, lente',
      'Tonometría: presión intraocular',
      'Fondo de ojo: retina, vítreo, nervio óptico',
      'TC órbita si sospecha fractura',
    ],
    expectedFindings: [
      'Dolor, enrojecimiento, blefaroedema',
      'Equimosis periocular',
      'Hifema (sangre cámara anterior)',
      'Iridodialisis, dislocación lente',
    ],
    treatment: [
      'Cicloplegia: Ciclopentolato 1% colirio',
      'Analgesia sistémica',
      'Antibióticos: Gentamicina + Cefazolina colirio',
      'Parche + escudo protector',
      'Elevación cabecera',
      'Cirugía urgente si laceración penetrante',
    ],
    followUp: [
      'Oftalmólogo urgente mismo día',
      'Control inflamación y PIO',
    ],
    redFlags: ['Visión blanca', 'Hifema masivo', 'Ruptura escleral', 'Desprendimiento retina', 'Pérdida visión'],
    notes: 'Evitar presión ojo. Cicloplegia reduce dolor acomodación. Hifema: riesgo glaucoma secundario.',
  }),

  'cuerpo-extrano-ocular': createProtocol({
    id: 'cuerpo-extrano-ocular',
    title: 'Cuerpo extraño ocular',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Partícula superficial o penetrante en ojo. Riesgo infección, cicatrización.',
    diagnosticOrders: [
      'Agudeza visual',
      'Biomicroscopía con lente de aumento',
      'Tinción fluoresceína: identifica localización',
      'TC órbita si penetrante sospecha',
    ],
    expectedFindings: [
      'Sensación cuerpo extraño, lagrimeo, blefaroespasmo',
      'Ojo rojo, punto visible en córnea/conjuntiva',
      'Erosión corneal al lado del cuerpo extraño',
    ],
    treatment: [
      'Anestesia tópica: proparacaína 0.5%',
      'Riego con solución salina',
      'Extracción cuidadosa (algodón, aguja romo)',
      'Antibióticos colirio: Gentamicina o fluoroquinolona',
      'Tetánica si herida contaminada',
    ],
    followUp: [
      'Control 24h por infección',
      'Córnea débil primeros 24h',
    ],
    redFlags: ['Cuerpo extraño penetrante', 'Oxidación (metal)', 'Detritus', 'Pérdida visión'],
    notes: 'Fluorescencia identifica erosión. Riesgo herrumbre en 24-48h si metal.',
  }),

  'glaucoma-agudo': createProtocol({
    id: 'glaucoma-agudo',
    title: 'Glaucoma agudo',
    category: 'Emergencia',
    specialty: 'Oftalmología',
    definition: 'Obstrucción ángulo iridocorneal, PIO >40 mmHg, dolor severo, visión borrosa.',
    diagnosticOrders: [
      'Tonometría: PIO >30-40 mmHg',
      'Gonioscopia: visualiza ángulo',
      'Biomicroscopía: córnea edematosa, iris arqueado',
      'Campimetría si crónico',
    ],
    expectedFindings: [
      'Dolor ojo severo, dolor cabeza, náuseas/vómitos',
      'Visión borrosa, halos luz',
      'Ojo rojo, córnea nublada (edematosa)',
      'Pupila media, no reactiva',
      'Cámara anterior poca profundidad',
    ],
    treatment: [
      'Pilocarpina 1% colirio cada 15min primera hora',
      'Timolol 0.5% colirio cada 12h',
      'Dorzolamida 2% colirio cada 8h',
      'Acetazolamida 500mg VO/IV',
      'Osmóticos: Manitol 1g/kg IV si no mejora',
      'Laser iridotomía definitivo (Oftalmología)',
    ],
    followUp: [
      'Oftalmólogo urgente',
      'Iridotomía emergencia',
    ],
    redFlags: ['PIO >50', 'Pérdida visión progresiva', 'Córnea no clara', 'Isquemia iris'],
    notes: 'Emergencia oftalmológica. PIO >60 riesgo ceguera en horas. Iridotomía láser cura.',
  }),

  'uveitis-anterior': createProtocol({
    id: 'uveitis-anterior',
    title: 'Uveítis anterior',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Inflamación iris y cuerpo ciliar. Dolor fotofobia, visión borrosa.',
    diagnosticOrders: [
      'Biomicroscopía: células en cámara anterior',
      'Tonometría: puede estar elevada',
      'Fondo de ojo: papila, mácula',
      'Laboratorio: VIH, TB, sífilis si etiología desconocida',
    ],
    expectedFindings: [
      'Dolor ojo, fotofobia, lagrimeo',
      'Visión borrosa',
      'Ojo rojo periquerático',
      'Células en cámara anterior, sinequias si crónica',
      'Precipitados endoteliales',
    ],
    treatment: [
      'Corticoides tópicos: Dexametasona cada 1-2h inicialmente',
      'Cicloplegia: Ciclopentolato 1% cada 8h',
      'AINE: Indometacina 50mg/8h VO',
      'Tratar etiología: TB, sífilis, HLA-B27',
      'Esteroides sistémicos si severa o bilateral',
    ],
    followUp: [
      'Oftalmólogo urgente',
      'Seguimiento semanal inicialmente',
      'Vigilancia complicaciones',
    ],
    redFlags: ['Glaucoma secundario', 'Cataratas', 'Sinequias posteriores', 'Banda queratitis'],
    notes: 'Causa: idiopática 25%, HLA-B27 30%, infecciones 20%, inflamatorio 25%.',
  }),

  'ulcera-corneal': createProtocol({
    id: 'ulcera-corneal',
    title: 'Úlcera corneal',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Pérdida epitelio corneal, posible infección bacteriana. Riesgo perforación.',
    diagnosticOrders: [
      'Tinción fluoresceína: identifica defecto',
      'Cultivo si sospecha infección',
      'Biomicroscopía: profundidad, infiltrado',
    ],
    expectedFindings: [
      'Dolor, fotofobia, lagrimeo',
      'Ojo rojo, visión borrosa',
      'Defecto fluoresceína, infiltrado amarillento si infección',
    ],
    treatment: [
      'Fluoroquinolona tópica: Ciprofloxacino cada 1-2h',
      'O Gatifloxacino cada 2h',
      'Cicloplegia: Ciclopentolato 1%',
      'AINE sistémico',
      'Parche blando si epitelial simple',
      'Antibióticos sistémicos si severa o pseudomona sospecha',
    ],
    followUp: [
      'Oftalmólogo urgente',
      'Control diario primeros días',
      'Descontinuar fluoroquinolona cuando epitelizado',
    ],
    redFlags: ['Úlcera central', 'Infiltrado rápido', 'Anterior 1/3 espesor', 'Perforación sospecha'],
    notes: 'Lentes de contacto aumentan riesgo. Pseudomona: progresión rápida. Riesgo ceguera.',
  }),

  'desprendimiento-retina': createProtocol({
    id: 'desprendimiento-retina',
    title: 'Desprendimiento de retina',
    category: 'Emergencia',
    specialty: 'Oftalmología',
    definition: 'Separación retina de epitelio pigmentario. Riesgo ceguera si mácula afectada.',
    diagnosticOrders: [
      'Agudeza visual',
      'Oftalmoscopia: identifica retina desprendida',
      'Ecografía B si vista opacificada',
    ],
    expectedFindings: [
      'Fotopsias (destellos), moscas volantes agudas',
      'Escotoma periférico que progresa',
      'Visión borrosa si mácula comprometida',
      'Retina griseácea, plegada en oftalmoscopia',
    ],
    treatment: [
      'Reposo completo (no movimientos oculares)',
      'Posicionamiento: mantener mácula aplicada',
      'Derivación urgente Oftalmología (MISMA HORA)',
      'Cirugía emergencia: cerclaje escleral o vitrectomía',
    ],
    followUp: [
      'Oftalmólogo urgente',
      'Cirugía emergencia',
    ],
    redFlags: ['Mácula desprendida', 'Progresión rápida', 'Hemorragia vítrea', 'Desprendimiento total'],
    notes: 'Urgencia oftalmológica. Mácula-off: 50% recuperación. Mácula-on: 90% recuperación visual.',
  }),

  'disminucion-agudeza-visual': createProtocol({
    id: 'disminucion-agudeza-visual',
    title: 'Disminución de la agudeza visual',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Pérdida visión aguda unilateral o bilateral. Múltiples etiologías.',
    diagnosticOrders: [
      'Agudeza visual, campos visuales',
      'Biomicroscopía anterior y posterior',
      'Tonometría',
      'Doppler carótida si AVC sospecha',
      'TC/RM si neurológico',
    ],
    expectedFindings: [
      'Varía según etiología',
      'Amaurosis fugaz: pérdida visión transitoria',
      'Oclusión arteria central retina: pérdida súbita',
      'Oclusión vena central: hemorragias retinales',
      'Opacificación medios: catarata, vítreo',
    ],
    treatment: [
      'Depende etiología: vasodilatadores, antiagregantes, cirugía',
      'Oclusión arterial: trombolisis, masaje ocular',
      'Oclusión venosa: corticoides sistémicos',
      'Catarata: cirugía programada',
    ],
    followUp: [
      'Oftalmólogo urgente si aguda',
      'Prevención secundaria según causa',
    ],
    redFlags: ['Pérdida súbita completa', 'Defectos campo grandes', 'Neuritis óptica', 'AVC retiniano'],
    notes: 'Amaurosis fugaz predictor AVC 25% en 5 años. Requiere evaluación vascular completa.',
  }),

  'dacriocistitis-aguda': createProtocol({
    id: 'dacriocistitis-aguda',
    title: 'Dacriocistitis aguda',
    category: 'Urgencia',
    specialty: 'Oftalmología',
    definition: 'Inflamación saco lagrimal. Infección, obstrucción conducto nasolagrimal.',
    diagnosticOrders: [
      'Inspección región medial ojo',
      'Cultivo si pus expresado',
    ],
    expectedFindings: [
      'Edema, eritema región medial ojo',
      'Dolor a presión, pus',
      'Lagrimeo, epífora',
    ],
    treatment: [
      'Antibióticos sistémicos: Amoxicilina-clavulánico',
      'Compresas calientes',
      'Masaje región lagrimal',
      'Gotas antibióticas si conjuntivitis',
      'Drenaje/incisión si absceso',
    ],
    followUp: [
      'Oftalmología para sondaje si recurrente',
      'Dacriocistorrinostomía si obstrucción crónica',
    ],
    redFlags: ['Absceso', 'Celulitis orbitaria', 'Flegmón', 'Sepsis'],
    notes: 'Más frecuente en lactantes. Adultos: buscar obstrucción crónica.',
  }),

  'blefaritis': createProtocol({
    id: 'blefaritis',
    title: 'Blefaritis',
    category: 'Control',
    specialty: 'Oftalmología',
    definition: 'Inflamación párpados. Anterior (margen) o posterior (glándulas de Meibomio).',
    diagnosticOrders: [
      'Inspección párpados',
      'Cultivo si sospecha bacterial',
    ],
    expectedFindings: [
      'Enrojecimiento, edema párpado',
      'Costras, escamación (anterior)',
      'Disfunción meibomio (posterior)',
      'Irritación, picazón, película lagrimal deficiente',
    ],
    treatment: [
      'Higiene párpado: compresas calientes',
      'Limpieza con agua tibia y jabón suave',
      'Ungüento: bacitracina/neomicina si anterior',
      'Doxiciclina baja dosis 50mg/12h si posterior',
      'Lágrimas artificiales',
    ],
    followUp: [
      'Medidas higiénicas crónicas',
      'Seguimiento si no mejora',
    ],
    redFlags: ['Úlcera corneal', 'Infección severa'],
    notes: 'Crónica frecuentemente. Anterior: bacteriana (Staph). Posterior: meibomianitis.',
  }),

  'orzuelo': createProtocol({
    id: 'orzuelo',
    title: 'Orzuelo',
    category: 'Control',
    specialty: 'Oftalmología',
    definition: 'Infección glándula palpebral (Zeis/Moll). Nódulo inflamado párpado.',
    diagnosticOrders: [
      'Inspección: nódulo localizado inflamado',
    ],
    expectedFindings: [
      'Nódulo pequeño en borde párpado',
      'Dolor, inflamación local',
      'Puede drenar espontáneamente',
    ],
    treatment: [
      'Compresas calientes',
      'Incisión y drenaje si flucuante',
      'Antibióticos tópicos',
      'Antibióticos sistémicos si severo',
    ],
    followUp: [
      'Resuelve espontáneamente 1-2 semanas',
      'Antibióticos si infección secundaria',
    ],
    redFlags: ['Celulitis periocular', 'Recurrente (buscar obstrucción)'],
    notes: 'Muy frecuente. Mayoría resuelven sin intervención.',
  }),

  'chalazion': createProtocol({
    id: 'chalazion',
    title: 'Chalazión',
    category: 'Control',
    specialty: 'Oftalmología',
    definition: 'Quiste meibomio no inflamatorio. Nódulo indoloro, crónico.',
    diagnosticOrders: [
      'Inspección párpado',
    ],
    expectedFindings: [
      'Nódulo indoloro párpado',
      'Sin inflamación activa',
      'Puede verse internamente en conjuntiva',
    ],
    treatment: [
      'Compresas calientes',
      'Masaje párpado',
      'Corticoides tópicos 0.1% si inflamación leve',
      'Inyección esteroide intralesional (triamcinolona)',
      'Incisión y curetaje si persistente',
    ],
    followUp: [
      'Mayoría resuelven en 6-8 semanas',
      'Seguimiento si recurrente',
    ],
    redFlags: ['Recurrente en mismo sitio (buscar carcinoma)', 'Deformación párpado'],
    notes: 'Diferencia: orzuelo = infeccioso, chalazión = no infeccioso. Chalazión común en rosácea.',
  }),

  'epiescleritis': createProtocol({
    id: 'epiescleritis',
    title: 'Epiescleritis',
    category: 'Control',
    specialty: 'Oftalmología',
    definition: 'Inflamación episclera. Nódulo rojo, dolor mínimo, benigno.',
    diagnosticOrders: [
      'Biomicroscopía: inyección episcleral nodular',
      'Laboratorio si sospecha sistémica',
    ],
    expectedFindings: [
      'Punto rojo nodular',
      'Dolor mínimo o molestia leve',
      'Blanquecimiento con epinefrina',
      'Lagrimeo, fotofobia leve',
    ],
    treatment: [
      'Corticoides tópicos: Dexametasona 0.1% cada 6-8h',
      'AINE sistémico si dolor',
      'Resuelve sin secuelas',
    ],
    followUp: [
      'Generalmente resuelve en 1-2 semanas',
      'Benigno, no recurrente típicamente',
    ],
    redFlags: ['Recurrente (buscar sistémica)', 'Afectación visual'],
    notes: 'Benigno, no afecta visión. Diferencia uveítis: episclera superficial vs. iris profundo.',
  }),

  'hiposfagma': createProtocol({
    id: 'hiposfagma',
    title: 'Hiposfagma',
    category: 'Control',
    specialty: 'Oftalmología',
    definition: 'Hemorragia subconjuntival. Rojo brillante, benigno.',
    diagnosticOrders: [
      'Inspección: área roja subconjuntival',
      'Presión oftálmica si sospecha glaucoma agudo',
    ],
    expectedFindings: [
      'Área roja o rojo-púrpura entre conjuntiva y esclera',
      'Visión normal',
      'Dolor mínimo',
    ],
    treatment: [
      'Observación, resuelve espontáneamente 2-6 semanas',
      'Compresas frías primeras 48h',
      'Gotas lubricantes',
      'No hay tratamiento específico',
    ],
    followUp: [
      'Sin seguimiento si espontáneo',
      'Investigar si traumático o anticoagulación',
    ],
    redFlags: ['Traumatismo penetrante', 'Complicaciones oculares', 'Glaucoma agudo'],
    notes: 'Benigno, mayor preocupación estética. Resuelve sin secuelas.',
  }),
};

// GINECOLOGÍA / ETS
const gynecologyProtocols = {
  'sangrado-primer-trimestre': createProtocol({
    id: 'sangrado-primer-trimestre',
    title: 'Sangrado del primer trimestre del embarazo',
    category: 'Urgencia',
    specialty: 'Ginecología',
    definition: 'Sangrado vaginal <13 semanas. Riesgo: aborto, ectópico, mola hidatiforme.',
    diagnosticOrders: [
      'β-hCG cuantitativa seriada (duplica cada 48-72h en normal)',
      'Ecografía transvaginal: viabilidad embrionaria, localización',
      'Hemoglobina, grupo y screen',
      'RhD si negativo, considerar inmunoglobulina',
    ],
    expectedFindings: [
      'Aborto espontáneo: hCG bajando, sin saco gestacional',
      'Embarazo viable: latido >100 bpm, saco >20mm',
      'Ectópico: hCG elevada, útero vacío, masa anexial',
      'Mola: hCG muy elevada, útero grande, aspecto "nieve"',
    ],
    treatment: [
      'Aborto completo: expectante, observación',
      'Aborto incompleto: legrado instrumental o médico (misoprostol)',
      'Ectópico: metotrexato si hCG <5000, cirugía si >5000',
      'Mola: legrado suction, seguimiento hCG mensual 6-12 meses',
    ],
    followUp: [
      'Ginecología para manejo específico',
      'Seguimiento hCG hasta normalización',
      'Consejo anticonceptivo',
    ],
    redFlags: ['Shock hemorrágico', 'Peritonitis (ectópico rupturado)', 'Infección'],
    notes: 'Aborto espontáneo 15-20% embarazos clínicos. Ectópico 1-2%, mortalidad 0.1%.',
  }),

  'infeccion-vaginal-aguda': createProtocol({
    id: 'infeccion-vaginal-aguda',
    title: 'Infección vaginal aguda',
    category: 'Urgencia',
    specialty: 'Ginecología',
    definition: 'Vaginitis por Candida, Trichomonas, bacteria. Flujo vaginal anormal, prurito.',
    diagnosticOrders: [
      'Especuloscopía: aspecto flujo',
      'Fresco en solución salina: móvil Trichomonas',
      'KOH: levaduras, pseudohifas',
      'Cultivo si sospecha crónica',
      'PCR/cultivo STI si sospecha',
    ],
    expectedFindings: [
      'Candida: flujo blanco espeso, vulvitis, prurito',
      'Trichomonas: flujo verde espumoso, olor, dispareunia',
      'Bacteriana: flujo gris, olor a pescado, pH >4.5',
    ],
    treatment: [
      'Candida: fluconazol 150mg VO dosis única',
      'O nistatina tópica 100.000 UI/día 7 días',
      'Trichomonas: metronidazol 2g VO dosis única',
      'O secnidazol 2g VO dosis única',
      'Bacteriana: metronidazol 500mg/12h 7 días',
      'O clindamicina 2% tópica 7 días',
    ],
    followUp: [
      'Pareja si tricomoniasis',
      'Investigar STI',
      'Revisión 1 semana si no responde',
    ],
    redFlags: ['Signos sistémicos (fiebre, dolor pélvico)', 'Sospecha PID', 'Embarazo'],
    notes: 'Candida no STI. Tricomoniasis y bacterial aumentan riesgo PID. Sobretratamiento Candida frecuente.',
  }),

  'sifilis': createProtocol({
    id: 'sifilis',
    title: 'Sífilis',
    category: 'Urgencia',
    specialty: 'Ginecología',
    definition: 'Infección Treponema pallidum. Sífilis primaria, secundaria, latente o terciaria.',
    diagnosticOrders: [
      'RPR/VDRL: cuantitativo',
      'FTA-ABS: confirmatorio',
      'TP/sérica',
      'RPR sérica en embarazo',
      'Lumbar punciones si neurosífilis sospecha',
    ],
    expectedFindings: [
      'Primaria: chancro indoloro indurado',
      'Secundaria: rash, linfadenopatía, síntomas sistémicos',
      'Latente: serología positiva, asintomática',
      'Terciaria: gomas, cardiovascular, neurosífilis',
    ],
    treatment: [
      'Primaria/secundaria: Penicilina G 2.4 millones IM dosis única',
      'O Doxiciclina 100mg/12h 14-28 días si alérgico',
      'Neurosífilis: Penicilina G 18-24 millones/día IV 10-14 días',
      'Embarazo: solo penicilina, sin alternativas',
    ],
    followUp: [
      'Pareja contacto trazado',
      'Reportar autoridades salud pública',
      'Seguimiento VDRL 3,6,12 meses',
      'VIH si no hace',
    ],
    redFlags: ['Neurosífilis', 'Sífilis cardiovascular', 'Embarazo', 'Complicación'],
    notes: 'Treatable si temprana. Penicilina gold standard 75 años. Incidencia resurge.',
  }),

  'infecciones-agudas-ets': createProtocol({
    id: 'infecciones-agudas-ets',
    title: 'Infecciones agudas de transmisión sexual',
    category: 'Urgencia',
    specialty: 'Ginecología',
    definition: 'Gonorrea, clamydia, micoplasma. Cervicitis, uretritis, proctitis.',
    diagnosticOrders: [
      'NAAT (PCR) endocervical/uretra: gold standard',
      'Cultivo si resistencia sospecha',
      'Prueba sífilis, VIH, hepatitis',
    ],
    expectedFindings: [
      'Gonorrea: flujo purulento amarillo, disuria',
      'Clamydia: síntomas similares, mayor itinerancia',
      'Puede ser asintomática 50%',
    ],
    treatment: [
      'Gonorrea: Ceftriaxona 500mg IM dosis única',
      'Clamydia: Doxiciclina 100mg/12h 7 días',
      'O Azitromicina 1g VO dosis única',
      'Tratar pareja simultáneamente',
      'Test cura 1-2 semanas post-tx',
    ],
    followUp: [
      'Pareja trazado y tratamiento',
      'Educación prevención',
      'Seguimiento NAAT post-tratamiento',
    ],
    redFlags: ['Embarazo', 'PID', 'Conjuntivitis neonatal', 'Diseminada'],
    notes: 'Resistencia antibiótica emergente. NAAT preferido. Coinfección 10-30%.',
  }),
};

// PEDIATRÍA
const pediatricsProtocols = {
  'bronquiolitis': createProtocol({
    id: 'bronquiolitis',
    title: 'Bronquiolitis',
    category: 'Urgencia',
    specialty: 'Pediatría',
    definition: 'Infección VRS en lactantes <2 años. Inflamación bronquiolos, hipoxemia.',
    diagnosticOrders: [
      'Pulsioximetría',
      'RX tórax: hiperinsuflación, atelectasias',
      'Nasofaríngea VRS si confirmación',
      'Gasometría si severo',
    ],
    expectedFindings: [
      'Fiebre leve, tos, sibilancias',
      'Taquipnea, trabajo respiratorio aumentado',
      'Hipoxemia <90% si severo',
      'Hiperinsuflación radiológica',
    ],
    treatment: [
      'Oxígeno: mantener SatO2 >90%',
      'Fluidos IV si deshidratación',
      'Soporte respiratorio no invasivo (CPAP) si severo',
      'Ribavina si inmunodeprimido severo',
      'Broncodilatadores (salbutamol) si respuesta',
      'Corticoides controvertido: solo si sibilancias',
    ],
    followUp: [
      'Hospitalización según severidad',
      'Alta cuando SatO2 >90% sin oxígeno',
    ],
    redFlags: ['SatO2 <90%', 'Apnea', 'Exhausto', 'Insuficiencia respiratoria', 'Prematuro'],
    notes: 'Infección común <2 años. Mayoría manejable ambulatorio. VRS desencadenante.',
  }),

  'laringo-traqueitis': createProtocol({
    id: 'laringo-traqueitis',
    title: 'Laringotraqueítis (tos perruna)',
    category: 'Urgencia',
    specialty: 'Pediatría',
    definition: 'Parainfluenza, garganta inflamada. Tos perruna, estridor, ronquera.',
    diagnosticOrders: [
      'Diagnóstico clínico',
      'RX cuello si sospecha epiglotitis (descartar)',
      'Pulsioximetría si severo',
    ],
    expectedFindings: [
      'Tos perruna característica',
      'Estridor inspiratorio',
      'Ronquera, disfonía',
      'Síntomas nocturnos',
    ],
    treatment: [
      'Vapor / aire frío',
      'Dexametasona 0.6mg/kg VO dosis única',
      'Epinefrina nebulizada (1:1000) 0.5ml en 5ml NS si estridor en reposo',
      'Oxígeno si SatO2 <90%',
      'Antibióticos no indicados (viral)',
    ],
    followUp: [
      'Mayoría mejora en 3-5 días',
      'Alta domiciliaria si tolera fluidos',
    ],
    redFlags: ['Estridor severo en reposo', 'Distress severo', 'Dificultad deglución (epiglotitis)', 'Hipoxemia'],
    notes: 'Viral, autolimitado. Dexametasona reduce duración. Parainfluenza 75% de casos.',
  }),
};

// TOXICOLOGÍA
const toxicologyProtocols = {
  'intoxicacion-alcohol': createProtocol({
    id: 'intoxicacion-alcohol',
    title: 'Intoxicación por alcohol',
    category: 'Urgencia',
    specialty: 'Toxicología',
    definition: 'Etanol causa depresión SNC, hipoglucemia, acidosis, rabdomiólisis.',
    diagnosticOrders: [
      'Alcoholemia cuantitativa',
      'Glucosa capilar/sérica',
      'Electrolitos, creatinina',
      'Gasometría: pH, HCO3, lactato',
      'LDH, lipasa',
      'ECG',
    ],
    expectedFindings: [
      'Nivel 0-100: euforia, desinhibición',
      'Nivel 100-250: incoordinación, ataxia',
      'Nivel 250-400: disartria, confusión',
      'Nivel >400: coma, depresión respiratoria, muerte posible',
    ],
    treatment: [
      'Soporte: vía aérea, ventilación, circulación',
      'Glucose 25g IV si hipoglucemia',
      'Thiamina 100mg IV si alcohólico (previene Wernicke)',
      'Magnesio IV si bajo',
      'Monitorización temperatura (hipotermia)',
      'Cauteloso con benzodiacepinas (depresión respiratoria)',
    ],
    followUp: [
      'UCI si coma o inestable',
      'Alta cuando alerta, tolera PO, nivel <100',
      'Alcoholismo screening y rehabilitación',
    ],
    redFlags: ['Coma profundo', 'Respiración deprimida', 'Hipotermia severa', 'Hipoglucemia', 'Aspiración'],
    notes: 'Metabolismo 7-10g/h. Toxinas coingesta: metanol (ceguera), propilenglicol (hiperosmolaridad).',
  }),

  'intoxicacion-opioides': createProtocol({
    id: 'intoxicacion-opioides',
    title: 'Intoxicación por opiáceos',
    category: 'Emergencia',
    specialty: 'Toxicología',
    definition: 'Sobredosis heroína, morfina, oxicodona. Depresión respiratoria severa, coma.',
    diagnosticOrders: [
      'Pulsioximetría, capnografía',
      'Gases arteriales',
      'ECG',
      'Laboratorio: electrolitos, creatinina',
    ],
    expectedFindings: [
      'Tríada: miosis (pupilas pin), depresión respiratoria, coma',
      'Piel fría, hipotensión',
      'Bradipnea <8 respiraciones/min',
      'Edema pulmonar no cardiogénico (raro)',
    ],
    treatment: [
      'Naloxona (antagonista opiáceo) 0.4-2mg IV/IM/IN',
      'Repite cada 2-3 min si no responde',
      'Máximo 10mg',
      'Intubación si falla naloxona',
      'Soporte: O2, CPAP si SatO2 bajo',
      'Vigilancia 2-4h (naloxona corta duración)',
    ],
    followUp: [
      'UCI si intubado',
      'Observación mínimo 4h post-naloxona',
      'Droga screening',
      'Consejería/programa sustitución',
    ],
    redFlags: ['Apnea', 'Bradicardia severa', 'Choque', 'Edema pulmonar', 'Convulsiones (mezcla)'],
    notes: 'Naloxona efectiva 90%. Riesgo síndrome abstinencia si opiáceo-dependiente. Fentanilo requiere dosis naloxona mayores.',
  }),

  'intoxicacion-monoxido-carbono': createProtocol({
    id: 'intoxicacion-monoxido-carbono',
    title: 'Intoxicación por monóxido de carbono',
    category: 'Emergencia',
    specialty: 'Toxicología',
    definition: 'CO inhibe oxidación mitocondrial. Cefalea, confusión, coma, muerte cardiaca.',
    diagnosticOrders: [
      'Carboxihemoglobina (COHb) arterial',
      'Gases arteriales: lactato, acidosis',
      'ECG: cambios isquemia',
      'Troponina',
      'TC/RM cerebral si coma',
    ],
    expectedFindings: [
      'COHb <10%: síntomas mínimos',
      'COHb 10-30%: cefalea, mareo, náuseas',
      'COHb 30-50%: confusión, taquicardia, taquipnea',
      'COHb >50%: coma, muerte posible',
      'Piel cherry-roja (raro)',
    ],
    treatment: [
      'Oxígeno 100%: reduce COHb vida media 90min a 23min',
      'Cámara hiperbárica: reduce COHb vida media 23min a 23min (!)',
      'Indicaciones: COHb >25%, síntomas neurológicos, embarazo, cardiopatía, edad >60',
      'Soporte: fluidos, monitorización cardíaca',
      'Intubación si coma',
    ],
    followUp: [
      'Transferencia cámara hiperbárica urgente',
      'Seguimiento neuropsicológico (secuelas 20%)',
      'Investigar fuente CO (gas heater, auto en garage)',
    ],
    redFlags: ['COHb >50%', 'Coma', 'Cambios ECG', 'Lactato elevado', 'Encefalopatía postdosis'],
    notes: 'Riesgo encefalopatía postdosis días después. Cámara hiperbárica mejora pronóstico.',
  }),
};

// DERMATOLOGÍA / INFECCIOSAS
const dermatologyProtocols = {
  'escabiosis': createProtocol({
    id: 'escabiosis',
    title: 'Escabiosis',
    category: 'Urgencia',
    specialty: 'Dermatología',
    definition: 'Infección Sarcoptes scabiei. Prurito severo nocturno, surcos.',
    diagnosticOrders: [
      'Inspección: burrows entre dedos, muñecas',
      'Microscopía: ácaros, huevos, heces',
      'Potasio 10% si microscopía no clara',
    ],
    expectedFindings: [
      'Prurito severo, especialmente nocturno',
      'Burrows (surcos) entre dedos, muñecas',
      'Pápulas, urticaria, excoriaciones',
      'Secundaria: impetiginización',
    ],
    treatment: [
      'Permetrina 5% loción: aplicar cuerpo entero, repite 1-2 semanas',
      'O Ivermectina 200µg/kg VO dosis única, repite 1-2 semanas',
      'Tratar contactos (familia)',
      'Lavar ropa, sábanas en agua caliente',
      'AINE para prurito',
    ],
    followUp: [
      'Educación contactos',
      'Seguimiento complicaciones',
    ],
    redFlags: ['Sarna noruega (inmunosuprimido)', 'Infección secundaria severa'],
    notes: 'Contacto directo transmisión. Incubación 2-4 semanas. Reinfección posible.',
  }),

  'angioedema': createProtocol({
    id: 'angioedema',
    title: 'Angioedema',
    category: 'Urgencia',
    specialty: 'Dermatología',
    definition: 'Inflamación dermis profunda/submucosa. Edema labios, lengua, vías respiratorias.',
    diagnosticOrders: [
      'Clínico principalmente',
      'C1-esterasa inhibidor nivel/función si recurrente',
      'Triptasa si sospecha anafilaxia',
      'Endoscopia si sospecha compromiso airway',
    ],
    expectedFindings: [
      'Edema bien demarcado labios, lengua, cara',
      'Puede expandirse a garganta/laringe',
      'Estridor si vías aéreas comprometidas',
      'Angioedema alérgico: urticaria asociada',
      'Angioedema hereditario: historia familiar, sin urticaria',
    ],
    treatment: [
      'Alérgico: epinefrina IM 0.3-0.5mg',
      'Antihistamínicos: difenhidramina 50mg IV',
      'Corticoides: metilprednisolona 60-125mg IV',
      'Hereditario: C1-esterasa inhibidor concentrado IV',
      'Bradicinina antagonistas: ecallantide, icatibant',
      'Vía aérea: intubación/traqueostomía si necesario',
    ],
    followUp: [
      'Identificar/evitar disparador',
      'Alergia consulta',
      'Cardiologo si hereditario',
    ],
    redFlags: ['Compromiso vía aérea', 'Angioedema hereditario', 'Recurrencia', 'Asociado anafilaxia'],
    notes: 'Diferencia urticaria: lesiones profundas vs. superficiales. Hereditario: autosómico dominante, sin c1-inhib.',
  }),
};

export const allProtocolsPartTwo = {
  ...endocrinologyProtocols,
  ...orlProtocols,
  ...ophthalmologyProtocols,
  ...gynecologyProtocols,
  ...pediatricsProtocols,
  ...toxicologyProtocols,
  ...dermatologyProtocols,
};

export const getProtocolSimplifiedPart2 = (id) => allProtocolsPartTwo[id];
