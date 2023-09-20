import { Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useRequest } from "ahooks";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import { handleTextBr } from "@/src/utils";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();

  const { data: project } = useRequest(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    return await api.arvatoReservation
      .getProjects()
      .then((res) => res.data)
      .then((list) => {
        Taro.hideLoading();
        return (
          list.find((i) => i.projectCode === router.params.projectCode) ||
          ({} as Api.ArvatoReservation.GetProjects.Item)
        );
      });
  });

  return (
    <View className="service-introduce min-h-screen bg-black text-white flex flex-col">
      <CHeader
        back
        titleImage={`${config.imgBaseUrl}/icon/title_image.png`}
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      {/* <Text className="text-76 text-left mt-40 ml-67 font-thin" decode>
        {handleTextBr(project?.introduce)}
      </Text>
      <View className="text-76 text-left ml-67 font-thin">
        {project?.projectName}
      </View> */}
      <CImage
        className="w-690 h-690 mt-70 ml-30"
        src={
          project?.imageUrl ||
          `${config.imgBaseUrl}/appointment/appointment_detail.jpg`
        }
      ></CImage>
      <View className="w-610 text-35 text-left font-thin mt-54 ml-70">
        <text>{project?.reason}</text>
      </View>
      <View
        className="w-300 text-26 h-60 m-auto text-black vhCenter bg-white mt-100"
        onClick={() => {
          to(
            `/subPages/service-appointment/appointment/index?projectCode=${router.params.projectCode}`,
            "redirectTo",
          );
        }}
      >
        立即预约
      </View>
    </View>
  );
};
export default Index;
