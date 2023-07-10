import type { CSSProperties } from 'react'
import Taro from '@tarojs/taro'
import { isUndefined, isNil, pickBy, isObject, isArray, unionBy, startsWith, omit, isFunction, isNumber, isString, isBoolean, mapValues, merge } from 'lodash-es'
import http from './api/axios'
import { layout } from './config/index'
import { store } from './store/index'


function computeSize(size: number | string | undefined): any {
  if (!isUndefined(size)) {
    if (typeof size === 'string') {
      const pxIndex = size.indexOf('px')
      if (pxIndex !== -1) {
        const spaceIndex = size.indexOf(' ')
        if (spaceIndex === -1) {
          return Taro.pxTransform(parseInt(size, 10))
        }
        const strArr = size.split(' ')
        const newArr = strArr.map((x: string) => {
          if (x.indexOf('px') !== -1) {
            x = Taro.pxTransform(parseInt(x, 10))
          }
          return x
        })
        return newArr.join(' ')
      }
      return size
    }
  }
  return size
}

function computeTransform(data: string): string {
  let result = data
  if (data) {
    const arr = result.split(' ')
    const newArr = arr.map((x) => {
      if (x.indexOf('px') !== -1 && x.indexOf('translateY') !== -1) {
        x = `translateY(${Taro.pxTransform(parseInt(x.substring(11, x.length - 1), 10))})`
      }
      if (x.indexOf('px') !== -1 && x.indexOf('translateX') !== -1) {
        x = `translateX(${Taro.pxTransform(parseInt(x.substring(11, x.length - 1), 10))})`
      }
      if (x.indexOf('px') !== -1 && x.indexOf('translateZ') !== -1) {
        x = `translateZ(${Taro.pxTransform(parseInt(x.substring(11, x.length - 1), 10))})`
      }
      return x
    })
    result = newArr.join(' ')
  }
  return result
}


/** 解析ReactStyle数据 */
export const getReactStyle = (style): CSSProperties => {
  let cssStyle: CSSProperties = mapValues(style, (value, key) => {
    if (key === 'transform') {
      return computeTransform(value)
    }
    return computeSize(value)
  })
  return cssStyle
}

/** 解析Style数据 */
export const getBaseStyle = (style, noBorderBox?: Boolean): CSSProperties => {
  let cssStyle: CSSProperties = {}
  if (style) {
    // 盒模型数据
    if (style.boxModel) {
      let { width, height, padding, margin, paddingLeft, paddingTop, paddingBottom, paddingRight, marginBottom, marginRight, marginLeft, marginTop, borderWidth } = style.boxModel
      width = computeSize(style.boxModel.width)
      height = computeSize(style.boxModel.height)
      padding = computeSize(style.boxModel.padding)
      margin = computeSize(style.boxModel.margin)
      paddingLeft = computeSize(style.boxModel.paddingLeft);
      paddingRight = computeSize(style.boxModel.paddingRight);
      paddingTop = computeSize(style.boxModel.paddingTop);
      paddingBottom = computeSize(style.boxModel.paddingBottom);
      marginBottom = computeSize(style.boxModel.marginBottom);
      marginRight = computeSize(style.boxModel.marginRight);
      marginLeft = computeSize(style.boxModel.marginLeft);
      marginTop = computeSize(style.boxModel.marginTop);
      borderWidth = computeSize(style.boxModel.borderWidth)
      cssStyle = { ...cssStyle, ...style.boxModel, padding, margin, width, height, marginTop, marginLeft, marginRight, marginBottom, paddingBottom, paddingLeft, paddingTop, paddingRight, borderWidth }
    }
    // 定位数据
    if (style.position) {
      let { top, left, bottom, right, position } = style.position
      top = computeSize(style.position.top)
      left = computeSize(style.position.left)
      bottom = computeSize(style.position.bottom)
      right = computeSize(style.position.right)
      cssStyle = { ...cssStyle, ...style.position, position, top, left, bottom, right }
    }
    // flex数据
    if (style.flex) {
      cssStyle = { ...cssStyle, ...style.flex }
      if (cssStyle.flexGrow || cssStyle.flexGrow === 0) {
        cssStyle.flexGrow = String(cssStyle.flexGrow)
      }
      if (cssStyle.flexShrink || cssStyle.flexShrink === 0) {
        cssStyle.flexShrink = String(cssStyle.flexShrink)
      }
      if (cssStyle.order || cssStyle.order === 0) {
        cssStyle.order = String(cssStyle.order)
      }
    }
    // 通用数据
    if (style.common) {
      let { borderRadius, borderTopRightRadius, borderTopLeftRadius, borderBottomLeftRadius, borderBottomRightRadius, transform } = style.common;
      borderRadius = computeSize(style.common.borderRadius);
      borderTopRightRadius = computeSize(style.common.borderTopRightRadius)
      borderTopLeftRadius = computeSize(style.common.borderTopLeftRadius)
      borderBottomLeftRadius = computeSize(style.common.borderBottomLeftRadius)
      borderBottomRightRadius = computeSize(style.common.borderBottomRightRadius)
      transform = computeTransform(style.common.transform)
      cssStyle = { ...cssStyle, ...style.common, borderRadius, borderTopRightRadius, borderTopLeftRadius, borderBottomLeftRadius, borderBottomRightRadius, transform }
    }
    // 文字数据
    if (style.font) {
      let { fontSize, lineHeight } = style.font
      fontSize = computeSize(style.font.fontSize)
      lineHeight = computeSize(style.font.lineHeight)
      cssStyle = { ...cssStyle, ...style.font, fontSize, lineHeight }
    }
    // 动效数据
    if (style.dynamicEffect) {
      cssStyle = { ...cssStyle, ...style.dynamicEffect }
    }
    // 默认盒模型都是BorderBox
    if (!cssStyle.boxSizing && !noBorderBox) {
      cssStyle.boxSizing = 'border-box'
    }
    if (style.reactStyle) {
      cssStyle = merge(cssStyle, getReactStyle(style.reactStyle))
    }

  }
  return pickBy(cssStyle, (value) => (value === 0 || !isNil(value)))
}

