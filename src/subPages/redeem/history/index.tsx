import { Text, View } from "@tarojs/components";
import { useAsyncEffect } from "ahooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";

const Index = () => {
  const [list, setList] = useState<any>();
  const mobile = useSelector((state: Store.States) => state.user.mobile);
  useAsyncEffect(async () => {
    let res = await api.shuYunMember.queryGradeLog({
      mobile: mobile,
      page: 0,
      size: 1000,
    });
  }, [mobile]);

  return (
    <View className="redeem-history bg-black min-h-screen text-white">
      <CHeader
        back
        fill
        title="积分明细"
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View className="vhCenter w-full h-300 flex-col bg-black2 mb-30">
        <Text className="text-100 font-thin">2000</Text>
        <Text className="text-26">当前积分</Text>
      </View>
      <View>
        <View className="px-55 py-30 font-thin">
          <View className="flex justify-between text-35">
            <Text>专柜购买</Text>
            <Text>+200</Text>
          </View>
          <View className="text-26 mt-20">2022.3.28</View>
        </View>
        <View className="px-55 py-30 font-thin">
          <View className="flex justify-between text-35">
            <Text>天猫购买</Text>
            <Text>+200</Text>
          </View>
          <View className="text-26 mt-20">2022.3.28</View>
        </View>
      </View>
    </View>
  );
};
export default Index;
