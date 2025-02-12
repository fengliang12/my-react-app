import { View } from "@tarojs/components";
import { useBoolean } from "ahooks";
import React, { useEffect } from "react";

import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";

interface Props {
  imageUrl: string;
  callbackFn?: () => void;
}
const RulePopup: React.FC<Props> = (props) => {
  let { imageUrl, callbackFn } = props;
  const [show, { setTrue, setFalse }] = useBoolean(false);

  return (
    <>
      <View
        className="underline"
        onClick={() => {
          callbackFn && callbackFn();
          setTrue();
        }}
      >
        活动规则
      </View>
      {show && (
        <CPopup maskClose closePopup={setFalse}>
          <View
            className="w-640 bg-white rounded-0 overflow-hidden"
            style={{ transform: "translateY(-10%)" }}
          >
            <CImage
              className="w-full h-full"
              mode="widthFix"
              src={imageUrl}
            ></CImage>
            <View
              className="absolute w-80 h-80 top-0 right-0 vhCenter"
              onClick={setFalse}
            ></View>
          </View>
        </CPopup>
      )}
    </>
  );
};
export default RulePopup;
