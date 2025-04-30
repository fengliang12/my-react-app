import { Text, View } from "@tarojs/components";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import { useEffect, useMemo, useState } from "react";

import api from "@/src/api";
import { P8 } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import config from "@/src/config";
import { codeMapValue, handleGoodStatus, setShareParams } from "@/src/utils";
import to from "@/src/utils/to";

import OrderGood from "../components/OrderGood";
import PostageType from "../components/PostageType";

const app: App.GlobalData = Taro.getApp();
const OrderConfirm = () => {
  const router = useRouter();
  const { orderId = "", from = "" } = router.params;
  const [detail, setDetail] = useState<Api.Order.GetOrderDetail.IResponse>();
  const [tips, setTips] = useState<string>("");
  const [customInfos, setCustomInfos] = useState<Record<string, string>>();

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

  /**
   * 二维码参数
   */
  const reserveId = useMemo(() => {
    return detail?.extendInfos?.find((item) => item.code === "reserveId")
      ?.value;
  }, [detail]);

  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail, orderId]);

  /**
   * 获取兑换过期提示
   */
  useAsyncEffect(async () => {
    if (!detail?.deliverInfo?.type) return;
    let customInfos = codeMapValue(detail?.customInfos, "name");
    setCustomInfos(customInfos);

    let ret = await api.kvdata.getKvDataByType("redeem_expire_tips");
    let kvData = ret?.data?.[0];
    let tipInfo = JSON.parse(kvData?.content || "{}");

    if (customInfos?.memberDayCoupon || customInfos?.memberDayGood) {
      setTips(tipInfo["member_day"]);
    } else {
      setTips(tipInfo[detail?.deliverInfo?.type]);
    }
  }, [detail?.deliverInfo?.type]);

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="w-screen min-h-screen bg-black pb-100 box-border flex flex-col justify-start items-center text-white">
      <CHeader
        title="兑礼结算"
        titleColor="#ffffff"
        backgroundColor="#000000"
        fill
      ></CHeader>
      <View className="w-685 text-28 box-border mt-44">
        {from === "confirm" ? (
          <View className="text-48 text-center vhCenter mb-50">
            <View className="w-56 h-56 rounded-56 bg-white vhCenter mr-20">
              <CImage className="w-32 h-28" src={P8}></CImage>
            </View>
            <Text>兑换成功</Text>
          </View>
        ) : (
          <View className="text-27 ENGLISH_FAMILY">订单编号：{detail?.id}</View>
        )}

        <View
          className="text-27 mt-25"
          style={{ textAlign: from === "confirm" ? "center" : "left" }}
        >
          {tips}
        </View>
        {detail?.deliverInfo?.type === "express" && (
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

      <View
        className="w-690 pb-53 bg-white px-24 py-45 box-border mt-55 text-black"
        style={{ minHeight: "1000rpx" }}
      >
        <View className="text-29">
          <View className="flex">
            <View className="w-150 flex justify-between items-center">
              <Text>状</Text>
              <Text>态：</Text>
            </View>
            <Text>{handleGoodStatus(detail)}</Text>
          </View>
          {customInfos?.memberDayCoupon ? (
            <View className="mt-16 flex">
              <View className="w-150 flex justify-between items-center">
                <Text>使</Text>
                <Text>用</Text>
                <Text>方</Text>
                <Text>式：</Text>
              </View>
              进入卡券中心查看我的卡券
            </View>
          ) : (
            <View className="mt-16 flex">
              <View className="w-150 flex justify-between items-center">
                <Text>领</Text>
                <Text>取</Text>
                <Text>方</Text>
                <Text>式：</Text>
              </View>

              {detail?.deliverInfo?.type === "express"
                ? "邮寄到家"
                : "到柜领取"}
            </View>
          )}
          {detail?.deliverInfo?.type === "self_pick_up" && (
            <>
              {customInfos?.memberDayCoupon ? (
                <View className="mt-16 flex">
                  <View className="w-150 flex justify-between items-center ENGLISH_FAMILY">
                    <Text>使</Text>
                    <Text>用</Text>
                    <Text>柜</Text>
                    <Text>台：</Text>
                  </View>
                  详见卡券详情
                </View>
              ) : (
                <View className="mt-16 flex">
                  <View className="w-150 flex justify-between items-center ENGLISH_FAMILY">
                    <Text>领</Text>
                    <Text>取</Text>
                    <Text>柜</Text>
                    <Text>台：</Text>
                  </View>
                  {detail?.simpleCounter?.detailInfo?.name}
                </View>
              )}
            </>
          )}
        </View>
        <View className="mt-59">
          <CImage
            className="w-180"
            mode="widthFix"
            src={`${config.imgBaseUrl}/redeem/goods_detail.jpg`}
          ></CImage>
        </View>
        <View className="mt-20">
          <View className="px-16">
            {detail?.goods &&
              detail.goods.length > 0 &&
              detail.goods.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>

          {detail?.deliverInfo?.type === "express" && (
            <View className="font-thin">
              <PostageType></PostageType>
              <View className="w-full h-1 bg-black mt-40"></View>
            </View>
          )}
          <View className="flex justify-between items-center text-29 mt-40 font-normal py-20">
            <Text>消耗积分</Text>
            <Text className="ENGLISH_FAMILY text-47">
              {detail?.totalRealPayPoints}
              <Text className="text-18 relative -top-1"> 积分</Text>
            </Text>
          </View>
        </View>

        {customInfos?.memberDayCoupon ? (
          <>
            <View
              className="w-423 h-78 vhCenter bg-black text-white text-29 m-auto mt-157 mb-100"
              onClick={() => to("/subPages/coupon/index", "reLaunch")}
            >
              查看卡券
            </View>
          </>
        ) : (
          <>
            {detail?.status &&
              ["wait_shipment", "wait_receive", "wait_pay"].includes(
                detail?.status,
              ) &&
              detail?.deliverInfo?.type === "self_pick_up" && (
                <View
                  className="text-55 flex flex-col justify-center items-center mt-46 pt-50"
                  style="border-top:1px solid #000"
                >
                  {detail?.extendInfos?.length > 0 && (
                    <CQRCodeCustom
                      text={reserveId}
                      width={214}
                      height={214}
                      foreground="#000000"
                    ></CQRCodeCustom>
                  )}
                  <View className="text-23 flex flex-col text-center mt-39">
                    <Text>到柜后凭此核销码</Text>
                    <Text className="mt-10">到领取柜台核销领取礼遇</Text>
                  </View>
                </View>
              )}
          </>
        )}
      </View>
    </View>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
