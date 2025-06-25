import "./app.less";
import "windi.css";
import "./utils/globalTracking/index";

import Taro from "@tarojs/taro";
import { Component } from "react";
import { Provider } from "react-redux";

import { layout } from "@/components/Layout/config/index";
import config from "@/config/index";
import store from "@/store/index";

import pageSettingConfig from "./config/pageSettingConfig";
import { createInit } from "./utils/init";
import { schemaTrack } from "./utils/memberTrackBehavior";
import pageNoFound from "./utils/pageNoFound";
import to from "./utils/to";
import updateManager from "./utils/updateManager";

layout.init({
  storeCode: config.storeCode,
  baseUrl: config.basePathUrl,
  loginUrl: config.loginUrl,
});

class App extends Component<any> {
  initPromise: Promise<any> | null = null;
  taroGlobalData: any = {
    globalData: {
      userInfo: null,
      systemInfo: null,
      memberInfo: null,
      counterCode: null,
      initOptions: null,
    },
    init: createInit(),
    to: to,
  };
  async onLaunch(options) {
    console.log("options----------", options);
    this.taroGlobalData.globalData.initOptions = options;
    updateManager();
    this.taroGlobalData.globalData.systemInfo = Taro.getSystemInfoSync();
    let userInfo = await this.taroGlobalData.init();

    /** 短链埋点 */
    schemaTrack();
    // /** 注销用户再次注册需刷新token */
    if (
      !userInfo?.isMember &&
      userInfo?.channelName &&
      config?.env === "weapp"
    ) {
      await this.taroGlobalData.init(true);
    }

    if (options?.path === "pages/qy/home/index" && config.env !== "qy") {
      Taro.showModal({
        title: "提示",
        content: "请用企业微信登录",
        showCancel: false,
        success: () => {},
      });
      return;
    }

    if (config.env === "qy") {
      to(`/pages/qy/home/index`, "reLaunch");
    }
  }
  componentDidShow(options) {
    const { query } = options;
    if (query.counterCode || query.scene) {
      this.taroGlobalData.globalData.counterCode =
        query.scene ?? query.counterCode;
    }
  }
  onPageNotFound(options) {
    pageNoFound(options, pageSettingConfig.homePath);
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
