import config from "@/config/index";

import http from "../axios";

/**
 * 获取ba详情
 * @param data
 * https://wecom-uat.narscosmetics.com.cn/api/member-auth/shiseido/nars/mini/work/login
 * @returns
 */
const baDetail: any = () =>
  http.get(`/member-auth/shiseido/${config.storeCode}/mini/work/login`);

/**
 * 订单列表接口
 * @returns
 */
const orderList: Api.QYWX.OrderList.FuncT = (params) =>
  http.get(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/order`,
    { params },
  );

/**
 * 核销发送验证码
 * @param path
 * @returns
 */
const sendSmsCode = (params) =>
  http.post(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/sendSmsCode`,
    {},
    {
      params,
    },
  );

/**
 * 积分线下订单核销接口
 * @returns
 */
const orderSubmit: Api.QYWX.OrderSubmit.FuncT = (data) =>
  http.post(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/order/code/writeOff`,
    data,
  );

/**
 * 订单面板
 * @returns
 */
const dashboard: any = (params: any) =>
  http.get(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/order/dashboard`,
    params,
  );

/**
 * 门店库存查询
 * @returns
 */
const counterStock: Api.QYWX.Stock.FuncT = (params) =>
  http.get(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/counter/stock`,
    { params },
  );

/**
 * 门店库存查询
 * @returns
 */
const singleCounterStock: Api.QYWX.SingleCounterStock.FuncT = (params) =>
  http.get(
    `https://member-front-uat.narscosmetics.com.cn/api/sp-manage/store/${config.storeCode}/wecom/goods/stock`,
    { params },
  );

export default {
  baDetail,
  dashboard,
  orderSubmit,
  counterStock,
  orderList,
  sendSmsCode,
  singleCounterStock,
};
