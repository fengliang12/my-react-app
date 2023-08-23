import { Picker, Text, View } from "@tarojs/components";
import { useState } from "react";

import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";

const Index = () => {
  const [appointment, setAppointment] = useState<any>({
    storeCode: "",
    date: "",
    time: "",
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
      <Text className="text-76 text-left mt-40 ml-67 font-thin" decode>
        {`AUDACIOUS \n MAKE UP`}
      </Text>
      <View className="text-76 text-left ml-67 font-thin">先锋妆容</View>
      <CImage
        className="w-690 h-517 mt-70 ml-30 mb-53"
        src={`${config.imgBaseUrl}/appointment/appointment_detail.jpg`}
      ></CImage>
      <View className="mb-30">
        <Picker mode="selector" range={[]} onChange={(e) => {}}>
          <View
            className="w-678 h-80 vhCenter ml-36"
            style={{ border: "1px solid #FFFFFF" }}
          >
            {!appointment.storeCode && (
              <View className="ipt-placeholder">选择服务门店 v</View>
            )}
            {appointment.storeCode}
          </View>
        </Picker>
      </View>
      <View className="mb-30">
        <Picker mode="selector" range={[]} onChange={(e) => {}}>
          <View
            className="w-678 h-80 vhCenter ml-36"
            style={{ border: "1px solid #FFFFFF" }}
          >
            {!appointment.storeCode && (
              <View className="ipt-placeholder">选择服务日期 v</View>
            )}
            {appointment.storeCode}
          </View>
        </Picker>
      </View>
      <View className="mb-30">
        <Picker mode="selector" range={[]} onChange={(e) => {}}>
          <View
            className="w-678 h-80 vhCenter ml-36"
            style={{ border: "1px solid #FFFFFF" }}
          >
            {!appointment.storeCode && (
              <View className="ipt-placeholder">选择服务时间 v</View>
            )}
            {appointment.storeCode}
          </View>
        </Picker>
      </View>
      <View
        className="w-224 text-26 h-50 m-auto text-black vhCenter bg-white"
        onClick={() => {
          to("/subPages/service-appointment/detail/index", "redirectTo");
        }}
      >
        立即预约
      </View>
    </View>
  );
};
export default Index;
