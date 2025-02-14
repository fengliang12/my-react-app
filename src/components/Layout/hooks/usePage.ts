import { isNil } from 'lodash-es';
import { useDidHide, useDidShow } from '@tarojs/taro';
import { useUpdateEffect } from 'ahooks';
import { useState, useContext } from 'react';
import { LayoutContext } from "../index";

export default function usePage() {
  const { leavePage } = useContext(LayoutContext);
  const [isNowPage, setIsNowPage] = useState<boolean>(true);
  useDidShow(() => {
    !isNowPage && setIsNowPage(true);
  });
  useDidHide(() => {
    isNowPage && setIsNowPage(false);
  });

  useUpdateEffect(() => {
    if (!isNil(leavePage)) {
      if (leavePage) {
        setIsNowPage(false)
      } else {
        setIsNowPage(true)
      }
    }
  }, [leavePage])
  return {
    isNowPage
  };
}
