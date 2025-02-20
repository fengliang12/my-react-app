import config from "@/config/index";

import http from "../axios";

/**
 * 配送方式
 * @param data
 * @returns
 */
const baDetail: any = () =>
  http.get(
    `/work-employee/shiseido/${config.storeCode}/mini/main/current/detail`,
  );

export default {
  baDetail,
};
