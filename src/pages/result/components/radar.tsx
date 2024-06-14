import Canvas from '@antv/f2-react'
import { Chart, Axis, Area, Point, Line } from '@antv/f2'
import type { StyleProps } from '@antv/f2/es/components/axis/types'
import type { ScaleOption } from '@antv/f2/es/controller/scale'
import type { DataRecordScale, DataRecord } from '@antv/f2/es/chart/Data'
import { Color } from '~/utils'
import React from 'react'

interface DataItem<T extends { [K: string]: number }> {
  item: string
  fields: T
}

export interface RadarChartProps<T extends { [K: string]: number }> {
  data: DataItem<T>[]
  axisKey?: keyof T
  colors?: { [K in string]: Color } // 键应该包含全部的 DataItem 中的键
  labelFontSize?: number
  itemStyle?: StyleProps['label']
  scaleOption?: ScaleOption
}

const RadarChart = <T extends { [K: string]: number }>({
  data,
  colors,
  axisKey,
  itemStyle,
  scaleOption,
}: RadarChartProps<T>) => {
  const dataKeys = Object.keys(data[0].fields)
  if (dataKeys.length > 1 && !axisKey) {
    throw new Error(
      '数据中含有多个属性时必须指定其中一个属性 `axisKey` 作为极坐标的轴。',
    )
  }

  const lines: React.ReactNode[] = [],
    areas: React.ReactNode[] = [],
    points: React.ReactNode[] = []

  dataKeys.forEach((k) => {
    const props = {
      key: k,
      y: k,
      color: colors && colors[k].hex(),
    }
    lines.push(<Line x="item" {...props} />)
    areas.push(<Area x="item" {...props} />)
    points.push(<Point x="item" {...props} />)
  })

  const scaleOpt =
    scaleOption &&
    ({ [axisKey ?? dataKeys[0]]: scaleOption } as DataRecordScale<DataRecord>)

  return (
    <Canvas pixelRatio={window.devicePixelRatio}>
      <Chart
        data={convertData(data)}
        coord={{
          type: 'polar',
          radius: 1,
        }}
        scale={scaleOpt}
      >
        <Axis field="item" style={{ label: itemStyle }} />
        <Axis field={(axisKey as string | undefined) ?? dataKeys[0]} />

        {lines}
        {areas}
        {points}
      </Chart>
    </Canvas>
  )
}

const convertData = <T extends { [K: string]: number }>(
  data: DataItem<T>[],
) => {
  const converted: Record<string, number | string>[] = []

  data.forEach((di) => {
    converted.push({
      item: di.item,
      ...di.fields,
    })
  })

  return converted
}

export default RadarChart
