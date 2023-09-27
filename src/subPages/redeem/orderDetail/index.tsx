import { Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";
import { P8 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";

import OrderGood from "../components/OrderGood";

const app: App.GlobalData = Taro.getApp();
const OrderConfirm = () => {
  const router = useRouter();
  const { orderId = "", from = "" } = router.params;
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
      <View className="w-600 text-28 box-border mt-60">
        {from === "confirm" ? (
          <View className="text-48 text-center vhCenter mb-50">
            <View className="w-50 h-50 rounded-50 bg-white vhCenter mr-20">
              <CImage className="w-46 h-40" src={P8}></CImage>
            </View>
            <Text>兑换成功</Text>
          </View>
        ) : (
          <View className="text-28">订单编号：{detail?.id}</View>
        )}

        <View className="text-28 mt-30">
          {detail?.deliverInfo
            ? "* 礼品将于10个工作日内发货"
            : "* 礼品将于10个工作日内到达领取柜台"}
        </View>
        {detail?.deliverInfo && (
          <View className="mt-30 text-28">
            <View className="mt-15">
              <Text>收件人：</Text>
              <Text>{detail?.deliverInfo?.addressee}</Text>
            </View>
            <View className="mt-15">
              <Text>电话：</Text>
              <Text>{detail?.deliverInfo?.mobile}</Text>
            </View>
            <View className="mt-15">
              <Text>地址：</Text>
              <Text>
                {`${detail?.deliverInfo?.province}/${detail?.deliverInfo?.city}/${detail?.deliverInfo?.district}${detail?.deliverInfo?.detail}`}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="w-690 pb-200 bg-white px-30 py-40 box-border mt-75 text-black font-bold">
        <View className="text-28">
          <View>状 态：{detail?.statusName}</View>
          <View className="mt-10">
            领取方式：
            {detail?.deliverInfo ? "邮寄到家（积分抵邮）" : "到柜领取"}
          </View>
          {!detail?.deliverInfo && (
            <View className="mt-10">
              领取柜台: {detail?.simpleCounter?.detailInfo?.name}
            </View>
          )}
        </View>
        <View className="mt-70 text-32">兑换礼品详情</View>
        <View className="mt-20">
          <View className="font-thin">
            {detail?.goods &&
              detail.goods.length > 0 &&
              detail.goods.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>
          <View className="flex justify-between items-center text-40 mt-40">
            <Text>总消耗积分</Text>
            <Text>{detail?.totalRealPayPoints}</Text>
          </View>
        </View>

        {detail?.status &&
          ["wait_pay", "wait_shipment"].includes(detail?.status) &&
          !detail?.deliverInfo && (
            <View
              className="text-55 flex justify-center items-center mt-50 pt-50"
              style="border-top:1px solid #000"
            >
              <View className="text-32 flex flex-col mr-120">
                <Text>礼品到柜后凭此</Text>
                <Text className="my-10">核销码到领取柜</Text>
                <Text>台核销领取礼遇</Text>
              </View>
              {detail?.id && (
                <CQRCodeCustom
                  text={detail.id}
                  width={210}
                  height={210}
                  foreground="#000000"
                ></CQRCodeCustom>
              )}
            </View>
          )}
      </View>
    </View>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
