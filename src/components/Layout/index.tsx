import 'animate.css';
import dayjs from 'dayjs';
import { MovableArea, View } from '@tarojs/components';
import Taro, {
  requirePlugin,
  usePageScroll,
  useRouter,
  useShareAppMessage
} from '@tarojs/taro';
import { useMemoizedFn, useUpdateEffect, useCreation } from 'ahooks';
import {
  difference,
  get,
  isFunction,
  isNil,
  isObject,
  isString,
  merge,
  omitBy,
  orderBy,
  set,
  sortBy,
  startsWith,
  uniqBy,
  isNaN
} from 'lodash-es';
import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState
} from 'react';
import { useImmer } from 'use-immer';

import {
  getPageByCode,
  getPageById,
  getSubscribeCountByRoomId,
  getThemePageByCode
} from './api/index';
import Compiler from './components/Compiler';
import Loading from './components/Loading';
import Movable from './components/Movable';
import Popup from './components/Popup';
import PreMedia from './components/PreMedia';
import VirtialList from './components/VirtialList';
import { layout } from './config/index';
import {
  computedEventData,
  computedFirstScreenSwiper,
  computedFirstScreenSwiperA,
  computedFirstScreenSwiperB,
  computedInfiniteLoopX,
  computedInfiniteLoopXA,
  computedPendant,
  computedSlideXB,
  getBaseComponent,
  getBaseStyle,
  getDomId,
  getLiveActive,
  getLiveStatus,
  getLiveStatusByChannel,
  getReactStyle,
  getScrollNum,
  getUrl,
  isValidTime,
  log,
  parsingActions,
  rpxTopx,
  setNewSwiperAction,
  setNewSwiperConfig,
  setPageScroll,
  storage,
  computeSize,
  getDynaimcNumByStore
} from './helper';
import usePage from './hooks/usePage';
import useShowRule from './hooks/useShowRule';
import useToken from './hooks/useToken';
import { appStore, store } from './store/index';

import useTask from './hooks/useTask';
import useLifeCycle from './hooks/useLifeCycle';


import './index.less';


export type LayoutProps = {
  /**  主题页面Code */
  code?: string;
  /** 开启主题页面的千人千面 */
  openCrowd?: boolean;
  /** 开启0.5px上移 */
  open05px?: boolean;
  /** 开启数据过滤 */
  openDataFilter?: boolean
  /** 加载数据配置 */
  loadPageConfig?: {
    type: 'id' | 'code';
    value: string;
    date?: number;
  };
  /** 重新加载触发依赖 */
  reloadEffect?: any
  /** 是否离开页面 */
  leavePage?: boolean
  /** 自定义导航栏高度 */
  navHeight?: string;
  /** 自定义导航栏是否占位 */
  isNavPlaceHolder?: boolean;
  /** 自定义tabBar高度 */
  tabHeight?: string;
  /** 底部是否补充自定义tabBar高度 */
  isPlaceholderTabBarHeight?: boolean
  /** 页面跳转补偿高度 */
  pageScrollHeight?: string
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
    /** 加载最大时长(s) */
    maxTime?: number;
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
    getElement?: (data: any, parentData?: any) => React.ReactElement;
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
      getElement?: (data: any, parentData?: any) => React.ReactElement;
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
    getStyle?: ((data: any) => React.CSSProperties)
    outside?: boolean
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
  /** 设置预加载图片视频的最大上限 */
  preMediaCount?: number;
  /** Layout组件外层Style */
  globalStyle?: CSSProperties;
  /** 平面层外层Style */
  planeStyle?: CSSProperties;
  /** 窗口层外层Style */
  windowStyle?: CSSProperties;
  /** 加载页Style */
  loadingStyle?: CSSProperties;
  /** 用户信息 */
  user?: Partial<Edit.User>;
  /** 注册页地址 */
  registerPath?: string
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
  subscribeMsg?: (data: any, info: any, resultObj: any) => void;
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
  /** 检查是否已有导航栏 */
  onCheckTopNavBar?: (data: boolean) => void;
  /** 所有平面层组件曝光回调 */
  onPlaneExposure?: (data: { name: string; index: number }[]) => void
  /** 选择头像回调 */
  onChooseAvatar?: (e: any) => void
};

type LayoutContextType = {
  pageId?: string;
  tabHeight?: number;
  isCustomShare?: boolean;
  videoHeights?: {
    id: string;
    height: string;
  }[];
  notices?: {
    id: string;
    width: number;
    interval: number;
  }[];
  wxButtons?: {
    id: string;
    openType:
    | 'contact'
    | 'share'
    | 'getPhoneNumber'
    | 'openSetting'
    | 'feedback';
    show: boolean;
    title: string;
    path: string;
    imageUrl: string;
  }[];
  swiperRelation?: {
    id: string;
    count: number;
  }[];
  liveData?: {}[];
  common?: any;
  closeAction?: boolean;
  routerParams?: {
    key: string;
    value: string;
  }[];
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
  registerPath?: string
  leavePage?: any
  computedStatusData?: (id: string, actionId: string) => void;
  computedOpenFull?: (currentId: string) => void
};

type TemplateContextType = {
  templateCode?: string;
  templateName?: string;
  templateId?: string;
  templateIndex?: number;
  templateCustomData?: any;
  componentType?: string;
  status?: {
    /** 组件id */
    id: string;
    /** 关联状态合集 */
    list: {
      key: string;
      hide: string[];
    }[];
  };
  iconSlot?: {
    index: number;
    name?: string;
    hide?: boolean;
    element: React.ReactElement;
  }[];
  injectStyle?: React.CSSProperties;
  insertSlot?: {
    path?: string;
    index?: number;
    customData?: any
    getElement?: (data: any, parentData?: any) => React.ReactElement;
  }[];
  viewOverFlowShow?: boolean
};

type FullScreemContextType = {
  fullScreen?: boolean;
};

type LiveTemplateContextType = {
  liveData?: any;
  computedLiveByNoRoomId?: (id: string) => void;
};

type CountdownTemplateContextType = {
  countdownEndTime?: string;
};

type SwiperTemplateContextType = {
  defaultCurrent?: number;
  slots?: {
    index?: number;
    rerender?: boolean;
    left?: number | string;
    top?: number | string;
    bottom?: number | string;
    right?: number | string;
    getElement?: (data: any, currentIndex: number) => React.ReactElement;
  }[];
};

console.log(
  `%c当前Layout组件版本 ${layout.config.version}`,
  'color:#fa8c16;font-szie:26px;'
);

appStore.initSystemInfo()

const systemInfo = Taro.getSystemInfoSync?.();

const deviceWidth = systemInfo?.windowWidth;

let computedCustomDataCount = 5;

const showStyle: CSSProperties = {
  opacity: '1'
};
const hideStyle: CSSProperties = {
  opacity: '0',
  position: 'absolute',
  left: '-9999rpx'
};

const hideStyle2: any = {
  reactStyle: {
    display: 'none'
  }
}

const maxPreMediaCount = 20;

const windowNavTemplate = ['TOPNAVBAR']
const planeNavTemplate = ['SWIPERVERTICALFULLA']

export const LayoutContext = React.createContext<LayoutContextType>({});

export const TemplateContext = React.createContext<TemplateContextType>({});

export const FullScreemContext = React.createContext<FullScreemContextType>({});

export const LiveTemplateContext = React.createContext<LiveTemplateContextType>({});

export const CountdownTemplateContext = React.createContext<CountdownTemplateContextType>({});

export const SwiperTemplateContext = React.createContext<SwiperTemplateContextType>({});

