import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/birthdayGift`;

/** 获取生日礼优惠券视图 */
const locate: any = (data) =>
  http.post<any>(`${commonUrl}/locate?couponId=${data.couponId}`);

/** 提交订单*/
const submit: any = (data) => http.post<any>(`${commonUrl}/submit`, data);

export default { locate, submit };
