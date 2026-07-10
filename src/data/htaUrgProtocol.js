export const htaUrgSources = [
  {
    label: 'ESC. 2024 Guidelines for the management of elevated blood pressure and hypertension.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
    supports: 'Emergencia hipertensiva, daño agudo de órgano diana, objetivos de descenso y escenarios especiales.',
  },
  {
    label: 'NICE NG136. Hypertension in adults: diagnosis and management.',
    url: 'https://www.nice.org.uk/guidance/ng136/chapter/recommendations',
    supports: 'Confirmación, manejo no urgente, seguimiento y derivación.',
  },
  {
    label: 'AEMPS CIMA.',
    url: 'https://cima.aemps.es/cima/publico/home.html',
    supports: 'Dosis, vías, precauciones y seguridad farmacológica.',
  },
];

export const ivTreatments = [
  {
    id: 'labetalol',
    title: 'Labetalol IV',
    scenario: 'Emergencia hipertensiva con indicación de control IV, evitando si broncoespasmo, bradicardia o bloqueo.',
    dose: 'Bolo IV lento 20 mg; repetir 40-80 mg cada 10 min si precisa. Máximo total 300 mg.',
    reassess: '10-15 min',
    caution: 'Evitar en asma/EPOC grave, bradicardia, bloqueo AV o insuficiencia cardiaca descompensada.',
    source: 'AEMPS CIMA / ESC 2024.',
  },
  {
    id: 'nitroglycerin',
    title: 'Nitroglicerina IV',
    scenario: 'SCA o edema pulmonar/congestión con TA elevada.',
    dose: 'Perfusión IV inicial 5-10 microgramos/min; titular cada 5-10 min según TA, dolor/congestión y tolerancia.',
    reassess: '5-10 min',
    caution: 'Evitar si hipotensión, uso reciente de inhibidores PDE5, sospecha de infarto VD o estenosis aórtica grave.',
    source: 'AEMPS CIMA / ESC 2024.',
  },
  {
    id: 'furosemide',
    title: 'Furosemida IV',
    scenario: 'Congestión/edema pulmonar con sobrecarga de volumen.',
    dose: '20-40 mg IV; ajustar a situación clínica, función renal y tratamiento diurético previo.',
    reassess: '30-60 min',
    caution: 'Vigilar diuresis, sodio, potasio, función renal y volemia.',
    source: 'AEMPS CIMA.',
  },
];

export const oralTreatments = [
  {
    id: 'captopril',
    title: 'Captopril VO',
    scenario: 'HTA severa sin daño agudo, si se decide tratamiento oral y no hay contraindicación SRAA.',
    dose: '12,5-25 mg VO. No usar vía sublingual.',
    reassess: '30-60 min',
    caution: 'Evitar en embarazo, angioedema previo por IECA, hiperpotasemia o deterioro renal significativo.',
    source: 'AEMPS CIMA / NICE NG136.',
  },
  {
    id: 'amlodipine',
    title: 'Amlodipino VO',
    scenario: 'Inicio o ajuste oral si no se requiere descenso inmediato.',
    dose: '5 mg VO cada 24 h; titular hasta 10 mg/24 h según respuesta y tolerancia.',
    reassess: '60-120 min en urgencias si se administra; control posterior ambulatorio.',
    caution: 'Vigilar edema, hipotensión, fragilidad e interacciones.',
    source: 'AEMPS CIMA / NICE NG136.',
  },
];
