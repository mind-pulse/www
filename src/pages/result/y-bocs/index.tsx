import { Divider } from "antd-mobile";
import { useLocation } from "react-router-dom";
import Circle from "../components/circle";

const Result = () => {
  const location = useLocation();
  const {
    result,
    interpretation: interpretationItems,
  }: { result: YBocsResult; interpretation: YBocsInterpretation } =
    location.state;

  const interpretation = interpretationItems.find(
    (item) =>
      (result.total >= item.range.total[0] &&
        result.total <= item.range.total[1]) ||
      (result.behavior > result.thinking
        ? result.behavior >= item.range.any[0] &&
        result.behavior <= item.range.any[1]
        : result.thinking >= item.range.any[0] &&
        result.thinking <= item.range.any[1]),
  )!;

  const { description, label, advice, status } = interpretation;

  return (
    <div className="container text">
      {result && (
        <Circle
          text={result.total}
          label={label}
          status={status}
          style={{ display: "inline-block" }}
        />
      )}

      {description && (
        <div id="symptom">
          <Divider className="text" contentPosition="center">
            症状描述
          </Divider>

          <div className="text-box">
            {description.map((s, i) => (
              <div className="symptom-text indent" key={i}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {advice ? (
        <div>
          <Divider contentPosition="center">建议</Divider>

          <div className="text-box">
            {advice.map((s, i) => (
              <div key={i} className="indent">
                {s}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
