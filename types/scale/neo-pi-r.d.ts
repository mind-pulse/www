type NEOPiRDimension = "N" | "E" | "O" | "A" | "C";

type InferNEOPiRSubdimension<T extends NEOPiRDimension> =
  | `${T}1`
  | `${T}2`
  | `${T}3`
  | `${T}4`
  | `${T}5`
  | `${T}6`;

type NEOPiRSubdimensionN = InferNEOPiRSubdimension<"N">;
type NEOPiRSubdimensionE = InferNEOPiRSubdimension<"E">;
type NEOPiRSubdimensionO = InferNEOPiRSubdimension<"O">;
type NEOPiRSubdimensionA = InferNEOPiRSubdimension<"A">;
type NEOPiRSubdimensionC = InferNEOPiRSubdimension<"C">;

type NEOPiRSubdimension =
  | NEOPiRSubdimensionN
  | NEOPiRSubdimensionE
  | NEOPiRSubdimensionO
  | NEOPiRSubdimensionA
  | NEOPiRSubdimensionC;

interface NEOPiRValue {
  dimension: NEOPiRDimension;
  subdimension: NEOPiRSubdimension;
  point: number;
}

interface NEOPiRQuestion extends CommonQuestion {
  dimension: NEOPiRDimension;
  subdimension: NEOPiRSubdimension;
}

interface NEOPiRNormData {
  M: number;
  SD: number;
}

interface NEOPiRDimensionNorm<T extends NEOPiRDimension | NEOPiRSubdimension> {
  dimension: T;
  data: NEOPiRNormData;
}

interface NEOPiRNormGender {
  dimension_norm: NEOPiRDimensionNorm<NEOPiRDimension>[];
  subdimension_norm: NEOPiRDimensionNorm<NEOPiRSubdimension>[];
}

type NEOPiRNorm = { [K in Gender]: NEOPiRNormGender };

interface ScoringRuleData {
  value: number;
  comparisons:
    | [Comparison | null, Comparison]
    | [Comparison, Comparison | null]
    | [Comparison, Comparison];
}

interface ScoringRule {
  range: { start: number; end: number };
  low: ScoringRuleData[];
  middle: ScoringRuleData[];
  high: ScoringRuleData[];
}

interface NEOPiRSubdimensionInterpretation {
  dimension: NEOPiRSubdimension;
  name: string;
  description: string;
  low: string;
  high: string;
}

interface NEOPiRDimensionInterpretation {
  dimension: NEOPiRDimension;
  name: string;
  description: string;
  low: string;
  high: string;
  subdimension_interpretations: NEOPiRSubdimensionInterpretation[];
}

interface NEOPiRInterpretation {
  norm: NEOPiRNorm;
  scoring_rule: ScoringRule;
  dimensions: NEOPiRDimensionInterpretation[];
}

interface NEOPiRResultItem {
  // 原始分
  original: number;
  // 常模标准
  standard: NEOPiRNormData;
  transformRule: transformRule;
}

interface NEOPiRResult {
  dimensions: { [K in NEOPiRDimension]: NEOPiRResultItem };
  subdimensions: { [K in NEOPiRSubdimension]: NEOPiRResultItem };
}
