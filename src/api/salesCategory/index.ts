import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/sales_category`;

/** 获取所有商品（去凑单） */
const getGoodList = (params) => {
  return http.get(`${commonUrl}/page`, { params });
};

export default { getGoodList };
