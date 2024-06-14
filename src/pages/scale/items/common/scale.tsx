import { useEffect } from "react";
import { calculate, randomChoice } from "~/utils";
import Question from "~/pages/scale/items/common/question";

interface CommonProps {
  scale: Scale<CommonQuestion, CommonInterpretation>;
  currentIndex: number;
  values: number[];
  setValues: SetStateAction<number[]>;
  setCalculateResult: SetStateAction<(values: number[]) => number>;
}

const CommonQuestion = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: CommonProps) => {
  const updateValues = (index: number, point: number) => {
    setValues((prev) => {
      const arr = [...prev];

      arr[index] = point;

      return arr;
    });
  };

  useEffect(() => {
    import.meta.env.MODE === "development" &&
      values.length < scale.questions.length &&
      scale.questions.forEach((v, i) => {
        updateValues(i, randomChoice(v.options, "point"));
      });

    setCalculateResult(() => {
      return (numbers: number[]) => {
        const sum = calculate(numbers, scale?.formula_mode);

        return sum;
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

export default CommonQuestion;
