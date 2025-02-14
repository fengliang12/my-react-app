# Layout 页面配置

### 使用场景

- 可以作为页面使用
- 可以作为页面某一个可配置模块去使用

### 初始化

1. 在app.tsx里面初始化对应的信息

```js
import { layout } from '@connextjs/components';

layout.init({
  storeCode: 'test',
  baseUrl: 'https://wemall-api-dev.xxx.com/api',
  loginUrl: 'https://wemall-api-dev.xxx.com/api/xxx'
});
```

2. 初始化配置

```ts
/** 初始化入参 */
type InitArgument = {
  /** 版本 */
  version?: string;
  /** 品牌业务Code */
  storeCode: string;
  /** 接口域名 */
  baseUrl: string;
  /** 获取token接口地址 */
  loginUrl: string;
  /** 素材前缀 */
  prefix?: string;
  /** 接口token对应Storage的key */
  tokenStorageKey?: string;
  /** 不使用统一报错处理的errCode */
  errCodeList?: string[];
  /** webview承载页面地址 */
  webView?: {
    pagePath: string;
    queryName: string;
  };
  /** 组件id前缀 */
  idPrefix?: string;
  /** 开启Log */
  openLog?: boolean;
  /** 滚动文字隔离符号 */
  scrollText?: string;
  /** 直播组件对应的stage前缀 */
  liveStagePrefix?: string;
  /** 直播插件的引用名称 */
  livePluginName?: string;
  /** 窗口层移动区域开启100vh高度设置 */
  openMovableAreaHeight100VH?: boolean;
};
```

### 如何引入

```js
import { Layout } from '@connextjs/components';
```

### Props

