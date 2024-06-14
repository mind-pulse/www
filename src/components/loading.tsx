import { SpinLoading } from "antd-mobile";

const Loading = () => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SpinLoading />
    </div>
  );
};

export default Loading;
