// @ts-nocheck

import Taro, { useDidHide } from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { forIn } from 'lodash-es';
import { CSSProperties, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { debounce, getDomId } from '../helper';
import usePage from './usePage';

export default function useAnimate(comInfo) {
  const { isNowPage } = usePage();
  const [animateStyle, setAnimateStyle] = useImmer<CSSProperties>({});
  const observerRef = useRef<any>();
  const triggerCountRef = useRef<number>(0);
  const updateAnimateStyle: any = useMemoizedFn(
    debounce(
      (newStyle: any) => {
        setAnimateStyle(draft => {
          forIn(newStyle, (value, key) => {
            draft[key] = value;
          });
        });
      },
      100,
      false
    )
  );
  const observerElement = useMemoizedFn(() => {
    const animation = comInfo?.customData?.pendantAnimation;
    if (animation?.style?.animationName) {
      if (['view-once', 'view-always'].includes(animation.triggerRules)) {
        if (!observerRef.current) {
          observerRef.current = Taro.createIntersectionObserver(this, {
            observeAll: false,
            initialRatio: animation.initialRatio ?? 0
          });
        }
        observerRef.current
          ?.relativeTo('.layout-page-observe')
          .observe(`#${getDomId(comInfo.id)}`, res => {
            if (
              animation.triggerRules === 'view-once' &&
              triggerCountRef.current > 0
            ) {
              observerRef.current?.disconnect();
              return;
            }
            if (res.intersectionRatio > 0) {
              if (animation.triggerRules === 'view-once') {
                triggerCountRef.current = triggerCountRef.current + 1;
              }
              updateAnimateStyle({ ...animation.style, opacity: '1' });
            } else if (res.intersectionRatio === 0) {
              updateAnimateStyle({
                opacity: '0',
                animationName: ''
              });
            }
          });
      }
      if (['page'].includes(animation.triggerRules)) {
        updateAnimateStyle({ ...animation.style, opacity: '1' });
      }
    }
  });

  useDidHide(() => {
    if (observerRef.current) {
      observerRef.current?.disconnect();
      observerRef.current = null;
    }
  });

  useEffect(() => {
    if (comInfo?.id && isNowPage) {
      Taro.nextTick(() => {
        observerElement();
      });
    }
  }, [comInfo, isNowPage]);
  return {
    animateStyle
  };
}
