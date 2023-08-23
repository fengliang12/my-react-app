import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/buy_bonusPoint`;

/** 查询用户优惠券(不同状态) */
const getBonusPointList: any = (params) =>
  http.get<any>(`${commonUrl}/listView`, { params });

/** 积分兑换记录*/
const getPointsRecord: any = () =>
  http.get<any>(`${commonUrl}/listDetails?page=0&size=1000`);

export default { getBonusPointList, getPointsRecord };
