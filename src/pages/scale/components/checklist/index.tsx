import { Card } from "antd-mobile";
import "./index.scss";

interface CheckboxProps {
  checked?: boolean;
  text: string;
  textCentered?: boolean;
  onClick: () => void;
}

const Checkbox = ({ checked, text, onClick, textCentered }: CheckboxProps) => {
  const className = `checkbox${checked ? " active" : ""}${textCentered ? " center" : ""}`;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div className={className} onClick={onClick}>
      {text}
    </div>
  );
};

interface ChecklistProps {
  radio?: boolean;
  value: number[];
  prefix?: string[];
  options: Option[];
  useIndex?: boolean;
  onChange: (value: number[]) => void;
  textCentered?: boolean;
}

const Checklist = ({
  radio,
  value,
  prefix,
  options,
  useIndex,
  textCentered,
  onChange,
}: ChecklistProps) => {
  return (
    <Card className="check-list">
      {options.map((option, index) => {
        const val = useIndex ? index : option.point;
        const idx = value.indexOf(val);
        const checked = idx >= 0;

        return (
          <Checkbox
            key={option.text}
            textCentered={textCentered}
            text={(prefix ? `${prefix[index]}.` : "") + option.text}
            checked={checked}
            onClick={() => {
              if (radio) {
                onChange([val]);
              } else {
                if (checked) {
                  value.splice(idx, 1);
                } else {
                  value.push(val);
                }

                onChange(value);
              }
            }}
          />
        );
      })}
    </Card>
  );
};

export default Checklist;
