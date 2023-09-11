import type { ViewProps } from "@tarojs/components";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCountDown } from "ahooks";
import React, { useState } from "react";

import api from "@/src/api";

interface CImageOther extends ViewProps {
  initSendText?: string;
  clickAfterSendText?: string;
  beforeSendText?: string;
  afterSendText?: string;
  mobile: string;
  mobileError?: () => void;
  seconds?: number;
  sendApi?: () => void;
}
const isPhone = (phone: string) => /^[1][0-9]{10}$/.test(phone);
const SendVerifyCode: React.FC<CImageOther> = (props) => {
  const {
    mobile,
    initSendText = "发送验证码",
    clickAfterSendText = "重新发送",
    afterSendText = "秒后重试",
    beforeSendText = "请",
    mobileError,
    seconds = 60,
    sendApi,
  } = props;
  const [count, setCount] = useState<number>(0);
  const [againText, setAgainText] = useState<string>();
  const [countDown] = useCountDown({
    targetDate: count,
    onEnd() {
      setAgainText(clickAfterSendText);
      setCount(0);
    },
  });
  const handleSendMessage = async () => {
    if (count > 0) return;
    if (!isPhone(mobile)) {
      mobileError
        ? mobileError()
        : Taro.showToast({
            title: "手机号验证失败",
            icon: "none",
          });
      return;
    }
    Taro.showLoading({ title: "加载中", mask: true });
    sendApi
      ? await sendApi()
      : await api.user.sendSmsCode2({ mobile: props.mobile });
    setCount(Date.now() + seconds * 1000);
    Taro.hideLoading();
  };
  return (
    <View
      className={`w-full h-full ${props.className} `}
      onClick={handleSendMessage}
    >
      {countDown === 0
        ? againText || initSendText
        : (beforeSendText || "") +
            Math.round(countDown / 1000) +
            afterSendText || ""}
    </View>
  );
};
export default SendVerifyCode;
