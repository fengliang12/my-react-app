import { Swiper, SwiperItem, View } from "@tarojs/components";
import React, { useState } from "react";

import { P6 } from "@/src/assets/image";
import config from "@/src/config";

import CImage from "../Common/CImage";

const Index = () => {
  const [tabList] = useState([
    { title: "玩妆入门", value: "primary" },
    { title: "玩妆达人", value: "intermediate" },
    { title: "玩妆先锋", value: "pioneer" },
    { title: "玩妆大师", value: "master" },
  ]);
  const [tabShow, setTabShow] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const tabClick = (value) => {
    setTabIndex(value);
  };
  return (
    <>
      {/* 查看会员权益 */}
      <View className="w-full" style="margin-top:-60rpx">
        {!tabShow ? (
          <View
            className="text-white text-18 text-center p-20 vhCenter"
            onClick={() => setTabShow(true)}
          >
            查看会员权益
            <CImage className="w-18 h-12 ml-10" src={P6}></CImage>
          </View>
        ) : (
          <View className="w-full flex">
            {tabList?.length &&
              tabList.map((item: any, index) => {
                return (
                  <View
                    className={`flex-1 text-center h-60 leading-60 text-26 text-white ${
                      index === tabIndex ? "home_tab_active" : ""
                    }`}
                    onClick={() => tabClick?.(index)}
                    key={item.title}
                  >
                    {item.title}
                  </View>
                );
              })}
          </View>
        )}

        {tabShow && (
          <View>
            <Swiper
              current={tabIndex}
              className="w-full h-1064"
              onChange={(e) => setTabIndex(e.detail.current)}
            >
              {tabList?.length &&
                tabList.map((item: any, index) => {
                  return (
                    <SwiperItem key={index} className="w-full h-full">
                      <CImage
                        className="w-full h-full"
                        src={`${config.imgBaseUrl}/grade/${item.value}.png`}
                      ></CImage>
                    </SwiperItem>
                  );
                })}
            </Swiper>
            <View
              className="text-white text-18 text-center py-20 vhCenter"
              onClick={() => setTabShow(false)}
            >
              收起会员权益
              <CImage
                className="w-18 h-12 ml-10 transform rotate-180"
                src={P6}
              ></CImage>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
export default React.memo(Index);
