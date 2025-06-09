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
  http.get(`/nars-exchange/shiseido/${config.storeCode}/mini/wemall/order`, {
    params,
  });

/**
 * 核销发送验证码
 * @param path
 * @returns
 */
const sendSmsCode = (params: { [key: string]: any }) =>
  http.post(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/sendSmsCode`,
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
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/order/code/writeOff`,
    data,
  );

/**
 * 订单面板
 * @returns
 */
const dashboard: Api.QYWX.Dashboard.FuncT = (data) =>
  http.post(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/order/dashboard`,
    data,
  );

/**
 * 门店库存查询
 * @returns
 */
const counterStock: Api.QYWX.Stock.FuncT = (params) =>
  http.get(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/counter/stock`,
    {
      params,
    },
  );

/**
 * 门店库存查询
 * @returns
 */
const singleCounterStock: Api.QYWX.SingleCounterStock.FuncT = (params) =>
  http.get(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/goods/stock`,
    {
      params,
    },
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
const getBaList = ({ storeId }: { storeId: string }) =>
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
const getTestToken = ({ userId }: { userId: string }) =>
  http.get(
    `/member-auth/shiseido/${config.storeCode}/mini/work/mini/code4token?userId=${userId}`,
  );

/**
 * 点击客服按钮调用
 * POST 'https://wecom-uat.narscosmetics.com.cn/api/nars-exchange/shiseido/nars/mini/wemall/behavior/submit/icon'
 */
const submitClick: Api.QYWX.SubmitClick.FuncT = (data) =>
  http.post(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/behavior/submit/${data?.id}`,
  );

/**
 * 检查是否上限
 * POST 'https://wecom-uat.narscosmetics.com.cn/api/nars-exchange/shiseido/nars/mini/wemall/behavior/check/icon'
 */
const checkClick: Api.QYWX.CheckClick.FuncT = (data) =>
  http.post(
    `/nars-exchange/shiseido/${config.storeCode}/mini/wemall/behavior/check/${data?.id}`,
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
  submitClick,
  checkClick,
};
