import { Swiper, SwiperItem, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useState } from "react";

import CVideo from "@/src/components/Common/CVideo";
import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";
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

const X = 325;
const zoomOut = 0.7;
const Index = () => {
  const [current, setCurrent] = useState<number>(1);
  const [objectFit, setObjectFit] = useState<string>("cover");
  const [margin, setMargin] = useState<number>(210);
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
    <>
      <Page
        navConfig={{
          title: "",
          fill: true,
          backgroundColor: "rgba(0,0,0,0)",
          titleColor: "#FFFFFF",
        }}
      >
        <Layout
          code="TECHINIQUES"
          globalStyle={{ backgroundColor: "#000000" }}
        />
      </Page>
      <View className="w-full pb-100">
        <Swiper
          className="w-full h-550"
          current={current}
          previousMargin={`${margin}rpx`}
          nextMargin={`${margin}rpx`}
          onChange={handleSwiperChange}
        >
          {list.map((item, index) => {
            return (
              <SwiperItem className="w-full h-full vhCenter" key={index}>
                <CVideo
                  id={item.id}
                  objectFit={objectFit as any}
                  className="w-299 h-550"
                  controls
                  loop
                  showProgress={false}
                  showBottomProgress="false"
                  playBtnPosition="center"
                  poster={`${config.imgBaseUrl}${item.poster}`}
                  src={`${config.imgBaseUrl}${item.videoUrl}`}
                  onPlay={() => {
                    list.forEach((item) => {
                      if (index !== current) {
                        Taro.createVideoContext(item.id).pause();
                      }
                      setCurrent(index);
                    });
                  }}
                  onFullScreenChange={(e) => {
                    if (e.detail.fullScreen) {
                      setMargin(0);
                      setObjectFit("contain");
                    } else {
                      setMargin(210);
                      setObjectFit("cover");
                    }
                  }}
                ></CVideo>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View
          className="w-screen vhCenter text-white mt-50 text-28"
          style={`transform: translateX(${
            (1 - current) * X
          }rpx);transition:all 0.5s;color:#808080`}
        >
          <View
            className="w-140 text-left"
            style={`${
              current !== 0
                ? `transform: scale(${zoomOut});color:#808080`
                : "color:#FFFFFF"
            };transition: all 1s`}
          >
            立体颊彩
          </View>
          <View className="w-165 h-1 mx-10" style="background:#808080"></View>
          <View
            className="w-140 text-center"
            style={`${
              current !== 1
                ? `transform: scale(${zoomOut});color:#808080`
                : "color:#FFFFFF"
            };transition: all 1s`}
          >
            精致眼妆
          </View>
          <View className="w-165 h-1 mx-10" style="background:#808080"></View>
          <View
            className="w-140 text-right"
            style={`${
              current !== 2
                ? `transform: scale(${zoomOut});color:#808080`
                : "color:#FFFFFF"
            };transition: all 1s`}
          >
            妆前护肤
          </View>
        </View>
      </View>
    </>
  );
};

export default Index;
