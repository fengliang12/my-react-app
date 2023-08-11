
declare namespace Api {
  namespace Product {
    /**
     * 商品接口公用声明
     */
    namespace Public {
      /** 类目下商品的通用返回声明 */
      interface IProductReponse {
        /** 描述信息 */
        description: string
        /** 唯一标识 */
        id: string
        /** 搜索关键字 */
        keyword: string
        /** 商品标签Code */
        label: string | string[]
        /** 商品主图 */
        mainImage: string
        /** 市场价格 */
        marketingPrice: number
        /** 商品名称 */
        name: string
        /** 商品简称 */
        shortName: string
        /** 商城价格 */
        price: number
        /** 是否已售罄 */
        sellOut: boolean
        /** 销售规格 */
        specification: string
        /** skuId集合 */
        skuIdList?: Array<string>
        /** 标签集合 */
        labelObjs: {
          /** 标签code */
          code: string
          /** 标签Url */
          imgUrl: string
          /** 标签名称 */
          name: string
        }[]
      }
      /** 该类目下的子类目（多级菜单） */
      interface IChild {
        /** 该类目下的子类目 */
        child: Array<IChild>
        /** 类目ID */
        id: string
        /** 类目名称 */
        name: string
        /** 该类目的父级 */
        parent: string
        /** 分类图片 */
        remark: string
        /** 额外熟悉 */
        [propName: string]: any
      }
      /** 排序相关 */
      interface IPageable {
        /** page*size的理论数量 */
        offset: number
        /** 当前页的页码 */
        pageNumber: number
        /** 每页请求的数量 */
        pageSize: number
        /** 是否指定了页码（没有指定，默认从page为0，size:20） */
        paged: boolean
        /** 排序相关 */
        sort: ISort
        /** 是否没有指定页码 */
        unpaged: boolean
      }
      /** 排序相关 */
      interface ISort {
        /** 入参是否 填写了sort方法，false标识没写 */
        sorted: boolean
        /** 入参是否 没填了sort方法，true标识没写 */
        unsorted: boolean
      }
      /** 销售属性 */
      interface IAttributes {
        /** 描述信息 */
        name: string
        /** 销售属性值选项 */
        options: IOptions
      }
      /** 销售属性值选项 */
      interface IOptions {
        /** 规格图片地址 */
        image: string
        /** 销售属性值 */
        value: string
      }
      /** 商品属性 */
      interface IProperties {
        /** 类目属性编码 */
        code: string
        /** 类目属性名称 */
        name: string
        /** 类目属性值 */
        valueString: string
        /** 类目属性值 */
        values: Array<string>
      }
      /** SKU视图 */
      interface ISpecs {
        /** 	是否禁止退款 */
        disableRefund: boolean
        /** 	唯一标识 */
        id: string
        /** sku图片 */
        images: Array<string>
        /** 市场价格 */
        marketingPrice: number
        /** 商城价格 */
        price: number
        /** 优先级（用于排序） */
        priority: number
        /** 商品属性 , */
        properties: Array<IProperties>
        /** 已售罄 */
        sellOut: boolean
        /** 分享图片 */
        shareImage: string
        /** 销售规格 */
        specifications: Array<ISpecification>
        /** 商品销售状态 = ['INIT', 'ON_SALE', 'OFF_SALE'] */
        status: SalesType
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType
        /** sku的名称 */
        name: string
        /** sku简称 */
        shortName: string
        /** sku的code */
        code: string
        /** sku的主图 */
        mainImage: string
        [prop: string]: any
      }
      /** 销售规格信息 */
      interface ISpecification {
        /** 销售属性编码 */
        code: string
        /** 规格图片地址 */
        image: string
        /** 销售属性值 */
        value: string
        /** 销售类型 */
        attributeType: string
      }
      /** 推荐产品返回数据 */
      interface IRecommendData {
        goodsName: string
        mainImage: string
        /** 商品图片路径 */
        index: string
        /** 商城价格 */
        marketingPrice: number
        /** 价格 */
        price: number
        /** 结束时间 */
        offlineTime: string
        /** 开始时间 */
        onlineTime: string
        /** 商品ID */
        productId: string
        /** SKU的名称 */
        productName: string
        /** 商品SKU */
        sku: string
        /** 排序方法 */
        sort: string
      }
      /** 活动信息 */
      interface IBanner {
        /** 活动图片 */
        imgUrl: string
        /** 跳转地址 */
        jumpUrl: string
        /** 是否最后面 */
        last: false
      }
      /** 优惠券信息 */
      interface IReceiveCoupon {
        couponTemplate: ICouponTemplateListView
      }
      /** 卡券模板列表信息 */
      interface ICouponTemplateListView {
        /** 是否启用  */
        active: boolean
        /** 卡券副图 */
        auxiliaryImage: string
        /** 卡券颜色 */
        color: string
        /** 卡券描述 */
        description: string
        /** 启效时间 */
        from: string
        /** 卡券ID */
        id: string
        /** 卡券模板LOGO */
        logo: string
        /** 卡券主图 */
        rule: IRule
        /** 是否可以分享 */
        sharable: boolean
        /** 卡券标签 */
        tags: Array<string>
        /** 卡券模版标题 */
        title: string
        /** 过期时间 */
        to: string
        /** 更新时间 */
        updatedTime: string
        /** 是否可以分享 */
        validDays: number
        /** 自定义信息数组 */
        extendInfos: Array<IExtendInfo>
      }
      /** 自定义属性 */
      interface IExtendInfo {
        /** 属性唯一标示符 */
        code: string
        /** 属性名称 */
        name: string
        /** 属性值 */
        value: string
      }
      /** 卡券规则 */
      interface IRule {
        /** 卡券规则 */
        actionSettings: Array<IActionSettings>
        /** 触发类型 */
        actionType: string
        /** 是否全部使用 */
        allGoods: boolean
        /** 指定商品列表 */
        goodsList: Array<IGoodsList>
        /** 指定分组及商品 */
        group: IPromotionGoodsGroup
        /** 整单最低金额 */
        minAmount: number
        /** 促销活动范围，整单、单品 */
        scope: string
      }
      interface IPromotionGoodsGroup {
        /** 分组全部匹配为true，满足其一为false  */
        allMatch: boolean
        /** 分组列表 */
        items: Array<IPromotionGoodsGroupItem>
      }
      /** 指定商品列表 */
      interface IGoodsList {
        /** sku数量  */
        quantity: number
        /** sku标识  */
        skuId: string
      }
      /** 指定商品详情 */
      interface IPromotionGoodsGroupItem {
        /** 指定商品列表 */
        goodsList: boolean
        /** 最小金额 */
        minAmount: number
        /** 最小数量 */
        minQuantity: number
      }
      /** 卡券规则设置 */
      interface IActionSettings {
        /** 满减 */
        deduction: number
        /** 折扣 */
        discount: number
        /** 是否免邮费 */
        freeShippingPrice: boolean
        /** 促销活动小样列表 */
        gifts: Array<IPromotionActionGift>
        /** 最小金额 */
        minAmount: number
        /** 最小数量 */
        minQuantity: number
        /**  */
        optionalQuantity: number
      }
      /** 促销小样列表 */
      interface IPromotionActionGift {
        /** 指定商品列表 */
        quantity: number
        /** SKUID */
        skuId: string
      }
      /** 促销活动信息 */
      interface IPromotionGoods {
        /** 优惠券模板标识 */
        couponTemplateId: string
        /** 补充说明 */
        description: string
        /** 互斥活动 */
        exclusions: string[]
        /** 开始时间 */
        from: string
        /** 活动主图 */
        mainImage: string
        /** 活动名称 */
        name: string
        /** 促销的活动类型 */
        promotionActionType: PromotionActionType
        /** 促销码标识 */
        promotionCodeId: string
        /** 活动标识 */
        promotionId: string
        /** 活动标题 */
        title: string
        /** 结束时间 */
        to: string
        /** 促销类型 */
        type: PromitionType
      }
    }
    /** 获取商品销售类目树(用于多级菜单)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/sales_category/tree
     *  @Method GET
     */
    namespace GetProductTree {
      /** 接口定义 */
      type FuncT = (path?: IRequestPath) => MRP<Array<IResponse>>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
      }
      /** 返回参数 */
      interface IResponse extends Public.IChild { }
    }

