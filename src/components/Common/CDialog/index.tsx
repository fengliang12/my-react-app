import { Text, View, ViewProps } from "@tarojs/components";
import React, { useEffect } from "react";

import CPopup from "../CPopup";

interface T_Props extends ViewProps {
  title?: string;
  dialogText?: string;
  showBtn?: boolean;
  showHideBtn?: boolean;
  btnText?: string;
  hideBtnText?: string;
  cancel?: () => void;
  confirm?: () => void;
}
const CDialog: React.FC<T_Props> = (props) => {
  let {
    title = "",
    dialogText = "",
    showBtn = true,
    showHideBtn = true,
    btnText = "确定",
    hideBtnText = "取消",
    cancel,
    confirm,
  } = props;

  return (
    <CPopup
      closePopup={() => {
        cancel?.();
      }}
    >
      <View className={props?.className}>
        <View className="w-full text-center mt-40">
          <Text className="text-32">{title}</Text>
        </View>
        <View className="mt-70 text-center text-28">
          <Text>{dialogText}</Text>
        </View>
        <View className="w-full flex justify-around mt-80">
          {showHideBtn && (
            <View
              onClick={() => {
                cancel?.();
              }}
              className="w-155 h-55 vhCenter text-black box-border text-28 rotate_360"
              style={{ border: "1px solid #000000" }}
            >
              {hideBtnText}
            </View>
          )}
          {showBtn && (
            <View
              onClick={() => confirm?.()}
              className="w-155 h-55 vhCenter text-white bg-black text-28"
            >
              {btnText}
            </View>
          )}
        </View>
      </View>
    </CPopup>
  );
};
export default CDialog;
