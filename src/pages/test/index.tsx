import { MovableArea, MovableView, View } from "@tarojs/components";
import React, { useEffect } from "react";

import CImage from "@/src/components/Common/CImage";

const Index = () => {
  useEffect(() => {});

  return (
    <View className="index">
      <MovableArea
        style={{
          position: "fixed",
          top: `100px`,
          width: "100vw",
          height: "1000rpx",
          left: 0,
          zIndex: 5000,
          pointerEvents: "none",
          background: "rgba(0,0,0,0)",
        }}
      >
        <MovableView
          direction="all"
          style={{
            width: "100rpx",
            height: "100rpx",
            background: "green",
            pointerEvents: "auto",
          }}
        ></MovableView>
      </MovableArea>
    </View>
  );
};
export default Index;
