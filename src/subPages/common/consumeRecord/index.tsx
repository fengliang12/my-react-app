import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import { P6 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { formatDateTime } from "@/src/utils";

enum CHANNEL_TYPE_LIST {
  "GW" = "官网",
  "POS" = "POS",
  "ECMP" = "ECMP",
  "ECMPcom" = "ECMP",
  "TAOBAO" = "天猫",
  "DOUYIN" = "抖音",
}

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const [date, setDate] = useState<string>("");
  const endTime = dayjs(Date.now()).format("YYYY-MM-DD");

  const [list, setList] = useState<Api.Order.Public.IContent[]>([]);
  const total = useRef<number>(0);
  const page = useRef<number>(1);

  /**
   * 获取记录列表
   */
  const getList = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.shuYunMember.orderPage({
      currentPage: page.current,
      pageSize: 10,
      orderBeginTime: date ? `${date} 00:00:00` : undefined,
      orderEndTime: date ? `${date} 23:59:59` : undefined,
    });
    total.current = res.data.totalCount;

    Taro.hideLoading();
    let newList =
      page.current === 0 ? res?.data?.data : list.concat(res?.data?.data);
    setList(newList);
  });

  useEffect(() => {
    page.current = 0;
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
        消费记录
      </View>
      <View className="w-688 flex justify-between mt-35 mb-22 text-30">
        <View
          className="w-268 h-97 bg-373737 vhCenter"
          onClick={() => {
            setDate("");
          }}
        >
          全部订单
        </View>
        <View className="w-400 h-97 bg-373737 vhCenter">
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
            <View className="w-full h-97 vhCenter relative px-16 box-border">
              <Text className="h-97 flex items-center">
                {date ? date : "请选择日期"}
              </Text>
              <CImage className="w-24 h-20 ml-20" src={P6}></CImage>
            </View>
          </Picker>
        </View>
      </View>
      {list && list?.length > 0 ? (
        <ScrollView
          className="flex-1 overflow-hidden"
          scrollY
          onScrollToLower={onScrollEnd}
        >
          {list.map((item: any) => (
            <>
              <View className="w-688 px-60 py-42 box-border m-auto bg-373737 font-thin text-27">
                <View className="flex items-start">
                  <Text className="w-150">订单店铺：</Text>
                  <Text className="flex-1">{item.shopName}</Text>
                </View>
                <View className="flex items-start my-16">
                  <Text className="w-150">订单日期：</Text>
                  <Text className="flex-1">
                    {formatDateTime(item.orderTime, 6)}
                  </Text>
                </View>
                <View className="flex items-start">
                  <Text className="w-150">消费明细：</Text>

                  <View className="flex-1">
                    {item?.orderItems?.map((child) => {
                      return (
                        <View className="flex flex-col" key={child.productCode}>
                          <Text>{child.productName}</Text>
                          <View className="w-full flex my-10">
                            <Text className="w-220">单价：{child.payment}</Text>
                            <Text>数量：{child.quantity}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View className="w-full h-30"></View>
            </>
          ))}
        </ScrollView>
      ) : (
        <View className="vhCenter mt-200">暂无消费记录</View>
      )}
    </View>
  );
};
export default Index;
