import { assign, cloneDeep, omit, trim } from "lodash-es"
import { CSSProperties, useMemo } from "react"
import { getBaseStyle } from "../helper"
import useCustomData from "./useCustomData"
import useLive from "./useLive"
import useStore from "./useStore"
import useStyle from "./useStyle"
import useSwiperCurrent from "./useSwiperCurrent"


export default function useView({ comInfo, comIndex }) {
    const { sNavCurrent } = useStore(comInfo)
    const { baseStyle, baseClassName } = useStyle(comInfo)
    const { liveStyle } = useLive(comInfo)
    const { customStyle, customClassName } = useCustomData(comInfo)
    const { swiperCurrentStyle } = useSwiperCurrent(comInfo)
    const viewStyle = useMemo(() => {
        let result: CSSProperties = cloneDeep(baseStyle)
        if (comInfo?.movable) {
            result = omit(result, [
                'position',
                'left',
                'top',
                'right',
                'bottom',
                'zIndex'
            ])
        }
        // 轮播导航样式处理
        const swiperCurrent = sNavCurrent || 0
        if (comInfo?.swiperNav?.current === swiperCurrent && comInfo?.swiperNav?.type === 'point') {
            result = assign(result, getBaseStyle(comInfo?.swiperNav?.currentStyle))
        }
        if (comInfo?.swiperNav?.type === 'line' && comInfo?.swiperNav?.swiperId) {
            result = assign(result, {
                width: `${((swiperCurrent + 1) / comInfo?.swiperNav?.swiperCount) * 100}%`,
                transition: '500ms'
            })
        }
        if (comInfo?.swiperNav?.type === 'move-line' && comInfo?.swiperNav?.swiperId) {
            result = assign(result, {
                width: `${(1 / comInfo?.swiperNav?.swiperCount) * 100}%`,
                left: `${Math.ceil((swiperCurrent / comInfo?.swiperNav?.swiperCount) * 100)}%`
            })
        }
        result = { overflow: 'hidden', ...result }
        return assign(result, liveStyle, customStyle, swiperCurrentStyle) ?? {}
    }, [baseStyle, comInfo, sNavCurrent, liveStyle, customStyle, swiperCurrentStyle])

    const viewClassName = useMemo(() => {
        let result = " "
        if (baseClassName) {
            result = result + baseClassName
        }
        if (customClassName) {
            result = result + customClassName
        }
        return trim(result)
    }, [baseClassName, customClassName])

    return {
        viewStyle,
        viewClassName
    }
}
