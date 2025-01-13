import { Input, Picker, Text, View } from "@tarojs/components";
import React, { useEffect } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const FilterList: Array<{
  title: string;
  key: string;
}> = [
  {
    title: "全部",
    key: "all",
  },
  {
    title: "1000",
    key: "1000",
  },
  {
    title: "2000",
    key: "2000",
  },
  {
    title: "4000",
    key: "4000",
  },
  {
    title: "5000",
    key: "5000",
  },
];
const Index = () => {
  return (
    <View className="bg-[#F8F5F8] min-h-screen pb-100">
      <CHeader fill titleColor="#FFFFFF" backgroundColor="#000000"></CHeader>

      {/* 过滤 */}
      <View className="w-full h-55 text-20 text-white bg-[#510712] flex justify-start items-center pl-50 box-border">
        <CImage
          className="w-18 h-19 mr-12"
          src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/qy/home/warning.png"
        ></CImage>
        库存盘点请以单品实际库存为准；共用产品不重复计算库存
      </View>
      <View className="bg-black px-49 pb-98">
        <View
          className="underline text-right text-white pt-50 text-24 mb-28"
          onClick={() => {
            console.log(1111);

            to("/pages/qy/stockSingleQuery/index");
          }}
        >
          单品实际库存
        </View>
        <View className="text-48 text-white font-bold text-center mb-78">
          库存查询
        </View>
        <View className="flex justify-between items-center mb-24">
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东大区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
          <Picker
            className="w-316"
            mode="selector"
            range={[]}
            onChange={() => {}}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">东一区</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>

        <View className="mb-24">
          <Picker mode="selector" range={[]} onChange={() => {}}>
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">上海新世界</View>
              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        </View>
      </View>

      <View className="w-700 mt-33 ml-25 bg-white">
        {/* tab栏 */}
        <View className="w-full h-100 bg-black text-white flex justify-between text-24">
          {FilterList.map((item) => {
            return (
              <View className="flex-1 h-full vhCenter" key={item.key}>
                {item.title}
              </View>
            );
          })}
        </View>

        <View className="px-25 pb-100 text-24">
          {/* 申请时间 */}
          <View className="w-full pt-30 flex justify-between items-center">
            <Text>GP460499</Text>
            <Text className="text-[#C5112C]">2000积分</Text>
          </View>
          <View className="w-full h-90 flex justify-between items-center">
            礼品名称:NARS随行套组
          </View>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>

          {/* 商品信息 */}
          <View className="pt-36">
            <View className="w-full h-70 flex justify-between items-center mt-12">
              <Text>礼品详情</Text>
              <View>实际库存剩余</View>
            </View>
            <View className="w-full flex justify-between items-center mb-36">
              <Text>NARS 流光美肌轻透蜜粉饼 TOA 3g</Text>
              <View>100</View>
            </View>
            <View className="w-full flex justify-between items-center mb-36">
              <Text>NARS 流光美肌粉底液 TOA 4ml</Text>
              <View>80</View>
            </View>
          </View>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>

          {/* 客人信息 */}
          <View className="pt-62 flex justify-center">
            <View className="w-full flex justify-between items-center flex-col mb-36">
              <Text>已预约未核销</Text>
              <View className="mt-48 text-72 font-bold text-[#C5112C]">20</View>
            </View>
            <View className="w-full flex justify-between items-center flex-col mb-36">
              <Text>可用库存</Text>
              <View className="mt-48 text-72 font-bold text-[#C5112C]">20</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
