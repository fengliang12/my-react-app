import config from "../../config/index";
import http from "../axios";

const { storeCode } = config;

const login = (code, params) =>
  http.get(`/sp-portal/store/${storeCode}/wechat/login/${code}`, { params });

const loginQY = (code) =>
  http.get(
    `/member-auth/shiseido/${storeCode}/mini/work/code4token?code=${code}`,
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

//更新用户的所属门店
const update = (data) =>
  http.post(
    `/nars-portal/store/${config.storeCode}/shuYunMember/update?counterId=${data.counterId}`,
  );

/** 获取中台地址 */
const getZTArea = () =>
  http.get("https://res-wxec-unipt.lorealchina.com/integral/area.json", {
    noToken: true,
  });

//获取省市区
const addressTree = () => http.get(`/sp-portal/store/address/mini/tree`);

//获取省市区
const address = () => http.get(`/sp-portal/store/address/mini/null`);

const mapJSON: any = (params) => {
  return http.get("https://apis.map.qq.com/ws/geocoder/v1", { params });
};

/** 根据类型查询活动弹窗popUp配置 */
const findPopupListByType: Api.Common.FindPopupList.FuncT = (typeList) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/activity/findPopupList`,
    typeList,
  );

/**
 * 确认弹窗
 * /api/sp-portal/store/{storeCode}/activity/confirm/one
 */
const popupConfirm: Api.Common.PopupConfirmSpace.FuncT = ({
  activityCode,
  gradeName,
  popupType,
}) => {
  return http.post(
    `/sp-portal/store/${config.storeCode}/activity/confirm/one`,
    {
      activityCode,
      gradeName,
      popupType,
    },
  );
};

/**
 * 确认弹窗
 * /api/${msf.application.name}/store/{storeCode}/activity/dayCheck/confirm/{activityCode}
 */
const dayConfirm: Api.Common.PopupConfirmSpace.FuncT = ({ activityCode }) => {
  return http.post(
    `/sp-portal/store/${config.storeCode}/activity/dayCheck/confirm/${activityCode}`,
  );
};

/**
 * 确认弹窗
 * /api/${msf.application.name}/store/{storeCode}/activity/checkAlert/confirm/{activityCode}
 */
const checkAlert: Api.Common.PopupConfirmSpace.FuncT = ({ activityCode }) => {
  return http.post(
    `/sp-portal/store/${config.storeCode}/activity/checkAlert/confirm/${activityCode}`,
  );
};

/** 本地埋点 */
const addBehavior: Api.Common.AddBehavior.FuncT = (data) =>
  http.post(`/sp-portal/store/${storeCode}/memberTrackBehavior/behavior`, data);

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
  // 根据类型查询活动弹窗popUp配置
  findPopupListByType,
  addressTree,
  address,
  update,
  addBehavior,
  popupConfirm,
  dayConfirm,
  checkAlert,
};
