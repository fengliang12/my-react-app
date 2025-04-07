import { useMemo } from "react";

import { getHeaderHeight } from "@/src/utils/getHeaderHeight";

import { CHeaderType, NavigationBarHandlePropsType } from "./typing";

/**
 * 处理自定义顶部导航
 */
const useNavigationBar = (
  props: NavigationBarHandlePropsType & {
    backgroundImage?: string;
  } = {},
) => {
  const { headerHeight } = getHeaderHeight();
  const navigationBar = useMemo<CHeaderType>(() => {
    const data = {
      //导航背景颜色
      backgroundColor: props.navTitleColor,
      //导航背景图
      backgroundImage: props.navBackgroundImage,
      //导航背景图片透明度(0-1)
      backgroundImageOpacity: (props.navBackgroundImageLight ?? 100) / 100,
      //导航栏标题文字
      title: props.navTitleWord,
      //导航栏标题颜色
      titleColor: props.navTitleWordColor,
      //是否填充
      // fill: false,
      fill: !!props.navFill,
    };
    return data;
  }, [
    props.navBackgroundImage,
    props.navBackgroundImageLight,
    props.navFill,
    props.navTitleColor,
    props.navTitleWord,
    props.navTitleWordColor,
  ]);
  /**
   * 页面填充背景图 即navFill为true时页面显示
   */
  const pageBackgroundImage = useMemo(() => {
    return !navigationBar?.fill ? `url(${props?.backgroundImage})` : "";
  }, [navigationBar?.fill, props?.backgroundImage]);
  /**
   * 内容填充背景 即navFill为false 内容显示背景图
   */
  const contentBackgroundImage = useMemo(() => {
    return navigationBar?.fill ? `url(${props?.backgroundImage})` : "";
  }, [navigationBar?.fill, props?.backgroundImage]);
  /**
   * 页面内容高度设置 减去Header高度
   */
  const contentHeight = useMemo(() => {
    return `calc(100vh - ${headerHeight}px)`;
  }, [headerHeight]);
  /**
   * 判断距离顶部外边距 根据是否填充判断
   */
  const contentMt = useMemo(() => {
    return navigationBar?.fill ? "" : `${headerHeight}px`;
  }, [headerHeight, navigationBar?.fill]);
  return {
    navigationBar,
    /**
     * 顶部导航高度
     */
    headerHeight,
    /**
     * 页面填充背景图 即navFill为true时页面显示
     */
    pageBackgroundImage,
    /**
     * 内容填充背景 即navFill为false 内容显示背景图
     */
    contentBackgroundImage,
    /**
     * 页面内容高度设置 减去Header高度
     */
    contentHeight,
    /**
     * 判断距离顶部外边距 根据是否填充判断
     */
    contentMt,
  };
};

export default useNavigationBar;
