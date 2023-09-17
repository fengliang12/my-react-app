import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/buy_now`;

/** 提交立即购买*/
const submit: Api.BuyNow.Submit.FuncT = (data) =>
  http.post(`${commonUrl}/submit`, data);

export default {
  submit,
};
