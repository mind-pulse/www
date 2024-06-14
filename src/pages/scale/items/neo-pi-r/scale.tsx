import { Button, Dialog, Form, Grid, NoticeBar, Radio } from "antd-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomIndex, randomChoice } from "~/utils";
import { calculateNEOPiRResult } from ".";
import Question from "./question";

interface NEOPiRProps {
  scale: Scale<NEOPiRQuestion, NEOPiRInterpretation>;
  currentIndex: number;
  values: NEOPiRValue[];
  setValues: SetStateAction<NEOPiRValue[]>;
  setCalculateResult: SetStateAction<(values: NEOPiRValue[]) => NEOPiRResult>;
}

const NEOPiRScale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: NEOPiRProps) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(
    import.meta.env.MODE === "development" ? false : true,
  );
  const [gender, setGender] = useState<Gender | null>(null);

  const updateValues = (index: number, value: NEOPiRValue) => {
    setValues((prev) => {
      const arr = [...prev];

      arr[index] = value;

      return arr;
    });
  };

  useEffect(() => {
    if (!gender) return;

    setCalculateResult(() => {
      return (vs: NEOPiRValue[]) => {
        const result = calculateNEOPiRResult(vs, gender, scale.interpretation);

        return result;
      };
    });
  }, [gender, scale.interpretation, setCalculateResult]);

  useEffect(() => {
    if (
      import.meta.env.MODE === "development" &&
      values.length < scale.questions.length
    ) {
      setGender(randomChoice(["male", "female"]));
      scale.questions.forEach((v, i) => {
        const idx = getRandomIndex(v.options);

        updateValues(i, {
          dimension: v.dimension,
          subdimension: v.subdimension,
          point: v.options[idx].point,
        });
      });
    }
  }, []);

  if (!scale || currentIndex === -1) {
    return null;
  }

  const currentQuestion = scale.questions[currentIndex];

  return (
    <div>
      <Dialog
        visible={showDialog}
        content={
          <>
            <NoticeBar
              color="info"
              wrap
              content="您的测试结果本小程序不会保存，请一定根据自己的实际情况回答，否则测试结果不具有参考性。"
            />

            <Form
              layout="horizontal"
              footer={
                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <Button
                      block
                      color="default"
                      onClick={() => navigate("/", { replace: true })}
                    >
                      取消
                    </Button>
                  </Grid.Item>

                  <Grid.Item>
                    <Button
                      block
                      type="submit"
                      color="primary"
                      onClick={() => setShowDialog(false)}
                    >
                      确认
                    </Button>
                  </Grid.Item>
                </Grid>
              }
            >
              <Form.Item
                label="您的性别"
                name="gender"
                rules={[{ required: true }]}
              >
                <Radio.Group onChange={(v) => setGender(v as keyof EpqRscNorm)}>
                  <Radio value="male" style={{ marginRight: "1.5rem" }}>
                    男
                  </Radio>

                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </>
        }
      />

      <Question
        {...currentQuestion}
        index={currentIndex}
        value={values[currentIndex]}
        updateValues={updateValues}
      />
    </div>
  );
};

export default NEOPiRScale;