/** 解析Component属性 */
export const getBaseComponent = (actionCom, nowCurrent = 0) => {
  if (!actionCom?.type) return {}
  let result: { key: string, value: any, type: any } | null = null
  if (actionCom.type === 'swiperView') {
    let nowVal = nowCurrent
    if (actionCom.current?.value === 'last' && nowVal > 0) {
      result = {
        key: actionCom.id,
        value: nowVal - 1,
        type: 'current'
      }
    } else if (
      actionCom.current?.value === 'next' &&
      nowVal < actionCom.current?.count - 1
    ) {
      result = {
        key: actionCom.id,
        value: nowVal + 1,
        type: 'current'
      }
    } else if (!isNaN(Number(actionCom.current?.value))) {
      result = {
        key: actionCom.id,
        value: Number(actionCom.current?.value),
        type: 'current'
      }
    }
  }
  if (actionCom.type === 'image') {
    result = {
      key: actionCom.id,
      value: actionCom.src,
      type: 'src'
    }
  }
  if (actionCom.type === 'video') {
    if (actionCom.src) {
      result = {
        key: actionCom.id,
        value: actionCom.src,
        type: 'src'
      }
    }
    if (isBoolean(actionCom.muted)) {
      result = {
        key: actionCom.id,
        value: actionCom.muted,
        type: 'muted'
      }
    }
  }
  if (actionCom.type === 'scrollView') {
    result = {
      key: actionCom.id,
      value: actionCom.offset.id ? getDomId(actionCom.offset.id) : actionCom.offset.number,
      type: 'offset'
    }
  }
  if (actionCom.type === 'text') {
    result = {
      key: actionCom.id,
      value: actionCom.nodes,
      type: 'nodes'
    }
  }
  return result
}

/** 统一log处理 */
export const log = (...arg) => {
  if (layout.config.openLog) {
    console.log(`%c【Layout】`, 'color:#fa8c16;font-szie:26px;', ...arg)
  }
}

/** try catch包裹的方法 */
export const safeFn = (fn: any) => {
  try {
    if (isFunction(fn)) {
      return fn()
    }
  } catch (err) {
    console.log('safeFn-error', err)
    return false
  }
}

/** 路径添加参数 */
export const addParams = (path, params = []) => {
  let result = path
  if (params.length === 0) {
    return result
  }
  const paramsStr = params.reduce((pre: any, cur: any) => {
    let str = `${cur.key}=${cur.value}`
    if (pre) {
      pre = pre + '&' + str
    } else {
      pre = str
    }
    return pre
  }, '')
  if (result.indexOf('?') !== -1) {
    result = result + '&' + paramsStr
  } else {
    result = result + '?' + paramsStr
  }
  return result
}

