import { View } from "@tarojs/components";
import { useBoolean } from "ahooks";
import React, { useEffect } from "react";

import CImage from "@/src/components/Common/CImage";
import CPopup from "@/src/components/Common/CPopup";

interface Props {
  imageUrl: string;
}
const RulePopup: React.FC<Props> = (props) => {
  let { imageUrl } = props;
  const [show, { setTrue, setFalse }] = useBoolean(false);

  return (
    <>
      <View className="underline" onClick={setTrue}>
        活动规则
      </View>
      {show && (
        <CPopup maskClose closePopup={setFalse}>
          <View className="w-640 bg-white rounded-0 overflow-hidden">
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
