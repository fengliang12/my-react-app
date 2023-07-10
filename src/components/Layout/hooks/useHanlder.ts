import { useContext } from 'react';
import Taro from "@tarojs/taro"
import { useMemoizedFn } from "ahooks"
import { parsingActions, safeFn, log } from "../helper"
import { LayoutContext, TemplateContext } from '../index'
import { store } from '../store/index'

export default function useEvent(props) {
  const { id, event, exclusiveEvent, currentIndex = 0 } = props
  const { pageId, swiperRelation, closeAction, routerParams, computedStatusData } = useContext(LayoutContext)
  const { templateId, templateCode, templateName, templateIndex, templateCustomData, componentType, status } = useContext(TemplateContext)
  // 用户操作事件处理
  const hanlderEvent = useMemoizedFn(async (e) => {
    const eventPointTo = store.eventPointTo.get(`${pageId}_${id}`)
    safeFn(() =>
      Taro.eventCenter.trigger(`layout_defaultEventCallBack_${pageId}`, e)
    )
    let needChangeEvent = ''
    let realityEvent = event?.find(item => item.type === e.type)
    if (exclusiveEvent?.length > 0) {
      const eEvent = exclusiveEvent?.find(
        item => item.type === e.type && item.actions.length > 0
      )
      if (eEvent && eventPointTo === 'ev') {
        realityEvent = eEvent
        needChangeEvent = 'e'
      }
      if (eventPointTo === 'e' || (eEvent && !eventPointTo)) {
        needChangeEvent = 'ev'
      }
    }
    const actionKey = `${id}_${eventPointTo === 'ev'
      ? 'exclusiveEvent'
      : 'event'
      }`
    if (status?.list?.some(x => x.key === actionKey)) {
      computedStatusData?.(status.id, actionKey)
    }
    if (realityEvent?.actions?.length > 0) {
      if (closeAction) return
      e.stopPropagation?.()
      await parsingActions(realityEvent.actions, pageId, {
        component: {
          code: templateCode,
          name: templateName,
          index: templateIndex,
          customData: templateCustomData
        },
        target: {
          index: currentIndex,
          type: componentType
        }
      }, routerParams as any)
      safeFn(() => {
        Taro.eventCenter.trigger(`layout_eventCallBack_${pageId}`, {
          id,
          componentType,
          event: realityEvent,
          e
        })
        Taro.eventCenter.trigger(`layout_trackingCallBack_${pageId}`, {
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex,
            customData: templateCustomData
          },
          target: {
            index: currentIndex,
            type: componentType
          },
          actions: realityEvent.actions,
          e
        })
      })
      if (needChangeEvent) {
        store.setEventPointTo({ key: id, value: needChangeEvent }, pageId)
      }
    }
  })

  // 自动操作事件处理
  const autoHanlderEvent = useMemoizedFn(async (actions, loop, type) => {
    if (actions?.length > 0 && !loop) {
      await parsingActions(actions, pageId, {
        component: {
          code: templateCode,
          name: templateName,
          index: templateIndex,
        }
      }, routerParams as any)
      const needChangeEventId = actions?.[0]?.actionType?.component?.[0]?.id
      if (needChangeEventId && type === 'onEnded') {
        store.setToggleEventPointTo({ key: needChangeEventId }, pageId)
      }
    }
  })

  // 轮播索引变化事件
  const hanlderSwiperChange = useMemoizedFn((e, swiper, nowVal = 0) => {
    store.setComCurrent({
      updateCurrent: {
        id: swiper?.id,
        newCurrent: e.detail.current,
        oldCurrent: nowVal
      },
      relation: swiper?.relation,
      swiperRelation,
    }, pageId)
    safeFn(() =>
      Taro.eventCenter.trigger(`layout_swiperchange_${pageId}`, {
        oldCurrent: nowVal,
        newCurrent: e.detail.current,
        swiperId: swiper.id,
        componentInfo: {
          id: templateId,
          tempName: templateName,
          index: templateIndex
        }
      })
    )
  })

  return {
    hanlderEvent,
    autoHanlderEvent,
    hanlderSwiperChange
  }
}
