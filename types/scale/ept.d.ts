type EptTypes =
  | "PEACEMAKER"
  | "REFORMER"
  | "INVESTIGATOR"
  | "ENTHUSIAST"
  | "CHALLENGER"
  | "HELPER"
  | "INDIVIDUALIST"
  | "LOYALIST"
  | "ACHIEVER";

interface EptQuestion extends CommonQuestion {
  type: EptTypes;
}

interface EptCharacter {
  keyword: string;
  description: string;
}

interface EptInterpretation {
  type_interpretations: EptInterpretationItem[];
  dialog: string[];
}

interface EptInterpretationItem {
  type: EptTypes;
  desire_trait: string;
  basic_confusion: string;
  main_features: string;
  main_traits: string;
  lifestyle: string;
  relationships: string;
  basic_fear: string;
  basic_desire: string;
  characters: EptCharacter[];
}

interface EptValue {
  type: EptTypes;
  point: number;
}

interface EptResultItem {
  type: EptTypes;
  label: string;
  total: {
    yes: number;
    no: number;
  };
}

type EptResult = EptResultItem[];
