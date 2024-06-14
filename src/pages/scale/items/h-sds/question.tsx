import { useEffect, useState } from 'react'
import suspense from '~/advance/suspense'
import { LazyQuestion } from '~/pages'

interface QuestionProps extends HSDSQuestion {
  value?: HSDSValue // 默认值或已选择值
  updateValues: (index: number, value: HSDSValue) => void
  index: number
}

const Scl90Question = ({
  title,
  question_type,
  capacity_category,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number[] | undefined>(
    value
      ? typeof value.selected === 'number'
        ? [value.selected]
        : value.selected
      : undefined,
  )

  useEffect(() => {
    setSelected(
      value
        ? typeof value.selected === 'number'
          ? [value.selected]
          : value.selected
        : undefined,
    )
  }, [index, title, value])

  const handleChange = (v: number | number[]) => {
    setSelected(typeof v === 'number' ? [v] : v)

    if (question_type === 'CAPACITY_CATEGORY') {
      updateValues(index, {
        question_type,
        capacity_category,
        selected: v as number,
      })
    } else {
      updateValues(index, {
        question_type,
        capacity_category,
        selected: v as number[],
      })
    }
  }

  return suspense(
    <LazyQuestion
      index={index}
      title={title}
      selected={selected}
      handleChange={handleChange}
      options={options}
      multiple={question_type !== 'CAPACITY_CATEGORY'}
      textCentered={question_type === 'CAPACITY_CATEGORY'}
    />,
  )
}

export default Scl90Question
