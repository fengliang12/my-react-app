import "./app.less";
import "windi.css";

import Taro from "@tarojs/taro";
import { omit } from "lodash-es";
import { Component } from "react";
import { Provider } from "react-redux";

import api from "@/api/index";
import { layout } from "@/components/Layout/config/index";
import config from "@/config/index";
import { SET_USER } from "@/store/constants/index";
import configStore from "@/store/index";

layout.init({
  storeCode: config.storeCode,
  baseUrl: config.basePathUrl,
  loginUrl: config.loginUrl,
});

const store = configStore();

class App extends Component<any> {
  initPromise: Promise<any> | null = null;
  taroGlobalData: any = {
    globalData: {
      userInfo: null,
      systemInfo: null,
      memberInfo: null,
    },
    init: (refresh) => {
      if (this.initPromise === null || refresh) {
        const { environment } = Taro.getSystemInfoSync();
        const isQyWx = environment === "wxwork";
        let loginFn: any = isQyWx ? Taro["qy"].login : Taro.login;
        this.initPromise = loginFn()
          .then(({ code }) =>
            isQyWx ? api.common.loginQY(code) : api.common.login(code),
          )
          .then(async ({ data }) => {
            Taro.setStorageSync("token", data.jwtString);
            // 视图数据放Store
            store.dispatch({
              type: SET_USER,
              payload: {
                isMember: data.customerBasicInfo.member,
                nickName: data.customerBasicInfo.nickName,
                avatarUrl: data.customerBasicInfo.avatarUrl,
                gender: data.customerBasicInfo.gender === 1 ? "男" : "女",
              },
            });
            // 非视图数据放globalData
            this.taroGlobalData.globalData.userInfo = omit(data, ["jwtString"]);
          })
          .catch(() => {
            this.initPromise = null;
          });
      }
      return this.initPromise;
    },
    async auth(scope) {
      enum ScopeAuth {
        "scope.userLocation" = "地理位置",
        "scope.userFuzzyLocation" = "模糊地理位置",
        "scope.userLocationBackground" = "后台定位",
        "scope.address" = "通讯地址",
        "scope.invoiceTitle" = "发票抬头",
        "scope.invoice" = "获取发票",
        "scope.werun" = "微信运动步数",
        "scope.record" = "录音功能",
        "scope.writePhotosAlbum" = "保存到相册",
        "scope.camera" = "摄像头",
      }
      try {
        const getSettingResult = await Taro.getSetting();
        const currentScope = getSettingResult.authSetting[scope];
        if (currentScope === undefined || currentScope === null) {
          //第一次申请权限
          await Taro.authorize({ scope });
          return true;
        } else if (currentScope === false) {
          //申请过，但被拒绝
          const { confirm } = await Taro.showModal({
            content: `${ScopeAuth[scope]}权限未开启，请在设置中打开`,
          });
          if (confirm) {
            const openSettingResult = await Taro.openSetting();
            if (openSettingResult.authSetting[scope]) {
              return true;
            }
          }
        } else {
          /** 已有权限 */
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
    async to(data, type = "navigateTo") {
      try {
        if (type === "exitMiniProgram") {
          return await Taro.exitMiniProgram();
        }
        if (!data) {
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
            return await Taro.navigateTo({
              url: `${config.webView?.pagePath}?${config.webView?.queryName}=${data}`,
            });
          }
          /** 红包跳转 */
          if (data.substring(0, 4) === "_http") {
            return await Taro.showRedPackage({
              url: data.slice(1),
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
      } catch (err) {
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
          return await Taro.switchTab({
            url: data as string,
          });
        }
        // 默认跳转首页
        if (
          err.errMsg.indexOf(
            "navigateBack:fail cannot navigate back at first page",
          ) !== -1
        ) {
          return await Taro.switchTab({
            url: "/pages/index/index",
          });
        }
      }
    },
  };
  async onLaunch() {
    this.taroGlobalData.globalData.systemInfo = Taro.getSystemInfoSync();
    this.taroGlobalData.init();
  }
  componentDidShow(options) {
    const { query } = options;
    if (query.counterCode || query.scene) {
      this.taroGlobalData.globalData.counterCode =
        query.scene ?? query.counterCode;
    }
  }
  onPageNotFound() {
    Taro.switchTab({
      url: "/pages/index/index",
    });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
