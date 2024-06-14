import { useLocation } from "react-router-dom";
import { Divider } from "antd-mobile";
import suspense from "~/advance/suspense";
import { LazyCircle } from "~/pages";

const Result = () => {
  const location = useLocation();
  const {
    result: total,
    interpretation,
  }: { result: number; interpretation: InterpretationItem } = location.state;

  const { description, symptom, advice, status } = interpretation;

  return (
    <div className="container text">
      {description &&
        total >= 0 &&
        suspense(
          <LazyCircle
            text={total}
            label={description}
            status={status}
            style={{ display: "inline-block" }}
          />,
        )}

      {symptom && (
        <div id="symptom">
          <Divider className="text" contentPosition="center">
            可能存在的症状
          </Divider>

          <div className="text-box">
            {symptom.map((s, i) => (
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
