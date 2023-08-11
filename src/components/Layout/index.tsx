import Taro, {
  useShareAppMessage,
  usePageScroll,
  useRouter,
  requirePlugin,
} from "@tarojs/taro";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  CSSProperties
} from "react";
import { View, MovableArea } from "@tarojs/components";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { isFunction, isNil, orderBy, sortBy, set, omitBy, difference, cloneDeep, uniqBy, startsWith, merge } from "lodash-es";
import { useImmer } from "use-immer";
import "animate.css"
import { layout } from "./config/index";
import {
  getPageById,
  getPageByCode,
  getThemePageByCode,
  getSubscribeCountByRoomId
} from "./api/index";
import Compiler from "./components/Compiler";
import Popup from "./components/Popup";
import Loading from "./components/Loading";
import {
  computedEventData,
  getDomId,
  getLiveActive,
  getUrl,
  log,
  rpxTopx,
  storage,
  parsingActions,
  getBaseStyle,
  getBaseComponent,
  isValidTime,
  getLiveStatus,
  getLiveStatusByChannel,
} from "./helper";
import PreMedia from "./components/PreMedia";
import Movable from "./components/Movable";
import VirtialList from "./components/VirtialList";
import { store } from "./store/index";
import usePage from "./hooks/usePage"
import useToken from "./hooks/useToken";

import "./index.less";


type LayoutProps = {
  /** 主题页面Code */
  code?: string;
  /** 加载数据配置 */
  loadPageConfig?: {
    type: "id" | "code";
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
    likeName?: string
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
    /** 组件名称 */
    name?: string
    /** 组件模糊名称 */
    likeName?: string
    /** 插入合集 */
    insertList?: {
      /** 容器插入地址 */
      path?: string
      /** 容器组件插入的索引 */
      index?: number
      /** 返回插入组件的方法
       * @param data 组件的自定义数据
       */
      getElement?: (data: any) => React.ReactElement
    }[]
  }[]
  /** 虚拟列表 */
  virtialRule?: {
    /**
     * 开启机型
     * getSystemInfoSync的model属性值,不配置相当于所有机型都开启
     * */
    model?: string[]
    /**
     * 数值越大,体验效果越好,性能越差
     * 数值越小,性能越好,体验效果越差
     * 最小值为1
     */
    screenCount: number
    /** 加载元素 */
    loadingElement?: JSX.Element
  }[];
  /** 关闭点击事件 */
  closeAction?: boolean
  /** 跳转路径自动添加参数 */
  addParamsRule?: {
    isAddNow: boolean
    params?: {
      key: string
      value: string
    }[]
  }
  /** 倒计时类型组件注入时间 */
  countdownInject?: {
    name?: string
    likeName?: string
    endTime: string
  }[]
  /** 所有组件样式注入 */
  styleInject?: {
    name?: string
    likeName?: string
    style?: React.CSSProperties
  }[]
  /** 轮播类型组件上下文 */
  swiperContext?: {
    /** 轮播组件名称 */
    name?: string
    /** 轮播组件模糊名称 */
    likeName?: string
    /** 默认索引 */
    defaultCurrent?: number
    /** 插槽 */
    slots?: {
      /** 插入轮播组件中的哪一帧 */
      index?: number
      /** 被插入的轮播子项是否需要渲染 */
      rerender?: boolean
      /** 插入组件距离轮播子项左侧距离 */
      left?: number | string
      /** 插入组件距离轮播子项顶部距离 */
      top?: number | string
      /** 插入组件距离轮播子项底部距离 */
      bottom?: number | string
      /** 插入组件距离轮播子项右侧距离 */
      right?: number | string
      /** 返回插入组件的方法
       * @param data 轮播组件的自定义数据
       * @param currentIndex 轮播当前子项
       */
      getElement?: (data: any, currentIndex: number) => React.ReactElement;
    }[]
  }[]
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
  /** 自定义分享配置 */
  onShare?: (data: any) => void;
  /** 分享事件回调 */
  onShareAppMessage?: (
    data: any,
    config: { title: string; path: string; imageUrl: string }
  ) => void;
  /** 自定义动作回调 */
  onCustomAction?: (params: { code: string; data?: string; customData?: string }, info: any) => void;
  /** 加载页面数据回调 */
  onLoadPage?: (data: any) => void;
  /** 获取导航栏标题 */
  onLoadNavTitle?: (title: string) => void;
  /** 加载页面自定义数据回调 */
  onLoadCustomData?: (data: any) => void
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
  onIconExtendChange?: (status: boolean, info?: any) => void
  /** 接口类动作回调 */
  onInterfacesAction?: (data?: any, info?: any) => void
};

type LayoutContextType = {
  pageId?: string;
  tabHeight?: string;
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
    | "contact"
    | "share"
    | "getPhoneNumber"
    | "openSetting"
    | "feedback";
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
  animations?: any
  closeAction?: boolean
  routerParams?: {
    key: string
    value: string
  }[]
  computedStatusData?: (id: string, actionId: string) => void;
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
  injectStyle?: React.CSSProperties
  insertSlot?: {
    path?: string
    index?: number
    getElement?: (data: any) => React.ReactElement;
  }[]
};

