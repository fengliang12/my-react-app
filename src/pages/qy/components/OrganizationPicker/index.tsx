import { Label, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn, useSetState } from "ahooks";
import React, { useEffect, useRef, useState } from "react";

import api from "@/src/api";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";

import { POSITION_ENUM } from "../../config";
import { InitialStateType } from "../../typing";

interface Props {
  originData?: any;
  state: InitialStateType;
  needShowBa?: boolean;
  callback: (e: { [K in keyof InitialStateType]?: any }) => void;
}

const app = Taro.getApp();
const Index: React.FC<Props> = (props) => {
  let { state, originData, needShowBa = false, callback } = props;

  const [baList, setBaList] = useState<ARRAY_LABEL>([]);

  const [pickerData, setPickerData] = useSetState<any>({
    bigRegionList: [],
    smallRegionList: [],
    storeList: [],
  });

  const [indexObj, setIndexObj] = useSetState<any>({
    bigRegionIndex: 0,
    smallRegionIndex: 0,
    storeIndex: 0,
    baIndex: 0,
  });

  useAsyncEffect(async () => {
    if (originData?.children) {
      let { bigRegionIndex, smallRegionIndex, storeIndex, baIndex } = indexObj;
      let tempParentList = originData?.children || [];
      let tempRegionList = tempParentList?.[bigRegionIndex]?.children || [];
      let tempStoreList = tempRegionList?.[smallRegionIndex]?.children || [];

      setPickerData({
        bigRegionList: tempParentList,
        smallRegionList: tempRegionList,
        storeList: tempStoreList,
      });

      let baList = await queryBaList(tempStoreList?.[storeIndex]?.code);

      callback({
        bigRegion: tempParentList[bigRegionIndex],
        smallRegion: tempRegionList[smallRegionIndex],
        store: tempStoreList[storeIndex],
        baId: baList?.[baIndex]?.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originData, indexObj]);

  /**
   * 获取BA列表
   */
  const storeCode = useRef<string>("");
  const queryBaList = useMemoizedFn(async (code: string) => {
    if (!code || !needShowBa) return [];
    if (storeCode.current === code) return baList;
    storeCode.current = code;

    let userInfo = await app.init();
    let tempList: ARRAY_LABEL = [];
    if (userInfo?.position === POSITION_ENUM.SA) {
      tempList = [
        { label: "全部", value: "" },
        { label: userInfo?.name, value: userInfo?.id },
      ];
    } else {
      let res = await api.qy.getBaList({
        storeId: code,
      });
      tempList = res?.data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      });
    }
    tempList.unshift({ label: "全部", value: "" });
    setBaList(tempList);
    return tempList;
  });

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
              baIndex: "",
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
            setIndexObj({
              smallRegionIndex: e.detail.value,
              storeIndex: "",
              baIndex: "",
            });
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
      <View className="mb-24 flex justify-between items-center">
        <Picker
          className={needShowBa ? "w-316" : "w-full"}
          mode="selector"
          range={pickerData.storeList}
          value={indexObj.storeIndex}
          rangeKey="name"
          onChange={(e) => {
            setIndexObj({ storeIndex: e.detail.value, baIndex: "" });
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

        {/* ba列表 */}
        {needShowBa && (
          <Picker
            className="w-316"
            mode="selector"
            range={baList}
            value={indexObj.baIndex}
            rangeKey="label"
            onChange={(e) => {
              setIndexObj({ baIndex: e.detail.value });
            }}
          >
            <View className="bg-white w-full h-78 px-30 text-24 flex items-center justify-start relative box-border">
              <View className="picker">
                {baList[indexObj.baIndex]?.label || "请选择BA"}
              </View>

              <CImage
                className="absolute right-27 w-14 h-8"
                src={`${config.imgBaseUrl}/qy/home/down_icon.png`}
              ></CImage>
            </View>
          </Picker>
        )}
      </View>
    </>
  );
};
export default Index;
