import { ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "ahooks";
import { useSelector } from "react-redux";

import api from "@/api/index";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);
  const { data: projects = [] } = useRequest(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    return await api.arvatoReservation.getProjects().then((res) => {
      Taro.hideLoading();
      return res.data;
    });
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
      <View className="text-52 text-left mt-100 font-thin pl-60 english_family">
        MAKE UP YOUR MIND
      </View>
      <View className="text-35 text-left mt-10 font-thin pl-60">
        预约门店专属彩妆服务
      </View>

      <ScrollView className="flex-1 mt-150" scrollY>
        <View className="h-full flex items-center justify-center flex-wrap">
          {projects.map((item, index) => (
            <View
              key={index}
              className="w-300 h-300 relative mx-15 mb-30"
              onClick={() => {
                to(
                  `/subPages/service-appointment/appointment/index?projectCode=${item.projectCode}&projectName=${item.projectName}`,
                  "navigateTo",
                );
              }}
            >
              <CImage
                className="w-full h-full"
                src={
                  item.imageUrl ||
                  `${config.imgBaseUrl}/appointment/appointment_icon.jpg`
                }
              ></CImage>
            </View>
          ))}
        </View>
      </ScrollView>
      <View className="h-200 text-35 text-center font-thin underline">
        <Text
          onClick={() => {
            if (!userInfo?.isMember) {
              to("/pages/registerSecond/index");
              return;
            }
            to("/subPages/service-appointment/list/index", "navigateTo");
          }}
        >
          预约记录
        </Text>
      </View>
    </View>
  );
};
export default Index;
