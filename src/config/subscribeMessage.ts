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
  RESERVE: [
    {
      stage: "预约成功通知",
      subscribeId: "h6L_eBHPMcQmHr0Iix3j6JAOcDpPOvyVk-8z-DCWIDU",
    },
    {
      stage: "服务开始提醒",
      subscribeId: "IBfU0ub6tNmnL9FCun0KGnwS_hHvqFUg8ZuRHwZsuNo",
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
    {
      stage: "服务开始提醒",
      subscribeId: "reserveStartRemind",
    },
  ],
  RESERVE: [
    {
      stage: "预约成功通知",
      subscribeId: "h6L_eBHPMcQmHr0Iix3j6JAOcDpPOvyVk-8z-DCWIDU",
    },
    {
      stage: "服务开始提醒",
      subscribeId: "IBfU0ub6tNmnL9FCun0KGnwS_hHvqFUg8ZuRHwZsuNo",
    },
  ],
};

export default config.IS_PRO ? PRO : DEV;
