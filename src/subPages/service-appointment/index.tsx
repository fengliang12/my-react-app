import "./index.less";

import { ScrollView, View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import to from "@/src/utils/to";

const Index = () => {
  /**
   * 初始化页面
   */
  const list = [
    {
      label: "底妆定制",
    },
    {
      label: "通勤妆容",
    },
    {
      label: "基础眼妆",
    },
    {
      label: "约会妆容",
    },
    {
      label: "定制颊彩",
    },
    {
      label: "先锋妆容",
    },
  ];
  return (
    <View className="service-appointment text-white flex flex-col">
      <CHeader
        back
        titleImage="https://biomember.blob.core.chinacloudapi.cn/gac/nars/title_image.png"
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <View className="text-52 text-center mt-100 font-thin">
        预约门店专属服务
      </View>
      <View className="text-35 text-center mt-50 font-thin">
        亲爱的NARS唇妆达人
      </View>
      <View className="text-35 text-center mt-10 font-thin">
        您还有2次服务机会
      </View>
      <ScrollView className="flex-1 mt-100" scrollY>
        <View className="h-full flex items-center justify-center flex-wrap">
          {list.map((item: any, index) => (
            <View
              key={index}
              className="w-300 h-244 relative mx-10 mb-30"
              onClick={() => {
                to(
                  "/subPages/service-appointment/introduce/index",
                  "navigateTo",
                );
              }}
            >
              <CImage
                className="w-full h-full"
                src="https://biomember.blob.core.chinacloudapi.cn/gac/nars/appointment_icon.jpg"
              ></CImage>
              <View
                className="w-full h-70 absolute top-70 left-0 text-white vhCenter"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                {item.label}
              </View>
              <View className="w-122 text-22 h-50 absolute  bottom-30 left-87 text-black vhCenter bg-white rounded-10">
                立即预约
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        className="h-100 text-35 text-center font-thin underline"
        onClick={() => {
          to("/subPages/service-appointment/list/index", "navigateTo");
        }}
      >
        我的预约记录
      </View>
    </View>
  );
};
export default Index;
