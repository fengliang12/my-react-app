import { omit, assign, cloneDeep } from "lodash-es"
import { CSSProperties, useMemo, useContext } from "react"
import { LayoutContext, TemplateContext } from "../index"
import useAnimate from "./useAnimate"
import useStore from "./useStore"


export default function useStyle(comInfo) {
    const { wxButtons } = useContext(LayoutContext)
    const { componentType, injectStyle } = useContext(TemplateContext)
    const { updateStyle } = useStore(comInfo)
    const { animateStyle } = useAnimate(comInfo)
    const baseStyle: CSSProperties = useMemo(() => {
        let result: CSSProperties = cloneDeep(comInfo?.style)
        const isWxBtn = wxButtons?.some(x => x.id === comInfo?.id)
        if (isWxBtn) {
            result = omit(result, [
                'position',
                'left',
                'top',
                'right',
                'bottom',
                'zIndex',
                'order',
                'flexGrow',
                'flexShrink',
                'alignSelf'
            ])
        }
        const isWindowFirst = comInfo.level === 1 && componentType === 'window'
        const isPlaneFirst = comInfo.level === 1 && componentType === 'plane'
        return assign(result, omit(animateStyle, 'animationName'), isPlaneFirst ? (injectStyle ?? {}) : {}, isWindowFirst ? {} : updateStyle)
    }, [wxButtons, comInfo, updateStyle, animateStyle?.opacity, injectStyle])
    const baseClassName: string = useMemo(() => {
        let result = `${comInfo.path}`
        if (animateStyle?.animationName) {
            if (!result) {
                result = animateStyle?.animationName
            } else {
                result = `${result} ${animateStyle?.animationName}`
            }
        }
        return result
    }, [animateStyle?.opacity])
    return {
        baseStyle,
        baseClassName
    }
}
