export type BaseConfig = {
  /** storeCode */
  storeCode: string;
  /** webview承载页面地址 */
  webView: WebViewConfig;
  /** 刷新code列表 */
  refreshCodeList: string[];
  /** 错误code列表 */
  errCodeList: string[];
  /** 邮费点数 */
  postagePoints: number;
  /** 邮费金额 */
  postageMoney: number;
  /** 腾讯地图逆向解析 */
  key: string;
  /** 模拟客户token */
  DEBUG_TOKEN: string;
  /** 图片地址 */
  imgBaseUrl: string;
  /** 请求接口基础地址 */
  basePathUrl: string;
  /** 登录地址 */
  loginUrl: string;
  /** 企业微信基础地址 */
  qyBasePathUrl: string;
  /** 环境 */
  env: "h5" | "qy" | "weapp";
};
export type WebViewConfig = {
  /** 页面地址 */
  pagePath: string;
  /** 查询参数 */
  queryName: any;
};