type FullScreemContextType = {
  fullScreen?: boolean;
};

type LiveTemplateContextType = {
  liveData?: any;
  computedLiveByNoRoomId?: (id: string) => void
};

type CountdownTemplateContextType = {
  countdownEndTime?: string
}

type SwiperTemplateContextType = {
  defaultCurrent?: number
  slots?: {
    index?: number
    rerender?: boolean
    left?: number | string
    top?: number | string
    bottom?: number | string
    right?: number | string
    getElement?: (data: any, currentIndex: number) => React.ReactElement;
  }[]
}

console.log(
  `%c当前Layout组件版本 ${layout.config.version}`,
  "color:#fa8c16;font-szie:26px;"
);

const systemInfo = Taro.getSystemInfoSync();

const deviceWidth = systemInfo.windowWidth;

let computedCustomDataCount = 5;

const showStyle: CSSProperties = {
  opacity: "1"
};

const hideStyle: CSSProperties = {
  opacity: "0",
  position: "absolute",
  left: "-99999999rpx"
};

export const LayoutContext = React.createContext<LayoutContextType>({});

export const TemplateContext = React.createContext<TemplateContextType>({});

export const FullScreemContext = React.createContext<FullScreemContextType>({});

export const LiveTemplateContext = React.createContext<LiveTemplateContextType>({});

export const CountdownTemplateContext = React.createContext<CountdownTemplateContextType>({})

export const SwiperTemplateContext = React.createContext<SwiperTemplateContextType>({})

