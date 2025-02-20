import Taro from "@tarojs/taro";

import config from "@/config/index";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from "@/src/plugins/cg-axios/index";

interface CustomConfig {
  /**是否toast报错 */
  showError?: boolean;
}

// 创建axios实例
const instance = axios.create({
  baseURL: config.env === "qy" ? config.qyBasePathUrl : config.basePathUrl,
  timeout: 60000,
});

// axios实例添加request阻流器
instance.interceptors.request.use((_config) => {
  if (!_config.noToken) {
    _config.headers.Authorization =
      config?.DEBUG_TOKEN || Taro.getStorageSync("token");
  }
  return _config;
});

// axios实例添加response阻流器
instance.interceptors.response.use(
  (res) => {
    console.log("res", res);
    return res;
  },
  (err: any) => {
    console.log("err", err);
    Taro.hideLoading();
    // token失效
    if (err.status === 400 && config.refreshCodeList?.includes(err.data.code)) {
      return refreshToken(err.config);
    }

    // 网络异常
    if (err.status === -1) {
      if (isTokenApi(err.config)) {
        return refreshToken(err.config);
      } else {
        return refreshRequest(err.config);
      }
    }
    // 服务器异常
    if (err.status >= 500 && err.status < 600) {
      Taro.showToast({
        icon: "none",
        title: "系统繁忙,请稍后再试",
        duration: 5000,
      });
    }
    // 服务器自定义报错
    if (err.status >= 400 && err.status < 500) {
      if (config.errCodeList?.includes(err.data.code)) {
        return Promise.resolve(err);
      }
      if (err?.config?.showError !== false) {
        Taro.showToast({ title: err.data?.message, icon: "none" });
      }
    }

    return Promise.reject(err);
  },
);

/** 刷新Token, 默认只刷新一次 */
function refreshToken(params: AxiosRequestConfig) {
  return Taro.login()
    .then((res: any) => {
      return Taro.request({
        url: config.loginUrl + res.code,
      });
    })
    .then(
      (res: any) => {
        Taro.setStorageSync("token", res.data.jwtString);
        if (!isTokenApi(params)) {
          return refreshRequest(params);
        } else {
          const response: AxiosResponse = {
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg,
            headers: res.header,
            config: params,
          };
          return response;
        }
      },
      (err: any) => {
        Taro.showModal({
          title: "网络异常",
          content: err.errMsg,
        });
        return Promise.reject(err);
      },
    );
}

/** 重新发起请求 */
function refreshRequest(_config: AxiosRequestConfig) {
  return Taro.request({
    url: _config.url!,
    header: Object.assign({}, _config.headers, {
      Authorization: Taro.getStorageSync("token"),
    }),
    data: _config.data,
    method: _config.method as any,
    timeout: 60000,
  }).then(
    (res: any) => {
      const response: AxiosResponse = {
        data: res.data,
        status: res.statusCode,
        statusText: res.errMsg,
        headers: res.header,
        config: _config,
      };
      return response;
    },
    (err: any) => {
      Taro.showModal({
        title: "网络异常",
        content: err.errMsg,
      });
      return Promise.reject(err);
    },
  );
}

/** 判断是否是请求token接口 */
function isTokenApi(request: AxiosRequestConfig) {
  return request.url!.indexOf(config.loginUrl) !== -1;
}

export default instance;
