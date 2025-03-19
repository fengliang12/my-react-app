import { Picker, View } from "@tarojs/components";
import { useAsyncEffect, useSetState } from "ahooks";
import React, { useEffect } from "react";

import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

import { useHandleOrganization } from "../../hoooks/useHandleOrganization";
import { RecordQueryInitialState } from "../../typing";

interface Props {
  state: RecordQueryInitialState;
  callback: (e: { [K in keyof RecordQueryInitialState]?: any }) => void;
}

const Index: React.FC<Props> = (props) => {
  let { state, callback } = props;
  const [pickerData, setPickerData] = useSetState<any>({
    bigRegionList: [],
    smallRegionList: [],
    storeList: [],
  });

  const [indexObj, setIndexObj] = useSetState<any>({
    bigRegionIndex: 0,
    smallRegionIndex: 0,
    storeIndex: 0,
  });

  const { originData } = useHandleOrganization();

  useEffect(() => {
    if (originData?.children) {
      let { bigRegionIndex, smallRegionIndex, storeIndex } = indexObj;
      let tempParentList = originData?.children || [];
      let tempRegionList = tempParentList?.[bigRegionIndex]?.children || [];
      let tempStoreList = tempRegionList?.[smallRegionIndex]?.children || [];

      setPickerData({
        bigRegionList: tempParentList,
        smallRegionList: tempRegionList,
        storeList: tempStoreList,
      });
      callback({
        bigRegion: tempParentList[bigRegionIndex],
        smallRegion: tempRegionList[smallRegionIndex],
        store: tempStoreList[storeIndex],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originData, indexObj]);

  return (
    <>
      <View className="flex justify-between items-center mb-24">
        {/* 大区 */}
        <Picker
          className="w-316"
          mode="selector"
          range={pickerData.bigRegionList}
          value={indexObj.bigRegionIndex}
          rangeKey="name"
          onChange={(e) => {
            setIndexObj({
              bigRegionIndex: e.detail.value,
              smallRegionIndex: "",
              storeIndex: "",
            });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            <View className="picker">
              {state?.bigRegion ? state?.bigRegion?.name : "请选择大区"}
            </View>
            <CImage
              className="absolute right-27 w-14 h-8"
              src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
            ></CImage>
          </View>
        </Picker>

        {/* 区域主管 */}
        <Picker
          className="w-316"
          mode="selector"
          range={pickerData.smallRegionList}
          value={indexObj.smallRegionIndex}
          rangeKey="name"
          onChange={(e) => {
            setIndexObj({ smallRegionIndex: e.detail.value, storeIndex: "" });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            {state?.smallRegion ? state?.smallRegion?.name : "请选择区域"}
            <CImage
              className="absolute right-27 w-14 h-8"
              src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
            ></CImage>
          </View>
        </Picker>
      </View>

      {/* 门店 */}
      <View className="mb-24">
        <Picker
          mode="selector"
          range={pickerData.storeList}
          value={indexObj.storeIndex}
          rangeKey="name"
          onChange={(e) => {
            setIndexObj({ storeIndex: e.detail.value });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            <View className="picker">
              {state?.store ? state?.store?.name : "请选择门店"}
            </View>

            <CImage
              className="absolute right-27 w-14 h-8"
              src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
            ></CImage>
          </View>
        </Picker>
      </View>
    </>
  );
};
export default Index;
