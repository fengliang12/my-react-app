import { useMemoizedFn, useUnmount } from "ahooks";
import { isNil } from "lodash-es";
import { reaction } from "mobx";
import { useContext, useEffect, useRef, useState } from "react";

import { LayoutContext } from "../index";
import { store } from "../store/index";

export default function useStore(comInfo) {
  const { id, type, swiperNav, swiperCurrent, customData, view } = comInfo;
  const { pageId } = useContext(LayoutContext);
  const [updateStyle, setUpdateStyle] = useState(null);
  const [updateSrc, setUpdateSrc] = useState(null);
  const [updateCurrent, setUpdateCurrent] = useState(null);
  const [updateNodes, setUpdateNodes] = useState(null);
  const [updateOffset, setUpdateOffset] = useState(null);
  const [updateMuted, setUpdateMuted] = useState(null);
  const [sCurrent, setSCurrent] = useState(null);
  const [sNavCurrent, setSNavCurrent] = useState(null);
  const [updateValue, setUpdateValue] = useState(null);
  const [updateCatchMove, setUpdateCatchMove] = useState(null);
  const srcReactionRef = useRef<any>();
  const styleReactionRef = useRef<any>();
  const currentReactionRef = useRef<any>();
  const nodesReactionRef = useRef<any>();
  const mutedReactionRef = useRef<any>();
  const offsetReactionRef = useRef<any>();
  const sCurrentReactionRef = useRef<any>();
  const sNavCurrentReactionRef = useRef<any>();
  const valueReactionRef = useRef<any>();
  const catchMoveReactionRef = useRef<any>();
  const getId = useMemoizedFn((domId: string) => `${pageId}_${domId}`);
  const init = useMemoizedFn(() => {
    styleReactionRef.current = reaction(
      () => {
        return store.updateStyle.get(getId(id));
      },
      style => {
        if (!isNil(style)) {
          setUpdateStyle(style);
        }
      }
    );
    switch (type) {
      case "image":
        srcReactionRef.current = reaction(
          () => {
            return store.updateCom.src.get(getId(id));
          },
          src => {
            if (!isNil(src)) {
              setUpdateSrc(src);
            }
          }
        );
        if (
          swiperCurrent?.swiperId ||
          customData?.swiperCurrent?.swiperId ||
          customData?.swiperCurrentAction?.swiperId
        ) {
          sCurrentReactionRef.current = reaction(
            () => {
              return store.updateCom.current.get(
                getId(
                  swiperCurrent?.swiperId ??
                  customData?.swiperCurrent?.swiperId ??
                  customData?.swiperCurrentAction?.swiperId
                )
              );
            },
            current => {
              if (!isNil(current)) {
                setSCurrent(current);
              }
            }
          );
        }
        if (swiperNav?.swiperId) {
          sNavCurrentReactionRef.current = reaction(
            () => {
              return store.updateCom.current.get(getId(swiperNav?.swiperId));
            },
            current => {
              if (!isNil(current)) {
                setSNavCurrent(current);
              }
            }
          );
        }
        break;
      case "video":
        srcReactionRef.current = reaction(
          () => {
            return store.updateCom.src.get(getId(id));
          },
          src => {
            if (!isNil(src)) {
              setUpdateSrc(src);
            }
          }
        );
        if (
          swiperCurrent?.swiperId ||
          customData?.swiperCurrent?.swiperId ||
          customData?.swiperCurrentAction?.swiperId
        ) {
          sCurrentReactionRef.current = reaction(
            () => {
              return store.updateCom.current.get(
                getId(
                  swiperCurrent?.swiperId ??
                  customData?.swiperCurrent?.swiperId ??
                  customData?.swiperCurrentAction?.swiperId
                )
              );
            },
            current => {
              if (!isNil(current)) {
                setSCurrent(current);
              }
            }
          );
        }
        mutedReactionRef.current = reaction(
          () => {
            return store.updateCom.muted.get(getId(id));
          },
          muted => {
            if (!isNil(muted)) {
              setUpdateMuted(muted);
            }
          }
        );
        break;
      case "swiperView":
        currentReactionRef.current = reaction(
          () => {
            return store.updateCom.current.get(getId(id));
          },
          current => {
            if (!isNil(current)) {
              setUpdateCurrent(current);
            }
          }
        );
        break;
      case "scrollView":
        offsetReactionRef.current = reaction(
          () => {
            return store.updateCom.offset.get(getId(id));
          },
          offset => {
            if (!isNil(offset)) {
              setUpdateOffset(offset);
            }
          }
        );
        break;
      case "text":
        nodesReactionRef.current = reaction(
          () => {
            return store.updateCom.nodes.get(getId(id));
          },
          nodes => {
            if (!isNil(nodes)) {
              setUpdateNodes(nodes);
            }
          }
        );
        break;
      case "view":
        if (swiperNav?.swiperId) {
          sNavCurrentReactionRef.current = reaction(
            () => {
              return store.updateCom.current.get(getId(swiperNav?.swiperId));
            },
            current => {
              if (!isNil(current)) {
                setSNavCurrent(current);
              }
            }
          );
        }
        if (
          swiperCurrent?.swiperId ||
          customData?.swiperCurrent?.swiperId ||
          customData?.swiperCurrentAction?.swiperId
        ) {
          sCurrentReactionRef.current = reaction(
            () => {
              return store.updateCom.current.get(
                getId(
                  swiperCurrent?.swiperId ??
                  customData?.swiperCurrent?.swiperId ??
                  customData?.swiperCurrentAction?.swiperId
                )
              );
            },
            current => {
              if (!isNil(current)) {
                setSCurrent(current);
              }
            }
          );
        }
        if (!isNil(view?.catchMove)) {
          catchMoveReactionRef.current = reaction(
            () => {
              return store.updateCom.catchMove.get(getId(id));
            },
            catchMove => {
              if (!isNil(catchMove)) {
                setUpdateCatchMove(catchMove);
              }
            }
          );
        }

        break;
      case "input":
        valueReactionRef.current = reaction(
          () => {
            return store.updateCom.value.get(getId(id));
          },
          value => {
            if (!isNil(value)) {
              setUpdateValue(value);
            }
          }
        );
        break;
    }
  });
  const clear = useMemoizedFn(() => {
    // 清理reaction函数
    srcReactionRef.current?.();
    styleReactionRef.current?.();
    mutedReactionRef.current?.();
    currentReactionRef.current?.();
    nodesReactionRef.current?.();
    offsetReactionRef.current?.();
    sCurrentReactionRef.current?.();
    sNavCurrentReactionRef.current?.();
    valueReactionRef.current?.();
    catchMoveReactionRef.current?.();
  });
  useEffect(() => {
    if (comInfo && pageId) {
      init();
    }
  }, [comInfo, pageId]);

  useUnmount(() => {
    clear();
  });

  return {
    updateStyle,
    updateSrc,
    updateCurrent,
    updateNodes,
    updateOffset,
    updateMuted,
    sCurrent,
    sNavCurrent,
    updateValue,
    updateCatchMove,
  };
}
