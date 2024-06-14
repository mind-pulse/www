import { useThrottleFn } from "ahooks";
import { Tabs } from "antd-mobile";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import "./tab.scss";

const tabHeight = 42;

interface TabItem {
  title: string;
  content: ReactNode;
}

interface FactorTabProps {
  items: TabItem[];
}

const FactorTab = ({ items }: FactorTabProps) => {
  const [activeKey, setActiveKey] = useState(0);

  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = 0;
      for (const idx of items.keys()) {
        const element = document.getElementById(`anchor-${idx}`);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= tabHeight) {
          currentKey = idx;
        } else {
          break;
        }
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies(handleScroll): only run on mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="tabsContainer">
        <Tabs
          activeKey={String(activeKey)}
          onChange={(key) => {
            document.getElementById(`anchor-${key}`)?.scrollIntoView();
            window.scrollTo({
              top: window.scrollY - tabHeight,
            });
          }}
        >
          {items.map((item) => (
            <Tabs.Tab title={item.title} key={item.title} />
          ))}
        </Tabs>
      </div>

      {items.map((item, idx) => (
        <div key={item.title}>
          <h2 id={`anchor-${idx}`}>{item.title}</h2>
          {item.content}
        </div>
      ))}
    </>
  );
};

export default FactorTab;
