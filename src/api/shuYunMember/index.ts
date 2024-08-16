import config from "../../config/index";
import http from "../axios";

const commonUrl = `/nars-portal/store/${config.storeCode}/shuYunMember`;

// 距离下一等级金额
const nextGradeAmount = () => http.get(`${commonUrl}/nextGradeAmount`);

// 会员等级查询-手机号
const queryGrade = () => http.get(`${commonUrl}/queryGrade`);

// 会员积分变更历史查询-分页
const queryPointsLog = (data) => http.post(`${commonUrl}/queryPointsLog`, data);

// 会员信息查询
const queryMember = () => http.get(`${commonUrl}/queryMember`);

//消费记录
const orderPage = (data) => http.post(`${commonUrl}/orderPage`, data);

// 柜台信息查询
const queryCabinet = (shopId) =>
  http.get(`/sp-portal/store/${config.storeCode}/counter/${shopId}`);

export default {
  /** 距离下一等级金额 */
  nextGradeAmount,
  // 会员等级查询
  queryGrade,
  // 会员积分变更历史查询
  queryPointsLog,
  // 会员信息查询
  queryMember,
  orderPage,
  queryCabinet,
};
