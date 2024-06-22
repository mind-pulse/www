import { Dialog, NoticeBar } from "antd-mobile";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface AlertProps {
  wait?: number;
  title?: string;
  warning?: string;
  content: ReactNode[];
  defaultShow?: boolean;
  onClose?: () => void;
}

const Alert = ({
  wait,
  title,
  warning,
  content,
  defaultShow,
  onClose,
}: AlertProps) => {
  const [second, setSecond] = useState(wait);

  const [show, setShow] = useState(defaultShow);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies(second): only run once on mount
  useEffect(() => {
    if (!second || second < 0) return;

    let current = second;

    timerRef.current = setInterval(() => {
      current--;
      setSecond(current);
    }, 1000);

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (second === 0) {
      timerRef.current && clearInterval(timerRef.current);
    }
  }, [second]);

  return (
    <Dialog
      visible={show}
      title={title}
      actions={[
        {
          key: "confirm",
          text: second ? `${second}s` : wait ? "我真知道了" : "我知道了",
          disabled: second !== undefined ? second > 0 : false,
        },
      ]}
      onAction={() => {
        if (second) return;
        setShow(false);
        onClose?.();
      }}
      content={
        <>
          {warning ? <NoticeBar color="alert" content={warning} /> : null}

          <div style={{ padding: "1rem" }}>
            {content.map(
              (s, i): React.ReactNode =>
                typeof s === "string" ? (
                  <div key={i.toString()} className="indent">
                    {s}
                  </div>
                ) : (
                  s
                ),
            )}
          </div>
        </>
      }
    />
  );
};

export default Alert;
