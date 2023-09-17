import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useUpdateEffect } from "ahooks";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";

const orderList = [
  { label: "全部订单", value: "" },
  { label: "创建订单", value: "CREATED" },
  { label: "交易取消", value: "CANCELLED" },
  { label: "待确认订单", value: "CONFIRMED" },
  { label: "交易成功", value: "FINISHED" },
  { label: "待收货", value: "DELIVERED" },
  { label: "退款开始", value: "REFUND_START" },
  { label: "退款中", value: "REFUNDING" },
  { label: "退款完成", value: "REFUND_FINISHED" },
  { label: "退款取消", value: "REFUND_CANCEL" },
];

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM-DD");

  const [list, setList] = useState<Api.Order.Public.IContent[]>([]);
  const total = useRef<number>(0);
  const page = useRef<number>(0);

  /**
   * 获取记录列表
   */
  const getList = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.shuYunMember.orderPage({
      currentPage: page.current,
      pageSize: 10,
      status: orderList?.[orderIndex]?.value || undefined,
      orderBeginTime: date ? `${date} 00:00:00` : undefined,
      orderEndTime: date ? `${date} 23:59:59` : undefined,
    });
    total.current = res.data.totalElements;
    Taro.hideLoading();
    let newList =
      page.current === 0 ? res?.data?.content : list.concat(res?.data?.content);
    setList(newList);
  });

  useEffect(() => {
    if (date) {
      page.current = 0;
    }
    getList();
  }, [date, getList]);

  /**
   * 滚动到底部
   */
  const onScrollEnd = useMemoizedFn(() => {
    if (list?.length >= total.current) return;
    page.current += 1;
    getList();
  });

  return (
    <View className="order-list bg-black flex h-screen flex-col items-center justify-start text-white">
      <CHeader
        back
        title="消费记录"
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
            <Text className="w-full h-97 vhCenter ">
              {orderIndex === -1 ? "请选择" : orderList[orderIndex].label}
            </Text>
          </Picker>
        </View>
        <View className="w-400 h-97 bg-grayBg vhCenter">
          <Picker
            mode="date"
            value={date}
            start="2000-01-01"
            end={endTime}
            fields="day"
            onChange={(e) => {
              let value = e.detail.value;
              setDate(value);
            }}
          >
            <Text className="w-full h-97 vhCenter">
              {date ? date : "请选择日期"}
            </Text>
          </Picker>
        </View>
      </View>
      {list.length > 0 ? (
        <ScrollView
          className="flex-1 overflow-hidden"
          scrollY
          onScrollToLower={onScrollEnd}
        >
          {list.map((item) => (
            <>
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
            </>
          ))}
        </ScrollView>
      ) : (
        <View></View>
      )}
    </View>
  );
};
export default Index;
