declare namespace Api {
  /**
   * 购物车接口类型声明
   */
  namespace Cart {
    /**
     * 购物车接口公用声明
     */
    namespace Public {
      /** 购物车接口通用Response */
      interface ICartResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 优惠券列表 */
        coupons: Array<ICouponDetial>;
        /** 礼品列表 */
        gifts: Array<IGift>;
        /** 商品列表 */
        goods: Array<IGoods>;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 促销码 */
        promotionCode: string;
        /** 促销码是否无效 */
        promotionCodeInvalid: boolean;
        /** 促销码无效的原因 */
        promotionCodeInvalidReason: string;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 整单优惠扣除合计金额(原始订单合计金额 + 礼品金额 + 原始订单运费 - 实际支付合计金额 - 实际支付运费) , */
        totalBenefitAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 礼品赠送报告列表 */
        giftsReportList: Array<IGiftsReport>;
        /** 可用积分 */
        usablePoints: number;
        /** 客户最终实付积分（含运费） */
        totalRealPayPoints: number;
        /** 积分抵扣金额  */
        totalPointsToAmount: number;
        /** 当前积分抵现活动是开启 */
        allowPointsPay: boolean;
        /** 购物车单品最大数量 */
        cartMaxQuantity: number;
        /** 满赠礼包基础信息 */
        giftPackages: {
          /** Banner图 */
          imageUrl: string;
          /** 对应档位数据 */
          number: string;
          /** 促销活动Id */
          promotionId: string;
          /** 是否显示 */
          showAble: true;
          promotionDescription: string;
          promotionTitle: string;
          totalAmount: number;
          gifts: any[];
        }[];
        /** 自由属性 */
        [prop: string]: any;
        /** 赠品小样总价 */
        giftTotalPrice: any;
      }
      /** 优惠券信息 */
      interface ICoupon {
        /** 优惠券标识 */
        id: string;
        /** 优惠券模板标识 */
        templateId?: string;
        /** 过期时间 */
        to?: string;
      }
      /** 优惠券详细信息 */
      interface ICouponDetial {
        [prop: string]: any;
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
      /** 礼品信息 */
      interface IGift {
        goodsName: string;
        /** 自定义扩展信息 */
        customInfos: Array<ICustomInfo>;
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
        /** 小样金额 */
        costPrice?: number;
        /** 选中状态 */
        selected: boolean;
        /**	分享图片 */
        shareImage: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品sku销售状态 */
        status: string;
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType;
        /** 是否告罄 */
        sellOut: boolean;
        /** 购物车条目标识 */
        cartItemId: string;
        /** 简称 */
        shortName: string;
        /**礼品标签 */
        label: string;
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
      /** 商品信息 */
      interface IGoods {
        goodsCategoryName: any;
        actualAmount: any;
        /** 商品code */
        code: string;
        /** 自定义扩展信息 */
        customInfos: Array<ICustomInfo>;
        /** 描述 */
        description: string;
        /** 商品ID */
        goodsId: string;
        /** 商品Code */
        goodsCode: string;
        /** 商品名称 */
        goodsName: string;
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
        /** 选中状态 */
        selected: boolean;
        /** 分享图片 */
        shareImage: string;
        /** 销售规格 */
        specifications: Array<ISpecification>;
        /** 商品sku销售状态 */
        status: string;
        /** 商品类型 */
        type: ProductType;
        /** 是否告罄 */
        sellOut: boolean;
        /** SKU简称 */
        shortName: string;
        /** 购物车条目标识 */
        cartItemId: string;
      }
      /** 礼品赠送报告信息 */
      interface IGiftsReport {
        /** 补充说明 */
        description: string;
        /** 礼品信息 */
        gifts: Array<IGiftsReport_gifts>;
        /**
         *  SINGLE-单品赠，OVERALL-全场满赠，OTHER-其他活动赠品
         */
        giftType: "OTHER" | "SINGLE" | "OVERALL";
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
        goodsGifts?: any;
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
        /** 配送方式 = ['express', 'self_pick_up'] */
        type?: DeliverType;
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
      /** 自定义积分 */
      interface ICustomPointsPayPlan {
        /** 实际金额 */
        actualAmount?: number;
        /** 兑换积分 */
        redeemPoints?: number;
        /** 是否使用积分 */
        usePoints?: boolean;
        /** 不校验可用积分 */
        notValidateUsablePoints: boolean;
      }
    }
    /** 查询购物车详情
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/locate
     *  @Method POST
     */
    namespace GetCart {
      /** 接口定义 */
      type FuncT = (data?: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 促销码 */
        promotionCode?: string;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
        /** 自定义使用积分 */
        customPointsPayPlan?: Public.ICustomPointsPayPlan;
      }
      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }
    /** 更新购物车数据
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/update
     *  @Method POST
     */
    namespace UpdateCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 促销码 */
        promotionCode?: string;
        /** 变更数量 */
        quantity: number;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
        /** 选中状态 */
        selected: boolean;
        /** 购物车条目标识 */
        cartItemId: string;
        /** 新的SkuId */
        skuId?: string;
        /** 自定义积分支付方案 */
        customPointsPayPlan?: {
          /** 实付金额 */
          actualAmount?: number;
          /** 实付积分 */
          redeemPoints?: number;
          /** 是否使用积分 */
          usePoints?: boolean;
        };
      }
      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }
    /** 商品添加到购物车
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/append
     *  @Method POST
     */
    namespace AppendCart {
      /**
       * 接口定义
       * config: AxiosRequestConfig
       * */
      type FuncT = (data: IRequestBody, config?: any) => MRP<IResponse>;
      /** 请求参数 Body */
      interface IRequestBody {
        // 是否积分兑礼
        integral?: boolean;
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 商品数量 */
        quantity: number;
        /** sku标识 */
        skuId: string;
        /** 组合销售sku标识列表 */
        combinedSkuList?: Array<string>;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
        customPointsPayPlan: Public.ICustomPointsPayPlan;
      }
      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }
    /** 切换购物车全选状态
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/select
     *  @Method POST
     */
    namespace SelectAllCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 促销码 */
        promotionCode?: string;
        /** 是否全选 */
        selected: boolean;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
      }
      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }

    /** 切换某一个购物车状态
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/selectOne/{skuId}
     *  @Method POST
     */
    namespace SelectOne {
      /** 接口定义 */
      type FuncT = (skuId: string) => MRP<IResponse>;

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }

    /** 清空购物车(购物车删除商品)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/remove
     *  @Method POST
     */
    namespace RemoveCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 是否全选,如果true,下面的skuidList不用填 */
        removeAll?: boolean;
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 促销码 */
        promotionCode?: string;
        /** 商品的SKU列表(非全选状态下，该必填) */
        skuIdList?: Array<string>;
        /** 购物车条目标识列表 */
        cartItemIdList?: Array<string>;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
      }
      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {}
    }
    /** 从购物车途径，点击提交订单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/cart/submit
     *  @Method POST
     */
    namespace SubmitCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 渠道标识(公众号、小程序、PC、线下门店) = ['wm', 'wa', 'pc', 'store'] */
        channelId: ChannelType;
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** 促销码 */
        promotionCode?: string;
        /** 是否使用优惠券 */
        useCoupon: boolean;
        /** 是否礼赠订单 */
        giveGift?: boolean;
        /** 自定义使用积分 */
        customPointsPayPlan?: Public.ICustomPointsPayPlan;
        /** 支付信息 */
        paymentInfo?: Partial<{
          /** 关联消息标识，用于微信或其它渠道发送相关通知信息 */
          contextMessageId: string;
          /** 代付标识 */
          instead: boolean;
          /** 支付金额 */
          payAmount: number;
          /** 支付渠道 */
          payChannel: string;
          /** 支付流水号 */
          paySerialld: string;
          /** 支付时间 */
          payTime: string;
          /** 支付方式 */
          payType: string;
          /** 支付人标识 */
          payerId: string;
          /** 微信交易订单编号 */
          targetOrderId: string;
        }>;
      }
      /** 返回参数 */
      interface IResponse {
        orderId: string;
        /** 礼品列表 */
        gifts: Array<Public.IGift>;
        /** 商品列表 */
        goods: Array<Public.IGoods>;
        /** 组合销售商品 */
        combinedGoods: Array<string>;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 可用积分 */
        usablePoints: number;
        /** 客户最终实付积分（含运费） */
        totalRealPayPoints: number;
        /** 积分抵扣金额  */
        totalPointsToAmount: number;
        /** 当前积分抵现活动是开启 */
        allowPointsPay: boolean;
        /** 是否使用了优惠券 */
        couponUsed: boolean;
        /** 优惠券名称*/
        couponName: string;
        /** 优惠券类型*/
        couponType: string;
        /** 优惠券金额*/
        couponAmount: number;
        /** 下单时间*/
        createTime: string;
        /** 订单类型*/
        orderTypeName: string;
      }
    }
  }
}
