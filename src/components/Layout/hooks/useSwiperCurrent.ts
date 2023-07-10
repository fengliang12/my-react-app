import Taro from "@tarojs/taro"
import { useMemoizedFn, useUpdateEffect } from "ahooks"
import { useEffect } from "react"
import { useImmer } from "use-immer"
import { forIn } from "lodash-es"
import { getBaseStyle } from "../helper"
import useStore from "./useStore"


export default function useSwiperCurrent(comInfo) {
    const { swiperCurrent } = comInfo
    const { sCurrent } = useStore(comInfo)
    const [swiperCurrentStyle, setSwiperCurrentStyle] = useImmer({})

    const init = useMemoizedFn(() => {
        // 处理轮播切换样式变更
        swiperCurrentHanlder('init')
    })

    const swiperCurrentHanlder = useMemoizedFn((type?: string) => {
        if (swiperCurrent) {
            const myCurrent = sCurrent ?? 0
            const checkStyle = getBaseStyle(swiperCurrent?.checkedStyle)
            const unCheckStyle = getBaseStyle(swiperCurrent?.unCheckedStyle)
            if (swiperCurrent.swiperCode === 'SWIPERRUN') {
                let swiperCurrentStyle: any = null
                const { current, index, swiperCount } = comInfo.swiperCurrent
                const first =
                    (myCurrent > current &&
                        !(myCurrent === swiperCount - 1 && current === 0)) ||
                    (myCurrent === 0 && current === swiperCount - 1)
                const last =
                    (myCurrent < current &&
                        !(myCurrent === 0 && current === swiperCount - 1)) ||
                    (myCurrent === swiperCount - 1 && current === 0)
                if (index === 0) {
                    swiperCurrentStyle = first
                        ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle)
                        : getBaseStyle(comInfo?.swiperCurrent?.checkedStyle)
                }
                if (index === 1) {
                    swiperCurrentStyle = first
                        ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle)
                        : last
                            ? getBaseStyle(comInfo?.swiperCurrent?.checkedStyle)
                            : { left: '0rpx' }
                }
                if (index === 2) {
                    swiperCurrentStyle = last
                        ? getBaseStyle(comInfo?.swiperCurrent?.unCheckedStyle)
                        : getBaseStyle(comInfo?.swiperCurrent?.checkedStyle)
                }
                if (type !== 'init') {
                    setSwiperCurrentStyle((draft: any) => {
                        forIn(swiperCurrentStyle, (value, key) => {
                            draft[key] = value
                        })
                    })
                }
            } else {
                if (myCurrent === swiperCurrent?.current) {
                    if (type === 'init') {
                        setSwiperCurrentStyle((draft: any) => {
                            forIn(unCheckStyle, (value, key) => {
                                draft[key] = value
                            })
                        })
                        Taro.nextTick(() => {
                            setSwiperCurrentStyle((draft: any) => {
                                forIn(checkStyle, (value, key) => {
                                    draft[key] = value
                                })
                            })
                        })
                    } else {
                        setSwiperCurrentStyle((draft: any) => {
                            forIn(checkStyle, (value, key) => {
                                draft[key] = value
                            })
                        })
                    }
                } else {
                    setSwiperCurrentStyle((draft: any) => {
                        forIn(unCheckStyle, (value, key) => {
                            draft[key] = value
                        })
                    })
                }
            }
        }
    })

    useUpdateEffect(() => {
        swiperCurrentHanlder()
    }, [sCurrent])

    useEffect(() => {
        init()
    }, [comInfo])

    return {
        swiperCurrentStyle
    }
}