import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import { P2, P6, P9 } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import { SET_COMMON, SET_EXCHANGE_GOOD } from "@/src/store/constants";
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
    let res = await api.counter.getNearCounterList({ type: "DIRECT_SALE" });
    let list = res?.data.map((item: any) => ({
      ...item.address,
      ...item.detailInfo,
      id: item.id,
    }));
    setCounterList(list);
  });

  useEffect(() => {
    dispatch({
      type: SET_COMMON,
      payload: {
        changeExchange: true,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    if (changeExchange) {
      setShowApply(true);
      getCounterList();
      dispatch({
        type: SET_COMMON,
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
      type: SET_EXCHANGE_GOOD,
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
          <View className="w-600 h-600 bg-white vhCenter flex-col">
            <Text className="text-36 font-bold">选择领取方式</Text>
            <View
              className="flex items-center justify-start w-400 mt-50"
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
              </View>
            </View>
            <View className="w-300 text-20 mt-10">*可前往线下门店领取</View>

            {/* 省市区 */}
            <View className="w-500 mt-20 text-26">
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
                <View className="w-full h-full flex justify-between">
                  <View className="w-130 leading-60 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.province ? selectCounter?.province : "省"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                  <View className="w-130 leading-60 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.city ? selectCounter?.city : "市"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                  <View className="w-220 leading-60 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.name ? selectCounter?.name : "柜台"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                </View>
              </MultiplePicker>
            </View>

            <View
              className="flex items-center justify-start w-400 mt-40"
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
                <Text decode>邮寄到家</Text>
              </View>
            </View>
            <View className="text-20 w-300 h-20 mt-10">
              {applyType === "express" && `*100积分抵扣邮费`}
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
