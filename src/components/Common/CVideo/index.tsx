import type { VideoProps } from "@tarojs/components";
import { Video } from "@tarojs/components";
import Taro, { NodesRef } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useRef, useState } from "react";

interface CVideoOther extends VideoProps {
  duration?: number;
  getInfo?: boolean;
  code?: string;
  autoHeight?: boolean;
}

const CVideo: React.FC<CVideoOther> = (props) => {
  const { duration = 100, getInfo = false, code = "" } = props;
  const [show, setShow] = useState(false);
  const ref = useRef({ uid: "" });
  const createSelectorQuery = useMemoizedFn<() => any>(() => {
    return new Promise((resolve) => {
      const query = Taro.createSelectorQuery();
      if (!ref) return;
      setTimeout(() => {
        if (!ref?.current?.uid) return;
        query.select(`#${ref.current.uid}`).boundingClientRect();
        query.exec((res) => {
          resolve(res[0]);
        });
      });
    });
  });

  const onLoad = async (res) => {
    setShow(true);
    if (props.onLoadedMetaData) {
      let info: NodesRef.BoundingClientRectCallbackResult | null = null;
      if (getInfo) {
        info = await createSelectorQuery();
      }
      res.info = info;
      props.onLoadedMetaData(res);
    }
  };

  return (
    <Video
      id={code}
      ref={ref}
      {...props}
      className={`image   transition-opacity  ${
        show ? "opacity-100" : "opacity-0"
      } ${props.className}`}
      style={`transition-duration:${duration}ms; ${props.style ?? ""}`}
      onLoadedMetaData={onLoad}
    ></Video>
  );
};
export default React.memo(CVideo);
