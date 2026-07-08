export const getDefaultValues = (fields = []) => fields.reduce((values, field) => {
  if (field.type === 'checkbox') return { ...values, [field.id]: false };
  if (field.type === 'multi') return { ...values, [field.id]: [] };
  if (field.type === 'pediatricAge') return { ...values, ageYears: '', ageExtraMonths: '' };
  return { ...values, [field.id]: '' };
}, {});

export const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const withBaseComputed = (values = {}, computed = {}) => {
  if (values.ageYears === '' || values.ageYears === undefined) return computed;
  const years = toNumber(values.ageYears);
  const months = toNumber(values.ageExtraMonths || 0);
  if (years === null || months === null) return computed;
  return { ...computed, ageMonths: (years * 12) + months };
};

const readValue = (condition, values, computed) => {
  if (condition.source === 'computed') return computed[condition.id];
  return values[condition.id] ?? computed[condition.id];
};

export const conditionIsMet = (condition, values = {}, initialComputed = {}) => {
  const computed = withBaseComputed(values, initialComputed);
  if (!condition) return false;
  if (typeof condition === 'string') return Boolean(values[condition] ?? computed[condition]);
  if (condition.any?.length) return condition.any.some((item) => conditionIsMet(item, values, computed));
  if (condition.all?.length) return condition.all.every((item) => conditionIsMet(item, values, computed));

  const value = readValue(condition, values, computed);
  if (condition.exists) return value !== '' && value !== null && value !== undefined;
  if (condition.equals !== undefined && value !== condition.equals) return false;
  if (condition.notEquals !== undefined && value === condition.notEquals) return false;
  if (condition.includes !== undefined) return Array.isArray(value) && value.includes(condition.includes);

  const numeric = toNumber(value);
  if (condition.gte !== undefined && (numeric === null || numeric < condition.gte)) return false;
  if (condition.gt !== undefined && (numeric === null || numeric <= condition.gt)) return false;
  if (condition.lte !== undefined && (numeric === null || numeric > condition.lte)) return false;
  if (condition.lt !== undefined && (numeric === null || numeric >= condition.lt)) return false;

  return (
    condition.equals !== undefined
    || condition.notEquals !== undefined
    || condition.gte !== undefined
    || condition.gt !== undefined
    || condition.lte !== undefined
    || condition.lt !== undefined
  );
};

export const outcomeMatches = (outcome, values, computed = {}) => {
  if (outcome.when) return conditionIsMet(outcome.when, values, computed);
  if (outcome.any?.length) return outcome.any.some((condition) => conditionIsMet(condition, values, computed));
  if (outcome.all?.length) return outcome.all.every((condition) => conditionIsMet(condition, values, computed));
  return false;
};

export const getMissingFields = (fields = [], values = {}, groups = []) => {
  const missingFields = fields.filter((field) => {
    if (!field.required) return false;
    if (field.type === 'checkbox') return false;
    if (field.type === 'multi') return !Array.isArray(values[field.id]) || values[field.id].length === 0;
    if (field.type === 'pediatricAge') return values.ageYears === '' || values.ageExtraMonths === '';
    const value = values[field.id];
    return value === '' || value === null || value === undefined;
  });
  const missingGroups = groups
    .filter((group) => group.fields.every((fieldId) => values[fieldId] === '' || values[fieldId] === null || values[fieldId] === undefined))
    .map((group) => ({ id: group.id, label: group.label }));
  return [...missingFields, ...missingGroups];
};