const Layout: React.FC<LayoutProps> = ({
  code,
  loadPageConfig,
  navHeight = "0",
  tabHeight,
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
  countdownInject,
  styleInject,
  swiperContext,
  switchTab,
  beforeSwitchTab,
  eventCallBack,
  defaultEventCallBack,
  trackingCallBack,
  subscribeMsg,
  beforeSubscribeMsg,
  onShare,
  onShareAppMessage,
  onCustomAction,
  onLoadPage,
  onLoadNavTitle,
  onSwiperChange,
  onLoadCustomData,
  onIconExtendChange,
  onInterfacesAction
}) => {
  const router = useRouter();
  const { isNowPage } = usePage()
  const { getToken } = useToken()
  const [pageInfo, setPageInfo] = useState<any>();
  const [planeData, setPlaneData] = useImmer<any>([]);
  const [windowData, setWindowData] = useImmer<any>([]);
  const [fullScreen, setFullScreen] = useState<boolean>(true);
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
  const topDataRef = useRef<any>([])
  const clearCustomDataRef = useRef<any>();
  const clearLiveDataRef = useRef<any>();

  const navHeightPxNum = useMemo(() => {
    log(navHeight);
    if (navHeight.indexOf("rpx") !== -1) {
      return rpxTopx(parseInt(navHeight || "0"), deviceWidth);
    }
    return parseInt(navHeight || "0");
  }, [navHeight]);
  const loadingIds = useMemo(() => {
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
  const routerParams = useMemo(() => {
    const result = addParamsRule?.params ?? []
    const excludeKeys = ['code', 'id']
    if (addParamsRule?.isAddNow) {
      for (let [key, value] of Object.entries(router.params)) {
        if (!excludeKeys.includes(key)) {
          result.push({
            key,
            value: value as string
          })
        }
      }
    }
    return result
  }, [router.params, addParamsRule])
  /** 事件注册集合 */
  const eventsOn = useMemoizedFn(() => {
    const pageData = pageRef.current;
    Taro.eventCenter.on(`layout_beforeSwitchTab_${pageData.id}`, data => {
      beforeSwitchTab?.(data);
    });
    Taro.eventCenter.on(`layout_switchTab_${pageData.id}`, data => {
      switchTab?.(data);
    });
    Taro.eventCenter.on(`layout_eventCallBack_${pageData.id}`, data => {
      eventCallBack?.(computedEventData(pageData, data));
    });
    Taro.eventCenter.on(`layout_defaultEventCallBack_${pageData.id}`, data => {
      defaultEventCallBack?.(data);
    });
    Taro.eventCenter.on(`layout_trackingCallBack_${pageData.id}`, data => {
      trackingCallBack?.(data);
    });
    Taro.eventCenter.on(`layout_subscribeMsg_${pageData.id}`, (data, info) => {
      subscribeMsg?.(data, info);
    });
    Taro.eventCenter.on(`layout_beforeSubscribeMsg_${pageData.id}`, (data, info) => {
      beforeSubscribeMsg?.(data, info);
    });
    Taro.eventCenter.on(`layout_share_${pageData.id}`, data => {
      onShare?.(data);
    });
    Taro.eventCenter.on(`layout_customAction_${pageData.id}`, (data, info) => {
      onCustomAction?.(data, info);
    });
    Taro.eventCenter.on(`layout_swiperchange_${pageData.id}`, data => {
      onSwiperChange?.(data);
    });
    Taro.eventCenter.on(`layout_iconExtendChange_${pageData.id}`, (data, info) => {
      onIconExtendChange?.(data, info)
    })
    Taro.eventCenter.on(`layout_interfacesAction_${pageData.id}`, (data, info) => {
      onInterfacesAction?.(data, info)
    })
  });
  /** 加载页面数据 */
  const loadPage = useMemoizedFn(async () => {
    let newpage: any = null;
    if (loadPageConfig) {
      if (loadPageConfig.type === "id") {
        newpage = await getPageById({
          id: loadPageConfig.value,
          date: loadPageConfig.date
        });
      } else if (loadPageConfig.type === "code") {
        newpage = await getPageByCode(loadPageConfig.value);
      }
    } else {
      if (router.params.id) {
        newpage = await getPageById({
          id: router.params.id,
          date: router.params.date ? Number(router.params.date) : undefined,
          type: router.params.type
        });
      } else if (router.params.code) {
        newpage = await getPageByCode(router.params.code);
      } else {
        newpage = await getThemePageByCode({
          code
        });
      }
    }
    onLoadCustomData?.(newpage.data.customData)
    pageRef.current = newpage.data;
    loopComponent();
    computedPage();
    ["zoom", "open"].includes(newpage.data?.preCompile?.openFullScreen) && setCatchMove(true);
    eventsOn();
    onLoadPage?.(newpage.data);
  });
  /** 递归组件优化数据 */
  const loopComponent = useMemoizedFn(() => {
    /** 优化Components对象 */
    const omitFunc = (value, key) => {
      if (['name'].includes(key)) {
        return true
      }
      if (['event', 'exclusiveEvent'].includes(key)) {
        if (value?.find(x => x.type === 'tap')?.actions?.length === 0) {
          return true
        }
      }
      if (key === 'currentIndex' && value === 0) {
        return true
      }
    }
    /** 需要删除的元素 */
    const loop = (arr, path, isDelete = false) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        /** 判断是否在有效期 */
        if (isDelete && (!isValidTime(arr[i]?.validTime) || arr[i]?.customData?.delete)) {
          arr.splice(i, 1);
        } else if (!isDelete) {
          arr[i].path = path ? `${path}.${i}` : `${i}`
          arr[i].style = getBaseStyle(arr[i].style)
          arr[i] = omitBy(arr[i], omitFunc)
        }
        if (arr[i]?.children?.length > 0) {
          loop(arr[i].children, path ? `${path}.${i}` : `${i}`, isDelete);
        }
      }
    };
    pageRef.current?.components?.window?.forEach(x => {
      loop(x.data, '', true);
      loop(x.data, '')
    });
    pageRef.current?.components?.plane?.forEach(x => {
      loop(x.data, '', true);
      loop(x.data, '')
    });
  });
  /** 计算页面数据 */
  const computedPage = useMemoizedFn(() => {

    if (pageRef.current) {
      const page = pageRef.current;
      if (page && !page.config.openShare && !closeShare) {
        Taro.hideShareMenu();
      }
      if (page?.titleNav) {
        Taro.setNavigationBarTitle({
          title: page?.titleNav
        });
        onLoadNavTitle?.(page?.titleNav)
      }
      computedStatusData("init");
      computedAllTempInfo();
      const plane = page?.components?.plane.reduce((pre: any, cur: any) => {
        const defaultHeight = pageRef.current?.preCompile?.size.find(x => x.id === cur.data[0].id)?.content[1]
        pre.push({
          ...cur.data[0],
          height: allTempInfo.current.find(x => x.id === cur.data[0].id)?.height ?? 0,
          defaultHeight: rpxTopx(Number(defaultHeight).toFixed(), deviceWidth) ?? 0,
          templateId: cur.id,
          templateName: cur.name,
          templateCode: cur.templateCode,
          customCode: cur.customCode,
          customData: cur.customData,
          status: page?.preCompile?.status?.find(
            x => x.id === cur.data[0]?.id
          ),
          isShow: !hideDataRef.current.some(x => x.list.includes(cur.data[0].id)),
          topData: topDataRef.current.find(x => x.id === cur.data[0].id)
        });
        return pre;
      }, []) ?? [];
      planeRef.current = plane
      const window = page?.components?.window.reduce((pre: any, cur: any) => {
        pre.push({
          ...cur.data[0],
          templateName: cur.name,
          templateCode: cur.templateCode || "ICON",
          customData: cur.customData,
          movable: { ...cur?.movable, disabled: !cur?.movable?.disabled }
        });
        return pre;
      }, []) ?? [];
      setPlaneData((draft) => {
        draft.splice(0, draft.length)
        draft.push(...plane)
      })
      setWindowData(draft => {
        draft.splice(0, draft.length)
        draft.push(...window)
      });
      setPageInfo({
        id: page.id,
        config: page?.config,
        ...page.preCompile
      });
      computedLive();
      computedCustomData();
    }
  });
  /** 计算置顶数据距离顶部高度 */
  const computedTopDataTop = useMemoizedFn((resTopData = []) => {
    // 计算每个fixed的元素top距离,非占位置顶需要排在占位置顶后面
    let fixedData = orderBy(
      resTopData?.filter(x => x.fixed === true),
      ["placeholder", "sort"],
      ["desc", "asc"]
    );
    let nextHeight = navHeightPxNum;
    fixedData?.forEach(x => {
      x.top = nextHeight;
      nextHeight = nextHeight + x.height;
    });
    return resTopData.map(x => {
      x.top = fixedData.find(y => y.id === x.id)?.top || x.top;
      return x;
    });
  });
  /** 页面滚动-置顶模块处理 */
  const pageScrollTopHandler = useMemoizedFn(async ({ scrollTop }) => {
    if (scrollTop < 0) {
      return;
    }
    let myData = cloneDeep(topDataRef.current)
    scrollTop = scrollTop + navHeightPxNum + (placeholderHeight || 0);
    let isUpdateTopData: boolean = false;
    let updateHeight: number = 0;
    myData?.forEach(item => {
      const startScrollTop = item?.startScrollTop || 0;
      const endScrollTop = item?.endScrollTop || 0;
      if (
        scrollTop >= startScrollTop &&
        (scrollTop < endScrollTop || endScrollTop === 0) &&
        !item.fixed
      ) {
        item.fixed = true;
        isUpdateTopData = true;
        if (item.placeholder) {
          updateHeight = updateHeight + item.height;
        }
      }
      if (
        ((scrollTop > endScrollTop && endScrollTop !== 0) ||
          scrollTop < startScrollTop) &&
        item.fixed
      ) {
        item.fixed = false;
        isUpdateTopData = true;
        if (item.placeholder) {
          updateHeight = updateHeight - (item.height || 0);
        }
      }
    });
    if (isUpdateTopData) {
      topDataRef.current = computedTopDataTop(myData)
      setUpdateTopdata(topDataRef.current)
    }
    if (updateHeight !== 0) {
      setPlaceholderHeight(placeholderHeight + updateHeight)
    }
  });
  /** 页面滚动-电梯组件处理 */
  const pageScrollEleHandler = useMemoizedFn(async ({ scrollTop }) => {
    if (scrollTop < 0 || storage.get("isRoutePage")) {
      return;
    }
    scrollTop = scrollTop + navHeightPxNum + (placeholderHeight || 0);
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
    const changeNum = updateHeight + navHeightPxNum;
    const layoutElevators = (pageRef.current?.preCompile?.elevators || []).map(
      id => {
        const rect = allTempInfo.current?.find(x => x.id === id);
        return {
          id,
          top: rect?.top ? rect?.top - changeNum : NaN
        };
      }
    );
    log("layoutElevators", layoutElevators);
    if (pageInfo?.id) {
      storage.set(
        `layout_navHeightPxNum_${pageRef.current?.id}`,
        navHeightPxNum
      );
      storage.arrPush(`layout_topData_${pageRef.current?.id}`, topDataRef.current);
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
        eleRects = sortBy(eleRects, ["top"]);
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
      .map(item => {
        let [width, height, marginTop, marginBottom] = [0, 0, 0, 0];
        width = rpxTopx(Number(item.content[0]).toFixed(), deviceWidth);
        height = rpxTopx(Number(item.content[1]).toFixed(), deviceWidth);
        marginTop = rpxTopx(
          Number(item.content[2] || "0").toFixed(),
          deviceWidth
        );
        marginBottom = rpxTopx(
          Number(item.content[3] || "0").toFixed(),
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
        lastHeight = top + height + 0.5;
        return {
          id: item.id,
          width,
          height,
          top
        };
      });
    allTempInfo.current = rects;
    if (isNeedUpdate) {
      computedUpdateByTempInfo()
    }
  });
  /** 计算模板更新导致的更新 */
  const computedUpdateByTempInfo = useMemoizedFn(() => {
    const rects = allTempInfo.current
    const plane = pageRef.current?.components?.plane || [];
    const needComputedTopIds: string[] = [];
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
            updateHeight =
              updateHeight + (topRect ? topRect.height : cur.topData.height);
          }
          cur.topData.fixed = true;
        }
        // 需要被计算的Id
        if (cur?.topData?.startId && !pre.includes(cur?.topData?.startId)) {
          needComputedTopIds.push(cur?.topData?.startId);
        }
        if (cur?.topData?.endId && !pre.includes(cur?.topData?.endId)) {
          needComputedTopIds.push(cur?.topData?.endId);
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
    topDataRef.current = computedTopDataTop(needComputedTopData)
    computedEles();
    computedElevators(updateHeight);
    setPlaceholderHeight(updateHeight);
  })
  /** 修改是否CatchMove */
  const changeCatchMove = useMemoizedFn(state => setCatchMove(state));
  /** 全屏状态处理操作 */
  const fullScreenHandler = useMemoizedFn(res => {
    if (pageRef.current?.preCompile?.openFullScreen === "zoom") {
      if (res.scrollTop <= 0 && !fullScreen) {
        Taro.nextTick(() => setFullScreen(true));
      }
      if (res.scrollTop > 0 && fullScreen) {
        Taro.nextTick(() => setCatchMove(false));
      }
    }
  });
  /** 计算所有状态类组件 */
  const computedStatusData = useMemoizedFn((id: string, actionId?: string) => {
    const { status } = pageRef.current?.preCompile
    if (status && status.length > 0) {
      let oldHides = hideDataRef.current.find(x => x.id === id)?.list
      if (!oldHides) {
        oldHides = status.find(x => x.id === id)?.list?.find(y => y.key === 'init')?.hide
      }
      const hides = pageRef.current?.preCompile.status.reduce(
        (pre: any, cur: any) => {
          if (id === "init") {
            const initHides = cur.list.find(x => x.key === "init")?.hide;
            pre.push(...(initHides || []));
          } else if (id === cur.id) {
            const actionHides = cur.list.find(x => x.key === actionId)?.hide;
            pre.push(...(actionHides || []));
          }
          return pre;
        }, []);
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
            if (x.id === "init") {
              x.list = x.list.filter(y => !status.find(s => s.id === id)?.list.some(t => t.key !== "init" && t.hide.includes(y)));
            }
          });
        }
      }
      if (id !== 'init') {
        const newHides = hideDataRef.current.find(x => x.id === id)?.list
        const showHides = difference(oldHides, newHides) ?? []
        setUpdateStatus([...newHides.map(x => ({ id: x, type: 'hide' })), ...showHides.map(x => ({ id: x, type: 'show' }))])
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
          const idsStr = ids.map(x => `#${getDomId(x)}`).join(",");
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
                  setUpdateCustom(uniqBy(customRef.current, 'id'))
                })
              } else {
                clearCustomDataRef.current = setTimeout(fn, 500)
                computedCustomDataCount = computedCustomDataCount - 1;
              }
            } else {
              clearCustomDataRef.current = setTimeout(fn, 500)
              computedCustomDataCount = computedCustomDataCount - 1;
            }
          });
        }
      }
      clearCustomDataRef.current = setTimeout(fn, 500)
    }
  });
  /** 自定义模板更新依赖 */
  const computedUpdateCustomData = useMemoizedFn(() => {
    const ids = pageRef.current?.preCompile?.customTemp?.map(x => x.id);
    if (ids?.length > 0) {
      const query = Taro.createSelectorQuery();
      const idsStr = ids.map(x => `#${getDomId(x)}`).join(",");
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
              setUpdateCustom(uniqBy(customRef.current, 'id'))
            })
          }
        }
      });
    }

  })
  /** 计算直播相关组件数据 */
  const computedLive = useMemoizedFn(async () => {
    const lives: any = pageRef.current?.preCompile?.lives || [];
    if (lives.length > 0) {
      const fn = async () => {
        let livePlayer: any = null
        try {
          livePlayer = requirePlugin(layout.config.livePluginName as string);
        } catch (err) { }
        for (let i = 0; i < lives.length; i++) {
          let liveStatus = storage.arrTimerGet("layout_liveStatus")?.find(x => x.id === lives[i].roomId)?.liveStatus;
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
                })
                liveStatus = getLiveStatusByChannel(sphLiveResult.status)
              }
            } else if (lives[i].startTime && lives[i].endTime) {
              liveStatus = getLiveStatus(lives[i].startTime, lives[i].endTime)
            } else {
              liveStatus = 102
            }
          }
          lives[i].liveStatus = liveStatus
        }
        Taro.nextTick(() => {
          setLiveData(draft => {
            lives.forEach(x => {
              const index = draft.findIndex(y => y.roomId === x.roomId)
              if (index !== -1) {
                draft[index].liveStatus = x.liveStatus
              } else {
                draft.push({ ...x })
              }
            })
            storage.arrTimerPush(
              "layout_liveStatus",
              draft.map(x => ({
                id: x.roomId,
                liveStatus: x.liveStatus
              })),
              60000
            );
          })
        })
        const subParams = lives.reduce((pre, cur) => {
          if (cur.subscribeId) {
            pre[0].push({
              stage: layout.config.liveStagePrefix + cur.roomId,
              subscribeId: cur.subscribeId,
              roomId: cur.roomId,
              active: getLiveActive(cur.liveStatus, cur.data)
            })
            pre[1].push({
              stage: layout.config.liveStagePrefix + cur.roomId,
              subscribeId: cur.subscribeId
            })
          }
          return pre
        }, [[], []])
        if (subParams[1].length > 0) {
          const token: any = await getToken()
          if (token) {
            const result = await getSubscribeCountByRoomId(subParams);
            const updateComponents: any = []
            subParams[0]?.forEach(s => {
              const liveSub = result?.data?.find(x => x.stage === layout.config.liveStagePrefix + s.roomId)
              const count = `${(s?.active?.baseCount || 0) + liveSub?.subscribeAllCount}`
              if (!isNil(s.active.countId)) {
                updateComponents.push({
                  type: "nodes",
                  key: s.active.countId,
                  value: count,
                })
              }
            })
            if (updateComponents.length > 0) {
              Taro.nextTick(() => {
                store.setCom(updateComponents, pageInfo?.id);
              })
            }
          }
        }
        clearLiveDataRef.current = setTimeout(fn, 60000)
      }
      fn()
    }
  });
  /** 计算没有直播房间号的直播间 */
  const computedLiveByNoRoomId = useMemoizedFn(async (id) => {
    setLiveData(draft => {
      const index = draft.findIndex(y => y.id === id)
      if (index !== -1) {
        draft[index].liveStatus = getLiveStatus(draft[index].startTime, draft[index].endTime)
      }
    })
  })
  /** 计算变化模板数据 */
  const computedUpdateTempInfo = useMemoizedFn((ids: string[]) => {
    if (ids?.length > 0) {
      const query = Taro.createSelectorQuery();
      const idsStr = ids.map(x => `#${getDomId(x)}`).join(",");
      query.selectAll(idsStr).boundingClientRect();
      query.exec(function (res) {
        log("res", res);
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
          log("list", list);
          updateTempRef.current = list;
          computedAllTempInfo();
          setUpdateCustom(uniqBy(updateTempRef.current, 'id'))
        }
      });
    }
  });
  /** 组件滑动触发订阅事件 */
  const hanlderTouch = useMemoizedFn(
    async (comId: string, direction: "left" | "right" | "top" | "bottom") => {
      const subjects = pageRef.current?.preCompile?.subjects || [];
      const subjectIndex = subjects.findIndex(x => x.comId === comId);
      if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        const updateStyles: any = [];
        const updateComponents: any = [];
        if (subject.type === "touchTB") {
          if (direction === "top" && subject.value < subject.totalLength - 1) {
            const [oldValue, newValue] = [subject.value, subject.value + 1];
            set(subjects, `${subjectIndex}.value`, newValue);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.gt?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.gt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === "component") {
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
          if (direction === "bottom" && subject.value > 0) {
            const [oldValue, newValue] = [subject.value, subject.value - 1];
            set(subjects, `${subjectIndex}.value`, subject.value - 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.lt?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.lt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log("bottom", subject.value - 1);
          }
        }
        if (subject.type === "touchLR") {
          if (direction === "left" && subject.value < subject.totalLength - 1) {
            const [oldValue, newValue] = [subject.value, subject.value + 1];
            set(subjects, `${subjectIndex}.value`, subject.value + 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.gt?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.gt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log("left", subject.value + 1);
          }
          if (direction === "right" && subject.value > 0) {
            const [oldValue, newValue] = [subject.value, subject.value - 1];
            set(subjects, `${subjectIndex}.value`, subject.value - 1);
            subject.observers.forEach(item => {
              if (item.value === oldValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.lt?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item?.lt?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
              if (item.value === newValue) {
                if (item.type === "style") {
                  updateStyles.push({
                    key: item.id,
                    value: getBaseStyle(item.eq?.style)
                  });
                }
                if (item.type === "component") {
                  updateComponents.push(
                    getBaseComponent({
                      ...(item.eq?.component || {}),
                      id: item.id
                    })
                  );
                }
              }
            });
            log("right", subject.value - 1);
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
  /** 计算平面层组件 */
  const computedPlaneElement = useMemoizedFn((item, index) => {
    let result = <Compiler data={[item]} parentPath={item.path} parentIndex={index} />;
    if (["LIVE", "LIVEA"].includes(item.templateCode)) {
      result = (
        <LiveTemplateContext.Provider value={{ liveData, computedLiveByNoRoomId }}>
          {result}
        </LiveTemplateContext.Provider>
      );
    }
    if (['TEXTCOUNTDOWN', 'IMGCOUNTDOWN'].includes(item.templateCode)) {
      const countdownEndTime = countdownInject?.find(x => x.name === item.templateName || item.templateName.indexOf(x.likeName) !== -1)?.endTime
      if (countdownEndTime) {
        result = (
          <CountdownTemplateContext.Provider value={{ countdownEndTime }}>
            {result}
          </CountdownTemplateContext.Provider>
        );
      }
    }
    if (item.templateCode.indexOf('SWIPER') !== -1) {
      const swiper = swiperContext?.find(x => x.name === item.templateName || item.templateName.indexOf(x.likeName) !== -1)
      if (swiper) {
        result = (
          <SwiperTemplateContext.Provider value={{ defaultCurrent: swiper?.defaultCurrent ?? 0, slots: swiper?.slots }}>
            {result}
          </SwiperTemplateContext.Provider>
        );
      }
    }
    if (index === 0) {
      result = (
        <FullScreemContext.Provider value={{ fullScreen }}>
          {result}
        </FullScreemContext.Provider>
      );
    }
    return result;
  });
  /** 获取模板插槽匹配数据 */
  const getSlotsByCustom = useMemoizedFn((item, index) => {
    return customSlot?.reduce((pre: any, x) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1
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
        const element = x.getElement ? x.getElement({
          component: {
            code: item.templateCode,
            name: item.templateName,
            customData: item.customData
          },
        }) : x.element
        pre.push({ ...x, element })
      }
      return pre;
    }, [])
  })
  /** 获取业务组件插槽匹配数据 */
  const getPlaneSlotByPageSlot = useMemoizedFn((item, index) => {
    let planeSlot: any = null
    const pSlot = pageSlot?.find(
      x => x.code === item.customCode
    );
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
      }
    }
    return planeSlot
  })
  /** 获取容器组件插槽 */
  const getInsertSlot = useMemoizedFn((item) => {
    return containerSlot?.find((x: any) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1
      }
      if (!isNil(x.name)) {
        result = x.name === item.templateName;
      }
      return result
    })?.insertList
  })
  /** 获取插入样式 */
  const getInjectStyle = useMemoizedFn((item) => {
    return styleInject?.find((x: any) => {
      let result = false;
      if (!isNil(x.likeName)) {
        result = item.templateName?.indexOf(x.likeName) !== -1
      }
      if (!isNil(x.name)) {
        result = x.name === item.templateName;
      }
      return result
    })?.style
  })
  if (!closeShare) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useShareAppMessage((res: any) => {
      let [title, path, imageUrl]: any = ["", "", ""];
      if (res.from === "button") {
        title = res.target.dataset?.title;
        path = res.target.dataset?.path;
        imageUrl = res.target.dataset?.img;
      } else {
        title = pageRef.current?.share?.title || defaultShareConfig?.title;
        path = pageRef.current?.share?.path || defaultShareConfig?.path;
        imageUrl =
          pageRef.current?.share?.imageUrl || defaultShareConfig?.imageUrl;
      }
      try {
        onShareAppMessage?.(res, { title, path, imageUrl: getUrl(imageUrl) });
      } catch { }
      return {
        title,
        path,
        imageUrl: getUrl(imageUrl)
      };
    });
  }
  usePageScroll(res => {
    // /** 置顶相关处理操作 */
    pageScrollTopHandler(res);
    /** 电梯自动切换图片操作 */
    pageScrollEleHandler(res);
    /** 全屏状态处理操作 */
    fullScreenHandler(res);
  });
  useUpdateEffect(() => {
    if (!catchMove) {
      setTimeout(() => {
        setFullScreen(false);
      }, 10);
    }
  }, [catchMove]);
  useUpdateEffect(() => {
    if (fullScreen) {
      setTimeout(() => {
        setCatchMove(true);
      }, 300);
    }
  }, [fullScreen]);
  useUpdateEffect(() => {
    computedElevators(placeholderHeight);
  }, [placeholderHeight]);
  useUpdateEffect(() => {
    computedAllTempInfo(false);
  }, [navHeightPxNum]);
  useUpdateEffect(() => {
    if (!isNowPage) {
      if (clearCustomDataRef.current) {
        clearTimeout(clearCustomDataRef.current)
        clearCustomDataRef.current = null
      }
      if (clearLiveDataRef.current) {
        clearTimeout(clearLiveDataRef.current)
        clearLiveDataRef.current = null
      }
    }
    if (isNowPage && !clearLiveDataRef.current) {
      computedLive()
    }
  }, [isNowPage])
  useUpdateEffect(() => {
    Taro.nextTick(() => {
      computedUpdateCustomData()
    })
  }, [pageSlot])
  useEffect(() => {
    loadPage();
  }, [code, loadPageConfig?.value]);

  return (
    <>
      <View style={loadingStyle || {}}>
        {loading && <Loading ids={loadingIds} config={loading} />}
      </View>
      <LayoutContext.Provider
        value={{
          pageId: pageInfo?.id,
          isCustomShare: isFunction(onShare),
          notices: pageInfo?.notice,
          wxButtons: pageInfo?.wxButtons,
          videoHeights: pageInfo?.videoHeight,
          swiperRelation: pageInfo?.swiperRelation,
          closeAction,
          routerParams,
          computedStatusData
        }}
      >
        <View
          style={{
            position: "relative",
            backgroundColor: pageInfo?.config?.background || "transparent",
            ...(globalStyle || {})
          }}
        >
          <View className="layout-page-observe"></View>
          {/** 置顶补充区域 */}
          <View
            style={{
              width: "100vw",
              height: placeholderHeight,
              backgroundColor: "transparent"
            }}
          ></View>
          {/** 平面层 */}
          <View
            style={{
              position: "relative",
              overflow: "hidden",
              ...(planeStyle || {})
            }}
          >
            {/** 平面层实际内容 */}
            <View
              style={{ position: "relative", zIndex: 1 }}
              catchMove={catchMove}
              onTouchStart={(e: any) => {
                if (["zoom"].includes(pageRef.current?.preCompile?.openFullScreen || "")) {
                  moveRef.current = e.changedTouches[0];
                }
              }}
              onTouchEnd={(e: any) => {
                if (
                  ["zoom"].includes(
                    pageRef.current?.preCompile?.openFullScreen || ""
                  )
                ) {
                  e?.stopPropagation();
                  const moveX =
                    moveRef.current.clientX - e.changedTouches[0].clientX;
                  const moveY =
                    moveRef.current.clientY - e.changedTouches[0].clientY;
                  if (Math.abs(moveY) > Math.abs(moveX)) {
                    if (moveY > 0 && fullScreen) {
                      changeCatchMove?.(false);
                    }
                  }
                }
              }}
            >
              <VirtialList
                list={planeData}
                updateStatus={updateStatus}
                updateTopdata={updateTopdata}
                updateCustom={updateCustom}
                rule={virtialRule}
                onRender={(item, index, mainIndex) => {
                  const planeSlot = getPlaneSlotByPageSlot(item, index)
                  const slots = getSlotsByCustom(item, index)
                  const insertSlot = getInsertSlot(item)
                  const injectStyle = getInjectStyle(item)
                  const topStyle: any = item.topData?.fixed ? {
                    position: 'fixed',
                    left: item.topData.left,
                    top: item.topData.top,
                    zIndex: 1001
                  } : {}
                  return (
                    <View
                      key={item.id}
                      style={{
                        marginTop: index > 0 ? "-0.5px" : undefined,
                        fontSize: item.planeSlot ? undefined : 0,
                        position: "relative",
                        ...(item.isShow ? showStyle : hideStyle),
                        ...topStyle
                      }}
                      onTouchStart={(e: any) => {
                        comMoveRef.current = e.changedTouches[0];
                      }}
                      onTouchEnd={(e: any) => {
                        const moveX =
                          comMoveRef.current.clientX -
                          e.changedTouches[0].clientX;
                        const moveY =
                          comMoveRef.current.clientY -
                          e.changedTouches[0].clientY;
                        if (Math.abs(moveY) > Math.abs(moveX)) {
                          if (moveY > 0) {
                            hanlderTouch(item.id, "top");
                          } else {
                            hanlderTouch(item.id, "bottom");
                          }
                        } else {
                          if (moveX > 0) {
                            hanlderTouch(item.id, "left");
                          } else {
                            hanlderTouch(item.id, "right");
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
                            position: "absolute",
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
                            componentType: "plane",
                            templateId: item.templateId,
                            templateCode: item.templateCode,
                            templateName: item.templateName,
                            templateIndex: index,
                            templateCustomData: item.customData,
                            status: item.status,
                            injectStyle,
                            insertSlot
                          }}
                        >
                          {computedPlaneElement(item, index)}
                        </TemplateContext.Provider>
                      )}
                    </View>
                  );
                }} />
            </View>
          </View>
          {/** 窗口层 */}
          {
            windowData?.length > 0 && <MovableArea
              style={{
                position: "fixed",
                top: `calc(${navHeightPxNum || 0}px - 1000rpx)`,
                width: "100vw",
                height: "3000rpx",
                left: 0,
                zIndex: 5000,
                pointerEvents: "none",
                ...(windowStyle || {})
              }}
            >
              {windowData?.map((item, index) => {
                const slots = getSlotsByCustom(item, index)
                const insertSlot = getInsertSlot(item)
                return (
                  <TemplateContext.Provider
                    key={item.id}
                    value={{
                      componentType: "window",
                      templateId: item.id,
                      templateCode: item.templateCode,
                      templateName: item.templateName,
                      templateCustomData: item.customData,
                      templateIndex: index,
                      iconSlot,
                      insertSlot
                    }}
                  >
                    <Movable
                      key={item.id}
                      comId={item.id}
                      comStyle={item.style}
                      movable={item.movable}
                    >
                      {slots?.map((s, i) => (
                        <View
                          key={i}
                          style={{
                            left: s.left,
                            top: s.top,
                            bottom: s.bottom,
                            right: s.right,
                            position: "absolute",
                            zIndex: 1000
                          }}
                        >
                          {s.element}
                        </View>
                      ))}
                      <Compiler data={[item]} parentPath={item.path} parentIndex={index} />
                    </Movable>
                  </TemplateContext.Provider>
                )
              })}
            </MovableArea>
          }

        </View>
        <View
          style={{ width: "100vw", height: `calc(${tabHeight || "0px"})` }}
        ></View>
        {/** 事件触发弹窗层 */}
        <View>
          <Popup pageId={pageInfo?.id} />
        </View>
        <View>
          <PreMedia medias={pageInfo?.preMedia || []} />
        </View>
      </LayoutContext.Provider>
    </>
  );
};

export default Layout;
