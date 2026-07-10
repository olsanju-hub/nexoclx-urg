export const htaUrgSupportTools = [
  {
    id: 'hta-timer',
    title: 'Timer de revaloración HTA',
    description: 'Temporizador para revalorar TA, síntomas y daño orgánico.',
    status: 'Timer',
  },
  {
    id: 'bp-series',
    title: 'Registro seriado de TA',
    description: 'Tendencia, cambio absoluto y porcentaje frente a la TA inicial.',
    status: 'Registro',
  },
  {
    id: 'egfr',
    title: 'eGFR CKD-EPI 2021',
    description: 'Filtrado estimado para daño renal y seguridad farmacológica.',
    status: 'Calculadora',
  },
  {
    id: 'lab-control',
    title: 'Control analítico HTA Urg',
    description: 'Creatinina/eGFR, sodio y potasio en contexto agudo.',
    status: 'Checklist',
  },
  {
    id: 'iv-perfusions',
    title: 'Perfusiones IV HTA',
    description: 'Indicaciones y límites de seguridad; sin diluciones locales.',
    status: 'Guía segura',
  },
];

export const htaUrgToolGroups = [
  {
    id: 'hta-urgencias',
    title: 'HTA en Urgencias',
    description: 'Utilidades auxiliares del protocolo HTA en Urgencias.',
    tools: htaUrgSupportTools,
  },
];

export const htaUrgSupportSources = [
  {
    label: 'ESC. 2024 Guidelines for the management of elevated blood pressure and hypertension.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
    supports: 'Emergencia hipertensiva, daño agudo de órgano diana, objetivos de descenso y estrategia general.',
  },
  {
    label: 'NICE NG136. Hypertension in adults: diagnosis and management.',
    url: 'https://www.nice.org.uk/guidance/ng136/chapter/recommendations',
    supports: 'Valoración, seguimiento y manejo no urgente cuando aplica.',
  },
  {
    label: 'National Kidney Foundation. CKD-EPI Creatinine Equation 2021.',
    url: 'https://www.kidney.org/ckd-epi-creatinine-equation-2021-0',
    supports: 'Fórmula eGFR CKD-EPI 2021 sin raza.',
  },
  {
    label: 'AEMPS CIMA.',
    url: 'https://cima.aemps.es/cima/publico/home.html',
    supports: 'Dosis, vías, precauciones y seguridad farmacológica.',
  },
];
