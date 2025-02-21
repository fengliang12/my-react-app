import { Text, View } from "@tarojs/components";
import React, { useEffect } from "react";

const Index = () => {
  useEffect(() => {});

  return (
    <>
      <View className="w-full h-90 flex justify-between items-center">
        {/* 申请时间 */}
        <Text>申请时间:2024.6.28 13:42:31</Text>
        <Text>已核销</Text>
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {/* 商品信息 */}
      <View className="pt-36">
        <View className="w-full flex justify-between items-center mb-36">
          <Text>产品名称产品名称15ml</Text>
          <View>
            <Text className="mr-43">x1</Text>
            <Text>4000积分</Text>
          </View>
        </View>
        <View className="w-full flex justify-between items-center mb-36">
          <Text>产品名称产品名称15ml</Text>
          <View>
            <Text className="mr-43">x1</Text>
            <Text>4000积分</Text>
          </View>
        </View>

        <View className="w-full h-70 flex justify-between items-center mt-12">
          <Text>订单积分</Text>
          <View>8000积分</View>
        </View>
      </View>
      <View className="w-full h-1 bg-[#CCCCCC]"></View>

      {/* 客人信息 */}
      <View className="pt-36">
        <View className="w-full flex justify-between items-center mb-36">
          <Text>预约会员:张三</Text>
          <View>手机号:13456783456</View>
        </View>
        <View className="w-full flex justify-between items-center mb-36">
          <Text>所属彩妆师:张兰</Text>
          <View>兑礼有效期至:2024.7.28 23:59:59</View>
        </View>
      </View>
    </>
  );
};
export default Index;
