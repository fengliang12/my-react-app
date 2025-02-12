import { Input, Text, View } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import RulePopup from "../components/RulePopup";
import useActivityHook from "../hooks/activity";

const Index = () => {
  const [counterCode, setCounterCode] = useState<string>("");
  const { activityDetail, extendInfos } = useActivityHook();

  /**
   * 点击登录按钮
   */
  const onSubmit = useMemoizedFn(async () => {
    if (!counterCode) return toast("请输入门店编码");
    let res = await api.clockin.createClockInQrCode(counterCode);
    if (res?.data) {
      to(`/pages/sign/qrCode/index?counterCode=${counterCode}`);
    }
  });

  return (
    <View
      className="w-full min-h-screen"
      style={{
        background: `url(${activityDetail?.backgroundImage})`,
        backgroundSize: "100% 100%",
      }}
    >
      <CHeader
        back
        fill
        title="NARS"
        backgroundColor="rgba(0,0,0,0)"
        titleColor="#FFFFFF"
      ></CHeader>

      <View className="w-640 mt-55 ml-55 pb-80">
        <View className="w-full flex justify-end text-white text-20">
          <RulePopup imageUrl={activityDetail.ruleImage}></RulePopup>
        </View>

        <View className="w-full h-886 mt-40">
          <CImage
            className="w-full h-full"
            mode="widthFix"
            src={`${extendInfos?.main_img}`}
          ></CImage>
        </View>

        <View className="w-full text-center text-20 mt-44 text-white">
          请彩妆师输入【门店编码】
        </View>

        <View className="w-full mt-39 text-white box-border text-20">
          <Input
            className="w-full h-81 flex justify-between items-center px-20 box-border"
            style={{
              border: "1px solid #FFFFFF",
            }}
            placeholder="请输入门店编码"
            placeholderClass="text-20 text-white"
            value={counterCode}
            onInput={(e) => {
              setCounterCode(e.detail.value);
            }}
          ></Input>
          <View className="w-full mt-22 text-left">例：2200004633</View>
        </View>

        <View
          className="w-400 ml-120 mt-49 h-80 text-24 bg-white flex items-center justify-center"
          onClick={onSubmit}
        >
          确认登录
        </View>
      </View>
    </View>
  );
};
export default Index;
