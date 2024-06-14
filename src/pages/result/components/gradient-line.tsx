import { Color } from '~/utils'
import './GradientLine.scss' // 引入样式文件
import { Button, NoticeBar } from 'antd-mobile'
import { useState } from 'react'

interface GradientLineProps {
  tip?: string
  lowText: string
  highText: string
  min: number
  max: number
  value: number
  colors: Color[]
}

const GradientLine = ({
  tip,
  min,
  max,
  value,
  lowText,
  highText,
  colors,
}: GradientLineProps) => {
  const normalizedValue = Math.min(Math.max(value, min), max)

  // 计算标记位置的百分比
  const markerPosition = ((normalizedValue - min) / (max - min)) * 100

  // 动态生成渐变色样式
  const gradientColors = colors.map((c) => c.toString()).join(', ')

  const markerColor = new Color(
    ((colors[colors.length - 1].hue - colors[0].hue) * markerPosition) / 100,
    colors[0].saturation,
    colors[0].lightness,
  )

  const [detail, setDetail] = useState<{ text: string; key: '高' | '低' }>(
    markerPosition < 50
      ? {
        text: lowText,
        key: '低',
      }
      : {
        text: highText,
        key: '高',
      },
  )

  return (
    <>
      {tip ? <NoticeBar content={tip} /> : null}
      <div className="gradient-line-container">
        <div className="left-text">
          <Button
            onClick={() => setDetail({ text: lowText, key: '低' })}
            disabled={detail.key === '低'}
            size="small"
          >
            低
          </Button>
        </div>
        <div
          className="gradient-line"
          style={{ background: `linear-gradient(to right, ${gradientColors})` }}
        >
          <div
            className="marker"
            style={{
              left: `${markerPosition}%`,
              backgroundColor: markerColor.toString(),
            }}
          ></div>
        </div>
        <div className="right-text">
          <Button
            onClick={() => setDetail({ text: highText, key: '高' })}
            disabled={detail.key === '高'}
            size="small"
          >
            高
          </Button>
        </div>
      </div>

      <div className="detail">
        <div className="title">{detail.key}分数的特点：</div>
        <div className="text indent">{detail.text}</div>
      </div>
    </>
  )
}

export default GradientLine
