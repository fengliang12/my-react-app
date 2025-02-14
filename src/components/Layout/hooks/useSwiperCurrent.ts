import Taro from "@tarojs/taro";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { isNil } from "lodash-es";
import { useContext, useEffect, useState } from "react";
import { getBaseStyle, parsingActions } from "../helper";
import useStore from "./useStore";
import { LayoutContext } from "../index";

export default function useSwiperCurrent(comInfo) {
  const { pageId } = useContext(LayoutContext);
  const { swiperCurrent, customData } = comInfo;
  const { sCurrent } = useStore(comInfo);
  const [swiperCurrentStyle, setSwiperCurrentStyle] = useState<any>({});
  const [swiperCurrentSrc, setSwiperCurrentSrc] = useState();
  const [swiperCurrentNodes, setSwiperCurrentNodes] = useState<any>();

  const init = useMemoizedFn(() => {
    // 处理轮播切换样式变更
    swiperCurrentHanlder("init");
  });

  const swiperCurrentHanlder = useMemoizedFn((type?: string) => {
    if (swiperCurrent) {
      const myCurrent = sCurrent ?? 0;
      const checkStyle = getBaseStyle(swiperCurrent?.checkedStyle, {
        noBorderBox: true
      });
      const unCheckStyle = getBaseStyle(swiperCurrent?.unCheckedStyle, {
        noBorderBox: true
      });
      if (swiperCurrent.swiperCode === "SWIPERRUN") {
        let newSwiperCurrentStyle: any = null;
        const { current, index, swiperCount } = comInfo.swiperCurrent;
        const first =
          (myCurrent > current &&
            !(myCurrent === swiperCount - 1 && current === 0)) ||
          (myCurrent === 0 && current === swiperCount - 1);
        const last =
          (myCurrent < current &&
            !(myCurrent === 0 && current === swiperCount - 1)) ||
          (myCurrent === swiperCount - 1 && current === 0);
        if (index === 0) {
          newSwiperCurrentStyle = first
            ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle, {
              noBorderBox: true
            })
            : getBaseStyle(comInfo?.swiperCurrent?.checkedStyle, {
              noBorderBox: true
            });
        }
        if (index === 1) {
          newSwiperCurrentStyle = first
            ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle)
            : last
              ? getBaseStyle(comInfo?.swiperCurrent?.checkedStyle)
              : { left: "0rpx" };
        }
        if (index === 2) {
          newSwiperCurrentStyle = last
            ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle)
            : getBaseStyle(comInfo?.swiperCurrent?.checkedStyle);
        }
        if (type !== "init") {
          setSwiperCurrentStyle(newSwiperCurrentStyle);
        }
      } else {
        if (myCurrent === swiperCurrent?.current) {
          if (type === "init") {
            setSwiperCurrentStyle(unCheckStyle);
            Taro.nextTick(() => {
              setSwiperCurrentStyle(checkStyle);
            });
          } else {
            setSwiperCurrentStyle(checkStyle);
          }
        } else {
          setSwiperCurrentStyle(unCheckStyle);
        }
      }
    }
    if (customData?.swiperCurrent) {
      const myCurrent = sCurrent ?? 0;
      const { defaultSrc, list } = customData?.swiperCurrent;
      let currentSrc = null;
      list?.forEach(x => {
        if (x.current === myCurrent) {
          currentSrc = x.src;
        }
      });
      if (isNil(currentSrc)) {
        currentSrc = defaultSrc;
      }
      if (!isNil(currentSrc)) {
        setSwiperCurrentSrc(currentSrc);
      }
    }
    if (customData?.swiperCurrentAction) {
      const myCurrent = sCurrent ?? 0;
      const {
        current,
        checkAction,
        unCheckAction
      } = customData?.swiperCurrentAction;
      if (current === myCurrent) {
        parsingActions(checkAction ?? [], pageId, {});
      } else {
        parsingActions(unCheckAction ?? [], pageId, {});
      }
    }
    if (customData?.swiperCurrentNodes) {
      setSwiperCurrentNodes(((sCurrent ?? 0) + 1) + '')
    }
  });

  useUpdateEffect(() => {
    swiperCurrentHanlder();
  }, [sCurrent]);

  useEffect(() => {
    init();
  }, [comInfo]);

  return {
    swiperCurrentStyle,
    swiperCurrentSrc,
    swiperCurrentNodes
  };
}
