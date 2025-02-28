import Taro from "@tarojs/taro";

import { trackingFn } from "@/src/hooks/useTracking";

// import { appInit, trackingMap } from "src/utils/appInit";

const OriginPage = Page;
const OriginApp = App;

class Tracking {
  pageRecordTime: number = 0; //页面记录时间
  appRecordTime: number = 0; //小程序记录时间
  appOnHideTime: number = 0; //小程序OnHide时间
  num: number;
  appHideTrackIngId: string = "";
  appOnUnloadId: string = ""; // 卸载小程序埋点id
  disableTrack: boolean = false; // 是否点击分享
  oldRoute: string = "";
  constructor() {
    this.num = 0;
    this.setPage();
    this.setApp();
  }
  getCurrentPage() {
    const pages = Taro.getCurrentPages();
    return pages[pages.length - 1];
  }
  setApp() {
    const track = this;
    App = function (conf) {
      // "onLaunch",
      const methods = ["onLaunch"];
      Object.keys(conf).forEach((elem) => {
        if (!methods.includes(elem)) {
          return;
        }
        const oldMethods = conf[elem];
        conf[elem] = function (options) {
          try {
            oldMethods.call(this, options);
          } catch (err) {
            console.error(err);
          }

          trackingFn({
            formType: "appLifeCycle",
            formId: elem,
          });
        };
      });
      return OriginApp(conf);
    };
  }
  setPage() {
    const track = this;
    Page = function (conf) {
      const methods = ["onShow", "onShareAppMessage"];

      Object.keys(conf).forEach((elem) => {
        if (!methods.includes(elem)) {
          return;
        }
        const oldMethods = conf[elem];
        conf[elem] = function (options) {
          let methodsRes = "";
          try {
            methodsRes = oldMethods.call(this, options);
          } catch (err) {
            console.error(err);
          }
          if (elem === "onShareAppMessage") {
            track.disableTrack = true;
            return methodsRes;
          }

          trackingFn({
            formType: "pageLifeCycle",
            formId: elem,
          });
        };
      });
      return OriginPage(conf);
    };
  }
  setDisableTrack() {
    this.disableTrack = true;
  }
}

export default new Tracking();
