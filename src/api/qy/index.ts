import config from "@/config/index";

import http from "../axios";

/**
 * 配送方式
 * @param data
 * @returns
 */
const baDetail: any = () =>
  http.get(
    `/work-employee/shiseido/${config.storeCode}/mini/main/current/detail`,
  );

/**
 * 订单列表接口
 * @returns
 */
const orderList: any = (params: any) =>
  http.get(`/sp-manage/store/${config.storeCode}/wecom/order`, params);

/**
 * 积分线下订单核销接口
 * @returns
 */
const orderSubmit: any = (data: any) =>
  http.post(`/sp-manage/store/${config.storeCode}/wecom/order`, data);

/**
 * 订单面板
 * @returns
 */
const dashboard: any = (params: any) =>
  http.get(
    `/sp-manage/store/${config.storeCode}/wecom/order/dashboard`,
    params,
  );

/**
 * 门店库存查询
 * @returns
 */
const stock: any = (params: any) =>
  http.get(`/sp-manage/store/${config.storeCode}/wecom/counter/stock`, params);

export default {
  baDetail,
  orderSubmit,
  dashboard,
  stock,
};
