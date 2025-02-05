import { Text, View } from "@tarojs/components";
import React, { useEffect } from "react";

import { P3 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";

const Index = () => {
  useEffect(() => {});

  return (
    <View
      className="w-full min-h-screen"
      style={{
        background:
          "url(https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/sign/indexBg.jpg)",
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
        <View className="w-full flex justify-between text-white text-20">
          <View className="underline">积分明细</View>
          <View className="underline">活动规则</View>
        </View>

        <View className="w-full h-886 mt-40">
          <CImage
            className="w-full h-full"
            mode="widthFix"
            src="https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/sign/indexKV.png"
          ></CImage>
        </View>

        <View
          className="w-full h-160 mt-26 text-white px-28 box-border text-20"
          style="background: rgba(255,255,255,0.1);"
        >
          <View className="w-full h-91 flex justify-between items-center px-20 box-border">
            <View
              className="w-77 h-42 rounded-42 mr-28 flex items-center justify-center"
              style="background: rgba(255,255,255,0.1);"
            >
              附近
            </View>
            <View className="flex-1">NARS上海新天地</View>
            <View className="flex items-center ml-10">{`0.01km >`}</View>
          </View>
          <View className="w-full h-1 bg-white"></View>
          <View className="w-full h-68 vhCenter">
            <Text className="underline">查看更多门店</Text>
          </View>
        </View>

        <View className="w-400 ml-120 mt-58 h-80 text-24 bg-white flex items-center justify-center">
          <CImage
            className="w-25 h-25 mr-15"
            mode="widthFix"
            src="https://cna-uat-nars-oss.oss-cn-shanghai.aliyuncs.com/sign/scan_icon.png"
          ></CImage>
          立即打卡
        </View>

        <View className="w-full text-center text-20 mt-32 text-white">
          如有疑问，请点击咨询<Text className="underline">专属彩妆师</Text>
        </View>
      </View>
    </View>
  );
};
export default Index;
