// @ts-nocheck

import Taro, { useDidHide } from '@tarojs/taro'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useRef } from 'react'
import { layout } from '../config/index'
import { getDomId } from '../helper'
import usePage from './usePage'

export default function useObserver(comInfo) {
  const { isNowPage } = usePage()
  const observerRef = useRef<any>()
  const observerElement = useMemoizedFn(() => {
    if (comInfo.type === 'video' && comInfo?.customData?.videoObserver) {
      videoObserver()
    }
  })

  const videoObserver = useMemoizedFn(() => {
    const ctx = Taro.createVideoContext(getDomId(comInfo.id))
    if (!observerRef.current) {
      observerRef.current = Taro.createIntersectionObserver(this, {
        initialRatio: 0.5,
        observeAll: false
      })
      observerRef.current
        ?.relativeTo('.layout-first-page-observe')
        ?.observe(`#${getDomId(comInfo.id)}`, (res) => {
          if (res.intersectionRatio > 0) {
            ctx?.play()
          } else if (res.intersectionRatio === 0) {
            ctx?.stop()
          }
        })
    }
  })

  const leavePageHanlder = useMemoizedFn(() => {
    if (comInfo.type === 'video' && layout.config.stopVideoByLeavePage) {
      let ctx: any = null
      if (process.env.TARO_ENV === 'h5') {
        ctx = document.querySelector(`#${getDomId(comInfo.id)}`)
      } else {
        ctx = Taro.createVideoContext(getDomId(comInfo.id))
      }
      ctx?.stop()
    }
  })

  useDidHide(() => {
    if (observerRef.current) {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  })

  useEffect(() => {
    if (comInfo?.id) {
      if (isNowPage) {
        setTimeout(() => {
          Taro.nextTick(() => {
            observerElement()
          })
        }, 200)
      } else {
        leavePageHanlder()
      }
    }
  }, [comInfo, isNowPage]) 
  return {

  }
}
