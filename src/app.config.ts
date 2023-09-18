export default {
  pages: [
    "pages/tabbar/index/index",
    "pages/tabbar/user/index",
    "pages/activity/index",
    "pages/h5/index",
    "pages/update/index",
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
        "orderList/index",
        "orderDetail/index",
        "confirm/index",
        "success/index",
      ],
    },
    {
      root: "subPages/common",
      name: "common",
      pages: ["pointsDetail/index", "consumeRecord/index"],
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
    {
      root: "subPages/coupon",
      name: "coupon",
      pages: ["index"],
    },
    {
      root: "subPages/nearby-stores",
      name: "nearby-stores",
      pages: ["index"],
    },
  ],
  tabBar: {
    backgroundColor: "#000000",
    borderStyle: "white",
    color: "#999999",
    selectedColor: "#FFFFFF",
    list: [
      {
        pagePath: "pages/tabbar/index/index",
        text: "先锋礼遇",
        iconPath: "assets/image/tabbar/home02.jpg",
        selectedIconPath: "assets/image/tabbar/home.jpg",
      },
      {
        pagePath: "pages/tabbar/user/index",
        text: "个人中心",
        iconPath: "assets/image/tabbar/user02.jpg",
        selectedIconPath: "assets/image/tabbar/user.jpg",
      },
    ],
  },
  requiredPrivateInfos: ["getLocation"],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于定位附近的门店信息",
    },
  },
  __usePrivacyCheck__: true,
};
