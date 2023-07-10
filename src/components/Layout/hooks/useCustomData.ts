import Taro from "@tarojs/taro"
import { useMemoizedFn, useUpdateEffect } from "ahooks"
import { startsWith } from "lodash-es"
import { CSSProperties, useRef, useEffect, useState } from "react"
import { useImmer } from "use-immer"
import usePage from './usePage'

export default function useCustomData(comInfo) {
    const { customData } = comInfo
    const { isNowPage } = usePage()
    const [customStyle, setCustomStyle] = useImmer<CSSProperties>({})
    const [customClassName, setCustomClassName] = useState<string>('')
    const clearRef: any = useRef()
    const init = useMemoizedFn(() => {
        animationInit()
    })

    const animationInit = useMemoizedFn(() => {
        if (customData?.animation) {
            const customAnimation: AnimationType = customData?.animation
            const fn = () => {
                Taro.nextTick(() => {
                    const isAnimate = startsWith(customAnimation.style.animationName, 'animate__')
                    if (isAnimate) {
                        setCustomClassName(customAnimation.style.animationName as string)
                    }
                    setCustomStyle(draft => {
                        if (!isAnimate) {
                            draft.animationName = customAnimation.style.animationName
                        }
                        draft.animationDelay = customAnimation.style.animationDelay
                        draft.animationDuration = customAnimation.style.animationDuration
                        draft.animationIterationCount = customAnimation.style.animationIterationCount
                        draft.animationTimingFunction = customAnimation.style.animationTimingFunction
                    })
                    const [nextTime, duration, delay] = [parseInt(customAnimation.nextTime ?? '0'), parseInt(customAnimation.style.animationDuration ?? '0'), parseInt(customAnimation.style.animationDelay ?? "0")]
                    if (nextTime && customAnimation.style.animationDuration && customAnimation.style.animationIterationCount !== 'infinite') {
                        setTimeout(() => {
                            if (isAnimate) {
                                setCustomClassName("")
                            } else {
                                setCustomStyle(draft => {
                                    draft.animationName = ""
                                })
                            }
                        }, duration + delay)
                    }
                    if (nextTime) {
                        clearRef.current = setTimeout(fn, nextTime)
                    }
                })
            }
            fn()
        }
    })

    useUpdateEffect(() => {
        if (!isNowPage && clearRef.current) {
            clearTimeout(clearRef.current)
            clearRef.current = null
        }
        if (isNowPage && !clearRef.current) {
            init()
        }
    }, [isNowPage])

    useEffect(() => {
        init()
    }, [comInfo])

    return {
        customStyle,
        customClassName
    }
}


type AnimationType = {
    /** 动画样式配置 */
    style: CSSProperties
    /** 下次触发动画时间 */
    nextTime: string
}
