import "src/assets/scss/front.scss";

import { Text, View } from "@tarojs/components";
import Taro, { usePageScroll } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";

import config from "@/src/config";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import easycolor from "@/utils/easycolor";
import { getHeaderHeight } from "@/utils/getHeaderHeight";
import { getPages } from "@/utils/getPages";
import to from "@/utils/to";

import CImage from "../CImage";

export interface CHeaderType {
  //是否填充
  fill: boolean;
  //背景图
  backgroundImage: string;
  //背景色
  backgroundColor: string;
  //是否根据页面滚动变化背景透明度
  backgroundColorOpacity: boolean;
  //背景色透明度变化的距离
  backgroundColorOpacityDistance: number;
  //标题图
  titleImage: string;
  //页面标题
  title: string;
  //标题颜色
  titleColor: string;
  //是否显示返回icon
  back: boolean;
  children?: React.ReactNode;
  titleCss: string;
  titleImageWidth: number;
}
const CHeader: React.FC<Partial<CHeaderType>> = (props) => {
  // let a = a ? 123 : 100;
  const { navigationBar, homePath } = pageSettingConfig;
  let {
    fill = true,
    backgroundImage = "",
    backgroundColor = navigationBar?.backgroundColor ?? "",
    backgroundColorOpacity = navigationBar?.backgroundColorOpacity ?? false,
    backgroundColorOpacityDistance = navigationBar?.backgroundColorOpacityDistance ??
      100,
    titleImage = "",
    title = "",
    titleColor = navigationBar?.titleColor ?? "",
    back = true,
    titleCss = "",
    titleImageWidth = navigationBar?.titleImage?.width,
  } = props;

  const [rect, setRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [icon, setIcon] = useState<string>("");
  useEffect(() => {
    const rectInfo = getHeaderHeight();
    setBackIcon();
    setRect(rectInfo);
    setHeaderHeight(rectInfo.headerHeight);
  }, []);
  const setBackIcon = () => {
    let tabbarPageList = [];
    //过滤tabbar页面
    if (__wxConfig?.tabBar?.list?.length) {
      tabbarPageList = __wxConfig.tabBar.list.map(
        (elem: { pagePath: string }) => elem?.pagePath?.split(".")[0],
      );
    }
    const hideIconPage: Set<any> = new Set(tabbarPageList);
    const pageList = getPages<false>({ getCurrentPage: false });
    const route = pageList[pageList.length - 1].route;
    if (hideIconPage.has(route)) {
      return;
    }
    setIcon(pageList.length > 1 ? "back" : "home");
  };
  const backFn = () => {
    if (!icon) return;
    if (icon === "home") {
      let tabbarPageList = [];
      if (__wxConfig?.tabBar?.list?.length) {
        tabbarPageList = __wxConfig.tabBar.list.map(
          (elem: { pagePath: string }) => elem?.pagePath?.split(".")[0],
        );
      }
      if (tabbarPageList?.length) {
        to(`/${tabbarPageList[0]}`, "switchTab");
      } else {
        to(homePath, "reLaunch");
      }
    } else {
      to(1);
    }
  };

  const [opacity, setOpacity] = useState<number>(0);
  const [bgc, setBgc] = useState<string>(backgroundColor);
  useEffect(() => {
    if (!backgroundColorOpacity) return;
    const color = easycolor(backgroundColor || "transparent");
    color.a = opacity;
    setBgc(color.toRgbString());
  }, [opacity, backgroundColor, backgroundColorOpacity]);

  usePageScroll(({ scrollTop }) => {
    if (!backgroundColorOpacity) return;
    const op = Math.min(
      1,
      +(scrollTop / backgroundColorOpacityDistance).toFixed(2),
    );
    setOpacity(op);
  });

  const click = useMemoizedFn(() => {
    if (config?.debuggerClass?.toDebug && config.env === "qy") {
      config.debuggerClass.toDebug();
    }
  });

  return (
    <>
      {rect && (
        <View
          className="flex w-screen fixed top-0 overflow-hidden z-11000"
          style={`height: ${headerHeight}Px; background-color:${bgc}; transition: all .2s`}
        >
          <View
            className="flex items-center  w-screen justify-center z-10"
            style={`height:${rect.height}Px;margin-top:${rect.top}Px;`}
            onClick={click}
          >
            {props.children}
            {back && (
              <View
                style={`color:${titleColor}`}
                onClick={() => backFn()}
                className={`iconfont icon-${icon} iconSize text-28Px absolute left-20Px`}
              ></View>
            )}
            {title && !titleImage && (
              <Text
                className="text-16Px text-center w-400 truncate"
                style={`color:${titleColor};${titleCss}`}
              >
                {title}
              </Text>
            )}
            {titleImage && (
              <CImage
                className="w-144"
                mode="widthFix"
                style={`width:${
                  titleImageWidth ? `${titleImageWidth}Px` : ""
                };height:0;${titleCss}`}
                src={titleImage}
              ></CImage>
            )}
          </View>
          {backgroundImage && (
            <CImage
              className="w-full absolute top-0 left-0 border-white"
              src={backgroundImage}
              mode="widthFix"
            ></CImage>
          )}
        </View>
      )}
      {fill && <View style={`height:${headerHeight}Px`}> </View>}
    </>
  );
};
export default CHeader;
