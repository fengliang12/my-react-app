import { View } from "@tarojs/components";
import Taro, { useDidHide } from "@tarojs/taro";
import { useMemoizedFn, useUpdateEffect, useLatest } from "ahooks";
import { useRef, useState, memo } from "react";
import ImagePR from "../ImagePR";

type LoadingType = {
  ids?: string[];
  config?: {
    src: string;
    bgColor?: string;
    width?: string;
    left?: string;
    top?: string;
  };
};

const maxCount = 20;

const Loading: React.FC<LoadingType> = ({ ids, config }) => {
  const [isLoading, setIsLoading] = useState(true);
  const latestLoadingRef = useLatest(isLoading)
  const countRef = useRef(0)
  const clearRef = useRef<any>()
  const checkIds = useMemoizedFn(() => {
    const fn = () => {
      if (ids && ids.length > 0 && latestLoadingRef.current) {
        if (countRef.current >= maxCount) {
          Taro.nextTick(() => setIsLoading(false))
          return
        }
        countRef.current = countRef.current + 1
        const query = Taro.createSelectorQuery();
        const idsStr = ids.map(x => `#${x}`).join(",");
        query.selectAll(idsStr).boundingClientRect();
        query.exec(function (res) {
          let isOk = true;
          res[0].forEach(rect => {
            if (!rect.width || !rect.height) {
              isOk = false;
            }
          });
          if (!isOk) {
            clearRef.current = setTimeout(fn, 100)
          } else {
            Taro.nextTick(() => setIsLoading(false))
          }
        });
      }
    }
    clearRef.current = setTimeout(fn, 100)
  });

  useDidHide(() => {
    if (clearRef.current) {
      clearTimeout(clearRef.current)
    }
  })

  useUpdateEffect(() => {
    if (latestLoadingRef.current) {
      checkIds()
    }
  }, [ids])

  return (
    <>
      {isLoading && (
        <View
          catchMove
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: config?.bgColor || "#fff",
            zIndex: 999999999999999
          }}
        >
          <ImagePR
            src={config?.src as string}
            mode="widthFix"
            style={{
              position: "absolute",
              width: config?.width || "300rpx",
              height: "auto",
              left: config?.left || "50%",
              top: config?.top || "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </View>
      )}
    </>
  );
};

export default memo(Loading);
