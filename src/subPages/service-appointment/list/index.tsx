import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useRequest, useUpdateEffect } from "ahooks";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

enum STATUS_ENUM {
  "待使用" = 0,
  "已使用" = 1,
  "已过期" = 2,
}

const Index = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("0");
  const [list, setList] =
    useState<Api.ArvatoReservation.GetRecords.IResponse | null>(null);

  const { data, run: init } = useRequest(
    async () => {
      let userInfo = await app.init();
      Taro.showLoading({ title: "加载中", mask: true });
      return await api.arvatoReservation
        .getRecords({
          memberCode: userInfo.marsId,
        })
        .then((res) => {
          Taro.hideLoading();
          return res.data.filter((item) => item.bookCode);
        });
    },
    {
      manual: true,
    },
  );

  useUpdateEffect(() => {
    if (selectedStatus && data) {
      setList(data.filter((item) => item.status === selectedStatus));
    }
  }, [selectedStatus, data]);

  /** 已使用数量 */
  const aCount = useMemo(() => {
    return data && data.filter((item) => item.status === "1").length;
  }, [data]);

  /** 未使用数量 */
  const bCount = useMemo(() => {
    return data && data.filter((item) => item.status === "0").length;
  }, [data]);

  /** 已过期数量 */
  const cCount = useMemo(() => {
    return data && data.filter((item) => item.status === "2").length;
  }, [data]);

  useDidShow(() => {
    init();
  });

  /**
   * 前往详情
   * @param item
   */
  const toDetail = (item) => {
    if (item.status === "0") {
      to(`/subPages/service-appointment/detail/index?bookId=${item.bookId}`);
    }
  };

  /**
   * 取消服务
   */
  const onCancel = async (data) => {
    Taro.showModal({
      title: "温馨提示",
      content: `亲爱的NARS会员\r\n您确认取消以下服务吗?\r\n${data?.projectName}\r\n${data?.storeName}\r\n${dayjs(
        data?.reserveDate,
      ).format("YYYY-MM-DD")} ${data?.timePeriod}`,
      success: async (res) => {
        // 点击确定的时候取消服务预约
        if (res.confirm) {
          Taro.showLoading({ title: "加载中", mask: true });
          await api.arvatoReservation
            .modify({
              bookId: data?.bookId!,
              projectCode: data?.projectCode!,
              storeId: data?.storeId!,
              reserveDate: dayjs(data?.reserveDate).format("YYYY-MM-DD"),
              type: -1,
            })
            .catch((err) => {
              toast(err);
            });
          Taro.hideLoading();
          init();
        }
      },
    });
  };

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="service-list bg-black text-white w-screen h-screen flex flex-col font-thin box-border">
      <CHeader
        back
        fill
        backgroundColor="rgba(0,0,0,1)"
        title="我的礼券"
        titleColor="#FFFFFF"
      ></CHeader>

      <View className="h-120 flex text-center text-24 pb-100 font-thin">
        <View
          className={`flex-1 flex flex-col justify-center transform items-center ${
            selectedStatus === "1" ? "opacity-100 scale-120" : "opacity-50"
          }`}
          onClick={() => setSelectedStatus("1")}
        >
          <Text className="text-52">{aCount}</Text>
          <Text className="mt-10">已使用</Text>
        </View>
        <View
          className={`flex-1 flex flex-col justify-center transform items-center ${
            selectedStatus === "0" ? "opacity-100 scale-120" : "opacity-50"
          }`}
          onClick={() => setSelectedStatus("0")}
        >
          <Text className="text-52">{bCount}</Text>
          <Text className="mt-10">未使用</Text>
        </View>
        <View
          className={`flex-1 flex flex-col justify-center transform items-center ${
            selectedStatus === "2" ? "opacity-100 scale-120" : "opacity-50"
          }`}
          onClick={() => setSelectedStatus("2")}
        >
          <Text className="text-52">{cCount}</Text>
          <Text className="mt-10">已过期</Text>
        </View>
      </View>

      <ScrollView className="flex-1 overflow-hidden" scrollY>
        {list?.length ? (
          <>
            {list?.map((item) => (
              <>
                <View
                  key={item.storeId}
                  className="w-690 h-220 bg-grayBg flex ml-30 mb-40 px-20 box-border"
                  style={`background:url(${item?.imageKVList?.[0]});background-size:100% 100%;`}
                >
                  <View
                    className={`flex-1 flex flex-col justify-center text-left ${
                      Number(item.projectCode) % 20 === 0
                        ? "items-start"
                        : "items-end"
                    }`}
                  >
                    <View className="text-32 w-330 text-left">
                      {item.projectName}
                    </View>
                    <View className="mt-10 text-24 w-330 text-left flex items-center">
                      <CImage
                        className="w-24 h-32 mr-10"
                        src={`${config.imgBaseUrl}/apponitment/address.png`}
                      ></CImage>
                      {item.storeName}
                    </View>
                    <View className="text-24 mt-10 w-330 text-left flex items-center">
                      <CImage
                        className="w-24 h-24 mr-10"
                        src={`${config.imgBaseUrl}/apponitment/time.png`}
                      ></CImage>
                      {dayjs(item.reserveDate).format("YYYY-MM-DD")}{" "}
                      {item.timePeriod}
                    </View>
                    {item.status === "0" && (
                      <View className="w-330 flex justify-start items-center">
                        <View
                          className="w-150 text-26 h-55 text-white vhCenter bg-grayBg mt-20"
                          onClick={() => toDetail(item)}
                        >
                          立即使用
                        </View>
                        <View
                          className="w-150 text-26 h-55 ml-20 text-white bg-grayBg vhCenter white mt-20"
                          onClick={() => onCancel(item)}
                        >
                          取消预约
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                <View className="w-690 h-1 mx-auto bg-white opacity-50 mb-40"></View>
              </>
            ))}
          </>
        ) : (
          <View className="w-full text-center pt-200">暂无预约记录</View>
        )}
      </ScrollView>
    </View>
  );
};
export default Index;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
