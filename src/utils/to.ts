import Taro from "@tarojs/taro";

const to: toType = async (data, type = "navigateTo") => {
  try {
    if (type === "exitMiniProgram") {
      return await Taro.exitMiniProgram();
    }
    if (!data) {
      console.error("跳转路径为空");
      return;
    }
    if (typeof data === "number") {
      return await Taro.navigateBack({
        delta: data,
      });
    }
    if (typeof data === "object") {
      if (type === "navigateToMiniProgram") {
        return await Taro.navigateToMiniProgram(data as any);
      }
      if (type === "navigateBackMiniProgram") {
        return await Taro.navigateBackMiniProgram(data as any);
      }
    }
    if (typeof data === "string") {
      if (data.substring(0, 4) === "http") {
        data = `/taro-public/pages/webview/index?url=${encodeURIComponent(
          data,
        )}`;
      } else if (data.substring(0, 4) === "#小程序") {
        /**
         * 通过short link打开小程序，short link可以通过【小程序菜单】->【复制链接】获取
         * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/shortlink.html
         * short link有效期30天，要求小程序版本库2.18.1以上，低于这个版本可以考虑测试navigator组件是否支持
         */
        //@ts-ignore 使用short link不需要传递appId
        return await Taro.navigateToMiniProgram({
          shortLink: data,
        });
      }
      switch (type) {
        case "navigateTo":
          return await Taro.navigateTo({
            url: data,
          });
        case "redirectTo":
          return await Taro.redirectTo({
            url: data,
          });
        case "reLaunch":
          return await Taro.reLaunch({
            url: data,
          });
        case "switchTab":
          return await Taro.switchTab({
            url: data,
          });
      }
    }
    return Promise.resolve(true);
  } catch (err) {
    console.error("err", err);
    // 小程序页面栈溢出
    if (err.errMsg.indexOf("fail webview count limit exceed") !== -1) {
      return await Taro.redirectTo({
        url: data as string,
      });
    }
    // ios与安卓不同
    if (
      err.errMsg.indexOf("a tabbar page") !== -1 ||
      err.errMsg.indexOf("a tab bar page") !== -1
    ) {
      if ((data as string).includes("?")) {
        return await Taro.reLaunch({ url: data as string });
      } else {
        return await Taro.switchTab({
          url: data as string,
        });
      }
    }
    return Promise.reject(err);
  }
};

export default to;
