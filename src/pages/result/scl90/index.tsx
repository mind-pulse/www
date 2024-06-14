import {
  Divider,
  NoticeBar,
  Collapse,
  Tag,
  AutoCenter,
  Card,
} from 'antd-mobile'
import { ExclamationCircleFill, CheckCircleFill } from 'antd-mobile-icons'
import Canvas from '@antv/f2-react'
import { Chart, Axis, Area, Point, Line } from '@antv/f2'
import { Color } from '~/utils/color'
import { useLocation } from 'react-router-dom'
import Alert from '~/components/alert'
import './index.scss'
import { WARNING } from '..'
import suspense from '~/advance/suspense'
import { LazyBadge } from '~/pages'

interface RadarChartProps {
  data: { item: string; value: number }[]
}

const yesBaseColor = new Color(129, 100, 32).hex()
const noBaseColor = new Color(33, 73, 64).hex()

const RadarChart = ({ data }: RadarChartProps) => {
  return (
    <Chart
      data={data}
      coord="polar"
      scale={{
        value: {
          min: 0,
          max: 4,
        },
      }}
    >
      <Axis field="item" />

      <Axis field="value" />

      <Line x="item" y="value" color={yesBaseColor} />

      <Area x="item" y="value" color={yesBaseColor} />

      <Point
        x="item"
        y="value"
        color={{
          field: 'value',
          callback: (v: number) => {
            return v >= 2 ? noBaseColor : yesBaseColor
          },
        }}
      />
    </Chart>
  )
}

const Scl90Result = () => {
  const location = useLocation()
  const {
    result,
    interpretation,
  }: { result: Scl90Result; interpretation: Scl90Interpretation } =
    location.state

  return (
    <div className="container text">
      <Alert
        content={[
          <NoticeBar content={WARNING} wrap color="alert" />,
          '本测试仅适用于初步的症状筛选，存在一定的误差。如果您的测试结果中有某些因子为阳性，则需要选择对应症状的专用测试或去寻找心理医生进行进一步评估。',
        ]}
        defaultShow={true}
        wait={import.meta.env.MODE === 'production' ? 5 : 0}
      />

      <div id="chart" style={{ width: '100%', height: 300 }}>
        <Canvas pixelRatio={window.devicePixelRatio}>
          <RadarChart
            data={(Object.keys(result.symptomsAverage) as Scl90Symptom[]).map(
              (k) => ({
                item: interpretation.symptoms[k].name,
                value: result.symptomsAverage[k],
              }),
            )}
          />
        </Canvas>
      </div>

      {result.total >= 160 ||
      result.positiveAmount > 43 ||
      Object.values(result.symptomsAverage).some((value) => value > 2) ? (
        <Card>
          <AutoCenter className="scl-90-result-status">
            <ExclamationCircleFill
              color="#ff8f1f"
              style={{ marginRight: '0.5rem' }}
            />
            您存在一些阳性症状
          </AutoCenter>
        </Card>
      ) : (
        <Card>
          <AutoCenter className="scl-90-result-status">
            <CheckCircleFill
              color="#00b578"
              style={{ marginRight: '0.5rem' }}
            />
            您没有任何阳性症状
          </AutoCenter>
        </Card>
      )}

      <Divider contentPosition="center">各个因子分</Divider>

      <NoticeBar
        color="info"
        content="下面的各因子症状描述为普适性描述，并非针对您个人，其中可能存在您不具有的行为表现或症状。"
      />

      <Collapse>
        {(Object.keys(result.symptomsAverage) as Scl90Symptom[]).map((k) => (
          <Collapse.Panel
            key={k}
            title={
              <div className="scl-90-title">
                {k !== 'OTHER' ? (
                  result.symptomsAverage[k] >= 2 ? (
                    <Tag color="danger" className="qualitative">
                      阳性
                    </Tag>
                  ) : (
                    <Tag color="success" className="qualitative">
                      阴性
                    </Tag>
                  )
                ) : null}

                {k !== 'OTHER' ? (
                  suspense(
                    <LazyBadge
                      right={15}
                      badge={result.symptomsAverage[k].toFixed(2)}
                      content={
                        <span className="scl-90-title__name">
                          {interpretation.symptoms[k].name}
                        </span>
                      }
                    />,
                  )
                ) : (
                  <span className="scl-90-title__name">
                    {interpretation.symptoms[k].name}
                  </span>
                )}
              </div>
            }
          >
            <div className="indent">{interpretation.symptoms[k].symptom}</div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  )
}

export default Scl90Result
