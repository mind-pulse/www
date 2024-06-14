import { roundToDecimalPlaces } from '~/utils'

// https://pic3.zhimg.com/80/v2-f862425f00ec55fb94a1a04c8c3e6242_1440w.webp
// https://pic1.zhimg.com/80/v2-30fe1e1b033e6a7ee70db48a5647e0b4_1440w.webp
export const EPQ_RSX_STANDARD = {
  osculant: {
    range: [43.3, 56.7],
    kind: { label: '中间型', color: '#07c160', level: 0 } as EpqRscResultKind,
  },
  inclined: {
    low: {
      range: [38.5, 43.3],
      kind: {
        label: '倾向型-偏低',
        color: '#ff976a',
        level: -1,
      } as EpqRscResultKind,
    },
    high: {
      range: [56.7, 61.5],
      kind: {
        label: '倾向型-偏高',
        color: '#ff976a',
        level: 1,
      } as EpqRscResultKind,
    },
  },
  typical: {
    low: {
      max: 38.5,
      kind: {
        label: '典型-很低',
        color: '#ee0a24',
        level: -2,
      } as EpqRscResultKind,
    },
    hight: {
      min: 61.5,
      kind: {
        label: '典型-很高',
        color: '#ee0a24',
        level: 2,
      } as EpqRscResultKind,
    },
  },
}

const matchKind = (score: number): EpqRscResultKind => {
  if (
    score >= EPQ_RSX_STANDARD.osculant.range[0] &&
    score < EPQ_RSX_STANDARD.osculant.range[1]
  ) {
    return EPQ_RSX_STANDARD.osculant.kind
  }

  if (
    score >= EPQ_RSX_STANDARD.inclined.low.range[0] &&
    score < EPQ_RSX_STANDARD.inclined.low.range[1]
  ) {
    return EPQ_RSX_STANDARD.inclined.low.kind
  }

  if (
    score >= EPQ_RSX_STANDARD.inclined.high.range[0] &&
    score < EPQ_RSX_STANDARD.inclined.high.range[1]
  ) {
    return EPQ_RSX_STANDARD.inclined.high.kind
  }

  if (score < EPQ_RSX_STANDARD.typical.low.max) {
    return EPQ_RSX_STANDARD.typical.low.kind
  }

  return EPQ_RSX_STANDARD.typical.hight.kind
}

export const calculateEpqRscResult = (
  values: EpqRscValue[],
  age: number,
  normGender: EpqRscNormGender[],
): EpqRscResult => {
  const sums: Record<EpqRscDimension, number> = values.reduce(
    (acc, item) => {
      acc[item.dimension] = (acc[item.dimension] || 0) + item.point

      return acc
    },
    { P: 0, N: 0, E: 0, L: 0 },
  )

  const record = normGender.find((v) =>
    v.range[1] ? age >= v.range[0] && age <= v.range[1] : age >= v.range[0],
  )!

  const data: EpqRscResult = (Object.keys(sums) as EpqRscDimension[]).reduce(
    (result: EpqRscResult, K: EpqRscDimension) => {
      const score =
        50 + roundToDecimalPlaces((10 * (sums[K] - record[K].M)) / record[K].SD)

      result[K] = { score, kind: matchKind(score) }

      return result
    },
    {} as EpqRscResult,
  )

  return data
}

export const calculateAge = (birthdate: Date): number => {
  const today = new Date()
  const birthyear = birthdate.getFullYear()
  const birthmonth = birthdate.getMonth()
  const birthday = birthdate.getDate()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()

  let age = currentYear - birthyear

  // 检查生日是否已经过了今年
  if (
    currentMonth < birthmonth ||
    (currentMonth === birthmonth && currentDay < birthday)
  ) {
    age--
  }

  return age
}

export const getTemperament = (
  e: number,
  n: number,
  temperaments: Temperaments,
): EpqRscResultKindDescription => {
  if (e < 50) {
    if (n < 50) {
      return { name: '粘液质', desc: temperaments['phlegmatic'] }
    } else {
      return { name: '抑郁质', desc: temperaments['melancholic'] }
    }
  }

  if (n < 50) {
    return { name: '多血质', desc: temperaments['sanguine'] }
  } else {
    return { name: '胆汁质', desc: temperaments['choleric'] }
  }
}
