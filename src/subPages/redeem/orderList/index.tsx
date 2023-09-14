import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { formatDateTime, getTimeStamp } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const [list, setList] = useState<Api.Order.Public.IContent[]>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM");

  /**
   * 获取订单列表
   */
  const getOrderByStatus = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.memberOrder.getOrderByStatus(
      { size: 0, page: 100 },
      { status: "all" },
    );
    Taro.hideLoading();
    setList(res?.data.content);
  });

  useEffect(() => {
    if (startDate && endDate) {
      if (getTimeStamp(startDate) > getTimeStamp(endDate))
        return toast("结束时间不能大于开始时间");
      getOrderByStatus();
    }
  }, [startDate, endDate, getOrderByStatus]);

  useDidShow(() => {
    getOrderByStatus();
  });
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
      <View className="w-688 flex justify-around items-center mt-70 mb-60 text-28">
        <View
          className="w-228 h-60  vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
          <Picker
            mode="date"
            value={startDate}
            start="2010-01"
            end={endDate || endTime}
            fields="month"
            onChange={(e) => {
              let value = e.detail.value;
              setStartDate(value);
            }}
          >
            <Text className="w-full h-60 vhCenter">
              {startDate ? startDate : "请选择日期"}
            </Text>
          </Picker>
        </View>
        <View className="w-50 h-2 bg-white"></View>
        <View
          className="w-228 h-60 vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
          <Picker
            mode="date"
            value={endDate}
            start={startDate || "2010-01"}
            end={endTime}
            fields="month"
            onChange={(e) => {
              let value = e.detail.value;
              setEndDate(value);
            }}
          >
            <Text className="w-full h-60 vhCenter">
              {endDate ? endDate : "请选择日期"}
            </Text>
          </Picker>
        </View>
      </View>

      {/* 订单列表 */}
      <ScrollView className="flex-1" scrollY>
        {list && list?.length > 0 ? (
          list?.map((item) => {
            return (
              <View
                className="w-688 px-60 py-30 box-border m-auto bg-grayBg font-thin text-30"
                onClick={() => to("/subPages/redeem/orderDetail/index")}
                key={item.id}
              >
                <View className="flex justify-between">
                  <Text className="flex-1">
                    {formatDateTime(item.createTime)}
                  </Text>
                  <Text>{item.status}</Text>
                </View>
                <View className="flex items-start mt-25">
                  <Text className="w-150">领取柜台：</Text>
                  <Text className="flex-1">NARS上海新天地</Text>
                </View>
                <View className="flex items-start my-10">
                  <Text className="w-150">订单编号：</Text>
                  <Text className="flex-1">{item.id}</Text>
                </View>
                <View className="w-full h-20 bg-white"></View>
              </View>
            );
          })
        ) : (
          <View className="text-center pt-50 box-border text-28">
            暂无兑礼记录
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default Index;