/** 路由跳转 */
export const to = async (data, type = 'navigateTo', pageId) => {
  try {
    if (type === 'exitMiniProgram') {
      return await Taro.exitMiniProgram()
    }
    if (!data) {
      return
    }
    if (typeof data === 'number') {
      return await Taro.navigateBack({
        delta: data
      })
    }
    if (typeof data === 'object') {
      if (type === 'navigateToMiniProgram') {
        return await Taro.navigateToMiniProgram(data as any)
      }
      if (type === 'navigateBackMiniProgram') {
        return await Taro.navigateBackMiniProgram(data as any)
      }
    }
    if (typeof data === 'string') {
      if (data.substring(0, 4) === 'http') {
        return await Taro.navigateTo({
          url: `${layout.config.webView?.pagePath}?${layout.config.webView?.queryName}=${data}`
        })
      }
      /** 红包跳转 */
      if (data.substring(0, 4) === '_http') {
        return await Taro.showRedPackage({
          url: data.slice(1)
        })
      }
      switch (type) {
        case 'navigateTo':
          return await Taro.navigateTo({
            url: data
          })
        case 'redirectTo':
          return await Taro.redirectTo({
            url: data
          })
        case 'reLaunch':
          return await Taro.reLaunch({
            url: data
          })
        case 'switchTab':
          safeFn(() => Taro.eventCenter.trigger(`layout_beforeSwitchTab_${pageId}`, data))
          return await Taro.switchTab({
            url: data,
            success() {
              safeFn(() => Taro.eventCenter.trigger(`layout_switchTab_${pageId}`, data))
            }
          })
      }
    }
  } catch (err) {
    // 小程序页面栈溢出
    if (err.errMsg.indexOf('fail webview count limit exceed') !== -1) {
      return await Taro.redirectTo({
        url: data as string
      })
    }
    // ios与安卓不同
    if (
      err.errMsg.indexOf("a tabbar page") !== -1 ||
      err.errMsg.indexOf("a tab bar page") !== -1
    ) {
      safeFn(() => Taro.eventCenter.trigger(`layout_beforeSwitchTab_${pageId}`, data))
      return await Taro.switchTab({
        url: data as string,
        success() {
          safeFn(() => Taro.eventCenter.trigger(`layout_switchTab_${pageId}`, data))
        }
      })
    }
  }
}

/** 订阅消息 */
export const subscribeMsg = async (tmplIds: string[] = [], pageId: string, templateInfo: any) => {
  const result: string[] = []
  try {
    safeFn(() => Taro.eventCenter.trigger(`layout_beforeSubscribeMsg_${pageId}`, tmplIds, templateInfo))
    const subSuccess = await Taro.requestSubscribeMessage({
      tmplIds
    })
    Object.entries(subSuccess).forEach((item: any) => {
      if (item.includes('accept')) {
        result.push(item[0])
      }
    })
  } catch (err) {
    return []
  }
  safeFn(() => Taro.eventCenter.trigger(`layout_subscribeMsg_${pageId}`, result, templateInfo))
  return result
}

/** rpx to px */
export const rpxTopx = (rpx, deviceWidth?) => {
  return parseInt(String((Number(rpx) / 750) * (deviceWidth || Taro.getSystemInfoSync().windowWidth)))
}

/** px to rpx */
export const pxTorpx = (px, deviceWidth?) => {
  return parseInt(String((Number(px) * 750) / (deviceWidth || Taro.getSystemInfoSync().windowWidth)))
}

/** 媒体类型获取 */
export const matchType = (fileName: any) => {
  // 后缀获取
  let suffix = '';
  // 获取类型结果
  let result: any = '';
  try {
    const flieArr = fileName.split('.');
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = '';
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false;
    return result;
  }
  // 图片格式
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'PNG', 'JPG', 'JPEG', 'BMP', 'GIF'];
  // 进行图片匹配
  result = imglist.some((item) => item === suffix);
  if (result) {
    result = 'image';
    return result;
  }
  // 匹配txt
  const txtlist = ['txt'];
  result = txtlist.some((item) => item === suffix);
  if (result) {
    result = 'txt';
    return result;
  }
  // 匹配 excel
  const excelist = ['xls', 'xlsx'];
  result = excelist.some((item) => item === suffix);
  if (result) {
    result = 'excel';
    return result;
  }
  // 匹配 word
  const wordlist = ['doc', 'docx'];
  result = wordlist.some((item) => item === suffix);
  if (result) {
    result = 'word';
    return result;
  }
  // 匹配 pdf
  const pdflist = ['pdf'];
  result = pdflist.some((item) => item === suffix);
  if (result) {
    result = 'pdf';
    return result;
  }
  // 匹配 ppt
  const pptlist = ['ppt'];
  result = pptlist.some((item) => item === suffix);
  if (result) {
    result = 'ppt';
    return result;
  }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv'];
  result = videolist.some((item) => item === suffix);
  if (result) {
    result = 'video';
    return result;
  }
  // 匹配 音频
  const radiolist = ['mp3', 'wav', 'wmv'];
  result = radiolist.some((item) => item === suffix);
  if (result) {
    result = 'audio';
    return result;
  }
  // 其他 文件类型
  result = 'other';
  return result;
};

