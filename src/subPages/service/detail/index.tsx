import { Text, View } from "@tarojs/components";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useRequest } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import useSubMsg from "@/src/hooks/useSubMsg";
import { setShareParams } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";

import ServiceBox from "../components/ServiceBox";
import useProject from "../hooks/useProject";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const { project, num = 0, reason } = useProject();

  /**
   * 获取详情
   */
  const {
    data,
    run: getDetail,
    cancel,
  } = useRequest(
    async () => {
      await app.init();
      return await api.adhocReservation.getRecords().then((res) => {
        return (
          res.data.find((i) => i.bookCode === router.params.bookCode) ||
          ({} as Api.AdhocReservation.GetRecords.Item)
        );
      });
    },
    {
      pollingInterval: 3000,
    },
  );

  const [detail, setDetail] =
    useState<Api.Counter.GetCounterDetail.IResponse>();
  useAsyncEffect(async () => {
    if (data && !detail) {
      let res = await api.counter.getCounterDetail(data.storeCode);
      setDetail(res?.data);
    }
  }, [data]);

  const statusText = useMemo(() => {
    switch (Number(data?.status)) {
      case 0:
        return "待到店";
      case 1:
        cancel();
        return "已完成";
      case 2:
        cancel();
        return "已过期";
    }
  }, [cancel, data?.status]);

  const beginTime = useMemo(() => {
    let index = data?.serviceTime.lastIndexOf("-");
    let time = data?.serviceTime.substring(0, index);
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
  }, [data]);

  /**
   * 取消服务
   */
  const subMsg = useSubMsg();
  const onCancel = async () => {
    if (
      reason?.cancel &&
      dayjs(beginTime).subtract(reason.cancel, "hour").valueOf() < Date.now()
    ) {
      return toast(`服务开始前${reason.cancel}小时不可取消`);
    }
    Taro.showModal({
      title: "温馨提示",
      content: `亲爱的NARS会员\r\n您确认取消以下服务吗?\r\n${data?.projectName}\r\n${data?.storeName}\r\n${data?.serviceTime}`,
      success: async (res) => {
        // 点击确定的时候取消服务预约
        if (res.confirm) {
          await subMsg("SERVICE_CANCEL");
          Taro.showLoading({ title: "加载中", mask: true });
          await api.adhocReservation
            .cancel({
              bookCode: data?.bookCode,
              projectCode: data?.projectCode,
              counterCode: data?.storeCode,
              beginTime: beginTime,
            })
            .then(() => {
              Taro.hideLoading();
              to(1);
            });
        }
      },
    });
  };

  /**
   * 修改
   */
  const onModity = useMemoizedFn(() => {
    if (
      reason?.modify &&
      dayjs(beginTime).subtract(reason.modify, "hour").valueOf() < Date.now()
    ) {
      return toast(`服务开始前${reason.modify}小时不可修改`);
    }
    setTrue();
    cancel();
  });

  const closePop = useMemoizedFn(() => {
    getDetail();
    setFalse();
  });

  /**
   * 门店路线
   */
  const toMap = useMemoizedFn(() => {
    Taro.openLocation({
      latitude: Number(detail?.address?.lat),
      longitude: Number(detail?.address?.lng),
      name: detail?.detailInfo?.name,
      address: detail?.address?.address,
    });
  });

  /**
   * 拨打电话
   */
  const tel = useMemoizedFn(() => {
    Taro.makePhoneCall({
      phoneNumber: detail?.detailInfo?.telephone,
    });
  });

  /**
   * 添加ba
   */
  const addBa = useMemoizedFn(() => {
    Taro.navigateTo({
      url: `/pages/h5/index?url=https://cnaipswx1v1-stg.shiseido.cn/nars/home`,
    });
  });
  useShareAppMessage(() => {
    return setShareParams();
  });

  return (
    <>
      <View className="service-introduce min-h-screen bg-black text-black flex flex-col overflow-hidden pb-100">
        <CHeader
          back
          fill
          backgroundColor="rgba(0,0,0,0)"
          titleCss="height:85rpx"
          titleColor="#FFFFFF"
        ></CHeader>
        <CImage
          className="w-137 h-60 ml-40 mt-40"
          src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/service/nars_logo.png"
        ></CImage>
        <CImage
          className="w-222 h-48 ml-40 mt-22"
          src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/service/detail_text.png"
        ></CImage>
        <View className="w-680 ml-35 mt-40 px-34 vhCenter flex-col box-border bg-white pb-100">
          <View className="text-left flex justify-between mt-53 w-full">
            <Text className="text-35">{data?.projectName}</Text>
            <Text className="text-29">{statusText}</Text>
          </View>
          <View className="w-full h-1 bg-black mt-35"></View>
          <View className="inline-block bg-white m-auto mt-65">
            {data?.bookCode ? (
              <CQRCodeCustom
                text={data?.bookCode}
                width={300}
                height={300}
                padding={10}
                foreground={data?.status === "0" ? "black" : "gray"}
                background="#FFFFFF"
              ></CQRCodeCustom>
            ) : null}
          </View>
          <View className="text-left text-26  mt-80 w-full flex justify-between">
            <Text>预约时间</Text>
            <Text>{data?.serviceTime}</Text>
          </View>
          <View className="text-left text-26 mt-47 w-full flex justify-between">
            <Text>预约门店</Text>
            <Text>{data?.storeName}</Text>
          </View>
          <View className="text-left text-26 mt-47 w-full flex justify-between">
            <Text>预约地址</Text>
            <Text className="flex-1 text-right">
              {detail?.address?.address}
            </Text>
          </View>
          <View className="w-full vhCenter mt-60">
            <View className="flex-1 vhCenter flex-col" onClick={toMap}>
              <CImage
                className="w-50 h-50"
                src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/apponitment/router.png"
              ></CImage>
              <Text className="text-20 mt-20">门店路线</Text>
            </View>
            <View
              className="flex-1 vhCenter flex-col"
              style={{
                borderLeft: "1px solid #6D6D6D",
                borderRight: "1px solid #6D6D6D",
              }}
              onClick={tel}
            >
              <CImage
                className="w-50 h-50"
                src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/apponitment/tel.png"
              ></CImage>
              <Text className="text-20 mt-20">联系专柜</Text>
            </View>
            <View className="flex-1 vhCenter flex-col" onClick={addBa}>
              <CImage
                className="w-50 h-50"
                src="https://cna-prd-nars-oss.oss-cn-shanghai.aliyuncs.com/apponitment/ba.png"
              ></CImage>
              <Text className="text-20 mt-20">联系彩妆师</Text>
            </View>
          </View>
          <View className="w-full h-1 bg-black mt-60"></View>
          <View className="w-full">
            <View className="text-26 mt-50">使用规则</View>
            <View
              className="text-22 leading-35 mt-20 flex"
              style={{ color: "#6D6D6D" }}
            >
              <Text>·</Text>
              <Text>
                本妆容服务为局部妆容服务，非完妆妆容服务，服务时长20分钟。
              </Text>
            </View>
            <View
              className="text-22 leading-35 mt-10 flex"
              style={{ color: "#6D6D6D" }}
            >
              <Text>·</Text>
              <Text>
                请您于预约时间内莅临指定专柜，出示本预约码，由彩妆师核销后可享受服务，逾期视为放弃本次服务。
              </Text>
            </View>
            <View
              className="text-22 leading-35 mt-10 flex"
              style={{ color: "#6D6D6D" }}
            >
              <Text>·</Text>
              <Text>
                如您无法按时出席，您可在预约开始前{reason?.modify}
                小时修改预约，若超出修改时间则无法修改。
              </Text>
            </View>
            <View
              className="text-22 leading-35 mt-10 flex"
              style={{ color: "#6D6D6D" }}
            >
              <Text>·</Text>
              <Text>
                如您需要取消预约，您可在预约开始前{reason?.modify}
                小时取消预约，若超出修改时间则无法取消。
              </Text>
            </View>
            <View
              className="text-22 leading-35 mt-10 flex"
              style={{ color: "#6D6D6D" }}
            >
              <Text>·</Text>
              <Text>如有任何问题请联系专柜咨询。</Text>
            </View>
          </View>
          {data?.status === "0" ? (
            <>
              <View className="w-full flex justify-between mt-60">
                <View
                  className="text-26 w-288 h-80 vhCenter borderBlack rotate_360"
                  onClick={onCancel}
                >
                  取消预约
                </View>
                <View
                  className="text-26 w-288 h-80 vhCenter borderBlack rotate_360"
                  onClick={onModity}
                >
                  修改预约
                </View>
              </View>
            </>
          ) : null}
        </View>
      </View>
      {/* 服务预约弹窗 */}
      {visible && (
        <ServiceBox
          initData={data}
          close={closePop}
          callback={getDetail}
          modifyTime={reason?.modify}
        ></ServiceBox>
      )}
    </>
  );
};
export default Index;
definePageConfig({
  navigationStyle: "custom",
  enableShareAppMessage: true,
});
