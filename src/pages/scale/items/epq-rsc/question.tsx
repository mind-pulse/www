import { useEffect, useState } from "react";
import suspense from "~/advance/suspense";
import { LazyQuestion } from "~/pages";

interface QuestionProps extends EpqRscQuestion {
  value?: EpqRscValue; // 默认值或已选择值
  updateValues: (index: number, value: EpqRscValue) => void;
  index: number;
}

const EqpRscQuestion = ({
  title,
  dimension,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number | undefined>(value?.point);

  useEffect(() => {
    setSelected(value?.point);
  }, [value]);

  const handleChange = (v: number) => {
    setSelected(v);

    updateValues(index, { dimension, point: v });
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

export default EqpRscQuestion;
