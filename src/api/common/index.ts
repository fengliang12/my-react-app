import config from "../../config/index";
import http from "../axios";

const { storeCode } = config;

const login = (code) =>
  http.get(`/sp-portal/store/${storeCode}/wechat/login/${code}`);

const loginQY = (code) =>
  http.get(
    `/counter-portal/store/${storeCode}/enterpriseWeChat/login/credential/${code}`,
  );

const sendSMS = (path) =>
  http.post(`/sp-portal/store/${storeCode}/wechat/sendSmsCode2`, path.mobile);

const findKvDataByType = (path) =>
  http.post(
    `/sp-portal/store/${storeCode}/config/kvdata/findType/${path.type}`,
  );

const upLoadFile = (data) =>
  http.upload(`/sp-portal/store/${storeCode}/upload_file`, {
    filePath: data.filePath,
  });

const multiSubscribeByCode = (param) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/subscribeRecord/multi`,
    param,
  );

const findSubscribeByCode = (codes) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/subscribeTemplate/list`,
    codes,
  );

/** 获取中台地址 */
const getZTArea = () =>
  http.get("https://res-wxec-unipt.lorealchina.com/integral/area.json", {
    noToken: true,
  });

const mapJSON: any = (params) => {
  return http.get("https://apis.map.qq.com/ws/geocoder/v1", { params });
};

export default {
  /** 授权获取用户信息和token */
  login,
  /** 授权获取用户信息和token-企业微信 */
  loginQY,
  /** 发送短信接口 */
  sendSMS,
  /** 查询配置信息 */
  findKvDataByType,
  /** 文件上传地址(CDN)  */
  upLoadFile,
  /**获取中台地址 */
  getZTArea,
  multiSubscribeByCode,
  findSubscribeByCode,
  mapJSON,
};
