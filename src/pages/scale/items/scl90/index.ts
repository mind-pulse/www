import { roundToDecimalPlaces } from "~/utils";

const SCL90_DEFAULT_SYMPTOMS: Record<
  Scl90Symptom,
  { amount: number; total: number }
> = {
  SOMATIZATION: { amount: 0, total: 0 },
  ANXIETY: { amount: 0, total: 0 },
  OBSESSIVE_COMPULSIIVE: { amount: 0, total: 0 },
  DESPONDENT: { amount: 0, total: 0 },
  SENSITIVE_OF_INTERPERSONAL_RELATIONSHIP: { amount: 0, total: 0 },
  PSYCHOTIC: { amount: 0, total: 0 },
  BIGOTRY: { amount: 0, total: 0 },
  HOSTILITY: { amount: 0, total: 0 },
  PHOBIA: { amount: 0, total: 0 },
  OTHER: { amount: 0, total: 0 },
};

const calculateSymptomsAverage = (
  symptoms: typeof SCL90_DEFAULT_SYMPTOMS,
): Record<Scl90Symptom, number> => {
  const symptomsAverage: Record<Scl90Symptom, number> = {} as Record<
    Scl90Symptom,
    number
  >;

  for (const key in symptoms) {
    const symptomKey = key as Scl90Symptom;
    const { amount, total } = symptoms[symptomKey];

    symptomsAverage[symptomKey] =
      amount > 0 ? roundToDecimalPlaces(total / amount) : 0;
  }

  return symptomsAverage;
};

export const calculateScl90Result = (values: Scl90Value[]): Scl90Result => {
  // Define constants
  const TOTAL_QUESTIONS = 90;
  const MIN_POSITIVE_POINT = 2;

  // Initialize variables
  let total = 0;
  let positiveAmount = 0;
  let positiveTotal = 0;
  const symptoms = { ...SCL90_DEFAULT_SYMPTOMS };

  // Calculate total, positiveAmount, and symptoms' totals
  values.forEach(({ point, symptom }) => {
    total += point;
    symptoms[symptom].amount += 1;
    symptoms[symptom].total += point;
    if (point >= MIN_POSITIVE_POINT) {
      positiveAmount += 1;
      positiveTotal += point;
    }
  });

  return {
    total,
    average: roundToDecimalPlaces(total / TOTAL_QUESTIONS),
    positiveAmount,
    negativeAmount: TOTAL_QUESTIONS - positiveAmount,
    positiveAverage:
      positiveAmount > 0
        ? roundToDecimalPlaces(positiveTotal / positiveAmount)
        : 0,
    symptomsAverage: calculateSymptomsAverage(symptoms),
  };
};
