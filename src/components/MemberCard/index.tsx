import { Text, View } from "@tarojs/components";
import { useSelector } from "react-redux";

import { P5 } from "@/src/assets/image";
import config from "@/src/config";
import to from "@/src/utils/to";

import CImage from "../Common/CImage";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <View
      className="w-full h-610 overflow-hidden bg-cover"
      style={{
        backgroundImage: `url(${config.imgBaseUrl}/index/header_bg.png)`,
      }}
    >
      <View
        className="w-690 h-368 m-auto mt-150 bg-cover py-24 px-27 box-border relative"
        style={{
          backgroundImage: `url(${config.imgBaseUrl}/index/card_bg.png)`,
        }}
      >
        <View className="w-full flex items-start">
          <View className="flex items-center justify-center relative">
            <CImage
              className="w-120 h-120 mr-20 rounded-120"
              src={userInfo.avatarUrl || P5}
              onClick={() => to("/pages/update/index")}
            ></CImage>
            <CImage
              className="w-30 h-30 absolute bottom-10 left-80"
              src={`${config.imgBaseUrl}/index/icon_edit.png`}
              onClick={() => to("/pages/update/index")}
            ></CImage>
            <View>
              <View className="text-32">普通会员</View>
              <View className="text-38">{userInfo.realName}</View>
              <View className="flex items-end text-18">
                <CImage
                  className="w-18 h-18 mr-6"
                  src={`${config.imgBaseUrl}/index/icon_qrcode.png`}
                ></CImage>
                <Text>我的二维码</Text>
              </View>
            </View>
          </View>
          <View className="flex-1 h-full flex items-end flex-col">
            <View className="text-46">0</View>
            <CImage
              className="w-116 h-24"
              src={`${config.imgBaseUrl}/index/icon_redeem.png`}
            ></CImage>
          </View>
        </View>
        <View className="w-full h-6 mt-64 bg-slate-50 rounded-6 flex justify-start items-center">
          <View
            className="h-full w-100 rounded-6 overflow-hidden"
            style="background-color:#762022"
          ></View>
          <View
            className="h-20 w-20 rounded-20"
            style="background-color:#762022;box-shadow:0rpx 0rpx 10rpx #762022"
          ></View>
        </View>
        <View className="w-full h-6 text-black text-right text-18 mt-30">
          任意消费即可升级成为玩妆达人
        </View>
        <View className="absolute bottom-20 left-25 text-18 underline">
          会员规则
        </View>
      </View>
    </View>
  );
};
export default Index;
