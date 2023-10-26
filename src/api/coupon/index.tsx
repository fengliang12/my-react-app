import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const posCoupon = () => {
  return http.get(`/nars-portal/store/${storeCode}/posCoupon/list`);
};

const posCouponDetail = (data) => {
  return http.post(`/nars-portal/store/${storeCode}/posCoupon/detail`, data);
};

/**
 * 已过期
 * @param data
 * @returns
 */
const expire = () => {
  return http.get(`/ec-portal/store/${storeCode}/customer/coupon/expire`);
};

/**
 * 查询已用优惠券
 * @param data
 * @returns
 */
const redeem = (params) => {
  return http.get(`/ec-portal/store/${storeCode}/customer/coupon/redeem`, {
    params,
  });
};

/**
 * 查询可用优惠券
 * @param data
 * @returns
 */
const usable = (params) => {
  return http.get(`/ec-portal/store/${storeCode}/customer/coupon/usable`, {
    params,
  });
};
export default { posCoupon, posCouponDetail, expire, redeem, usable };
