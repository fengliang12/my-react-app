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

import { POSITION_ENUM_TEXT } from "../config";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const qyUser = useSelector((state: Store.States) => state.qyUser);

  /**
   * 点击确认
   */
  const onConfirm = useMemoizedFn(async () => {
    await app.init();
    await Taro.scanCode({
      success: async (res) => {
        console.log("扫码结果", res);
        if (res?.result) {
          await app.init();
          await api.qy.orderSubmit({
            code: res.result,
            type: "code",
            storeAdmins: qyUser?.storeAdmins ?? [],
          });
          toast("核销成功");
        }
      },
      fail: (err) => {
        console.log("err", err);
      },
    });
  });

  return (
    <View className="bg-[#000] min-h-screen">
      <CHeader
        fill={false}
        back={false}
        titleColor="#FFFFFF"
        backgroundColor="#000000"
      ></CHeader>

      {/* 基础信息 */}
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
            {qyUser?.position && (
              <View className="h-37 px-20 bg-[#C5112C] vhCenter text-20">
                {
                  POSITION_ENUM_TEXT[
                    qyUser.position as keyof typeof POSITION_ENUM_TEXT
                  ]
                }
              </View>
            )}
          </View>
          {qyUser?.storeName && (
            <View className="vhCenter">
              <CImage
                className="w-18 mr-24"
                mode="widthFix"
                src={`${config.imgBaseUrl}/qy/home/address.png`}
              ></CImage>
              <Text className="text-30">{qyUser?.storeName}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 三个入口 */}
      <View className="w-full bg-[#F8F5F8] pt-37 pb-52 flex flex-col items-center justify-center">
        {/* 兑礼明细 */}
        <CImage
          className="w-686 mb-33"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/record_list.png`}
          onClick={() => {
            to("/pages/qy/recordQuery/index");
          }}
        ></CImage>
        {/* 库存查询 */}
        <CImage
          className="w-686 mb-33"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/stock_query.png`}
          onClick={() => {
            to("/pages/qy/stockQuery/index");
          }}
        ></CImage>
        {/* 数据看板 */}
        <CImage
          className="w-686"
          mode="widthFix"
          src={`${config.imgBaseUrl}/qy/home/data_query.png`}
          onClick={() => {
            to("/pages/qy/dashboard/index");
          }}
        ></CImage>

        {/* 扫码核销 */}
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
