import { assign, cloneDeep, isNil, omit, set, trim } from 'lodash-es'
import { CSSProperties, useContext, useMemo } from 'react'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { getBaseStyle } from '../helper'
import { TemplateContext } from '../index'
import useCustomData from './useCustomData'
import useLive from './useLive'
import useStore from './useStore'
import useStyle from './useStyle'
import useCountDown from './useCountDown'
import useHanlder from './useHanlder'

export default function useView({ comInfo, dynamicData }) {
  const { templateCode, viewOverFlowShow } = useContext(TemplateContext)
  const { sNavCurrent, updateCatchMove } = useStore(comInfo)
  const { baseStyle, baseClassName } = useStyle(comInfo)
  const { liveStyle } = useLive(comInfo)
  const { customStyle, customClassName } = useCustomData(comInfo)
  const { isShowCountDown } = useCountDown(comInfo)
  const { autoHanlderEvent } = useHanlder(comInfo)
  const viewStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle)
    if (comInfo?.movable) {
      if (['WINDOWBOTTOM'].includes(templateCode as string)) {
        result.position = 'absolute'
      } else {
        result = omit(result, ['position', 'left', 'top', 'right', 'bottom', 'zIndex'])
      }
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
    if (comInfo?.swiperNav?.type === 'move-image' && comInfo?.swiperNav?.swiperId) {
      result = assign(result, {
        width: `${(100 / (comInfo?.swiperNav?.swiperCount - 1)) * swiperCurrent}%`
      })
    }
    if (['move-line'].includes(comInfo?.swiperNav?.type) && comInfo?.swiperNav?.swiperId) {
      result = assign(result, {
        width: `${(1 / comInfo?.swiperNav?.swiperCount) * 100}%`,
        left: `${Math.ceil((swiperCurrent / comInfo?.swiperNav?.swiperCount) * 100)}%`
      })
    }
    if (!isShowCountDown) {
      result = assign(result, {
        display: 'none'
      })
    }
    if (comInfo?.level === 1 || comInfo?.path === '0' || comInfo?.customData?.path === '0') {
      result = omit(result, ['marginTop', 'marginBottom'])
    }
    if (dynamicData) {
      const dv = dynamicData?.find(x => x.type === 'value' && x?.styleKey)
      if (!isNil(dv?.value)) {
        if (dv?.styleKey === 'style') {
          result = assign(result, dv.value)
        } else {
          set(result, dv.styleKey, dv?.value)
        }
      }
    }
    if (!viewOverFlowShow) {
      result = { overflow: 'hidden', ...result }
    }
    return assign(result, liveStyle, customStyle) ?? {}
  }, [baseStyle, comInfo, sNavCurrent, liveStyle, customStyle, isShowCountDown, viewOverFlowShow, dynamicData])

  const viewClassName = useMemo(() => {
    let result = ' '
    if (baseClassName) {
      result = result + baseClassName
    }
    if (customClassName) {
      result = result + customClassName
    }
    return trim(result)
  }, [baseClassName, customClassName])
  // 轮播导航多图-触发当前事件
  const swiperNavHalder = useMemoizedFn(() => {
    if (['text'].includes(comInfo?.swiperNav?.type)) {
      if (comInfo?.swiperNav?.current === sNavCurrent) {
        autoHanlderEvent(comInfo?.event?.[0]?.actions, false, null)
      }
    }
  })
  useUpdateEffect(() => {
    swiperNavHalder()
  }, [sNavCurrent, comInfo?.swiperNav])

  return {
    viewStyle,
    viewClassName,
    updateCatchMove
  }
}
