import { Text, View } from "@tarojs/components";
import React, { useEffect } from "react";

import CHeader from "@/src/components/Common/CHeader";

import MiniGoodClass from "./components/MiniGoodClass";

const Index = () => {
  useEffect(() => {});

  /**
   * 选择商品
   * @param e
   * @returns
   */
  const clickSelectGood = (id) => {};

  return (
    <View className="h-screen bg-black flex flex-col">
      <CHeader
        back
        fill
        title="积分商城"
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>

      <View className="h-240 vhCenter text-white text-26">
        <View className="flex-1 vhCenter flex-col">
          <Text className="text-80">2000</Text>
          <Text>{`积分明细 >`}</Text>
        </View>
        <View className="w-1 h-100 bg-white"></View>
        <View className="flex-1 vhCenter flex-col">
          <Text className="underline">兑礼记录</Text>
          <Text className="underline mt-30">兑换规则</Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-50">
        {/* 产品信息 */}
        <MiniGoodClass
          goodClassList={[
            {
              point: 2000,
              data: [
                {
                  id: "A",
                  name: "测试商品",
                  point: 2000,
                  mainImage:
                    "https://res-wxec-unipt.lorealchina.com/prod/gac_points/20230726/a19ada98-519f-4ba9-8402-bbdf33dc3ee0.png",
                },
                {
                  id: "B",
                  name: "测试商品1",
                  point: 2000,
                  mainImage:
                    "https://res-wxec-unipt.lorealchina.com/prod/gac_points/20230726/a19ada98-519f-4ba9-8402-bbdf33dc3ee0.png",
                },
              ],
            },
            {
              point: 3000,
              data: [
                {
                  id: "B",
                  name: "测试商品1",
                  point: 2000,
                  mainImage:
                    "https://res-wxec-unipt.lorealchina.com/prod/gac_points/20230726/a19ada98-519f-4ba9-8402-bbdf33dc3ee0.png",
                },
              ],
            },
          ]}
          clickSelectGood={clickSelectGood}
          addCart={() => {}}
          goPage={() => {}}
        ></MiniGoodClass>
      </View>
    </View>
  );
};
export default Index;
