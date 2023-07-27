import { Text, View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";

const Index = () => {
  return (
    <View className="service-list min-h-screen bg-black text-white flex flex-col font-thin">
      <CHeader
        back
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <View className="text-54 text-center mt-10 font-thin mb-40">
        预约记录
      </View>
      <View className="w-690 h-310 bg-grayBg p-25 flex box-border ml-30 mb-40">
        <CImage
          className="w-318 h-259"
          src="https://biomember.blob.core.chinacloudapi.cn/gac/nars/appointment_icon.jpg"
        ></CImage>
        <View className="flex-1 vhCenter flex-col text-center">
          <View className="text-36">先锋妆容</View>
          <View className="mt-28 text-24">上海芮欧百货店</View>
          <View className="text-24">2023年8月11日 14:00</View>
          <View className="w-222 text-22 h-50 text-black vhCenter bg-white rounded-6 mt-20">
            待使用
          </View>
        </View>
      </View>
      <View className="w-690 h-310 bg-grayBg p-25 flex box-border ml-30  mb-40">
        <CImage
          className="w-318 h-259"
          src="https://biomember.blob.core.chinacloudapi.cn/gac/nars/appointment_icon.jpg"
        ></CImage>
        <View className="flex-1 vhCenter flex-col text-center">
          <View className="text-36">先锋妆容</View>
          <View className="mt-28 text-24">上海芮欧百货店</View>
          <View className="text-24">2023年8月11日 14:00</View>
          <View className="w-222 text-22 h-50 text-black vhCenter bg-white rounded-6 mt-20">
            待使用
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
