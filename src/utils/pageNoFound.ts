import to from "./to";

const map = {
  "subPages/service-appointment/index": "/subPages/service/index",
  "subPages/service-appointment/list/index": "/subPages/service/list/index",
};

/**
  options: 页面参数路径
  map: 自定义页面数组
  url: 默认跳转路径
*/
export default (options, url) => {
  const pathKey = options.path;
  const params = options.query;
  const redirectUrl = map[pathKey];
  const urlParams = redirectUrl?.split("?") || [];
  let str = urlParams[1] ? urlParams[1] + "&" : "";
  for (let key in params) {
    str += `${key}=${params[key]}&`;
  }
  let sliceStr = str.substring(0, str.length - 1);
  if (redirectUrl) {
    to(`${urlParams[0]}?${sliceStr}`, "reLaunch");
    return;
  }
  to(url, "reLaunch");
};
