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

import pageSettingConfig from "./config/pageSettingConfig";
import to from "./utils/to";
import updateManager from "./utils/updateManager";

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
    init: (refresh, queryGrade = true) => {
      if (this.initPromise === null || refresh) {
        const { environment } = Taro.getSystemInfoSync();
        const isQyWx = environment === "wxwork";
        let loginFn: any = isQyWx ? Taro["qy"].login : Taro.login;
        this.initPromise = loginFn()
          .then(({ code }) =>
            isQyWx ? api.common.loginQY(code) : api.common.login(code),
          )
          .then(async ({ data }) => {
            if (data.customerBasicInfo.member && queryGrade) {
              // let res = await api.user.queryGrade();
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
            // 非视图数据放globalData
            this.taroGlobalData.globalData.userInfo = omit(data, ["jwtString"]);
            return data;
          })
          .catch(() => {
            this.initPromise = null;
          });
      }
      return this.initPromise;
    },
    to: to,
  };
  async onLaunch() {
    updateManager();
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
      url: pageSettingConfig.homePath,
    });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
