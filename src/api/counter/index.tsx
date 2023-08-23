import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/counter`;

/** 查询用户优惠券(不同状态) */
const getCounterList: Api.Counter.GetCounterList.FuncT = () => {
  return http.get(`${commonUrl}/list`);
};

export default { getCounterList };
