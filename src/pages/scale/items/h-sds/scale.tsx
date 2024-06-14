import { useEffect } from 'react'
import Question from './question'
import { getRandomIndex, getRandomIndices } from '~/utils'

interface HSDSProps {
  scale: Scale<HSDSQuestion, HSDSInterpretation>
  currentIndex: number
  values: HSDSValue[]
  setValues: SetStateAction<HSDSValue[]>
  setCalculateResult: SetStateAction<(values: HSDSValue[]) => HSDSResult>
}

const HSDSScale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: HSDSProps) => {
  useEffect(() => {
    const questionType = scale.questions[currentIndex].question_type

    if (questionType === 'CAPACITY_CATEGORY') return

    if (values[currentIndex] === undefined)
      setValues((pre) => {
        const arr = [...pre]
        arr[currentIndex] = {
          question_type: questionType,
          capacity_category: scale.questions[currentIndex].capacity_category,
          selected: [] as number[],
        }

        return arr
      })
  }, [values, currentIndex])

  useEffect(() => {
    if (
      import.meta.env.MODE === 'development' &&
      values.length < scale.questions.length
    ) {
      scale.questions.forEach((v, i) => {
        if (v.question_type !== 'CAPACITY_CATEGORY') {
          updateValues(i, {
            question_type: v.question_type,
            capacity_category: v.capacity_category,
            selected: getRandomIndices(v.options),
          })
        } else {
          updateValues(i, {
            question_type: v.question_type,
            capacity_category: v.capacity_category,
            selected: getRandomIndex(v.options),
          })
        }
      })
    }

    setCalculateResult(() => {
      return (vs: HSDSValue[]) => {
        const sums: { [K in HSDSCapacityCategoryType]: number } = {} as {
          [K in HSDSCapacityCategoryType]: number
        }

        vs.forEach((v) => {
          const selected = v.selected

          sums[v.capacity_category] =
            (sums[v.capacity_category] ?? 0) +
            (typeof selected === 'number' ? selected : selected.length)
        })

        const result: HSDSResult = (
          Object.keys(sums) as HSDSCapacityCategoryType[]
        ).map((k) => ({
          capacity_category: k,
          total: sums[k],
        }))

        result.sort((a, b) => b.total - a.total)

        return result
      }
    })
  }, [])

  const updateValues = (index: number, value: HSDSValue) => {
    setValues((prev) => {
      const arr = [...prev]

      arr[index] = value

      return arr
    })
  }

  if (!scale || currentIndex === -1) {
    return null
  }

  const currentQuestion = scale.questions[currentIndex]

  return (
    <Question
      {...currentQuestion}
      index={currentIndex}
      value={values[currentIndex]}
      updateValues={updateValues}
      question_type={scale.questions[currentIndex].question_type}
      capacity_category={scale.questions[currentIndex].capacity_category}
    />
  )
}

export default HSDSScale
