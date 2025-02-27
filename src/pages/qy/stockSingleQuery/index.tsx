import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import useNavigationBar from "@/src/hooks/useNavigationBar";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const { contentHeight } = useNavigationBar();
  const [stockList, setStockList] = useState<
    Api.QYWX.SingleCounterStock.IResponse[]
  >([]);

  /**
   * 获取记录
   */
  const getStockList = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.qy.singleCounterStock({
      counterId: "00300123",
      bonusPointId: "D5UYZGzv3xa6H6huj36XDY",
    });
    setStockList(res.data);
    Taro.hideLoading();
    return res.data;
  });

  useEffect(() => {
    getStockList();
  }, []);

  return (
    <View className="bg-[#F8F5F8] min-h-screen">
      <CHeader
        fill
        titleColor="#FFFFFF"
        backgroundColor="#000000"
        title="单品实际库存"
      ></CHeader>
      <ScrollView
        className="w-700 h-full mt-33 ml-25 bg-white"
        style={{
          height: `calc(${contentHeight} - 50px)`,
        }}
        scrollY
      >
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
            {stockList?.length > 0 &&
              stockList?.map((item: any) => {
                return (
                  <View
                    key={item.id}
                    className="w-full flex justify-between items-start mb-36"
                  >
                    <Text className="min-w-125">{item.giftCode}</Text>
                    <Text className="flex-1 mx-52">{item.name}</Text>
                    <Text className="min-w-100 text-right">
                      {item.inventory}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Index;
