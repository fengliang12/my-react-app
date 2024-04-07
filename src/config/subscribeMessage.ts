import config from "@/config/index";

const DEV = {
  REGISTER: [
    {
      stage: "注册成功提醒",
      subscribeId: "register",
    },
  ],
  SERVICE: [
    {
      stage: "预约成功通知",
      subscribeId: "reserveSuccess",
    },
  ],
  REDEEM: [
    {
      stage: "商品兑换成功通知",
      subscribeId: "orderPaid",
    },
    {
      stage: "快递发货通知",
      subscribeId: "orderSend",
    },
  ],
  SERVICE_CANCEL: [
    {
      stage: "预约取消通知",
      subscribeId: "reserveCancel",
    },
  ],
};

const PRO = {
  REGISTER: [
    {
      stage: "注册成功提醒",
      subscribeId: "register",
    },
  ],
  SERVICE: [
    {
      stage: "预约成功通知",
      subscribeId: "reserveSuccess",
    },
  ],
  REDEEM: [
    {
      stage: "商品兑换成功通知",
      subscribeId: "orderPaid",
    },
    {
      stage: "快递发货通知",
      subscribeId: "orderSend",
    },
  ],
  SERVICE_CANCEL: [
    {
      stage: "预约取消通知",
      subscribeId: "reserveCancel",
    },
  ],
};

export default config.IS_PRO ? PRO : DEV;
