import "./index.less";

import { ScrollView, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import HeaderTabbar from "@/src/components/Common/HeaderTabbar";
import config from "@/src/config";

import { textData } from "./testData";

const app = Taro.getApp<App.GlobalData>();

type tabType = { title: string; index: number; status: CouponStatusType };
const tabList: Array<tabType> = [
  { title: "待使用", index: 0, status: "usable" },
  { title: "已使用", index: 1, status: "redeem" },
  { title: "已过期", index: 2, status: "expire" },
];

const Index = () => {
  const activeIndex = useRef({ index: 0 });
  const [couponList, setCouponList] = useState<any>(textData);
  const [indexList, setIndexList] = useState<number[]>([]);

  /**
   * 获取卡券列表
   */
  const getMyCouponListByStatus = useMemoizedFn(async () => {
    setCouponList([]);
    let status = tabList[activeIndex.current.index].status;
    const { data } = await api.coupon.getCustomerCouponByStatus({
      status: status,
    });
    setCouponList(data);
  });

  useDidShow(async () => {
    await app.init();
    getMyCouponListByStatus();
  });

  /**
   * 点击菜单栏切换
   */
  const tabClick = useMemoizedFn((index) => {
    setCouponList([...textData]);
    if (activeIndex.current.index === index) return;
    activeIndex.current.index = index;
    getMyCouponListByStatus();
  });

  return (
    <View className="coupon">
      <CHeader
        back
        titleColor="#ffffff"
        fill={false}
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>

      <CImage
        className="img1"
        mode="widthFix"
        src={`${config.imgBaseUrl}/coupon/header.jpg`}
      ></CImage>

      <HeaderTabbar
        tabList={tabList}
        activeIndex={activeIndex.current.index}
        tabClick={tabClick}
      ></HeaderTabbar>

      <ScrollView className="scroll_view" scrollY>
        {couponList?.length > 0 ? (
          <View className="gifts">
            {couponList?.map((item, index) => {
              return (
                <View className="gift-item" key={item.id}>
                  <View className="gift-top">
                    <View className="gift-item-left vhCenter">
                      <CImage
                        className="gift-img"
                        mode="heightFix"
                        src={item.mainImage}
                      ></CImage>
                    </View>
                    <View className="gift-item-right vhCenter flex-col">
                      <View className="text-36">先锋礼遇</View>
                      <View className="text-18 my-10">
                        2023.10.1-2023.12.15
                      </View>
                      <View
                        className="text-24"
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
                    <View className="gift-detail">
                      <View className="text-left">
                        1 卡券详情：腮红试色卡片1片及拉古纳试色卡1片{" "}
                      </View>
                      <View className="text-left">
                        2 凭此卡券在有效期内至NARS线下专柜 即可免费领取礼遇
                      </View>
                      <View className="text-left">
                        3 此卡券逾期失效，不予补发
                      </View>
                      <View className="qr-code bg-white">
                        <CQRCodeCustom
                          text="11111111111111"
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
