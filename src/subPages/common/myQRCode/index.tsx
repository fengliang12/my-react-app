import { View } from "@tarojs/components";
import { useSelector } from "react-redux";

import { LogoB, P6 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";

const Index = () => {
  const userInfo = useSelector((state: Store.States) => state.user);

  return (
    <View className="h-screen w-screen bg-black">
      <CHeader
        back
        title="我的二维码"
        titleColor="#ffffff"
        fill
        backgroundColor="rgba(0,0,0,1)"
      ></CHeader>

      <View className="w-full vhCenter flex-col fixed top-p45 transform translate-y-n50">
        <CImage className="w-360" mode="widthFix" src={LogoB}></CImage>
        <View className="bg-white inline-block p-10 mt-100">
          <CQRCodeCustom
            text={userInfo?.cardNo as unknown as string}
            width={360}
            height={360}
            image={{
              imageResource: userInfo?.avatarUrl || "",
              width: 30,
              height: 30,
              round: true,
            }}
          ></CQRCodeCustom>
        </View>
        <View className="mt-50 text-28 text-center text-white">
          您的专属会员码
        </View>
      </View>
    </View>
  );
};

export default Index;
