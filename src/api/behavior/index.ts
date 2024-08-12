import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/tracking`;
// const commonUrl = `/ec-portal/store/${storeCode}/buy_now`;

/** 提交立即购买*/
const behavior: Api.Behavior.FuncT = (data) =>
  http.post(`${commonUrl}/behavior`, data);

export default {
  behavior,
};
