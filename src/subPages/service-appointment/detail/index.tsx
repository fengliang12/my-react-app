import { Text, View } from "@tarojs/components";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";

const Index = () => {
  return (
    <View className="service-introduce min-h-screen bg-black text-white flex flex-col">
      <CHeader
        back
        titleImage="https://biomember.blob.core.chinacloudapi.cn/gac/nars/title_image.png"
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleCss="height:85rpx"
        titleColor="#FFFFFF"
      ></CHeader>
      <CImage
        className="w-690 h-517 mt-40 ml-30"
        src="https://biomember.blob.core.chinacloudapi.cn/gac/nars/appointment_detail.jpg"
      ></CImage>
      <View className="w-560 text-36 text-left font-thin mt-60 ml-85">
        预约服务:先锋妆容
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        预约门店:上海芮欧百货店,
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        预约时间: 2023年8月11日 14:00
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        请在预约时间凭此核销码至门店
      </View>
      <View className="w-560 text-36 text-left font-thin  mt-20 ml-85">
        尊享服务
      </View>
      <View className="m-auto flex justify-center bg-white">
        <CQRCodeCustom
          text="11111111111111"
          width={250}
          height={250}
          padding={10}
          background="#FFFFFF"
        ></CQRCodeCustom>
      </View>
      <View className="h-100 text-35 text-center font-thin underline">
        取消预约
      </View>
    </View>
  );
};
export default Index;
