import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useAsyncEffect, useMount, useRequest, useUpdateEffect } from "ahooks";
import { useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import config from "@/src/config";
import authorize from "@/src/utils/authorize";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import RulePopup from "./components/RulePopup";
import useActivityHook from "./hooks/activity";

const app: App.GlobalData = Taro.getApp();

const Index = () => {
  const { activityDetail, extendInfos } = useActivityHook();
  const [joinFlag, setJoinFlag] = useState<boolean>(false);

  /** 请求参数 */
  const [getCounterParams, setGetCounterParams] =
    useState<Api.Counter.GetCounterNearList.IRequest>({
      type: "DIRECT_SALE",
    });

  useAsyncEffect(async () => {
    await app.init();
    const res = await api.clockin.joinClockInFlag();
    setJoinFlag(res.data);
  }, []);

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

  /** 获取柜台列表 */
  const { data: counterList = [], run: getNearCounterList } = useRequest(
    async (params) => {
      Taro.showLoading({ title: "加载中", mask: true });
      await app.init();
      return api.counter.getNearCounterList(params).then((res) => {
        Taro.hideLoading();
        return res.data;
      });
    },
    { manual: true },
  );

  /** 更新刷新 */
  useUpdateEffect(() => {
    getNearCounterList(getCounterParams);
  }, [getCounterParams]);

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

  const onSubmit = () => {
    const system = Taro.getSystemInfoSync();
    if (!system.locationEnabled || !system.locationAuthorized) {
      toast("手机-设置-微信-位置授权 未开启");
      return;
    }

    if (joinFlag) return;

    // 扫码签到
    Taro.scanCode({
      success: async (res) => {
        if (res?.result) {
          let result = await api.clockin.submitClockInQrCode({
            lat: String(getCounterParams.lat),
            lng: String(getCounterParams.lng),
            code: res.result,
          });
          console.log(result);
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
  };
  return (
    <View
      className="w-full min-h-screen"
      style={{
        background: `url(${activityDetail?.backgroundImage})`,
        backgroundSize: "100% 100%",
      }}
    >
      <CHeader
        back
        fill
        title="NARS"
        backgroundColor="rgba(0,0,0,0)"
        titleColor="#FFFFFF"
      ></CHeader>

      <View className="w-640 mt-55 ml-55 pb-80">
        <View className="w-full flex justify-between text-white text-20">
          <View
            className="underline"
            onClick={() => to("/subPages/common/pointsDetail/index")}
          >
            积分明细
          </View>
          <RulePopup imageUrl={activityDetail.ruleImage}></RulePopup>
        </View>

        <View className="w-full h-886 mt-40">
          <CImage
            className="w-full h-full"
            mode="widthFix"
            src={`${config.imgBaseUrl}/${extendInfos?.main_img}`}
          ></CImage>
        </View>

        <View
          className="w-full h-160 mt-26 text-white px-28 box-border text-20"
          style="background: rgba(255,255,255,0.1);"
        >
          <View
            className="w-full h-91 flex justify-between items-center px-20 box-border"
            onClick={() => onOpenLocation(counterList?.[0])}
          >
            <View
              className="w-77 h-42 rounded-42 mr-28 flex items-center justify-center"
              style="background: rgba(255,255,255,0.1);"
            >
              附近
            </View>
            <View className="flex-1">{counterList?.[0]?.detailInfo?.name}</View>
            <View className="flex items-center ml-10">{`${
              counterList?.[0]?.distance?.toFixed(2) ?? 0.0
            }km >`}</View>
          </View>
          <View className="w-full h-1 bg-white"></View>
          <View className="w-full h-68 vhCenter">
            <Text
              className="underline"
              onClick={() => to("/subPages/nearby-stores/index")}
            >
              查看更多门店
            </Text>
          </View>
        </View>

        {joinFlag ? (
          <View
            className="w-400 ml-120 mt-58 h-80 text-24 flex text-white items-center justify-center"
            style={{
              backgroundColor: "#999",
            }}
          >
            已打卡
          </View>
        ) : (
          <View
            className="w-400 ml-120 mt-58 h-80 text-24 bg-white flex items-center justify-center"
            onClick={onSubmit}
          >
            <CImage
              className="w-25 h-25 mr-15"
              mode="widthFix"
              src={`${config.imgBaseUrl}/sign/scan_icon.png`}
            ></CImage>
            立即打卡
          </View>
        )}

        <View className="w-full text-center text-20 mt-32 text-white">
          如有疑问，请点击咨询
          <Text
            className="underline"
            onClick={() =>
              to(
                "/pages/h5/index?url=https://cnaipswx1v1-stg.shiseido.cn/nars/home",
              )
            }
          >
            专属彩妆师
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Index;
