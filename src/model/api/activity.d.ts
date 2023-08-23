declare namespace Api {
  /**
   * 接口类型声明
   */
  namespace Activity {
    /** 活动接口公用声明 */
    namespace Public {
      /** 页面配置信息 */
      interface IPageSetting {
        description: string;
        /** 是否自动轮播 */
        autoCarousel: boolean;
        /** 是否自动播放 */
        autoplay: true;
        /** 活动对应的编号 */
        catetoryId: string;
        /** 编号 */
        code: string;
        /** 创建时间 */
        createTime: string;
        /** 描述 */
        desciption: string;
        /** 结束时间 */
        endTime: string;
        /** 页面配置类型（轮播组件、活动组件两种），这也是我们今后拓展的重点对象 */
        groupType: string;
        /** 主键，传了表示修改配置 */
        id: string;
        /** 页面资源url */
        image: string;
        /** 标签组件 */
        labelSetting: ILabelSetting;
        /** 点击之后的跳转地址 */
        linkPage: string;
        /** 组件类型
         * Simple 简单组件
         * SearchView 搜索组件
         * ProductView 产品组件
         * ActivityView 活动组件
         * GroupView 轮播图
         * ActivityPageView 活动页
         * CatetoryView 分类组件
         * ManualInput Label 标签组件
         * */
        pageType: PageType;
        /** 产品组件设置 */
        productSetting: IProductSetting;
        /** 活动对应的code */
        relateActivityCode: string;
        /** 轮播的展示数量 */
        showCount: number;
        /** 是否显示轮播点 */
        showPoint: boolean;
        /** 是否显示标题 */
        showTitle: boolean;
        /** 开始时间 */
        startTime: string;
        /** 子页面配置信息 */
        subPagesDto: Array<IPageSetting>;
        /** 标题 */
        title: string;
        /** 更新时间 */
        updateTime: string;
        /** 页面资源类型 */
        uploadFileType: string;
      }
      /** 标签组件 */
      interface ILabelSetting {
        /** 文字内容 */
        content: string;
        /** 加粗值 */
        crudeSize: number;
        /** 文字格式 */
        format: string;
        /** 字体大小 */
        wordSize: number;
      }
      /** 产品组件设置 */
      interface IProductSetting {
        /** 产品图片价格 */
        picturePrice: string;
        /** 产品图片标题 */
        pictureTitle: string;
        /** 产品ID */
        productId: string;
        /** 产品组件类型 */
        productShowType: string;
        /** SKUID */
        skuId: string;
      }
      /** 付邮试用活动视图 */
      interface IBuyGiftItem {
        [key: string]: any;
        /** 礼品直购活动标识 */
        id: string;
        /** 礼品图片 */
        images: string;
        /** sku的名称 */
        name: string;
        /** 优先级（用于排序） */
        priority: number;
        /** 已售罄 */
        sellOut: boolean;
        /** sku简称 */
        shortName: string;
        /** 礼品sku标识 */
        skuId: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品销售状态 = ['INIT', 'ON_SALE', 'OFF_SALE'] */
        status: SalesType;
      }
      /** 销售规格信息 */
      interface ISpecification {
        /** 销售属性编码 */
        code: string;
        /** 规格图片地址 */
        image: string;
        /** 销售属性值 */
        value: string;
      }
      /** 自定义扩展信息 */
      interface ICustomInfo {
        /** 自定义扩展名称 */
        name: string;
        /** 自定义扩展值 */
        value: string;
      }
      /** 配送信息 */
      interface IDeliverInfo {
        /** 收件人姓名 */
        addressee: string;
        /** 市 */
        city: string;
        /** 详细地址 */
        detail: string;
        /** 区 */
        district: string;
        /** 收件人手机号 */
        mobile: string;
        /** 邮编 */
        postcode: string;
        /** 省 */
        province: string;
        /** 配送方式 = ['express', 'self_pick_up'] 快递or自取 */
        type: DeliverType;
      }
      /** 发票信息 */
      interface IInvoiceInfo {
        /** 发票内容 */
        content: string;
        /** 接收发票邮箱 */
        email: string;
        /** 发票抬头 */
        title: string;
        /** 发票类型 = ['personal', 'company'] */
        type: InvoiceType;
      }
      /** SKU信息 */
      interface ISkuItem {
        /** 商品扩展信息 */
        customInfos?: Array<ICustomInfo>;
        /** sku的数量 */
        quantity: number;
        /** sku标识 */
        skuId: string;
      }
      /** 优惠券详细信息 */
      interface ICouponDetial {
        /** 可用数量 */
        quantity: string;
        /** 选中状态 */
        selected: boolean;
        /** 卡券主题颜色 */
        color: string;
        /** 卡券标识 */
        couponId: string;
        /** 卡券模版标识 */
        couponTemplateId: string;
        /** 卡券模版说明 */
        description: string;
        /** 卡券模版LOGO */
        logo: string;
        /** 主图 */
        mainImage: string;
        /** 卡券模版标题 */
        title: string;
        /** 卡券截至时间 */
        to: string;
      }
      /** 礼品赠送报告信息 */
      interface IGiftsReport {
        /** 补充说明 */
        description: string;
        /** 礼品信息 */
        gifts: Array<IGiftsReport_gifts>;
        /** 活动标识 */
        id: string;
        /** 活动主图 */
        mainImage: string;
        /** 活动名称 */
        name: string;
        /** 是否成功赠送（多个礼品时，直接促销只需要1个赠送成功即算成功） */
        success: boolean;
        /** 活动标题 */
        title: string;
        /** 促销类型 = ['NORMAL', 'COUPON', 'PROMOTION_CODE'] */
        type: PromitionType;
      }
      /** 礼品赠送报告-礼品信息 */
      interface IGiftsReport_gifts {
        /** 变更数量 */
        quantity: number;
        /** sku标识 */
        skuId: string;
        /** 是否成功赠送（礼品库存不足时，可能会赠送失败） */
        success: boolean;
      }
      /** 组合销售商品 */
      interface ICombinedGoods {
        /** 组合销售sku标识列表 */
        combinedSkuList: Array<string>;
        /** 自定义拓展信息 */
        customInfos: Array<Public.ICustomInfo>;
        /** 描述信息 */
        description: string;
        /** 商品标识 */
        goodsId: string;
        /** 唯一标识 */
        id: string;
        /** sku主图 */
        mainImage: string;
        /** 市场价格 */
        marketingPrice: number;
        /** 商品名称 */
        name: string;
        /** 商城价格 */
        price: number;
        /** sku数量 */
        quantity: number;
        /** 分享图片 */
        shareImage: string;
        /** 商品简称 */
        shortName: string;
        /** 销售规格 */
        specifications: Array<Public.ISpecification>;
        /** 商品sku销售状态 = ['INIT', 'ON_SALE', 'OFF_SALE'] */
        status: SalesType;
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType;
      }
      /** 商品信息 */
      interface IGoods {
        /** 描述 */
        description: string;
        /** 商品ID */
        goodsId: string;
        /** 唯一标识，这里是SKUID */
        id: string;
        /** 主图 */
        mainImage: string;
        /** 市场价格 */
        marketingPrice: number;
        /** 名称 */
        name: string;
        /** 价格 */
        price: number;
        /** 数量 */
        quantity: number;
        /** 分享图片 */
        shareImage: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品sku销售状态 */
        status: string;
        /** 商品类型 */
        type: ProductType;
        /** SKU简称 */
        shortName: string;
      }
      /** 礼品信息 */
      interface IGift {
        /** 自定义扩展信息 */
        description: string;
        /** 赠品描述 */
        goodsId: string;
        /** 赠品唯一标识 */
        id: string;
        /** 主图 */
        mainImage: string;
        /** 市场价格 */
        marketingPrice: number;
        /** 名称 */
        name: string;
        /** 价格 */
        price: number;
        /** 数量 */
        quantity: number;
        /**	分享图片 */
        shareImage: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品sku销售状态 */
        status: string;
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType;
        /** 简称 */
        shortName: string;
      }
      /** 自定义属性 */
      interface IExtendInfo {
        /** 属性唯一标示符 */
        code: string;
        /** 属性名称 */
        name: string;
        /** 属性值 */
        value: string;
      }
      /** 用户助力活动信息 */
      interface IUserFissionInfo {
        /** 是否完成助力 */
        complete: boolean;
        /** 助力完成时间 */
        completeTime: string;
        /** 奖励的优惠券 */
        couponAwards: ICouponAwards;
        /** 任务完成需要的人数 */
        expectCount: number;
        /** 活动助力人信息 */
        helpers: Array<IHelper>;
        /** 实际完成人数 */
        realCount: number;
        /** 已解锁的优惠券 */
        activityAwards: Array<any>;
      }
      /** 用户活动弹窗信息 */
      interface IUserPopupInfo {
        /** 用户活动弹窗详细信息 */
        userPopupDetailInfo: Array<IUserPopupDetailInfo>;
      }
      /** 奖励卡券信息 */
      interface ICouponAwards {
        /** 优惠券有效起始日期 */
        from: string;
        /** 优惠券ID  */
        id: string;
        /** 优惠券所属层级  */
        level: string;
        /** 优惠券名称  */
        name: string;
        /** 优惠券有效结束日期 */
        to: string;
        /** 优惠券类型 */
        type: CouponType;
        /** 使用方式 */
        useType: string;
      }
      /** 助力人员信息 */
      interface IHelper {
        /** 头像 */
        avatarUrl: string;
        /** 优惠券 */
        couponAwards?: ICouponAwards;
        /** 发起人Id */
        customerId: string;
        /** 助力时间 */
        fissionTime: string;
        /** 性别 */
        gender: number;
        /** 昵称 */
        nickName: string;
      }
      /** 用户弹窗详细信息 */
      interface IUserPopupDetailInfo {
        nextPopupTime: string;
        /** 弹窗位置 */
        popupPosition: PopupPosition;
        /** 弹窗频率 */
        popupTimer: PopupTimer;
      }
      /** 活动基本信息 */
      interface IActivityBasicInfo {
        /** 活动结束时间  */
        activityEndTime: string;
        /** 活动开始时间  */
        activityStartTime: string;
        /** 活动类型  */
        activityType: ActivityType;
        /** 创建时间  */
        createTime: string;
        /** 活动描述  */
        description: string;
        /** 活动名称  */
        name: string;
        /**  活动简称  */
        shortName: string;
        /** 活动状态  */
        status: ActivityStatus;
        /** 活动标题  */
        title: string;
        /** 修改时间  */
        updateTime: string;
        /** 活动可见结束时间  */
        visibleEndTime: string;
        /** 活动可见开始时间  */
        visibleStartTime: string;
        /** 活动头图列表  */
        headImg: Array<string>;
        /** 活动标题图片  */
        titleImg: Array<string>;
        /** 活动主图列表，裂变活动此项为奖品图列表  */
        activityImg: Array<string>;
        /** 活动规则图  */
        ruleImg: string;
        /** 活动规则按钮图  */
        ruleUnderImg: string;
      }
      /** 活动配置信息 */
      interface IActivityConfigure {
        fissionConfig: any;
        /** 助力配置 */
        fissionConfigure: IFissionConfigure;
        /** 弹窗配置 */
        popupConfigure: IPopupConfigure;
        /** 领券活动配置 */
        collectCouponConfigure: any;
      }
      /** 助力裂变配置 */
      interface IFissionConfigure {
        /** 轮播配置 */
        bannerConfigures: Array<IBannerConfigures>;
        /** 完成助力所需人数 */
        completeFissionPeople: number;
        /** 帮助助力配置 */
        helperFissionConfigure: IHelperFissionConfigure;
        /** 分享配置 */
        shareConfigure: IShareConfigure;
        /** 发起助力配置 */
        sponsorFissionConfigure: ISponsorFissionConfigure;
      }
      /** 弹窗配置 */
      interface IPopupConfigure {
        /** 活动图片  */
        activityImageUrl: string;
        /** 组件关联ID */
        componentAssociateId: string;
        /** 组件关联URL */
        componentAssociateUrl: string;
        /** 组件类型 */
        componentType: ComponentType;
        /** 弹窗详细配置 */
        popupInfoDescriptions: Array<IUserPopupDetailInfo>;
      }
      /** 轮播配置 */
      interface IBannerConfigures {
        filter(arg0: (item: any) => boolean): any;
        /** 图片类型 */
        bannerType: string;
        /** 图片地址 */
        imageUrl: string;
        /** banner名称 */
        name: string;
        /** 图片跳转地址 */
        pageUrl: string;
        /** 位置 */
        position: number;
      }
      /** 帮助助力配置 */
      interface IHelperFissionConfigure {
        /** 是否自动领取 */
        autoAcquire: boolean;
        /** 用户助力频率 */
        helpFrequently: string;
        /** 帮助助力领取奖励配置 */
        helperCouponAwardConfigure: Array<IHelperCouponAwardConfigure>;
        /** 是否会员   */
        member: boolean;
        /** 单个活动可发起助力活动次数  */
        singleAllowHelpTimes: number;
        /** 发起助力者领取奖励配置 */
        sponsorCouponAwardConfigures: Array<ISponsorCouponAwardConfigures>;
        /** 全平台活动可发起助力活动次数 */
        totalAllowHelpTimes: number;
      }
      /** 分享配置 */
      interface IShareConfigure {
        /** 分享跳转链接 */
        forwardUrl: string;
        /** 分享图片  */
        shareImage: string;
        /** 分享标题 */
        title: string;
      }
      /** 发起助力配置 */
      interface ISponsorFissionConfigure {
        /** 是否自动领取 */
        autoAcquire: string;
        /** 是否会员 */
        member: boolean;
        /** 单个活动可发起助力活动次数 */
        singleAllowSponsorTimes: number;
        /** 发起助力者领取奖励配置 */
        sponsorCouponAwardConfigures: Array<ISponsorCouponAwardConfigures>;
        /** 单个活动可发起助力活动次数 */
        totalAllowSponsorTimes: number;
      }
      /** 帮助助力领取奖励配置 */
      interface IHelperCouponAwardConfigure {
        /** 允许领取奖励个数 */
        allowAcquireCouponAwardNumber: number;
        /** 允许领取奖励次数 */
        allowAcquireCouponAwardTimes: number;
        /** 奖励卡券信息 */
        couponAwards: Array<ICouponAwards>;
        /** 配置描述 */
        description: string;
        /** 结束累计参与人数范围  */
        endTotalNumber: number;
        /** 奖励所属层次 */
        level: number;
        /** 奖励领取时机 */
        rewardTimes: Array<string>;
        /** 起始累计参与人数范围 */
        startTotalNumber: number;
      }
      /** 发起助力者领取奖励配置 */
      interface ISponsorCouponAwardConfigures {
        showDialog: boolean;
        /** 允许领取奖励个数  */
        allowAcquireCouponAwardNumber: number;
        /** 允许领取奖励次数 */
        allowAcquireCouponAwardTimes: number;
        /** 奖励卡券信息 */
        couponAwards: Array<ICouponAwards>;
        /** 配置描述 */
        description: string;
        /** 结束累计参与人数范围  */
        endTotalNumber: number;
        /** 自定义信息 */
        extendInfos: Array<IExtendInfo>;
        /** 抽奖奖励  */
        fissionLuckDrawAwards: Array<IFissionLuckDrawAward>;
        /** 奖励所属层次 */
        level: number;
        /** 奖励领取时机 */
        rewardTimes: Array<string>;
        /** 起始累计参与人数范围 */
        startTotalNumber: number;
      }
      /** 抽奖奖励 */
      interface IFissionLuckDrawAward {
        /** 抽奖活动Code */
        luckDrawActivityCode: string;
        /** 抽奖活动ID  */
        luckDrawActivityId: string;
        /** 抽奖活动标题 */
        luckDrawActivityTitle: string;
      }
    }
    /** 查询首页配置
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/config/pageSettingV3/findByCodeValid/{code}
     *  @Method GET
     */
    namespace GetPageSetting {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 页面编码，首页是FirstPage */
        code: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IPageSetting {}
    }
    /** 检查活动(弹窗活动)
     *  @URL {basePathUrl}/api/sp-portal/activity/{storeCode}/dayCheck?popType={popType}
     *  @Method POST
     */
    namespace DayCheckByPopType {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 页面类型 */
        popType: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 图片路径 */
        img: string;
        /** 跳转页面（本身不跳，只是给前端提示） */
        page: string;
        /** 弹窗活动的类型（首页、个人中心页、产品详情、活动页、维护页） */
        popupType: string;
        /** 是否展示（弹窗图） */
        show: boolean;
        /** 活动Code */
        activityCode?: string;
        /** 详细信息 */
        info?: string;
      }
    }
    /** 更新弹窗活动
     *  @URL {basePathUrl}/api/sp-portal/activity/{storeCode}/dayCheck/confirm/{activtyCode}
     *  @Method POST
     */
    namespace ConfirmDayCheck {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<null>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 活动code */
        activtyCode: string;
      }
    }
    /** 获取付邮试用活动页数据
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/buy_gift/activity?activityId={activityId}
     *  @Method GET
     */
    namespace GetBuyGiftData {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode: string;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 付邮试用活动ID */
        activityId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 图片路径 */
        id: string;
        /** 条目视图列表 */
        groups: Array<groupsItem>;
      }
      interface groupsItem {
        /** 商品条目 */
        items: Array<Public.IBuyGiftItem>;
        /** 运费（礼品直购订单支付金额） */
        shippingPrice: string;
        /** 活动图片路径 */
        imgUrl: string;
        /** 每单最大购买数量  */
        maxQuantity: number;
        /**赠送优惠券 */
        sendCouponId: string;
        /** 标题 */
        title: string;
        /**id */
        id: string;
        /**自定义字段 */
        customInfos: Array<{
          name: string;
          value: string;
        }>;
        selectedItems: any;
      }
    }
    /** 付邮试用-发起购买
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/buy_gift/locate
     *  @Method POST
     */
    namespace LocateBuyGift {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 付邮试用活动模板标识 */
        buyGiftActivityGroupId: string;
        /** 礼品直购活动标识 */
        buyGiftActivityId: string;
        /** 渠道标识(小程序、公众号、PC、线下门店) = ['wm', 'wa', 'pc', 'store'] */
        channelId: string;
        /** 订单扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo?: Public.IDeliverInfo;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** sku列表 */
        items: Array<Public.ISkuItem>;
      }
      /** 返回参数 */
      interface IResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 优惠券 */
        coupons: Array<Public.ICouponDetial>;
        /** 赠品列表 */
        gifts: Array<Public.ICombinedGoods>;
        /** 礼品赠送报告列表 */
        giftsReportList: Array<Public.IGiftsReport>;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 促销码是否无效 */
        promotionCodeInvalid: boolean;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 整单优惠扣除合计金额(原始订单合计金额 + 礼品金额 + 原始订单运费 - 实际支付合计金额 - 实际支付运费) , */
        totalBenefitAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
      }
    }
    /** 付邮试用-提交购买
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/buy_gift/submit
     *  @Method POST
     */
    namespace SubmitBuyGift {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 付邮试用分组ID */
        buyGiftActivityGroupId: string;
        /** 礼品直购活动标识 */
        buyGiftActivityId: string;
        /** 渠道标识(小程序、公众号、PC、线下门店) = ['wm', 'wa', 'pc', 'store'] */
        channelId: string;
        /** 订单扩展信息 */
        customInfos: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 发票信息 */
        invoiceInfo: Public.IInvoiceInfo;
        /** sku列表 */
        items: Array<Public.ISkuItem>;
      }
      /** 返回参数 */
      interface IResponse {
        /** 订单的创建时间 */
        createTime: string;
        /** 订单ID */
        orderId: string;
        /** 商品数组 */
        goods: Array<Public.IGoods>;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 配送信息 */
        deliverInfo?: Public.IDeliverInfo;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 整单优惠扣除合计金额(原始订单合计金额 + 礼品金额 + 原始订单运费 - 实际支付合计金额 - 实际支付运费) , */
        totalBenefitAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
      }
    }
    /**抽奖活动详情
     *  @URL /api/sp-portal/activity/luckdraw/{storeCode}/code
     *  @Method get
     */
    namespace luckDrawDetail {
      /** 接口定义 */
      type FuncT = (body: IRequestBody) => MRP<any>;
      /** 请求参数 Body */
      interface IRequestBody {
        code: string;
      }
      /** 返回参数 */
      interface IResponse {
        activityCode: string;
        activityEndTime: string;
        activityStartTime: string;
        code: string;
        status: number;
        [propName: string]: any;
      }
    }
    /**开始抽奖
     *  @URL /api/sp-portal/activity/luckdraw/{storeCode}/start
     *  @Method get
     */
    namespace luckDrawStart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<any>;
      /** 请求参数 Body */
      interface IRequestBody {
        customerId: string;
        activityLuckDrawId: string;
      }
      /** 返回参数 */
      interface IResponse {}
    }
    /**获取抽奖剩余次数
     *  @URL /sp-portal/activity/luckdraw/${config.storeCode}/surplus/times
     *  @Method get
     */
    namespace luckDrawSurplusTimes {
      /** 接口定义 */
      type FuncT = (body: IRequestBody) => MRP<any>;
      /** 请求参数 Body */
      interface IRequestBody {
        customerId?: string;
        activityLuckDrawId: string;
      }
      /** 返回参数 */
      interface IResponse {}
    }
    /**查询心愿单活动
     *  @URL /ec-portal/store/${config.storeCode}/wish_list/activity?activityId=
     *  @Method get
     */
    namespace getWishList {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<any>;
      /** 请求参数 Body */
      interface IRequestBody {
        activityId: string;
      }
      /** 返回参数 */
      interface IResponse {}
    }
    /** 助力活动-查询用户助力活动
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/v3/activity/findUserActivity
     *  @Method GET
     */
    namespace FindUserHelp {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      interface IRequestQuery {
        /** 活动编号 */
        activityCode: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 活动编号  */
        activityCode: string;
        /** 活动类型 */
        activityType: ActivityType;
        /** 创建时间 */
        createTime: string;
        /** 发起人 */
        customerId: string;
        /** 自定义信息 */
        extendInfos: Array<Public.IExtendInfo>;
        /** 活动id */
        id: string;
        /** 修改时间 */
        updateTime: string;
        /** 用户助力活动信息 */
        userFissionInfo: Public.IUserFissionInfo;
        /** 用户活动弹窗信息 */
        userPopupInfo: Public.IUserPopupInfo;
      }
    }
    /** 助力活动-发起助力
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/v3/activity/initiateFission
     *  @Method POST
     */
    namespace InitiateFission {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      interface IRequestQuery {
        /** 活动编号 */
        activityCode: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 活动编号  */
        activityCode: string;
        /** 活动类型 */
        activityType: ActivityType;
        /** 创建时间 */
        createTime: string;
        /** 发起人 */
        customerId: string;
        /** 自定义信息 */
        extendInfos: Array<Public.IExtendInfo>;
        /** 活动id */
        id: string;
        /** 修改时间 */
        updateTime: string;
        /** 用户助力活动信息 */
        userFissionInfo: Public.IUserFissionInfo;
        /** 用户活动弹窗信息 */
        userPopupInfo: Public.IUserPopupInfo;
        /** 用户优惠券信息 */
        userCouponInfo: Array<any>;
        /** 用户活动code */
        code: string;
        /** 用户正解锁奖品,用于弹窗 */
        currentActivityAward: any;
      }
    }
    /** 助力活动-助力
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/v3/activity/userHelp
     *  @Method POST
     */
    namespace UserHelp {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 发起人的customerId */
        sponsor: string;
        /** 活动编号 */
        activityCode: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 活动编号  */
        activityCode: string;
        /** 活动类型 */
        activityType: ActivityType;
        /** 创建时间 */
        createTime: string;
        /** 发起人 */
        customerId: string;
        /** 自定义信息 */
        extendInfos: Array<Public.IExtendInfo>;
        /** 活动id */
        id: string;
        /** 修改时间 */
        updateTime: string;
        /** 用户助力活动信息 */
        userFissionInfo: Public.IUserFissionInfo;
        /** 用户活动弹窗信息 */
        userPopupInfo: Public.IUserPopupInfo;
        /** 自定义属性 */
        [prop: string]: any;
      }
    }
    /** 助力活动-助力历史记录
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/v3/activity/userHelpHistory
     *  @Method POST
     */
    namespace UserHelpHistory {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse[]>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 发起人的customerId */
        sponsor?: string;
        /** 活动编号 */
        activityCode: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 活动编号 */
        activityCode: string;
        /** 发起人 */
        sponsor: string;
      }
    }
    /** 助力活动-获取活动对象
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/v3/activity/findActivity
     *  @Method GET
     */
    namespace FindActivity {
      /** 接口定义 */
      type FuncT = (
        query: IRequestQuery,
        path?: IRequestPath,
      ) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 活动编号 */
        activityCode: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 活动编号  */
        code: string;
        /** 活动基本信息 */
        activityBasicInfo: Public.IActivityBasicInfo;
        /** 活动配置信息 */
        activityConfigure: Public.IActivityConfigure;
      }
    }

    /**获取抽奖奖品
     *  @URL api/sp-portal/activity/luckdraw/${config.storeCode}/award/account
     *  @Method get
     */
    namespace luckDrawAccount {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<any>;
      /** 请求参数 Body */
      interface IRequestBody {
        customerId: string;
        activityLuckDrawId: string;
        expression: string;
      }
      /** 返回参数 */
      interface IResponse {}
    }
    /** 自定义属性 */
    interface IExtendInfo {
      /** 属性唯一标示符 */
      code: string;
      /** 属性名称 */
      name: string;
      /** 属性值 */
      value: string;
    }
    /** 用户助力活动信息 */
    interface IUserFissionInfo {
      /** 是否完成助力 */
      complete: boolean;
      /** 助力完成时间 */
      completeTime: string;
      /** 奖励的优惠券 */
      couponAwards: ICouponAwards;
      /** 任务完成需要的人数 */
      expectCount: number;
      /** 活动助力人信息 */
      helpers: Array<IHelper>;
      /** 实际完成人数 */
      realCount: number;
    }
    /** 用户活动弹窗信息 */
    interface IUserPopupInfo {
      /** 用户活动弹窗详细信息 */
      userPopupDetailInfo: Array<IUserPopupDetailInfo>;
    }
    /** 奖励卡券信息 */
    interface ICouponAwards {
      /** 优惠券有效起始日期 */
      from: string;
      /** 优惠券ID  */
      id: string;
      /** 优惠券所属层级  */
      level: string;
      /** 优惠券名称  */
      name: string;
      /** 优惠券有效结束日期 */
      to: string;
      /** 优惠券类型 */
      type: CouponType;
      /** 使用方式 */
      useType: string;
    }
    /** 助力人员信息 */
    interface IHelper {
      /** 头像 */
      avatarUrl: string;
      /** 优惠券 */
      couponAwards: ICouponAwards;
      /** 发起人Id */
      customerId: string;
      /** 助力时间 */
      fissionTime: string;
      /** 性别 */
      gender: number;
      /** 昵称 */
      nickName: string;
    }
    /** 用户弹窗详细信息 */
    interface IUserPopupDetailInfo {
      nextPopupTime: string;
      /** 弹窗位置 */
      popupPosition: PopupPosition;
      /** 弹窗频率 */
      popupTimer: PopupTimer;
    }
    /** 活动基本信息 */
    interface IActivityBasicInfo {
      /** 活动结束时间  */
      activityEndTime: string;
      /** 活动开始时间  */
      activityStartTime: string;
      /** 活动类型  */
      activityType: ActivityType;
      /** 创建时间  */
      createTime: string;
      /** 活动描述  */
      description: string;
      /** 活动名称  */
      name: string;
      /**  活动简称  */
      shortName: string;
      /** 活动状态  */
      status: ActivityStatus;
      /** 活动标题  */
      title: string;
      /** 修改时间  */
      updateTime: string;
      /** 活动可见结束时间  */
      visibleEndTime: string;
      /** 活动可见开始时间  */
      visibleStartTime: string;
    }
    /** 活动配置信息 */
    interface IActivityConfigure {
      /** 助力配置 */
      fissionConfigure: IFissionConfigure;
      /** 弹窗配置 */
      popupConfigure: IPopupConfigure;
    }
    /** 助力裂变配置 */
    interface IFissionConfigure {
      /** 轮播配置 */
      bannerConfigures: IBannerConfigures;
      /** 完成助力所需人数 */
      completeFissionPeople: number;
      /** 帮助助力配置 */
      helperFissionConfigure: IHelperFissionConfigure;
      /** 分享配置 */
      shareConfigure: IShareConfigure;
      /** 发起助力配置 */
      sponsorFissionConfigure: ISponsorFissionConfigure;
    }
    /** 用户弹窗详细信息 */
    interface IUserPopupDetailInfo {
      nextPopupTime: string;
      /** 弹窗位置 */
      popupPosition: PopupPosition;
      /** 弹窗频率 */
      popupTimer: PopupTimer;
    }
    /** 活动基本信息 */
    interface IActivityBasicInfo {
      /** 活动结束时间  */
      activityEndTime: string;
      /** 活动开始时间  */
      activityStartTime: string;
      /** 活动类型  */
      activityType: ActivityType;
      /** 创建时间  */
      createTime: string;
      /** 活动描述  */
      description: string;
      /** 活动名称  */
      name: string;
      /**  活动简称  */
      shortName: string;
      /** 活动状态  */
      status: ActivityStatus;
      /** 活动标题  */
      title: string;
      /** 修改时间  */
      updateTime: string;
      /** 活动可见结束时间  */
      visibleEndTime: string;
      /** 活动可见开始时间  */
      visibleStartTime: string;
    }
    /** 活动配置信息 */
    interface IActivityConfigure {
      /** 助力配置 */
      fissionConfigure: IFissionConfigure;
      /** 弹窗配置 */
      popupConfigure: IPopupConfigure;
    }
    /** 助力裂变配置 */
    interface IFissionConfigure {
      /** 轮播配置 */
      bannerConfigures: IBannerConfigures;
      /** 完成助力所需人数 */
      completeFissionPeople: number;
      /** 帮助助力配置 */
      helperFissionConfigure: IHelperFissionConfigure;
      /** 分享配置 */
      shareConfigure: IShareConfigure;
      /** 发起助力配置 */
      sponsorFissionConfigure: ISponsorFissionConfigure;
    }
    /** 弹窗配置 */
    interface IPopupConfigure {
      /** 活动图片  */
      activityImageUrl: string;
      /** 组件关联ID */
      componentAssociateId: string;
      /** 组件关联URL */
      componentAssociateUrl: string;
      /** 组件类型 */
      componentType: ComponentType;
      /** 弹窗详细配置 */
      popupInfoDescriptions: Array<IUserPopupDetailInfo>;
    }
    /** 轮播配置 */
    interface IBannerConfigures {
      filter(arg0: (item: any) => boolean): any;
      /** 图片类型 */
      bannerType: string;
      /** 图片地址 */
      imageUrl: string;
      /** banner名称 */
      name: string;
      /** 图片跳转地址 */
      pageUrl: string;
      /** 位置 */
      position: string;
    }
    /** 帮助助力配置 */
    interface IHelperFissionConfigure {
      /** 是否自动领取 */
      autoAcquire: boolean;
      /** 用户助力频率 */
      helpFrequently: string;
      /** 帮助助力领取奖励配置 */
      helperCouponAwardConfigure: Array<IHelperCouponAwardConfigure>;
      /** 是否会员   */
      member: boolean;
      /** 单个活动可发起助力活动次数  */
      singleAllowHelpTimes: number;
      /** 发起助力者领取奖励配置 */
      sponsorCouponAwardConfigures: Array<ISponsorCouponAwardConfigures>;
      /** 全平台活动可发起助力活动次数 */
      totalAllowHelpTimes: number;
    }
    /** 分享配置 */
    interface IShareConfigure {
      /** 分享跳转链接 */
      forwardUrl: string;
      /** 分享图片  */
      shareImage: string;
      /** 分享标题 */
      title: string;
    }
    /** 发起助力配置 */
    interface ISponsorFissionConfigure {
      /** 是否自动领取 */
      autoAcquire: string;
      /** 是否会员 */
      member: boolean;
      /** 单个活动可发起助力活动次数 */
      singleAllowSponsorTimes: number;
      /** 发起助力者领取奖励配置 */
      sponsorCouponAwardConfigures: Array<ISponsorCouponAwardConfigures>;
      /** 单个活动可发起助力活动次数 */
      totalAllowSponsorTimes: number;
    }
    /** 帮助助力领取奖励配置 */
    interface IHelperCouponAwardConfigure {
      /** 允许领取奖励个数 */
      allowAcquireCouponAwardNumber: number;
      /** 允许领取奖励次数 */
      allowAcquireCouponAwardTimes: number;
      /** 奖励卡券信息 */
      couponAwards: Array<ICouponAwards>;
      /** 配置描述 */
      description: string;
      /** 结束累计参与人数范围  */
      endTotalNumber: number;
      /** 奖励所属层次 */
      level: number;
      /** 奖励领取时机 */
      rewardTimes: Array<string>;
      /** 起始累计参与人数范围 */
      startTotalNumber: number;
    }
    /** 发起助力者领取奖励配置 */
    interface ISponsorCouponAwardConfigures {
      showDialog: boolean;
      /** 允许领取奖励个数  */
      allowAcquireCouponAwardNumber: number;
      /** 允许领取奖励次数 */
      allowAcquireCouponAwardTimes: number;
      /** 奖励卡券信息 */
      couponAwards: Array<ICouponAwards>;
      /** 配置描述 */
      description: string;
      /** 结束累计参与人数范围  */
      endTotalNumber: number;
      /** 自定义信息 */
      extendInfos: Array<IExtendInfo>;
      /** 抽奖奖励  */
      fissionLuckDrawAwards: Array<IFissionLuckDrawAward>;
      /** 奖励所属层次 */
      level: number;
      /** 奖励领取时机 */
      rewardTimes: Array<string>;
      /** 起始累计参与人数范围 */
      startTotalNumber: number;
    }
    /** 抽奖奖励 */
    interface IFissionLuckDrawAward {
      /** 抽奖活动Code */
      luckDrawActivityCode: string;
      /** 抽奖活动ID  */
      luckDrawActivityId: string;
      /** 抽奖活动标题 */
      luckDrawActivityTitle: string;
    }

    namespace ReportBehavior {
      /** 接口定义 */
      type FuncT = (data?: Partial<IRequestBody>) => MRP<IResponse>;

      /** 请求体 */
      interface IRequestBody {
        /** 活动id，活动可能有多个，尽量传 */
        activityId?: string;
        /** 渠道id */
        channelId?: string;
        /** 扩展信息 */
        customInfos?: Array<ICustomInfo>;
        /** 是否无效 */
        inValid?: boolean;
        /** 行为关键字，与后台标签纸字段一致 */
        key?: string;
        /** 耗时 */
        took?: number;
        /** 行为类型，与后台定义的一致 */
        type: string;
      }

      type ICustomInfo = {
        name: string;
        value: string;
      };

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
  }
}
