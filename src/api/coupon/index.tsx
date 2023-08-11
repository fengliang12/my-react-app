import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/customer/coupon`;

/** 查询用户优惠券(不同状态) */
const getCustomerCouponByStatus: Api.User.GetCustomerCouponByStatus.FuncT = (
  path,
) => {
  let status =
    path.status === "usable" ? "usable?needSendCoupon=true" : path.status;
  return http.get(`${commonUrl}/${status}`);
};

export default { getCustomerCouponByStatus };
