import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import api from "@/src/api";
import { P9 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import HeaderTabbar from "@/src/components/Common/HeaderTabbar";
import config from "@/src/config";
import { formatDateTime, setShareParams } from "@/src/utils";

const tabList: Array<any> = [
  { title: "待使用", value: "wait" },
  { title: "已使用", value: "used" },
  { title: "已过期", value: "expired" },
];

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const [originList, setOriginList] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [couponStatus, setCouponStatus] = useState<string>("wait");

  useDidShow(async () => {
    await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    const { data } = await api.coupon.posCouponDetail({});

    setOriginList(data);
    Taro.hideLoading();
  });

  /**
   * 点击菜单栏切换
   */
  const tabClick = useMemoizedFn((val) => {
    if (couponStatus === val) return;
    setSelectedIndex(-1);
    setCouponStatus(val);
  });

  /**
   * 根据状态获取卡券列表
   */
  const couponList = useMemo(() => {
    console.log("originList", originList, couponStatus);

    if (originList?.length > 0 && couponStatus) {
      if (couponStatus === "wait") {
        return originList.filter((item) => {
          if (
            (item.pAType != 30 && item.goodsStatus == 20) ||
            (item.pAType == 30 && item.ticketStatus == 10)
          ) {
            console.log(item);

            return item;
          }
        });
      } else if (couponStatus === "used") {
        return originList.filter((item) => {
          if (
            (item.pAType != 30 && item.goodsStatus == 30) ||
            (item.pAType == 30 && item.ticketStatus == 20)
          ) {
            return item;
          }
        });
      } else if (couponStatus === "expired") {
        return originList.filter((item) => {
          if (
            (item.pAType != 30 && item.goodsStatus == 85) ||
            (item.pAType == 30 && item.ticketStatus == 30)
          ) {
            return item;
          }
        });
      }
    }
    return [];
  }, [couponStatus, originList]);

  console.log("couponList", couponList);

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View
      className="text-white w-screen h-screen flex flex-col items-center justify-start box-border"
      style="background-color: #000000;"
    >
      <CHeader
        back
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>

      <View className="w-full h-60 mt-20">
        <CImage
          className="w-138 ml-40"
          mode="widthFix"
          src={`${config.imgBaseUrl}/icon/title_image.png`}
        ></CImage>
      </View>
      <View className="w-full text-53 text-left px-40 mt-20 box-border">
        卡券中心
      </View>

      <View className="w-600 mt-20">
        <HeaderTabbar
          tabList={tabList}
          value={couponStatus}
          tabClick={tabClick}
          style="font-size:42rpx"
        ></HeaderTabbar>
      </View>

      <ScrollView className="flex-1 overflow-hidden" scrollY>
        {couponList?.length > 0 ? (
          <View className="px-30 py-18">
            {couponList?.map((item: any, index) => {
              return (
                <View className="w-670 p-22" key={item.id}>
                  <View
                    className="w-full flex h-156 justify-between"
                    style={`background: url(${config.imgBaseUrl}/coupon/list_bg.png);background-size:100% 100%`}
                  >
                    <View
                      className="flex-1 px-60 py-40 text-black text-28 flex justify-center items-start flex-col"
                      onClick={() => {
                        if (selectedIndex === index) {
                          setSelectedIndex(-1);
                        } else {
                          setSelectedIndex(index);
                        }
                      }}
                    >
                      <View className="text-28">{item.pAName}</View>
                      <View className="w-full text-20 mt-50 flex items-center justify-between">
                        {item?.exchangeBeginDate && (
                          <Text>
                            {dayjs(
                              item?.exchangeBeginDate?.replaceAll("-", "/"),
                            ).format("YYYY.MM.DD")}{" "}
                            -{" "}
                            {dayjs(
                              item?.exchangeEndDate?.replaceAll("-", "/"),
                            ).format("YYYY.MM.DD")}
                          </Text>
                        )}

                        <View className="text-18 vhCenter">
                          查看详情
                          {selectedIndex === index ? (
                            <CImage
                              className="w-15 h-12 ml-10 transform rotate-180"
                              src={P9}
                            ></CImage>
                          ) : (
                            <CImage
                              className="w-15 h-12 ml-10"
                              src={P9}
                            ></CImage>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                  {selectedIndex === index && (
                    <View
                      className="w-670 box-border text-26 text-center px-43 py-40 mt-0"
                      style={`background: url(${config.imgBaseUrl}/coupon/detail_bg.png);background-size:100% 100%`}
                    >
                      <View className="text-left flex">
                        <View>1、</View>
                        <View>卡券详情：{item.goodsName}</View>
                      </View>
                      <View
                        className="text-left my-10 flex"
                        style="line-height:20px"
                      >
                        <View>2、</View>
                        <View>
                          请在确认领取到相关礼品后，向专柜彩妆师出示此二维码进行核销
                        </View>
                      </View>
                      <View className="text-left flex">
                        <View>3、</View>
                        <View>
                          礼品仅限会员本人莅临所选专柜领取。礼品一经兑换不退不换
                        </View>
                      </View>
                      {((item.pAType != 30 && item.goodsStatus == 20) ||
                        (item.pAType == 30 && item.ticketStatus == 10)) && (
                        <View className="inline-block mt-30 bg-white">
                          <CQRCodeCustom
                            text={item.applyId}
                            width={250}
                            height={250}
                            padding={10}
                            background="#FFFFFF"
                          ></CQRCodeCustom>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View className="text-white text-center py-100">暂无礼券记录</View>
        )}
      </ScrollView>
    </View>
  );
};
export default Index;
