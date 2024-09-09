import Taro from "@tarojs/taro";
import { merge } from "lodash-es";

import dev from "./dev";
import prod from "./prod";

// 配置生产项目APPID
// 测试：wxbd3891c0f73d0592
// 生产：wx7d12b21af0a8bed3
export const IS_PRO =
  Taro.getAccountInfoSync()?.miniProgram?.appId === "wx7d12b21af0a8bed3";

const baseConfig = {
  /** 品牌StoreCode */
  storeCode: "nars",
  /** 主题页面Code配置 */
  pageCode: {
    /** 会员中心首页 */
    home: "home",
    /** 二级活动页 */
    activity: "activity",
    /** 个人中心 */
    user: "user",
  },
  /** 内置H5页面 */
  webView: {
    pagePath: "/pages/h5/index",
    queryName: "url",
  },
  refreshCodeList: ["401", "50020003"],
  errCodeList: ["10000", "MobileHasRegistered"],
  postagePoints: 100,
  postageMoney: 9.9,
  key: "FCIBZ-CHU3G-2DZQK-QBDPK-HNSD3-QVBZQ", 
  DEBUG_TOKEN: "",
};
const config = merge(baseConfig, IS_PRO ? prod : dev);
config.loginUrl = `${config.basePathUrl}/sp-portal/store/${config.storeCode}/wechat/login/`;
export default config;
