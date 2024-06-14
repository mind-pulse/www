import suspense from '~/advance/suspense'
import { LazyQuestion } from '~/pages'

interface QuestionProps extends CommonQuestion {
  value?: number
  updateValues: (index: number, point: number) => void
  index: number
}

const CommonQuestion = ({
  title,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const handleChange = (v: number) => {
    updateValues(index, v)
  }

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={value}
      handleChange={handleChange}
      options={options}
      useIndex={false}
    />,
  )
}

export default CommonQuestion
