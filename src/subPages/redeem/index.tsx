import { Text, View } from "@tarojs/components";
import Taro, { useDidShow, useUnload } from "@tarojs/taro";
import { useBoolean, useMemoizedFn, useUpdateEffect } from "ahooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import { SET_EXCHANGE_GOOD } from "@/src/store/constants";
import handleGoodClass from "@/src/utils/handleGoodClass";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import AddCart from "./components/AddCart";
import ApplyType from "./components/ApplyType";
import MiniGoodClass from "./components/MiniGoodClass";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: Store.States) => state.user);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const { applyType, counter } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );

  /**
   * 获取商品列表
   */
  const [originList, setOriginList] = useState<any>([]);
  const [goodList, setGoodList] = useState<any>([]);
  const getGoodList = useMemoizedFn(async () => {
    if (!applyType) return;
    await app.init();
    let params = {
      counterId: counter?.id || undefined,
    };
    let res = await api.buyBonusPoint.getBonusPointList(params);

    if (res?.data?.length) {
      setOriginList(res?.data);
      const list = handleGoodClass(res.data);
      setGoodList(list);
    }
  });

  useDidShow(() => {
    getGoodList();
  });

  useUpdateEffect(() => {
    getGoodList();
  }, [applyType, counter, getGoodList]);

  /**
   * 页面卸载清除缓存
   */
  useUnload(() => {
    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        goods: [],
        applyType: "",
        channelType: "immediately",
        postageType: "points",
        counter: null,
      },
    });
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
      <View className="flex-1 bg-white rounded-t-50 overflow-hidden">
        <MiniGoodClass
          goodClassList={goodList}
          originList={originList}
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
