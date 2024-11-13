import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import { P9 } from "@/src/assets/image";
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
  const [applyType] = useState<string>("self_pick_up");
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

  useAsyncEffect(async () => {
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
          <View className="w-615 h-434 bg-white vhCenter flex-col">
            <View className="flex items-center justify-start w-520">
              <View className="text-36">免费到柜领取</View>
            </View>
            <View className="w-520 text-16 mt-25" style="white-space: nowrap">
              *选择领取门店后，您的所属门店将默认调整为所选门店
            </View>

            {/* 省市区 */}
            <View className="w-520 mt-43 text-26">
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
                  <View className="w-130 leading-50 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.province ? selectCounter?.province : "省"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                  <View className="w-130 leading-50 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.city ? selectCounter?.city : "市"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                  <View className="w-220 leading-50 border_999 flex justify-between items-center px-10 box-border">
                    <Text className="inline-block text-overflow">
                      {selectCounter?.name ? selectCounter?.name : "柜台"}
                    </Text>
                    <CImage className="w-20 h-16" src={P9}></CImage>
                  </View>
                </View>
              </MultiplePicker>
            </View>

            <View
              className="w-180 h-50 text-28 vhCenter bg-black text-white mt-77"
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
