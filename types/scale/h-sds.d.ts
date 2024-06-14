type HSDSQuestionType =
  | 'INTERESTED_EVENT'
  | 'GOOD_AT'
  | 'LOVED_JOB'
  | 'CAPACITY_CATEGORY'

type HSDSCapacityCategoryType = 'R' | 'A' | 'I' | 'S' | 'E' | 'C'

interface HSDSQuestion extends CommonQuestion {
  question_type: HSDSQuestionType
  capacity_category: HSDSCapacityCategoryType
}

type HSDSValue =
  | {
    question_type: 'INTERESTED_EVENT'
    capacity_category: HSDSCapacityCategoryType
    selected: number[]
  }
  | {
    question_type: 'GOOD_AT'
    capacity_category: HSDSCapacityCategoryType
    selected: number[]
  }
  | {
    question_type: 'LOVED_JOB'
    capacity_category: HSDSCapacityCategoryType
    selected: number[]
  }
  | {
    question_type: 'CAPACITY_CATEGORY'
    capacity_category: HSDSCapacityCategoryType
    selected: number
  }

interface HSDSCapacityCategoryInterpretation {
  capacity_category: HSDSCapacityCategoryType
  name: string
  personality_trait: string
  occupational_stigma: string
}

interface HSDSCareerItem {
  code: string
  information: string
}

interface HSDSInterpretation {
  capacity_category_interpretations: HSDSCapacityCategoryInterpretation[]
  career_information: HSDSCareerItem[]
}

interface HSDSResultItem {
  capacity_category: HSDSCapacityCategoryType
  total: number
}

type HSDSResult = HSDSResultItem[]
