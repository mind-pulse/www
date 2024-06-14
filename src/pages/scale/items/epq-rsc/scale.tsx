import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import {
  Dialog,
  NoticeBar,
  Form,
  Radio,
  Button,
  DatePicker,
  Grid,
} from 'antd-mobile'
import type { DatePickerRef } from 'antd-mobile'
import { randomChoice, randomInt, subtractYears } from '~/utils'
import Question from './question'
import { calculateAge, calculateEpqRscResult } from '.'
import { useNavigate } from 'react-router-dom'

interface EpqRscProps {
  scale: Scale<EpqRscQuestion, EpqRscInterpretation>
  currentIndex: number
  values: EpqRscValue[]
  setValues: SetStateAction<EpqRscValue[]>
  setCalculateResult: SetStateAction<(values: EpqRscValue[]) => EpqRscResult>
}

const EpqRscScale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: EpqRscProps) => {
  const navigate = useNavigate()

  const [showDialog, setShowDialog] = useState(
    import.meta.env.MODE === 'development' ? false : true,
  )
  const [gender, setGender] = useState<keyof EpqRscNorm | null>(null)
  const [age, setAge] = useState(0)

  useEffect(() => {
    setCalculateResult(() => {
      return (vs: EpqRscValue[]) => {
        const norm = (scale.interpretation as EpqRscInterpretation).norm

        if (import.meta.env.MODE === 'development') {
          return calculateEpqRscResult(
            vs,
            randomInt(43, 100),
            norm[
              randomChoice([
                'male',
                'female',
              ]) as keyof EpqRscInterpretation['norm']
            ],
          )
        }

        return calculateEpqRscResult(vs, age, norm[gender!])
      }
    })
  }, [age, gender])

  const updateValues = (index: number, value: EpqRscValue) => {
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
          dimension: v.dimension,
          point: randomChoice(v.options, 'point'),
        })
      })
  }, [])

  if (!scale || currentIndex === -1) {
    return null
  }

  const checkAge = async () => {
    if (age) return

    return new Error('请选择出生日期')
  }

  const currentQuestion = scale.questions[currentIndex]

  return (
    <div>
      <Dialog
        visible={showDialog}
        content={
          <>
            <NoticeBar
              color="info"
              wrap
              content="您的测试结果本小程序不会保存，请一定根据自己的实际情况回答，否则测试结果不具有参考性。"
            />

            <Form
              layout="horizontal"
              footer={
                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <Button
                      block
                      color="default"
                      onClick={() => navigate('/', { replace: true })}
                    >
                      取消
                    </Button>
                  </Grid.Item>

                  <Grid.Item>
                    <Button
                      block
                      type="submit"
                      color="primary"
                      onClick={() => setShowDialog(false)}
                    >
                      确认
                    </Button>
                  </Grid.Item>
                </Grid>
              }
            >
              <Form.Item
                label="您的性别"
                name="gender"
                rules={[{ required: true }]}
              >
                <Radio.Group onChange={(v) => setGender(v as keyof EpqRscNorm)}>
                  <Radio value="male" style={{ marginRight: '1.5rem' }}>
                    男
                  </Radio>

                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="date"
                label={age ? '您的年龄' : '出生日期'}
                rules={[{ required: true }, { validator: checkAge }]}
                trigger="onConfirm"
                onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
                  datePickerRef.current?.open()
                }}
              >
                {age ? (
                  age
                ) : (
                  <DatePicker
                    min={new Date(1923, 0, 1)}
                    max={subtractYears(new Date(), 16)}
                    onConfirm={(val) => {
                      const age = calculateAge(val)
                      setAge(age)
                    }}
                  >
                    {(value) => (value ? '' : '选择出生日期')}
                  </DatePicker>
                )}
              </Form.Item>
            </Form>
          </>
        }
      />

      <Question
        {...currentQuestion}
        index={currentIndex}
        value={values[currentIndex]}
        updateValues={updateValues}
        dimension={scale.questions[currentIndex].dimension}
      />
    </div>
  )
}

export default EpqRscScale
