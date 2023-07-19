import { Picker, ScrollView, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import CHeader from "@/src/components/Common/CHeader";

const orderList = [{ label: "全部订单", value: "all" }];
const Index = () => {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM");

  return (
    <View className="order-list bg-black flex h-screen flex-col items-center justify-start text-white">
      <CHeader
        back
        title="订单列表"
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View className="w-688 flex justify-between mt-70 mb-30">
        <View className="w-268 h-97 bg-grayBg vhCenter">
          <Picker
            mode="selector"
            range={orderList}
            rangeKey="label"
            value={orderIndex}
            onChange={(e) => {
              let index = Number(e.detail.value);
              setOrderIndex(index);
            }}
          >
            <Text>
              {orderIndex === -1 ? "请选择" : orderList[orderIndex].label}
            </Text>
          </Picker>
        </View>
        <View className="w-400 h-97 bg-grayBg vhCenter">
          <Picker
            mode="date"
            value={date}
            start="2010-01"
            end={endTime}
            fields="month"
            onChange={(e) => {
              let value = e.detail.value;
              setDate(value);
            }}
          >
            <Text>{date ? date : "请选择日期"}</Text>
          </Picker>
        </View>
      </View>
      <ScrollView className="flex-1" scrollY>
        <View className="w-688 px-60 py-30 box-border m-auto bg-grayBg font-thin text-30">
          <View className="flex items-start">
            <Text className="w-150">订单店铺：</Text>
            <Text className="flex-1">NARS上海新天地</Text>
          </View>
          <View className="flex items-start my-10">
            <Text className="w-150">订单日期：</Text>
            <Text className="flex-1">2021-06-02 17:50:21</Text>
          </View>
          <View className="flex items-start">
            <Text className="w-150">消费明细：</Text>
            <View className="flex-1">
              <View className="flex flex-col">
                <Text>NARS腮红 愉悦红粉</Text>
                <Text>单价：300 数量：1 N</Text>
              </View>
              <View className="flex flex-col mt-20">
                <Text>NARS腮红 愉悦红粉</Text>
                <Text>单价：300 数量：1 N</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="w-full h-20"></View>
      </ScrollView>
    </View>
  );
};
export default Index;
