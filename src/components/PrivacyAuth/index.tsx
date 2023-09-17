import "./index.less";

import { Button, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";

import { privacyAuth } from "./config";

let privacyAuthResolve;
let privacyAuthCurrentPage;
let isAgree;

console.log(
  `%c当前PrivacyAuth组件版本 ${privacyAuth.config.version}`,
  "color:#07c160;font-szie:26px;"
);

type PrivacyAuthType = Partial<{
  title: string;
  desc1: string;
  urlTitle: string;
  desc2: string;
  agreeTxt: string;
  disagreeTxt: string;
  onAgree: () => void;
  onDisagree: () => void;
}>;

const PrivacyAuth: React.FC<PrivacyAuthType> = ({
  title = privacyAuth?.config.title,
  desc1 = privacyAuth?.config.desc1,
  urlTitle = privacyAuth?.config.urlTitle,
  desc2 = privacyAuth?.config.desc2,
  agreeTxt = privacyAuth?.config.agreeTxt,
  disagreeTxt = privacyAuth?.config.disagreeTxt,
  onAgree,
  onDisagree,
}) => {
  const [show, setShow] = useState(false);
  const pageUrlRef = useRef<string>();
  const init = useMemoizedFn(async () => {
    if (isAgree) return close();
    const pageUrl = getPageUrl();
    if (privacyAuthCurrentPage && privacyAuthCurrentPage !== pageUrl) {
      close();
    }
    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization((resolve) => {
        privacyAuthResolve = resolve;
        open();
      });
    }
  });
  const getPageUrl = useMemoizedFn(() => {
    if (!pageUrlRef.current) {
      const pages = Taro.getCurrentPages();
      pageUrlRef.current = pages?.[pages.length - 1]?.route;
    }
    return pageUrlRef.current;
  });
  const open = useMemoizedFn(() => {
    if (!show) {
      setShow(true);
      privacyAuthCurrentPage = getPageUrl();
    }
  });
  const close = useMemoizedFn(() => {
    if (show) {
      setShow(false);
      privacyAuthCurrentPage = null;
    }
  });
  const toPrivacy = useMemoizedFn(() => {
    wx.openPrivacyContract({
      success() {},
      fail(err) {
        Taro.showModal({
          title: `${urlTitle}打开失败`,
          content: err.errMsg,
        });
      },
    });
  });
  const agree = useMemoizedFn(() => {
    close();
    privacyAuthResolve?.({
      event: "agree",
      buttonId: "agree-btn",
    });
    isAgree = true;
    onAgree?.();
  });
  const disagree = useMemoizedFn(() => {
    close();
    privacyAuthResolve?.({
      event: "disagree",
      buttonId: "disagree-btn",
    });
    onDisagree?.();
  });
  useDidShow(() => {
    init();
  });

  return (
    <>
      <View
        className="privacy-auth-popup"
        style={{ bottom: show ? "0px" : "-100vh" }}
      >
        <View className="title">{title}</View>
        <View className="desc1">{desc1}</View>
        <View className="url-title" onClick={toPrivacy}>
          {urlTitle}
        </View>
        <View className="desc2">{desc2}</View>
        <View className="btn-content">
          {
            // @ts-ignore
            <Button
              id="disagree-btn"
              className="btn disagree"
              onClick={disagree}
            >
              {disagreeTxt}
            </Button>
          }
          {
            // @ts-ignore
            <Button
              id="agree-btn"
              className="btn agree"
              openType="agreePrivacyAuthorization"
              onagreeprivacyauthorization={agree}
            >
              {agreeTxt}
            </Button>
          }
        </View>
      </View>
    </>
  );
};

export default PrivacyAuth;
