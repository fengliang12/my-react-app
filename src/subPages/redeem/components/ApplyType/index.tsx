import { Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CPopup from "@/src/components/Common/CPopup";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import toast from "@/src/utils/toast";

interface PropsType {
  callback?: () => void;
}

const app: App.GlobalData = Taro.getApp();
const Index: React.FC<PropsType> = (props) => {
  let { callback } = props;
  const changeExchange = useSelector(
    (state: Store.States) => state.common.changeExchange,
  );
  const dispatch = useDispatch();
  const [counterList, setCounterList] = useState<any>([]);
  const [showApply, setShowApply] = useState<boolean>(false);
  const [applyType, setApplyType] = useState<string>("self_pick_up");
  const [selectCounter, setSelectCounter] = useState<any>(null);

  /**
   * 获取门店
   */
  const getCounterList = useMemoizedFn(async () => {
    await app.init();
    let res = await api.counter.getCounterList();
    let list = res?.data.map((item: any) => ({
      ...item.address,
      ...item.detailInfo,
      id: item.id,
    }));
    setCounterList(list);
    console.log(list);
  });

  useEffect(() => {
    dispatch({
      type: "CHANGE_EXCHANGE",
      payload: {
        changeExchange: true,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (changeExchange) {
      setShowApply(true);
      getCounterList();
      dispatch({
        type: "CHANGE_EXCHANGE",
        payload: {
          changeExchange: false,
        },
      });
    }
  }, [changeExchange, dispatch, getCounterList]);

  /**
   * 确认
   */
  const confirm = useMemoizedFn(() => {
    if (!applyType) {
      toast("请先选择领取方式");
      return;
    }
    if (applyType === "self_pick_up" && !selectCounter?.id) {
      toast("请先选择申领柜台");
      return;
    }
    dispatch({
      type: "CHANGE_EXCHANGE_GOOD",
      payload: {
        applyType: applyType,
        counter: selectCounter,
      },
    });
    callback && callback();
    setShowApply(false);
  });

  return (
    <>
      {showApply && (
        <CPopup catchMove>
          <View className="w-550 h-600 bg-white vhCenter flex-col">
            <Text className="font-bold text-38">选择领取方式</Text>
            <View
              className="flex items-center justify-start w-440 mt-50"
              onClick={() => setApplyType("self_pick_up")}
            >
              <View
                className="w-30 h-30 rounded-30 mr-20 vhCenter"
                style={{ border: "1px solid #959595" }}
              >
                {applyType === "self_pick_up" && (
                  <View
                    className="w-18 h-18 rounded-30"
                    style={{ backgroundColor: "#959595" }}
                  ></View>
                )}
              </View>
              <View>
                <View>免费到柜领取</View>
                <View className="text-12">*可前往线下门店领取</View>
              </View>
            </View>
            <View className="w-440 h-55 mt-20 text-26 px-10">
              <MultiplePicker
                isCascadeData={false}
                cascadeCount={3}
                pickerData={counterList}
                customKeyList={["province", "city", "name"]}
                callback={(counter) => {
                  if (applyType === "express") return toast("请先选择免费到柜");
                  setSelectCounter(counter);
                }}
              >
                <View
                  className="w-full h-full px-10"
                  style={{ border: "1px solid #959595", lineHeight: "55rpx" }}
                >
                  {!selectCounter ? (
                    <Text>省/市/柜台</Text>
                  ) : (
                    <Text>{selectCounter?.name}</Text>
                  )}
                </View>
              </MultiplePicker>
            </View>
            {/* 省市区 */}

            <View
              className="flex items-center justify-start w-440 mt-30"
              onClick={() => {
                setSelectCounter(null);
                setApplyType("express");
              }}
            >
              <View
                className="w-30 h-30 rounded-30 mr-20 vhCenter"
                style={{ border: "1px solid #959595" }}
              >
                {applyType === "express" && (
                  <View
                    className="w-18 h-18 rounded-30"
                    style={{ backgroundColor: "#959595" }}
                  ></View>
                )}
              </View>
              <View className="flex-1">
                <Text decode>邮寄到家(付邮/积分抵邮)</Text>
                <View className="text-16">*可前往官方商城购买后领取随单</View>
              </View>
            </View>
            <View
              className="w-180 h-55 text-28 vhCenter bg-black text-white mt-50"
              onClick={confirm}
            >
              确定
            </View>
          </View>
        </CPopup>
      )}
    </>
  );
};
export default Index;
