export enum POSITION_ENUM {
  SA = "sales_associate",
  STORE_MANAGER = "store_manager",
  AGENT_STORE_MANAGER = "007",
  BIG_REGION_MANAGER = "001",
  SMALL_REGION_MANAGER = "002",
  TRAINER = "003",
  ADMIN = "009",
}

export const POSITION_ENUM_TEXT = {
  [POSITION_ENUM.SA]: "彩妆师",
  [POSITION_ENUM.STORE_MANAGER]: "店长",
  [POSITION_ENUM.AGENT_STORE_MANAGER]: "代理店长",
  [POSITION_ENUM.BIG_REGION_MANAGER]: "大区经理",
  [POSITION_ENUM.SMALL_REGION_MANAGER]: "区域主管",
  [POSITION_ENUM.TRAINER]: "培训师",
  [POSITION_ENUM.ADMIN]: "管理员",
};

export const OrderStatus = {
  wait_pay: "待支付",
  cancelled: "已取消",
  pay_cancelled: "已支付未发货取消",
  wait_group: "待成团",
  wait_shipment: "待发货",
  success: "已完成",

  wait_receive: "已预约",
  wait_estimate: "已核销",
  expired: "已过期",
};

export type FilterType = {
  label: string;
  value: string;
};

export const StatusFilterList: Array<FilterType> = [
  {
    label: "全部",
    value: "",
  },
  {
    label: "已预约",
    value: "wait_receive",
  },
  {
    label: "已核销",
    value: "wait_estimate",
  },
  {
    label: "已过期",
    value: "expired",
  },
];

export const PointFilterList: Array<FilterType> = [
  {
    label: "全部",
    value: "",
  },
  {
    label: "1000",
    value: "1000",
  },
  {
    label: "2000",
    value: "2000",
  },
  {
    label: "4000",
    value: "4000",
  },
  {
    label: "5000",
    value: "5000",
  },
];

export const structure: Array<FilterType> = [
  {
    label: "会员数",
    value: "memberCounts",
  },
  {
    label: "订单数",
    value: "orderCounts",
  },
  {
    label: "礼品数",
    value: "giftCounts",
  },
];

export const structure2 = [
  "waitReceiveCount",
  "waitEstimateCount",
  "expiredCount",
];
