import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

const Index = () => {
  const qyUser = useSelector((state: Store.States) => state.qyUser);

  /**
   * 点击确认
   */
  const onConfirm = useMemoizedFn(async () => {
    Taro.scanCode({
      success: async (res) => {
        let res1 = await api.qy.orderSubmit({
          code: res.result,
          type: "code",
        });
        console.log("res", res1);
      },
      fail: (err) => {
        console.log("err", err);
        toast("扫码失败");
      },
    });
  });

  return (
    <View className="bg-[#F8F5F8] min-h-screen">
      <CHeader
        fill={false}
        titleColor="#FFFFFF"
        backgroundColor="transparent"
      ></CHeader>
      <View className="relative">
        <CImage
          className="w-full"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/title_img.png`}
        ></CImage>

        {/* 用户信息展示 */}
        <View className="absolute bottom-74 right-37 text-[#F9F9F9] flex flex-col items-center justify-center">
          <View className="vhCenter mb-34">
            <Text className="text-36 mr-46">{qyUser.name}</Text>
            <View className="w-106 h-37 bg-[#C5112C] vhCenter text-20">
              彩妆师
            </View>
          </View>
          <View className="vhCenter">
            <CImage
              className="w-18 mr-24"
              mode="widthFix"
              src={`${config.imgBaseUrl}/qy/home/address.png`}
            ></CImage>
            <Text className="text-30">上海新世界</Text>
          </View>
        </View>
      </View>

      {/* 入口 */}
      <View className="w-full bg-[#F8F5F8] pt-37 pb-52 flex flex-col items-center justify-center">
        <CImage
          className="w-686 mb-33"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/record_list.png`}
          onClick={() => {
            to("/pages/qy/recordQuery/index");
          }}
        ></CImage>
        <CImage
          className="w-686 mb-33"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/stock_query.png`}
          onClick={() => {
            to("/pages/qy/stockQuery/index");
          }}
        ></CImage>
        <CImage
          className="w-686"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/data_query.png`}
          onClick={() => {
            to("/pages/qy/dashboard/index");
          }}
        ></CImage>

        <CImage
          className="w-640 mt-156"
          mode="widthFix"
          onClick={onConfirm}
          src={`${config.imgBaseUrl}/qy/home/scan_btn.png`}
        ></CImage>
        <View className="text-center mt-43 text-20">
          *扫码后将核销整笔订单所有兑换产品
        </View>
      </View>
    </View>
  );
};
export default Index;
