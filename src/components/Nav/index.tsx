import "./index.less";

import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Back } from "@/assets/image/index";

export type NavType = {
  /** 导航标题 */
  title?: string;
  /** 导航图片 */
  titleImage?: string;
  /** 字体颜色 */
  titleColor?: string;
  /** 是否占位 */
  placeholder?: boolean;
  /** 背景色 */
  backgroundColor?: string;
  /** Logo类型 */
  logo?: "black" | "white";
};

const app = Taro.getApp();

const Nav: React.FC<NavType> = ({
  title,
  titleImage = "",
  placeholder,
  backgroundColor,
  logo = "black",
}) => {
  const dispatch = useDispatch();
  const [navConfig, setNavConfig] = useSetState<any>({
    statusBarHeight: 0,
    navHeight: 0,
    isNeedBack: false,
  });
  const init = useMemoizedFn(() => {
    const systemInfo: any = Taro.getSystemInfoSync();
    const menuInfo = Taro.getMenuButtonBoundingClientRect();
    const pages = Taro.getCurrentPages();
    const navHeight =
      menuInfo.height +
        systemInfo.statusBarHeight +
        4 +
        (menuInfo.top - systemInfo.statusBarHeight) * 2 ?? 88;
    // store.setNavHeight(navHeight)
    dispatch({
      type: "SET_COMMON",
      payload: {
        navHeight: navHeight,
      },
    });
    setNavConfig({
      statusBarHeight: systemInfo.statusBarHeight,
      navHeight,
      isNeedBack: pages.length > 1,
    });
  });
  const back = useMemoizedFn((e) => {
    e.stopPropagation?.();
    app.to(1);
  });
  const toTop = useMemoizedFn(() => {
    Taro.pageScrollTo({
      scrollTop: 0,
    });
  });
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <View
        className="nav"
        style={{
          paddingTop: `${navConfig.statusBarHeight}px`,
          height: `${navConfig.navHeight}px`,
          backgroundColor: backgroundColor ?? "transparent",
        }}
      >
        {navConfig.isNeedBack && (
          <View
            className="left"
            onClick={back}
            style={{
              top: `${navConfig.statusBarHeight}px`,
              height: `${navConfig.navHeight - navConfig.statusBarHeight}px`,
            }}
          >
            <Image className="back" src={Back} mode="widthFix" />
          </View>
        )}
        <View className="center" onClick={toTop}>
          {title}
          {titleImage && (
            <Image className="logo" src={titleImage} mode="widthFix"></Image>
          )}
        </View>
      </View>
      {placeholder && (
        <View
          style={{ width: "100vw", height: `${navConfig.navHeight}px` }}
        ></View>
      )}
    </>
  );
};

export default Nav;
