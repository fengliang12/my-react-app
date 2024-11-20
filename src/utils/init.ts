import Taro from "@tarojs/taro";

import api from "../api";
import store from "../store";
import { SET_USER } from "../store/constants";

export const createInit = () => {
  let initPromise: Promise<Store.User> | null = null;
  return (refresh, shuYunMember = true): Promise<Store.User> | null => {
    if (initPromise === null || refresh) {
      const { environment } = Taro.getSystemInfoSync();
      const isQyWx = environment === "wxwork";
      let loginFn: any = isQyWx ? Taro["qy"].login : Taro.login;
      Taro.showLoading({ title: "加载中", mask: true });
      initPromise = loginFn()
        .then(({ code }) =>
          isQyWx
            ? api.common.loginQY(code)
            : api.common.login(code, { checkMember: true }),
        )
        .then(async ({ data }) => {
          if (data.customerBasicInfo.member && shuYunMember) {
            await getShuYunMemberInfo();
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
            channelName: data.customerBasicInfo?.channelName || "",
            openId: data.customerBasicInfo?.openId || "",
            unionId: data.customerBasicInfo?.unionId || "",
          };
          // 视图数据放Store
          store.dispatch({
            type: SET_USER,
            payload: userInfo,
          });
          Taro.hideLoading();
          return store.getState().user;
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
  let shopName: string = "";
  let { data } = await api.shuYunMember.queryMember();
  console.log("获取数云接口", data);

  if (data?.customizedProperties?.belongShop) {
    let { data: res } = await api.shuYunMember.queryCabinet(
      data?.customizedProperties?.belongShop,
    );
    shopName = res?.detailInfo?.name;
  }

  let userInfo = {
    cardNo: data.cardNo,
    gradeName: data.gradeName,
    gradeId: data.gradeId,
    memberId: data.memberId,
    needAmount: data.needAmount,
    nextGradeName: data.nextGradeName,
    nextGradeNeedAmount: data.nextGradeNeedAmount,
    points: data.points,
    belongShop: data?.customizedProperties?.belongShop,
    belongShopName: shopName,
    invalidPoints: data.invalidPoints,
  };
  console.log("---userInfo", userInfo);

  // 视图数据放Store
  store.dispatch({
    type: SET_USER,
    payload: userInfo,
  });
};
