import { isNil } from 'lodash-es';
import { useUpdateEffect, useMemoizedFn } from 'ahooks';
import { useContext, useMemo } from "react"
import useStore from "./useStore"
import { LayoutContext, TemplateContext } from '../index'
import useSwiperCurrent from "./useSwiperCurrent"
import useHanlder from './useHanlder';
import { store } from '../store/index';



type SwiperNavImg = {
    index: number
    src: string
}

export default function useImage({ comInfo, comIndex, parentIndex }) {
    const { id, level, swiperNav, type, image, customData } = comInfo
    const { pageId } = useContext(LayoutContext)
    const { templateCode, templateName, componentType, iconSlot } = useContext(TemplateContext)
    const { sNavCurrent, updateSrc } = useStore(comInfo)
    const { swiperCurrentStyle } = useSwiperCurrent(comInfo)
    const { autoHanlderEvent } = useHanlder(comInfo)
    const swiperNavImgs: SwiperNavImg[] = useMemo(() => {
        let result: SwiperNavImg[] = []
        if (swiperNav?.type === 'image' && type === 'image') {
            result = swiperNav?.currentImgs.map((c, index) => ({
                index,
                src: c
            }))
        }
        return result
    }, [swiperNav, type])
    const swiperNavImg: SwiperNavImg | undefined = useMemo(() => {
        const img = swiperNavImgs?.find(x => x.index === (sNavCurrent ?? 0))
        if (img?.src === image.src) {
            return img
        }
        return
    }, [swiperNavImgs, sNavCurrent])

    // ICON组件插槽
    const slot = useMemo(() => {
        let result: any = null
        if (level === 3 && parentIndex === 0 && templateCode === 'ICON' && componentType === 'window') {
            result = iconSlot?.find(x => {
                if (x.name) {
                    return x.name === templateName && x.index === comIndex
                } else {
                    return x.index === comIndex
                }
            })
        }
        return result
    }, [iconSlot, componentType, level, comIndex])
    // 是否是ICON组件的扩展图片
    const isIconExtend = useMemo(() => {
        let result = false
        if (level === 3 && parentIndex === 1 && templateCode === 'ICON' && componentType === 'window') {
            result = true
        }
        return result
    }, [componentType, level])
    const isOpenEvent = useMemo(() => {
        let result = true
        if (swiperNav?.type === 'double-more-image') {
            if (customData && !isNil(customData?.bigIndex)) {
                // 小分类图片处理
                const { checkSrc } = customData
                if (swiperNav?.current === sNavCurrent) {
                    if (updateSrc === checkSrc) {
                        result = false
                    }
                }
            }
            if (customData && isNil(customData?.bigIndex)) {
                // 大分类图片处理
                const { currentList, checkSrc } = customData
                if (currentList.includes(sNavCurrent)) {
                    if (updateSrc === checkSrc) {
                        result = false
                    }
                }
            }
        }
        return result
    }, [sNavCurrent, customData])
    // 轮播导航多图-触发当前事件
    const swiperNavHalder = useMemoizedFn(() => {
        if (swiperNav?.type === 'more-image') {
            if (swiperNav?.current === sNavCurrent) {
                autoHanlderEvent(comInfo?.event?.[0]?.actions, false, null)
            }
        }
        if (swiperNav?.type === 'double-more-image') {
            if (customData && !isNil(customData?.bigIndex)) {
                // 小分类图片处理
                const { currentList, checkSrc, unCheckSrc } = customData
                if (currentList.includes(sNavCurrent)) {
                    store.setStyle({
                        key: id,
                        value: {
                            position: 'relative',
                            left: '0px',
                            opacity: '1'
                        }
                    }, pageId)
                } else {
                    store.setStyle({
                        key: id,
                        value: {
                            position: 'absolute',
                            left: '-750px',
                            opacity: '0'
                        }
                    }, pageId)
                }
                if (swiperNav?.current === sNavCurrent) {
                    if (updateSrc !== checkSrc) {
                        store.setCom({
                            key: id,
                            value: checkSrc,
                            type: 'src'
                        }, pageId)
                    }
                } else {
                    if (updateSrc !== unCheckSrc) {
                        store.setCom({
                            key: id,
                            value: unCheckSrc,
                            type: 'src'
                        }, pageId)
                    }
                }
            }
            if (customData && isNil(customData?.bigIndex)) {
                // 大分类图片处理
                const { currentList, checkSrc, unCheckSrc } = customData
                if (currentList.includes(sNavCurrent)) {
                    if (updateSrc !== checkSrc) {
                        store.setCom({
                            key: id,
                            value: checkSrc,
                            type: 'src'
                        }, pageId)
                    }
                } else {
                    if (updateSrc !== unCheckSrc) {
                        store.setCom({
                            key: id,
                            value: unCheckSrc,
                            type: 'src'
                        }, pageId)
                    }
                }
            }
        }
    })

    useUpdateEffect(() => {
        swiperNavHalder()
    }, [sNavCurrent, swiperNav])
    return {
        swiperCurrentStyle,
        swiperNavImgs,
        swiperNavImg,
        slot,
        isIconExtend,
        isOpenEvent
    }
}
