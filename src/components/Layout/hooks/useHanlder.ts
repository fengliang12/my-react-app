import Taro from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { concat } from "lodash-es";
import { useContext, useRef } from "react";
import {
  parsingActions,
  safeFn,
  sleep,
  computedInfinitelLoopY,
  computedProductChange,
  computedTopNavBar,
  computedTextLabel,
  computedKIEHLSA,
  computedOneMemberCardE
} from "../helper";
import { LayoutContext, TemplateContext } from "../index";
import { store } from "../store/index";

export default function useEvent(props, dynamicInfo?) {
  const { id, event, exclusiveEvent, currentIndex = 0, customData } = props;
  const {
    pageId,
    swiperRelation,
    closeAction,
    routerParams,
    registerPath,
    computedStatusData,
    computedOpenFull,
    interfaceParamsInject
  } = useContext(LayoutContext);
  const {
    templateId,
    templateCode,
    templateName,
    templateIndex,
    templateCustomData,
    componentType,
    status
  } = useContext(TemplateContext);
  const isFirstTouchActionRef = useRef(true)
  // 用户操作事件处理
  const hanlderEvent = useMemoizedFn(async (e, dInfo?) => {
    const eventPointTo = store.eventPointTo.get(`${pageId}_${id}`);
    safeFn(() =>
      Taro.eventCenter.trigger(`layout_defaultEventCallBack_${pageId}`, e)
    );
    let needChangeEvent = "";
    let eType = "tap";
    let realityEvent = event?.find(item => item.type === eType);
    if (exclusiveEvent?.length > 0) {
      const eEvent = exclusiveEvent?.find(
        item => item.type === eType && item.actions.length > 0
      );
      if (eEvent && eventPointTo === "ev") {
        realityEvent = eEvent;
        needChangeEvent = "e";
      }
      if (eventPointTo === "e" || (eEvent && !eventPointTo)) {
        needChangeEvent = "ev";
      }
    }
    const actionKey = `${id}_${eventPointTo === "ev" ? "exclusiveEvent" : "event"
      }`;
    if (status?.list?.some(x => x.key === actionKey)) {
      computedStatusData?.(status.id, actionKey);
    }
    /** 计算事件 */
    if (customData?.computedEvent?.open) {
      computedHanlderEvent(customData?.computedEvent, e);
    }
    /** 延时事件 */
    if (customData?.setTimeoutEvent?.time) {
      parsingActions(customData?.setTimeoutEvent?.actions ?? [], pageId, {});
      await sleep(customData?.setTimeoutEvent?.time ?? 0);
      if (!realityEvent) {
        parsingActions(
          customData?.setTimeoutEvent?.sleepActions ?? [],
          pageId,
          {}
        );
      }
    }
    if (realityEvent?.actions?.length > 0) {
      if (closeAction) return;
      e.stopPropagation?.();
      await parsingActions(
        concat(
          realityEvent.actions,
          customData?.setTimeoutEvent?.sleepActions ?? []
        ),
        pageId,
        {
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
        },
        {
          routerParams,
          interfaceParamsInject,
          dynamicInfo: dInfo ?? dynamicInfo,
          registerPath
        }
      );
      safeFn(() => {
        Taro.eventCenter.trigger(`layout_eventCallBack_${pageId}`, {
          id,
          componentType,
          event: realityEvent,
          e
        });
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
        });
      });
      if (needChangeEvent) {
        store.setEventPointTo({ key: id, value: needChangeEvent }, pageId);
      }
    }
  });

  // 自动操作事件处理
  const autoHanlderEvent = useMemoizedFn(async (actions, loop, type) => {
    if (actions?.length > 0 && !loop) {
      await parsingActions(
        actions,
        pageId,
        {
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex
          }
        },
        routerParams as any
      );
      const needChangeEventId = actions?.[0]?.actionType?.component?.[0]?.id;
      if (needChangeEventId && type === "onEnded") {
        store.setToggleEventPointTo({ key: needChangeEventId }, pageId);
      }
    }
    if (type === "onEnded" && customData?.onEndedCallback) {
      safeFn(() =>
        Taro.eventCenter.trigger(`layout_onVideoCallback_${pageId}`, {
          type: "onEnded",
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex,
            customData: templateCustomData
          }
        })
      );
    }
    if (type === "onPlay" && customData?.onPlayCallback) {
      safeFn(() =>
        Taro.eventCenter.trigger(`layout_onVideoCallback_${pageId}`, {
          type: "onPlay",
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex,
            customData: templateCustomData
          }
        })
      );
    }
    if (type === "onPause" && customData?.onPauseCallback) {
      safeFn(() =>
        Taro.eventCenter.trigger(`layout_onVideoCallback_${pageId}`, {
          type: "onPause",
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex,
            customData: templateCustomData
          }
        })
      );
    }
  });

  // 轮播索引变化事件
  const hanlderSwiperChange = useMemoizedFn((e, swiper, nowVal = 0) => {
    store.setComCurrent(
      {
        updateCurrent: {
          id: swiper?.id,
          newCurrent: e.detail.current,
          oldCurrent: nowVal
        },
        relation: swiper?.relation,
        swiperRelation
      },
      pageId
    );
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
    );
  });

  // 计算事件处理
  const computedHanlderEvent = useMemoizedFn(async (data: any, e: any) => {
    // 纵向无限循环组件计算事件处理
    if (templateCode === "INFINITELOOPY") {
      computedInfinitelLoopY(data.index, pageId!, templateId!);
    }
    // 商品换一换组件计算事件处理
    if (
      ["PRODUCTCHANGE", "PRODUCTCHANGEA", "PRODUCTCHANGEB"].includes(
        templateCode!
      )
    ) {
      computedProductChange(data.index, pageId!, templateId!);
    }
    // 顶部导航栏计算事件处理
    if (templateCode === "TOPNAVBAR") {
      computedOpenFull?.(data?.id);
      computedTopNavBar(data, e, pageId!, templateId!);
      safeFn(() => {
        Taro.eventCenter.trigger(`layout_trackingCallBack_${pageId}`, {
          component: {
            code: templateCode,
            name: templateName,
            index: templateIndex,
            customData: templateCustomData
          },
          target: {
            index: currentIndex,
            type: componentType,
            value: data.title
          },
          actions: [],
          e
        });
      });
    }
    // 文本标签组件事件处理
    if (templateCode === "TEXTLABEL") {
      const result = computedTextLabel(data, pageId!, templateId!);
      if (result) {
        if (status?.list?.some(x => x.key === result)) {
          computedStatusData?.(status.id, result);
        }
      }
    }
    if (templateCode === "KIEHLSA") {
      computedKIEHLSA(data, pageId!, templateId!, 'click');
    }
    if (templateCode === "ONEMEMBERCARDE") {
      computedOneMemberCardE(data, pageId!, templateId!)
    }
  });

  // 手指滑动事件处理
  const touchHanlderEvent = useMemoizedFn(direction => {
    if (templateCode === "KIEHLSA") {
      if (customData?.touchEvent?.direction === direction) {
        computedKIEHLSA(customData?.touchEvent, pageId!, templateId!, 'touch')
      }
    } else {
      // 只执行一次
      if (customData?.touchEventType === 'once' && isFirstTouchActionRef.current === false) {
        return
      }
      const actions = customData?.touchEvent?.find(x => x.direction === direction)?.actions
      if (actions?.length) {
        parsingActions(actions, pageId, {})
        isFirstTouchActionRef.current = false
      }
    }
  });

  // ScrollView滑动触底事件处理
  const scrollToLowerEvent = useMemoizedFn(() => {
    if (templateCode === "KIEHLSA") {
      if (customData?.scrollViewProps?.scrollToLower) {
        computedKIEHLSA(customData?.scrollViewProps?.scrollToLower, pageId!, templateId!, 'scroll');
      }
    }
  });

  return {
    hanlderEvent,
    autoHanlderEvent,
    touchHanlderEvent,
    scrollToLowerEvent,
    hanlderSwiperChange
  };
}