/** storage统一处理对象 */
export const storage = {
  get(key: string) {
    return Taro.getStorageSync(key)
  },
  set(key: string, data: any) {
    Taro.setStorageSync(key, isObject(data) ? JSON.stringify(data) : data)
  },
  arrGet(key: string) {
    return JSON.parse(Taro.getStorageSync(key) || "[]")
  },
  arrPush(key: string, data: any, unionKey = "id") {
    let myData: any[] = JSON.parse(Taro.getStorageSync(key) || "[]")
    if (isArray(myData) && data) {
      myData = unionBy(data, myData, unionKey)
    }
    Taro.setStorageSync(key, JSON.stringify(myData))
  },
  arrTimerGet(key: string) {
    let myData = JSON.parse(Taro.getStorageSync(key) || "[]")
    let isNeedSet = false
    myData = myData.filter(item => {
      if (item._timer < Date.now()) {
        isNeedSet = true
        return false
      }
      return true
    })
    if (isNeedSet) {
      Taro.setStorageSync(key, JSON.stringify(myData))
    }
    return myData
  },
  arrTimerPush(key: string, data: any, timer: number, unionKey = "id") {
    let myData: any = JSON.parse(Taro.getStorageSync(key) || "[]")
    if (isArray(myData) && isArray(data)) {
      myData = myData.reduce((pre, cur) => {
        if (!pre.some(x => x[unionKey] === cur[unionKey])) {
          pre.push(cur)
        }
        return pre;
      }, data.map(x => ({ ...x, _timer: Date.now() + timer })))
    }
    Taro.setStorageSync(key, JSON.stringify(myData))
  }
}

/** 根据配置文件获取正确的媒体路径 */
export const getUrl = (url) => {
  if (!url) return url;
  if (startsWith(url, 'http')) {
    return url
  }
  return layout.config.prefix + url
}

/** 样式属性添加important */
export const addButtonImportant = (style: CSSProperties) => {
  if (style.width) {
    if (isNumber(style.width)) {
      style.width = `${style.width}px !important;`
    }
    if (isString(style.width)) {
      style.width = `${style.width} !important;`
    }
  } else {
    style.width = `auto !important`
  }
  return style
}

/** 获取dom元素Id */
export const getDomId = (id) => (layout.config.idPrefix + id)

/** 计算锚点调转中触发置顶 */
const beforePageScroll = (scrollTop, topData) => {
  let updateHeight: number = 0
  topData?.forEach(item => {
    const startScrollTop = item?.startScrollTop || 0
    const endScrollTop = item?.endScrollTop || 0
    if (
      scrollTop >= startScrollTop &&
      (scrollTop < endScrollTop || endScrollTop === 0) &&
      !item.fixed
    ) {
      if (item.placeholder) {
        updateHeight = updateHeight + (item.height || 0)
      }
    }
    if (
      ((scrollTop > endScrollTop && endScrollTop !== 0) ||
        scrollTop < startScrollTop) &&
      item.fixed
    ) {
      if (item.placeholder) {
        updateHeight = updateHeight - (item.height || 0)
      }
    }
  })
  return updateHeight
}

