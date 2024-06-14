import { useEffect } from "react";
import { randomChoice } from "~/utils/random";
import { calculateScl90Result } from ".";
import Question from "./question";

interface Scl90Props {
  scale: Scale<Scl90Question, Scl90Interpretation>;
  currentIndex: number;
  values: Scl90Value[];
  setValues: SetStateAction<Scl90Value[]>;
  setCalculateResult: SetStateAction<(values: Scl90Value[]) => Scl90Result>;
}

const SCL90Scale = ({
  scale,
  currentIndex,
  values,
  setValues,
  setCalculateResult,
}: Scl90Props) => {
  useEffect(() => {
    import.meta.env.MODE === "development" &&
      values.length < scale.questions.length &&
      scale.questions.forEach((v, i) => {
        updateValues(i, {
          symptom: v.symptom,
          point: randomChoice(v.options, "point"),
        });
      });

    setCalculateResult(() => {
      return (vs: Scl90Value[]) => {
        const result = calculateScl90Result(vs);

        return result;
      };
    });
  }, []);

  const updateValues = (index: number, value: Scl90Value) => {
    setValues((prev) => {
      const arr = [...prev];

      arr[index] = value;

      return arr;
    });
  };

  if (!scale || currentIndex === -1) {
    return null;
  }

  const currentQuestion = scale.questions[currentIndex];

  return (
    <Question
      {...currentQuestion}
      index={currentIndex}
      value={values[currentIndex]}
      updateValues={updateValues}
      symptom={scale.questions[currentIndex].symptom}
    />
  );
};

export default SCL90Scale;
