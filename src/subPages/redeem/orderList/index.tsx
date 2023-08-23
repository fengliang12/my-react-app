import { Picker, ScrollView, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

const orderList = [{ label: "全部订单", value: "all" }];
const Index = () => {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM");

  return (
    <View className="order-list bg-black flex h-screen flex-col items-center justify-start text-white">
      <CHeader
        back
        title=""
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View className="w-full">
        <CImage
          className="w-138 h-60 ml-60"
          src={`${config.imgBaseUrl}/icon/title_image.png`}
        ></CImage>
      </View>
      <View className="w-688 flex justify-around mt-70 mb-60">
        <View
          className="w-228 h-60  vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
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
        <View>-</View>
        <View
          className="w-228 h-60 vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
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
          <View className="flex justify-between">
            <Text className="flex-1">2023-11-15</Text>
            <Text>待领取</Text>
          </View>
          <View className="flex items-start mt-25">
            <Text className="w-150">领取柜台：</Text>
            <Text className="flex-1">NARS上海新天地</Text>
          </View>
          <View className="flex items-start my-10">
            <Text className="w-150">订单编号：</Text>
            <Text className="flex-1">112341928392829</Text>
          </View>
        </View>
        <View className="w-full h-20"></View>
      </ScrollView>
    </View>
  );
};
export default Index;
