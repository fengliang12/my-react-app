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
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/order`,
    { params },
  );

/**
 * 核销发送验证码
 * @param path
 * @returns
 */
const sendSmsCode = (params) =>
  http.post(
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/sendSmsCode`,
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
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/order/code/writeOff`,
    data,
  );

/**
 * 订单面板
 * @returns
 */
const dashboard: Api.QYWX.Dashboard.FuncT = (data) =>
  http.post(
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/order/dashboard`,
    data,
  );

/**
 * 门店库存查询
 * @returns
 */
const counterStock: Api.QYWX.Stock.FuncT = (params) =>
  http.get(
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/counter/stock`,
    { params },
  );

/**
 * 门店库存查询
 * @returns
 */
const singleCounterStock: Api.QYWX.SingleCounterStock.FuncT = (params) =>
  http.get(
    `${config.qyBasePathUrl2}/sp-manage/store/${config.storeCode}/wecom/goods/stock`,
    { params },
  );

/**
 * 获取组织门店
 * @returns
 */
const getRegionStore = () =>
  http.get(`/nars-exchange/shiseido/${config.storeCode}/mini/store/info`);

/**
 * 获取ba列表
 * @param param0
 * @returns
 */
const getBaList = ({ storeId }) =>
  http.get(
    `/nars-exchange/shiseido/${config.storeCode}/mini/store/ba/list/${storeId}`,
  );

/**
 * 根据输入的企业微信用户id获取用户信息。
 * /api/work-auth/{tenantId}/{buCode}/mini/operation/pts/code4token
 * https://wecom-uat.narscosmetics.com.cn/api/member-auth/shiseido/nars/mini/work/mini/code4token?userId=Q4600161
 * @param param0
 * @returns
 */
const getTestToken = ({ userId }) =>
  http.get(
    `/member-auth/shiseido/${config.storeCode}/mini/work/mini/code4token?userId=${userId}`,
  );

export default {
  baDetail,
  dashboard,
  orderSubmit,
  counterStock,
  orderList,
  sendSmsCode,
  singleCounterStock,
  getRegionStore,
  getBaList,
  getTestToken,
};
