import { useEffect } from "react";
import suspense from "~/advance/suspense";
import { LazyYBocsQuestion } from "~/pages";
import { sum } from "~/utils";

interface YBocsProps {
  scale: Scale<CommonQuestion, CommonInterpretation>;
  currentIndex: number;
  setCurrentIndex: SetStateAction<number>;
  values: number[];
  setValues: SetStateAction<number[]>;
  setCalculateResult: SetStateAction<(values: number[]) => YBocsResult>;
}

const YBocsScale = ({
  scale,
  currentIndex,
  setCurrentIndex,
  values,
  setValues,
  setCalculateResult,
}: YBocsProps) => {
  const updateValues = (index: number, point: number) => {
    setValues((prev) => {
      const arr = [...prev];

      arr[index] = point;

      return arr;
    });
  };

  useEffect(() => {
    setCalculateResult(() => {
      return (numbers: number[]): YBocsResult => {
        const thinking = sum(numbers.slice(0, 5));
        const behavior = sum(numbers.slice(5));
        const total = thinking + behavior;

        return {
          thinking,
          behavior,
          total,
        };
      };
    });
  }, []);

  if (!scale || currentIndex === -1) {
    return null;
  }

  const currentQuestion = scale.questions[currentIndex];

  return suspense(
    <LazyYBocsQuestion
      {...currentQuestion}
      index={currentIndex}
      value={values[currentIndex]}
      updateValues={updateValues}
      setIndex={setCurrentIndex}
    />,
  );
};

export default YBocsScale;
