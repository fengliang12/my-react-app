import "./app.less";
import "windi.css";

import Taro from "@tarojs/taro";
import { Component } from "react";
import { Provider } from "react-redux";

import { layout } from "@/components/Layout/config/index";
import config from "@/config/index";
import store from "@/store/index";

import pageSettingConfig from "./config/pageSettingConfig";
import { createInit } from "./utils/init";
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
    },
    init: createInit(),
    to: to,
  };
  async onLaunch() {
    updateManager();
    this.taroGlobalData.globalData.systemInfo = Taro.getSystemInfoSync();
    this.taroGlobalData.init();
    Taro.loadFontFace({
      family: "CHINESE_F_Z",
      global: true,
      source: `url("${config.imgBaseUrl}/font/FZLTXHJW.TTF")`,
      success: console.log,
      fail: console.log,
    });
    Taro.loadFontFace({
      family: "ENGLISH_F_Z",
      global: true,
      source: `url("${config.imgBaseUrl}/font/HelveticaNeueLTPro-UltLt.TTF")`,
      success: console.log,
      fail: console.log,
    });
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
      url: pageSettingConfig.homePath,
    });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
