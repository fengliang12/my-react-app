declare namespace Edit {
  /** 页面配置 */
  type IPage<T = IComponents> = {
    /** 页面id */
    id: string;
    /** 页面名称 */
    name: string;
    /** 导航标题 */
    titleNav: string;
    /** 唯一标题 */
    titleSole: string;
    /** 分享配置 */
    share: IShare;
    /** 页面类型 */
    type: TType;
    /** 页面比例 */
    ratio: number;
    /** 页面配置 */
    config: IConfig;
    /** 是否启用 */
    enable?: boolean;
    /** 初始化接口队列 */
    initApiQueue: any[];
    /** 组件合集 */
    components: {
      /** 窗口层 */
      window: T[];
      /** 平面层 */
      plane: T[];
      /** 平面层热区数据 */
      hot: IHot[];
      /** 挂件 */
      pendant: T[];
    };
    /** 自定义数据 */
    customData: any[];
    /** 预解析数据 */
    preCompile?: {
      /** 微信相关按钮事件 */
      wxButtons: {
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
      /** 样式相关按钮事件 */
      styleEvents: { id: string; style: IStyle }[];
      /** 电梯相关跳转组件Id集合 */
      elevators: string[];
      /** 所有组件大小尺寸 */
      size: { id: string; content: [string, string, string, string] }[];
      /** 所有组件状态
       *  key : init为初始化, 其他为actionId
       */
      status: {
        /** 组件id */
        id: string;
        /** 关联状态合集 */
        list: {
          key: string;
          hide: string[];
        }[];
      }[];
      /** 页面所有需要预解析的媒体 */
      preMedia: {
        type: "image" | "video";
        url: string;
      }[];
      /** 组件所有视频的高度 */
      videoHeight: {
        id: string;
        height: string;
      }[];
      /** 预解析关联轮播数据 */
      swiperRelation: {
        id: string;
        count: number;
      }[];
      /** 店铺公告的预解析数据 */
      notice: {
        id: string;
        width: number;
        interval: number;
      }[];
      /** 全屏状态 */
      openFullScreen?: "close" | "open" | "open-move" | "zoom";
      /** 业务模板 */
      customTemp?: {
        id: string;
        code: string;
        data: {
          code: string;
          value: string;
          index: number;
          type: "image" | "video" | "text" | "richText";
        }[];
      }[];
      /** 直播组件相关数据 */
      lives?: {
        id: string;
        roomId: string;
        startTime?: string;
        endTime?: string;
        type?: string;
        subscribeId?: string;
        data: {
          type: "unstart" | "live" | "end";
          countId: string;
          statusId: string;
          baseCount: number;
          statusName: string;
        }[];
      }[];
      /** 电梯相关数据 */
      eles?: {
        selIndex: number;
        tops: {
          id: string;
          actions: IActions[];
        }[];
      }[];
      /** 观察者主题合集 */
      subjects?: {
        comId: string;
        type: "touchTB" | "touchLR";
        value: number;
        totalLength: number;
        needComputed: boolean;
        observers: {
          id: string;
          type: "style" | "component";
          value: number;
          /** 大于 */
          gt: {
            style: IStyle;
            component: IActionComponent;
          };
          /** 等于 */
          eq: {
            style: IStyle;
            component: IActionComponent;
          };
          /** 小于 */
          lt: {
            style: IStyle;
            component: IActionComponent;
          };
        }[];
      }[];
      /** 自定义字段 */
      customData?: any;
    };
  };
  /** 模板实例 id 数组 */
  type ITemplateExampleIds = string;

  /** 页面编辑器 */
  type ITemplateToPage = IPage<ITemplateExample>;

  /** 模板配置 */
  type ITemplate = {
    /** 模板Id */
    id: string;
    /** 模板code */
    templateCode: string;
    /** 层级类型 */
    layerType: ComponentType;
    /** 可使用页面类型 */
    pageType: TType;
    /** 模板名称 */
    name: string;
    /** 自定义code */
    customCode: string;
    /** 自定义数据 */
    customData: {
      code: string;
      value: string;
      index: number;
      type: "image" | "video" | "text" | "richText";
    }[];
    /** 直播房间号 */
    liveRoomId: string;
    /** 电梯配置 */
    ele: {
      auto: boolean;
      selIndex: number;
    };
    /** 模板快照 */
    snapshot: string;
    /** 模板数据 */
    data: IComponents[];
    /** 扩展字段 */
    extendInfo?: {
      /** 版本 */
      version?: number;
      /** 显示规则 */
      showRule: {
        /** 事时间规则类型
         *  1.每次进入页面显示一次
         *  2.每天显示一次
         */
        timeType?: number;
        /** 设置当天显示有效期 */
        timeValue?: string[];
        /** 空间规则类型
         *  1.手机第一屏显示
         *  2.手机非第一屏显示
         *  3.指定高度区间显示
         */
        spaceType?: number;
        /** 指定开始高度 */
        spaceHeightStart?: number;
        /** 指定结束高度 */
        spaceHeightEnd?: number;
      };
      /** 挂件信息 */
      pendants: any[];
    };
    /** 模板数据的映射属性 */
    mapping: Edit.IMapping;
  };
  /* 移动属性-目前只支持窗口层模板 */
  type IMovable = {
    disabled: boolean;
    direction: "all" | "vertical" | "horizontal" | "none";
    outOfBounds: boolean;
    damping: number;
    friction: number;
    animation: boolean;
    scale: boolean;
    scaleMin: number;
    scaleMax: number;
    scaleValue: number;
  };
  /** 置顶属性-目前只支持平面层模板 */
  type ITopdata = {
    /** 组件Id */
    id: string;
    /** 是否启用 */
    enable: boolean;
    /** 组件高度 */
    height: number;
    /** 置顶开始高度 */
    startScrollTop: number;
    /** 置顶开始模板Id */
    startId: string;
    /** 置顶结束高度 */
    endScrollTop: number;
    /** 置顶结束模板Id */
    endId: string;
    /** 是否占位 */
    placeholder: boolean;
    /** 排序 */
    sort: number;
    /** 是否置顶 */
    fixed: boolean;
    /** 距离左边的距离 默认0 */
    left: number;
    /** 距离顶部的距离 默认0 */
    top: number;
  };

  type IHot = {
    id: string;
    /**  [10rpx(宽度),20rpx(高度),30rpx(上边距),40rpx(左边距)] */
    value: string[];
    /** 触发事件 */
    event: IEvent[];
    /** 互斥事件 */
    exclusiveEvent: IEvent[];
  };

  type ITemplateExample = ITemplate & {
    /**
     * 模板id = 模板实例 templateId
     */
    templateId: string;
    /* 移动属性-目前只支持窗口层模板 */
    movable: IMovable;
    /** 置顶属性-目前只支持平面层模板 */
    topData: ITopdata;
  };

  /** 组件类型 */
  type TComponent =
    | "view"
    | "swiperView"
    | "scrollView"
    | "video"
    | "image"
    | "json"
    | "text";

  /** 页面类型 */
  type TType = "pc" | "mobile";

  /** 页面配置 */
  type IConfig = {
    /** 是否开启分享 */
    openShare: boolean;
    /** 页面背景色 */
    background: string;
  };

  /** 分享配置 */
  type IShare = {
    /** 分享标题 */
    title: string;
    /** 分享路径 */
    path: string;
    /** 图片路径 */
    imageUrl: string;
  };

  /** 组件
   *  1、元组件区分容器元组件和非容器元组件
   *  2、容器组件可以有子组件,非容器组件不支持嵌套子组件
   */
  type IComponents = {
    /** 唯一标识符 */
    id: string;
    /** 父级标识符 */
    parentId: string | null;
    /** 组件类型 */
    type: TComponent;
    /** 层级 */
    level: number;
    /** 组件名称 */
    name?: string;
    /** 事件 */
    event?: IEvent[];
    /** 互斥事件 */
    exclusiveEvent?: IEvent[];
    /** 样式 */
    style: IStyle;
    /** React样式 */
    reactStyle: React.CSSProperties;
    /** 数据源 */
    data?: {
      /** 静态 */
      static: string;
      /** 动态 */
      dynamic: any;
    };
    /** 自定义字段 */
    customData?: {
      /** 动态数据 */
      dynamics: {
        // 动态类型
        type: "value" | "condition" | "list";
        // 条件表达式
        conditionExpression?: string;
        // 动态数据Key
        dataKey: any;
      }[];
      [key: string]: any;
    };
    /** 轮播导航数据 */
    swiperNav?: {
      /** 导航类型 */
      type: "point" | "line" | "image" | "move-line";
      /** 关联轮播的组件Id */
      swiperId: string;
      /** 关联轮播的子元素数量 */
      swiperCount: number;
      /** 当前属性对应的索引 */
      current: number;
      /** 当前选中索引对应的颜色 */
      currentColor: string;
      /** 导航图片数据 */
      currentImgs: string[];
      /** 样式 */
      currentStyle: IStyle;
    };
    /** 轮播Current样式变更 */
    swiperCurrent?: {
      /** 轮播模板Code */
      swiperCode: string;
      /** 关联轮播的组件Id */
      swiperId: string;
      /** 关联轮播的子元素数量 */
      swiperCount: number;
      /** 当前SwiperItem对应的索引 */
      current: number;
      /** 当前SwiperItem里面元素对应的索引 */
      index: number;
      /** 未选中模板样式 */
      unCheckedStyle: IStyle;
      /** 选中模板样式 */
      checkedStyle: IStyle;
    };
    /** 关联数据 */
    relation?: string[];
    /** 全屏状态 */
    openFullScreen?: "close" | "open" | "open-move" | "zoom";
    /** 直播状态 */
    liveStatus?: number[];
    /** 当前索引情况 */
    currentIndex?: number;
    /** View组件属性 */
    view?: IView;
    /** 图片组件属性 */
    image?: IImage;
    /** 视频组件属性 */
    video?: IVideo;
    /** 音频组件属性 */
    richText?: IRichText;
    /** 轮播组件属性 */
    swiperView?: ISwiperView;
    /** 滑动组件属性 */
    scrollView?: IScrollView;
    /** 自定义JSON组件属性 */
    jsonData?: string;
    /** 文本组件属性 */
    text?: IText;
    /** 子集 */
    children: IComponents[];
    /** 热区数据 */
    hot: IHot[];
  };
  interface IEvent {
    /** 事件类型
     *  tap - 点击
     *  longtap - 长按点击
     */
    type: IEventType;
    /** 动作 */
    actions: IActions[];
  }

  type IEventType = "tap" | "longpress";

  type IActions = {
    /** 动作id */
    actionId: string;
    /** 动作名称 */
    actionName: string;
    /** 动作类型 */
    actionType: IActionType;
    /** 动作执行条件 */
    exeCondition: any;
    /** 是否拥有动作队列 */
    hasQueue: boolean;
    /** 动作回调队列 */
    actionFallbackQueue: IActions[];
  };

  type IActionType = {
    /** 动作类型枚举值 */
    value: IActionValueType;
    /** 路由 */
    route: IActionRoute;
    /** 样式 */
    style: IActionStyle[];
    /** 元组件属性 */
    component: IActionComponent[];
    /** 接口 */
    interfaces: IActionInterfaces;
    /** 微信开放能力 */
    openwx: IActionOpenWx;
    /** 弹窗 */
    popup: IActionPopup;
    /** 自定义操作 */
    custom: IActionCustom;
    /** 业务 */
    business: IActionBusiness;
    /** 自定义数据 */
    customData: {
      /** 模态弹窗 */
      showModal: IActionShowModal;
      /** 修改页面数据 */
      setPage: IActionSetPage;
      [key: string]: any;
    };
  };

  type IActionComponent = {
    /** 关联组件Id */
    id: string;
    /** 待修改的原组件属性 */
    type: IComponentValueType;
    /**  VideoContext实例 */
    videoCtx: {
      type:
      | "play"
      | "pause"
      | "stop"
      | "showStatusBar"
      | "sendDanmu"
      | "seek"
      | "requestFullScreen"
      | "requestBackgroundPlayback"
      | "playbackRate"
      | "hideStatusBar"
      | "exitPictureInPicture"
      | "exitFullScreen"
      | "exitBackgroundPlayback"
      | "requestFullScreenAndPlay";
      position: number;
      danmu: {
        text: string;
        color: string;
      };
      direction: 0 | 90 | -90;
      rate: 0.5 | 0.8 | 1.0 | 1.25 | 1.5 | 2.0;
    };
    muted: boolean;
    src: string;
    current: {
      value: number | "last" | "next";
      count: number;
    };
    offset: {
      id: string;
      number: number;
    };
    nodes: string;
  };

  type IComponentValueType =
    | "image"
    | "video"
    | "swiperView"
    | "scrollView"
    | "text"
    | "videoCtx";

  type IActionValueType =
    | "ROUTE"
    | "STYLE"
    | "INTERFACES"
    | "INTERACTIVES"
    | "OPENWX"
    | "COMPONENT"
    | "POPUP"
    | "CUSTOM"
    | "BUSINESS"
    | "SHOWMODAL"
    | "SETPAGE"
    | "SETAPP";

  type IActionRoute = {
    /** 小程序跳转方式 */
    value: IRoutevalueType;
    /** 页面内跳转 */
    page: IActionRoutePage;
    /** 小程序内跳转 */
    appletWithin: IActionRouteWithin;
    /** 小程序外跳转 */
    appletOutside: IActionRouteOutside;
  };

  /** 跳转方式枚举值 */
  type IRoutevalueType = "PAGE" | "APPLETWITHIN" | "APPLETOUTSIDE";

  type IActionRoutePage = {
    /** 跳转至组件id */
    componentsId: string;
    /** 跳转至指定高度 */
    specifyHeight: string;
  };

  type IRoutePageValueType = "COMPONENTSID" | "SPECIFYHEIGHT" | "MIXINS";

  type IActionRouteWithin = {
    /** 跳转路径 */
    path: string;
  };

  type IActionRouteOutside = {
    /**
     * 小程序外跳转方式
     * LIVEVIDEO: 跳转至视频号
     * OTHERAPPLET: 其他小程序
     * EXITAPPLET:关闭当前小程序
     */
    value: IActionRouteOutsideValueType;
    /** 视频号相关参数 */
    channel: {
      /**
       * 操作视频号相关方式
       * reserveChannelsLive:预约视频号直播
       * openChannelsUserProfile:打开视频号主页
       * openChannelsLive:打开视频号直播
       * openChannelsEvent:打开视频号活动页
       * openChannelsActivity:打开视频号视频
       *  */
      value:
      | "reserveChannelsLive"
      | "openChannelsUserProfile"
      | "openChannelsLive"
      | "openChannelsEvent"
      | "openChannelsActivity";
      /** 预告Id */
      noticeId: string;
      /** 视频号Id */
      finderUserName: string;
      /** 直播feedId */
      feedId: string;
      /** 直播nonceId */
      nonceId: string;
      /** 活动Id */
      eventId: string;
    };
    /** 其他小程序 */
    other: {
      appId: string;
      path?: string;
      extraData?: string;
      envVersion?: "develop" | "trial" | "release";
      shortLink?: string;
    };
  };

  type IActionRouteOutsideValueType =
    | "LIVEVIDEO"
    | "OTHERAPPLET"
    | "OTHERAPP"
    | "EXITAPPLET";

  type IActionStyle = {
    /** 关联样式id */
    id: string;
    /** 变更样式 */
    update: IStyle;
  };

  type IActionStyleValueType = "ID" | "UPDATE";

  type IActionInterfaces = {
    method: "get" | "post" | "delete" | "put";
    url: string;
    data: any;
    successMsg: string;
  };

  type IActionOpenWx = {
    openType:
    | "contact"
    | "qyContact"
    | "share"
    | "getPhoneNumber"
    | "openSetting"
    | "feedback"
    | "subscribe"
    | "getUserProfile"
    | "copy"
    | "makePhoneCall"
    isButton: boolean;
    /** 客服相关数据 */
    contact: {
      /** 客服链接 */
      url?: string;
      /** 企业Id */
      corpId?: string;
      show: boolean;
      title: string;
      path: string;
      imageUrl: string;
    };
    /** Button分享数据 */
    share: {
      title: string;
      path: string;
      imageUrl: string;
    };
    subscribeTmpIds: string[];
    /** 订阅点位配置 */
    subscribeRecord: {
      open: boolean;
      subscribeIds: string[];
      stage: string;
    };
    /** 字符串通用属性（比如复制文本值） */
    value: string;
  };

  type IActionOpenWxShare = IShare;

  type IActionPopup = {
    /** 图片/视频路径 */
    src: string;
    /** 媒体类型 */
    type: "image" | "video";
    /** 样式 */
    style: IStyle;
    /** 事件 */
    event: IEvent;
    /** 是否开启遮罩层 */
    mask: boolean;
    /** 点击遮罩层是否关闭 */
    maskClosable: boolean;
    /** 触发弹窗的组件信息 */
    templateInfo?: {
      name: string;
      code: string;
      index: string;
    };
  };

  type IActionCustom = {
    code: string;
    data?: string;
  };

  type IActionBusiness = {
    /** 业务类型 */
    businessType: string;
    /** json数据 */
    jsonData: any;
    /** 映射类型 */
    actions: IActions[];
  };

  type IActionShowModal = {
    title: string;
    content: string;
    showCancel: boolean;
    cancelText: string;
    cancelColor: string;
    confirmText: string;
    confirmColor: string;
  };

  type IActionSetPage = {
    key: string;
    value: string;
  }[];

  type IStyle = {
    /** React Style */
    reactStyle?: React.CSSProperties;
    /** 盒模型属性 */
    boxModel?: Partial<IBoxModel>;
    /** 定位属性 */
    position?: IPosition;
    /** 文字相关属性 */
    font?: Partial<IFont>;
    /** FLex布局属性 */
    flex?: Partial<IFlex>;
    /** 通用属性 */
    common?: Partial<ICommon>;
    /** 动效属性 */
    dynamicEffect?: IDynamicEffect;
  };

  /** 盒模型 */
  type IBoxModel = {
    display?: "flex" | "inline-flex" | "block";
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    margin?: string | number;
    boxSizing?: string;
    border?: string;
    borderLeft?: string;
    borderRight?: string;
    borderTop?: string;
    borderBottom?: string;
    paddingTop?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    paddingRight?: string | number;
    marginTop?: string | number;
    marginBottom?: string | number;
    marginLeft?: string | number;
    marginRight?: string | number;
    borderWidth?: string | number;
    borderStyle?: string;
    borderColor?: string;
  };

  /** 定位类型 */
  type TPosition = "static" | "absolute" | "fixed" | "relative";

  /** 定位属性 */
  type IPosition = {
    /** 定位类型 */
    position?: TPosition;
    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;
  };

  /** 文字属性 */
  type IFont = {
    fontSize?: string | number;
    fontWeight?: "normal" | "blod" | "bolder" | "lighter" | number | any;
    lineHeight?: string | number;
    color?: string;
    textDecoration?: "underline" | "overline" | "line-through" | "blink";
    whiteSpace: string;
    textOverflow: string;
    fontFamily: string;
    textShadow: string;
  };

  /** Flex属性 */
  type IFlex = {
    flexDirection: "row" | "row-reverse" | "column" | "column-reverse";
    flexWrap: "nowrap" | "wrap" | "wrap-reverse";
    justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
    alignItems: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
    alignContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "stretch";
    order?: number;
    flexGrow?: number;
    flexShrink?: number;
    alignSelf?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  };

  /** 通用属性 */
  type ICommon = {
    background: string;
    backgroundColor: string;
    zIndex: number;
    opacity: string;
    boxShadow: string;
    borderRadius: string;
    borderTopRightRadius: string;
    borderTopLeftRadius: string;
    borderBottomLeftRadius: string;
    borderBottomRightRadius: string;
    transform: string;
    overflow: string;
    overflowY: string;
    overflowX: string;
    textAlign: string;
    pointerEvents: string;
  };

  /** 动态效果 */
  type IDynamicEffect = {
    animotion: string;
    transition: string;
    /** 过渡时间 */
    animationDuration: string;
  };

  /** 组件默认属性 */
  type IBaseComponentsProps = {
    style?: React.CSSProperties;
    className?: string;
    bindtap?: (e: any) => void;
  };

  /** 轮播容器属性 */
  type ISwiperView = {
    /** 是否显示面板指示点 */
    indicatorDots?: boolean;
    /** 指示点颜色 */
    indicatorColor?: string;
    /** 当前选中的指示点颜色 */
    indicatorActiveColor?: string;
    /** 是否自动切换 */
    autoplay?: boolean;
    /** 当前所在滑块的index */
    current?: number;
    /** 自动切换时间间隔 */
    interval?: number;
    /** 滑动动画时长 */
    duration?: number;
    /** 滑动方向是否为纵向 */
    vertical?: boolean;
    /** 前边距 */
    previousMargin?: number;
    /** 后边距 */
    nextMargin?: number;
    /** 同时显示的滑块数量 */
    displayMultipleItems?: number;
    /** 是否采用衔接滑动 false */
    circular?: boolean;
    bindchange?: (e: any) => void;
  };

  /** View组件属性 */
  type IView = {
    catchMove?: boolean;
  };

  /** 滚动容器属性 */
  type IScrollView = {
    scrollType?: "x" | "y";
    bindscroll?: (e: any) => void;
  };

  /** 图片属性 */
  type IImage = {
    src?: string;
    mode?: ImageMode;
    showMenuByLongpress?: boolean;
    bindload?: (e: any) => void;
  };

  type IText = {
    nodes?: string;
    /**文本是否可选，该属性会使文本节点显示为 inline-block */
    userSelect?: boolean;
    /**显示连续空格 */
    space?: SpaceType;
  };

  /** 视频属性 */
  type IVideo = {
    src?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    showFullscreenBtn?: boolean;
    showPlayBtn?: boolean;
    showCenterPlayBtn?: boolean;
    showMuteBtn?: boolean;
    objectFit?: ObjectFitType;
    onLoadMetadata?: IActions[];
    onPlay?: IActions[];
    onPause?: IActions[];
    onEnded?: IActions[];
    onFullscreenChange?: IActions[];
    onEnterPictureInPicture?: IActions[];
    onLeavePictureInPicture?: IActions[];
    onSeekComplete?: IActions[];
    onControlsToggle?: IActions[];
    onProgress?: IActions[];
    onWaiting?: IActions[];
    onError?: IActions[];
  };

  /** 富文本信息 */
  type IRichText = {
    nodes?: string;
    space?: SpaceType;
  };

  type IMapping = {
    style?: IMappingItem[];
    event?: IMappingItem[];
  };

  type IMappingItem = {
    /** 映射名称 */
    name: string;
    /** 映射路径 路径首位元素为id（模板） */
    path: string[];
  };

  type ImageMode =
    | "scaleToFill"
    | "aspectFit"
    | "aspectFill"
    | "widthFix"
    | "heightFix";

  type DragType = "sort" | "move" | "nest";

  type ComponentType = "plane" | "window" | "pendant";

  type ComponentViewType = "plane" | "window" | "all";

  type ObjectFitType = "contain" | "fill" | "cover";

  type SpaceType = "ensp" | "emsp" | "nbsp";

  type BasicType = string | number | boolean;

  /** store */
  type StoreLayout = {
    /** 当前Layout的全屏状态 */
    fullScreen: any;
    /** 当前Layout所在页面的路径 */
    currentPage: any;
    /** 元组件数据运行时 */
    updateCom: any;
    /** 样式修改运行时 */
    updateStyle: any;
    /** 事件指向合集 */
    eventPointTo: any;
    /** 弹窗 */
    popup: any;
  };

  /** 个人信息 */
  type User = {
    // 是否是会员
    isMember: boolean;
    // 真实名称
    realName: string;
    // 昵称
    nickName: string;
    // 头像
    avatarUrl: string | null;
    // 头像额外样式
    avatarStyle: React.CSSProperties
    // 头像边框
    avatarBorderUrl: string | null;
    // 头像边框额外样式
    avatarBorderStyle: React.CSSProperties
    // 性别
    gender: string;
    // 手机号
    phone: string;
    // 生日
    birthday: string;
    // 会员等级索引
    memberIndex: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    // 会员卡号
    memberNum: string;
    // 会员卡号二维码地址
    memberNumQrCode: string;
    // 当前会员等级
    memberLevel: string;
    // 上一级会员等级
    lastMemberLevel: string;
    // 下一级会员等级
    nextMemberLevel: string;
    // 下一级会员等级需要消费金额
    nextMemberLevelSum: string;
    // 下一等级描述文案
    nextMemberLevelText: string;
    // 保级需要消费金额
    keepMemberLevelSum: string;
    // 下一级会员等级需要消费次数
    nextMemberLevelCount: string;
    // 等级进度百分比
    memberLevelProgress: string;
    // 等级截止日期、等级有效期
    memberLevelDeadline: string;
    // 当前积分
    point: string;
    // 即将到期的积分
    pointA: string;
    // 即将到期积分截止时间
    pointATime: string;
    // 一个月内到期积分
    pointB: string;
    // 过期积分
    pointC: string;
    // 优惠券数量
    couponCount: string;
    // 是否是徽章达人
    isHaveBadge: boolean
    // 是否显示等级截止日期、等级有效期
    isShowMemberLevelDeadline: boolean
    // 是否显示即将到期积分截止时间
    isShowPointATime: boolean;
    // 生日Logo图片
    birthdayLogoUrl: string
  };
}
