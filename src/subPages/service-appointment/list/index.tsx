import { Text, View } from "@tarojs/components";
import Taro, { useDidHide, useDidShow, useReachBottom } from "@tarojs/taro";
import { useAsyncEffect, usePagination, useRequest } from "ahooks";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();

enum STATUS_ENUM {
  "待使用" = 0,
  "已使用" = 1,
  "已取消" = -1,
}

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  const { data, run: init } = useRequest(
    async () => {
      await app.init();
      return await api.arvatoReservation
        .getRecords({
          memberCode: userInfo.marsId,
        })
        .then((res) => res.data);
    },
    {
      manual: true,
    },
  );

  useDidShow(() => {
    init();
  });
  const toDetail = (item) => {
    if (item.status === "0") {
      to(`/subPages/service-appointment/detail/index?bookId=${item.bookId}`);
    }
  };

  return (
    <View className="service-list min-h-screen bg-black text-white flex flex-col font-thin">
      <CHeader
        back
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <View className="text-54 text-center mt-10 font-thin mb-40">
        预约记录
      </View>
      {data?.map((item) => (
        <View
          key={item.storeId}
          className="w-690 h-310 bg-grayBg p-25 flex box-border ml-30 mb-40"
        >
          <CImage
            className="w-318 h-259"
            src={`${config.imgBaseUrl}/appointment/appointment_icon.jpg`}
          ></CImage>
          <View className="flex-1 vhCenter flex-col text-center">
            <View className="text-36">{item.projectName}</View>
            <View className="mt-28 text-24">{item.storeName}</View>
            <View className="text-24">
              {dayjs(item.reserveDate).format("YYYY年MM月DD日")}
            </View>
            <View className="text-24">{item.timePeriod}</View>
            <View
              className={`w-222 text-22 h-50 text-black vhCenter bg-${
                item.status === "0" ? "white" : "#EFEFEF"
              } rounded-6 mt-20`}
              onClick={() => toDetail(item)}
            >
              {STATUS_ENUM[item.status]}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
export default Index;
