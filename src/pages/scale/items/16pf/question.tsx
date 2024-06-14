import { useEffect, useState } from "react";
import suspense from "~/advance/suspense";
import { LazyQuestion } from "~/pages";

interface QuestionProps extends SPFQuestion {
  value?: SPFValue;
  updateValues: (index: number, value: SPFValue) => void;
  index: number;
}

const SPFQuestion = ({
  title,
  factor,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number | undefined>(
    value?.optionIndex === undefined ? undefined : value.optionIndex,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setSelected(value?.optionIndex);
  }, [index, title, value]);

  const handleChange = (optionIndex: number) => {
    setSelected(optionIndex);

    updateValues(index, {
      factor,
      optionIndex,
      point: options[optionIndex].point,
    });
  };

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={selected}
      handleChange={handleChange}
      options={options}
      prefix={["A", "B", "C"]}
    />,
  );
};

export default SPFQuestion;
