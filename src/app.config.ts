export default {
  pages: [
    "pages/index/index",
    "pages/h5/index",
    "pages/user/index",
    "pages/activity/index",
    "pages/bind/index",
    "pages/coupon/index",
    "pages/register/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "NARS会员中心",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
    backgroundColor: "#ffffff",
  },
  subpackages: [
    {
      root: "subPages/redeem",
      name: "redeem",
      pages: [
        "index",
        "history/index",
        "orderList/index",
        "orderDetail/index",
        "confirm/index",
        "success/index",
      ],
    },
    {
      root: "subPages/service-appointment",
      name: "serviceAppointment",
      pages: [
        "index",
        "introduce/index",
        "appointment/index",
        "detail/index",
        "list/index",
      ],
    },
  ],
  tabBar: {
    backgroundColor: "#000000",
    borderStyle: "white",
    color: "#FFFFFF",
    selectedColor: "#FFFFFF",
    list: [
      {
        pagePath: "pages/index/index",
        text: "先锋礼遇",
        iconPath: "assets/image/tabbar/home.jpg",
        selectedIconPath: "assets/image/tabbar/home.jpg",
      },
      {
        pagePath: "pages/activity/index",
        text: "NARS妆园",
        iconPath: "assets/image/tabbar/activity.jpg",
        selectedIconPath: "assets/image/tabbar/activity.jpg",
      },
      {
        pagePath: "pages/user/index",
        text: "个人中心",
        iconPath: "assets/image/tabbar/user.jpg",
        selectedIconPath: "assets/image/tabbar/user.jpg",
      },
    ],
  },
  requiredPrivateInfos: ["getFuzzyLocation"],
  permission: {
    "scope.userFuzzyLocation": {
      desc: "你的位置信息将用于定位附近的门店信息",
    },
  },
};
