import { Area, Axis, Chart, Line, Point } from "@antv/f2";
import Canvas from "@antv/f2-react";
import { Badge, Card, Divider, ResultPage } from "antd-mobile";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { max } from "~/utils";
import "./index.scss";

interface CapacityCategory extends HSDSCapacityCategoryInterpretation {
  score: number;
}

interface RadarProps {
  data: CapacityCategory[];
}

const Radar = ({ data }: RadarProps) => {
  return (
    <Canvas pixelRatio={window.devicePixelRatio}>
      <Chart
        data={data}
        coord="polar"
        scale={{
          score: {
            min: 0,
            // biome-ignore lint/style/noNonNullAssertion: 不能为 null
            max: max(data, "score")!.score,
            tickCount: 4,
          },
        }}
      >
        <Axis
          field="capacity_category"
          grid="line"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          formatter={(s: string, idx: number) => {
            return `${data[idx].name}(${s})`;
          }}
        />
        <Axis field="score" grid="line" />
        <Line x="capacity_category" y="score" />
        <Area x="capacity_category" y="score" />
        <Point x="capacity_category" y="score" />
      </Chart>
    </Canvas>
  );
};

const WARNING =
  "您的职业代码不在职业信息列表中，可能是您的高得分维度不相邻，此结果可能不具有参考性。";

const Result = () => {
  const location = useLocation();
  const {
    result,
    interpretation,
  }: { result: HSDSResult; interpretation: HSDSInterpretation } =
    location.state;

  const [careerCode, setCareerCode] = useState("");
  const [career, setCareer] = useState<string | null>(null);
  const [data, setData] = useState<RadarProps["data"] | null>(null);

  const [status, setStatus] = useState<"success" | "warning">("success");

  const [top3Careers, setTop3Careers] = useState<RadarProps["data"] | null>(
    null,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 挂载时运行，不需要依赖
  useEffect(() => {
    setCareerCode(
      result
        .slice(0, 3)
        .map((v) => v.capacity_category)
        .join(""),
    );

    setData(
      interpretation.capacity_category_interpretations.map((item) => {
        // biome-ignore lint/style/noNonNullAssertion: 不能为 null
        const itt = result.find(
          (v) => v.capacity_category === item.capacity_category,
        )!;

        return {
          score: itt.total,
          ...item,
        };
      }),
    );
  }, []);

  useEffect(() => {
    if (!data) return;

    const sortedData = [...data].sort((a, b) => b.score - a.score);

    setTop3Careers(sortedData.slice(0, 3));
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!careerCode) return;

    const career = interpretation.career_information.find(
      (v) => v.code === careerCode,
    );

    if (!career) {
      setStatus("warning");
      return;
    }

    setCareer(career.information);
  }, [careerCode]);

  return (
    <ResultPage
      status={status}
      title={`职业兴趣代码：${careerCode}`}
      description={career ?? WARNING}
      style={{ flex: 1, minHeight: "inherit" }}
    >
      <ResultPage.Card style={{ height: "20rem" }}>
        {data ? <Radar data={data} /> : null}
      </ResultPage.Card>

      <Divider>职业兴趣解读</Divider>

      {top3Careers?.map((item) => (
        <Card
          key={item.capacity_category}
          style={{ marginTop: 12 }}
          title={
            <Badge
              content={item.score}
              color="#108ee9"
              style={{ right: "-10px", top: "5px" }}
            >
              <div style={{ fontWeight: "bold" }}>
                {item.name}({item.capacity_category})
              </div>
            </Badge>
          }
        >
          <div className="indent">
            <span className="emphasize">【人格特征】</span>
            {item.personality_trait}
          </div>
          <div className="indent">
            <span className="emphasize">【职业特征】</span>
            {item.occupational_stigma}
          </div>
        </Card>
      ))}
    </ResultPage>
  );
};

export default Result;
