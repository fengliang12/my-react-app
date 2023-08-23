declare namespace Api {
  /**
   * 通用接口类型声明
   */
  namespace Common {
    /**
     * 通用接口公用声明
     */
    namespace Public {
      /** 会员基础信息 */
      type ICustomerBasicInfo = {
        /** 注册页面地址 */
        agreementInfo: string;
        /** 会员注册时间 */
        agreementTime: string;
        /** 头像 */
        avatarUrl: string;
        /** 城市 */
        city: string;
        /** 国家 */
        country: string;
        /** 性别
         * 0是未知，1是男，2是女 */
        gender: number;
        /** 语言 */
        language: string;
        /** 是否是会员 */
        member: boolean;
        /** 手机号 */
        mobile: string;
        /** 用户昵称 */
        nickName: string;
        /** 省份 */
        province: string;
        /** 成为潜客时间 */
        registerTime: string;
        /** 生日 */
        birthDate: string;
        /** marsId */
        marsId: string;
        /** 会员等级 */
        tags: string[];
        memberShipTime: any;
      };

      type hotZonePosition = {
        /** 热区高度 */
        height: number;
        /** 热区id，没用 */
        id: string;
        /** 当type是link时，跳转路径 */
        linkUrl?: "link" | "popup";
        /** 当type是popup时，弹窗code */
        popupCode?: string;
        /** 热区类型,link或者popup*/
        type: string;
        /** 热区宽度 */
        width: number;
        /** 热区左上角横坐标 */
        x: number;
        /** 热区左上角纵坐标 */
        y: number;
      };

      /** 配置中心配置 */
      type IconSetting = {
        /** icon跳转地址 */
        iconHref?: string;
        /** icon图片地址 */
        iconUrl?: string;
        /** 标签 */
        label?: string[];
        /** 开始时间 */
        from?: string;
        /** 结束时间 */
        to?: string;
        /** 热区 */
        hotZonePosition?: [] | undefined;
      };
    }
    /** 授权获取用户信息和token
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/login/{code}
     *  @Method GET
     */
    namespace Login {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** wx.login成功返回的code */
        code: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 购物车商品数量 */
        cartItemNum: number;
        /** 会员信息 */
        customerBasicInfo: Public.ICustomerBasicInfo;
        /** 后端返回自定义Token */
        jwtString: string;
        /** 微信开放平台唯一标识 */
        unionId: string;
        /** 小程序唯一标识 */
        openId: string;
        /** 会员唯一标识 */
        customerId: string;
        /**新老客 */
        old: boolean;
        /**首次购买时间 */
        firstShopTime: string;
      };
    }
    /** 发送短信接口
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/sendSmsCode/{mobile}
     *  @Method POST
     */
    namespace SendSMS {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<boolean>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 手机号 */
        mobile: string;
      };
    }
    /** 查询配置信息
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/kvdata/findType/{type}
     *  @Method POST
     */
    namespace FindKvDataByType {
      /** 接口定义 */
      type FuncT = (type: string) => MRP<Array<IResponse>>;
      /** 返回参数 */
      type IResponse = {
        [x: string]: any;
        /** 商城编码 */
        account: string;
        /** 内容 */
        content: string;
        /** 创建时间 */
        createTime: string;
        /** 图片URL地址 */
        icon: string;
        /** icon集合 */
        iconList: {
          /** icon跳转地址 */
          iconHref: string;
          /** icon图片地址 */
          iconUrl: string;
          /** 标签 */
          label?: string[];
          /** 热区 */
          hotZonePosition?: any[];
        }[];
        /** string */
        id: string;
        /** 中文名称 */
        name_cn: string;
        /** 英文名称 */
        name_en: string;
        /** 上线时间 */
        onlineTime: string;
        /** 上线时间格式化 */
        onlineTimeFormat: string;
        /** 状态 */
        status: string;
        /** 关键字类型 */
        type: string;
      };
    }
    /** 查询配置信息
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/kvdata/findType/{type}
     *  @Method POST
     */
    namespace FindFirstKvConfig {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse | null>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 关键字 */
        type: string;
      };
      /** 返回参数 */
      type IResponse = {
        [x: string]: any;
        /** 商城编码 */
        account: string;
        /** 内容 */
        content: string;
        /** 创建时间 */
        createTime: string;
        /** 图片URL地址 */
        icon: string;
        /** icon集合 */
        iconList: {
          /** icon跳转地址 */
          iconHref: string;
          /** icon图片地址 */
          iconUrl: string;
        }[];
        /** string */
        id: string;
        /** 中文名称 */
        name_cn: string;
        /** 英文名称 */
        name_en: string;
        /** 上线时间 */
        onlineTime: string;
        /** 上线时间格式化 */
        onlineTimeFormat: string;
        /** 状态 */
        status: string;
        /** 关键字类型 */
        type: string;
      };
    }
    /** 查询配置信息
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/kvdata/findType/{type}
     *  @Method POST
     */
    namespace FindFirstKvIconList {
      type IconSetting = Api.Common.Public.IconSetting;
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<Array<IconSetting>>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 关键字 */
        type: string;
      };
    }
    /** 批量查询配置信息 ***/
    namespace FindKvDataByBacth {
      /** 接口定义 */
      type FuncT = (types: string[]) => MRP<IResponse>;

      /** 返回参数 */
      interface IResponse {
        [prop: string]: {
          /** 商城编码 */
          account: string;
          /** 内容 */
          content: string;
          /** 创建时间 */
          createTime: string;
          /** 图片URL地址 */
          icon: string;
          /** icon集合 */
          iconList: {
            /** icon跳转地址 */
            iconHref: string;
            /** icon图片地址 */
            iconUrl: string;
          }[];
          /** string */
          id: string;
          /** 中文名称 */
          name_cn: string;
          /** 英文名称 */
          name_en: string;
          /** 上线时间 */
          onlineTime: string;
          /** 上线时间格式化 */
          onlineTimeFormat: string;
          /** 状态 */
          status: string;
          /** 关键字类型 */
          type: string;
        };
      }
    }

    /** 查询活动弹窗popUp配置 ***/
    namespace FindPopupList {
      enum PopupType {
        HOME, //首页
        PERSONAL_CENTER, //"个人中心页"
        PRODUCT_DETAILS, //"产品详情页"
        ACTIVITY, //"活动页"
        CARDCOUPON5, //"卡券"
        SHOPINGCART, //"购物车"
        MAINTENANCE, //"维护页"
        REGISTER, //"注册弹窗"
        ADVERTISING, // "广告页"
        PAYMENT, // "支付页"
        MASTERCLASS, //"大师讲堂"
        GIVE_ACTIVITY, // 0.01加赠订阅弹窗
      }

      interface IPopupInfo {
        activityCode: string;
        activityName: string;
        hasWechatPopUp: boolean;
        img: string;
        info: string;
        longPressToSave: boolean;
        manualConfirm: boolean;
        page: string;
        popupType: PopupType;
        show: boolean;
        wechatPopUpClientId: string;
        nextCouponIds?: Array<string>;
      }

      /** 接口定义 */
      type FuncT = (typeList: IRequestBody) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestBody = PopupType[];
      /** 接口定义 */
      type FuncT1 = (codeList: string[]) => MRP<IResponse>;
      /** 返回数据 */
      type IResponse = IPopupInfo[];
    }

    /** 查询单条配置信息
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/kvdata/findFirst/{type}
     *  @Method POST
     */
    namespace FindKvDataFirstByType {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 关键字 */
        type: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 商城编码 */
        account: string;
        /** 内容 */
        content: string;
        /** 创建时间 */
        createTime: string;
        /** 图片URL地址 */
        icon: string;
        /** 图片集合 */
        iconList: {
          /** 图片地址 */
          iconUrl: string;
          /** 图片跳转地址 */
          iconHref: string;
        }[];
        /** string */
        id: string;
        /** 中文名称 */
        name_cn: string;
        /** 英文名称 */
        name_en: string;
        /** 上线时间 */
        onlineTime: string;
        /** 上线时间格式化 */
        onlineTimeFormat: string;
        /** 状态 */
        status: string;
        /** 关键字类型 */
        type: string;
      };
    }
    /** 文件上传地址(CDN)
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/upload_file
     *  @Method UPLOAd
     */
    namespace UploadFile {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 请求参数 Body */
      type IRequestBody = {
        /** 图片临时路径 */
        filePath: string;
      };
    }
    /** 创建太阳码图片
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/wxa
     *  @Method POST
     */
    namespace CreateQrCode {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 请求参数 Body */
      type IRequestBody = {
        /** 扫码进入的小程序页面路径，最大长度 128 字节，不能为空； */
        path: string;
        /** 二维码的宽度，单位 px。最小 280px，最大 1280px */
        width?: number;
        /** 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调 */
        auto_color?: boolean;
        /** auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示 */
        line_color?: boolean;
        /** 是否需要透明底色，为 true 时，生成透明底色的小程序码 */
        is_hyaline?: boolean;
      };
    }
    /** 订阅消息-取消订单
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/message/orderPaidCancelSubscribeMsg/{orderId}
     *  @Method POST
     */
    namespace OrderPaidCancelSubscribeMsg {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<null>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 订单Id */
        orderId: string;
      };
    }
    /** OCPA
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/ocpa/addUserActions
     *  @Method POST
     */
    namespace OCPA {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<null>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 请求参数 Body */
      type IRequestBody = {
        /** 商城编码 */
        account: string;
        /** 动作类型 */
        actionType: string;
        /** ClickId */
        clickId?: string;
        /** 小程序页面地址 */
        url?: string;
        /** 微信用户唯一标识 */
        openId: string;
        /** 页面类型 */
        viewContentType?: string;
      };
    }
    /** 查看客户是否授权和发券模板ID
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/{tenantId}/customer/auth
     *  @Method GET
     */
    namespace CustomerAuth {
      /** 接口定义 */
      type FuncT = (query: IRequestQuery, path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** tenanId */
        tenantId: string;
      };
      /** 请求参数 Query */
      type IRequestQuery = {
        /** 用户Id */
        customerId: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 是否需要授权 */
        authorization: boolean;
        /** 卡券Id */
        couponId: string;
      };
    }
    /** 查看客户是否授权和发券模板ID
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/subsribe/save
     *  @Method POST
     */
    namespace SaveSubscribe {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 请求参数 Body */
      type IRequestBody = {
        groupId?: string;
        id?: string;
        openId?: string;
        page?: string;
        size?: string;
        storeCode?: string;
        /** 模板Code，多模板Code以,隔开 */
        templateCode: string;
      };
    }

    /** 订阅提醒-保存订阅
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/subscribeRemind/save
     *  @Method POST
     */
    namespace SaveSubscribeRemind {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 请求参数 Body */
      type IRequestBody = {
        /** 用户标识 */
        customerId?: string;
        /** 用户小程序唯一标识符 */
        openId?: string;
        /** 模板code */
        templateCode: string;
        subscribeMessage?: {
          /** 活动标题 */
          title?: string;
          /** 活动信息 */
          message?: string;
          /** 暂时用作房间id */
          id?: string;
        };
      };
    }

    /** 订阅提醒-是否订阅过
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/subscribeRemind/isSubscribe
     *  @Method POST
     */
    namespace IsSubscribeRemind {
      /** 接口定义 */
      type FuncT = (data: string[], path?: IRequestPath) => MRP<IResponse[]>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 是否订阅 */
        status: boolean;
        /** 模板Code */
        templateCode: string;
      };
    }

    /** 查询该订单是否是已支付订单
     *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/payment/queryIsPaid/${id}
     *  @Method GET
     */
    namespace queryOrderIsPay {
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestPath = {
        orderId: string;
      };
      /** 返回参数 */
      type IResponse = {};
    }

    /** 获取自定义tabBar
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/navigateBar/{id}
     *  @Method POST
     */
    namespace GetTabBar {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** id */
        id: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 是否订阅 */
        backgroundColour: string;
        /** 唯一id */
        id: string;
        /** 导航配置 */
        navigationSettings: {
          /** 默认图标 */
          defaultIcon: string;
          /** 默认图标 */
          id: string;
          /** 链接 */
          linkUrl: string;
          /** 导航文字 */
          name: string;
          /** 优先级 */
          priority: number;
          /** 选中图标 */
          selectedIcon: string;
        }[];
        /** 选中文字的颜色 */
        selectWordColour: string;
        /** 文字颜色 */
        wordColour: string;
      };
    }

    /** 获取页面通用配置
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/findByTypeAndUseType/{useType}
     *  @Method GET
     */
    namespace GetPageConfig {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse[]>;
      /** 请求参数 Path */
      type IRequestPath = {
        /** 商城编码 */
        storeCode?: string;
        /** 使用类型 */
        useType: string;
      };
      /** 返回参数 */
      type IResponse = {
        /** 内容 */
        content: string;
        /** 创建时间 */
        createTime: string;
        /** 图标URL */
        icon: string;
        /** 图标列表，用途：轮播图、侧边icon  */
        iconList: {
          /** 图片超链接 */
          iconHref: string;
          /** 图片地址 */
          iconUrl: string;
        }[];
        /** Id */
        id: string;
        /** moduleId */
        moduleId: string;
        /** 中文 */
        name_cn: string;
        /** 英文名 */
        name_en: string;
        /** onlineTime  */
        onlineTime: string;
        /** 是否启用 */
        status: string;
        /** 类型 */
        type: string;
        /** 使用类型（目前专属用于区分侧边icon） */
        useType: string;
      };
    }
  }
}
