import "./index.less";

import { ScrollView, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useRef, useState } from "react";

import api from "@/src/api";
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
  const [indexList, setIndexList] = useState<number[]>([]);
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
                <View
                  className="p-22 mb-30"
                  style="background-color: #373737"
                  key={item.id}
                >
                  <View className="flex justify-between">
                    <View className="w-230 h-174 bg-white overflow-hidden vhCenter">
                      <CImage
                        className="h-114 float-left"
                        mode="heightFix"
                        src={item.imageUrl}
                      ></CImage>
                    </View>
                    <View className="flex-1 px-10 py-20 text-white text-28 vhCenter flex-col">
                      <View className="text-36">{item.ticketName}</View>
                      <View className="text-20 my-10">
                        {formatDateTime(item.useBeginDate, 3, ".")} -{" "}
                        {formatDateTime(item.useEndDate, 3, ".")}
                      </View>
                      <View
                        className="text-24 mt-10"
                        onClick={() => {
                          let i = indexList.findIndex((item) => item === index);
                          i === -1
                            ? indexList.push(index)
                            : indexList.splice(i, 1);
                          setIndexList([...indexList]);
                        }}
                      >
                        查看详情 v
                      </View>
                    </View>
                  </View>
                  {indexList.includes(index) && (
                    <View
                      className="w-670 box-border text-26 text-center px-64 py-40"
                      style="background: #6c6c6c"
                    >
                      <View className="text-left">
                        1 卡券详情：{item.ticketName}
                      </View>
                      <View className="text-left">
                        2 凭此卡券在有效期内至NARS线下专柜 即可免费领取礼遇
                      </View>
                      <View className="text-left">
                        3 此卡券逾期失效，不予补发
                      </View>
                      <View className="inline-block mt-30 bg-white">
                        <CQRCodeCustom
                          text={item.ticketSerialNo}
                          width={250}
                          height={250}
                          padding={10}
                          background="#FFFFFF"
                        ></CQRCodeCustom>
                      </View>
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
