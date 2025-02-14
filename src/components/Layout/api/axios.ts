import Taro from '@tarojs/taro'

import { layout } from '../config/index'
import axios, { AxiosRequestConfig, AxiosResponse } from './cg-axios/index'

const isH5 = process.env.TARO_ENV === 'h5'
// 创建axios实例
const instance = axios.create({
  baseURL: isH5 ? '/api' : layout.config.baseUrl,
  timeout: 60000
})

// axios实例添加request阻流器
instance.interceptors.request.use((_config) => {
  if (Taro.getStorageSync(layout.config.tokenStorageKey!)) {
    _config.headers.Authorization = Taro.getStorageSync(layout.config.tokenStorageKey!)
  }
  _config.baseURL = isH5 ? '/api' : layout.config.baseUrl
  return _config
})

// axios实例添加response阻流器
instance.interceptors.response.use(
  (res) => {
    return res
  },
  (err: any) => {
    Taro.hideLoading()
    // token失效
    if (err.status === 400 && err.data.code === '401') {
      return refreshToken(err.config)
    }
    // 网络异常
    if (err.status === -1) {
      if (isTokenApi(err.config)) {
        return refreshToken(err.config)
      } else {
        return refreshRequest(err.config)
      }
    }
    // 服务器异常
    if (err.status >= 500 && err.status < 600) {
      Taro.showToast({
        icon: 'none',
        title: '系统繁忙,请稍后再试',
        duration: 5000
      })
    }
    // 服务器自定义报错
    if (err.status >= 400 && err.status < 500) {
      if (layout.config.errCodeList?.includes(err.data.code)) {
        return Promise.resolve(err)
      }
      const rqConfigData = JSON.parse(err.config.data ?? '{}')
      const apiErrMsg = rqConfigData?._errCodeList?.find(
        (item) => item.code === err.data.code
      )?.value
      if (layout.config.interfacePopupType?.fail === 'modal') {
        Taro.showModal({
          content: apiErrMsg ?? err.data?.message
        })
      } else if (layout.config.interfacePopupType?.fail === 'toast') {
        Taro.showToast({
          icon: 'none',
          title: apiErrMsg ?? err.data?.message
        })
      }
    }
    return Promise.reject(err)
  }
)

/** 刷新Token, 默认只刷新一次 */
function refreshToken(params: AxiosRequestConfig) {
  return Taro.login()
    .then((res: any) => {
      return Taro.request({
        url: layout.config.loginUrl + res.code
      })
    })
    .then(
      (res: any) => {
        Taro.setStorageSync(layout.config.tokenStorageKey!, res.data.jwtString)
        if (!isTokenApi(params)) {
          return refreshRequest(params)
        } else {
          const response: AxiosResponse = {
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg,
            headers: res.header,
            config: params
          }
          return response
        }
      },
      (err: any) => {
        Taro.showModal({
          title: '网络异常',
          content: err.errMsg
        })
        return Promise.reject(err)
      }
    )
}

/** 重新发起请求 */
function refreshRequest(_config: AxiosRequestConfig) {
  return Taro.request({
    url: _config.url!,
    header: Object.assign({}, _config.headers, {
      Authorization: Taro.getStorageSync(layout.config.tokenStorageKey!)
    }),
    data: _config.data,
    method: _config.method as any,
    timeout: 60000
  }).then(
    (res: any) => {
      const response: AxiosResponse = {
        data: res.data,
        status: res.statusCode,
        statusText: res.errMsg,
        headers: res.header,
        config: _config
      }
      return response
    },
    (err: any) => {
      Taro.showModal({
        title: '网络异常',
        content: err.errMsg
      })
      return Promise.reject(err)
    }
  )
}

/** 判断是否是请求token接口 */
function isTokenApi(request: AxiosRequestConfig) {
  return request.url!.indexOf(layout.config.loginUrl!) !== -1
}

export default instance
