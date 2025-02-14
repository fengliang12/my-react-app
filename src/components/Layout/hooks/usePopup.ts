import { useMemoizedFn, useUnmount } from "ahooks";
import { reaction } from "mobx";
import { useEffect, useRef, useState } from "react";

import { store } from "../store/index";

export default function usePopup(props) {
  const { pageId } = props;
  const [popup, setPopup] = useState<Edit.IActionPopup | null>(null);
  const popupReactionRef = useRef<any>();
  const init = useMemoizedFn(() => {
    popupReactionRef.current = reaction(
      () => {
        return store.popup.get(pageId);
      },
      data => {
        setPopup(data);
      }
    );
  });
  const clear = useMemoizedFn(() => {
    // 清理reaction函数
    popupReactionRef.current?.();
  });
  useEffect(() => {
    if (pageId) {
      init();
    }
  }, [pageId]);
  useUnmount(() => {
    clear();
  });
  return {
    popup
  };
}
