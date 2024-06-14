interface YBocsResult {
  thinking: number;
  behavior: number;
  total: number;
}

interface YBocsInterpretationItem {
  range: { total: [number, number]; any: [number, number] };
  label: string;
  description?: string[];
  advice?: string[];
  status: ResultStatus;
}

type YBocsInterpretation = YBocsInterpretationItem[];
