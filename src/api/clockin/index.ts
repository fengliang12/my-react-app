import config from "../../config/index";
import http from "../axios";

// 是否已经打卡过活动
const joinClockInFlag: Api.ClockIn.JoinClockInFlag.FuncT = () =>
  http.post(`/sp-portal/store/${config.storeCode}/clockin/joinFlag`);

//生成活动二维码
const createClockInQrCode = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/clockin/code/10700001`, data);

//打卡
const submitClockInQrCode: Api.ClockIn.SubmitClockInQrCode.FuncT = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/clockin/submit`, data);

//获取活动详情
const getClockInActivityDetail: Api.ClockIn.GetClockInActivityDetail.FuncT = (
  id,
) => http.get(`/sp-portal/store/${config.storeCode}/clockin/activity/${id}`);

export default {
  /**是否已经打卡过活动 */
  joinClockInFlag,
  /**生成活动二维码 */
  createClockInQrCode,
  /**打卡 */
  submitClockInQrCode,
  /** 获取活动详情 */
  getClockInActivityDetail,
};
