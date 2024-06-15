import { Button, Image, ImageViewer, Modal, NavBar, Space } from "antd-mobile";
import type { ButtonProps } from "antd-mobile";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Alipay from "~/assets/alipay.webp";
import WeappCode from "~/assets/weapp-code.webp";
import Wechat from "~/assets/wechat.webp";
import "./index.scss";

interface NavProps {
  title: string;
  backArrow?: boolean | ReactNode;
  showDonateOnLoad?: boolean;
  showWeAppCodeOnLoad?: boolean;
  onBack?: () => void;
  className?: string;
  buttonFill?: ButtonProps["fill"];
}

const Nav = ({
  title,
  backArrow = false,
  showDonateOnLoad = false,
  showWeAppCodeOnLoad,
  onBack,
  className,
  buttonFill = "none",
}: NavProps) => {
  const [showDonateState, setShowDonateState] = useState(showDonateOnLoad);
  const [showWeAppCode, setShowWeAppCode] = useState(showWeAppCodeOnLoad);
  const [imageViewer, setImageViewer] = useState<string | null>(null);

  useEffect(() => {
    if (!showDonateState) return;

    Modal.alert({
      className: "qr-code-modal",
      content: (
        <div id="donate">
          <div className="indent" style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 10 }}>
              如果此次测试对您有帮助，请考虑捐赠一定的金额用于本网站的开发和维护。捐赠全凭个人意愿，不捐赠您也可以使用。
            </div>
            <div>关闭此窗口后您可以点击网页右上角的“捐款”按钮重新打开。</div>
          </div>

          <Space align="center" justify="center">
            <Image
              src={Alipay}
              width="100%"
              onClick={() => setImageViewer(Alipay)}
            />
            <Image
              src={Wechat}
              width="100%"
              onClick={() => setImageViewer(Wechat)}
            />
          </Space>
        </div>
      ),
      closeOnMaskClick: true,
      confirmText: "关闭",
      afterClose: () => setShowDonateState(false),
    });
  }, [showDonateState]);

  useEffect(() => {
    if (!showWeAppCode) return;

    Modal.alert({
      className: "qr-code-modal",
      content: (
        <div id="weapp-code">
          <div className="indent" style={{ marginBottom: 12 }}>
            <div>
              本网站微信小程序已上线，不需记住本网站，可直接扫码进入测试，或在微信小程序中搜索“知己心理轻测”。
            </div>
            <div>关闭此窗口后您可以点击网页左上角的“小程序”按钮重新打开。</div>
          </div>

          <Image
            src={WeappCode}
            width="100%"
            onClick={() => setImageViewer(Alipay)}
          />
        </div>
      ),
      closeOnMaskClick: true,
      confirmText: "关闭",
      afterClose: () => setShowWeAppCode(false),
    });
  }, [showWeAppCode]);

  return (
    <>
      <NavBar
        backArrow={backArrow}
        onBack={onBack}
        className={className}
        left={
          <Button
            color="primary"
            fill={buttonFill}
            size="mini"
            onClick={() => setShowWeAppCode(true)}
          >
            小程序
          </Button>
        }
        right={
          <Button
            color="primary"
            fill={buttonFill}
            size="mini"
            onClick={() => setShowDonateState(true)}
          >
            捐款
          </Button>
        }
      >
        {title}
      </NavBar>

      {showDonateOnLoad || showDonateState ? (
        <ImageViewer
          // biome-ignore lint/style/noNonNullAssertion: 不可能为空，为空就该抛异常
          image={imageViewer!}
          visible={imageViewer !== null}
          onClose={() => {
            setImageViewer(null);
          }}
        />
      ) : null}
    </>
  );
};

export default Nav;
