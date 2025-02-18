import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { useMemoizedFn, useMount, useRequest, useUpdateEffect } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import {
  Address,
  Down,
  LogoB,
  LogoW,
  P6,
  P11,
  P13,
  Tel,
} from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import { setShareParams } from "@/src/utils";
import authorize from "@/src/utils/authorize";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const NearbyStores = () => {
  /** 请求参数 */
  const [getCounterParams, setGetCounterParams] =
    useState<Api.Counter.GetCounterNearList.IRequest>({
      type: "DIRECT_SALE",
    });

  /** 获取柜台列表 */
  const { data: counterList = [], run: getNearCounterList } = useRequest(
    async (params) => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => {
        Taro.hideLoading();
        initProvinceList(res.data);
        return res.data;
      });
    },
    { manual: true },
  );

  /** 更新刷新 */
  useUpdateEffect(() => {
    getNearCounterList(getCounterParams);
  }, [getCounterParams]);

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

  /**
   * 初始化省市
   */
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
    getCounterParams?.lat &&
      setGetCounterParams((prev) => ({
        ...prev,
        province: tempProvinceList[0].label,
        city: tempProvinceList[0].children[0],
      }));

    setProvinceList([...tempProvinceList]);
  });

  /**
   * 初始化
   */
  useMount(async () => {
    const res = await new authorize({
      method: "getLocation",
    })
      .runModal({
        cancelShowModal: false, //用户第一次拒绝时立即弹窗提示需要获取权限
        reqData: {
          type: "gcj02",
          isHighAccuracy: true,
          highAccuracyExpireTime: 5000,
        },
        modalObj: {
          show: true,
          customModal: {
            show: false, // 是否自定义组件
          },
        },
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("附近门店定位结果latitude", res.latitude);
    console.log("附近门店定位结果longitude", res.longitude);

    setGetCounterParams((prev) => ({
      ...prev,
      lat: res?.latitude,
      lng: res?.longitude,
    }));
  });

  /**
   * 拉起导航
   */
  const onOpenLocation = (
    counter: Api.Counter.GetCounterNearList.NearbyCounter,
  ) => {
    if (!counter.address.lat && !counter.address.lng)
      return toast("无法导航到当前门店");
    Taro.openLocation({
      latitude: counter.address.lat,
      longitude: counter.address.lng,
      name: counter.detailInfo.name,
      address: counter.address.address,
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

  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <View className="h-screen flex flex-col justify-start items-center bg-white">
      <PrivacyAuth></PrivacyAuth>
      <CHeader
        back
        title="专柜导航"
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleColor="#FFFFFF"
      ></CHeader>
      <View className="w-full">
        <CImage
          className="w-200 ml-30 mt-41"
          mode="widthFix"
          src={LogoW}
        ></CImage>
      </View>

      <View className="w-full flex justify-between items-center text-black mt-45 text-29 px-30 box-border">
        <Picker
          range={provinceList}
          rangeKey="label"
          className="w-320"
          onChange={onChangeProvince}
        >
          <View
            className="border border-solid border-black w-full h-70 flex items-center px-20 justify-start box-border relative"
            style={{ background: "#F7F7F7" }}
          >
            <Text>
              {getCounterParams.province
                ? getCounterParams.province
                : "请选择省份"}
            </Text>
            <CImage
              className="w-25 h-14 absolute top-26 right-20"
              src={P11}
            ></CImage>
          </View>
        </Picker>
        <Picker range={cityList} className="w-320" onChange={onChangeCity}>
          <View
            className="border border-solid border-black w-full h-70 flex items-center px-20 justify-start box-border relative"
            style={{ background: "#F7F7F7" }}
          >
            <Text>
              {getCounterParams.city ? getCounterParams.city : "请选择城市"}
            </Text>
            <CImage
              className="w-25 h-14 absolute top-26 right-20"
              src={P11}
            ></CImage>
          </View>
        </Picker>
      </View>
      <View className="w-690 h-2 bg-black mt-50"></View>
      <ScrollView
        className="w-full box-border px-30 pb-40 flex-1 overflow-hidden"
        scrollY
      >
        {counterList.map((counter) => (
          <View
            key={counter.id}
            className="text-black py-30 borderBottomBlack flex"
          >
            <CImage
              className="w-25 mr-13 mt-4"
              mode="widthFix"
              src={P13}
            ></CImage>
            <View className="flex-1">
              <View
                className="text-29 inline-block font-bold ENGLISH_FAMILY"
                onClick={() => onOpenLocation(counter)}
              >
                {counter.detailInfo.name}
              </View>
              <View
                className="text-25 flex items-center text-black mt-23 mb-22"
                onClick={() => onOpenLocation(counter)}
              >
                <View className="flex-1 ENGLISH_FAMILY">
                  {counter.address.address}
                </View>
              </View>
              <View
                className="text-25 flex items-center text-black"
                onClick={() => onMakePhoneCall(counter.detailInfo.telephone)}
              >
                <View className="flex-1 ENGLISH_FAMILY underline">
                  {counter.detailInfo.telephone}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NearbyStores;
