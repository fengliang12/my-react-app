import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import api from "../api";
import to from "../utils/to";
import toast from "../utils/toast";
import useSubMsg from "./useSubMsg";

const app: App.GlobalData = Taro.getApp();
let confirmStatus: boolean = false;

const useRedeem = () => {
  const subMsg = useSubMsg();

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
    if (confirmStatus) return;
    confirmStatus = true;
    await subMsg("REDEEM");

    setTimeout(() => {
      confirmStatus = false;
    }, 2000);

    Taro.showLoading({ title: "加载中", mask: true });

    /**
     * 说明：
     * 门店核销：counterId必传、deliverInfo不用、usePointsForShipment：false
     * 邮寄到家：deliverInfo必传、counterId不用
     *          积分抵扣：usePointsForShipment：true
     *          9.9邮费：usePointsForShipment：false
     */
    if (
      (applyType === "self_pick_up" && !counter) ||
      (applyType === "express" && !addressInfo)
    ) {
      toast(`${applyType === "self_pick_up" ? "门店" : "地址"}不能为空`);
      return;
    }

    let params = {
      channelId: "wa",
      counterId: applyType === "self_pick_up" ? counter.id : undefined,
      deliverInfo: applyType === "express" ? addressInfo : undefined,
      integral: true,
      customPointsPayPlan: {
        notValidateUsablePoints: true,
        usePointsForShipment: applyType === "express" ? true : false,
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
    await api.order.paymentUMS({ orderId });

    Taro.showToast({ title: "兑礼成功", icon: "success" });
    setTimeout(async () => {
      await app.init(true);
      Taro.hideLoading();
      to(
        `/subPages/redeem/orderDetail/index?orderId=${orderId}&from=confirm`,
        "reLaunch",
      );
    }, 2000);
  });

  return {
    applyType,
    goods,
    counter,
    totalPoints,
    confirm,
    payFunc,
  };
};
export default useRedeem;
