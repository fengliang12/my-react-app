import Taro from "@tarojs/taro"
import { useMemoizedFn, useUpdateEffect } from "ahooks"
import { CSSProperties, useContext } from "react"
import { useImmer } from "use-immer"
import { LiveTemplateContext } from "../index"

// 直播状态60秒钟更新一次

export default function useLive(comInfo) {
    const { liveStatus, parentId } = comInfo
    const { liveData } = useContext(LiveTemplateContext)
    const [liveStyle, setLiveStyle] = useImmer<CSSProperties>({})
    const init = useMemoizedFn(() => {
        // 直播组件特殊样式
        const live = liveData?.find(x => x.id === parentId)
        if (live) {
            if (liveStatus?.includes(live.liveStatus)) {
                Taro.nextTick(() => setLiveStyle((draft) => {
                    draft.position = 'static'
                    draft.display = 'flex'
                    draft.left = '1500px'
                }))
            } else {
                Taro.nextTick(() => setLiveStyle((draft) => {
                    draft.position = 'absolute'
                    draft.display = 'flex'
                    draft.left = '1500px'
                }))
            }
        }
    })

    useUpdateEffect(() => {
        init()
    }, [liveData])
    return {
        liveStyle
    }
}
