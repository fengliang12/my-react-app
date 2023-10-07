import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import { P9 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import HeaderTabbar from "@/src/components/Common/HeaderTabbar";
import config from "@/src/config";
import { formatDateTime } from "@/src/utils";

type tabType = { title: string; value: CouponStatusType };
const tabList: Array<tabType> = [
  { title: "待使用", value: "10" },
  { title: "已使用", value: "20" },
  { title: "已过期", value: "90" },
];
const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const [originList, setOriginList] = useState<any>([]);
  const [couponList, setCouponList] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [couponStatus, setCouponStatus] = useState<string>("10");

  useDidShow(async () => {
    await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    const { data } = await api.coupon.posCoupon();
    setOriginList(data);
    Taro.hideLoading();
  });

  /**
   * 根据状态获取卡券列表
   */
  const getMyCouponStatus = useMemoizedFn(() => {
    if (originList?.length && couponStatus) {
      setCouponList(originList.filter((item) => item.status === couponStatus));
    }
  });

  /**
   * 点击菜单栏切换
   */
  const tabClick = useMemoizedFn((val) => {
    if (couponStatus === val) return;
    setSelectedIndex(-1);
    setCouponStatus(val);
  });

  useEffect(() => {
    if (couponStatus) {
      getMyCouponStatus();
    }
  }, [couponStatus, originList, getMyCouponStatus]);

  return (
    <View
      className="text-white w-screen h-screen flex flex-col items-center justify-start box-border"
      style="background-color: #181818;"
    >
      <CHeader
        back
        titleColor="#ffffff"
        fill={false}
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>

      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/coupon/header.jpg`}
      ></CImage>

      <HeaderTabbar
        tabList={tabList}
        value={couponStatus}
        tabClick={tabClick}
      ></HeaderTabbar>

      <ScrollView className="flex-1 overflow-hidden" scrollY>
        {couponList?.length > 0 ? (
          <View className="px-30 py-18">
            {couponList?.map((item, index) => {
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
                      <View className="text-28">{item.ticketName}</View>
                      <View className="text-20 mt-5">愉悦生日礼</View>
                      <View className="w-full text-20 mt-20 flex items-center justify-between">
                        <Text>
                          {formatDateTime(item.useBeginDate, 3, ".")} -{" "}
                          {formatDateTime(item.useEndDate, 3, ".")}
                        </Text>
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
                      className="w-670 box-border text-26 text-center px-64 py-40 mt-0"
                      style={`background: url(${config.imgBaseUrl}/coupon/detail_bg.png);background-size:100% 100%`}
                    >
                      <View className="text-left">
                        1 卡券详情：{item.description}
                      </View>
                      <View
                        className="text-left my-10"
                        style="line-height:20px"
                      >
                        2 凭此卡券在有效期内至NARS线下专柜 即可免费领取礼遇
                      </View>
                      <View className="text-left">
                        3 此卡券逾期失效，不予补发
                      </View>
                      {item.status === "10" && (
                        <View className="inline-block mt-30 bg-white">
                          <CQRCodeCustom
                            text={item.ticketSerialNo}
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
