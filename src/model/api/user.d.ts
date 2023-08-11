declare namespace Api {
  /**
   * 商品接口类型声明
   */
  namespace User {
    /**
     * 商品接口公用声明
     */
    namespace Public {
      /** 会员基础信息 */
      interface ICustomerBasicInfo {
        /** 昵称 */
        nickName: string;
        /** 头像 */
        avatarUrl: string;
        /** 性别 */
        gender: number;
        /** 国家 */
        country: string;
        /** 省份 */
        province: string;
        /** 城市 */
        city: string;
        /** 手机号 */
        mobile: string;
        /** 是否为会员 */
        member: boolean;
        /** 成为潜客 */
        registerTime: string;
        /** 语言 */
        language: string;
        /** 生日 */
        birthDate: string;
        /** 注册页面地址 */
        agreementInfo: string;
        /** 注册页面同意隐私声明时间（和注册时间相同） */
        agreementTime: string;
      }

      /** 解密后获取的用户微信信息 */
      interface IWxUserInfo {
        /** 昵称 */
        nickName: string;
        /** 性别 */
        gender: string;
        /** 语言 */
        language: string;
        /** 城市 */
        city: string;
        /** 省份 */
        province: string;
        /** 国家 */
        country: string;
        /** 头像地址 */
        avatarUrl: string;
      }

      /** 发票信息 */
      interface IInvoiceInfo {
        /** 发票内容（一般填写发票税务编号） */
        content: string;
        /** 接收发票邮箱 */
        email: string;
        /** 发票编号 */
        id: string;
        /** 首选发票 */
        preferred: string;
        /** 发票抬头 */
        title: string;
        /** 发票类型 */
        type: InvoiceType;
      }

      /** 地址信息 */
      interface IAddressInfo {
        /** 唯一标识符 */
        id?: string;
        /** 收件人姓名 */
        addressee: string;
        /** 地址别名 */
        aliasName?: string;
        /** 城市 */
        city: string;
        /** 国家 */
        country?: string;
        /** 详细地址 */
        detail: string;
        /** 区 */
        district: string;
        /** 手机号 */
        mobile: string;
        /** 邮政编码 */
        postcode: string;
        /** 首选地址 */
        preferred?: boolean;
        /** 省份 */
        province: string;
        /** 收件人固话 */
        telephone?: string;
      }

      /** 收藏商品公用返回参数 */
      interface IFavoriteResponse {
        /** 描述信息 */
        description: string;
        /** 商品标识 */
        goodsId: string;
        /** sku标识 */
        id: string;
        /** sku主图 */
        mainImage: string;
        /** 市场价格 */
        marketingPrice: number;
        /** 商品名称 */
        name: string;
        /** 商城价格 */
        price: number;
        /** 是否已售罄，true是告罄 */
        sellOut: boolean;
        /** 分享图片 */
        shareImage: string;
        /** 商品简称 */
        shortName: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品sku销售状态 = ['INIT', 'ON_SALE', 'OFF_SALE'] */
        status: SalesType;
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType;
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

      /** 卡券模板列表信息 */
      interface ICouponTemplateListView {
        /** 是否启用  */
        active: boolean;
        /** 卡券副图 */
        auxiliaryImage: string;
        /** 卡券颜色 */
        color: string;
        /** 卡券描述 */
        description: string;
        /** 启效时间 */
        from: string;
        /** 卡券ID */
        id: string;
        /** 卡券模板LOGO */
        logo: string;
        /** 卡券主图 */
        rule: IRule;
        /** 是否可以分享 */
        sharable: boolean;
        /** 卡券标签 */
        tags: Array<string>;
        /** 卡券模版标题 */
        title: string;
        /** 过期时间 */
        to: string;
        /** 更新时间 */
        updatedTime: string;
        /** 是否可以分享 */
        validDays: number;
        /** 自定义信息数组 */
        extendInfos: Array<IExtendInfo>;
        /**是否是礼品卷 */
        isGift: boolean;
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

      /** 卡券规则 */
      interface IRule {
        /** 卡券规则 */
        actionSettings: Array<IActionSettings>;
        /** 触发类型 */
        actionType: string;
        /** 是否全部使用 */
        allGoods: boolean;
        /** 指定商品列表 */
        goodsList: Array<IGoodsList>;
        /** 指定分组及商品 */
        group: IPromotionGoodsGroup;
        /** 整单最低金额 */
        minAmount: number;
        /** 促销活动范围，整单、单品 */
        scope: string;
      }

      /** 卡券规则设置 */
      interface IActionSettings {
        /** 满减 */
        deduction: number;
        /** 折扣 */
        discount: number;
        /** 是否免邮费 */
        freeShippingPrice: boolean;
        /** 促销活动小样列表 */
        gifts: Array<IPromotionActionGift>;
        /** 最小金额 */
        minAmount: number;
        /** 最小数量 */
        minQuantity: number;
        /**  */
        optionalQuantity: number;
      }

      interface IPromotionGoodsGroup {
        /** 分组全部匹配为true，满足其一为false  */
        allMatch: boolean;
        /** 分组列表 */
        items: Array<IPromotionGoodsGroupItem>;
      }

      /** 指定商品列表 */
      interface IGoodsList {
        /** sku数量  */
        quantity: number;
        /** sku标识  */
        skuId: string;
      }

      /** 卡券模板信息 */
      interface CouponTemplate {
        /** 卡券模板信息 */
        couponTemplate: CouponTemplate;
        /** 卡券PID */
        pid: string;
        /** 卡券标题 */
        title: string;
        /** 发券类型 */
        type: string;
      }

      /** 促销小样列表 */
      interface IPromotionActionGift {
        /** 指定商品列表 */
        quantity: number;
        /** SKUID */
        skuId: string;
      }

      /** 指定商品详情 */
      interface IPromotionGoodsGroupItem {
        /** 指定商品列表 */
        goodsList: boolean;
        /** 最小金额 */
        minAmount: number;
        /** 最小数量 */
        minQuantity: number;
      }

      interface IStatusImage {
        /** 图片地址 */
        image: string;
        /** 对应状态 */
        status: string;
      }

      /** openId,unionId,mobile三选一传 */
      type IDataLakeData = {
        /** 手机号 */
        mobile?: string;
        /** 微信唯一标识 */
        openId?: string;
        /** 微信开发平台唯一标识 */
        unionId?: string;
        /** 页码，1开始 */
        pageNo?: number | string;
        /** 每页条数 */
        limit?: number | string;
        /** 开始时间 */
        startTime?: string;
        /** 结束时间，这个单词大概四后端定义错了，但是将错就错 */
        endTimer?: string;
        /** 区间单位 */
        unit_value?: string;
      };
    }
    /** 查询会员用户基本信息
     *  @URL {basePathUrl}/api/ec-portal/customer/basic_info
     *  @Method GET
     */
    namespace GetCustomerBasicInfo {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      /** 返回参数 */
      interface IResponse {
        /** 收件人姓名 */
        addressee: string;
        /** 地址别名 */
        aliasName: string;
        /** 城市 */
        city: string;
        /** 国家 */
        country: string;
        /** 详细地址 */
        detail: string;
        /** 区 */
        district: boolean;
        /** 手机号 */
        mobile: string;
        /** 邮政编码 */
        postcode: string;
        /** 首选地址 */
        preferred: boolean;
        /** 省份 */
        province: string;
        /** 收件人固话 */
        telephone: string;
        /** 标签 */
        tags: string[];
        /** 扩展字段 */
        customInfos?:
          | {
              name: string;
              value: string;
            }[]
          | null;
      }
    }
    /** 追加客户基本身份信息
     *  @URL {basePathUrl}/api/ec-portal/customer/basic_info/append
     *  @Method POST
     */
    namespace AppendCustomerBasicInfo {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      /** 请求参数 Body */
      interface IRequestBody {
        /** 头像 */
        avatarUrl?: string;
        /** 2020-03-05T12:37:54.184Z */
        birthDate?: string;
        /** 城市 */
        city?: string;
        /** 国家 */
        country?: string;
        /** 性别0、1、2 */
        gender?: number;
        /** 昵称 */
        nickName?: string;
        /** 省份 */
        province?: string;
        /** 姓名 */
        realName?: string;
        /** 标签 */
        tags?: string[];
        /** 扩展字段 */
        customInfos?:
          | {
              name: string;
              value: string;
            }[]
          | null;
      }

      /** 返回参数 */
      interface IResponse {
        /** 隐私协议信息 */
        agreementInfo: string;
        /** 同意隐私协议时间 */
        agreementTime: string;
        /** 头像地址 */
        avatarUrl: string;
        /** 出生日期 */
        birthDate: string;
        /** 城市 */
        city: string;
        /** 国家 */
        country: string;
        /** 性别 */
        gender: number;
        /** 首选语言 */
        language: string;
        /** 锁定原因 */
        lockReason: string;
        /** 第三方会员系统Id , */
        marsId: string;
        /** 是否是会员 */
        member: boolean;
        /** 正式入会时间 */
        memberShipTime: string;
        /** 绑定手机 */
        mobile: string;
        /** 网络昵称 */
        nickName: string;
        /** 省份 */
        province: string;
        /** 真实姓名 */
        realName: string;
        /** 注册时间 */
        registerTime: string;
        /** 客户状态 = ['NORMAL', 'LOCKED', 'CANCEL'] */
        status: UserStatusType;
      }
    }
    /** 潜客成为会员(会员绑定)
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/createMember
     *  @Method POST
     */
    namespace CreateMember {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 活动code */
        activityCode?: string;
        /** 公众号appid */
        appId?: string;
        /** 柜台的美容顾问code */
        baCode?: string;
        /** 柜台code */
        baStoreCode?: string;
        /** 出生日期 */
        birthDate?: string;
        /** 身份证号 */
        certiNo?: string;
        /** 城市 */
        city?: string;
        /** 隐私协议地址 */
        concealUrl: string;
        /** 国家 */
        country?: string;
        /** 客户标识 */
        customerId?: string;
        /** 区/县 */
        district?: string;
        /** 扩展信息 */
        extendsInfo?: {
          /** 推荐人手机号 */
          recommenderMobile?: string;
        };
        /** 是否是助力注册 */
        fissionFlag: boolean;
        /** 性别 */
        gender?: number;
        /** 年级 */
        grade?: string;
        /** 毕业去向 */
        graduationOrientation?: string;
        /** 邀请码 */
        inviteCode?: string;
        /** 专业 */
        major?: string;
        /** 手机号 */
        mobile: string;
        /** 公众号openid */
        openId?: string;
        /** 省份 */
        province?: string;
        /** 真实姓名 */
        realName: string;
        /** 注册渠道 */
        registerChannel: string;
        /** 学校 */
        school?: string;
        /**  */
        shopCode?: string;
        /** 验证码 */
        smsCode?: string;
        /** 助力人的customerId */
        sponsor?: string;
        /** 学号 */
        studentNo?: string;
        /** unionId */
        unionId?: string;
        /** 是否使用验证码 */
        withSmsCode: boolean;
        /** eform柜台信息 */
        customerCounter?: {
          /** 柜台id */
          counterId?: string;
          /** ba的id */
          userId?: string;
          /** 柜台的类型 */
          counterType?: string;
        };
      }

      /** 返回参数 */
      interface IResponse {
        /** 隐私协议信息 */
        agreementInfo: string;
        /** 头像地址 */
        avatarUrl: string;
        /** 购物车商品数量 */
        cartItemNum: number;
        /** 城市 */
        city: string;
        /** 国家 */
        country: string;
        /** 会员基本信息 */
        basicInfo: Public.ICustomerBasicInfo;
        /** 性别 */
        gender: number;
        /** token */
        jwtstring: string;
        /** 首选语言 */
        language: string;
        /** 是否是会员 */
        member: boolean;
        /** 正式入会时间 */
        memberShipTime: string;
        /** 绑定手机 */
        mobile: string;
        /** 网络昵称 */
        nickName: string;
        /** 省份 */
        province: string;
        /** 注册时间 */
        registerTime: string;
        /** 客户状态 = ['NORMAL', 'LOCKED', 'CANCEL'] */
        status: UserStatusType;

        /** 自由属性 */
        [prop: string]: any;
      }
    }
    /** 解密数据获取用户信息
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/decodeUserInfo
     *  @Method POST
     */
    namespace DecodeUserInfo {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 包括敏感数据在内的完整用户信息的加密数据 */
        encryptedData: string;
        /** 加密算法的初始向量 */
        iv: string;
      }
    }
    /** 解密数据获取用户手机信息
     *  @URL {basePathUrl}/api/sp-portal/wechat/{storeCode}/decodeWeChatPhone/true
     *  @Method POST
     */
    namespace DecodePhonenumber {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<string>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        isCreateUser: boolean;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 包括敏感数据在内的完整用户信息的加密数据 */
        encryptedData: string;
        /** 加密算法的初始向量 */
        iv: string;
      }
    }
    namespace GetPhoneNumberByCode {
      /** 接口定义 */
      type FuncT = (code: IRequestPath) => MRP<number>;

      /** 请求参数 Path */
      interface IRequestPath {
        code: string;
      }
    }
    /** 查询用户优惠券(不同状态)
     *  @URL {basePathUrl}/api/ec-portal/customer/coupon/{status}
     *  @Method GET
     */
    namespace GetCustomerCouponByStatus {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<Array<IResponse>>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** expire过期、usable可用、redeem已用 */
        status: CouponStatusType;
      }

      /** 返回参数 */
      interface IResponse {
        /** 起始时间 */
        from: string;
        /** 备用图片 */
        auxiliaryImage: string;
        /** 颜色 */
        color: string;
        /** 描述 */
        description: string;
        /** logo */
        logo: string;
        /** 主要图片 */
        mainImage: string;
        /** 卡券状态图片数组 */
        statusImages: Array<Public.IStatusImage>;
        /** 名称 */
        title: string;
        /** 卡券标识 */
        id: string;
        /** 当前状态 */
        status: string;
        /** 卡券模版 */
        templateId: string;
        /** 截至时间 */
        to: string;
        /** 自定义信息数组 */
        extendInfos: Array<Public.IExtendInfo>;
      }
    }
    /** 查询可领取卡券
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/receiveCoupon/validCoupon
     *  @Method GET
     */
    namespace GetValidCoupon {
      /** 接口定义 */
      type FuncT = (path?: IRequestPath) => MRP<Array<IResponse>>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 返回参数 */
      interface IResponse {
        /** 卡券模板信息  */
        couponTemplate: Public.ICouponTemplateListView;
        /** 卡券PID  */
        pid: string;
        /** 卡券标题  */
        title: string;
        /** 发券类型  */
        type: string;
      }
    }
    /** 根据卡券Id获取卡券信息
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/receiveCoupon/validCoupon/{pid}
     *  @Method GET
     */
    namespace GetCouponInfoById {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 卡券Id */
        pid: string;
      }

      /** 返回参数 */
      interface IResponse {
        /** 卡券模板信息  */
        couponTemplate: Public.ICouponTemplateListView;
        /** 卡券PID  */
        pid: string;
        /** 卡券标题  */
        title: string;
        /** 发券类型  */
        type: string;
      }
    }
    /** 领取卡券
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/receiveCoupon/{id}
     *  @Method POST
     */
    namespace ReceiveCoupon {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<null>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 卡券Id */
        id: string;
      }
    }
    /** 查询客户首选开票信息
     *  @URL {basePathUrl}/api/ec-portal/customer/invoice/preferred
     *  @Method GET
     */
    namespace GetCustomerPreferredInvoice {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      /** 返回参数 */
      interface IResponse extends Public.IInvoiceInfo {}
    }
    /** 修改客户首选开票信息
     *  @URL {basePathUrl}/api/ec-portal/customer/invoice/preferred
     *  @Method PUT
     */
    namespace UpdateCustomerPreferredInvoice {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      /** 请求参数 Body */
      interface IRequestBody {
        /** 单位地址 */
        address?: string;
        /** 银行名称 */
        bank?: string;
        /** 银行账号 */
        bankAccount?: string;
        /** 发票内容（一般填写发票税务编号） */
        content?: string;
        /** 接收发票邮箱 */
        email: string;
        /** 发票抬头 */
        title: string;
        /** 发票类型 */
        type: InvoiceType;
        /** 发票电话 */
        mobile?: string;
        /** 首选发票 */
        preferred?: boolean;
      }

      /** 返回参数 */
      interface IResponse extends Public.IInvoiceInfo {}
    }
    /** 查询客户地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address
     *  @Method GET
     */
    namespace GetCustomerAddress {
      /** 接口定义 */
      type FuncT = () => MRP<Array<IResponse>>;

      /** 返回参数 */
      interface IResponse extends Public.IAddressInfo {}
    }
    /** 添加客户地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address
     *  @Method POST
     */
    namespace AddCustomerAddress {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      /** 请求参数 Body */
      interface IRequestBody extends Public.IAddressInfo {}

      /** 返回参数 */
      interface IResponse extends Public.IAddressInfo {}
    }
    /** 修改客户地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address
     *  @Method PUT
     */
    namespace UpdateCustomerAddress {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      /** 请求参数 Body */
      interface IRequestBody extends Public.IAddressInfo {}

      /** 返回参数 */
      interface IResponse extends Public.IAddressInfo {}
    }
    /** 删除客户地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address
     *  @Method DELETE
     */
    namespace DeleteCustomerAddress {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<null>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 客户地址id */
        id: string;
      }
    }
    /** 查询客户首选地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address/preferred
     *  @Method GET
     */
    namespace GetCustomerPreferredAddress {
      /** 接口定义 */
      type FuncT = () => MRP<IResponse>;

      /** 返回参数 */
      interface IResponse extends Public.IAddressInfo {}
    }
    /** 修改客户首选地址信息
     *  @URL {basePathUrl}/api/ec-portal/customer/address/preferred?_method=PUT
     *  @Method POST
     */
    namespace UpdateCustomerPreferredAddress {
      /** 接口定义 */
      type FuncT = (
        data: IRequestBody,
        query?: IRequestQuery,
      ) => MRP<IResponse>;

      /** 请求参数 Query */
      interface IRequestQuery {
        /** 方法类型 */
        _method: PutType;
      }

      /** 请求参数 Body */
      interface IRequestBody extends Public.IAddressInfo {}

      /** 返回参数 */
      interface IResponse extends Public.IAddressInfo {}
    }
    /** 查询会员收藏列表
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/favorite
     *  @Method POST
     */
    namespace GetCustomerFavorite {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<Array<Public.IFavoriteResponse>>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
    }
    /** 加入收藏夹
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/favorite/{skuId}
     *  @Method POST
     */
    namespace AddCustomerFavorite {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<Array<Public.IFavoriteResponse>>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** skuid */
        skuId: string;
      }
    }
    /** 移出收藏夹
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/favorite/{skuId}?_method=DELETE
     *  @Method POST
     */
    namespace ClearCustomerFavorite {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<Array<Public.IFavoriteResponse>>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** skuid，不是code，是id */
        skuId: string;
      }

      /** 请求参数 Query */
      interface IRequestQuery {
        /** 商城编码 */
        _method: DeleteType;
      }
    }
    /** 会员聚合信息查询
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/dataLake/member/aggregation
     *  @Method POST
     */
    namespace GetDataLakeMemberRights {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 分类 */
        category?: string;
        /** 用户Id */
        customerId?: string;
        /** 手机号 */
        mobile?: string;
        /** 微信唯一标识 */
        openId: string;
        /** 积分类型 */
        pointTypeGroup?: PointTypeGroup;
        /** 查询类型 */
        queryTypeEnum: MemberQueryType;
        /** 微信开发平台唯一标识 */
        unionId?: string;
        /** 值 */
        value?: string;
      }

      /** 返回参数 */
      interface IResponse {
        /** 当前金额 */
        currentAmount: number;
        /** 可用积分 */
        evalidPoints: number;
        /** 当前等级 */
        grade: string;
        /** 等级Code */
        gradeCode: string;
        /** 等级结束时间 */
        gradeEndDate: string;
        /** 等级开始时间 */
        gradeStartDate: string;
        /** 积分类型 */
        pointType: string;
        /** 升级到下一等级需要的金额 */
        requiredAmount: number;
        /** 总的积分 */
        sumPoint: number;
        /** 已用积分 */
        usedPoint: number;

        /** 自由属性 */
        [prop: string]: any;
      }
    }
    /** 会员卡券查询
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/dataLake/member/coupon
     *  @Method POST
     */
    namespace GetMemberCoupon {
      /** 接口定义 */
      type FuncT = (
        data: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** datalake卡券类型 */
      enum DataLakeCouponType {
        "BIRTH_DAY",
        "UPGRADE",
        "DEFAULT",
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** marsId */
        consumerID: string;
        /** 卡券类型 */
        couponTypeEnum: DataLakeCouponType[];
        /** 操作类型，写死  3    */
        transType: string;
      }

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    /** 根据会员等级查询会员卡券查询
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/dataLake/member/grade/coupon
     *  @Method POST
     */
    namespace GetMemberCouponByGrade {
      /** 接口定义 */
      type FuncT = (
        data: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** marsId */
        gradeCode: string;
        /** 卡券类型 */
        couponTypeEnum: string[];
      }

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace UpdateUserInfo {
      /** 接口定义 */
      type FuncT = (
        data: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<null>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 小程序标识 */
        appId: string;
        /** 小程序标识 */
        avatarUrl: string;
        /** 小程序标识 */
        city: string;
        /** 小程序标识 */
        country: string;
        /** 卡券类型 */
        gender: number;
        /** 卡券类型 */
        language: string;
        /** 卡券类型 */
        nickName: string;
        /** 卡券类型 */
        openId: string;
        /** 卡券类型 */
        province: string;
        /** 卡券类型 */
        unionId: string;
      }
    }
    namespace GetDataLakeMemberInfo {
      /** 接口定义 */
      type FuncT = (data?: IRequestBody, path?: IRequestPath) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 会员的管理柜台 */
        adminCounterCode: string;
        /** 生日是否锁定 */
        birthLocked?: boolean;
        /** 生日 */
        birthday?: string;
        /** 会员卡号 */
        cardNo?: string;
        /** 城市 */
        city?: string;
        /** 区/县 */
        district?: string;
        /** 注册时间 */
        memberShipTime?: string;
        /** 手机号 */
        mobile?: string;
        /** 会员名 */
        name?: string;
        /** 省份 */
        province?: string;
        /** 性别 */
        sex?: string;

        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakeLevel {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakePoint {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakePointExpire {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakeDynTags {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakeOrderList {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakePointsDetailList {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakePointsExpireByRange {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetDataLakeOrderDetail {
      /** 接口定义 */
      type FuncT = (
        data: Partial<IRequestBody>,
        path: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单号 */
        tradeNo: string;
      }

      /** 请求参数 Body */
      type IRequestBody = Api.User.Public.IDataLakeData;

      /** 返回参数 */
      interface IResponse {
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    namespace GetCustomerTags {
      /** 接口定义 */
      type FuncT = () => MRP<Array<string>>;
    }

    /** 查询会员最近到期积分
     *  @Method GET
     */
    namespace PointsExpire {
      /** 接口定义 */
      type FuncT = (
        data?: Partial<IRequestBody>,
        path?: IRequestPath,
      ) => MRP<IResponse>;

      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }

      /** 请求参数 Body */
      interface IRequestBody {
        /** 手机号 */
        mobile?: string;
      }

      /** 返回参数 */
      interface IResponse {
        id: any;
        code: string;
        data: any;
        msg: any;
      }
    }

    namespace Get360OrderList {
      /** 接口定义 */
      type FuncT = (unionId: string, params?: IRequestParams) => MRP<IResponse>;

      /** 查询条件 */
      interface IRequestParams {
        /** 查询表达式 */
        expression?: string | undefined;
        /** 排序条件 */
        sort?: string | undefined;
        /** 分页页码，0开始 */
        page?: number | undefined;
        /** 每页数据量 */
        size?: number | undefined;
      }

      /** 接口响应 */
      interface IResponse {
        /** 分页数据 */
        content: {
          /** 购买渠道 */
          buyChannel: string;
          /** 下单时间 */
          createTime: string;
          /** 产品名称 */
          goodsName: string;
          /** 订单id */
          orderId: string;
          /** 数量 */
          quantity: number;
          /** 真实付款数量 */
          realpayAmount: number;
        }[];
        /** 总数据量 */
        totalElements: number;
        /** 总分页数 */
        totalPages: number;

        [prop: string]: any;
      }
    }

    namespace GetAccountUserInfoByUnionId {
      type FunT = (unionId: string, showError?: boolean) => MRP<IResponse>;

      interface IResponse {
        appid: string;
        errcode: number;
        data: {
          city: string;
          country: string;
          ext_info: any;
          groupid: string;
          headimgurl: string;
          id: string;
          nickname: string;
          openid: string;
          province: string;
          remark: string;
          sex: string;
          /** "1"当前已关注 "0"当前未关注 */
          subscribe: "1" | "0";
          /** 关注时间 */
          subscribe_time: string;
          tagid_list: any[];
          touch_time: string;
          unionid: string;
          /** 取消关注时间 */
          unsubscribe_time: string;
        };
      }
    }
  }
}
