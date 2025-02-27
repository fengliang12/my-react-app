import { Input, View } from "@tarojs/components";
import { useBoolean, useMemoizedFn } from "ahooks";
import React, { useState } from "react";

import api from "@/src/api";
import { Close } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import SendVerifyCode from "@/src/components/Common/SendVerifyCode";
import toast from "@/src/utils/toast";

interface Props {
  orderId: string;
  mobile?: string;
  children?: React.ReactNode;
  callback?: () => void;
}
const Index: React.FC<Props> = (props) => {
  let { children, orderId, mobile = "15656180073" } = props;
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const [verifyCode, setVerifyCode] = useState("");

  /**
   * 发送验证码
   */
  const SendVerifyCodeFn = useMemoizedFn(async () => {
    if (!mobile) return toast("请输入手机号");
    await api.qy.sendSmsCode({ orderId });
    toast("发送成功");
  });

  /**
   * 点击确认
   */
  const onConfirm = useMemoizedFn(async () => {
    if (verifyCode) {
      // TODO: 核销
      setFalse();
      let res = await api.qy.orderSubmit({
        smsCode: verifyCode,
        orderId: orderId,
        type: "sms",
      });
      console.log("res", res);
    }
  });

  return (
    <>
      <View onClick={setTrue}>{children}</View>
      {show && (
        <CPopup closePopup={setFalse}>
          <View className="w-540 h-506 bg-white pt-90 box-border">
            <CImage
              onClick={setFalse}
              src={Close}
              className="w-24 h-24 absolute top-30 right-30"
            ></CImage>

            <View className="w-full text-center text-30 font-bold">
              核销验证
            </View>
            <View className="text-center text-24 mt-30">
              请输入会员手机号验证码
            </View>

            <View className="w-full mt-59 vhCenter">
              <Input
                className="w-289 h-64 px-30 text-24 border border-1 border-solid box-border rotate-360"
                placeholder="验证码"
                onInput={(e) => {
                  setVerifyCode(e.detail.value);
                }}
              ></Input>

              <SendVerifyCode
                sendApi={SendVerifyCodeFn}
                className="ml-15 w-142 h-64 vhCenter text-18 bg-[#000000] text-white"
                mobile={mobile}
              ></SendVerifyCode>
            </View>
            <View
              onClick={onConfirm}
              className="w-290 h-70 mx-auto mt-60 vhCenter bg-[#000000] text-white text-24"
            >
              确认核销
            </View>
          </View>
        </CPopup>
      )}
    </>
  );
};
export default Index;
