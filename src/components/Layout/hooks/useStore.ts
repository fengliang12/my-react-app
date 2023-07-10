import { useUpdateEffect } from 'ahooks';
import { useUnmount, useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';
import { reaction } from "mobx"
import { useRef, useState, useContext, useEffect } from 'react';
import { store } from "../store/index"
import { LayoutContext } from "../index"


export default function useStore(comInfo) {
  const { id, type, swiperNav, swiperCurrent } = comInfo
  const { pageId } = useContext(LayoutContext)
  const [updateStyle, setUpdateStyle] = useState(null)
  const [updateSrc, setUpdateSrc] = useState(null)
  const [updateCurrent, setUpdateCurrent] = useState(null)
  const [updateNodes, setUpdateNodes] = useState(null)
  const [updateOffset, setUpdateOffset] = useState(null)
  const [updateMuted, setUpdateMuted] = useState(null)
  const [sCurrent, setSCurrent] = useState(null)
  const [sNavCurrent, setSNavCurrent] = useState(null)
  const srcReactionRef = useRef<any>()
  const styleReactionRef = useRef<any>()
  const currentReactionRef = useRef<any>()
  const nodesReactionRef = useRef<any>()
  const mutedReactionRef = useRef<any>()
  const offsetReactionRef = useRef<any>()
  const sCurrentReactionRef = useRef<any>()
  const sNavCurrentReactionRef = useRef<any>()
  const getId = useMemoizedFn((id) => `${pageId}_${id}`)
  const init = useMemoizedFn(() => {
    styleReactionRef.current = reaction(() => {
      return store.updateStyle.get(getId(id))
    }, (style) => {
      if (!isNil(style)) {
        setUpdateStyle(style)
      }
    })
    switch (type) {
      case 'image':
        srcReactionRef.current = reaction(() => {
          return store.updateCom.src.get(getId(id))
        }, (src) => {
          if (!isNil(src)) {
            setUpdateSrc(src)
          }
        })
        if (swiperCurrent?.swiperId) {
          sCurrentReactionRef.current = reaction(() => {
            return store.updateCom.current.get(getId(swiperCurrent?.swiperId))
          }, (current) => {
            if (!isNil(current)) {
              setSCurrent(current)
            }
          })
        }
        if (swiperNav?.swiperId) {
          sNavCurrentReactionRef.current = reaction(() => {
            return store.updateCom.current.get(getId(swiperNav?.swiperId))
          }, (current) => {
            if (!isNil(current)) {
              setSNavCurrent(current)
            }
          })
        }
        break;
      case 'video':
        srcReactionRef.current = reaction(() => {
          return store.updateCom.src.get(getId(id))
        }, (src) => {
          if (!isNil(src)) {
            setUpdateSrc(src)
          }
        })
        mutedReactionRef.current = reaction(() => {
          return store.updateCom.muted.get(getId(id))
        }, (muted) => {
          if (!isNil(muted)) {
            setUpdateMuted(muted)
          }
        })
        break;
      case 'swiperView':
        currentReactionRef.current = reaction(() => {
          return store.updateCom.current.get(getId(id))
        }, (current) => {
          if (!isNil(current)) {
            setUpdateCurrent(current)
          }
        })
        break;
      case 'scrollView':
        offsetReactionRef.current = reaction(() => {
          return store.updateCom.offset.get(getId(id))
        }, (offset) => {
          if (!isNil(offset)) {
            setUpdateOffset(offset)
          }
        })
        break;
      case 'text':
        nodesReactionRef.current = reaction(() => {
          return store.updateCom.nodes.get(getId(id))
        }, (nodes) => {
          if (!isNil(nodes)) {
            setUpdateNodes(nodes)
          }
        })
        break;
      case 'view':
        if (swiperNav?.swiperId) {
          sNavCurrentReactionRef.current = reaction(() => {
            return store.updateCom.current.get(getId(swiperNav?.swiperId))
          }, (current) => {
            if (!isNil(current)) {
              setSNavCurrent(current)
            }
          })
        }
        if (swiperCurrent?.swiperId) {
          sCurrentReactionRef.current = reaction(() => {
            return store.updateCom.current.get(getId(swiperCurrent?.swiperId))
          }, (current) => {
            if (!isNil(current)) {
              setSCurrent(current)
            }
          })
        }
        break;
    }
  })
  const clear = useMemoizedFn(() => {
    // 清理reaction函数
    srcReactionRef.current?.()
    styleReactionRef.current?.()
    mutedReactionRef.current?.()
    currentReactionRef.current?.()
    nodesReactionRef.current?.()
    offsetReactionRef.current?.()
    sCurrentReactionRef.current?.()
    sNavCurrentReactionRef.current?.()
  })
  useEffect(() => {
    if (comInfo && pageId) {
      init()
    }
  }, [comInfo, pageId])

  useUnmount(() => {
    clear()
  })

  return {
    updateStyle,
    updateSrc,
    updateCurrent,
    updateNodes,
    updateOffset,
    updateMuted,
    sCurrent,
    sNavCurrent
  }
}
