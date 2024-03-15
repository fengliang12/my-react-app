import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/nars-portal/store/${storeCode}/adhocReservation`;

/** 查询服务预约项目列表 */
const getProjects: Api.AdhocReservation.GetProjects.FuncT = () => {
  return http.get(`${commonUrl}/projects`);
};

/** 获取可预约门店列表 */
const getCounters: Api.AdhocReservation.GetCounters.FuncT = () => {
  return http.get(`${commonUrl}/counters`);
};

/** 获取可预约日期列表 */
const getDates: Api.AdhocReservation.GetDates.FuncT = (params) => {
  return http.get(`${commonUrl}/dateList`, { params });
};

/** 获取可预约时间段列表 */
const getPeriods: Api.AdhocReservation.GetPeriods.FuncT = (params) => {
  return http.get(`${commonUrl}/periods`, { params });
};

/** 预约记录列表 */
const getRecords: Api.AdhocReservation.GetRecords.FuncT = () => {
  return http.post(`${commonUrl}/records`);
};

/** 提交预约 */
const submit: Api.AdhocReservation.Submit.FuncT = (data) => {
  return http.post(`${commonUrl}/submit`, data);
};

/** 修改预约 */
const modify: Api.AdhocReservation.Modify.FuncT = (data) => {
  return http.post(`${commonUrl}/modify`, data);
};

/** 取消预约 */
const cancel: Api.AdhocReservation.Cancel.FuncT = (params) => {
  return http.post(`${commonUrl}/cancel`, {}, { params });
};

// 可预约次数
const getNum: Api.AdhocReservation.GetNum.FuncT = (params) => {
  return http.get(`${commonUrl}/num`, { params });
};

export default {
  getCounters,
  modify,
  getPeriods,
  getProjects,
  getRecords,
  submit,
  getDates,
  cancel,
  getNum,
};