/** 解析路由 */
const parsingRoute = async (data: Edit.IActionRoute, pageId: string, routerParams) => {
  if (!data) return true
  // 小程序内部页面跳转
  if (data.value === 'APPLETWITHIN') {
    return await to(addParams(data.appletWithin?.path, routerParams), 'navigateTo', pageId)
  }
  // 小程序外部页面跳转
  if (data.value === 'APPLETOUTSIDE') {
    // 视频号相关操作
    if (data.appletOutside?.value === 'LIVEVIDEO' && process.env.TARO_ENV === 'weapp') {
      const exludeErrerMsg = ['openChannelsLive:fail cancel']
      // 预约视频号直播
      if (data.appletOutside?.channel?.value === 'reserveChannelsLive') {
        return await Taro.getChannelsLiveNoticeInfo({
          finderUserName: data.appletOutside?.channel?.noticeId,
          async success(res: any) {
            return await Taro.reserveChannelsLive({
              noticeId: res?.noticeId
            })
          },
          async fail(err) {
            // Taro.showModal({
            //   content: err.errMsg
            // })
            return await Taro.openChannelsLive({
              finderUserName: data.appletOutside?.channel?.finderUserName,
              feedId: data.appletOutside?.channel?.feedId,
              fail(err) {
                if (!exludeErrerMsg.includes(err.errMsg)) {
                  Taro.showModal({
                    content: err.errMsg
                  })
                }
              }
            })
          }
        })
      }
      // 打开视频号主页
      if (data.appletOutside?.channel?.value === 'openChannelsUserProfile') {
        return await Taro.openChannelsUserProfile({
          finderUserName: data.appletOutside?.channel?.finderUserName,
          fail(err) {
            if (!exludeErrerMsg.includes(err.errMsg)) {
              Taro.showModal({
                content: err.errMsg
              })
            }
          }
        })
      }
      // 打开视频号直播
      if (data.appletOutside?.channel?.value === 'openChannelsLive') {
        return await Taro.openChannelsLive({
          finderUserName: data.appletOutside?.channel?.finderUserName,
          feedId: data.appletOutside?.channel?.feedId,
          fail(err) {
            if (!exludeErrerMsg.includes(err.errMsg)) {
              Taro.showModal({
                content: err.errMsg
              })
            }
          }
        })
      }
      // 打开视频号活动页
      if (data.appletOutside?.channel?.value === 'openChannelsEvent') {
        return await Taro.openChannelsEvent({
          finderUserName: data.appletOutside?.channel?.finderUserName,
          eventId: data.appletOutside?.channel?.eventId,
          fail(err) {
            if (!exludeErrerMsg.includes(err.errMsg)) {
              Taro.showModal({
                content: err.errMsg
              })
            }
          }
        })
      }
      // 打开视频号视频
      if (data.appletOutside?.channel?.value === 'openChannelsActivity') {
        return await Taro.openChannelsActivity({
          finderUserName: data.appletOutside?.channel?.finderUserName,
          feedId: data.appletOutside?.channel?.feedId,
          fail(err) {
            if (!exludeErrerMsg.includes(err.errMsg)) {
              Taro.showModal({
                content: err.errMsg
              })
            }
          }
        })
      }
    }
    // 其他小程序
    if (data.appletOutside?.value === 'OTHERAPPLET' && process.env.TARO_ENV === 'weapp') {
      return await to(data.appletOutside?.other, 'navigateToMiniProgram', pageId)
    }
    // 其他App --- 暂不支持
    if (data.appletOutside?.value === 'OTHERAPP' && process.env.TARO_ENV === 'weapp') {
    }
    // 关闭小程序
    if (data.appletOutside?.value === 'EXITAPPLET' && process.env.TARO_ENV === 'weapp') {
      return await to('', 'exitMiniProgram', pageId)
    }
  }
  // 小程序当前页面跳转
  if (data.value === 'PAGE') {
    storage.set('isRoutePage', true)
    if (!isNil(data.page?.componentsId)) {
      const layoutElevators = storage.arrGet(`layout_elevators_${pageId}`)
      const layoutTopData = storage.arrGet(`layout_topData_${pageId}`)
      const layoutNavHeightPxNum = Number(storage.get(`layout_navHeightPxNum_${pageId}`) || "0")
      const elevators = layoutElevators.find(x => x.id === data.page?.componentsId)
      let updateHeight = 0
      if (layoutTopData.length > 0) {
        updateHeight = beforePageScroll(elevators?.top + layoutNavHeightPxNum, layoutTopData)
      }
      if (elevators) {
        return await Taro.pageScrollTo({
          scrollTop: elevators?.top - (updateHeight || 0),
          success() {
            setTimeout(() => {
              storage.set('isRoutePage', false)
            }, 100)
          }
        })
      }
      return await Taro.pageScrollTo({
        selector: `#${getDomId(data.page?.componentsId)}`,
        success() {
          setTimeout(() => {
            storage.set('isRoutePage', false)
          }, 100)

        }
      })
    }
    if (!isNil(data.page?.specifyHeight)) {
      return await Taro.pageScrollTo({
        scrollTop: Number(data.page?.specifyHeight),
        success() {
          setTimeout(() => {
            storage.set('isRoutePage', false)
          }, 100)
        }
      })
    }
    storage.set('isRoutePage', false)
  }
  return true
}

/** 解析样式 */
const parsingStyle = async (data: Edit.IActionStyle[] = [], pageId: string) => {
  if (data.length > 0) {
    store.setStyle(data.map((x: Edit.IActionStyle) => {
      return {
        key: x.id,
        value: getBaseStyle(x.update, true)
      }
    }), pageId)
  }
  return true
}

/** 解析接口 */
const parsingInterfaces = async (data: Edit.IActionInterfaces, pageId: string, templateInfo, actionName) => {
  try {
    if (['get', 'delete'].includes(data.method)) {
      const result = await http[data.method](data.url)
      if (result.status === 200) {
        if (data.successMsg) {
          Taro.showModal({
            content: data.successMsg
          })
        }
        safeFn(() => Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`, {
          success: true,
          request: data,
          response: result,
          actionName
        }, templateInfo))
      } else {
        safeFn(() => Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`, {
          success: false,
          request: data,
          response: result,
          actionName
        }, templateInfo))
      }
      return true
    } else if (['post', 'put'].includes(data.method)) {
      let body = null
      try {
        body = JSON.parse(data.data)
      } catch (err) { }
      const result = await http[data.method](data.url, body)
      if (result.status === 200) {
        if (data.successMsg) {
          Taro.showModal({
            content: data.successMsg
          })
        }
        safeFn(() => Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`, {
          success: true,
          request: data,
          response: result,
          actionName
        }, templateInfo))
      } else {
        safeFn(() => Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`, {
          success: false,
          request: data,
          response: result,
          actionName
        }, templateInfo))
      }
      return true
    }
  } catch {
    return false
  }
  return true
}

