import { View } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";

import CImage from "@/src/components/Common/CImage";
import CVideo from "@/src/components/Common/CVideo";
import Layout from "@/src/components/Layout";
import Page from "@/src/components/Page";
import config from "@/src/config";
import { setShareParams } from "@/src/utils";

const Index = () => {
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
        <Layout code="TRENDS" globalStyle={{ backgroundColor: "#000000" }} />
      </Page>
      <View className="vhCenter">
        <CVideo
          id="NARS"
          objectFit="contain"
          controls
          loop
          showProgress={false}
          showBottomProgress="false"
          playBtnPosition="center"
          className="w-299 h-550"
          poster={`${config.imgBaseUrl}/activity/nars_bg_01.png`}
          src={`${config.imgBaseUrl}/activity/NARS.mp4`}
        ></CVideo>
      </View>
      <CImage
        className="w-full"
        mode="widthFix"
        src={`${config.imgBaseUrl}/activity/bottom.png`}
      ></CImage>
    </>
  );
};

export default Index;
