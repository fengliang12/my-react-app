import { ScrollView, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";

import api from "@/api/index";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const { data: projects = [] } = useRequest(async () => {
    await app.init();
    return await api.arvatoReservation.getProjects().then((res) => res.data);
  });

  return (
    <View className="min-h-screen bg-black text-white flex flex-col">
      <CHeader
        back
        titleImage={`${config.imgBaseUrl}/icon/title_image.png`}
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <View className="text-52 text-center mt-100 font-thin">
        预约门店专属服务
      </View>
      {/* <View className="text-35 text-center mt-50 font-thin">
        亲爱的NARS唇妆达人
      </View>
      <View className="text-35 text-center mt-10 font-thin">
        您还有2次服务机会
      </View> */}
      <ScrollView className="flex-1 mt-100" scrollY>
        <View className="h-full flex items-center justify-center flex-wrap">
          {projects.map((item: any, index) => (
            <View
              key={index}
              className="w-300 h-244 relative mx-10 mb-30"
              onClick={() => {
                to(
                  `/subPages/service-appointment/introduce/index?projectCode=${item.projectCode}&projectName=${item.projectName}`,
                  "navigateTo",
                );
              }}
            >
              <CImage
                className="w-full h-full"
                src={`${config.imgBaseUrl}/appointment/appointment_icon.jpg`}
              ></CImage>
              <View
                className="w-full h-70 absolute top-70 left-0 text-white vhCenter"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                {item.projectName}
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
