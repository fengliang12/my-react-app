export enum POSITION_ENUM {
  SA = "sales_associate",
  TEMP_STORE_MANAGER = "temp_store_manager",
  STORE_MANAGER = "store_manager",
  SENIOR_STORE_MANAGER = "senior_store_manager",
  CITY_MANAGER = "city_manager",
  OFFICE_MANAGER = "Admin",
  AREA_MANAGER = "area_manager",
  REGION_MANAGER = "region_manager",
  Retail_Director_South = "retail_director_south",
  Retail_Director_North = "retail_director_north",
  Retail_Operations_Manager = "retail_operations_manager",
  Retail_Operations_Executive = "retail_operations_executive",
}

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
