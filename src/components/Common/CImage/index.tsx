import type { ImageProps } from "@tarojs/components";
import { Image } from "@tarojs/components";
import Taro, { NodesRef } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import { isPlainObject } from "lodash-es";
import React, { useMemo, useRef, useState } from "react";

interface CImageOther extends ImageProps {
  duration?: number;
  getImgInfo?: boolean;
  showMenuByLongpress?: boolean;
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

const CImage: React.FC<CImageOther> = (props) => {
  const { duration = 100, getImgInfo = false } = props;
  const [show, setShow] = useState(false);
  const imageRef = useRef({ uid: "" });
  const createSelectorQuery = useMemoizedFn<() => any>(() => {
    return new Promise((resolve) => {
      const query = Taro.createSelectorQuery();
      if (!imageRef) return;
      setTimeout(() => {
        if (!imageRef?.current?.uid) return;
        query.select(`#${imageRef.current.uid}`).boundingClientRect();
        query.exec((res) => {
          resolve(res[0]);
        });
      });
    });
  });
  const onLoad = async (res) => {
    setShow(true);
    if (props.onLoad) {
      let imgInfo: NodesRef.BoundingClientRectCallbackResult | null = null;
      if (getImgInfo) {
        imgInfo = await createSelectorQuery();
      }
      res.imgInfo = imgInfo;
      props.onLoad(res);
    }
  };

  const webp = useMemo(() => {
    if (!props?.src) return false;
    return props?.src?.toLowerCase().endsWith(".webp");
  }, [props?.src]);

  const computeStyle = useMemoizedFn(() => {
    if (typeof props.style === "string") {
      return `transition-duration:${duration}ms;${props.style ?? ""}`;
    } else if (isPlainObject(props.style)) {
      return {
        transitionDuration: `${duration}ms`,
        ...props.style,
      };
    }
  });

  const handleError = useMemoizedFn((err) => {
    props?.onError?.(err);
  });

  return (
    <Image
      ref={imageRef}
      mode="aspectFill"
      webp={webp}
      {...props}
      className={`image block transition-opacity  ${
        show ? "opacity-100" : "opacity-0"
      } ${props.className}`}
      style={computeStyle()}
      onLoad={onLoad}
      onError={handleError}
    ></Image>
  );
};
export default React.memo(CImage);
