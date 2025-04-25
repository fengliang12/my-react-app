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
import { isBetween, setShareParams } from "@/src/utils";
import handleGoodClass from "@/src/utils/handleGoodClass";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import AddCart from "./components/AddCart";
import ApplyType from "./components/ApplyType";
import MiniGoodClass from "./components/MiniGoodClass";
import SelectCounter from "./components/SelectCounter";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: Store.States) => state.user);
  const [show, { setTrue, setFalse }] = useBoolean(false);
  const { applyType, showExpress, counter } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );

  /**
   * 获取商品列表
   */
  const [originList, setOriginList] = useState<any>([]);
  const [goodList, setGoodList] = useState<any>([]);

  /**
   * 获取商品列表
   */
  const getGoodList = useMemoizedFn(async () => {
    if (!applyType || (applyType === "self_pick_up" && !counter?.id)) return;

    await app.init();
    let params = {
      counterId:
        applyType === "self_pick_up" && counter?.id ? counter?.id : undefined,
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
        } else {
          setOriginList([]);
          setGoodList([]);
        }
      })
      .catch(() => {
        setOriginList([]);
        setGoodList([]);
      });
  });

  useDidShow(async () => {
    let ret = await api.kvdata.getKvDataByType("show_express_time");
    let kvData = ret?.data?.[0];
    let timeInfo = JSON.parse(kvData?.content || "{}");
    let tempExpress = false;
    if (
      timeInfo?.from &&
      timeInfo?.to &&
      isBetween(timeInfo?.from, timeInfo?.to)
    ) {
      tempExpress = true;
    } else {
      tempExpress = false;
    }

    getGoodList();
    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        showExpress: tempExpress,
      },
    });
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
        applyType: "self_pick_up",
        channelType: "immediately",
        postageType: "points",
        selectCounter: null,
        showRedDot: false,
        showExpress: false,
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

      {/* 选择领取方式 */}
      {showExpress && <ApplyType></ApplyType>}

      {/* 产品信息 */}
      <View className="flex-1 bg-white rounded-t-50 overflow-hidden">
        {/* 线下兑礼需要选中门店 */}
        {applyType === "self_pick_up" && (
          <SelectCounter
            callback={(counter) => {
              dispatch({
                type: SET_EXCHANGE_GOOD,
                payload: {
                  counter: counter,
                },
              });
            }}
          ></SelectCounter>
        )}

        {originList?.length > 0 ? (
          <MiniGoodClass
            goodClassList={goodList}
            originList={originList}
          ></MiniGoodClass>
        ) : (
          <View className="mt-300 text-center text-24 color-[#333333]">
            {!counter?.id && applyType === "self_pick_up"
              ? "请选择领取柜台"
              : "暂无商品"}
          </View>
        )}
      </View>

      {/* 购物车 */}
      {applyType && <AddCart></AddCart>}

      {/* 活动规则 */}
      <View style={setShow(show)}>
        <CPopup maskClose closePopup={setFalse}>
          <View className="w-640 bg-white rounded-20 overflow-hidden">
            <CImage
              className="w-full h-full"
              mode="widthFix"
              src={`${config.imgBaseUrl}/redeem/rule_04.png`}
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
