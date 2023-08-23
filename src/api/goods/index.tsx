import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/goods`;

/** 查询用户优惠券(不同状态) */
const getGoodList: Api.User.GetCustomerCouponByStatus.FuncT = (data) => {
  return http.post(`${commonUrl}/list`, data);
};

export default { getGoodList };
