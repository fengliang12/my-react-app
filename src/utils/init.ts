import Taro from "@tarojs/taro";
import { omit } from "lodash";

import api from "../api";
import store from "../store";
import { SET_USER } from "../store/constants";

const app: App.GlobalData = Taro.getApp();

export const createInit = () => {
  let initPromise: Promise<any> | null = null;
  return (refresh, shuYunMember = true) => {
    if (initPromise === null || refresh) {
      const { environment } = Taro.getSystemInfoSync();
      const isQyWx = environment === "wxwork";
      let loginFn: any = isQyWx ? Taro["qy"].login : Taro.login;

      initPromise = loginFn()
        .then(({ code }) =>
          isQyWx ? api.common.loginQY(code) : api.common.login(code),
        )
        .then(async ({ data }) => {
          if (data.customerBasicInfo.member && shuYunMember) {
            getShuYunMemberInfo();
          }

          Taro.setStorageSync("token", data.jwtString);
          // 视图数据放Store
          store.dispatch({
            type: SET_USER,
            payload: {
              isMember: data.customerBasicInfo?.member || false,
              nickName: data.customerBasicInfo?.nickName || "",
              realName: data.customerBasicInfo?.realName || "",
              avatarUrl: data.customerBasicInfo?.avatarUrl || "",
              gender: data.customerBasicInfo.gender === 1 ? "男" : "女",
            },
          });
          app.globalData.userInfo = omit(data, ["jwtString"]);
          return data;
        })
        .catch(() => {
          initPromise = null;
        });
    }
    return initPromise;
  };
};

/**
 * 获取数云接口
 */
export const getShuYunMemberInfo = async () => {};
