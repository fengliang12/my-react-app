import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import handleGoodClass from "@/src/utils/handleGoodClass";
import to from "@/src/utils/to";

import AddCart from "./components/AddCart";
import ApplyType from "./components/ApplyType";
import MiniGoodClass from "./components/MiniGoodClass";

interface ApplyType {
  applyType: string;
  counterId: string;
}
const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const dispatch = useDispatch();
  const [applyObj, setApplyObj] = useSetState<ApplyType>({
    applyType: "",
    counterId: "",
  });

  /**
   * 获取商品列表
   */
  const [goodList, setGoodList] = useState<any>([]);
  const getGoodList = useMemoizedFn(async () => {
    await app.init();
    let res = await api.buyBonusPoint.getBonusPointList({
      counterId: applyObj.counterId,
    });
    if (res?.data?.length) {
      const list = handleGoodClass(res.data);
      setGoodList(list);
    }
  });

  useEffect(() => {
    if (applyObj.applyType) {
      getGoodList();
    }
  }, [applyObj?.applyType, getGoodList]);

  /**
   * 选择商品
   * @param e
   * @returns
   */
  const clickSelectGood = (id) => {};

  /**
   * 添加购物车
   */
  const addCart = async (item: any) => {
    console.log("商品", item);
    let res = await api.cart.append({
      integral: true,
      quantity: 1,
      skuId: item.skuId,
      customPointsPayPlan: {
        redeemPoints: 1000,
        notValidateUsablePoints: true,
        usePoints: true,
      },
    });
    console.log("res", res);
  };

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
          goodClassList={goodList}
          clickSelectGood={clickSelectGood}
          addCart={addCart}
          goPage={(good) => {
            dispatch({
              type: "SET_EXCHANGE_GOOD",
              payload: {
                goods: [good],
              },
            });
            to("/subPages/redeem/confirm/index", "navigateTo");
          }}
        ></MiniGoodClass>
      </View>

      {/* 选择领取方式 */}
      <ApplyType
        callback={(e) => {
          setApplyObj({ ...e });
        }}
      ></ApplyType>

      {/* 购物车 */}
      <AddCart></AddCart>
    </View>
  );
};
export default Index;