const Layout: React.FC<LayoutProps> = ({
  code,
  openCrowd,
  open05px = true,
  openDataFilter,
  loadPageConfig,
  reloadEffect,
  leavePage,
  navHeight = '0',
  isNavPlaceHolder = true,
  pageScrollHeight = '0',
  tabHeight,
  isPlaceholderTabBarHeight = true,
  loading,
  defaultShareConfig,
  customSlot,
  iconSlot,
  pageSlot,
  globalStyle,
  planeStyle,
  windowStyle,
  loadingStyle,
  closeShare,
  virtialRule,
  containerSlot,
  closeAction,
  addParamsRule,
  popupCloseInject,
  countdownInject,
  styleInject,
  swiperContext,
  interfaceParamsInject,
  openMovableAreaHeight100VH = layout.config.openMovableAreaHeight100VH,
  preMediaCount,
  user,
  registerPath,
  switchTab,
  beforeSwitchTab,
  eventCallBack,
  defaultEventCallBack,
  trackingCallBack,
  subscribeMsg,
  beforeSubscribeMsg,
  onShareParamsInject,
  onShare,
  onShareAppMessage,
  onCustomAction,
  onLoadPage,
  onLoadNavTitle,
  onSwiperChange,
  onLoadCustomData,
  onIconExtendChange,
  onInterfacesAction,
  onVideoStatus,
  onCheckOpenPage,
  onCheckTopNavBar,
  onPlaneExposure,
  onChooseAvatar
}) => {
  const router = useRouter();
  const [pageInfo, setPageInfo] = useState<any>();
  const [layoutStyle, setLayoutStyle] = useImmer<CSSProperties>({
    height: "auto"
  })
  const [planeData, setPlaneData] = useImmer<any>([]);
  const [windowData, setWindowData] = useImmer<any>([]);
  const [bottomWindowData, setBottomWindowData] = useImmer<any>([]);
  const [catchMove, setCatchMove] = useState<boolean>(false);
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
  const [liveData, setLiveData] = useImmer<any>([]);
  const [updateStatus, setUpdateStatus] = useState<any>();
  const [updateTopdata, setUpdateTopdata] = useState<any>();
  const [updateCustom, setUpdateCustom] = useState<any>();
  const pageRef = useRef<any>();
  const planeRef = useRef<any>([]);
  const hideDataRef = useRef<any>([]);
  const allTempInfo = useRef<any>();
  const moveRef = useRef<any>();
  const customRef = useRef<any>();
  const comMoveRef = useRef<any>();
  const updateTempRef = useRef<any>();
  const elesRef = useRef<any>([]);
  const topDataRef = useRef<any>([]);
  const clearCustomDataRef = useRef<any>();
  const clearLiveDataRef = useRef<any>();
  const planeExposureRef = useRef<any>([]);
  const scrollRef = useRef<any>([])
  const fullScreenRef = useRef(false)
  const fullScreeningRef = useRef(false)
  const pageScrolllRef = useRef<any>({
    isTop: true
  })
  const navHeightPxNumRef = useRef(0)
  const navHeightPxNum = useCreation(() => {
    let result = 0
    if (navHeight.indexOf('rpx') !== -1) {
      result = rpxTopx(parseInt(navHeight || '0'), deviceWidth);
    } else {
      result = parseInt(navHeight || '0')
    }
    navHeightPxNumRef.current = result
    return result;
  }, [navHeight]);
  const tabBarHeightPxNum = useCreation(() => {
    if (!tabHeight) {
      return 0
    }
    if (tabHeight?.indexOf('rpx') !== -1) {
      return rpxTopx(parseInt(tabHeight), deviceWidth);
    }
    return isNaN(parseInt(tabHeight)) ? 0 : parseInt(tabHeight);
  }, [tabHeight])
  const loadingIds = useCreation(() => {
    if (pageInfo?.size && loading) {
      return pageInfo?.size?.reduce((pre: any, cur) => {
        if (pre.length < (loading.count || 10)) {
          pre.push(getDomId(cur.id));
        }
        return pre;
      }, []);
    }
    return null;
  }, [pageInfo?.size, loading]);
  const routerParams = useCreation(() => {
    const result = addParamsRule?.params ?? [];
    const excludeKeys = ['code', 'id'];
    if (addParamsRule?.isAddNow) {
      for (let [key, value] of Object.entries(router.params)) {
        if (!excludeKeys.includes(key)) {
          result.push({
            key,
            value: value as string
          });
        }
      }
    }
    return result;
  }, [router.params, addParamsRule]);
  const preMedias = useCreation(() => {
    return (
      pageInfo?.preMedias.filter((_, index) => {
        if (index > maxPreMediaCount) {
          return false;
        }
        if (index < (preMediaCount ?? maxPreMediaCount)) {
          return true;
        }
        return false;
      }) ?? []
    );
  }, [pageInfo?.preMedias, preMediaCount]);
  const pageStyle = useCreation(() => {
    let minHeight = pageInfo?.customData?.pageSetting?.minHeight ?? 'auto'
    if (minHeight === '100vh') {
      minHeight = `calc(100vh - ${tabBarHeightPxNum}px)`
    }
    return {
      backgroundColor: pageInfo?.config?.background || 'transparent',
      backgroundImage: `url(${pageInfo?.customData?.pageSetting?.backgroundImg})`,
      backgroundRepeat: pageInfo?.customData?.pageSetting?.backgroundRepeat ?? 'repeat',
      backgroundSize: pageInfo?.customData?.pageSetting?.backgroundSize ?? 'cover',
      backgroundPosition: pageInfo?.customData?.pageSetting?.backgroundPosition ?? 'center',
      minHeight,
    }
  }, [pageInfo, tabBarHeightPxNum])
  const { isNowPage } = usePage();
  const { getToken } = useToken();
  const { initTask } = useTask()
  const { initLifeCycle } = useLifeCycle()
  useShowRule(navHeightPxNum, placeholderHeight, pageInfo?.id, windowData);
  /** 事件注册集合 */
  const eventsOn = useMemoizedFn(() => {
    const pageId = pageRef.current?.id
    Taro.eventCenter.off(`layout_beforeSwitchTab_${pageId}`).on(`layout_beforeSwitchTab_${pageId}`, data => {
      beforeSwitchTab?.(data);
    });
    Taro.eventCenter.off(`layout_switchTab_${pageId}`).on(`layout_switchTab_${pageId}`, data => {
      switchTab?.(data);
    });
    Taro.eventCenter.off(`layout_eventCallBack_${pageId}`).on(`layout_eventCallBack_${pageId}`, data => {
      eventCallBack?.(computedEventData(pageRef.current, data));
    });
    Taro.eventCenter.off(`layout_defaultEventCallBack_${pageId}`).on(`layout_defaultEventCallBack_${pageId}`, data => {
      defaultEventCallBack?.(data);
    });
    Taro.eventCenter.off(`layout_trackingCallBack_${pageId}`).on(`layout_trackingCallBack_${pageId}`, data => {
      trackingCallBack?.(data);
    });
    Taro.eventCenter.off(`layout_subscribeMsg_${pageId}`).on(`layout_subscribeMsg_${pageId}`, (data, info, resultObj) => {
      subscribeMsg?.(data, info, resultObj);
    });
    Taro.eventCenter.off(`layout_beforeSubscribeMsg_${pageId}`).on(
      `layout_beforeSubscribeMsg_${pageId}`,
      (data, info) => {
        beforeSubscribeMsg?.(data, info);
      }
    );
    Taro.eventCenter.off(`layout_share_${pageId}`).on(`layout_share_${pageId}`, data => {
      onShare?.(data);
    });
    Taro.eventCenter.off(`layout_customAction_${pageId}`).on(`layout_customAction_${pageId}`, (data, info) => {
      onCustomAction?.(data, info);
    });
    Taro.eventCenter.off(`layout_swiperchange_${pageId}`).on(`layout_swiperchange_${pageId}`, data => {
      onSwiperChange?.(data);
    });
    Taro.eventCenter.off(`layout_iconExtendChange_${pageId}`).on(
      `layout_iconExtendChange_${pageId}`,
      (data, info) => {
        onIconExtendChange?.(data, info);
      }
    );
    Taro.eventCenter.off(`layout_interfacesAction_${pageId}`).on(
      `layout_interfacesAction_${pageId}`,
      (data, info) => {
        onInterfacesAction?.(data, info);
      }
    );
    Taro.eventCenter.off(`layout_onVideoCallback_${pageId}`).on(`layout_onVideoCallback_${pageId}`, data => {
      onVideoStatus?.(data);
    });
    Taro.eventCenter.off(`layout_onChooseAvatar_${pageId}`).on(`layout_onChooseAvatar_${pageId}`, data => {
      onChooseAvatar?.(data)
    })
  });
  /** 加载页面数据 */
  const loadPage = useMemoizedFn(async () => {
    let newpage: any = null;
    if (loadPageConfig) {
      if (loadPageConfig.type === 'id') {
        newpage = await getPageById({
          id: loadPageConfig.value,
          date: loadPageConfig.date,
          showInValid: !openDataFilter
        });
      } else if (loadPageConfig.type === 'code') {
        newpage = await getPageByCode(loadPageConfig.value, {
          showInValid: !openDataFilter
        });
      }
    } else {
      if (router.params.id) {
        newpage = await getPageById({
          id: router.params.id,
          date: router.params.date ? Number(router.params.date) : undefined,
          type: router.params.type,
          showInValid: !openDataFilter
        });
      } else if (router.params.code) {
        newpage = await getPageByCode(router.params.code, {
          showInValid: !openDataFilter
        });
      } else {
        newpage = await getThemePageByCode({
          code,
          word: openCrowd,
          showInValid: !openDataFilter
        });
      }
    }
    initLifeCycle(newpage.data?.components?.plane?.[0]?.extendInfo?.lifeCycle, newpage.data?.id)
    onCheckOpenPage?.(
      newpage.data.components?.window?.findIndex(
        (x: any) => x.templateCode === 'OPENPAGE'
      ) !== -1
    );
    onCheckTopNavBar?.(newpage.data.components?.window?.findIndex(
      (x: any) => windowNavTemplate.includes(x.templateCode)
    ) !== -1 || newpage.data.components?.plane?.findIndex(
      (x: any) => planeNavTemplate.includes(x.templateCode)
    ) !== -1)
    onLoadCustomData?.(newpage.data.customData);
    newpage.data.components?.plane?.forEach(item => {
      const pendants = newpage.data?.components?.pendant?.reduce(
        (pPre: any, pCur: any) => {
          item?.extendInfo?.pendants?.forEach((x: any) => {
            if ((isObject(x) as any) && x.id === pCur.id) {
              pPre.push({
                comPath: x.path.replace(/\]/g, '').replace(/\[/g, '').replace(/children/g, ''),
                path: x.path,
                value: pCur.data,
                templateName: pCur.name,
                customData: pCur.customData
              });
            }
            if (isString(x) && x === pCur.id) {
              pPre.push({
                path: '0',
                comPath: '0',
                value: pCur.data,
                templateName: pCur.name,
                customData: pCur.customData
              });
            }
          });
          return pPre;
        },
        []
      );
      pendants?.forEach(p => {
        const com = get(item.data, p.path);
        com?.children?.push(...computedPendant(p.value, com.level));
        p.comPath = p.comPath + `.${(com.children?.length ?? 0) - 1}`
        p.index = (p.value[0]?.children?.length ?? 0) - 1
        delete p.value
      });
      set(item, 'extendInfo.newPendants', pendants)
    });
    pageRef.current = newpage.data;
    initScrollRef();
    initStoreRef();
    initLayoutStyle();
    initCustomNavHeight();
    loopComponent();
    computedPage();
    if (['zoom'].includes(newpage.data?.preCompile?.openFullScreen)) {
      changeFullScreen(true, true)
    }
    eventsOn();
    onLoadPage?.(newpage.data);
    computedTask(newpage.data?.preCompile?.customData?.tasks)
    computedStorageData()
  });
  const initScrollRef = useMemoizedFn(() => {
    const scrollUpdates = pageRef.current?.preCompile?.customData?.scrollUpdates
    scrollRef.current = scrollUpdates?.map((x: any) => {
      x.isCheck = x.isCheck ?? false
      x.start = getScrollNum(x.start, systemInfo.windowHeight)
      x.end = getScrollNum(x.end, systemInfo.windowHeight)
      if (x.checkStyles) {
        x.checkStyles = x.checkStyles.map((y) => ({
          key: y.comId,
          value: getReactStyle(y.style)
        }))
      }
      if (x.unCheckStyles) {
        x.unCheckStyles = x.unCheckStyles.map((y) => ({
          key: y.comId,
          value: getReactStyle(y.style)
        }))
      }
      return x
    })
  })
  const initStoreRef = useMemoizedFn(() => {
    const bindRef = pageRef.current?.preCompile?.customData?.bindRef
    if (bindRef) {
      bindRef.forEach(item => {
        store.setRef(item.value, pageRef.current?.id, item.key)
      })
    }
  })
  const initLayoutStyle = useMemoizedFn(() => {
    if (pageRef.current?.preCompile?.customData?.layoutStyle) {
      setLayoutStyle(draft => {
        merge(draft, pageRef.current?.preCompile?.customData?.layoutStyle)
      })
    }
  })
  const initCustomNavHeight = useMemoizedFn(() => {
    if (pageRef.current?.preCompile?.customData?.navHeight) {
      const customNavHeight = getDynaimcNumByStore(pageRef.current?.preCompile?.customData?.navHeight) ?? 0
      console.log('customNavHeight', customNavHeight)
      storage.set(`layout_navHeightPxNum_${pageRef.current?.id}`, customNavHeight);
      navHeightPxNumRef.current = customNavHeight
    }
  })
  const computedTask = useMemoizedFn((tasks) => {
    const taskList = tasks?.map(item => {
      if (item.type === 'INFINITELOOPX') {
        item.func = computedInfiniteLoopX
        item.params = [item.params, pageRef.current?.id, item.templateId]
      }
      if (item.type === 'INFINITELOOPXA') {
        item.func = computedInfiniteLoopXA
        item.params = [item.params, pageRef.current?.id, item.templateId]
      }
      return item
    })
    initTask(taskList)
  })
  const computedStorageData = useMemoizedFn(() => {
    if (pageScrollHeight) {
      let pageScrollHeightPxNum = 0
      if (pageScrollHeight.indexOf('rpx') !== -1) {
        pageScrollHeightPxNum = rpxTopx(parseInt(pageScrollHeight || '0'), deviceWidth);
      } else {
        pageScrollHeightPxNum = parseInt(pageScrollHeight || '0');
      }
      storage.set(
        `layout_pageScrollHeightPxNum_${pageRef.current?.id}`,
        pageScrollHeightPxNum
      );
    }
  })
  /** 递归组件优化数据 */
  const loopComponent = useMemoizedFn(() => {
    const isOpenDataFilter = !!pageRef.current?.preCompile?.customData?.openDataFilter
    const removeTemplates: any = []
    /** 获取删除元素的集合 */
    const getRemoveTemplate = (com, i, template) => {
      const index = removeTemplates.findIndex((x: any) => x.templateId === template.templateId)
      if (index === -1) {
        removeTemplates.push({
          ...template,
          comIds: [com.id],
          current: {
            key: template.extendInfo?.swiperInfo?.swiperId,
            delIndexs: [i]
          }
        })
      } else {
        removeTemplates[index].comIds.push(com.id)
        removeTemplates[index].current.delIndexs.push(i)
      }
    }
    /** 优化Components对象 */
    const omitFunc = (value, key) => {
      if (['name'].includes(key)) {
        return true;
      }
      if (['event', 'exclusiveEvent'].includes(key)) {
        if (value?.find(x => x.type === 'tap')?.actions?.length === 0) {
          return true;
        }
      }
    };
    /** 挂件动画数据初始化 */
    const computedPendantAnimation = item => {
      if (
        item?.customData?.pendantAnimation?.style?.animationName &&
        item?.customData?.pendantAnimation?.triggerRules
      ) {
        set(item, 'style.opacity', '0');
      }
    };
    /** swiper和scrollView内的子孙元素添加索引 */
    const computedSwiperScrollView = (item: any) => {
      if (['swiperView', 'scrollView'].includes(item.type)) {
        function loopSwiperScroll(data, currentIndex) {
          data?.forEach((y) => {
            y.currentIndex = currentIndex
            if (y.children?.length) {
              loopSwiperScroll(y.children, currentIndex)
            }
          })
        }
        item?.children.forEach((x, index) => {
          x.currentIndex = index
          loopSwiperScroll(x.children, index)
        })
      }
    }
    /** 递归更新 */
    const loop = (arr, path, isDelete = false, template?) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        /** 判断是否在有效期 */
        if (
          isDelete && (arr[i]?.customData?.delete || (arr[i]?.customData?.countDown?.endTime && !dayjs().isBefore(arr[i]?.customData?.countDown?.endTime)))
        ) {
          arr.splice(i, 1);
        }
        else if (isDelete && !isValidTime(arr[i]?.validTime)) {
          getRemoveTemplate(arr[i], i, template)
          arr.splice(i, 1);
        }
        else if (!isDelete) {
          arr[i].path = path ? `${path}.${i}` : `${i}`;
          computedPendantAnimation(arr[i]);
          computedSwiperScrollView(arr[i]);
          arr[i] = omitBy(arr[i], omitFunc);
        }
        if (arr[i]?.children?.length > 0) {
          loop(arr[i].children, path ? `${path}.${i}` : `${i}`, isDelete, template);
        }
      }
    };
    pageRef.current?.components?.window?.forEach(x => {
      if (!openDataFilter) {
        loop(x.data, '', true, {
          templateCode: x.templateCode,
          templateId: x.id,
          extendInfo: x.extendInfo
        });
      }
      if (!isOpenDataFilter) {
        loop(x.data, '', false);
      }
    });
    pageRef.current?.components?.plane?.forEach(x => {
      if (!openDataFilter) {
        loop(x.data, '', true, {
          templateCode: x.templateCode,
          templateId: x.id,
          extendInfo: x.extendInfo
        });
      }
      if (!isOpenDataFilter) {
        loop(x.data, '', false);
      }
    });
    if (pageRef.current?.preCompile?.customData?.removeTemplates?.length) {
      removeTemplates.push(...(pageRef.current?.preCompile?.customData?.removeTemplates ?? []))
    }
    if (removeTemplates?.length) {
      store.setRef({ list: removeTemplates }, pageRef.current?.id, 'removeTemplates')
      computeValidData(removeTemplates)
    }
  });
  /** 处理过期元素的数据问题 */
  const computeValidData = useMemoizedFn((removeTemplates) => {
    const loop = (arr, myCurrent) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].swiperCurrent) {
          setNewSwiperConfig(arr[i].swiperCurrent, myCurrent)
        }
        if (arr[i].swiperNav) {
          setNewSwiperConfig(arr[i].swiperNav, myCurrent)
        }
        if (arr[i].customData?.swiperCurrent) {
          setNewSwiperConfig(arr[i]?.customData?.swiperCurrent, myCurrent)
        }
        if (arr[i].customData?.swiperCurrentAction) {
          setNewSwiperConfig(arr[i]?.customData?.swiperCurrentAction, myCurrent)
        }
        setNewSwiperAction(arr[i]?.event?.[0]?.actions, myCurrent)
        if (arr[i]?.children?.length > 0) {
          loop(arr[i].children, myCurrent);
        }
      }
    };
    removeTemplates.forEach((item: any) => {
      pageRef.current?.components?.window.forEach(x => {
        if (item.templateId === x.id) {
          loop(x.data, item.current)
        }
      })
      pageRef.current?.components?.plane.forEach(x => {
        if (item.templateId === x.id) {
          loop(x.data, item.current)
        }
      })
    })
  })
  /** 删除组件元素额外处理 */
  const computeRemoveTempates = useMemoizedFn(() => {
    const removeTemplates = get(store.ref, `${pageRef.current?.id}.removeTemplates`)
    if (removeTemplates?.list) {
      removeTemplates?.list.forEach((item) => {
        if (item.templateCode === 'INFINITELOOPX') {
          Taro.nextTick(() => {
            setTimeout(() => {
              computedInfiniteLoopX({ ...(item?.extendInfo?.customTouch ?? {}) }, pageRef.current?.id, item.templateId)
            }, 100)
          })
        }
        if (item.templateCode === 'INFINITELOOPXA') {
          Taro.nextTick(() => {
            setTimeout(() => {
              computedInfiniteLoopXA({ ...(item?.extendInfo?.customTouch ?? {}) }, pageRef.current?.id, item.templateId)
            }, 100)
          })
        }
      })
    }

  })
  /** 计算页面数据 */
  const computedPage = useMemoizedFn(() => {
    if (pageRef.current) {
      const page = pageRef.current;
      if (page && !page.config?.openShare && !closeShare) {
        Taro.hideShareMenu();
      }
      if (page?.titleNav) {
        Taro.setNavigationBarTitle({
          title: page?.titleNav
        });
        onLoadNavTitle?.(page?.titleNav);
      }
      computedStatusData('init');
      computedAllTempInfo();
      const plane = page?.components?.plane.reduce((pre: any, cur: any) => {
        const defaultHeight = pageRef.current?.preCompile?.size.find(
          x => x.id === cur.data[0].id
        )?.content[1];
        if (page?.preCompile?.customData?.topNavBarHideList?.includes(cur.data[0].id)) {
          merge(cur.data[0].style, hideStyle2);
        }
        pre.push({
          ...cur.data[0],
          height:
            allTempInfo.current.find(x => x.id === cur.data[0].id)?.height ??
            0,
          defaultHeight:
            rpxTopx(Number(defaultHeight).toFixed(), deviceWidth) ?? 0,
          templateId: cur.id,
          templateName: cur.name,
          templateCode: cur.templateCode,
          customCode: cur.customCode,
          templateCustomData: cur.customData,
          extendInfo: cur.extendInfo,
          status: page?.preCompile?.status?.find(
            x => x.id === cur.data[0]?.id
          ),
          isShow: !hideDataRef.current.some(x =>
            x.list.includes(cur.data[0].id)
          ),
          topData: topDataRef.current.find(x => x.id === cur.data[0].id)
        });
        return pre;
      }, []) ?? [];
      planeRef.current = plane;
      const bottoms: string[] = ['WINDOWBOTTOM'];
      const window =
        page?.components?.window.reduce((pre: any, cur: any) => {
          if (!bottoms.includes(cur.templateCode)) {
            pre.push({
              ...cur.data[0],
              templateName: cur.name,
              templateCode: cur.templateCode || 'ICON',
              templateCustomData: cur.customData,
              showRule: cur.extendInfo?.showRule,
              status: page?.preCompile?.status?.find(
                x => x.id === cur.data[0]?.id
              ),
              movable: { ...cur?.movable, disabled: !cur?.movable?.disabled }
            });
          }
          return pre;
        }, []) ?? [];
      const bottomWindows =
        page?.components?.window.reduce((pre: any, cur: any) => {
          if (bottoms.includes(cur.templateCode)) {
            pre.push({
              ...cur.data[0],
              templateName: cur.name,
              templateCode: cur.templateCode || 'ICON',
              customData: cur.customData,
              showRule: cur.extendInfo?.showRule,
              status: page?.preCompile?.status?.find(
                x => x.id === cur.data[0]?.id
              ),
              movable: { ...cur?.movable, disabled: !cur?.movable?.disabled }
            });
          }
          return pre;
        }, []) ?? [];
      const topNavBar = window.find((x) => x.templateCode === 'TOPNAVBAR')
      if (topNavBar) {
        const topNabBarHeight = page?.preCompile?.size?.find((x) => x.id === topNavBar.id)?.content
        if (topNabBarHeight) {
          setPlaceholderHeight(rpxTopx(Number(topNabBarHeight?.[1]).toFixed(), deviceWidth) ?? 0)
        }
      }
      setPlaneData(draft => {
        draft.splice(0, draft.length);
        draft.push(...plane);
      });
      setWindowData(draft => {
        draft.splice(0, draft.length);
        draft.push(...window);
      });
      setBottomWindowData(draft => {
        draft.splice(0, draft.length);
        draft.push(...bottomWindows);
      });
      setPageInfo({
        id: page.id,
        config: page?.config,
        ...page.preCompile
      });
      computedLive();
      computedCustomData();
      planeExposureHandler({ scrollTop: 0 })
      computeRemoveTempates();
    }
  });
  /** 计算置顶数据距离顶部高度 */
  const computedTopDataTop = useMemoizedFn((resTopData = []) => {
    // 计算每个fixed的元素top距离,非占位置顶需要排在占位置顶后面
    let fixedData = orderBy(
      resTopData?.filter(x => x.fixed === true),
      ['sort'],
      ['asc']
    );
    let nextHeight = 0;
    fixedData?.forEach(x => {
      x.marginTop = nextHeight;
      nextHeight = nextHeight + x.height;
    });
    return resTopData.map(x => {
      x.marginTop = fixedData.find(y => y.id === x.id)?.marginTop ?? 0;
      x.top = (navHeightPxNumRef.current ?? 0) + x.marginTop
      return x;
    });
  });
  /** 页面滚动-通用状态处理 */
  const pageScrollHandler = useMemoizedFn(({ scrollTop }) => {
    if (layoutStyle.position !== 'fixed') {
      if (scrollTop <= 0 && !pageScrolllRef.current.isTop) {
        pageScrolllRef.current.isTop = true
      }
      if (scrollTop > 0 && pageScrolllRef.current.isTop) {
        pageScrolllRef.current.isTop = false
      }
    }
  })
  /** 页面滚动-置顶模块处理 */
  const pageScrollTopHandler = useMemoizedFn(async ({ scrollTop }) => {
    if (scrollTop < 0) {
      scrollTop = 0
    }
    if (!isNavPlaceHolder) {
      scrollTop = scrollTop + navHeightPxNumRef.current
    }
    let myData = JSON.parse(JSON.stringify(topDataRef.current));
    let isUpdateTopData: boolean = false;
    let updateHeight: number = 0;
    myData?.forEach(item => {
      const startScrollTop = (item?.startScrollTop ?? 0);
      const endScrollTop = (item?.endScrollTop || 0);
      if (scrollTop >= startScrollTop && (scrollTop < endScrollTop || endScrollTop === 0) && !item.fixed) {
        item.isEnd = false
        item.fixed = true;
        isUpdateTopData = true;
        updateHeight = updateHeight + item.height;
      }
      if (((scrollTop > (endScrollTop - placeholderHeight) && endScrollTop !== 0) || scrollTop < startScrollTop) && item.fixed) {
        item.fixed = false;
        isUpdateTopData = true;
        updateHeight = updateHeight - (item.height || 0);
      }
      if (scrollTop > (endScrollTop - placeholderHeight) && endScrollTop !== 0) {
        item.isEnd = true
      }
    });
    if (isUpdateTopData) {
      topDataRef.current = computedTopDataTop(myData);
      if (virtialRule) {
        setUpdateTopdata(topDataRef.current);
      } else {
        setPlaneData((draft) => {
          topDataRef.current.forEach(item => {
            const myIndex = draft.findIndex(y => y.id === item.id);
            if (myIndex !== -1) {
              draft[myIndex].topData = item;
            }
          })
        })
      }
    }
    if (updateHeight !== 0) {
      setPlaceholderHeight(placeholderHeight + updateHeight);
    }
  });
  /** 页面滚动-电梯组件处理 */
  const pageScrollEleHandler = useMemoizedFn(async ({ scrollTop }) => {
    if (scrollTop < 0 || get(store.ref, `${pageRef.current?.id}.base`)?.isRoutePage) {
      return;
    }
    scrollTop = scrollTop + navHeightPxNumRef.current + (placeholderHeight || 0);
    elesRef.current?.forEach((ele: any, eleIndex: number) => {
      for (let i = 0; i < ele.tops.length; i++) {
        if (
          scrollTop >= ele.tops[i].start &&
          scrollTop < ele.tops[i].end &&
          i !== ele.selIndex
        ) {
          parsingActions(ele.tops[i].actions, pageInfo?.id, {});
          elesRef.current[eleIndex].selIndex = i;
          break;
        }
      }
    });
  });
  /** 计算电梯跳转相关的高度 */
  const computedElevators = useMemoizedFn(updateHeight => {
    const changeNum = updateHeight + navHeightPxNumRef.current;
    const layoutElevators = (pageRef.current?.preCompile?.elevators || []).map(
      id => {
        const rect = allTempInfo.current?.find(x => x.id === id);
        return {
          id,
          top: rect?.top ? rect?.top - changeNum : NaN
        };
      }
    );
    log('layoutElevators', layoutElevators, navHeightPxNumRef.current);
    if (pageRef.current?.id) {
      storage.set(
        `layout_navHeightPxNum_${pageRef.current?.id}`,
        navHeightPxNumRef.current
      );
      storage.set(`layout_topData_${pageRef.current?.id}`, '[]')
      storage.arrPush(
        `layout_topData_${pageRef.current?.id}`,
        topDataRef.current
      );
      storage.set(`layout_elevators_${pageRef.current?.id}`, '[]')
      storage.arrPush(
        `layout_elevators_${pageRef.current?.id}`,
        layoutElevators
      );
    }
  });
  /** 计算电梯变化数据 */
  const computedEles = useMemoizedFn(() => {
    const preEles = pageRef.current?.preCompile?.eles || [];
    if (preEles.length > 0 && elesRef.current?.length === 0) {
      preEles.forEach(x => {
        if (x.selIndex !== -1) {
          const actions = x.tops[x.selIndex]?.actions || [];
          if (actions.length > 0) {
            parsingActions(actions, pageRef.current?.id, {});
          }
        }
      });
      preEles.forEach(item => {
        let eleRects = allTempInfo.current.reduce((pre, cur) => {
          const top = item.tops.find(x => x.id === cur.id);
          if (top) {
            pre.push({
              ...cur,
              ...top
            });
          }
          return pre;
        }, []);
        eleRects = sortBy(eleRects, ['top']);
        item.tops = eleRects.map((x, index) => {
          x.start = x.top;
          x.end = eleRects[index + 1] ? eleRects[index + 1].top : 99999999;
          return x;
        });
        elesRef.current?.push(item);
      });
    }
  });
  /** 计算所有模板的详细数据 */
  const computedAllTempInfo = useMemoizedFn((isNeedUpdate = true) => {
    let lastHeight: number = 0;
    const plane = pageRef.current?.components?.plane || [];
    const rects = (pageRef.current?.preCompile?.size || [])
      .filter(
        x =>
          !hideDataRef.current.some(y => y.list.includes(x.id)) &&
          plane?.some(p => p.data?.[0]?.id === x.id)
      )
      .map((item, index) => {
        let [width, height, marginTop, marginBottom] = [0, 0, 0, 0];
        width = rpxTopx(Number(item.content[0]).toFixed(), deviceWidth);
        height = rpxTopx(Number(item.content[1]).toFixed(), deviceWidth);
        marginTop = rpxTopx(
          Number(item.content[2] || '0').toFixed(),
          deviceWidth
        );
        marginBottom = rpxTopx(
          Number(item.content[3] || '0').toFixed(),
          deviceWidth
        );
        if (customRef.current?.length > 0) {
          const custom = customRef.current.find(
            x => x.id === getDomId(item.id)
          );
          if (custom) {
            width = custom.width;
            height = custom.height;
          }
        }
        if (updateTempRef.current?.length > 0) {
          const updateTemp = updateTempRef.current.find(
            x => x.id === getDomId(item.id)
          );
          if (updateTemp) {
            width = updateTemp.width;
            height = updateTemp.height;
          }
        }
        const top = lastHeight + marginBottom + marginTop;
        lastHeight = top + height + (open05px ? 0.5 : 0);
        const planeObj = plane.find(x => x.data?.[0].id === item.id)
        return {
          id: item.id,
          width,
          height,
          top,
          index,
          name: planeObj?.name,
          templateCode: planeObj?.templateCode
        };
      });
    allTempInfo.current = rects;
    if (isNeedUpdate) {
      computedUpdateByTempInfo();
    }
  });
  /** 计算模板更新导致的更新 */
  const computedUpdateByTempInfo = useMemoizedFn(() => {
    const rects = allTempInfo.current;
    const plane = pageRef.current?.components?.plane || [];
    let updateHeight: number = 0;
    const needComputedTopData = plane.reduce((pre: any[], cur) => {
      if (cur?.topData?.enable) {
        const startRect = rects.find(x => x.id === cur.topData.startId);
        const endRect = rects.find(x => x.id === cur.topData.endId);
        const topRect = rects.find(x => x.id === cur.topData.id);
        const startScrollTop = startRect
          ? (cur.topData.startScrollTop || 0) + (startRect.top || 0)
          : cur.topData.startScrollTop || 0;
        const endScrollTop = endRect
          ? (cur.topData.endScrollTop || 0) +
          (endRect?.top || 0) +
          (endRect?.height || 0)
          : cur.topData.endScrollTop || 0;
        if (startScrollTop === 0) {
          if (cur.topData.placeholder) {
            updateHeight = updateHeight + (topRect ? topRect.height : cur.topData.height);
          }
          cur.topData.fixed = true;
        }
        pre.push({
          ...cur?.topData,
          height: topRect ? topRect.height : cur.topData.height,
          startScrollTop,
          endScrollTop
        });
      }
      return pre;
    }, []);
    topDataRef.current = computedTopDataTop(needComputedTopData);
    computedEles();
    computedElevators(updateHeight);
    setPlaceholderHeight(updateHeight);
  });
  /** 开启全屏 */
  const changeFullScreen = useMemoizedFn((status, isFirst = false) => {
    const fullScreenComId = pageRef.current?.preCompile?.customData?.fullScreenComId
    const time = 400
    if (fullScreenComId && !fullScreeningRef.current) {
      fullScreeningRef.current = true
      if (status) {
        fullScreenRef.current = true
        setCatchMove(true)
        if (isFirst) {
          Taro.nextTick(() => {
            setTimeout(() => {
              store.setAllStyle({
                key: fullScreenComId,
                value: {
                  transition: `${time}ms`,
                  zIndex: 9,
                  width: '750rpx',
                  height: `calc(100vh - ${tabBarHeightPxNum}px)`
                }
              }, pageRef.current?.id)
              setTimeout(() => {
                fullScreeningRef.current = false
              }, time)
            }, 800)
          })
        } else {
          store.setAllStyle({
            key: fullScreenComId, value: {
              transition: `${time}ms`,
              zIndex: 9,
              width: '750rpx',
              height: `calc(100vh - ${tabBarHeightPxNum}px)`
            }
          }, pageRef.current?.id)
          Taro.nextTick(() => {
            setTimeout(() => {
              fullScreeningRef.current = false
            }, time)
          })
        }
      } else {
        store.setAllStyle({
          key: fullScreenComId, value: {
            transition: `${time}ms`
          }
        }, pageRef.current?.id)
        Taro.nextTick(() => {
          setTimeout(() => {
            setCatchMove(false)
            fullScreenRef.current = false
            fullScreeningRef.current = false
          }, time)
        })

      }
    }
  })
  /** 全屏状态处理操作 */
  const fullScreenHandler = useMemoizedFn(res => {
    if (pageRef.current?.preCompile?.openFullScreen === 'zoom') {
      const isCheck = isCheckFull()
      if (isCheck && isNowPage) {
        if (res.scrollTop === 0 && !fullScreenRef.current) {
          changeFullScreen(true)
        }
      }
    }
  });
  /** 计算所有状态类组件 */
  const computedStatusData = useMemoizedFn((id: string, actionId?: string) => {
    const { status } = pageRef.current?.preCompile;
    if (status && status.length > 0) {
      let oldHides = hideDataRef.current.find(x => x.id === id)?.list;
      if (!oldHides) {
        oldHides = status
          .find(x => x.id === id)
          ?.list?.find(y => y.key === 'init')?.hide;
      }
      const hides = pageRef.current?.preCompile.status.reduce(
        (pre: any, cur: any) => {
          if (id === 'init') {
            const initHides = cur.list.find(x => x.key === 'init')?.hide;
            pre.push(...(initHides || []));
          } else if (id === cur.id) {
            const actionHides = cur.list.find(x => x.key === actionId)?.hide;
            pre.push(...(actionHides || []));
          }
          return pre;
        },
        []
      );
      if (hides) {
        if (!hideDataRef.current.some(x => x.id === id)) {
          hideDataRef.current.push({ id, list: hides });
        } else {
          hideDataRef.current.forEach(x => {
            if (x.id === id) {
              x.list = hides;
            }
          });
        }
        if (hideDataRef.current.length >= 2) {
          hideDataRef.current.forEach(x => {
            if (x.id === 'init') {
              x.list = x.list.filter(
                y =>
                  !status
                    .find(s => s.id === id)
                    ?.list.some(t => t.key !== 'init' && t.hide.includes(y))
              );
            }
          });
        }
      }
      if (id !== 'init') {
        const newHides = hideDataRef.current.find(x => x.id === id)?.list;
        const showHides = difference(oldHides, newHides) ?? [];
        const upStatus = [
          ...newHides.map(x => ({ id: x, type: 'hide' })),
          ...showHides.map(x => ({ id: x, type: 'show' }))
        ]
        if (virtialRule) {
          setUpdateStatus(upStatus);
        } else {
          setPlaneData((draft) => {
            upStatus?.forEach(item => {
              const myIndex = draft.findIndex(y => y.id === item.id);
              if (myIndex !== -1) {
                const newStatus = item.type === 'show' ? true : false;
                draft[myIndex].isShow = newStatus;
              }
            })
          })
        }

      }
    }
  });
  /** 计算自定义模板数据 */
  const computedCustomData = useMemoizedFn(() => {
    const ids = pageRef.current?.preCompile?.customTemp?.map(x => x.id);
    if (ids && ids.length > 0 && allTempInfo.current && !customRef.current) {
      const fn = () => {
        if (computedCustomDataCount >= 0) {
          const query = Taro.createSelectorQuery();
          const idsStr = ids.map(x => `#${getDomId(x)}`).join(',');
          query.selectAll(idsStr).boundingClientRect();
          query.exec(function (res) {
            if (res.length > 0 && res[0].length > 0) {
              const list = res[0]
                .filter(x => x.height > 0)
                .map(x => {
                  return {
                    id: x.id,
                    width: Math.round(x.width),
                    height: Math.round(x.height)
                  };
                });
              if (list.length === res[0].length) {
                customRef.current = list;
                Taro.nextTick(() => {
                  computedAllTempInfo();
                  const upCustom: any = uniqBy(customRef.current, 'id')
                  if (virtialRule) {
                    setUpdateCustom(upCustom);
                  } else {
                    setPlaneData((draft) => {
                      upCustom?.forEach(item => {
                        const myIndex = draft.findIndex(y => getDomId(y.id) === item.id);
                        if (myIndex !== -1) {
                          draft[myIndex].height = item.height;
                          draft[myIndex].defaultHeight = item.height;
                        }
                      })
                    })
                  }
                });
              } else {
                clearCustomDataRef.current = setTimeout(fn, 500);
                computedCustomDataCount = computedCustomDataCount - 1;
              }
            } else {
              clearCustomDataRef.current = setTimeout(fn, 500);
              computedCustomDataCount = computedCustomDataCount - 1;
            }
          });
        }
      };
      clearCustomDataRef.current = setTimeout(fn, 500);
    }
  });
  /** 自定义模板更新依赖 */
  const computedUpdateCustomData = useMemoizedFn(() => {
    const ids = pageRef.current?.preCompile?.customTemp?.map(x => x.id);
    if (ids?.length > 0) {
      const query = Taro.createSelectorQuery();
      const idsStr = ids.map(x => `#${getDomId(x)}`).join(',');
      query.selectAll(idsStr).boundingClientRect();
      query.exec(function (res) {
        if (res.length > 0 && res[0].length > 0) {
          const list = res[0]
            .filter(x => x.height > 0)
            .map(x => {
              return {
                id: x.id,
                width: Math.round(x.width),
                height: Math.round(x.height)
              };
            });
          if (list.length === res[0].length) {
            customRef.current = list;
            Taro.nextTick(() => {
              computedAllTempInfo();
              const upCustom: any = uniqBy(customRef.current, 'id')
              if (virtialRule) {
                setUpdateCustom(upCustom);
              } else {
                setPlaneData((draft) => {
                  upCustom?.forEach(item => {
                    const myIndex = draft.findIndex(y => getDomId(y.id) === item.id);
                    if (myIndex !== -1) {
                      draft[myIndex].height = item.height;
                      draft[myIndex].defaultHeight = item.height;
                    }
                  })
                })
              }
            });
          }
        }
      });
    }
  });
  /** 计算直播相关组件数据 */
  const computedLive = useMemoizedFn(async () => {
    const lives: any = pageRef.current?.preCompile?.lives || [];
    if (lives.length > 0) {
      const fn = async () => {
        let livePlayer: any = null;
        try {
          livePlayer = requirePlugin(layout.config.livePluginName as string);
        } catch (err) { }
        for (let i = 0; i < lives.length; i++) {
          let liveStatus = storage
            .arrTimerGet('layout_liveStatus')
            ?.find(x => x.id === lives[i].roomId)?.liveStatus;
          if (!liveStatus) {
            if (lives[i].roomId) {
              if (livePlayer && !startsWith(`${lives[i].roomId}`, 'sph')) {
                const liveResult = await livePlayer.getLiveStatus({
                  room_id: lives[i].roomId
                });
                liveStatus = liveResult.liveStatus;
              }
              if (startsWith(`${lives[i].roomId}`, 'sph')) {
                const sphLiveResult = await Taro.getChannelsLiveInfo({
                  finderUserName: `${lives[i].roomId}`
                });
                liveStatus = getLiveStatusByChannel(sphLiveResult?.status);
              }
            } else if (lives[i].startTime && lives[i].endTime) {
              liveStatus = getLiveStatus(lives[i].startTime, lives[i].endTime);
            } else {
              liveStatus = 102;
            }
          }
          lives[i].liveStatus = liveStatus;
        }
        Taro.nextTick(() => {
          setLiveData(draft => {
            lives.forEach(x => {
              const index = draft.findIndex(y => y.roomId === x.roomId);
              if (index !== -1) {
                draft[index].liveStatus = x.liveStatus;
              } else {
                draft.push({ ...x });
              }
            });
            storage.arrTimerPush(
              'layout_liveStatus',
              draft.map(x => ({
                id: x.roomId,
                liveStatus: x.liveStatus
              })),
              60000
            );
          });
        });
        const subParams = lives.reduce(
          (pre, cur) => {
            if (cur.subscribeId) {
              pre[0].push({
                stage: layout.config.liveStagePrefix + cur.roomId,
                subscribeId: cur.subscribeId,
                roomId: cur.roomId,
                active: getLiveActive(cur.liveStatus, cur.data)
              });
              pre[1].push({
                stage: layout.config.liveStagePrefix + cur.roomId,
                subscribeId: cur.subscribeId
              });
            }
            return pre;
          },
          [[], []]
        );
        if (subParams[1].length > 0) {
          const token: any = await getToken();
          if (token) {
            const result = await getSubscribeCountByRoomId(subParams);
            const updateComponents: any = [];
            subParams[0]?.forEach(s => {
              const liveSub = result?.data?.find(
                x => x.stage === layout.config.liveStagePrefix + s.roomId
              );
              const count = `${(s?.active?.baseCount || 0) + liveSub?.subscribeAllCount
                }`;
              if (!isNil(s.active.countId)) {
                updateComponents.push({
                  type: 'nodes',
                  key: s.active.countId,
                  value: count
                });
              }
            });
            if (updateComponents.length > 0) {
              Taro.nextTick(() => {
                store.setCom(updateComponents, pageInfo?.id);
              });
            }
          }
        }
        clearLiveDataRef.current = setTimeout(fn, 60000);
      };
      fn();
    }
  });
  /** 计算没有直播房间号的直播间 */
  const computedLiveByNoRoomId = useMemoizedFn(async id => {
    setLiveData(draft => {
      const index = draft.findIndex(y => y.id === id);
      if (index !== -1) {
        draft[index].liveStatus = getLiveStatus(
          draft[index].startTime,
          draft[index].endTime
        );
      }
    });
  });
  /** 计算变化模板数据 */
  const computedUpdateTempInfo = useMemoizedFn((ids: string[]) => {
    if (ids?.length > 0) {
      const query = Taro.createSelectorQuery();
      const idsStr = ids.map(x => `#${getDomId(x)}`).join(',');
      query.selectAll(idsStr).boundingClientRect();
      query.exec(function (res) {
        log('res', res);
        if (res.length > 0 && res[0].length > 0) {
          const list = res[0]
            .filter(x => x.height > 0)
            .map(x => {
              return {
                id: x.id,
                width: Math.round(x.width),
                height: Math.round(x.height)
              };
            });
          log('list', list);
          updateTempRef.current = list;
          computedAllTempInfo();
          setUpdateCustom(uniqBy(updateTempRef.current, 'id'));
        }
      });
    }
  });
  /** 组件滑动触发订阅事件 */
  const hanlderTouch = useMemoizedFn(
    async (comId: string, direction: 'left' | 'right' | 'top' | 'bottom') => {
      const subjects = pageRef.current?.preCompile?.subjects || [];
      const subjectIndex = subjects.findIndex(x => x.comId === comId);
      if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        const updateStyles: any = [];
        const updateComponents: any = [];
        if (subject.type === 'touchTB') {
          if (direction === 'top' && subject.value < subject.totalLength - 1) {
            const [oldValue, newValue] = [subject.value, subject.value + 1];
            set(subjects, `${subjectIndex}.value`, newValue);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.gt?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.gt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
          }
          if (direction === 'bottom' && subject.value > 0) {
            const [oldValue, newValue] = [subject.value, subject.value - 1];
            set(subjects, `${subjectIndex}.value`, subject.value - 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.lt?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.lt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log('bottom', subject.value - 1);
          }
        }
        if (subject.type === 'touchLR') {
          if (direction === 'left' && subject.value < subject.totalLength - 1) {
            const [oldValue, newValue] = [subject.value, subject.value + 1];
            set(subjects, `${subjectIndex}.value`, subject.value + 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.gt?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.gt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log('left', subject.value + 1);
          }
          if (direction === 'right' && subject.value > 0) {
            const [oldValue, newValue] = [subject.value, subject.value - 1];
            set(subjects, `${subjectIndex}.value`, subject.value - 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.lt?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item?.lt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === 'style') {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === 'component') {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log('right', subject.value - 1);
          }
        }
        pageRef.current.preCompile.subjects = subjects;
        if (updateStyles.length > 0) {
          store.setStyle(updateStyles, pageInfo?.id);
          if (subject.needComputed) {
            setTimeout(() => {
              computedUpdateTempInfo([subject.comId]);
            }, 500);
          }
        }
        if (updateComponents.length > 0) {
          store.setCom(updateComponents, pageInfo?.id);
          if (subject.needComputed) {
            setTimeout(() => {
              computedUpdateTempInfo([subject.comId]);
            }, 500);
          }
        }
      }
    }
  );
  /** 组件滑动自定义事件触发 */
  const customHanlderTouch = useMemoizedFn((com: any, direction: 'left' | 'right' | 'top' | 'bottom') => {
    if (com.templateCode === 'INFINITELOOPX') {
      computedInfiniteLoopX(
        {
          direction,
          ...(com?.extendInfo?.customTouch ?? {})
        },
        pageRef.current?.id,
        com.templateId)
    }
    if (com.templateCode === 'INFINITELOOPXA') {
      computedInfiniteLoopXA(
        {
          direction,
          ...(com?.extendInfo?.customTouch ?? {})
        },
        pageRef.current?.id,
        com.templateId)
    }
    if (com.templateCode === 'FIRSTSCREENSWIPER') {
      computedFirstScreenSwiper(
        {
          direction,
          scrollTop: systemInfo.windowHeight,
          ...(com?.extendInfo?.customTouch ?? {})
        },
        pageRef.current?.id,
        com.templateId
      )
    }
    if (com.templateCode === 'SLIDEXB') {
      computedSlideXB({
        direction,
        ...(com?.extendInfo?.customTouch ?? {})
      }, pageRef.current?.id, com.templateId)
    }
    if (com.templateCode === 'FIRSTSCREENSWIPERA') {
      computedFirstScreenSwiperA({
        direction,
        ...(com?.extendInfo?.customTouch ?? {})
      }, pageRef.current?.id, com.templateId)
      if (direction === 'top') {
        Taro.nextTick(() => {
          setTimeout(() => {
            setLayoutStyle(draft => {
              draft.height = 'auto'
              draft.overflow = 'visible'
              draft.position = 'relative'
            })
          }, 600)
        })
      }
      if (direction === 'bottom') {
        setLayoutStyle(draft => {
          draft.height = `calc(100vh - ${tabBarHeightPxNum}px)`
          draft.overflow = "hidden"
          draft.position = 'fixed'
        })
      }
    }
    if (com.templateCode === 'FIRSTSCREENSWIPERC') {
      if (pageScrolllRef.current.isTop && direction === 'top') {
        setLayoutStyle(draft => {
          draft.position = 'relative'
        })
        Taro.nextTick(() => {
          setTimeout(() => {
            if (com?.extendInfo?.customTouch?.scrollTop) {
              Taro.pageScrollTo({
                scrollTop: rpxTopx(parseInt(com?.extendInfo?.customTouch?.scrollTop), deviceWidth)
              })
            }
          }, 100)
        })
      }
    }
  })
  /** 页面滑动自定义事件触发 */
  const pageCustomHanlderTouch = useMemoizedFn((direction: 'left' | 'right' | 'top' | 'bottom') => {
    if (pageRef.current?.preCompile?.customData?.firstScreenSwiperB && pageScrolllRef.current.isTop) {
      computedFirstScreenSwiperB(
        {
          direction,
          isTop: pageScrolllRef.current.isTop,
          ...(pageRef.current?.preCompile?.customData?.firstScreenSwiperB ??
            {})
        },
        pageRef.current?.id,
        pageRef.current?.preCompile?.customData?.firstScreenSwiperB?.id,
        () => {
          setLayoutStyle((draft) => {
            draft.height = `calc(100vh - ${tabBarHeightPxNum}px)`
            draft.overflow = 'hidden'
          })
          Taro.pageScrollTo({
            scrollTop: 0
          })
          setTimeout(() => {
            setLayoutStyle((draft) => {
              draft.height = `auto`
              draft.overflow = 'visible'
            })
          }, 850)
        }
      )
    }
  })
  /** 计算平面层组件 */
  const computedPlaneElement = useMemoizedFn((item, index) => {
    let result = (
      <Compiler data={[item]} parentPath={item.path ?? item.customData?.path} parentIndex={index} />
    );
    if (['LIVE', 'LIVEA'].includes(item.templateCode)) {
      result = (
        <LiveTemplateContext.Provider
          value={{ liveData, computedLiveByNoRoomId }}
        >
          {result}
        </LiveTemplateContext.Provider>
      );
    }
    if (item.templateCode?.indexOf('COUNTDOWN') !== -1) {
      const countdownEndTime = countdownInject?.find(
        x =>
          x.name === item.templateName ||
          item.templateName.indexOf(x.likeName) !== -1
      )?.endTime;
      if (countdownEndTime) {
        result = (
          <CountdownTemplateContext.Provider value={{ countdownEndTime }}>
            {result}
          </CountdownTemplateContext.Provider>
        );
      }
    }
    if (item.templateCode?.indexOf('SWIPER') !== -1) {
      const swiper = swiperContext?.find(
        x =>
          x.name === item.templateName ||
          item.templateName.indexOf(x.likeName) !== -1
      );
      if (swiper) {
        result = (
          <SwiperTemplateContext.Provider
            value={{
              defaultCurrent: swiper?.defaultCurrent ?? 0,
              slots: swiper?.slots
            }}
          >
            {result}
          </SwiperTemplateContext.Provider>
        );
      }
    }
    return result;
  });
  /** 获取模板插槽匹配数据 */
  const getSlotsByCustom = useMemoizedFn((item, index) => {
    return customSlot?.reduce((pre: any, x) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1;
      }
      if (!isNil(x.name)) {
        result = x.name === item.templateName;
      }
      if (!isNil(x.id)) {
        result = x.id === item.id;
      }
      if (!isNil(x.index)) {
        result = x.index === index;
      }
      if (result) {
        const element = x.getElement
          ? x.getElement({
            component: {
              code: item.templateCode,
              name: item.templateName,
              customData: item.templateCustomData
            }
          })
          : x.element;
        pre.push({ ...x, element });
      }
      return pre;
    }, []);
  });
  /** 获取业务组件插槽匹配数据 */
  const getPlaneSlotByPageSlot = useMemoizedFn((item, index) => {
    let planeSlot: any = null;
    const pSlot = pageSlot?.find(x => x.code === item.customCode);
    if (pSlot) {
      const customTemp = pageRef.current?.preCompile?.customTemp?.find(
        x => x.code === item.customCode
      );
      const pElement = pSlot?.getElement
        ? pSlot?.getElement(customTemp?.data, {
          index,
          name: item.name
        })
        : pSlot?.element;
      planeSlot = {
        id: getDomId(customTemp?.id),
        element: pElement
      };
    }
    return planeSlot;
  });
  /** 获取容器组件插槽 */
  const getInsertSlot = useMemoizedFn(item => {
    const containerInsert: any = containerSlot?.find((x: any) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1;
      }
      if (!isNil(x.name)) {
        result = x.name === item.templateName;
      }
      if (!isNil(x.code)) {
        result = x.code === item.templateCode
      }
      return result;
    })?.insertList;
    const pendants = item.extendInfo?.newPendants
    let pendantInsert: any = []
    if (pendants?.length) {
      pendantInsert = customSlot?.reduce((pre: any, cur) => {
        let list = []
        if (!isNil(cur.likeName)) {
          list = pendants.filter(p => p.templateName?.indexOf(cur.likeName) !== -1)
        }
        if (!isNil(cur.name)) {
          list = pendants.filter(p => p.templateName === cur.name)
        }
        list.forEach((l: any) => {
          pre.push({
            path: l.comPath,
            index: l.index,
            customData: l.customData,
            getElement: cur.getElement
          })
        })
        return pre;
      }, [])
    }
    return [...(containerInsert ?? []), ...(pendantInsert ?? [])]
  });
  /** 获取插入样式 */
  const getInjectStyle = useMemoizedFn(item => {
    let si = styleInject?.find((x: any) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1;
      }
      if (!isNil(x.name)) {
        result = x.name === item.templateName;
      }
      return result;
    });
    if (si?.getStyle) {
      si.style = merge(si.style ?? {}, si.getStyle(item.templateCustomData))
    }
    return si
  });
  /** 获取置顶样式 */
  const getTopDataStyle = useMemoizedFn((item, index) => {
    let marginTop = index > 0 ? `${open05px ? '-0.5px' : '0px'}` : undefined
    let marginBottom
    if (item.style?.reactStyle?.marginTop) {
      marginTop = computeSize(item.style?.reactStyle?.marginTop)
    }
    if (item.style?.boxModel?.marginTop) {
      marginTop = computeSize(item.style?.boxModel?.marginTop)
    }
    if (item.style?.reactStyle?.marginBottom) {
      marginBottom = computeSize(item.style?.reactStyle?.marginBottom)
    }
    if (item.style?.boxModel?.marginBottom) {
      marginBottom = computeSize(item.style?.boxModel?.marginBottom)
    }
    return item?.topData ? {
      left: item.topData?.left ?? 0,
      top: item.topData.isEnd ? null : (item.topData?.top ?? 0),
      marginTop: item.topData.fixed ? item.topData?.marginTop : 0,
      zIndex: 1001,
    } : {
      marginTop,
      marginBottom,
    }
  })
  /** 平面层组件曝光 */
  const planeExposureHandler = useMemoizedFn(({ scrollTop }) => {
    if (isFunction(onPlaneExposure)) {
      const start = scrollTop + navHeightPxNumRef.current
      const end = scrollTop + systemInfo.screenHeight - tabBarHeightPxNum
      const result: any = []
      allTempInfo.current?.forEach(item => {
        if (((item.top <= end) || (item.top >= start && item.top <= end)) && !planeExposureRef.current.includes(item.id)) {
          result.push({
            name: item.name,
            index: item.index,
            templateCode: item.templateCode
          })
          planeExposureRef.current.push(item.id)
        }
      })
      if (result.length) {
        onPlaneExposure?.(result)
      }
    }
  })
  /** 计算scrollRef */
  const computerScrollRef = useMemoizedFn((scrollTop) => {
    let [updateStyles, updateComponents, updateScroll, updateLayoutStyle]: any = [[], [], null, null]
    const scrollUpdates = scrollRef.current
    scrollUpdates?.forEach((x: any) => {
      const toTop = scrollTop >= x.start && scrollTop < x.end && x.isCheck
      const toScroll = (scrollTop < x.start || scrollTop >= x.end) && !x.isCheck
      let [topNavBarTopStyles, topNavBarScrollStyles]: any = [[], []]
      // 顶部导航栏特殊处理
      if (x.topNavBar) {
        const { templateId, defaultCurrentId, styles } = x.topNavBar
        const storeRef = get(store.ref, `${pageRef.current.id}.${templateId}`)
        const currentId = storeRef?.currentId ?? defaultCurrentId
        const checkStyle = styles.find((y: any) => y.currentId === currentId)
        const unCheckStyle = styles.filter((y: any) => y.currentId !== currentId)
        if (checkStyle) {
          if (toTop) {
            topNavBarTopStyles.push({
              key: checkStyle.currentId,
              value: getReactStyle(checkStyle.top.checkStyle)
            })
          }
          if (toScroll) {
            topNavBarScrollStyles.push({
              key: checkStyle.currentId,
              value: getReactStyle(checkStyle.scroll.checkStyle)
            })
          }
        }
        if (unCheckStyle) {
          if (toTop) {
            topNavBarTopStyles.push(...(unCheckStyle.map((y: any) => ({
              key: y.currentId,
              value: getReactStyle(y.top.unCheckStyle)
            })) ?? []))
          }
          if (toScroll) {
            topNavBarScrollStyles.push(...(unCheckStyle.map((y: any) => ({
              key: y.currentId,
              value: getReactStyle(y.scroll.unCheckStyle)
            })) ?? []))
          }
        }
      }
      if (toTop) {
        if (x.checkStyles) {
          updateStyles.push(...x.checkStyles)
        }
        if (x.checkComs) {
          updateComponents.push(...x.checkComs)
        }
        if (topNavBarTopStyles.length) {
          updateStyles.push(...topNavBarTopStyles)
          store.setRef({ isCheck: false }, pageRef.current.id, x.topNavBar.templateId)
        }
        if (!isNil(x.checkScroll)) {
          updateScroll = x.checkScroll
        }
        if (!isNil(x.checkLayoutStyle)) {
          updateLayoutStyle = getReactStyle(x.checkLayoutStyle)
        }
        x.isCheck = false
      } else if (toScroll) {
        if (x.unCheckStyles) {
          updateStyles.push(...x.unCheckStyles)
        }
        if (x.unCheckComs) {
          updateComponents.push(...x.unCheckComs)
        }
        if (topNavBarScrollStyles.length) {
          updateStyles.push(...topNavBarScrollStyles)
          store.setRef({ isCheck: true }, pageRef.current.id, x.topNavBar.templateId)
        }
        if (!isNil(x.unCheckScroll)) {
          updateScroll = x.unCheckScroll
        }
        if (!isNil(x.unCheckLayoutStyle)) {
          updateLayoutStyle = getReactStyle(x.unCheckLayoutStyle)
        }
        x.isCheck = true
      }
    })
    scrollRef.current = scrollUpdates
    return {
      updateStyles,
      updateComponents,
      updateScroll,
      updateLayoutStyle
    }
  })
  /** 滚动置顶距离触发样式变更 */
  const pageScrollStyleUpdateHandler = useMemoizedFn(({ scrollTop }) => {
    if (scrollTop < 0) {
      scrollTop = 0
    }
    const { updateStyles, updateComponents, updateScroll, updateLayoutStyle } = computerScrollRef(scrollTop)
    if (!isNil(updateScroll)) {
      setPageScroll(updateScroll, pageRef.current?.id)
    }
    if (updateStyles.length > 0) {
      store.setStyle(updateStyles, pageRef.current?.id);
    }
    if (updateComponents.length > 0) {
      store.setCom(updateComponents, pageRef.current?.id);
    }
    if (!isNil(updateLayoutStyle)) {
      setLayoutStyle(darft => {
        merge(darft, updateLayoutStyle)
      })
    }
  })
  const computedOpenFull = useMemoizedFn((currentId) => {
    if (pageRef.current?.preCompile?.openFullScreen === 'zoom') {
      const storeRef = get(store.ref, `${pageRef.current?.id}.${pageRef.current?.preCompile?.customData?.topNavBar.templateId}`)
      if (pageRef.current?.preCompile?.customData?.topNavBar?.currentId !== currentId) {
        setCatchMove(false)
      } else if (storeRef?.currentId !== currentId && pageRef.current?.preCompile?.customData?.topNavBar?.currentId === currentId) {
        changeFullScreen(true)
      }
    }
  })
  const isCheckFull = useMemoizedFn(() => {
    let isCheck = true
    if (pageRef.current?.preCompile?.customData?.topNavBar) {
      const storeRef = get(store.ref, `${pageRef.current?.id}.${pageRef.current?.preCompile?.customData?.topNavBar.templateId}`)
      isCheck = !storeRef?.currentId || storeRef.currentId === pageRef.current?.preCompile?.customData?.topNavBar?.currentId
    }
    return isCheck
  })
  /** 平面层渲染 */
  const renderPlane = useMemoizedFn((item, index) => {
    const planeSlot = getPlaneSlotByPageSlot(item, index);
    const slots = getSlotsByCustom(item, index);
    const insertSlot = getInsertSlot(item);
    const injectStyle = getInjectStyle(item);
    const topStyle: any = getTopDataStyle(item, index)
    return (
      <>
        <View
          key={item.id}
          id={layout.config.customWrapperLevel === 1 ? `${getDomId(item.id)}` : `p_${getDomId(item.id)}`}
          style={{
            overflowX: item.extendInfo?.viewOverFlowShow ? 'visible' : 'hidden',
            fontSize: item.planeSlot ? undefined : 0,
            position: item.topData ? 'sticky' : 'relative',
            ...topStyle,
            ...(item.isShow ? showStyle : hideStyle),
            ...(injectStyle?.outside ? injectStyle?.style : {}),
          }}
          onTouchStart={(e: any) => {
            comMoveRef.current = e.changedTouches[0];
          }}
          onTouchEnd={(e: any) => {
            const moveX = comMoveRef.current.clientX - e.changedTouches[0].clientX;
            const moveY = comMoveRef.current.clientY - e.changedTouches[0].clientY;
            if (Math.abs(moveY) > Math.abs(moveX)) {
              if (moveY > 0) {
                hanlderTouch(item.id, 'top');
                customHanlderTouch(item, 'top')
              } else if (moveY < 0) {
                hanlderTouch(item.id, 'bottom');
                customHanlderTouch(item, 'bottom');
              }
            } else {
              if (moveX > 0) {
                hanlderTouch(item.id, 'left');
                customHanlderTouch(item, 'left')
              } else if (moveX < 0) {
                hanlderTouch(item.id, 'right');
                customHanlderTouch(item, 'right')
              }
            }
          }}
        >
          {slots?.map((s, i) => (
            <View
              key={i}
              style={{
                left: s.left,
                top: s.top,
                bottom: s.bottom,
                right: s.right,
                position: 'absolute',
                zIndex: 1000
              }}
            >
              {s.element}
            </View>
          ))}
          {planeSlot && (
            <View id={planeSlot.id}>{planeSlot.element}</View>
          )}

          {!planeSlot && (
            <TemplateContext.Provider
              value={{
                componentType: 'plane',
                templateId: item.templateId,
                templateCode: item.templateCode,
                templateName: item.templateName,
                templateIndex: index,
                templateCustomData: item.templateCustomData,
                status: item.status,
                injectStyle: (!injectStyle?.outside ? injectStyle?.style : {}),
                insertSlot,
                viewOverFlowShow: item.extendInfo?.viewOverFlowShow
              }}
            >
              {computedPlaneElement(item, index)}
            </TemplateContext.Provider>
          )}
        </View>
      </>
    );
  })

  if (!closeShare) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useShareAppMessage((res: any) => {
      let [title, path, imageUrl]: any = ['', '', ''];
      if (res.from === 'button') {
        title = res.target.dataset?.title || (pageRef.current?.share?.title || defaultShareConfig?.title);
        path = res.target.dataset?.path || (pageRef.current?.share?.path || defaultShareConfig?.path);
        imageUrl = res.target.dataset?.img || (pageRef.current?.share?.imageUrl || defaultShareConfig?.imageUrl);
      } else {
        title = pageRef.current?.share?.title || defaultShareConfig?.title;
        path = pageRef.current?.share?.path || defaultShareConfig?.path;
        imageUrl =
          pageRef.current?.share?.imageUrl || defaultShareConfig?.imageUrl;
      }
      try {
        onShareAppMessage?.(res, { title, path, imageUrl: getUrl(imageUrl) });
      } catch { }
      if (onShareParamsInject) {
        return onShareParamsInject(res, {
          title,
          path,
          imageUrl: getUrl(imageUrl)
        });
      }
      return {
        title,
        path,
        imageUrl: getUrl(imageUrl)
      };
    });
  }
  usePageScroll(res => {
    // 视频全屏会触发pageScroll的Bug
    if (get(store.ref, `${pageRef.current?.id}.video.isFullScreen`)) {
      return false;
    }
    /** 滚动通用状态操作 */
    pageScrollHandler(res);
    /** 置顶相关处理操作 */
    pageScrollTopHandler(res);
    /** 电梯自动切换图片操作 */
    pageScrollEleHandler(res);
    /** 全屏状态处理操作 */
    fullScreenHandler(res);
    /** 所有平面层组件曝光 */
    planeExposureHandler(res);
    /** 滚动置顶距离触发样式变更 */
    pageScrollStyleUpdateHandler(res);
  });
  useUpdateEffect(() => {
    computedElevators(placeholderHeight);
  }, [placeholderHeight]);
  useUpdateEffect(() => {
    computedAllTempInfo(false);
  }, [navHeightPxNum]);
  useUpdateEffect(() => {
    computedStorageData()
  }, [pageScrollHeight])
  useUpdateEffect(() => {
    if (!isNowPage) {
      if (clearCustomDataRef.current) {
        clearTimeout(clearCustomDataRef.current);
        clearCustomDataRef.current = null;
      }
      if (clearLiveDataRef.current) {
        clearTimeout(clearLiveDataRef.current);
        clearLiveDataRef.current = null;
      }
    }
    if (isNowPage && !clearLiveDataRef.current) {
      computedLive();
    }
  }, [isNowPage]);
  useUpdateEffect(() => {
    Taro.nextTick(() => {
      computedUpdateCustomData();
    });
  }, [pageSlot]);
  useEffect(() => {
    if (user) {
      appStore.setUser(user)
    }
  }, [user])
  useEffect(() => {
    loadPage();
  }, [code, navHeight, loadPageConfig?.value, reloadEffect]);

  return (
    <>
      <View style={loadingStyle || {}}>
        {loading && <Loading ids={loadingIds} config={loading} />}
      </View>
      <LayoutContext.Provider
        value={{
          pageId: pageInfo?.id,
          tabHeight: tabBarHeightPxNum,
          isCustomShare: isFunction(onShare),
          notices: pageInfo?.notice,
          wxButtons: pageInfo?.wxButtons,
          videoHeights: pageInfo?.videoHeight,
          swiperRelation: pageInfo?.swiperRelation,
          closeAction,
          routerParams,
          interfaceParamsInject,
          registerPath,
          leavePage,
          computedStatusData,
          computedOpenFull
        }}
      >
        <View
          className="connext-layout"
          style={{
            position: 'relative',
            ...(pageStyle ?? {}),
            ...(layoutStyle ?? {}),
            ...(globalStyle || {})
          }}
        >
          <View className="layout-page-observe"></View>
          <View className="layout-first-page-observe"></View>
          {/** 平面层 */}
          <View
            style={{
              position: 'relative',
              ...(planeStyle || {})
            }}
          >
            {/** 平面层实际内容 */}
            <View
              style={{
                position: 'relative',
                zIndex: 1,
                ...(catchMove ? { height: `calc(100vh - ${tabBarHeightPxNum}px)`, overflow: 'hidden', position: 'fixed' } : {})
              }}
              onTouchStart={(e: any) => {
                if (get(store.ref, `${pageRef.current?.id}.base`)?.isRoutePage) {
                  store.setRef({ isRoutePage: false }, pageRef.current.id, 'base')
                }
                moveRef.current = e.changedTouches[0];
              }}
              onTouchEnd={(e: any) => {
                const moveX =
                  moveRef.current.clientX - e.changedTouches[0].clientX;
                const moveY =
                  moveRef.current.clientY - e.changedTouches[0].clientY;
                if (['zoom'].includes(pageRef.current?.preCompile?.openFullScreen || '')) {
                  e?.stopPropagation();
                  if (Math.abs(moveY) > Math.abs(moveX)) {
                    if (moveY > 0 && fullScreenRef.current && !fullScreeningRef.current) {
                      changeFullScreen(false)
                    }
                  }
                }
                if (Math.abs(moveY) > Math.abs(moveX)) {
                  if (moveY > 0) {
                    pageCustomHanlderTouch('top')
                  } else if (moveY < 0) {
                    pageCustomHanlderTouch('bottom')
                  }
                } else {
                  if (moveX > 0) {
                    pageCustomHanlderTouch('left')
                  } else if (moveX < 0) {
                    pageCustomHanlderTouch('right')
                  }
                }
              }}
            >
              {
                virtialRule && <VirtialList
                  list={planeData}
                  updateStatus={updateStatus}
                  updateTopdata={updateTopdata}
                  updateCustom={updateCustom}
                  rule={virtialRule}
                  onRender={(item, index) => renderPlane(item, index)}
                />
              }
              {
                !virtialRule && planeData.map((item, index) => renderPlane(item, index))
              }
            </View>
          </View>
          {/** 窗口层 */}
          <MovableArea
            style={{
              position: 'fixed',
              top: `calc(${isNavPlaceHolder ? (navHeightPxNum ?? 0) : 0}px - ${openMovableAreaHeight100VH ? '0px' : '1000rpx'})`,
              width: '750rpx',
              height: openMovableAreaHeight100VH ? `calc(100vh - ${tabBarHeightPxNum}px)` : '3000rpx',
              left: 0,
              zIndex: 5000,
              pointerEvents: 'none',
              ...(windowStyle || {})
            }}
          >
            {windowData?.map((item, index) => {
              const slots = getSlotsByCustom(item, index);
              const insertSlot = getInsertSlot(item);
              return (
                <TemplateContext.Provider
                  key={item.id}
                  value={{
                    componentType: 'window',
                    templateId: item.id,
                    templateCode: item.templateCode,
                    templateName: item.templateName,
                    templateCustomData: item.templateCustomData,
                    templateIndex: index,
                    status: item.status,
                    iconSlot,
                    insertSlot
                  }}
                >
                  <Movable
                    key={item.id}
                    comId={item.id}
                    comStyle={{ ...item.style }}
                    movable={item.movable}
                    openMovableAreaHeight100VH={openMovableAreaHeight100VH}
                  >
                    {slots?.map((s, i) => (
                      <View
                        key={i}
                        style={{
                          left: s.left,
                          top: s.top,
                          bottom: s.bottom,
                          right: s.right,
                          position: 'absolute',
                          zIndex: 1000
                        }}
                      >
                        {s.element}
                      </View>
                    ))}
                    <Compiler
                      data={[item]}
                      parentPath={item.path ?? item.customData?.path}
                      parentIndex={index}
                    />
                  </Movable>
                </TemplateContext.Provider>
              );
            })}
          </MovableArea>
          {/** 底部窗口层 */}
          <View
            style={{
              width: '750rpx',
              position: 'fixed',
              left: 0,
              bottom: `calc(0px + ${tabBarHeightPxNum}px)`,
              zIndex: 4900
            }}
          >
            {bottomWindowData?.map((item, index) => {
              const slots = getSlotsByCustom(item, index);
              const insertSlot = getInsertSlot(item);
              return (
                <TemplateContext.Provider
                  key={item.id}
                  value={{
                    componentType: 'window',
                    templateId: item.id,
                    templateCode: item.templateCode,
                    templateName: item.templateName,
                    templateCustomData: item.templateCustomData,
                    templateIndex: index,
                    iconSlot,
                    insertSlot
                  }}
                >
                  {slots?.map((s, i) => (
                    <View
                      key={i}
                      style={{
                        left: s.left,
                        top: s.top,
                        bottom: s.bottom,
                        right: s.right,
                        position: 'absolute',
                        zIndex: 1000
                      }}
                    >
                      {s.element}
                    </View>
                  ))}
                  <Compiler
                    data={[item]}
                    parentPath={item.path ?? item.customData?.path}
                    parentIndex={index}
                  />
                </TemplateContext.Provider>
              );
            })}
          </View>
        </View>
        {
          isPlaceholderTabBarHeight && <View
            style={{ width: '750rpx', height: `${tabHeight ? `${tabBarHeightPxNum}px` : '0px'}` }}
          ></View>
        }
        {/** 事件触发弹窗层 */}
        <View>
          <Popup pageId={pageInfo?.id} popupCloseInject={popupCloseInject} />
        </View>
        <View>
          <PreMedia medias={preMedias} />
        </View>
      </LayoutContext.Provider>
    </>
  );
};

export default Layout;
