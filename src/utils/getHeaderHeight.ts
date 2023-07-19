// 获取自定义导航高度

import Taro from "@tarojs/taro";

//获取顶部导航高度
export const getHeaderHeight = () => {
  const rect = Taro.getMenuButtonBoundingClientRect();
  return {
    ...rect,
    headerHeight: rect.bottom + 10,
  };
};
