import Taro from "@tarojs/taro";

import api from "../api";
import config from "../config";
import store from "../store";
import { SET_QY_USER, SET_USER } from "../store/constants";

export const createInit = () => {
  let initPromise: Promise<Store.User> | null = null;

  return (refresh, shuYunMember = true): Promise<Store.User> | null => {
    if (initPromise === null || refresh) {
      let loginFn: any = config.env === "qy" ? Taro["qy"].login : Taro.login;
      Taro.showLoading({ title: "加载中", mask: true });
      initPromise = loginFn()
        .then(({ code }) =>
          config.env === "qy"
            ? api.common.loginQY(code)
            : api.common.login(code, { checkMember: true }),
        )
        .then(async ({ data }) => {
          // 设置token
          setToken(data);
          if (config.env === "qy") {
            return await getQYUserInfo(data);
          } else if (config.env === "weapp") {
            return await getMemberInfo(data, shuYunMember);
          }
        })
        .catch(() => {
          initPromise = null;
        });
    }
    return initPromise;
  };
};

// 定义一个名为 setToken 的函数，用于设置存储在本地存储中的 token
const setToken = (data) => {
  Taro.setStorageSync(
    "token",
    config.env === "qy" ? `${data}` : data.jwtString,
  );
};

/**
 * 获取企业微信用户信息
 * @param data
 * @returns
 */
const getQYUserInfo = async (data) => {
  let res = await api.qy.baDetail();
  // 视图数据放Store
  store.dispatch({
    type: SET_QY_USER,
    payload: {
      ...res.data.info,
    },
  });
  Taro.hideLoading();
  return store.getState().qyUser;
};

/**
 * 获取小程序用户信息
 * @param data
 * @param shuYunMember
 * @returns
 */
const getMemberInfo = async (data, shuYunMember) => {
  let { customerBasicInfo } = data;
  let shuYunMemberInfo =
    customerBasicInfo.member && shuYunMember
      ? await getShuYunMemberInfo()
      : null;

  // 视图数据放Store
  store.dispatch({
    type: SET_USER,
    payload: {
      ...shuYunMemberInfo,
      ...customerBasicInfo,
      isMember: customerBasicInfo?.member || false,
    },
  });
  Taro.hideLoading();
  return store.getState().user;
};

/**
 * 获取数云接口
 */
export const getShuYunMemberInfo = async () => {
  let shopName: string = "";
  let { data } = await api.shuYunMember.queryMember();

  if (data?.customizedProperties?.belongShop) {
    let { data: res } = await api.shuYunMember.queryCabinet(
      data?.customizedProperties?.belongShop,
    );
    shopName = res?.detailInfo?.name;
  }
  return {
    ...data,
    belongShop: data?.customizedProperties?.belongShop,
    belongShopName: shopName,
  };
};
