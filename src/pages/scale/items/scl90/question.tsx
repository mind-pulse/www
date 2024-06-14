import { useEffect, useState } from "react";
import suspense from "~/advance/suspense";
import { LazyQuestion } from "~/pages";

interface QuestionProps extends Scl90Question {
  value?: Scl90Value; // 默认值或已选择值
  updateValues: (index: number, value: Scl90Value) => void;
  index: number;
}

const Scl90Question = ({
  title,
  symptom,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const [selected, setSelected] = useState<number | undefined>(
    value ? value.point : undefined,
  );

  useEffect(() => {
    setSelected(value?.point);
  }, [index, title, value]);

  const handleChange = (v: number) => {
    setSelected(v);

    updateValues(index, { symptom, point: v });
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

export default Scl90Question;
