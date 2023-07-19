import { View } from "@tarojs/components";
import React from "react";
import pageSettingConfig from "src/config/pageSettingConfig";

interface Popup {
  //点击背景关闭弹窗
  maskClose?: boolean;
  //禁用滚动，默认禁用，如果页面上有滚动效果，必须设置为false
  catchMove?: boolean;
  closePopup?: () => void;
  children?: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}
const CPopup: React.FC<Popup> = (props) => {
  const { maskClose = true, catchMove = true, className } = props;
  const closePopup = () => {
    props.closePopup && props.closePopup();
  };
  return (
    <View className="w-screen h-screen fixed left-0 top-0 z-10000">
      <View
        onClick={() => {
          maskClose && closePopup();
        }}
        className={`w-screen h-screen fixed left-0 top-0 ${className}`}
        style={{ backgroundColor: props?.backgroundColor || "rgba(0,0,0,.5)" }}
      ></View>
      <View
        catchMove={catchMove}
        className="transform fixed left-p50 top-p50 z-12000 translate-y-n50 translate-x-n50"
      >
        <View
          className={`relative animate__animated ${
            pageSettingConfig?.cPopup?.animateIn ?? "animate__zoomIn"
          }`}
        >
          {props.children}
        </View>
      </View>
    </View>
  );
};
export default CPopup;
