import { useEffect } from 'react'
import { randomChoice } from '~/utils'
import EptQuestion from './question'
import { calculateEptResult } from '.'

interface EptProps {
  scale: Scale<EptQuestion, EptInterpretation>
  currentIndex: number
  values: EptValue[]
  setValues: SetStateAction<EptValue[]>
  setCalculateResult: SetStateAction<(values: EptValue[]) => EptResult>
}

const EPTScale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: EptProps) => {
  const updateValues = (index: number, value: EptValue) => {
    setValues((prev) => {
      const arr = [...prev]

      arr[index] = value

      return arr
    })
  }

  useEffect(() => {
    process.env.NODE_ENV === 'development' &&
      values.length < scale.questions.length &&
      scale.questions.forEach((v, i) => {
        updateValues(i, {
          type: v.type,
          point: randomChoice(v.options, 'point'),
        })
      })

    setCalculateResult(() => {
      return (vs: EptValue[]) => {
        const result = calculateEptResult(vs)

        return result
      }
    })
  }, [])

  if (!scale || currentIndex === -1) {
    return null
  }

  const currentQuestion = scale.questions[currentIndex]

  return (
    <EptQuestion
      {...currentQuestion}
      index={currentIndex}
      value={values[currentIndex]}
      updateValues={updateValues}
    />
  )
}

export default EPTScale
