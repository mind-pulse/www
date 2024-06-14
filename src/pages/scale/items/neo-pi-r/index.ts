import { ExpressionCalculator, compare } from "~/utils";

const calculateStandardScore = (
  original: number,
  standard: NEOPiRNormData,
  rules: ScoringRuleData[],
): ScoringRuleData | null => {
  for (const rule of rules) {
    const comparedResult = compare(
      original,
      ...rule.comparisons.map((c) =>
        c
          ? ({
              value: new ExpressionCalculator(
                c.expression,
                standard as unknown as Record<string, number>,
              ).calculate(),
              operator: c.operator,
            } as ComparisonArg)
          : null,
      ),
    );

    if (comparedResult) return rule;
  }

  return null;
};

export const calculateNEOPiRResult = (
  values: NEOPiRValue[],
  gender: Gender,
  interpretation: NEOPiRInterpretation,
): NEOPiRResult => {
  const dimensions: Record<NEOPiRDimension, number> = {} as Record<
    NEOPiRDimension,
    number
  >;
  const subdimensions: Record<NEOPiRSubdimension, number> = {} as Record<
    NEOPiRSubdimension,
    number
  >;

  const sums = values.reduce(
    (acc, value) => {
      acc.dimensions[value.dimension] =
        (acc.dimensions[value.dimension] ?? 0) + value.point;
      acc.subdimensions[value.subdimension] =
        (acc.subdimensions[value.subdimension] ?? 0) + value.point;
      return acc;
    },
    { dimensions, subdimensions },
  );

  const norm = interpretation.norm[gender];
  const mergedDimensions = norm.dimension_norm.map((item) => ({
    ...item,
    value: sums.dimensions[item.dimension],
  }));
  const mergedSubdimensions = norm.subdimension_norm.map((item) => ({
    ...item,
    value: sums.subdimensions[item.dimension],
  }));

  const scoringRule = interpretation.scoring_rule;
  const rules = [
    ...scoringRule.low,
    ...scoringRule.middle,
    ...scoringRule.high,
  ];

  const standardDimensionScores = mergedDimensions.reduce(
    (o, v) => {
      o[v.dimension] = {
        original: v.value,
        standard: v.data,
        transformRule: calculateStandardScore(v.value, v.data, rules),
      };

      return o;
    },
    {} as { [K in NEOPiRDimension]: NEOPiRResultItem },
  );

  const standardSubdimensionScores = mergedSubdimensions.reduce(
    (o, md) => {
      o[md.dimension] = {
        original: md.value,
        standard: md.data,
        transformRule: calculateStandardScore(md.value, md.data, rules),
      };

      return o;
    },
    {} as { [K in NEOPiRSubdimension]: NEOPiRResultItem },
  );

  return {
    dimensions: standardDimensionScores,
    subdimensions: standardSubdimensionScores,
  };
};
