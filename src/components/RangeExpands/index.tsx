import { View } from "@tarojs/components";
import React, { useEffect } from "react";

interface IProps {
  /**
   * 单位rpx
   */
  width?: number;
  height?: number;
  /**
   * 显示颜色（用于调试）
   */
  show?: boolean;
}
const Index = (props) => {
  let { width = 100, height = 100, show = false } = props;

  return (
    <View
      className="absolute"
      style={{
        top: "50%",
        left: "50%",
        width: `${width}rpx`,
        height: `${height}rpx`,
        transform: `translate(-50%, -50%)`,
        backgroundColor: show ? "rgba(0, 46, 255, 0.42)" : "transparent",
      }}
    ></View>
  );
};
export default Index;
