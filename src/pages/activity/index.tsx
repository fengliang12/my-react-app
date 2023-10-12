import { Swiper, SwiperItem, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CVideo from "@/src/components/Common/CVideo";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";

const list = [
  {
    id: "first",
    poster: "/activity/01.png",
    videoUrl: "/activity/first.mp4",
  },
  {
    id: "second",
    poster: "/activity/02.png",
    videoUrl: "/activity/second.mp4",
  },
  {
    id: "third",
    poster: "/activity/03.png",
    videoUrl: "/activity/third.mp4",
  },
];

const zoomOut = 0.7;
const Index = () => {
  useEffect(() => {});
  const [current, setCurrent] = useState<number>(1);
  const [margin, setMargin] = useState<number>(80);

  /**
   * 轮播变化时调用
   */
  const handleSwiperChange = useMemoizedFn((onChangeEventDetail) => {
    const swiperCurrent = onChangeEventDetail.detail.current;
    //修改全局轮播位置
    setCurrent(swiperCurrent);
    list.forEach((item) => {
      Taro.createVideoContext(item.id).pause();
    });
  });

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View>
      <CHeader
        back
        fill={false}
        title=""
        titleColor="#ffffff"
        backgroundColor="rgba(0,0,0,0)"
      ></CHeader>
      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/activity/header.png`}
      ></CImage>
      <Swiper
        className="w-full h-790"
        previousMargin={`${margin}px`}
        nextMargin={`${margin}px`}
        current={current}
        onChange={handleSwiperChange}
      >
        {list.map((item, index) => {
          return (
            <SwiperItem className="w-full h-full" key={index}>
              <CVideo
                id={item.id}
                style={`${
                  index !== current ? `transform: scale(${zoomOut});` : ""
                };transition: all 1s`}
                objectFit="contain"
                className="w-full h-full"
                controls
                loop
                poster={`${config.imgBaseUrl}${item.poster}`}
                src={`${config.imgBaseUrl}${item.videoUrl}`}
                onPlay={() => {
                  Taro.createVideoContext("NARS").pause();
                }}
                onFullScreenChange={(e) => {
                  if (e.detail.fullScreen) {
                    setMargin(0);
                  } else {
                    setMargin(80);
                  }
                }}
              ></CVideo>
            </SwiperItem>
          );
        })}
      </Swiper>
      <View className="vhCenter text-white mt-50">
        <View
          style={`${
            current !== 0
              ? `transform: scale(${zoomOut});color:#808080`
              : "color:#FFFFFF"
          };transition: all 1s`}
        >
          颊彩
        </View>
        <View className="w-200 h-1 mx-10" style="background:#808080"></View>
        <View
          style={`${
            current !== 1
              ? `transform: scale(${zoomOut});color:#808080`
              : "color:#FFFFFF"
          };transition: all 1s`}
        >
          眼妆
        </View>
        <View className="w-200 h-1 mx-10" style="background:#808080"></View>
        <View
          style={`${
            current !== 2
              ? `transform: scale(${zoomOut});color:#808080`
              : "color:#FFFFFF"
          };transition: all 1s`}
        >
          护肤
        </View>
      </View>
      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/activity/middle.png`}
      ></CImage>
      <View className="vhCenter">
        <CVideo
          id="NARS"
          objectFit="contain"
          controls
          loop
          className="w-400 h-730"
          poster={`${config.imgBaseUrl}/activity/nars_bg.png`}
          src={`${config.imgBaseUrl}/activity/NARS.mp4`}
          onPlay={() => {
            list.forEach((item) => {
              Taro.createVideoContext(item.id).pause();
            });
          }}
        ></CVideo>
      </View>
      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/activity/bottom.png`}
      ></CImage>
    </View>
  );
};
export default Index;
