import { Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage, useUnload } from "@tarojs/taro";
import { useBoolean, useMemoizedFn, useUpdateEffect } from "ahooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import config from "@/src/config";
import { SET_EXCHANGE_GOOD } from "@/src/store/constants";
import { setShareParams } from "@/src/utils";
import handleGoodClass from "@/src/utils/handleGoodClass";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import AddCart from "./components/AddCart";
import ApplyType from "./components/ApplyType";
import ApplyTypeOnlyPickUp from "./components/ApplyTypeOnlyPickUp";
import MiniGoodClass from "./components/MiniGoodClass";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: Store.States) => state.user);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const { applyType, counter } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );
  const [hideExpress, setHideExpress] = useState<string>("");

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
    await api.buyBonusPoint
      .getBonusPointList(params)
      .then((res) => {
        if (res?.data?.length) {
          // 根据积分排序
          res?.data.sort((a, b) => {
            return b.point - a.point;
          });

          let tempList: any = [];
          res?.data.forEach((item: any) => {
            if (item.sellOut) {
              tempList.push(item);
            } else {
              tempList.unshift(item);
            }
          });
          setOriginList(tempList);
          const list = handleGoodClass(tempList);
          setGoodList(list);
        }
      })
      .catch(() => {
        setOriginList([]);
        setGoodList([]);
      });
  });

  useDidShow(async () => {
    let ret = await api.kvdata.getKvDataByType("hide_express");
    let kvData = ret?.data?.[0];
    if (kvData) {
      setHideExpress(kvData?.content || "");
    }
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
        showRedDot: false,
      },
    });
  });

  useShareAppMessage(() => {
    return setShareParams();
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
        <View
          className="flex-1 vhCenter flex-col"
          onClick={() => to("/subPages/common/pointsDetail/index")}
        >
          <Text className="text-80 ENGLISH_FAMILY">{userInfo.points}</Text>
          <Text>{`积分明细 >`}</Text>
        </View>
        <View className="w-1 h-100 bg-white opacity-60"></View>
        <View className="flex-1 vhCenter flex-col text-26">
          <Text
            className="borderBottomWhite"
            onClick={() => to("/subPages/redeem/orderList/index")}
          >
            兑礼记录
          </Text>
          <Text className="borderBottomWhite mt-30 text-26" onClick={setTrue}>
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
      {hideExpress && (
        <>
          {hideExpress === "true" ? (
            <ApplyTypeOnlyPickUp></ApplyTypeOnlyPickUp>
          ) : (
            <ApplyType></ApplyType>
          )}
        </>
      )}

      {/* 购物车 */}
      {applyType && <AddCart></AddCart>}

      {/* 活动规则 */}
      <View style={setShow(show)}>
        <CPopup maskClose closePopup={setFalse}>
          <View className="w-640 h-1037 bg-white rounded-20 overflow-hidden">
            <CImage
              className="w-full h-full"
              src={`${config.imgBaseUrl}/redeem/rule_02.png`}
            ></CImage>
            <View
              className="absolute w-80 h-80 top-0 right-10 vhCenter"
              onClick={setFalse}
            ></View>
          </View>
        </CPopup>
      </View>
    </View>
  );
};
export default Index;

definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
