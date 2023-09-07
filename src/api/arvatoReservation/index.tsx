import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/nars-portal/store/${storeCode}/arvatoReservation`;

/** 获取可预约门店列表 */
const getCounters: Api.User.GetCustomerCouponByStatus.FuncT = (projectCode) => {
  return http.get(`${commonUrl}/counters/${projectCode}`);
};

/** 获取可预约门店列表 */
const modify: Api.User.GetCustomerCouponByStatus.FuncT = (data) => {
  return http.post(`${commonUrl}/modify`, data);
};

/** 获取可预约时间段列表 */
const getPeriods: Api.User.GetCustomerCouponByStatus.FuncT = (storeId) => {
  return http.get(`${commonUrl}/periods/${storeId}`);
};

/** 查询服务预约项目列表 */
const getProjects: any = () => {
  return http.get(`${commonUrl}/projects`);
};

/** 查询服务预约项目列表 */
const getRecords: Api.User.GetCustomerCouponByStatus.FuncT = (data) => {
  return http.post(`${commonUrl}/records`, data);
};

/** 查询服务预约项目列表 */
const submit: Api.User.GetCustomerCouponByStatus.FuncT = (data) => {
  return http.get(`${commonUrl}/submit`, data);
};

export default {
  getCounters,
  modify,
  getPeriods,
  getProjects,
  getRecords,
  submit,
};
