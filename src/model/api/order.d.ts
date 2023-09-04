declare namespace Api {
  /**
   * 订单接口类型声明
   */
  namespace Order {
    /**
     * 订单接口公用声明
     */
    namespace Public {
      /** 审核中 | 申请通过 | 卖家确认收货 | 退货成功 | 退货失败 */
      type IRefundStatus =
        | "WAIT_SELLER_AGREE"
        | "WAIT_BUYER_RETURN_GOODS"
        | "WAIT_SELLER_CONFIRM_GOODS"
        | "SUCCESS"
        | "SELLER_REFUSE_BUYER";
      /** 退单通用Reponse */
      interface IRefundOrderResponse {
        /** 退款申请是否在审核通过后，才可以填写物流信息 */
        auditBeforeExpress: boolean;
        /** 	审核结果说明 */
        auditReason: string;
        /** 到期时间(用于做超时退单) */
        closeTime: string;
        /** 退单申请时间 */
        createTime: string;
        /** 退货快递公司 */
        expressCompany: string;
        /** 退货快递单号 */
        expressNumber: string;
        /** 退单标识（当订单没有进行中退单时，该字段为null值。）  */
        id: string;
        /** 上传的图片 */
        imageUrls: Array<string>;
        /** 退货原因 */
        reason: string;
        /** 是否已收货 */
        received: boolean;
        /** 退单状态编码 */
        refundStatus: Public.IRefundStatus;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 退货说明 */
        remark: string;
        /** 退单寄回信息 */
        returnInfo: Public.IReturnInfo;
        /** 关联订单信息（用于展示） */
        sourceOrder: Public.ISourceOrder;
        /** 退单更新时间 */
        updatedTime: string;
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
        type?: DeliverType;
      }
      /** 退单寄回信息 */
      interface IReturnInfo {
        /** 地址 */
        address: string;
        /** 收件人 */
        addressee: string;
        /** 电话 */
        phone: string;
        /** 邮编 */
        postcode: string;
      }
      /** 关联订单信息（用于展示） */
      interface ISourceOrder {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 下单时间 */
        createTime: string;
        /** 礼品列表 */
        gifts: Array<IGift>;
        /** 商品列表 */
        goods: Array<IGoods>;
        /** 订单标识 */
        id: string;
        /** 订单商品主图 , */
        mainImage: string;
        /** 订单商品名称 */
        name: string;
        /** 支付时间 */
        paymentTime: string;
        /** 订单商品总数 , */
        quantity: number;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginalAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 礼品赠送报告列表 */
        giftsReportList: Array<IGiftsReport>;
        /** 订单状态 */
        orderStatus: OrderType;
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
        /** 是否售罄 */
        sellOut: boolean;
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
      /** 销售规格信息 */
      interface ISpecification {
        /** 销售属性编码 */
        code: string;
        /** 规格图片地址 */
        image: string;
        /** 销售属性值 */
        value: string;
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
        [prop: string]: any;
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
      /** 订单发货信息 */
      interface IExpress {
        /** 发货快递公司 */
        expressCompany: string;
        /** 发货快递单号 */
        expressNumber: string;
        /** 发货时间 */
        shipmentTime: string;
        /** 商品总重量（千克） */
        totalWeight: string;
        /** 备注 */
        remark: string;
      }
      /** 订单发货信息 */
      interface IShipment {
        /** 物流状态  */
        status: string;
        /** 备注  */
        remark: string;
        /** 物流节点信息  */
        nodes: Array<INode>;
        /** 更新时间  */
        updatedTime: string;
      }
      /** 物流节点信息 */
      interface INode {
        /** 更新时间  */
        time: string;
        /** 物流状态  */
        context: string;
      }
      /** 评价信息 */
      interface IEstimate {
        /** 评价文字内容 */
        content: string;
        /** 已经完成评价 */
        finish: boolean;
        /** 商品评价星级 */
        goodsStars: number;
        /** 文件url列表 */
        imageUrls: Array<string>;
        /** 物流评价星级 */
        logisticsStars: number;
        /** 评价信息 */
        serviceStars: number;
        /** 评价更新时间 */
        updatedTime: string;
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
      /** 订单状态变更历史 */
      interface IStatusHistories {
        /** 更新原因 */
        reason: string;
        /** 订单状态 */
        status: string;
        /** 更新时间 */
        updatedTime: string;
      }
      /** 自定义扩展信息 */
      interface ICustomInfo {
        /** 自定义扩展名称 */
        name: string;
        /** 自定义扩展值 */
        value: string;
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
      /** 礼赠订单信息 */
      interface IGiveGiftInfo {
        /** 领取状态 = ['NONE', 'WAIT_ACQUIRE', 'HAD_ACQUIRE', 'CONFIRMED'] */
        acquireStatus: AcquireStatusType;
        /** 领取编码 */
        code: string;
        /** 赠礼人头像 */
        giftMemberAvatarUrl: string;
        /** 收礼人会员标识 */
        giftMemberId: string;
        /** 赠礼人昵称 */
        giftMemberNickName: string;
        /** 赠礼人头像 */
        giveMemberAvatarUrl: string;
        /** 赠礼人会员标识 */
        giveMemberId: string;
        /** 赠礼人昵称 */
        giveMemberNickName: string;
      }
      /** 订单内各个商品信息 */
      interface IContent {
        type: string;
        invoiceStatus: any;
        code: any;
        orderTime: string;
        /** 下单时间 */
        createTime: string;
        /** 订单标识 */
        id: string;
        /** 订单商品主图 */
        mainImage: string;
        /** 订单商品名称 */
        name: string;
        /** 订单商品总数 */
        quantity: number;
        /** 退单状态编码 */
        refundStatus: string;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 订单状态编码 */
        status: OrderType;
        /** 订单状态名称 */
        statusName: string;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 是否允许退单 */
        allowRefund: boolean;
        /** 组合销售关联商品总数 */
        combinedQuantity: number;
        /** 礼赠订单信息 */
        giveGiftInfo: Public.IGiveGiftInfo;
        /** 订单类型 */
        orderType: string;
      }
      /** 排序相关 */
      interface IPageable {
        /** page*size的理论数量 */
        offset: number;
        /** 当前页的页码 */
        pageNumber: number;
        /** 每页请求的数量 */
        pageSize: number;
        /** 是否指定了页码（没有指定，默认从page为0，size:20） */
        paged: boolean;
        /** 排序相关 */
        sort: ISort;
        /** 是否没有指定页码 */
        unpaged: boolean;
      }
      /** 排序相关 */
      interface ISort {
        /** 入参是否 填写了sort方法，false标识没写 */
        sorted: boolean;
        /** 入参是否 没填了sort方法，true标识没写 */
        unsorted: boolean;
      }
      /** 优惠券信息 */
      interface ICoupon {
        /** 优惠券标识 */
        id: string;
        /** 优惠券模板标识 */
        templateId: string;
        /** 过期时间 */
        to?: string;
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
      /** 自定义积分 */
      interface ICustomPointsPayPlan {
        /** 实际金额 */
        actualAmount?: number;
        /** 兑换积分 */
        redeemPoints?: number;
        /** 是否使用积分 */
        usePoints?: boolean;
      }
      /** 物流信息 */
      interface ILogisticsInfo {
        /** 排序字段应该无用 */
        step_number: number;
        /** 时间节点 */
        accept_time: string;
        /** 快递信息 */
        accept_station: string;
        /** 目的地 */
        location: string;
        /** ??? */
        action: string;
      }
    }
    /** 获取会员订单统计信息
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/statistic/count
     *  @Method POST
     */
    namespace GetOrderCount {
      /** 接口定义 */
      type FuncT = (path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 待付款订单数量 */
        waitPay: number;
        /** 待收货订单数量 */
        waitShipment: number;
        /** 待发货订单数量 */
        waitReceive: number;
        /** 待评价订单数量 */
        waitEstimate: number;
        /** 已完成*/
        // success:number
        /**退货退款 */
        refunded: number;
        /**已取消 */
        cancelled: number;
      }
    }
    /** 更新发票信息
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/invoice
     *  @Method POST
     */
    namespace UpdateInvoice {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单编号 */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 发票内容 */
        content: number;
        /** 接收发票邮箱 */
        email: number;
        /** 发票抬头 */
        title: number;
        /** 发票类型 = ['personal', 'company']，备注，不要传中文，由后端去转换 */
        type: InvoiceType;
      }
    }
    /** 更新配送信息
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/deliver
     *  @Method POST
     */
    namespace UpdateDeliver {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单编号 */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IDeliverInfo {}
    }
    /** 根据订单ID查询退单详情
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/refund
     *  @Method GET
     */
    namespace GetRefundOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID(记住这里是订单ID，不是退单ID) */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IRefundOrderResponse {}
    }
    /** 取消退单(撤销申请的退单)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_refund/{id}/cancel
     *  @Method POST
     */
    namespace CancelRefundOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 退单ID */
        id: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IRefundOrderResponse {}
    }
    /** 获取订单物流信息
     *  @URL {basePathUrl}/api/ec-portal/store/{stroeCode}/member_order/{orderId}/logistics
     *  @Method GET
     */
    namespace GetOrderLogistics {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 物流状态代码 */
        state_ex: number;
        /** 物流单号 */
        logistics_no: string;
        /** 当前地址（市） */
        location: string;
        /** 物流公司代码 */
        logistics_code: string;
        /** 物流信息 */
        logistics_info: Public.ILogisticsInfo[];
      }
    }
    /** 取消订单(仅限待支付的订单)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/cancel
     *  @Method POST
     */
    namespace CancelOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath, data?: IRequestBody) => MRP<null>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 退款原因 */
        reason?: string;
      }
    }
    /** 删除订单(仅限已取消的订单)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}?_method=DELETE
     *  @Method POST
     */
    namespace DeleteOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath, data?: IRequestBody) => MRP<null>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 退款原因 */
        reason?: string;
      }
    }
    /** 评价订单(必须是待评价订单)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/evaluation
     *  @Method POST
     */
    namespace EvaluationOrder {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 评价文字内容 */
        content: string;
        /** 商品评价星级 */
        goodsStars: number;
        /** 文件url列表,这里是上传图片，非必填 */
        imageUrls: Array<string>;
        /** 物流评价星级 */
        logisticsStars: number;
        /** 服务评价星级 */
        serviceStars: number;
      }
      /** 返回参数 */
      interface IResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 下单时间 */
        createTime: string;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 评价信息 */
        estimate: Public.IEstimate;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 商品信息 */
        goods: Array<Public.IGoods>;
        /** 订单标识 */
        id: string;
        /** 发票信息 */
        invoiceInfo: Public.IInvoiceInfo;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 订单状态编码 */
        status: string;
        /** 订单状态变更历史 */
        statusHistories: Array<Public.IStatusHistories>;
        /** 订单状态名称 */
        statusName: string;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 评价信息 */
        evaluation: Public.IEstimate;
        /** 礼品赠送报告 */
        giftsReportList: Array<Public.IGiftsReport>;
        /** 支付时间 */
        paymentTime: string;
        /** 退单状态编码 */
        refundStatus: string;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 订单自定义拓展信息 ., */
        customInfos: Array<Public.ICustomInfo>;
      }
    }
    /** 查询订单详情
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/detail
     *  @Method GET
     */
    namespace GetOrderDetail {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /**是否退款 */
        allowRefund: boolean;
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 下单时间 */
        createTime: string;
        /** 订单自定义拓展信息 ., */
        customInfos: Array<Public.ICustomInfo>;
        /** 距离订单创建 多少分钟后失效 */
        cancelWhenOrderPayTimeoutMinutes: number;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 评价信息 */
        evaluation: Public.IEstimate;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 礼品赠送报告 */
        giftsReportList: Array<Public.IGiftsReport>;
        /** 礼赠订单信息 */
        giveGiftInfo: Public.IGiveGiftInfo;
        /** 商品信息 */
        goods: Array<Public.IGoods>;
        /** 订单标识 */
        id: string;
        /** 发票信息 */
        invoiceInfo: Public.IInvoiceInfo;
        /** 订单类型 */
        orderType: string;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 支付时间 */
        paymentTime: string;
        /** 退单状态编码 */
        refundStatus: string;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 剩余时间 */
        remainCancelTime: number;
        /** 订单状态编码 */
        status: OrderType;
        /** 订单状态变更历史 */
        statusHistories: Array<Public.IStatusHistories>;
        /** 订单状态名称 */
        statusName: string;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 积分 */
        totalActualPoints: number;
        /** 总优惠金额 */
        totalBenefitAmount: number;
        /** 积分抵扣金额 */
        totalPointsToAmount: number;
        /** 订单发票进度 */
        orderInvoiceView: {
          invoiceStatus: string;
          invoiceStatusName: string;
        };
      }
    }
    /**
     * 亲密付查询简单订单详情
     * @url  {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/simpleDetail
     * @methods GET
     */
    namespace GetSimpleOrderDetail {
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      interface IResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 距离订单创建多少分钟后失效 */
        cancelWhenOrderPayTimeoutMinutes: number;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 下单时间 */
        createTime: string;
        /** 订单自定义拓展信息 */
        customInfos: Array<Public.ICustomInfo>;
        /** 评价信息 */
        evaluation: Public.IEstimate;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 商品信息 */
        goods: Array<Public.IGoods>;
        /** 订单id */
        id: string;
        /** 订单发起人id */
        memberId: string;
        /** 订单寄语 */
        memo: string;
        /** 支付者id */
        payerId: string;
        /** 订单类型 */
        orderType: string;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 订单支付人信息 */
        ownerInfo: OwnerInfo;
        /** 退单状态编码 */
        refundStatus: string;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 订单状态 */
        status: OrderType;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
        /** 积分 */
        totalActualPoints: number;
        /** 总优惠金额 */
        totalBenefitAmount: number;
      }
      interface OwnerInfo {
        payerAvatarUrl: string;
        payerMemberId: string;
        payerNickName: string;
      }
    }

    /** 查询订单详情
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/help_pay/{orderId}/detail
     *  @Method GET
     */
    namespace GetOtherOrderDetail {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单ID */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 下单时间 */
        createTime: string;
        /** 订单自定义拓展信息 ., */
        customInfos: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
        /** 评价信息 */
        evaluation: Public.IEstimate;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 礼品赠送报告 */
        giftsReportList: Array<Public.IGiftsReport>;
        /** 礼赠订单信息 */
        giveGiftInfo: Public.IGiveGiftInfo;
        /** 商品信息 */
        goods: Array<Public.IGoods>;
        /** 订单标识 */
        id: string;
        /** 发票信息 */
        invoiceInfo: Public.IInvoiceInfo;
        /** 微信会员openId */
        openId: string;
        /** 发起人的昵称 */
        nickName: string;
        /** 发起人的头像 */
        avatarPicture: string;
        /** 代付人的openId */
        payerOpenId: string;
        /** 代付人的昵称 */
        payerNickName: string;
        /** 代付人的头像 */
        payerAvatarPicture: string;
        /** 订单类型 */
        orderType: string;
        /** 原始订单运费 */
        originShippingPrice: number;
        /** 支付时间 */
        paymentTime: string;
        /** 退单状态编码 */
        refundStatus: string;
        /** 退单状态名称 */
        refundStatusName: string;
        /** 订单状态编码 */
        status: string;
        /** 订单状态变更历史 */
        statusHistories: Array<Public.IStatusHistories>;
        /** 订单状态名称 */
        statusName: string;
        /** 实际订单合计金额(不含运费) */
        totalActualAmount: number;
        /** 原始订单合计金额 */
        totalOriginAmount: number;
        /** 客户最终实付金额(含运费) */
        totalRealPayAmount: number;
      }
    }
    /** 根据订单状态获取订单列表
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{status}?page={page}&size={size}
     *  @Method GET
     */
    namespace GetOrderByStatus {
      /** 接口定义 */
      type FuncT = (query: IRequestQuery, path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单状态（wait_pay等等） */
        status: PolyOrderType;
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 页码(从0开始) */
        page: number;
        /** 每页展示的数量 */
        size: number;
        /** 	排序方式 */
        sort?: Array<string>;
        /** 订单类型：线上online，线下offline */
        counterAttribute?: string;
        getAllSkus?: boolean;
      }
      /** 返回参数 */
      interface IResponse {
        /** 订单内各个商品信息 */
        content: Array<Public.IContent>;
        /** 当前页是否是第一页 */
        first: boolean;
        /** 当前页是否是最后一页 */
        last: boolean;
        /** 当前页的页码 */
        number: number;
        /** 当前页的数量(如果不是最后一页，此值应该和你填写的size一样) */
        numberOfElements: number;
        /** 排序相关 */
        pageable: Public.IPageable;
        /** 入参请求的数量（每页请求多少个） */
        size: number;
        /** 排序相关 */
        sort: Public.ISort;
        /** 总数量 */
        totalElements: number;
        /** 总页数 */
        totalPages: number;
      }
    }
    /** 更新退单(补填退货物流)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_refund/{id}/modify
     *  @Method POST
     */
    namespace ModifyRefundOrder {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 退单ID，这里写退单ID */
        id: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 退货的快递公司 */
        expressCompany: string;
        /** 快递单号 */
        expressNumber: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IRefundOrderResponse {}
    }
    /** 提交退单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_refund
     *  @Method POST
     */
    namespace SubmitRefundOrder {
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
        /** 退货快递公司 */
        expressCompany?: string;
        /** 退货快递单号 */
        expressNumber?: string;
        /** 上传的图片 */
        imageUrls?: Array<string>;
        /** 订单标识 */
        orderId: string;
        /** 退货原因 */
        reason?: string;
        /** 是否已收货 , */
        received: boolean;
        /** 退货说明 */
        remark?: string;
      }
      /** 返回参数 */
      interface IResponse extends Public.IRefundOrderResponse {}
    }
    /** 聚合支付
     *  @URL {basePathUrl}/api/sp-portal/store/{storeCode}/payment/requestConfirm/ums
     *  @Method POST
     */
    namespace PaymentUMS {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 支付备注 */
        memo?: string;
        /** 订单ID */
        orderId: string;
        /** 代付标识 */
        instead?: boolean;
      }
      /** 返回参数 */
      interface IResponse {
        /** 随机字符串，长度为32个字符以下 */
        nonceStr: string;
        /** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*** */
        package: string;
        /** 签名，具体签名方案参见 小程序支付接口文档 */
        paySign: string;
        /** id */
        queryId: string;
        /** 签名算法 */
        signType: string;
        /** 时间戳 */
        timeStamp: string;
        /** 自定义交易组件ticket */
        ticket?: string;
        /** 自定义交易组件订单信息 */
        weChatOrder?: any;
      }
    }
    /** 查看收礼订单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/give_gift_order/gift
     *  @Method GET
     */
    namespace GetReceiveGiftOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 订单内各个商品信息 */
        content: Array<Public.IContent>;
        /** 当前页是否是第一页 */
        first: boolean;
        /** 当前页是否是最后一页 */
        last: boolean;
        /** 当前页的页码 */
        number: number;
        /** 当前页的数量(如果不是最后一页，此值应该和你填写的size一样) */
        numberOfElements: number;
        /** 排序相关 */
        pageable: Public.IPageable;
        /** 入参请求的数量（每页请求多少个） */
        size: number;
        /** 排序相关 */
        sort: Public.ISort;
        /** 总数量 */
        totalElements: number;
        /** 总页数 */
        totalPages: number;
      }
    }
    /** 查看赠礼订单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/give_gift_order/give
     *  @Method GET
     */
    namespace GetGiveGiftOrder {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 订单内各个商品信息 */
        content: Array<Public.IContent>;
        /** 当前页是否是第一页 */
        first: boolean;
        /** 当前页是否是最后一页 */
        last: boolean;
        /** 当前页的页码 */
        number: number;
        /** 当前页的数量(如果不是最后一页，此值应该和你填写的size一样) */
        numberOfElements: number;
        /** 排序相关 */
        pageable: Public.IPageable;
        /** 入参请求的数量（每页请求多少个） */
        size: number;
        /** 排序相关 */
        sort: Public.ISort;
        /** 总数量 */
        totalElements: number;
        /** 总页数 */
        totalPages: number;
      }
    }
    /** 领取收礼订单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/give_gift_order/acquire
     *  @Method POST
     */
    namespace AcquireGiftOrder {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path: IRequestPath) => MRP<boolean>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 领取编码 */
        code: string;
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo;
      }
    }
    /** 商品详情发起立即购买(只用户计算，不真实提交)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/buy_now/locate
     *  @Method POST
     */
    namespace LocateBuyNow {
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
        /** 门店ID */
        counterId?: string;
        /** 组合销售sku标识列表 */
        combinedSkuList?: Array<string>;
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo?: Public.IDeliverInfo;
        /** 商品扩展信息 */
        goodsCustomInfos?: Array<Public.ICustomInfo>;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** 促销码 */
        promotionCode?: string;
        /** sku数量 */
        quantity: number;
        /** sku标识 */
        skuId: string;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
        /** 是否礼赠订单 */
        giveGift?: boolean;
        /** 自定义使用积分 */
        customPointsPayPlan?: Public.ICustomPointsPayPlan;
      }
      /** 返回参数 */
      interface IResponse {
        /** 实际支付运费 */
        actualShippingPrice: number;
        /** 组合销售商品 */
        combinedGoods: Array<Public.ICombinedGoods>;
        /** 优惠券 */
        coupons: Array<Public.ICouponDetial>;
        /** 礼品信息 */
        gifts: Array<Public.IGift>;
        /** 礼品赠送报告列表 */
        giftsReportList: Array<Public.IGiftsReport>;
        /** 商品列表 */
        goods: Public.IGoods;
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
        /** 可用积分 */
        usablePoints: number;
        /** 客户最终实付积分（含运费） */
        totalRealPayPoints: number;
        /** 积分抵扣金额  */
        totalPointsToAmount: number;
        /** 当前积分抵现活动是开启 */
        allowPointsPay: boolean;
        /** 自由属性 */
        [prop: string]: any;
      }
    }
    /** 从商品详情，点击提交订单
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/buy_now/submit
     *  @Method POST
     */
    namespace SubmitBuyNow {
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
        /** 预约购买的柜台id */
        counterId?: string;
        /** 组合销售sku标识列表 */
        combinedSkuList?: Array<string>;
        /** 优惠券列表 */
        coupons?: Array<Public.ICoupon>;
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>;
        /** 配送信息 */
        deliverInfo?: Public.IDeliverInfo;
        /** 商品扩展信息 */
        goodsCustomInfos?: Array<Public.ICustomInfo>;
        /** 发票信息 */
        invoiceInfo?: Public.IInvoiceInfo;
        /** 促销码 */
        promotionCode?: string;
        /** sku数量 */
        quantity: number;
        /** sku标识 */
        skuId: string;
        /** 是否使用优惠券 */
        useCoupon?: boolean;
        /** 是否礼赠订单 */
        giveGift?: boolean;
        /** 自定义使用积分 */
        customPointsPayPlan?: Public.ICustomPointsPayPlan;
        /** 是否预售订单 */
        preSale?: boolean;
        /** 选择的支付方式 */
        selectedPayType?: string;
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
        [x: string]: any;
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
        /** 可用积分 */
        usablePoints: number;
        /** 客户最终实付积分（含运费） */
        totalRealPayPoints: number;
        /** 积分抵扣金额  */
        totalPointsToAmount: number;
        /** 当前积分抵现活动是开启 */
        allowPointsPay: boolean;
      }
    }
    /** 订单更新发票信息
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/{orderId}/invoice
     *  @Method POST
     */
    namespace UpdateOrderInvoice {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path: IRequestPath) => MRP<null>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单Id */
        orderId: string;
      }
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
      }
    }
    /** 根据状态查询电子发票详情
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/invoice/{orderId}/{status}
     *  @Method GET
     */
    namespace GetInvoiceByStatus {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse[]>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单Id */
        orderId: string;
        /** 状态 */
        status: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 渠道标识 */
        channelId: string;
        /** 创建时间 */
        createTime: string;
        /** 会员昵称 */
        customerName: string;
        /** 逻辑删除 */
        delDetail: string;
        /** 发票代码 */
        invoiceCode: string;
        /** 开票日期 */
        invoiceDate: string;
        /** 开票img */
        invoiceImgUrl: string;
        /** 发票编号 */
        invoiceNo: string;
        /** 开票PDF */
        invoicePdfUrl: string;
        /** 开票状态 */
        invoiceStatus: string;
        /** 会员标识 */
        memberId: string;
        /** 原单标识 */
        orderId: string;
        /** 含税金额 */
        oriAmount: string;
        /** 备注 */
        remark: string;
        /** 发票抬头 */
        title: string;
        /** 发票类型 */
        type: string;
        /** 更新时间 */
        updatedTime: string;
      }
    }
    /** 获取电子发票详情(OMS)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order//{orderId}/invoiceByOms
     *  @Method GET
     */
    namespace GetInvoiceByOms {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单Id */
        orderId: string;
      }
      /** 返回参数 */
      interface IResponse {
        /** 渠道标识 */
        channelId: string;
        /** 创建时间 */
        createTime: string;
        /** 会员昵称 */
        customerName: string;
        /** 逻辑删除 */
        delDetail: string;
        /** 发票代码 */
        invoiceCode: string;
        /** 开票日期 */
        invoiceDate: string;
        /** 开票img */
        invoiceImgUrl: string;
        /** 发票编号 */
        invoiceNo: string;
        /** 开票PDF */
        invoicePdfUrl: string;
        /** 开票状态 */
        invoiceStatus: string;
        /** 会员标识 */
        memberId: string;
        /** 原单标识 */
        orderId: string;
        /** 含税金额 */
        oriAmount: string;
        /** 备注 */
        remark: string;
        /** 发票抬头 */
        title: string;
        /** 发票类型 */
        type: string;
        /** 更新时间 */
        updatedTime: string;
        /** 纳税人识别号 */
        content: string;
      }
    }
    /** 发送发票到邮箱
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/member_order/invoiceMail/{orderId}/{channel}/{mail}
     *  @Method GET
     */
    namespace SendInvoiceMail {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<boolean>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        /** 订单Id */
        orderId: string;
        /** 渠道Id */
        channel: string;
        /** 电子邮箱 */
        mail: string;
      }
    }
    /** 释放重复支付的锁
     *  @URL {basePathUrl}/api/sp-pay/store/{storeCode}/request/releaseDoublePayLock
     *  @Method POST
     */
    namespace ReleaseDoublePayLock {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<null>;
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string;
        orderNo: string;
      }
    }

    /**
     * 检查预约券的提货状态
     */
    namespace CheckCouponStatus {
      /** 接口定义 */
      type FuncT = (query: IRequestPath) => MRP<IResponse>;
      type IRequestPath = {
        couponId: string;
        customerId: string;
      };
      /** 请求参数 Path */
      type IResponse = boolean;
    }

    /**
     * 查询退单次数
     */
    namespace GetRefuseTimes {
      /** 接口定义 */
      type FuncT = (query: IRequestPath) => MRP<IResponse>;
      type IRequestPath = {
        orderId: string;
      };
      /** 请求参数 Path */
      type IResponse = number;
    }
  }
}
