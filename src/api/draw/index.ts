import config from "../../config/index";
import http from "../axios";

// 根据code获取抽奖活动详情
const getDrawDetail = (params) =>
  http.get(`/sp-portal/store/${config.storeCode}/activity/luckdraw/code`, {
    params,
  });

//查询中奖记录
const queryDrawRecords = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/activity/luckdraw/query/luckDraw/record`,
    data,
  );

// 开始抽奖
const startDraw = (params) =>
  http.get(`/sp-portal/store/${config.storeCode}/activity/luckdraw/start`, {
    params,
  });

//剩余抽奖次数计算
const surplusDrawTimes = (params) =>
  http.get(
    `/sp-portal/store/${config.storeCode}/activity/luckdraw/surplus/times`,
    { params },
  );

export default {
  /**根据code获取抽奖活动详情 */
  getDrawDetail,
  /**查询中奖记录 */
  queryDrawRecords,
  /** 开始抽奖 */
  startDraw,
  /**剩余抽奖次数计算 */
  surplusDrawTimes,
};
