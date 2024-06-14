import { useState, useEffect } from 'react'
import suspense from '~/advance/suspense'
import { LazyQuestion } from '~/pages'

interface QuestionProps extends EptQuestion {
  value?: EptValue
  updateValues: (index: number, value: EptValue) => void
  index: number
}

const EptQuestion = ({
  title,
  type,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number | undefined>(value?.point)

  useEffect(() => {
    setSelected(value?.point)
  }, [index, title, value])

  const handleChange = (v: number) => {
    setSelected(v)

    updateValues(index, { type, point: v })
  }

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={selected}
      handleChange={handleChange}
      options={options}
      useIndex={false}
    />,
  )
}

export default EptQuestion
