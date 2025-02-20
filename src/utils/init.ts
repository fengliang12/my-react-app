import Taro from "@tarojs/taro";

import api from "../api";
import config from "../config";
import store from "../store";
import { SET_USER } from "../store/constants";

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
          Taro.setStorageSync(
            "token",
            config.env === "qy" ? `${data}` : data.jwtString,
          );

          if (config.env === "qy") {
            Taro.hideLoading();
            return Promise.resolve(data);
          } else if (config.env === "weapp") {
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
          }
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
