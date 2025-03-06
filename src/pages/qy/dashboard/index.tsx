import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";

import DashboardItem from "../components/DashboardItem";

const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const qyUser = useSelector((state: Store.States) => state.qyUser);

  const [pointList, setPointList] = useState<
    Api.QYWX.SingleCounterStock.IResponse[]
  >([]);

  /**
   * 获取记录
   */
  const getPointList = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.qy.counterStock({});
    setPointList(res.data);
    Taro.hideLoading();
    return res.data;
  });

  useEffect(() => {
    getPointList();
  }, []);

  return (
    <View className="bg-[#F8F5F8] min-h-screen">
      <CHeader
        fill
        titleColor="#FFFFFF"
        backgroundColor="#000000"
        title=""
      ></CHeader>

      <View className="w-full pt-54 flex flex-col items-center">
        <View className="text-48 font-bold">{qyUser.name}</View>
        <View className="w-122 h-36 bg-[#000] text-[#fff] vhCenter mt-20 text-24">
          彩妆师
        </View>
        {/* TODO: 入参 */}
        <DashboardItem type="country" pointList={pointList}></DashboardItem>
      </View>
    </View>
  );
};
export default Index;
