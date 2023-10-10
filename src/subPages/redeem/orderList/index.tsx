import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { formatDateTime, getTimeStamp } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const [list, setList] = useState<Api.Order.Public.IContent[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM-DD");
  const total = useRef<number>(0);
  const page = useRef<number>(0);

  /**
   * 获取订单列表
   */
  const getOrderByStatus = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();

    let res = await api.memberOrder.getOrderByStatus(
      {
        page: page.current,
        size: 10,
        getAllSkus: true,
        from: startDate ? `${startDate} 00:00:00` : undefined,
        to: endDate ? `${endDate} 23:59:59` : undefined,
      },
      { status: "all" },
    );
    total.current = res.data.totalElements;
    Taro.hideLoading();
    let newList =
      page.current === 0 ? res?.data?.content : list.concat(res?.data?.content);
    setList(newList);
  });

  useDidShow(() => {
    getOrderByStatus();
  });

  /**
   * 滚动到底部
   */
  const onScrollEnd = useMemoizedFn(() => {
    if (list?.length >= total.current) return;
    page.current += 1;
    getOrderByStatus();
  });

  useEffect(() => {
    if (startDate && endDate) {
      if (getTimeStamp(startDate) > getTimeStamp(endDate))
        return toast("结束时间不能大于开始时间");
      page.current = 0;
      getOrderByStatus();
    }
  }, [startDate, endDate, getOrderByStatus]);

  return (
    <View className="bg-black text-white h-screen flex flex-col items-center">
      <CHeader
        back
        title=""
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View className="w-full h-60">
        <CImage
          className="w-138 h-60 ml-60"
          src={`${config.imgBaseUrl}/icon/title_image.png`}
        ></CImage>
      </View>
      <View className="w-688 flex justify-around items-center text-28 pt-40">
        <View
          className="w-228 h-60  vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
          <Picker
            mode="date"
            value={startDate}
            start="1970-01-01"
            end={endDate || endTime}
            onChange={(e) => {
              let value = e.detail.value;
              setStartDate(value);
            }}
          >
            <Text className="w-full h-60 vhCenter">
              {startDate ? startDate : "开始日期"}
            </Text>
          </Picker>
        </View>
        <View className="w-30 h-2 bg-white"></View>
        <View
          className="w-228 h-60 vhCenter"
          style={{ border: "1px solid #FFFFFF" }}
        >
          <Picker
            mode="date"
            value={endDate}
            start={startDate || "1970-01-01"}
            end={endTime}
            onChange={(e) => {
              let value = e.detail.value;
              setEndDate(value);
            }}
          >
            <Text className="w-full h-60 vhCenter">
              {endDate ? endDate : "结束日期"}
            </Text>
          </Picker>
        </View>
      </View>

      {list && list?.length > 0 ? (
        <ScrollView
          className="flex-1 overflow-hidden py-40"
          scrollY
          onScrollToLower={onScrollEnd}
        >
          {list?.map((item: any) => {
            return (
              <>
                <View
                  className="w-688 p-40 box-border m-auto bg-grayBg font-thin text-30"
                  onClick={() =>
                    to(`/subPages/redeem/orderDetail/index?orderId=${item.id}`)
                  }
                  key={item.id}
                >
                  <View className="flex justify-between">
                    <Text className="flex-1">
                      {formatDateTime(item.createTime, 6)}
                    </Text>
                    <Text>
                      {item.statusName === "待评价"
                        ? "已完成"
                        : item.statusName}
                    </Text>
                  </View>
                  <View className="flex items-start mt-25 text-24">
                    <Text>领取方式：</Text>
                    <Text className="flex-1">
                      {item?.deliverInfo?.type === "express"
                        ? "邮寄到家"
                        : "到柜领取"}
                    </Text>
                  </View>

                  <View className="flex items-start my-20 text-24">
                    <Text>订单编号：</Text>
                    <Text className="flex-1">{item.id}</Text>
                  </View>
                  <View className="w-full flex justify-start overflow-scroll">
                    {item.skus &&
                      item.skus.map((sku, index) => (
                        <View className="w-160 h-160 mr-20 my-10" key={index}>
                          <CImage
                            className="w-160 h-160"
                            src={sku.mainImage}
                          ></CImage>
                        </View>
                      ))}
                  </View>
                </View>
                <View className="w-full h-30"></View>
              </>
            );
          })}
        </ScrollView>
      ) : (
        <View className="text-center mt-200 box-border text-28">
          暂无兑礼记录
        </View>
      )}
      {/* 订单列表 */}
    </View>
  );
};
export default Index;
