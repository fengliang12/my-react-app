import { CSSProperties, useContext, useMemo } from "react";

import { LayoutContext } from "../index";

export default function useFullScreen(comInfo) {
  const { tabHeight } = useContext(LayoutContext);
  const fullScreenStyle: CSSProperties = useMemo(() => {
    let result: CSSProperties = {};
    if (["open-move"].includes(comInfo?.openFullScreen ?? "")) {
      result = {
        transition: "400ms",
        zIndex: 9,
        width: "750rpx",
        height: `calc(100vh - ${tabHeight ?? 0}px)`
      };
    }
    return result;
  }, [comInfo, tabHeight]);
  return {
    fullScreenStyle
  };
}
