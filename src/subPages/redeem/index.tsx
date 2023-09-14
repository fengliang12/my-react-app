import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useBoolean, useMemoizedFn, useSetState } from "ahooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import handleGoodClass from "@/src/utils/handleGoodClass";
import setShow from "@/src/utils/setShow";
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
  const userInfo = useSelector((state: Store.States) => state.user);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const applyType = useSelector(
    (state: Store.States) => state.exchangeGood.applyType,
  );
  const counter = useSelector(
    (state: Store.States) => state.exchangeGood.counter,
  );

  /**
   * 获取商品列表
   */
  const [originList, setOriginList] = useState<any>([]);
  const [goodList, setGoodList] = useState<any>([]);
  const getGoodList = useMemoizedFn(async () => {
    await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    let params = {
      counterId: counter?.id || undefined,
    };
    let res = await api.buyBonusPoint.getBonusPointList(params);
    Taro.hideLoading();

    if (res?.data?.length) {
      setOriginList(res?.data);
      const list = handleGoodClass(res.data);
      setGoodList(list);
    }
  });

  useEffect(() => {
    if (applyType) {
      getGoodList();
    }
  }, [applyType, counter, getGoodList]);

  /**
   * 直接购买
   */
  const goPage = useMemoizedFn((good) => {
    dispatch({
      type: "SET_EXCHANGE_GOOD",
      payload: {
        goods: [{ ...good, quantity: 1 }],
      },
    });
    to(`/subPages/redeem/confirm/index`, "navigateTo");
  });

  /**
   * 添加购物车
   */
  const addCart = useMemoizedFn(async (item: any) => {
    Taro.showLoading({ title: "加载中", mask: true });
    let res = await api.cart.append({
      integral: true,
      quantity: 1,
      skuId: item.skuId,
      counterId: counter?.id,
      customPointsPayPlan: {
        redeemPoints: item.point,
        notValidateUsablePoints: false,
        usePoints: true,
      },
    });
    Taro.hideLoading();
    if (res) {
      toast("商品添加成功");
    }
  });

  return (
    <View className="min-h-screen bg-black flex flex-col">
      <CHeader
        back
        fill
        title="积分商城"
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>

      <View className="h-240 vhCenter text-white text-26">
        <View className="flex-1 vhCenter flex-col">
          <Text className="text-80">{userInfo.points}</Text>
          <Text
            onClick={() => to("/subPages/common/pointsDetail/index")}
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
          <Text className="underline mt-30" onClick={setTrue}>
            兑换规则
          </Text>
        </View>
      </View>

      {/* 产品信息 */}
      <View className="flex-1 bg-white rounded-t-50">
        <MiniGoodClass
          goodClassList={goodList}
          originList={originList}
          addCart={addCart}
          goPage={goPage}
        ></MiniGoodClass>
      </View>

      {/* 选择领取方式 */}
      <ApplyType></ApplyType>

      {/* 购物车 */}
      <AddCart></AddCart>

      {/* 活动规则 */}
      <View style={setShow(show)}>
        <CPopup maskClose closePopup={setFalse}>
          <View className="w-690 h-1008 bg-white rounded-20">
            <CImage
              className="w-full h-full"
              src="https://can-uat-prod-baum-oss.oss-cn-shanghai.aliyuncs.com/coupon/rule.png"
            ></CImage>
            <View
              className="absolute w-80 h-80 top-20 right-10 vhCenter"
              onClick={setFalse}
            ></View>
          </View>
        </CPopup>
      </View>
    </View>
  );
};
export default Index;
