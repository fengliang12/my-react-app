import Taro from "@tarojs/taro";

import api from "../api";
import store from "../store";
import { SET_USER } from "../store/constants";

export const createInit = () => {
  let initPromise: Promise<Store.User> | null = null;
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

          let userInfo = {
            mobile: data.customerBasicInfo?.mobile || "",
            isMember: data.customerBasicInfo?.member || false,
            nickName: data.customerBasicInfo?.nickName || "",
            realName: data.customerBasicInfo?.realName || "",
            birthDate: data.customerBasicInfo?.birthDate || "",
            customInfos: data.customerBasicInfo?.customInfos || [],
            avatarUrl: data.customerBasicInfo?.avatarUrl || "",
            gender: data.customerBasicInfo?.gender || 0,
            province: data.customerBasicInfo?.province || "",
            city: data.customerBasicInfo?.city || "",
            district: data.customerBasicInfo?.district || "",
            country: data.customerBasicInfo?.country || "",
            marsId: data.customerBasicInfo?.marsId || "",
            id: data.customerBasicInfo?.id || "",
          };
          // 视图数据放Store
          store.dispatch({
            type: SET_USER,
            payload: userInfo,
          });
          return userInfo;
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
export const getShuYunMemberInfo = async () => {
  let { data } = await api.shuYunMember.queryMember();
  let userInfo = {
    cardNo: data.cardNo,
    gradeName: data.gradeName,
    gradeId: data.gradeId,
    memberId: data.memberId,
    needAmount: data.needAmount,
    nextGradeName: data.nextGradeName,
    nextGradeNeedAmount: data.nextGradeNeedAmount,
    points: data.points,
  };
  // 视图数据放Store
  store.dispatch({
    type: SET_USER,
    payload: userInfo,
  });
};
