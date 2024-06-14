import { useRef, useState, useEffect } from 'react'

interface CoordinateSystemProps {
  E: number
  N: number
  color: string
}

const EPQ_RSX_STANDARD = {
  osculant: [43.3, 56.7],
  propensity: {
    low: [38.5, 43.3],
    high: [56.7, 61.5],
  },
  typical: {
    veryLow: 38.5,
    veryHigh: 61.5,
  },
}

const CoordinateSystem = ({ E, N, color }: CoordinateSystemProps) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const current = divRef.current
    if (!current) return

    const divWidth = current.offsetWidth
    setScale((divWidth - 20) / 90)

    // You can use the divWidth to calculate and set the SVG transform or perform other actions
  }, [divRef])

  const width = 80
  const height = 80
  // 计算坐标系的中心点
  const centerX = 40
  const centerY = 50
  const tickLength = 2 // 刻度线长度
  const tickWidth = 0.2 // 刻度宽度
  const axisWidth = 0.2 // 坐标轴宽度
  const markLineWidth = 0.1 // 标记线宽度
  const tickFontSize = 3 // 刻度值字体大小

  const dasharray = 1 // 虚线单位长度和间距

  // 修改刻度值范围为[20, 80]
  const xMin = 20
  const xMax = 80
  const yMin = 20
  const yMax = 80

  const renderXAxisTicks = () => {
    const ticks = []
    for (let x = xMin; x <= xMax; x += 5) {
      if (x === 50) continue
      const xPosition = centerX + (x - 50) // 调整X轴刻度位置
      ticks.push(
        <line
          key={`x-tick-${x}`}
          x1={xPosition}
          y1={centerY - tickLength / 2}
          x2={xPosition}
          y2={centerY}
          stroke="black"
          strokeWidth={tickWidth}
        />,
      )
      if (x % 10 === 0) {
        ticks.push(
          <text
            key={`x-tick-label-${x}`}
            x={xPosition}
            y={centerY + tickFontSize}
            textAnchor="middle"
            fontSize={tickFontSize}
          >
            {x}
          </text>,
        )
      }
    }
    return ticks
  }

  const renderYAxisTicks = () => {
    const ticks = []
    for (let y = yMin; y <= yMax; y += 5) {
      if (y === 50) continue
      const yPosition = centerY - (y - 50) // 调整Y轴刻度位置
      ticks.push(
        <line
          key={`y-tick-${y}`}
          x1={centerX}
          y1={yPosition}
          x2={centerX + tickLength / 2}
          y2={yPosition}
          stroke="black"
          strokeWidth={tickWidth}
        />,
      )
      if (y % 10 === 0) {
        ticks.push(
          <text
            key={`y-tick-label-${y}`}
            x={centerX - 1}
            y={yPosition + 1}
            textAnchor="end"
            fontSize={tickFontSize}
          >
            {y}
          </text>,
        )
      }
    }
    return ticks
  }

  return (
    <div ref={divRef} id="coordinate-system-container">
      <svg
        width={width + 10}
        height={height + 10}
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `scale(${scale})` }}
      >
        {/* 绘制坐标轴的X轴 */}
        <line
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          stroke="black"
          strokeWidth={axisWidth}
        />
        {renderXAxisTicks()}

        {/* 绘制坐标轴的Y轴 */}
        <line
          x1={centerX}
          y1={10}
          x2={centerX}
          y2={height + 10}
          stroke="black"
          strokeWidth={axisWidth}
        />
        {renderYAxisTicks()}

        {/* 绘制上标记线 */}
        <line
          x1={0}
          x2={width}
          y1={height - EPQ_RSX_STANDARD.typical.veryHigh + 20}
          y2={height - EPQ_RSX_STANDARD.typical.veryHigh + 20}
          stroke="gray"
          strokeWidth={markLineWidth}
          strokeDasharray={dasharray}
        />
        <line
          x1={0}
          x2={width}
          y1={height - EPQ_RSX_STANDARD.osculant[1] + 20}
          y2={height - EPQ_RSX_STANDARD.osculant[1] + 20}
          stroke="gray"
          strokeWidth={markLineWidth}
        />

        {/* 绘制下标记线 */}
        <line
          x1={0}
          x2={width}
          y1={height - EPQ_RSX_STANDARD.osculant[0] + 20}
          y2={height - EPQ_RSX_STANDARD.osculant[0] + 20}
          stroke="gray"
          strokeWidth={markLineWidth}
        />
        <line
          x1={0}
          x2={width}
          y1={height - EPQ_RSX_STANDARD.typical.veryLow + 20}
          y2={height - EPQ_RSX_STANDARD.typical.veryLow + 20}
          stroke="gray"
          strokeWidth={markLineWidth}
          strokeDasharray={dasharray}
        />

        {/* 绘制左标记线 */}
        <line
          x1={EPQ_RSX_STANDARD.typical.veryLow - 10}
          x2={EPQ_RSX_STANDARD.typical.veryLow - 10}
          y1={10}
          y2={height + 10}
          stroke="gray"
          strokeWidth={markLineWidth}
          strokeDasharray={dasharray}
        />
        <line
          x1={EPQ_RSX_STANDARD.osculant[0] - 10}
          x2={EPQ_RSX_STANDARD.osculant[0] - 10}
          y1={10}
          y2={height + 10}
          stroke="gray"
          strokeWidth={markLineWidth}
        />

        {/* 绘制右标记线 */}
        <line
          x1={EPQ_RSX_STANDARD.typical.veryHigh - 10}
          x2={EPQ_RSX_STANDARD.typical.veryHigh - 10}
          y1={10}
          y2={height + 10}
          stroke="gray"
          strokeWidth={markLineWidth}
          strokeDasharray={dasharray}
        />
        <line
          x1={EPQ_RSX_STANDARD.osculant[1] - 10}
          x2={EPQ_RSX_STANDARD.osculant[1] - 10}
          y1={10}
          y2={height + 10}
          stroke="gray"
          strokeWidth={markLineWidth}
        />

        <circle cx={E - 10} cy={height - N + 20} r="1" fill={color} />

        <text fontSize="3">
          <tspan x={0} y={13}>
            内向、不稳定
          </tspan>
          <tspan x={0} y={17}>
            抑郁质
          </tspan>
        </text>
        <text fontSize="3">
          <tspan x={width - 18} y={13}>
            外向、不稳定
          </tspan>
          <tspan x={width - 9} y={17}>
            胆汁质
          </tspan>
        </text>
        <text fontSize="3">
          <tspan x={0} y={height - 5 + 10}>
            内向、稳定
          </tspan>
          <tspan x={0} y={height - 1 + 10}>
            粘液质
          </tspan>
        </text>
        <text fontSize="3">
          <tspan x={width - 15} y={height - 5 + 10}>
            外向、稳定
          </tspan>
          <tspan x={width - 9} y={height - 1 + 10}>
            多血质
          </tspan>
        </text>

        {/* 在X轴右侧添加文本"外向性" */}
        <text textAnchor="end">
          <tspan x={width + 9} y={centerY - 1} fontSize={3}>
            维度 E
          </tspan>
          <tspan x={width + 9.5} y={centerY + 2} fontSize={2.5}>
            (外向性)
          </tspan>
        </text>

        {/* 在Y轴上方添加文本"神经质" */}
        <text textAnchor="end">
          <tspan x={width / 2 + 5} y={6} fontSize={3}>
            维度 N
          </tspan>
          <tspan x={width / 2 + 5.5} y={9} fontSize={2.5}>
            (神经质)
          </tspan>
        </text>
      </svg>
    </div>
  )
}

export default CoordinateSystem
