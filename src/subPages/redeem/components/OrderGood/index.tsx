import { Text, View } from "@tarojs/components";
import React from "react";

import CImage from "@/src/components/Common/CImage";

interface T_Props {
  good: any;
}
const OrderGood: React.FC<T_Props> = ({ good }) => {
  return (
    <View className="flex items-center justify-center box-border h-220">
      <View className="w-190 h-190 mr-20 rounded-20">
        <CImage
          className="w-190 h-190"
          src={good.mainImage || ""}
          mode="aspectFit"
        ></CImage>
        <View className="w-full h-1 bg-black opacity-0"></View>
      </View>
      <View className="h-150 flex flex-1 flex-col justify-between box-border">
        <View className="text-27 text-right ENGLISH_FAMILY">
          <View className="ENGLISH_FAMILY text-23">{good?.name}</View>
          {good?.actualPoints ? (
            <View className="ENGLISH_FAMILY text-29 mt-10">
              {good?.actualPoints / good?.quantity}
              <Text className="text-18 relative -top-1"> 积分</Text>
            </View>
          ) : (
            <View className="ENGLISH_FAMILY text-29 mt-10">
              {good?.points || good?.point}
              <Text className="text-18 relative -top-1"> 积分</Text>
            </View>
          )}
        </View>
        {good?.actualPoints || good?.points || good?.point ? (
          <View className="text-24 text-right">
            x {good?.quantity || good?.num || 1}
          </View>
        ) : null}
      </View>
    </View>
  );
};
export default OrderGood;
