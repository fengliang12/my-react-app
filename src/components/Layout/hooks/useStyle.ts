import { assign, omit, merge } from "lodash-es";
import { useContext, useMemo, useRef } from "react";
import { getBaseStyle, getReactStyle } from "../helper";
import { LayoutContext, TemplateContext } from "../index";
import usePendantAnimate from "./usePendantAnimate";
import useStore from "./useStore";
import useSwiperCurrent from "./useSwiperCurrent";

export default function useStyle(comInfo) {
  const { wxButtons, tabHeight } = useContext(LayoutContext);
  const { componentType, injectStyle } = useContext(TemplateContext);
  const { updateStyle } = useStore(comInfo);
  const { animateStyle } = usePendantAnimate(comInfo);
  const { swiperCurrentStyle } = useSwiperCurrent(comInfo);
  const trackedRef = useRef<any>("");
  const swiperCurrentStyleMemo = useMemo(() => {
    trackedRef.current = "swiperCurrentStyle";
    return swiperCurrentStyle;
  }, [swiperCurrentStyle]);
  const updateStyleMemo = useMemo(() => {
    trackedRef.current = "updateStyle";
    return updateStyle;
  }, [updateStyle]);
  const baseStyle = useMemo(() => {
    let result: any = merge(
      getBaseStyle(comInfo?.style ?? {}, {
        tabHeight
      }),
      getReactStyle(comInfo?.customData?.miniStyle ?? {}, tabHeight)
    );
    const isWxBtn = wxButtons?.some(x => x.id === comInfo?.id);
    if (isWxBtn) {
      result = omit(result, [
        "position",
        "left",
        "top",
        "right",
        "bottom",
        "zIndex",
        "order",
        "flexGrow",
        "flexShrink",
        "alignSelf",
        "transform",
        "width",
        "height",
        "flex"
      ]);
      result.width = '100%'
      result.height = '100%'
    }
    const isPlaneFirst =
      comInfo.level === 1 &&
      componentType === "plane" &&
      comInfo.type === "view";
    result = assign(
      result,
      omit(animateStyle, "animationName"),
      isPlaneFirst ? injectStyle ?? {} : {},
      updateStyleMemo,
      swiperCurrentStyleMemo
    );
    if (trackedRef.current === "swiperCurrentStyle") {
      result = assign(
        result,
        omit(animateStyle, "animationName"),
        isPlaneFirst ? injectStyle ?? {} : {},
        updateStyleMemo,
        swiperCurrentStyleMemo
      );
    }
    if (trackedRef.current === "updateStyle") {
      result = assign(
        result,
        omit(animateStyle, "animationName"),
        isPlaneFirst ? injectStyle ?? {} : {},
        swiperCurrentStyleMemo,
        updateStyleMemo
      );
    }
    return result;
  }, [
    wxButtons,
    tabHeight,
    comInfo,
    updateStyleMemo,
    animateStyle,
    injectStyle,
    swiperCurrentStyleMemo
  ]);
  const baseClassName: string = useMemo(() => {
    let result = `${comInfo.path ?? comInfo.customData?.path}`;
    if (animateStyle?.animationName) {
      if (!result) {
        result = animateStyle?.animationName;
      } else {
        result = `${result} ${animateStyle?.animationName}`;
      }
    }
    if (comInfo?.customData?.className) {
      if (!result) {
        result = comInfo?.customData?.className;
      } else {
        result = `${result} ${comInfo?.customData?.className}`;
      }
    }
    return result;
  }, [animateStyle?.animationName, comInfo]);

  return {
    baseStyle,
    baseClassName
  };
}
