import { useLocation } from "react-router-dom";
import Alert from "~/components/alert";
import Radar from "~/pages/result/components/radar";
import { types } from "~/pages/scale/items/ept";
import { Color, getMaxIndexes, getMinIndexes } from "~/utils";
import EptType from "./type";

type Interpretations = { [K in EptTypes]: EptInterpretationItem };

const EptResult = () => {
  const location = useLocation();
  const {
    result,
    interpretation: originalInterpretation,
  }: {
    result: EptResult;
    interpretation: EptInterpretation;
  } = location.state;

  const interpretation = originalInterpretation.type_interpretations.reduce(
    (acc, item) => {
      acc[item.type] = item;

      return acc;
    },
    {} as Interpretations,
  );

  const maxIndexes = getMaxIndexes(result, "total", "yes");
  // 存在多个最大值时，no 值较小者为最可能的人格
  const typeIndexes =
    maxIndexes.length === 1
      ? [maxIndexes[0]]
      : getMinIndexes(
          maxIndexes.map((i) => result[i]),
          "total",
          "no",
        ).map((i) => maxIndexes[i]);

  return (
    <div className="container text">
      <div
        id="chart"
        style={{ width: "100%", height: "20rem", position: "relative" }}
      >
        <Radar
          data={result.map((v) => ({ item: v.label, fields: { ...v.total } }))}
          colors={{ yes: new Color(129, 100, 32), no: new Color(33, 73, 64) }}
          axisKey="yes"
          itemStyle={(text) => {
            const isEmphasize = typeIndexes
              .map((i) => types[i].label)
              ?.includes(text);
            return {
              fontSize: isEmphasize ? 18 : 12,
              fontWeight: isEmphasize ? "bold" : "lighter",
            };
          }}
          scaleOption={{
            min: 0,
            max: result[maxIndexes[0]].total.yes,
            nice: true,
            tickCount: Math.ceil(result[maxIndexes[0]].total.yes / 3),
          }}
        />
      </div>

      <EptType
        interpretations={typeIndexes.map((i) => ({
          ...interpretation[types[i].type],
          label: types[i].label,
        }))}
      />

      <Alert
        title="必读"
        warning={
          typeIndexes.length > 1
            ? `本测试通常不会有两个或以上结果，但您的测试结果存在 ${typeIndexes.length} 个匹配的人格类型，故本次测试可能不具参考性，请重新认真测试。`
            : undefined
        }
        content={originalInterpretation.dialog.concat([
          "如果你觉得测试结果与你严重不相符，请重新测试并认真审视每道题目，如果多次测试的结果相同，那可能你需要重新认识自己。",
        ])}
        wait={import.meta.env.MODE === "development" ? 0 : 10}
        defaultShow
      />
    </div>
  );
};

export default EptResult;
