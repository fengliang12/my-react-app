import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const posCoupon = () => {
  return http.get(`/nars-portal/store/${storeCode}/posCoupon/list`);
};

const posCouponDetail = (data) => {
  return http.post(`/nars-portal/store/${storeCode}/posCoupon/detail`, data);
};

export default { posCoupon, posCouponDetail };
