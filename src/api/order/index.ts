import config from "@/config/index";

import http from "../axios";

/** 聚合支付 */
const paymentUMS: Api.Order.PaymentUMS.FuncT = (data) =>
  http.post<Api.Order.PaymentUMS.IResponse>(
    `/sp-portal/store/${config.storeCode}/payment/requestConfirm/ums`,
    data,
  );

export default {
  paymentUMS,
};
