import { Picker, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useMount, useRequest, useUpdateEffect } from "ahooks";
import { useEffect, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const NearbyStores = () => {
  const { data: counterList = [], run: getNearCounterList } = useRequest(
    async (params) => {
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => res.data);
    },
    { manual: true },
  );

  /** 获取城市列表 */
  const { data: provinceList, run: getCounterCity } = useRequest(async () => {
    await app.init();
    return api.counter.getCounterCity().then((res) => res.data);
  });

  const [getCounterParams, setGetCounterParams] =
    useState<Api.Counter.GetCounterNearList.IRequest>({});

  /** 更新刷新 */
  useUpdateEffect(() => {
    getNearCounterList(getCounterParams);
  }, [getCounterParams, getNearCounterList]);

  useMount(async () => {
    Taro.getLocation({
      success: async (res) => {
        const { latitude, longitude } = res;
        console.log("res====>", res);
        setGetCounterParams((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));
      },
      fail: (err) => {
        setGetCounterParams((prev) => ({
          ...prev,
        }));
      },
    });
  });

  /** 拉起导航 */
  const onOpenLocation = (
    counter: Api.Counter.GetCounterNearList.NearbyCounter,
  ) => {
    if (!counter.address.lat && !counter.address.lng)
      return toast("无法导航到当前门店");
    Taro.openLocation({
      latitude: counter.address.lat,
      longitude: counter.address.lng,
      name: counter.detailInfo.name,
    });
  };

  /** 拉起电话 */
  const onMakePhoneCall = (phoneNumber) => {
    if (!phoneNumber) return toast("当前门店暂时无法联系");
    Taro.makePhoneCall({
      phoneNumber,
    });
  };

  return (
    <>
      <CHeader
        back
        title="附近门店"
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleColor="#FFFFFF"
      ></CHeader>

      <CImage
        src={`${config.imgBaseUrl}/appointment/appointment_icon.jpg`}
        mode="widthFix"
        className="w-full"
      />

      <View className="flex justify-center items-center text-white mt-30">
        <Picker className="w-240 ">
          <View className="border border-solid border-white w-full h-60"></View>
        </Picker>
        <View className="mx-30">-</View>
        <Picker className="w-240 ">
          <View className="border border-solid border-white w-full h-60"></View>
        </Picker>
      </View>

      <View className="px-30 pb-30">
        {counterList.map((counter) => (
          <View key={counter.id} className="text-white bg-b4F4F4F p-30 my-30">
            <View className="text-36" onClick={() => onOpenLocation(counter)}>
              {counter.detailInfo.name}
            </View>
            <View
              className="text-24 flex items-start text-white text-opacity-70 my-10"
              onClick={() => onOpenLocation(counter)}
            >
              <View className="w-24 h-24 mr-10"></View>
              <View>{counter.address.address}</View>
            </View>
            <View
              className="text-30 flex items-start text-white text-opacity-70"
              onClick={() => onMakePhoneCall(counter.detailInfo.telephone)}
            >
              <View className="w-24 h-24 mr-10"></View>
              <View>{counter.detailInfo.telephone}</View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

export default NearbyStores;
