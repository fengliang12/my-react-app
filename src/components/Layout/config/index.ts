/** 初始化入参 */
type InitArgument = {
  /** 版本 */
  version?: string
  /** 品牌业务Code */
  storeCode: string
  /** 接口域名 */
  baseUrl: string
  /** 获取token接口地址 */
  loginUrl: string
  /** 素材前缀 */
  prefix?: string
  /** 接口token对应Storage的key */
  tokenStorageKey?: string
  /** 不使用统一报错处理的errCode */
  errCodeList?: string[]
  /** webview承载页面地址 */
  webView?: {
    pagePath: string
    queryName: string
  }
  /** 组件id前缀 */
  idPrefix?: string
  /** 开启Log */
  openLog?: boolean
  /** 滚动文字隔离符号 */
  scrollText?: string
  /** 直播组件对应的stage前缀 */
  liveStagePrefix?: string
  /** 直播插件的引用名称 */
  livePluginName?: string
}

type LayoutType = {
  config: Partial<InitArgument>
  init: (data: InitArgument) => void
}

export const layout: LayoutType = {
  config: {
    prefix: '',
    tokenStorageKey: 'token',
    errCodeList: [],
    webView: {
      pagePath: '/pages/h5/index',
      queryName: 'url'
    },
    idPrefix: 'gg_',
    openLog: false,
    version: '1.2.44',
    scrollText: '<&>',
    liveStagePrefix: 'liveView_',
    livePluginName: 'livePlayerPlugin'
  },
  init(data: InitArgument) {
    this.config = { ...this.config, ...data }
  }
}
