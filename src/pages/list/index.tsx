import {
  Card,
  Ellipsis,
  ErrorBlock,
  List,
  NoticeBar,
  SafeArea,
  Tag,
  Toast,
} from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import suspense from "~/advance/suspense";
import { LazyFooter } from "~/pages";
import { api, isPC } from "~/utils";
import "./index.scss";
import Nav from "~/components/nav";
import { texts2string } from "../utils";

const tagNames: Record<keyof Tag, string> = {
  info: "primary",
  normal: "success",
  warning: "warning",
  error: "danger",
};

const Index = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<HttpError | null>(null);
  const [list, setList] = useState<ListItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics[]>([]);

  useEffect(() => {
    const getList = async () => {
      const data = await api<ListItem[]>("/list");

      if (data instanceof Error) {
        setError({
          title: "网络请求异常",
          description: "无法从服务器获取数据",
        });
        return;
      }

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      setList(data!);
    };

    const getStatistics = async () => {
      const data = await api<Statistics[]>("/get_statistics");

      if (data instanceof Error) {
        setError({ title: "响应异常", description: String(data) });
        return;
      }

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      setStatistics(data!);
    };

    Promise.all([getList(), getStatistics()]);
  }, []);

  useEffect(() => {
    if (isPC()) {
      Toast.show("本网站专为手机设计，在电脑浏览器中效果可能不好。");
    }
  }, []);

  if (error) {
    return <ErrorBlock fullPage status="disconnected" {...error} />;
  }

  const onHeaderClick = (path: string) => {
    navigate(`/scale/${path}`);
  };

  const onContentClick = () => {
    Toast.show("点击标题可进入测试");
  };

  return (
    <div style={{ position: "relative" }}>
      <SafeArea position="top" />

      <Nav title="首页" showWeAppCodeOnLoad />

      <List className="list">
        {list.map((v) =>
          import.meta.env.MODE !== "production" || !v.disabled ? (
            <List.Item key={v.path} className="list__item">
              <Card
                title={v.name}
                extra={<RightOutline />}
                onHeaderClick={() => onHeaderClick(v.path)}
              >
                {v.warning ? (
                  <NoticeBar content={v.warning} wrap color="alert" />
                ) : null}

                <Ellipsis
                  className="introduction"
                  direction="end"
                  rows={3}
                  content={texts2string(v.introduction)}
                  expandText="展开"
                  collapseText="收起"
                  onContentClick={onContentClick}
                />
                <div className="list__item-footer">
                  <div className="tags">
                    {Object.keys(v.tags).map((k) =>
                      (v.tags[k as keyof Tag] as string[] | undefined)?.map(
                        (s, i) => (
                          <Tag
                            key={i.toString()}
                            round
                            color={tagNames[k as keyof Tag]}
                          >
                            {s}
                          </Tag>
                        ),
                      ),
                    )}
                  </div>
                  <span className="list__item-footer-statistics-times">
                    测试次数：
                    {statistics.find((item) => item.name === v.name)?.times}
                  </span>
                </div>
              </Card>
            </List.Item>
          ) : null,
        )}
      </List>

      {suspense(<LazyFooter />)}
      <SafeArea position="bottom" />
    </div>
  );
};

export default Index;
