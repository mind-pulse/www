import { NoticeBar, Collapse } from 'antd-mobile'
import { useLocation } from 'react-router-dom'
import { ExpressionCalculator } from '~/utils'
import { Axis, Chart, Line, Point, Tooltip } from '@antv/f2'
import Canvas from '@antv/f2-react'
import FactorTab from './tab'
import Alert from '~/components/alert'
import suspense from '~/advance/suspense'
import { LazyBadge } from '~/pages'

interface SkeletonMapProps {
  data: { factor: SPFFactor; label: string; value: number }[]
}

const SkeletonMap = ({ data }: SkeletonMapProps) => {
  return (
    <Chart
      data={data}
      coord={{
        // 声明直角坐标系
        type: 'rect',
        // 坐标系进行转置
        transposed: true,
      }}
    >
      <Axis
        field="label"
        tickCount={16}
        style={{
          label: { align: 'between' },
        }}
      />

      <Axis
        field="value"
        min={1}
        max={10}
        tickCount={10}
        nice={false}
        style={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          grid: (__, index, _) => {
            return index === 3 || index === 6 ? { stroke: '#000' } : {}
          },
        }}
      />

      <Line x="label" y="value" />

      <Point x="label" y="value" />

      <Tooltip />
    </Chart>
  )
}

const getStandardScore = (ranges: SPFRange[], score: number): number => {
  for (let i = 0; i < 10; i++) {
    const range = ranges[i]

    if (typeof range === 'number') {
      if (range === score) {
        return i + 1
      }
    } else {
      if (score >= range[0] && score <= range[1]) {
        return i + 1
      }
    }
  }

  return -1
}

interface SPFSecondPersonalityFactorResultItem {
  key: SPFSecondPersonalityFactor['key']
  name: string
  score: number
  characteristic: string[] | SPFSecondPersonalityFactor['characteristic']
}

const Result = () => {
  const location = useLocation()
  const {
    result: originalResult,
    interpretation,
  }: { result: SPFResult; interpretation: SPFInterpretation } = location.state

  const isMiddle = (score: number, range?: [number, number]): boolean => {
    const finalRange = range ?? interpretation?.normal_range

    if (!finalRange) throw Error('interpretation 未初始化，需传入 range')

    return score > finalRange[0] && score < finalRange[1]
  }

  const isLow = (score: number, range?: [number, number]): boolean => {
    const finalRange = range ?? interpretation?.normal_range

    if (!finalRange) throw Error('interpretation 未初始化，需传入 range')

    return score <= finalRange[0]
  }

  const firstPersonalityFactor = interpretation.first_personality_factor.map(
    (f) => ({
      factor: f.factor,
      label: f.name,
      total: getStandardScore(
        interpretation.norm[f.factor].ranges,
        originalResult[f.factor],
      ),
    }),
  )

  const factorMap = firstPersonalityFactor.reduce(
    (o, v) => {
      o[v.factor] = v.total

      return o
    },
    {} as { [K in SPFFactor]: number },
  )

  const secondPersonalityFactor: SPFSecondPersonalityFactorResultItem[] =
    interpretation.second_personality_factor.map((f) => {
      const expressionCalculator = new ExpressionCalculator(
        f.expression,
        factorMap,
      )
      const score = expressionCalculator.calculate()

      const characteristic = isMiddle(score, interpretation.normal_range)
        ? f.characteristic
        : isLow(score, interpretation.normal_range)
        ? f.characteristic.low
        : f.characteristic.high

      return {
        key: f.key,
        name: f.name,
        score,
        characteristic,
      }
    })

  return (
    <div className="container text">
      <Alert
        content={[
          '卡特尔认为人类存在着所有社会成员共同具有的特质(共同特质)和个体独有的特质，即个别特质(指表面特质)。虽有共同特质，但共同特质在各个成员身上的强度却各不相同(指根源特质)，故而不同的人各个因素得分不可能相同。',
          '卡特尔认为人的气质根据表里可分为表面特质与根源特质。',
          '表面特质是指一群看起来似乎聚在一起的特征或行为，即可以观察到的各种行为表现，这些行为表现之间是具有相关性的。',
          '根源特质是行为的最终根源和原因。它们是堆砌成人格的砖块。每一个根源特质控制着一簇表面特质。透过对许多表面特质的因素分析便可找到它们所属的根源特质。',
          '本测试的目的是测试你的根源特质处于什么水平，不要将你的表面特质与本结果中对根源特质水平的描述进行比较。',
        ]}
        defaultShow={true}
        wait={import.meta.env.MODE === 'production' ? 10 : 0}
      />

      <div style={{ width: '100%', height: '30rem' }}>
        <Canvas pixelRatio={window.devicePixelRatio}>
          <SkeletonMap
            data={firstPersonalityFactor.map((i) => ({
              factor: i.factor,
              label: i.label,
              value: i.total,
            }))}
          />
        </Canvas>
      </div>

      <FactorTab
        items={[
          {
            title: '一阶因素',
            content: (
              <Collapse accordion>
                {firstPersonalityFactor.map((item, idx) => (
                  <Collapse.Panel
                    key={String(idx)}
                    title={suspense(
                      <LazyBadge
                        badge={item.total}
                        content={`${item.label}(${item.factor})`}
                        right={10}
                      />,
                    )}
                  >
                    {isMiddle(item.total) ? (
                      <>
                        <NoticeBar
                          color="info"
                          wrap
                          content="您的得分处于中间水平，可能同时具有部分低分特征和部分高分特征。"
                        />

                        <div className="indent">
                          <div>
                            <span className="emphasize">低分特征</span>：
                            {
                              interpretation.first_personality_factor[idx]
                                .characteristic.low
                            }
                          </div>

                          <div>
                            <span className="emphasize">高分特征</span>：
                            {
                              interpretation.first_personality_factor[idx]
                                .characteristic.high
                            }
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="indent">
                        {isLow(item.total)
                          ? interpretation.first_personality_factor[idx]
                              .characteristic.low
                          : interpretation.first_personality_factor[idx]
                              .characteristic.high}
                      </div>
                    )}

                    <div className="indent">
                      <span className="emphasize">职业建议</span>：
                      {interpretation.first_personality_factor[idx].occupations}
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            ),
          },
          {
            title: '二阶因素',
            content: (
              <Collapse accordion>
                {secondPersonalityFactor?.map((item) => (
                  <Collapse.Panel
                    key={item.key}
                    title={suspense(
                      <LazyBadge
                        badge={item.score}
                        content={`${item.name}(${item.key})`}
                        right={15}
                      />,
                    )}
                  >
                    {Array.isArray(item.characteristic) ? (
                      <div className="indent">{item.characteristic}</div>
                    ) : (
                      <div>
                        <NoticeBar
                          color="info"
                          wrap
                          content="您的得分处于中间水平，可能同时具有部分低分特征和部分高分特征。"
                        />

                        <div className="indent">
                          <div>
                            <span className="emphasize">低分特征</span>：
                            {item.characteristic.low}
                          </div>

                          <div>
                            <span className="emphasize">高分特征</span>：
                            {item.characteristic.high}
                          </div>
                        </div>
                      </div>
                    )}
                  </Collapse.Panel>
                ))}
              </Collapse>
            ),
          },
        ]}
      />
    </div>
  )
}

export default Result
