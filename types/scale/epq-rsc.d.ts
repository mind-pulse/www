type EpqRscDimension = 'P' | 'E' | 'N' | 'L'

type EpqRscNormGender = {
  [K in EpqRscDimension]: { M: number; SD: number }
} & { range: [number, number | null] }

interface EpqRscNorm {
  male: EpqRscNormGender[]
  female: EpqRscNormGender[]
}

interface Temperaments {
  sanguine: string[]
  choleric: string[]
  melancholic: string[]
  phlegmatic: string[]
}

type Temperament = keyof Temperaments

interface EpqRscHighLow {
  high: string[]
  low: string[]
}

interface EpqRscDimensionScoreInterpretation {
  osculant: string[]
  inclined: EpqRscHighLow
  typical: EpqRscHighLow
}

interface EpqRscDimensionInterpretation {
  label: string
  notice?: string
  supplementary?: string[]
  dimension: EpqRscDimensionScoreInterpretation
}

interface EpqRscInterpretation {
  dimensions: { [K in EpqRscDimension]: EpqRscDimensionInterpretation }
  norm: EpqRscNorm
  temperaments: Temperaments
}

interface EpqRscValue {
  dimension: EpqRscDimension
  point: number
}

interface EpqRscQuestion extends CommonQuestion {
  dimension: EpqRscDimension
}

interface EpqRscResultKindDescription {
  name: string
  desc: string[]
}

type EpqRscResultLevel = -2 | -1 | 0 | 1 | 2

interface EpqRscResultKind {
  level: EpqRscResultLevel
  label: string
  color: string
}

type EpqRscResult = {
  [K in EpqRscDimension]: {
    score: number
    kind: EpqRscResultKind
  }
}
