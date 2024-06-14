import { useEffect, useState } from "react";
import suspense from "~/advance/suspense";
import { LazyQuestion } from "~/pages";

interface QuestionProps extends EptQuestion {
  value?: EptValue;
  updateValues: (index: number, value: EptValue) => void;
  index: number;
}

const EptQuestion = ({
  title,
  type,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number | undefined>(value?.point);

  // biome-ignore lint/correctness/useExhaustiveDependencies: index 和 title 变化时需要重新获取 value.point
  useEffect(() => {
    setSelected(value?.point);
  }, [index, title, value]);

  const handleChange = (v: number) => {
    setSelected(v);

    updateValues(index, { type, point: v });
  };

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={selected}
      handleChange={handleChange}
      options={options}
      useIndex={false}
    />,
  );
};

export default EptQuestion;