```ts
type LayoutProps = {
  /**  主题页面Code */
  code?: string;
  /** 开启主题页面的千人千面 */
  openCrowd?: boolean;
  /** 加载数据配置 */
  loadPageConfig?: {
    type: 'id' | 'code';
    value: string;
    date?: number;
  };
  /** 自定义导航栏高度 */
  navHeight?: string;
  /** 自定义tabBar高度 */
  tabHeight?: string;
  /** 加载效果配置 */
  loading?: {
    /** 加载图片地址 */
    src: string;
    /** 加载背景色 */
    bgColor?: string;
    /** 图片宽度 */
    width?: string;
    /** 图片距离左侧距离 */
    left?: string;
    /** 图片距离顶部距离 */
    top?: string;
    /** 组件取消加载的组件渲染完成数量 */
    count?: number;
  };
  /** 关闭分享 */
  closeShare?: boolean;
  /** 默认分享配置 */
  defaultShareConfig?: {
    title?: string;
    path?: string;
    imageUrl?: string;
  };
  /** 组件插槽 */
  customSlot?: {
    /** 组件id */
    id?: string;
    /** 组件在当前页面的索引 */
    index?: number;
    /** 组件名称 */
    name?: string;
    /** 组件模糊名称 */
    likeName?: string;
    /** 与组件左侧距离 */
    left?: number | string;
    /** 与组件顶部距离 */
    top?: number | string;
    /** 与组件底部距离 */
    bottom?: number | string;
    /** 与组件右侧距离 */
    right?: number | string;
    /** 插入元素 */
    element?: React.ReactElement;
    /** 返回插入元素的方法
     * @param data 组件的自定义数据
     */
    getElement?: (data: any) => React.ReactElement;
  }[];
  /** 页面插槽 */
  pageSlot?: {
    /** 业务Code */
    code: string;
    /** 插入业务组件 */
    element?: React.ReactElement;
    /** 返回插入业务组件的方法
     * @param data 业务组件的自定义数据
     * @param info 业务组件的索引和名称
     */
    getElement?: (
      data: any,
      info: { index: number; name: string }
    ) => React.ReactElement;
  }[];
  /** icon组件插槽 */
  iconSlot?: {
    /** 当前icon索引 */
    index: number;
    /** icon组件名称 */
    name?: string;
    /** icon组件模糊名称 */
    likeName?: string;
    /** 是否隐藏配置icon */
    hide?: boolean;
    /** 与当前Icon左侧的距离 */
    left?: number | string;
    /** 与当前Icon顶部的距离 */
    top?: number | string;
    /** 插入元素 */
    element: React.ReactElement;
  }[];
  /** 容器类元组件插槽 */
  containerSlot?: {
    /** 组件模板Code */
    code?: string;
    /** 组件名称 */
    name?: string;
    /** 组件模糊名称 */
    likeName?: string;
    /** 插入合集 */
    insertList?: {
      /** 容器插入地址 */
      path?: string;
      /** 容器组件插入的索引 */
      index?: number;
      /** 返回插入组件的方法
       * @param data 组件的自定义数据
       */
      getElement?: (data: any) => React.ReactElement;
    }[];
  }[];
  /** 弹窗注入 */
  popupCloseInject?: {
    left?: string | number;
    top?: string | number;
    bottom?: string | number;
    right?: string | number;
    width?: string | number;
    height?: string | number;
    onClose?: () => void;
  }[];
  /** 虚拟列表 */
  virtialRule?: {
    /**
     * 开启机型
     * getSystemInfoSync的model属性值,不配置相当于所有机型都开启
     * */
    model?: string[];
    /**
     * 数值越大,体验效果越好,性能越差
     * 数值越小,性能越好,体验效果越差
     * 最小值为1
     */
    screenCount: number;
    /** 加载元素 */
    loadingElement?: React.ReactElement;
  }[];
  /** 关闭点击事件 */
  closeAction?: boolean;
  /** 跳转路径自动添加参数 */
  addParamsRule?: {
    isAddNow: boolean;
    params?: {
      key: string;
      value: string;
    }[];
  };
  /** 倒计时类型组件注入时间 */
  countdownInject?: {
    name?: string;
    likeName?: string;
    endTime: string;
  }[];
  /** 所有组件样式注入 */
  styleInject?: {
    name?: string;
    likeName?: string;
    style?: React.CSSProperties;
  }[];
  /** 轮播类型组件上下文 */
  swiperContext?: {
    /** 轮播组件名称 */
    name?: string;
    /** 轮播组件模糊名称 */
    likeName?: string;
    /** 默认索引 */
    defaultCurrent?: number;
    /** 插槽 */
    slots?: {
      /** 插入轮播组件中的哪一帧 */
      index?: number;
      /** 被插入的轮播子项是否需要渲染 */
      rerender?: boolean;
      /** 插入组件距离轮播子项左侧距离 */
      left?: number | string;
      /** 插入组件距离轮播子项顶部距离 */
      top?: number | string;
      /** 插入组件距离轮播子项底部距离 */
      bottom?: number | string;
      /** 插入组件距离轮播子项右侧距离 */
      right?: number | string;
      /** 返回插入组件的方法
       * @param data 轮播组件的自定义数据
       * @param currentIndex 轮播当前子项
       */
      getElement?: (data: any, currentIndex: number) => React.ReactElement;
    }[];
  }[];
  /** 接口参数注入 */
  interfaceParamsInject?: {
    /** 类型 */
    type: 'path' | 'query' | 'body';
    /** 规则 */
    rule?: {
      /** 关键字匹配 */
      key: string;
      /** 匹配偏移量 */
      offset?: number;
      /** 更新值 */
      value: string;
    }[];
  }[];
  /** 开启MovableArea高度限制100vh */
  openMovableAreaHeight100VH?: boolean;
  /** Layout组件外层Style */
  globalStyle?: CSSProperties;
  /** 平面层外层Style */
  planeStyle?: CSSProperties;
  /** 窗口层外层Style */
  windowStyle?: CSSProperties;
  /** 加载页Style */
  loadingStyle?: CSSProperties;
  /** tabBar页面跳转成功回调 */
  switchTab?: (data: any) => void;
  /** tabBar页面跳转前回调 */
  beforeSwitchTab?: (data: any) => void;
  /** 事件点击回调 */
  eventCallBack?: (data: any) => void;
  /** 默认事件点击回调 */
  defaultEventCallBack?: (data: any) => void;
  /** 自定义tracking回调 */
  trackingCallBack?: (data: any) => void;
  /** 订阅消息前回调 */
  beforeSubscribeMsg?: (data: any, info: any) => void;
  /** 订阅消息回调 */
  subscribeMsg?: (data: any, info: any) => void;
  /** 分享参数注入 */
  onShareParamsInject?: (
    params: any,
    result: { title: string; path: string; imageUrl: string }
  ) => {
    title: string;
    path: string;
    imageUrl: string;
  };
  /** 自定义分享配置 */
  onShare?: (data: any) => void;
  /** 分享事件回调 */
  onShareAppMessage?: (
    data: any,
    config: { title: string; path: string; imageUrl: string }
  ) => void;
  /** 自定义动作回调 */
  onCustomAction?: (
    params: { code: string; data?: string; customData?: string },
    info: any
  ) => void;
  /** 加载页面数据回调 */
  onLoadPage?: (data: any) => void;
  /** 获取导航栏标题 */
  onLoadNavTitle?: (title: string) => void;
  /** 加载页面自定义数据回调 */
  onLoadCustomData?: (data: any) => void;
  /** Swiper的Change事件 */
  onSwiperChange?: (data: {
    /** 旧的滑块位置 */
    oldCurrent: number;
    /** 新的滑块位置  */
    newCurrent: number;
    /** 当前轮播的Id */
    swiperId: string;
    /** 当前轮播所在组件信息 */
    componentInfo: {
      /** 当前轮播所在组件的Id */
      id: string;
      /** 当前轮播所在组件的名称 */
      tempName: string;
      /** 当前轮播所在组件的索引 */
      index: number;
    };
  }) => void;
  /** ICON组件的收起/展开事件 */
  onIconExtendChange?: (status: boolean, info?: any) => void;
  /** 接口类动作回调 */
  onInterfacesAction?: (data?: any, info?: any) => void;
  /** 视频状态变更相关回调 */
  onVideoStatus?: (data: {
    type: string;
    component: {
      /** 模板code */
      code: string;
      /** 模板名称 */
      name: string;
      /** 模板索引 */
      index: string;
      /** 模板自定义数据 */
      customData: any;
    };
  }) => void;
  /** 检查是否有开屏页组件 */
  onCheckOpenPage?: (data: boolean) => void;
};
```
