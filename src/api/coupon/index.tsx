import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const posCoupon = () => {
  return http.get(`/nars-portal/store/${storeCode}/posCoupon/list`);
};

export default { posCoupon };
