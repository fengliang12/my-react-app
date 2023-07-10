import Taro from '@tarojs/taro'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types/index";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data, url, method = 'GET', headers, responseType, dataType, timeout, cancelToken, filePath, name = 'file', formData } = config
    Object.keys(headers).forEach(item => {
      if (!data && item.toLowerCase() === 'content-type') {
        delete headers[item]
      }
    })
    let task = Object.create(null)
    if (method === 'UPLOAD') {
      task = Taro.uploadFile({
        url,
        filePath,
        name,
        formData,
        header: headers,
        timeout,
        success(res: any) {
          const response: AxiosResponse = {
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg,
            config: { method, ...config }
          }
          handleResponse(response)
        },
        fail(err: any) {
          reject({
            data: {
              code: -1,
              message: "网络异常，请稍后重试"
            },
            status: -1,
            statusText: err.errMsg,
            config: { method, ...config }
          })
        }
      })
    } else {
      task = Taro.request({
        url,
        method,
        data,
        header: headers,
        responseType,
        dataType,
        timeout,
        success(res: any) {
          const response: AxiosResponse = {
            data: res.data,
            status: res.statusCode,
            statusText: res.errMsg,
            headers: res.header,
            config: { method, ...config }
          }
          handleResponse(response)
        },
        fail(err: any) {
          reject({
            data: {
              code: -1,
              message: "网络异常，请稍后重试"
            },
            status: -1,
            statusText: err.errMsg,
            config: { method, ...config }
          })
        }
      })
    }
    processCancel()
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            task.abort()
            reject(reason)
          })
          .catch(() => { })
      }
    }
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(response)
      }
    }
  })
}

