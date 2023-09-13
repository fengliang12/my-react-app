import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/counter`;

/** 获取柜台 */
const getCounterList: Api.Counter.GetCounterList.FuncT = () => {
  return http.get(`${commonUrl}/list`);
};

/** 获取柜台列表 */
const getCounterCity: Api.Counter.GetCityList.FuncT = () => {
  return http.get(`${commonUrl}/list/city`);
};

/** 获取柜台列表 */
const getNearCounterList: Api.Counter.GetCounterNearList.FuncT = (params) => {
  return http.get(`${commonUrl}/near/list`, { params });
};

/** 所有柜台的城市列表 */
const getCounterByCity: Api.Apply.GetCounterByCity.FuncT = (data) =>
  http.get<any>(`${commonUrl}/city/list`, {
    params: data,
  });

/** 获取所有柜台的城市列表 */
const getCounterTreeCity: Api.Apply.GetCounterByCity.FuncT = (data) =>
  http.post<any>(`${commonUrl}/tree/city`, data);

export default {
  getCounterList,
  getCounterByCity,
  getNearCounterList,
  getCounterTreeCity,
  getCounterCity,
};
