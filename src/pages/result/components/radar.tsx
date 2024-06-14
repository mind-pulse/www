import { Area, Axis, Chart, Line, Point } from "@antv/f2";
import Canvas from "@antv/f2-react";
import type { DataRecord, DataRecordScale } from "@antv/f2/es/chart/Data";
import type { StyleProps } from "@antv/f2/es/components/axis/types";
import type { ScaleOption } from "@antv/f2/es/controller/scale";
import type React from "react";
import type { Color } from "~/utils";

interface DataItem<T extends { [K: string]: number }> {
  item: string;
  fields: T;
}

export interface RadarChartProps<T extends { [K: string]: number }> {
  data: DataItem<T>[];
  axisKey?: keyof T;
  colors?: { [K in string]: Color }; // 键应该包含全部的 DataItem 中的键
  labelFontSize?: number;
  itemStyle?: StyleProps["label"];
  scaleOption?: ScaleOption;
}

const RadarChart = <T extends { [K: string]: number }>({
  data,
  colors,
  axisKey,
  itemStyle,
  scaleOption,
}: RadarChartProps<T>) => {
  const dataKeys = Object.keys(data[0].fields);
  if (dataKeys.length > 1 && !axisKey) {
    throw new Error(
      "数据中含有多个属性时必须指定其中一个属性 `axisKey` 作为极坐标的轴。",
    );
  }

  const lines: React.ReactNode[] = [];
  const areas: React.ReactNode[] = [];
  const points: React.ReactNode[] = [];

  for (const k of dataKeys) {
    const props = {
      key: k,
      y: k,
      color: colors?.[k].hex(),
    };
    lines.push(<Line x="item" {...props} />);
    areas.push(<Area x="item" {...props} />);
    points.push(<Point x="item" {...props} />);
  }

  const scaleOpt =
    scaleOption &&
    ({ [axisKey ?? dataKeys[0]]: scaleOption } as DataRecordScale<DataRecord>);

  return (
    <Canvas pixelRatio={window.devicePixelRatio}>
      <Chart
        data={convertData(data)}
        coord={{
          type: "polar",
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
  );
};

const convertData = <T extends { [K: string]: number }>(
  data: DataItem<T>[],
) => {
  const converted: Record<string, number | string>[] = [];

  for (const di of data) {
    converted.push({
      item: di.item,
      ...di.fields,
    });
  }

  return converted;
};

export default RadarChart;
