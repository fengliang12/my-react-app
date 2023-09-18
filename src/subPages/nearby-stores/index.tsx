import { Picker, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoizedFn, useMount, useRequest, useUpdateEffect } from "ahooks";
import { useMemo, useState } from "react";

import api from "@/src/api";
import { Address, Down, Tel } from "@/src/assets/image";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import PrivacyAuth from "@/src/components/PrivacyAuth";
import authorize from "@/src/utils/authorize";
import toast from "@/src/utils/toast";

const app: App.GlobalData = Taro.getApp();

const NearbyStores = () => {
  /** 请求参数 */
  const [getCounterParams, setGetCounterParams] =
    useState<Api.Counter.GetCounterNearList.IRequest>({});

  /** 获取柜台列表 */
  const { data: counterList = [], run: getNearCounterList } = useRequest(
    async (params) => {
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => {
        initProvinceList(res.data);
        // if (!provinceList.length) return [];
        return res.data;
      });
    },
    { manual: true },
  );

  /** 更新刷新 */
  useUpdateEffect(() => {
    console.log(111111111111, getCounterParams);

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
    <View className="h-screen flex flex-col justify-start items-center bg-white">
      <PrivacyAuth></PrivacyAuth>
      <CHeader
        back
        title="专柜导航"
        fill
        backgroundColor="rgba(0,0,0,1)"
        titleColor="#FFFFFF"
      ></CHeader>

      <View className="w-full flex justify-between items-center text-black mt-30 text-30 px-30 box-border">
        <Picker
          range={provinceList}
          rangeKey="label"
          className="w-320"
          onChange={onChangeProvince}
        >
          <View className="border border-solid border-black w-full h-70 flex items-center px-20 justify-start box-border relative">
            <Text>
              {getCounterParams.province
                ? getCounterParams.province
                : "请选择省份"}
            </Text>
            <CImage
              className="w-25 h-24 absolute top-20 right-20"
              src={Down}
            ></CImage>
          </View>
        </Picker>
        <Picker range={cityList} className="w-320" onChange={onChangeCity}>
          <View className="border border-solid border-black w-full h-70 flex items-center px-20 justify-start box-border relative">
            <Text>
              {getCounterParams.city ? getCounterParams.city : "请选择城市"}
            </Text>
            <CImage
              className="w-25 h-24 absolute top-20 right-20"
              src={Down}
            ></CImage>
          </View>
        </Picker>
      </View>
      <View className="w-690 h-2 bg-black mt-40"></View>
      <ScrollView
        className="w-full box-border px-30 pb-40 flex-1 overflow-hidden"
        scrollY
      >
        {counterList.map((counter) => (
          <View key={counter.id} className="text-black p-30 borderBottomBlack">
            <View
              className="text-36  underline"
              onClick={() => onOpenLocation(counter)}
            >
              {counter.detailInfo.name}
            </View>
            <View
              className="text-32 flex items-center text-black text-opacity-70 mt-30 mb-10"
              onClick={() => onOpenLocation(counter)}
            >
              <CImage className="w-24 h-36 mr-14" src={Address}></CImage>
              <View className="flex-1">{counter.address.address}</View>
            </View>
            <View
              className="text-32 flex items-center text-black text-opacity-70"
              onClick={() => onMakePhoneCall(counter.detailInfo.telephone)}
            >
              <CImage className="w-22 h-29 mr-14" src={Tel}></CImage>
              <View className="flex-1">{counter.detailInfo.telephone}</View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NearbyStores;
