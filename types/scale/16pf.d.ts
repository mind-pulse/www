type SPFFactor =
  | "A"
  | "C"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "L"
  | "M"
  | "N"
  | "O"
  | "Q1"
  | "Q2"
  | "Q3"
  | "Q4"
  | "B";

interface SPFQuestion extends CommonQuestion {
  factor: SPFFactor;
}

type SPFRange = number | [number, number];

interface SPFNormItem {
  ranges: SPFRange[];
  mean: number;
  standard_deviation: number;
}

type SPFNorm = { [K in SPFFactor]: SPFNormItem };

interface SPFFirstPersonalityFactor {
  factor: SPFFactor;
  name: string;
  occupations: string;
  characteristic: Characteristic;
}

interface SPFSecondPersonalityFactor {
  key: "X1" | "X2" | "X3" | "X4";
  name: string;
  expression: string;
  characteristic: Characteristic;
}

interface SPFInterpretation {
  normal_range: [number, number];
  norm: SPFNorm;
  first_personality_factor: SPFFirstPersonalityFactor[];
  second_personality_factor: [
    SPFSecondPersonalityFactor,
    SPFSecondPersonalityFactor,
    SPFSecondPersonalityFactor,
    SPFSecondPersonalityFactor,
  ];
}

interface SPFValue {
  factor: SPFFactor;
  // 因为选项可能存在多个 0，不能直接用 point 作为 radio 的值
  optionIndex: number;
  point: number;
}

// 原始分结果
type SPFResult = { [K in SPFFactor]: number };

interface SPFResultState {
  factor: SPFFactor;
  label: string;
  total: number;
}
