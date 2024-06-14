import { useEffect } from "react";
import { getRandomIndex } from "~/utils";
import Question from "./question";
import { calculate16PFResult } from ".";

interface SPFProps {
  scale: Scale<SPFQuestion, SPFInterpretation>;
  currentIndex: number;
  values: SPFValue[];
  setValues: SetStateAction<SPFValue[]>;
  setCalculateResult: SetStateAction<(values: SPFValue[]) => SPFResult>;
}

const SPFQuestion = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: SPFProps) => {
  const updateValues = (index: number, value: SPFValue) => {
    setValues((prev) => {
      const arr = [...prev];

      arr[index] = value;

      return arr;
    });
  };

  useEffect(() => {
    import.meta.env.MODE === "development" &&
      values.length < scale.questions.length &&
      scale.questions.forEach((v, i) => {
        const idx = getRandomIndex(v.options);

        updateValues(i, {
          factor: v.factor,
          point: v.options[idx].point,
          optionIndex: idx,
        });
      });

    setCalculateResult(() => {
      return (vs: SPFValue[]) => {
        const result = calculate16PFResult(vs);

        return result;
      };
    });
  }, []);

  if (!scale || currentIndex === -1) {
    return null;
  }

  const currentQuestion = scale.questions[currentIndex];

  return (
    <div>
      <Question
        {...currentQuestion}
        index={currentIndex}
        value={values[currentIndex]}
        updateValues={updateValues}
      />
    </div>
  );
};

export default SPFQuestion;
