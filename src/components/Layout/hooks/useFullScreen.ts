import { assign } from "lodash-es"
import { CSSProperties, useMemo, useContext } from "react"
import { LayoutContext, FullScreemContext } from "../index"

export default function useFullScreen(comInfo) {
  const { tabHeight, navHeight } = useContext(LayoutContext)
  const { fullScreen } = useContext(FullScreemContext)
  const fullScreenStyle: CSSProperties = useMemo(() => {
    const result: CSSProperties = {}
    if (["zoom", "open", "open-move"].includes(comInfo?.openFullScreen ?? "")) {
      if (fullScreen) {
        assign(result, {
          transition: "400ms",
          zIndex: 9,
          width: "100vw",
          height: `calc(100vh - ${navHeight || "0px"} - ${tabHeight ?? "0px"})`,
        })
      } else {
        assign(result, {
          transition: "400ms",
        })
      }
    }
    return result
  }, [])
  return {
    fullScreenStyle,
  }
}
