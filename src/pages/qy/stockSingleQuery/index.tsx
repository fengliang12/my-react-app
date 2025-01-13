import { Input, Picker, Text, View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";

const Index = () => {
  return (
    <View className="bg-[#F8F5F8] min-h-screen">
      <CHeader
        fill
        titleColor="#FFFFFF"
        backgroundColor="#000000"
        title="单品实际库存"
      ></CHeader>
      <View className="w-700 mt-33 ml-25 bg-white">
        <View className="px-25 pb-100 text-24">
          {/* 申请时间 */}
          <View className="w-full pt-58 flex justify-between items-center pb-30">
            <Text className="min-w-125 font-bold">产品code</Text>
            <Text className="flex-1 mx-52 font-bold">产品名称</Text>
            <Text className="min-w-100 text-right font-bold">数量</Text>
          </View>
          <View className="w-full h-1 bg-[#CCCCCC]"></View>
          {/* 商品信息 */}
          <View className="pt-36 text-24">
            <View className="w-full flex justify-between items-start mb-36">
              <Text className="min-w-125">34501613</Text>
              <Text className="flex-1 mx-52">NARS流光美肌轻透粉饼 TOA 3g</Text>
              <Text className="min-w-100 text-right">100</Text>
            </View>
            <View className="w-full flex justify-between items-start mb-36">
              <Text className="min-w-125">34501613</Text>
              <Text className="flex-1 mx-52">NARS流光美肌轻透粉饼 TOA 3g</Text>
              <Text className="min-w-100 text-right">100</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Index;
