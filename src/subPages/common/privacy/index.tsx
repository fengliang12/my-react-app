import { View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";
import React, { useEffect, useState } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";

const Index = () => {
  const [list] = useState(new Array(12).fill(0));

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
      {list.map((item, index) => (
        <CImage
          key={index}
          className="w-full"
          mode="widthFix"
          src={`${config.imgBaseUrl}/privacy/${index + 1}.jpg`}
        ></CImage>
      ))}
    </View>
  );
};
export default Index;
