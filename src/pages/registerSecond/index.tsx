import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import to from "@/src/utils/to";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  return (
    <View className="h-screen w-screen bg-black">
      <CHeader
        back
        title=""
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>
      <CImage
        className="w-full fixed top-600 left-0"
        mode="widthFix"
        src={`${config.imgBaseUrl}/register/nars_icon.jpg`}
        onClick={async () => {
          let userInfo = await app.init();
          if (userInfo?.isMember) {
            to(pageSettingConfig.homePath, "reLaunch");
          } else {
            to(pageSettingConfig.registerPath, "redirectTo");
          }
        }}
      ></CImage>
      <CImage
        className="w-full fixed bottom-0 left-0"
        mode="widthFix"
        src={`${config.imgBaseUrl}/register/register_bottom.jpg`}
      ></CImage>
    </View>
  );
};

export default Index;