    /** 获取指定类目下的商品列表
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/sales_category/{id}/list
     *  @Method GET
     */
    namespace GetProductListByCateGoryId {
      /** 接口定义 */
      type FuncT = (path: IRequestPath, query?: IRequestQuery) => MRP<Array<IResponse>>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
        /** 类目ID，比如01 */
        id: string
      }
      /** 请求参数 Body */
      interface IRequestQuery {
        /** 排序方式 */
        sortOrder: 'DESC' | 'ASC'
        /** 排序类型 */
        sortType: 'NEW_PRODUCT' | 'SYNTHESIZE' | 'SALES' | 'PRICE'
      }
      /** 返回参数 */
      interface IResponse extends Public.IProductReponse { }
    }

    /** 获取推荐产品-新
     *  @URL {basePathUrl}/api/sp-portal/guessRecommend/${storeCode}/goodsList
     *  @Method POST
    */
    namespace GetRecommendProductNew {
      /** 接口定义 */
      type FuncT = (data: IRequestBody, path?: IRequestPath) => MRP<IResponse>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
      }
      /** 请求参数 Body */
      interface IRequestBody {
        /** 商品ID */
        productId?: string
        /** 推荐名称 */
        recommendName?: string
        /** 推荐类型 */
        recommendType: string
        /** 卡券Id */
        couponId?: string
      }
      /** 返回参数 */
      interface IResponse {
        /** 全部商品分类Id */
        allGoodsId: string
        /** 浏览记录列表 */
        browsingHistoryList?: {
          /* 本店xxx第几名 */
          message: string
          /** 图片链接 */
          pictureUrl: string
          /** 商品价格 */
          price: number
          /** 商品名称 */
          productName: string
        }[]
        /** 猜你喜欢列表 */
        guessGoodsList?: {
          /* 本店xxx第几名 */
          message: string
          /** 图片链接 */
          pictureUrl: string
          /** 商品价格 */
          price: number
          /** 商品名称 */
          productName: string
        }[]
      }
    }
    /** 获取商品详情
    *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/goods/{id}
    *  @Method GET
    */
    namespace GetProductDetail {
      /** 接口定义 */
      type FuncT = (path: IRequestPath) => MRP<IResponse>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
        /** 商品ID */
        id: string
      }
      /** 返回参数 */
      interface IResponse {
        /** 销售属性 */
        attributes: Array<Public.IAttributes>
        /** 跳转活动页面 */
        bannerImages: Array<Public.IBanner>
        /** 商品code */
        code: string
        /** 描述信息 */
        description: string
        /** 图片详情 */
        detailImages: Array<string>
        /** 唯一标识 */
        id: string
        /** 商品标签 */
        label: Array<string>
        /** 商品名称 */
        name: string
        /** 商品属性 */
        properties: Array<Public.IProperties>
        /** 商品简称 */
        shortName: string
        /** SKU视图 */
        specs: Array<Public.ISpecs>
        /** 商品销售状态 = ['INIT', 'ON_SALE', 'OFF_SALE'] */
        status: SalesType
        /** 商品类型 = ['GOODS', 'GIFT'] */
        type: ProductType
        /** 点赞总数 */
        giveLikeCount: number
        /** 点赞状态 */
        giveLikeStatus: boolean
        [prop: string]: any
      }
    }
    /** 获取搜索历史
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/search/history
     *  @Method GET
     */
    namespace GetSearchHistory {
      /** 接口定义 */
      type FuncT = (path?: IRequestPath) => MRP<Array<string>>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
      }
    }
    /** 清空搜索历史
    *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/search/history
    *  @Method DELETE
    */
    namespace ClearSearchHistory {
      /** 接口定义 */
      type FuncT = (path?: IRequestPath) => MRP<null>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
      }
    }
    /** 商品搜索(根据关键字)
     *  @URL {basePathUrl}/api/ec-portal/store/{storeCode}/goods/search?keyword={keyword}?page={page}?size={size}
     *  @Method GET
     */
    namespace GetSearchKeyword {
      /** 接口定义 */
      type FuncT = (query: IRequestQuery, path?: IRequestPath) => MRP<IResponse>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 商品关键字 */
        keyword: string
        /** 页码(从0开始) */
        page: number
        /** 每页展示的数量 */
        size: number,
        /** 排序类型：1.SALES/销量排序；2.SYNTHSIZE/综合排序；3.NEW_PRODUCT/新品排序；4.PRICE/价格排序 */
        sortType?: "SALES" | "SYNTHSIZE" | "NEW_PRODUCT" | "PRICE"
        /** 排序规则 ASC/正序；DESC/倒序 */
        sortOrder?: "ASC" | "DESC"
      }
      /** 返回参数 */
      interface IResponse {
        /** 类目下各个商品信息 */
        content: Array<Public.IProductReponse>
        /** 当前页是否是第一页 */
        first: boolean
        /** 当前页是否是最后一页 */
        last: boolean
        /** 当前页的页码 */
        number: number
        /** 当前页的数量(如果不是最后一页，此值应该和你填写的size一样) */
        numberOfElements: number
        /** 排序相关 */
        pageable: Public.IPageable
        /** 入参请求的数量（每页请求多少个） */
        size: number
        /** 排序相关 */
        sort: Public.ISort
        /** 总数量 */
        totalElements: number
        /** 总页数 */
        totalPages: number
      }
    }
    /** 商品搜索(根据关键字)
    *  @URL {basePathUrl}/api/sp-portal/store/${config.storeCode}/coupon_package/nextCouponId/${path.skuCode}
    *  @Method GET
    */
    namespace SubScribeNextMonthCoupon {
      /** 接口定义 */
      type FuncT = (query: IRequestQuery, path?: IRequestPath) => MRP<IResponse>
      /** 请求参数 Path */
      interface IRequestPath {
        /** 商城编码 */
        storeCode?: string,
      }
      /** 请求参数 Query */
      interface IRequestQuery {
        /** 0.01加赠商品sku */
        skuCode?: string,
      }
      /** 返回参数 */
      interface IResponse {
      }
    }
  }
}
