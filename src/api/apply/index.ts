import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/sample/apply`;

/** 小样申领查询详情*/
const activityDetail: Api.Apply.GetActivityDetail.FuncT = (id) =>
  http.get(`${commonUrl}/activity/item/${id}`);

/** 查看购物车 */
const reserve: Api.Apply.SubmitCounterActivity.FuncT = (
  data,
  showError = true,
) => http.post(`${commonUrl}/activity/reserve`, data, { showError });

/** ocpa腾讯 */
const addUserActions: Api.Apply.AddUserActionsNew.FuncT = (data) =>
  http.post(`/sp-portal/store/${storeCode}/ocpa/addUserActions`, data);

/** ocpa腾讯--新 */
const addUserActionsNew: Api.Apply.AddUserActionsNew.FuncT = (data) =>
  http.post(`/sp-portal/store/${storeCode}/ocpa/addUserActionsNew`, data);

/**
 * 申领结束后进行打标签
 * @param params
 */
const takeTag: Api.Apply.TakeTag.FuncT = (params) => {
  return http.get(`/sp-portal/store/${storeCode}/util/test`, { params });
};

export default {
  activityDetail,
  reserve,
  addUserActions,
  takeTag,
  addUserActionsNew,
};
