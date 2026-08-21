import { allClinicalItems, clinicalProtocols } from '../data/urgClinicalData.js';

const accentMap = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n',
};

export const normalizeText = (value = '') => value
  .toLowerCase()
  .replace(/[áéíóúüñ]/g, (letter) => accentMap[letter] ?? letter)
  .replace(/[^a-z0-9/%<>=+.,\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const conceptDictionary = [
  { concept: 'dolor toracico', type: 'symptom', terms: ['dolor pecho', 'dolor toracico', 'opresion', 'precordial', 'dolor retroesternal'] },
  { concept: 'diaforesis', type: 'sign', terms: ['sudor', 'sudoracion', 'diaforesis'] },
  { concept: 'nauseas', type: 'symptom', terms: ['nausea', 'nauseas', 'vomitos'] },
  { concept: 'sincope', type: 'symptom', terms: ['sincope', 'desmayo', 'lipotimia', 'perdida conocimiento'] },
  { concept: 'fiebre', type: 'sign', terms: ['fiebre', 'febril', 'temperatura'] },
  { concept: 'hipotension', type: 'sign', terms: ['hipotension', 'ta baja', 'pas baja', 'shock'] },
  { concept: 'confusion', type: 'sign', terms: ['confusion', 'confuso', 'delirio', 'alteracion mental', 'somnolencia'] },
  { concept: 'disnea', type: 'symptom', terms: ['disnea', 'ahogo', 'falta aire', 'respira mal'] },
  { concept: 'hipoxemia grave', type: 'sign', terms: ['sat 82', 'saturacion 82', 'sat baja', 'spo2 baja', 'hipoxemia'] },
  { concept: 'edemas', type: 'sign', terms: ['edema piernas', 'edemas', 'piernas hinchadas'] },
  { concept: 'ortopnea', type: 'symptom', terms: ['ortopnea', 'duerme sentado'] },
  { concept: 'cefalea', type: 'symptom', terms: ['cefalea', 'dolor cabeza'] },
  { concept: 'rigidez nuca', type: 'sign', terms: ['rigidez cuello', 'rigidez nuca', 'meningismo'] },
  { concept: 'trauma craneal', type: 'diagnosis', terms: ['golpe cabeza', 'tce', 'trauma craneal', 'caida golpe cabeza'] },
  { concept: 'anticoagulacion', type: 'drug-context', terms: ['anticoagulado', 'sintrom', 'warfarina', 'acenocumarol', 'apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban'] },
  { concept: 'hiperpotasemia', type: 'lab', terms: ['hiperpotasemia', 'hiperkalemia', 'hiper k', 'hiperk', 'potasio alto', 'k elevado'] },
  { concept: 'enfermedad renal cronica', type: 'diagnosis', terms: ['erc', 'irc', 'insuficiencia renal cronica', 'insuf renal cron', 'fallo renal cronico'] },
  { concept: 'sindrome coronario agudo', type: 'diagnosis', terms: ['sca', 'iam', 'infarto', 'sindrome coronario', 'angina inestable'] },
  { concept: 'ictus', type: 'diagnosis', terms: ['ictus', 'acv', 'codigo ictus', 'infarto cerebral'] },
  { concept: 'tep', type: 'diagnosis', terms: ['tep', 'embolia pulmonar', 'tromboembolismo pulmonar'] },
  { concept: 'eap', type: 'diagnosis', terms: ['eap', 'edema agudo pulmon', 'edema pulmonar', 'ica', 'fallo cardiaco'] },
  { concept: 'vmni', type: 'procedure', terms: ['vmni', 'cpap', 'bipap', 'ventilacion no invasiva'] },
  { concept: 'intubacion', type: 'procedure', terms: ['intubacion', 'isr', 'secuencia rapida'] },
  { concept: 'ecg', type: 'test', terms: ['ecg', 'electro', 'electrocardiograma'] },
  { concept: 'troponina', type: 'test', terms: ['troponina', 'tropo'] },
];

const searchPatterns = [
  { id: 'sca-risk', label: 'Dolor toracico vegetativo: priorizar SCA', concepts: ['dolor toracico', 'diaforesis|nauseas'], boost: 60, targets: ['sca', 'dolor-toracico', 'sindrome-aortico', 'tep'] },
  { id: 'thoracic-syncope', label: 'Dolor toracico con sincope', concepts: ['dolor toracico', 'sincope'], boost: 65, targets: ['sca', 'sindrome-aortico', 'arritmias', 'tep'] },
  { id: 'sepsis-shock', label: 'Fiebre + hipotension/confusion', concepts: ['fiebre', 'hipotension|confusion'], boost: 70, targets: ['sepsis', 'shock', 'abcde'] },
  { id: 'eap-pattern', label: 'Disnea + edema/ortopnea', concepts: ['disnea', 'edemas|ortopnea'], boost: 60, targets: ['ica-eap', 'disnea', 'vmni-srni'] },
  { id: 'critical-respiratory', label: 'Disnea con hipoxemia grave', concepts: ['disnea', 'hipoxemia grave'], boost: 80, targets: ['disnea', 'abcde', 'vmni-srni', 'via-aerea'] },
  { id: 'meningitis-pattern', label: 'Cefalea + fiebre + rigidez', concepts: ['cefalea', 'fiebre', 'rigidez nuca'], boost: 80, targets: ['meningitis-encefalitis', 'cefalea', 'sepsis'] },
  { id: 'tce-anticoagulated', label: 'Caida/TCE anticoagulado', concepts: ['trauma craneal', 'anticoagulacion'], boost: 75, targets: ['tce', 'glasgow', 'trauma-grave'] },
  { id: 'hyperk-pattern', label: 'Potasio alto/hiperpotasemia', concepts: ['hiperpotasemia'], boost: 70, targets: ['electrolitos', 'renal-urologia', 'abcde'] },
  { id: 'renal-hyperk', label: 'Renal + potasio alto', concepts: ['enfermedad renal cronica', 'hiperpotasemia'], boost: 65, targets: ['electrolitos', 'renal-urologia', 'abcde'] },
];

const itemTerms = (item) => [
  item.title,
  item.description,
  item.group,
  item.priority,
  ...(item.areas ?? []),
  ...(item.entry ?? []),
  ...(item.synonyms ?? []),
  ...(item.related ?? []),
  ...(item.tools ?? []),
  ...(item.procedures ?? []),
  ...(item.circuits ?? []),
  ...(item.drugs ?? []),
  ...(item.terms ?? []),
  ...(item.fields ?? []),
].filter(Boolean).map(normalizeText);

export const extractClinicalConcepts = (query) => {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  return conceptDictionary
    .filter((entry) => entry.terms.some((term) => normalized.includes(normalizeText(term))))
    .map((entry) => ({ concept: entry.concept, type: entry.type }));
};

const conceptMatches = (requirement, concepts) => {
  const options = requirement.split('|');
  return options.some((option) => concepts.some((item) => item.concept === option));
};

const priorityScore = { P0: 40, P1: 25, P2: 12, P3: 5 };
const typeScore = { protocol: 10, procedure: 8, tool: 6, circuit: 7 };

export const searchClinical = (query, scopeItems = allClinicalItems) => {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  const tokens = normalized.split(' ').filter((token) => token.length > 1);
  const concepts = extractClinicalConcepts(query);
  const matchedPatterns = searchPatterns.filter((pattern) => pattern.concepts.every((concept) => conceptMatches(concept, concepts)));

  return scopeItems
    .map((item) => {
      const terms = itemTerms(item);
      let score = (priorityScore[item.priority] ?? 0) + (typeScore[item.type] ?? 0);
      const reasons = [];

      terms.forEach((term) => {
        if (!term) return;
        if (term === normalized) {
          score += 80;
          reasons.push('coincidencia exacta');
        } else if (term.includes(normalized) || normalized.includes(term)) {
          score += 35;
          reasons.push('coincidencia textual');
        }
        tokens.forEach((token) => {
          if (term.includes(token)) score += 5;
        });
      });

      concepts.forEach((concept) => {
        if (terms.some((term) => term.includes(normalizeText(concept.concept)))) {
          score += 22;
          reasons.push(concept.concept);
        }
      });

      matchedPatterns.forEach((pattern) => {
        if (pattern.targets.includes(item.id)) {
          score += pattern.boost;
          reasons.push(pattern.label);
        }
      });

      if (concepts.some((itemConcept) => ['hipotension', 'hipoxemia grave', 'confusion'].includes(itemConcept.concept)) && item.areas?.includes('criticos')) score += 12;

      return { item, score, reasons: [...new Set(reasons)] };
    })
    .filter((result) => result.reasons.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 18);
};

export const groupedSearch = (query) => {
  const results = searchClinical(query);
  return {
    protocols: results.filter((result) => result.item.type === 'protocol'),
    procedures: results.filter((result) => result.item.type === 'procedure'),
    tools: results.filter((result) => result.item.type === 'tool'),
    circuits: results.filter((result) => result.item.type === 'circuit'),
  };
};

export const getItemById = (id) => allClinicalItems.find((item) => item.id === id);
export const getProtocolById = (id) => clinicalProtocols.find((item) => item.id === id);
