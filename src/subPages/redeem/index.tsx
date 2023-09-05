import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import handleGoodClass from "@/src/utils/handleGoodClass";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

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
    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.buyBonusPoint.getBonusPointList({
      counterId: applyObj.counterId,
    });
    Taro.hideLoading();

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
   * 直接购买
   */
  const goPage = useMemoizedFn((good) => {
    dispatch({
      type: "SET_EXCHANGE_GOOD",
      payload: {
        goods: [good],
      },
    });
    to(
      `/subPages/redeem/confirm/index?type=${applyObj.applyType}`,
      "navigateTo",
    );
  });

  /**
   * 添加购物车
   */
  const addCart = useMemoizedFn(async (item: any) => {
    let res = await api.cart.append({
      integral: true,
      quantity: 1,
      skuId: item.skuId,
      customPointsPayPlan: {
        redeemPoints: item.point,
        notValidateUsablePoints: true,
        usePoints: true,
      },
    });
    if (res) {
      toast("商品添加成功");
    }
  });

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
          <Text
            onClick={() => to("/subPages/redeem/history/index")}
          >{`积分明细 >`}</Text>
        </View>
        <View className="w-1 h-100 bg-white"></View>
        <View className="flex-1 vhCenter flex-col">
          <Text
            className="underline"
            onClick={() => to("/subPages/redeem/orderList/index")}
          >
            兑礼记录
          </Text>
          <Text className="underline mt-30">兑换规则</Text>
        </View>
      </View>

      {/* 产品信息 */}
      <View className="flex-1 bg-white rounded-t-50">
        <MiniGoodClass
          goodClassList={goodList}
          addCart={addCart}
          goPage={goPage}
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
