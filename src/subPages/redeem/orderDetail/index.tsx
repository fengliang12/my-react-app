import { Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";

import OrderGood from "../components/OrderGood";

const app: App.GlobalData = Taro.getApp();
const OrderConfirm = () => {
  const router = useRouter();
  const { orderId = "" } = router.params;
  const [detail, setDetail] = useState<Api.Order.GetOrderDetail.IResponse>();

  /**
   * 获取订单详情
   */
  const getOrderDetail = useMemoizedFn(async () => {
    Taro.showLoading({ title: "加载中", mask: true });
    await app.init();
    let res = await api.memberOrder.getOrderDetail({ orderId: orderId });
    Taro.hideLoading();
    setDetail(res?.data);
  });

  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail, orderId]);

  return (
    <View className="w-screen min-h-screen bg-black flex flex-col justify-start items-center text-white">
      <CHeader
        title="兑礼结算"
        titleColor="#ffffff"
        backgroundColor="#000000"
        fill
      ></CHeader>
      <View className="w-600 text-28 box-border mt-90">
        <View className="text-28">订单编号：{detail?.id}</View>
        <View className="text-28 mt-45">* 礼品将于3个工作日内到达领取柜台</View>
      </View>

      <View className="w-690 bg-grayBg px-30 py-40 box-border mt-75 text-white">
        <View className="text-34">
          <View>状 态：待领取 </View>
          <View>领取方式：到柜领取 </View>
          <View>领取柜台: nars上海新天地</View>
        </View>
        <View className="box_title mt-50 font-bold">兑换礼品详情</View>
        <View className="mt-50">
          {detail?.goods &&
            detail.goods.length > 0 &&
            detail.goods.map((item) => {
              return <OrderGood good={item} key={item.id}></OrderGood>;
            })}
        </View>
        <View className="w-full h-1 bg-white mt-80"></View>
        <View className="text-55 flex justify-center items-center mt-50">
          <View className="text-32 flex flex-col mr-120">
            <Text>礼品到柜后凭此</Text>
            <Text>核销码到领取柜</Text>
            <Text>台核销领取礼遇</Text>
          </View>
          <CQRCodeCustom
            text="核销码到领取柜"
            width={210}
            height={210}
            foreground="#FFFFFF"
          ></CQRCodeCustom>
        </View>
      </View>
    </View>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
