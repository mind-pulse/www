import Checklist from './checklist'
import './index.scss'

type InferValueType<B extends boolean> = B extends true ? number[] : number

interface QuestionProps<M extends boolean> {
  index: number
  title: string
  selected?: InferValueType<M>
  handleChange: (v: InferValueType<M>) => void
  options: Option[]
  useIndex?: boolean
  prefix?: string[]
  multiple?: boolean
  textCentered?: boolean
}

const Question = <M extends boolean>({
  index,
  title,
  selected,
  handleChange,
  options,
  useIndex = true,
  prefix,
  multiple,
  textCentered,
}: QuestionProps<M>) => {
  const onChange = (val: number[]) => {
    // 在单选时禁止空选择
    if (!multiple && val.length === 0) return

    if (!multiple) {
      const v = val[0]

      if (typeof v !== 'number') {
        throw Error(`不正确的类型：${v} -> string`)
      }

      handleChange(v as InferValueType<M>)
    } else {
      handleChange(val as InferValueType<M>)
    }
  }

  return (
    <div className="question">
      <div className="title">
        <span>{index + 1 + '. ' + title}</span>
      </div>

      <div>
        <Checklist
          radio={!multiple}
          value={
            selected === undefined
              ? []
              : typeof selected === 'number'
                ? [selected]
                : selected
          }
          prefix={prefix}
          options={options}
          useIndex={useIndex}
          onChange={onChange}
          textCentered={textCentered}
        />
      </div>
    </div>
  )
}

export type QuestionType = typeof Question

export default Question
