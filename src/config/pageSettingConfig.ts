import type pageSettingConfigType from "../taro-public/model/pageSettingConfig";

const pageSettingConfig: pageSettingConfigType = {
  pageSettingPath: "/taro-public/pages/page-setting/index", //配置页
  pageSettingStatelessPath: "/taro-public/pages/page-setting-stateless/index",
  registerPath: "/pages/register/index", //注册页面
  homePath: "/pages/index/index",
  navigationBar: {
    backgroundColor: "#ffffff",
    titleColor: "#000000",
  },
};
export default pageSettingConfig;
