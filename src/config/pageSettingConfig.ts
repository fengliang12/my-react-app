interface pageSettingConfig {
  //注册页路径
  registerPath: string;
  //首页
  homePath: string;
  //自定义顶部导航默认样式
  navigationBar?: {
    //自定义顶部背景色
    backgroundColor?: string;
    //全局自定义顶部背景透明度是否根据页面滚动变化
    backgroundColorOpacity?: boolean;
    //背景色透明度变化的距离
    backgroundColorOpacityDistance?: number;
    //自定义顶部背景图
    titleColor?: string;
    //自定义普通标题信息
    titleImage?: {
      width: number;
    };
  };
  //弹窗配置
  cPopup?: {
    animateIn?: string; //弹窗进入动画
  };
  //禁用配置页埋点
  disabledPageSettingTracking?: false;
}

const pageSettingConfig: pageSettingConfig = {
  registerPath: "/pages/register/index", //注册页面
  homePath: "/pages/member/member",
  navigationBar: {
    backgroundColor: "#ffffff",
    titleColor: "#000000",
  },
};
export default pageSettingConfig;
