import { Input, Picker, Text, View } from "@tarojs/components";

import { P11 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

const Index = () => {
  return (
    <View className="bg-[#F8F5F8] min-h-screen">
      <CHeader
        fill
        titleColor="#FFFFFF"
        backgroundColor="#000000"
        title=""
      ></CHeader>

      <View className="w-full pt-54 flex flex-col items-center">
        <View className="text-48 font-bold">王希</View>
        <View className="w-122 h-36 bg-[#000] text-[#fff] vhCenter mt-20 text-24">
          大区经理
        </View>
        <View className="w-656 box-border mt-38 bg-white border border-1 border-[#000]">
          {/* 申请时间 */}
          <View className="w-full h-80 px-34 box-border flex justify-start items-center bg-black text-white">
            <Text className="text-24 mr-30">彩妆师</Text>
            <Text className="text-24">张兰</Text>
          </View>
          <View className="w-full">
            <View className="w-full pt-40 ">
              <View className="w-full text-24 font-bold text-center font-600">
                积分兑礼情况
              </View>

              {/* 筛选框 */}
              <View className="flex justify-center items-center mt-40 mb-37">
                <Picker
                  className="w-280 mr-28"
                  mode="date"
                  value=""
                  onChange={() => {}}
                >
                  <View className="w-280 h-80 px-30 text-24 flex items-center justify-start relative box-border border-solid border-2">
                    <View className="picker">东一区</View>
                    <CImage
                      className="absolute right-27 w-14 h-8"
                      src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
                    ></CImage>
                  </View>
                </Picker>
                <Picker
                  className="w-280"
                  mode="selector"
                  range={[]}
                  onChange={() => {}}
                >
                  <View className=" border-solid border-2 w-280 h-80 px-30 text-24 flex items-center justify-start relative box-border">
                    <View className="picker">东一区</View>
                    <CImage
                      className="absolute right-27 w-14 h-8"
                      src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
                    ></CImage>
                  </View>
                </Picker>
              </View>

              <View className="w-593 h-1 ml-35 bg-[#CCCCCC]"></View>

              {/* 数据 */}
              <View className="flex flex-col justify-center items-center mt-37 mb-45 text-24">
                <View className="w-full flex justify-around items-center mb-44">
                  <View className="flex-1 text-center"></View>
                  <View className="flex-1 text-center">已预约</View>
                  <View className="flex-1 text-center">已核销</View>
                  <View className="flex-1 text-center">已过期</View>
                </View>
                <View className="w-full flex justify-around items-center mb-44">
                  <View className="flex-1 text-center">会员数</View>
                  <View className="flex-1 text-center">2000</View>
                  <View className="flex-1 text-center">1800</View>
                  <View className="flex-1 text-center">100</View>
                </View>
                <View className="w-full flex justify-around items-center mb-44">
                  <View className="flex-1 text-center">订单数</View>
                  <View className="flex-1 text-center">2500</View>
                  <View className="flex-1 text-center">1900</View>
                  <View className="flex-1 text-center">80</View>
                </View>
                <View className="w-full flex justify-around items-center mb-44">
                  <View className="flex-1 text-center">订单数</View>
                  <View className="flex-1 text-center">2500</View>
                  <View className="flex-1 text-center">1900</View>
                  <View className="flex-1 text-center">80</View>
                </View>
              </View>

              <View className="w-full flex justify-center items-center pb-22">
                <Text className="text-24 mr-10">收起</Text>
                <CImage
                  className="w-14 h-8 transform rotate-180"
                  src={P11}
                ></CImage>
              </View>
            </View>
            {/* 展开底部 */}
            <View className="w-full px-34 h-100 flex justify-between items-center text-24 box-border">
              <Text className="font-bold">进入数据看板</Text>
              <View className="w-80 flex justify-between items-center">
                <Text>展开</Text>
                <CImage className="w-14 h-8" src={P11}></CImage>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
