import React, { CSSProperties } from "react";
import { View, Image } from "@tarojs/components";
import { T17 } from "@/assets/image/index";
import classNames from "classnames";
import { useMemoizedFn } from "ahooks";

import "./index.less";

type DialogProps = {
  show: boolean;
  title?: string;
  content?: string;
  titleStyle?: CSSProperties;
  onCancel?: (e: any) => void;
  onSubmit?: (e: any) => void;
  myBtn?: string;
  position?: string;
  boxStyle?: CSSProperties;
  img?: string;
  onMask?: () => void;
};

const Dialog: React.FC<DialogProps> = ({
  show,
  title = "",
  titleStyle,
  content = "",
  onCancel,
  onSubmit,
  myBtn = "",
  position = "",
  boxStyle,
  img,
  onMask,
}) => {
  const tapMask = useMemoizedFn((e: ITouchEvent) => {
    e.stopPropagation();
    onMask?.(!show);
  });

  return (
    <>
      <View
        className={classNames("dialog ", !show ? "hideshow" : "")}
        onClick={tapMask}
      >
        <View
          className={classNames("box", position, boxStyle)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {img ? (
            <View className="img">{img}</View>
          ) : (
            <Image
              className="close"
              src={T17}
              mode="widthFix"
              onClick={(e) => onCancel?.(e)}
            />
          )}
          <View className="title" style={titleStyle ?? {}}>
            {title}
          </View>
          {content && <View className="content">{content}</View>}

          {myBtn ? (
            <View className="mybtn">{myBtn}</View>
          ) : (
            <View className="button-box">
              <View className="cancel" onClick={(e) => onCancel?.(e)}>
                取消
              </View>
              <View className="submit" onClick={(e) => onSubmit?.(e)}>
                确认
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default Dialog;