/** 解析微信相关 */
const parsingOpenWx = async (data: Edit.IActionOpenWx, pageId, templateInfo) => {
  if (data?.openType === 'subscribe') {
    return await subscribeMsg(data.subscribeTmpIds, pageId, templateInfo)
  }
  if (data?.openType === 'getUserProfile') {
    return await Taro.getUserProfile({ lang: 'zh_CN', desc: '用于完善会员资料' })
  }
  if (data?.openType === 'share') {
    safeFn(() => Taro.eventCenter.trigger(`layout_share_${pageId}`, data?.share))
    return true
  }
  if (data?.openType === 'qyContact') {
    return await Taro.openCustomerServiceChat({
      extInfo: { url: data?.contact?.url as string },
      corpId: data?.contact?.corpId as string,
      showMessageCard: data?.contact.show,
      sendMessageTitle: data?.contact.title,
      sendMessagePath: data?.contact.path,
      sendMessageImg: data?.contact.imageUrl,
      fail(err) {
        Taro.showModal({
          content: err.errMsg
        })
      }
    })
  }
  return true
}

/** 解析元组件属性 */
const parsingComponet = async (data: Edit.IActionComponent[], pageId) => {
  if (data?.length > 0) {
    const myData = data.reduce((pre: [Edit.IActionComponent[], Edit.IActionComponent[]], cur: Edit.IActionComponent) => {
      if (cur.type === 'videoCtx') {
        pre[1].push(cur)
      } else {
        pre[0].push(cur)
      }
      return pre
    }, [[], []])
    if (myData[0].length > 0) {
      store.setCom(myData[0].map(x => getBaseComponent(x)), pageId)
    }
    if (myData[1].length > 0) {
      myData[1].forEach((x: Edit.IActionComponent) => {
        const ctx = Taro.createVideoContext(getDomId(x.id))
        if (ctx) {
          switch (x.videoCtx?.type) {
            case 'play':
            case 'pause':
            case 'stop':
            case 'showStatusBar':
            case 'hideStatusBar':
            case 'requestFullScreen':
            case 'exitFullScreen':
            case 'requestBackgroundPlayback':
            case 'exitBackgroundPlayback':
            case 'exitPictureInPicture':
              ctx[x.videoCtx?.type]({})
              break;
            case 'requestFullScreenAndPlay':
              ctx.requestFullScreen({})
              ctx.play()
              break;
            case 'playbackRate':
              ctx[x.videoCtx?.type](x.videoCtx?.rate)
              break;
            case 'seek':
              ctx[x.videoCtx?.type](x.videoCtx?.position)
              break;
            case 'sendDanmu':
              ctx[x.videoCtx?.type](x.videoCtx?.danmu)
              break;
            default:
              console.error("当前videoCtx未配置正确的实例方法")
              break;
          }
        }
      })
    }
  }
  return true
}

/** 解析弹窗 */
const parsingPopup = async (data: Edit.IActionPopup, pageId, templateInfo) => {
  if (data) {
    store.setPopup({
      key: pageId,
      value: {
        ...data, templateInfo: templateInfo?.component || {}
      }
    })
  }
}

/** 解析自定义Action */
const parsingCustom = async (data: Edit.IActionCustom, pageId, templateInfo) => {
  if (data?.code) {
    return safeFn(() => Taro.eventCenter.trigger(`layout_customAction_${pageId}`, data, templateInfo))
  }
  return true
}

/** 解析业务 */
const parsingBusiness = async (data: Edit.IActionBusiness, pageId, templateInfo, routerParams) => {
  if (data?.actions?.length > 0) {
    parsingActions(data.actions, pageId, templateInfo, routerParams)
  }
}

