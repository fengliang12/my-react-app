import "./index.less";

import { View } from "@tarojs/components";
import React from "react";

import { CloseB } from "@/src/assets/image";
import pageSettingConfig from "@/src/config/pageSettingConfig";
import setShow from "@/src/utils/setShow";
import to from "@/src/utils/to";

import CImage from "../Common/CImage";
import CPopup from "../Common/CPopup";

interface PropsType {
  show: boolean;
  setFalse: () => void;
  setTrue?: () => void;
}

const BindDialog: React.FC<PropsType> = (props) => {
  let { show, setFalse } = props;

  return (
    <View style={setShow(show)}>
      <CPopup maskClose closePopup={setFalse}>
        <View className="w-500 h-450 bg-white flex flex-col items-center justify-center relative text-center text-36">
          <View>注册开启玩妆之旅!</View>
          <View className="mt-10">收集潮妆，获取好礼</View>
          <View
            className="w-300 text-30 h-70 vhCenter bg-black text-white mt-60"
            onClick={() => {
              setFalse && setFalse();
              to(pageSettingConfig.registerPath);
            }}
          >
            立即注册
          </View>
          <CImage
            className="w-30 h-30 absolute top-30 right-30"
            onClick={setFalse}
            src={CloseB}
          ></CImage>
        </View>
      </CPopup>
    </View>
  );
};

export default React.memo(BindDialog);
