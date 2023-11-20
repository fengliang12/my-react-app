import React, { CSSProperties, useContext, useMemo, useRef } from "react"
import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { omit, assign, cloneDeep } from 'lodash-es'
import { getDomId, getHotStyle, safeFn } from "../../../helper"
import ImagePR from '../../ImagePR'
import { LayoutContext, TemplateContext } from '../../../index'
import useHanlder from "../../../hooks/useHanlder"
import useStore from "../../../hooks/useStore"
import useStyle from "../../../hooks/useStyle"
import useFullScreen from "../../../hooks/useFullScreen"
import { store } from "../../../store"
import useCountDown from "../../../hooks/useCountDown"
import useImage from "../../../hooks/useImage"
import ButtonAuth from "../../ButtonAuth"


type ProImageProps = {
  comInfo: Edit.IComponents
  comIndex: number
  parentIndex?: number
}


const ProImage: React.FC<ProImageProps> = ({ comInfo, comIndex, parentIndex }) => {
  const { pageId } = useContext(LayoutContext)
  const { templateCode, templateName, templateIndex, templateCustomData } = useContext(TemplateContext)
  const { updateSrc } = useStore(comInfo)
  const { baseStyle } = useStyle(comInfo)
  const { swiperCurrentStyle, swiperNavImg, swiperNavImgs, slot, isIconExtend, isOpenEvent } = useImage({ comInfo, comIndex, parentIndex })
  const { fullScreenStyle } = useFullScreen(comInfo)
  const iconExtendRef = useRef<boolean>(true)
  const { hanlderEvent } = useHanlder(comInfo)
  const { countDownValue, isShowCountDown } = useCountDown(comInfo)

  const src = useMemo(() => {
    return swiperNavImg?.src || updateSrc || countDownValue || comInfo?.image?.src
  }, [updateSrc, swiperNavImg, comInfo?.image?.src, countDownValue])

  const imageStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle)
    if (fullScreenStyle) {
      assign(result, fullScreenStyle)
    }
    if (swiperCurrentStyle) {
      assign(result, swiperCurrentStyle)
    }
    if (!isShowCountDown) {
      assign(result, { display: 'none' })
    }
    if (!((swiperNavImgs?.length > 0 && swiperNavImg) || swiperNavImgs.length === 0)) {
      assign(result, { opacity: '0', pointerEvent: 'none' })
    }
    return result ?? {}
  }, [comInfo, baseStyle, isShowCountDown, swiperCurrentStyle, swiperNavImgs, swiperNavImg, fullScreenStyle])

  return <>
    {
      /** 轮播导航图片的特殊处理 */
      swiperNavImg && swiperNavImgs?.map((swpItem: any, swpIndex: number) => (
        <View
          key={swpItem.src}
          style={{
            width: `${100 / swiperNavImgs?.length}%`,
            height: '100%',
            display: 'inline-block',
            position: 'relative',
            zIndex: 2
          }}
          onClick={e => {
            safeFn(() => {
              Taro.eventCenter.trigger(
                `layout_defaultEventCallBack_${pageId}`,
                e
              )
              Taro.eventCenter.trigger(`layout_trackingCallBack_${pageId}`, {
                component: {
                  code: templateCode,
                  name: templateName,
                  index: templateIndex,
                },
                target: {
                  index: swpIndex,
                  type: 'swiperNav'
                },
                actions: [],
                e
              })
            })
            e.stopPropagation()
            store.setCom({
              key: comInfo?.swiperNav?.swiperId,
              value: swpIndex,
              type: 'current'
            }, pageId)
          }}
        />
      ))
    }
    {comInfo?.hot?.map((hotItem: any, hotIndex: number) => (
      <ButtonAuth
        key={hotItem.id}
        type="hot"
        hot={hotItem}
        hotIndex={hotIndex}
        injectStyle={getHotStyle(hotItem.value, { zIndex: 99 + hotIndex })}
      >
        {
          hotItem.imgUrl && <ImagePR style={{ width: '100%', height: '100%' }} mode='aspectFit' src={hotItem.imgUrl} />
        }
      </ ButtonAuth>
    ))}
    <ImagePR
      id={getDomId(comInfo?.id)}
      {...omit(comInfo.image, ['src'])}
      src={src as string}
      style={imageStyle}
      imgSlot={slot}
      onClick={e => {
        if (isIconExtend) {
          iconExtendRef.current = !iconExtendRef.current
          safeFn(() => Taro.eventCenter.trigger(`layout_iconExtendChange_${pageId}`, iconExtendRef.current, {
            component: {
              code: templateCode,
              name: templateName,
              index: templateIndex,
              customData: templateCustomData
            }
          }))
        }
        if (isOpenEvent) {
          hanlderEvent(e)
        }
      }}
      onLongPress={e => hanlderEvent(e)}
    />

  </>
}

export default ProImage
