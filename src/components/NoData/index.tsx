import "./index.less";

import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import { T12 } from "@/assets/image/index";

const app = Taro.getApp();

const NoData = ({ title }) => {
  return (
    <View className="nodata">
      <Image src={T12} mode="widthFix" className="img" />
      <View className="txt">{title}</View>
      <View className="back" onClick={() => app.to(1)}>
        返回
      </View>
    </View>
  );
};

export default NoData;
