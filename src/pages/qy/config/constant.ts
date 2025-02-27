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
  title: string;
  key: string;
};

export const StatusFilterList: Array<FilterType> = [
  {
    title: "全部",
    key: "all",
  },
  {
    title: "已预约",
    key: OrderStatusEnum.待付款,
  },
  {
    title: "已核销",
    key: OrderStatusEnum.已完成,
  },
  {
    title: "已过期",
    key: OrderStatusEnum.已取消,
  },
];

export const PointFilterList: Array<FilterType> = [
  {
    title: "全部",
    key: "all",
  },
  {
    title: "1000",
    key: "1000",
  },
  {
    title: "2000",
    key: "2000",
  },
  {
    title: "4000",
    key: "4000",
  },
  {
    title: "5000",
    key: "5000",
  },
];
