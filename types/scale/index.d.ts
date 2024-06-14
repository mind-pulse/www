interface Option {
  text: string
  point: number
}

interface CommonQuestion {
  title: string
  options: Option[]
}

type Path =
  | 'sas'
  | 'sds'
  | 'scl90'
  | 'hamd'
  | 'epq_rsc'
  | 'y_bocs'
  | 'ept'
  | '16pf'
  | 'neo_pi_r'
  | 'h_sds'

type ValueTypes = {
  scl90: Scl90Value
  '16pf': SPFValue
}

type InferValue<P extends Path> = P extends 'scl90'
  ? Scl90Value
  : P extends '16pf'
  ? SPFValue
  : P extends 'ept'
  ? EptValue
  : P extends 'epq_rsc'
  ? EpqRscValue
  : P extends 'neo_pi_r'
  ? NEOPiRValue
  : P extends 'h_sds'
  ? HSDSValue
  : number

type InferResult<P extends Path> = P extends 'scl90'
  ? Scl90Result
  : P extends 'epq_rsc'
  ? EpqRscResult
  : P extends 'y_bocs'
  ? YBocsResult
  : P extends 'ept'
  ? EptResult
  : P extends '16pf'
  ? SPFResult
  : P extends 'neo_pi_r'
  ? NEOPiRResult
  : P extends 'h_sds'
  ? HSDSResult
  : number

type InferInterpretation<P extends Path> = P extends 'scl90'
  ? Scl90Interpretation
  : P extends 'epq_rsc'
  ? EpqRscInterpretation
  : P extends 'ept'
  ? EptInterpretation
  : P extends '16pf'
  ? SPFInterpretation
  : P extends 'neo_pi_r'
  ? NEOPiRInterpretation
  : P extends 'h_sds'
  ? HSDSInterpretation
  : CommonInterpretation

type InferQuestion<P extends Path> = P extends 'scl90'
  ? Scl90Question
  : P extends 'epq_rsc'
  ? EpqRscQuestion
  : P extends 'ept'
  ? EptQuestion
  : P extends '16pf'
  ? SPFQuestion
  : P extends 'neo_pi_r'
  ? NEOPiRQuestion
  : P extends 'h_sds'
  ? HSDSQuestion
  : CommonQuestion

type CalculateResult<P extends Path> = (
  values: InferValue<P>[],
) => InferResult<P>

interface Tag {
  info: string[] | null
  normal: string[] | null
  warning: string[] | null
  error: string[] | null
}

type ResultStatus = 'normal' | 'mild' | 'moderate' | 'major'

type Integer = 'ROUND' | 'FLOOR' | 'CEIL'

interface FormulaMode {
  operational_rule: { multiply: number } | { divide: number }
  integer?: Integer
}

interface InterpretationItem {
  range: [number, number]
  description: string
  advice?: string[]
  symptom?: string[]
  status: ResultStatus
}

type CommonInterpretation = InterpretationItem[]

interface Scale<T, I> {
  name: string
  abbreviation: string
  instruction?: string[]
  questions: T[]
  interpretation: I
  introduction: string[]
  references?: string[]
  warning?: string
  formula_mode?: FormulaMode
  idea: string[] | null
}

interface QuestionListItem {
  name: string
  path: string
  introduction: string
  warning: string | null
  tags: Tag
  disabled: boolean
}

interface Characteristic {
  low: string[]
  high: string[]
}

type ComparisonOperator = 'L' | 'LE' | 'G' | 'GE'

interface Comparison {
  expression: string
  operator: ComparisonOperator
}

type Gender = 'male' | 'female'

interface ComparisonArg {
  value: number
  operator: ComparisonOperator
}
