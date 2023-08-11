declare namespace Api {
  /**
   * 购物车接口类型声明
   */
  namespace PointCart {
    /**
     * 购物车接口公用声明
     */
    namespace Public {
      /** 购物车接口通用RequestBody */
      interface ICartRequestBody {
        /** 活动code */
        activityCode?: string,
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>
        /** 商品数量 */
        quantity: number
        /** sku标识 */
        skuId: string
        /** 是否选中 */
        selected: boolean,
        /** 购物车条目id */
        cartItemId?: string,
      }

      /** 购物车接口通用Response */
      interface ICartResponse {
        /** 有效礼品 */
        goods: ICartItem[]
        /** 失效礼品 */
        invalidGoods: ICartItem[]
      }

      /** 购物车内礼品详情 */
      interface ICartItem {
        /** 购物车条目id */
        cartItemId: string,
        /** 创建时间 */
        createdTime: string
        /** 会员等级限制 */
        customerTag: ICustomerTag[]
        /** 描述信息 */
        description: string
        /** 图片详情 */
        detailImages: string[]
        /** 活动积分 */
        discountPoint: number
        /** 有效期开始时间 */
        from: string
        /** 礼品编码 */
        giftCode: string
        /** 商品类目 */
        goodsCategory: string
        /** 限购信息 */
        goodsSkuSalesRule: IGoodsSkuSalesRule
        /** 唯一标识 */
        id: string
        /** 是否限购 */
        limiting: boolean
        /** sku主图 */
        mainImage: string
        /** crm系统积分兑礼Code */
        messageCode: string
        /** 礼品名称 */
        name: string
        /** 是否套装商品 */
        packageGoods: boolean
        /** 套装 */
        packageGoodsSkuSettingViewList: IPackageGoodsSkuSettingView
        /** 兑礼积分 */
        point: number
        /** 兑礼金额 */
        price: number
        /** sku数量 */
        quantity: number
        /** 限兑数量(限制客人在这个周期的兑礼数量) */
        quantitySalesRule: {
          /**频次范围:忽略 IGNORE,全生命周期FULL LIFE每年BY YEAR 每月 BY MONTH 每天BY DAY */
          range: "IGNORE" | "FULL LIFE" | "BY YEAR" | "BY MONTH" | "BY DAY";
          times: number;
        }
        /** 销售时效状态 */
        saleTimeStatus: string
        /** 销售类目 */
        salesCategoryList: string[]
        /** 是否勾选标识 */
        selected: boolean
        /** 已售罄 */
        sellOut: boolean
        /** 橱窗图 */
        shopWindowImages: string[]
        /** 套装商品是否使用单独库存 */
        singletonStock: boolean
        /** skuId */
        skuId: string
        /** 上下架状态 */
        status: boolean
        /** 缓存的库存 */
        stock: number
        /** 是否支付限购时段 */
        supportLimitTime: boolean
        /** 结束时段比如24:00 */
        timeEnd: string
        /** 开始时段比如10:00 */
        timeStart: string
        /** 有效期结束时间 */
        to: string
        /** 礼品类型 */
        type: string
        /** 更新时间 */
        updatedTime: string

        /** 自由属性 */
        [prop: string]: any
      }

      /** 购物车用户标签 */
      interface ICustomerTag {
        /** 补充说明 */
        description: string
        /** 唯一标识 */
        id: string
        /** 标签名称 */
        name: string
      }

      /** 购物车礼品销售规则 */
      interface IGoodsSkuSalesRule {
        /** 天数 */
        days: number
        /** 限制类型 */
        range: 'IGNORE' | 'NO_LIMIT' | 'FULL_LIFE' | 'BY_YEAR' | 'BY_MONTH' | 'BY_DAY' | 'INTERVAL'
        /** 次数 */
        times: number
      }

      /** 购物车套装设置 */
      interface IPackageGoodsSkuSettingView {
        /** 可选的明细 */
        detailList: IBonusPointView[]
        /** 套装数量 */
        quantity: number
        /** 可选的SkuList */
        skuList: string[]
      }

      /** 套装内单个礼品详情 */
      interface IBonusPointView {
        [prop: string]: any
      }

      /** 提交购物车订单的礼品明细信息 */
      interface IBonusPointCartItems {
        /** 积分商品表标识，由skuId代替 */
        bonusId: string
        /** 购物车条目标识 */
        cartItemId: string
        /** 优惠券code */
        code?: string
        /** 自定义扩展信息 */
        customInfos?: ICustomInfo[]
        /** 礼品编码 */
        giftCode: string
        /** 兑礼单价积分 */
        point: number
        /** 兑礼单价金额 */
        price?: number
        /** sku数量 */
        quantity: number
        /** sku标识 */
        skuId: string
      }

      /** 自定义扩展信息 */
      interface ICustomInfo {
        /** 自定义扩展名称 */
        name: string
        /** 自定义扩展值 */
        value: string
      }

      /** 配送信息 */
      interface IDeliverInfo {
        /** 收件人姓名 */
        addressee: string
        /** 市 */
        city: string
        /** 详细地址 */
        detail: string
        /** 区 */
        district: string
        /** 收件人手机号 */
        mobile: string
        /** 邮编 */
        postcode: string
        /** 省 */
        province: string
        /** 配送方式 = ['express', 'self_pick_up'] */
        type?: DeliverType
      }

    }
    /** 查询购物车详情
     *  @Method POST
     */
    namespace GetCart {
      /** 接口定义 */
      type FuncT = (activityCode?: string) => MRP<IResponse>

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 获取购物车内礼品数量
     *  @Method GET
     * */
    namespace GetCartCount {
      /** 接口定义 */
      type FuncT = () => MRP<number>
    }
    /** 更新购物车数据
     *  @Method POST
     */
    namespace UpdateCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      /** 请求参数 Body */
      interface IRequestBody extends Public.ICartRequestBody {

      }

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 商品添加到购物车
     *  @Method POST
     */
    namespace AppendCart {
      /**
       * 接口定义
       * config: AxiosRequestConfig
       * */
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      /** 请求参数 Body */
      interface IRequestBody extends Public.ICartRequestBody {
      }

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 切换购物车全选状态
     *  @Method POST
     */
    namespace SelectAllCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      /** 请求参数 Body */
      interface IRequestBody {
        /** 活动code */
        activityCode: string
        /** 是否全选 */
        selected: boolean
        /** 选择的skuId数组 */
        skuList?: string[]
      }

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 切换购物车单选状态
     *  @Method POST
     */
    namespace SelectOneGift {
      /** 接口定义 */
      type FuncT = (skuId: string) => MRP<IResponse>

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 清空购物车(购物车删除商品)
     *  @Method POST
     */
    namespace RemoveCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      /** 请求参数 Body */
      interface IRequestBody {
        /** 活动code */
        activityCode?: string
        /** 购物车条目标识列表 */
        cartItemIdList?: Array<string>
        /** 是否删除所有 */
        removeAll?: boolean
      }

      /** 返回参数 */
      interface IResponse extends Public.ICartResponse {
      }
    }
    /** 从购物车途径，点击提交订单
     *  @Method POST
     */
    namespace SubmitCart {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>

      /** 请求参数 Body */
      interface IRequestBody {
        /** 活动code */
        activityCode: string
        /** 活动id */
        activityId: string
        /** 渠道标识(公众号、小程序、PC、线下门店) = ['wm', 'wa', 'pc', 'store'] */
        channelId: ChannelType
        /** 自定义扩展信息 */
        customInfos?: Array<Public.ICustomInfo>
        /** 配送信息 */
        deliverInfo: Public.IDeliverInfo | null
        /** 礼品详细信息 */
        bonusPointCartItems: Public.IBonusPointCartItems[]
        /** 特殊兑礼code */
        code?: string
      }

      /** 返回参数 */
      interface IResponse {
        /** 成功订单id */
        orderId: string
      }
    }
    /** 信用积分计算
     *  @Method GET
     */
    namespace CreditPointsCalc {
      /** 接口定义 */
      type FuncT = (data: number) => MRP<IResponse>

      /** 返回参数 */
      type IResponse = number
    }

    /** 快递100查询
     *  @Method POST
     */
    namespace getOrderExpress {
      /** 接口定义 */
      type FuncT = (data: IRequestBody) => MRP<IResponse>;

      /** 请求参数 Body */
      interface IRequestBody {
        orderId: string;
        company: string;
        number: string;
      }

      /** 返回参数 */
      interface IResponse {
        code: number;
        result: string;
      }
    }
  }
}



