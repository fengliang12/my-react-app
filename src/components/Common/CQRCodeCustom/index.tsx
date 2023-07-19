// 通用二维码
import { Canvas, View } from "@tarojs/components";
import Taro, { PageInstance } from "@tarojs/taro";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useRef, useState } from "react";
import drawQrcode from "src/utils/weapp.qrcode.esm";

import CImage from "../CImage";

// 二维码中间展示图片
interface QRImage {
  // 图片url
  imageResource: string;
  // 宽度
  width?: number;
  // 高度
  height: number;
  // 是否圆形
  round?: boolean;
}
export interface QRCode {
  //图片回传
  onMyEvent?: Function;
  /** Canvas大小 */
  width?: number;
  /**高度 */
  height?: number;
  /** Canvas背景色 */
  background?: string;
  /** 二维码颜色 */
  foreground?: string;
  /**生成文本 */
  text: string;
  /**生产失败后重新生成延迟 */
  delay?: number;
  // 二维码padding
  padding?: number;
  paddingColor?: string;
  image?: QRImage;
}
const Component: React.FC<QRCode> = (props) => {
  const {
    background = "rgba(0, 0, 0, 0)",
    foreground = "black",
    width = 400,
    height = 400,
    text,
    delay = 1000,
    padding = 0,
    paddingColor = "rgba(0, 0, 0, 0)",
    image = { imageResource: "", width: 80, height: 80, round: !0 },
    onMyEvent,
  } = props;
  const canvasRef = useRef({ uid: "" });
  //立刻执行
  const immediately = useRef(true);
  const [imageUrl, setImageUrl] = useState("");
  // 创建二维码
  const updateCanvas = useMemoizedFn(async () => {
    if (!canvasRef.current?.uid) {
      setTimeout(() => {
        updateCanvas();
      }, delay);
      return;
    }
    if (!text) return;
    Taro.createSelectorQuery()
      .select(`#${canvasRef.current.uid}`)
      .fields({
        node: true,
      })
      .exec(async (res: Taro.SelectorQuery) => {
        if (!res?.[0]) {
          setTimeout(() => {
            updateCanvas();
          }, delay);
          return;
        }
        const canvas = res[0].node;
        const radio = 750 / Taro.getSystemInfoSync().windowWidth;
        const getFilePath = () => {
          Taro.canvasToTempFilePath({
            width: width / radio,
            height: height / radio,
            canvas,
            success(res) {
              setImageUrl(res.tempFilePath);
              if (res.tempFilePath && onMyEvent) onMyEvent(res.tempFilePath);
            },
            fail() {
              //未显示加载失败不处理
              if (!show) return;
              if (immediately.current) {
                console.log("立刻执行", immediately.current);
                immediately.current = false;
                updateCanvas();
              } else {
                setTimeout(() => {
                  updateCanvas();
                }, delay);
              }
            },
          });
        };
        const options = {
          width: width / radio,
          height: height / radio,
          canvas,
          text: text.toString(),
          background,
          padding,
          foreground,
          paddingColor,
          image: {},
          correctLevel: 1,
        };
        if (image.imageResource) {
          const img = canvas.createImage();
          img.src = image.imageResource;
          img.onload = async () => {
            options.image = {
              imageResource: img,
              width: image.width,
              height: image.height,
              round: image.round,
            };
            await drawQrcode(options);
            getFilePath();
          };
        } else {
          await drawQrcode(options);
          getFilePath();
        }
      });
  });

  const [show, setShow] = useState(false);
  const ref = useRef({ uid: "" });
  // 监听组件显示
  useEffect(() => {
    let _observer: any;
    //组件显示事件
    const showCommonEvent = () => {
      _observer = Taro.createIntersectionObserver(
        Taro.getCurrentInstance().page as PageInstance,
        {
          thresholds: [1],
          observeAll: true,
        },
      );
      const options = {};
      _observer
        .relativeToViewport(options)
        .observe(`#${ref.current.uid}`, (res) => {
          const hide = !res || res.intersectionRatio < 1;
          setShow(!hide);
          if (hide) return;
          updateCanvas();
        });
    };
    setTimeout(() => {
      showCommonEvent();
    });
    return () => {
      if (_observer) {
        _observer.disconnect();
      }
    };
  }, [ref, updateCanvas]);
  useEffect(() => {
    updateCanvas();
  }, [updateCanvas, text]);
  return (
    <>
      <View
        className="overflow-hidden relative"
        style={`width:${width}rpx;height:${height}rpx;`}
      >
        {/* 用于显示监听不能随意删除 */}
        <View
          style="height:1;"
          className="absolute opacity-0 left-0 top-0"
          ref={ref}
        >
          1
        </View>
        <View className="absolute opacity-0" style="top:1000vh;left:1000vw">
          <Canvas
            ref={canvasRef}
            style={`width:${width}rpx;height:${height}rpx`}
            type="2d"
          />
        </View>

        {imageUrl && (
          <CImage
            style={`width:${width}rpx;height:${height}rpx;`}
            src={imageUrl}
          ></CImage>
        )}
      </View>
    </>
  );
};
export default React.memo(Component);
