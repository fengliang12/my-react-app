/** 商品类型 */
type ProductType = "GOODS" | "GIFT";

/** 订单类型 */
type OrderType =
  | "all"
  | "wait_pay"
  | "wait_shipment"
  | "wait_group"
  | "wait_receive"
  | "wait_estimate"
  | "cancelled"
  | "success"
  | "refunded";

type PolyOrderType =
  | "all"
  | "wait_pay"
  | "wait_shipment"
  | "wait_receive"
  | "success,wait_estimate"
  | "refunded,cancelled";

/** 促销类型 */
type PromitionType = "NORMAL" | "COUPON" | "PROMOTION_COD";

/**
 * 渠道类型
 * 渠道标识(小程序、公众号、PC、线下门店) = ['wm', 'wa', 'pc', 'store']
 */
type ChannelType = "wm" | "wa" | "pc" | "store";

/** 配送类型 */
type DeliverType = "express" | "self_pick_up";

/** 发票类型 */
type InvoiceType = "personal" | "company" | "";

/** 销售状态 */
type SalesType = "INIT" | "ON_SALE" | "OFF_SALE";

/** 礼赠单领取状态 */
type AcquireStatusType = "NONE" | "WAIT_ACQUIRE" | "HAD_ACQUIRE" | "CONFIRMED";

/** Method_Delete 常量 */
type DeleteType = "DELETE";

/** Method_Put 常量 */
type PutType = "PUT";

/** 客户状态 */
type UserStatusType = "NORMAL" | "LOCKED" | "CANCEL";

/**
 * 优惠券状态
 * expire过期、usable可用、redeem已用
 */
type CouponStatusType = "expire" | "usable" | "redeem" | "locked";

/** 组件类型
 * Simple 简单组件
 * SearchView 搜索组件
 * ProductView 产品组件
 * ActivityView 活动组件
 * GroupView 轮播图
 * ActivityPageView 活动页
 * CatetoryView 分类组件
 * Label 标签组件
 * */

type PageType =
  | "Simple"
  | "SearchView"
  | "ProductView"
  | "ActivityView"
  | "GroupView"
  | "ActivityPageView"
  | "CatetoryView"
  | "Label";

/** 性别 枚举 */
declare enum Gender {
  未知,
  男,
  女,
}

/** 活动类型 */
type ActivityType = "Popup" | "Fission" | "Sign" | "LuckDraw" | "Customization";

/** 优惠券类型 */
type CouponType = "COUPON" | "TRIAL";

/** 活动状态 */
type ActivityStatus = "NEW" | "ACTIVATE" | "START" | "END";

/** 轮播图片类型 */
type BannerType = "MAIN" | "PRODUCT";

/** 组件类型 */
type ComponentType = "PRODUCT" | "ACTIVITY" | "GROUP";

/** 弹窗频率 */
type PopupTimer = "EveryTime" | "OneTimePerDay" | "OnlyOneTime";

/** 弹窗位置 */
type PopupPosition =
  | "HOME"
  | "PERSONAL_CENTER"
  | "PRODUCT_DETAILS"
  | "ACTIVITY"
  | "CARDCOUPON"
  | "MAINTENANCE";

/**
 * 促销的活动类型
 * GOODS_GIFT("单品-赠送指定礼品"),
   GOODS_GIFT_BY_QUANTITY("单品-根据指定商品购买数量送礼品"),
   GOODS_DISCOUNT("单品-指定商品折扣"),
   GOODS_DISCOUNT_BY_QUANTITY("单品-根据指定商品购买数量折扣"),
   GOODS_DEDUCTION("单品-指定商品直接减价"),
   GOODS_DEDUCTION_BY_QUANTITY("单品-根据指定商品购买数量减价"),
   ORDER_GIFT_RANDOM("整单-赠送指定礼品"),
   ORDER_GIFT_BY_AMOUNT("整单-根据指定商品金额范围送礼品"),
   ORDER_GIFT_BY_AMOUNT_MN("整单-根据指定商品金额范围M选N送礼品"),
   ORDER_GIFT_BY_QUANTITY("整单-根据指定商品数量范围送礼品"),
   ORDER_GIFT_BY_QUANTITY_MN("整单-根据指定商品数量范围M选N送礼品"),
   ORDER_DISCOUNT_BY_AMOUNT("整单-根据指定商品金额范围折扣"),
   ORDER_DISCOUNT_BY_QUANTITY("整单-根据指定商品数量范围折扣"),
   ORDER_DEDUCTION_BY_AMOUNT("整单-根据指定商品金额范围减价"),
   ORDER_DEDUCTION_BY_QUANTITY("整单-根据指定商品数量范围减价"),
   ORDER_DISCOUNT_BY_QUANTITY_CHEAPEST("整单-根据指定商品数量范围，选择价格最低的商品折扣"),
   ORDER_RESET_PRICE_BY_QUANTITY("整单-根据指定商品数量范围直接定价"),
   ORDER_FREE_SHIPPING("整单-免运费")
 */
type PromotionActionType =
  | "GOODS_GIFT"
  | "GOODS_GIFT_BY_QUANTITY"
  | "GOODS_DISCOUNT"
  | "GOODS_DISCOUNT_BY_QUANTITY"
  | "GOODS_DEDUCTION"
  | "GOODS_DEDUCTION_BY_QUANTITY"
  | "ORDER_GIFT_RANDOM"
  | "ORDER_GIFT_BY_AMOUNT"
  | "ORDER_GIFT_BY_AMOUNT_MN"
  | "ORDER_GIFT_BY_QUANTITY"
  | "ORDER_GIFT_BY_QUANTITY_MN"
  | "ORDER_DISCOUNT_BY_AMOUNT"
  | "ORDER_DISCOUNT_BY_QUANTITY"
  | "ORDER_DEDUCTION_BY_AMOUNT"
  | "ORDER_DEDUCTION_BY_QUANTITY"
  | "ORDER_DISCOUNT_BY_QUANTITY_CHEAPEST"
  | "ORDER_RESET_PRICE_BY_QUANTITY"
  | "ORDER_FREE_SHIPPING";

/** 拼团活动状态
 *  all-全部
 *  no_started-未开始
 *  started-已开始
 *  succeed-已成功
 *  cancelled-已取消
 *  failure-已失败
 */
type GroupStatus =
  | "all"
  | "no_started"
  | "started"
  | "succeed"
  | "cancelled"
  | "failure";

/** 禁止退款状态
 *  FORBIDDEN_AFTER_PAID-支付后禁止退款
 *  FORBIDDEN_AFTER_SHIPPED-发货后禁止退款
 */
type DisableRefundType = "FORBIDDEN_AFTER_PAID" | "FORBIDDEN_AFTER_SHIPPED";

/**
 * ORDER-单品
 * GOODs-全单
 */
type PromotionScope = "ORDER" | "GOODS";

/** 积分类型
 *  BP-累计积分（全渠道）
 *  RP-累计兑换积分（全渠道）
 *  ON-累计积分（线上）
 *  OP-累计兑换积分（线上）
 */
type PointTypeGroup = "BP" | "RP" | "ON" | "OP";

/** 会员查询类型 */
type MemberQueryType = "MOBILE" | "UNIONID" | "OPENID" | "MARS_MEMBER_NUM";
