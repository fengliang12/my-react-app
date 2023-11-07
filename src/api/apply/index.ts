import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/sp-portal/store/${storeCode}/sample/apply`;

/** 小样申领查询详情*/
const activityDetail: Api.Apply.GetActivityDetail.FuncT = (id) =>
  http.get(`${commonUrl}/activity/item/${id}`);

/** 查看购物车 */
const reserve: Api.Apply.SubmitCounterActivity.FuncT = (data) =>
  http.post(`${commonUrl}/activity/reserve`, data);

/** ocpa腾讯 */
const addUserActionsNew: Api.Apply.AddUserActionsNew.FuncT = (data) =>
  http.post(`/sp-portal/store/${storeCode}/ocpa/addUserActionsNew`, data);

export default {
  activityDetail,
  reserve,
  addUserActionsNew,
};
