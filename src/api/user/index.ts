import config from "../../config/index";
import http from "../axios";

const getCustomerBasicInfo = () =>
  http.get(`/ec-portal/store/${config.storeCode}/customer/basic_info`);

const appendCustomerBasicInfo = (data) =>
  http.post(
    `/ec-portal/store/${config.storeCode}/customer/basic_info/append`,
    data,
  );

const createMember = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/wechat/createMember`, data);

const updateMember = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/wechat/updateMember`, data);

const appendMember = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/wechat/appendMember`, data);

const decodeUserInfo = (data) =>
  http.post(`/sp-portal/store/${config.storeCode}/wechat/decodeUserInfo`, data);

const decodePhoneNumber = (data, path) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/wechat/decodeWeChatPhone/${path.isCreateUser}`,
    data,
  );

const getCustomerCouponByStatus = (path) =>
  http.get(
    `/ec-portal/store/${config.storeCode}/customer/coupon/${path.status}`,
  );

const getValidCoupon = (query) =>
  http.get(`/sp-portal/store/${config.storeCode}/receiveCoupon/validCoupon`, {
    params: query,
  });

const getCouponInfoById = (couponId) =>
  http.get(
    `/ec-portal/store/${config.storeCode}/customer/coupon/detail/${couponId}`,
  );

const isCanReceiveCoupon = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/receiveCoupon/vaildPackage`,
    data,
  );

const canReceiveCoupon = (id: string) =>
  http.get(
    `/sp-portal/store/${config.storeCode}/receiveCoupon/validCoupon/${id}`,
  );

const receiveCoupon = (path, query) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/receiveCoupon/${path.id}`,
    null,
    { params: query },
  );

const getMemberInfo = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/dataLake/member/aggregation`,
    data,
  );

const getMemberCoupon = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/dataLake/member/coupon`,
    data,
  );

const getMemberCouponByGrade = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/dataLake/member/grade/coupon`,
    data,
  );

const upDateUserInfo = (data) =>
  http.put(`/sp-portal/store/${config.storeCode}/wechat/updateUserInfo`, data);

const loadSYMember = () =>
  http.get(`/sp-portal/store/${config.storeCode}/shuYunMember/queryMember`);

const loadSYPointDetails = (data) =>
  http.post(
    `/sp-portal/store/${config.storeCode}/shuYunMember/memberPointChangeDetails`,
    data,
  );

const getShopId = (id) =>
  http.get(`/sp-portal/store/${config.storeCode}/counter/${id}`);

export default {
  /** 查询会员用户基本信息 */
  getCustomerBasicInfo,
  /** 追加客户基本身份信息 */
  appendCustomerBasicInfo,
  /** 潜客成为会员(会员绑定) */
  createMember,
  /** 更新会员 */
  updateMember,
  /** 解密数据获取用户信息 */
  decodeUserInfo,
  /** 解密数据获取用户手机信息 */
  decodePhoneNumber,
  /** 查询用户优惠券(不同状态) */
  getCustomerCouponByStatus,
  /** 根据卡券Id获取卡券信息 */
  getCouponInfoById,
  /** 获取可领取卡券 */
  getValidCoupon,
  /** 是否能领券 */
  isCanReceiveCoupon,
  /** 是否可以领券 */
  canReceiveCoupon,
  /** 领取卡券 */
  receiveCoupon,
  /** 会员聚合信息查询 */
  getMemberInfo,
  /** 查询会员卡券 */
  getMemberCoupon,
  /** 根据会员等级查询会员卡券查询 */
  getMemberCouponByGrade,
  /** 更新用户信息 */
  upDateUserInfo,
  /** 数云会员信息查询 */
  loadSYMember,
  /** 数云积分明细查询 */
  loadSYPointDetails,
  getShopId,
  appendMember,
};
