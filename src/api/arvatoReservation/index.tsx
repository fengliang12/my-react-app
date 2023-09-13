import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/nars-portal/store/${storeCode}/arvatoReservation`;

/** 获取可预约门店列表 */
const getCounters: Api.ArvatoReservation.GetCounters.FuncT = (projectCode) => {
  return http.get(`${commonUrl}/counters/${projectCode}`);
};

/** 修改预约 */
const modify: Api.ArvatoReservation.Modify.FuncT = (data) => {
  return http.post(`${commonUrl}/modify`, data);
};

/** 获取可预约时间段列表 */
const getPeriods: Api.ArvatoReservation.GetPeriods.FuncT = (storeId) => {
  return http.get(`${commonUrl}/periods/${storeId}`);
};

/** 查询服务预约项目列表 */
const getProjects: Api.ArvatoReservation.GetProjects.FuncT = () => {
  return http.get(`${commonUrl}/projects`);
};

/** 预约记录列表 */
const getRecords: Api.ArvatoReservation.GetRecords.FuncT = (params) => {
  return http.post(
    `${commonUrl}/records`,
    {},
    {
      params,
    },
  );
};

/** 提交预约 */
const submit: Api.ArvatoReservation.Submit.FuncT = (data) => {
  return http.post(`${commonUrl}/submit`, data);
};

export default {
  getCounters,
  modify,
  getPeriods,
  getProjects,
  getRecords,
  submit,
};
