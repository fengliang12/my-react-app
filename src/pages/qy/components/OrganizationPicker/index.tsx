import { Picker, View } from "@tarojs/components";
import React, { useEffect } from "react";

import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

import { RecordQueryInitialState } from "../../typing";

interface Props {
  state: RecordQueryInitialState;
  callback: (e: { [K in keyof RecordQueryInitialState]?: any }) => void;
}
const Index: React.FC<Props> = (props) => {
  let { state, callback } = props;
  const parentRegionList = [];
  const regionList = [];
  const storeList = [];

  return (
    <>
      <View className="flex justify-between items-center mb-24">
        {/* 大区 */}
        <Picker
          className="w-316"
          mode="selector"
          range={parentRegionList}
          rangeKey="name"
          onChange={(e) => {
            callback({
              parentRegion: parentRegionList[e.detail.value],
            });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            <View className="picker">
              {state?.parentRegion ? state?.parentRegion?.label : "请选择大区"}
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
          range={regionList}
          rangeKey="name"
          onChange={(e) => {
            callback({
              region: regionList[e.detail.value],
            });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            {state?.region ? state?.region?.label : "请选择区域"}
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
          range={storeList}
          onChange={(e) => {
            callback({
              store: storeList[e.detail.value],
            });
          }}
        >
          <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
            <View className="picker">
              {state?.store ? state?.store?.label : "请选择门店"}
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
