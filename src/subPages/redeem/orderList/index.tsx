import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import { P6, P9 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { formatDateTime, getTimeStamp, setShareParams } from "@/src/utils";
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
    page.current = 0;
    setList([]);
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

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="bg-black text-white h-screen flex flex-col items-center">
      <CHeader
        back
        title=""
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <View className="w-full h-60 mt-20">
        <CImage
          className="w-138 ml-40"
          mode="widthFix"
          src={`${config.imgBaseUrl}/icon/title_image.png`}
        ></CImage>
      </View>
      <View className="w-full text-52 text-left px-40 mt-20 box-border">
        兑礼记录
      </View>
      <View className="w-600 flex justify-around items-center text-28 pt-40">
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
            <View className="w-full h-full vhCenter relative px-16 box-border">
              <Text className="flex-1 h-60 flex items-center">
                {startDate ? startDate : "开始日期"}
              </Text>
              <CImage
                className="w-20 h-16 absolute right-16 top-20"
                src={P6}
              ></CImage>
            </View>
          </Picker>
        </View>
        <View className="w-16 h-2 bg-grayBg"></View>
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
            <View className="w-full h-full vhCenter relative px-16 box-border">
              <Text className="flex-1 h-60 flex items-center">
                {endDate ? endDate : "结束日期"}
              </Text>
              <CImage
                className="w-20 h-16 absolute right-16 top-20"
                src={P6}
              ></CImage>
            </View>
          </Picker>
        </View>
      </View>

      {list && list?.length > 0 ? (
        <ScrollView
          className="flex-1 overflow-hidden py-50 text-black"
          scrollY
          onScrollToLower={onScrollEnd}
        >
          {list?.map((item: any) => {
            return (
              <>
                <View
                  className="w-680 py-30 px-60 box-border m-auto bg-white font-thin text-26"
                  onClick={() =>
                    to(`/subPages/redeem/orderDetail/index?orderId=${item.id}`)
                  }
                  key={item.id}
                >
                  <View className="flex justify-between">
                    <Text className="flex-1 ENGLISH_FAMILY">
                      {formatDateTime(item.createTime, 6)}
                    </Text>
                    <Text>
                      {item?.statusName === "待评价"
                        ? "已完成"
                        : item?.deliverInfo?.type === "self_pick_up" &&
                          item?.statusName === "待收货"
                        ? "待领取"
                        : item?.statusName}
                    </Text>
                  </View>
                  <View className="flex items-start mt-20 text-24">
                    <Text>领取方式：</Text>
                    <Text className="flex-1">
                      {item?.deliverInfo?.type === "express"
                        ? "邮寄到家"
                        : "到柜领取"}
                    </Text>
                  </View>

                  <View className="flex items-start my-20 text-24">
                    <Text>订单编号：</Text>
                    <Text className="flex-1 ENGLISH_FAMILY">{item.id}</Text>
                  </View>
                  <View className="w-full flex justify-start overflow-scroll">
                    {item.skus &&
                      item.skus.map((sku, index) => (
                        <View className="w-120 h-120 mr-20 my-10" key={index}>
                          <CImage
                            className="w-full h-full"
                            src={sku.mainImage}
                          ></CImage>
                        </View>
                      ))}
                  </View>
                </View>
                <View className="w-full h-40"></View>
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
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
