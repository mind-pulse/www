import suspense from '~/advance/suspense'
import { LazyQuestion } from '~/pages'

interface QuestionProps extends CommonQuestion {
  value?: number
  updateValues: (index: number, point: number) => void
  index: number
  setIndex: SetStateAction<number>
}

const YBocsQuestion = ({
  title,
  options,
  index,
  setIndex,
  value,
  updateValues,
}: QuestionProps) => {
  const handleChange = (v: number) => {
    if ((index === 0 || index === 5) && v === 0) {
      for (let i = index; i < 5 + index; i++) {
        updateValues(i, 0)
      }

      setIndex(index + 5 > 9 ? 9 : 5)

      return
    }

    updateValues(index, v)
  }

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={value}
      handleChange={handleChange}
      options={options}
    />,
  )
}

export default YBocsQuestion
