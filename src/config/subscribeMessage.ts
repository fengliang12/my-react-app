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
    {
      stage: "服务开始提醒",
      subscribeId: "reserveStartRemind",
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
    // {
    //   stage: "服务开始提醒",
    //   subscribeId: "reserveStartRemind",
    // },
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
};

export default config.IS_PRO ? PRO : DEV;
