type Scl90Symptom =
  | "SOMATIZATION"
  | "OBSESSIVE_COMPULSIIVE"
  | "SENSITIVE_OF_INTERPERSONAL_RELATIONSHIP"
  | "DESPONDENT"
  | "ANXIETY"
  | "HOSTILITY"
  | "PHOBIA"
  | "BIGOTRY"
  | "PSYCHOTIC"
  | "OTHER";

interface Scl90Question extends CommonQuestion {
  symptom: Scl90Symptom;
}

interface Scl90Value {
  symptom: Scl90Symptom;
  point: number;
}

interface Scl90PositivaRule {
  value: number;
  comparison_operator: string;
}

interface Scl90Interpretation {
  positive: {
    total: Scl90PositivaRule;
    positive_amount: Scl90PositivaRule;
    any_symptom_average: Scl90PositivaRule;
  };
  symptoms: Record<Scl90Symptom, { name: string; symptom: string }>;
}

interface Scl90Result {
  /** 总分 */
  total: number;
  /** 总均分 */
  average: number;
  /** 阳性项目数 */
  positiveAmount: number;
  /** 阴性项目数 */
  negativeAmount: number;
  /** 阳性症状均分 */
  positiveAverage: number;
  /* 各因子的平均分 **/
  symptomsAverage: { [K in Scl90Symptom]: number };
}
