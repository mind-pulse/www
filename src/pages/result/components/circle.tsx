import { AutoCenter } from "antd-mobile";
import React from "react";

interface CircleProps {
  text: string | number;
  label?: React.ReactNode;
  diameter?: number;
  fontSize?: number;
  status: ResultStatus;
  style?: React.CSSProperties;
}

const colors: Record<ResultStatus, string> = {
  normal: "#00B578",
  mild: "#FFD700",
  moderate: "#FF6F2A",
  major: "#FF4D4F",
};

const Circle = ({
  text,
  label,
  status,
  style,
  diameter = 160,
  fontSize = 60,
}: CircleProps) => (
  <AutoCenter>
    <div
      style={{
        ...style,
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: "50%",
        backgroundColor: colors[status],
        color: "#FFF",
        textAlign: "center",
      }}
    >
      <span
        style={{
          lineHeight: `${diameter}px`,
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
        }}
      >
        {text}
      </span>
    </div>

    {label ? (
      <div style={{ marginTop: 20, fontSize: "24px", textAlign: "center" }}>
        <span>{label}</span>
      </div>
    ) : null}
  </AutoCenter>
);

export default Circle;
