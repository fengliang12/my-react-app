import { View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";
import React, { useEffect } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";

const Index = () => {
  useEffect(() => {});

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="index">
      <CHeader
        back
        title="隐私政策"
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/register/privacy.png`}
      ></CImage>
    </View>
  );
};
export default Index;
