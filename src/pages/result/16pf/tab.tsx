import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Tabs } from "antd-mobile";
import { useThrottleFn } from "ahooks";
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
          {items.map((item, idx) => (
            <Tabs.Tab title={item.title} key={idx} />
          ))}
        </Tabs>
      </div>

      {items.map((item, idx) => (
        <div key={idx}>
          <h2 id={`anchor-${idx}`}>{item.title}</h2>
          {item.content}
        </div>
      ))}
    </>
  );
};

export default FactorTab;
