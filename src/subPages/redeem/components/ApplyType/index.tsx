import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";
import config from "@/src/config";
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
  const [showApply, setShowApply] = useState<boolean>(false);
  const [applyType, setApplyType] = useState<Store.ApplyType>("self_pick_up");

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
      dispatch({
        type: SET_COMMON,
        payload: {
          changeExchange: false,
        },
      });
    }
  }, [changeExchange, dispatch]);

  /**
   * 确认
   */
  const confirm = useMemoizedFn(() => {
    if (!applyType) {
      toast("请先选择领取方式");
      return;
    }
    dispatch({
      type: SET_EXCHANGE_GOOD,
      payload: {
        applyType: applyType,
      },
    });
    callback && callback();
    setShowApply(false);
  });

  return (
    <>
      {showApply && (
        <CPopup catchMove>
          <View className="w-600 h-650 bg-white vhCenter flex-col">
            <View>
              <CImage
                className="w-220"
                mode="widthFix"
                src={`${config.imgBaseUrl}/redeem/apply_type_popup.png`}
              ></CImage>
            </View>
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
              <View className="text-30">免费到柜领取</View>
            </View>
            <View className="w-300 text-16 mt-10" style="white-space: nowrap">
              *选择领取门店后，您的所属门店将默认调整为所选门店
            </View>

            <View
              className="flex items-center justify-start w-400 mt-40"
              onClick={() => {
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
              <View className="flex-1 text-30">
                <Text decode>邮寄到家</Text>
              </View>
            </View>
            <View className="text-16 w-300 h-20 mt-10">
              {applyType === "express" && `*100积分抵扣邮费`}
            </View>
            <View
              className="w-180 h-60 text-28 vhCenter bg-black text-white mt-50"
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
