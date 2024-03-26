import { Text, View } from "@tarojs/components";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { useAsyncEffect, useBoolean, useMemoizedFn, useRequest } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import api from "@/src/api";
import CHeader from "@/src/components/Common/CHeader";
import CImage from "@/src/components/Common/CImage";
import CQRCodeCustom from "@/src/components/Common/CQRCodeCustom";
import { setShareParams } from "@/src/utils";
import to from "@/src/utils/to";
import toast from "@/src/utils/toast";
import useProject from "../hooks/useProject";
import ServiceBox from "../components/ServiceBox";

const app: App.GlobalData = Taro.getApp();
const Index = () => {
  const router = useRouter();
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const { project, num = 0 } = useProject();
  const [reason,setReason] = useState(null)

  useEffect(()=>{
    if(project?.reason){
      console.log('projetc',JSON.parse(project.reason));
      setReason(JSON.parse(project.reason))
    }
  },[project])

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
        return "已失效";
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
  const onCancel = async () => {
    if (reason?.cancel && dayjs(beginTime).subtract(reason.cancel, "hour").valueOf() < Date.now()) {
      return toast(`服务开始前${reason.cancel}小时不可取消`);
    }
    Taro.showModal({
      title: "温馨提示",
      content: `亲爱的NARS会员\r\n您确认取消以下服务吗?\r\n${data?.projectName}\r\n${data?.storeName}\r\n${data?.serviceTime}`,
      success: async (res) => {
        // 点击确定的时候取消服务预约
        if (res.confirm) {
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
    if (reason?.modify && dayjs(beginTime).subtract(reason.modify, "hour").valueOf() < Date.now()) {
      return toast(`服务开始前${reason.modify}小时不可修改`);
    }
    setTrue();
    cancel();
  });

  const closePop = useMemoizedFn(() => {
    getDetail();
    setFalse();
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
        <View className="w-680 ml-35 mt-40 px-34 vhCenter flex-col box-border bg-white pb-40">
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
          <View className="text-22 mt-30 w-full pl-150 box-border text-right leading-30">
            {detail?.address?.address}
          </View>
          <View className="w-full h-1 bg-black mt-50"></View>
          <View className="w-full">
            <View className="text-26 mt-37">使用规则</View>
            <View
              className="text-22 leading-35 mt-23"
              style={{ color: "#6D6D6D" }}
            >
              规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情规则详情
            </View>
          </View>
          {data?.status === "0" ? (
            <>
              <View className="w-full flex justify-between mt-100">
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
              <View
                className="mt-77 text-center text-20"
                style={{ color: "#717171" }}
              >
                *服务开始前12小时不可修改和取消
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
