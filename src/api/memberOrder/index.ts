import config from "@/config/index";

import http from "../axios";

/** 更新配送信息 */
const updateDeliver: Api.Order.UpdateDeliver.FuncT = (path) =>
  http.post(
    `/ec-portal/store/${config.storeCode}/member_order/${path.orderId}/deliver`,
  );

/** 获取订单物流信息 */
const getOrderLogistics: Api.Order.GetOrderLogistics.FuncT = (path) =>
  http.get(
    `/ec-portal/store/${config.storeCode}/member_order/${path.orderId}/logistics`,
  );

/** 取消订单 */
const cancelOrder: Api.Order.CancelOrder.FuncT = (path, data = {}) =>
  http.post<null>(
    `/ec-portal/store/${config.storeCode}/member_order/${path.orderId}/cancel`,
    data,
  );

/** 查询订单详情 */
const getOrderDetail: Api.Order.GetOrderDetail.FuncT = (path) =>
  http.get(
    `/ec-portal/store/${config.storeCode}/member_order/${path.orderId}/detail`,
  );

/** 根据订单状态获取订单列表 */
const getOrderByStatus: Api.Order.GetOrderByStatus.FuncT = (query, path) =>
  http.get(`/ec-portal/store/${config.storeCode}/member_order/${path.status}`, {
    params: query,
  });

export default {
  updateDeliver,
  getOrderLogistics,
  cancelOrder,
  getOrderDetail,
  getOrderByStatus,
};
