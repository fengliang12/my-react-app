import Taro from "@tarojs/taro";

import toast from "@/src/utils/toast";

import { QyApi } from "./data.d";

const noCheckApi = ["login", "checkSession", "canIUse"];
const authConfig = {
  getAvatar: {
    // 权限
    scope: "scope.qy_avatar",
    //文案
    title: "企业微信头像",
  },
};
//打开权限配置
const getOpenSetting = async ({ type }: { type: "getAvatar" }) => {
  const modal = await Taro.showModal({
    title: "获取授权",
    content: `是否允许小程序使用您的${authConfig[type].title}`,
  });
  if (modal.confirm) {
    const setting = await Taro.openSetting();
    if (setting?.authSetting?.[authConfig[type].scope]) {
      return true;
    }
  }
  return false;
};
const app = Taro.getApp();
const getQyApi = (propKey, options) => {
  return new Promise((resolve, reject) => {
    Taro.qy[propKey]({
      ...options,
      success(res) {
        resolve(res);
        if (options?.success) {
          options.success(res);
        }
      },
      async fail(err) {
        if (propKey === "getAvatar") {
          if (err?.errCode && err?.errCode === -12006) {
            const res = await getOpenSetting({ type: "getAvatar" });
            if (res) {
              resolve(qy.getAvatar(options));
            } else {
              toast(`获取企业微信头像失败`);
              reject(err);
            }
            return;
          }
        }
        // 分享朋友圈
        if (propKey === "shareToExternalMoments") {
          // 用户不在权限列表中
          if (err.errMsg.includes("user not in allow list")) {
            toast("暂无朋友圈权限，请联系管理员");
          }
        }
        if (err?.errCode && err?.errCode !== 0) {
          toast(`企业微信错误:${err?.errCode}`);
        }
        if (options?.fail) {
          options.fail(err);
        }
        reject(err);
      },
    });
  });
};
const qy = new Proxy({} as QyApi, {
  get(_target, propKey) {
    return async (options) => {
      if (noCheckApi.includes(propKey as string)) {
        return getQyApi(propKey, options);
      }

      const canIUse = await Taro.qy.canIUse(propKey as string);
      if (!canIUse) {
        const errorMsg = `${propKey.toString()}当前版本不支持`;
        toast(errorMsg);
        options?.fail?.(errorMsg);
        return Promise.reject(errorMsg);
      }
      try {
        await Taro.qy.checkSession({});
        return getQyApi(propKey, options);
      } catch (error) {
        console.log("qyApi launch error", propKey, error);
        await app.init({ refresh: true });
        return getQyApi(propKey, options);
      }
    };
  },
});

export default qy;
