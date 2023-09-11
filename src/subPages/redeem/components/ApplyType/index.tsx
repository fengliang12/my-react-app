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
  callback: (e: any) => void;
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
  const [applyType, setApplyType] = useState<string>("express");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeExchange]);

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
      type: "SET_COUNTER",
      payload: {
        counter: selectCounter,
      },
    });

    setShowApply(false);
    callback &&
      callback({
        applyType: applyType,
        counterId: selectCounter?.id ?? "",
      });
  });

  return (
    <>
      {showApply && (
        <CPopup>
          <View className="w-468 h-526 bg-white vhCenter flex-col">
            <Text className="font-bold">选择领取方式</Text>
            <View
              className="flex items-center justify-start w-340 mt-50"
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
            <View className="w-360 h-55 mt-20 text-26 px-10">
              <MultiplePicker
                isCascadeData={false}
                cascadeCount={3}
                pickerData={counterList}
                customKeyList={["province", "city", "name"]}
                callback={(counter) => {
                  setSelectCounter(counter);
                }}
              >
                <View
                  className="w-full h-full px-10"
                  style={{ border: "1px solid #959595", lineHeight: "55rpx" }}
                >
                  {!selectCounter ? (
                    <Text>省/市/区</Text>
                  ) : (
                    <Text>{selectCounter?.name}</Text>
                  )}
                </View>
              </MultiplePicker>
            </View>
            {/* 省市区 */}

            <View
              className="flex items-center justify-start w-340 mt-30"
              onClick={() => setApplyType("express")}
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
              <View>
                <View>邮寄到家（付邮/积分抵邮）</View>
                <View className="text-12">*可前往官方商城购买后领取随单</View>
              </View>
            </View>
            <View
              className="w-155 h-55 text-28 vhCenter bg-black text-white mt-50"
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
