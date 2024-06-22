import type { ReactNode } from "react";

export const texts2string = (texts: Texts): string => {
  let s = "";
  for (const sentence of texts) {
    for (const item of sentence) {
      if (typeof item === "string") {
        s += item;
      } else {
        s += item.text;
      }
    }
  }

  return s;
};

export const texts2element = (texts: Texts): ReactNode => {
  const parent: ReactNode[] = [];

  for (const [idx, sentence] of texts.entries()) {
    const child: ReactNode[] = [];
    for (const [j, item] of sentence.entries()) {
      if (typeof item === "string") {
        child.push(item);
      } else {
        let e: ReactNode;
        const key = `${idx}-${j}`;
        switch (item.type) {
          case "STRONG":
            e = <strong key={key}>{item.text}</strong>;
            break;
          case "MARK":
            e = <mark key={key}>{item.text}</mark>;
            break;
          case "A":
            e = (
              <a href={item.href} key={key}>
                {item.text}
              </a>
            );
            break;
        }
        child.push(e);
      }
    }
    parent.push(
      <div className="indent" key={idx + 1}>
        {child}
      </div>,
    );
  }

  return parent;
};
