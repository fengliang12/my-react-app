import { View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";

import DashboardItem from "../components/DashboardItem";

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
        {/* TODO: 入参 */}
        <DashboardItem></DashboardItem>
      </View>
    </View>
  );
};
export default Index;
