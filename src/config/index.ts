import Taro from "@tarojs/taro";
// 从lodash-es导入merge方法
// @ts-ignore
import { merge } from "lodash-es";

import DebugClass from "../utils/DebugClass";
import getByEnv from "../utils/getByEnv";
import { BaseConfig } from "./config";
import dev from "./dev";
import prod from "./prod";

// 配置生产项目APPID
// 测试：wxbd3891c0f73d0592
// 生产：wx7d12b21af0a8bed3
export const IS_PRO =
  Taro.getAccountInfoSync()?.miniProgram?.appId === "wx7d12b21af0a8bed3";

const baseConfig: Partial<BaseConfig> = {
  /** 品牌StoreCode */
  storeCode: "nars",
  /** 内置H5页面 */
  webView: {
    pagePath: "/pages/h5/index",
    queryName: "url",
  },
  refreshCodeList: ["401", "50020003"],
  errCodeList: ["10000", "MobileHasRegistered", "51216600"],
  postagePoints: 100,
  postageMoney: 9.9,
  key: "FCIBZ-CHU3G-2DZQK-QBDPK-HNSD3-QVBZQ",
  DEBUG_TOKEN: "",
  debuggerClass: DebugClass,
  /**图片前缀**/
  imgBaseUrl: "https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com",
  ...getByEnv(),
};
const config: BaseConfig = merge(baseConfig, IS_PRO ? prod : dev);
config.loginUrl = `${config.basePathUrl}/sp-portal/store/${config.storeCode}/wechat/login/`;
export default config;