/** 解析动作 */
const parsingAction = async (action: Edit.IActions, pageId, templateInfo, routerParams) => {
  if (action?.actionType?.value === 'ROUTE') {
    return parsingRoute(action?.actionType?.route, pageId, routerParams)
  }
  if (action?.actionType?.value === 'STYLE') {
    return parsingStyle(action?.actionType?.style, pageId)
  }
  if (action?.actionType?.value === 'INTERFACES') {
    return parsingInterfaces(action?.actionType?.interfaces, pageId, templateInfo, action.actionName)
  }
  if (action?.actionType?.value === 'OPENWX') {
    return parsingOpenWx(action?.actionType?.openwx, pageId, templateInfo)
  }
  if (action?.actionType?.value === 'COMPONENT') {
    return parsingComponet(action?.actionType?.component, pageId)
  }
  if (action?.actionType?.value === 'POPUP') {
    return parsingPopup(action?.actionType.popup, pageId, templateInfo)
  }
  if (action?.actionType?.value === 'CUSTOM') {
    return parsingCustom(action?.actionType.custom, pageId, templateInfo)
  }
  if (action?.actionType?.value === 'BUSINESS') {
    return parsingBusiness(action?.actionType.business, pageId, templateInfo, routerParams)
  }
  return false
}

/** 解析Action合集数据 */
export const parsingActions = async (actions: Edit.IActions[], pageId, templateInfo, routerParams = []) => {
  actions.forEach(async item => {
    const isToNext = await parsingAction(item, pageId, templateInfo, routerParams)
    if (isToNext && item?.actionFallbackQueue?.length > 0) {
      parsingActions(item?.actionFallbackQueue, pageId, templateInfo, routerParams)
    }
  })
}

export const getWxButtonByEvent = (event?: Edit.IEvent) => {
  if (!event || event?.actions?.length === 0) return null;
  let result: any = null
  event.actions.forEach(item => {
    if (item?.actionType?.value === 'OPENWX') {
      if (item?.actionType?.openwx?.openType === 'share') {
        result = { ...item?.actionType?.openwx.share || {}, openType: item?.actionType?.openwx.openType }
      }
      if (item?.actionType?.openwx?.openType === 'contact') {
        result = { ...item?.actionType?.openwx.contact || {}, openType: item?.actionType?.openwx.openType }
      }
    }
  })
  return result
}

const getTempInfoById = (components, id) => {
  if (components?.length > 0) {
    let tempInfo: any = null
    let result = false
    const checkIsChild = (list) => {
      for (let x = 0; x < list.length; x++) {
        if (list[x].children?.length > 0) {
          checkIsChild(list[x].children)
        }
        if (id === list[x].id) {
          result = true
          break;
        }
      }
      return result
    }
    for (let i = 0; i < components.length; i++) {
      const isChild = checkIsChild(components[i].data)
      if (isChild) {
        tempInfo = {
          name: components[i].name,
          code: components[i].templateCode,
          index: i
        }
        break;
      }
    }
    return tempInfo
  }
  return null
}

const getTempInfoByHotId = (components, hotId) => {
  if (components?.length > 0) {
    let tempInfo: any = null
    let result = false
    const checkIsChild = (list) => {
      for (let x = 0; x < list.length; x++) {
        if (list[x].hot?.some(y => y.id === hotId)) {
          result = true
          break;
        }
      }
      return result
    }
    for (let i = 0; i < components.length; i++) {
      const isChild = checkIsChild(components[i].data)
      if (isChild) {
        tempInfo = {
          name: components[i].name,
          code: components[i].templateCode,
          index: i
        }
        break;
      }
    }
    return tempInfo
  }
  return null
}

export const computedEventData = (pageData, eventData) => {
  let tempInfo: any = null
  let popup = false
  if (eventData.componentType === 'plane') {
    if (eventData.id && !eventData.hot?.id) {
      tempInfo = getTempInfoById(pageData?.components.plane, eventData.id)
    } else if (!eventData.id && eventData.hot?.id) {
      tempInfo = getTempInfoByHotId(pageData?.components.plane, eventData.hot?.id)
    }
  }
  if (eventData.componentType === 'window') {
    if (eventData.id && !eventData.hot?.id) {
      tempInfo = getTempInfoById(pageData?.components.window, eventData.id)
    } else if (!eventData.id && eventData.hot?.id) {
      tempInfo = getTempInfoByHotId(pageData?.components.window, eventData.hot?.id)
    }
  }
  if (eventData.componentType === 'popup') {
    popup = true
  }
  if (!eventData.componentType) {
    tempInfo = {
      hot: eventData.hot
    }
  }
  return {
    id: eventData.id || eventData.hot?.id,
    page: {
      code: pageData.code,
      name: pageData.name
    },
    template: {
      type: eventData?.componentType,
      code: tempInfo?.code,
      name: tempInfo?.name,
      index: tempInfo?.index,
      hot: eventData.hot ? omit(eventData.hot, 'event') : eventData.hot,
      popup
    },
    event: eventData?.event,
    e: eventData?.e
  }
}

