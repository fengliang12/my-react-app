import { Text, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useBoolean, useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@/src/api";
import CDialog from "@/src/components/Common/CDialog";
import CHeader from "@/src/components/Common/CHeader";
import config from "@/src/config";
import usePayHooks from "@/src/hooks/payHooks";
import { SET_COMMON } from "@/src/store/constants";
import { verifyAddressInfo } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ExchangeExpress from "../components/ExchangeExpress";
import OrderGood from "../components/OrderGood";
import PostageType from "../components/PostageType";

const app: App.GlobalData = Taro.getApp();

const OrderConfirm = () => {
  const router = useRouter();
  const { from = "" } = router.params;
  const dispatch = useDispatch();
  const { pay } = usePayHooks();
  const points = useSelector((state: Store.States) => state.user.points);
  const { applyType, counter, goods } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );
  const [postageType, setPostageType] = useState<string>("points");
  const [addressInfo, setAddressInfo] =
    useState<Api.Cart.Public.IDeliverInfo>();
  const [showDialog, { setTrue, setFalse }] = useBoolean(false);

  /** 积分 */
  const totalPoints = useMemo(() => {
    return goods.reduce((a, b) => a + (b.points || b.point) * b.quantity, 0);
  }, [goods]);

  /**
   * 点击兑换
   */
  const handleReceive = useMemoizedFn(async () => {
    if (applyType === "express") {
      /** 邮寄到家 */
      if (!addressInfo) return toast("请先填写收获信息");
      verifyAddressInfo(addressInfo)
        .then(async () => {
          setTrue();
        })
        .catch((err) => {
          toast({ title: err, mask: true });
        });
    } else if (applyType === "self_pick_up") {
      /** 门店核销 */
      if (!counter) return toast("柜台不能为空");
      setTrue();
    }
  });

  /**
   * 确认兑礼订单
   */
  const confirm = useMemoizedFn(async () => {
    if (points < totalPoints) return toast("您的积分不足");

    Taro.showLoading({ title: "加载中", mask: true });
    let params = {
      channelId: "wa",
      counterId: applyType === "self_pick_up" ? counter.id : undefined,
      deliverInfo: applyType === "express" ? addressInfo : undefined,
      integral: true,
      customPointsPayPlan: {
        notValidateUsablePoints: true,
        redeemPoints:
          postageType === "points" && applyType === "express"
            ? totalPoints + config.postagePoints
            : totalPoints,
        usePoints: true,
      },
    };

    let result: any = null;
    if (from === "cart") {
      /** 购物车核销 */
      result = await api.cart.submit(
        params as Api.Cart.SubmitCart.IRequestBody,
      );
    } else {
      /** 立即兑礼核销 */
      if (!goods?.length) return toast("商品不能为空");
      result = await api.buyNow.submit({
        ...params,
        skuId: goods?.[0].skuId,
        quantity: 1,
      } as Api.BuyNow.Submit.IRequestBody);
    }

    if (result.status === 200) {
      if (postageType === "money" && applyType === "express") {
        /** 邮寄到家&9.9元支付 */
        await pay(result.data.orderId);
      } else {
        await api.order.paymentUMS({ orderId: result.data.orderId });
      }
      await app.init(true);
      Taro.hideLoading();
      to("/subPages/redeem/success/index", "redirectTo");
    }
  });

  /**
   * 更改领取方式
   */
  const changeExchangeType = useMemoizedFn(() => {
    dispatch({
      type: SET_COMMON,
      payload: {
        changeExchange: true,
      },
    });
    to(1);
  });

  return (
    <>
      <View
        className="w-screen min-h-screen bg-black flex flex-col items-center box-border pb-100"
        style={{ color: "#6c6c6c" }}
      >
        <CHeader
          title="兑礼结算"
          titleColor="#ffffff"
          backgroundColor="#000000"
          fill
        ></CHeader>

        {/* 领取方式 */}
        <View className="w-690 text-28 bg-white px-30 py-40 box-border">
          <View className="text-35 text-left">领取方式</View>
          <View className="text-24 mb-40  text-left">
            *切换领取方式后礼品库存可能产生变化
          </View>
          <View className=" text-left">
            {applyType === "express" ? "邮寄到家" : "到柜领取"}
          </View>
          <View className="w-full flex justify-between">
            <Text>
              {applyType === "express" ? "客人收件信息" : counter?.name}
            </Text>
            <Text className="underline" onClick={changeExchangeType}>
              切换领取方式
            </Text>
          </View>
          {applyType === "express" && (
            <ExchangeExpress inputFormFn={setAddressInfo}></ExchangeExpress>
          )}
        </View>

        {/* 兑换礼品详情 */}
        <View className="w-690 bg-white px-30 pt-40 pb-100 box-border mt-28 text-black">
          <View className="box_title mb-50 font-bold">兑换礼品详情</View>
          <View className="module">
            {goods?.length > 0 &&
              goods?.map((item) => {
                return <OrderGood good={item} key={item.id}></OrderGood>;
              })}
          </View>

          {/* 邮费支付方式 */}
          {applyType === "express" && (
            <PostageType
              postageType={postageType}
              setPostageType={setPostageType}
            ></PostageType>
          )}

          <View className="w-full h-1 bg-black mt-50"></View>
          <View className="text-38 flex justify-between mt-50">
            <View className="">总计消耗</View>
            <View>
              {postageType === "points" && applyType === "express"
                ? totalPoints + config.postagePoints
                : totalPoints}
              积分
            </View>
          </View>
          <View
            className="w-220 h-50 vhCenter bg-black text-white text-26 m-auto mt-100"
            onClick={handleReceive}
          >
            确定提交
          </View>
        </View>
      </View>

      {/* 弹窗 */}
      {showDialog && (
        <CDialog
          className="w-390 bg-white py-40 px-30"
          title="确认兑换"
          dialogText="订单提交后无法修改,请确认是否提交订单"
          cancel={setFalse}
          confirm={confirm}
        ></CDialog>
      )}
    </>
  );
};
export default OrderConfirm;
definePageConfig({
  navigationStyle: "custom",
});
