import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";

import api from "@/api/index";

export default function usePayHooks() {
  const pay = useMemoizedFn((orderId) => {
    return new Promise((resolve) => {
      Taro.showLoading({
        title: "加载中",
        mask: true,
      });
      api.order
        .paymentUMS({
          orderId: orderId,
        })
        .then((result) => {
          console.log("订单order：", result);
          if (!result || !result.data) {
            Taro.showToast({
              title: "微信支付异常,请重试",
              icon: "none",
              duration: 2000,
            });
            setTimeout(() => {
              resolve(false);
            }, 2000);
            return;
          }
          Taro.hideLoading();
          const { data } = result;
          // @ts-ignore
          Taro.requestOrderPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType as "MD5" | "HMAC-SHA256",
            paySign: data.paySign,
            orderInfo: data.weChatOrder, // 需要新增的 订单 信息
            async success(res) {
              console.log("支付成功sss----:", res);
              // try {
              //   await api.common.queryOrderIsPay({ orderId: orderId });
              // } catch (err) {
              //   console.log(err);
              // }
              resolve(true);
            },
            fail(res) {
              console.log("支付失败sss----:", res);
              resolve(false);
            },
          });
        })
        .catch(async (err) => {
          console.log(err);
          await Taro.showModal({
            content: "支付失败，请升级微信版本后再尝试",
            confirmText: "确认",
            showCancel: false,
          });
          setTimeout(() => {
            resolve(false);
          }, 2000);
        });
    });
  });

  return {
    pay,
  };
}