export const getLiveActive = (liveStatus, data) => {
  let result = null
  switch (liveStatus) {
    case 101:
      result = data.find(x => x.type === 'live')
      break;
    case 102:
      result = data.find(x => x.type === 'unstart')
      break
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
      result = data.find(x => x.type === 'end')
      break;
  }
  return result
}

export const getLiveStatus = (startTime, endTime) => {
  if (isBeforeValidTime(startTime)) {
    return 102
  }
  if (isValidTime([startTime, endTime])) {
    return 101
  }
  if (!isBeforeValidTime(endTime)) {
    return 107
  }
}

export const getLiveStatusByChannel = (channelStatus) => {
  if (channelStatus === 2) {
    return 101
  }
  if (channelStatus === 3) {
    return 107
  }
  return 102
}

export const getHotStyle = (hotValue: string[], res: CSSProperties = {}): CSSProperties => {
  return {
    position: 'absolute',
    width: Taro.pxTransform(parseInt(hotValue[0], 10)),
    height: Taro.pxTransform(parseInt(hotValue[1], 10)),
    top: Taro.pxTransform(parseInt(hotValue[2], 10)),
    left: Taro.pxTransform(parseInt(hotValue[3], 10)),
    ...res
  }
}

/** 时间格式化-带时区 */
export const formatDateTime = (date, num = 3, interval = '-') => {
  if (!date) { return date }
  const arr = date.split("T");
  const d = arr[0];
  const darr = d.split('-');
  const t = arr[1];
  const tarr = t.split('+');
  const marr = tarr[0].split(':');
  const tzone = Number(tarr[1].substr(0, 2))
  const dd = parseInt(darr[0]) + "/" + parseInt(darr[1]) + "/" + parseInt(darr[2]) + " " + parseInt(marr[0]) + ":" + parseInt(marr[1]) + ":" + parseInt(marr[2]);
  let time = new Date(Date.parse(dd));
  time.setTime(time.setHours(time.getHours() + (8 - tzone)));
  let Y = time.getFullYear() + interval;
  const addZero = (num) => num < 10 ? '0' + num : num;
  let M = addZero(time.getMonth() + 1) + interval;
  let D = addZero(time.getDate());
  let h = ' ' + addZero(time.getHours());
  let m = ':' + addZero(time.getMinutes());
  let s = ':' + addZero(time.getSeconds());
  let result = Y + M + D
  switch (num) {
    case 4:
      result = Y + M + D + h
      break;
    case 5:
      result = Y + M + D + h + m
      break;
    case 6:
      result = Y + M + D + h + m + s
      break;
  }
  return result;
}

/** 是否在有效期内 */
export const isValidTime = (data) => {
  let result = true
  if (!data || data.length === 0) {
    return result
  }
  if (data.length === 2) {
    if (data[0] && !data[1]) {
      const start = new Date(formatDateTime(data[0], 6, '/')).getTime()
      const now = Date.now()
      if (now < start) {
        result = false
      }
    } else if (!data[0] && data[1]) {
      const end = new Date(formatDateTime(data[1], 6, '/')).getTime()
      const now = Date.now()
      if (now > end) {
        result = false
      }
    } else {
      const start = new Date(formatDateTime(data[0], 6, '/')).getTime()
      const end = new Date(formatDateTime(data[1], 6, '/')).getTime()
      const now = Date.now()
      if (now < start || now > end) {
        result = false
      }
    }
  }
  return result
}

/** 是否在某个时间之前 */
export const isBeforeValidTime = (time: string) => {
  if (!time) {
    return false
  }
  return new Date(formatDateTime(time, 6, '/')).getTime() > Date.now()
}

/** 计算时间差 */
export const durationFormatter = (time) => {
  if (!time) return { ss: 0 };
  let t = time;
  const ss = t % 60;
  t = (t - ss) / 60;
  if (t < 1) return { ss: Math.floor(ss) };
  const mm = t % 60;
  t = (t - mm) / 60;
  if (t < 1) return { mm: Math.floor(mm), ss: Math.floor(ss) };
  const hh = t % 24;
  t = (t - hh) / 24;
  if (t < 1) return { hh: Math.floor(hh), mm: Math.floor(mm), ss: Math.floor(ss) };
  const dd = t;
  return { dd: Math.floor(dd), hh: Math.floor(hh), mm: Math.floor(mm), ss: Math.floor(ss) };
}

/** 防抖 */
export const debounce = function (fn, wait, immediate) {
  let timer;
  return function () {
    if (immediate) {
      immediate = !immediate; // 取个反
      fn.apply(this, arguments);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait)
  }
};

/** 节流 */
export const throttle = function (fn, rateTime) {
  let timer: any = null
  return function (this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null;
      }, rateTime)
    }
  }
}










