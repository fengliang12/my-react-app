// @ts-nocheck
import Taro from '@tarojs/taro'
import {
  cloneDeep,
  isArray,
  isBoolean,
  isFunction,
  isNaN,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
  mapValues,
  merge,
  omit,
  pickBy,
  startsWith,
  unionBy,
  get,
  endsWith,
  difference,
  replace,
  uniq
} from 'lodash-es'
import type { CSSProperties } from 'react'

import http from './api/axios'
import { sendScribeRecord, checkScribeRecord } from './api/index'
import { layout } from './config/index'
import { store, pageStore, appStore } from './store/index'


let myTabHeight = 0

export function computeSize(size: number | string | undefined): any {
  if (!isUndefined(size)) {
    if (typeof size === 'string') {
      if (size.indexOf('calc') !== -1) {
        return size
      }
      if (size === '100vw') {
        size = '750px'
      }
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
export const getReactStyle = (style, tabHeight?: number): CSSProperties => {
  if (tabHeight) {
    myTabHeight = tabHeight
  }
  let cssStyle: CSSProperties = mapValues(style, (value, key) => {
    if (key === 'transform') {
      return computeTransform(value)
    }
    if (startsWith(value, 'systemInfo')) {
      return get(appStore, value)
    }
    if (isString(value) && value.indexOf('100vh') !== -1 && myTabHeight) {
      if (startsWith(value, 'calc')) {
        return replace(value, ')', ` - ${myTabHeight}px)`)
      } else {
        return `calc(${value} - ${myTabHeight}px)`;
      }
    }
    return computeSize(value)
  })
  return pickBy(cssStyle, (value) => !isNil(value))
}

/** 解析Style数据 */
export const getBaseStyle = (style, options?: { tabHeight?: number, noBorderBox?: Boolean }): CSSProperties => {
  let cssStyle: CSSProperties = {}
  if (style) {
    // 盒模型数据
    if (style.boxModel) {
      let {
        width,
        height,
        padding,
        margin,
        paddingLeft,
        paddingTop,
        paddingBottom,
        paddingRight,
        marginBottom,
        marginRight,
        marginLeft,
        marginTop,
        borderWidth
      } = style.boxModel
      width = computeSize(style.boxModel.width)
      height = computeSize(style.boxModel.height)
      padding = computeSize(style.boxModel.padding)
      margin = computeSize(style.boxModel.margin)
      paddingLeft = computeSize(style.boxModel.paddingLeft)
      paddingRight = computeSize(style.boxModel.paddingRight)
      paddingTop = computeSize(style.boxModel.paddingTop)
      paddingBottom = computeSize(style.boxModel.paddingBottom)
      marginBottom = computeSize(style.boxModel.marginBottom)
      marginRight = computeSize(style.boxModel.marginRight)
      marginLeft = computeSize(style.boxModel.marginLeft)
      marginTop = computeSize(style.boxModel.marginTop)
      borderWidth = computeSize(style.boxModel.borderWidth)
      cssStyle = {
        ...cssStyle,
        ...style.boxModel,
        padding,
        margin,
        width,
        height,
        marginTop,
        marginLeft,
        marginRight,
        marginBottom,
        paddingBottom,
        paddingLeft,
        paddingTop,
        paddingRight,
        borderWidth
      }
    }
    // 定位数据
    if (style.position) {
      let { top, left, bottom, right, position } = style.position
      top = computeSize(style.position.top)
      left = computeSize(style.position.left)
      bottom = computeSize(style.position.bottom)
      right = computeSize(style.position.right)
      cssStyle = {
        ...cssStyle,
        ...style.position,
        position,
        top,
        left,
        bottom,
        right
      }
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
      let {
        borderRadius,
        borderTopRightRadius,
        borderTopLeftRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        transform
      } = style.common
      borderRadius = computeSize(style.common.borderRadius)
      borderTopRightRadius = computeSize(style.common.borderTopRightRadius)
      borderTopLeftRadius = computeSize(style.common.borderTopLeftRadius)
      borderBottomLeftRadius = computeSize(style.common.borderBottomLeftRadius)
      borderBottomRightRadius = computeSize(style.common.borderBottomRightRadius)
      transform = computeTransform(style.common.transform)
      cssStyle = {
        ...cssStyle,
        ...style.common,
        borderRadius,
        borderTopRightRadius,
        borderTopLeftRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        transform
      }
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
    if (style.reactStyle) {
      cssStyle = merge(cssStyle, getReactStyle(style.reactStyle, options?.tabHeight))
    }
    // 默认盒模型都是BorderBox
    if (!cssStyle.boxSizing && !options?.noBorderBox) {
      cssStyle.boxSizing = 'border-box'
    }
  }
  return pickBy(cssStyle, (value) => value === 0 || !isNil(value))
}

/** 解析Component属性 */
export const getBaseComponent = (actionCom, pageId?: string) => {
  if (!actionCom?.type) return {}
  let result: { key: string; value: any; type: any } | null = null
  if (actionCom.type === 'swiperView') {
    let nowVal = store.updateCom.current.get(`${pageId}_${actionCom.id}`) ?? 0
    if (actionCom.current?.value === 'last') {
      if (nowVal > 0) {
        result = {
          key: actionCom.id,
          value: nowVal - 1,
          type: 'current'
        }
      } else if (actionCom.current?.circular && nowVal === 0) {
        result = {
          key: actionCom.id,
          value: actionCom.current?.count - 1,
          type: 'current'
        }
      }
    } else if (actionCom.current?.value === 'next') {
      if (nowVal < actionCom.current?.count - 1) {
        result = {
          key: actionCom.id,
          value: nowVal + 1,
          type: 'current'
        }
      } else if (actionCom.current?.circular && nowVal === actionCom.current?.count - 1) {
        result = {
          key: actionCom.id,
          value: 0,
          type: 'current'
        }
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
      value: actionCom.offset.id ? getDomId(actionCom.offset.id) : `${actionCom.offset.number}rpx`,
      type: 'offset'
    }
  }
  if (actionCom.type === 'text') {
    let txt = actionCom.nodes
    if (startsWith(txt, 'swiperCurrent_')) {
      const swiperId = replace(txt, 'swiperCurrent_', '')
      txt = (get(store.updateCom.current, `${pageId}_${swiperId}`) ?? 0) + 1
    }
    result = {
      key: actionCom.id,
      value: txt + '',
      type: 'nodes'
    }
  }
  if (actionCom.type === 'view') {
    result = {
      key: actionCom.id,
      value: actionCom.value,
      type: 'catchMove'
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
        if (!data.shortLink) {
          data = omit(data, ['shortLink'])
        }
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
  } catch (err: any) {
    // 小程序页面栈溢出
    if (err.errMsg.indexOf('fail webview count limit exceed') !== -1) {
      return await Taro.redirectTo({
        url: data as string
      })
    }
    // ios与安卓不同
    if (err.errMsg.indexOf('a tabbar page') !== -1 || err.errMsg.indexOf('a tab bar page') !== -1) {
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
export const subscribeMsg = async (
  templateIds: string[] = [],
  subscribeRecord: any,
  pageId: string,
  templateInfo: any
) => {
  let [result, tmplIds, resultObj, filterTemp]: any = [
    [],
    templateIds,
    { accept: [], reject: [], ban: [], filter: [] },
    []
  ]
  try {
    if (subscribeRecord?.open) {
      tmplIds = subscribeRecord?.subscribeIds?.map((x) => {
        const obj = JSON.parse(x)
        return obj.templateId
      })
    }
    if (subscribeRecord?.checkSub) {
      const checkResult = await checkScribeRecord(
        subscribeRecord?.subscribeIds?.reduce((pre, cur) => {
          const obj = JSON.parse(cur)
          pre.push({
            subscribeId: obj.id,
            stage: subscribeRecord?.stage
          })
          return pre
        }, [])
      )
      filterTemp = checkResult?.data?.filter((x) => x.subscribe).map((x) => x.subscribeId)
      tmplIds = subscribeRecord?.subscribeIds
        ?.filter((x) => {
          const obj = JSON.parse(x)
          return !filterTemp.includes(obj.id)
        })
        .map((x) => {
          const obj = JSON.parse(x)
          return obj.templateId
        })
    }
    safeFn(() =>
      Taro.eventCenter.trigger(`layout_beforeSubscribeMsg_${pageId}`, tmplIds, templateInfo)
    )
    if (tmplIds?.length > 0) {
      const subSuccess = await Taro.requestSubscribeMessage({
        tmplIds
      })
      Object.entries(subSuccess).forEach((item: any) => {
        if (item.includes('accept')) {
          result.push(item[0])
          resultObj.accept.push(item[0])
        }
        if (item.includes('reject')) {
          resultObj.reject.push(item[0])
        }
        if (item.includes('ban')) {
          resultObj.ban.push(item[0])
        }
        if (item.includes('filter')) {
          resultObj.filter.push(item[0])
        }
      })
    }
    if (result?.length > 0 && subscribeRecord?.open) {
      sendScribeRecord(
        subscribeRecord?.subscribeIds?.reduce((pre, cur) => {
          const obj = JSON.parse(cur)
          if (result?.includes(obj.templateId)) {
            pre.push({
              subscribeId: obj.id,
              stage: subscribeRecord?.stage
            })
          }
          return pre
        }, [])
      )
    }
  } catch (err) {
    return []
  }
  safeFn(() =>
    Taro.eventCenter.trigger(`layout_subscribeMsg_${pageId}`, result, templateInfo, resultObj)
  )
  return result
}

/** rpx to px */
export const rpxTopx = (rpx, deviceWidth?) => {
  return parseInt(
    String((Number(rpx) / 750) * (deviceWidth || (appStore?.systemInfo?.windowWidth || Taro.getSystemInfoSync?.()?.windowWidth)))
  )
}

/** px to rpx */
export const pxTorpx = (px, deviceWidth?) => {
  return parseInt(
    String((Number(px) * 750) / (deviceWidth || (appStore?.systemInfo?.windowWidth || Taro.getSystemInfoSync?.()?.windowWidth)))
  )
}

/** 媒体类型获取 */
export const matchType = (fileName: any) => {
  // 后缀获取
  let suffix = ''
  // 获取类型结果
  let result: any = ''
  try {
    const flieArr = fileName.split('.')
    suffix = flieArr[flieArr.length - 1]
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }
  // 图片格式
  const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'PNG', 'JPG', 'JPEG', 'BMP', 'GIF']
  // 进行图片匹配
  result = imglist.some((item) => item === suffix)
  if (result) {
    result = 'image'
    return result
  }
  // 匹配txt
  const txtlist = ['txt']
  result = txtlist.some((item) => item === suffix)
  if (result) {
    result = 'txt'
    return result
  }
  // 匹配 excel
  const excelist = ['xls', 'xlsx']
  result = excelist.some((item) => item === suffix)
  if (result) {
    result = 'excel'
    return result
  }
  // 匹配 word
  const wordlist = ['doc', 'docx']
  result = wordlist.some((item) => item === suffix)
  if (result) {
    result = 'word'
    return result
  }
  // 匹配 pdf
  const pdflist = ['pdf']
  result = pdflist.some((item) => item === suffix)
  if (result) {
    result = 'pdf'
    return result
  }
  // 匹配 ppt
  const pptlist = ['ppt']
  result = pptlist.some((item) => item === suffix)
  if (result) {
    result = 'ppt'
    return result
  }
  // 匹配 视频
  const videolist = ['mp4', 'm2v', 'mkv']
  result = videolist.some((item) => item === suffix)
  if (result) {
    result = 'video'
    return result
  }
  // 匹配 音频
  const radiolist = ['mp3', 'wav', 'wmv']
  result = radiolist.some((item) => item === suffix)
  if (result) {
    result = 'audio'
    return result
  }
  // 其他 文件类型
  result = 'other'
  return result
}

/** storage统一处理对象 */
export const storage = {
  get(key: string) {
    return Taro.getStorageSync(key)
  },
  set(key: string, data: any) {
    Taro.setStorageSync(key, isObject(data) ? JSON.stringify(data) : data)
  },
  arrGet(key: string) {
    return JSON.parse(Taro.getStorageSync(key) || '[]')
  },
  arrPush(key: string, data: any, unionKey = 'id') {
    let myData: any[] = JSON.parse(Taro.getStorageSync(key) || '[]')
    if (isArray(myData) && data) {
      myData = unionBy(data, myData, unionKey)
    }
    Taro.setStorageSync(key, JSON.stringify(myData))
  },
  arrAdd(key: string, data: any) {
    let myData: any[] = JSON.parse(Taro.getStorageSync(key) || '[]')
    if (isArray(myData) && data) {
      myData.push(data)
    }
    Taro.setStorageSync(key, JSON.stringify(myData))
  },
  arrTimerGet(key: string) {
    let myData = JSON.parse(Taro.getStorageSync(key) || '[]')
    let isNeedSet = false
    myData = myData.filter((item) => {
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
  arrTimerPush(key: string, data: any, timer: number, unionKey = 'id') {
    let myData: any = JSON.parse(Taro.getStorageSync(key) || '[]')
    if (isArray(myData) && isArray(data)) {
      myData = myData.reduce(
        (pre, cur) => {
          if (!pre.some((x) => x[unionKey] === cur[unionKey])) {
            pre.push(cur)
          }
          return pre
        },
        data.map((x) => ({ ...x, _timer: Date.now() + timer }))
      )
    }
    Taro.setStorageSync(key, JSON.stringify(myData))
  }
}

/** 根据配置文件获取正确的媒体路径 */
export const getUrl = (url) => {
  if (!url) return url
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
export const getDomId = (id) => layout.config.idPrefix + id

/** 计算锚点调转中触发置顶 */
const beforePageScroll = (scrollTop, topData) => {
  let updateHeight: number = 0
  topData?.forEach((item) => {
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
    if (item.fixed) {
      if (item.placeholder) {
        updateHeight = updateHeight + (item.height || 0)
      }
    }
  })
  return updateHeight
}

/** 接口参数注入 */
const setInterfaceParams = (iData, inject) => {
  let interfaceData = cloneDeep(iData)
  let { url, data } = interfaceData
  inject?.forEach((item) => {
    if (item.type === 'path') {
      const paths = url.split('?')
      const pathArr = paths?.[0]?.split('/')
      item.rule?.forEach((x) => {
        const index = pathArr?.indexOf(x.key)
        if (index !== -1) {
          pathArr[index + (x.offset ?? 0)] = x.value
        }
      })
      paths[0] = pathArr.join('/')
      url = paths.join('?')
    }
    if (item.type === 'query') {
      const paths = url.split('?')
      url = paths.join('?')
      if (!paths[1]) {
        const list: any = []
        item.rule?.forEach((x) => {
          list.push(`${x.key}=${x.value}`)
        })
        paths[1] = list.join('&')
      } else {
        const queryStrArr = paths[1]?.split('&')
        let matchKey: string[] = []
        queryStrArr?.forEach((x, i) => {
          let kvStrArr = x?.split('=')
          item.rule?.forEach((y) => {
            if (y.key === kvStrArr[0]) {
              kvStrArr[1] = y.value
              matchKey.push(y.key)
            }
          })
          queryStrArr[i] = kvStrArr.join('=')
        })
        const noMatchRule = item.rule?.filter((y) => !matchKey.includes(y.key))
        if (noMatchRule.length >= 0) {
          noMatchRule?.forEach((z) => {
            queryStrArr.push(`${z.key}=${z.value}`)
          })
        }
        paths[1] = queryStrArr.join('&')
      }
      url = paths.join('?')
    }
    if (item.type === 'body') {
      let body = {}
      try {
        body = JSON.parse(data)
      } catch (err) { }
      item.rule?.forEach((x) => {
        body[x.key] = x.value
      })
      data = JSON.stringify(body)
    }
  })
  interfaceData.url = url
  interfaceData.data = data
  return interfaceData
}

/** 是否是企业微信环境或者微信环境 */
const isWxOrQyWx = () => ['weapp', 'qywx'].includes(process.env.TARO_ENV)

/** 解析路由 */
const parsingRoute = async (data: Edit.IActionRoute, pageId: string, templateInfo, layoutData) => {
  if (!data) return true
  // 小程序内部页面跳转
  if (data.value === 'APPLETWITHIN') {
    let path = data.appletWithin?.path
    if (layoutData.dynamicInfo) {
      path = replace(path, layoutData.dynamicInfo.key, layoutData.dynamicInfo.value + '')
    }
    path = replaceStrTemplate(path, get(pageStore, pageId))
    path = addParams(path, layoutData.routerParams)
    const routeActionsRef = get(store.ref, `${pageId}.routeActions`)
    if (routeActionsRef?.data?.length) {
      parsingActions(routeActionsRef?.data, pageId, templateInfo, layoutData)
    }
    const routeRuleActionRef = get(store.ref, `${pageId}.routeRuleAction`)
    if (routeRuleActionRef?.data?.length) {
      const actions = []
      routeRuleActionRef.data.forEach((item) => {
        if (item.rule) {
          const { type, key, include, exclude } = item.rule
          if (type === 'current') {
            const val = store.updateCom.current.get(`${pageId}_${key}`) ?? 0
            if (include && include.indexOf(val) !== -1) {
              actions.push(...(item.actions ?? []))
            }
            if (exclude && exclude.indexOf(val) === -1) {
              actions.push(...(item.actions ?? []))
            }
          }
        } else {
          actions.push(...(item.actions ?? []))
        }
      })
      if (actions?.length) {
        parsingActions(actions, pageId, templateInfo, layoutData)
      }
    }
    return await to(path, 'navigateTo', pageId)
  }
  // 小程序外部页面跳转
  if (data.value === 'APPLETOUTSIDE') {
    // 视频号相关操作
    if (data.appletOutside?.value === 'LIVEVIDEO' && isWxOrQyWx()) {
      const exludeErrerMsg = 'fail cancel'
      // 预约视频号直播
      if (data.appletOutside?.channel?.value === 'reserveChannelsLive') {
        return await Taro.getChannelsLiveNoticeInfo({
          finderUserName: data.appletOutside?.channel?.noticeId,
          async success(res: any) {
            return await Taro.reserveChannelsLive({
              noticeId: res?.noticeId
            })
          },
          async fail() {
            return await Taro.openChannelsLive({
              finderUserName: data.appletOutside?.channel?.finderUserName,
              feedId: data.appletOutside?.channel?.feedId,
              fail(err) {
                if (err.errMsg.indexOf(exludeErrerMsg) === -1) {
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
            if (err.errMsg.indexOf(exludeErrerMsg) === -1) {
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
            if (err.errMsg.indexOf(exludeErrerMsg) === -1) {
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
            if (err.errMsg.indexOf(exludeErrerMsg) === -1) {
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
            if (err.errMsg.indexOf(exludeErrerMsg) === -1) {
              Taro.showModal({
                content: err.errMsg
              })
            }
          }
        })
      }
    }
    // 其他小程序
    if (data.appletOutside?.value === 'OTHERAPPLET' && isWxOrQyWx()) {
      return await to(data.appletOutside?.other, 'navigateToMiniProgram', pageId)
    }
    // 其他App --- 暂不支持
    if (data.appletOutside?.value === 'OTHERAPP' && isWxOrQyWx()) {
    }
    // 关闭小程序
    if (data.appletOutside?.value === 'EXITAPPLET' && isWxOrQyWx()) {
      return await to('', 'exitMiniProgram', pageId)
    }
  }
  // 小程序当前页面跳转
  if (data.value === 'PAGE') {
    store.setRef({ isRoutePage: true }, pageId, 'base')
    if (!isNil(data.page?.componentsId)) {
      const layoutElevators = storage.arrGet(`layout_elevators_${pageId}`)
      const layoutTopData = storage.arrGet(`layout_topData_${pageId}`)
      const layoutNavHeightPxNum = Number(storage.get(`layout_navHeightPxNum_${pageId}`) || '0')
      const layoutPageScrollHeightPxNum = Number(
        storage.get(`layout_pageScrollHeightPxNum_${pageId}`) || '0'
      )
      const elevators = layoutElevators.find((x) => x.id === data.page?.componentsId)
      let updateHeight = 0
      if (layoutTopData.length > 0) {
        updateHeight = beforePageScroll(
          elevators?.top + layoutNavHeightPxNum + layoutPageScrollHeightPxNum,
          layoutTopData
        )
      }
      if (elevators) {
        return await Taro.pageScrollTo({
          selector: `#${getDomId(data.page?.componentsId)}`,
          offsetTop: -(
            updateHeight +
            layoutNavHeightPxNum +
            layoutPageScrollHeightPxNum +
            Number(data.page?.specifyHeight ?? '0')
          )
        })
      }
    }
    if (!isNil(data.page?.specifyHeight)) {
      return await Taro.pageScrollTo({
        scrollTop: Number(data.page?.specifyHeight)
      })
    }
    store.setRef({ isRoutePage: false }, pageId, 'base')
  }
  return true
}

/** 解析样式 */
const parsingStyle = async (data: Edit.IActionStyle[] = [], pageId: string) => {
  if (data.length > 0) {
    store.setStyle(
      data.map((x: Edit.IActionStyle) => {
        return {
          key: x.id,
          value: getBaseStyle(x.update, {
            noBorderBox: true
          })
        }
      }),
      pageId
    )
  }
  return true
}

/** 解析接口 */
const parsingInterfaces = async (
  data: Edit.IActionInterfaces,
  pageId: string,
  templateInfo,
  actionName,
  interfaceParamsInject?
) => {
  if (interfaceParamsInject) {
    data = setInterfaceParams(data, interfaceParamsInject)
  }
  let result: any = null
  try {
    if (['get', 'delete'].includes(data.method)) {
      result = await http[data.method](data.url, { data: data.data })
    } else if (['post', 'put'].includes(data.method)) {
      let body = null
      try {
        body = JSON.parse(data.data)
      } catch (err) { }
      result = await http[data.method](data.url, body)
    }
    if (result.status === 200) {
      if (data.successMsg) {
        if (layout.config.interfacePopupType?.fail === 'modal') {
          Taro.showModal({
            content: data.successMsg
          })
        } else if (layout.config.interfacePopupType?.fail === 'toast') {
          Taro.showToast({
            icon: 'none',
            title: data.successMsg
          })
        }
      }
      safeFn(() => Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`,
        {
          success: true,
          request: data,
          response: result,
          actionName
        },
        templateInfo
      ))
    } else {
      safeFn(() =>
        Taro.eventCenter.trigger(`layout_interfacesAction_${pageId}`,
          {
            success: false,
            request: data,
            response: result,
            actionName
          },
          templateInfo
        ))
    }
    return true
  } catch {
    safeFn(() =>
      Taro.eventCenter.trigger(
        `layout_interfacesAction_${pageId}`,
        {
          success: false,
          request: data,
          response: result,
          actionName
        },
        templateInfo
      )
    )
    return false
  }
}

/** 解析微信相关 */
const parsingOpenWx = async (data: Edit.IActionOpenWx, pageId, templateInfo) => {
  if (data?.openType === 'subscribe') {
    return await subscribeMsg(data.subscribeTmpIds, data.subscribeRecord, pageId, templateInfo)
  }
  if (data?.openType === 'getUserProfile') {
    return await Taro.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料'
    })
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
  if (data?.openType === 'copy') {
    return await Taro.setClipboardData({ data: data?.value })
  }
  if (data?.openType === 'makePhoneCall') {
    return await Taro.makePhoneCall({ phoneNumber: data?.value })
  }
  return true
}

/** 解析元组件属性 */
const parsingComponet = async (data: Edit.IActionComponent[], pageId) => {
  if (data?.length > 0) {
    const myData = data.reduce(
      (pre: [Edit.IActionComponent[], Edit.IActionComponent[]], cur: Edit.IActionComponent) => {
        if (cur.type === 'videoCtx') {
          pre[1].push(cur)
        } else {
          pre[0].push(cur)
        }
        return pre
      },
      [[], []]
    )
    if (myData[0].length > 0) {
      store.setCom(
        myData[0].map((x) => getBaseComponent(x, pageId)),
        pageId
      )
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
              break
            case 'requestFullScreenAndPlay':
              ctx.requestFullScreen({})
              ctx.play()
              break
            case 'playbackRate':
              ctx[x.videoCtx?.type](x.videoCtx?.rate)
              break
            case 'seek':
              ctx[x.videoCtx?.type](x.videoCtx?.position)
              break
            case 'sendDanmu':
              ctx[x.videoCtx?.type](x.videoCtx?.danmu)
              break
            default:
              console.error('当前videoCtx未配置正确的实例方法')
              break
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
        ...data,
        templateInfo: templateInfo?.component || {}
      }
    })
  }
}

/** 解析自定义Action */
const parsingCustom = async (data: Edit.IActionCustom, pageId, templateInfo) => {
  if (data?.code) {
    return safeFn(() =>
      Taro.eventCenter.trigger(`layout_customAction_${pageId}`, data, templateInfo)
    )
  }
  return true
}

/** 解析业务 */
const parsingBusiness = async (data: Edit.IActionBusiness, pageId, templateInfo, layoutData) => {
  if (data?.actions?.length > 0) {
    parsingActions(data.actions, pageId, templateInfo, layoutData)
  }
  if (data?.businessType === 'b2') {
    const finderUserName = data.jsonData.finderUserName
    if (finderUserName) {
      const exludeErrerMsg = 'fail cancel'
      const errModal = (err) => {
        if (err?.errMsg?.indexOf(exludeErrerMsg) === -1) {
          Taro.showModal({
            content: err?.errMsg
          })
        }
      }
      Taro.getChannelsLiveInfo({
        finderUserName,
        success(res) {
          const { status } = res
          if (status === 2) {
            Taro.openChannelsLive({
              finderUserName,
              fail(err) {
                errModal(err)
              }
            })
          }
          if (status === 3) {
            Taro.getChannelsLiveNoticeInfo({
              finderUserName,
              success(res1) {
                Taro.reserveChannelsLive({
                  noticeId: res1.nonceId
                })
              },
              fail() {
                Taro.openChannelsLive({
                  finderUserName,
                  fail(err) {
                    errModal(err)
                  }
                })
              }
            })
          }
        },
        fail(err) {
          errModal(err)
        }
      })
    }
  }
  return true
}

/** 解析模态框 */
const parsingShowModal = async (showModalConfig: Edit.IActionShowModal) => {
  const result = await Taro.showModal(showModalConfig)
  if (result?.confirm) {
    return true
  }
  if (result?.cancel) {
    return false
  }
}

/** 解析动作 */
const parsingAction = async (action: Edit.IActions, pageId, templateInfo, layoutData) => {
  if (action?.exeCondition?.needMember && !appStore?.user?.isMember) {
    if (layoutData?.registerPath) {
      to(layoutData?.registerPath, 'navigateTo', pageId)
    } else if (layout.config.registerPath) {
      if (isString(layout.config.registerPath)) {
        to(layout.config.registerPath, 'navigateTo', pageId)
      }
      if (isFunction(layout.config.registerPath)) {
        const path = layout.config.registerPath?.()
        path && to(path, 'navigateTo', pageId)
      }
    }
    return false
  }
  if (action?.actionType?.value === 'ROUTE') {
    return parsingRoute(action?.actionType?.route, pageId, templateInfo, layoutData)
  }
  if (action?.actionType?.value === 'STYLE') {
    return parsingStyle(action?.actionType?.style, pageId)
  }
  if (action?.actionType?.value === 'INTERFACES') {
    return parsingInterfaces(
      action?.actionType?.interfaces,
      pageId,
      templateInfo,
      action.actionName,
      layoutData?.interfaceParamsInject
    )
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
    return parsingBusiness(action?.actionType.business, pageId, templateInfo, layoutData)
  }
  if (action?.actionType?.value === 'SHOWMODAL') {
    return parsingShowModal(action?.actionType?.customData?.showModal)
  }
  return false
}

/** 解析Action合集数据 */
export const parsingActions = async (
  actions: Edit.IActions[],
  pageId,
  templateInfo,
  layoutData?
) => {
  actions.forEach(async (item) => {
    const isToNext = await parsingAction(item, pageId, templateInfo, layoutData)
    if (isToNext && item?.actionFallbackQueue?.length > 0) {
      parsingActions(item?.actionFallbackQueue, pageId, templateInfo, layoutData)
    }
  })
}

export const getWxButtonByEvent = (event?: Edit.IEvent) => {
  if (!event || event?.actions?.length === 0) return null
  let result: any = null
  event.actions.forEach((item) => {
    if (item?.actionType?.value === 'OPENWX') {
      if (item?.actionType?.openwx?.openType === 'share') {
        result = {
          ...(item?.actionType?.openwx.share || {}),
          openType: item?.actionType?.openwx.openType
        }
      }
      if (item?.actionType?.openwx?.openType === 'contact') {
        result = {
          ...(item?.actionType?.openwx.contact || {}),
          openType: item?.actionType?.openwx.openType
        }
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
          break
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
        break
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
        if (list[x].hot?.some((y) => y.id === hotId)) {
          result = true
          break
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
        break
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
      result = data.find((x) => x.type === 'live')
      break
    case 102:
      result = data.find((x) => x.type === 'unstart')
      break
    case 103:
    case 104:
    case 105:
    case 106:
    case 107:
      result = data.find((x) => x.type === 'end')
      break
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
  if (!date) {
    return date
  }
  const arr = date.split('T')
  const d = arr[0]
  const darr = d.split('-')
  const t = arr[1]
  const tarr = t.split('+')
  const marr = tarr[0].split(':')
  const tzone = Number(tarr[1].substr(0, 2))
  const dd =
    parseInt(darr[0]) +
    '/' +
    parseInt(darr[1]) +
    '/' +
    parseInt(darr[2]) +
    ' ' +
    parseInt(marr[0]) +
    ':' +
    parseInt(marr[1]) +
    ':' +
    parseInt(marr[2])
  let time = new Date(Date.parse(dd))
  time.setTime(time.setHours(time.getHours() + (8 - tzone)))
  let Y = time.getFullYear() + interval
  const addZero = (num1) => (num1 < 10 ? '0' + num1 : num1)
  let M = addZero(time.getMonth() + 1) + interval
  let D = addZero(time.getDate())
  let h = ' ' + addZero(time.getHours())
  let m = ':' + addZero(time.getMinutes())
  let s = ':' + addZero(time.getSeconds())
  let result = Y + M + D
  switch (num) {
    case 4:
      result = Y + M + D + h
      break
    case 5:
      result = Y + M + D + h + m
      break
    case 6:
      result = Y + M + D + h + m + s
      break
  }
  return result
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
  if (!time) return { ss: 0 }
  let t = time
  const ss = t % 60
  t = (t - ss) / 60
  if (t < 1) return { ss: Math.floor(ss) }
  const mm = t % 60
  t = (t - mm) / 60
  if (t < 1) return { mm: Math.floor(mm), ss: Math.floor(ss) }
  const hh = t % 24
  t = (t - hh) / 24
  if (t < 1) return { hh: Math.floor(hh), mm: Math.floor(mm), ss: Math.floor(ss) }
  const dd = t
  return {
    dd: Math.floor(dd),
    hh: Math.floor(hh),
    mm: Math.floor(mm),
    ss: Math.floor(ss)
  }
}

/** 防抖 */
export const debounce = function (fn, wait, immediate) {
  let timer
  return function () {
    if (immediate) {
      immediate = !immediate // 取个反
      fn.apply(this, arguments)
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, wait)
  }
}

/** 字符串模板替换 */
export const textTemplate = (value, replaceValue) => {
  if (isNil(value)) {
    return ''
  }
  if (isNumber(value)) {
    return value + ''
  }
  if (isString(value)) {
    const startIndex = value?.indexOf(layout.config.textTemplate?.startStr)
    const endIndex = value?.indexOf(layout.config.textTemplate?.endStr)
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const old = value?.substring(
        startIndex,
        endIndex + layout.config.textTemplate?.endStr?.length
      )
      return replace(value, old, replaceValue ?? '')
    }
    return value
  }
  return value
}

/** 获取字符串模板 */
export const replaceStrTemplate = (str: string, pageData: any, appData?: any) => {
  let result = str
  const loop = (data) => {
    const startIndex = data?.indexOf(layout.config.textTemplate?.startStr)
    const endIndex = data?.indexOf(layout.config.textTemplate?.endStr)
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const old = data?.substring(startIndex, endIndex + layout.config.textTemplate?.endStr?.length)
      const key = replace(
        replace(old, layout.config.textTemplate?.startStr, ''),
        layout.config.textTemplate?.endStr,
        ''
      )
      let value = ''
      if (key === 'storeCode') {
        value = layout.config.storeCode
      } else {
        const isAppStore = startsWith(key, "app.")
        if (isAppStore) {
          value = get(appData, key.substr(4)) ?? ''
        } else {
          value = get(pageData, key) ?? ''
        }

      }
      data = replace(data, old, value)
      loop(data)
    } else {
      result = data
    }
  }
  loop(str)
  return result
}

/** 节流 */
export const throttle = function (fn, rateTime) {
  let timer: any = null
  return function (this: any, ...args: any[]) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, rateTime)
    }
  }
}

/** 睡眠 */
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

enum CQL {
  等于 = 'eq',
  不等于 = 'ne',
  大于 = 'gt',
  小于 = 'lt',
  大于等于 = 'ge',
  小于等于 = 'le',
  且 = 'AND',
  或 = 'OR',
  左括号 = '(',
  右括号 = ')'
}

const checkCQL = (str: string) => {
  let r
  const arr = str?.split(' ')
  if (arr && !isNil(arr[0] && !isNil(arr[1]) && !isNil(arr[2]))) {
    switch (arr[1]) {
      case CQL.等于:
        r = String(arr[0]) === String(arr[2])
        break
      case CQL.不等于:
        r = String(arr[0]) !== String(arr[2])
        break
      case CQL.小于:
        r = Number(arr[0]) < Number(arr[2])
        break
      case CQL.小于等于:
        r = Number(arr[0]) <= Number(arr[2])
        break
      case CQL.大于:
        r = Number(arr[0]) > Number(arr[2])
        break
      case CQL.大于等于:
        r = Number(arr[0]) >= Number(arr[2])
        break
    }
  }
  return r
}

const hasOR = (str: string) => str.indexOf(CQL.或) !== -1

/** 解析CQL表达式
 *  eq  等于
 *  ne  不等于
 *  gt  大于
 *  lt  小于
 *  ge  大于等于
 *  le  小于等于
 *  empty 空值判断
 *  AND 且
 *  OR  或
 *  (   左括号
 *  )   右括号
 */
export const parsingCQL = (expression) => {
  let result = true
  if (isString(expression)) {
    const qList = expression.split(CQL.且)
    for (let i = 0; i < qList.length; i++) {
      if (!hasOR(qList[i])) {
        const c = checkCQL(qList[i].trim())
        if (!c) {
          result = false
          break
        }
      } else {
        const hList = qList[i].split(CQL.或)
        let hr = false
        for (let j = 0; j < hList.length; j++) {
          const c = checkCQL(hList[j].trim().replace(CQL.左括号, '').replace(CQL.右括号, ''))
          if (c) {
            hr = true
            break
          }
        }
        if (!hr) {
          result = false
          break
        }
      }
    }
  } else {
    result = false
  }
  return result
}

export const getScrollNum = (str: string | number, winH: number) => {
  if (isString(str)) {
    if (endsWith(str, 'vh') || endsWith(str, '%')) {
      return (parseInt(str, 10) / 100) * winH
    }
    return parseInt(str, 10)
  }
  if (isNumber(str)) {
    return str
  }
}

export const computedPendant = (data: any, parentLv: number = 0) => {
  function loop(arr) {
    arr.forEach((item) => {
      item.level = item.level + parentLv
      if (item.customData?.pendantAnimation?.style?.animationName) {
        item.customData.customWrapper = false
      }
      if (item.children?.length) {
        loop(item.children)
      }
    })
  }
  loop(data)
  return data
}

/** 纵向无限循环组件特殊处理 */
export const computedInfinitelLoopY = (index: number, pageId: string, templateId: string) => {
  const stateRef = get(store.ref, `${pageId}.${templateId}`)
  if (isObject(stateRef)) {
    let {
      len,
      last,
      nav,
      time,
      open,
      h_open,
      h_close,
      id1_open,
      id2_open,
      id3_open,
      id_close,
      id1_close,
      id2_close,
      id3_close,
      mTop1_open,
      mTop2_open,
      mTop3_open,
      top1_open,
      top2_open,
      top3_open,
      mTop1_close,
      mTop2_close,
      mTop3_close,
      top1_close,
      top2_close,
      top3_close
    } = stateRef
    const sum_close = len * h_close
    const sum_open = len * h_open
    if (open) {
      if (index < last) {
        index = index + len
      }
      const move_close = -(index - last) * h_close
      const move_open = -(index - last) * h_open
      store.setRef(
        {
          mTop1_open: mTop1_open + move_open,
          mTop2_open: mTop2_open + move_open,
          mTop3_open: mTop3_open + move_open,
          mTop1_close: mTop1_close + move_close,
          mTop2_close: mTop2_close + move_close,
          mTop3_close: mTop3_close + move_close
        },
        pageId,
        templateId
      )
      parsingActions(
        [
          {
            actionType: {
              value: 'STYLE',
              style: getStyleAction([
                {
                  id: id1_open,
                  style: {
                    marginTop: `${mTop1_open + move_open}px`
                  }
                },
                {
                  id: id2_open,
                  style: {
                    marginTop: `${mTop2_open + move_open}px`
                  }
                },
                {
                  id: id3_open,
                  style: {
                    marginTop: `${mTop3_open + move_open}px`
                  }
                },
                {
                  id: id1_close,
                  style: {
                    marginTop: `${mTop1_close + move_close}px`
                  }
                },
                {
                  id: id2_close,
                  style: {
                    marginTop: `${mTop2_close + move_close}px`
                  }
                },
                {
                  id: id3_close,
                  style: {
                    marginTop: `${mTop3_close + move_close}px`
                  }
                }
              ])
            }
          }
        ],
        pageId,
        {}
      )
      if (index >= len) {
        index = index - len
        if (nav[0] === 0) {
          setTimeout(() => {
            store.setRef(
              {
                top1_close: top1_close + sum_close * 3,
                top1_open: top1_open + sum_open * 3,
                nav: [1, 2, 0]
              },
              pageId,
              templateId
            )
            parsingActions(
              [
                {
                  actionType: {
                    value: 'STYLE',
                    style: getStyleAction([
                      {
                        id: id1_close,
                        style: {
                          top: `${top1_close + sum_close * 3}px`
                        }
                      },
                      {
                        id: id1_open,
                        style: {
                          top: `${top1_open + sum_open * 3}px`
                        }
                      }
                    ])
                  }
                }
              ],
              pageId,
              {}
            )
          }, time)
        }
        if (nav[0] === 1) {
          setTimeout(() => {
            store.setRef(
              {
                top2_close: top2_close + sum_close * 3,
                top2_open: top2_open + sum_open * 3,
                nav: [2, 0, 1]
              },
              pageId,
              templateId
            )
            parsingActions(
              [
                {
                  actionType: {
                    value: 'STYLE',
                    style: getStyleAction([
                      {
                        id: id2_close,
                        style: {
                          top: `${top2_close + sum_close * 3}px`
                        }
                      },
                      {
                        id: id2_open,
                        style: {
                          top: `${top2_open + sum_open * 3}px`
                        }
                      }
                    ])
                  }
                }
              ],
              pageId,
              {}
            )
          }, time)
        }
        if (nav[0] === 2) {
          setTimeout(() => {
            store.setRef(
              {
                top3_close: top3_close + sum_close * 3,
                top3_open: top3_open + sum_open * 3,
                nav: [0, 1, 2]
              },
              pageId,
              templateId
            )
            parsingActions(
              [
                {
                  actionType: {
                    value: 'STYLE',
                    style: getStyleAction([
                      {
                        id: id3_close,
                        style: {
                          top: `${top3_close + sum_close * 3}px`
                        }
                      },
                      {
                        id: id3_open,
                        style: {
                          top: `${top3_open + sum_open * 3}px`
                        }
                      }
                    ])
                  }
                }
              ],
              pageId,
              {}
            )
          }, time)
        }
      }
      store.setRef({ last: index }, pageId, templateId)
    } else {
      const move_close = -(index + 1) * h_close
      const move_open = -index * h_open
      store.setRef(
        {
          open: true,
          mTop1_close: move_close,
          mTop2_close: sum_close + move_close,
          mTop3_close: sum_close * 2 + move_close,
          mTop1_open: move_open,
          mTop2_open: sum_open + move_open,
          mTop3_open: sum_open * 2 + move_open,
          last: index
        },
        pageId,
        templateId
      )
      parsingActions(
        [
          {
            actionType: {
              value: 'STYLE',
              style: getStyleAction([
                {
                  id: id_close,
                  style: {
                    marginTop: `${h_open}px`
                  }
                },
                {
                  id: id1_open,
                  style: {
                    marginTop: `${move_open}px`
                  }
                },
                {
                  id: id2_open,
                  style: {
                    marginTop: `${sum_open + move_open}px`
                  }
                },
                {
                  id: id3_open,
                  style: {
                    marginTop: `${sum_open * 2 + move_open}px`
                  }
                },
                {
                  id: id1_close,
                  style: {
                    marginTop: `${move_close}px`
                  }
                },
                {
                  id: id2_close,
                  style: {
                    marginTop: `${sum_close + move_close}px`
                  }
                },
                {
                  id: id3_close,
                  style: {
                    marginTop: `${sum_close * 2 + move_close}px`
                  }
                }
              ])
            }
          }
        ],
        pageId,
        {}
      )
    }
  }
}

const getStyleAction = (data) => {
  return data.map((item) => ({
    id: item.id,
    update: {
      reactStyle: item.style
    }
  }))
}

/** 商品换一换组件特殊处理 */
export const computedProductChange = (len: number, pageId: string, templateId: string) => {
  const currentIndex = store.updateCom.current.get(`${pageId}_${templateId}`) ?? 0
  store.setComCurrent(
    {
      updateCurrent: {
        id: templateId,
        newCurrent: currentIndex >= len - 1 ? 0 : currentIndex + 1
      },
      relation: [],
      swiperRelation: []
    },
    pageId
  )
}

/** 顶部导航栏特殊处理 */
export const computedTopNavBar = (data: any, e: any, pageId: string, templateId: string) => {
  const { scrollId, id, defaultCurrentId, topNavBarList, styles } = data
  // 自动居中处理
  const windowWidth = Taro.getSystemInfoSync().windowWidth
  const query = Taro.createSelectorQuery()
  query.select(`#${getDomId(id)}`).boundingClientRect()
  query.exec(function (rect) {
    const moveLeft = e?.mpEvent?.currentTarget?.offsetLeft + rect?.[0]?.width / 2 - windowWidth / 2
    store.setCom(
      {
        type: 'offset',
        key: scrollId,
        value: moveLeft
      },
      pageId
    )
  })
  // 组件显示隐藏处理
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  const oldCurrentId = storeRef?.currentId ?? defaultCurrentId
  if (oldCurrentId !== id) {
    store.setRef({ currentId: id }, pageId, templateId)
    const hideStyle = {
      display: 'none'
    }
    const showStyle = {
      display: 'flex'
    }
    const updateStyles = topNavBarList.reduce((pre, cur) => {
      if (cur.id === id) {
        pre.push(
          ...(cur.list.map((x) => ({
            key: x,
            value: showStyle
          })) ?? [])
        )
      }
      if (cur.id === oldCurrentId) {
        pre.push(
          ...(cur.list.map((x) => ({
            key: x,
            value: hideStyle
          })) ?? [])
        )
      }
      return pre
    }, [])
    styles?.forEach((item) => {
      if (item.currentId === id) {
        updateStyles.push({
          key: item.currentId,
          value: getReactStyle(!storeRef?.isCheck ? item.top.checkStyle : item.scroll.checkStyle)
        })
      }
      if (item.currentId === oldCurrentId) {
        updateStyles.push({
          key: item.currentId,
          value: getReactStyle(
            !storeRef?.isCheck ? item.top.unCheckStyle : item.scroll.unCheckStyle
          )
        })
      }
    })
    store.setStyle(updateStyles, pageId)
  }
}

/** 翻页循环组件特殊处理 */
export const computedInfiniteLoopX = (data: any, pageId: string, templateId: string) => {
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  const removeTemplates = get(store.ref, `${pageId}.removeTemplates`)
  let [deleteComIds, currentIndex] = [[], 0]
  const oldCurrentIndex = storeRef?.currentIndex ?? 0
  let { direction, style1, style2, style3, style4, hideStyle1, hideStyle2, ids } = data
  if (removeTemplates?.list) {
    deleteComIds = removeTemplates?.list.find((x) => x.templateId === templateId)?.comIds ?? []
  }
  ids = difference(ids, deleteComIds)
  const len = ids.length

  const endIndex = len - 1
  if (direction === 'left') {
    currentIndex = oldCurrentIndex === endIndex ? 0 : oldCurrentIndex + 1
  }
  if (direction === 'right') {
    currentIndex = oldCurrentIndex === 0 ? endIndex : oldCurrentIndex - 1
  }
  store.setRef({ currentIndex }, pageId, templateId)
  const getInfiniteLooPXStyle = (index) => {
    let result: any = {}
    if (currentIndex === index) {
      result = style1
    } else {
      if (index === currentIndex + 1) {
        result = style2
      } else if (index === currentIndex + 2) {
        result = style3
      } else if (index === currentIndex + 3) {
        result = style4
      } else if (index === 0 && currentIndex + 3 === len) {
        result = style4
      } else if (index === 0 && currentIndex + 2 === len) {
        result = style3
      } else if (index === 0 && currentIndex + 1 === len) {
        result = style2
      } else if (index === 1 && currentIndex + 2 === len) {
        result = style4
      } else if (index === 1 && currentIndex + 1 === len) {
        result = style3
      } else if (index === 2 && currentIndex + 1 === len) {
        result = style4
      } else {
        if (len === 5) {
          return hideStyle2
        }
        if (index + 1 === currentIndex || (index === len - 1 && currentIndex === 0)) {
          result = hideStyle1
        } else {
          result = hideStyle2
        }
      }
    }
    return result
  }
  store.setStyle(
    ids.map((id: string, index) => {
      return {
        key: id,
        value: getReactStyle(getInfiniteLooPXStyle(index))
      }
    }),
    pageId
  )
}

/** 翻页循环组件-A模型特殊处理 */
export const computedInfiniteLoopXA = (data: any, pageId: string, templateId: string) => {
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  const removeTemplates = get(store.ref, `${pageId}.removeTemplates`)
  let [deleteComIds, currentIndex] = [[], 0]
  const oldCurrentIndex = storeRef?.currentIndex ?? 0
  let { direction, style1, style2, style3, hideStyle1, hideStyle2, ids } = data
  if (removeTemplates?.list) {
    deleteComIds = removeTemplates?.list.find((x) => x.templateId === templateId)?.comIds ?? []
  }
  ids = difference(ids, deleteComIds)
  const len = ids.length

  const endIndex = len - 1
  if (direction === 'left') {
    currentIndex = oldCurrentIndex === endIndex ? 0 : oldCurrentIndex + 1
  }
  if (direction === 'right') {
    currentIndex = oldCurrentIndex === 0 ? endIndex : oldCurrentIndex - 1
  }
  store.setRef({ currentIndex }, pageId, templateId)
  const getInfiniteLooPXStyle = (index) => {
    let result: any = {}
    if (currentIndex === index) {
      result = style1
    } else {
      if (index === currentIndex + 1) {
        result = style2
      } else if (index === currentIndex + 2) {
        result = style3
      } else if (index === 0 && currentIndex + 2 === len) {
        result = style3
      } else if (index === 0 && currentIndex + 1 === len) {
        result = style2
      } else if (index === 1 && currentIndex + 1 === len) {
        result = style3
      } else {
        if (len === 4) {
          return hideStyle2
        }
        if (index + 1 === currentIndex || (index === len - 1 && currentIndex === 0)) {
          result = hideStyle1
        } else {
          result = hideStyle2
        }
      }
    }
    return result
  }
  store.setStyle(
    ids.map((id: string, index) => {
      return {
        key: id,
        value: getReactStyle(getInfiniteLooPXStyle(index))
      }
    }),
    pageId
  )
  store.setComCurrent(
    {
      updateCurrent: {
        id: templateId,
        newCurrent: currentIndex
      },
      relation: [],
      swiperRelation: []
    },
    pageId
  )
}

/** 设置页面滚动 */
export const setPageScroll = (scrollTop, pageId) => {
  Taro.pageScrollTo({
    scrollTop
  })
}

/** 首屏轮播组件特殊处理 */
export const computedFirstScreenSwiper = (data: any, pageId: string, templateId: string) => {
  const { direction, scrollTop, id, style } = data
  if (direction === 'top') {
    store.setStyle(
      {
        key: id,
        value: style
      },
      pageId
    )
    setPageScroll(scrollTop, pageId)
  }
}

/** 首屏轮播组件-A模型特殊处理 */
export const computedFirstScreenSwiperA = (data: any, pageId: string, templateId: string) => {
  const { direction, topActions, bottomActions } = data
  if (direction === 'top') {
    parsingActions(topActions, pageId, {})
  }
  if (direction === 'bottom') {
    parsingActions(bottomActions, pageId, {})
  }
}

/** 首屏轮播组件-B模型特殊处理 */
export const computedFirstScreenSwiperB = (
  data: any,
  pageId: string,
  templateId: string,
  fn: any
) => {
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  const openSwiper = storeRef?.openSwiper
  const openPage = storeRef?.openPage
  const {
    direction,
    isTop,
    openSwiperActions,
    closeSwiperActions,
    openPageActions,
    closePageActions
  } = data
  if (direction === 'top') {
    if (!openSwiper) {
      parsingActions(openSwiperActions, pageId, {})
      store.setRef({ openSwiper: true }, pageId, templateId)
    } else {
      parsingActions(openPageActions, pageId, {})
      store.setRef({ openPage: true }, pageId, templateId)
    }
  }
  if (direction === 'bottom') {
    if (!openPage) {
      parsingActions(closeSwiperActions, pageId, {})
      store.setRef({ openSwiper: false }, pageId, templateId)
    }
    if (openPage && isTop) {
      fn?.()
      Taro.nextTick(() => {
        parsingActions(closePageActions, pageId, {})
      })
      store.setRef({ openPage: false }, pageId, templateId)
    }
  }
}

/** 左右滑动组件特殊处理 */
export const computedSlideXB = (data: any, pageId: string, templateId: string) => {
  const { direction, len, circular } = data
  const currentIndex = store.updateCom.current.get(`${pageId}_${templateId}`) ?? 0
  if (direction === 'left') {
    if (currentIndex + 1 < len) {
      store.setComCurrent(
        {
          updateCurrent: {
            id: templateId,
            newCurrent: currentIndex + 1
          },
          relation: [],
          swiperRelation: []
        },
        pageId
      )
    }
    if (currentIndex + 1 === len && circular) {
      store.setComCurrent(
        {
          updateCurrent: {
            id: templateId,
            newCurrent: 0
          },
          relation: [],
          swiperRelation: []
        },
        pageId
      )
    }
  }
  if (direction === 'right') {
    if (currentIndex - 1 >= 0) {
      store.setComCurrent(
        {
          updateCurrent: {
            id: templateId,
            newCurrent: currentIndex - 1
          },
          relation: [],
          swiperRelation: []
        },
        pageId
      )
    }
    if (currentIndex - 1 < 0 && circular) {
      store.setComCurrent(
        {
          updateCurrent: {
            id: templateId,
            newCurrent: len - 1
          },
          relation: [],
          swiperRelation: []
        },
        pageId
      )
    }
  }
}

/** 文本标签组件特殊处理 */
export const computedTextLabel = (data: any, pageId: string, templateId: string) => {
  let result = null
  const currentIndex = store.updateCom.current.get(`${pageId}_${templateId}`) ?? 0
  const { index, len, scrollId, scrollViewWidth, labelWidth, ids } = data
  let newCurrent = -1
  if (index === 'next' && currentIndex + 1 < len) {
    newCurrent = currentIndex + 1
    result = `${ids[newCurrent]}_event`
  } else if (index === 'last' && currentIndex - 1 >= 0) {
    newCurrent = currentIndex - 1
    result = `${ids[newCurrent]}_event`
  } else {
    newCurrent = index
  }
  if (newCurrent >= 0) {
    store.setComCurrent(
      {
        updateCurrent: {
          id: templateId,
          newCurrent
        },
        relation: [],
        swiperRelation: []
      },
      pageId
    )
    store.setCom(
      {
        type: 'offset',
        key: scrollId,
        value: `${labelWidth * newCurrent + labelWidth / 2 - scrollViewWidth / 2}rpx`
      },
      pageId
    )
  }
  return result
}

/** 品牌探索组件特殊处理 */
export const computedKIEHLSA = (data: any, pageId: string, templateId: string, aType: string) => {
  const { defaultCurrentId, type, keyType, actions0, actions1, actions2 } = data
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  if (isNil(type)) {
    const oldCurrentId = storeRef?.currentId ?? defaultCurrentId
    if (keyType === 1) {
      if (oldCurrentId === 1) {
        parsingActions(actions0, pageId, {})
        store.setRef({ currentId: 0 }, pageId, templateId)
      } else {
        parsingActions(actions1, pageId, {})
        store.setRef({ currentId: 1 }, pageId, templateId)
      }
    } else if (keyType === 2) {
      if (oldCurrentId === 2) {
        parsingActions(actions1, pageId, {})
        store.setRef({ currentId: 1 }, pageId, templateId)
      } else {
        parsingActions(actions2, pageId, {})
        store.setRef({ currentId: 2 }, pageId, templateId)
      }
    }
  }
  if (type === 1) {
    parsingActions(actions1, pageId, {})
    store.setRef({ currentId: 1 }, pageId, templateId)
  }
  if (type === 2) {
    parsingActions(actions2, pageId, {})
    store.setRef({ currentId: 2 }, pageId, templateId)
  }

  Taro.eventCenter.trigger(`layout_trackingCallBack_${pageId}`, {
    component: {
      code: 'KIEHLSA',
    },
    target: {
      index: get(store.ref, `${pageId}.${templateId}`)?.currentId,
      type: aType
    },
  });
}

/** 会员卡组件-E模型特殊处理 */
export const computedOneMemberCardE = (data: any, pageId: string, templateId: string) => {
  const { openActions, closeActions, type } = data
  const storeRef = get(store.ref, `${pageId}.${templateId}`)
  if (type === 'close') {
    parsingActions(closeActions, pageId, {})
    store.setRef({ isOpen: false }, pageId, templateId)
  } else {
    if (storeRef?.isOpen) {
      parsingActions(closeActions, pageId, {})
      store.setRef({ isOpen: false }, pageId, templateId)
    } else {
      parsingActions(openActions, pageId, {})
      store.setRef({ isOpen: true }, pageId, templateId)
    }
  }
}

export const isSwiper = (templateCode: string) => templateCode?.indexOf('SWIPER') !== -1

export const setNewSwiperConfig = (swiperConfig, myCurrent) => {
  let { swiperId, swiperCount, current, currentImgs } = swiperConfig
  if (swiperId === myCurrent.key) {
    const delIndexs: any = uniq(myCurrent?.delIndexs)
    if (swiperCount) {
      swiperCount = swiperCount - (delIndexs?.length ?? 0)
    }
    if (currentImgs) {
      swiperConfig.currentImgs = currentImgs?.filter((_, i) => !delIndexs.includes(i))
    }
    let newCurrent = current
    delIndexs.forEach((x) => {
      if (x < current) {
        newCurrent = newCurrent - 1
      }
    })
    merge(swiperConfig, {
      swiperCount,
      current: newCurrent
    })
  }
  return
}

export const setNewSwiperAction = (actions, myCurrent) => {
  actions?.forEach((a) => {
    if (a?.actionType?.value === 'COMPONENT') {
      a.actionType?.component?.forEach((b) => {
        if (b?.type === 'swiperView' && b?.id === myCurrent.key) {
          const delIndexs: any = uniq(myCurrent?.delIndexs)
          b.current.count = b.current.count - (delIndexs?.length ?? 0)
          let newCurrent = Number(b.current?.value)
          if (!isNaN(newCurrent)) {
            delIndexs.forEach((x) => {
              if (x < b.current?.value) {
                newCurrent = newCurrent - 1
              }
            })
            b.current.value = newCurrent + ''
          }
        }
      })
    }
  })
}

/** 获取手机信息 */
export const getSystemInfo = () => {
  if (!isFunction(Taro.getSystemInfoSync)) {
    return null
  }
  let systemInfo: any = Taro.getSystemInfoSync() || {
    model: '',
    system: ''
  }
  let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1)
  let rect
  try {
    rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null
    if (rect === null) {
      throw 'getMenuButtonBoundingClientRect error'
    }
    //取值为0的情况  有可能width不为0 top为0的情况
    if (!rect.width || !rect.top || !rect.left || !rect.height) {
      throw 'getMenuButtonBoundingClientRect error'
    }
  } catch (error) {
    let gap = 0 //胶囊按钮上下间距 使导航内容居中
    let width = 96 //胶囊的宽度
    if (systemInfo.platform === 'android') {
      gap = 8
      width = 96
    } else if (systemInfo.platform === 'devtools') {
      if (ios) {
        gap = 5.5 //开发工具中ios手机
      } else {
        gap = 7.5 //开发工具中android和其他手机
      }
    } else {
      gap = 4
      width = 88
    }
    if (!systemInfo.statusBarHeight) {
      //开启wifi的情况下修复statusBarHeight值获取不到
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
    }
    rect = {
      //获取不到胶囊信息就自定义重置一个
      bottom: systemInfo.statusBarHeight + gap + 32,
      height: 32,
      left: systemInfo.windowWidth - width - 10,
      right: systemInfo.windowWidth - 10,
      top: systemInfo.statusBarHeight + gap,
      width: width
    }
  }

  let navBarHeight = ''
  if (!systemInfo.statusBarHeight) {
    //开启wifi和打电话下
    systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
    navBarHeight = (function () {
      let gap = rect.top - systemInfo.statusBarHeight
      return 2 * gap + rect.height
    })()

    systemInfo.statusBarHeight = 0
    systemInfo.navBarExtendHeight = 0 //下方扩展4像素高度 防止下方边距太小
  } else {
    navBarHeight = (function () {
      let gap = rect.top - systemInfo.statusBarHeight
      return systemInfo.statusBarHeight + 2 * gap + rect.height
    })()
    if (ios) {
      systemInfo.navBarExtendHeight = 4 //下方扩展4像素高度 防止下方边距太小
    } else {
      systemInfo.navBarExtendHeight = 0
    }
  }

  systemInfo.navBarHeight = navBarHeight //导航栏高度不包括statusBarHeight
  systemInfo.capsulePosition = rect //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
  systemInfo.ios = ios //是否ios//将信息保存到全局变量中,后边再用就不用重新异步获取了
  return systemInfo
}

/** 计算动态变量数据 */
export const getDynaimcNumByStore = (data: any) => {
  const getValue = (item: any) => {
    let num = 0
    if (endsWith(item, 'px')) {
      num = rpxTopx(parseInt(item));
    } else if (startsWith(item, 'systemInfo')) {
      num = get(appStore, item);
    } else {
      num = parseInt(item);
    }
    return num
  }
  if (isString(data)) {
    return getValue(data)
  } else {
    const { leftArr, rightArr } = data
    let [leftResult, rightResult] = [0, 0]
    leftArr?.forEach(item => {
      leftResult += getValue(item)
    })
    rightArr?.forEach(item => {
      rightResult += getValue(item)
    })
    return leftResult - rightResult
  }

}


