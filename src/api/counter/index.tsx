import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/counter`;

/** 获取柜台 */
const getCounterList: Api.Counter.GetCounterList.FuncT = () => {
  return http.get(`${commonUrl}/list`);
};

/** 获取柜台 */
const getCounterByCity: Api.Apply.GetCounterByCity.FuncT = (data) =>
  http.get<any>(`${commonUrl}/city/list`, {
    params: data,
  });

export default { getCounterList, getCounterByCity };
