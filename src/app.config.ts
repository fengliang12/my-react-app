export default {
  pages: [
    "pages/index/index",
    "pages/h5/index",
    "pages/user/index",
    "pages/activity/index",
    "pages/bind/index",
    "pages/coupon/index",
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
      pages: ["history/index", "orderList/index"],
    },
  ],
  tabBar: {
    backgroundColor: "#fff",
    borderStyle: "white",
    color: "#b2b2b2",
    selectedColor: "#000",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/image/tabbar/home_2.png",
        selectedIconPath: "assets/image/tabbar/home_3.png",
      },
      {
        pagePath: "pages/user/index",
        text: "个人中心",
        iconPath: "assets/image/tabbar/user_4.png",
        selectedIconPath: "assets/image/tabbar/user_1.png",
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
