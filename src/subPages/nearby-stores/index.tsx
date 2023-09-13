import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useMount, useRequest, useUpdateEffect } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const NearbyStores = () => {
  /** 获取柜台列表 */
  const { data: counterList = [], run: getNearCounterList } = useRequest(
    async (params) => {
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => {
        initProvinceList(res.data);
        if (!provinceList.length) return [];
        return res.data;
      });
    },
    { manual: true },
  );

  /** 请求参数 */
  const [getCounterParams, setGetCounterParams] =
    useState<Api.Counter.GetCounterNearList.IRequest>({});

  /** 更新刷新 */
  useUpdateEffect(() => {
    getNearCounterList(getCounterParams);
  }, [getCounterParams, getNearCounterList]);

  const [provinceList, setProvinceList] = useState<
    Array<{
      label: string;
      children: Array<string>;
    }>
  >([]);

  const cityList = useMemo(
    () =>
      provinceList.find((item) => item.label === getCounterParams.province)
        ?.children || [],
    [provinceList, getCounterParams.province],
  );

  /** 初始化省市 */
  const initProvinceList = useMemoizedFn((initCounterList) => {
    if (provinceList.length) return;
    let tempProvinceList: Array<{
      label: string;
      children: Array<string>;
    }> = [];

    initCounterList.forEach((counter) => {
      let index = tempProvinceList.findIndex(
        (province) => province.label === counter.address.province,
      );
      if (index !== -1) {
        // 存在 去除重复的市
        if (!tempProvinceList[index].children.includes(counter.address.city)) {
          tempProvinceList[index].children.push(counter.address.city);
        }
      } else {
        tempProvinceList.push({
          label: counter.address.province,
          children: [counter.address.city],
        });
      }
    });
    setGetCounterParams((prev) => ({
      ...prev,
      province: tempProvinceList[0].label,
      city: tempProvinceList[0].children[0],
    }));
    setProvinceList(tempProvinceList);
  });

  /** 初始化 */
  useMount(async () => {
    Taro.getLocation({
      success: async (res) => {
        const { latitude, longitude } = res;
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

  /** 修改省份 */
  const onChangeProvince = (e) => {
    const index = e.detail.value;
    setGetCounterParams((prev) => ({
      ...prev,
      province: provinceList[index].label,
      city: provinceList[index].children[0],
    }));
  };

  /** 修改城市 */
  const onChangeCity = (e) => {
    const index = e.detail.value;
    setGetCounterParams((prev) => ({
      ...prev,
      city: cityList[index],
    }));
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

      <View className="flex justify-center items-center text-white mt-30 text-24">
        <Picker
          range={provinceList}
          rangeKey="label"
          className="w-240"
          onChange={onChangeProvince}
        >
          <View className="border border-solid border-white w-full h-60 flex items-center px-10 justify-between box-border">
            <Text>{getCounterParams.province}</Text>
          </View>
        </Picker>
        <View className="mx-30">-</View>
        <Picker range={cityList} className="w-240" onChange={onChangeCity}>
          <View className="border border-solid border-white w-full h-60 flex items-center px-10 justify-between box-border">
            <Text>{getCounterParams.city}</Text>
          </View>
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
