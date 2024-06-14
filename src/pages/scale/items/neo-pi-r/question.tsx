import suspense from "~/advance/suspense";
import { LazyQuestion } from "~/pages";

interface QuestionProps extends NEOPiRQuestion {
  value?: NEOPiRValue;
  updateValues: (index: number, value: NEOPiRValue) => void;
  index: number;
}

const NEOPiRQuestion = ({
  title,
  dimension,
  subdimension,
  options,
  index,
  value,
  updateValues,
}: QuestionProps) => {
  const handleChange = (point: number) => {
    updateValues(index, {
      dimension,
      subdimension,
      point,
    });
  };

  return suspense(
    <LazyQuestion<false>
      index={index}
      title={title}
      selected={value?.point}
      handleChange={handleChange}
      options={options}
      useIndex={false}
    />,
  );
};

export default NEOPiRQuestion;
