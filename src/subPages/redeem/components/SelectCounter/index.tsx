import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMemoizedFn } from "ahooks";
import React, { useState } from "react";

import api from "@/src/api";
import { P9 } from "@/src/assets/image";
import CImage from "@/src/components/Common/CImage";
import MultiplePicker from "@/src/components/Common/MultiplePicker";
import toast from "@/src/utils/toast";

interface PropsType {
  callback?: (counter: any) => void;
}

const app: App.GlobalData = Taro.getApp();
const Index: React.FC<PropsType> = (props) => {
  let { callback } = props;

  const [counterList, setCounterList] = useState<any>([]);
  const [selectCounter, setSelectCounter] = useState<any>(null);

  useAsyncEffect(async () => {
    await app.init();
    let res = await api.counter.getNearCounterList({ type: "DIRECT_SALE" });
    let list = res?.data.map((item: any) => ({
      ...item.address,
      ...item.detailInfo,
      id: item.id,
    }));
    setCounterList(list);
  }, []);

  /**
   * 确认
   */
  const confirm = useMemoizedFn((counter) => {
    if (!counter?.id) {
      toast("请先选择申领柜台");
      return;
    }
    callback && callback(counter);
  });

  return (
    <>
      <View className="w-600 m-auto mt-30 text-24 border_999 box-border">
        <MultiplePicker
          isCascadeData={false}
          cascadeCount={3}
          pickerData={counterList}
          customKeyList={["province", "city", "name"]}
          callback={(counter) => {
            setSelectCounter(counter);
            confirm(counter);
          }}
        >
          <View className="w-full h-full flex justify-between items-center">
            <View className="w-auto leading-60 flex justify-between items-center px-20">
              {selectCounter?.id ? (
                <Text>{selectCounter?.name}</Text>
              ) : (
                <Text className="text-[#999999]">请选择门店</Text>
              )}
            </View>
            <CImage className="w-20 h-16 mr-20" src={P9}></CImage>
          </View>
        </MultiplePicker>
      </View>
    </>
  );
};
export default Index;
