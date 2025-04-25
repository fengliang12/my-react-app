import { ScrollView, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

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
  const userInfo = useSelector((state: Store.States) => state.user);

  useDidShow(async () => {
    await app.init();
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
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

  /**
   * old逻辑
   * PAType :      10：试用品活动（查询礼品信 息） 20：积分兑换活动（查询答谢 品信息） 30：优惠券活动（查询券信 息）
   * GoodsStatus:  1) 类型 10：值定义如下：20：申请成功；30：已领取；85：已过期；
   *               2) 类型 20：值定义如下：20：预约成功；30：已兑换； 85：已过期
   *               3) 类型 30：值定义如下： 10：未使用； 15：已预约；20：已使用；70：已冻结； 90：已过期
   * TicketStatus	 10：未核销；20：已核销；30：已失效
   */

  /**
   * new逻辑
   * PAType :      10：试用品活动（查询礼品信 息） null：优惠券活动（查询券信 息）
   * GoodsStatus:  1) 类型 10：值定义如下：20：申请成功；30：已领取；85：已过期；
   *               2) 类型 20：值定义如下：20：预约成功；30：已兑换； 85：已过期
   *               3) 类型 30：值定义如下： 10：未使用； 15：已预约；20：已使用；70：已冻结； 90：已过期
   * TicketStatus映射到了券码状态	Status
   *               10：未使用；15:已预约； 20：已使用； 70： 已冻结； 80：已取消； 90：已过期
   */
  const couponList = useMemo(() => {
    if (originList?.length > 0 && couponStatus) {
      if (couponStatus === "wait") {
        return originList.filter((item) => {
          if (
            (item.pAType == 10 && item.goodsStatus == 20) ||
            (item.pAType == "LOCAL" && item.goodsStatus == 10) ||
            (item.pAType == null &&
              (item.ticketStatus == 10 || item.ticketStatus == 15))
          ) {
            return item;
          }
        });
      } else if (couponStatus === "used") {
        return originList.filter((item) => {
          if (
            (item.pAType == 10 && item.goodsStatus == 30) ||
            (item.pAType == "LOCAL" && item.goodsStatus == 20) ||
            (item.pAType == null && item.ticketStatus == 20)
          ) {
            return item;
          }
        });
      } else if (couponStatus === "expired") {
        return originList.filter((item) => {
          if (
            (item.pAType == 10 && item.goodsStatus == 85) ||
            (item.pAType == "LOCAL" && item.goodsStatus == 90) ||
            (item.pAType == null && item.ticketStatus == 90)
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
                    className="w-full flex justify-between"
                    style={`background: url(${config.imgBaseUrl}/coupon/list_bg.png);background-size:100% 100%`}
                  >
                    <View
                      className="flex-1 px-60 py-30 text-black text-28 flex justify-center items-start flex-col"
                      onClick={() => {
                        if (selectedIndex === index) {
                          setSelectedIndex(-1);
                        } else {
                          setSelectedIndex(index);
                        }
                      }}
                    >
                      <View className="text-28">
                        {item?.pAName || item?.goodsName}
                      </View>

                      {/* 门店 */}
                      {(item.storeDesc || item.exchangeStoreName) && (
                        <View className="text-22 mt-10">
                          {item?.storeDesc
                            ? item.storeDesc
                            : `使用柜台:${item?.exchangeStoreName}`}
                        </View>
                      )}

                      <View className="w-full text-20 mt-20 flex items-center justify-between">
                        {item?.exchangeBeginDate ? (
                          <Text>
                            {dayjs(
                              item?.exchangeBeginDate?.replaceAll("-", "/"),
                            ).format("YYYY.MM.DD")}{" "}
                            -{" "}
                            {dayjs(
                              item?.exchangeEndDate?.replaceAll("-", "/"),
                            ).format("YYYY.MM.DD")}
                          </Text>
                        ) : (
                          <Text>
                            {dayjs(
                              item?.ticketBegYmd?.replaceAll("-", "/"),
                            ).format("YYYY.MM.DD")}{" "}
                            -{" "}
                            {dayjs(
                              item?.ticketEndYmd?.replaceAll("-", "/"),
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
                        <Text
                          decode
                          className=""
                          style={{
                            lineHeight: "40rpx",
                          }}
                        >
                          {item?.description}
                        </Text>
                      </View>
                      {((item.pAType == 10 && item.goodsStatus == 20) ||
                        (item.pAType == null &&
                          (item.ticketStatus == 10 ||
                            item.ticketStatus == 15))) && (
                        <View className="inline-block mt-30 bg-white">
                          <CQRCodeCustom
                            text={item?.applyId || item?.ticketSerialNo}
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
