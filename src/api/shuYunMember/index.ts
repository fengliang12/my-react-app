import config from "../../config/index";
import http from "../axios";

const commonUrl = `/nars-portal/store/${config.storeCode}/shuYunMember`;

// 距离下一等级金额
const nextGradeAmount = () => http.get(`${commonUrl}/nextGradeAmount`);

export default {
  /** 距离下一等级金额 */
  nextGradeAmount,
};
