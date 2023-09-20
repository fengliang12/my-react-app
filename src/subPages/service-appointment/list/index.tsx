import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useRequest } from "ahooks";
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
        .then((res) => res.data.filter((item) => item.bookCode));
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
        title="预约记录"
        titleColor="#FFFFFF"
      ></CHeader>
      {data?.length ? (
        <>
          {data?.map((item) => (
            <View
              key={item.storeId}
              className="w-690 h-220 bg-grayBg flex ml-30 mb-40 px-20 box-border"
              style={`background:url(${config.imgBaseUrl}/appointment/list/${item.projectCode}.png);background-size:100% 100%;`}
            >
              <View
                className={`flex-1 flex flex-col justify-center text-left ${
                  Number(item.projectCode) % 20 === 0
                    ? "items-start"
                    : "items-end"
                }`}
              >
                <View className="text-32">{item.projectName}</View>
                <View className="mt-10 text-24">{item.storeName}</View>
                <View className="text-24 mt-5">
                  {dayjs(item.reserveDate).format("YYYY-MM-DD")}{" "}
                  {item.timePeriod}
                </View>
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
        </>
      ) : (
        <View className="w-full text-center mt-200">暂无预约记录</View>
      )}
    </View>
  );
};
export default Index;
