import config from "@/config/index";

import http from "../axios";

/**
 * 配送方式
 * @param data
 * @returns
 */
const deliver: any = (orderId, data) =>
  http.post(
    `/ec-portal/store/${config.storeCode}/member_order/${orderId}/deliver`,
    data,
  );

/** 聚合支付 */
const paymentUMS: Api.Order.PaymentUMS.FuncT = (data) =>
  http.post<Api.Order.PaymentUMS.IResponse>(
    `/sp-portal/store/${config.storeCode}/payment/requestConfirm/ums`,
    data,
  );

export default {
  paymentUMS,
  deliver,
};