export const calculateDerived = (calculations = [], values = {}) => {
  const computed = withBaseComputed(values, {});
  calculations.forEach((calc) => {
    try {
      if (calc.type === 'sumScore') {
        computed[calc.id] = calc.items.reduce((total, item) => (
          conditionIsMet(item.when, values, computed) ? total + item.points : total
        ), 0);
      }
      if (calc.type === 'doseByWeight') {
        const weight = toNumber(values[calc.weightField]);
        if (weight === null) {
          computed[calc.id] = null;
          return;
        }
        const rawDose = weight * calc.mgPerKg;
        const cappedDose = calc.maxMg ? Math.min(rawDose, calc.maxMg) : rawDose;
        computed[calc.id] = {
          rawMg: rawDose,
          doseMg: cappedDose,
          maxApplied: calc.maxMg ? rawDose > calc.maxMg : false,
          label: `${Number(cappedDose.toFixed(1))} mg${calc.maxMg && rawDose > calc.maxMg ? ' (máximo aplicado)' : ''}`,
        };
      }
      if (calc.type === 'ratio') {
        const numerator = toNumber(values[calc.numerator]);
        const denominator = toNumber(values[calc.denominator]);
        computed[calc.id] = numerator === null || denominator === null || denominator === 0 ? null : numerator / denominator;
      }
      if (calc.type === 'bmi') {
        const weight = toNumber(values[calc.weightField]);
        const heightCm = toNumber(values[calc.heightField]);
        if (weight === null || heightCm === null || heightCm === 0) {
          computed[calc.id] = null;
          return;
        }
        const heightM = heightCm / 100;
        computed[calc.id] = Number((weight / (heightM * heightM)).toFixed(1));
      }
      if (calc.type === 'custom' && typeof calc.fn === 'function') {
        computed[calc.id] = calc.fn(values, computed);
      }
    } catch {
      computed[calc.id] = null;
    }
  });
  return computed;
};

export const getInterpretations = (interpretations = [], values = {}, computed = {}) => (
  interpretations
    .filter((item) => conditionIsMet(item.when, values, computed))
    .map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      tone: item.tone,
      actions: item.actions ?? [],
    }))
);

export const getClinicalOutput = (assessment, values) => {
  const computed = calculateDerived(assessment.calculations ?? [], values);
  const missingFields = getMissingFields(assessment.fields, values, assessment.requiredGroups);
  const interpretations = getInterpretations(assessment.interpretations ?? [], values, computed);
  if (missingFields.length > 0) {
    return {
      missingFields,
      computed,
      interpretations,
      outcome: assessment.incompleteOutcome ?? {
        status: 'Datos',
        title: 'Faltan datos obligatorios',
        body: 'Completa los campos marcados para obtener una salida clínica.',
        actions: [],
      },
    };
  }
  return {
    missingFields,
    computed,
    interpretations,
    outcome: assessment.outcomes?.find((item) => outcomeMatches(item, values, computed)) ?? assessment.defaultOutcome,
  };
};

const formatFieldValue = (field, values) => {
  if (field.type === 'pediatricAge') return `${values.ageYears} años ${values.ageExtraMonths} meses`;
  const value = values[field.id];
  const option = field.options?.find((item) => item.value === value);
  return `${option?.label ?? value}${field.unit ? ` ${field.unit}` : ''}`;
};

export const formatClinicalSummary = ({ protocol, values, computed, outcome }) => {
  const fieldLines = protocol.assessment.fields
    .map((field) => {
      if (field.type === 'checkbox') return values[field.id] ? `- ${field.label}` : null;
      if (field.type === 'multi') {
        const value = values[field.id];
        if (!Array.isArray(value) || value.length === 0) return null;
        const labels = value.map((item) => field.options?.find((option) => option.value === item)?.label ?? item);
        return `- ${field.label}: ${labels.join(', ')}`;
      }
      if (field.type === 'pediatricAge') {
        if (values.ageYears === '' || values.ageExtraMonths === '') return null;
        return `- ${field.label}: ${formatFieldValue(field, values)}`;
      }
      const value = values[field.id];
      if (value === '' || value === null || value === undefined) return null;
      return `- ${field.label}: ${formatFieldValue(field, values)}`;
    })
    .filter(Boolean);
  const computedLines = Object.entries(computed ?? {})
    .map(([key, value]) => {
      if (value === null || value === undefined || value === '') return null;
      if (typeof value === 'object' && value.label) return `- ${key}: ${value.label}`;
      return `- ${key}: ${value}`;
    })
    .filter(Boolean);
  return [
    protocol.assessment.copyPrefix ?? protocol.title,
    '',
    'Datos:',
    fieldLines.length ? fieldLines.join('\n') : '- Sin datos introducidos.',
    computedLines.length ? `\nCálculos:\n${computedLines.join('\n')}` : null,
    '',
    `Conducta: ${outcome?.title ?? 'Sin salida'}`,
    outcome?.body ?? '',
    outcome?.actions?.length ? `Acciones:\n${outcome.actions.map((item) => `- ${item}`).join('\n')}` : null,
  ].filter(Boolean).join('\n');
};
