import { View } from '@tarojs/components';
import Taro, { useDidHide } from '@tarojs/taro';
import { useLatest, useMemoizedFn, useUpdateEffect } from 'ahooks';
import React, { memo, useRef, useState } from 'react';

import ImagePR from '../ImagePR';

type LoadingType = {
  ids?: string[];
  config?: {
    src: string;
    bgColor?: string;
    width?: string;
    left?: string;
    top?: string;
    maxTime?: number;
  };
};

const maxCount = 15;

const Loading: React.FC<LoadingType> = ({ ids, config }) => {
  const [isLoading, setIsLoading] = useState(true);
  const latestLoadingRef = useLatest(isLoading);
  const countRef = useRef(0);
  const clearRef = useRef<any>();
  const checkIds = useMemoizedFn(() => {
    const fn = () => {
      if (ids && ids.length > 0 && latestLoadingRef.current) {
        if (countRef.current >= (config?.maxTime ?? maxCount)) {
          Taro.nextTick(() => setIsLoading(false));
          return;
        }
        countRef.current = countRef.current + 1;
        const query = Taro.createSelectorQuery();
        const idsStr = ids.map(x => `#${x}`).join(',');
        query.selectAll(idsStr).boundingClientRect();
        query.exec(function (res) {
          let isOk = true;
          res[0].forEach(rect => {
            if (!rect.width || !rect.height) {
              isOk = false;
            }
          });
          if (!isOk) {
            clearRef.current = setTimeout(fn, 100);
          } else {
            Taro.nextTick(() => setIsLoading(false));
          }
        });
      }
    };
    clearRef.current = setTimeout(fn, 100);
  });

  useDidHide(() => {
    if (clearRef.current) {
      clearTimeout(clearRef.current);
      setIsLoading(false)
    }
  });

  useUpdateEffect(() => {
    if (latestLoadingRef.current) {
      checkIds();
    }
  }, [ids]);

  return (
    <>
      {isLoading && (
        <View
          catchMove
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '750rpx',
            height: '100vh',
            background: config?.bgColor,
            zIndex: 9998
          }}
        >
          <ImagePR
            src={config?.src as string}
            noSuffix
            mode="widthFix"
            style={{
              position: 'absolute',
              width: config?.width || '300rpx',
              height: 'auto',
              left: config?.left || '50%',
              top: config?.top || '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </View>
      )}
    </>
  );
};

export default memo(Loading);
