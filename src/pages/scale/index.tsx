import { Button, ErrorBlock, Grid, NoticeBar, ProgressBar } from "antd-mobile";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import suspense from "~/advance/suspense";
import {
  Lazy16pfScale,
  LazyCommonScale,
  LazyEPTScale,
  LazyEptRscScale,
  LazyFooter,
  LazyHSDSScale,
  LazyIdea,
  LazyNeoPiRScale,
  LazySCL90Scale,
  LazyYBocsScale,
} from "~/pages";
import { api } from "~/utils";
import "./index.scss";
import Alert from "~/components/alert";
import Nav from "~/components/nav";

const Scale = () => {
  const { path } = useParams() as { path: Path };

  const [error, setError] = useState<HttpError | null>(null);
  const [scale, setScale] = useState<Scale<
    InferQuestion<typeof path>,
    InferInterpretation<typeof path>
  > | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [values, setValues] = useState<InferValue<typeof path>[]>([]);
  const [calculateResult, setCalculateResult] = useState<CalculateResult<
    typeof path
  > | null>(null);

  const [instruction, setInstruction] = useState<ReactNode[]>([
    <NoticeBar
      key={0}
      color="alert"
      content="您的测试结果本网站不会保存，请一定根据自己的实际情况回答，否则测试结果不具有参考性。"
    />,
  ]);

  const [autoNext, setAutoNext] = useState(true);

  const [renderScale, setRenderScale] = useState(
    import.meta.env.MODE === "development",
  );

  useEffect(() => {
    if (scale) return;

    api<Scale<InferQuestion<typeof path>, InferInterpretation<typeof path>>>(
      `/${path}`,
    ).then((data) => {
      if (data instanceof Error) {
        setError({
          title: "网络请求异常",
          description: "无法从服务器获取数据",
        });
        return;
      }

      setScale(data);
      setCurrentIndex(0);
    });
  }, [path, scale]);

  const navigate = useNavigate();

  const turnOffAutoNext = () => {
    autoNext && setAutoNext(false);
  };

  const turnOnAutoNext = useCallback(() => {
    !autoNext && setAutoNext(true);
  }, [autoNext]);

  const toPrev = () => {
    turnOffAutoNext();

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toNext = useCallback(() => {
    currentIndex < (scale?.questions.length ?? 0) - 1 &&
      values[currentIndex] !== undefined && // 防止用户点击太快向 values 添加 undefined
      setCurrentIndex((prev) => prev + 1);

    // 切换到未答题目时开启自动切换
    currentIndex + 1 === values.length && turnOnAutoNext();
  }, [currentIndex, scale, turnOnAutoNext, values]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // 有多选题的量表不自动切换下一题
    if (
      path === "h_sds" &&
      (
        scale as Scale<
          InferQuestion<typeof path>,
          InferInterpretation<typeof path>
        >
      )?.questions[currentIndex].question_type !== "CAPACITY_CATEGORY"
    )
      return;

    if (
      autoNext &&
      values[currentIndex] !== undefined &&
      values[currentIndex + 1] === undefined
    ) {
      // 延迟 50ms 切换下一题，方便 radio 渲染完成
      const timer = setTimeout(() => toNext(), 50);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, values]);

  useEffect(() => {
    // 严格模式下，scale 会被 set 两次，scale 数据虽然不变，
    // 但是对象地址会不同，所以此 hook 会执行两次，导致 instruction
    // 里会添加两次 instruction 或 warning。
    // 为避免此情况，应在 instruction.length === 1 时才 set instruction
    if (!scale || instruction.length > 1) return;
    if (!scale.instruction && !scale.warning) return;

    setInstruction((pre) => {
      if (scale.instruction) return [...pre, ...scale.instruction];

      if (scale.warning) return [...pre, scale.warning];

      return pre;
    });
  }, [scale, instruction.length]);

  if (error) {
    return <ErrorBlock fullPage status="disconnected" {...error} />;
  }

  if (!scale || currentIndex === -1) {
    return null;
  }

  const onSubmit = () => {
    const result = calculateResult?.(values);

    api(`/statistics?scale=${path}&clientType=2`);

    switch (path) {
      case "scl90":
      case "16pf":
      case "y_bocs":
      case "ept":
      case "epq_rsc":
      case "neo_pi_r":
      case "h_sds":
        navigate(`/result/${path}`, {
          replace: true,
          state: {
            result,
            interpretation: scale.interpretation,
            name: scale.name,
          },
        });
        return;
      default: {
        const result = calculateResult?.(values) as InferResult<typeof path>;

        const interpretation = (
          scale?.interpretation as CommonInterpretation
        ).find((v) => result >= v.range[0] && result <= v.range[1]);

        navigate(`/result/${path}`, {
          replace: true,
          state: {
            name: scale.name,
            interpretation,
            result,
          },
        });

        return;
      }
    }
  };

  const render = () => {
    switch (path) {
      case "16pf":
        return (
          <Lazy16pfScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "scl90":
        return (
          <LazySCL90Scale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "y_bocs":
        return (
          <LazyYBocsScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCurrentIndex={setCurrentIndex}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "ept":
        return (
          <LazyEPTScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "epq_rsc":
        return (
          <LazyEptRscScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "neo_pi_r":
        return (
          <LazyNeoPiRScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      case "h_sds":
        return (
          <LazyHSDSScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );

      default:
        return (
          <LazyCommonScale
            scale={
              scale as Scale<
                InferQuestion<typeof path>,
                InferInterpretation<typeof path>
              >
            }
            currentIndex={currentIndex}
            values={values as InferValue<typeof path>[]}
            setValues={setValues as SetStateAction<InferValue<typeof path>[]>}
            setCalculateResult={
              setCalculateResult as SetStateAction<CalculateResult<typeof path>>
            }
          />
        );
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Nav
        title={scale.name}
        onBack={() => navigate("/", { replace: true })}
        backArrow
      />

      <div className="container">
        {scale.idea ? (
          suspense(
            <LazyIdea
              content={scale.idea}
              hide={() =>
                setScale(
                  (pre) =>
                    ({ ...pre, idea: null }) as Scale<
                      InferQuestion<typeof path>,
                      InferInterpretation<typeof path>
                    >,
                )
              }
            />,
          )
        ) : (
          <>
            <Alert
              title="测试需知"
              wait={import.meta.env.MODE === "production" ? 5 : 0}
              content={instruction}
              onClose={() => setRenderScale(true)}
              defaultShow={import.meta.env.MODE !== "development"}
            />
            <div>
              {renderScale ? suspense(render()) : null}
              <Grid columns={12} gap={8} style={{ marginTop: 10 }}>
                <Grid.Item span={5}>
                  <Button
                    block
                    shape="rounded"
                    color="primary"
                    onClick={toPrev}
                    disabled={currentIndex === 0}
                  >
                    上一题
                  </Button>
                </Grid.Item>
                <Grid.Item
                  span={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>{`${currentIndex + 1}/${scale.questions.length}`}</span>
                </Grid.Item>
                <Grid.Item span={5}>
                  <Button
                    block
                    color="primary"
                    shape="rounded"
                    onClick={toNext}
                    disabled={
                      values[currentIndex] === undefined ||
                      currentIndex === scale.questions.length - 1
                    }
                  >
                    下一题
                  </Button>
                </Grid.Item>
              </Grid>

              {values.length === scale.questions.length ? (
                <Button
                  block
                  color="primary"
                  className="submit"
                  onClick={onSubmit}
                >
                  查看结果
                </Button>
              ) : (
                <ProgressBar
                  percent={(currentIndex / scale.questions.length) * 100}
                  style={{ marginTop: 12 }}
                />
              )}
            </div>
          </>
        )}
      </div>
      {suspense(<LazyFooter />)}
    </div>
  );
};

export default Scale;
