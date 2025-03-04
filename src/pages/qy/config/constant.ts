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

export enum OrderStatusEnum {
  待付款 = "wait_pay",
  已取消 = "cancelled",
  已支付未发货取消 = "pay_cancelled",
  待成团 = "wait_group",
  待发货 = "wait_shipment",
  待收货 = "wait_receive",
  待评价 = "wait_estimate",
  已完成 = "success",
}

export const OrderStatus = {
  wait_pay: OrderStatusEnum.待付款,
  cancelled: OrderStatusEnum.已取消,
  pay_cancelled: OrderStatusEnum.已支付未发货取消,
  wait_group: OrderStatusEnum.待成团,
  wait_shipment: OrderStatusEnum.待发货,
  wait_receive: OrderStatusEnum.待收货,
  wait_estimate: OrderStatusEnum.待评价,
  success: OrderStatusEnum.已完成,
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
    value: OrderStatusEnum.待付款,
  },
  {
    label: "已核销",
    value: OrderStatusEnum.已完成,
  },
  {
    label: "已过期",
    value: OrderStatusEnum.已取消,
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
