import Taro, { useRouter } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import api from "../api";
import to from "../utils/to";
import toast from "../utils/toast";
import usePayHooks from "./payHooks";
import useSubMsg from "./useSubMsg";

const app: App.GlobalData = Taro.getApp();

const useRedeem = () => {
  const subMsg = useSubMsg();
  const { postageType } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );
  const { pay } = usePayHooks();
  const points = useSelector((state: Store.States) => state.user.points);
  const { applyType, counter, goods, channelType } = useSelector(
    (state: Store.States) => state.exchangeGood,
  );

  /** 积分 */
  const totalPoints = useMemo(() => {
    return goods.reduce((a, b) => a + (b.points || b.point) * b.quantity, 0);
  }, [goods]);

  /**
   * 确认兑礼订单
   */
  const confirm = useMemoizedFn(async (addressInfo?: any) => {
    if (points < totalPoints) return toast("您的积分不足");
    await subMsg("REDEEM");
    Taro.showLoading({ title: "加载中", mask: true });
    let params = {
      channelId: "wa",
      deliverInfo: addressInfo,
      integral: true,
      customPointsPayPlan: {
        notValidateUsablePoints: true,
        usePoints: true,
      },
    };

    let result: any = null;
    if (channelType === "cart") {
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
      payFunc(result.data.orderId);
    }
  });

  /**
   * 调用支付接口
   */
  const payFunc = useMemoizedFn(async (orderId: string) => {
    if (postageType === "money" && applyType === "express") {
      /** 邮寄到家&9.9元支付 */
      await pay(orderId);
    } else {
      await api.order.paymentUMS({ orderId });
    }
    Taro.showToast({ title: "兑礼成功", icon: "success" });
    setTimeout(async () => {
      await app.init(true);
      Taro.hideLoading();
      to(`/subPages/redeem/orderDetail/index?orderId=${orderId}`, "redirectTo");
    }, 2000);
  });

  return {
    applyType,
    goods,
    counter,
    postageType,
    totalPoints,
    confirm,
    payFunc,
  };
};
export default useRedeem;
