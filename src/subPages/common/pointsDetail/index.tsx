import { ScrollView, Text, View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect } from "ahooks";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import config from "@/src/config";
import { formatDateTime, setShareParams } from "@/src/utils";

const Index = () => {
  const [list, setList] = useState<any>([]);
  const points = useSelector((state: Store.States) => state.user.points);
  const mobile = useSelector((state: Store.States) => state.user.mobile);
  useAsyncEffect(async () => {
    let { data } = await api.shuYunMember.queryPointsLog({
      mobile: mobile,
      page: 1,
      size: 100,
    });
    setList(data);
  }, [mobile]);

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="redeem-history bg-black h-screen text-white flex justify-start items-center flex-col">
      <CHeader
        back
        fill
        title="积分明细"
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View
        className="vhCenter w-full h-300 flex-col bg-black2"
        style={`background:url(${config.imgBaseUrl}/pointsDetail/bg.jpg);background-size:100% 100%`}
      >
        <Text className="text-100 ENGLISH_FAMILY">{points}</Text>
        <Text className="text-26">当前积分</Text>
      </View>
      {list?.length ? (
        <ScrollView className="flex-1 overflow-hidden py-40" scrollY>
          {list.map((item, index) => {
            return (
              <View className="px-55 py-30 font-thin" key={index}>
                <View className="flex justify-between text-35">
                  <Text>{item.description}</Text>
                  <Text className="ENGLISH_FAMILY">
                    {item.changeType === "DEDUCT" ? "-" : "+"}
                    {item.point}
                  </Text>
                </View>
                <View className="text-26 mt-20 ENGLISH_FAMILY">
                  {formatDateTime(item.changeTime, 6, ".")}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="vhCenter mt-200">暂无记录</View>
      )}
    </View>
  );
};
export default Index;
