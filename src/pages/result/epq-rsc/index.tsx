import { useLocation } from 'react-router-dom'
import { NoticeBar, Collapse, Tag } from 'antd-mobile'
import { getTemperament } from '~/pages/scale/items/epq-rsc'
import CoordinateSystem from './coordinate-system'
import './index.scss'
import suspense from '~/advance/suspense'
import { LazyBadge } from '~/pages'

const EpqRscResult = () => {
  const location = useLocation()
  const {
    result,
    interpretation,
  }: { interpretation: EpqRscInterpretation; result: EpqRscResult } =
    location.state

  const getInterpretation = (
    dimension: EpqRscDimension,
    level: EpqRscResultLevel,
  ): string[] => {
    switch (level) {
      case 0:
        return interpretation.dimensions[dimension].dimension.osculant
      case 1:
        return interpretation.dimensions[dimension].dimension.inclined.high
      case 2:
        return interpretation.dimensions[dimension].dimension.typical.high
      case -1:
        return interpretation.dimensions[dimension].dimension.inclined.low
      case -2:
        return interpretation.dimensions[dimension].dimension.typical.low
    }
  }

  const temperament = getTemperament(
    result.E.score,
    result.N.score,
    interpretation.temperaments,
  )

  return (
    <div className="container text">
      <Collapse defaultActiveKey={['coordinate-system']}>
        {(Object.keys(result) as EpqRscDimension[]).map((k) => (
          <Collapse.Panel
            key={k}
            title={
              <div>
                <Tag
                  color={
                    result[k].kind.level === 0
                      ? 'success'
                      : Math.abs(result[k].kind.level) === 1
                      ? 'warning'
                      : 'danger'
                  }
                  className="qualitative"
                >
                  {result[k].kind.label}
                </Tag>

                {suspense(
                  <LazyBadge
                    badge={result[k].score.toFixed(2)}
                    content={interpretation.dimensions[k].label}
                    right={20}
                  />,
                )}
              </div>
            }
          >
            {interpretation.dimensions[k].notice ? (
              <NoticeBar
                color="info"
                content={interpretation.dimensions[k].notice}
              />
            ) : null}

            {getInterpretation(k, result[k].kind.level).map((s, i) => (
              <div key={i} className="indent">
                {s}
              </div>
            ))}

            {interpretation.dimensions[k].supplementary?.map((s, i) => (
              <div key={i} className="indent">
                {s}
              </div>
            ))}
          </Collapse.Panel>
        ))}

        <Collapse.Panel
          title="内外向与神经质的十字坐标图"
          key="coordinate-system"
        >
          <CoordinateSystem
            E={result.E.score}
            N={result.N.score}
            color={
              Math.abs(result.E.kind.level) > Math.abs(result.N.kind.level)
                ? result.E.kind.color
                : result.N.kind.color
            }
          />

          <div>
            <div className="indent">
              您的气质类型为：
              <span className="emphasize">{temperament.name}</span>。
            </div>

            {temperament.desc.map((s, i) => (
              <div key={i} className="indent">
                {s}
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default EpqRscResult
