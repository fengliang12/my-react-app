import { View } from "@tarojs/components";
import React, { useEffect } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";

const Index = () => {
  useEffect(() => {});

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
        src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/register/privacy.png"
      ></CImage>
    </View>
  );
};
export default Index;
