import Taro from "@tarojs/taro"
import { useMemoizedFn, useUpdateEffect } from "ahooks"
import { CSSProperties, useContext, useRef } from "react"
import { debounce, getDomId } from "../helper"
import { LayoutContext } from "../index"
import { useImmer } from 'use-immer'
import { forIn } from "lodash-es"


export default function useAnimate(comInfo) {
  const { animations } = useContext(LayoutContext)
  const [animateStyle, setAnimateStyle] = useImmer<CSSProperties>({})
  const observerRef = useRef<any>()
  const triggerCountRef = useRef<number>(0)
  const updateAnimateStyle: any = useMemoizedFn(debounce((newStyle: any) => {
    setAnimateStyle((draft) => {
      forIn(newStyle, (value, key) => {
        draft[key] = value
      })
    })
  }, 100, false))
  const observerElement = useMemoizedFn(() => {
    const animation = animations?.find(x => x.id === comInfo.id)
    if (animation) {
      if (!observerRef.current) {
        observerRef.current = Taro.createIntersectionObserver(this, { observeAll: false, initialRatio: animation.initialRatio ?? 0 })
      }
      observerRef.current?.relativeTo('.layout-page-observe').observe(`#${getDomId(animation.id)}`, (res) => {
        if (animation.triggerRules === 'view-first' && triggerCountRef.current > 0) {
          observerRef.current?.disconnect()
          return
        }
        if (res.intersectionRatio > 0 && res.boundingClientRect.left === 0) {
          if (animation.triggerRules === 'view-first') {
            triggerCountRef.current = triggerCountRef.current + 1
          }
          updateAnimateStyle({ ...animation.style, opacity: "1" })
        } else if (res.intersectionRatio === 0 && res.boundingClientRect.left === 0) {
          updateAnimateStyle({
            opacity: "0",
            animationName: ""
          })
        }
      })
    }
  })

  useUpdateEffect(() => {
    if (comInfo?.id && animations?.length > 0) {
      Taro.nextTick(() => {
        observerElement()
      })
    }
  }, [comInfo, animations])
  return {
    animateStyle
  }
}
